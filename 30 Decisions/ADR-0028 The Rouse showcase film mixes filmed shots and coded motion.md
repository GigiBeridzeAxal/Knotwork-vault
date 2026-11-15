---
type: decision
status: accepted
created: 2026-11-15
updated: 2026-11-15
date: 2026-11-15
tags: [decision, rouse, video, higgsfield]
supersedes:
superseded-by:
---
# ADR-0028 The Rouse showcase film mixes filmed shots and coded motion

## Context
On 2026-11-15 Gigi asked for a product showcase video for [[Rouse]], asked which tool gives the best visuals and animation, and then said to use both together. Two tools were on the table: Higgsfield (generated cinematic footage, paid in credits) and coded motion graphics (an HTML stage rendered frame by frame, free). The film had to stay inside the brand ([[ADR-0022 Klein blue and the waking eye for Rouse]]) and could only show what Rouse really does.

## Options considered
1. **Coded motion only.** Exact type, color and real screens, free, but no real room, no person, no 3 AM.
2. **Higgsfield only.** Cinematic, but generated video cannot be trusted with interface text, logos or exact brand color, and every retake costs credits.
3. **Both, each for what it is good at.**

## Decision
- **Both.** Three filmed shots carry the feeling: the room asleep at 03:14, the phone lighting up Klein blue, a hand reaching it. Coded motion carries everything that must be exact: the agent's terminal, the lock screen, the real alert page, three real pages of the app, every word on screen and the end card.
- **The coded part is one deterministic page.** `video/film.html` draws any frame from the time alone, so headless Chromium renders 2,748 frames in parallel and ffmpeg encodes them. No CSS animation, no video editor.
- **Screens are real.** `video/capture.mjs` signs up a made-up person on a local preview, connects "Claude Code" over the real OAuth flow, raises and answers the alerts through the real MCP tools and screenshots the pages.
- **The film claims only what is live.** Calls are not built ([[Rouse pairing and calls plan]]), so the Call rung of the ladder never lights and the answer comes at 41 seconds, before a critical ladder would call.
- **Shots B and C are one take.** B was generated to end on the still that C starts from, so they cut together without a seam.
- **The cut follows the music.** The music bed was generated once, then retimed so its bell lands as the phone lights and its turn lands on the cut to Paper; the ringing and the tap on Approve sit on its pulse.

## Consequences
- The film cost about 31 Higgsfield credits (two stills, three 5-second clips, 47 seconds of music). Coded changes are free and render in about 5 minutes; a new filmed shot costs credits and a download through Gigi's PC ([[Render the Rouse showcase film]]).
- On the Starter plan the clips are 720p at 24 fps and are upscaled and motion-smoothed to 1080p at 60 fps. Sharper footage needs a higher plan.
- Generated motion is not always usable: the arm swing in the third clip looked wrong when smoothed, so the cut dissolves past it. Look at every clip frame by frame before using it.
- Clips, stills and music are not in git; they live in the project files (`rouse/video/source/`). The repo holds the code and the five screenshots.
- When calls ship, the film is out of date in a good way: light the third rung and re-render.
