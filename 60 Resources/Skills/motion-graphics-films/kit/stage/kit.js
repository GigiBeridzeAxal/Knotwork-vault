/* Kit sheet: every shared component in motion, on ink, paper and yellow. Not part of the film. */
ACT('k1', {
  html: `<div class="wld kw">
    <div class="kyear"></div><div class="kred"></div>
    <div class="phn kph"></div>
  </div>
  <div class="stk call kcall"><span>ᲓᲐᲠᲔᲙᲕᲐ</span><span>ᲔᲠᲘᲓᲔᲑᲐᲗ</span></div>
  <div class="stk sm kx"></div>
  <div class="lbl"></div>
  <div class="stamp fill kst"><span>ᲒᲐᲓᲐᲘᲓᲝ</span></div>`,
  init(K) {
    K.$('.kph').innerHTML = K.phoneHTML(`<div class="kcs"><i class="kav">${K.icon('plane', 44)}</i><b>ტურისტული სააგენტო</b><span>დარეკვა</span><i class="kgo">${K.icon('phone', 30)}</i></div>`);
    K.$('.kx').innerHTML = K.icon('x') + 'ᲕᲔᲠ ᲮᲔᲓᲐᲕᲡ';
    K.$('.lbl').innerHTML = `გათვლა: 52 კვირა × ${K.icon('approx')} 4 000 ₾`;
    this.cam = K.world(K.$('.kw'));
    this.fg = K.finger();
    K.sound(K.T('k1', 'red'), 'flap', 0.6, K.flapLen('ᲒᲐᲓᲐᲘᲓᲝ', { steps: 4 }));
  },
  draw(t, K) {
    const T = k => K.T('k1', k);
    this.cam.apply(t);
    K.flap(K.$('.kyear'), '2026', t, T('year'), { h: 210, w: 146, from: '2022', seq: ['2023', '2024', '2025'] });
    K.flap(K.$('.kred'), 'ᲒᲐᲓᲐᲘᲓᲝ', t, T('red'), { h: 76, steps: 4, color: 'var(--red)' });
    K.put(K.$('.kcall'), K.life(t, T('call'), 'drop'));
    K.put(K.$('.kx'), K.life(t, T('cross'), 'pop'));
    K.put(K.$('.lbl'), K.life(t, T('lbl'), 'right'));
    K.put(K.$('.kst'), K.life(t, T('stamp'), 'stamp'));
    const b = this.cam.box('.kgo'), [bx, by] = this.cam.toScreen(b.x + b.w / 2, b.y + b.h / 2);
    const [x, y] = K.path(t, [[T('fin'), 1340, 820], [T('tap') - K.fx.press, bx + 6, by + 8], [T('tap'), bx, by], [T('tap') + K.fx.release * 2, bx + 70, by + 120]]);
    const [dx, dy] = K.tremble(t, 2, 1);
    this.fg.draw(t, x + dx, y + dy, { taps: [T('tap')], o: t >= T('fin') ? 1 : 0 });
    K.press(K.$('.kgo'), t, T('tap'));
  },
});

ACT('k2', {
  html: `<div class="wld kw">
    <div class="brw kb"></div>
    <div class="kc thk"><i class="cshadow"></i><b>ᲗᲥᲕᲔᲜᲘ ᲐᲓᲒᲘᲚᲘ</b><span>ჯგუფური ტურები თბილისიდან</span></div>
  </div>
  <p class="ktx" data-read><span></span><i></i></p>
  <p class="kws">ასისტენტი თქვენს სისტემას ეკითხება და ვარიანტებს იქვე აჩვენებს.</p>
  <div class="ff kff"><span class="ml"><span>ᲛᲐᲦᲚᲐ GOOGLE-ᲨᲘ</span></span></div>`,
  init(K) {
    const rows = Array.from({ length: 9 }, (_, i) => `<div class="krow"><i></i><b style="width:${40 + Math.round(K.rand(i) * 50)}%"></b><b style="width:${30 + Math.round(K.rand(i + 9) * 40)}%"></b></div>`).join('');
    K.$('.kb').innerHTML = K.browserHTML('demo.example.com', rows);
    K.$('.kw').insertAdjacentHTML('beforeend', `<div class="kr">${K.routeHTML('M10 190 C 140 20, 330 0, 490 110', 500, 220, { plane: 34 })}</div>`);
    this.cam = K.world(K.$('.kw'));
    this.ws = K.words(K.$('.kws'));
  },
  draw(t, K) {
    const T = k => K.T('k2', k);
    this.cam.apply(t);
    K.txt(K.$('.ktx span'), K.typed('მაისში ჯგუფური ტური მინდა', t, T('type'), T('typed')));
    K.vis(K.$('.ktx i'), K.caret(t, T('type'), T('typed')));
    K.stream(this.ws, t, T('words'), T('wordsEnd'));
    K.scroll(K.$('.kb .brw-pg'), t, [[T('scroll'), 180]]);
    K.route(K.$('.kr svg'), t, T('route'), T('routeEnd'), { stay: true });
    K.sweep(K.$('.kc'), t, T('sweep'));
    K.mask(K.$('.kff .ml'), t, T('ff'));
  },
});

ACT('k3', {
  html: `<div class="wld kw">
    <i class="kpatch"></i><div class="kp2"></div><div class="kp1"></div><div class="kp3"></div>
    <div class="kcnt"></div>
  </div>
  <div class="stk k call kink"><span>ᲐᲮᲐᲚᲘ</span><span>ᲢᲔᲥᲜᲝᲚᲝᲒᲘᲐ</span></div>
  <div class="stk y sm kys">ᲣᲙᲕᲔ ᲛᲣᲨᲐᲝᲑᲡ</div>
  <div class="ff kff"><span class="ml"><span>ᲔᲡ ᲐᲠᲘᲡ ᲛᲝᲛᲐᲕᲐᲚᲘ</span></span></div>`,
  init(K) {
    const f = [['ᲗᲐᲠᲘᲦᲘ', '01–14 ᲛᲐᲘᲡᲘ'], ['ᲒᲐᲜᲐᲮᲚᲔᲑᲐ', 'TBS–HAN']];
    K.$('.kp1').innerHTML = K.passHTML({ no: '01', title: 'ᲕᲘᲔᲢᲜᲐᲛᲘ', name: 'ᲕᲘᲔᲢᲜᲐᲛᲘ', head: 'ᲡᲐᲑᲝᲠᲢᲘᲜᲒ ᲞᲐᲡᲘ', fields: f, w: 560, seed: 4 });
    K.$('.kp1 .bp').insertAdjacentHTML('beforeend', '<div class="stamp kst"><span>ᲛᲖᲐᲓᲐᲐ</span></div>');
    K.$('.kp2').innerHTML = K.passHTML({ no: '03', title: 'MCP ᲡᲔᲠᲕᲔᲠᲘ', name: 'MCP', tag: 'ᲔᲥᲡᲙᲚᲣᲖᲘᲣᲠᲘ', head: 'ᲡᲐᲑᲝᲠᲢᲘᲜᲒ ᲞᲐᲡᲘ', fields: f, w: 460, ink: true, seed: 3 });
    K.$('.kp3').innerHTML = K.passHTML({ mini: true, no: '02', name: 'SEO · GEO', seed: 2 });
    K.$('.kys').insertAdjacentHTML('afterbegin', K.icon('check'));
    this.cam = K.world(K.$('.kw'));
  },
  draw(t, K) {
    const T = k => K.T('k3', k);
    this.cam.apply(t);
    this.cam.parallax(K.$('.kpatch'), 0.3);
    ['.kp3', '.kp2', '.kp1'].forEach((s, i) => {
      const at = T('fan') + i * K.fx.flapStagger * 2, st = K.life(t, at, 'right');
      K.put(K.$(s), st);
      if (st) K.cssv(K.$(s + ' .bp'), '--lift', (1 - K.prog(t, at, K.fx.arrive)).toFixed(3));
    });
    K.sweep(K.$('.kp1 .bp-face'), t, T('sweep'));
    K.put(K.$('.kst'), K.life(t, T('stamp'), 'stamp'));
    K.flap(K.$('.kcnt'), '+1', t, T('cnt'), { h: 200, from: '+0', steps: 3 });
    K.put(K.$('.kink'), K.life(t, T('ink'), 'drop'));
    K.put(K.$('.kys'), K.life(t, T('ink') + K.fx.flapStagger * 2, 'pop'));
    K.mask(K.$('.kff .ml'), t, T('ff'));
  },
});
