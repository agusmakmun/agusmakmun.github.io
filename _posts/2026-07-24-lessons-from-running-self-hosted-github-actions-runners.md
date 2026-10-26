---
layout: post
title:  "Lessons from moving CI/CD to self-hosted GitHub Actions runners"
date:   2026-07-24 20:00:00 +0700
categories: [devops, github-actions, docker]
---

When moving CI/CD from GitHub-hosted runners to a single self-hosted server with several runner instances (e.g. 3-4),
the motivation is usually simple: Actions minutes get expensive, for example when you're using a monorepo that builds several Docker images per deploy.

It works, and it's much cheaper. But the first weeks will surface a bunch of problems that GitHub-hosted runners quietly hide from you,
because every job there gets a fresh, isolated VM. On your own box, jobs share memory, disk, and the home directory.

### 1. Parallel Docker builds → OOM

Several runners on one server means several heavy Next.js `docker build`s at the same time, and the kernel OOM killer picked one at random.
The fix is to serialize the heavy builds with `needs`, and fan out only the light ones:

```yaml
jobs:
  build-admin:
    runs-on: self-hosted
  build-client:
    needs: build-admin
    if: ${{ !failure() && !cancelled() }}
  build-queue:
    needs: build-client
    if: ${{ !failure() && !cancelled() }}
  build-files:
    needs: build-client
    if: ${{ !failure() && !cancelled() }}
```

The `!failure() && !cancelled()` condition keeps later builds running when an earlier one was *skipped* (no changes),
which plain `needs` doesn't do. You may also need to raise the Node heap for the big builds
(`NODE_OPTIONS=--max-old-space-size=...`) because the default limit wasn't enough for them.

### 2. `ENOSPC` while the disk is 80% free

`pnpm install` can start failing with `ENOSPC: no space left on device`, while `df -h /` shows lots of free space
and `docker system df` looks clean. A likely culprit: `/tmp` is a separate, small `tmpfs`, and several concurrent test shards are
filling it with package-manager temp files.

**Check `df -h /tmp` first.** Then add two layers of cleanup:

- an in-job `docker system prune -f` before installs, and
- a scheduled workflow every 3 hours with **age guards** so it never deletes files from a job that is still running:

```yaml
on:
  schedule: [{ cron: "0 */3 * * *" }]
  workflow_dispatch:
jobs:
  cleanup:
    runs-on: self-hosted
    steps:
      - run: docker system prune -af --filter "until=2h"
      - run: docker volume prune -f
      - run: find /tmp -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +
```

Note that the prune is split in two. A single
`docker system prune -af --volumes --filter "until=2h"` fails at runtime because `--volumes` and `--filter`
can't be combined. A scheduled job that errors every run is a cleanup job that never cleans, so read the output of the first few runs.

### 3. Shared `~/.ssh` → a race between deploy jobs

Imagine two deploy jobs to different servers running in parallel. Both write the deploy key to `~/.ssh/id_rsa`,
and both have a cleanup step `rm -f ~/.ssh/id_rsa`. All runners on the host run as the same OS user, so one job's cleanup deleted
the key **while the other job is still deploying**, and a service fails to deploy every single time.

The proof is in the target server's auth log: a failed login appearing mid-job, at exactly the moment the other job cleaned up.

The fix: `$RUNNER_TEMP` is unique per runner instance, so the key goes there:

```yaml
- name: Setup SSH
  run: |
    echo "${{ secrets.DEPLOY_KEY }}" > "$RUNNER_TEMP/deploy_key"
    chmod 600 "$RUNNER_TEMP/deploy_key"
    echo "SSH_OPTS=-i $RUNNER_TEMP/deploy_key -o IdentitiesOnly=yes" >> "$GITHUB_ENV"

- name: Cleanup SSH
  if: always()
  run: rm -f "$RUNNER_TEMP/deploy_key"
```

`IdentitiesOnly=yes` stops SSH from trying other keys from an agent first, which also helps when the target runs fail2ban.
Speaking of which: add your runner to fail2ban's ignore list on deploy targets, or a few failed attempts will ban your own CI.

### 4. Things a hosted image had that yours doesn't

`oven-sh/setup-bun` can fail with `bun: command not found` because it extracts a zip and the runner has no `unzip`.
Similarly, `sudo apt-get install postgresql-client` inside a job is slow and needs sudo. Install these once on the host and keep a
"runner setup" doc listing every system dependency. When moving jobs, running them inside a container (`container: python:3.12`,
or the Playwright image for e2e) also removes most of these surprises.

### 5. Storage keeps growing

GitHub-hosted runners clean up after themselves; your registry and artifact storage don't:

- A daily cron that deletes Actions artifacts older than 14 days (the job needs `permissions: actions: write`).
- Coverage reports stored on the runner instead of uploaded as artifacts.
- Container registry: a garbage collection call that sends no body may only remove *unreferenced blobs* and never untagged
  manifests. Fixing the GC type, plus a script that prunes old tags before GC runs, finally made storage go down.

### 6. Transient failures

Self-hosted means occasional network blips. Wrapping the deploy step with a retry action (e.g. `nick-fields/retry`) and enabling SSH
keepalives (`ServerAliveInterval`) for long `docker pull`s turned random red builds into green ones.

### Takeaways

Self-hosted runners are worth it for the cost, but you are now operating a shared server. Assume jobs run concurrently,
isolate everything per runner (`$RUNNER_TEMP`), watch `/tmp` and memory, and schedule cleanups that are safe to run during a build.
