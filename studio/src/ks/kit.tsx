// "Kill Switch" kit: the same black-grid stage and white/red/black graphic language as "It Said Yes"
// (re-exported from ../ai/kit), plus this story's cast: Marcus (a young researcher in a hoodie and headphones,
// a generic cartoon, not a likeness), the Worm (WannaCry as a crying red blob that copies itself), an FBI
// agent, the judge, and the red ransom screen.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { fonts } from '../tg/type';
import { useTF } from '../tg/kit';
import { clamp } from '../lib/time';
import { Icon } from '../components/Icon';
import { A } from '../ai/kit';
export { A, GridBg, Phone, TypeOn, Bubble, Label, Panel, BigNum } from '../ai/kit';

const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.37) % 3.2; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

// ---------------------------------------------------------------- Marcus
export type MarcusMood = 'calm' | 'focus' | 'happy' | 'shock' | 'sad' | 'proud';
export const Marcus: React.FC<{ x: number; y: number; size?: number; mood?: MarcusMood; look?: number; talk?: number; laptop?: boolean; cuffs?: boolean; seed?: number; tilt?: number }> = ({ x, y, size = 400, mood = 'calm', look = 0, talk = 0, laptop = false, cuffs = false, seed = 1, tilt = 0 }) => {
  const { t } = useTF();
  const bl = mood === 'happy' ? 0 : blinkAt(t, seed);
  const lx = look * 6, br = Math.sin(t * 2 + seed) * 0.01;
  const shock = mood === 'shock';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size * 0.85, height: size, transform: `translate(-50%,-100%) rotate(${tilt}deg) scale(${1 + br}, ${1 - br})`, transformOrigin: '50% 100%' }}>
      <svg viewBox="0 0 200 240" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <ellipse cx="100" cy="238" rx="64" ry="6" fill="rgba(0,0,0,.5)" />
        {/* hoodie */}
        <path d="M24 240 Q26 150 100 140 Q174 150 176 240 Z" fill="#4a4f5c" />
        <path d="M70 146 Q100 170 130 146" stroke="#3a3e48" strokeWidth="6" fill="none" />
        <line x1="90" y1="160" x2="88" y2="196" stroke="#e8e8ee" strokeWidth="3" /><line x1="110" y1="160" x2="112" y2="196" stroke="#e8e8ee" strokeWidth="3" />
        {/* headphones round the neck */}
        <path d="M58 138 Q100 168 142 138" stroke="#111" strokeWidth="9" fill="none" /><rect x="48" y="128" width="20" height="26" rx="8" fill={A.red} /><rect x="132" y="128" width="20" height="26" rx="8" fill={A.red} />
        {/* head */}
        <ellipse cx="100" cy="88" rx="42" ry="46" fill="#f1c7a0" />
        {/* curly hair */}
        {[[64, 58], [78, 44], [96, 38], [114, 40], [130, 50], [140, 66], [60, 74], [86, 46], [106, 46], [122, 56]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="15" fill="#6b3f22" />)}
        {/* eyes */}
        {shock ? <><circle cx="84" cy="92" r="9" fill="#fff" /><circle cx="116" cy="92" r="9" fill="#fff" /><circle cx={84 + lx} cy="93" r="4" fill="#111" /><circle cx={116 + lx} cy="93" r="4" fill="#111" /></>
          : mood === 'happy' ? <g stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M76 94 q8 -8 16 0" /><path d="M108 94 q8 -8 16 0" /></g>
            : <><ellipse cx={84 + lx} cy="92" rx="5" ry={6 * (1 - bl)} fill="#111" /><ellipse cx={116 + lx} cy="92" rx="5" ry={6 * (1 - bl)} fill="#111" /></>}
        <g stroke="#4a2a14" strokeWidth="4" strokeLinecap="round">{mood === 'focus' ? <><path d="M74 78 l18 4" /><path d="M126 78 l-18 4" /></> : mood === 'sad' ? <><path d="M74 80 l18 -4" /><path d="M126 80 l-18 -4" /></> : <><path d="M74 78 l18 -2" /><path d="M126 78 l-18 -2" /></>}</g>
        {/* mouth */}
        {shock || talk > 0.05 ? <ellipse cx="100" cy="116" rx="8" ry={shock ? 10 : 2 + talk * 6} fill="#5a1a1a" /> : mood === 'sad' ? <path d="M88 120 q12 -8 24 0" stroke="#5a1a1a" strokeWidth="4" fill="none" /> : <path d="M88 114 q12 10 24 0" stroke="#5a1a1a" strokeWidth="4" fill="none" />}
        {laptop && <><rect x="40" y="186" width="120" height="54" rx="6" fill="#1a1a20" /><rect x="46" y="190" width="108" height="46" rx="3" fill={`rgba(244,244,246,${0.25 + 0.1 * Math.sin(t * 5)})`} /></>}
        {cuffs && <g><circle cx="88" cy="214" r="12" fill="none" stroke="#c9c9d1" strokeWidth="6" /><circle cx="112" cy="214" r="12" fill="none" stroke="#c9c9d1" strokeWidth="6" /><line x1="98" y1="214" x2="102" y2="214" stroke="#c9c9d1" strokeWidth="5" /></g>}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- the Worm (WannaCry)
export type WormMood = 'mean' | 'scared' | 'off' | 'cry';
export const Worm: React.FC<{ x: number; y: number; size?: number; mood?: WormMood; seed?: number; flip?: boolean }> = ({ x, y, size = 160, mood = 'mean', seed = 1, flip = false }) => {
  const { t } = useTF();
  const wob = Math.sin(t * 6 + seed) * 0.05;
  const col = mood === 'off' ? '#3a3a44' : A.red;
  const tear = (t * 1.4 + seed * 0.3) % 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, transform: `translate(-50%,-50%) scale(${(flip ? -1 : 1) * (1 + wob)}, ${1 - wob})` }}>
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <path d="M10 70 Q8 20 60 16 Q112 20 110 70 Q112 108 60 108 Q8 108 10 70 Z" fill={col} style={{ filter: mood === 'off' ? undefined : `drop-shadow(0 0 ${size * 0.08}px ${A.red})` }} />
        {mood === 'scared' ? <><circle cx="42" cy="56" r="11" fill="#fff" /><circle cx="78" cy="56" r="11" fill="#fff" /><circle cx="42" cy="58" r="4" fill="#111" /><circle cx="78" cy="58" r="4" fill="#111" /><ellipse cx="60" cy="84" rx="8" ry="10" fill="#2a0008" /></>
          : mood === 'off' ? <><path d="M34 58 h16 M70 58 h16" stroke="#111" strokeWidth="5" strokeLinecap="round" /></>
            : <><path d="M32 50 l18 8 M88 50 l-18 8" stroke="#111" strokeWidth="5" strokeLinecap="round" /><circle cx="42" cy="62" r="6" fill="#111" /><circle cx="78" cy="62" r="6" fill="#111" /><path d="M40 84 q20 14 40 0" stroke="#111" strokeWidth="5" fill="#fff" /></>}
        {(mood === 'mean' || mood === 'cry') && <ellipse cx="40" cy={70 + tear * 30} rx="4" ry="6" fill="#bfe6ff" opacity={1 - tear} />}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- FBI agent, judge
export const Agent: React.FC<{ x: number; y: number; size?: number; flip?: boolean }> = ({ x, y, size = 420, flip = false }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: size * 0.8, height: size, transform: `translate(-50%,-100%) scaleX(${flip ? -1 : 1})` }}>
    <svg viewBox="0 0 200 250" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <ellipse cx="100" cy="248" rx="62" ry="6" fill="rgba(0,0,0,.5)" />
      <path d="M26 250 Q28 150 100 140 Q172 150 174 250 Z" fill="#15151a" />
      <path d="M86 142 L100 190 L114 142 Z" fill="#f4f4f6" /><path d="M96 150 L100 196 L104 150 Z" fill={A.red} />
      <ellipse cx="100" cy="90" rx="40" ry="46" fill="#d9a77c" />
      <path d="M60 78 Q62 40 100 40 Q140 40 140 78 Q130 58 100 58 Q72 58 60 78 Z" fill="#2a2018" />
      <rect x="66" y="82" width="68" height="18" rx="8" fill="#0b0b0e" />
      <path d="M90 120 h20" stroke="#5a1a1a" strokeWidth="4" strokeLinecap="round" />
      <rect x="128" y="176" width="34" height="22" rx="3" fill="#c9a24a" /><text x="145" y="191" transform={flip ? 'translate(290,0) scale(-1,1)' : undefined} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize="9" fill="#111">FBI</text>
    </svg>
  </div>
);
export const Judge: React.FC<{ x: number; y: number; size?: number; bang?: number }> = ({ x, y, size = 380, bang = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: size * 0.9, height: size, transform: 'translate(-50%,-100%)' }}>
    <svg viewBox="0 0 220 240" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <path d="M30 240 Q32 150 110 140 Q188 150 190 240 Z" fill="#111116" />
      <path d="M96 142 L110 168 L124 142 Z" fill="#f4f4f6" />
      <ellipse cx="110" cy="92" rx="40" ry="46" fill="#e6b48c" />
      <path d="M70 82 Q66 46 110 42 Q154 46 150 82 Q146 66 110 64 Q76 66 70 82 Z" fill="#d8d8de" />
      <ellipse cx="94" cy="94" rx="5" ry="5" fill="#111" /><ellipse cx="126" cy="94" rx="5" ry="5" fill="#111" />
      <path d="M98 120 q12 6 24 0" stroke="#5a1a1a" strokeWidth="4" fill="none" />
      <g transform={`rotate(${-40 + bang * 40} 180 170)`}><rect x="176" y="120" width="10" height="60" rx="4" fill="#7a5530" /><rect x="160" y="108" width="44" height="22" rx="6" fill="#8a6038" /></g>
    </svg>
  </div>
);

// ---------------------------------------------------------------- the ransom screen (generic, not the real UI)
export const RansomScreen: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const { t } = useTF();
  const blink = Math.sin(t * 6) > -0.2;
  return (
    <AbsoluteFill style={{ background: '#7a0010', padding: '7% 8%', color: A.white, fontFamily: fonts.body }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '2.2em', fontWeight: 900 }}><span style={{ opacity: blink ? 1 : 0.3, display: 'inline-flex' }}><Icon name="ph:lock-key-fill" size={44} color={A.white} /></span>YOUR FILES ARE LOCKED</div>
      <div style={{ marginTop: '0.8em', fontSize: '1.05em', lineHeight: 1.4, opacity: 0.9 }}>Pay <b>$300 in bitcoin</b> to get them back.<br />After 3 days the price doubles.</div>
      <div style={{ marginTop: '1em', display: 'inline-block', padding: '0.4em 0.9em', background: '#000', fontFamily: fonts.mono, fontWeight: 700, fontSize: '1.3em', letterSpacing: '0.1em' }}>{`71:${String(59 - Math.floor((t - at) % 60)).padStart(2, '0')}:${String(59 - Math.floor(((t - at) * 7) % 60)).padStart(2, '0')}`}</div>
    </AbsoluteFill>
  );
};
export const clampT = clamp;
