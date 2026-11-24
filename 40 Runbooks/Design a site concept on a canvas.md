---
type: runbook
status: active
created: 2026-11-24
updated: 2026-11-24
tags: [runbook, design, clients]
system: claude.ai
---
# Design a site concept on a canvas

When to use this: Gigi asks to see how a site could look before anything is built, for a lead ([[Client acquisition]]) or for one of the projects. The result is a private design canvas on claude.ai with one artboard per screen. No site code is written in this runbook.

## Steps
1. **Load the design skill** ([[Professional UI design skill]]) and write down the job in one sentence, the one hero thing, and three adjectives for the feel.
2. **Study the brand's own visuals** from the outside: logo, posters, video covers, page colours. Pick the two or three signals worth keeping. Save copies of the pictures used as stand-ins, and note where each came from.
3. **Pick one theme** the whole site can hang on, built from those signals. Write the tokens before any screen: colours by role, one display face, one text face, three weights, the spacing scale.
4. **Start a Design canvas** (the "Design" artifact type on claude.ai). It holds one artboard file per screen and one index file. Read the type's own format page first.
5. **Split the work.** The lead agent writes the first artboard, a shared brief (tokens, type rules, the facts that may be used, how screens link to each other) and a small checker script. Cheaper agents then write one artboard each from that brief ([[Working agreements]]).
6. **Check every artboard in the real viewer at its real size:** desktop 1440 wide, phone 390 wide. Look at the pictures, fix, render again. Two rounds at least.
7. **Measure each artboard's real height** and set it in the index and in the artboard itself. Do not guess it.
8. **Publish one file per call.** Add a title above the row, and one note on the canvas with the idea, the stand-ins and the assumptions. Artboards themselves carry no explaining text.
9. **Save the sources**, the brief, the checker and preview pictures in the project files. Send Gigi the canvas link with the point of view in one line and what changed after the critique.
10. **Stop there.** A working demo follows only after Gigi's OK.

## What to check on every round
- Prices and buttons that wrap onto two lines.
- Long display words that run past the edge at phone width.
- The header at phone width.
- Colours, sizes and weights that are not in the tokens.
- Text contrast (4.5 to 1 or better for body text).
- Facts: every number on a screen is either from the brand's own pages, with the date it was read, or marked as a proposal in the canvas note.

## When the site is not in Latin script
- CSS `text-transform: uppercase` may do nothing for the script. If the script has its own capital forms, type them literally.
- Check that every font has the script's letters and the local currency sign. A mono font often does not: put a font that has them second in its stack.
- A variable font with a width axis gives a strong condensed display face from the same family as the body text.
- Have a native reader proofread the copy before anyone outside sees it.

## If it fails
- **Pictures do not show in the check:** uploaded pictures are served from the artifact's own store, which the check cannot reach. Serve local copies in the check instead; the published canvas is fine.
- **A small artboard cannot be opened in the check:** at overview zoom its play button is one pixel wide. Click it from script by its label.
- **A fixed-size artboard looks soft or small:** it is being scaled to fit. Make the check's window as tall as the artboard plus the viewer's own bars.
- **A button does nothing in the check:** clicks sent by the test browser reach the artboard only sometimes. Press the control from inside the page instead (call its own click from script), and judge the look from the picture. In the real viewer the same button works.
- **A chat screen cuts off its newest message:** make the message list a reversed column with one inner block that has an automatic bottom margin. A short chat then sits at the top and a long one stays pinned to its newest message.
- **The publish is refused:** only one written file per call, and never one of the type's own files.

Related: [[Client acquisition]], [[Professional UI design skill]], [[Review criteria skill]].
