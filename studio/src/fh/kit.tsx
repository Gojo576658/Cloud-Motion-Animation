// "Fridge Hack" kit: the black-grid stage and white/red language (re-exported from ../ai/kit), Vio as host on
// the left, plus this story's pieces: the supermarket display freezer that heats up, the refrigeration
// controller (the little box on the wall), cooling coils with ice, the closed store at night, a stylised map
// of France with store pins, a night clock, a generic browser window, and the
// props for the history act (centrifuges, power lines, a fish tank with a smart thermometer).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { fonts } from '../tg/type';
import { useTF } from '../tg/kit';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import { Icon } from '../components/Icon';
import { A } from '../ai/kit';
import { Vio, talkFrom, type VioPose } from '../vio/Vio';
import { TTL, C0 } from './ttime';
export { A, GridBg, Phone, TypeOn, Label, Panel, BigNum, Hacker, Owner } from '../ai/kit';

// ---------------------------------------------------------------- Vio, the host (left third, owner's rule)
export const Host: React.FC<{ pose?: VioPose; at?: number; decode?: number; x?: number; size?: number }> = ({ pose = 'idle', at, decode = 0, x = 400, size = 860 }) => {
  const { t } = useTF();
  return <Vio x={x} y={1080 + 0.15 * size} size={size} pose={pose} at={at} decode={decode} talk={pose === 'idle' ? talkFrom(TTL.words, t) : 0} seed={5} />;
};
// the beat on screen: index of the last cue in `cues` that has started (with a small lead for the cut)
export const beatOf = (t: number, cues: number[], lead = 0.15) => { let k = 0; cues.forEach((c, j) => { if (t >= C0(c) - lead) k = j; }); return k; };

// ---------------------------------------------------------------- food (white glyphs on the shelves)
export const FOOD = ['mdi:food-steak', 'ph:fish-fill', 'mdi:cheese', 'mdi:ice-cream', 'mdi:food-drumstick', 'ph:pizza-fill', 'mdi:bottle-soda', 'ph:egg-fill'];

// steam wisps rising from (x, y) across width w
export const Steam: React.FC<{ x: number; y: number; w: number; amt: number; n?: number; seed?: number }> = ({ x, y, w, amt, n = 7, seed = 1 }) => {
  const { t } = useTF();
  if (amt < 0.02) return null;
  const r = rng(seed * 31);
  return (
    <>{Array.from({ length: n }, (_, i) => {
      const ox = r() * w, sp = 0.35 + r() * 0.3, ph = r();
      const u = (t * sp + ph) % 1;
      return <div key={i} style={{ position: 'absolute', left: x + ox + Math.sin(t * 2 + i) * 14, top: y - u * 220, width: 70 + 50 * u, height: 70 + 50 * u, borderRadius: '50%', background: 'rgba(244,244,246,.5)', filter: 'blur(18px)', opacity: amt * Math.sin(u * Math.PI) * 0.8, transform: 'translate(-50%,-50%)' }} />;
    })}</>
  );
};

// ---------------------------------------------------------------- the supermarket display freezer
// heat 0 = frosty and cold-lit; heat 1 = glowing red inside, frost gone, food sagging, steam on top.
export const Fridge: React.FC<{ x: number; y: number; w?: number; h?: number; heat?: number; doors?: number; seed?: number; temp?: number | null; label?: string; power?: number }> = ({ x, y, w = 420, h = 640, heat = 0, doors = 2, seed = 1, temp = null, label, power = 1 }) => {
  const { t } = useTF();
  const hz = clamp(heat), r = rng(seed * 7 + 3);
  const head = 70, dw = (w - 24) / doors;
  const hum = (1 - hz) * 0.04 * Math.sin(t * 9 + seed);
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: '#141419', border: `3px solid ${A.line}`, boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 ${80 * hz}px rgba(255,43,61,${0.35 * hz})` }} />
      <div style={{ position: 'absolute', left: 16, right: 16, top: 14, height: head - 24, borderRadius: 8, background: '#0a0a0d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 16, letterSpacing: '0.16em', color: A.dim }}>{label ?? 'FROZEN'}</div>
        {temp != null && <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: temp > 0 ? A.red : A.white, textShadow: temp > 0 ? `0 0 14px ${A.red}` : undefined }}>{temp > 0 ? '+' : ''}{Math.round(temp)}°C</div>}
      </div>
      {Array.from({ length: doors }, (_, d) => (
        <div key={d} style={{ position: 'absolute', left: 12 + d * dw + 4, top: head, width: dw - 8, height: h - head - 16, borderRadius: 8, overflow: 'hidden', border: `3px solid #2f2f38`,
          background: `linear-gradient(180deg, rgba(${lerp(220, 255, hz)},${lerp(228, 70, hz)},${lerp(240, 80, hz)},${(0.2 + 0.25 * hz) * power}), rgba(${lerp(200, 140, hz)},${lerp(205, 20, hz)},${lerp(215, 30, hz)},${(0.06 + 0.3 * hz) * power}))` }}>
          {[0.25, 0.5, 0.75].map((s) => <div key={s} style={{ position: 'absolute', left: 0, right: 0, top: `${s * 100}%`, height: 5, background: 'rgba(244,244,246,.25)' }} />)}
          {[0, 1, 2, 3].map((row) => [0, 1].map((col) => {
            const ic = FOOD[Math.floor(r() * FOOD.length)], sag = hz * (0.18 + r() * 0.2), wob = Math.sin(t * 1.3 + row + col * 2) * 4 * hz;
            const sz = Math.min(dw * 0.3, (h - head) * 0.13);
            return <div key={`${row}${col}`} style={{ position: 'absolute', left: `${22 + col * 44}%`, top: `${row * 25 + 25}%`, transform: `translate(0,-100%) scaleY(${1 - sag}) skewX(${wob}deg)`, transformOrigin: '50% 100%', opacity: 0.9 - 0.2 * hz }}><Icon name={ic} size={sz} color={hz > 0.5 ? '#ffd0d4' : A.white} /></div>;
          }))}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 15% 10%, rgba(255,255,255,.75), transparent 30%), radial-gradient(ellipse at 90% 95%, rgba(255,255,255,.6), transparent 26%)', opacity: (1 - hz) * 0.45, filter: 'blur(6px)' }} />
          <div style={{ position: 'absolute', left: '-30%', top: 0, width: '30%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent)', transform: 'skewX(-18deg) translateX(260%)' }} />
          <div style={{ position: 'absolute', right: 10, top: '38%', width: 8, height: '22%', borderRadius: 4, background: A.soft }} />
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${hum}px)` }} />
      <Steam x={0} y={10} w={w} amt={clamp((hz - 0.45) * 2)} seed={seed} />
    </div>
  );
};

// big digital temperature tag
export const Temp: React.FC<{ v: number; size?: number; sub?: string }> = ({ v, size = 150, sub }) => {
  const hot = v > 0;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...fonts.H, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: '-0.04em', color: hot ? A.red : A.white, textShadow: hot ? `0 0 40px rgba(255,43,61,.55)` : '0 10px 40px rgba(0,0,0,.5)' }}>{hot ? '+' : v < 0 ? '−' : ''}{Math.abs(Math.round(v))}°C</div>
      {sub && <div style={{ marginTop: 10, fontFamily: fonts.mono, fontWeight: 700, fontSize: size * 0.15, letterSpacing: '0.16em', color: A.dim }}>{sub}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- the refrigeration controller (box on the wall)
export type CtrlMode = 'COOL' | 'DEFROST' | 'ALARM' | 'LOCKED';
export const Controller: React.FC<{ x: number; y: number; w?: number; mode?: CtrlMode; rows?: [string, string][]; hot?: number[]; at?: number; old?: number; brand?: string }> = ({ x, y, w = 320, mode = 'COOL', rows = [['CASE 01', '-18.2'], ['CASE 02', '-19.0'], ['COLD RM', '+2.1']], hot = [], at, old = 0, brand = 'CONTROLLER' }) => {
  const { t, f, fps } = useTF();
  const s = at == null ? 1 : springAt(f, fps, at, { damping: 14, stiffness: 180 });
  const red = mode !== 'COOL', blink = Math.sin(t * 9) > 0;
  const h = w * 0.78;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, opacity: clamp(s * 1.6) }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: w * 0.06, background: `linear-gradient(160deg, ${A.soft}, #a9a9b2)`, boxShadow: `0 30px 70px rgba(0,0,0,.6), inset 0 -6px 0 rgba(0,0,0,.18)${red ? `, 0 0 60px rgba(255,43,61,${0.35 + 0.15 * Math.sin(t * 6)})` : ''}` }} />
      <div style={{ position: 'absolute', left: w * 0.07, top: w * 0.05, fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.045, letterSpacing: '0.18em', color: '#3a3a44' }}>{brand}</div>
      <div style={{ position: 'absolute', left: w * 0.07, right: w * 0.07, top: w * 0.13, height: h * 0.56, borderRadius: w * 0.025, background: '#0a0a0d', padding: `${w * 0.03}px ${w * 0.045}px`, boxShadow: 'inset 0 0 0 2px #000' }}>
        {rows.map(([k, v], i) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.055, lineHeight: 1.45, color: hot.includes(i) ? A.red : A.white }}><span>{k}</span><span>{v}°C</span></div>)}
        <div style={{ marginTop: w * 0.012, fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.05, color: red ? A.red : A.dim, letterSpacing: '0.12em', opacity: red && !blink ? 0.45 : 1 }}>MODE: {mode}</div>
      </div>
      <div style={{ position: 'absolute', left: w * 0.08, bottom: w * 0.06, display: 'flex', gap: w * 0.035 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: w * 0.04, height: w * 0.04, borderRadius: '50%', background: i === 2 && red ? (blink ? A.red : '#5a1a22') : i === 0 ? A.white : '#55555f', boxShadow: i === 2 && red && blink ? `0 0 12px ${A.red}` : undefined }} />)}
      </div>
      <div style={{ position: 'absolute', right: w * 0.08, bottom: w * 0.05, display: 'flex', gap: w * 0.025 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: w * 0.08, height: w * 0.055, borderRadius: 4, background: '#55555f' }} />)}</div>
      {old > 0 && <div style={{ position: 'absolute', inset: 0, borderRadius: w * 0.06, background: 'radial-gradient(ellipse at 30% 20%, rgba(120,110,95,.0), rgba(90,80,65,.5))', opacity: old }} />}
    </div>
  );
};

// cooling coils: ice builds up (ice 0..1), heat glows the pipe red and melts it into drops
export const Coil: React.FC<{ x: number; y: number; w?: number; ice?: number; heat?: number }> = ({ x, y, w = 640, ice = 0, heat = 0 }) => {
  const { t } = useTF();
  const n = 7, h = w * 0.5;
  const d = Array.from({ length: n }, (_, i) => { const px = (i / (n - 1)) * w; return `${i ? 'L' : 'M'} ${px} ${i % 2 ? h : 0}`; }).join(' ');
  return (
    <svg style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible' }} width={w} height={h}>
      {ice > 0.02 && <path d={d} stroke="rgba(235,240,248,.9)" strokeWidth={8 + 30 * ice} fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: 'blur(1.5px)' }} />}
      <path d={d} stroke={heat > 0.05 ? `rgb(${lerp(200, 255, heat)},${lerp(200, 43, heat)},${lerp(208, 61, heat)})` : '#a9a9b2'} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: heat > 0.05 ? `drop-shadow(0 0 ${14 * heat}px ${A.red})` : undefined }} />
      {heat > 0.2 && ice > 0.02 && Array.from({ length: 9 }, (_, i) => { const u = (t * 0.9 + i * 0.37) % 1; const px = ((i * 0.13 + 0.05) % 1) * w; return <ellipse key={i} cx={px} cy={h * 0.5 + u * 180} rx={5} ry={8} fill={A.white} opacity={(1 - u) * 0.8} />; })}
    </svg>
  );
};

// ---------------------------------------------------------------- the store at night
export const Store: React.FC<{ x: number; y: number; w?: number; lit?: number; heat?: number; closed?: boolean; name?: string }> = ({ x, y, w = 760, lit = 0, heat = 0, closed = true, name = 'SUPERMARCHÉ' }) => {
  const h = w * 0.5;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h }}>
      <div style={{ position: 'absolute', inset: 0, background: '#111116', border: `3px solid ${A.line}`, borderBottom: 'none', borderRadius: '10px 10px 0 0' }} />
      <div style={{ position: 'absolute', left: w * 0.06, right: w * 0.06, top: h * 0.07, height: h * 0.18, borderRadius: 6, background: '#0a0a0d', border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: h * 0.12, letterSpacing: '0.12em', color: lit > 0.5 ? A.white : '#3a3a44', textShadow: lit > 0.5 ? '0 0 20px rgba(255,255,255,.4)' : undefined }}>{name}</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: 'absolute', left: w * (0.06 + i * 0.3), top: h * 0.34, width: w * 0.26, height: h * 0.66, background: `linear-gradient(180deg, rgba(${lerp(200, 255, heat)},${lerp(210, 43, heat)},${lerp(225, 61, heat)},${0.06 + 0.22 * Math.max(lit, heat)}), rgba(10,10,13,.9))`, border: `3px solid #2a2a33`, borderBottom: 'none' }}>
          {i === 1 && <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 3, background: '#2a2a33' }} />}
          {i !== 1 && [0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: `${10 + k * 30}%`, bottom: 0, width: '22%', height: '62%', borderRadius: '4px 4px 0 0', border: `2px solid rgba(${heat > 0.3 ? '255,43,61' : '244,244,246'},${0.15 + 0.35 * Math.max(heat, lit * 0.5)})` }} />)}
        </div>
      ))}
      {closed && <div style={{ position: 'absolute', left: w * 0.5, top: h * 0.46, transform: 'translateX(-50%) rotate(-3deg)', padding: `${h * 0.02}px ${h * 0.05}px`, background: A.white, borderRadius: 4, fontFamily: fonts.mono, fontWeight: 700, fontSize: h * 0.06, letterSpacing: '0.14em', color: A.red }}>FERMÉ</div>}
      <div style={{ position: 'absolute', left: -w * 0.08, right: -w * 0.08, bottom: -6, height: 6, background: A.line }} />
    </div>
  );
};

// ---------------------------------------------------------------- stylised map of France with store pins
const FR: [number, number][] = [[0.52, 0.02], [0.62, 0.06], [0.70, 0.10], [0.80, 0.17], [0.90, 0.21], [0.97, 0.28], [0.94, 0.38], [0.92, 0.47], [0.86, 0.53], [0.88, 0.61], [0.92, 0.70], [0.95, 0.80], [0.92, 0.86], [0.80, 0.89], [0.70, 0.86], [0.61, 0.91], [0.56, 0.98], [0.42, 0.94], [0.30, 0.90], [0.24, 0.88], [0.27, 0.75], [0.30, 0.62], [0.25, 0.54], [0.22, 0.46], [0.10, 0.41], [0.02, 0.34], [0.03, 0.28], [0.15, 0.25], [0.27, 0.27], [0.29, 0.17], [0.36, 0.20], [0.45, 0.15], [0.49, 0.08]];
const inside = (px: number, py: number) => { let c = false; for (let i = 0, j = FR.length - 1; i < FR.length; j = i++) { const [xi, yi] = FR[i], [xj, yj] = FR[j]; if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c; } return c; };
const PINS = (() => { const r = rng(4242), out: [number, number][] = []; while (out.length < 400) { const p: [number, number] = [r(), r()]; if (inside(p[0], p[1])) out.push(p); } return out; })();
export const FranceMap: React.FC<{ x: number; y: number; size?: number; pins?: number; at?: number; spread?: number; all?: number; neighbours?: number; heat?: number }> = ({ x, y, size = 640, pins = 0, at = 0, spread = 2, all = 0, neighbours = 0 }) => {
  const { t } = useTF();
  const pts = FR.map(([a, b]) => `${a * size},${b * size}`).join(' ');
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {neighbours > 0 && <g opacity={neighbours}>
          <path d={`M ${0.52 * size} ${0.02 * size} L ${0.60 * size} ${-0.12 * size} L ${0.78 * size} ${-0.08 * size} L ${0.80 * size} ${0.17 * size} L ${0.70 * size} ${0.10 * size} Z`} fill="#16161c" stroke={A.dim} strokeWidth={2} strokeDasharray="6 6" />
          <path d={`M ${0.60 * size} ${-0.12 * size} L ${0.58 * size} ${-0.34 * size} L ${0.80 * size} ${-0.40 * size} L ${0.82 * size} ${-0.10 * size} L ${0.78 * size} ${-0.08 * size} Z`} fill="#16161c" stroke={A.dim} strokeWidth={2} strokeDasharray="6 6" />
        </g>}
        <polygon points={pts} fill="#16161c" stroke={A.white} strokeWidth={3} strokeLinejoin="round" />
      </svg>
      {PINS.slice(0, pins).map(([a, b], i) => {
        const on = all > 0 ? at + (i % 37) * 0.004 : at + (i / Math.max(1, pins)) * spread * (0.6 + 0.4 * ((i * 7919) % 11) / 11);
        const u = ramp(t, on, 0.3, EASE.out);
        if (u <= 0) return null;
        const ring = ((t - on) * 0.8) % 1;
        return <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: a * size, top: b * size, width: 10, height: 10, borderRadius: '50%', background: A.red, transform: `translate(-50%,-50%) scale(${u})`, boxShadow: `0 0 10px ${A.red}` }} />
          {i % 6 === 0 && <div style={{ position: 'absolute', left: a * size, top: b * size, width: 10 + ring * 40, height: 10 + ring * 40, borderRadius: '50%', border: `2px solid ${A.red}`, opacity: (1 - ring) * 0.6, transform: 'translate(-50%,-50%)' }} />}
        </React.Fragment>;
      })}
    </div>
  );
};

// ---------------------------------------------------------------- night clock (hands sweep `from` → `to` hours)
export const Clock: React.FC<{ x: number; y: number; size?: number; from: number; to: number; at: number; d: number; red?: boolean }> = ({ x, y, size = 300, from, to, at, d, red = false }) => {
  const { t } = useTF();
  const hr = lerp(from, to, ramp(t, at, d, EASE.inOut));
  const hA = (hr % 12) * 30, mA = (hr % 1) * 360;
  const hh = Math.floor(hr) % 24, mm = Math.floor((hr % 1) * 60);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
      <svg width={size} height={size} viewBox="-100 -100 200 200">
        <circle r={94} fill="#0d0d11" stroke={red ? A.red : A.white} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-80} x2={0} y2={i % 3 ? -72 : -66} stroke={A.soft} strokeWidth={i % 3 ? 3 : 5} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={8} x2={0} y2={-48} stroke={A.white} strokeWidth={9} strokeLinecap="round" transform={`rotate(${hA})`} />
        <line x1={0} y1={10} x2={0} y2={-72} stroke={red ? A.red : A.soft} strokeWidth={5} strokeLinecap="round" transform={`rotate(${mA})`} />
        <circle r={7} fill={A.white} />
      </svg>
      <div style={{ marginTop: 10, fontFamily: fonts.mono, fontWeight: 700, fontSize: size * 0.12, color: red ? A.red : A.white, letterSpacing: '0.1em' }}>{String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}</div>
    </div>
  );
};

// ---------------------------------------------------------------- browser window (controller web page, device search)
export const Browser: React.FC<{ x: number; y: number; w?: number; h?: number; url: string; at?: number; children?: React.ReactNode }> = ({ x, y, w = 820, h = 520, url, at, children }) => {
  const { f, fps } = useTF();
  const s = at == null ? 1 : springAt(f, fps, at, { damping: 15, stiffness: 180 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) translateY(${(1 - s) * 40}px) scale(${0.92 + 0.08 * s})`, opacity: clamp(s * 1.5), borderRadius: 18, background: A.panel, border: `2px solid ${A.line}`, boxShadow: '0 40px 90px rgba(0,0,0,.65)', overflow: 'hidden' }}>
      <div style={{ height: 54, background: '#16161c', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderBottom: `2px solid ${A.line}` }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i ? '#3a3a44' : A.red }} />)}
        <div style={{ marginLeft: 14, flex: 1, height: 32, borderRadius: 8, background: '#0a0a0d', display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: fonts.mono, fontSize: 17, color: A.dim, letterSpacing: '0.04em' }}>{url}</div>
      </div>
      <div style={{ position: 'relative', height: h - 54 }}>{children}</div>
    </div>
  );
};
// ---------------------------------------------------------------- history props
export const Centrifuge: React.FC<{ x: number; y: number; h?: number; bad?: number; seed?: number }> = ({ x, y, h = 300, bad = 0, seed = 1 }) => {
  const { t } = useTF();
  const shake = bad * Math.sin(t * 40 + seed * 3) * 5;
  return (
    <div style={{ position: 'absolute', left: x - h * 0.13 + shake, top: y - h, width: h * 0.26, height: h, borderRadius: h * 0.13, background: `linear-gradient(90deg, #6a6a74, ${A.soft} 40%, #8a8a96)`, boxShadow: bad > 0.3 ? `0 0 ${40 * bad}px rgba(255,43,61,.6)` : '0 20px 40px rgba(0,0,0,.5)', border: `3px solid ${bad > 0.3 ? A.red : '#3a3a44'}` }}>
      {[0.2, 0.5, 0.8].map((k) => <div key={k} style={{ position: 'absolute', left: 0, right: 0, top: `${k * 100}%`, height: 6, background: '#3a3a44' }} />)}
    </div>
  );
};
export const House: React.FC<{ x: number; y: number; size?: number; lit?: number }> = ({ x, y, size = 120, lit = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-100%)' }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M10 48 L50 14 L90 48 L90 98 L10 98 Z" fill="#16161c" stroke={A.soft} strokeWidth={4} strokeLinejoin="round" />
      <rect x={24} y={56} width={18} height={18} fill={lit > 0.5 ? A.white : '#0a0a0d'} opacity={0.3 + 0.7 * lit} />
      <rect x={58} y={56} width={18} height={18} fill={lit > 0.5 ? A.white : '#0a0a0d'} opacity={0.3 + 0.7 * lit} />
    </svg>
  </div>
);
export const FishTank: React.FC<{ x: number; y: number; w?: number; signal?: number }> = ({ x, y, w = 520, signal = 0 }) => {
  const { t } = useTF();
  const h = w * 0.6;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 14, border: `5px solid ${A.soft}`, background: 'linear-gradient(180deg, rgba(244,244,246,.04) 12%, rgba(244,244,246,.16) 12%, rgba(244,244,246,.08))', overflow: 'hidden' }}>
        {[0, 1, 2].map((i) => { const fx = ((t * (0.08 + i * 0.03) + i * 0.33) % 1); const dir = Math.floor(t * (0.08 + i * 0.03) + i * 0.33) % 2 ? -1 : 1; return <div key={i} style={{ position: 'absolute', left: `${(dir > 0 ? fx : 1 - fx) * 80 + 5}%`, top: `${35 + i * 18}%`, transform: `scaleX(${dir})` }}><Icon name="ph:fish-simple-fill" size={w * 0.1} color={i === 1 ? A.red : A.white} /></div>; })}
        {[0, 1, 2, 3, 4].map((i) => { const u = (t * 0.4 + i * 0.21) % 1; return <div key={`b${i}`} style={{ position: 'absolute', left: `${12 + i * 3}%`, top: `${92 - u * 78}%`, width: 10, height: 10, borderRadius: '50%', border: `2px solid ${A.soft}`, opacity: 1 - u }} />; })}
      </div>
      <div style={{ position: 'absolute', right: w * 0.08, top: -h * 0.12, width: w * 0.045, height: h * 0.75, borderRadius: w * 0.03, background: A.white, border: '3px solid #111' }}>
        <div style={{ position: 'absolute', left: '25%', right: '25%', bottom: '8%', height: '45%', borderRadius: 6, background: A.red }} />
      </div>
      {signal > 0 && [0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', right: w * 0.1 - 30 - i * 26, top: -h * 0.2 - 30 - i * 26, width: 60 + i * 52, height: 60 + i * 52, borderRadius: '50%', border: `4px solid ${A.red}`, borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: 'rotate(0deg)', opacity: signal * (0.4 + 0.6 * ((Math.sin(t * 5 - i) + 1) / 2)) }} />)}
      <div style={{ position: 'absolute', left: w * 0.1, right: w * 0.1, bottom: -40, height: 40, background: '#1d1d24', borderRadius: '0 0 10px 10px' }} />
    </div>
  );
};

// dashed connection line (draws on from `at`)
export const Wire: React.FC<{ d: string; at: number; dur?: number; red?: boolean; len?: number; width?: number; flow?: boolean }> = ({ d, at, dur = 0.6, red = false, len = 1400, width = 4, flow = true }) => {
  const { t } = useTF();
  const u = ramp(t, at, dur, EASE.inOut);
  if (u <= 0) return null;
  return (
    <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }} width={1920} height={1080}>
      <path d={d} stroke={red ? A.red : A.white} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={`${len}`} strokeDashoffset={len * (1 - u)} opacity={0.85} />
      {flow && u >= 1 && <path d={d} stroke={red ? '#ffb3b9' : A.white} strokeWidth={width + 2} fill="none" strokeLinecap="round" strokeDasharray="6 60" strokeDashoffset={-t * 120} />}
    </svg>
  );
};

// the subscribe button (mid-video ask and the end)
export const Subscribe: React.FC<{ x: number; y: number; at: number; press?: number }> = ({ x, y, at, press }) => {
  const { t, f, fps } = useTF();
  if (t < at - 0.05) return null;
  const s = springAt(f, fps, at, { damping: 12, stiffness: 200 });
  const done = press != null && t > press;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * s) * (press != null && t > press && t < press + 0.12 ? 0.92 : 1)})`, opacity: clamp(s * 1.5), display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ padding: '22px 44px', borderRadius: 16, background: done ? '#2a2a33' : A.red, ...fonts.H, fontWeight: 900, fontSize: 46, color: A.white, letterSpacing: '0.02em', boxShadow: done ? undefined : '0 0 50px rgba(255,43,61,.45)' }}>{done ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
      <div style={{ transform: `rotate(${done ? Math.sin(t * 18) * 14 * Math.max(0, 1 - (t - press!) * 1.5) : 0}deg)` }}><Icon name="ph:bell-ringing-fill" size={72} color={A.white} /></div>
    </div>
  );
};
export { lerp, AbsoluteFill };
