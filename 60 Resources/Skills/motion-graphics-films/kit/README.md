# Motion graphics films: kit

A reference stage and tools from a 92-second pitch film (2026-11). Plain files: no build step, no network at run time. Needs Node with the `playwright` package and its Chromium, `ffmpeg`, and Python 3 with Pillow (sound tools: numpy, scipy, soundfile, librosa; transcription check: faster-whisper).

## stage/
- `core.js`, `core.css`: the engine. `window.seek(t)` draws any moment as a pure function of t. Acts, camera (pose keys, creep, motion blur intervals, whoosh on fast moves), easings, life and mask helpers, typing, taps with a finger and ripple, chapter stubs, joins (a tilted colour band with a plane), grain, the sound-event export `window.FILM`.
- Theme components (replace them with the next client's own objects): split-flap board `K.flap`, boarding pass `K.passHTML`, stamp, browser and phone frames, dashed route `K.route`.
- `timeline.js`: fps, lead and tail, act order, opening colours, chapters, shared motion lengths (`fx`).
- `kit.html` + `kit.js` + `kit.tl.js`: every shared component moving; the worked example of an act. Open `kit.html` or run `node strips.mjs --page kit.html`.
- `CORE.md`: the engine's API with one example per helper (every example ran).
- `render.mjs`: frames (JPEG q95, kept for range re-renders) with sub-frame motion blur, then H.264. `strips.mjs`: contact sheets, full-size stills (`--live`), 8-frame strips (`--at`). `check.mjs`: the automatic checks at voice x1, x0.85, x1.2. `tools/retime5.py`: writes measured voice lengths into the act timelines.
- `render.mjs` and `check.mjs` load `film.html`: write one for the new film that lists `core.css`, `timeline.js`, each act's `.tl.js`, `core.js`, then each act's `.js` and `.css` (the same order as `kit.html`). Outputs go to `../out/v5/`.
- `assets/fonts/`: Inter and Noto Sans Georgian (OFL-1.1, see `assets/SOURCES.txt`).

## sound/
- `split.py`: cuts one narration take into line clips by silences and transcription.
- `tight.py`: pauses down to 0.14 s, then tempo 1.10 with pitch kept.
- `voicestats.py`: reading pace and pauses of a take.
- `sfx.py cues.json sfx.wav`: the effects track from the stage's exported sound events.
- `music5.py music.mp3 out.wav --hit T --len L [--insert 8,8,4]`: puts the track's drop on picture time T and repeats whole bars to reach the film length.
- `mix2.py picture.mp4 cues.json clipsdir sfx.wav out.mp4 --music out.wav --music-db -11 --sfx-db -6`: voice at its cues, ducked music, -16 LUFS, picture copied.

The full method is in `../SKILL.md`.
