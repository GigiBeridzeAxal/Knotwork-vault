---
type: resource
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [skill, testing, playwright]
---
# Browser scenario testers skill

A Claude skill for end-to-end testing with several people at once: 5 to 6 Playwright actors, each a separate account in its own browser context on Chromium, Firefox or WebKit, play multi-user scenarios (isolation, sharing, roles, propagation, concurrent edits, limits, webhooks, sessions, mobile) and the run ends in a report of what passes and what breaks. Gigi asked for it on 2026-11-09.

- Source: `60 Resources/Skills/browser-scenario-testers/SKILL.md` (master copy; edit here, then re-save the skill).
- Kit: `60 Resources/Skills/browser-scenario-testers/kit/` holds the harness `bst.mjs` (only needs `playwright`) and a worked example for [[Knotwork]] with six scenarios.
- Installed as a skill in Gigi's claude.ai account (Settings > Capabilities > Skills).

## What we learned building it
- Cloud sessions only have Chromium; Firefox and WebKit downloads are blocked there. The real three-engine pass runs on Gigi's PC or in CI after `npx playwright install`. The report marks missing engines NOT RUN, never PASS.
- Apps without sign-in (Knotwork) need no accounts: each fresh browser context is a new workspace.
- Failures are rerun from fresh contexts; only ones that come back every time count as FAIL.

## First run (2026-11-09, Knotwork on a local dev server, Chromium)
All six scenarios passed: workspace isolation, shared workspace link, concurrent edit, outside webhook call, workflow limit, phone run. One finding: when two people save the same workflow at once the last save wins with no warning, so one edit is lost silently.

Related: [[Professional UI design skill]], [[Knotwork]].
