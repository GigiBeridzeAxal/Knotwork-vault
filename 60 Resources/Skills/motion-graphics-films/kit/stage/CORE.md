# Film v5 engine: what an act builder needs

The stage draws any moment as a pure function of t: `window.seek(t)`. Read `BRIEF-v5.md` for the rules; this file is the API.
Every example below is code from `kit.js` / `kit.tl.js` (the kit sheet, `kit.html`) or the skeleton acts, and has run.

## Files and ownership

- You edit only `acts/aN.tl.js` (all times), `acts/aN.js` (drawing), `acts/aN.css` (every selector starts `#aN ` or `.aN-`).
- Engine files (`core.js`, `core.css`, `timeline.js`, `film.html`, tools) belong to the engine. Need something there? Ask, do not patch.
- Never touch another act's DOM. Your act is `<section id="aN" class="act w-<opening colour>">`, 1280 x 720, shown only
  while the film is inside your act. At each act boundary the engine's join covers the frame, so acts need not match.
- Reserved corners: the chapter stub top left (270 x 64 at (40, 28); keep x < 320, y < 110 free in a2, a3, a4 and a4b), the label
  pill top right (right edge 1240, y 36; keep x > 1000, y < 84 free except your `.lbl`). check.mjs enforces both.

## Preview one act

```
open film.html?only=a2              # mounts a2 alone (times stay global); add &t=27.4 to open at a time
node strips.mjs --act a2            # ../out/v5/sheet-a2.jpg (a frame every 0.5 s) + strips/a2/blurNN-*.jpg
node strips.mjs --act a2 --step 0.25 --at 27.3,31.0   # also 8-frame strips from those times
node strips.mjs --act a2 --live 27.4 30.1             # full-size 1920 x 1080 PNG stills (check sharpness here)
node check.mjs --act a2             # must print PASS
node render.mjs --act a2 --scale 0.5 --jobs 3         # quick video frames of your range; --encode needs all frames
```

## Timeline (acts/aN.tl.js)

```js
TL.act('k2', { shots: [
  { id: 'k2', vis: 3.4, dur: 2,
    say: '',
    at: { chIn: 0.1, chFly: 0.9, scroll: 1.4, route: 1.25, routeEnd: 2.4, sweep: 1.7, ff: 1.5, chStamp: 2.6, type: 1.1, typed: 2.1 },
    cam: [{ at: 0, to: { x: 640, y: 360, z: 1 }, d: 0 }, { at: 'route', to: { el: '.kc', z: 1.1, ax: 0.62, ay: 0.5 }, d: 0.5 }] },
] });
```

- Each shot starts exactly `{ id: 'x', vis: N, dur: N,` (tools/retime5.py rewrites `dur` there). Never edit `say`.
- Shot length = max(vis, lead + dur + tail), rounded up to a frame; `lead` 0.15, `tail` 0.2 unless the shot sets its own.
- Times in `at`: `0.4` from shot start, `-0.6` before its end, `'40%'` of the shot, `'v40%'` of the narration (use this for
  anything on a spoken word), `'key+0.1'` another event of the same shot, `['v40%-0.08', 'call+0.5']` the later of the two.
  Everything must survive every `dur` x 0.85 and x 1.2 (check.mjs runs both).
- Reserved keys: `chIn` (chapter pass slams in full frame), `chFly` (flies to the stub), `chStamp` (round check stamp on the stub).
  a2, a3, a4 fire `chIn` and `chFly`; chapter 03 runs on through a4b (`through: 'a4b'` in `timeline.js`), so in a4b the
  stub is there from the first frame, stays over the a4 to a4b join, and a4b fires its `chStamp` (shot a3). a4b fires no
  `chIn` or `chFly`. Put `chIn` at least 0.3 s after your act's start, or it lands inside the join's blur (the join
  covers 0.25 s each side of the boundary). The engine adds a 2% kick to your cameras at the landing and at the stamp.
- Acts in order: a1, a2, a3, a4, a4b, a5 (a4b opens on ink with a yellow join stripe, like a4).
- `snd: { stamp: 'slam', tap: 'tap', year: ['flap', 0.8, 'red'] }`: name, or [name, gain], or [name, gain, endKey] (d = end - start).
  Names: whoosh, whooshBig, riser, slam, pop, type, tap, swish, ding, sub, flap. Fast camera keys, joins and chapters add their own.
- `m1` must be removable: guard any reference with `K.has('m1')`. check.mjs runs the film without it.
- No time literal in acts/aN.js: take times from `K.T`, `K.S` and lengths from `K.fx` (timeline.js `fx`).

## Act file (acts/aN.js)

```js
ACT('a2', {                                    // the skeleton act; `this` is this object in init and draw
  html: '<div class="wld a2-w"></div>',        // mounted once, before fonts load
  init(K) {                                    // once, fonts loaded: build DOM, worlds, extra sounds
    this.w = K.$('.a2-w');
    this.w.innerHTML = K.shots.map((s, i) => `<div class="a2-ph ph-${s.id}" style="left:${i * 1500}px"><b>${s.id}</b><p>${s.say}</p></div>`).join('');
    this.cam = K.world(this.w);
    this.ph = K.$$('.a2-ph');
  },
  draw(t, K) {                                 // every t inside the act, in any order
    this.cam.apply(t);
    K.shots.forEach((s, i) => K.put(this.ph[i].lastChild, K.life(t, K.S(s.id).t0, 'up')));
  },
});
```

draw must set every property it ever changes on every call (pure function of t). No CSS animations, transitions,
timers, Date, Math.random (use `K.rand(i)`). An exception in draw is logged once per message and fails check.mjs.

## The kit K

Time: `K.T('k1', 'tap')` absolute time of an event; `K.S('w2')` → `{t0, t1, v0, v1, dur}` (v0/v1 narration start/end);
`K.t0`, `K.t1` the act; `K.shots` [{id, say}]; `K.has(id)`; `K.when(id, -0.3)` resolves any time form of that shot.
Math: `K.prog(t, at, d, ease)` eased 0..1 (default outExpo); `K.ramp(t, at, d)`; `K.lerp`, `K.clamp`, `K.rand(i)` (0..1).
Eases (also `K.E[name]`): `K.outExpo`, `K.outQuint`, `K.inQuint`, `K.inCubic`, `K.inOutQuint`, `K.inOutCubic`, `K.outBack`, `K.linear`.
DOM: `K.root`, `K.$(sel)`, `K.$$(sel)` (inside your act), `K.css(el, prop, v)`, `K.cssv(el, '--var', v)`, `K.txt(el, s)`,
`K.vis(el, bool)` (all skip unchanged values), `K.box(el)` layout box relative to your act (transforms ignored), `K.fx`, `K.W`, `K.H`.

### Arrivals and exits
```js
K.put(K.$('.kcall'), K.life(t, T('call'), 'drop'));          // T = k => K.T('k1', k)
K.put(K.$('.kst'), K.life(t, T('stamp'), 'stamp'));
```
`K.life(t, at, kind, out, exitKind)` → state or null. Kinds: slam (1.6→1, 0.22 s), stamp (1.6→1, 0.12 s), pop (overshoot),
drop, right, left, up, settle. Exit at `out`: 'left', 'right', 'up', or default shrink. `K.put` applies it (and
`--r` from CSS as resting rotation). Add to the state before putting: `st.x += 40`.

### Mask lines, press, typing, streaming
```js
K.mask(K.$('.kff .ml'), t, T('ff'));                          // <div class="ff"><span class="ml"><span>ᲔᲡ ᲐᲠᲘᲡ</span></span></div>
K.press(K.$('.kgo'), t, T('tap'));                             // 0.94 → 1.03 → 1 around the release time
K.txt(K.$('.ktx span'), K.typed('მაისში ჯგუფური ტური მინდა', t, T('type'), T('typed')));
K.vis(K.$('.ktx i'), K.caret(t, T('type'), T('typed')));       // caret(t, a, b, end?) blinks after b, gone at end
this.ws = K.words(K.$('.kws'));                                // init: wrap words in spans
K.stream(this.ws, t, T('words'), T('wordsEnd'));               // draw: reveal words in order, layout never moves
K.scroll(K.$('.kb .brw-pg'), t, [[T('scroll'), 180]]);         // [[time, y], ...], eased; camera el-poses see it
```

### Camera (one per world element)
```js
this.cam = K.world(K.$('.kw'));                                // init; options { name: 'main', cam0: pose }
this.cam.apply(t);                                             // draw; returns the pose {x, y, z, r}
const b = this.cam.box('.kgo'), [bx, by] = this.cam.toScreen(b.x + b.w / 2, b.y + b.h / 2);
this.cam.parallax(K.$('.kpatch'), 0.3);                        // a layer inside the world moving at 0.3x
```
The world element gets class `wld` (absolute, origin 0 0); children are positioned in world px. Keys come from
the shots' `cam` lists (`w: 'name'` picks a second world). Poses: `{ x, y, z, r }` world point at screen centre;
`{ el: '.sel', z, ax, ay, r }` that element's centre at screen (ax·1280, ay·720), measured after your draw at the key's
end time; `{ dz }`, `{ dx, dy, dz }` relative (screen px). Key: `{ at, to, d (0 = cut), e (inOutQuint), slide: [vx, vy], snd }`,
or `{ at, kick: 0.02 }`. Between keys the zoom creeps 1.2%/s (shrinks after a pull-out). A key under 0.6 s that travels
over 150 screen px or zooms more than 25% is fast: motion blur interval, a whoosh, a small roll.
Limits: el-poses use layout offsets: transforms on the element or its parents are not counted (K.scroll is).

### Split-flap
```js
K.flap(K.$('.kyear'), '2026', t, T('year'), { h: 210, w: 146, from: '2022', seq: ['2023', '2024', '2025'] });
K.flap(K.$('.kred'), 'ᲒᲐᲓᲐᲘᲓᲝ', t, T('red'), { h: 76, steps: 4, color: 'var(--red)' });
K.flap(K.$('.kcnt'), '+1', t, T('cnt'), { h: 200, from: '+0', steps: 3 });
K.sound(K.T('k1', 'red'), 'flap', 0.6, K.flapLen('ᲒᲐᲓᲐᲘᲓᲝ', { steps: 4 }));   // init only
```
Builds one cell per character in the element (empty div) on first call. Options: `h` cell height (40..320), `w`
(default h·0.68), `from` start text, `seq` whole intermediate texts (a cell flips only where its character changes) or
`steps` random characters per cell (digits, Mtavruli or Latin by the final character; `abc` to choose, `seed`),
`flip` s per flip (0.11), `stagger` (0.045), `rtl`, `end: true` (at = the moment the last cell lands), `color` / `bg`
for landed cells (e.g. a yellow wall: text '     ', bg 'var(--yellow)'). Returns the landing time. A cell whose start and
final character match never flips. Space = blank tile. Sound is not automatic: add it with `K.sound` in init (or `snd`).

### Boarding pass, stamp, sweep, thick card
```js
K.$('.kp1').innerHTML = K.passHTML({ no: '01', title: 'ᲕᲘᲔᲢᲜᲐᲛᲘ', name: 'ᲕᲘᲔᲢᲜᲐᲛᲘ', head: 'ᲡᲐᲑᲝᲠᲢᲘᲜᲒ ᲞᲐᲡᲘ', fields: f, w: 560, seed: 4 });
K.$('.kp2').innerHTML = K.passHTML({ no: '03', title: 'MCP ᲡᲔᲠᲕᲔᲠᲘ', name: 'MCP', tag: 'ᲔᲥᲡᲙᲚᲣᲖᲘᲣᲠᲘ', head: 'ᲡᲐᲑᲝᲠᲢᲘᲜᲒ ᲞᲐᲡᲘ', fields: f, w: 460, ink: true, seed: 3 });
K.$('.kp3').innerHTML = K.passHTML({ mini: true, no: '02', name: 'SEO · GEO', seed: 2 });
K.cssv(K.$(s + ' .bp'), '--lift', (1 - K.prog(t, at, K.fx.arrive)).toFixed(3));   // contact shadow follows the lift (0 rest .. 1 high)
K.sweep(K.$('.kp1 .bp-face'), t, T('sweep'));                  // one light band at ~30°; opts { d, a: strength }
```
Pass: ratio 7:3, `w` 250..900 px (everything scales), notches, perforation, deterministic barcode (`seed`), 0.75em
thickness edge, contact shadow `.bp-sh`. Fields `[[label, value], ...]`; Georgian labels and values switch font
by themselves. `mini` is the 270 x 64 stub layout. Stamps: `<div class="stamp"><span>ᲛᲖᲐᲓᲐᲐ</span></div>` (double
outline, -6°, worn ink, transparent); `.stamp.fill` paper fill, `.stamp.y` yellow ink, `.stamp.rd` round with an icon.
Thick card: class `thk` (stacked 7px edge, `--th`, `--te` colours) and a child `<i class="cshadow"></i>`
(no `overflow:hidden` on that card, or the shadow is clipped). K.sweep needs a positioned element, no clipping.

### Stickers, label, type
`.stk` paper, `.stk.y` yellow, `.stk.k` ink with yellow type (for yellow backgrounds); `.sm` 36px, `.call` 82px with one
`<span>` per line; set `left`, `top`, `--r` (rest rotation) in your CSS. Icons in stickers: `K.icon('x')` (red cross),
`K.icon('check')`. `.lbl` honesty pill (already placed top right). `.ff` full-frame type 170px (`.pp` paper colour).
Honesty: give the thing that needs a label `data-lbl="კონცეფცია"` (exact text): check.mjs then requires a fully
visible `.lbl` with that text whenever it is on screen, except inside blur intervals.
Mark other must-read text with `data-read` so the corner checks see it.

### Finger, phone, browser, route, icons
```js
this.fg = K.finger();                                          // init: a 56 px pointer + ripple in your act
const [x, y] = K.path(t, [[T('fin'), 1340, 820], [T('tap') - K.fx.press, bx + 6, by + 8], [T('tap'), bx, by]]);
const [dx, dy] = K.tremble(t, 2, 1);                           // smooth seeded wobble (amp px, seed)
this.fg.draw(t, x + dx, y + dy, { taps: [T('tap')], o: t >= T('fin') ? 1 : 0 });   // screen px
K.$('.kph').innerHTML = K.phoneHTML(`<div class="kcs">...</div>`);   // on <div class="phn">, 300 x 620
K.$('.kb').innerHTML = K.browserHTML('demo.example.com', rows);   // on <div class="brw">; scroll .brw-pg
K.$('.kw').insertAdjacentHTML('beforeend', `<div class="kr">${K.routeHTML('M10 190 C 140 20, 330 0, 490 110', 500, 220, { plane: 34 })}</div>`);
K.route(K.$('.kr svg'), t, T('route'), T('routeEnd'), { stay: true });   // opts: e, rev, trail (px), plane:false, stay
```
`K.path` eases outQuint between keys. The camera does not follow the finger by itself: add a camera key on the
target 0.1 to 0.17 s after the finger key for the brief's lag. Icons `K.icon(name, px)`: check, x, lock, phone,
search, up, arrow, approx, plane. The fonts have no `≈` and no `→`: use `K.icon('approx')`, `K.icon('arrow')`.
`₾` comes from Inter (fine anywhere). check.mjs fails any text drawn in another font.

## Tokens and worlds (core.css)

`--ink --paper --yellow --board --fedge --grey-l --grey-d --red --green`; fonts `--geo` (Georgian first) and `--lat`
(Inter first); `.dsp` = condensed 900 display. World backgrounds: classes `w-ink`, `w-paper`, `w-yellow` (patches as
radial gradients); your section starts with the opening colour of the act.

## Exports, sounds, budgets

`window.FILM = { len, fps, cues [{id, act, t, voiceAt, dur}], blur [[t0, t1]], sfx [{t, name, gain, d?}], say, marks, acts }`.
Budgets: each act (js + css + tl) under 60 KB. Measured: 0.04 to 0.05 s per 1920 x 1080 frame on one pinned core
(kit page, the heaviest so far, CDP capture); keep it under 0.35 s: no large `filter: blur()`, no full-frame
`backdrop-filter`, no SVG turbulence, canvases only as large as needed.

## Sharpness (FILM/out/v5/sharp-test.jpg)

Measured on 20 px Georgian text at 1.5x: flat, rotateY 14° and rotateY 14° + rotateX 8° at camera zoom 2, and rotateY 18°
+ rotateX 12° at zoom 2.4 all stay sharp (Chromium re-rasters each frame). What breaks it: `filter` (drop-shadow, blur)
on a 3D-transformed element or its parent: the layer rasters at low resolution and the text pixelates. Use box-shadow
or the `cshadow` element for shadows on tilted planes. Do not put `will-change` or `translateZ` on worlds or windows
(harmless in this test, but it fixes the raster scale in other Chromium paths; v4 rule). Tilt only inside the world,
with `perspective(1800px)` in the element's own transform; flatten (rotate 0) when the camera reads it.

## Known limits

- A blurred frame is the mean of `--sub` sub-frames (8 in render, 4 in strips): very fast moves (the join band,
  about 500 px a frame at its peak) show as steps in strips; render with `--sub 12` over joins if they look stepped.
- The stub has a 2px ink outline and the stickers' hard shadow; while the active act opens on ink (`TL.open`) it gets a
  paper hairline instead. It follows the act's opening colour, not what your act paints, so keep the stub corner on that colour.
- The chapter pass flies with a flip (rotateX) at mid-flight that swaps the full pass for the stub; it is inside a blur interval.
- `?only=aN` previews give the same times, but FILM.blur / sfx list only that act's cameras (plus the chapter's, which
  a4b also shows from the start).
- Grain is constant inside a frame, so blurred frames keep it.
