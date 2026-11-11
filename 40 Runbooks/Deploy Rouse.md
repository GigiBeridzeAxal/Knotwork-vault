---
type: runbook
status: active
created: 2026-11-11
updated: 2026-11-11
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

## Later
Phase 1 adds the D1 database and secrets. Steps are in the repo README and in `wrangler.jsonc`.
