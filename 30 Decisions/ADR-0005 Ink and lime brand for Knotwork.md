---
type: decision
status: accepted
created: 2026-11-08
updated: 2026-11-09
date: 2026-11-08
tags: [decision]
supersedes:
superseded-by:
---
# ADR-0005 Ink and lime brand for Knotwork

## Context
The first orange and blue palette looked bad to Gigi.

## Decision
Use ink `#0A0B0A`, graphite `#141613`, lime `#C6F432`, chalk `#F2F2EC`, with one-hue OKLCH neutrals at the lime's hue, generated from `system.py`.

## Consequences
- All brand surfaces regenerate from one source.
- The app's `@theme` must be kept in sync by hand.

Related: [[Knotwork design system]]
