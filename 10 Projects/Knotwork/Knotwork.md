---
type: project
status: active
created: 2026-11-07
updated: 2026-11-09
tags: [project, cloudflare, portfolio]
repo: https://github.com/GigiBeridzeAxal/knotwork
url: https://knotwork.gigiberidze.com
stack: [Cloudflare Workers, Durable Objects, Hono, MongoDB Atlas, Cron Triggers, React, Tailwind, Vite]
---
# Knotwork

A workflow automation engine (a small n8n), and Gigi's first portfolio project for the Work section of [[gigiberidze.com]]. Tagline: *Workflows that hold.*

## Status
Live and public at https://knotwork.gigiberidze.com since 2026-11-07. **With accounts since 2026-11-09 19:36 UTC** (version `b4f019c1`, from PR #3 at `304c751`). Sign-in is at `/login` and `/signup`.

**Accounts and workspaces:** [PR #3](https://github.com/GigiBeridzeAxal/knotwork/pull/3) adds sign-up, log-in, a demo account, a Personal workspace plus a + box in the sidebar, and moves the data to [[MongoDB Atlas]]. PR #2 (home dashboard) and PR #3 were merged to `main` on 2026-11-09 (`c7cba02`); production was deployed from the PR branch before that. Reviewed in 14 rounds with the [[Review criteria skill]]. See [[ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas]] and [[ADR-0009 Knotwork keeps one database connection in a Durable Object]].

**Not deployed yet:** on `main`, `1b5a0e5` adds Log in and Sign up links to the front page and `ee4c9c6` fixes the editor replacing an edit typed while it loads. [PR #5](https://github.com/GigiBeridzeAxal/knotwork/pull/5) (open) makes the hub's reconnects safer, lets someone in the demo reach the sign-up form, and answers 503 when the hub can't be reached.

**Old data:** the per-browser workspaces from before accounts lived in D1 and did not carry over.

**Canvas editor (phase 3):** [PR #9](https://github.com/GigiBeridzeAxal/knotwork/pull/9) adds the canvas as the default editor view, testing one step, version history, a template gallery and import and export. Open as of 2026-11-09. See [[ADR-0010 Knotwork canvas is nested blocks drawn from the steps]].

**Ready-made steps (phase 4):** [PR #7](https://github.com/GigiBeridzeAxal/knotwork/pull/7) adds Slack, Discord, Telegram and GitHub steps with their own forms and the example "New GitHub star to Discord". Credentials default to `{{ secrets.NAME }}`, so it should merge after the secrets PR (phase 2). Reviewed with the [[Review criteria skill]]: WARN, then APPROVE in round 2. CI green. The "watch a feed" trigger is not built yet. See [[ADR-0011 Knotwork ready-made steps call only their own service]].

## How it works
- **Worker**: Hono API on Cloudflare Workers, with a cron trigger every minute that runs scheduled workflows. It hands `/api/`, `/hooks/` and the cron tick to one Durable Object, the hub, which keeps the database connection open ([[ADR-0009 Knotwork keeps one database connection in a Durable Object]]).
- **Dashboard**: React + Tailwind, built with the Cloudflare Vite plugin and served by the same Worker.
- **Data**: accounts and workspaces in [[MongoDB Atlas]], secrets `MONGODB_URI` and `AUTH_PEPPER`. Every limit (runs and bytes per hour, pending runs, rate limits, the storage guard) is listed in the repo README and `shared/limits.ts`.
- **Cost**: must stay free. No paid hosting, no paid AI credits. See [[ADR-0003 Knotwork runs on the Cloudflare free plan]].

## Brand
Ink and lime, chosen 2026-11-08 after Gigi rejected orange and blue. See [[Knotwork design system]] and [[ADR-0005 Ink and lime brand for Knotwork]].

## Deploying
Not connected to Workers Builds yet, so merges do **not** auto-deploy. Deploy by hand from Gigi's PC: [[Deploy Knotwork]].

## Next
The full roadmap, in phases, is in [[Knotwork system plan]]. The short list:
- [ ] Connect the repo to Workers Builds so merges deploy themselves (Workers & Pages > knotwork > Settings > Builds)
- [ ] Knotwork in the Work section and a case study at `/work/knotwork` on [[gigiberidze.com]]: [PR #7](https://github.com/GigiBeridzeAxal/gigiberidze.com/pull/7), opened 2026-11-09
- [ ] User guide at `/docs` and one-click demo at `/demo`: [PR #6](https://github.com/GigiBeridzeAxal/knotwork/pull/6), opened 2026-11-09. How to keep both current: [[Update the Knotwork case study and docs]]
- [x] CPU per request measured in production 2026-11-09: Worker p99 2 ms (requests) and 6 ms (cron), limit 10 ms
- [x] PR #2 and #3 merged 2026-11-09
- [ ] Merge PR #5, then deploy `main` ([[Deploy Knotwork]])
- [ ] Check the Durable Object usage after a normal day (Workers & Pages > Durable Objects)
- [ ] Run the browser scenarios on Firefox, and on WebKit again after `ee4c9c6`
- [ ] The demo workflow "Retry and recover" calls an address that always answers 503, so it never recovers; its title promises it does
- [x] Concurrent saves now get a 409 conflict instead of the last save winning (PR #3)
- [x] Findings of the 2026-11-09 backend audit fixed in PR #3

## Testing
Multi-user browser scenarios live in the vault kit (`60 Resources/Skills/browser-scenario-testers/kit/examples/knotwork/`). Run them against `npx vite` locally with a throwaway database, never with test accounts on the live site. 2026-11-09: 11 of 11 pass on Chromium at `ee4c9c6`; Chromium and WebKit passed 8 of 9 at `304c751` on Gigi's PC and found the editor bug fixed in `ee4c9c6`. The dev build loads the session twice (React StrictMode), which is how that bug showed.

## Related
- Local checkout: `C:\Users\PC\Downloads\knotwork`
- Design pipeline: project files `knotwork/design-system/`
- Brand canvas: https://claude.ai/artifact/GZjwgU9VuEnVrC1kAEqzQ1
- Claude threads: *Build Knotwork workflow engine*; *Add accounts and workspaces to Knotwork*
