/* Kit sheet timeline (not part of the film): three short acts on ink, paper and yellow, joined by the engine's joins. */
TL.order = ['k1', 'k2', 'k3'];
TL.open = { k1: 'ink', k2: 'paper', k3: 'yellow' };
TL.stripe = { k2: 'yellow', k3: 'ink' };
TL.chapters = { k2: { no: '02', name: 'SEO · GEO', title: 'SEO · GEO' } };
TL.act('k1', { shots: [
  { id: 'k1', vis: 2.8, dur: 2,
    say: '',
    at: { year: 0, red: 0.5, call: 0.9, lbl: 0.2, fin: 0.4, tap: 1.3, stamp: 1.9, cross: 1.2 },
    cam: [{ at: 0, to: { x: 640, y: 360, z: 1.25 }, d: 0 }, { at: 0.25, to: { x: 640, y: 360, z: 1 }, d: 0.45 }, { at: 'stamp', kick: 0.02 }],
    snd: { year: ['flap', 0.8, 'red'], stamp: 'slam', tap: 'tap' } },
] });
TL.act('k2', { shots: [
  { id: 'k2', vis: 3.4, dur: 2,
    say: '',
    at: { chIn: 0.1, chFly: 0.9, scroll: 1.4, route: 1.25, routeEnd: 2.4, sweep: 1.7, ff: 1.5, chStamp: 2.6, type: 1.1, typed: 2.1, words: 1.3, wordsEnd: 2.3 },
    cam: [{ at: 0, to: { x: 640, y: 360, z: 1 }, d: 0 }, { at: 'route', to: { el: '.kc', z: 1.1, ax: 0.62, ay: 0.5 }, d: 0.5 }] },
] });
TL.act('k3', { shots: [
  { id: 'k3', vis: 2.6, dur: 2,
    say: '',
    at: { fan: 0.15, cnt: 0.5, ink: 0.9, ff: 0.4, stamp: 1.4, sweep: 0.6 },
    cam: [{ at: 0, to: { x: 640, y: 360, z: 1 }, d: 0 }, { at: 'stamp', kick: 0.02 }] },
] });
