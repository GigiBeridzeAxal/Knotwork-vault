---
type: memory
status: active
created: 2026-11-09
updated: 2026-11-10
tags: [memory, questions]
---
# Open questions

- [ ] Stripe Atlas or Bizee for the US company? [[US LLC for Stripe]]
- [ ] Knotwork: check on the live site that requests from one address are refused after the rate limit (needs Gigi's OK, it touches production)? [[Knotwork]]
- [ ] Knotwork: merge PR #17 (the 429 fix), and after it is live, check Security > Events in Cloudflare that the "Knotwork API" rule stops blocking ordinary visitors? [[Find out why Knotwork answers 429]]
- [ ] Knotwork: `/api/me` still answers 401 to a signed-out visitor on `/login`, `/signup`, `/recover` and `/demo`, which shows as a console error. Worth an endpoint that answers 200 with no user? [[Knotwork]]
- [ ] Knotwork: does the hub's Durable Object usage stay under the free daily allowance after a normal day? [[ADR-0009 Knotwork keeps one database connection in a Durable Object]]
- [ ] Narrow the Atlas database user from `readWriteAnyDatabase` to `readWrite` on `knotwork`? [[MongoDB Atlas]]
- [ ] Create the `iphone-obs-cam` repo? [[iPhone OBS Cam]]
- [ ] Fix the slow cover image (LCP) on the site? [[Traffic analytics]]
- [ ] Knotwork plan: an AI step or not, connectors before teams? (The canvas question is settled: nested blocks, [[ADR-0010 Knotwork canvas is nested blocks drawn from the steps]].) [[Knotwork system plan]]
