// "One Button" kit: the black-grid stage and white/red language (re-exported from ../ai/kit), Vio as host on
// the left, plus this story's pieces: the iOS tracking pop-up and a tapping finger, the Spy (the ad tracker:
// trench coat, hat, binoculars), Mark (a generic cartoon CEO in a grey tee; not a likeness), the landlord's
// building, a newspaper page, the stock-crash chart, coins and smart glasses with a HUD.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { fonts } from '../tg/type';
import { useTF } from '../tg/kit';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import { Icon } from '../components/Icon';
import { A } from '../ai/kit';
import { Vio, talkFrom, type VioPose } from '../vio/Vio';
import { TTL } from './ttime';
export { A, GridBg, Phone, TypeOn, Label, Panel, BigNum, Helper } from '../ai/kit';

// ---------------------------------------------------------------- Vio, the host (left third, owner's rule)
export const Host: React.FC<{ pose?: VioPose; at?: number; decode?: number; x?: number; size?: number }> = ({ pose = 'idle', at, decode = 0, x = 360, size = 960 }) => {
  const { t } = useTF();
  return <Vio x={x} y={1080 + 0.15 * size} size={size} pose={pose} at={at} decode={decode} talk={pose === 'idle' ? talkFrom(TTL.words, t) : 0} seed={5} />;
};

// ---------------------------------------------------------------- the iOS tracking prompt (generic restyle)
export const AttPopup: React.FC<{ x: number; y: number; w?: number; app?: string; pick?: 'none' | 'deny' | 'allow'; at?: number }> = ({ x, y, w = 560, app = 'Shopping', pick = 'none', at = 0 }) => {
  const { f, fps } = useTF();
  const s = springAt(f, fps, at, { damping: 15, stiffness: 190 });
  const btn = (label: string, on: boolean, strong: boolean) => (
    <div style={{ padding: `${w * 0.03}px 0`, borderTop: '1.5px solid #3a3a44', textAlign: 'center', fontFamily: fonts.body, fontSize: w * 0.05, fontWeight: strong ? 700 : 500, color: on ? '#111' : '#7fb2ff', background: on ? A.white : 'transparent' }}>{label}</div>
  );
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, opacity: clamp(s * 1.5), borderRadius: w * 0.05, background: 'rgba(38,38,44,.97)', overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.6)' }}>
      <div style={{ padding: `${w * 0.06}px ${w * 0.07}px ${w * 0.05}px`, textAlign: 'center', color: A.white }}>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: w * 0.048, lineHeight: 1.25 }}>Allow “{app}” to track your activity across other companies’ apps and websites?</div>
        <div style={{ marginTop: w * 0.025, fontFamily: fonts.body, fontSize: w * 0.036, color: '#b8b8c2', lineHeight: 1.3 }}>Your data will be used to deliver personalised ads to you.</div>
      </div>
      {btn('Ask App Not to Track', pick === 'deny', true)}
      {btn('Allow', pick === 'allow', false)}
    </div>
  );
};
export const Tap: React.FC<{ x: number; y: number; at: number; size?: number }> = ({ x, y, at, size = 90 }) => {
  const { t } = useTF();
  if (t < at - 0.5 || t > at + 0.8) return null;
  const come = ramp(t, at - 0.5, 0.45, EASE.out), ring = ramp(t, at, 0.5, EASE.out);
  return (
    <>
      {t > at && <div style={{ position: 'absolute', left: x, top: y, width: size * (1 + ring), height: size * (1 + ring), borderRadius: '50%', border: `4px solid ${A.white}`, opacity: 1 - ring, transform: 'translate(-50%,-50%)' }} />}
      <div style={{ position: 'absolute', left: x + 40 * (1 - come), top: y + 120 * (1 - come), transform: `translate(-20%,-10%) scale(${t > at && t < at + 0.15 ? 0.9 : 1})`, opacity: come * (1 - ramp(t, at + 0.5, 0.3)) }}><Icon name="ph:hand-pointing-fill" size={size * 1.3} color="#f1c7a0" /></div>
    </>
  );
};

// ---------------------------------------------------------------- the Spy (ad tracker)
export const Spy: React.FC<{ x: number; y: number; size?: number; mood?: 'sneak' | 'locked' | 'sad'; flip?: boolean; seed?: number }> = ({ x, y, size = 300, mood = 'sneak', flip = false, seed = 1 }) => {
  const { t } = useTF();
  const tip = mood === 'sneak' ? Math.sin(t * 5 + seed) * 4 : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size * 0.8, height: size, transform: `translate(-50%,-100%) scaleX(${flip ? -1 : 1}) translateY(${-Math.abs(tip)}px)` }}>
      <svg viewBox="0 0 160 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <ellipse cx="80" cy="198" rx="50" ry="5" fill="rgba(0,0,0,.5)" />
        <path d="M30 198 L40 100 Q80 86 120 100 L130 198 Z" fill="#8a7458" /><path d="M80 100 L80 198" stroke="#6b5940" strokeWidth="4" /><rect x="36" y="140" width="88" height="10" fill="#5a4a34" />
        <path d="M64 100 L80 128 L96 100 Z" fill="#e9e9ee" />
        <ellipse cx="80" cy="70" rx="30" ry="32" fill="#e7b896" />
        <path d="M38 52 Q80 34 122 52 L112 56 Q80 46 48 56 Z" fill="#222" /><path d="M54 52 Q56 16 80 16 Q104 16 106 52 Z" fill="#2b2b2b" /><rect x="54" y="42" width="52" height="8" fill={A.red} />
        {mood === 'sad' ? <><path d="M66 74 q6 -5 12 0 M84 74 q6 -5 12 0" stroke="#222" strokeWidth="4" fill="none" /><path d="M70 92 q10 -6 20 0" stroke="#5a1a1a" strokeWidth="4" fill="none" /></>
          : <><g transform={`rotate(${mood === 'locked' ? 0 : -6} 80 72)`}><rect x="56" y="62" width="22" height="18" rx="6" fill="#1a1a1f" /><rect x="82" y="62" width="22" height="18" rx="6" fill="#1a1a1f" /><circle cx="67" cy="71" r="6" fill="#4b6a8a" /><circle cx="93" cy="71" r="6" fill="#4b6a8a" /><rect x="76" y="66" width="8" height="6" fill="#1a1a1f" /></g><path d="M70 92 q10 5 20 0" stroke="#5a1a1a" strokeWidth="4" fill="none" /></>}
        {mood === 'locked' && <text x="120" y="40" fontFamily="Inter Tight, sans-serif" fontWeight={900} fontSize="34" fill={A.red}>!</text>}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- Mark (generic cartoon CEO)
export type MarkMood = 'calm' | 'happy' | 'shock' | 'sad' | 'focus';
export const Mark: React.FC<{ x: number; y: number; size?: number; mood?: MarkMood; seed?: number; flip?: boolean }> = ({ x, y, size = 420, mood = 'calm', seed = 1, flip = false }) => {
  const { t } = useTF();
  const p = (t + seed * 1.37) % 3.4, bl = mood === 'happy' ? 0 : p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0;
  const br = Math.sin(t * 2 + seed) * 0.008;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size * 0.85, height: size, transform: `translate(-50%,-100%) scale(${(flip ? -1 : 1) * (1 + br)}, ${1 - br})`, transformOrigin: '50% 100%' }}>
      <svg viewBox="0 0 200 240" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <ellipse cx="100" cy="238" rx="64" ry="6" fill="rgba(0,0,0,.5)" />
        <path d="M26 240 Q28 152 100 144 Q172 152 174 240 Z" fill="#8d9099" /><path d="M78 146 Q100 162 122 146" stroke="#777a83" strokeWidth="5" fill="none" />
        <rect x="88" y="124" width="24" height="26" fill="#f0c9a6" />
        <ellipse cx="100" cy="88" rx="40" ry="46" fill="#f3cfad" />
        {[[66, 56], [78, 46], [92, 42], [106, 42], [120, 46], [132, 56], [72, 50], [126, 50]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="11" fill="#5b4532" />)}
        {mood === 'shock' ? <><circle cx="84" cy="92" r="8" fill="#fff" /><circle cx="116" cy="92" r="8" fill="#fff" /><circle cx="84" cy="93" r="3.5" fill="#111" /><circle cx="116" cy="93" r="3.5" fill="#111" /></>
          : mood === 'happy' ? <g stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M77 94 q7 -7 14 0" /><path d="M109 94 q7 -7 14 0" /></g>
            : <><ellipse cx="84" cy="92" rx="4.5" ry={5.5 * (1 - bl)} fill="#111" /><ellipse cx="116" cy="92" rx="4.5" ry={5.5 * (1 - bl)} fill="#111" /></>}
        <g stroke="#4a3626" strokeWidth="4" strokeLinecap="round">{mood === 'sad' ? <><path d="M75 80 l16 -4" /><path d="M125 80 l-16 -4" /></> : mood === 'focus' ? <><path d="M75 78 l16 4" /><path d="M125 78 l-16 4" /></> : <><path d="M75 79 l16 -2" /><path d="M125 79 l-16 -2" /></>}</g>
        {mood === 'shock' ? <ellipse cx="100" cy="116" rx="8" ry="10" fill="#5a1a1a" /> : mood === 'sad' ? <path d="M88 120 q12 -8 24 0" stroke="#5a1a1a" strokeWidth="4" fill="none" /> : <path d="M88 114 q12 9 24 0" stroke="#5a1a1a" strokeWidth="4" fill="none" />}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- the landlord's building
export const Building: React.FC<{ x: number; y: number; w: number; h: number; label: string; lit?: number; children?: React.ReactNode }> = ({ x, y, w, h, label, lit = 1, children }) => (
  <div style={{ position: 'absolute', left: x, top: y - h, width: w, height: h, background: '#121217', border: `3px solid ${A.line}`, borderRadius: '10px 10px 0 0' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', ...fonts.H, fontWeight: 900, fontSize: w * 0.12, color: A.white, letterSpacing: '0.04em' }}>{label}</div>
    <div style={{ position: 'absolute', left: w * 0.1, right: w * 0.1, top: w * 0.26, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: w * 0.04 }}>
      {Array.from({ length: Math.max(0, Math.floor((h - w * 0.6) / (w * 0.18)) * 4) }, (_, i) => <div key={i} style={{ height: w * 0.12, borderRadius: 3, background: ((i * 7919) % 13) / 13 < lit * 0.6 ? 'rgba(244,244,246,.35)' : '#1d1d24' }} />)}
    </div>
    {children}
  </div>
);

// ---------------------------------------------------------------- newspaper page
export const Paper: React.FC<{ x: number; y: number; at: number; rot: number; kicker: string; head: string; w?: number; name?: string }> = ({ x, y, at, rot, kicker, head, w = 620, name = 'The Daily Byte' }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.05) return null;
  const s = springAt(f, fps, at, { damping: 14, stiffness: 160 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) rotate(${rot * s + (1 - s) * 30}deg) scale(${0.4 + 0.6 * s})`, opacity: clamp(s * 2), background: '#ecebe6', padding: '22px 30px', boxShadow: '0 30px 80px rgba(0,0,0,.7)' }}>
      <div style={{ fontFamily: fonts.serif, fontSize: 40, color: '#111', borderBottom: '3px solid #111', paddingBottom: 6, textAlign: 'center' }}>{name}</div>
      <div style={{ marginTop: 8, fontFamily: fonts.mono, fontSize: 15, fontWeight: 700, color: A.red, letterSpacing: '0.12em' }}>{kicker}</div>
      <div style={{ ...fonts.H, fontWeight: 900, fontSize: 48, lineHeight: 1.02, color: '#111', marginTop: 6 }}>{head}</div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ height: 8, background: '#bdbcb6', width: i % 2 ? '70%' : '100%' }} />)}</div>
    </div>
  );
};

// ---------------------------------------------------------------- stock chart that crashes at `crashAt`
export const StockChart: React.FC<{ x: number; y: number; w: number; h: number; at: number; crashAt: number }> = ({ x, y, w, h, at, crashAt }) => {
  const { t } = useTF();
  const N = 60, drawn = ramp(t, at, 1.6, EASE.inOut), crash = ramp(t, crashAt, 0.5, EASE.in);
  const pts = Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1);
    let v = 0.55 + u * 0.25 + Math.sin(i * 1.7) * 0.03 + Math.sin(i * 0.6) * 0.04;
    if (u > 0.82) v -= (u - 0.82) / 0.18 * 0.62 * crash;
    return [x + u * w, y + h - v * h];
  });
  const k = Math.max(2, Math.floor(drawn * N * (t > crashAt ? 1 : 0.84)));
  const shown = pts.slice(0, t > crashAt ? N : Math.min(k, Math.floor(N * 0.83)));
  const last = shown[shown.length - 1];
  const red = t > crashAt;
  return (
    <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width={1920} height={1080}>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={x} x2={x + w} y1={y + h * g} y2={y + h * g} stroke={A.line} strokeWidth={2} strokeDasharray="6 8" />)}
      <polyline points={shown.map((p) => p.join(',')).join(' ')} stroke={red ? A.red : A.white} strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {last && <circle cx={last[0]} cy={last[1]} r={11} fill={red ? A.red : A.white} />}
    </svg>
  );
};

// ---------------------------------------------------------------- coin, glasses
export const Coin: React.FC<{ x: number; y: number; at: number; label: string; size?: number }> = ({ x, y, at, label, size = 190 }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.05) return null;
  const s = springAt(f, fps, at, { damping: 9, stiffness: 200 });
  return (
    <div style={{ position: 'absolute', left: x, top: y - (1 - s) * 120, width: size, height: size, transform: `translate(-50%,-50%) scale(${s}) rotateY(${(1 - s) * 180}deg)`, borderRadius: '50%', background: A.white, border: `${size * 0.06}px solid #c9c9d1`, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'pre-line', boxShadow: '0 20px 50px rgba(0,0,0,.5)' }}>
      <div style={{ ...fonts.H, fontWeight: 900, fontSize: size * 0.22, color: '#111', textAlign: 'center', lineHeight: 1 }}>{label}</div>
    </div>
  );
};
export const Glasses: React.FC<{ x: number; y: number; w: number; children?: React.ReactNode }> = ({ x, y, w, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: w * 0.36, transform: 'translate(-50%,-50%)' }}>
    <svg viewBox="0 0 500 180" width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <path d="M20 40 Q20 20 40 20 L215 20 Q235 20 232 45 L222 130 Q218 160 190 160 L70 160 Q35 160 28 125 Z" fill="rgba(20,20,26,.55)" stroke="#111" strokeWidth="14" />
      <path d="M480 40 Q480 20 460 20 L285 20 Q265 20 268 45 L278 130 Q282 160 310 160 L430 160 Q465 160 472 125 Z" fill="rgba(20,20,26,.55)" stroke="#111" strokeWidth="14" />
      <path d="M232 52 Q250 40 268 52" stroke="#111" strokeWidth="14" fill="none" />
    </svg>
    <div style={{ position: 'absolute', left: w * 0.56, top: w * 0.06, width: w * 0.37, height: w * 0.25, overflow: 'hidden', borderRadius: w * 0.03 }}>{children}</div>
  </div>
);
export { lerp };
