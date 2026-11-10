---
type: decision
status: accepted
created: 2026-11-10
updated: 2026-11-10
date: 2026-11-10
tags: [decision, brand]
supersedes:
superseded-by:
---
# ADR-0021 Violet night and dawn brand for Rouse

## Context
[[Rouse]] needed a name and a look clearly different from [[Knotwork]]'s ink and lime ([[ADR-0005 Ink and lime brand for Knotwork]]). Gigi has a high bar for design and rejected Knotwork's first palette, so three directions were shown as real renders of the same 03:14 alert.

## Options considered
1. **Rouse**: violet night, one dawn color, soft serif. Gentle, nocturnal, human.
2. **Holler**: warning-sign yellow and black, condensed capitals. Loud, blunt, industrial.
3. **Beckon**: pager-display grey-green, dark ink, monospace. Precise, quiet.

## Decision
Gigi chose Rouse on 2026-11-10. Tagline "Wake the human." Night `#120E26`, background `#1A1433`, text `#EEE9FA`, one accent dawn `#FFC56E`. Fraunces for display, Instrument Sans for text, IBM Plex Mono for labels. The mark is a sunrise that reads as a bell. The signature is the ladder: three rising bars that light up as an alert climbs.

## Consequences
- The full token table, with measured contrast, lives in the repo at `docs/brand.md`; the app's `@theme` in `src/index.css` must match it.
- Dawn is used for one thing per screen. Borders are below 3:1 on purpose, so nothing may rely on a border alone.

Related: brand directions https://claude.ai/artifact/T5TacpuwMciwf4QaJjdzN6
