---
type: runbook
status: active
created: 2026-11-11
updated: 2026-11-12
tags: [runbook]
system: "[[Rouse]]"
---
# Deploy Rouse

Since 2026-11-11 Rouse deploys itself: every push to `main` of the private repo `GigiBeridzeAxal/rouse` is a production deploy, so it needs Gigi's go-ahead ([[Working agreements]]).

## Automatic (the normal way)
- Set up under Workers & Pages > rouse > Settings > Builds: production branch `main`, build `npm run build`, deploy `npx wrangler deploy`, root `/`, no build variables, preview builds on with `npx wrangler preview` (which is why `wrangler.jsonc` has an empty `"previews": {}` block, see [[Fix red preview build]]). It uses the existing "Workers Builds" API token.
- The Cloudflare GitHub app already had access to `rouse` when it was connected, so no GitHub change was needed.
- A build takes about 30 seconds. Check https://rouse.gigiberidze.com/api/health: `version` comes from `package.json`, `commit` from Cloudflare's `WORKERS_CI_COMMIT_SHA`. The first build (2026-11-11) answered `"commit":"main"`; builds from a push answer the short hash (`7cd821c76441` after PR #1, 2026-11-11).
- The custom domain `rouse.gigiberidze.com` comes from `routes` in `wrangler.jsonc`; Cloudflare made the DNS record and certificate on the first deploy. The workers.dev address is off.
- Cloud sessions can't reach the live site with curl (the proxy refuses it), but WebFetch can read it. Add a throwaway query such as `?v=<commit>`, because WebFetch caches each URL for 15 minutes.
- Pull requests get a Workers Builds comment with the build status, but Preview URLs are switched off for this Worker, so it says "No Preview URL". Turning them on is a Worker setting (Cloudflare docs: "Toggle Preview URLs").
- After a squash merge, restart the branch from `main`. Cloud sessions may refuse a force push; instead merge the old branch tip in (it has the same files as `main`) and push normally.
- First deploy: 2026-11-11, build `334398cb`, version `3befa06b`.

## Through Gigi's browser
On Gigi's devices Claude's permission mode may refuse the final **Deploy** click as a production deploy. With Gigi's message in the thread as approval it went through on the second try (2026-11-11); otherwise Gigi clicks it.

## Turn on accounts (once, with Gigi's OK)
Accounts ([[ADR-0023 Rouse accounts use email, password and recovery codes]], PR #3) need the D1 database `rouse` (created 2026-11-11, empty) to have the schema, and the Worker to have the secret `AUTH_PEPPER`. Do both **before** merging; until then the account pages answer "Accounts aren't switched on here yet" (or fail, if only the schema is missing). The landing page doesn't depend on either.
1. **Schema.** From a terminal with the repo and `npx wrangler login`: `npx wrangler d1 migrations apply rouse --remote`. Or in the dashboard: Storage & Databases > D1 > rouse > Console, paste `migrations/0001_init.sql`, then record it so Wrangler never runs it again:
   `CREATE TABLE IF NOT EXISTS d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL); INSERT INTO d1_migrations (name) VALUES ('0001_init.sql');`
   (That is the table and row Wrangler itself writes.)
2. **Secret.** Workers & Pages > rouse > Settings > Variables and Secrets > Add, type Secret, name `AUTH_PEPPER`, value 32 or more random characters (a password manager can make one). Or `npx wrangler secret put AUTH_PEPPER`. Set it once and never change it: a new value makes every password and recovery code stop working. Never write the value anywhere else.
3. **Merge** the PR; Workers Builds deploys it.
4. **Check:** `/api/health` shows the new commit; make Gigi's own account first at `/signup` (addresses aren't verified, so the first to use one gets it); then look at the CPU time per request in the Worker's metrics (sign-up should stay well under the free plan's 10 ms).

## New migrations later
Apply each new file in `migrations/` with `npx wrangler d1 migrations apply rouse --remote` **before** merging the PR that needs it. The default Workers Builds token can deploy a Worker bound to D1 but can't change the database, so builds don't apply migrations. Preview builds get neither the database nor the secret (previews don't inherit production settings).

In cloud sessions the Cloudflare connector listed and created D1 databases (2026-11-11) but answered 403 "not authorized" to queries (2026-11-12), so schema changes go through Wrangler on Gigi's machine or the dashboard.
