---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-10
tags: [runbook, knotwork, portfolio]
system: "[[Knotwork]]"
---
# Update the Knotwork case study and docs

When to use this: a Knotwork feature lands (secrets, branches, canvas, connectors, teams), a measured number changes, or the screenshots look out of date.

## Where things are
- **Case study**: gigiberidze.com repo, `src/app/work/knotwork/page.tsx` (copy, `FACTS`, `NUMBERS`), screenshots in `public/media/knotwork/`, share image `src/app/work/knotwork/opengraph-image.jpg`. Live at https://gigiberidze.com/work/knotwork.
- **Work card**: `src/components/site/work.tsx`, first entry of `PROJECTS`.
- **User guide**: knotwork repo, `src/pages/DocsPage.tsx`, served at https://knotwork.gigiberidze.com/docs. Limit numbers come from `shared/limits.ts` on their own; anything else is plain text.
- **One-click demo**: https://knotwork.gigiberidze.com/demo (`src/pages/DemoPage.tsx`). The portfolio, README and docs link to it.

## Steps
1. New feature: add a section to `DocsPage.tsx` (and its entry in `SECTIONS`) using the exact button labels from the UI. Move the item out of "What's next" in the case study.
2. New number: only put measured numbers on the case study, with the date measured. Sources: [[Knotwork]], the Knotwork README, [[Knotwork design system]].
3. New screenshots (the case study still shows the list view from 2026-11-09; a canvas screenshot would be better): take them from the live demo account at 1440×900 with device scale 2 (Playwright in Gigi's PC browser works; cloud sessions can't reach the site), save as WebP quality ~82 into `public/media/knotwork/`, and for the README as 1440×900 PNG in `docs/`.
4. Check at 1440 and 390 wide, then open a PR. gigiberidze.com PRs may be merged by agents ([[Working agreements]]) and deploy on merge; Knotwork PRs go through CI and the thread that owns Knotwork deploys.

If it fails: the demo links show the sign-in page if `/demo` isn't deployed yet; that is harmless but costs the visitor a click.
