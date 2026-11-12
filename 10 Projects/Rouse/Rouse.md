---
type: project
status: active
created: 2026-11-10
updated: 2026-11-12
tags: [project, cloudflare, portfolio, mcp]
repo: https://github.com/GigiBeridzeAxal/rouse (private)
url: https://rouse.gigiberidze.com
stack: [Cloudflare Workers, D1, Durable Objects, KV, Hono, MCP, Web Push, React, Tailwind]
---
# Rouse

A pager for AI agents: an MCP server that lets Claude get Gigi's attention on the phone (quiet push, loud alarm, ringing call) when it is stuck, and carries the answer back so the work continues. Gigi's second portfolio project, asked for on 2026-11-10. Tagline: *Wake the human.*

## Status
Repo **GigiBeridzeAxal/rouse** (private) created by Gigi on 2026-11-11; `main` holds phase 0 and the landing page. **Live since 2026-11-11** at https://rouse.gigiberidze.com: Workers Builds is connected, so every push to `main` deploys itself. See [[Deploy Rouse]].

Phase 0 has the Worker (`/api/health`, a rate limit, a `/mcp` placeholder that answers 501), the ladder model, the first D1 schema, 17 passing tests, CI, and the **landing page** (2026-11-11): a Klein hero with a playable 3 AM demo (a drawn phone climbs push, alarm, call; the visitor answers and the agent carries on), how it works with the six MCP tools, a ladder chart drawn from `shared/ladder.ts`, channels, safety rules and the one-line setup command. Screenshots: `rouse/screens/landing-*.png` in the project files. Self-review APPROVE: `rouse/review-rouse-landing-2026-11-11.md` in the project files.

**Landing page redesign, 2026-11-11 (second pass):** Gigi turned down the first landing page ("i dont like design and colors and animations"). It was rebuilt with neutrals carrying the page, Klein only as light, lighter headlines and calmer motion, and shown in three color directions on one layout (Midnight, Paper, Aurora). **Gigi chose Paper**: a light gallery (off-white page `#F7F7F4`, white cards, near-black text, Klein as the one color). Merged as [PR #1](https://github.com/GigiBeridzeAxal/rouse/pull/1) (squash `7cd821c`) and live the same day; a phone fix (the hero phone peeks in on the first screen) followed in [PR #2](https://github.com/GigiBeridzeAxal/rouse/pull/2) (squash `d98f6c9`). Screenshots `rouse/screens/landing-paper-1440.jpg` and `landing-paper-390.jpg`, reviews `rouse/review-rouse-landing-redesign-2026-11-11*.md` in the project files.

**Accounts, 2026-11-12 (deployed; off until the secret is set):** Gigi asked for sign-up and sign-in and chose **email and password** ([[ADR-0023 Rouse accounts use email, password and recovery codes]]). Built in [PR #3](https://github.com/GigiBeridzeAxal/rouse/pull/3): sign-up (then ten recovery codes to save), sign-in, reset with a recovery code, a setup page (phone and Claude steps marked "coming soon") and an account page (signed-in browsers, password, new codes, delete). Open to anyone, at most 100 new accounts a day. 61 unit tests and 36 browser checks pass. Schema applied and PR #3 merged (`8a02491`) and deployed on 2026-11-12. The account pages answer "Accounts aren't switched on here yet" until Gigi sets the Worker secret `AUTH_PEPPER` ([[Deploy Rouse]]). Screenshots `rouse/screens/accounts-*.jpg`, review `rouse/review-rouse-accounts-2026-11-12.md` in the project files.

Waiting on Gigi: the `AUTH_PEPPER` secret (then making their own account first), which phone to wake, and whether any paid channel is wanted.

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

- Klein `#1534E0` is the brand color, used as light: the primary button, glows, lit chart bars, the phone's alert screens. Neutrals tinted toward its hue carry every page (second pass, 2026-11-11).
- The landing page and the account screens use the **Paper** palette (light gallery); the drawn phone and terminal stay dark ink. The night palette (Midnight) is kept for the alert screen, opened at 3 AM.
- The eye has two optical cuts: full from 32 px, small for 16 to 24 px.
- Bricolage Grotesque, Instrument Sans, IBM Plex Mono.
- Token tables with measured contrast: `docs/brand.md` in the repo (copy: `rouse/brand.md` in the project files). Home page screenshots: `rouse/screens/` in the project files.

## Design rules
- 2026-11-11: Gigi turned down violet with amber ("dawn") and the sunrise-bell mark. Don't bring back violet or a sun shape.
- Show logos and palettes as separate choices that mix on real screens (app icon, phone alert, home page), with two or three curated directions on top.
- Every mark is checked at 16, 24 and 32 px and in gray before it is shown. The Wake eye first blurred at 16 px; Gigi still liked it, so it was redrawn with a small optical cut instead of being dropped.
- Sky `#A9BAFF` is a highlight only (the eye's rays, a lit ladder bar), never a text or button color on night.
- 2026-11-11, second pass: Gigi turned down the first landing page: full-width Klein bands, heavy 700 headlines, shaking and flickering animations. Neutrals carry the page and Klein stays under 10% of a screen, as light rather than paint. Headlines at weight 500 to 600. Motion fades, rises and un-blurs on a long ease-out, once per idea; no shake, flicker or bounce. Researched from Linear, Raycast and Stripe; rules and tokens in `docs/brand.md`.
- 2026-11-11: of Midnight (night), Paper (light gallery) and Aurora (night with moving light), Gigi picked Paper for the landing page.

## Next
- [x] Gigi picked Rouse, 2026-11-10
- [x] Phase 0 starter built and tested locally, 2026-11-10
- [x] Gigi chose Klein blue and the Wake eye; starter rebranded, 2026-11-11
- [x] Gigi created the private repo `rouse`; `main` pushed with the landing page, 2026-11-11
- [ ] Gigi says which phone to wake and whether Telegram is on it
- [ ] Gigi decides on paid parts (none, Pushover, Twilio)
- [x] Connected to Workers Builds and live at rouse.gigiberidze.com, 2026-11-11
- [x] Landing page redesigned after Gigi turned the first one down; draft PR #1 with three color directions, 2026-11-11
- [x] Gigi picked Paper; PR #1 merged and live, 2026-11-11 (phone fix in PR #2)
- [x] D1 database `rouse` created, 2026-11-11 (empty until accounts go live)
- [x] Gigi asked for accounts and chose email and password; built in PR #3, 2026-11-12
- [x] Schema applied and PR #3 merged and deployed, 2026-11-12
- [ ] `AUTH_PEPPER` set and Gigi's own account made
- [ ] Take the phase 0 measurements (web push CPU, timer object time, D1 reads while waiting, 25 s tool calls)
- [ ] Phase 1: MCP endpoint with sign-in, `alert_human`, `wait_for_reply`, web push, answer page

## Related
- Plan as a document (private to Gigi): https://claude.ai/artifact/5w5RtsHstt8PmzdjcBR1w2
- Self-review of the plan: `phone-alert/review-phone-alert-plan-2026-11-10.md` in the project files
- Precedents: [[Knotwork]], [[ADR-0003 Knotwork runs on the Cloudflare free plan]]
- Claude thread: *Build Rouse phone alerts for AI*
