---
type: decision
status: proposed
created: 2026-11-25
updated: 2026-11-25
date: 2026-11-25
tags: [decision, site, assistant]
supersedes:
superseded-by:
---
# ADR-0035 Onyx speaks first from a script kept in the visitor's browser

## Context
On 2026-11-25, hours after Onyx went live ([[ADR-0034 The site assistant answers from the site's facts on a free model]]), Gigi asked that he not wait for visitors to talk to him. He should greet everyone first, comment on the portfolio on his own ("I love this Knotwork, it's my favorite 🙂"), remember returning visitors ("welcome back", "რამე დაგრჩა?") instead of starting from scratch, have about 500 prescripted interactions, be visible everywhere from the first load, and have his emotions and movements chosen by the script and the model. A paid model API may come later; this is the system to set up first.

## Options considered
1. The model writes every comment. It would spend the free allowance (10,000 neurons a day) on people who never asked anything, each comment would wait for a round trip, and what he says would be unpredictable.
2. Fixed lines with rules, picked in the browser by what the visitor does.
3. Both: scripted lines, with the model filling in where no line fits.

## Decision
Option 2, built in gigiberidze.com PR #16. Status stays `proposed` until Gigi merges it.
- A script of 581 lines (455 English, 126 Georgian; 575 at first, 6 added after the review), picked in the browser by what the visitor does: arriving, coming back, opening a page, a section reaching the middle of the screen, hovering or clicking a link, idling, reading long, rushing, reaching the end, coming back to the tab, selecting text, copying the email, poking him, the chat.
- Pacing limits so he stays charming and not a nuisance, a mute, and nothing while the visitor types or the chat is open.
- Memory in the visitor's own `localStorage` only: visits, pages seen, lines already said, whether he is muted; the chat for 30 days from the last message; everything expires after 180 days without a visit. "Forget me" clears it. Nothing is sent anywhere.
- The model keeps answering questions in the chat, and may now pick a look and a movement by tag (`[mood:x]`, `[anim:x]`, checked against fixed lists by the Worker).
- ADR-0034's "fixed list of moods" grows from 8 to 12 looks (love, wink, proud and shy added) plus 14 movements. The lists are still fixed; the character's look is unchanged.

ADR-0034 is not superseded: the chat works as it decided.

## Consequences
- It costs nothing and uses none of the model allowance. Lines show at once, with no network.
- Lines must stay true to the site. A line that quotes a number (1.7 s to 50 ms, 15,816 values, 300+ tests) must change when the page changes. `test/script.test.ts` guards the form (length, emoji, links, banned claims), not the facts.
- A shared browser shows the previous visitor's chat for up to 30 days unless they press "Forget me". The chat window says "Kept in this browser for 30 days." next to that button.
- The first page load grew by about 9 KB of JavaScript (gzip). The lines load later, as their own files: English when the page is idle (about 19 KB gzip), Georgian only for a Georgian visitor (about 7 KB), neither while he is muted.
- The Georgian lines need a proofread by Gigi.
- How to work on it: [[gigiberidze.com]] (section "Site assistant (Onyx)") and [[Test the site assistant]].
