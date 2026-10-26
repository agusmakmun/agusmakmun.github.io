---
layout: post
title:  "Handling Next.js ChunkLoadError after a deploy without an infinite reload loop"
date:   2026-07-10 20:00:00 +0700
categories: [nextjs, javascript, react]
---

After a deploy, an error tracker often receives a small burst of `ChunkLoadError`s. The cause is classic:

1. A user has the app open (or a cached page) built by the **old** deployment.
2. They navigate somewhere that lazy-loads a chunk, e.g. `/_next/static/chunks/abc123.js`.
3. The new deployment doesn't have `abc123.js` anymore. The import fails and the user sees the error screen.

The fix everybody suggests is "just reload the page". The interesting part is doing it **safely**.

### The naive version loops forever

```ts
if (error.name === "ChunkLoadError") window.location.reload();
```

If the deploy is genuinely broken (the chunk is missing even after a reload), this reloads forever. So we need a guard
that is remembered across the reload: `sessionStorage`.

But `sessionStorage` itself can fail. In some private-browsing modes or under strict storage policies, `getItem` or `setItem`
throws. If **reading** works but **writing** fails, a guard based on "did I set the flag?" still loops.

### Loop-safe helpers

```ts
// lib/utils/chunk-reload.ts
export const CHUNK_RELOAD_KEY = "chunk-reload-attempted";

export function hasChunkReloadFlag(): boolean {
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";
  } catch {
    return true; // can't read → behave as if we already tried
  }
}

export function setChunkReloadFlag(): boolean {
  try {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
    return true;
  } catch {
    return false; // can't persist the guard → don't reload
  }
}
```

The rule: **only reload if the guard was successfully persisted**.

### The error boundary

```tsx
// app/error.tsx
"use client";
import { useEffect } from "react";
import { hasChunkReloadFlag, setChunkReloadFlag } from "@/lib/utils/chunk-reload";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const isChunkError = error?.name === "ChunkLoadError";

  useEffect(() => {
    if (isChunkError && !hasChunkReloadFlag() && setChunkReloadFlag()) {
      window.location.reload();
      return;
    }
    // report non-chunk errors (or repeated chunk errors) to your tracker here
  }, [error, isChunkError]);

  return (
    <div>
      <p>{error?.message || "Something went wrong."}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

Note: `ChunkLoadError` is the name webpack gives the error; verify what your bundler throws if you use something else.

### Tests worth writing

- reloads on the first `ChunkLoadError`
- does **not** reload when the flag is already set
- does **not** reload when `getItem` throws
- does **not** reload when `setItem` throws (the sneaky infinite loop case)
- non-chunk errors render the normal error UI

### Takeaway

Users now silently get the new bundle after a deploy instead of a crash screen, and a truly broken deploy shows the error once
instead of hammering the server. When a fix involves `reload()`, always ask: "what makes this stop?"
