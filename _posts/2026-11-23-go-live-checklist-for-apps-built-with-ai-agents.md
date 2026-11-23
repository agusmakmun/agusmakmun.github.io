---
layout: post
title:  "Is your AI-built app ready to go live? A go-live checklist, and how to make the agent audit itself"
date:   2026-11-23 12:00:00 +0700
categories: [security, devops, architecture]
---

AI coding agents are very good at producing an app that *looks* finished. Signup works, the dashboard loads, the demo
goes well. What you don't see from the demo is the secret key in the browser bundle, the API route that never checks
who is asking, or the database table anyone can read with the public key.

My feed is full of "20 things to check before you launch" videos, and most of their advice is good. But each one
covers a slice: one is about security, one about domains and email, one about legal, one about SEO. None of them puts
the steps in the order you actually do them. So I merged them, filled the gaps I've hit on real projects, and put the
result in one repo:

**[github.com/agusmakmun/web-app-checklist](https://github.com/agusmakmun/web-app-checklist)**

This post explains how it's organized, the items that cause the most damage when they're missed, and the prompt I use
to make an agent audit a codebase against it.

### Order matters: code first, domain later

Most short checklists start with "buy a domain, set up DNS". That's the wrong place to start. Most of the expensive
mistakes are made while you're still in the editor, and DNS is a 10-minute job once the app works. So the checklist
follows the order you actually work in:

| Part | Phases |
|---|---|
| **0. Before you code** | Plan & ownership, working safely with AI agents |
| **A. Build** | Secrets, auth & RBAC, input handling, business logic & payments, database, AI/LLM risks, dependencies, code quality, product essentials, UX |
| **B. Deploy** | Domain & DNS, cloud account hardening, hosting & serving, HTTPS & headers, email, performance, observability |
| **C. Pre-launch** | Release safety, support & abuse, legal, SEO / AEO / GEO |
| **Launch & after** | Launch day runbook, first 72 hours, first 30 days |

Every item is tagged 🔴 **BLOCKER** (don't launch without it), 🟡 **SHOULD** (fix in week one) or 🟢 **NICE**. And
one rule applies to all of them: an item is only checked when you've verified it with a command, a test or a
screenshot. "The agent said it's done" doesn't count.

### The items that bite hardest

There are about 250 items. These are the ones I see missed most often in AI-built apps, and the ones that do the most
damage when they are.

**1. Secret keys shipped to the browser.** Any env var with `NEXT_PUBLIC_`, `VITE_`, `REACT_APP_` or `EXPO_PUBLIC_`
is compiled into the client bundle, so anyone can read it. Agents add the prefix when something "doesn't work on the
client", and the Stripe secret key or OpenAI key quietly ships to every visitor. Only publishable keys belong there.

**2. Not knowing who talks to your database.** There are two cases, and the check differs:

- **The browser talks to the DB directly** (Supabase, Firebase, PostgREST, Hasura, PocketBase). Row Level Security or
  Security Rules must be on for every table. Without them, the public key gives read and write access to everything.
- **Only your backend talks to the DB** (self-hosted or managed Postgres behind your own API, which is where we ended
  up after [moving off Supabase]({% post_url 2026-10-24-migrating-off-supabase-to-drizzle-and-nextauth %})). Then
  authorization lives in your API, and the DB must not be reachable from the internet. On a VPS, that means not
  publishing `5432:5432` in Docker Compose, and no `trust` lines in `pg_hba.conf`.

**3. Authorization that lives in the UI.** Hiding the "Delete" button isn't access control. The checklist asks for a
permission matrix (roles × actions) before you write code, then RBAC enforced in **one** server-side policy layer,
**deny by default**, with a test for each cell of the matrix. Also log in as user A and request user B's
`/api/invoices/123`. If that works, nothing else matters.

**4. Paid access granted from the success page.** Anyone can open `/checkout/success`. Grant access only from a
verified payment webhook, and make it idempotent, because webhooks get delivered more than once and users
double-click. Compute prices on the server; never trust a `price` field from the client.

**5. The CDN caching private pages.** One wrong `Cache-Control` header and user A's dashboard is served to user B.
Authenticated responses need `private, no-store`. The test takes ten seconds: load a logged-in page, then request the
same URL with `curl` and no cookies.

**6. Denial of wallet.** A leaked key, a bot, or an infinite loop calling an LLM can run up a four- or five-figure bill
overnight. Set billing alerts and spend limits on *every* provider, and per-user quotas on any endpoint that calls a
paid API.

**7. Launch-day email.** The built-in auth email senders of Supabase, Firebase and similar services are rate-limited
and meant for testing, so on launch day verification emails stop arriving. Use a real provider, with SPF, DKIM and
DMARC on separate subdomains: `mail.` for transactional email, `news.` for marketing. Then when marketing email gets
spam complaints, password resets still reach the inbox.

**8. A health check that causes outages.** If your liveness endpoint checks the database, a short DB blip makes the
orchestrator restart *every* instance at once. Liveness (`/healthz` or `/health`, the name doesn't matter, just be
consistent) only says the process is up. A separate readiness check (`/readyz`) tests dependencies and takes the
instance out of rotation instead of killing it.

**9. Backups you've never restored.** A backup you've never restored is only a hope. Restore into a scratch DB, point
the app at it, and write down how long it took. That number is your real recovery time. Also back up uploaded files,
since a DB dump doesn't include the S3 objects it points to.

### Working with the agent, not just after it

The checklist also has a phase for the agent itself, because some of the worst incidents start there:

- **The agent never has production credentials.** Use dev keys and a dev database.
- **Commit before every agent session**, so you can always undo.
- **Review every diff** that touches auth, payments, migrations or deletes.
- **Put your security rules in the agent's rules file** (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`), for example:
  "always scope queries by `owner_id`", "never put secrets in `NEXT_PUBLIC_*`", "validate every input with Zod". The
  agent then applies them in every session instead of only when you remember to ask.
- **Vet the MCP servers and plugins you install.** They run with your permissions.
- **Check new dependencies exist and are the ones you meant.** Agents sometimes invent package names, and attackers
  register those names.

### Make the agent audit itself

Here the agent is useful again. Copy the checklist into your project as `LAUNCH_CHECKLIST.md` and run this from the
project root:

```text
You are a senior security engineer doing a pre-launch audit of this codebase.
Go through LAUNCH_CHECKLIST.md phase by phase. For EVERY item:
  1. Search the code/config for evidence (cite file:line).
  2. Mark it PASS / FAIL / NOT APPLICABLE / CANNOT VERIFY (needs infra access).
  3. For FAIL, explain the concrete risk and propose the minimal fix.
Do not mark anything PASS without evidence. Do not modify code yet.
Output a table sorted by priority: BLOCKER failures first.
```

Two details make this work. "Cite file:line" stops the agent from passing items on vibes, because an item with no
evidence becomes a FAIL or CANNOT VERIFY. "Do not modify code yet" keeps the audit separate from the fixes. Then fix
the failures **one at a time**, each with a regression test. A single "fix everything" prompt tends to fix five things
and break three others.

The README also has a verification cheat sheet with `curl` checks for HTTPS and headers, exposed `.env`/`.git` files,
CORS, rate limits, `dig` for SPF/DMARC, gitleaks over the full git history, and checks that your DB port is closed.
Run these against the deployed app, not just the code.

### What it deliberately leaves out

It targets a typical web app, SaaS or mobile backend. It doesn't cover regulated or enterprise requirements: HIPAA,
storing card data yourself (anything beyond letting Stripe handle it), SOC 2 or ISO 27001, SAML SSO, SCIM, or data
residency. If those apply to you, you need more than a checklist. It also can't know your framework's specific
settings, and that's where the audit prompt helps, because it runs against your actual code.

### Takeaways

- AI agents make shipping fast. They don't make it safe. Verify everything; trust nothing that has no evidence.
- Start the checklist in the codebase, not at the DNS panel. The expensive mistakes happen while you're coding.
- Most real breaches in AI-built apps are boring: keys in the bundle, no RLS, missing ownership checks.
- Put the rules where the agent reads them every session, then make the agent prove each item with `file:line`.
- Don't launch on a Friday. Launch when you can watch it for the next 48 hours.

The full checklist, with references to the OWASP cheat sheets and the other sources behind each item, is at
[agusmakmun/web-app-checklist](https://github.com/agusmakmun/web-app-checklist). PRs are welcome if you've been
bitten by something it doesn't cover.
