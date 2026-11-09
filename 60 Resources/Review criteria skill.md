---
type: resource
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [skill, review, quality]
---
# Review criteria skill

A Claude skill that reviews finished work (a PR, a diff, a feature, a whole project, a live site, or Claude's own work before handing it over) against Gigi's four criteria, and writes a scored report. Gigi asked for it on 2026-11-09.

| Criterion | The question |
|---|---|
| Security | What can someone hostile, or careless, do with this, and what would it cost? |
| Performance | How fast and cheap is it at real load, did it get slower, could it be notably better? Ends in a **problems report**: cost now, better approach, expected gain, effort. |
| Logic and goal | Does it do exactly what was asked: nothing less, correct, nothing more? Requirements traced as Met / Partial / Missing / Wrong, plus a scope map of every change. |
| Documentation | Can the next person (developer, operator, user, agent) use and run it without asking? |

## How scoring works
- Findings are CRITICAL, HIGH, MEDIUM or LOW. The worst finding sets each criterion's score band: CRITICAL 0-2 and HIGH 3-5 are BLOCK, MEDIUM 6-7 is WARN, LOW only 8-9 is PASS, 10 is clean with proof.
- A 9 or 10 needs proof beyond reading (something run, measured or tested); otherwise the score stops at 8.
- Verdict: BLOCK if any criterion blocks, APPROVE only if all four pass, WARN otherwise. Each criterion below 10 gets a "to reach 10" list.

## Files
- Source (master copy): `60 Resources/Skills/review-criteria/`: `SKILL.md`, one reference per criterion in `references/`, the report template in `assets/`, and `scripts/web-perf.cjs` (page-load and click speed under phone throttling, base vs head with `--compare`).
- To install or update it: [[Install a Claude skill]]. A ready zip is in the project's shared files (`review-criteria/review-criteria.zip`) and in Gigi's Downloads.

## What we learned building it
- Tested on two real reviews on 2026-11-09: the site's contact-button PR #6 (APPROVE) and a Knotwork backend audit. The audit reports live in the project's shared files, not here, because the Knotwork one describes open security issues.
- Headless browsers have no mail app and deny clipboard access unless granted, so a reviewer can mistake test-harness limits for bugs. The skill now says to reproduce on the base first.
- Navigation Timing leaves out DevTools-emulated network latency; `web-perf.cjs` reads TTFB from the DevTools timing instead.
- On Cloudflare D1, rows read and written per operation decide whether something fits the free plan. Locally they come from `getPlatformProxy()` and `result.meta`, not from `wrangler d1 execute`.

Related: [[Professional UI design skill]], [[Browser scenario testers skill]], [[Knotwork]], [[gigiberidze.com]].
