// "It Said Yes" kit (Instagram accounts taken over through an AI support chatbot). Look: black stage with a
// dark-grey grid; graphic elements in white, red and black only; characters may use their own colours.
// Cast: Helper (the over-eager support robot), the hacker, the account owner. Plus a phone, chat bubbles
// with kinetic word-by-word typing synced to the voice, and type-on text for anything that gets typed.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { fonts } from '../tg/type';
import { useTF } from '../tg/kit';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';

export const A = { ink: '#050507', panel: '#0d0d11', grid: '#1b1b21', line: '#2a2a33', white: '#f4f4f6', red: '#ff2b3d', dim: '#8a8a96', soft: '#c9c9d1' };
const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.37) % 3.3; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

// ---------------------------------------------------------------- stage: black + dark-grey grid, a few lit cells
export const GridBg: React.FC<{ glow?: string; x?: number; y?: number; drift?: number; size?: number }> = ({ glow = 'rgba(255,255,255,.05)', x = 50, y = 45, drift = 1, size = 80 }) => {
  const { t } = useTF();
  const ox = (t * 6 * drift) % size, oy = (t * 3 * drift) % size;
  const cells = [[3, 2], [17, 4], [9, 9], [21, 11], [5, 12], [14, 1], [19, 7]];
  return (
    <AbsoluteFill style={{ background: A.ink, overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${A.grid} 2px, transparent 2px), linear-gradient(90deg, ${A.grid} 2px, transparent 2px)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: `${-ox}px ${-oy}px` }} />
      {cells.map(([cx, cy], i) => <div key={i} style={{ position: 'absolute', left: cx * size - ox + 2, top: cy * size - oy + 2, width: size - 2, height: size - 2, background: 'rgba(255,255,255,.025)', opacity: 0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.7) }} />)}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, ${glow}, transparent 60%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,.75) 100%)' }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Helper, the support robot
export type BotMood = 'happy' | 'proud' | 'guilty' | 'heart' | 'off' | 'neutral' | 'wink';
export const Helper: React.FC<{ x: number; y: number; size?: number; mood?: BotMood; talk?: number; wave?: boolean; tilt?: number; seed?: number; squash?: number; sign?: string; signAt?: number }> = ({ x, y, size = 360, mood = 'happy', talk = 0, wave = false, tilt = 0, seed = 1, squash = 0, sign, signAt = 0 }) => {
  const { f, fps, t } = useTF();
  const bob = Math.sin(t * 2.4 + seed) * 6;
  const bl = mood === 'off' || mood === 'heart' ? 0 : blinkAt(t, seed);
  const look = mood === 'guilty' ? -9 : 0;
  const eye = (cx: number) => {
    if (mood === 'off') return <rect x={cx - 12} y={92} width={24} height={4} rx={2} fill="#3a3a44" />;
    if (mood === 'heart') return <path d={`M${cx} 108 l-14 -14 a8 8 0 0 1 14 -10 a8 8 0 0 1 14 10 z`} fill={A.red} />;
    if (mood === 'happy' || mood === 'proud') return <path d={`M${cx - 12} 98 q12 -16 24 0`} stroke="#bff2ff" strokeWidth={6} fill="none" strokeLinecap="round" />;
    if (mood === 'wink' && cx > 100) return <path d={`M${cx - 12} 96 h24`} stroke="#bff2ff" strokeWidth={6} strokeLinecap="round" />;
    return <rect x={cx - 10 + look} y={84 + (1 - (1 - bl)) * 10} width={20} height={Math.max(3, 24 * (1 - bl))} rx={8} fill="#bff2ff" />;
  };
  const wav = wave ? Math.sin(t * 11) * 22 : 0;
  const s = sign ? springAt(f, fps, signAt, { damping: 10, stiffness: 170 }) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y + bob, width: size * 0.8, height: size, transform: `translate(-50%,-100%) rotate(${tilt}deg) scale(${1 + squash * 0.5}, ${1 - squash})`, transformOrigin: '50% 100%' }}>
      <svg viewBox="0 0 200 250" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <ellipse cx="100" cy="246" rx="58" ry="7" fill="rgba(0,0,0,.5)" />
        {/* antenna */}
        <line x1="100" y1="30" x2="100" y2="8" stroke="#d9dde6" strokeWidth="5" />
        <circle cx="100" cy="8" r="8" fill={mood === 'off' ? '#3a3a44' : A.red} style={{ filter: mood === 'off' ? undefined : `drop-shadow(0 0 6px ${A.red})` }} />
        {/* arms */}
        <g transform={`rotate(${mood === 'guilty' ? 30 : 12} 40 160)`}><rect x="22" y="150" width="20" height="56" rx="10" fill="#e3e7ef" /></g>
        <g transform={`rotate(${wave ? -140 + wav : mood === 'guilty' ? -30 : -12} 160 160)`}><rect x="158" y="150" width="20" height="56" rx="10" fill="#e3e7ef" /><circle cx="168" cy="210" r="11" fill="#e3e7ef" /></g>
        {/* body */}
        <rect x="46" y="140" width="108" height="90" rx="30" fill="#eef1f6" />
        <rect x="80" y="166" width="40" height="22" rx="6" fill="#d6dbe5" />
        <text x="100" y="182" textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize="11" fill={A.red}>HELP</text>
        {/* head */}
        <rect x="30" y="30" width="140" height="116" rx="44" fill="#f6f8fb" />
        <rect x="44" y="52" width="112" height="76" rx="30" fill="#0c0e14" />
        {eye(80)}{eye(120)}
        {mood !== 'off' && (talk > 0.05 ? <ellipse cx="100" cy="116" rx="12" ry={3 + talk * 6} fill="#bff2ff" /> : mood === 'guilty' ? <path d="M90 118 q10 -6 20 0" stroke="#bff2ff" strokeWidth={4} fill="none" strokeLinecap="round" /> : <path d="M86 112 q14 12 28 0" stroke="#bff2ff" strokeWidth={4} fill="none" strokeLinecap="round" />)}
        {(mood === 'happy' || mood === 'heart' || mood === 'proud') && <><circle cx="58" cy="114" r="7" fill="rgba(255,43,61,.35)" /><circle cx="142" cy="114" r="7" fill="rgba(255,43,61,.35)" /></>}
        {mood === 'guilty' && <path d="M150 64 q6 10 0 16 q-6 -6 0 -16" fill="#9fd8ff" />}
      </svg>
      {sign && s > 0.01 && <div style={{ position: 'absolute', left: '50%', top: '38%', transform: `translate(-50%,-50%) rotate(-6deg) scale(${s})`, padding: `${size * 0.03}px ${size * 0.06}px`, background: A.red, border: `${size * 0.012}px solid ${A.white}`, ...fonts.H, fontWeight: 900, fontSize: size * 0.085, color: A.white, whiteSpace: 'nowrap', boxShadow: '0 20px 40px rgba(0,0,0,.5)' }}>{sign}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- the hacker (hoodie, laptop glow, optional terrible disguise)
export const Hacker: React.FC<{ x: number; y: number; size?: number; disguise?: number; tag?: string; grin?: boolean; laptop?: boolean; look?: number }> = ({ x, y, size = 380, disguise = 0, tag, grin = false, laptop = true, look = 0 }) => {
  const { t } = useTF();
  const lx = look * 6;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size * 0.9, height: size, transform: 'translate(-50%,-100%)' }}>
      <svg viewBox="0 0 220 250" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <ellipse cx="110" cy="246" rx="70" ry="7" fill="rgba(0,0,0,.5)" />
        <path d="M30 246 Q30 150 110 140 Q190 150 190 246 Z" fill="#26262e" />
        <path d="M58 120 Q50 40 110 30 Q170 40 162 120 Q160 150 110 154 Q60 150 58 120 Z" fill="#2f2f38" />
        <ellipse cx="110" cy="100" rx="40" ry="44" fill="#d9a77c" />
        <path d="M66 84 Q110 40 154 84 Q150 60 110 52 Q70 60 66 84 Z" fill="#2f2f38" />
        <ellipse cx={96 + lx} cy="98" rx="5" ry="6" fill="#16161c" /><ellipse cx={124 + lx} cy="98" rx="5" ry="6" fill="#16161c" />
        <path d="M86 84 l18 4 M134 84 l-18 4" stroke="#3a2a1e" strokeWidth="4" strokeLinecap="round" />
        {grin ? <path d="M94 122 q16 12 32 0" stroke="#5a1a1a" strokeWidth="4" fill="#fff" /> : <path d="M98 124 h24" stroke="#5a1a1a" strokeWidth="4" strokeLinecap="round" />}
        {disguise > 0 && <g opacity={disguise}><path d="M84 114 q13 -10 26 -2 q13 -8 26 2 q-8 9 -26 4 q-18 5 -26 -4 z" fill="#15100c" /><rect x="78" y="88" width="64" height="16" rx="8" fill="none" stroke="#111" strokeWidth="4" /><line x1="110" y1="96" x2="110" y2="96" /></g>}
        {laptop && <><rect x="58" y="176" width="104" height="64" rx="6" fill="#16161c" /><rect x="64" y="182" width="92" height="52" rx="3" fill={`rgba(255,43,61,${0.55 + 0.15 * Math.sin(t * 6)})`} /></>}
      </svg>
      {tag && disguise > 0.5 && <div style={{ position: 'absolute', left: '50%', top: '66%', transform: 'translate(-50%,0) rotate(3deg)', padding: `${size * 0.02}px ${size * 0.04}px`, background: A.white, border: `${size * 0.01}px solid #111`, ...fonts.H, fontWeight: 900, fontSize: size * 0.062, color: '#111', whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05 }}>{tag}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- the account owner (in bed / with phone)
export const Owner: React.FC<{ x: number; y: number; size?: number; mood?: 'sleepy' | 'shock' | 'sad' | 'calm' }> = ({ x, y, size = 380, mood = 'calm' }) => {
  const { t } = useTF();
  const bl = mood === 'sleepy' ? 0.6 : blinkAt(t, 4);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size * 0.85, height: size, transform: 'translate(-50%,-100%)' }}>
      <svg viewBox="0 0 200 240" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <path d="M30 240 Q30 150 100 142 Q170 150 170 240 Z" fill="#3d6fd8" />
        <ellipse cx="100" cy="92" rx="44" ry="48" fill="#f0c49c" />
        <path d="M56 86 Q54 40 100 38 Q150 38 146 88 Q140 62 100 60 Q64 60 56 86 Z" fill="#3a2414" />
        {mood === 'shock' ? <><circle cx="84" cy="94" r="9" fill="#fff" /><circle cx="116" cy="94" r="9" fill="#fff" /><circle cx="84" cy="95" r="4" fill="#111" /><circle cx="116" cy="95" r="4" fill="#111" /><ellipse cx="100" cy="124" rx="8" ry="10" fill="#5a1a1a" /></>
          : <><ellipse cx="84" cy="94" rx="7" ry={8 * (1 - bl)} fill="#111" /><ellipse cx="116" cy="94" rx="7" ry={8 * (1 - bl)} fill="#111" />{mood === 'sad' ? <path d="M88 126 q12 -8 24 0" stroke="#5a1a1a" strokeWidth="4" fill="none" /> : <path d="M90 122 q10 6 20 0" stroke="#5a1a1a" strokeWidth="4" fill="none" />}</>}
        {mood === 'sleepy' && <path d="M60 64 q20 -20 46 -10" stroke="#3a2414" strokeWidth="8" fill="none" />}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- phone + chat
export const Phone: React.FC<{ x: number; y: number; w?: number; children?: React.ReactNode; tilt?: number }> = ({ x, y, w = 440, children, tilt = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: w * 2.05, transform: `translate(-50%,-50%) rotate(${tilt}deg)`, borderRadius: w * 0.13, background: '#111116', padding: w * 0.035, boxShadow: '0 40px 90px rgba(0,0,0,.65), inset 0 0 0 2px #2a2a33' }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.1, background: '#0a0a0d', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 12, width: w * 0.28, height: 22, borderRadius: 11, background: '#000', transform: 'translateX(-50%)' }} />
      {children}
    </div>
  </div>
);
// type-on text (for things typed that are not spoken): characters appear at cps, with a cursor
export const TypeOn: React.FC<{ text: string; at: number; cps?: number; cursor?: boolean; style?: React.CSSProperties }> = ({ text, at, cps = 22, cursor = true, style }) => {
  const { t } = useTF();
  const n = Math.floor(clamp((t - at) * cps, 0, text.length));
  return <span style={style}>{text.slice(0, n)}{cursor && n < text.length + 1 && t > at - 0.2 && <span style={{ opacity: Math.sin(t * 10) > 0 ? 1 : 0 }}>|</span>}</span>;
};
// kinetic chat bubble: words appear one by one (rise + fade), timed to `times` (e.g. the voice's word starts)
export const Bubble: React.FC<{ words: string[]; times: number[]; side?: 'left' | 'right'; w?: number; size?: number; who?: string; dark?: boolean }> = ({ words, times, side = 'left', w = 520, size = 34, who, dark = false }) => {
  const { f, fps, t } = useTF();
  if (t < times[0] - 0.25) return null;
  const s = springAt(f, fps, times[0] - 0.25, { damping: 14, stiffness: 220 });
  return (
    <div style={{ display: 'flex', justifyContent: side === 'left' ? 'flex-start' : 'flex-end', transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: side === 'left' ? '0 100%' : '100% 100%', opacity: clamp(s * 1.6) }}>
      <div style={{ maxWidth: w, padding: `${size * 0.5}px ${size * 0.7}px`, borderRadius: size * 0.9, borderBottomLeftRadius: side === 'left' ? 8 : size * 0.9, borderBottomRightRadius: side === 'right' ? 8 : size * 0.9, background: dark ? '#1c1c22' : side === 'left' ? A.white : A.red, color: dark || side === 'right' ? A.white : '#111' }}>
        {who && <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: size * 0.42, letterSpacing: '0.14em', opacity: 0.6, marginBottom: 6 }}>{who}</div>}
        <div style={{ ...fonts.H, fontWeight: 700, fontSize: size, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {words.map((wd, i) => { const u = ramp(t, times[i] - 0.05, 0.25, EASE.out); return <span key={i} style={{ display: 'inline-block', marginRight: '0.28em', opacity: u, transform: `translateY(${(1 - u) * 14}px)` }}>{wd}</span>; })}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- small UI
export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; solid?: boolean }> = ({ children, color = A.white, size = 30, solid = false }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${size * 0.35}px ${size * 0.7}px`, borderRadius: size * 0.3, background: solid ? color : 'rgba(5,5,7,.85)', border: `2px solid ${solid ? color : color + '66'}`, ...fonts.H, fontWeight: 800, fontSize: size, color: solid ? (color === A.white ? '#111' : A.white) : color, whiteSpace: 'nowrap' }}>{children}</div>
);
export const Panel: React.FC<{ children: React.ReactNode; w?: number; pad?: number }> = ({ children, w, pad = 30 }) => (
  <div style={{ width: w, padding: pad, borderRadius: 20, background: A.panel, border: `2px solid ${A.line}`, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>{children}</div>
);
// big kinetic number (counts up, settles)
export const BigNum: React.FC<{ to: number; at: number; d?: number; prefix?: string; suffix?: string; size?: number; color?: string }> = ({ to, at, d = 1.2, prefix = '', suffix = '', size = 200, color = A.white }) => {
  const { t } = useTF();
  const v = lerp(0, to, ramp(t, at, d, EASE.out));
  return <div style={{ ...fonts.H, fontWeight: 900, fontSize: size, letterSpacing: '-0.05em', lineHeight: 1, color }}>{prefix}{Math.round(v).toLocaleString('en-US')}{suffix}</div>;
};
