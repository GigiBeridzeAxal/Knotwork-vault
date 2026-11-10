---
type: decision
status: accepted
created: 2026-11-10
updated: 2026-11-10
date: 2026-11-10
tags: [decision, knotwork, cloudflare]
supersedes:
superseded-by:
---
# ADR-0017 Knotwork dashboard paces its own requests

## Context
Gigi reported on 2026-11-10 that [[Knotwork]] sometimes answers 429. The cause was the dashboard itself. The WAF rule in [[Cloudflare]] blocks an address that sends more than 10 requests to `/api/` in 10 seconds, for 10 seconds. Ordinary clicking passed it: demo, Workflows, open a workflow, Run sent 12 requests in under 6 seconds, because every page change reloaded the sidebar lists on top of the page's own requests and a running run was polled every 3 seconds. Every request then failed for 10 seconds and pages showed "Request failed (429)".

It was reproduced on a local copy of the built app with a copy of the rule in front of it (18 requests and five 429 answers before; 12 requests and none after). It was not observed on production itself, because cloud sessions can't reach the live site.

## Options considered
1. **Raise the rule** to 20 or 30 per 10 seconds. One click in the dashboard, but the rule is what keeps one address from using up the Worker's 100,000 free requests a day: at 10 per 10 seconds one address tops out near 86,000, at 20 it can use all of them alone. It is also a Cloudflare setting, which needs Gigi's OK ([[Working agreements]]).
2. **Remove the rule** and rely on the Worker's own 60 a minute. Refused requests still count toward the daily 100,000.
3. **Make the dashboard fit under the rule and heal by itself when it is refused anyway.** Chosen.

## Decision
- **Pacing.** `src/pace.ts`: one tab sends at most 9 requests in any 10 seconds, and polling stops at 7 so a click never waits behind a refresh. Requests over that wait for their turn (rarely more than a few seconds). The send times survive a page reload. It is off on localhost, where the rule doesn't exist; `localStorage` `knotwork.pace = on` turns it on for a test.
- **Self-healing.** A 429 that is not Knotwork's own JSON (Cloudflare's block), or one of Knotwork's that names a wait of 15 seconds or less, is sent again after the wait, up to twice, while the app shows "Too many requests at once. Carrying on in a few seconds." This is safe for any method, because a blocked request never reached Knotwork's code. Real limits (runs per hour, wrong passwords, sign-ups) are not retried; their message is shown.
- **Fewer requests.** The sidebar lists reload on a page change only after a change, on a list page when older than 2 seconds, or when older than 10 seconds. The Workflows and Runs pages reuse them. A running run is polled every 2 seconds four times, then every 5 seconds. A first-time visitor on `/` and `/docs` no longer calls `/api/me`.
- The rule and the Worker's limits stay as they are.

## Consequences
- **The numbers are coupled.** If the WAF rule changes, change `BUDGET` and `BACKGROUND_BUDGET` in `src/pace.ts` in the same go.
- Pacing is per tab. Two tabs, or several people behind one address, can still be refused; they then wait about 10 seconds with the notice instead of seeing an error.
- A run that takes longer than about 8 seconds shows new steps up to 5 seconds late.
- A script that uses an API key shares the 10 per 10 seconds with any dashboard open on the same address (`docs/api.md` says so).
- How to tell the kinds of 429 apart: [[Find out why Knotwork answers 429]].
