---
type: decision
status: accepted
created: 2026-11-21
updated: 2026-11-21
date: 2026-11-21
tags: [decision, clients, video, higgsfield]
supersedes:
superseded-by:
---
# ADR-0031 Outreach videos are shot in one AI-built studio set

## Context
On 2026-11-21 Gigi asked for outreach videos for small businesses ([[Client acquisition]]): Gigi talks about the business's problem, in high quality, "like Higgsfield AI" videos, with a studio behind them. A first test cut Gigi out of a bedroom clip and pasted them onto generated rooms; Gigi rejected it as looking terrible. Full AI re-rendering of a whole video on Higgsfield was priced and judged too expensive to be the default.

## Options considered
1. **Cut out and paste onto a background.** Free, but the edges, the kept chair and the unmatched light give it away. Rejected by Gigi.
2. **A new generated background for every video.** Looks different each time and costs credits each time.
3. **One fixed studio set, built once, reused in every video.** Costs credits once; every video looks like the same place.

## Decision
- **One fixed set.** A dark private podcast studio in the gigiberidze.com colours (night navy, blue light, one clay lamp; not the Knotwork lime): oak slat wall, walnut sideboard with a terracotta lamp, a plain grey armchair, a large dark wood table with only a silver laptop and one chair, a floor lamp, a switched-off wall screen on a navy wall, a navy curtain.
- **The set is a sheet of views, not one picture:** wide, presenter view tall (9:16) and wide (16:9), side view with the wall screen, the wall screen straight on (later it shows the client's own page), and two details. See [[Outreach video studio]].
- **Seedream 5.5 renders the set.** The same room was rendered by four image models (GPT Image 2.6, Nano Banana Pro, Seedream 5.5, FLUX 3). With the room as a reference all four kept it; Gigi chose Seedream 5.5, the darkest and most like a real photograph.
- **The room was designed by editing, not by re-rolling.** Gigi picked one of several rooms, then removed things one at a time (second chair, clutter on the desk, blanket, side table) with edits that keep everything else the same.
- **The person comes later.** How Gigi gets into the set (a properly shot clip in a matched virtual set, an AI re-render of the clip, or an AI presenter) is decided by one short screen test, not on paper.

## Consequences
- Building the set cost about 40 Higgsfield credits in total (room options, edits, the four-model comparison, the set sheet). New views of the same room cost 3.5 credits each.
- Image models default to a fast, low quality that looks like a 3D render and too bright. Set images are always made at high quality, prompted as a low-key interior photograph with lamps as the only light and screens off.
- Views drawn from one reference still drift in small things (a chair shape, a table corner). Every new view is checked against the wide shot before it is used.
- Higgsfield cannot receive Gigi's own footage from a cloud session; that upload path has to be solved before the screen test.
- No prospect names are written here or in the project note.
