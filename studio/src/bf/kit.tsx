// "Blue Friday" kit: Gus (the security guard who lives in the kernel), monitors, the blue screen, the boot
// spinner, the 20-box form, a dotted world map that turns blue, and small UI cards. Palette: night navy +
// Windows blue, with amber for warnings and red for the one bad thing in each shot.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { fonts } from '../tg/type';
import { useTF } from '../tg/kit';
import { EASE, ramp, springAt, clamp, rng } from '../lib/time';

export const B = { ink: '#050a18', navy: '#0b1630', navy2: '#14244a', blue: '#0a6cd6', blue2: '#3d8ff0', white: '#f2f5f9', dim: '#8b98b4', amber: '#ffb648', red: '#ff3b4e', green: '#3cf0a0', cyan: '#5fd4ff', paper: '#f3eee2', skin: '#f2c9a0', uniform: '#1f3f78' };
const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.37) % 3.4; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

// ---------------------------------------------------------------- Gus
export type GusMood = 'happy' | 'proud' | 'confused' | 'shock' | 'dizzy' | 'sad' | 'neutral' | 'focus';
export type GusArm = 'idle' | 'wave' | 'point' | 'reach' | 'clip' | 'salute' | 'shrug';
export const Gus: React.FC<{ x: number; y: number; size?: number; mood?: GusMood; arm?: GusArm; look?: number; talk?: number; tilt?: number; squash?: number; seed?: number; clipCount?: number }> = ({ x, y, size = 360, mood = 'neutral', arm = 'idle', look = 0, talk = 0, tilt = 0, squash = 0, seed = 1, clipCount }) => {
  const { t } = useTF();
  const breathe = Math.sin(t * 2.2 + seed) * 0.012;
  const bl = mood === 'dizzy' || mood === 'happy' ? 0 : blinkAt(t, seed);
  const lx = look * 7;
  const R = (deg: number) => deg;
  // arm angles (degrees from straight down; positive = towards outside)
  const wav = Math.sin(t * 12) * 18;
  const [la, ra, rl] = arm === 'wave' ? [12, 150 + wav, 1] : arm === 'point' ? [12, 95, 1.1] : arm === 'reach' ? [12, 100, 1.8] : arm === 'clip' ? [-55, 18, 1] : arm === 'salute' ? [12, 160, 0.9] : arm === 'shrug' ? [70, 70, 0.9] : [14, 14, 1];
  const eyeY = 86, mouthOpen = clamp(talk) * 12;
  const shock = mood === 'shock';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size * 0.77, height: size, transform: `translate(-50%,-100%) rotate(${tilt}deg) scale(${1 + squash * 0.6 + breathe}, ${1 - squash + breathe})`, transformOrigin: '50% 100%' }}>
      <svg viewBox="0 0 200 260" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <ellipse cx="100" cy="256" rx="62" ry="7" fill="rgba(0,0,0,.35)" />
        {/* legs */}
        <rect x="72" y="214" width="22" height="34" rx="6" fill="#13274d" /><rect x="106" y="214" width="22" height="34" rx="6" fill="#13274d" />
        <rect x="64" y="242" width="34" height="13" rx="6" fill="#0b0f18" /><rect x="102" y="242" width="34" height="13" rx="6" fill="#0b0f18" />
        {/* arms (behind body) */}
        <g transform={`rotate(${R(la)} 56 140)`}><rect x="44" y="134" width="22" height="64" rx="11" fill={B.uniform} /><circle cx="55" cy="200" r="11" fill={B.skin} /></g>
        <g transform={`rotate(${-R(ra)} 144 140)`}><rect x="134" y="134" width="22" height={64 * rl} rx="11" fill={B.uniform} /><circle cx="145" cy={134 + 64 * rl + 2} r="11" fill={B.skin} /></g>
        {/* body */}
        <rect x="50" y="122" width="100" height="100" rx="34" fill={B.uniform} />
        <rect x="50" y="196" width="100" height="10" fill="#0f2348" />
        <rect x="93" y="195" width="14" height="12" rx="2" fill="#d9b25a" />
        <path d="M100 124 L100 196" stroke="#16305e" strokeWidth="3" />
        <circle cx="100" cy="146" r="3" fill="#d9b25a" /><circle cx="100" cy="170" r="3" fill="#d9b25a" />
        {/* badge */}
        <path d="M124 140 l10 -4 l10 4 v9 c0 7 -5 11 -10 13 c-5 -2 -10 -6 -10 -13 z" fill="#f2c14e" stroke="#b08422" strokeWidth="1.5" />
        {/* clipboard */}
        {arm === 'clip' && <g transform="rotate(-8 92 170)"><rect x="64" y="140" width="56" height="70" rx="5" fill="#c08a4e" /><rect x="69" y="148" width="46" height="58" rx="2" fill={B.paper} /><rect x="82" y="135" width="20" height="10" rx="3" fill="#8a96a8" />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={73 + (i % 4) * 10} y={153 + Math.floor(i / 4) * 16} width="7" height="7" rx="1" fill={clipCount != null && i < clipCount ? B.green : 'none'} stroke="#6b6250" strokeWidth="1.2" />)}</g>}
        {/* head */}
        <circle cx="100" cy="84" r="44" fill={B.skin} />
        <ellipse cx="57" cy="88" rx="7" ry="10" fill="#e8b98c" /><ellipse cx="143" cy="88" rx="7" ry="10" fill="#e8b98c" />
        {/* cap */}
        <path d="M54 66 C56 30 144 30 146 66 Z" fill={B.uniform} />
        <rect x="52" y="60" width="96" height="12" rx="5" fill="#152d5a" />
        <path d="M60 70 Q100 82 150 70 L156 76 Q100 92 56 76 Z" fill="#0b1630" />
        <path d="M92 42 l8 -4 l8 4 v7 c0 5 -4 8 -8 9 c-4 -1 -8 -4 -8 -9 z" fill="#f2c14e" />
        {/* eyes */}
        {mood === 'happy' ? <g stroke="#1a1a22" strokeWidth="4" fill="none" strokeLinecap="round"><path d={`M${78 + lx} ${eyeY + 2} q8 -9 16 0`} /><path d={`M${106 + lx} ${eyeY + 2} q8 -9 16 0`} /></g>
          : mood === 'dizzy' ? <g stroke="#1a1a22" strokeWidth="3.5" fill="none"><path d={`M80 ${eyeY - 6} l12 12 M92 ${eyeY - 6} l-12 12`} /><path d={`M108 ${eyeY - 6} l12 12 M120 ${eyeY - 6} l-12 12`} /></g>
            : <g>
              <ellipse cx="86" cy={eyeY} rx={shock ? 11 : 9} ry={(shock ? 13 : 11) * (1 - bl)} fill="#fff" />
              <ellipse cx="114" cy={eyeY} rx={shock ? 11 : 9} ry={(shock ? 13 : 11) * (1 - bl)} fill="#fff" />
              {bl < 0.6 && <><circle cx={86 + lx} cy={eyeY + 1} r={shock ? 4 : 5} fill="#1a1a22" /><circle cx={114 + lx} cy={eyeY + 1} r={shock ? 4 : 5} fill="#1a1a22" /></>}
            </g>}
        {/* brows */}
        <g stroke="#5a3a22" strokeWidth="4.5" strokeLinecap="round">
          {mood === 'confused' ? <><path d="M76 70 l18 2" /><path d="M106 64 l18 -4" /></>
            : mood === 'sad' ? <><path d="M76 72 l18 -5" /><path d="M106 67 l18 5" /></>
              : mood === 'focus' || mood === 'proud' ? <><path d="M76 70 l18 4" /><path d="M106 74 l18 -4" /></>
                : shock ? <><path d="M76 64 l18 -2" /><path d="M106 62 l18 2" /></> : <><path d="M76 71 l18 -1" /><path d="M106 70 l18 1" /></>}
        </g>
        {/* nose, mustache, mouth */}
        <ellipse cx="100" cy="100" rx="8" ry="6" fill="#e2a87c" />
        {shock || talk > 0.05 ? <ellipse cx="100" cy="116" rx={shock ? 7 : 9} ry={shock ? 9 : 2 + mouthOpen * 0.6} fill="#5a1a1a" /> : mood === 'sad' ? <path d="M90 118 q10 -6 20 0" stroke="#5a1a1a" strokeWidth="3" fill="none" /> : <path d="M88 114 q12 8 24 0" stroke="#5a1a1a" strokeWidth="3" fill="none" />}
        <path d="M78 108 q11 -9 22 -2 q11 -7 22 2 q-6 8 -22 3 q-16 5 -22 -3 z" fill="#6b4226" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- screens
export const BSOD: React.FC<{ pct?: number; scale?: number }> = ({ pct = 0, scale = 1 }) => (
  <AbsoluteFill style={{ background: B.blue, padding: `${12 * scale}% ${10 * scale}%`, color: '#fff', fontFamily: fonts.body, overflow: 'hidden' }}>
    <div style={{ fontSize: `${9 * scale}em`, lineHeight: 1, fontWeight: 300 }}>:(</div>
    <div style={{ marginTop: '0.4em', fontSize: `${1.25 * scale}em`, fontWeight: 400, lineHeight: 1.35, maxWidth: '85%' }}>Your device ran into a problem and needs to restart.</div>
    <div style={{ marginTop: '0.5em', fontSize: `${1.25 * scale}em`, fontWeight: 400 }}>{Math.round(pct)}% complete</div>
  </AbsoluteFill>
);
// a monitor whose screen is either blue (bsod) or whatever children it gets
export const Monitor: React.FC<{ x: number; y: number; w: number; blue?: number; children?: React.ReactNode; stand?: boolean; fs?: number }> = ({ x, y, w, blue = 0, children, stand = true, fs = 10 }) => {
  const h = w * 0.6;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h + (stand ? w * 0.16 : 0) }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: w * 0.025, background: '#10141c', padding: w * 0.022, boxShadow: `0 ${w * 0.05}px ${w * 0.12}px rgba(0,0,0,.5)${blue > 0.5 ? `, 0 0 ${w * 0.25}px rgba(10,108,214,.35)` : ''}` }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: w * 0.01, background: '#0d1424', fontSize: fs }}>
          {children}
          {blue > 0 && <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 ${(1 - clamp(blue)) * 100}% 0)` }}><BSOD /></div>}
        </div>
      </div>
      {stand && <><div style={{ position: 'absolute', left: w * 0.45, top: h, width: w * 0.1, height: w * 0.12, background: '#1c222e' }} /><div style={{ position: 'absolute', left: w * 0.32, top: h + w * 0.12, width: w * 0.36, height: w * 0.035, borderRadius: w * 0.02, background: '#1c222e' }} /></>}
    </div>
  );
};
// windows-style boot: dark screen, spinning dots
export const BootDots: React.FC<{ size?: number }> = ({ size = 60 }) => {
  const { t } = useTF();
  return (
    <AbsoluteFill style={{ background: '#000', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {Array.from({ length: 6 }, (_, i) => { const a = (t * 5 - i * 0.32) % (Math.PI * 2); return <div key={i} style={{ position: 'absolute', left: size / 2 + Math.cos(a) * size * 0.42 - size * 0.05, top: size / 2 + Math.sin(a) * size * 0.42 - size * 0.05, width: size * 0.1, height: size * 0.1, borderRadius: '50%', background: '#fff', opacity: 1 - i * 0.13 }} />; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the form (20 boxes expected)
export const Form: React.FC<{ x: number; y: number; at: number; n: number; hi?: number; bad?: number; w?: number; title?: string; out?: number }> = ({ x, y, at, n, hi = 0, bad = 0, w = 560, title = 'UPDATE · FORM 291', out }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.05 || (out != null && t > out + 0.4)) return null;
  const s = springAt(f, fps, at, { damping: 15, stiffness: 160 });
  const o = out != null ? 1 - ramp(t, out, 0.3, EASE.in) : 1;
  const cell = (w - 80) / 5;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) translateY(${(1 - s) * 60}px) rotate(-1.5deg)`, opacity: clamp(s * 1.5) * o }}>
      <div style={{ position: 'relative', padding: '26px 30px 34px', background: B.paper, borderRadius: 10, boxShadow: '0 30px 70px rgba(0,0,0,.5)' }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 15, letterSpacing: '0.16em', color: '#6b6250' }}>{title}</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(5, ${cell - 10}px)`, gap: 10, marginTop: 16 }}>
          {Array.from({ length: Math.min(n, 20) }, (_, i) => {
            const on = i < hi, p = ramp(t, at + 0.15 + i * 0.03, 0.3, EASE.out);
            return <div key={i} style={{ height: cell * 0.62, borderRadius: 6, border: `3px solid ${on ? B.green : '#9a917c'}`, background: on ? `${B.green}26` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 800, fontSize: cell * 0.26, color: on ? '#14704a' : '#9a917c', transform: `scale(${0.6 + 0.4 * p})`, opacity: p }}>{i + 1}</div>;
          })}
        </div>
        {n > 20 && <div style={{ position: 'absolute', right: -cell * 0.95, bottom: 34, width: cell - 10, height: cell * 0.62, borderRadius: 6, border: `3px solid ${B.red}`, background: `${B.red}${bad > 0 ? '40' : '18'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: cell * 0.28, color: B.red, boxShadow: `0 0 ${20 + bad * 30}px ${B.red}aa`, transform: `rotate(6deg) scale(${springAt(f, fps, at + 0.9, { damping: 9, stiffness: 220 })})` }}>21</div>}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- dotted world map
// rough continents in a 100 × 50 equirectangular grid (x = lon, y = lat), good enough for a stylised dot map
const LAND: [number, number][][] = [
  [[8, 9], [20, 6], [33, 7], [37, 12], [31, 18], [27, 23], [25, 28], [20, 26], [15, 20], [10, 16]], // N America
  [[33, 3], [41, 2], [40, 8], [35, 9]], // Greenland
  [[26, 29], [33, 30], [37, 35], [33, 43], [30, 48], [28, 40], [25, 33]], // S America
  [[46, 9], [56, 7], [58, 13], [53, 17], [47, 16], [45, 13]], // Europe
  [[45, 19], [55, 18], [61, 24], [60, 33], [55, 41], [51, 39], [48, 30], [44, 25]], // Africa
  [[56, 7], [74, 5], [90, 8], [92, 15], [84, 22], [80, 28], [74, 29], [70, 24], [64, 25], [60, 20], [57, 14]], // Asia
  [[79, 28], [85, 29], [83, 33], [79, 31]], // SE Asia islands
  [[80, 35], [90, 34], [92, 41], [86, 44], [80, 41]], // Australia
];
const inside = (px: number, py: number, poly: [number, number][]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c; } return c; };
const DOTS: { x: number; y: number; r: number }[] = (() => { const r = rng(5); const out: { x: number; y: number; r: number }[] = []; for (let y = 1; y < 50; y += 1.25) for (let x = 1; x < 100; x += 1.25) if (LAND.some((p) => inside(x, y, p))) out.push({ x, y, r: r() }); return out; })();
// lit: 0..1 share of dots turned blue; sweep goes west → east with some randomness
export const DotMap: React.FC<{ x: number; y: number; w: number; lit: number; pulse?: boolean }> = ({ x, y, w, lit, pulse = true }) => {
  const { t } = useTF();
  const k = w / 100;
  return (
    <svg style={{ position: 'absolute', left: x - w / 2, top: y - w / 4, overflow: 'visible' }} width={w} height={w / 2}>
      {DOTS.map((d, i) => {
        const on = (d.x / 100) * 0.55 + d.r * 0.45 < lit * 1.02;
        return <circle key={i} cx={d.x * k} cy={d.y * k} r={k * (on ? 0.52 : 0.38)} fill={on ? B.blue2 : 'rgba(140,160,200,.28)'} opacity={on && pulse ? 0.75 + 0.25 * Math.sin(t * 4 + i) : 1} />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- small UI
export const Tag: React.FC<{ children: React.ReactNode; color?: string; size?: number; bg?: string }> = ({ children, color = B.white, size = 30, bg = 'rgba(5,10,24,.82)' }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${size * 0.35}px ${size * 0.7}px`, borderRadius: size * 0.4, background: bg, border: `2px solid ${color}55`, ...fonts.H, fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap' }}>{children}</div>
);
export const Card: React.FC<{ children: React.ReactNode; w?: number; pad?: number; tint?: string }> = ({ children, w, pad = 30, tint = B.navy2 }) => (
  <div style={{ width: w, padding: pad, borderRadius: 22, background: `linear-gradient(160deg, ${tint}, #070c1c)`, border: '2px solid rgba(255,255,255,.1)', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>{children}</div>
);
// a night background with a soft spot of light
export const Night: React.FC<{ glow?: string; x?: number; y?: number }> = ({ glow = 'rgba(61,143,240,.22)', x = 50, y = 40 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, ${glow}, transparent 60%), linear-gradient(180deg, #08112a, ${B.ink})` }} />
);
