---
type: runbook
status: active
created: 2026-11-10
updated: 2026-11-10
tags: [runbook, knotwork]
system: "[[Knotwork]]"
---
# Find out why Knotwork answers 429

When to use this: someone sees "Too many requests", "Request failed (429)", or a script gets 429 from `knotwork.gigiberidze.com`.

1. **Read the body of the answer.** It tells you who refused.

| Body | Who | Limit | What to do |
|---|---|---|---|
| Not JSON (Cloudflare's page, `error code: 1015`) | The WAF rule in [[Cloudflare]] | more than 10 requests to `/api/` in 10 s from one address, blocked 10 s | Wait 10 s. The dashboard does this by itself since 1.0.1 ([[ADR-0017 Knotwork dashboard paces its own requests]]) |
| `{"error":"Too many requests from your network…"}` with `retry-after: 60` | The Worker (`overLimit` in `worker/index.ts`) | 60 a minute per address, 600 per network | Wait a minute. Look for a script or many tabs on that address |
| `{"error":"Too many calls to this webhook…"}` | The hub | 60 a minute per webhook URL, 600 per address | The sender is too fast |
| Any other `error` text | A product limit (`shared/limits.ts`) | runs per hour, wrong passwords, sign-ups, demo sign-ins, step tests | The text says which and when it resets |

2. **See it in Cloudflare** (Gigi's browser only): the domain > Security > Events, filter on the rule "Knotwork API". Each line is one blocked request with its address and path.
3. **Count what the dashboard sends.** Browser dev tools > Network, filter `/api/`. More than 9 in any 10 seconds from one tab means pacing isn't working: check that `src/pace.ts` is in the deployed build (`/api/health` shows the version, 1.0.1 or later).
4. **Reproduce without touching production.** Build the app (`npm run build`), serve `dist/client` with the Worker's `fetch` on the in-memory database (`test/fakeMongo.ts`) behind a few lines that answer 429 after 10 `/api/` requests in 10 s, and click through with Playwright. Pacing is off on localhost: set `localStorage` `knotwork.pace` to `on` first. The browser scenario `e2e/scenarios/24-request-pace.mjs` checks the same in CI.

If it fails: if real visitors are still refused often, the rule is too tight for how the app is used now. Raising it is a Cloudflare setting, so ask Gigi first, and change `BUDGET` in `src/pace.ts` with it.
