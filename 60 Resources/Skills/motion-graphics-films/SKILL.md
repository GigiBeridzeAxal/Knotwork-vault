---
name: motion-graphics-films
description: Make studio-quality motion graphics films in code (launch, pitch, product or explainer videos): concept, script, camera, type, voice, music, render and delivery.
---

# Motion graphics films

Use this whenever someone wants a video that should look like it came from a motion studio: a product launch film, a pitch film for a client, a product showcase, an explainer, an animated ad. The film is built as a web page that draws any moment as a pure function of time, photographed frame by frame, then given a voice, music and sound effects.

It was learned the hard way on a series of pitch films (2026-11): a static slideshow version was rejected, a dynamic rebuild was called "perfect", and a 92-second version with its own motion system was accepted. The bar is the person's taste, not a checklist, but every rule below comes from something that was rejected or praised.

---

## 1. The bar: what was rejected and what was praised

**Rejected** (in the person's words): "the voice sounds like an old man speaking slowly", "boring", "the effects look so bad", "too slow". The rejected film was a window on one side and bullet points fading in on the other, 62 seconds, a camera that never moved. Also rejected elsewhere: people cut out and pasted onto backgrounds ("looks terrible").

**Praised:** "dynamic, fast camera movement, zoom in, zoom out", studio launch films (Zelios-style) as the reference, and a new picture every second or two. After one fix ("music is a bit loud after half of the video, make it balanced") it was "perfect".

**Asked for next:** "attractive and creative", "research professionals and change on screen things fully". What answered it: a motion system built from the client's own design language, not a generic template.

So the target is: never still, big type, the camera going to the detail, one hero per picture, a voice that is brisk and warm, music balanced under it, and an idea that belongs to this client only.

---

## 2. Process

1. **Name the viewer and the one thing they must believe.** One sentence. A business owner who is not technical needs to see their own problem, then the fix, then the result. Write the story so it works **with the sound off**.
2. **Plan first.** For a new film, show a one-page plan (concept, recurring objects, acts with seconds, look, what is real and what is concept) and get an OK before building, unless the person already said go.
3. **Script, one line per shot.** Lines of 1 to 5 seconds. Keep two spellings per line: `say` (what the voice reads: numbers and Latin abbreviations written out in the script's own letters) and `show` (what is on screen). If the person writes their own script, use it; soften only claims that cannot be proven, and say which.
4. **Find the motion system.** Take 3 or 4 recurring objects from the client's own world (for a travel agency: a split-flap departures board, boarding passes, passport stamps, a plane on a dashed route). Every transition is carried by one of them. Each chapter has a token that stays on screen (a stub in a corner) so the viewer always knows where they are. This is what makes it "creative" instead of a template.
5. **Colour script.** Decide which world each part lives in (for example ink night for the problem, yellow for the solution, paper for proof) and change the background colour only at those beats. The problem part has no brand colour at all; the brand colour arrives with "we change this".
6. **Record the voice before building the picture** (section 7). Measure each line and time the picture to the voice, not the other way round.
7. **Build the stage** (section 8): engine first, then one module per act. Large films: an engine agent, then act agents in parallel (section 9).
8. **Review loops**, at least four per act: block, design (full-size stills), motion (8-frame strips over every fast move), polish (automatic checks). Then the whole film on contact sheets, one frame per second.
9. **Render, mix, deliver** (sections 10 and 11). When sound is held up, send a silent preview of the picture so the person can react early.
10. **Ask for the person's ear.** You cannot hear the result. Always name what to listen to: pronunciation of numbers and foreign words, the music level, the music seam.

---

## 3. Studio rules (each can be checked on a still or a 2-second strip)

1. **Never still.** Every frame differs from the one before. When nothing happens the camera creeps (a push of 1 to 2% a second). The last second still drifts.
2. **A new picture every 1 to 2 seconds.** No framing lasts more than 2.5 s without a camera move, a new element or a cut.
3. **The camera goes to the detail.** UI is never shown whole and small. Push into the one row, sentence or button that matters until it fills about a third of the frame, then pull out or whip to the next.
4. **One hero per picture.** It is the only saturated thing in frame; everything else is neutral or dimmed 40 to 55%. If a still feels crowded, remove elements before shrinking them.
5. **Moves carry the cut.** Changes of place are whips, zoom-throughs and colour floods of 0.3 to 0.5 s with motion blur. No cross-fades. Nothing simply fades in where it stands: things arrive from somewhere (slide, scale, mask reveal, drop).
6. **Shapes carry transitions.** Reuse the same shapes so a scene change is a shape becoming another shape, or a zoom into a real sub-frame (a screen, a tile, a search box). Never zoom into a random corner. No transition may imply a step that does not exist in the product.
7. **Match cuts.** Outgoing and incoming subjects sit at the same place with a similar silhouette; the cut lands at peak speed and the next shot is already moving on its first frame.
8. **Hand-shaped easing.** Arrivals ease out hard (expo or quint) in 0.3 to 0.5 s; exits ease in, 0.15 to 0.25 s; only the camera eases in and out. Overshoot only on small pops (chips, taps, checks), never on prices, text being read or the camera. Big pushes may anticipate (a 2 to 3% pull back in the 0.12 s before). Linear only for the creep.
9. **Faster than feels safe, then hold.** Build each move about 30% faster than feels comfortable, then give the settled picture 0.5 s (0.9 s for text that must be read). Shorten the waiting, never the proof: a booked state, a number, a brand name in an answer stays long enough to read.
10. **One or two properties per move.** Richness comes from layers moving differently (parallax), not one layer doing everything.
11. **Stagger.** Things that arrive together arrive 0.03 to 0.09 s apart, never on the same frame.
12. **Taps look like taps.** Press to 0.94, release to 1.03 then 1, a ripple ring; the result starts 0.08 to 0.12 s after release. One soft round pointer; the camera follows it with a 3 to 5 frame lag.
13. **A sound on every big move** (whoosh on whips, slam on stamps, pops on chips, typing on typing, a riser into the big reveal).
14. **Unequal time.** The richest idea gets the most time; the simplest gets the least.
15. **Ending.** One resolved result, let it settle, then one call to action. Nothing else. No logo intro at the start: the first 2 seconds are already moving and already say something.

---

## 4. Type

- **Big and few.** 2 to 4 words at a time, timed to the spoken word. Words slam, slide out of a mask or punch in one after another. No paragraphs, no bullet lists on screen.
- **Readable on a phone.** The film is watched in a player about 360 px wide. On a 1280 x 720 design stage that is 0.28x: key words 130 px or more, full-frame type 150 to 190 px, callouts 72 to 92 px; UI that must be read is brought by the camera to 28 px or more on screen.
- Line breaks keep a modifier with its noun; never one short word alone on a line.
- One display face and one text face per script, loaded from files in the stage (never from the operating system, or renders differ between machines). For Georgian: Noto Sans Georgian, condensed (font-stretch 62.5%), weight 900, capitals typed as literal Mtavruli letters (never `text-transform`); Latin and digits in Inter, tabular figures on counters.
- Contrast at least 4.5:1 for text and 3:1 for very large type, on the weakest frame of the move.

---

## 5. Look, depth and texture

- **Tokens first:** 3 base colours (for example ink, paper, one brand colour), 2 or 3 greys, and one alert colour used only for the problem. No other hues.
- **Worlds** are a base colour with two or three large soft radial patches (gradients, not blur filters).
- **Depth:** UI planes tilt in 3D while they arrive (perspective about 1800 px, rotateY 6 to 18 deg, rotateX 4 to 12 deg) and flatten as the camera comes to read them. Cards have thickness (a darker stacked edge of 6 to 8 px) and a contact shadow that follows the lift. Background patches move at 0.3x the subject, stickers at 1.1x. One light sweep (a soft band at 30 deg) crosses a hero once when it lands.
- **Stickers and plates:** solid fill, 3 px dark border, hard offset shadow (6 px 6 px 0), rotated -3 to 3 deg. Labels in one fixed corner.
- **Grain:** a fine grain over the frame so flat colour never looks like a slide. Keep it faint (about 2% opacity) and change its pattern every second frame; per-frame grain at 10% made a 450 MB file.
- **Banned as dated:** glossy plastic gradients, glassmorphism, generic rounded corporate cards, purple or blue glows, emoji, stock icons, cut-out people pasted on backgrounds. Prefer flat, printed, type-led and textured.

---

## 6. Honesty (non-negotiable)

- Mark what is what, with a small label pill visible whenever the thing is on screen: real material (`real answer · date`), the demo (`demo site · address`), anything made up (`concept`), and any calculation (`estimate: 52 weeks × ~4,000`).
- No invented facts: no statistics, user counts, waiting times, star ratings or "#1" positions. Show search ranking rising only as a concept and say so. Only data the client or the demo really has.
- Real screenshots stay real: never redraw, crop out or reuse their logos and photos as separate elements.
- Other companies' products appear as plain text names only: no logos, brand colours or brand fonts.
- No phone numbers of anyone; cover them with grey bars in real screenshots. Payments only on a clearly marked test page, never card fields.
- Follow the project's own wording rules (for example "assistant", never "AI", and no model names).

---

## 7. Voice

- **One generation for the whole narration**, one dialogue turn per line, so the voice stays consistent and daily generation limits are not hit. Split it into lines by silences afterwards.
- **Choose the voice with the person.** Offer 2 or 3 voices reading the same opening line, and let them pick. Slow, old-sounding voices were rejected; a brisk, warm one was chosen.
- **Tighten every clip:** cut every pause longer than 0.14 s down to 0.14 s, then speed up by 1.10 with pitch kept (`tight.py`). This turned "slow" into "dynamic".
- **Check by transcription** (Whisper large-v3 in the script's language): a match near 1 means the line was read as written. A low match is a bad cut, a misread, or Whisper's own mistake. One check heard "2036" where the voice said "2026", and the person confirmed it was right. You cannot hear: the person's ear decides.
- Write numbers and Latin abbreviations as the voice should say them (`say`), and ask the person to listen to exactly those.
- Voice and music generators cost credits: ask before spending and name a cap.

---

## 8. The stage (how the film is built)

- **`window.seek(t)` draws the film at time t as a pure function of t.** No CSS animations or transitions, no timers, no `Date`, no `Math.random` (use a seeded hash of an index). Any t in any order gives the same picture. `window.ready` resolves when fonts and images have loaded.
- **All timing in timeline files**, none in drawing code. Shots are `{ id, vis, dur, say, lead, tail, at, cam, snd }`. Shot length = max(vis, lead + dur + tail), rounded up to a frame. Event times: seconds from the shot start, negative from its end, `'40%'` of the shot, `'v40%'` of the narration (use this for anything that lands on a spoken word), `'key+0.1'`, or `[a, b]` for the later of two.
- **The film must survive a different voice.** Automatic check: every `dur` multiplied by 0.85 and by 1.2 still passes. A removable shot (for example a money line) is guarded so the film also passes without it.
- **Camera** per world: pose keys (`{x, y, z, r}` or `{el, z, ax, ay}` to frame an element), quint ease in and out, a constant creep, and automatic motion blur and a whoosh sound on fast moves.
- **Exports** for the sound stage: `window.FILM = { len, fps, cues: [{id, t, voiceAt, dur}], blur: [[t0, t1]], sfx: [{t, name, gain, d}] }`.
- **Motion blur:** a frame inside a blur interval is the mean of 8 to 16 sub-frames spread over 80% of the frame time.
- **Budgets:** a frame must draw and screenshot in about 0.35 s at 1920 x 1080. No large `filter: blur()`, no full-frame `backdrop-filter`, no SVG turbulence.
- **Automatic checks** (`check.mjs`): no console errors, narration never outruns its shot, never 2.5 s without a camera key or new element, honesty labels visible, stickers and labels not cut by the frame or overlapping while settled, reserved corners free, no fallback font, seek-order purity.
- **Review tools** (`strips.mjs`): a contact sheet every 0.5 s; full-size stills at chosen times (check sharpness at the tightest camera pose); 8 consecutive frames from any time (check a clear start, a blurred middle, a clean settle, no pops).

---

## 9. Working with agents on a big film

- On a strong model, plan and review; hand the building to cheaper agents.
- **Engine agent first:** the engine, shared components (with a kit page that shows each one moving), the tools and an API guide where every example has run.
- **Then one agent per act, in parallel.** Each act mounts alone (`film.html?only=a2`) so agents do not break each other. Each edits only its own three files (timeline, drawing, CSS with every selector prefixed by the act).
- **Brief each act agent** with: the whole brief (so its act feels like the same film), the API guide, the kit sheet, the previous approved film as reference, the four review rounds, the hard rules, and a report that lists every doubt and known flaw shot by shot ("a flaw you report is worth more than a clean report").
- **Review every act yourself** on its contact sheet and full-size stills, send one fix round, then check the whole film in one piece. Joins between acts are owned by the engine (a coloured band sweeps the frame), so acts need not match.

---

## 10. Sound

- **Effects** are made in code from the exported list (`sfx.py`): whoosh, big whoosh, riser, slam, pop, typing, tap, swish, ding, sub, split-flap run. Every fast camera move, join, stamp and tap gets one.
- **Music:** one instrumental track. Find its beat and its drop, then cut and repeat whole bars so the drop lands on the film's key moment (the reveal, "we change this") and the track ends by itself just after the film (`music5.py --hit T --len L`). Seams on downbeats, 10 ms crossfades.
- **Balance:** keep the music at least 8 dB under the voice in both halves, about 5 dB lower after the drop, and duck it under speech with a sidechain. "Music a bit loud after half of the video" was the one fix the person asked for on the film they called perfect.
- **Mix** (`mix2.py`): voice clips at their cue times, effects at -6 dB, music at -11 dB, two-pass loudness to -16 LUFS, true peak at or under -1.5 dBTP, AAC 192k, picture copied untouched.

---

## 11. Render and delivery

- **Design** at 1280 x 720 CSS px and capture at scale 1.5 for 1920 x 1080. With CDP screenshots pass `clip: { x: 0, y: 0, width: 1280, height: 720, scale: 1.5 }`, or the frames come out 1280 x 720.
- **Keep the frames** (JPEG q95) so a fix re-renders only its range (`--from`, `--to`), then re-encode.
- **Master:** H.264, CRF 20, preset slow, yuv420p, BT.709 tags, `+faststart`: about 75 MB for 92 s at 1080p.
- **Instagram DM:** videos over 25 MB are refused. Make a 1280 x 720 two-pass encode at about 1.85 Mbit/s video + 128k audio (about 23 MB for 92 s).
- **The first frame is the thumbnail** in a DM. If the film opens on something dark or cropped, prepend a 0.4 s cover (the strongest still of the film: big type, the brand colour, the offer) and delay the audio by the same 0.4 s. For a Reel, make a separate 9:16 cover.
- **Deliver** the MP4 as a file. Do not publish the stage as a web page (a page in another company's real look can mislead).
- **Ship with the outreach:** a short message that opens with the viewer's future, not the price, and points at the video (👇). Mention the price only when they ask.

---

## 12. Before you send it (checklist)

- [ ] Sound off: the story is still obvious from the type alone.
- [ ] The first 2 seconds move and say something; the first frame works as a thumbnail.
- [ ] Contact sheet at one frame per second: a new picture every 1 to 2 s, one hero each, colour changes only at the planned beats.
- [ ] Full-size stills of every shot: type sharp, nothing overlapping by accident, nothing touching the frame edge or the reserved corners.
- [ ] 8-frame strips over every fast move: blur in the middle, clean settle, no pops.
- [ ] Every honesty label visible; no invented fact; no phone number; no logos of other brands.
- [ ] Automatic checks pass at voice x1, x0.85, x1.2 and without the removable shot.
- [ ] Loudness -16 LUFS, music under the voice, the drop on the key moment, no clip running into the next.
- [ ] File sizes fit where it is going (25 MB for an Instagram DM).
- [ ] The reply names what the person must listen to.

---

## 13. When it goes wrong

| Symptom | Fix |
|---|---|
| "Boring", "slow", "static" | More camera: push to the detail, a new picture every 1 to 2 s, whips with blur, faster moves with real holds. Tighten the voice. |
| "Effects look bad" | Drop fades and generic slides; arrivals from somewhere, hard ease-out, stagger, depth, one light sweep, a sound per move. |
| "Not creative" | Build a motion system from the client's own design language (3 or 4 recurring objects), not a template. |
| Music too loud | 5 dB lower after the drop, at least 8 dB under the voice, sidechain ducking. |
| Frames are 1280 x 720 | Pass the clip scale to the screenshot call. |
| File is hundreds of MB | Grain too strong or changing every frame. |
| Text overlaps after a move | Check settled stills at every camera pose, not only at the shot start. |
| A word sounds wrong | Fix its `say` spelling and regenerate only if the person agrees to the cost. |
| Can't move big files into the session | Generate and mix where the stems are, or bring the stems over once as one archive (checked by SHA-256) and keep it with the project files. |

---

## 14. Kit

A reference engine and tools from a 92-second film are kept in the vault next to this skill (`60 Resources/Skills/motion-graphics-films/kit/`): `core.js`, `core.css`, `timeline.js`, `kit.html` (every shared component moving), `CORE.md` (the API), `render.mjs`, `strips.mjs`, `check.mjs`, and the sound tools `tight.py`, `split.py`, `sfx.py`, `music5.py`, `mix2.py`. Start a new film by copying the stage, replacing the theme components (split-flap board, boarding pass, stamp, route) with the new client's own objects, and keeping the engine, the timeline forms, the checks and the tools.
