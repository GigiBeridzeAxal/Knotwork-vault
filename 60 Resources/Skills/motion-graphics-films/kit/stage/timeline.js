/* Film v5 timeline: global settings, the order of the acts, joins, chapters and the shared motion lengths.
   Each act's shots live in acts/aN.tl.js, registered with TL.act(id, { shots: [...] }).
   Shot: { id: 'x', vis: N, dur: N, say, lead?, tail?, at?: {key: time}, cam?: [keys], snd?: {key: sound} }
   Shot length = max(vis, lead + dur + tail), rounded up to a whole frame. Narration starts at shot start + lead.
   Times inside a shot: N >= 0 seconds from the shot start, -N seconds before its end, 'N%' of the shot,
   'vN%' of the narration, 'key' another event of the same shot, any of these + or - N seconds ('key+0.1'),
   and [a, b] the later of a and b. Reserved event keys: chIn, chFly, chStamp (the chapter layer).
   cam key: { at, to, d, e, w, snd, slide } (to: { x, y, z, r } | { el, z, ax, ay, r } | { dz } | { dx, dy, dz }),
   or { at, kick: 0.02 } (a zoom kick and back). snd: 'name' | [name, gain] | [name, gain, endKey]. */
window.TL = {
  fps: 30,
  lead: 0.15,
  tail: 0.2,
  order: ['a1', 'a2', 'a3', 'a4', 'a4b', 'a5'],
  // opening colour of each act; the join into an act sweeps this colour in
  open: { a1: 'ink', a2: 'yellow', a3: 'paper', a4: 'ink', a4b: 'ink', a5: 'yellow' },
  // the leading stripe of the join into an act
  stripe: { a2: 'ink', a3: 'yellow', a4: 'yellow', a4b: 'yellow', a5: 'ink' },
  // chapters: keyed by the act that fires chIn and chFly; `through` a later act keeps the stub on to that act's end
  chapters: {
    a2: { no: '01', name: 'ᲡᲐᲘᲢᲘ', title: 'ᲞᲠᲝᲤᲔᲡᲘᲝᲜᲐᲚᲣᲠᲘ ᲡᲐᲘᲢᲘ' },
    a3: { no: '02', name: 'SEO · GEO', title: 'SEO · GEO' },
    a4: { no: '03', name: 'MCP ᲡᲔᲠᲕᲔᲠᲘ', title: 'MCP ᲡᲔᲠᲕᲔᲠᲘ', tag: 'ᲔᲥᲡᲙᲚᲣᲖᲘᲣᲠᲘ', ink: true, through: 'a4b' },
  },
  // shared motion lengths (seconds) and rates
  fx: {
    arrive: 0.38, slam: 0.22, stamp: 0.12, pop: 0.32, exit: 0.2, mask: 0.45,
    press: 0.1, release: 0.15, ripple: 0.32, scroll: 0.45, cam: 0.5, kick: [0.06, 0.3], creep: 0.012,
    blink: 0.5, caret: 0.3, tremble: 7,
    flip: 0.11, flapStagger: 0.045, flapSteps: 4,
    sweep: 0.7, join: 0.5, chIn: 0.3, chFly: 0.5, chKick: 0.02,
  },
  acts: {},
  act(id, def) { this.acts[id] = def; },
};
