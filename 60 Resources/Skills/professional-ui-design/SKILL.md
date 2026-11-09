---
name: professional-ui-design
description: Design or redesign any UI, web page, dashboard, landing page or visual like a senior product designer - hierarchy, type, color, spacing, layout, restraint, and a critique pass before showing it.
---

# Professional UI design

Use this whenever you design, restyle, or critique an interface: a landing page, an app screen, a dashboard, a component, a slide, a poster. The goal is work that looks like it came from a senior designer at a good product studio, not a template.

Professionals are not better at decoration. They are better at **deciding**: one idea per screen, one accent, a strict scale, and the discipline to remove things. Follow the process, then the rules, then run the critique before you show anything.

---

## 1. Process (do this before writing CSS)

1. **Name the job.** One sentence: who is looking, what they must understand in 3 seconds, and what they should do next. If you can't write it, you can't design it.
2. **Find the one hero thing.** Every screen has exactly one thing that matters most (a status, a number, a headline, a primary action). Everything else is supporting cast and must look quieter.
3. **Collect references.** Think of 2 to 3 real products known for craft in this category (e.g. Linear, Stripe, Vercel, Raycast, Arc, Things, Apple product pages). Name what specifically you borrow: density, type pairing, how they use color. Borrow principles, never copy layouts or brand assets.
4. **Pick a point of view.** Write 3 adjectives for the feel (e.g. "calm, precise, technical"). Each later decision must serve them. "Clean and modern" is not a point of view; every template is clean and modern.
5. **Offer 2 to 3 directions when the look is open.** Small, real renders of the same screen in different points of view (e.g. "editorial", "technical", "playful"), each one sentence. Let the person pick before polishing. Picking is far easier than describing taste.
6. **Lay out in grayscale first.** Get hierarchy right with size, weight, and space only. Add color last. If it doesn't work in gray, color won't save it.
7. **Build from tokens** (section 3), never from one-off values.
8. **Render it and look at it** at desktop (1440) and phone (390) widths. Take a screenshot and critique the pixels, not the code (section 9).
9. **Iterate at least once.** The first version is a draft. Fix the top 3 critique findings, then show it.

---

## 2. Hierarchy: the thing that separates pro from amateur

- **Squint test.** Blur your eyes (or the screenshot). You should see one dominant element, 2 to 3 secondary groups, and quiet detail. If everything is equally loud, nothing is.
- **Use contrast of size, weight and color together, sparingly.** A big jump beats many small ones. Headline 48px vs body 16px reads as intentional; 20 vs 18 reads as a mistake.
- **De-emphasize instead of emphasizing.** Make secondary text gray (lower contrast) rather than making primary text bigger and bolder. Labels are quieter than values.
- **One primary action per view.** Secondary actions are ghost or outline buttons; tertiary are text links.
- **Labels are often unnecessary.** "Email: jane@x.com" becomes just the email with an icon. Data usually explains itself.
- **Proximity groups.** Space between groups must be clearly bigger than space within a group (at least 2x). Use space before you reach for borders or boxes.
- **Fewer containers.** Amateurs put every item in a card with a border and shadow. Pros use whitespace, alignment and an occasional divider. A card is for something that is genuinely a separate object.

---

## 3. Tokens: build a system before a screen

Define these once (CSS custom properties or Tailwind theme) and use nothing else.

**Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. No 13px, no 22px.
- Inside a component: 8 to 16. Between components: 24 to 32. Between sections: 64 to 128.
- Generous whitespace is the cheapest way to look expensive. When in doubt, double the section spacing.

**Type scale (modular, about 1.25 ratio):** 12, 14, 16, 20, 24, 32, 40, 48, 64, 80.
- Body 16 (15 to 17 for dense apps). Never body under 14.
- Pick by role, not by element: display, h1, h2, h3, body, small, label, mono.

**Radius scale:** pick a family and stay in it: 4/8/12/16/pill (soft) or 0/2/4 (sharp, technical). Nested radius rule: inner radius = outer radius minus padding.

**Shadows:** 2 to 3 levels max, built from two layers (a tight dark one + a wide soft one), low opacity. On dark UIs, use lighter surfaces and 1px borders instead of shadows.

**Color tokens:** named by role, not by hue: `bg`, `surface`, `surface-2`, `border`, `text`, `text-2`, `text-3`, `accent`, `accent-hover`, `success`, `warning`, `danger`, `focus`.

---

## 4. Typography

- **One or two families.** A strong sans for everything is enough (Inter, Geist, IBM Plex Sans, Söhne-like alternatives). Optionally a display face for headlines (Space Grotesk, Instrument Serif, Fraunces, Clash/General Sans style) and a mono for code, numbers and labels (JetBrains Mono, Geist Mono, IBM Plex Mono).
- **Headlines:** tight line-height (1.0 to 1.15) and slight negative tracking (-0.01 to -0.03em) at large sizes. Weight 500 to 700; very bold display only for short words.
- **Body:** line-height 1.5 to 1.65, line length 50 to 75 characters (`max-width: 65ch`). Long full-width paragraphs are the most common amateur tell.
- **Small caps labels / eyebrow text:** 11 to 13px, uppercase, +0.06 to +0.12em tracking, `text-3` color. Use for section labels, not for sentences.
- **Numbers:** use `font-variant-numeric: tabular-nums` in tables, stats, timers.
- **Weights:** 2 to 3 per page (400, 500, 600). Don't use bold for emphasis everywhere.
- **Alignment:** left-align almost everything. Center only short hero text and empty states. Never center body paragraphs.
- **Real copy, not lorem ipsum.** Specific, short, concrete text makes a design look finished. "All 4 workflows are holding" beats "Dashboard overview".
- **Optical details:** hanging punctuation for quotes, large headings aligned to their visual edge, no orphans (one word on the last line) in headlines (`text-wrap: balance`; body `text-wrap: pretty`).

---

## 5. Color: where most designs go wrong

**The 60/30/10 rule:** ~60% background neutral, ~30% surface/secondary neutral, ≤10% accent. In app UIs the accent is often closer to 2 to 5%.

**Rules**
- **Neutrals carry the design.** Build a 10 to 12 step neutral ramp. Tint it slightly toward your brand hue (pure #808080 gray looks dead). Work in OKLCH so steps look even.
- **One accent.** Use it only for the single most important action or state on screen. If the accent appears in 8 places it stops meaning anything and the page looks loud.
- **Semantic colors are signals, not decoration.** Red/amber only when something needs attention. Success can often be quiet (neutral text with a small check), because the normal state shouldn't shout.
- **Don't let colors fight.** Two saturated hues of similar lightness next to each other (e.g. lime and mint, red and pink) clash. Keep one saturated hue per view; make the others desaturated or neutral.
- **Never pure black on pure white for large UI** (#000 on #fff vibrates). Use near-black (e.g. #0A0A0A to #111) and off-white (#FAFAF9). For dark mode, background around #0B0B0C to #121212, not #000, and text around #EDEDED, not #fff.
- **Dark mode is not inverted light mode.** Elevation goes lighter, not darker. Reduce saturation of accents a little. Borders do the work shadows did.
- **Gradients:** subtle, same-hue or adjacent hues, low contrast. Avoid rainbow and purple-to-blue "AI" gradients unless that's the brand.
- **Check contrast:** body text ≥ 4.5:1, large text and UI parts ≥ 3:1 (WCAG AA). Gray-on-gray secondary text is the most common accessibility failure.

**Building a palette fast**
1. Pick the brand hue and one accent value (high chroma, decent lightness).
2. Generate the neutral ramp at that hue with very low chroma (0.005 to 0.02 in OKLCH).
3. Map roles: bg = step 0/1, surface = 1/2, border = 3/4, text-3 = 6, text-2 = 8, text = 11.
4. Pick semantic colors with the same lightness as each other so none jumps out unfairly.
5. Show the palette to the person on a real screen, not as swatches. People judge color in context.

---

## 6. Layout and grid

- **Use a grid.** 12 columns desktop (container 1120 to 1280, gutters 24), 8 columns tablet, 4 columns phone (16px side margins). Snap everything to it.
- **Consistent alignment lines.** Count the distinct left edges on the page; fewer is better. Every element should align with something.
- **Content width:** text blocks narrow (≤ 720px), data and media can go wide.
- **Asymmetry with intent** looks designed; everything centered looks like a template. Try a 7/5 or 8/4 split for hero and feature sections.
- **Vertical rhythm:** section padding from the scale (e.g. 96 desktop, 64 phone), identical between all sections of the same kind.
- **Responsive is redesign, not shrink.** On phone: stack, reduce type scale one or two steps, keep tap targets ≥ 44px, no horizontal scroll, hide nothing essential.
- **Density matches the job.** Marketing pages breathe; tools for daily use can be dense (Linear, Figma) but stay aligned and calm.

---

## 7. Components and detail (the "craft" layer)

- **Buttons:** height 36 to 44, horizontal padding ≈ 2x vertical, one primary style, label says the result ("Create workflow", not "Submit"). Hover, active, focus-visible and disabled states all designed.
- **Inputs:** same height as buttons, visible label above, clear focus ring (2px, accent or `focus` color with offset), helpful error text below in danger color.
- **Icons:** one set only (Lucide, Phosphor, Heroicons), one stroke width, sized to the text (16 with 14 to 16 text, 20 with 16 to 18). Icons support text, rarely replace it.
- **Borders:** 1px, low-contrast. Prefer one subtle border OR one soft shadow, not both, not heavy.
- **Empty, loading and error states** are part of the design: skeletons that match final layout, empty states with one sentence and one action.
- **Motion:** 150 to 250ms, ease-out for entering, ease-in for leaving; move small distances (4 to 12px) and fade. Respect `prefers-reduced-motion`. Motion explains change; it isn't decoration.
- **Images and illustration:** one consistent style. Real product screenshots beat stock photos. Crop with intent.
- **Data viz:** remove chart junk (heavy gridlines, 3D, legends you can label directly). Highlight the one series that matters; gray the rest.

---

## 8. What makes a design look "boring" or "cheap" (and the fix)

| Symptom | Fix |
|---|---|
| Generic admin template: 4 KPI cards + bar chart + table | Lead with the answer as a sentence or one big stat ("All 4 workflows are holding."), then detail. Design around the user's question, not around widget types. |
| Everything the same size and weight | Create one dominant element; push the rest down in contrast. |
| Accent color everywhere | Accent on one thing per view; everything else neutral. |
| Colors clash or feel "bad" | Fewer hues; tinted neutrals; matched lightness for semantic colors; check in context. |
| Cramped | Double the section spacing; widen gaps between groups. |
| Boxes in boxes in boxes | Remove borders; group with space and alignment. |
| Default fonts, default sizes | Real type scale, tight headline tracking, a display face for personality. |
| Lorem ipsum, "Welcome to Dashboard" | Specific, human copy with real-looking data. |
| No personality | One signature element used consistently (a distinct type pairing, a graphic motif, a way of showing status, a shape). |
| Looks good at 1440, broken at 390 | Design the phone layout deliberately. |

---

## 9. Critique checklist (run before showing anything)

Render the page and screenshot it at 1440 and 390. If you can run a browser (e.g. Playwright), measure instead of eyeballing: read computed styles and flag any color, size or spacing not in the tokens, and compute text contrast. Then answer honestly, and fix anything that fails:

**Clarity**
- [ ] In 3 seconds, is the one hero thing obvious? (squint test)
- [ ] Is there exactly one primary action per view?
- [ ] Could any element be removed without loss? Remove it.

**System**
- [ ] Every spacing, size, radius and color comes from the tokens.
- [ ] Gaps between groups are clearly larger than gaps within groups.
- [ ] Few distinct alignment edges; everything sits on the grid.

**Type**
- [ ] Body line length ≤ 75ch, line-height ≥ 1.5.
- [ ] No more than 2 families and 3 weights.
- [ ] Headlines have tight leading and no orphans.

**Color**
- [ ] Accent used on ≤ 10% of the surface and only where it means something.
- [ ] No two saturated hues fighting; neutrals tinted, not pure gray.
- [ ] Text contrast ≥ 4.5:1 (body) and ≥ 3:1 (large text, UI parts).

**Craft**
- [ ] Hover, focus-visible, disabled, empty, loading and error states exist.
- [ ] Phone layout is intentional, tap targets ≥ 44px, no horizontal scroll.
- [ ] Copy is specific and short; no placeholder text.

**Taste**
- [ ] Would this fit next to the reference products from step 3? If not, what's the biggest gap? Fix that first.
- [ ] Does it have one memorable signature, or could it be any template?

When presenting, show screenshots, state the point of view in one line, and list what you changed after critique. If the person rejects something ("boring", "bad colors"), ask or infer *which* part, write it down as a rule for the project, and apply it everywhere, not just to the one screen.

---

## 10. Working with an existing brand or design system

- Read the existing tokens first and use them. Never introduce new colors or sizes silently; propose a token change instead.
- Match the existing voice of components before inventing new ones.
- If the system has gaps, add the token to the system, then use it.
- Keep a short "design rules" note for the project (what the person liked, what they rejected, and why) and re-read it before each new screen.
