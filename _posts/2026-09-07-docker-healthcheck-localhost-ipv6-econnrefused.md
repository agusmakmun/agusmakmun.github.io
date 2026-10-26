---
layout: post
title:  "Docker health check fails with ECONNREFUSED on localhost? Use 127.0.0.1"
date:   2026-09-07 20:00:00 +0700
categories: [docker, nodejs]
---

A short one, but it can cause failed rollouts.

During deploys, new containers keep failing their health check and the old containers stay running, even though
the app inside the new container is clearly up. A typical health check looks like this:

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 30s
```

### Why it fails

Since **Node.js 17**, DNS results are no longer reordered to put IPv4 first. Inside many containers, `localhost` resolves to
`::1` (IPv6) first. If the server only listens on IPv4 (`0.0.0.0`), the health check connects to `::1` and gets
`ECONNREFUSED`.

The same trap applies to other tools inside the container (`wget`, Python's `urllib`) depending on how `localhost` resolves there.

### The fix

Don't ask DNS. Use the IPv4 loopback directly:

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
  start_period: 60s
```

Alternatives if you prefer:

- Make the server listen on both stacks (`::`), or
- Run Node with `--dns-result-order=ipv4first`.

But `127.0.0.1` is the smallest change, and it is explicit.

### How to verify

Exec into the running container and hit both:

```bash
docker exec -it <container> sh
wget -qO- http://127.0.0.1:3000/health   # works
wget -qO- http://localhost:3000/health   # may fail with "Connection refused"
```

Also consider raising `start_period`. If your entrypoint does extra work at boot (for example replacing placeholders in a
built bundle), a short `start_period` will mark a healthy-but-slow container as unhealthy.

### Takeaway

In health checks, use `127.0.0.1`, not `localhost`. Apply it to every compose file at once; this bug will be in all of them.
