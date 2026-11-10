---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-10
tags: [runbook]
system: "[[Knotwork]]"
---
# Deploy Knotwork

Since 2026-11-10 Knotwork deploys itself: merging a PR into `main` is the deploy. Deploying to production always needs Gigi's go-ahead ([[Working agreements]]), so a merge into `main` needs it too.

## Automatic (the normal way)
- Set up under Workers & Pages > knotwork > Settings > Builds: repository `GigiBeridzeAxal/knotwork`, production branch `main`, build `npm run build`, deploy `npx wrangler deploy`, non-production branches `npx wrangler versions upload`, root `/`, no build variables, build caching off. It uses the "Workers Builds" API token Cloudflare made; the Worker's secrets stay as they are.
- A PR gets a "Workers Builds: knotwork" check with a preview version that takes no traffic. Merge only when that and both CI jobs are green.
- After the merge the build takes about 35 seconds. Confirm with https://knotwork.gigiberidze.com/api/health: `commit` is the first 12 characters of the merged commit, `version` is the one in `package.json`.
- Cloudflare starts a build only on a push; the dashboard has no "run now" button for a connected repo.
- Cloud sessions can't open the live site. Check it through Gigi's browser, or read the "API answers" line in the Live check workflow's log.
- First automatic deploy: 2026-11-10, commit `ea05146`, version `275aa5ae`.

## By hand (fallback)
Only when Builds is broken or for an emergency, from Gigi's PC.

> [!warning] Claude's auto mode on Gigi's PC blocks npm and npx ("Code from External"), writing secrets ("Secret-Store Writes") and switching on settings that open access ("Security Weaken"). Switch that session to **Ask permissions**, or Gigi runs those steps themselves.

## With accounts (PR #3 onward)
For a normal code change, one line is enough: `cd C:\Users\PC\Downloads\knotwork; git pull --ff-only; npm run deploy`. Steps 2 to 4 are only for a new secret, a new index or a risky change.

1. `cd C:\Users\PC\Downloads\knotwork`, `git pull`, `npm ci`, `npm run build`.
2. **Secrets, once** (already set 2026-11-09). In PowerShell, without printing them:
   - `(Get-Content ..\knotwork-secrets\mongodb.env -TotalCount 1).Substring(12) | npx wrangler versions secret put MONGODB_URI`
   - `Get-Content ..\knotwork-secrets\auth-pepper.txt -Raw | npx wrangler versions secret put AUTH_PEPPER`
   - `versions secret put` makes a new version without deploying it. Plain `wrangler secret put` deploys, so don't use it.
3. **Database:** `npm run db:setup` with `MONGODB_URI`, `AUTH_PEPPER` and `DNS_SERVERS=1.1.1.1` set in the same shell. It creates the indexes and re-keys old webhook URLs. It must use the same `AUTH_PEPPER` as the Worker.
4. **Preview first:** `npx wrangler versions upload --message "<what>"`. A preview address only exists while Workers & Pages > knotwork > Domains > Preview is on; switch it off again after testing.
5. **Deploy (with Gigi's OK):** `npm run deploy`, or `npx wrangler versions deploy <version-id>`.
6. Check https://knotwork.gigiberidze.com: sign up, log in, the demo, a workflow run. Then `npx wrangler deployments status`.
7. Add a line to [[Changelog]] with the version id.

## Watch and roll back
- After a risky deploy, watch for an hour: `npx wrangler tail --format json` into a file outside the repo, then compare CPU per event with the limits (Worker 10 ms; the hub Durable Object 30 s).
- Roll back when the Worker goes over its CPU limit, 5xx responses pass 1%, or runs stop moving: `npx wrangler rollback <version-id>`. This only works between versions that both have the hub, so `b4f019c1` (2026-11-09) is the oldest version you can roll back to. Cloudflare refuses a rollback across a Durable Object migration, so the versions from before accounts (`90721a08`) are out of reach.
- If the hub itself is the problem: `npm run build`, then `npx wrangler deploy --var HUB_OFF:1`. The site then runs without the hub (about 2 s slower per request) until a fix is deployed.
- If the hub's free daily limit runs out (100,000 requests or 13,000 GB-s), `/api/` and `/hooks/` answer 503 until 00:00 UTC. Usage is under Workers & Pages > Durable Objects.
- Send Gigi one command per message. Two commands in one message got the wrong one run on 2026-11-09.
- Claude's auto mode on Gigi's PC also blocks `wrangler deploy` and `wrangler rollback` ("Production Deploy"), so Gigi runs them.
- Traffic to preview URLs doesn't show up in `wrangler tail`, so CPU can only be measured on the deployed version.

The four rate-limit bindings (namespace ids 1001 to 1004) are in `wrangler.jsonc` and need no setup. The WAF rule is described in [[Cloudflare]].

## Before PR #3 (D1)
Only if there's a new migration: `npx wrangler d1 migrations apply knotwork --remote`, then `npm run deploy`.

Long-term fix: connect Workers & Pages > knotwork > Settings > Builds to the GitHub repo.
