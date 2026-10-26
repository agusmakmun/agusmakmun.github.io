---
layout: post
title:  "How an unread-messages badge can saturate your production Postgres CPU"
date:   2026-10-03 20:00:00 +0700
categories: [postgres, performance, react]
---

Imagine production Postgres pinned near 100% CPU, and `pg_stat_activity` showing almost every active backend running the same
thing: the function behind the **unread messages badge** in an admin dashboard.

A badge. Taking down the database.

### How it got there

```sql
SELECT pid, now() - query_start AS running, left(query, 80)
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY running DESC;
```

Usually several things multiply together, for example:

1. **Realtime is silently broken.** The deployed build has a fallback realtime URL pointing to a local development address,
   so every user's browser retries a websocket to *its own machine* forever.
2. **The fallback is aggressive.** When realtime fails, the hook polls every few seconds. The hook is mounted more than once per page
   (e.g. sidebar + messages page), in every tab, including background tabs.
3. **The query is expensive.** For admins, the count does a sequential scan over the whole messages table, costing a noticeable
   amount of CPU per call.

Users × tabs × hooks × poll frequency × query cost = a busy database.

### Fix 1: fewer calls

- Poll every 30s instead of 10s.
- Skip polls while the tab is hidden; refresh when it becomes visible.
- One in-flight request per tab, shared by every component using the hook.
- Share the latest count across tabs with `localStorage` + the `storage` event, and reuse a count fetched in the last 15s.

```ts
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshIfStale();
});

window.addEventListener("storage", (e) => {
  if (e.key !== KEY || !e.newValue) return;
  const v = safeParse(e.newValue); // shape-check: userId string, count/at finite numbers
  if (v && v.userId === userId && v.at > latest.at && v.at <= Date.now()) setLatest(v);
});
```

Shared caches have edge cases, and code review found most of them:

- Stamp each count with the **request start time** and only accept newer stamps, so a slow poll can't overwrite fresher data.
- Ignore stamps from the future (clock skew in another tab), or one tab can suppress fetching everywhere.
- Ignore counts stored for a different user.
- A "mark as read" action must force a fresh fetch, never join a poll that started before the action.
- If `localStorage` throws, fall back to a per-tab cache.

### Fix 2: cheaper calls

A partial **covering** index containing only the rows that can ever count as unread:

```sql
CREATE INDEX CONCURRENTLY idx_messages_unread_countable
  ON messages (id) INCLUDE (user_id, conversation_id)
  WHERE deleted_at IS NULL AND <countable predicate>;
```

Then rewrite the function's `WHERE` to use **exactly** the index predicate, so the planner can use an index-only scan.
The rewritten condition is logically equivalent to the old one (`A OR (NOT A AND B)` = `A OR B`), which only holds because the
column involved is `NOT NULL`; worth writing down in the migration.

Capping the count (`LIMIT 100`, show "99+") sounds tempting, but measure it: it can actually be **slower** for heavy
readers. Measure, don't guess.

### Fix 3: turn off what doesn't work

Realtime is now explicitly disabled when no realtime URL is configured, instead of falling back to a development address.
The badge relies on polling; pages that need live updates use the Server-Sent Events endpoint that already existed.

### Takeaways

- Polling cost = users × tabs × components × frequency × query cost. Reduce every factor you can.
- Fallbacks need monitoring. "Realtime failed, poll faster" is a silent amplifier.
- Background tabs shouldn't poll.
- Never ship a fallback that points to a dev/local address.
- When you add an index for a function, make sure the query's predicate matches the index predicate exactly, then confirm with `EXPLAIN`.
