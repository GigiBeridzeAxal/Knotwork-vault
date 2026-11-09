---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook]
system: "[[Knotwork]]"
---
# Deploy Knotwork

Knotwork is **not** on Workers Builds yet, so deploy by hand from Gigi's PC. Deploying to production always needs Gigi's go-ahead ([[Working agreements]]).

> [!warning] Claude's auto mode on Gigi's PC blocks npm and npx ("Code from External"), writing secrets ("Secret-Store Writes") and switching on settings that open access ("Security Weaken"). Switch that session to **Ask permissions**, or Gigi runs those steps themselves.

## With accounts (PR #3 onward)
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

The four rate-limit bindings (namespace ids 1001 to 1004) are in `wrangler.jsonc` and need no setup. The WAF rule is described in [[Cloudflare]].

## Before PR #3 (D1)
Only if there's a new migration: `npx wrangler d1 migrations apply knotwork --remote`, then `npm run deploy`.

Long-term fix: connect Workers & Pages > knotwork > Settings > Builds to the GitHub repo.
