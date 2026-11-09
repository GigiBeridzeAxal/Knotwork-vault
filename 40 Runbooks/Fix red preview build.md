---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook]
system: "[[gigiberidze.com]]"
---
# Fix red preview build


Symptom: the *Workers Builds: gigiberidze* check on a PR goes red in about 0 seconds, even though the Next.js build passes.

1. Read the Cloudflare build log first (Workers & Pages > gigiberidze > Deployments > the failed build), through Gigi's Chrome. Don't assume the code is at fault.
2. Most likely cause: `wrangler.jsonc` lost its `"previews": {}` block. `npx wrangler preview` needs it. Put it back.
3. Push and watch the check.

