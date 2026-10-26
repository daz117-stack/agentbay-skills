/* Small deterministic animation toolkit. Everything is a pure function of time t (seconds),
   so any frame can be rendered in any order. */
(function (g) {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = {
    linear: t => t,
    inQuad: t => t * t,
    outQuad: t => 1 - (1 - t) * (1 - t),
    inCubic: t => t * t * t,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outQuint: t => 1 - Math.pow(1 - t, 5),
    inOutQuint: t => t < .5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2,
    inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    outExpo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inExpo: t => t <= 0 ? 0 : Math.pow(2, 10 * t - 10),
    inOutExpo: t => t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    outBack: t => { const s = 1.5; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); },
    outBackSoft: t => { const s = .8; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); },
  };
  // Normalised, eased progress of t through [a, b].
  const prog = (t, a, b, e = E.outExpo) => e(clamp((t - a) / (b - a)));
  // Fade in over [a, a+din], out over [b, b+dout].
  const window_ = (t, a, din, b, dout) => Math.min(prog(t, a, a + din, E.outCubic), 1 - prog(t, b, b + dout, E.inCubic));

  function tf(o) {
    let s = '';
    if (o.x || o.y || o.z) s += `translate3d(${o.x || 0}px,${o.y || 0}px,${o.z || 0}px) `;
    if (o.rx) s += `rotateX(${o.rx}deg) `;
    if (o.ry) s += `rotateY(${o.ry}deg) `;
    if (o.r) s += `rotate(${o.r}deg) `;
    if (o.s !== undefined && o.s !== 1) s += `scale(${o.s}) `;
    if (o.sx !== undefined || o.sy !== undefined) s += `scale(${o.sx ?? 1},${o.sy ?? 1}) `;
    return s || 'none';
  }
  // Apply transform / opacity / blur in one call.
  function set(el, o) {
    if (!el) return;
    const st = el.style;
    if ('o' in o) st.opacity = o.o <= 0.001 ? 0 : o.o >= 0.999 ? 1 : o.o.toFixed(4);
    if ('blur' in o) st.filter = o.blur > 0.05 ? `blur(${o.blur.toFixed(2)}px)` : 'none';
    if (['x', 'y', 'z', 'r', 's', 'rx', 'ry', 'sx', 'sy'].some(k => k in o)) st.transform = tf(o);
    if ('vis' in o) st.visibility = o.vis ? 'visible' : 'hidden';
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Turn copy into masked words. "*word*" = accent colour, "|" = line break.
  function words(el, text) {
    const parts = String(text).split('|').map(line => line.trim().split(/\s+/).map(w => {
      const acc = /^\*.*\*$/.test(w) || /^\*/.test(w) || /\*$/.test(w);
      const clean = w.replace(/\*/g, '');
      return `<span class="wm"><span class="w${acc ? ' accent' : ''}">${esc(clean)}</span></span>`;
    }).join(' '));
    el.innerHTML = parts.join('<br>');
    return [...el.querySelectorAll('.w')];
  }
  // Masked word animation: rise in at tin, leave at tout. dir: +1 rises from below, -1 drops from above.
  function wordsAnim(ws, t, tin, tout, o = {}) {
    const st = o.stagger ?? .06, dur = o.dur ?? .8, dirIn = o.dirIn ?? 1, dirOut = o.dirOut ?? -1;
    const sto = o.staggerOut ?? .03, durOut = o.durOut ?? .45;
    ws.forEach((w, i) => {
      const pin = prog(t, tin + i * st, tin + i * st + dur, o.ease || E.outExpo);
      const pout = tout === undefined ? 0 : prog(t, tout + i * sto, tout + i * sto + durOut, E.inCubic);
      const y = (1 - pin) * 110 * dirIn + pout * 110 * dirOut;
      w.style.transform = `translateY(${y.toFixed(2)}%)`;
      w.style.visibility = (pin <= 0 || pout >= 1) ? 'hidden' : 'visible';
    });
  }

  // Collect [data-k] children into an object for quick access.
  function keys(root) {
    const o = {};
    root.querySelectorAll('[data-k]').forEach(el => {
      const k = el.dataset.k;
      if (k.endsWith('[]')) (o[k.slice(0, -2)] ||= []).push(el); else o[k] = el;
    });
    return o;
  }

  // Draw an SVG stroke 0..1 (elements need pathLength="1").
  function draw(el, p) {
    if (!el) return;
    el.style.strokeDasharray = '1 1';
    el.style.strokeDashoffset = (1 - clamp(p)).toFixed(4);
    el.style.visibility = p <= 0.001 ? 'hidden' : 'visible';
  }

  // Seeded PRNG so "random" layouts are identical on every render.
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  // Piecewise camera keyframes: [[t, {props}, easeName?], ...]; props interpolate from previous key.
  function keyframes(keys, t) {
    if (t <= keys[0][0]) return { ...keys[0][1] };
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, en] = keys[i];
      if (t < t1) {
        const [t0, v0] = keys[i - 1];
        const p = (E[en] || E.inOutCubic)(clamp((t - t0) / (t1 - t0)));
        const o = {};
        for (const k in v1) o[k] = k === 's' ? Math.exp(lerp(Math.log(v0[k]), Math.log(v1[k]), p)) : lerp(v0[k], v1[k], p);
        return o;
      }
    }
    return { ...keys[keys.length - 1][1] };
  }

  const fmt = n => Math.round(n).toLocaleString('en-US');

  g.L = { clamp, lerp, E, prog, win: window_, tf, set, esc, words, wordsAnim, keys, draw, rng, keyframes, fmt };
})(window);
