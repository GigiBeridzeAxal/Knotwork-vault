---
type: project
status: active
created: 2026-11-21
updated: 2026-11-21
tags: [project, clients, video, higgsfield]
url: https://claude.ai/artifact/188eMgBjBMRGtce5pHzCJ6
---
# Outreach video studio

A fixed studio set for the outreach videos in [[Client acquisition]]: Gigi talks to a small business about one of its problems, and every video is set in the same room. Why it is built this way: [[ADR-0031 Outreach videos are shot in one AI-built studio set]]. The visual plan (private artifact) is at the `url` above.

## The room
A dark private podcast studio at night, in the gigiberidze.com colours.
- Left: wall of vertical oak slats with a faint blue light from the top; low walnut sideboard with a terracotta lamp, books, a record player and a plant; a plain grey armchair.
- Centre: large dark wood table with one silver laptop and one chair.
- Back: navy wall with a large wall screen, switched off; a floor lamp in the corner.
- Right: heavy navy curtain. Dark rug, dark floor. Lamps are the only light.

## Set sheet (2026-11-21)
Seven views of the room, Seedream 5.5 at 2K, in the project files under `outreach-video/studio-set/set-sheet/`:

| File | View | Use |
|---|---|---|
| `0-wide.jpg` | Wide, three-quarter | Establishing shot; the reference every other view was made from |
| `1-presenter-tall.jpg` | Across the table, 9:16 | Behind Gigi in vertical videos |
| `2-presenter-wide.jpg` | Across the table, 16:9 | Behind Gigi in horizontal videos |
| `3-side-view.jpg` | About 30° along the table | Gigi at the left, wall screen in view |
| `4-wall-screen.jpg` | Wall screen straight on | The client's page is placed on the screen |
| `5-detail-lamp.jpg`, `6-detail-laptop.jpg` | Close details, 9:16 | Cutaways |

`set-sheet.jpg` shows all seven on one page. The earlier room options, the edit steps and the four-model comparison are in the same `studio-set/` folder.

## How to add a view
1. Use Seedream 5.5 at 2K with the wide shot as the image reference.
2. Start the prompt with "the exact same room as the reference image, same furniture, same materials, same lighting, photographed from a new camera position", then describe where the camera stands and what is left, centre and right.
3. Ask for a low-key interior photograph, lamps as the only light, no people, no readable text.
4. Compare the result with the wide shot (chair, table, sideboard order, lamp positions) before using it.

Image models allow about four jobs at a time; send the rest when the first ones finish.

## Next
- Decide how Gigi gets into the set: one short, properly shot test clip, tried in a matched virtual set and in an AI re-render.
- Solve getting Gigi's footage into Higgsfield (uploads are blocked from cloud sessions).
- Build the per-video pipeline: script, recording, set, captions, the client's page on the wall screen.

## Related
- [[Client acquisition]]
- [[ADR-0028 The Rouse showcase film mixes filmed shots and coded motion]]
