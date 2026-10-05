// Motion toolkit: one paused GSAP master timeline that everything is placed on,
// plus helpers for kinetic typography, panels, counters and shape wipes.
// Everything is driven by tl.seek(t) so any frame can be rendered on its own.
import gsap from 'gsap';

export const tl = gsap.timeline({ paused: true, defaults: { immediateRender: false } });
export const ui = document.getElementById('ui');
export const ease = (name) => gsap.parseEase(name);

// ---- per-frame callbacks (procedural animation that is a pure function of t) ----
export const updaters = [];
export const onFrame = (fn) => updaters.push(fn);

// ---- small math helpers ----
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, u) => a + (b - a) * u;
export const ramp = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
export const win = (t, t0, t1, fade = 0.4) => Math.min(ramp(t, t0, t0 + fade), 1 - ramp(t, t1 - fade, t1));
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// ---- DOM element factory: starts hidden, shown by the timeline ----
export function el(html = '', cls = '', css = {}) {
  const d = document.createElement('div');
  d.className = cls;
  d.innerHTML = html;
  Object.assign(d.style, css);
  ui.appendChild(d);
  gsap.set(d, { autoAlpha: 0 });
  return d;
}

export function show(d, at, dur = 0.5, from = {}) {
  tl.fromTo(d, { autoAlpha: 0, ...from }, { autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: dur, ease: 'power3.out', ...keep(from) }, at);
}
export function hide(d, at, dur = 0.4, to = {}) {
  tl.to(d, { autoAlpha: 0, duration: dur, ease: 'power2.in', ...to }, at);
}
// keep xPercent/yPercent if a "from" set them (so centering survives)
function keep(from) {
  const k = {};
  if ('xPercent' in from) k.xPercent = from.xPercent;
  if ('yPercent' in from) k.yPercent = from.yPercent;
  return k;
}

// ---- kinetic typography ----
// text: words separated by spaces; *word* = accent colour; | = line break.
// anim: rise | pop | zoom | type | glitch | slam
export function words(text, o = {}) {
  let { at = 0 } = o;
  const {
    x = 960, y = 540, cls = 'h2', out = null, anim = 'rise', stagger = 0.07,
    accent = 'red', align = 'center', drift = 0.03, color = null, dur = 0.8,
  } = o;
  // if the previous line in the same spot is still leaving, start right after it
  for (const p of textLog) {
    const ov = p.end - at;
    if (ov > 0 && ov <= 0.6 && Math.abs(p.y - y) < 90 && Math.abs(p.x - x) < 700) at = p.end + 0.02;
  }
  const d = document.createElement('div');
  d.className = `kt ${cls}`;
  d.style.left = `${x}px`;
  d.style.top = `${y}px`;
  d.style.textAlign = align;
  if (color) d.style.color = color;
  ui.appendChild(d);
  const xp = align === 'center' ? -50 : align === 'right' ? -100 : 0;
  gsap.set(d, { xPercent: xp, yPercent: -50, autoAlpha: 0 });

  const inner = [];
  text.split('|').forEach((line, li) => {
    if (li) d.appendChild(document.createElement('br'));
    line.trim().split(/\s+/).forEach((tok, i, arr) => {
      const acc = /^\*.*\*[.,!?…]*$/.test(tok);
      const word = tok.replace(/\*/g, '');
      const m = document.createElement('span');
      m.className = anim === 'rise' ? 'mask' : '';
      m.style.display = 'inline-block';
      const w = document.createElement('span');
      w.className = `w${acc ? ` ${accent} glow-${accent === 'cyan' ? 'cyan' : 'red'}` : ''}`;
      if (anim === 'type') {
        [...word].forEach((ch) => { const c = document.createElement('span'); c.textContent = ch; c.className = 'c'; w.appendChild(c); });
      } else w.textContent = word;
      m.appendChild(w);
      d.appendChild(m);
      if (i < arr.length - 1) d.appendChild(document.createTextNode(' '));
      inner.push(w);
    });
  });

  tl.set(d, { autoAlpha: 1 }, at);
  const E = 'power4.out';
  if (anim === 'rise') tl.fromTo(inner, { yPercent: 115 }, { yPercent: 0, duration: dur, ease: E, stagger }, at);
  if (anim === 'pop') tl.fromTo(inner, { scale: 0.3, autoAlpha: 0, filter: 'blur(14px)' }, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: dur * 0.8, ease: 'back.out(2.2)', stagger }, at);
  if (anim === 'zoom') tl.fromTo(inner, { scale: 2.6, autoAlpha: 0, filter: 'blur(18px)' }, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: dur, ease: 'expo.out', stagger }, at);
  if (anim === 'slam') tl.fromTo(inner, { scale: 3.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'power4.in', stagger }, at);
  if (anim === 'type') {
    const chars = d.querySelectorAll('.c');
    tl.fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: o.cps ? 1 / o.cps : 0.035 }, at);
  }
  if (anim === 'glitch') {
    tl.fromTo(inner, { autoAlpha: 0, x: () => gsap.utils.random(-40, 40) }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'steps(6)', stagger: 0.04 }, at);
    glitchify(d, at, 0.9);
  }
  // slow kinetic drift while the line holds
  const hold = (out ?? at + 3) - at;
  if (drift && hold > 0) tl.fromTo(d, { scale: 1 }, { scale: 1 + drift, duration: hold, ease: 'none' }, at);
  if (out != null) {
    tl.to(inner, { yPercent: anim === 'rise' ? -115 : 0, autoAlpha: 0, duration: 0.3, ease: 'power3.in', stagger: 0.015 }, out);
    tl.set(d, { autoAlpha: 0 }, out + 0.32 + 0.015 * inner.length);
  }
  textLog.push({ text, x, y, at, end: out != null ? out + 0.3 : at + 4, cls });
  return d;
}

// overlap check: two kinetic lines in the same spot at the same time
export const textLog = [];
export function checkOverlaps() {
  const sorted = [...textLog].sort((a, b) => a.at - b.at);
  for (let i = 0; i < sorted.length; i++) for (let j = i + 1; j < sorted.length; j++) {
    const a = sorted[i], b = sorted[j];
    if (b.at >= a.end) continue;
    if (Math.abs(a.y - b.y) < 90 && Math.abs(a.x - b.x) < 700) console.warn(`text overlap @${b.at.toFixed(2)}: "${a.text}" (until ${a.end.toFixed(2)}) vs "${b.text}"`);
  }
}

// RGB-split jitter for a short burst
export function glitchify(d, at, dur = 0.6) {
  const n = Math.round(dur / 0.06);
  const r = rng(Math.round(at * 100));
  for (let i = 0; i < n; i++) {
    const a = (r() - 0.5) * 18, b = (r() - 0.5) * 18;
    tl.set(d, { x: (r() - 0.5) * 14, skewX: (r() - 0.5) * 8, textShadow: `${a}px 0 rgba(255,45,70,.85), ${b}px 0 rgba(47,224,255,.85)` }, at + i * 0.06);
  }
  tl.set(d, { x: 0, skewX: 0, textShadow: 'none' }, at + dur);
}

// number counter
export function counter(d, from, to, at, dur, fmt = (v) => Math.round(v).toLocaleString('en-US'), easeName = 'power2.out') {
  const o = { v: from };
  d.textContent = fmt(from);
  tl.fromTo(o, { v: from }, { v: to, duration: dur, ease: easeName, onUpdate: () => { d.textContent = fmt(o.v); } }, at);
}

// diagonal shape wipe; the screen is fully covered at (at + 0.45)
export function wipe(at, colors = ['#ff2d46', '#2fe0ff', '#0b1222']) {
  const bars = colors.map((c, i) => {
    const b = el('', 'wipe', { left: '-300px', top: `${-200 + i * 0}px`, width: '2600px', height: '1500px', background: c, borderRadius: '80px' });
    gsap.set(b, { rotation: -14, xPercent: 110, autoAlpha: 1, visibility: 'hidden' });
    return b;
  });
  bars.forEach((b, i) => {
    tl.set(b, { visibility: 'visible' }, at + i * 0.07);
    tl.fromTo(b, { xPercent: 110 }, { xPercent: 0, duration: 0.42, ease: 'power3.in' }, at + i * 0.07);
    tl.to(b, { xPercent: -115, duration: 0.5, ease: 'power3.out' }, at + 0.62 + (colors.length - 1 - i) * 0.07);
    tl.set(b, { visibility: 'hidden' }, at + 1.4);
  });
  return at + 0.45 + (colors.length - 1) * 0.07;
}

// circular iris (expands from a point, used for "fly into the mic")
export function iris(at, x, y, color = '#ff2d46', dur = 0.7, hold = 0.25) {
  const c = el('', '', { left: `${x}px`, top: `${y}px`, width: '20px', height: '20px', borderRadius: '50%', background: color, position: 'absolute' });
  gsap.set(c, { xPercent: -50, yPercent: -50 });
  tl.set(c, { autoAlpha: 1 }, at);
  tl.fromTo(c, { scale: 0 }, { scale: 240, duration: dur, ease: 'expo.in' }, at);
  tl.to(c, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, at + dur + hold);
  return at + dur;
}

// flash frame
export function flash(at, color = '#fff', dur = 0.35) {
  const f = el('', '', { position: 'absolute', inset: '0', background: color });
  tl.fromTo(f, { autoAlpha: 0.9 }, { autoAlpha: 0, duration: dur, ease: 'power2.out' }, at);
}

// letterbox bars
export function letterbox(at, h, dur = 1) {
  tl.to('#bars .bar', { height: h, duration: dur, ease: 'power3.inOut' }, at);
}

// section chip in the corner (e.g. "01 · THE INVESTIGATION")
export function chapter(n, title, at, out) {
  const d = el(`<span class="red mono" style="font-weight:700">${String(n).padStart(2, '0')}</span><span style="opacity:.35;margin:0 14px">/</span>${title}`, 'small', { position: 'absolute', left: '80px', top: '64px', color: '#c9d3e6' });
  show(d, at, 0.6, { x: -30 });
  hide(d, out, 0.4);
  const line = el('', '', { position: 'absolute', left: '80px', top: '104px', height: '2px', width: '260px', background: 'linear-gradient(90deg,#ff2d46,transparent)' });
  tl.set(line, { autoAlpha: 1 }, at);
  tl.fromTo(line, { scaleX: 0, transformOrigin: '0 0' }, { scaleX: 1, duration: 0.9, ease: 'power3.out' }, at + 0.1);
  hide(line, out, 0.4);
}
