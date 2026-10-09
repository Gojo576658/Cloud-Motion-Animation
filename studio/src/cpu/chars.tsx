// Characters for "The Cursed CPU": Chip (the used Ryzen), Leo (the buyer), Vanguard (the
// anti-cheat bouncer) and the shady previous owner. Flat-vector SVG rigs with expressions,
// auto-blink, idle breathing and squash/stretch hooks. Coordinates: (x, y) = feet centre.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, fonts } from '../lib/theme';

const useT = () => useCurrentFrame() / useVideoConfig().fps;
// deterministic blink: closed for ~0.12 s every few seconds (offset per character)
const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.37) % 3.4; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

export type ChipMood = 'neutral' | 'happy' | 'proud' | 'shock' | 'sad' | 'scared' | 'sus' | 'wink' | 'grumpy' | 'sleepy';

// ---------------------------------------------------------------- Chip (the CPU)
export const Chip: React.FC<{
  x: number; y: number; size?: number; mood?: ChipMood; look?: number; lookY?: number;
  squash?: number; tilt?: number; walk?: number; tears?: number; sweat?: number; blush?: number;
  grey?: boolean; red?: number; xray?: number; label?: string; seed?: number; arms?: 'none' | 'wave' | 'point' | 'sign' | 'shrug' | 'up';
  armPhase?: number;
}> = ({ x, y, size = 260, mood = 'neutral', look = 0, lookY = 0, squash = 0, tilt = 0, walk, tears = 0, sweat = 0, blush, grey = false, red = 0, xray = 0, label = '5800X3D', seed = 0, arms = 'none', armPhase = 0 }) => {
  const t = useT();
  const k = size / 200;
  const breathe = Math.sin(t * 2.2 + seed) * 0.015;
  const sy = 1 - squash * 0.18 + breathe, sx = 1 + squash * 0.14 - breathe * 0.5;
  const bl = mood === 'wink' ? 0 : blinkAt(t, seed);
  const lidTop = grey ? '#b9bec7' : '#eef2f7', lidBot = grey ? '#7c828e' : '#9aa7ba';
  const pcb = grey ? '#3d4a3f' : '#1f7a4c';
  const pupil = (ex: number) => ({ cx: ex + look * 7, cy: 96 + lookY * 6 });
  const eyeRy = mood === 'shock' ? 24 : mood === 'sleepy' ? 6 : mood === 'sus' || mood === 'grumpy' ? 12 : 20;
  const brow = {
    neutral: [[60, 66, 92, 66], [108, 66, 140, 66]], happy: [[60, 64, 92, 60], [108, 60, 140, 64]], proud: [[60, 62, 92, 58], [108, 58, 140, 62]],
    shock: [[58, 54, 92, 50], [108, 50, 142, 54]], sad: [[60, 62, 92, 70], [108, 70, 140, 62]], scared: [[60, 60, 92, 66], [108, 66, 140, 60]],
    sus: [[60, 74, 92, 78], [108, 70, 140, 64]], wink: [[60, 64, 92, 60], [108, 66, 140, 66]], grumpy: [[60, 68, 92, 78], [108, 78, 140, 68]], sleepy: [[60, 76, 92, 76], [108, 76, 140, 76]],
  }[mood];
  const mouth: Record<ChipMood, React.ReactNode> = {
    neutral: <path d="M86 132 Q100 138 114 132" stroke="#3a4152" strokeWidth="4" fill="none" strokeLinecap="round" />,
    happy: <path d="M80 128 Q100 150 120 128 Z" fill="#3a2230" stroke="#3a2230" strokeWidth="3" strokeLinejoin="round" />,
    proud: <path d="M76 126 Q100 156 124 126 Z" fill="#3a2230" />,
    shock: <ellipse cx="100" cy="138" rx="11" ry="15" fill="#3a2230" />,
    sad: <path d="M84 140 Q100 128 116 140" stroke="#3a4152" strokeWidth="4" fill="none" strokeLinecap="round" />,
    scared: <path d="M80 136 Q86 130 92 136 Q98 142 104 136 Q110 130 116 136" stroke="#3a4152" strokeWidth="4" fill="none" strokeLinecap="round" />,
    sus: <path d="M88 136 L116 132" stroke="#3a4152" strokeWidth="4" strokeLinecap="round" />,
    wink: <path d="M82 128 Q100 146 118 128" stroke="#3a2230" strokeWidth="5" fill="none" strokeLinecap="round" />,
    grumpy: <path d="M84 140 Q100 132 116 140" stroke="#3a4152" strokeWidth="4" fill="none" strokeLinecap="round" />,
    sleepy: <ellipse cx="100" cy="136" rx="6" ry="4" fill="#3a2230" />,
  };
  const legs = Array.from({ length: 8 }, (_, i) => {
    const lx = 40 + i * 17.2;
    const lift = walk != null ? Math.max(0, Math.sin(walk * Math.PI * 2 + (i % 2) * Math.PI)) * 10 : 0;
    return <line key={i} x1={lx} y1={174} x2={lx + (walk != null ? Math.sin(walk * Math.PI * 2 + i) * 2 : 0)} y2={200 - lift} stroke="#d9b44a" strokeWidth="4" strokeLinecap="round" />;
  });
  const armCol = grey ? '#8a909b' : '#dfe6f2';
  const arm = (d: string, hx: number, hy: number) => <g><path d={d} stroke="#3a4152" strokeWidth="12" fill="none" strokeLinecap="round" /><path d={d} stroke={armCol} strokeWidth="8" fill="none" strokeLinecap="round" /><circle cx={hx} cy={hy} r="9" fill={armCol} stroke="#3a4152" strokeWidth="2.5" /></g>;
  const armL = (r: number) => arm(`M18 110 Q-8 ${110 - r * 30} -14 ${118 - r * 70}`, -14, 118 - r * 70);
  const wave = Math.sin(t * 10 + armPhase) * 0.5 + 0.5;
  return (
    <svg style={{ position: 'absolute', left: x - size / 2, top: y - size * 1.05, overflow: 'visible' }} width={size} height={size * 1.05} viewBox="0 0 200 210">
      <defs>
        <linearGradient id={`lid${seed}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={lidTop} /><stop offset="1" stopColor={lidBot} /></linearGradient>
        <radialGradient id={`vault${seed}`}><stop offset="0" stopColor={C.amber} stopOpacity=".95" /><stop offset="1" stopColor={C.amber} stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="100" cy="204" rx={70 * (1 + squash * 0.2)} ry="7" fill="rgba(0,0,0,.45)" />
      <g transform={`translate(100 200) rotate(${tilt}) scale(${sx} ${sy}) translate(-100 -200)`}>
        {legs}
        {/* arms */}
        {arms === 'wave' && <g>{armL(0.2)}{arm(`M182 110 Q206 ${100 - wave * 30} ${214 + wave * 6} ${70 - wave * 30}`, 214 + wave * 6, 70 - wave * 30)}</g>}
        {arms === 'point' && <g>{armL(0.2)}{arm('M182 112 Q204 104 226 96', 226, 96)}</g>}
        {arms === 'up' && <g>{arm('M18 110 Q0 80 6 50', 6, 50)}{arm('M182 110 Q200 80 194 50', 194, 50)}</g>}
        {arms === 'shrug' && <g>{arm('M18 112 Q-4 104 -8 84', -8, 84)}{arm('M182 112 Q204 104 208 84', 208, 84)}</g>}
        {arms === 'sign' && <g>{arm('M18 116 Q4 100 24 88', 24, 88)}{arm('M182 116 Q196 100 176 88', 176, 88)}</g>}
        {/* substrate + lid */}
        <rect x="10" y="28" width="180" height="150" rx="18" fill={pcb} />
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={22 + i * 17.3} cy={170} r="2.4" fill="#d9b44a" opacity=".85" />)}
        <rect x="28" y="40" width="144" height="126" rx="16" fill={`url(#lid${seed})`} stroke={grey ? '#5d636e' : '#7d8aa0'} strokeWidth="2" />
        <path d="M34 48 L96 48 L60 120 L34 120 Z" fill="#fff" opacity=".18" />
        <text x="100" y="161" textAnchor="middle" style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 10, letterSpacing: 1 }} fill={grey ? '#5d636e' : '#6f7c92'}>{label}</text>
        {/* x-ray: the fTPM vault inside */}
        {xray > 0 && (
          <g opacity={xray}>
            <rect x="28" y="40" width="144" height="126" rx="16" fill="rgba(10,20,40,.78)" />
            {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M40 ${56 + i * 18} H${160}`} stroke="rgba(51,225,255,.25)" strokeWidth="1.5" />)}
            <circle cx="100" cy="103" r="40" fill={`url(#vault${seed})`} opacity={0.5 + 0.3 * Math.sin(t * 4)} />
            <rect x="80" y="84" width="40" height="38" rx="6" fill="#2a2f3d" stroke={C.amber} strokeWidth="3" />
            <circle cx="100" cy="103" r="9" fill="none" stroke={C.amber} strokeWidth="3" />
            <path d="M100 94 V112 M91 103 H109" stroke={C.amber} strokeWidth="2" />
          </g>
        )}
        {/* face */}
        {xray < 0.6 && (
          <g opacity={1 - xray}>
            {(blush ?? (mood === 'happy' || mood === 'proud' || mood === 'wink' ? 1 : 0)) > 0 && <><ellipse cx="58" cy="120" rx="11" ry="6" fill="#ff7a9a" opacity=".45" /><ellipse cx="142" cy="120" rx="11" ry="6" fill="#ff7a9a" opacity=".45" /></>}
            {[75, 125].map((ex, i) => (
              <g key={ex}>
                <ellipse cx={ex} cy={96} rx="17" ry={eyeRy * (1 - (mood === 'wink' && i === 1 ? 0.92 : bl * 0.92))} fill="#fff" stroke="#3a4152" strokeWidth="2.5" />
                {!(mood === 'wink' && i === 1) && bl < 0.6 && mood !== 'sleepy' && <><circle {...pupil(ex)} r={mood === 'shock' ? 6 : 8} fill="#1b1f2a" /><circle cx={pupil(ex).cx + 3} cy={pupil(ex).cy - 3} r="2.6" fill="#fff" /></>}
              </g>
            ))}
            {mood === 'wink' && <path d="M110 98 Q125 90 140 98" stroke="#3a4152" strokeWidth="4" fill="none" strokeLinecap="round" />}
            {brow.map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} stroke="#3a4152" strokeWidth="5" strokeLinecap="round" />)}
            {mouth[mood]}
            {tears > 0 && [70, 130].map((tx, i) => { const u = ((t * 1.1 + i * 0.5) % 1); return <path key={i} d={`M${tx} ${112 + u * 40} q -5 9 0 13 q 5 -4 0 -13`} fill="#5ab8ff" opacity={tears * (1 - u)} />; })}
            {sweat > 0 && <path d={`M160 ${58 + ((t * 0.8) % 1) * 20} q -7 12 0 17 q 7 -5 0 -17`} fill="#8fd3ff" opacity={sweat} />}
          </g>
        )}
        {red > 0 && <rect x="10" y="28" width="180" height="150" rx="18" fill={C.red} opacity={red * 0.35} />}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- Leo (the buyer)
export type LeoMood = 'neutral' | 'excited' | 'heart' | 'shock' | 'sad' | 'cry' | 'sideeye' | 'determined' | 'angry';
export const Leo: React.FC<{ x: number; y: number; size?: number; mood?: LeoMood; look?: number; squash?: number; tilt?: number; seed?: number; typing?: boolean }> = ({ x, y, size = 360, mood = 'neutral', look = 0, squash = 0, tilt = 0, seed = 3, typing = false }) => {
  const t = useT();
  const bl = blinkAt(t, seed);
  const breathe = Math.sin(t * 2 + seed) * 0.012;
  const sy = 1 - squash * 0.15 + breathe, sx = 1 + squash * 0.1;
  const ey = mood === 'shock' ? 15 : mood === 'sideeye' ? 7 : 12;
  const px = (ex: number) => ex + (mood === 'sideeye' ? 7 : look * 6);
  const mouth: Record<LeoMood, React.ReactNode> = {
    neutral: <path d="M90 150 Q100 156 110 150" stroke="#5a2a20" strokeWidth="4" fill="none" strokeLinecap="round" />,
    excited: <path d="M84 146 Q100 166 116 146 Z" fill="#5a2a20" />,
    heart: <path d="M84 146 Q100 166 116 146 Z" fill="#5a2a20" />,
    shock: <ellipse cx="100" cy="158" rx="10" ry={14 + Math.sin(t * 20) * 1} fill="#5a2a20" />,
    sad: <path d="M88 158 Q100 148 112 158" stroke="#5a2a20" strokeWidth="4" fill="none" strokeLinecap="round" />,
    cry: <path d="M86 160 Q100 146 114 160" stroke="#5a2a20" strokeWidth="5" fill="none" strokeLinecap="round" />,
    sideeye: <path d="M90 154 L112 151" stroke="#5a2a20" strokeWidth="4" strokeLinecap="round" />,
    determined: <path d="M88 152 L112 152" stroke="#5a2a20" strokeWidth="5" strokeLinecap="round" />,
    angry: <path d="M88 158 Q100 150 112 158" stroke="#5a2a20" strokeWidth="5" fill="none" strokeLinecap="round" />,
  };
  const brows: Record<LeoMood, string> = {
    neutral: 'M68 96 L90 94 M110 94 L132 96', excited: 'M68 90 L90 86 M110 86 L132 90', heart: 'M68 90 L90 86 M110 86 L132 90', shock: 'M68 82 L90 78 M110 78 L132 82',
    sad: 'M68 92 L90 98 M110 98 L132 92', cry: 'M68 90 L90 100 M110 100 L132 90', sideeye: 'M68 98 L90 100 M110 94 L132 90', determined: 'M68 94 L90 100 M110 100 L132 94', angry: 'M68 92 L90 102 M110 102 L132 92',
  };
  const heart = (cx: number) => <path d={`M${cx} ${128 + 6} l -12 -12 a 7 7 0 0 1 12 -9 a 7 7 0 0 1 12 9 z`} fill={C.red} transform={`translate(0 ${-6}) scale(1)`} />;
  return (
    <svg style={{ position: 'absolute', left: x - size / 2, top: y - size * 1.1, overflow: 'visible' }} width={size} height={size * 1.1} viewBox="0 0 200 220">
      <g transform={`translate(100 220) rotate(${tilt}) scale(${sx} ${sy}) translate(-100 -220)`}>
        {/* hoodie body */}
        <path d="M30 220 Q30 176 64 168 L136 168 Q170 176 170 220 Z" fill="#1d2a52" />
        <path d="M84 168 Q100 186 116 168" stroke="#2f4280" strokeWidth="6" fill="none" />
        <path d="M92 178 V206 M108 178 V206" stroke="#c7d2f0" strokeWidth="3" strokeLinecap="round" />
        {/* arms typing */}
        {typing && [0, 1].map((i) => <ellipse key={i} cx={66 + i * 68} cy={212 + Math.sin(t * 24 + i * 2) * 3} rx="16" ry="9" fill="#e8b896" />)}
        {/* neck + head */}
        <rect x="88" y="150" width="24" height="24" fill="#d9a47e" />
        <ellipse cx="100" cy="120" rx="46" ry="52" fill="#e8b896" />
        <ellipse cx="54" cy="124" rx="7" ry="10" fill="#e0aa86" /><ellipse cx="146" cy="124" rx="7" ry="10" fill="#e0aa86" />
        {/* hair */}
        <path d="M54 112 Q50 66 96 64 Q140 60 148 104 Q138 86 120 84 Q128 76 112 74 Q104 84 88 80 Q90 72 76 78 Q64 86 54 112 Z" fill="#2b1d16" />
        {/* headset */}
        <path d="M50 120 Q50 56 100 54 Q150 56 150 120" stroke="#11151f" strokeWidth="9" fill="none" />
        <rect x="38" y="106" width="20" height="36" rx="8" fill="#11151f" /><rect x="142" y="106" width="20" height="36" rx="8" fill="#11151f" />
        <rect x="42" y="118" width="4" height="12" rx="2" fill={C.cyan} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
        <path d="M44 140 Q50 166 82 160" stroke="#11151f" strokeWidth="4" fill="none" /><circle cx="84" cy="160" r="5" fill="#11151f" />
        {/* eyes */}
        {mood === 'heart' ? <>{heart(82)}{heart(118)}</> : [82, 118].map((ex) => (
          <g key={ex}>
            <ellipse cx={ex} cy="114" rx="11" ry={ey * (1 - bl * 0.9)} fill="#fff" />
            {bl < 0.6 && <><circle cx={px(ex)} cy="115" r={mood === 'shock' ? 4 : 6} fill="#1b1f2a" /><circle cx={px(ex) + 2} cy="112" r="2" fill="#fff" /></>}
          </g>
        ))}
        <path d={brows[mood]} stroke="#2b1d16" strokeWidth="5" strokeLinecap="round" fill="none" />
        {mouth[mood]}
        {(mood === 'cry' || mood === 'sad') && [76, 124].map((tx, i) => { const u = (t * 1.2 + i * 0.4) % 1; return <path key={i} d={`M${tx} ${124 + u * 34} q -5 9 0 13 q 5 -4 0 -13`} fill="#5ab8ff" opacity={(mood === 'cry' ? 1 : 0.6) * (1 - u)} />; })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- Vanguard (anti-cheat bouncer)
export const Bouncer: React.FC<{ x: number; y: number; size?: number; glasses?: number; shake?: number; lean?: number; clipboard?: boolean; thumbs?: boolean; light?: number; seed?: number }> = ({ x, y, size = 460, glasses = 1, shake = 0, lean = 0, clipboard = false, thumbs = false, light = 0, seed = 5 }) => {
  const t = useT();
  const breathe = Math.sin(t * 1.4 + seed) * 0.01;
  const headX = shake * 10;
  const eyeGlow = 1 - glasses;
  return (
    <svg style={{ position: 'absolute', left: x - size / 2, top: y - size * 1.25, overflow: 'visible' }} width={size} height={size * 1.25} viewBox="0 0 200 250">
      <g transform={`translate(100 250) rotate(${lean}) scale(${1 + breathe * 0.5} ${1 + breathe}) translate(-100 -250)`}>
        {/* body */}
        <path d="M14 250 L22 132 Q26 110 56 104 L144 104 Q174 110 178 132 L186 250 Z" fill="#0b0d14" />
        <path d="M84 104 L100 150 L116 104 Z" fill="#e8ecf4" />
        <path d="M96 112 L104 112 L108 150 L100 160 L92 150 Z" fill={C.red} />
        <path d="M84 104 L100 150 L74 118 Z M116 104 L100 150 L126 118 Z" fill="#161a26" />
        {/* badge */}
        <path d="M140 128 l16 0 l0 12 q0 10 -8 14 q-8 -4 -8 -14 z" fill={C.red} stroke="#ffb3c0" strokeWidth="1.5" />
        <text x="148" y="143" textAnchor="middle" style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 11 }} fill="#fff">V</text>
        {/* crossed arms or clipboard / thumbs up */}
        {!clipboard && !thumbs && <><rect x="34" y="160" width="132" height="34" rx="17" fill="#141824" /><rect x="40" y="176" width="120" height="30" rx="15" fill="#1b2030" /><ellipse cx="44" cy="190" rx="13" ry="12" fill="#a8744f" /><ellipse cx="156" cy="176" rx="13" ry="12" fill="#a8744f" /></>}
        {clipboard && <g><rect x="48" y="140" width="76" height="96" rx="6" fill="#d9d2bf" stroke="#8a7f66" strokeWidth="2" /><rect x="72" y="134" width="28" height="12" rx="3" fill="#6b7280" />
          <text x="86" y="160" textAnchor="middle" style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 8 }} fill={C.red}>BANNED LIST</text>
          {[0, 1, 2, 3].map((i) => <rect key={i} x="56" y={168 + i * 15} width={52 - (i % 2) * 14} height="6" rx="2" fill="#8a7f66" />)}
          <ellipse cx="128" cy="196" rx="13" ry="12" fill="#a8744f" /></g>}
        {thumbs && <g><rect x="130" y="120" width="26" height="44" rx="12" fill="#a8744f" /><rect x="136" y="100" width="12" height="28" rx="6" fill="#a8744f" /></g>}
        {/* head */}
        <g transform={`translate(${headX} 0)`}>
          <rect x="72" y="86" width="56" height="26" fill="#a8744f" />
          <path d="M60 50 Q60 14 100 14 Q140 14 140 50 L138 82 Q134 104 100 106 Q66 104 62 82 Z" fill="#b98258" />
          <ellipse cx="88" cy="24" rx="16" ry="6" fill="#fff" opacity=".18" />
          {/* eyes (behind the glasses) */}
          {eyeGlow > 0 && [84, 116].map((ex) => <ellipse key={ex} cx={ex} cy="58" rx="7" ry="5" fill={C.red} opacity={eyeGlow} style={{ filter: `drop-shadow(0 0 6px ${C.red})` }} />)}
          {/* sunglasses slide down */}
          <g transform={`translate(0 ${(1 - glasses) * 16})`}>
            <rect x="66" y="48" width="30" height="18" rx="6" fill="#05060a" /><rect x="104" y="48" width="30" height="18" rx="6" fill="#05060a" />
            <path d="M96 54 H104" stroke="#05060a" strokeWidth="4" />
            <path d="M70 52 L80 52" stroke="#fff" strokeWidth="2" opacity=".5" /><path d="M108 52 L118 52" stroke="#fff" strokeWidth="2" opacity=".5" />
          </g>
          <path d="M84 88 Q100 82 116 88" stroke="#5a3520" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* earpiece coil */}
          <path d="M138 62 q 8 4 4 12 q -4 8 4 14 q 6 6 0 16" stroke="#9aa3b5" strokeWidth="2" fill="none" />
        </g>
        {/* flashlight */}
        {light > 0 && <g><rect x="150" y="150" width="34" height="14" rx="4" fill="#2a2f3d" /><path d="M184 150 L320 110 L320 210 L184 164 Z" fill="#fff6c8" opacity={0.25 * light} /></g>}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- the shady previous owner
export const Shady: React.FC<{ x: number; y: number; size?: number; whistle?: boolean; cash?: number; seed?: number }> = ({ x, y, size = 340, whistle = false, cash = 0, seed = 9 }) => {
  const t = useT();
  const bob = Math.sin(t * 2.6 + seed) * 3;
  return (
    <svg style={{ position: 'absolute', left: x - size / 2, top: y - size * 1.15, overflow: 'visible' }} width={size} height={size * 1.15} viewBox="0 0 200 230">
      <g transform={`translate(0 ${bob})`}>
        <path d="M24 230 Q26 150 70 132 L130 132 Q174 150 176 230 Z" fill="#0d111c" />
        <path d="M46 140 Q40 40 100 34 Q160 40 154 140 Q130 116 100 116 Q70 116 46 140 Z" fill="#131826" stroke="#2a3350" strokeWidth="2" />
        <ellipse cx="100" cy="98" rx="38" ry="40" fill="#05070c" />
        {[84, 116].map((ex) => (
          <g key={ex} style={{ filter: `drop-shadow(0 0 6px ${C.red})` }}>
            <circle cx={ex} cy="94" r="7" fill="none" stroke={C.red} strokeWidth="2.5" />
            <path d={`M${ex - 10} 94 H${ex + 10} M${ex} 84 V104`} stroke={C.red} strokeWidth="1.8" />
          </g>
        ))}
        {whistle && <><ellipse cx="100" cy="116" rx="4" ry="4" fill="#2a3350" />{[0, 1, 2].map((i) => { const u = ((t * 0.8 + i / 3) % 1); return <text key={i} x={120 + u * 50} y={110 - u * 60} style={{ fontFamily: fonts.head, fontSize: 20, fontWeight: 900 }} fill={C.amber} opacity={1 - u}>♪</text>; })}</>}
        {cash > 0 && <g transform={`translate(132 ${170 - cash * 6})`}>{[0, 1, 2].map((i) => <rect key={i} x={i * 4} y={-i * 5} width="40" height="20" rx="3" fill="#3cbf6e" stroke="#1f7a4c" strokeWidth="2" />)}<text x="22" y="14" textAnchor="middle" style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 12 }} fill="#0d3b22">$</text></g>}
      </g>
    </svg>
  );
};
