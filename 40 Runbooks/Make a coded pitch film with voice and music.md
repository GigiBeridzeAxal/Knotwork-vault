---
type: runbook
status: active
created: 2026-11-26
updated: 2026-11-26
tags: [runbook, video, higgsfield, client-acquisition]
---
# Make a coded pitch film with voice and music

How the 92-second pitch film for lead 2 was made (2026-11-26). The film is a web page drawn as a pure function of time and photographed frame by frame. Voice and music come from Higgsfield; sound effects are made in code. See also [[Render the Rouse showcase film]] and [[Client acquisition]].

## What is where
The lead's `showcase-film/v5/` folder in the project files holds the finished film, the silent picture, the cue sheet, the brief, the stage source (one archive) and the sound stems (one archive). Nothing of it is in a repo.

## Steps
1. **Script first.** One line per shot. Spell numbers and Latin abbreviations in Georgian letters for the voice and keep the on-screen spelling separate.
2. **Voice.** One generation for the whole narration, one dialogue turn per line. Cut it by silences, tighten the pauses and write each clip's length into the timeline. It costs credits: ask Gigi first and name a cap.
3. **Stage.** An engine (`core.js`, `timeline.js`) plus one module per act, so acts can be built and checked side by side. `check.mjs` must pass at normal, faster and slower voice. Review contact sheets and full-size stills before any render.
4. **Render in the cloud session** (4 cores): `node render.mjs --sub 12 --jobs 4`, about 8 minutes for 92 s with motion blur. Frames are kept, so a fix re-renders only its range (`--from`, `--to`).
5. **Encode for sending:** `libx264 -crf 20 -preset slow`, about 75 MB at 1920x1080.
6. **Sound:** `sfx.py cues.json sfx.wav`, then `music5.py` (puts the track's drop on a chosen picture time and repeats bars to reach the length), then `mix2.py` (voice at its cues, music ducked under the voice, -16 LUFS, picture copied untouched).
7. **Deliver** the MP4 as a file in the thread. Gigi's ear is the check for pronunciation and music level.

## Getting voice and music into the cloud session
A cloud session cannot download from Higgsfield, and the Higgsfield sandbox cannot receive a big stage. So the sound travels once, as one archive.
1. Pack clips, music and sound tools in the Higgsfield sandbox, upload the archive to Higgsfield media and note its SHA256.
2. Ask Gigi before any download to a computer. With the PC on: Remote Control with a download-only brief, stop it, stage the file. The download session also waits for Gigi's typed yes in the thread.
3. If only another computer is on, files there cannot be staged: Gigi drops the downloaded file into the thread instead.
4. Check the SHA256 before unpacking, and keep the archive with the project files so a re-mix needs no new transfer.

## When it fails
- **Frames come out 1280x720:** the screenshot call needs the clip scale (1.5) for 1920x1080.
- **The file is hundreds of MB:** strong film grain that changes on every frame cannot be compressed. Keep grain faint and change it every second frame.
- **Music too loud after its drop:** lower the bed about 5 dB from the drop on and keep it at least 8 dB under the voice (Gigi's note on the earlier film).
- **Never** put Higgsfield links in a repo or in this vault: they contain an account id.
