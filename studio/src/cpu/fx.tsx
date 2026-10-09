// Comedy toolkit + stages for "The Cursed CPU": stamps, speech bubbles, freeze frames,
// the boot kick, the spotlight stage, Leo's gaming room, the club door and the prison cell.
import React from 'react';
import { AbsoluteFill, Freeze, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, rng } from '../lib/time';
import { Icon } from '../components/Icon';

const useTF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };

// rubber stamp that slams in (scale 3 → 1) with a tiny overshoot wobble
export const Stamp: React.FC<{ x: number; y: number; at: number; out?: number; text: string; color?: string; rot?: number; size?: number }> = ({ x, y, at, out, text, color = C.red, rot = -10, size = 90 }) => {
  const { t } = useTF();
  if (t < at - 0.02 || (out != null && t > out + 0.3)) return null;
  const s = ramp(t, at, 0.16, EASE.in);
  const wob = t > at + 0.16 ? Math.sin((t - at - 0.16) * 30) * Math.max(0, 1 - (t - at - 0.16) * 4) * 3 : 0;
  const o = out != null ? 1 - ramp(t, out, 0.25) : 1;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + wob}deg) scale(${3 - 2 * s})`, opacity: s * o, padding: `${size * 0.08}px ${size * 0.28}px`, border: `${Math.max(5, size * 0.07)}px solid ${color}`, borderRadius: size * 0.14, fontFamily: fonts.head, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: '0.04em', color, whiteSpace: 'nowrap', background: `${color}12`, textShadow: `0 0 30px ${color}66`, maskImage: 'radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.75) 100%)' }}>{text}</div>;
};

// comic speech bubble with a tail; pops in (spring), text types on
export const Bubble: React.FC<{ x: number; y: number; at: number; out?: number; text: string; w?: number; tail?: 'left' | 'right' | 'down'; size?: number; color?: string; ink?: string; think?: boolean }> = ({ x, y, at, out, text, w = 420, tail = 'down', size = 40, color = '#fff', ink = '#151a28', think = false }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.02 || (out != null && t > out + 0.3)) return null;
  const s = springAt(f, fps, at, { damping: 11, stiffness: 220 });
  const o = out != null ? 1 - ramp(t, out, 0.2, EASE.in) : 1;
  const n = Math.floor(clamp((t - at) / Math.max(0.3, text.length * 0.035)) * text.length);
  const tailEl = tail === 'down' ? <div style={{ position: 'absolute', left: '42%', bottom: -26, width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: `30px solid ${color}` }} />
    : tail === 'left' ? <div style={{ position: 'absolute', left: -26, top: '40%', width: 0, height: 0, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderRight: `30px solid ${color}` }} />
      : <div style={{ position: 'absolute', right: -26, top: '40%', width: 0, height: 0, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderLeft: `30px solid ${color}` }} />;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: '50% 100%', opacity: clamp(s * 1.5) * o }}>
      <div style={{ position: 'relative', padding: '20px 28px', borderRadius: think ? 60 : 30, background: color, boxShadow: '0 16px 40px rgba(0,0,0,.45)', fontFamily: fonts.head, fontWeight: 800, fontSize: size, lineHeight: 1.15, color: ink, textAlign: 'center' }}>
        <span>{text.slice(0, n)}</span><span style={{ opacity: 0 }}>{text.slice(n)}</span>
        {!think && tailEl}
      </div>
    </div>
  );
};

// freeze frame: children stop on `at`, desaturate, record-scratch caption slides in
export const FreezeFrame: React.FC<{ at: number; out: number; label: string; children: React.ReactNode }> = ({ at, out, label, children }) => {
  const { fps, t } = useTF();
  const on = t >= at && t < out;
  const u = ramp(t, at, 0.12), x = ramp(t, at + 0.05, 0.3, EASE.back);
  if (!on) return <>{children}</>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `grayscale(${u}) contrast(1.1) brightness(${1 - 0.15 * u})` }}><Freeze frame={Math.round(at * fps)}>{children}</Freeze></AbsoluteFill>
      <div style={{ position: 'absolute', left: 120, bottom: 230, transform: `translateX(${(1 - x) * -900}px) rotate(-3deg)`, padding: '14px 34px', background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: '0.02em', boxShadow: '0 20px 50px rgba(0,0,0,.5)' }}>{label}</div>
    </AbsoluteFill>
  );
};

// a giant cartoon boot swinging in from the left to kick something at (x, y)
export const Boot: React.FC<{ x: number; y: number; at: number; size?: number }> = ({ x, y, at, size = 340 }) => {
  const { t } = useTF();
  const d = t - at;
  if (d < -0.25 || d > 0.7) return null;
  const swing = d < 0 ? ramp(t, at - 0.25, 0.2, EASE.out) * -0.25 : Math.min(1, d / 0.08); // wind-up, then strike
  const back = ramp(t, at + 0.2, 0.4, EASE.in);
  const ang = -35 + swing * 70 - back * 40;
  return (
    <div style={{ position: 'absolute', left: x - size * 0.95, top: y - size * 1.2, width: size, height: size * 1.4, transformOrigin: '30% 0%', transform: `rotate(${ang}deg) translateX(${-back * 300}px)`, opacity: 1 - back }}>
      <div style={{ position: 'absolute', left: size * 0.18, top: 0, width: size * 0.32, height: size * 0.85, background: 'linear-gradient(90deg,#3b2a1e,#5a4030)', borderRadius: 10 }} />
      <div style={{ position: 'absolute', left: size * 0.12, top: size * 0.78, width: size * 0.9, height: size * 0.36, background: 'linear-gradient(180deg,#6b4a34,#3b2a1e)', borderRadius: `${size * 0.06}px ${size * 0.25}px ${size * 0.12}px ${size * 0.08}px` }} />
      <div style={{ position: 'absolute', left: size * 0.1, top: size * 1.08, width: size * 0.95, height: size * 0.08, background: '#1a120c', borderRadius: 8 }} />
    </div>
  );
};

// impact burst lines (comic "POW")
export const Burst: React.FC<{ x: number; y: number; at: number; color?: string; size?: number; n?: number }> = ({ x, y, at, color = '#fff', size = 220, n = 12 }) => {
  const { t } = useTF();
  const u = ramp(t, at, 0.3, EASE.out);
  if (t < at || u >= 1) return null;
  return <svg style={{ position: 'absolute', left: x - size, top: y - size, overflow: 'visible' }} width={size * 2} height={size * 2}>{Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; const r0 = size * (0.3 + 0.5 * u), r1 = size * (0.45 + 0.55 * u); return <line key={i} x1={size + Math.cos(a) * r0} y1={size + Math.sin(a) * r0} x2={size + Math.cos(a) * r1} y2={size + Math.sin(a) * r1} stroke={color} strokeWidth={8 * (1 - u)} strokeLinecap="round" />; })}</svg>;
};

// ---------------------------------------------------------------- stages
// dark stage with a spotlight cone that snaps on at `on`
export const Spotlight: React.FC<{ on?: number; x?: number; color?: string; floor?: number }> = ({ on = 0, x = 960, color = '255,240,200', floor = 860 }) => {
  const { t } = useTF();
  const u = t >= on ? 1 : 0;
  const flick = t > on && t < on + 0.25 ? (Math.floor((t - on) * 40) % 2 ? 0.4 : 1) : 1;
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1328, #04060c 70%)' }}>
      <div style={{ position: 'absolute', left: x - 520, top: -40, width: 1040, height: floor + 120, background: `linear-gradient(180deg, rgba(${color},${0.22 * u * flick}), rgba(${color},${0.05 * u * flick}))`, clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)' }} />
      <div style={{ position: 'absolute', left: x - 380, top: floor - 50, width: 760, height: 110, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${color},${0.35 * u * flick}), transparent 70%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: floor + 20, bottom: 0, background: 'linear-gradient(180deg, rgba(10,14,28,.0), rgba(4,6,12,.9))' }} />
    </AbsoluteFill>
  );
};

// Leo's gaming room: wall, posters, desk, monitor (screen slot), RGB strip, window
export const GamerRoom: React.FC<{ screen?: React.ReactNode; rgb?: number; rain?: number; night?: boolean }> = ({ screen, rgb = 1, rain = 0, night = true }) => {
  const { t } = useTF();
  const hue = (t * 40) % 360;
  const r = rng(4);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: night ? 'linear-gradient(180deg,#0f1630,#0b1024 60%,#070a16)' : 'linear-gradient(180deg,#1b2850,#121b38)' }} />
      {/* window with optional rain */}
      <div style={{ position: 'absolute', left: 1420, top: 120, width: 360, height: 300, borderRadius: 8, background: 'linear-gradient(180deg,#0e2250,#091634)', boxShadow: 'inset 0 0 0 10px #070b18', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 175, top: 0, width: 10, height: '100%', background: '#070b18' }} />
        <div style={{ position: 'absolute', left: 0, top: 145, width: '100%', height: 10, background: '#070b18' }} />
        {rain > 0 && Array.from({ length: 40 }, (_, i) => { const x = r() * 360, sp = 500 + r() * 400, y = ((t * sp + r() * 300) % 360) - 30; return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 2, height: 22, background: 'rgba(170,200,255,.5)', opacity: rain, transform: 'rotate(12deg)' }} />; })}
      </div>
      {/* posters */}
      <div style={{ position: 'absolute', left: 140, top: 150, width: 210, height: 290, borderRadius: 8, background: 'linear-gradient(160deg,#ff2e4d,#6b1530)', boxShadow: '0 12px 30px rgba(0,0,0,.5)', transform: 'rotate(-3deg)' }}><div style={{ position: 'absolute', inset: 18, border: '3px solid rgba(255,255,255,.4)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:crosshair-bold" size={110} color="rgba(255,255,255,.75)" /></div></div>
      <div style={{ position: 'absolute', left: 390, top: 200, width: 180, height: 240, borderRadius: 8, background: 'linear-gradient(160deg,#33e1ff,#1a3c8f)', boxShadow: '0 12px 30px rgba(0,0,0,.5)', transform: 'rotate(2deg)' }}><div style={{ position: 'absolute', inset: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:game-controller-bold" size={100} color="rgba(255,255,255,.8)" /></div></div>
      {/* desk */}
      <div style={{ position: 'absolute', left: 260, top: 820, width: 1400, height: 40, borderRadius: 10, background: 'linear-gradient(180deg,#2a2f3d,#151924)' }} />
      <div style={{ position: 'absolute', left: 260, top: 856, width: 1400, height: 8, background: `hsl(${hue},90%,60%)`, boxShadow: `0 0 30px hsl(${hue},90%,60%)`, opacity: 0.7 * rgb }} />
      <div style={{ position: 'absolute', left: 320, top: 860, width: 40, height: 220, background: '#11141c' }} /><div style={{ position: 'absolute', left: 1560, top: 860, width: 40, height: 220, background: '#11141c' }} />
      {/* monitor */}
      <div style={{ position: 'absolute', left: 620, top: 300, width: 680, height: 400, borderRadius: 14, background: '#0a0c12', boxShadow: `0 0 0 6px #1b1f2b, 0 30px 80px rgba(0,0,0,.6), 0 0 120px hsla(${hue},90%,60%,${0.18 * rgb})`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 14, borderRadius: 6, overflow: 'hidden', background: '#05070c' }}>{screen}</div>
      </div>
      <div style={{ position: 'absolute', left: 930, top: 700, width: 60, height: 110, background: 'linear-gradient(90deg,#141824,#262b38,#141824)' }} />
      <div style={{ position: 'absolute', left: 840, top: 800, width: 240, height: 22, borderRadius: 10, background: '#1b1f2b' }} />
      {/* PC tower with RGB fans */}
      <div style={{ position: 'absolute', left: 1360, top: 560, width: 200, height: 260, borderRadius: 12, background: 'linear-gradient(160deg,#1a1f2c,#0c0f17)', boxShadow: 'inset 0 0 0 3px #2a3042' }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 60, top: 20 + i * 78, width: 70, height: 70, borderRadius: '50%', border: `5px solid hsl(${(hue + i * 60) % 360},90%,60%)`, boxShadow: `0 0 20px hsla(${(hue + i * 60) % 360},90%,60%,${0.6 * rgb})`, opacity: rgb }} />)}
      </div>
      {/* keyboard */}
      <div style={{ position: 'absolute', left: 760, top: 780, width: 400, height: 34, borderRadius: 8, background: '#161a26', boxShadow: `0 0 18px hsla(${hue},90%,60%,${0.35 * rgb})` }} />
    </AbsoluteFill>
  );
};

// the club exterior: brick wall, neon "VALORANT CLUB" sign, door and velvet rope
export const Club: React.FC<{ door?: number }> = ({ door = 0 }) => {
  const { t } = useTF();
  const flick = Math.sin(t * 23) > 0.92 ? 0.55 : 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg,#140b1e,#0b0712 70%,#06040a)' }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.035) 2px, transparent 2px)', backgroundSize: '120px 56px', opacity: 0.8 }} />
      <div style={{ position: 'absolute', left: 960, top: 70, transform: 'translateX(-50%)', whiteSpace: 'nowrap', textAlign: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 88, color: '#ff4d6d', letterSpacing: '0.06em', textShadow: `0 0 20px #ff2e4d, 0 0 60px #ff2e4d, 0 0 120px #ff2e4d`, opacity: flick }}>VALORANT CLUB</div>
      {/* door */}
      <div style={{ position: 'absolute', left: 820, top: 300, width: 280, height: 560, borderRadius: '140px 140px 0 0', background: '#05040a', boxShadow: 'inset 0 0 0 10px #2a1430, 0 0 60px rgba(255,46,77,.25)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg,#3a1c3f,#1b0d22)', transformOrigin: '0 50%', transform: `perspective(800px) rotateY(${-door * 70}deg)` }} />
      </div>
      {/* velvet rope */}
      {[640, 1280].map((px) => <div key={px} style={{ position: 'absolute', left: px, top: 690, width: 26, height: 180, borderRadius: 8, background: 'linear-gradient(90deg,#b8902d,#ffd36b,#b8902d)' }}><div style={{ position: 'absolute', left: -6, top: -18, width: 38, height: 38, borderRadius: '50%', background: '#ffd36b' }} /></div>)}
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width="1920" height="1080"><path d={`M666 720 Q960 ${800 + Math.sin(t * 2) * 6} 1293 720`} stroke="#b0123a" strokeWidth="18" fill="none" strokeLinecap="round" /></svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 870, bottom: 0, background: 'linear-gradient(180deg,#1a1020,#09060d)' }} />
    </AbsoluteFill>
  );
};

// prison cell: back wall with tally marks, bars in front (render children between)
export const Cell: React.FC<{ tally?: number; children?: React.ReactNode; bars?: number }> = ({ tally = 0, children, bars = 1 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#2a2f3a,#1a1d25)' }} />
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,.18) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.18) 2px, transparent 2px)', backgroundSize: '160px 80px' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 860, bottom: 0, background: '#14161c' }} />
    {/* tally marks */}
    <svg style={{ position: 'absolute', left: 1180, top: 220 }} width="520" height="300">
      {Array.from({ length: Math.floor(tally) }, (_, i) => { const g = Math.floor(i / 5), k = i % 5; const gx = (g % 5) * 100, gy = Math.floor(g / 5) * 90; return k < 4 ? <line key={i} x1={gx + k * 16} y1={gy} x2={gx + k * 16} y2={gy + 60} stroke="#d8dce6" strokeWidth="5" strokeLinecap="round" /> : <line key={i} x1={gx - 8} y1={gy + 48} x2={gx + 62} y2={gy + 10} stroke="#d8dce6" strokeWidth="5" strokeLinecap="round" />; })}
    </svg>
    {children}
    <AbsoluteFill style={{ opacity: bars }}>{Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 60 + i * 180, top: 0, width: 26, height: 1080, background: 'linear-gradient(90deg,#3a3f4c,#8a90a0,#3a3f4c)', boxShadow: '8px 0 20px rgba(0,0,0,.4)' }} />)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 26, background: 'linear-gradient(180deg,#3a3f4c,#8a90a0,#3a3f4c)' }} />
    </AbsoluteFill>
  </AbsoluteFill>
);
