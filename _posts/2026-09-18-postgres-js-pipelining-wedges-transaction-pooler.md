---
layout: post
title:  "When postgres-js pipelining silently wedges your connection pool behind a transaction pooler"
date:   2026-09-18 20:00:00 +0700
categories: [postgres, nodejs]
---

This is one of those bugs that only happens under load: Node.js apps suddenly stop answering
every database query, forever, until the container is restarted. No error, no timeout, just a pool of connections that never comes back.

The stack: [postgres-js](https://github.com/porsager/postgres) (via Drizzle ORM) talking to Postgres through a **transaction-mode pooler**
(Supavisor/PgBouncer style, the one usually on port `6543`).

### The root cause: pipelining + transaction pooling

`postgres-js` pipelines queries by default (`max_pipeline: 100`). Behind a transaction pooler you must also set `prepare: false`,
because prepared statements can't survive a backend being swapped between transactions.

With that combination, this sequence breaks:

1. A parameter-free query is sent.
2. A parameterised query is sent 0 ms later on the same connection.
3. The driver pipelines `Parse + Describe + Flush` for the second query right behind the first query's `ReadyForQuery`.
4. The pooler sees the first transaction finish, **releases the backend**, and the `Describe` reply is lost.
5. The client waits forever for a reply that will never come.

Do that a few times and every slot in the pool (e.g. 5) is stuck. The process is effectively dead.

### Reproduce it first

Before touching config, write a tiny "burst" script that fires a mix of parameterised and parameter-free queries concurrently,
then runs one more query after the burst:

```
# max_pipeline = 100 (default)
mixed burst → 11/100 ok, post-burst query: TIMEOUT (pool wedged)

# max_pipeline = 0
mixed burst → 300/300 ok, post-burst query ok
```

A 30-second repro makes every later step (and every reviewer) much more confident.

### Fix #1: disable pipelining

```ts
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, {
  prepare: false,   // required for transaction-mode poolers
  max_pipeline: 0,  // never pipeline: avoids the lost-Describe wedge
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
});
```

### Fix #2: ...which broke transactions

Here is the plot twist. With `max_pipeline: 0`, `sql.begin()` / `db.transaction()` can stop working correctly:
the internal hook that reserves a connection for the transaction is short-circuited, so `BEGIN` is never really issued and
the connection goes back to the pool **inside an open transaction**. Every later write on that slot is silently uncommitted.

That is far worse than a hang. The fix is a second, small pool dedicated to transactions, with default pipelining:

```ts
// Normal queries: no pipelining.
export const db = drizzle(postgres(url, { prepare: false, max_pipeline: 0, max: 5 }));

// Transactions: the reserved connection is serial, so pipelining can't wedge it.
export const dbTx = drizzle(postgres(url, { prepare: false, max: 2 }));

await dbTx.transaction(async (tx) => {
  // ...
});
```

Add real-DB integration tests for commit, rollback-on-throw and rollback-on-SQL-error, plus a check that no backend is left
`idle in transaction` after the suite.

### Fix #3: startup parameters are ignored by the pooler

As a safety net, you may want Postgres to kill any session stuck `idle in transaction`. Setting it in the driver doesn't work:

```ts
postgres(url, { connection: { idle_in_transaction_session_timeout: 60000 } }); // silently ignored by the pooler
```

Transaction poolers don't forward client startup parameters. The setting has to live on the role:

```sql
ALTER ROLE app_user SET idle_in_transaction_session_timeout = '60s';

-- verify (applies to NEW sessions only)
SELECT setting FROM pg_db_role_setting
WHERE setrole = 'app_user'::regrole;
```

Remember it affects every session of that role, including your own `psql` sessions. That's the trade-off:
silent data loss becomes a loud error.

### Bonus: Next.js middleware on the edge runtime

One more hang turned up during verification: a Next.js `middleware.ts` imported the DB module. The edge runtime has no TCP sockets,
so each request grabbed a pool slot that never connected. After 5 requests the app hung for everyone. One line fixed it:

```ts
export const config = { runtime: "nodejs", matcher: [/* ... */] };
```

### Takeaways

- If you run postgres-js behind a transaction pooler, use `prepare: false` **and** think hard about `max_pipeline`.
- After changing a driver option, re-test transactions explicitly. "Queries work" ≠ "transactions commit".
- Pooler-level settings (`idle_in_transaction_session_timeout`, `statement_timeout`) belong on the role, not the connection string.
- Add a DB health endpoint that runs a real query with a short `statement_timeout`; a wedged pool then shows as a `503` instead of a silent hang.
- Name your connections (`application_name`) so `pg_stat_activity` tells you which app is stuck.
