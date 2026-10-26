---
layout: post
title:  "Migrating a production app off Supabase to self-hosted Postgres, Drizzle ORM and NextAuth, in stages"
date:   2026-10-24 20:00:00 +0700
categories: [postgres, nextjs, architecture]
---

This post is about moving a Next.js application off Supabase (database + auth + realtime + storage + database webhooks)
to a self-hosted Postgres, [Drizzle ORM](https://orm.drizzle.team/), [NextAuth.js](https://next-auth.js.org/) and S3-compatible object storage.

It is not "Supabase is bad". It is about doing a big data-layer migration on a live product without a freeze.

### Stage 1: a coexistence layer, controlled by one env var

The core idea: every query keeps its function signature and branches internally.

```ts
// packages/database/db.ts
export const db = process.env.DATABASE_URL
  ? drizzle(postgres(process.env.DATABASE_URL, { prepare: false, max: 5 }))
  : null;

// any service
export async function getBrand(id: string) {
  if (db) {
    const [row] = await db.select().from(brands).where(eq(brands.id, id));
    return row ?? null;
  }
  const { data } = await supabase.from("brands").select("*").eq("id", id).single();
  return data;
}
```

With `DATABASE_URL` unset, production behaves byte-for-byte the same. Each environment can be flipped (and flipped back) independently.

Two details that saved a lot of time:

- **Introspect the schema in snake_case**, so Drizzle's inferred types match the old generated row types 1:1. No mapping code.
- **Pin `DATABASE_URL=""` in all test configs**, so old tests can't silently run on the new path.

Also add a CI "schema smoke" job: migrate a fresh DB, then select every column defined in the Drizzle schema with `LIMIT 0`.
Any drift between migrations and the ORM schema fails CI immediately.

### The trap: you just lost Row Level Security

Supabase queries from the browser are protected by RLS. The new Drizzle connection runs as the table **owner**, so RLS doesn't apply.
A query that was safe yesterday is an IDOR today.

The rule to follow:

- Service-role queries: safe to swap as-is.
- Queries that relied on RLS: only migrate them with an **explicit authorization predicate** in the `WHERE`, using the verified
  session user id. Reuse the existing policy helper functions so the logic stays identical:

```ts
await db.select().from(documents).where(
  and(
    eq(documents.id, id),
    sql`public.can_view_document(${documents.id}, ${session.user.id})`,
  ),
);
```

Tests assert the predicate is present, so removing it fails the build. Even so, plan dedicated security audit passes before the
production cutover; they will find missing ownership checks. Budget for that, it's the most valuable part of a migration like this.

A related finding: functions declared `SECURITY DEFINER` are executable by `PUBLIC` by default. On Supabase the anonymous role
inherits that, and the anon key is public. If a definer function takes a caller-supplied id and mutates data, that's a hole:

```sql
REVOKE EXECUTE ON FUNCTION public.some_action(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.some_action(uuid) TO authenticated, service_role;
```

Audit with `has_function_privilege('anon', oid, 'EXECUTE')` and add an integration test so a future change can't reopen it.

### Stage 2: auth, in dual mode

Auth followed the same pattern: an `AUTH_PROVIDER` flag, with both providers working side by side. Lessons:

- Anything the **browser** did directly against Supabase (queries, realtime subscriptions) must move behind your own server API
  routes. This is usually the bulk of the work.
- Environment checks inside client bundles can be removed by the bundler's dead-code elimination; validate env vars through a
  typed env object and test both modes in a real build.
- OAuth redirects behind a proxy: build the callback URL from the request headers, not from `localhost` defaults.
- Realtime: replace it with something you own (e.g. Redis pub/sub + Server-Sent Events), or plain polling where that's enough.

### File storage: moving objects to S3-compatible storage

Supabase Storage is just another dependency to move out, usually to any S3-compatible object storage behind a small
upload/download service you own. The same coexistence idea applies:

- **Write new files to the new storage first**, behind a flag (e.g. `USE_NEW_STORAGE_API=true`). Existing files keep working
  from the old URLs, so there's no big-bang moment.
- **Copy the old objects** with a one-off script that walks the old buckets and uploads each object to the same key in the new
  bucket. Make it idempotent and resumable (skip objects that already exist with the same size), because it *will* be interrupted.
- **Old URLs are stored in your data.** Database rows, rich-text messages and emails already sent all contain full URLs pointing
  at the old storage host. Rewriting all of them is risky, so put a tiny redirect service on the old asset path that 301s to the
  new location, and keep it running long after the migration.
- **Verify before deleting.** List both sides and compare keys, then do a byte-level check (size + checksum) before removing the
  old buckets. Keep them for a grace period (a few weeks) anyway; deleted objects can't be re-synced.
- **Clean up the allow-lists.** Image proxies, `next.config.js` `images.remotePatterns` and CSP rules all list storage hosts.
  Remove the old ones only after you've counted how many records still reference them.

One security trap, same as with the database: with Supabase Storage, the bucket policies (RLS on `storage.objects`) decided who
could delete what. A self-hosted upload service usually talks to the bucket with a single admin key, so a "delete" endpoint that
forwards a caller-supplied key lets **any** logged-in user delete **any** object. Validate keys on the server:

```ts
function assertDeletableKey(key: string, userId: string) {
  if (key.includes("..") || key.startsWith("/")) throw new Error("invalid key");
  if (!key.startsWith(`uploads/${userId}/`)) throw new Error("forbidden"); // or check ownership in the DB
}
```

Also watch the client side: if an upload component stores a `blob:` preview URL before the real upload resolves (a classic
React state/ref timing bug), that `blob:` URL ends up in your database and the file is effectively lost. Make sure only
the URL returned by the upload response is ever saved, and add a check like `SELECT ... WHERE url LIKE 'blob:%'` after deploys.

### Database webhooks: from `pg_net` to a transactional outbox

Supabase Database Webhooks are triggers that call `pg_net` to POST `{ type, table, record, old_record }` to your endpoint
whenever a row changes. A plain self-hosted Postgres doesn't have `pg_net` (and you probably don't want HTTP calls made from
inside the database anyway), so these silently stop firing after the cutover. Nothing errors; emails and notifications just
never go out. List them before you migrate:

```sql
SELECT event_object_table, trigger_name, action_statement
FROM information_schema.triggers
WHERE action_statement ILIKE '%http_request%' OR action_statement ILIKE '%net.http%';
```

A good replacement is the **transactional outbox** pattern. The trigger only inserts a row into an outbox table, in the same
transaction as the change, so an event is recorded if and only if the change commits:

```sql
CREATE TABLE webhook_outbox (
  id           bigserial PRIMARY KEY,
  table_name   text NOT NULL,
  type         text NOT NULL,              -- INSERT / UPDATE / DELETE
  record       jsonb,
  old_record   jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  attempts     int NOT NULL DEFAULT 0,
  delivered_at timestamptz
);

CREATE OR REPLACE FUNCTION enqueue_webhook() RETURNS trigger AS $$
BEGIN
  INSERT INTO webhook_outbox (table_name, type, record, old_record)
  VALUES (
    TG_TABLE_NAME, TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END
  );
  RETURN NULL;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER messages_outbox
AFTER INSERT OR UPDATE ON messages
FOR EACH ROW EXECUTE FUNCTION enqueue_webhook();
```

Then a worker (in your existing job queue) picks up undelivered rows, POSTs them, and marks them delivered:

```sql
SELECT * FROM webhook_outbox
WHERE delivered_at IS NULL AND attempts < 10
ORDER BY id
LIMIT 50
FOR UPDATE SKIP LOCKED;   -- several workers can run safely
```

Some tips:

- **Keep the payload shape identical** (`type`, `table`, `record`, `old_record`), so the existing receiving endpoint doesn't change
  at all. Only the sender changes.
- **Sign or authenticate the request** with a shared secret, and rename it (e.g. from a Supabase-named variable to an
  outbox-named one) without a silent fallback, so a missing secret fails loudly instead of accepting unauthenticated calls.
- **Put the dispatcher behind a flag** (e.g. `WEBHOOK_OUTBOX_DISPATCH_ENABLED`) so you can turn it on per environment and avoid
  double delivery while the old webhooks are still active.
- **Delivery is at-least-once.** Retries can send the same event twice, so make the receiver idempotent (e.g. dedupe on the
  outbox `id`).
- **Prune delivered rows** on a schedule, or the outbox table becomes your biggest table.

Outgoing webhooks to third parties are worth checking too: if the ORM schema is missing a `NOT NULL` column on a delivery-log
table, every delivery insert fails at runtime. The CI schema smoke test from Stage 1 catches that class of bug early.

### Stage 3: the cutover

The data move itself is dump → restore → flip env vars. Things to watch for:

- **Do the final sync.** If the final sync step is skipped, the cutover silently goes live on the rehearsal snapshot.
  Put an explicit "row counts match source" gate in the runbook before flipping anything.
- **Migration ledgers.** A restored dump has all tables but your own migration tracking table may be empty, and a good migrate
  script will refuse to replay everything. One fix is to seed your ledger from the platform's migration history table in the dump.
- **Sync scripts strip things.** A sync script may remove RLS and GRANT/REVOKE statements; if the ledger is then stamped as
  "applied", the migrations that re-add them are skipped. A deep staging-vs-prod schema diff (constraints, functions, grants,
  not just table names) finds the drift; an idempotent "parity" migration fixes it.
- **Restores can drop foreign keys** that pointed to the old auth schema. Re-add them as `NOT VALID` (cheap lock, enforces new
  writes), cleaned orphans, then `VALIDATE CONSTRAINT` separately.

### Takeaways

- Coexistence behind a flag beats a big-bang rewrite. Every step stays reversible.
- Moving from RLS to app-level authorization is a **security project**, not a refactor. Treat it like one.
- Write the runbook before the cutover, rehearse it on staging, and add verification gates between steps.
- After the cutover, diff schemas between environments properly. "Same tables" is not "same schema".
- Finish the job: removing the old integration (code, env vars, dead pages) is what actually reduces complexity.
