---
type: decision
status: accepted
created: 2026-11-11
updated: 2026-11-11
date: 2026-11-11
tags: [decision, brand]
supersedes: "[[ADR-0021 Violet night and dawn brand for Rouse]]"
superseded-by:
---
# ADR-0022 Klein blue and the waking eye for Rouse

## Context
On 2026-11-11 Gigi turned down the violet-and-dawn colors and the sunrise-bell mark from [[ADR-0021 Violet night and dawn brand for Rouse]]. Five marks (Ring, Rungs, Wake, Prompt, Badge) and five palettes (Siren, Klein, Hi-vis, Forest, Bubblegum) were then shown as separate choices that mix on real screens: app icon, phone lock screen alert and home page.

## Options considered
1. **Wake + Klein**: a closed eye with lashes and three rays, in one deep blue.
2. **Ring + Siren**: a ringing lowercase r in red and near-black.
3. **Badge + Forest**: an R with a dot, in dark green and warm yellow.
(Any other mark and palette pair was also open on the same page.)

## Decision
Gigi chose **Klein** blue and the **Wake** eye on 2026-11-11 ("i like klein and eye logo was good"). The name and tagline stay: Rouse, *Wake the human.*

- **Mark**: a sleeping eye, the moment it is woken. It comes in two optical cuts on a 48 grid: a full cut for 32 px and up, and a small cut (fewer, heavier strokes) for 16 to 24 px, so it stays sharp as a tab icon.
- **Brand surfaces** (icon, home page, marketing): Klein `#1534E0` with white type; mist `#CDD6FF` for secondary text; sky `#A9BAFF` only for the eye's rays and highlights.
- **App screens**: a dark navy "night" palette at the same hue (`#0A0E22` background), because a full blue screen at 3 AM is too bright.
- **Type**: Bricolage Grotesque for display, Instrument Sans for text, IBM Plex Mono for labels.
- The ladder (three rising bars that light up as an alert climbs) stays the signature.

## Consequences
- The full token tables, with measured contrast, live in the repo at `docs/brand.md`; the app's `@theme` in `src/index.css` must match it.
- Klein on night is only 2.37:1, so Klein buttons on dark screens always carry a white text label and never rely on color alone.
- No violet, no orange or amber, no sun shapes.

Related: brand page https://claude.ai/artifact/8U8zWScNqjJLWKJadjqg6F (private), [[Rouse]]
