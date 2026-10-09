// Scene 0 · Cold open — "This is Chip." → innocent → BANNED (dramatic zoom ×3) → mugshot → title.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { Pill, Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S1 } from './ctime';
import { Chip, Leo, type ChipMood } from './chars';
import { Spotlight, Stamp } from './fx';

const Z = S1(0);
const tOn = 0.5, tChip = P(0, 'Chip'), tCPU = P(1, 'CPU'), tRyzen = P(1, 'Ryzen'), tBest = P(1, 'One of the best'), tGaming = P(1, 'gaming processors');
const tNever = P(2, 'never cheated'), tNotOnce = P(2, 'Not once');
const tYet = C0(3), tBanned = P(3, 'banned');
const tAcc = P(4, 'Not an account'), tPlayer = P(4, 'Not a player'), tItself = P(4, 'The chip itself'), tGuy = P(4, 'And the guy'), tNothing = P(4, 'absolutely nothing');
const tReal = C0(5), tRecord = P(5, 'criminal record');
const tTitle = C1(5) + 0.75;
export const s0NoCaptions: [number, number][] = [[tTitle - 0.4, Z + 0.3]];

export const s0Sfx: SfxEvent[] = [
  { t: tOn - 0.02, name: 'switchLight', vol: 0.6, note: 'spotlight on' },
  { t: tChip + 0.1, name: 'sillyPop', vol: 0.4, note: 'Chip waves' },
  { t: tCPU, name: 'boing', vol: 0.3, note: 'Chip hops' },
  { t: tRyzen - 0.05, name: 'whooshQuick', vol: 0.3 }, { t: tRyzen + 0.05, name: 'popUi', vol: 0.35, note: 'name card' },
  ...[0, 1, 2].map((k) => ({ t: tBest + 0.3 + k * 0.28, name: 'popUi' as const, vol: 0.3, note: 'spec badge' })),
  { t: tGaming, name: 'sparkle', vol: 0.4, note: 'flex' },
  { t: tNever - 0.05, name: 'paperSlide', vol: 0.35, note: 'INNOCENT sign' },
  { t: tNotOnce - 0.05, name: 'shimmer', vol: 0.45, note: 'halo' },
  { t: tYet - 0.05, name: 'switchLight', vol: 0.4, note: 'light turns red' },
  { t: tBanned - 0.04, name: 'stomp', vol: 0.6, note: 'BANNED stamp' },
  { t: tBanned + 0.02, name: 'zoomFast', vol: 0.4 }, { t: tBanned + 0.3, name: 'zoomFast', vol: 0.45 }, { t: tBanned + 0.6, name: 'zoomFast', vol: 0.5, note: 'dramatic zoom x3' },
  { t: tBanned + 0.15, name: 'fallWhistle', vol: 0.35, note: 'halo falls' }, { t: tBanned + 0.55, name: 'boingMetal', vol: 0.45, note: 'halo bonks Chip' },
  { t: tAcc - 0.03, name: 'negGuitar', vol: 0.4 }, { t: tPlayer - 0.03, name: 'negGuitar', vol: 0.4 }, { t: tItself - 0.03, name: 'stomp', vol: 0.45 },
  { t: tGuy - 0.1, name: 'whooshQuick', vol: 0.35, note: 'Leo slides in' },
  { t: tGuy + 0.9, name: 'squeak', vol: 0.35, note: 'empty wallet moth' },
  { t: tReal - 0.05, name: 'paperSlide', vol: 0.4, note: 'REAL STORY card' },
  { t: tRecord - 0.1, name: 'shutter', vol: 0.6, note: 'mugshot flash' }, { t: tRecord + 0.35, name: 'shutter', vol: 0.5 }, { t: tRecord + 0.8, name: 'jailLock', vol: 0.4 },
  { t: tTitle - 1.4, name: 'riser', vol: 0.45, dur: 1.4 }, { t: tTitle, name: 'impactEpic', vol: 0.65, note: 'TITLE' }, { t: tTitle + 0.05, name: 'horrorBell', vol: 0.4 },
];

export const S0Open: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const CX = 960, CY = 860, CH = 330; // Chip on the stage
  const face = { x: CX, y: CY - CH * 0.55 };
  const hop = springAt(f, fps, tCPU, { damping: 8, stiffness: 200 });
  const hopY = t > tCPU && t < tCPU + 0.6 ? Math.sin(clamp((t - tCPU) / 0.35) * Math.PI) * -60 : 0;
  const red = ramp(t, tYet, 0.25);
  const mood: ChipMood = t > tRecord - 0.2 ? 'sad' : t > tBanned - 0.05 ? 'shock' : t > tYet ? 'scared' : t > tCPU ? 'proud' : 'happy';
  const arms = t > tNever - 0.1 && t < tYet ? 'sign' : t > tBest && t < tNever - 0.1 ? 'up' : t < tCPU + 0.6 && t > tChip ? 'wave' : 'none';
  const z1 = tBanned + 0.02;
  const cam = [
    { t: 0, x: 960, y: 560, z: 1.0 },
    { t: tBest, x: 960, y: 540, z: 1.05, e: EASE.smooth },
    { t: tYet, x: 960, y: 560, z: 1.12, e: EASE.smooth },
    { t: z1, x: face.x, y: face.y, z: 1.45, e: EASE.out }, { t: z1 + 0.25, x: face.x, y: face.y, z: 1.45 },
    { t: z1 + 0.3, x: face.x, y: face.y, z: 1.95, e: EASE.out }, { t: z1 + 0.55, x: face.x, y: face.y, z: 1.95 },
    { t: z1 + 0.6, x: face.x, y: face.y, z: 2.7, e: EASE.out }, { t: tAcc - 0.3, x: face.x, y: face.y, z: 2.75 },
    { t: tAcc + 0.15, x: 960, y: 540, z: 1.0, e: EASE.inOut },
    { t: tReal, x: 960, y: 540, z: 1.0 }, { t: tRecord, x: 960, y: 560, z: 1.08, e: EASE.smooth },
  ];
  // halo: appears on "Not once", falls on "banned" and bonks Chip
  const haloIn = springAt(f, fps, tNotOnce, { damping: 10, stiffness: 160 });
  const fall = ramp(t, tBanned + 0.1, 0.45, EASE.in);
  const haloY = CY - CH * 1.25 + fall * 120 + (t > tBanned + 0.55 ? Math.sin((t - tBanned - 0.55) * 18) * 8 * Math.max(0, 1 - (t - tBanned - 0.55) * 2) : 0);
  const haloO = clamp(haloIn) * (1 - ramp(t, tAcc - 0.4, 0.3));
  const mug = t > tRecord - 0.3;
  const titleS = springAt(f, fps, tTitle, { damping: 12, stiffness: 110 });
  return (
    <AbsoluteFill style={{ background: '#04060c' }}>
      <Camera keys={cam}>
        <Layer depth={0.9}>
          <Spotlight on={tOn} color={red > 0.5 ? '255,60,80' : '255,240,200'} floor={CY} />
          {t > tOn && Array.from({ length: 26 }, (_, i) => { const sp = 8 + (i % 5) * 4, y = 960 - ((t * sp + i * 41) % 900), x = 960 + Math.sin(i * 7.3) * (60 + (960 - y) * 0.32) + Math.sin(t * 0.7 + i) * 12; return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: '50%', background: red > 0.5 ? '#ff9aa8' : '#fff3d0', opacity: 0.25 + 0.25 * Math.sin(t * 2 + i) }} />; })}
          {/* mugshot height chart behind Chip */}
          {mug && <div style={{ position: 'absolute', left: 560, top: 300, width: 800, height: 560, opacity: ramp(t, tRecord - 0.3, 0.2), background: 'repeating-linear-gradient(180deg, rgba(220,226,240,.10) 0 3px, transparent 3px 70px)' }}>{[7, 6, 5, 4, 3, 2].map((n, i) => <div key={n} style={{ position: 'absolute', left: -60, top: i * 70 + 6, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: 'rgba(220,226,240,.5)' }}>{n}′</div>)}</div>}
        </Layer>
        <Layer depth={1}>
          {/* pedestal */}
          <div style={{ position: 'absolute', left: CX - 220, top: CY, width: 440, height: 70, borderRadius: '50%', background: 'linear-gradient(180deg,#2a3150,#121729)', boxShadow: '0 20px 60px rgba(0,0,0,.6)' }} />
          <Chip x={CX} y={CY + hopY} size={CH} mood={mood} arms={arms as never} seed={1} squash={t > tCPU + 0.3 && t < tCPU + 0.5 ? 0.6 * (1 - hop) : 0} red={t > tBanned ? 0.25 : 0} look={t > tYet && t < tBanned ? Math.sin(t * 6) * 0.8 : 0} sweat={t > tYet && t < tAcc ? 1 : 0} tears={t > tRecord ? 1 : 0} />
          {/* INNOCENT placard held up */}
          {arms === 'sign' && <div style={{ position: 'absolute', left: CX, top: CY - CH * 1.12, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tNever - 0.08, { damping: 10, stiffness: 200 })}) rotate(-3deg)`, padding: '12px 30px', background: '#fffbe6', border: '5px solid #3a4152', borderRadius: 10, fontFamily: fonts.head, fontWeight: 900, fontSize: 52, color: '#1d7a4c', whiteSpace: 'nowrap' }}>100% INNOCENT</div>}
          {/* halo */}
          {t > tNotOnce - 0.05 && haloO > 0 && <div style={{ position: 'absolute', left: CX - 90, top: haloY, width: 180, height: 46, borderRadius: '50%', border: '10px solid #ffd84a', boxShadow: '0 0 30px #ffd84a, inset 0 0 14px #ffd84a', opacity: haloO, transform: `scale(${0.6 + 0.4 * clamp(haloIn)}) rotate(${fall * 18}deg)` }} />}
          {/* mugshot placard */}
          {mug && <div style={{ position: 'absolute', left: CX, top: CY - 20, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tRecord - 0.25, { damping: 12, stiffness: 200 })})`, padding: '10px 26px', background: '#0b0d14', border: '4px solid #e8ecf4', fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: '#e8ecf4', textAlign: 'center', lineHeight: 1.2 }}>5800X3D<br /><span style={{ fontSize: 26, color: C.red }}>BANNED · 08/12</span></div>}
        </Layer>
      </Camera>
      {/* Ryzen name card + spec badges */}
      {t > tRyzen - 0.05 && t < tNever && <div style={{ position: 'absolute', left: 960, top: 150, transform: `translateX(-50%) scale(${springAt(f, fps, tRyzen, { damping: 12, stiffness: 180 })})`, opacity: 1 - ramp(t, tNever - 0.3, 0.25), fontFamily: fonts.head, fontWeight: 900, fontSize: 84, color: C.ink, letterSpacing: '-0.01em', whiteSpace: 'nowrap', textShadow: '0 8px 30px rgba(0,0,0,.7)' }}>RYZEN 7 <span style={{ color: C.amber }}>5800X3D</span></div>}
      {[['8 CORES', 'ph:cpu-bold', 380, 420], ['3D V-CACHE', 'ph:stack-bold', 1540, 420], ['GAMING BEAST', 'ph:game-controller-bold', 1500, 640]].map(([l, ic, x, y], k) => (
        <Pill key={l as string} x={x as number} y={y as number} at={tBest + 0.3 + k * 0.28} out={tNever - 0.2} color={k === 2 ? C.red : C.cyan} center size={30}><Icon name={ic as string} size={32} color={C.ink} /> {l as string}</Pill>
      ))}
      {/* sparkles while flexing */}
      {t > tGaming && t < tNever && Array.from({ length: 8 }, (_, i) => { const a = i * 0.785 + t * 1.5, r = 260 + Math.sin(t * 4 + i) * 20; return <div key={i} style={{ position: 'absolute', left: CX + Math.cos(a) * r, top: 600 + Math.sin(a) * r * 0.6, fontSize: 40, color: '#ffe08a', opacity: 0.5 + 0.5 * Math.sin(t * 8 + i), transform: 'translate(-50%,-50%)' }}>✦</div>; })}
      <Stamp x={960} y={560} at={tBanned - 0.02} out={tAcc - 0.3} text="BANNED" size={170} rot={-12} />
      {/* not an account / not a player / the chip itself */}
      {t > tAcc - 0.1 && t < tReal && [['ACCOUNT', tAcc, false], ['PLAYER', tPlayer, false], ['THE CHIP', tItself, true]].map(([l, at, yes], k) => {
        const s = springAt(f, fps, (at as number) - 0.04, { damping: 12, stiffness: 200 });
        return <div key={l as string} style={{ position: 'absolute', left: 420 + k * 540, top: 150, transform: `translateX(-50%) scale(${s})`, opacity: clamp(s * 1.5) * (1 - ramp(t, tReal - 0.3, 0.25)), padding: '18px 34px', borderRadius: 22, background: yes ? `${C.red}26` : 'rgba(12,18,34,.9)', border: `3px solid ${yes ? C.red : 'rgba(140,170,230,.3)'}`, display: 'flex', alignItems: 'center', gap: 18, fontFamily: fonts.head, fontWeight: 900, fontSize: 48, color: yes ? C.red : C.dim, whiteSpace: 'nowrap', textDecoration: yes ? 'none' : 'line-through' }}><Icon name={yes ? 'ph:target-bold' : 'ph:x-bold'} size={46} color={yes ? C.red : C.dim} />{l as string}</div>;
      })}
      {/* Leo with the empty wallet */}
      {t > tGuy - 0.15 && t < tReal + 0.2 && (() => {
        const s = ramp(t, tGuy - 0.15, 0.45, EASE.back), o = 1 - ramp(t, tReal - 0.1, 0.3);
        const moth = ramp(t, tGuy + 0.9, 1.6, EASE.out);
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${(1 - s) * 700}px)`, opacity: o }}>
            <Leo x={1560} y={1010} size={420} mood={t > tNothing ? 'cry' : 'sad'} />
            <div style={{ position: 'absolute', left: 1330, top: 740, transform: 'rotate(-12deg)' }}><Icon name="ph:wallet-bold" size={110} color="#c9a46a" /></div>
            {moth > 0 && moth < 1 && <div style={{ position: 'absolute', left: 1360 + moth * 120 + Math.sin(moth * 30) * 20, top: 720 - moth * 260, opacity: 1 - moth }}><Icon name="ph:butterfly-bold" size={54} color="#b8b3a6" /></div>}
            <Pill x={1560} y={250} at={tNothing - 0.05} color={C.green} center size={30}><Icon name="ph:check-bold" size={30} color={C.ink} /> DID NOTHING WRONG</Pill>
          </div>
        );
      })()}
      {/* real story card */}
      <Pill x={960} y={140} at={tReal - 0.05} out={tTitle - 0.4} color={C.amber} center size={32}><Icon name="ph:newspaper-bold" size={34} color={C.ink} /> REAL STORY · OCTOBER 2026</Pill>
      {t > tRecord - 0.12 && t < tRecord + 0.8 && <><Flash at={tRecord - 0.1} max={0.85} d={0.3} /><Flash at={tRecord + 0.35} max={0.6} d={0.3} /></>}
      {/* title sting */}
      {t > tTitle - 0.1 && (
        <AbsoluteFill style={{ background: `rgba(3,4,8,${0.82 * clamp(titleS)})` }}>
          <div style={{ position: 'absolute', left: 960, top: 470, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * titleS}) translateX(${Math.sin(t * 40) * 2 * (1 - ramp(t, tTitle, 0.6))}px)`, textAlign: 'center', opacity: clamp(titleS * 1.4) }}>
            <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 34, letterSpacing: '0.5em', color: C.dim }}>A TRUE STORY ABOUT</div>
            <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 150, lineHeight: 1.05, color: C.ink, letterSpacing: '-0.02em', whiteSpace: 'nowrap', marginTop: 10, textShadow: `0 0 40px rgba(140,255,200,.35), 0 0 120px rgba(140,255,200,.25)` }}>THE <span style={{ color: '#9dffcf', textShadow: '0 0 30px #3cf0a0, 0 0 90px #3cf0a0' }}>CURSED</span> CPU</div>
          </div>
          <Chip x={960} y={980} size={170} mood="scared" sweat={1} seed={4} tilt={Math.sin(t * 50) * 2} />
          {Array.from({ length: 6 }, (_, i) => { const u = ((t - tTitle) * 0.3 + i / 6) % 1; return <div key={i} style={{ position: 'absolute', left: 300 + i * 260 + Math.sin(t + i) * 40, top: 900 - u * 700, width: 200, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(157,255,207,.12), transparent 70%)', opacity: Math.sin(u * Math.PI) }} />; })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
