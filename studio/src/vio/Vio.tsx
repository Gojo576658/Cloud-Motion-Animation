// Vio: MechivioTech's recurring host, an anime-style boy (~17) who stands in for the channel owner.
// Black messy hair with one red streak, a black hoodie with a white "M", a white earbud, and a left eye
// that glows red while he is "decoding" something. Same rig in every video and the same look in every
// thumbnail (see deliverables/Vio-character-sheet.md). Anchor is bottom-centre, like the other cast.
import React from 'react';
import { useTF } from '../tg/kit';

export type VioMood = 'smirk' | 'happy' | 'talk' | 'shock' | 'think' | 'laugh' | 'angry';
export type VioArm = 'none' | 'point' | 'chin' | 'wave';

const INK = '#0e0e12', SKIN = '#f8d9c4', SKIN2 = '#e9bea4', HOOD = '#141418', HOOD2 = '#1f1f26', RED = '#ff2b3d', WHITE = '#f4f4f6';
const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.37) % 3.4; return p < 0.13 ? 1 - Math.abs(p - 0.065) / 0.065 : 0; };
const mix = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',')})`;
};

const Eye: React.FC<{ cx: number; mood: VioMood; look: number; blink: number; glow: number; side: -1 | 1; id: string }> = ({ cx, mood, look, blink, glow, side, id }) => {
  const cy = 250;
  const X = (dx: number) => cx + side * dx; // +dx points to the outer corner
  if (mood === 'happy' || mood === 'laugh') {
    return <path d={`M${X(-26)} ${cy + 4} Q${X(2)} ${cy - 22} ${X(30)} ${cy + 2}`} stroke={INK} strokeWidth={7.5} fill="none" strokeLinecap="round" />;
  }
  const open = 1 - blink;
  if (open < 0.3) return <path d={`M${X(-28)} ${cy + 2} Q${X(2)} ${cy + 12} ${X(34)} ${cy - 2}`} stroke={INK} strokeWidth={6.5} fill="none" strokeLinecap="round" />;
  const shock = mood === 'shock';
  const lid = mood === 'smirk' ? 10 : mood === 'angry' ? 12 : 0;
  const rot = mood === 'angry' ? -side * 10 : 0;
  const lx = look * 7, ly = mood === 'think' ? -7 : 0;
  const irx = shock ? 9 : 16, iry = shock ? 12 : 23;
  const iris = side === 1 ? mix('#2b2b3a', RED, glow) : '#2b2b3a';
  const iris2 = side === 1 ? mix('#55556e', '#ff8d98', glow) : '#55556e';
  const sclera = `M${X(-28)} ${cy - 4} Q${X(-24)} ${cy - 27} ${X(2)} ${cy - 28} Q${X(27)} ${cy - 27} ${X(31)} ${cy - 8} Q${X(28)} ${cy + 19} ${X(2)} ${cy + 22} Q${X(-23)} ${cy + 20} ${X(-28)} ${cy - 4} Z`;
  const lidPath = `M${X(-31)} ${cy - 1} Q${X(-25)} ${cy - 31} ${X(1)} ${cy - 32} Q${X(28)} ${cy - 31} ${X(35)} ${cy - 13} L${X(44)} ${cy - 21} L${X(37)} ${cy - 3} Q${X(25)} ${cy - 22} ${X(1)} ${cy - 23} Q${X(-22)} ${cy - 22} ${X(-27)} ${cy + 2} Z`;
  return (
    <g transform={`translate(0 ${cy}) scale(1 ${open}) translate(0 ${-cy})`}>
      <defs><clipPath id={`${id}c${side}`}><path d={sclera} /></clipPath></defs>
      <g clipPath={`url(#${id}c${side})`}>
        <rect x={cx - 40} y={cy - 34} width={80} height={62} fill={WHITE} />
        {glow > 0.02 && side === 1 && <circle cx={cx + lx} cy={cy + ly} r={irx + 14} fill={RED} opacity={glow * 0.35} />}
        <ellipse cx={cx + lx} cy={cy + 3 + ly} rx={irx} ry={iry} fill={iris} />
        <ellipse cx={cx + lx} cy={cy + 10 + ly} rx={irx * 0.7} ry={iry * 0.45} fill={iris2} />
        <ellipse cx={cx + lx} cy={cy + 1 + ly} rx={irx * 0.42} ry={iry * 0.48} fill={INK} />
        <ellipse cx={cx + lx + side * irx * 0.35} cy={cy - 8 + ly} rx={shock ? 3 : 6} ry={shock ? 3 : 8} fill="#fff" />
        <circle cx={cx + lx - side * irx * 0.4} cy={cy + 11 + ly} r={2.6} fill="#fff" opacity={0.9} />
        {lid > 0 && <rect x={cx - 40} y={cy - 40} width={80} height={14 + lid * 1.6} fill={SKIN} transform={`rotate(${rot} ${cx} ${cy})`} />}
      </g>
      <path d={lidPath} fill={INK} transform={`translate(0 ${lid}) rotate(${rot} ${cx} ${cy})`} />
      <path d={`M${X(20)} ${cy + 20} l${side * 8} ${-5}`} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      {glow > 0.02 && side === 1 && <circle cx={cx} cy={cy} r={44} fill={`url(#${id}g)`} opacity={glow} />}
    </g>
  );
};

export const Vio: React.FC<{
  x: number; y: number; size?: number; mood?: VioMood; talk?: number; look?: number; decode?: number;
  arm?: VioArm; seed?: number; flip?: boolean; tilt?: number;
}> = ({ x, y, size = 520, mood = 'smirk', talk = 0, look = 0, decode = 0, arm = 'none', seed = 1, flip = false, tilt = 0 }) => {
  const { t } = useTF();
  const id = `vio${seed}`;
  const blink = mood === 'happy' || mood === 'laugh' ? 0 : blinkAt(t, seed);
  const br = Math.sin(t * 2.1 + seed) * 0.008;
  const bob = Math.sin(t * 1.6 + seed) * 3;
  const head = Math.sin(t * 0.9 + seed) * 1.2 + tilt + (mood === 'think' ? -5 : mood === 'shock' ? 2 : 0);
  const talking = talk > 0.05 && mood !== 'shock' && mood !== 'laugh';
  // brows: [inner y, outer y] per side, relative to 212
  const BROW: Record<VioMood, [number, number]> = { smirk: [0, -4], happy: [-4, -2], talk: [-2, -2], shock: [-12, -8], think: [-6, 2], laugh: [-6, -2], angry: [8, -6] };
  const [bi, bo] = BROW[mood];
  const wave = arm === 'wave' ? Math.sin(t * 8) * 14 : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size * 0.77, height: size, transform: `translate(-50%,-100%) scaleX(${flip ? -1 : 1}) scale(${1 + br}, ${1 - br})`, transformOrigin: '50% 100%' }}>
      <svg viewBox="0 0 400 520" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id={`${id}g`}><stop offset="0" stopColor={RED} stopOpacity={0.55} /><stop offset="1" stopColor={RED} stopOpacity={0} /></radialGradient>
        </defs>
        <ellipse cx="200" cy="516" rx="150" ry="8" fill="rgba(0,0,0,.5)" />
        <g transform={`translate(0 ${bob * 0.4})`}>
          {/* hoodie */}
          <path d="M28 520 Q32 418 122 394 L162 384 Q200 408 238 384 L278 394 Q368 418 372 520 Z" fill={HOOD} />
          <path d="M118 398 Q126 348 200 350 Q274 348 282 398 Q244 372 200 372 Q156 372 118 398 Z" fill={HOOD2} />
          <path d="M182 402 L178 452" stroke={WHITE} strokeWidth={4} strokeLinecap="round" /><path d="M218 402 L222 452" stroke={WHITE} strokeWidth={4} strokeLinecap="round" />
          <circle cx="178" cy="456" r="4" fill={WHITE} /><circle cx="222" cy="456" r="4" fill={WHITE} />
          <path d="M176 500 L176 468 L200 488 L224 468 L224 500" stroke={WHITE} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="240" cy="500" r="4" fill={RED} />
          {/* earbud cable */}
          <path d="M274 276 Q286 330 252 382" stroke={WHITE} strokeWidth={2.5} fill="none" opacity={0.8} />
        </g>
        {/* neck */}
        <path d="M181 326 L181 384 Q200 396 219 384 L219 326 Z" fill={SKIN2} />
        <g transform={`translate(0 ${bob}) rotate(${head} 200 340)`}>
          {/* back hair, with side locks that fall past the ears */}
          <path d="M104 270 Q84 112 200 78 Q316 112 296 270 L282 228 Q278 140 200 134 Q122 140 118 228 Z" fill={INK} />
          {/* ears + earbud */}
          <ellipse cx="127" cy="252" rx="12" ry="20" fill={SKIN2} /><ellipse cx="273" cy="252" rx="12" ry="20" fill={SKIN2} />
          <circle cx="275" cy="262" r="8" fill={WHITE} /><rect x="271" y="264" width="7" height="16" rx="3" fill={WHITE} />
          {/* face */}
          <path d="M128 200 Q126 298 168 336 Q200 362 232 336 Q274 298 272 200 Q270 122 200 118 Q130 122 128 200 Z" fill={SKIN} />
          {(mood === 'happy' || mood === 'laugh') && <><ellipse cx="150" cy="292" rx="16" ry="8" fill="#ff8a96" opacity={0.35} /><ellipse cx="250" cy="292" rx="16" ry="8" fill="#ff8a96" opacity={0.35} /></>}
          <Eye cx={164} mood={mood} look={look} blink={blink} glow={0} side={-1} id={id} />
          <Eye cx={236} mood={mood} look={look} blink={blink} glow={decode} side={1} id={id} />
          {/* nose */}
          <path d="M201 276 L196 291 L203 292" stroke="#d29c84" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* mouth */}
          {talking ? (
            <g><path d={`M186 308 Q200 ${303 - talk * 2} 214 308 Q212 ${310 + talk * 14} 200 ${312 + talk * 16} Q188 ${310 + talk * 14} 186 308 Z`} fill="#5a1a1a" /><ellipse cx="200" cy={310 + talk * 12} rx={7} ry={2 + talk * 3} fill="#d9535f" /></g>
          ) : mood === 'shock' ? (
            <ellipse cx="200" cy="314" rx="10" ry="14" fill="#5a1a1a" />
          ) : mood === 'laugh' ? (
            <g><path d="M176 302 Q200 298 224 302 Q218 336 200 338 Q182 336 176 302 Z" fill="#5a1a1a" /><path d="M180 303 Q200 300 220 303 L218 310 Q200 307 182 310 Z" fill="#fff" /><ellipse cx="200" cy="328" rx="12" ry="6" fill="#d9535f" /></g>
          ) : mood === 'angry' ? (
            <g><rect x="184" y="304" width="32" height="13" rx="3" fill="#fff" stroke="#5a1a1a" strokeWidth={3} /><path d="M194 304 v13 M206 304 v13" stroke="#5a1a1a" strokeWidth={2} /></g>
          ) : mood === 'think' ? (
            <path d="M190 314 Q200 310 210 312" stroke="#5a1a1a" strokeWidth={4} fill="none" strokeLinecap="round" />
          ) : mood === 'happy' ? (
            <path d="M182 304 Q200 324 218 304" stroke="#5a1a1a" strokeWidth={4.5} fill="none" strokeLinecap="round" />
          ) : (
            <g><path d="M184 312 Q202 318 216 304" stroke="#5a1a1a" strokeWidth={4.5} fill="none" strokeLinecap="round" /><path d="M216 304 l4 -3" stroke="#5a1a1a" strokeWidth={3} strokeLinecap="round" /></g>
          )}
          {/* front hair: full bangs, chunky spikes, side locks, one red strand, shine */}
          <path d="M138 134 L118 72 L168 100 L176 40 L212 90 L254 46 L252 104 L300 84 L272 142 Z" fill={INK} />
          <path d="M116 226 L124 160 Q144 102 200 94 Q260 98 284 160 L290 228 L272 188 L264 206 L246 176 L228 202 L212 176 L201 234 L188 178 L172 204 L158 180 L146 202 L136 186 Z" fill={INK} />
          <path d="M124 190 Q112 236 120 280 L132 252 L138 276 L146 222 Z" fill={INK} /><path d="M276 190 Q288 236 280 280 L268 252 L262 276 L254 222 Z" fill={INK} />
          <path d="M200 112 Q224 138 230 176 L228 216 L216 184 Q212 150 190 122 Z" fill={RED} />
          <path d="M148 128 Q174 110 206 108" stroke="#2e2e3a" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* brows, on the forehead just under the bangs */}
          <path d={`M142 ${214 + bo} L186 ${212 + bi}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
          <path d={`M214 ${212 + bi} L258 ${214 + bo + (mood === 'smirk' ? -6 : 0)}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
          {/* mood extras */}
          {mood === 'shock' && <path d="M290 186 Q300 206 290 216 Q280 206 290 186 Z" fill="#a8d8ff" />}
          {mood === 'angry' && <path d="M292 138 q8 2 10 10 M316 138 q-8 2 -10 10 M292 162 q8 -2 10 -10 M316 162 q-8 -2 -10 -10" stroke={RED} strokeWidth={5} fill="none" strokeLinecap="round" />}
          {mood === 'think' && <text x="300" y="130" fontFamily="Inter Tight, sans-serif" fontWeight={900} fontSize={54} fill={RED}>?</text>}
          {decode > 0.02 && <path d={`M210 ${236 + ((t * 40) % 26)} h52`} stroke={RED} strokeWidth={2} opacity={decode * 0.8} />}
        </g>
        {/* arms */}
        {arm === 'point' && <g><path d="M292 440 Q350 420 350 340" stroke={HOOD} strokeWidth={48} strokeLinecap="round" fill="none" /><g transform="translate(350 318) rotate(-42)"><rect x="-22" y="-19" width="42" height="38" rx="15" fill={SKIN} /><rect x="12" y="-17" width="48" height="14" rx="7" fill={SKIN} /><rect x="-16" y="-28" width="26" height="13" rx="6.5" fill={SKIN2} /><path d="M-8 4 h22 M-8 12 h20" stroke={SKIN2} strokeWidth={3} strokeLinecap="round" /></g></g>}
        {arm === 'chin' && <g transform={`translate(0 ${bob})`}><path d="M108 470 Q150 430 170 362" stroke={HOOD} strokeWidth={46} strokeLinecap="round" fill="none" /><ellipse cx="184" cy="348" rx="24" ry="18" fill={SKIN} /><rect x="176" y="324" width="12" height="26" rx="6" fill={SKIN} /></g>}
        {arm === 'wave' && <g transform={`rotate(${wave} 300 430)`}><path d="M296 444 Q360 410 362 320" stroke={HOOD} strokeWidth={48} strokeLinecap="round" fill="none" /><circle cx="362" cy="300" r="26" fill={SKIN} />{[-18, -6, 6, 18].map((dx, i) => <rect key={i} x={356 + dx - 5} y={256 + Math.abs(dx) * 0.6} width="11" height="34" rx="5" fill={SKIN} />)}</g>}
      </svg>
    </div>
  );
};
