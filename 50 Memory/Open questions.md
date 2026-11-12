---
type: memory
status: active
created: 2026-11-09
updated: 2026-11-13
tags: [memory, questions]
---
# Open questions

- [ ] Stripe Atlas or Bizee for the US company? [[US LLC for Stripe]]
- [ ] Knotwork: check on the live site that requests from one address are refused after the rate limit (needs Gigi's OK, it touches production)? [[Knotwork]]
- [ ] Knotwork: PR #17 (the 429 fix) is live since 2026-11-10. Check Security > Events in Cloudflare that the "Knotwork API" rule stops blocking ordinary visitors? [[Find out why Knotwork answers 429]]
- [ ] Knotwork: does the hub's Durable Object usage stay under the free daily allowance after a normal day? [[ADR-0009 Knotwork keeps one database connection in a Durable Object]]
- [ ] Narrow the Atlas database user from `readWriteAnyDatabase` to `readWrite` on `knotwork`? [[MongoDB Atlas]]
- [ ] Create the `iphone-obs-cam` repo? [[iPhone OBS Cam]]
- [ ] Set up Google Search Console (Domain property gigiberidze.com) so search words for the site and Rouse show up? Also add "Claude" and "MCP" to the Rouse page title and a sitemap? [[Traffic analytics]]
- [ ] Fix the slow cover image (LCP) on the site? [[Traffic analytics]]
- [ ] Knotwork plan: an AI step or not, connectors before teams? (The canvas question is settled: nested blocks, [[ADR-0010 Knotwork canvas is nested blocks drawn from the steps]].) [[Knotwork system plan]]
- [ ] Rouse: approve Claude Code's own permission prompts from the phone? Claude Code's `PermissionRequest` hook can call Rouse over HTTP and return allow or deny (default hook timeout 10 minutes, can be raised to 15 for the ladder). Not in the plan yet; offered for phase 1 on 2026-11-12. [[Rouse]]
- [ ] Rouse: which phone should it wake, and is Telegram on it? Any paid channel (Pushover 4.99 USD once, Twilio per use)? (Open to others: yes, since Gigi asked for sign-up on 2026-11-12.) [[Rouse]]
- [ ] Rouse accounts (MongoDB, live 2026-11-12): Atlas network rule and user checked 2026-11-13. Gigi to run `Rouse - connect database.cmd` on the PC so `MONGODB_URI` matches the new Atlas password, then make their own account first ([[Deploy Rouse]]). Delete the unused D1 database `rouse`? [[ADR-0024 Rouse stores its data in MongoDB Atlas]]
- [ ] Rouse dashboard: is the signed-in Rouse page the dashboard Gigi meant? Should it replace Setup as the page after sign-in? Apple Developer Program for the iOS app (TestFlight, Apple push)? [[Rouse dashboard plan]]
