---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-25
tags: [runbook]
system: "[[gigiberidze.com]]"
---
# Fix red preview build


Symptom: the *Workers Builds: gigiberidze* check on a PR goes red in about 0 seconds, even though the Next.js build passes.

1. Read the Cloudflare build log first (Workers & Pages > gigiberidze > Deployments > the failed build), through Gigi's Chrome. Don't assume the code is at fault.
2. Most likely cause: `wrangler.jsonc` lost its `"previews": {}` block. `npx wrangler preview` needs it. Put it back.
3. Push and watch the check.
4. A Worker with vars, bindings or a Durable Object needs more than an empty block, because a Preview inherits none of them. The failed build log prints the block it wants. Repeat inside `previews`: `vars`, the Durable Object binding (the class and the migration stay at the top level), and each rate limiter with its own `namespace_id`. Cron triggers and routes do not apply to a Preview. Seen 2026-11-25 on the lead 2 demo site: build and install passed, the deploy step stopped with "Your Wrangler configuration needs a `previews` block".
5. A Preview has no address unless `preview_urls` is on or the route has `previews_enabled`. Without one, a green branch build only proves that the branch builds and uploads.
