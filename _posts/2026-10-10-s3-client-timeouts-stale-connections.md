---
layout: post
title:  "Your S3 client needs timeouts: stale connections that hung every upload"
date:   2026-10-10 20:00:00 +0700
categories: [nodejs, aws, devops]
---

Picture this: users suddenly can't upload files. Every upload request hangs until the CDN/proxy in front gives up with an origin
timeout (e.g. Cloudflare's `524`). Meanwhile the file service's `/health` endpoint is perfectly green.

### What happens

A typical file service talks to an S3-compatible object storage using the AWS SDK v3 client, created once and reused.
After a network hiccup, the pooled keep-alive connections can go **stale**: the sockets are still "open" from Node's point of view,
but nothing comes back.

The SDK's default HTTP handler has **no request timeout**. So each upload sits on a dead socket forever, and nothing ever fails
loudly enough to get a fresh connection.

And if `/health` only returns `200 OK` without checking any dependency, the orchestrator has no reason to restart anything.

### Fix 1: timeouts on the client

```ts
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

export const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  maxAttempts: 3,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 5_000,  // TCP connect
    requestTimeout: 30_000,    // socket inactivity
  }),
});
```

Now a stuck request fails, the SDK retries, and the retry gets a fresh connection. Pick `requestTimeout` with your largest upload
part in mind; it's an inactivity timeout, not a total-duration limit.

### Fix 2: a watchdog

Timeouts handle single requests. For "the storage has been unreachable for a while", add a small in-process watchdog:
a cheap call (e.g. `HeadBucket`) on an interval, and if it fails several times in a row, the process exits and the container
restart policy brings up a clean one.

```ts
let failures = 0;
setInterval(async () => {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: process.env.S3_BUCKET }));
    failures = 0;
  } catch (err) {
    if (++failures >= 3) {
      console.error("storage unreachable, restarting", err);
      process.exit(1);
    }
  }
}, 60_000).unref();
```

Restarting is crude, but it's predictable and needed no infrastructure changes.

### Takeaways

- Every network client in production needs a connect timeout **and** a request timeout. Defaults are often "wait forever".
- A health check that doesn't touch dependencies only tells you the process is alive, not that it works.
- When users see timeouts from the CDN/proxy, check what the app was waiting on, not just whether it was running.
