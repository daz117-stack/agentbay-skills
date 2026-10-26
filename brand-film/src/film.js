/* Brand film — "The Load-Bearing Line".
   Every visual is a pure function of time. Scene start times come from timeline.json,
   brand-dependent content from brand.config.json. */
(async function () {
  const { clamp, lerp, E, prog, win, set, words, wordsAnim, keys, draw, rng, keyframes, esc } = L;
  const qs = new URLSearchParams(location.search);
  const RENDER = qs.has('render');
  if (RENDER) document.body.classList.add('render');

  const [CFG, TL] = await Promise.all([
    fetch(qs.get('config') || '../brand.config.json').then(r => r.json()),   // ?config= lets you test variants
    fetch('../timeline.json').then(r => r.json()),
  ]);
  const S = TL.scenes, DUR = TL.duration, C = CFG.copy, ID = CFG.identity, P = CFG.palette;

  // ---------- Theme ----------
  const root = document.documentElement.style;
  for (const [k, v] of Object.entries(P)) root.setProperty('--' + k, v);
  root.setProperty('--accentRGB', (h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(','))(P.accent));
  const ACC = (h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(','))(P.accent);   // for translucent accent tints
  root.setProperty('--stretch', CFG.typography.displayStretch);
  root.setProperty('--dweight', CFG.typography.displayWeight);

  // ---------- Geometry ----------
  const MARK = 200, SW = 34;                       // temporary mark: box size, stroke width
  const GX = i => 160 + i * (1600 / 12);          // 12-column grid, 160px margins
  const GY = k => 540 + k * (1600 / 12);
  const stage = document.getElementById('stage');
  const scenesEl = document.getElementById('scenes');
  const SC = [];

  function scene(id, from, to, html) {
    const el = document.createElement('section');
    el.className = 'scene'; el.id = 's-' + id; el.innerHTML = html;
    scenesEl.appendChild(el);
    const sc = { id, from, to, el, k: keys(el), update: null, ready: null };
    SC.push(sc);
    return sc;
  }

  // ---------- Shared building blocks ----------
  const svgLines = (arr, style = '') => arr.map(d => `<path pathLength="1" d="${d}" style="${style}"/>`).join('');
  const lineArtStyle = 'fill:none;stroke:var(--ink);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;opacity:.55';

  function scribble(w, ys, seed, stroke = '#2b2b2b', sw = 2.2) {
    const r = rng(seed);
    return ys.map(([y, len]) => {
      let d = `M ${8 + r() * 6} ${y}`; const L = w * len;
      for (let x = 14; x < L; x += 9) d += ` Q ${x - 4} ${y - 5 - r() * 5} ${x} ${y + (r() - .5) * 3} T ${x + 5} ${y + (r() - .5) * 2}`;
      return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" opacity=".85"/>`;
    }).join('');
  }

  function capBlock(p, n, eyebrow, text) {
    return `
      <div class="mono abs" data-k="${p}eye" style="left:160px;top:318px;color:var(--graphite)"><span class="accent">0${n}</span>&nbsp;&nbsp;—&nbsp;&nbsp;${esc(eyebrow)}</div>
      <div class="display abs" data-k="${p}cap" style="left:160px;top:358px;font-size:64px;line-height:1.05" data-fit="560" data-text="${esc(text)}"></div>`;
  }

  /* =====================================================================
     1. OPENING — a single line, then the question.
     ===================================================================== */
  const open = scene('open', S.open, S.idea + .05, `
    <svg class="abs" width="1920" height="1080" style="left:0;top:0">
      <g data-k="ticks">${Array.from({ length: 13 }, (_, i) => `<line data-k="tick[]" x1="${GX(i)}" x2="${GX(i)}" y1="540" y2="540" style="stroke:var(--ink);stroke-width:1.2"/>`).join('')}</g>
      <g>${Array.from({ length: 13 }, (_, i) => `<text data-k="lab[]" x="${GX(i)}" y="514" text-anchor="middle" style="font:500 11px var(--mono);letter-spacing:.12em;fill:var(--graphite)">${String(i).padStart(2, '0')}</text>`).join('')}</g>
      <line data-k="lnL" pathLength="1" x1="960" y1="540" x2="160" y2="540" style="stroke:var(--ink);stroke-width:2.4"/>
      <line data-k="lnR" pathLength="1" x1="960" y1="540" x2="1760" y2="540" style="stroke:var(--ink);stroke-width:2.4"/>
    </svg>
    <div class="abs" data-k="dot" style="left:951px;top:531px;width:18px;height:18px;border-radius:50%;background:var(--accent)"></div>
    <div class="display abs center" data-k="l1" style="left:0;width:1920px;top:414px;font-size:100px"></div>
    <div class="display abs center" data-k="l2" style="left:0;width:1920px;top:566px;font-size:100px"></div>
    <div class="display abs center" data-k="q" style="left:0;width:1920px;top:366px;font-size:124px"></div>
  `);
  open.ready = () => {
    open.w1 = words(open.k.l1, C.open1);
    open.w2 = words(open.k.l2, C.open2);
    open.wq = words(open.k.q, C.openQ);
  };
  open.update = t => {
    const k = open.k, Lt = t - S.open;
    set(k.dot, { s: prog(Lt, .2, .55, E.outBack), o: 1 - prog(Lt, 4.1, 4.4, E.linear) });
    const pl = prog(Lt, .5, 1.5, E.outExpo);
    draw(k.lnL, pl); draw(k.lnR, pl);
    const grow = prog(Lt, 4.15, 4.85, E.inOutCubic);
    k.tick.forEach((el, i) => {
      const d = Math.abs(i - 6);
      const a = (i === 0 || i === 12) ? 1.0 : 2.75 + d * .05;
      const h = 12 * prog(Lt, a, a + .35, E.outBack) + grow * 560;
      el.setAttribute('y1', 540 - h); el.setAttribute('y2', 540 + h);
      el.style.opacity = lerp(.6, .14, grow);
      k.lab[i].style.opacity = .7 * prog(Lt, a + .1, a + .45, E.outCubic) * (1 - prog(Lt, 4.0, 4.3, E.linear));
    });
    wordsAnim(open.w1, Lt, 1.05, 2.55, { stagger: .07, dirIn: 1, dirOut: 1 });
    wordsAnim(open.w2, Lt, 1.2, 2.6, { stagger: .07, dirIn: -1, dirOut: -1 });
    wordsAnim(open.wq, Lt, 2.95, 4.12, { stagger: .09, dirIn: 1, dirOut: -1, durOut: .4 });
  };

  /* =====================================================================
     2. THE IDEA — everyday mess on the desk; the line sweeps; order.
     ===================================================================== */
  const col = j => 160 + j * 533.333 + 12, row = r => 406.667 + r * 266.667 + 12;
  const CW = 509.33, CH = 242.67;
  const items = [
    { id: 'order', clean: [col(0), row(0)], messy: [430, 380, 230, 300, -9] },
    { id: 'status', clean: [col(1), row(0)], messy: [1190, 300, 300, 230, 7] },
    { id: 'menu', clean: [col(2), row(0)], messy: [820, 575, 240, 170, -14] },
    { id: 'stock', clean: [col(0), row(1)], messy: [1340, 610, 190, 190, 12] },
    { id: 'summary', clean: [col(1), row(1)], messy: [630, 640, 150, 330, 6] },
    { id: 'ad', clean: [col(2), row(1)], messy: [975, 262, 220, 300, -6] },
  ];
  const messyFace = {
    order: `<div class="abs" style="inset:0;background:#FFFDF6;box-shadow:0 8px 20px -8px rgba(0,0,0,.3)">
        <svg class="abs" width="230" height="300" style="left:0;top:0">${scribble(230, [[40, .55], [70, .8], [96, .7], [122, .85], [150, .5], [200, .6], [226, .75]], 3)}
        <ellipse cx="180" cy="44" rx="30" ry="22" fill="none" stroke="#c0392b" stroke-width="2.5"/></svg>
        <div class="abs" style="left:160px;top:28px;font:800 26px var(--display);transform:skewX(-12deg);color:#c0392b">T4</div></div>`,
    status: `<div class="abs" style="inset:0;background:#fff;border-radius:22px;box-shadow:0 10px 24px -10px rgba(0,0,0,.35);padding:18px;box-sizing:border-box;font:500 17px var(--sans)">
        <div style="background:#E9E9EB;border-radius:16px;padding:9px 13px;width:fit-content;margin-bottom:8px">is my order ready??</div>
        <div style="background:#1FA855;color:#fff;border-radius:16px;padding:9px 13px;width:fit-content;margin:0 0 8px auto">which one?</div>
        <div style="background:#E9E9EB;border-radius:16px;padding:9px 13px;width:fit-content">the one from 20 min ago</div></div>`,
    menu: `<div class="abs" style="inset:0;background:#D9C3A0;box-shadow:0 8px 18px -8px rgba(0,0,0,.35)">
        <div class="abs" style="left:18px;top:14px;font:800 30px var(--display);font-stretch:80%;color:#222;transform:skewX(-8deg)">LATTE</div>
        <div class="abs" style="left:24px;top:62px;font:800 64px var(--display);font-stretch:70%;color:#222">70</div>
        <svg class="abs" width="240" height="170" style="left:0;top:0"><path d="M18 108 L110 84" stroke="#c0392b" stroke-width="5" stroke-linecap="round"/></svg>
        <div class="abs" style="left:128px;top:70px;font:800 54px var(--display);font-stretch:70%;color:#c0392b;transform:rotate(-10deg)">85!</div></div>`,
    stock: `<div class="abs" style="inset:0;background:#F3E3A0;box-shadow:0 8px 16px -8px rgba(0,0,0,.3)">
        <div class="abs" style="left:16px;top:18px;font:600 21px/1.25 var(--sans);transform:rotate(-3deg) skewX(-8deg);color:#333;width:160px">call supplier re: milk!!</div>
        <svg class="abs" width="190" height="190" style="left:0;top:0">${scribble(190, [[120, .7], [146, .5]], 9, '#555', 2)}</svg></div>`,
    summary: `<div class="abs" style="inset:0;background:#FBFBF8;clip-path:polygon(0 0,100% 0,100% 94%,92% 100%,84% 94%,76% 100%,68% 94%,60% 100%,52% 94%,44% 100%,36% 94%,28% 100%,20% 94%,12% 100%,4% 94%,0 100%);box-shadow:0 6px 14px rgba(0,0,0,.2)">
        <svg class="abs" width="150" height="330" style="left:0;top:0">${Array.from({ length: 13 }, (_, i) => `<line x1="14" x2="${60 + ((i * 37) % 70)}" y1="${30 + i * 20}" y2="${30 + i * 20}" stroke="#777" stroke-width="3" stroke-dasharray="${i % 3 ? '2 3' : 'none'}"/>`).join('')}</svg></div>`,
    ad: `<div class="abs" style="inset:0;background:#fff;box-shadow:0 8px 18px -8px rgba(0,0,0,.3);overflow:hidden">
        <svg class="abs" width="220" height="300" style="left:0;top:0"><polygon points="150,30 162,62 196,58 172,82 186,114 154,98 128,120 132,86 104,70 138,62" fill="#F7D33A"/></svg>
        <div class="abs" style="left:14px;top:96px;font:900 48px var(--display);font-stretch:62%;color:#D63A2F;transform:rotate(-9deg)">SALE!!!</div>
        <div class="abs" style="left:30px;top:170px;font:700 19px var(--sans);color:#1d4ed8">best prices in town</div>
        <div class="abs" style="left:12px;top:214px;font:400 26px serif;color:#111">Call now</div></div>`,
  };
  const cleanFace = {
    order: `<div class="card" style="inset:0">
        <div class="mono abs" style="left:26px;top:24px;font-size:13px;color:var(--graphite)">Order #1042</div>
        <span class="chip new abs" style="right:24px;top:20px">New</span>
        <div class="display abs" style="left:26px;top:62px;font-size:40px">Table 4</div>
        <div class="sans abs" style="left:26px;top:122px;font-size:20px;line-height:1.55;color:var(--ink)">2× Flat White<br>1× Croissant</div>
        <div class="mono abs" style="right:24px;bottom:22px;font-size:12px;color:var(--graphite)">12:31</div></div>`,
    status: `<div class="card" style="inset:0">
        <div class="mono abs" style="left:26px;top:24px;font-size:13px;color:var(--graphite)">Order #1039</div>
        <span class="chip ink abs" style="right:24px;top:20px">Ready</span>
        <div class="display abs" style="left:26px;top:62px;font-size:40px">Ready for pickup</div>
        <div class="sans abs" style="left:26px;top:128px;font-size:19px;color:var(--graphite)">Customer notified automatically</div>
        <div class="abs" style="left:26px;right:26px;bottom:30px;height:4px;background:var(--accent);border-radius:2px"></div></div>`,
    menu: `<div class="card" style="inset:0">
        <div class="mono abs" style="left:26px;top:24px;font-size:13px;color:var(--graphite)">Menu · Coffee</div>
        <div class="display abs" style="left:26px;top:66px;font-size:44px">Spanish Latte</div>
        <div class="display abs" style="right:28px;top:118px;font-size:80px;color:var(--accent)">85</div>
        <div class="mono abs" style="left:26px;bottom:24px;font-size:12px;color:var(--graphite)">● Updated on all screens</div></div>`,
    stock: `<div class="card" style="inset:0">
        <div class="mono abs" style="left:26px;top:24px;font-size:13px;color:var(--graphite)">Stock · Aisle 4</div>
        <div class="sans abs" style="left:26px;top:70px;font-size:28px;font-weight:600">Milk 1 L</div>
        <div class="abs" style="left:26px;top:124px;width:300px;height:8px;background:var(--rule);border-radius:4px"><div style="width:22%;height:100%;background:var(--accent);border-radius:4px"></div></div>
        <span class="chip ink abs" style="left:26px;bottom:24px">Reorder sent</span></div>`,
    summary: `<div class="card" style="inset:0">
        <div class="mono abs" style="left:26px;top:24px;font-size:13px;color:var(--graphite)">Today</div>
        <div class="display abs" style="left:26px;top:58px;font-size:84px">128</div>
        <div class="sans abs" style="left:28px;top:150px;font-size:19px;color:var(--graphite)">orders, all on time</div>
        <svg class="abs" width="200" height="110" style="right:26px;bottom:26px">${Array.from({ length: 10 }, (_, i) => { const h = [30, 46, 38, 60, 52, 70, 64, 82, 76, 96][i]; return `<rect x="${i * 20}" y="${110 - h}" width="12" height="${h}" rx="2" fill="${i === 9 ? 'var(--accent)' : 'var(--ink)'}" opacity="${i === 9 ? 1 : .85}"/>`; }).join('')}</svg></div>`,
    ad: `<div class="card on-accent" style="inset:0;background:var(--accent);border-color:transparent">
        <div class="mono abs" style="left:26px;top:24px;font-size:13px;color:var(--ink)">Sat – Sun · 8 – 12</div>
        <div class="display abs" style="left:26px;top:64px;font-size:56px;font-weight:900;line-height:.95">Weekend<br>Breakfast</div>
        <div class="abs" style="right:24px;bottom:22px;width:46px;height:46px;border-radius:50%;background:var(--ink);color:var(--accent);font:700 24px/46px var(--sans);text-align:center">→</div></div>`,
  };
  const gridV = Array.from({ length: 31 }, (_, i) => `<line x1="${GX(i - 9)}" x2="${GX(i - 9)}" y1="-1700" y2="1500"/>`).join('');
  const gridH = Array.from({ length: 24 }, (_, i) => `<line x1="-1400" x2="3320" y1="${GY(i - 16)}" y2="${GY(i - 16)}"/>`).join('');
  const idea = scene('idea', S.idea, S.cap + .45, `
    <div class="abs" data-k="persp" style="inset:0;perspective:1700px;perspective-origin:960px 360px">
      <div class="abs" data-k="plane" style="left:0;top:0;width:1920px;height:1080px;transform-origin:960px 540px">
        <svg class="abs" width="1920" height="1080" style="left:0;top:0">
          <g style="stroke:var(--ink);stroke-width:1.2;opacity:.14">${gridV}</g>
          <g data-k="gridH" style="stroke:var(--ink);stroke-width:1.2;opacity:.14">${gridH}</g>
          <line data-k="main" x1="160" x2="1760" y1="540" y2="540" style="stroke:var(--ink);stroke-width:2.4"/>
          <g data-k="sweep"><line x1="0" x2="0" y1="-900" y2="1500" style="stroke:var(--accent);stroke-width:26;opacity:.12"/><line x1="0" x2="0" y1="-900" y2="1500" style="stroke:var(--accent);stroke-width:3.5"/></g>
        </svg>
        ${items.map(it => `<div class="abs" data-k="it[]" style="transform-origin:50% 50%">
            <div class="abs" data-k="mf[]" style="inset:0">${messyFace[it.id]}</div>
            <div class="abs" data-k="cf[]" style="inset:0">${cleanFace[it.id]}</div></div>`).join('')}
      </div>
    </div>
    <div class="mono abs center" data-k="cap" style="left:0;width:1920px;top:128px;color:var(--graphite)">${esc(C.ideaCaption)}</div>
    <div class="display abs center" data-k="head" style="left:0;width:1920px;top:168px;font-size:84px;line-height:1.1"></div>
  `);
  const sweepX = Lt => lerp(-250, 2150, E.inOutSine(clamp((Lt - 1.65) / .95)));
  idea.ready = () => {
    idea.wh = words(idea.k.head, C.idea);
    idea.snap = items.map(it => {               // when the sweep passes each item's centre
      const cx = it.messy[0] + it.messy[2] / 2;
      for (let x = 1.65; x < 2.7; x += .005) if (sweepX(x) >= cx) return x;
      return 2.6;
    });
  };
  idea.update = t => {
    const k = idea.k, Lt = t - S.idea;
    const cam = keyframes([
      [0, { rx: 0, y: 0, s: 1 }], [1.0, { rx: 42, y: 70, s: 1.14 }, 'inOutCubic'],
      [1.7, { rx: 40, y: 70, s: 1.15 }, 'linear'], [2.75, { rx: 0, y: 0, s: 1 }, 'inOutCubic'],
    ], Lt);
    k.plane.style.transform = `translateY(${cam.y}px) rotateX(${cam.rx}deg) scale(${cam.s})`;
    const fog = cam.rx / 42;
    const m = `linear-gradient(to bottom, rgba(0,0,0,${(1 - .97 * fog).toFixed(3)}) 0%, #000 ${lerp(0, 42, fog).toFixed(1)}%)`;
    k.persp.style.webkitMaskImage = m; k.persp.style.maskImage = m;
    k.gridH.style.opacity = .14 * prog(Lt, 0, .5, E.outCubic);
    k.main.style.opacity = lerp(1, .14, prog(Lt, .3, 1.0, E.inOutCubic));
    const sx = sweepX(Lt);
    k.sweep.setAttribute('transform', `translate(${sx},0)`);
    k.sweep.style.opacity = prog(Lt, 1.55, 1.7, E.linear) * (1 - prog(Lt, 2.5, 2.65, E.linear));

    items.forEach((it, i) => {
      const el = k.it[i], [mx, my, mw, mh, mr] = it.messy, [cx, cy] = it.clean;
      const drop = prog(Lt, .45 + i * .12, .95 + i * .12, E.outCubic);
      const ts = idea.snap[i];
      const m = prog(Lt, ts, ts + .55, E.outExpo);
      el.style.left = lerp(mx, cx, m) + 'px'; el.style.top = lerp(my, cy, m) + 'px';
      el.style.width = lerp(mw, CW, m) + 'px'; el.style.height = lerp(mh, CH, m) + 'px';
      set(el, { r: lerp(mr, 0, m), s: lerp(1.25, 1, drop) * (1 + .04 * Math.sin(Math.PI * clamp((Lt - ts) / .3)) * (m > 0 ? 1 : 0)), o: drop });
      k.mf[i].style.opacity = 1 - prog(Lt, ts, ts + .12, E.linear);
      k.cf[i].style.opacity = prog(Lt, ts + .04, ts + .22, E.linear);
    });
    set(k.cap, { o: win(Lt, .6, .4, 1.6, .3), y: (1 - prog(Lt, .6, 1.2, E.outExpo)) * 12 });
    wordsAnim(idea.wh, Lt, 2.55, undefined, { stagger: .05 });

    // Push in, then zoom through the menu card into the next scene.
    const z = prog(Lt, 4.6, 5.1, E.inCubic);
    const s = (1 + .035 * prog(Lt, 2.8, 4.6, E.inOutSine)) * lerp(1, 3.6, z);
    idea.el.style.transformOrigin = '1493px 540px';
    set(idea.el, { s, blur: 14 * z, o: 1 - prog(Lt, 4.78, 5.12, E.linear) });
  };

  /* =====================================================================
     3. CAPABILITIES — four businesses on one connected world plane.
     ===================================================================== */
  const CELL = { A: [0, 0], B: [2160, 0], D: [2160, 1320], C: [0, 1320] };

  // --- Cell A: café, digital menu board
  const menuRows = [['Espresso', '45'], ['Americano', '55'], ['Flat White', '70'], ['Spanish Latte', '85'], ['Cortado', '65'], ['Mocha', '80']];
  const cellA = `
    ${capBlock('a_', 1, C.cap1Eyebrow, C.cap1)}
    <svg class="abs" width="1920" height="1080" style="left:0;top:0"><g data-k="a_art">${svgLines([
      'M300 -20 V180', 'M262 222 L282 180 H318 L338 222 Z', 'M520 -20 V140', 'M482 182 L502 140 H538 L558 182 Z',
      'M80 900 H1840', 'M160 900 V1100', 'M680 900 V1100', 'M1200 900 V1100', 'M1760 900 V1100',
      'M220 900 V772 H460 V900', 'M206 772 H474', 'M262 812 h46 v16 h-46 Z', 'M372 812 h46 v16 h-46 Z',
      'M232 880 H448', 'M272 880 v-18 h26 v18', 'M382 880 v-18 h26 v18',
      'M536 900 Q600 812 664 900', 'M524 900 H676', 'M900 -20 V220', 'M1620 -20 V220'], lineArtStyle)}</g></svg>
    <div class="device" style="left:760px;top:220px;width:1000px;height:562px;border-radius:16px">
      <div class="screen" style="inset:12px;border-radius:6px;background:var(--screen)">
        <div class="abs" data-k="a_ui" style="inset:0">
          <div class="abs mono" data-k="a_tabs" style="left:40px;top:34px;font-size:12px;color:var(--paperHi)">
            <span style="border-bottom:2px solid var(--accent);padding-bottom:6px">Coffee</span><span style="opacity:.45;margin-left:28px">Cold drinks</span><span style="opacity:.45;margin-left:28px">Bakery</span></div>
          <div class="display abs" data-k="a_title" style="left:40px;top:74px;font-size:40px;color:var(--paperHi)">Coffee</div>
          ${menuRows.map(([n, p], i) => `<div class="abs" data-k="a_row[]" style="left:28px;width:524px;top:${140 + i * 58}px;height:50px;display:flex;align-items:center;padding:0 12px;box-sizing:border-box;border-radius:4px;font:500 22px var(--sans);color:var(--paperHi)">
              <span>${n}</span><span style="flex:1;margin:0 14px;border-bottom:2px dotted rgba(251,250,247,.22);transform:translateY(6px)"></span><span style="font:500 22px var(--mono)">${p}</span></div>`).join('')}
          <div class="abs on-accent" data-k="a_promo" style="left:592px;top:16px;width:368px;height:506px;background:var(--accent);border-radius:6px;overflow:hidden">
            <span class="chip ink abs" data-k="a_pill" style="left:26px;top:26px">New</span>
            <div class="display abs" style="left:26px;top:70px;font-size:46px;font-weight:900;line-height:.98">Iced<br>Spanish<br>Latte</div>
            <svg class="abs" width="170" height="240" style="left:186px;top:214px"><g style="fill:none;stroke:var(--ink);stroke-width:3.2;stroke-linejoin:round;stroke-linecap:round">${svgLines([
              'M10 40 H160', 'M18 40 L36 228 H134 L152 40', 'M28 118 H142', 'M46 64 l30 -6 l6 30 l-30 6 Z', 'M88 84 l28 4 l-4 28 l-28 -4 Z', 'M104 -6 L88 150'])}</g></svg>
            <div class="display abs" style="left:26px;top:386px;font-size:84px;font-weight:900">95</div>
            <div class="mono abs" style="left:28px;top:474px;font-size:11px">Limited season</div>
          </div>
        </div>
      </div>
    </div>`;

  // --- Cell B: order flow across three stations
  const stations = ['Counter', 'Kitchen', 'Pickup'];
  const orderCard = (id, items, chip, chipCls, meta) => `
    <div class="abs" data-k="b_card[]" data-id="${id}" style="left:12px;width:256px;height:88px;background:#fff;border:1px solid var(--rule);border-radius:8px;box-sizing:border-box">
      <div class="display abs" style="left:14px;top:12px;font-size:22px;font-weight:800">#${id}</div>
      <span class="chip ${chipCls} abs" data-k="b_chip[]" style="right:10px;top:10px;font-size:10px">${chip}</span>
      <div class="sans abs" style="left:14px;top:42px;font-size:14px;color:var(--graphite)">${items}</div>
      <div class="mono abs" data-k="b_meta[]" style="left:14px;top:64px;font-size:10px;color:var(--graphite)">${meta}</div></div>`;
  const cellB = `
    ${capBlock('b_', 2, C.cap2Eyebrow, C.cap2)}
    <svg class="abs" width="1920" height="1080" style="left:0;top:0"><g data-k="b_art">${svgLines([
      'M150 690 H690', ...[0, 1, 2, 3, 4].map(i => `M${196 + i * 98} 690 v${120 + (i % 2) * 26} h72 v-${120 + (i % 2) * 26}`),
      ...[0, 1, 2, 3, 4].map(i => `M${208 + i * 98} ${730 + (i % 2) * 6} h44 M${208 + i * 98} ${752 + (i % 2) * 6} h30`),
      'M120 900 H720', 'M160 900 V1100', 'M680 900 V1100',
      ...[0, 1, 2].map(j => `M${910 + j * 350} 670 V744 M${860 + j * 350} 744 H${960 + j * 350}`)], lineArtStyle)}</g>
      <path data-k="b_wire" pathLength="1" d="M910 744 V800 H1610 V744 M1260 744 V800" style="fill:none;stroke:var(--accent);stroke-width:3"/>
      ${[0, 1, 2].map(j => `<circle data-k="b_node[]" cx="${910 + j * 350}" cy="800" r="9" style="fill:var(--paper);stroke:var(--accent);stroke-width:3"/>`).join('')}
      <g data-k="b_pulse"><circle r="22" style="fill:var(--accent);opacity:.18"/><circle r="8" style="fill:var(--accent)"/></g>
    </svg>
    <div class="mono abs" data-k="b_status" style="right:160px;top:206px;font-size:12px;color:var(--graphite)"><span class="accent">●</span>&nbsp; Live &nbsp;&nbsp;&nbsp; Open 6 &nbsp;&nbsp;&nbsp; Done <span data-k="b_done" style="color:var(--ink)">41</span></div>
    ${stations.map((s, j) => `
      <div class="device" data-k="b_mon[]" style="left:${760 + j * 350}px;top:250px;width:300px;height:420px;border-radius:12px">
        <div class="screen" style="inset:10px;border-radius:4px;background:#F6F4F0">
          <div class="mono abs" style="left:14px;top:14px;font-size:11px;color:var(--ink)">${s}</div>
          <div class="abs" style="right:14px;top:16px;width:8px;height:8px;border-radius:50%;background:var(--accent)"></div>
          <div class="abs" data-k="b_list[]" style="left:0;top:42px;right:0;bottom:0">${{
            0: orderCard(1043, '2× Flat White · Croissant', 'New', 'new', '12:31') + orderCard(1042, 'Cold Brew · Cookie', 'New', 'new', '12:30') + orderCard(1041, '3× Espresso', 'Sent', 'ghost', '12:28'),
            1: orderCard('1043', '2× Flat White · Croissant', 'Preparing', 'new', '00:00') + orderCard(1040, 'Mocha · 2× Croissant', 'Preparing', 'new', '04:12') + orderCard(1039, 'Spanish Latte', 'Preparing', 'new', '06:40'),
            2: orderCard('1043', '2× Flat White · Croissant', 'Ready', 'ink', 'Customer notified') + orderCard(1038, 'Americano · Muffin', 'Ready', 'ink', 'Customer notified'),
          }[j]}</div>
        </div>
      </div>`).join('')}`;

  // --- Cell D: supermarket stock app
  const stockRows = [['Rice 5 kg', '40211', .82, 64], ['Olive Oil 1 L', '40388', .55, 31], ['Pasta 500 g', '40102', .9, 120], ['Milk 1 L', '40017', .08, 4], ['Sugar 1 kg', '40255', .6, 48], ['Tea, 100 bags', '40590', .7, 52]];
  const shelfR = rng(21);
  const shelfBoxes = [740, 850, 960].map(y => { let x = 176, d = ''; while (x < 500) { const w = 30 + shelfR() * 44, h = 40 + shelfR() * 50; d += `M${x.toFixed(0)} ${y} v-${h.toFixed(0)} h${w.toFixed(0)} v${h.toFixed(0)} `; x += w + 8; } return d; });
  const cellD = `
    ${capBlock('d_', 3, C.cap3Eyebrow, C.cap3)}
    <svg class="abs" width="1920" height="1080" style="left:0;top:0"><g data-k="d_art">${svgLines([
      'M160 620 V980', 'M560 620 V980', 'M150 620 H570', 'M150 740 H570', 'M150 850 H570', 'M150 960 H570', ...shelfBoxes,
      'M100 980 H600'], lineArtStyle)}</g></svg>
    <div class="device" data-k="d_tab" style="left:760px;top:210px;width:1000px;height:640px;border-radius:34px">
      <div class="screen" style="inset:18px;border-radius:16px;background:var(--paperHi)">
        <div class="abs" style="left:0;top:0;bottom:0;width:200px;background:#EFECE6">
          <div class="abs" style="left:26px;top:30px;width:18px;height:18px;border-radius:4px;background:var(--ink)"></div>
          <div class="mono abs" style="left:54px;top:32px;font-size:12px">Store</div>
          ${['Overview', 'Stock', 'Orders', 'Suppliers', 'Reports'].map((n, i) => `<div class="mono abs" style="left:26px;top:${100 + i * 42}px;font-size:12px;color:${i === 1 ? 'var(--ink)' : 'var(--graphite)'};font-weight:${i === 1 ? 700 : 500}">${n}</div>`).join('')}
          <div class="abs" style="left:0;top:96px;width:3px;height:22px;background:var(--accent)"></div>
        </div>
        <div class="abs" style="left:236px;top:0;right:36px;bottom:0">
          <div class="display abs" data-k="d_title" style="left:0;top:32px;font-size:34px">Stock — Aisle 4</div>
          <div class="mono abs" style="right:0;top:46px;font-size:11px;color:var(--graphite)"><span class="accent">●</span> Synced 09:41</div>
          <div class="mono abs" style="left:0;right:0;top:104px;font-size:10px;color:var(--graphite)"><span class="abs" style="left:0">Product</span><span class="abs" style="left:300px">SKU</span><span class="abs" style="left:420px">Level</span><span class="abs" style="right:0">Qty</span></div>
          ${stockRows.map(([n, sku, lv, q], i) => `<div class="abs" data-k="d_row[]" style="left:0;right:0;top:${130 + i * 62}px;height:62px;border-top:1px solid var(--rule)">
              <span class="abs sans" style="left:0;top:20px;font-size:19px;font-weight:600">${n}</span>
              ${n === 'Milk 1 L' ? `<span class="abs" style="left:96px;top:19px"><span class="chip new" data-k="d_low" style="font-size:10px">Low</span><span class="chip ink abs" data-k="d_sent" style="font-size:10px;left:0;top:0">Reorder sent</span></span>` : ''}
              <span class="abs mono" style="left:300px;top:23px;font-size:13px;color:var(--graphite);letter-spacing:.06em">${sku}</span>
              <span class="abs" style="left:420px;top:28px;width:170px;height:6px;border-radius:3px;background:var(--rule)"><span data-k="d_bar[]" data-v="${lv}" style="display:block;height:100%;width:0;border-radius:3px;background:${lv < .2 ? 'var(--accent)' : 'var(--ink)'}"></span></span>
              <span class="abs mono" style="right:0;top:20px;font-size:18px">${q}</span></div>`).join('')}
          <div class="card" data-k="d_toast" style="right:-12px;top:18px;width:330px;height:76px;border-radius:10px">
            <div class="abs on-accent" style="left:16px;top:20px;width:34px;height:34px;border-radius:50%;background:var(--accent);font:700 18px/34px var(--sans);text-align:center">✓</div>
            <div class="sans abs" style="left:64px;top:16px;font-size:16px;font-weight:600">Reorder sent to supplier</div>
            <div class="mono abs" style="left:64px;top:44px;font-size:11px;color:var(--graphite)">24 × Milk 1 L · ETA tomorrow</div></div>
        </div>
      </div>
    </div>
    <div class="card" data-k="d_label" style="left:610px;top:700px;width:320px;height:170px;border-radius:10px">
      <div class="mono abs" style="left:22px;top:18px;font-size:12px">Milk 1 L · 40017</div>
      <svg class="abs" width="276" height="74" style="left:22px;top:46px">${(() => { const r = rng(5); let x = 0, s = ''; while (x < 270) { const w = 1 + Math.floor(r() * 4); s += `<rect x="${x}" y="0" width="${w}" height="74" fill="var(--ink)"/>`; x += w + 1 + Math.floor(r() * 3); } return s; })()}</svg>
      <div class="mono abs" style="left:22px;top:128px;font-size:12px;letter-spacing:.3em">6 221034 400170</div>
      <div class="abs" data-k="d_scan" style="left:10px;right:10px;top:46px;height:3px;background:var(--accent);box-shadow:0 0 14px 3px rgba(var(--accentRGB),.55)"></div>
    </div>`;

  // --- Cell C: campaign assets with one shared system
  const cellC = `
    ${capBlock('c_', 4, C.cap4Eyebrow, C.cap4)}
    <svg class="abs" width="1920" height="1080" style="left:0;top:0"><g data-k="c_art">${svgLines([
      'M140 640 H700', 'M140 640 L160 700', 'M700 640 L680 700', 'M160 700 ' + Array.from({ length: 10 }, () => 'a26 22 0 0 0 52 0').join(' '),
      ...Array.from({ length: 10 }, (_, i) => `M${186 + i * 52} 642 L${186 + i * 52} 700`),
      'M200 770 H480 V940 H200 Z', 'M340 770 V940', 'M520 770 H640 V940', 'M620 860 h0.1', 'M100 940 H760'], lineArtStyle)}
      <g style="stroke:var(--accent);stroke-width:1.5;fill:none" data-k="c_guides">${svgLines(['M700 180 H1820', 'M1230 120 V860', 'M700 620 H1820', 'M760 120 V860'])}</g>
      <g data-k="c_marks" style="font:600 11px var(--mono);fill:var(--accent)"><text x="1203" y="160">30</text><text x="1483" y="160">30</text><text x="1240" y="641">30</text></g>
    </svg>
    <div class="abs on-accent" data-k="c_as[]" style="left:760px;top:180px;width:440px;height:440px;background:var(--accent);border-radius:6px;box-shadow:0 30px 60px -30px rgba(30,25,15,.5)">
      <div class="mono abs" style="left:30px;top:30px;font-size:12px">Bakery · From 7 am</div>
      <div class="display abs" style="left:30px;top:76px;font-size:62px;font-weight:900;line-height:.94">Fresh<br>every<br>morning.</div>
      <div class="mono abs" style="left:30px;bottom:32px;font-size:12px">Order ahead</div>
      <div class="abs" style="right:28px;bottom:24px;width:52px;height:52px;border-radius:50%;background:var(--ink);color:var(--accent);font:700 26px/52px var(--sans);text-align:center">→</div></div>
    <div class="abs" data-k="c_as[]" style="left:1230px;top:180px;width:250px;height:440px;background:var(--ink);border-radius:18px;box-shadow:0 30px 60px -30px rgba(30,25,15,.5)">
      <div class="abs" style="left:14px;right:14px;top:14px;height:3px;display:flex;gap:4px"><span style="flex:1;background:var(--paperHi)"></span><span style="flex:1;background:rgba(251,250,247,.3)"></span><span style="flex:1;background:rgba(251,250,247,.3)"></span></div>
      <div class="display abs" style="left:22px;top:150px;font-size:35px;font-weight:900;line-height:.98;color:var(--paperHi)">Weekend<br>Breakfast</div>
      <span class="chip new abs" style="left:22px;top:262px">Sat – Sun · 8 – 12</span>
      <div class="mono abs" style="left:22px;bottom:24px;font-size:11px;color:var(--paperHi);opacity:.7">Swipe up ↑</div></div>
    <div class="abs" data-k="c_as[]" style="left:1510px;top:180px;width:250px;height:353px;background:var(--paperHi);border:1px solid var(--rule);border-radius:6px;box-sizing:border-box;box-shadow:0 30px 60px -30px rgba(30,25,15,.4);background-image:linear-gradient(var(--rule) 1px,transparent 1px),linear-gradient(90deg,var(--rule) 1px,transparent 1px);background-size:41.6px 41.6px">
      <div class="display abs" style="left:22px;top:36px;font-size:52px;font-weight:900;line-height:.94">Open<br>late.</div>
      <div class="abs" style="right:22px;bottom:56px;width:60px;height:60px;border-radius:50%;background:var(--accent)"></div>
      <div class="mono abs" style="left:22px;bottom:22px;font-size:10px">Every day · until 1 am</div></div>
    <div class="abs" data-k="c_as[]" style="left:1230px;top:650px;width:530px;height:150px;background:var(--paperHi);border:1px solid var(--rule);border-radius:6px;box-sizing:border-box;overflow:hidden;box-shadow:0 30px 60px -30px rgba(30,25,15,.4)">
      <div class="abs" style="left:0;top:0;bottom:0;width:14px;background:var(--accent)"></div>
      <div class="sans abs" style="left:40px;top:34px;font-size:26px;font-weight:600">Olive Oil 1 L</div>
      <div class="mono abs" style="left:40px;top:80px;font-size:12px;color:var(--graphite)">SKU 40388 · Per unit</div>
      <div class="display abs" style="right:30px;top:24px;font-size:92px;font-weight:900">189</div></div>`;

  const cap = scene('cap', S.cap, S.trusted + .45, `
    <div class="abs" data-k="cam" style="left:0;top:0;width:4080px;height:2400px;transform-origin:0 0">
      ${Object.entries({ A: cellA, B: cellB, D: cellD, C: cellC }).map(([n, h]) => `<div class="abs" style="left:${CELL[n][0]}px;top:${CELL[n][1]}px;width:1920px;height:1080px">${h}</div>`).join('')}
      <svg class="abs" width="4080" height="2400" style="left:0;top:0">
        <g style="fill:none;stroke:var(--accent);stroke-width:10;stroke-linecap:round">${svgLines(['M2040 1200 H-60', 'M2040 1200 H4140', 'M2040 1200 V-60', 'M2040 1200 V2460']).replace(/<path/g, '<path data-k="x_arm[]"')}</g>
        ${[[2040, 540], [2040, 1860], [960, 1200], [3120, 1200]].map(([x, y]) => `<circle data-k="x_node[]" cx="${x}" cy="${y}" r="20" style="fill:var(--paper);stroke:var(--accent);stroke-width:9"/>`).join('')}
        <rect data-k="x_hub" x="2004" y="1164" width="72" height="72" style="fill:var(--accent);transform-origin:2040px 1200px"/>
      </svg>
    </div>
    <div class="display abs center" data-k="x_head" style="left:0;width:1920px;top:96px;font-size:64px"></div>
    <div class="mono abs center" data-k="x_sub" style="left:0;width:1920px;top:182px;color:var(--graphite)">${esc(C.connectSub)}</div>
  `);
  const capCam = [
    [0, { cx: 960, cy: 540, s: 1.14 }], [.6, { cx: 960, cy: 540, s: 1 }, 'outExpo'],
    [2.6, { cx: 960, cy: 540, s: 1.012 }, 'linear'], [3.25, { cx: 3120, cy: 540, s: 1 }, 'inOutQuint'],
    [5.1, { cx: 3120, cy: 540, s: 1.012 }, 'linear'], [5.75, { cx: 3120, cy: 1860, s: 1 }, 'inOutQuint'],
    [7.6, { cx: 3120, cy: 1860, s: 1.012 }, 'linear'], [8.25, { cx: 960, cy: 1860, s: 1 }, 'inOutQuint'],
    [10.15, { cx: 960, cy: 1860, s: 1.012 }, 'linear'], [11.4, { cx: 2040, cy: 935, s: .31 }, 'inOutCubic'],
    [13.4, { cx: 2040, cy: 935, s: .33 }, 'linear'],
  ];
  const CS = { A: .1, B: 2.95, D: 5.45, C: 7.95 };   // local start of each cell's animation
  cap.ready = () => {
    const k = cap.k;
    ['a_', 'b_', 'c_', 'd_'].forEach(p => { cap[p + 'w'] = words(k[p + 'cap'], k[p + 'cap'].dataset.text); });
    cap.xw = words(k.x_head, C.connect);
  };
  const mmss = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function caption(p, Lc) {
    const k = cap.k;
    set(k[p + 'eye'], { o: prog(Lc, 0, .5, E.outCubic), x: (1 - prog(Lc, 0, .8, E.outExpo)) * -20 });
    wordsAnim(cap[p + 'w'], Lc, .12, undefined, { stagger: .06 });
  }
  cap.update = t => {
    const k = cap.k, Lt = t - S.cap;
    const c = keyframes(capCam, Lt), c0 = keyframes(capCam, Lt - 1 / 60);
    k.cam.style.transform = `translate(${960 - c.cx * c.s}px,${540 - c.cy * c.s}px) scale(${c.s})`;
    // Directional motion blur from camera speed.
    const dx = Math.abs(c.cx * c.s - c0.cx * c0.s), dy = Math.abs(c.cy * c.s - c0.cy * c0.s);
    const v = Math.max(dx, dy), std = Math.min(26, v * .32);
    if (std > .4) { document.getElementById('mblurStd').setAttribute('stdDeviation', dx > dy ? `${std} 0` : `0 ${std}`); k.cam.style.filter = 'url(#mblur)'; }
    else k.cam.style.filter = 'none';

    // Cell A — menu
    let Lc = Lt - CS.A;
    caption('a_', Lc);
    k.a_art.querySelectorAll('path').forEach((p, i) => draw(p, prog(Lc, i * .04, .9 + i * .04, E.outCubic)));
    set(k.a_ui, { o: prog(Lc, .05, .45, E.outCubic) });
    set(k.a_tabs, { o: prog(Lc, .25, .7, E.outCubic), y: (1 - prog(Lc, .25, .9)) * 12 });
    set(k.a_title, { o: prog(Lc, .3, .8, E.outCubic), y: (1 - prog(Lc, .3, 1)) * 14 });
    k.a_row.forEach((r, i) => {
      set(r, { o: prog(Lc, .4 + i * .06, .9 + i * .06, E.outCubic), x: (1 - prog(Lc, .4 + i * .06, 1.1 + i * .06)) * 26 });
      const hl = i === 3 ? prog(Lc, 1.6, 1.9, E.outCubic) : 0;
      r.style.background = `rgba(${ACC},${(.16 * hl).toFixed(3)})`;
      r.style.boxShadow = hl > 0 ? `inset ${(4 * hl).toFixed(1)}px 0 0 var(--accent)` : 'none';
    });
    k.a_promo.style.clipPath = `inset(${(100 * (1 - prog(Lc, .55, 1.2, E.outExpo))).toFixed(2)}% 0 0 0)`;
    set(k.a_pill, { s: prog(Lc, 1.05, 1.45, E.outBack) });
    k.a_promo.querySelectorAll('path').forEach((p, i) => draw(p, prog(Lc, .85 + i * .07, 1.6 + i * .07, E.outCubic)));

    // Cell B — orders
    Lc = Lt - CS.B;
    caption('b_', Lc);
    k.b_art.querySelectorAll('path').forEach((p, i) => draw(p, prog(Lc, i * .03, .8 + i * .03, E.outCubic)));
    k.b_mon.forEach((m, j) => set(m, { o: prog(Lc, j * .08, .5 + j * .08, E.outCubic), y: (1 - prog(Lc, j * .08, .8 + j * .08)) * 34 }));
    draw(k.b_wire, prog(Lc, .3, 1.0, E.inOutCubic));
    set(k.b_status, { o: prog(Lc, .4, .8, E.outCubic) });
    // Order #1043 travels counter → kitchen → pickup.
    const tNew = .45, arriveK = 1.0, arriveP = 1.5;
    const p1 = prog(Lc, .7, arriveK, E.inOutCubic), p2 = prog(Lc, 1.2, arriveP, E.inOutCubic);
    const px = Lc < 1.2 ? lerp(910, 1260, p1) : lerp(1260, 1610, p2);
    k.b_pulse.setAttribute('transform', `translate(${px},800)`);
    k.b_pulse.style.opacity = (Lc > .68 && Lc < arriveK + .05) || (Lc > 1.18 && Lc < arriveP + .05) ? 1 : 0;
    k.b_node.forEach((n, j) => {
      const lit = j === 0 ? prog(Lc, .65, .8) * (1 - prog(Lc, 1.1, 1.4)) : j === 1 ? prog(Lc, arriveK - .05, arriveK + .1) * (1 - prog(Lc, 1.5, 1.8)) : prog(Lc, arriveP - .05, arriveP + .1);
      n.style.fill = lit > .5 ? 'var(--accent)' : 'var(--paper)';
    });
    const slot = i => i * 98 + 10;
    k.b_list.forEach((list, j) => {
      const cards = [...list.querySelectorAll('[data-k="b_card[]"]')];
      const enter = [tNew, arriveK, arriveP][j];
      const pe = prog(Lc, enter, enter + .5, E.outExpo);
      cards.forEach((card, i) => {
        if (i === 0) set(card, { y: slot(0) - 24 * (1 - pe), o: pe });
        else set(card, { y: slot(i - 1) + 98 * pe, o: 1 });
      });
      if (j === 1) {                                     // kitchen: #1043 leaves when ready
        const out = prog(Lc, arriveP - .1, arriveP + .3, E.outCubic);
        cards[0].style.opacity = pe * (1 - out);
        cards.slice(1).forEach((card, i) => set(card, { y: slot(i) + 98 * pe * (1 - out) + 0 * out }));
        const meta = cards.map(c => c.querySelector('[data-k="b_meta[]"]'));
        meta[0].textContent = mmss(Math.max(0, (Lc - arriveK) * 1));
        meta[1].textContent = mmss(252 + Math.max(0, Lc));
        meta[2].textContent = mmss(400 + Math.max(0, Lc));
      }
      if (j === 0) {
        const chip = cards[0].querySelector('[data-k="b_chip[]"]');
        const sent = Lc > .75;
        chip.textContent = sent ? 'Sent' : 'New'; chip.className = `chip ${sent ? 'ghost' : 'new'} abs`;
      }
    });
    k.b_done.textContent = Lc > arriveP + .1 ? '42' : '41';

    // Cell D — retail
    Lc = Lt - CS.D;
    caption('d_', Lc);
    k.d_art.querySelectorAll('path').forEach((p, i) => draw(p, prog(Lc, i * .03, .8 + i * .03, E.outCubic)));
    set(k.d_tab, { o: prog(Lc, 0, .45, E.outCubic), y: (1 - prog(Lc, 0, .8)) * 40 });
    set(k.d_title, { o: prog(Lc, .25, .6, E.outCubic) });
    k.d_row.forEach((r, i) => set(r, { o: prog(Lc, .3 + i * .05, .7 + i * .05, E.outCubic), y: (1 - prog(Lc, .3 + i * .05, .9 + i * .05)) * 14 }));
    k.d_bar.forEach((b, i) => { b.style.width = (100 * +b.dataset.v * prog(Lc, .45 + i * .05, 1.2 + i * .05, E.outExpo)).toFixed(2) + '%'; });
    set(k.d_label, { o: prog(Lc, .45, .75, E.outCubic), y: (1 - prog(Lc, .45, .95)) * -30, r: lerp(-9, -4, prog(Lc, .45, 1.05)) });
    const sc = prog(Lc, .75, 1.15, E.inOutSine);
    set(k.d_scan, { y: 70 * Math.sin(Math.PI * sc), o: Lc > .75 && Lc < 1.2 ? 1 : 0 });
    const sent = prog(Lc, 1.2, 1.4, E.outCubic);
    k.d_low.style.opacity = 1 - sent; set(k.d_sent, { o: sent, s: lerp(.85, 1, sent) });
    set(k.d_toast, { o: prog(Lc, 1.3, 1.6, E.outCubic), y: (1 - prog(Lc, 1.3, 1.85)) * -24 });

    // Cell C — brand assets
    Lc = Lt - CS.C;
    caption('c_', Lc);
    k.c_art.querySelectorAll('path').forEach((p, i) => draw(p, prog(Lc, i * .03, .8 + i * .03, E.outCubic)));
    k.c_as.forEach((a, i) => {
      const p = prog(Lc, .1 + i * .14, .8 + i * .14, E.outExpo);
      set(a, { o: prog(Lc, .1 + i * .14, .35 + i * .14, E.outCubic), y: -60 * (1 - p), r: [-5, 4, 6, -3][i] * (1 - p) });
    });
    const g = prog(Lc, 1.0, 1.4, E.outCubic) * (1 - prog(Lc, 2.0, 2.4, E.inCubic));
    k.c_guides.querySelectorAll('path').forEach((p, i) => draw(p, prog(Lc, 1.0 + i * .06, 1.5 + i * .06, E.outExpo)));
    k.c_guides.style.opacity = g; k.c_marks.style.opacity = g;

    // Pull back: one connected system
    const xa = prog(Lt, 10.9, 11.9, E.inOutCubic);
    k.x_arm.forEach(a => draw(a, xa));
    k.x_node.forEach((n, i) => { const p = prog(Lt, 11.35 + i * .05, 11.7 + i * .05, E.outBack); n.style.transform = `scale(${p})`; n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; });
    k.x_hub.style.transform = `scale(${prog(Lt, 10.85, 11.25, E.outBack)}) rotate(${lerp(-90, 0, prog(Lt, 10.85, 11.5, E.outExpo))}deg)`;
    wordsAnim(cap.xw, Lt, 11.05, undefined, { stagger: .07 });
    set(k.x_sub, { o: prog(Lt, 11.5, 11.9, E.outCubic) });

    // Exit (defocus) into the first principle.
    const ex = prog(Lt, S.trusted - S.cap - .45, S.trusted - S.cap + .15, E.inCubic);
    set(cap.el, { o: 1 - ex, blur: 18 * ex, s: 1 + .05 * ex });
    // Entry from the idea zoom.
    const en = prog(Lt, .05, .55, E.outCubic);
    cap.el.style.opacity = Math.min(en, 1 - ex);
    if (en < 1) cap.el.style.filter = `blur(${(10 * (1 - en)).toFixed(2)}px)`;
  };

  /* =====================================================================
     4. PRINCIPLES
     ===================================================================== */
  const PL = CFG.pillars;
  const trusted = scene('trusted', S.trusted - .35, S.stable + .05, `
    <div class="mono abs center" data-k="eye" style="left:0;width:1920px;top:206px;color:var(--graphite)">Principle <span class="accent">01</span> / 03</div>
    <div class="display abs center" data-k="word" style="left:0;width:1920px;top:292px;font-size:240px;font-weight:900;font-stretch:125%;text-transform:uppercase" data-fit="1640">${esc(PL[0].word)}</div>
    <div class="abs" data-k="glass" style="left:110px;top:280px;width:1700px;height:300px;border-radius:20px;background:linear-gradient(115deg,rgba(255,255,255,.62),rgba(255,255,255,.28) 55%,rgba(255,255,255,.5));border:1px solid rgba(255,255,255,.8);box-shadow:0 30px 60px -30px rgba(30,25,15,.25), inset 0 1px 0 rgba(255,255,255,.9)">
      <div class="abs" data-k="sheen" style="top:0;bottom:0;width:260px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);transform:skewX(-18deg)"></div></div>
    <svg class="abs" width="1920" height="1080" style="left:0;top:0">
      <line x1="400" x2="1520" y1="726" y2="726" style="stroke:var(--rule);stroke-width:2"/>
      <line data-k="tl" pathLength="1" x1="400" x2="1520" y1="726" y2="726" style="stroke:var(--accent);stroke-width:3"/>
      ${[0, 1, 2, 3].map(i => `<circle data-k="td[]" cx="${400 + i * 373.33}" cy="726" r="9" style="stroke:var(--accent);stroke-width:3"/>`).join('')}
    </svg>
    ${[['Received', '12:31'], ['Confirmed', '12:31'], ['Preparing', '12:33'], ['Ready', '12:41']].map(([a, b], i) => `
      <div class="abs center" data-k="tlab[]" style="left:${400 + i * 373.33 - 120}px;width:240px;top:752px"><div class="mono" style="font-size:13px">${a}</div><div class="mono" style="font-size:12px;color:var(--graphite);margin-top:6px">${b}</div></div>`).join('')}
    <div class="mono abs center" data-k="sub" style="left:0;width:1920px;top:880px;color:var(--graphite)">${esc(PL[0].line)}</div>
  `);
  trusted.update = t => {
    const k = trusted.k, Lt = t - S.trusted;
    const clear = prog(Lt, .45, 1.8, E.inOutCubic);
    const inn = prog(Lt, -.15, .45, E.outCubic), out = prog(Lt, 3.3, 3.62, E.inCubic);
    set(k.word, { blur: 26 * (1 - clear) + 10 * out, o: inn * (1 - out), y: -30 * out, s: lerp(1.04, 1, clear) });
    set(k.glass, { o: inn * (1 - prog(Lt, .6, 1.8, E.inOutCubic)), y: -50 * clear });
    k.sheen.style.left = lerp(-300, 1800, prog(Lt, .2, 1.6, E.inOutSine)) + 'px';
    set(k.eye, { o: prog(Lt, .1, .5, E.outCubic) * (1 - out) });
    const tl = prog(Lt, 1.6, 2.8, E.inOutCubic);
    draw(k.tl, tl);
    k.td.forEach((d, i) => { const on = tl >= i / 3 - .001; d.style.fill = on ? 'var(--accent)' : 'var(--paper)'; d.style.opacity = prog(Lt, 1.45 + i * .05, 1.7 + i * .05, E.outCubic) * (1 - out); });
    k.tlab.forEach((l, i) => set(l, { o: prog(Lt, 1.6 + i * .3, 1.95 + i * .3, E.outCubic) * (1 - out), y: (1 - prog(Lt, 1.6 + i * .3, 2.2 + i * .3)) * 10 }));
    k.tl.parentNode.style.opacity = 1 - out;
    set(k.sub, { o: prog(Lt, 2.2, 2.7, E.outCubic) * (1 - out) });
  };

  const stable = scene('stable', S.stable - .1, S.designed + .1, `
    <svg class="abs" width="1920" height="1080" style="left:0;top:0">
      <g style="stroke:var(--paperHi);stroke-width:1.2;opacity:.1">${Array.from({ length: 13 }, (_, i) => `<line data-k="col[]" x1="${GX(i)}" x2="${GX(i)}" y1="760" y2="760"/>`).join('')}</g>
      <line data-k="floorL" pathLength="1" x1="960" x2="160" y1="760" y2="760" style="stroke:var(--paperHi);stroke-width:2.4"/>
      <line data-k="floorR" pathLength="1" x1="960" x2="1760" y1="760" y2="760" style="stroke:var(--paperHi);stroke-width:2.4"/>
    </svg>
    <div class="mono abs center" data-k="eye" style="left:0;width:1920px;top:206px;color:var(--paperHi);opacity:.6">Principle <span class="accent">02</span> / 03</div>
    <div class="display abs center" data-k="word" style="left:0;width:1920px;top:400px;font-size:260px;font-weight:900;font-stretch:125%;text-transform:uppercase;color:var(--paperHi);line-height:1" data-fit="1600"></div>
    <div class="mono abs center" data-k="status" style="left:0;width:1920px;top:800px;color:var(--paperHi);font-size:13px">
      <span style="opacity:.55">All stations online</span>&nbsp;&nbsp;&nbsp;&nbsp;
      ${['Counter', 'Kitchen', 'Pickup', 'Stock'].map(s => `<span class="accent">●</span>&nbsp;${s}&nbsp;&nbsp;&nbsp;`).join('')}</div>
    <div class="mono abs center" data-k="sub" style="left:0;width:1920px;top:880px;color:var(--paperHi);opacity:.6">${esc(PL[1].line)}</div>
  `);
  stable.ready = () => {
    const k = stable.k;
    k.word.innerHTML = [...PL[1].word].map(ch => `<span class="ltr" style="display:inline-block;transform-origin:50% 100%">${esc(ch)}</span>`).join('');
    stable.ltr = [...k.word.querySelectorAll('.ltr')];
    // Sit the baseline on the floor line.
    const m = document.createElement('span'); m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    k.word.appendChild(m); const base = m.offsetTop; m.remove();
    k.word.style.top = (760 - base - 2) + 'px';
  };
  stable.update = t => {
    const k = stable.k, Lt = t - S.stable;
    const fl = prog(Lt, .05, .65, E.outExpo);
    draw(k.floorL, fl); draw(k.floorR, fl);
    k.col.forEach((c, i) => c.setAttribute('y1', 760 - 520 * prog(Lt, .2 + Math.abs(i - 6) * .04, .9 + Math.abs(i - 6) * .04, E.outExpo)));
    stable.ltr.forEach((l, i) => {
      const a = .5 + i * .075, land = a + .42;
      const fall = clamp((Lt - a) / .42);
      const y = Lt < a ? -1000 : Lt < land ? -1000 * (1 - E.inQuad(fall)) : 0;
      const sq = Lt >= land ? Math.sin(Math.PI * clamp((Lt - land) / .2)) * .07 : 0;
      l.style.transform = `translateY(${y.toFixed(1)}px) scale(${(1 + sq * .5).toFixed(3)},${(1 - sq).toFixed(3)})`;
      l.style.visibility = Lt < a ? 'hidden' : 'visible';
    });
    set(k.eye, { o: .6 * prog(Lt, .1, .5, E.outCubic) });
    set(k.status, { o: prog(Lt, 1.6, 2.0, E.outCubic) });
    set(k.sub, { o: .6 * prog(Lt, 2.0, 2.5, E.outCubic) });
  };

  const designed = scene('designed', S.designed - .4, S.reveal + 1.4, `
    <svg class="abs" width="1920" height="1080" style="left:0;top:0">
      <g style="stroke:var(--accent);stroke-width:1.2">${Array.from({ length: 13 }, (_, i) => `<line data-k="g[]" pathLength="1" x1="${GX(i)}" x2="${GX(i)}" y1="110" y2="970"/>`).join('')}</g>
      <g data-k="hg" style="stroke:var(--accent);stroke-width:1.2;opacity:.6"><line data-k="base" pathLength="1" x1="120" x2="1800" y1="0" y2="0"/><line data-k="capl" pathLength="1" x1="120" x2="1800" y1="0" y2="0"/></g>
      <g data-k="ticks" style="stroke:var(--accent);stroke-width:1.5"></g>
    </svg>
    <div class="mono abs center" data-k="eye" style="left:0;width:1920px;top:206px;color:var(--graphite)">Principle <span class="accent">03</span> / 03</div>
    <div class="display abs center" data-k="word" style="left:0;width:1920px;top:330px;font-size:176px;font-weight:850;font-stretch:112%;text-transform:uppercase;line-height:1" data-fit="1600"></div>
    ${[0, 1, 2].map(j => `<div class="card" data-k="mod[]" style="left:${col(j)}px;top:640px;width:${CW}px;height:190px">
        ${j === 0 ? `<div class="abs" style="left:24px;top:26px;width:180px;height:14px;border-radius:3px;background:var(--ink)"></div>${[0, 1, 2].map(r => `<div class="abs" style="left:24px;top:${66 + r * 28}px;width:${[420, 360, 300][r]}px;height:8px;border-radius:3px;background:var(--rule)"></div>`).join('')}` : ''}
        ${j === 1 ? `<svg class="abs" width="460" height="140" style="left:24px;top:26px">${Array.from({ length: 12 }, (_, i) => { const h = 30 + ((i * 47) % 90); return `<rect x="${i * 38}" y="${140 - h}" width="22" height="${h}" rx="3" fill="${i === 11 ? 'var(--accent)' : 'var(--ink)'}"/>`; }).join('')}</svg>` : ''}
        ${j === 2 ? `<div class="abs" style="left:24px;top:26px;width:200px;height:10px;border-radius:3px;background:var(--rule)"></div><div class="abs" style="left:24px;bottom:28px;width:200px;height:52px;border-radius:8px;background:var(--ink)"></div><div class="abs" style="right:24px;bottom:40px;width:64px;height:30px;border-radius:15px;background:var(--accent)"><div style="position:absolute;right:4px;top:4px;width:22px;height:22px;border-radius:50%;background:var(--paperHi)"></div></div>` : ''}
      </div>`).join('')}
    <div class="mono abs center" data-k="sub" style="left:0;width:1920px;top:884px;color:var(--graphite)">${esc(PL[2].line)}</div>
  `);
  designed.ready = () => {
    const k = designed.k;
    k.ticks.innerHTML = '';
    k.word.innerHTML = [...PL[2].word].map(ch => `<span class="ltr" style="display:inline-block">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
    designed.ltr = [...k.word.querySelectorAll('.ltr')];
    const r = rng(77);
    designed.off = designed.ltr.map(() => [(r() - .5) * 340, (r() - .5) * 260, (r() - .5) * 26]);
    const m = document.createElement('span'); m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    k.word.appendChild(m); const base = k.word.offsetTop + m.offsetTop; m.remove();
    const fs = parseFloat(k.word.style.fontSize);
    k.base.setAttribute('y1', base); k.base.setAttribute('y2', base);
    const capH = base - fs * .72;                          // Archivo cap height ≈ 0.72em
    k.capl.setAttribute('y1', capH); k.capl.setAttribute('y2', capH);
    designed.ticks = designed.ltr.map(l => {
      const x = l.offsetLeft + k.word.offsetLeft;
      const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ln.setAttribute('x1', x); ln.setAttribute('x2', x); ln.setAttribute('y1', capH - 26); ln.setAttribute('y2', base + 26);
      k.ticks.appendChild(ln); return ln;
    });
  };
  designed.update = t => {
    const k = designed.k, Lt = t - S.designed;
    const conv = prog(Lt, 3.55, 4.45, E.inOutExpo);         // guides converge into the mark
    const out = prog(Lt, 3.45, 3.9, E.inCubic);
    // Left half of the grid becomes the mark's ink stroke, right half its orange stroke.
    const col2 = prog(Lt, 4.0, 4.55, E.inOutCubic), gone = prog(Lt, 4.55, 4.95, E.linear);
    k.g.forEach((g, i) => {
      draw(g, prog(Lt, .05 + i * .03, .6 + i * .03, E.outExpo));
      const x = lerp(GX(i), i <= 6 ? 960 - MARK / 2 + SW / 2 : 960 + MARK / 2 - SW / 2, conv);
      g.setAttribute('x1', x); g.setAttribute('x2', x);
      g.setAttribute('y1', lerp(110, 452, col2)); g.setAttribute('y2', lerp(970, 628, col2));
      g.style.stroke = i <= 6 && col2 > .5 ? 'var(--ink)' : 'var(--accent)';
      g.style.strokeWidth = lerp(1.2, 3, col2);
      g.style.opacity = (.4 + .6 * conv) * (1 - gone);
    });
    const hg = prog(Lt, .3, .8, E.outExpo);
    draw(k.base, hg); draw(k.capl, hg);
    k.hg.style.opacity = .6 * (1 - prog(Lt, 2.3, 2.8, E.inCubic));
    designed.ltr.forEach((l, i) => {
      const a = .3 + i * .045, p = prog(Lt, a, a + .6, E.outExpo);
      const [dx, dy, dr] = designed.off[i];
      l.style.transform = `translate(${(dx * (1 - p)).toFixed(1)}px,${(dy * (1 - p)).toFixed(1)}px) rotate(${(dr * (1 - p)).toFixed(2)}deg)`;
      l.style.opacity = prog(Lt, a, a + .2, E.linear);
      const flash = Math.sin(Math.PI * prog(Lt, a + .35, a + .9, E.linear));
      designed.ticks[i].style.opacity = (flash * .9).toFixed(3);
    });
    set(k.word, { o: 1 - out, blur: 12 * out });
    k.mod.forEach((m, j) => {
      const a = 1.0 + j * .12, p = prog(Lt, a, a + .6, E.outExpo);
      set(m, { o: prog(Lt, a, a + .25, E.linear) * (1 - out), y: 50 * (1 - p), blur: 12 * out });
      const f = Math.sin(Math.PI * prog(Lt, a + .3, a + .9, E.linear));
      m.style.outline = f > .02 ? `2px solid rgba(${ACC},${(f * .9).toFixed(3)})` : 'none';
      m.style.outlineOffset = '6px';
    });
    set(k.eye, { o: prog(Lt, .1, .5, E.outCubic) * (1 - out) });
    set(k.sub, { o: prog(Lt, 1.8, 2.3, E.outCubic) * (1 - out) });
  };

  /* =====================================================================
     5. REVEAL + END FRAME — the line resolves into the temporary mark.
     ===================================================================== */
  const hasName = !!(ID.name && ID.name.trim());
  const contact = Object.values(ID.contact || {}).filter(Boolean).join('   ·   ');
  const h = SW / 2;
  const reveal = scene('reveal', S.reveal, DUR + 1, `
    <div class="abs" data-k="lock" style="left:0;top:0;width:1920px;height:1080px">
      <svg class="abs" data-k="mark" width="${MARK}" height="${MARK}" viewBox="0 0 ${MARK} ${MARK}" style="left:${960 - MARK / 2}px;top:${540 - MARK / 2}px;overflow:visible">
        <path data-k="m1" pathLength="1" d="M${h} ${MARK - 61} V${h} H${MARK - 61}" style="fill:none;stroke:var(--ink);stroke-width:${SW};stroke-linejoin:miter"/>
        <path data-k="m2" pathLength="1" d="M${MARK - h} 61 V${MARK - h} H61" style="fill:none;stroke:var(--accent);stroke-width:${SW};stroke-linejoin:miter"/>
      </svg>
      ${ID.logoSrc ? `<img class="abs" data-k="logo" src="${esc(ID.logoSrc)}" style="left:${960 - MARK / 2}px;top:${540 - MARK / 2}px;width:${MARK}px;height:${MARK}px;object-fit:contain">` : ''}
      <div class="display abs" data-k="name" style="top:0;font-size:132px;font-weight:800;line-height:1"></div>
    </div>
    <div class="display abs center" data-k="desc" style="left:0;width:1920px;font-size:40px;font-weight:700;font-stretch:104%"></div>
    <div class="mono abs center" data-k="pill" style="left:0;width:1920px;color:var(--graphite)">${esc(ID.pillarsLine).replace(/ · /g, '&nbsp;&nbsp;<span class="accent">·</span>&nbsp;&nbsp;')}</div>
    <div class="display abs center" data-k="tag" style="left:0;width:1920px;font-size:34px;font-weight:700;font-stretch:104%;color:var(--accent)">${esc(ID.tagline || '')}</div>
    <div class="mono abs center" data-k="contact" style="left:0;width:1920px;top:960px;font-size:13px;color:var(--ink)">${esc(contact)}</div>
  `);
  reveal.ready = () => {
    const k = reveal.k;
    reveal.wd = words(k.desc, ID.descriptor);
    if (hasName) {
      reveal.wn = words(k.name, ID.name);
      // Lockup geometry: mark (scaled) + gap + wordmark, centred as a group.
      const ms = .82, gap = 56, maxW = 1500;
      k.name.style.fontSize = '132px';
      let nw = k.name.scrollWidth;
      const avail = maxW - MARK * ms - gap;
      if (nw > avail) { k.name.style.fontSize = (132 * avail / nw).toFixed(1) + 'px'; nw = k.name.scrollWidth; }
      const fsN = parseFloat(k.name.style.fontSize);
      const total = MARK * ms + gap + nw, x0 = 960 - total / 2;
      reveal.lock = { ms, mx: x0 + MARK * ms / 2, my: 470, nx: x0 + MARK * ms + gap };
      k.name.style.left = reveal.lock.nx + 'px';
      // Vertically centre the wordmark's cap height on the mark.
      const m = document.createElement('span'); m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      k.name.appendChild(m); const base = m.offsetTop; m.remove();
      k.name.style.top = (470 + fsN * .72 / 2 - base) + 'px';
    } else {
      reveal.lock = { ms: 1, mx: 960, my: 432 };
    }
    const below = hasName ? 610 : 590;
    k.desc.style.top = below + 'px';
    k.pill.style.top = (below + 74) + 'px';
    k.tag.style.top = (below + 128) + 'px';
  };
  reveal.update = t => {
    const k = reveal.k, Lt = t - S.reveal;
    const d = prog(Lt, .62, 1.55, E.inOutCubic);
    draw(k.m1, d); draw(k.m2, d);
    const lockP = prog(Lt, 1.95, 2.75, E.outExpo);
    const lk = reveal.lock;
    const bump = 1 + .035 * Math.sin(Math.PI * prog(Lt, 1.5, 1.85, E.outCubic));
    const breathe = 1 + .012 * prog(Lt, 2.8, DUR - S.reveal, E.inOutSine);
    const cx = lerp(960, lk.mx, lockP), cy = lerp(540, lk.my, lockP), s = lerp(1, lk.ms, lockP) * bump;
    k.mark.style.transform = `translate(${(cx - 960).toFixed(2)}px,${(cy - 540).toFixed(2)}px) scale(${s.toFixed(4)})`;
    if (k.logo) {
      k.logo.style.transform = k.mark.style.transform;
      const x = prog(Lt, 1.9, 2.4, E.inOutCubic);
      k.logo.style.opacity = x; k.mark.style.opacity = 1 - x;
    }
    k.lock.style.transformOrigin = '960px 500px';
    set(k.lock, { s: breathe });
    if (hasName) wordsAnim(reveal.wn, Lt, 2.2, undefined, { stagger: .05, dur: .9 });
    wordsAnim(reveal.wd, Lt, hasName ? 2.55 : 2.35, undefined, { stagger: .05 });
    set(k.pill, { o: prog(Lt, 2.85, 3.4, E.outCubic), y: (1 - prog(Lt, 2.85, 3.6)) * 10 });
    set(k.tag, { o: prog(Lt, 3.1, 3.6, E.outCubic) });
    set(k.contact, { o: prog(Lt, 3.4, 3.9, E.outCubic) });
  };

  /* =====================================================================
     Global layers: light, dark wipes, overlay, grain
     ===================================================================== */
  const light = document.querySelector('#bg .light');
  const dark = document.getElementById('dark');
  const overlay = document.getElementById('overlay');
  const chapters = [[S.open, 'Process'], [S.idea, 'System'], [S.cap, 'Capabilities'], [S.trusted, 'Principles'], [S.reveal, 'Identity']];
  overlay.innerHTML = `
    <svg class="abs" width="1920" height="1080" style="left:0;top:0"><g data-k="crop" style="fill:none;stroke-width:1.5">
      ${[[1, 1], [-1, 1], [1, -1], [-1, -1]].map(([sx, sy]) => `<path data-k="cm[]" data-sx="${sx}" data-sy="${sy}" d="M0 ${30 * sy} V0 H${30 * sx}"/>`).join('')}</g></svg>
    <div class="mono abs" data-k="chap" style="left:96px;top:1012px;font-size:11px;letter-spacing:.2em"></div>
    <div class="abs" style="right:96px;top:1017px;display:flex;gap:6px">${chapters.map(() => `<span data-k="seg[]" style="width:26px;height:2px;display:block"></span>`).join('')}</div>`;
  const ov = keys(overlay);

  const grain = document.getElementById('grain'), gctx = grain.getContext('2d');
  const GR = Array.from({ length: 8 }, (_, f) => {
    const r = rng(1000 + f), img = gctx.createImageData(960, 540);
    for (let i = 0; i < img.data.length; i += 4) { const v = 200 + r() * 55; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    return img;
  });
  let lastGrain = -1;

  function globals(t) {
    // Soft light drifts across the paper; warm accent bloom very low.
    const lx = 50 + 9 * Math.sin(t * .17), ly = 42 + 6 * Math.cos(t * .13);
    const ax = 70 - 30 * clamp(t / DUR), ay = 70 - 10 * Math.sin(t * .1);
    light.style.background = `radial-gradient(38% 46% at ${lx}% ${ly}%, rgba(255,255,255,.85), rgba(255,255,255,0) 70%), radial-gradient(30% 36% at ${ax}% ${ay}%, rgba(${ACC},.07), rgba(${ACC},0) 70%)`;

    // Dark plate for "Stable": wipes up from the bottom, leaves to the left.
    const up = prog(t, S.stable - .4, S.stable + .1, E.inOutExpo);
    const off = prog(t, S.designed - .4, S.designed + .1, E.inOutExpo);
    dark.style.clipPath = `inset(${(100 * (1 - up)).toFixed(3)}% ${(100 * off).toFixed(3)}% 0 0)`;
    stable.el.style.clipPath = dark.style.clipPath;   // paper-coloured type must never show outside the plate
    const isDark = up > .5 && off < .5;
    const fg = isDark ? 'var(--paperHi)' : 'var(--ink)';

    // Overlay: crop marks, chapter, progress.
    const ci = prog(t, 0, .9, E.outExpo);
    ov.cm.forEach(p => {
      const sx = +p.dataset.sx, sy = +p.dataset.sy, inset = lerp(20, 56, ci);
      const x = sx > 0 ? inset : 1920 - inset, y = sy > 0 ? inset : 1080 - inset;
      p.setAttribute('transform', `translate(${x},${y})`); p.style.stroke = fg; p.style.opacity = .45 * ci;
    });
    let ch = 0; chapters.forEach(([s], i) => { if (t >= s) ch = i; });
    ov.chap.innerHTML = `<span style="color:var(--accent)">0${ch + 1}</span>&nbsp;&nbsp;${chapters[ch][1]}`;
    ov.chap.style.color = fg;
    const chFade = Math.min(prog(t, chapters[ch][0], chapters[ch][0] + .5, E.outCubic), 1 - prog(t, S.reveal + 1.6, S.reveal + 2.2, E.linear));
    ov.chap.style.opacity = .55 * ci * chFade;
    ov.seg.forEach((s, i) => {
      s.style.background = i === ch ? 'var(--accent)' : fg;
      s.style.opacity = (i === ch ? 1 : i < ch ? .5 : .15) * ci * (1 - prog(t, S.reveal + 1.6, S.reveal + 2.2, E.linear));
    });

    const gf = Math.floor(t * 24) % GR.length;
    if (gf !== lastGrain) { gctx.putImageData(GR[gf], 0, 0); lastGrain = gf; }
    grain.style.mixBlendMode = isDark ? 'screen' : 'multiply';
    grain.style.opacity = isDark ? .035 : .075;
  }

  // ---------- Init ----------
  await Promise.all(['900 100px FilmDisplay', '500 20px FilmSans', '500 20px FilmMono'].map(f => document.fonts.load(f)));
  await document.fonts.ready;
  // Auto-fit headline widths (keeps long names / copy edits from clipping).
  SC.forEach(sc => { sc.el.style.display = 'block'; });
  SC.forEach(sc => sc.ready && sc.ready());
  document.querySelectorAll('[data-fit]').forEach(el => {
    const max = +el.dataset.fit, w0 = el.style.width;
    el.style.width = 'max-content'; const w = el.offsetWidth; el.style.width = w0;
    if (w > max) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * max / w).toFixed(1) + 'px';
  });
  // Re-run layout-dependent setup after fitting.
  stable.ready(); designed.ready(); reveal.ready();
  const fitReport = [...document.querySelectorAll('[data-fit]')].map(el => ({ fit: el.dataset.fit, fs: el.style.fontSize || getComputedStyle(el).fontSize, text: el.textContent.trim().slice(0, 40) }));

  function seek(t) {
    globals(t);
    for (const sc of SC) {
      const on = t >= sc.from && t < sc.to;
      sc.el.style.display = on ? 'block' : 'none';
      if (on) sc.update(t);
    }
  }
  seek(0);

  window.FILM = { seek, duration: DUR, fps: TL.fps, fitReport, ready: true };

  // ---------- Preview player ----------
  if (!RENDER) {
    const vp = document.getElementById('viewport');
    const fit = () => { const s = Math.min(innerWidth / 1920, (innerHeight - 48) / 1080); stage.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px,${(innerHeight - 48 - 1080 * s) / 2}px) scale(${s})`; };
    addEventListener('resize', fit); fit();
    const audio = document.getElementById('audio'), btn = document.getElementById('play'), scrub = document.getElementById('scrub'), tm = document.getElementById('time');
    scrub.max = DUR;
    let playing = false, t0 = 0, start = 0;
    const now = () => playing ? (audio.readyState > 1 && !audio.muted && !audio.paused ? audio.currentTime : t0 + (performance.now() - start) / 1000) : +scrub.value;
    btn.onclick = () => {
      playing = !playing; btn.textContent = playing ? 'Pause' : 'Play';
      t0 = +scrub.value; start = performance.now();
      if (playing) { audio.currentTime = t0; audio.play().catch(() => {}); } else audio.pause();
    };
    document.getElementById('mute').onchange = e => { audio.muted = e.target.checked; };
    scrub.oninput = () => { seek(+scrub.value); tm.textContent = (+scrub.value).toFixed(2); if (playing) { audio.currentTime = +scrub.value; t0 = +scrub.value; start = performance.now(); } };
    const loop = () => {
      if (playing) { let t = now(); if (t >= DUR) { t = DUR; playing = false; btn.textContent = 'Play'; audio.pause(); } scrub.value = t; tm.textContent = t.toFixed(2); seek(t); }
      requestAnimationFrame(loop);
    };
    loop();
    if (qs.has('t')) { scrub.value = qs.get('t'); seek(+qs.get('t')); }
  }
})();
