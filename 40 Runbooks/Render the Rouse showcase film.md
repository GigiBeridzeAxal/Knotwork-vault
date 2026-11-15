---
type: runbook
status: active
created: 2026-11-15
updated: 2026-11-15
tags: [runbook, rouse, video, higgsfield]
system: "[[Rouse]]"
---
# Render the Rouse showcase film

Re-renders or changes the 46-second film of [[Rouse]]. Why it is built this way: [[ADR-0028 The Rouse showcase film mixes filmed shots and coded motion]]. The code and its own README are in `video/` in the rouse repo.

## What is where
- **Finished film and poster:** `rouse/video/` in the project files.
- **Source clips, stills and music:** `rouse/video/source/` in the project files (about 15 MB, not in git).
- **Code:** `video/` in the repo: `film.html` and `film.js` (the film), `capture.mjs` (real screenshots), `footage.sh` (clips to frames, music retimed), `render.mjs`, `still.mjs`, `strip.mjs`.

## Change words, timing or a coded scene
1. Edit `video/film.js` (times are in `AT`, captions in `CAPTIONS`) or `video/film.html`.
2. Look before rendering: `node video/still.mjs 16 26.5 43` writes single frames, `node video/strip.mjs open 23.6 24.8 0.1` writes a contact sheet of a stretch.
3. `video/footage.sh <folder with the sources>` once per machine, then `node video/render.mjs`. Each takes about 5 minutes on 4 cores; the result is `video/out/rouse-showcase.mp4`.

## Refresh the app screenshots
At the repo root: `E2E_FAKE_DB=1 npm run build && npx vite preview --port 4173`, then `node video/capture.mjs`. Start a fresh preview each time; the test database lives in its memory. `capture.mjs` signs up a made-up account with a known password, so it stops before doing anything if the build in `dist/` was not made with `E2E_FAKE_DB=1`. Sign-up on a local preview needs `AUTH_PEPPER` and `MONGODB_URI` in `.dev.vars` (any values: the fake database never dials out).

## Redo a filmed shot (costs Higgsfield credits: ask Gigi first)
1. Stills with GPT Image (about 1 credit each), 16:9: the dark room, then the same frame with the phone lit Klein blue.
2. Clips with Kling 3.0, standard mode, 5 seconds, sound off (7.5 credits each): A from the dark still, B from the dark still to the lit still, C from the lit still. B must end on C's first frame.
3. Music with ElevenLabs Music, 47 seconds, instrumental (about 7 credits). A new track has its own beat: measure it and update `BEAT` in `film.js` and the retime in `footage.sh`.
4. Look at each clip frame by frame (`ffmpeg ... tile`) before using it.

## Get Higgsfield files into a cloud session
The host Higgsfield serves results from is not on the cloud sessions' network allowlist, so `curl` gets a 403 there. Route that works:
1. Start a Remote Control session on Gigi's PC in `Downloads` and have it download the result links with `curl.exe` into `Downloads\rouse-video\ai`. Tell it to do only that.
2. Stop Remote Control, then stage the files from that folder into the cloud session.

## When it fails
- **`capture.mjs` says the build does not use the test database:** run `E2E_FAKE_DB=1 npm run build` again and start a fresh preview.
- **A shot shows a still that does not move:** `video/assets/ai/manifest.js` is missing. Run `footage.sh`.
- **The film is silent:** `video/assets/music.wav` is missing. Same fix.
- **Kling refuses "pro" mode:** it needs the Plus plan. Use standard mode.
- **An image prompt is refused as unsafe:** take out any mention of bare skin; "a person asleep under a duvet" passes.
- **The render is slow:** every frame is a lossless screenshot; the night scenes with blur and grain take longest. Render a stretch with `--from` and `--to` while working.
