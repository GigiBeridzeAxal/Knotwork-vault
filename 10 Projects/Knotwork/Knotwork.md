---
type: project
status: active
created: 2026-11-07
updated: 2026-11-09
tags: [project, cloudflare, portfolio]
repo: https://github.com/GigiBeridzeAxal/knotwork
url: https://knotwork.gigiberidze.com
stack: [Cloudflare Workers, Hono, MongoDB Atlas, Cron Triggers, React, Tailwind, Vite]
---
# Knotwork

A workflow automation engine (a small n8n), and Gigi's first portfolio project for the Work section of [[gigiberidze.com]]. Tagline: *Workflows that hold.*

## Status
Live and public at https://knotwork.gigiberidze.com since 2026-11-07. v1 merged to `main` as PR #1 (squash `478d8009`, 2026-11-08). The ink and lime landing page at `/` and the app at `/workflows` were deployed 2026-11-08 (version `90721a08`, still live).

**Accounts and workspaces (2026-11-09):** [PR #3](https://github.com/GigiBeridzeAxal/knotwork/pull/3) adds sign-up, log-in, a demo account, Personal workspace plus a + box in the sidebar, and moves the data to [[MongoDB Atlas]]. It is stacked on PR #2 (home dashboard), so #2 merges first. Reviewed in 13 rounds with the [[Review criteria skill]] (security 8, logic 8, docs 9). Not deployed yet: the CPU per request on the free plan still has to be measured on a preview version, and deploying needs Gigi's go-ahead. See [[ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas]].

## How it works
- **Worker**: Hono API on Cloudflare Workers, D1 database, a cron trigger every minute that runs scheduled workflows.
- **Dashboard**: React + Tailwind, built with the Cloudflare Vite plugin and served by the same Worker.
- **Live version (until PR #3 deploys)**: no sign-in; each browser gets its own workspace ([[ADR-0004 Knotwork is public with per-browser workspaces]], now superseded). Data in D1 (id in `wrangler.jsonc` on `main`).
- **From PR #3**: accounts and workspaces, data in [[MongoDB Atlas]], secrets `MONGODB_URI` and `AUTH_PEPPER`. Every limit (runs and bytes per hour, pending runs, rate limits, the storage guard) is listed in the repo README and `shared/limits.ts`.
- **Cost**: must stay free. No paid hosting, no paid AI credits. See [[ADR-0003 Knotwork runs on the Cloudflare free plan]].

## Brand
Ink and lime, chosen 2026-11-08 after Gigi rejected orange and blue. See [[Knotwork design system]] and [[ADR-0005 Ink and lime brand for Knotwork]].

## Deploying
Not connected to Workers Builds yet, so merges do **not** auto-deploy. Deploy by hand from Gigi's PC: [[Deploy Knotwork]].

## Next
- [ ] Connect the repo to Workers Builds so merges deploy themselves (Workers & Pages > knotwork > Settings > Builds)
- [ ] Add Knotwork to the Work section on [[gigiberidze.com]]
- [ ] Measure CPU per request on the PR #3 preview (needs the Preview URLs toggle on briefly), then merge #2 and #3 and deploy ([[Deploy Knotwork]])
- [x] Concurrent saves now get a 409 conflict instead of the last save winning (PR #3)
- [x] Findings of the 2026-11-09 backend audit fixed in PR #3

## Testing
Multi-user browser scenarios live in the vault kit (`60 Resources/Skills/browser-scenario-testers/kit/examples/knotwork/`). Run them against `npx vite` locally or the live site with `BST_BASE_URL`.

## Related
- Local checkout: `C:\Users\PC\Downloads\knotwork`
- Design pipeline: project files `knotwork/design-system/`
- Brand canvas: https://claude.ai/artifact/GZjwgU9VuEnVrC1kAEqzQ1
- Claude threads: *Build Knotwork workflow engine*; *Add accounts and workspaces to Knotwork*
