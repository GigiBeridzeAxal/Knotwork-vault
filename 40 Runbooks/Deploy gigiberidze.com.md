---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook]
system: "[[gigiberidze.com]]"
---
# Deploy gigiberidze.com


Deploys are automatic. To ship a change:

1. Open a PR against `main`. The *Workers Builds: gigiberidze* check builds a preview.
2. When the preview check is green and the change is tested, squash-merge. Agents may do this without asking ([[Working agreements]]).
3. Workers Builds runs `npm run build` and `npx wrangler deploy`. It's live within a few minutes.
4. Check the build in Cloudflare > Workers & Pages > gigiberidze > Deployments (through Gigi's Chrome).
5. Add a line to [[Changelog]].

If the preview check fails instantly: [[Fix red preview build]].

