---
type: project
status: active
created: 2026-11-08
updated: 2026-11-09
tags: [design-system, knotwork]
parent: "[[Knotwork]]"
---
# Knotwork design system

Token-driven and measured in a real browser. Gigi asked on 2026-11-08 for pixel-perfect colors and sizes, built the way professional design teams do it.

## Source of truth
`system.py` generates the landing page, the tokens sheet and the brand sheet. **Change a value there and regenerate. Never hand-edit the `.dc.html` boards.** The app mirrors the neutrals in `src/index.css` (`@theme`), so keep it in sync.

Pipeline and README: project files `knotwork/design-system/` (Python generators, Playwright audits, board sources).

## Tokens
| Group | Values |
|---|---|
| Brand | ink `#0A0B0A`, graphite `#141613`, lime `#C6F432`, chalk `#F2F2EC` |
| Status | ok `#3DD68C`, warn `#F5C04A`, error `#F25F5C` |
| Neutrals | inset `#0F100E`, line `#2B2E25`, line-strong `#373B30`, text-2 `#B5B9AE`, text-3 `#909488`, accent-hover `#D1FC5A` |
| Neutral hue | one-hue OKLCH, about 123° (same as the lime) |
| Spacing | 4 to 128 on a 4px base |
| Radii | 8 / 12 / 16 / 24 / 32 / pill |
| Grids | XL 12×78 + 24 gutters in a 1200 container, L 12×58, M 8×74 + 16, S 4×66 + 16 |
| Type | Space Grotesk (display, h2, h3), Inter (body), JetBrains Mono (labels) |

## Quality bar
Last audit: 0 off-token values out of 15,816 read at 6 widths; lowest text contrast 5.69:1; worst optical error 0.28px. Rerun `audit.cjs` after any change and keep it at 0 issues.

Logo: the branching K (option A).
