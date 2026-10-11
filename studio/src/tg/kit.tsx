// "Two Guesses Left" kit: Ike (the steel IronKey with an LED eye and a counter screen), the vault stage,
// the GUESSES LEFT HUD, quote/case cards, gold coins, the 2D cast (Stefan, Joe, Dan, a brute-force robot)
// and a parallax camera for 2.5D depth.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng, track } from '../lib/time';

export const useTF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.37) % 3.6; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

// palette (one meaning per color)
export const P = { ink: '#070b16', ink2: '#0f1830', steel: '#8c97a8', steel2: '#c9d1dc', red: '#ff2e4d', gold: '#f7b23b', cyan: '#33e1ff', amber: '#ffb648', green: '#3cf0a0' };

// ---------------------------------------------------------------- camera: depth layers move by depth
export type Cam = { x: number; y: number; z: number };
export const camAt = (t: number, keys: [number, number, number, number][], e = EASE.inOut): Cam => ({
  x: track(t, keys.map((k) => [k[0], k[1]] as [number, number]), e), y: track(t, keys.map((k) => [k[0], k[2]] as [number, number]), e), z: track(t, keys.map((k) => [k[0], k[3]] as [number, number]), e),
});
export const Layer: React.FC<{ cam: Cam; d: number; children: React.ReactNode; blur?: number }> = ({ cam, d, children, blur = 0 }) => (
  <AbsoluteFill style={{ transform: `translate(${-cam.x * d}px, ${-cam.y * d}px) scale(${1 + (cam.z - 1) * (0.35 + 0.65 * d)})`, transformOrigin: '50% 50%', filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined }}>{children}</AbsoluteFill>
);

// ---------------------------------------------------------------- Ike
export type IkeEye = 'open' | 'narrow' | 'wide' | 'smug' | 'closed';
export const Ike: React.FC<{
  x: number; y: number; size?: number; count?: number; eye?: IkeEye; glow?: number; tilt?: number; squash?: number;
  xray?: number; talk?: number; wipe?: number; unlocked?: boolean; seed?: number; flat?: boolean; dust?: number; screenText?: string;
}> = ({ x, y, size = 420, count = 8, eye = 'open', glow = 1, tilt = 0, squash = 0, xray = 0, talk = 0, wipe = 0, unlocked = false, seed = 1, flat = false, dust = 0, screenText }) => {
  const { t } = useTF();
  const id = `ike${seed}`;
  const breathe = Math.sin(t * 1.6 + seed) * 0.008;
  const led = clamp(glow * (0.85 + 0.15 * Math.sin(t * 2.2 + seed)) + talk * 0.6, 0, 1.6);
  const lid = { open: [0, 0], narrow: [0.42, 0.3], wide: [-0.2, -0.2], smug: [0.5, 0.05], closed: [1, 1] }[eye];
  const er = eye === 'wide' ? 24 : 20;
  const k = size / 300;
  const used = Math.max(0, Math.min(10, count));
  const red = unlocked ? P.green : P.red;
  return (
    <svg style={{ position: 'absolute', left: x - (size * 200) / 300 / 2, top: y - size, overflow: 'visible', transform: `rotate(${tilt}deg) scale(${1 + squash * 0.12 - breathe}, ${1 - squash * 0.16 + breathe})`, transformOrigin: '50% 100%' }} width={(size * 200) / 300} height={size} viewBox="0 0 200 300">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0.25"><stop offset="0" stopColor={flat ? '#c9d1dc' : '#eef2f7'} /><stop offset="0.35" stopColor="#aab4c3" /><stop offset="0.7" stopColor="#7c8798" /><stop offset="1" stopColor="#b9c2cf" /></linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9aa4b2" /><stop offset="0.5" stopColor="#f2f5f9" /><stop offset="1" stopColor="#8a94a3" /></linearGradient>
        <radialGradient id={`${id}l`}><stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor={unlocked ? '#9dffd6' : '#ff8a9a'} /><stop offset="1" stopColor={red} /></radialGradient>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor={red} stopOpacity={0.55 * led} /><stop offset="1" stopColor={red} stopOpacity="0" /></radialGradient>
        <pattern id={`${id}p`} width="200" height="3" patternUnits="userSpaceOnUse"><rect width="200" height="1" y="1" fill="#fff" opacity="0.07" /></pattern>
        <clipPath id={`${id}k`}><rect x="30" y="62" width="140" height="222" rx="28" /></clipPath>
        <clipPath id={`${id}e`}><circle cx="100" cy="118" r={er + 5} /></clipPath>
      </defs>
      {/* contact shadow */}
      <ellipse cx="100" cy="298" rx="78" ry="7" fill="#000" opacity="0.45" />
      {/* keyring */}
      <circle cx="100" cy="288" r="15" fill="none" stroke="#7c8798" strokeWidth="6" opacity={0.9} />
      {/* USB plug */}
      <rect x="64" y="12" width="72" height="58" rx="6" fill={`url(#${id}c)`} stroke="#3a4152" strokeWidth="3" />
      <rect x="80" y="26" width="14" height="10" fill="#3a4152" /><rect x="106" y="26" width="14" height="10" fill="#3a4152" />
      {/* body */}
      <g opacity={1 - xray * 0.55}>
        <rect x="30" y="62" width="140" height="222" rx="28" fill={`url(#${id}b)`} stroke="#2a3040" strokeWidth="4" />
        <rect x="30" y="62" width="140" height="222" rx="28" fill={`url(#${id}p)`} />
        <path d="M44 84 Q44 72 58 70 L80 70" stroke="#fff" strokeWidth="5" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M40 110 L40 240" stroke="#fff" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
        <text x="100" y="268" textAnchor="middle" fontFamily={fonts.head} fontWeight={900} fontSize="15" fill="#5a6476" opacity="0.75" letterSpacing="3">IK</text>
        {dust > 0 && <rect x="30" y="62" width="140" height="222" rx="28" fill="#b8a888" opacity={dust * 0.45} />}
      </g>
      {/* x-ray internals */}
      {xray > 0 && <g clipPath={`url(#${id}k)`} opacity={xray}>
        <rect x="46" y="150" width="108" height="100" rx="10" fill="#ffb648" opacity="0.28" stroke="#ffb648" strokeDasharray="6 5" strokeWidth="2" />
        <rect x="70" y="172" width="60" height="56" rx="6" fill="#1f7a4c" stroke="#3cf0a0" strokeWidth="2" />
        <rect x="84" y="186" width="32" height="28" rx="3" fill="#0b1a12" />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={74 + i * 9} y="166" width="4" height="7" fill="#d9b44a" />)}
        <path d="M94 200 a6 6 0 1 1 6 6 L110 206 L110 210 M106 206 L106 210" stroke="#f7b23b" strokeWidth="3" fill="none" />
      </g>}
      {/* LED eye */}
      <circle cx="100" cy="118" r={er + 26} fill={`url(#${id}g)`} />
      <circle cx="100" cy="118" r={er + 5} fill="#1a1f2b" />
      <circle cx="100" cy="118" r={er} fill={`url(#${id}l)`} opacity={0.35 + 0.65 * clamp(led)} />
      <circle cx={93} cy={111} r={er * 0.22} fill="#fff" opacity={0.75} />
      {(lid[0] !== 0 || lid[1] !== 0) && <g clipPath={`url(#${id}e)`}>
        <rect x={100 - er - 8} y={118 - er - 8 - (1 - lid[0]) * er * 2} width={er * 2 + 16} height={er * 2 + 8} fill="#9aa4b2" transform={eye === 'smug' ? 'rotate(-10 100 118)' : undefined} />
        <rect x={100 - er - 8} y={118 + er + 8 - lid[1] * er * 2} width={er * 2 + 16} height={er * 2} fill="#9aa4b2" />
        <line x1={100 - er - 8} x2={100 + er + 8} y1={118 - er + lid[0] * er * 2} y2={118 - er + lid[0] * er * 2} stroke="#2a3040" strokeWidth="3" transform={eye === 'smug' ? 'rotate(-10 100 118)' : undefined} />
        {lid[1] > 0 && <line x1={100 - er - 8} x2={100 + er + 8} y1={118 + er - lid[1] * er * 2} y2={118 + er - lid[1] * er * 2} stroke="#2a3040" strokeWidth="3" />}
      </g>}
      {/* counter screen */}
      <rect x="50" y="170" width="100" height="70" rx="10" fill="#070a12" stroke="#2a3040" strokeWidth="3" opacity={1 - xray * 0.6} />
      <text x="100" y="208" textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={screenText ? 15 : 28} fill={wipe > 0 ? '#fff' : red} opacity={wipe > 0 ? (Math.sin(t * 20) > 0 ? 1 : 0.3) : 1} style={{ filter: `drop-shadow(0 0 4px ${red})` }}>{wipe > 0 ? 'WIPING' : screenText ?? (unlocked ? 'OPEN' : `${used}/10`)}</text>
      {!screenText && <g>{Array.from({ length: 10 }, (_, i) => <rect key={i} x={58 + i * 8.6} y="222" width="6" height="9" rx="1.5" fill={i < used ? '#3a2228' : red} opacity={i < used ? 0.9 : 0.95} />)}</g>}
      {wipe > 0 && <rect x="50" y="170" width={100 * wipe} height="70" rx="10" fill={P.red} opacity="0.35" />}
    </svg>
  );
};

// ---------------------------------------------------------------- vault stage (spotlight, haze, pedestal)
export const Vault: React.FC<{ light?: number; pedestal?: boolean; tint?: string; haze?: number }> = ({ light = 1, pedestal = true, tint = '255,240,220', haze = 1 }) => {
  const { t } = useTF();
  const r = rng(13);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${P.ink2}, ${P.ink} 70%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 820, bottom: 0, background: 'linear-gradient(180deg,#0d1424,#05070d)' }} />
      {/* back wall vault door rings */}
      <svg style={{ position: 'absolute', left: 1180, top: 120, opacity: 0.18 }} width="620" height="620" viewBox="0 0 620 620">{[300, 250, 200, 150].map((rr, i) => <circle key={i} cx="310" cy="310" r={rr} fill="none" stroke="#8c97a8" strokeWidth={i ? 6 : 14} />)}{Array.from({ length: 8 }, (_, i) => <line key={i} x1="310" y1="310" x2={310 + Math.cos((i / 8) * 6.283 + t * 0.05) * 140} y2={310 + Math.sin((i / 8) * 6.283 + t * 0.05) * 140} stroke="#8c97a8" strokeWidth="8" />)}</svg>
      {/* light cone */}
      <div style={{ position: 'absolute', left: 960 - 420, top: -40, width: 840, height: 960, clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)', background: `linear-gradient(180deg, rgba(${tint},${0.32 * light}), rgba(${tint},${0.04 * light}))`, filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', left: 960 - 330, top: 800, width: 660, height: 90, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${tint},${0.32 * light}), transparent 70%)` }} />
      {/* haze */}
      {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: -200 + ((t * (8 + i * 5) + i * 600) % 2400) - 300, top: 380 + i * 160, width: 900, height: 260, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(160,180,220,.07), transparent 70%)', opacity: haze }} />)}
      {/* dust in the beam */}
      {Array.from({ length: 26 }, (_, i) => { const px = 960 + (r() - 0.5) * 520, py = ((r() * 900 + t * (10 + r() * 14)) % 860) + 40, s = 2 + r() * 3; return <div key={i} style={{ position: 'absolute', left: px, top: py, width: s, height: s, borderRadius: '50%', background: `rgba(${tint},0.6)`, opacity: light * (0.3 + 0.7 * Math.abs(Math.sin(t + i))) }} />; })}
      {pedestal && <>
        <div style={{ position: 'absolute', left: 960 - 190, top: 830, width: 380, height: 300, background: 'linear-gradient(90deg,#1a1d28,#2c3142 45%,#151822)' }} />
        <div style={{ position: 'absolute', left: 960 - 230, top: 800, width: 460, height: 46, borderRadius: 10, background: 'linear-gradient(180deg,#5a1424,#3a0c18)', boxShadow: '0 12px 30px rgba(0,0,0,.6)' }} />
      </>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- GUESSES LEFT HUD (top-right)
export const HUD: React.FC<{ left?: number; heat?: number; at?: number; out?: number }> = ({ left = 2, heat = 0, at = -1, out }) => {
  const { t } = useTF();
  const o = (at < 0 ? 1 : ramp(t, at, 0.4)) * (out != null ? 1 - ramp(t, out, 0.3) : 1);
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', right: 56, top: 48, opacity: o, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 14, background: 'rgba(7,11,22,.72)', border: `2px solid rgba(255,46,77,${0.35 + 0.4 * heat})`, boxShadow: `0 0 ${20 + 30 * heat}px rgba(255,46,77,${0.15 + 0.3 * heat})`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: '#c9d1dc' }}>
      GUESSES LEFT
      <div style={{ display: 'flex', gap: 6 }}>{[0, 1].map((i) => <div key={i} style={{ width: 14, height: 26, borderRadius: 3, background: i < left ? P.red : '#2a2f3d', boxShadow: i < left ? `0 0 12px ${P.red}` : 'none' }} />)}</div>
    </div>
  );
};

// ---------------------------------------------------------------- cards
export const QuoteCard: React.FC<{ x: number; y: number; w?: number; at: number; text: string; source: string; size?: number }> = ({ x, y, w = 1100, at, text, source, size = 46 }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.02) return null;
  const s = springAt(f, fps, at, { damping: 16, stiffness: 140 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) translateY(${(1 - s) * 40}px) rotate(-1.2deg)`, opacity: clamp(s * 1.4), padding: '44px 56px 34px', background: '#f1ead9', clipPath: 'polygon(0 2%, 4% 0, 12% 2%, 22% 0, 35% 1.5%, 50% 0, 64% 2%, 78% 0, 90% 1.6%, 100% 0, 99% 50%, 100% 100%, 88% 98%, 72% 100%, 58% 98.5%, 42% 100%, 28% 98%, 14% 100%, 0 98%, 1% 50%)', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
      <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 110, lineHeight: 0.6, color: '#b3261e', height: 50 }}>“</div>
      <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: size, lineHeight: 1.3, color: '#22201c' }}>{text}</div>
      <div style={{ marginTop: 22, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: '#6b6250', letterSpacing: '0.06em' }}>— {source}</div>
    </div>
  );
};
export const CaseCard: React.FC<{ x: number; y: number; at: number; text: string; rot?: number; stamp?: string; stampAt?: number }> = ({ x, y, at, text, rot = 0, stamp, stampAt = 0 }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.02) return null;
  const s = springAt(f, fps, at, { damping: 14, stiffness: 200 });
  const st = stamp && t > stampAt ? ramp(t, stampAt, 0.16, EASE.in) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 420, height: 300, transform: `translate(-50%,-50%) translateY(${(1 - s) * -80}px) rotate(${rot}deg)`, opacity: clamp(s * 1.5) }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 160, height: 40, borderRadius: '12px 12px 0 0', background: '#c79a5a' }} />
      <div style={{ position: 'absolute', left: 0, top: 30, right: 0, bottom: 0, borderRadius: '0 14px 14px 14px', background: 'linear-gradient(160deg,#e2bf83,#c79a5a)', boxShadow: '0 24px 60px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 52, color: '#3a2610', textAlign: 'center', lineHeight: 1.05, padding: 20 }}>{text}</div>
      {st > 0 && <div style={{ position: 'absolute', right: -20, top: 40, transform: `rotate(14deg) scale(${3 - 2 * st})`, opacity: st, padding: '4px 18px', border: `6px solid ${P.red}`, borderRadius: 10, fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: P.red }}>{stamp}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- coins
export const Coin: React.FC<{ x: number; y: number; size?: number; spin?: number; grey?: number; opacity?: number }> = ({ x, y, size = 90, spin = 0, grey = 0, opacity = 1 }) => {
  const sx = Math.cos(spin);
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', transform: `scaleX(${Math.max(0.08, Math.abs(sx))})`, opacity, filter: grey ? `grayscale(${grey}) brightness(${1 - grey * 0.5})` : undefined, background: 'radial-gradient(circle at 35% 30%, #fff1b8, #f7b23b 45%, #b07a10 100%)', boxShadow: `inset 0 0 0 ${size * 0.07}px #c98c1a, 0 ${size * 0.08}px ${size * 0.2}px rgba(0,0,0,.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: size * 0.55, color: '#8a5a08' }}>{sx > 0 ? '₿' : ''}</div>
  );
};

// ---------------------------------------------------------------- people (generic cartoon busts, sympathetic)
export type Mood = 'neutral' | 'worried' | 'sad' | 'happy' | 'shock' | 'focused' | 'cry' | 'smile';
type Kind = 'stefan' | 'joe' | 'dan' | 'james';
const LOOK: Record<Kind, { skin: string; hair: string; top: string; glasses?: boolean; headlamp?: boolean; beard?: boolean; cap?: string }> = {
  stefan: { skin: '#f0c9a4', hair: '#6b4a2e', top: '#2a6f86', glasses: true },
  joe: { skin: '#e9be98', hair: '#2a2420', top: '#1b1f2b', headlamp: true, beard: true },
  dan: { skin: '#f3d2b3', hair: '#d9b25a', top: '#8a3a2a' },
  james: { skin: '#efc6a0', hair: '#3a2a20', top: '#3d4b2a', cap: '#1d2a3a' },
};
export const Person: React.FC<{ kind: Kind; x: number; y: number; size?: number; mood?: Mood; look?: number; tilt?: number; seed?: number; typing?: boolean; lamp?: number }> = ({ kind, x, y, size = 420, mood = 'neutral', look = 0, tilt = 0, seed = 1, typing = false, lamp = 0 }) => {
  const { t } = useTF();
  const L = LOOK[kind];
  const bl = blinkAt(t, seed);
  const breathe = Math.sin(t * 2 + seed) * 0.012;
  const eyeRy = mood === 'shock' ? 13 : mood === 'focused' ? 6 : 10;
  const brow: Record<Mood, string> = {
    neutral: 'M62 82 L88 80 M112 80 L138 82', worried: 'M62 84 L88 76 M112 76 L138 84', sad: 'M62 86 L88 78 M112 78 L138 86', happy: 'M62 78 L88 75 M112 75 L138 78',
    shock: 'M62 72 L88 68 M112 68 L138 72', focused: 'M62 80 L88 86 M112 86 L138 80', cry: 'M62 88 L88 76 M112 76 L138 88', smile: 'M62 79 L88 76 M112 76 L138 79',
  };
  const mouth: Record<Mood, React.ReactNode> = {
    neutral: <path d="M88 142 Q100 146 112 142" stroke="#5a2a20" strokeWidth="4" fill="none" strokeLinecap="round" />,
    worried: <path d="M86 146 Q100 138 114 146" stroke="#5a2a20" strokeWidth="4" fill="none" strokeLinecap="round" />,
    sad: <path d="M86 148 Q100 136 114 148" stroke="#5a2a20" strokeWidth="4" fill="none" strokeLinecap="round" />,
    happy: <path d="M82 138 Q100 160 118 138 Z" fill="#5a2a20" />,
    smile: <path d="M86 140 Q100 152 114 140" stroke="#5a2a20" strokeWidth="4" fill="none" strokeLinecap="round" />,
    shock: <ellipse cx="100" cy="146" rx="10" ry="13" fill="#5a2a20" />,
    focused: <path d="M90 144 L110 143" stroke="#5a2a20" strokeWidth="4" strokeLinecap="round" />,
    cry: <path d="M84 150 Q100 134 116 150" stroke="#5a2a20" strokeWidth="5" fill="none" strokeLinecap="round" />,
  };
  return (
    <svg style={{ position: 'absolute', left: x - size / 2, top: y - size * 1.1, overflow: 'visible', transform: `rotate(${tilt}deg) scaleY(${1 + breathe})`, transformOrigin: '50% 100%' }} width={size} height={size * 1.1} viewBox="0 0 200 220">
      {L.headlamp && lamp > 0 && <polygon points="100,52 30,-120 170,-120" fill="#fff6c8" opacity={0.1 * lamp} />}
      {/* body */}
      <path d="M30 220 Q30 168 100 166 Q170 168 170 220 Z" fill={L.top} />
      <path d="M86 168 L100 190 L114 168" stroke="rgba(0,0,0,.25)" strokeWidth="4" fill="none" />
      {typing && [0, 1].map((i) => <ellipse key={i} cx={70 + i * 60} cy={214 - Math.abs(Math.sin(t * 14 + i * 2)) * 6} rx="14" ry="9" fill={L.skin} />)}
      {/* neck + head */}
      <rect x="88" y="140" width="24" height="30" fill={L.skin} />
      <ellipse cx="100" cy="104" rx="50" ry="56" fill={L.skin} />
      <ellipse cx="50" cy="108" rx="8" ry="12" fill={L.skin} /><ellipse cx="150" cy="108" rx="8" ry="12" fill={L.skin} />
      {/* hair */}
      {L.cap ? <path d="M48 86 Q50 40 100 40 Q150 40 152 86 Z M140 80 L176 86 L150 92 Z" fill={L.cap} /> : <path d="M50 96 Q46 46 100 44 Q156 46 150 96 Q140 66 100 64 Q66 64 50 96 Z" fill={L.hair} />}
      {L.beard && <path d="M54 118 Q60 168 100 170 Q140 168 146 118 Q130 150 100 152 Q70 150 54 118 Z" fill={L.hair} opacity="0.85" />}
      {L.headlamp && <><rect x="52" y="58" width="96" height="10" rx="5" fill="#2a2f3d" /><rect x="88" y="48" width="24" height="18" rx="5" fill="#d8dce6" /><circle cx="100" cy="57" r="6" fill="#fff6c8" opacity={0.85} /></>}
      {/* eyes */}
      {[76, 124].map((ex, i) => <g key={i}><ellipse cx={ex} cy="104" rx="11" ry={Math.max(1, eyeRy * (1 - bl))} fill="#fff" /><circle cx={ex + look * 4} cy="105" r={Math.min(6, eyeRy * (1 - bl))} fill="#2a1d16" /></g>)}
      {L.glasses && <g fill="none" stroke="#1d2433" strokeWidth="4"><rect x="60" y="90" width="34" height="28" rx="9" /><rect x="106" y="90" width="34" height="28" rx="9" /><path d="M94 102 L106 102" /></g>}
      <path d={brow[mood]} stroke={L.cap ? '#3a2a20' : L.hair} strokeWidth="6" strokeLinecap="round" fill="none" />
      {mouth[mood]}
      {(mood === 'cry' || mood === 'sad') && [74, 126].map((tx, i) => { const u = (t * 1.1 + i * 0.5) % 1; return <path key={i} d={`M${tx} ${120 + u * 34} q -5 9 0 13 q 5 -4 0 -13`} fill="#5ab8ff" opacity={(mood === 'cry' ? 1 : 0.5) * (1 - u)} />; })}
    </svg>
  );
};

// ---------------------------------------------------------------- brute-force robot (comedy)
export const Robot: React.FC<{ x: number; y: number; size?: number; beard?: number; dizzy?: boolean; tilt?: number; eyes?: 'on' | 'x' }> = ({ x, y, size = 360, beard = 0, dizzy = false, tilt = 0, eyes = 'on' }) => {
  const { t } = useTF();
  return (
    <svg style={{ position: 'absolute', left: x - size / 2, top: y - size * 1.2, overflow: 'visible', transform: `rotate(${tilt}deg)`, transformOrigin: '50% 100%' }} width={size} height={size * 1.2} viewBox="0 0 200 240">
      <line x1="100" y1="10" x2="100" y2="40" stroke="#8c97a8" strokeWidth="5" /><circle cx="100" cy="10" r="8" fill={P.cyan} opacity={0.6 + 0.4 * Math.sin(t * 8)} />
      <rect x="40" y="40" width="120" height="96" rx="18" fill="#c9d1dc" stroke="#3a4152" strokeWidth="4" />
      <rect x="54" y="54" width="92" height="56" rx="10" fill="#0b0f1a" />
      {eyes === 'on' ? [80, 120].map((ex) => <rect key={ex} x={ex - 8} y="72" width="16" height="16" rx="3" fill={P.cyan} />) : [80, 120].map((ex) => <g key={ex} stroke={P.cyan} strokeWidth="4"><line x1={ex - 8} y1="72" x2={ex + 8} y2="88" /><line x1={ex + 8} y1="72" x2={ex - 8} y2="88" /></g>)}
      {beard > 0 && <path d={`M58 126 Q100 ${126 + 80 * beard} 142 126 Z`} fill="#e8e8ee" stroke="#b8bcc8" strokeWidth="2" />}
      <rect x="56" y="140" width="88" height="70" rx="12" fill="#aab4c3" stroke="#3a4152" strokeWidth="4" />
      <rect x="20" y="148" width="34" height="14" rx="7" fill="#8c97a8" /><rect x="146" y="148" width="34" height="14" rx="7" fill="#8c97a8" />
      <rect x="70" y="210" width="20" height="26" fill="#3a4152" /><rect x="110" y="210" width="20" height="26" fill="#3a4152" />
      {dizzy && [0, 1, 2].map((i) => <text key={i} x={100 + Math.cos(t * 6 + i * 2.1) * 60} y={30 + Math.sin(t * 6 + i * 2.1) * 12} fontSize="22" fill="#ffd23a" textAnchor="middle">★</text>)}
    </svg>
  );
};

// ---------------------------------------------------------------- small helpers
export const Pop: React.FC<{ x: number; y: number; at: number; out?: number; children: React.ReactNode; from?: number; rot?: number }> = ({ x, y, at, out, children, from = 40, rot = 0 }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.02 || (out != null && t > out + 0.3)) return null;
  const s = springAt(f, fps, at, { damping: 15, stiffness: 170 });
  const o = out != null ? 1 - ramp(t, out, 0.25, EASE.in) : 1;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * from}px) scale(${0.94 + 0.06 * s}) rotate(${rot}deg)`, opacity: clamp(s * 1.5) * o }}>{children}</div>;
};
export const Count: React.FC<{ from?: number; to: number; at: number; d?: number; fmt?: (n: number) => string }> = ({ from = 0, to, at, d = 1.1, fmt = (n) => Math.round(n).toLocaleString('en-US') }) => {
  const { t } = useTF();
  return <>{fmt(lerp(from, to, ramp(t, at, d, EASE.out)))}</>;
};
export const Title: React.FC<{ children: React.ReactNode; size?: number; color?: string; spacing?: string }> = ({ children, size = 72, color = '#fff', spacing = '0.02em' }) => (
  <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: size, lineHeight: 1.02, color, letterSpacing: spacing, whiteSpace: 'nowrap', textShadow: '0 8px 30px rgba(0,0,0,.6)' }}>{children}</div>
);
export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 26, color = C.dim }) => (
  <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: size, letterSpacing: '0.12em', color, whiteSpace: 'nowrap' }}>{children}</div>
);
