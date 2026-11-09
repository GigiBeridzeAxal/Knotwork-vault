---
type: memory
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [memory, log]
---
# Changelog

Newest first. One line per event: what changed, and a link.

## 2026-11
- **2026-11-09** Knotwork: browser scenarios found the editor replacing an edit typed while it loads (dev build only); fixed in `ee4c9c6`. Front page got Log in and Sign up links (`1b5a0e5`). Both pushed to PR #3, not deployed yet. [[Knotwork]]
- **2026-11-09** Knotwork with accounts is live: version `b4f019c1` deployed 19:36 UTC from PR #3 at `304c751`, with the database connection held in a Durable Object. Watched for an hour: no errors, Worker CPU p99 6 ms. [[ADR-0009 Knotwork keeps one database connection in a Durable Object]]
- **2026-11-09** Knotwork: first accounts deploy `681fc677` (19:25 UTC) rolled back to `90721a08` after seven minutes; every request spent about 1.7 s opening a database connection. [[Deploy Knotwork]]
- **2026-11-09** Knotwork accounts and workspaces: PR #3 opened (stacked on #2). Worker secrets `MONGODB_URI` and `AUTH_PEPPER` set; Atlas indexes created; preview version `f64c6ab2` uploaded (not deployed; production still `90721a08`). WAF rate-limit rule "Knotwork API" added for `/api/`. [[ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas]]
- **2026-11-09** Free MongoDB Atlas M0 cluster `knotwork` created for Knotwork. [[MongoDB Atlas]]
- **2026-11-09** Review criteria skill condensed to one 44 KB `SKILL.md` (plus `web-perf.cjs`) so it fits the 48 KB save-card limit; Gigi saved it to their claude.ai skills. [[Review criteria skill]]
- **2026-11-09** Added the review criteria skill (security, performance, logic, documentation; scored 0-10 with an APPROVE/WARN/BLOCK verdict). Test runs: site PR #6 APPROVE; Knotwork backend audit found issues to fix (report in project files). [[Review criteria skill]]
- **2026-11-09** Added the browser scenario testers skill; first run on Knotwork passed 6 of 6 scenarios on Chromium. [[Browser scenario testers skill]]
- **2026-11-09** Added the professional UI design skill. [[Professional UI design skill]]
- **2026-11-09** Vault published to the public repo GigiBeridzeAxal/Knotwork-vault.
- **2026-11-09** Obsidian vault created ([[ADR-0001 Use an Obsidian vault as project memory]]).
- **2026-11-08** Knotwork landing page at `/`, app moved to `/workflows`, lime recolor deployed (version `90721a08`, from `main` `478d8009`). [[Knotwork]]
- **2026-11-08** Knotwork PR #1 squash-merged to `main`. Design system measured at 0 off-token values. [[Knotwork design system]]
- **2026-11-08** Brand switched to ink and lime. [[ADR-0005 Ink and lime brand for Knotwork]]
- **2026-11-08** iPhone OBS Cam built (Safari + WebRTC + Node). [[iPhone OBS Cam]]
- **2026-11-07** Knotwork live at knotwork.gigiberidze.com, made public with per-browser workspaces. [[ADR-0004 Knotwork is public with per-browser workspaces]]
- **2026-11-07** Gigi picked the workflow engine as the first portfolio project and named it Knotwork.
- **2026-11-04** US company options discussed (Stripe Atlas vs Bizee, Mercury). [[US LLC for Stripe]]

## 2026-10
- **2026-10-31** Checked traffic: Web Analytics already on; LCP issue found. [[Traffic analytics]]
- **2026-10-30** Contact email confirmed working through Email Routing. [[Contact email]]
- **2026-10-30** Removed "Hire me" buttons and Freelancer reviews; added Freelancer and Upwork links in the hero.
- **2026-10-30** Preview builds fixed with the `previews` block (PR #4). [[Fix red preview build]]
- **2026-10-29** Work section switched to 3 mock projects.
- **2026-10-29** PR #2 merged; Workers Builds connected; auto-deploy from `main` on. Process section rewritten to Gigi's four steps. [[gigiberidze.com]]
