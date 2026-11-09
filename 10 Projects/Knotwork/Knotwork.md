---
type: project
status: active
created: 2026-11-07
updated: 2026-11-09
tags: [project, cloudflare, portfolio]
repo: https://github.com/GigiBeridzeAxal/knotwork
url: https://knotwork.gigiberidze.com
stack: [Cloudflare Workers, Hono, D1, Cron Triggers, React, Tailwind, Vite]
---
# Knotwork

A workflow automation engine (a small n8n), and Gigi's first portfolio project for the Work section of [[gigiberidze.com]]. Tagline: *Workflows that hold.*

## Status
Live and public at https://knotwork.gigiberidze.com since 2026-11-07. v1 merged to `main` as PR #1 (squash `478d8009`, 2026-11-08). The ink and lime landing page at `/` and the app at `/workflows` were deployed 2026-11-08 (version `90721a08`).

## How it works
- **Worker**: Hono API on Cloudflare Workers, D1 database, a cron trigger every minute that runs scheduled workflows.
- **Dashboard**: React + Tailwind, built with the Cloudflare Vite plugin and served by the same Worker.
- **No sign-in**: each browser gets its own private workspace, sent as the `x-knotwork-workspace` header. Limits per workspace live in `shared/limits.ts` (10 workflows, 60 runs per hour). See [[ADR-0004 Knotwork is public with per-browser workspaces]].
- **D1 database id**: `0f48a649-3f54-4f79-ac6c-57c34394b99f` (committed in `wrangler.jsonc`). Remote D1 has migrations 0001 and 0002 (applied 2026-11-07).
- **Cost**: must stay free. No paid hosting, no paid AI credits. See [[ADR-0003 Knotwork runs on the Cloudflare free plan]].

## Brand
Ink and lime, chosen 2026-11-08 after Gigi rejected orange and blue. See [[Knotwork design system]] and [[ADR-0005 Ink and lime brand for Knotwork]].

## Deploying
Not connected to Workers Builds yet, so merges do **not** auto-deploy. Deploy by hand from Gigi's PC: [[Deploy Knotwork]].

## Next
- [ ] Connect the repo to Workers Builds so merges deploy themselves (Workers & Pages > knotwork > Settings > Builds)
- [ ] Add Knotwork to the Work section on [[gigiberidze.com]]
- [ ] Decide whether concurrent saves should warn: today the last save wins silently (found 2026-11-09 by the [[Browser scenario testers skill]])

## Testing
Multi-user browser scenarios live in the vault kit (`60 Resources/Skills/browser-scenario-testers/kit/examples/knotwork/`). Run them against `npx vite` locally or the live site with `BST_BASE_URL`.

## Related
- Local checkout: `C:\Users\PC\Downloads\knotwork`
- Design pipeline: project files `knotwork/design-system/`
- Brand canvas: https://claude.ai/artifact/GZjwgU9VuEnVrC1kAEqzQ1
- Claude thread: *Build Knotwork workflow engine*
