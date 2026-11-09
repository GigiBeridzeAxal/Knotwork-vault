---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook]
system: "[[Knotwork]]"
---
# Deploy Knotwork


Knotwork is **not** on Workers Builds yet, so deploy by hand from Gigi's PC.

1. On Gigi's PC: `cd C:\Users\PC\Downloads\knotwork` and `git pull` on `main`.
2. Only if there's a new migration: `npx wrangler d1 migrations apply knotwork --remote`. (Remote already has 0001 and 0002.)
3. `npm run deploy`
4. Open https://knotwork.gigiberidze.com and check the landing page and `/workflows`.
5. Add a line to [[Changelog]] with the version id wrangler prints.

> [!warning] Claude desktop auto mode blocks npm and npx ("Code from External"). Switch that session to **Ask permissions** first.

Long-term fix: connect Workers & Pages > knotwork > Settings > Builds to the GitHub repo.

