---
type: project
status: active
created: 2026-11-10
updated: 2026-11-11
tags: [project, cloudflare, portfolio, mcp]
repo: none yet (planned name rouse)
url:
stack: [Cloudflare Workers, D1, Durable Objects, KV, Hono, MCP, Web Push, React, Tailwind]
---
# Rouse

A pager for AI agents: an MCP server that lets Claude get Gigi's attention on the phone (quiet push, loud alarm, ringing call) when it is stuck, and carries the answer back so the work continues. Gigi's second portfolio project, asked for on 2026-11-10. Tagline: *Wake the human.*

## Status
Phase 0 starter built on 2026-11-10 and rebranded in Klein blue on 2026-11-11, **not pushed and not deployed**: there is no repo yet. It waits in the project files as `rouse/rouse-phase0.bundle` (a git bundle with two commits on `main`) and `rouse/rouse-phase0.tar.gz`. It holds the Worker (`/api/health`, a rate limit, a `/mcp` placeholder that answers 501), the ladder model, the first D1 schema, a branded home page, 13 passing tests and a CI workflow. Build and tests pass in a cloud session; the app was started locally and its home page looked at on 1440 and 390 px.

Waiting on Gigi: the `rouse` repo, which phone to wake, and whether any paid channel is wanted.

## How it works
The full design is in [[Rouse system plan]]. In short:
- Claude calls `alert_human` with a title, message, urgency and optional reply buttons.
- The service climbs a ladder (push, then alarm, then call) until Gigi answers, then stops on every channel.
- Claude reads the answer with `wait_for_reply`. Late answers are kept and read with `list_alerts`.
- One Cloudflare Worker on the free plan: [[ADR-0018 Rouse is one Worker with D1 and a timer object]].
- Free channels first, paid ones optional: [[ADR-0019 Rouse uses free channels first]].
- Links sent through outside services cannot answer an alert: [[ADR-0020 Rouse links from outside services cannot answer]].

## Brand
Gigi chose the name **Rouse** on 2026-11-10. The first look (violet night, dawn accent, sunrise-bell mark) was turned down on 2026-11-11, and the same day Gigi chose **Klein blue and the Wake eye**: [[ADR-0022 Klein blue and the waking eye for Rouse]]. Brand page with every mark and palette on real screens: https://claude.ai/artifact/8U8zWScNqjJLWKJadjqg6F (private; source `rouse/rouse-logo-colors.html` in the project files).

- Brand surfaces in Klein `#1534E0` with white; app screens in a dark navy at the same hue.
- The eye has two optical cuts: full from 32 px, small for 16 to 24 px.
- Bricolage Grotesque, Instrument Sans, IBM Plex Mono.
- Token tables with measured contrast: `docs/brand.md` in the repo (copy: `rouse/brand.md` in the project files). Home page screenshots: `rouse/screens/` in the project files.

## Design rules
- 2026-11-11: Gigi turned down violet with amber ("dawn") and the sunrise-bell mark. Don't bring back violet or a sun shape.
- Show logos and palettes as separate choices that mix on real screens (app icon, phone alert, home page), with two or three curated directions on top.
- Every mark is checked at 16, 24 and 32 px and in gray before it is shown. The Wake eye first blurred at 16 px; Gigi still liked it, so it was redrawn with a small optical cut instead of being dropped.
- Sky `#A9BAFF` is a highlight only (the eye's rays, a lit ladder bar), never a text or button color on night.

## Next
- [x] Gigi picked Rouse, 2026-11-10
- [x] Phase 0 starter built and tested locally, 2026-11-10
- [x] Gigi chose Klein blue and the Wake eye; starter rebranded, 2026-11-11
- [ ] Gigi creates the empty GitHub repo `rouse`, then push the bundle to `main`
- [ ] Gigi says which phone to wake and whether Telegram is on it
- [ ] Gigi decides on paid parts (none, Pushover, Twilio)
- [ ] Connect the repo to Workers Builds (the first deploy creates the DNS record for rouse.gigiberidze.com, so it needs Gigi's OK)
- [ ] Create the D1 database and take the three measurements
- [ ] Phase 1: MCP endpoint with sign-in, `alert_human`, `wait_for_reply`, web push, answer page

## Related
- Plan as a document (private to Gigi): https://claude.ai/artifact/5w5RtsHstt8PmzdjcBR1w2
- Self-review of the plan: `phone-alert/review-phone-alert-plan-2026-11-10.md` in the project files
- Precedents: [[Knotwork]], [[ADR-0003 Knotwork runs on the Cloudflare free plan]]
- Claude thread: *Build Rouse phone alerts for AI*
