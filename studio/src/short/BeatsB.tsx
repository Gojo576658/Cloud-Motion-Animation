// Short beats 6–10: LG's statement, OPTIONAL ≠ OFF, 2017 CIA dossier, five settings
// (the last one hidden), and the CTA card that morphs into the TV screen and loops to frame 0.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera } from '../components/Camera';
import { BgMesh } from '../components/Look';
import { Grid, Glow } from '../components/Backdrop';
import { Pill, Rings, Flash, Toggle } from '../components/UI';
import { TV } from '../components/TV';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import { C0, P, PE, STL } from './stime';
import { VRoom, VTV } from './VRoom';
import type { SfxEvent } from '../lib/sfx';

export const B6 = C0(6) - 0.15, B7 = C0(7) - 0.1, B8 = C0(8) - 0.12, B9 = C0(9) - 0.1, B10 = C0(10) - 0.12, END = STL.duration;
const useTF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };

// ---------------- 6 · "LG says these features are optional."
const tLG = P(6, 'LG says'), tThese = P(6, 'these'), tFeat = P(6, 'features'), tAre = P(6, 'are'), tOpt = P(6, 'optional');
export const sfx6: SfxEvent[] = [
  { t: B6 + 0.02, name: 'swoosh', vol: 0.4, note: 'statement card' }, { t: B6 + 0.06, name: 'popUi', vol: 0.3, note: 'LG RESPONDS' },
  { t: tLG + 0.05, name: 'paperSlide', vol: 0.3 },
  ...[0, 1, 2].map((k) => ({ t: tFeat + 0.05 + k * 0.12, name: 'tap' as const, vol: 0.28 })),
  { t: tOpt - 0.02, name: 'marker', vol: 0.45, note: 'highlighter on OPTIONAL' },
];
export const Beat6: React.FC = () => {
  const { f, fps, t } = useTF();
  const card = springAt(f, fps, B6 + 0.02, { damping: 16, stiffness: 140 });
  const words: [string, number][] = [['These', tThese], ['features', tFeat], ['are', tAre]];
  const hl = ramp(t, tOpt + 0.05, 0.35, EASE.inOut);
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.amber} />
      <Grid opacity={0.12} perspective={false} />
      <Pill x={540} y={300} at={B6 + 0.08} color={C.cyan} center size={34}><Icon name="ph:megaphone-bold" size={32} color={C.ink} /> LG RESPONDS</Pill>
      <div style={{ position: 'absolute', left: 90, top: 520, width: 900, height: 640, borderRadius: 34, background: 'linear-gradient(160deg, rgba(14,26,48,.96), rgba(6,10,20,.97))', border: `1px solid ${C.cyan}44`, boxShadow: '0 60px 140px rgba(0,0,0,.65)', transform: `translateY(${(1 - card) * 140}px) scale(${0.9 + 0.1 * card})`, opacity: clamp(card * 1.5), overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 40, top: -60, fontFamily: 'Georgia, serif', fontSize: 380, color: 'rgba(51,225,255,.08)', lineHeight: 1 }}>“</div>
        <div style={{ position: 'absolute', left: 52, top: 48, display: 'flex', alignItems: 'center', gap: 16, fontFamily: fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: '0.22em', color: C.cyan }}><Icon name="ph:megaphone-bold" size={40} color={C.cyan} />LG'S STATEMENT</div>
        <div style={{ position: 'absolute', left: 52, top: 150, right: 52, fontFamily: fonts.head, fontWeight: 800, fontSize: 76, lineHeight: 1.12, color: C.ink }}>
          {words.map(([w, at]) => <span key={w} style={{ display: 'inline-block', marginRight: 22, opacity: ramp(t, at - 0.04, 0.15), transform: `translateY(${(1 - ramp(t, at - 0.04, 0.25, EASE.out)) * 24}px)` }}>{w}</span>)}
          <div style={{ position: 'relative', display: 'inline-block', marginTop: 10, opacity: ramp(t, tOpt - 0.04, 0.15) }}>
            <div style={{ position: 'absolute', left: -12, right: -12, top: '18%', bottom: '8%', background: C.amber, opacity: 0.9, transformOrigin: '0 50%', transform: `scaleX(${hl}) skewX(-8deg)`, borderRadius: 8 }} />
            <span style={{ position: 'relative', fontSize: 118, fontWeight: 900, color: hl > 0.5 ? '#1a0f00' : C.amber }}>optional.</span>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 52, bottom: 48, display: 'flex', gap: 16 }}>
          {['ACR', 'VOICE', 'ADS'].map((c, k) => { const s = springAt(f, fps, tFeat + 0.05 + k * 0.12, { damping: 12, stiffness: 200 }); return <div key={c} style={{ padding: '10px 24px', borderRadius: 999, border: `2px solid ${C.cyan}88`, background: `${C.cyan}14`, fontFamily: fonts.head, fontWeight: 800, fontSize: 30, color: C.ink, transform: `scale(${s})`, opacity: clamp(s * 1.4) }}>{c}</div>; })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 7 · "But optional… isn't off."
const tOptional = P(7, 'optional'), tIsnt = P(7, "isn't"), tOffW = P(7, 'off');
export const sfx7: SfxEvent[] = [
  { t: tOptional - 0.08, name: 'zoomFast', vol: 0.45, note: 'OPTIONAL fills the frame' },
  { t: tIsnt - 0.04, name: 'glassHit', vol: 0.45, note: '≠' },
  { t: tOffW - 0.06, name: 'impactDeep', vol: 0.7, note: 'OFF slam' }, { t: tOffW - 0.04, name: 'bassHit', vol: 0.45 },
];
export const Beat7: React.FC = () => {
  const { f, fps, t } = useTF();
  const r = rng(Math.round(t * 30) + 3);
  const o = springAt(f, fps, tOptional - 0.08, { damping: 13, stiffness: 150 });
  const ne = ramp(t, tIsnt - 0.05, 0.18, EASE.in);
  const off = ramp(t, tOffW - 0.06, 0.18, EASE.in);
  const shake = t > tOffW ? Math.max(0, 1 - (t - tOffW) / 0.45) : 0;
  return (
    <AbsoluteFill style={{ background: '#04050a', transform: `translate(${(r() - 0.5) * 30 * shake}px, ${(r() - 0.5) * 30 * shake}px)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, rgba(255,182,72,${0.18 * clamp(o)}), transparent 60%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 62%, rgba(255,46,77,${0.35 * off}), transparent 60%)` }} />
      <div style={{ position: 'absolute', left: 540, top: 700, transform: `translate(-50%,-50%) scale(${0.45 + 0.55 * o})`, opacity: clamp(o * 1.5), fontFamily: fonts.head, fontWeight: 900, fontSize: 172, color: C.amber, letterSpacing: '-0.03em', textShadow: `0 0 60px ${C.amber}66`, whiteSpace: 'nowrap' }}>OPTIONAL</div>
      {t > tIsnt - 0.06 && <div style={{ position: 'absolute', left: 540, top: 905, transform: `translate(-50%,-50%) scale(${3 - 2 * ne})`, opacity: ne, fontFamily: fonts.head, fontWeight: 900, fontSize: 210, color: C.ink, lineHeight: 1 }}>≠</div>}
      {t > tOffW - 0.08 && <div style={{ position: 'absolute', left: 540, top: 1110, transform: `translate(-50%,-50%) scale(${3.2 - 2.2 * off})`, opacity: off, fontFamily: fonts.head, fontWeight: 900, fontSize: 270, color: C.red, letterSpacing: '-0.03em', textShadow: `0 0 80px ${C.red}aa`, whiteSpace: 'nowrap' }}>OFF</div>}
      <Flash at={tOffW - 0.02} color={C.red} max={0.3} d={0.35} />
    </AbsoluteFill>
  );
};

// ---------------- 8 · "And this isn't new. In 2017, the CIA had a tool that made a TV look off… while the mic kept recording."
const tNew = P(8, 'And this'), tIn = P(8, 'In 2017'), t2017 = P(8, '2017'), tCIA = P(8, 'CIA'), tTool = P(8, 'tool'), tMade = P(8, 'made a TV'), tLook = P(8, 'look off'), tWhile = P(8, 'while the mic'), tRec = P(8, 'recording');
const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
const yearAt = (k: number) => lerp(tNew + 0.2, t2017, EASE.in(k / (YEARS.length - 1)));
export const sfx8: SfxEvent[] = [
  { t: B8 + 0.02, name: 'rewind', vol: 0.45, note: 'tape rewind' },
  ...YEARS.slice(1).map((_, k) => ({ t: yearAt(k + 1) - 0.02, name: 'tick' as const, vol: 0.28 })),
  { t: t2017 - 0.03, name: 'typeHard', vol: 0.6, note: '2017 lands' },
  { t: tCIA - 0.18, name: 'paperSlide', vol: 0.45, note: 'dossier slides in' },
  { t: tCIA + 0.12, name: 'stomp', vol: 0.55, note: 'CLASSIFIED stamp' },
  { t: tTool - 0.02, name: 'typing', vol: 0.3, dur: 0.6 },
  { t: tMade - 0.25, name: 'whooshQuick', vol: 0.35 },
  { t: tLook - 0.05, name: 'switchLight', vol: 0.45, note: 'screen off' }, { t: tLook + 0.3, name: 'switchLight', vol: 0.4, note: 'lights off' },
  { t: tWhile - 0.05, name: 'heartbeat', vol: 0.5 }, { t: tRec - 0.1, name: 'glitchStatic', vol: 0.35, note: 'REC' },
];
export const Beat8: React.FC = () => {
  const { f, fps, t } = useTF();
  const k = YEARS.reduce((acc, _, i) => (t >= yearAt(i) ? i : acc), 0);
  const land = ramp(t, t2017 - 0.02, 0.08) - ramp(t, t2017 + 0.06, 0.3);
  const shrink = ramp(t, tCIA - 0.25, 0.45, EASE.inOut);
  const folder = springAt(f, fps, tCIA - 0.2, { damping: 16, stiffness: 130 });
  const folderOut = ramp(t, tMade - 0.3, 0.4, EASE.in);
  const tv = springAt(f, fps, tMade - 0.15, { damping: 15, stiffness: 130 });
  const stamp = ramp(t, tCIA + 0.12, 0.2, EASE.in);
  const rewinding = t < t2017;
  const r = rng(Math.round(t * 30));
  const recOn = t > tWhile;
  const row = (label: string, val: string, at: number, color: string, icon: string, y: number) => (
    <div style={{ position: 'absolute', left: 140, right: 140, top: y, display: 'flex', alignItems: 'center', gap: 20, opacity: ramp(t, at, 0.2), transform: `translateX(${(1 - ramp(t, at, 0.35, EASE.out)) * 60}px)`, fontFamily: fonts.head, fontWeight: 800, fontSize: 48, color: C.ink }}>
      <Icon name={icon} size={52} color={color} />{label}<span style={{ marginLeft: 'auto', color, fontWeight: 900 }}>{val}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <BgMesh a={C.red} b={C.blue} />
      {/* VHS rewind texture */}
      {rewinding && <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 6px)', opacity: 0.8 }} />}
      {rewinding && Array.from({ length: 3 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: ((t * 900 + i * 640) % 1920), height: 26 + i * 10, background: 'rgba(255,255,255,.07)', transform: `translateX(${(r() - 0.5) * 40}px)` }} />)}
      <Pill x={540} y={300} at={B8 + 0.02} out={t2017 + 0.25} color={C.amber} center size={34}><Icon name="ph:rewind-fill" size={30} color={C.ink} /> REWIND</Pill>
      <div style={{ position: 'absolute', left: 540, top: lerp(560, 330, shrink), transform: `translate(-50%,-50%) scale(${(1 + 0.1 * land) * lerp(1, 0.55, shrink)}) translateX(${rewinding ? (r() - 0.5) * 8 : 0}px)`, fontFamily: fonts.head, fontWeight: 900, fontSize: 240, color: t >= t2017 ? C.ink : 'rgba(238,243,251,.75)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', textShadow: t >= t2017 ? `0 0 60px ${C.red}66` : undefined, opacity: ramp(t, tNew, 0.2) * (1 - folderOut * 0.6) }}>{YEARS[k]}</div>
      {/* the dossier */}
      {t > tCIA - 0.25 && folderOut < 1 && (
        <div style={{ position: 'absolute', left: 110, top: 520, width: 860, height: 640, transform: `translateY(${(1 - folder) * 700 + folderOut * 900}px) rotate(${(1 - folder) * 6 - 1.5}deg)`, opacity: clamp(folder * 1.5) }}>
          <div style={{ position: 'absolute', left: 40, top: -46, width: 220, height: 60, borderRadius: '14px 14px 0 0', background: '#1c2233', fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>CIA / EDG</div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(170deg,#1c2233,#0d111c)', boxShadow: '0 50px 120px rgba(0,0,0,.7)', overflow: 'hidden' }}>
            <div style={{ height: 64, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, letterSpacing: '0.3em', color: '#fff' }}>TOP SECRET</div>
            <div style={{ padding: '34px 44px' }}>
              <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: '0.2em', color: C.dim }}>WIKILEAKS · VAULT 7 · 2017</div>
              <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 84, color: C.ink, marginTop: 14, minHeight: 100, whiteSpace: 'nowrap' }}>{'“WEEPING ANGEL”'.slice(0, Math.floor(ramp(t, tTool - 0.05, 0.55) * 16))}</div>
              {[0.92, 0.7, 0.85, 0.55, 0.78].map((w, i) => <div key={i} style={{ height: 26, width: `${w * 100}%`, marginTop: 18, borderRadius: 4, background: i % 2 ? '#05070c' : 'rgba(238,243,251,.14)' }} />)}
            </div>
          </div>
          {t > tCIA + 0.1 && <div style={{ position: 'absolute', right: 40, top: 360, transform: `rotate(-12deg) scale(${2.6 - 1.6 * stamp})`, opacity: stamp, padding: '10px 26px', border: `6px solid ${C.red}`, borderRadius: 12, fontFamily: fonts.head, fontWeight: 900, fontSize: 58, color: C.red, letterSpacing: '0.04em', background: 'rgba(255,46,77,.06)' }}>CLASSIFIED</div>}
        </div>
      )}
      {/* "made a TV look off… while the mic kept recording" */}
      {t > tMade - 0.2 && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${(1 - tv) * 300}px)`, opacity: clamp(tv * 1.5) }}>
            <Glow x={540} y={640} r={600} color={C.red} opacity={recOn ? 0.18 + 0.08 * Math.sin(t * 6) : 0} />
            <TV x={140} y={420} w={800} led={recOn ? 1.4 + 0.5 * Math.sin(t * 6) : 0} screenOn={1} bias={0.3} stand={false} screen={
              <AbsoluteFill style={{ background: '#020306' }}>
                {recOn && <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="none"><polyline fill="none" stroke={C.red} strokeWidth="4" opacity={0.85} style={{ filter: `drop-shadow(0 0 8px ${C.red})` }} points={Array.from({ length: 81 }, (_, i) => { const u = i / 80; return `${u * 800},${225 + Math.sin(u * 40 + t * 12) * Math.sin(u * Math.PI) * 90 * ramp(t, tWhile, 0.4)}`; }).join(' ')} /></svg>}
                {recOn && <div style={{ position: 'absolute', right: 22, top: 16, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: C.red, opacity: Math.floor(t * 2.5) % 2 ? 1 : 0.35 }}>● REC</div>}
              </AbsoluteFill>
            } />
          </div>
          {recOn && <Rings x={540} y={420 + 800 * 0.575} at={tWhile} out={B9 + 0.3} color={C.red} max={340} count={4} speed={0.9} />}
          {row('Screen', 'OFF', tLook - 0.1, C.dim, 'ph:monitor-bold', 930)}
          {row('Lights', 'OFF', tLook + 0.25, C.dim, 'ph:lightbulb-bold', 1010)}
          {row('Microphone', '● REC', tRec - 0.15, C.red, 'ph:microphone-fill', 1090)}
        </>
      )}
      <Flash at={t2017 - 0.02} color="#fff" max={0.25} d={0.3} />
    </AbsoluteFill>
  );
};

// ---------------- 9 · "There are five settings that shut this down. The last one? Almost nobody does it."
const tFive = P(9, 'five settings'), tShut = P(9, 'shut this down'), tLast = P(9, 'The last one'), tAlmost = P(9, 'Almost nobody');
const ROWS = [['ph:power-bold', 'Always Ready'], ['ph:microphone-bold', 'Voice recognition'], ['ph:eye-bold', 'Viewing information'], ['ph:megaphone-bold', 'Personalised ads'], ['ph:lock-key-bold', "Don't connect it at all"]];
const flipAt = (k: number) => tShut + 0.05 + k * 0.16;
export const sfx9: SfxEvent[] = [
  { t: B9 + 0.02, name: 'swoosh', vol: 0.4, note: 'settings panel' },
  { t: tFive - 0.04, name: 'popUi', vol: 0.4, note: '5 SETTINGS' },
  ...[0, 1, 2, 3].map((k) => ({ t: flipAt(k) - 0.02, name: 'toggle' as const, vol: 0.55 })),
  { t: flipAt(3) + 0.25, name: 'confirm', vol: 0.3 },
  { t: tLast - 0.06, name: 'riser', vol: 0.4, dur: 0.9, note: 'spotlight on #5' }, { t: tLast + 0.25, name: 'lock', vol: 0.45 },
  { t: tAlmost - 0.04, name: 'popup', vol: 0.4, note: 'ALMOST NOBODY' },
];
export const Beat9: React.FC = () => {
  const { f, fps, t } = useTF();
  const panel = springAt(f, fps, B9 + 0.02, { damping: 16, stiffness: 130 });
  const spot = ramp(t, tLast - 0.05, 0.35, EASE.inOut);
  const r = rng(Math.round(t * 30) + 9);
  return (
    <AbsoluteFill>
      <BgMesh a={C.green} b={C.blue} />
      <Grid opacity={0.12} perspective={false} />
      <div style={{ position: 'absolute', left: 540, top: 300, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tFive - 0.05, { damping: 11, stiffness: 170 })})`, display: 'flex', alignItems: 'baseline', gap: 18, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 130, color: C.green, textShadow: `0 0 40px ${C.green}66` }}>5</span>
        <span style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: C.ink }}>SETTINGS</span>
      </div>
      <Pill x={540} y={405} at={tAlmost - 0.05} color={C.amber} center size={34}><Icon name="ph:users-three-bold" size={32} color={C.ink} /> ALMOST NOBODY DOES IT</Pill>
      <div style={{ position: 'absolute', left: 90, top: 470, width: 900, transform: `translateY(${(1 - panel) * 200}px)`, opacity: clamp(panel * 1.5), display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ROWS.map(([ic, label], k) => {
          const last = k === 4;
          const on = last ? 1 : 1 - ramp(t, flipAt(k), 0.18, EASE.inOut);
          const dim = last ? 0 : spot * 0.65;
          const sh = last && t > tLast && t < tLast + 0.5 ? (r() - 0.5) * 14 * (1 - (t - tLast) / 0.5) : 0;
          return (
            <div key={k} style={{ position: 'relative', height: 138, display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', borderRadius: 24, background: last ? `rgba(255,182,72,${0.06 + 0.1 * spot})` : 'rgba(10,16,30,.9)', border: `2px solid ${last ? `rgba(255,182,72,${0.3 + 0.7 * spot})` : 'rgba(140,170,230,.18)'}`, boxShadow: last && spot > 0 ? `0 0 ${40 + 20 * Math.sin(t * 6)}px ${C.amber}66` : undefined, opacity: 1 - dim, transform: `translateX(${sh}px) scale(${last ? 1 + 0.04 * spot : 1})` }}>
              <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: last ? C.amber : C.dim, width: 40 }}>{k + 1}</div>
              <Icon name={ic} size={50} color={last ? C.amber : C.ink} />
              <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 42, color: C.ink, whiteSpace: 'nowrap', filter: last ? 'blur(14px)' : undefined }}>{label}</div>
              <div style={{ marginLeft: 'auto' }}>
                {last ? <div style={{ width: 90, height: 90, borderRadius: '50%', background: `${C.amber}22`, border: `3px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 56, color: C.amber, transform: `scale(${1 + 0.08 * Math.sin(t * 7) * spot})` }}>?</div>
                  : <div style={{ position: 'relative' }}><Toggle on={on} color={C.red} offColor={C.green} size={1} />{on < 0.5 && <div style={{ position: 'absolute', left: -56, top: 12, transform: `scale(${ramp(t, flipAt(k) + 0.1, 0.25, EASE.back)})` }}><Icon name="ph:check-circle-fill" size={42} color={C.green} /></div>}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 10 · "The full story is in the video linked below. Watch it before you turn your TV off tonight…"
const tFull = P(10, 'full story'), tLinked = P(10, 'linked below'), tWatch = P(10, 'Watch it'), tOffT = P(10, 'off tonight');
const CARD = { x: 110, y: 420, w: 860, h: 484 };
const SCREEN = { x: VTV.x + VTV.w * 0.008, y: VTV.y + VTV.w * 0.008, w: VTV.w * 0.984, h: VTV.w * 0.575 - VTV.w * 0.028 };
const tMorph = tWatch - 0.15, tRoom = tMorph + 0.7;
export const sfx10: SfxEvent[] = [
  { t: B10 + 0.02, name: 'whooshQuick', vol: 0.4, note: 'video card rises' },
  { t: tFull + 0.1, name: 'popUi', vol: 0.35 },
  { t: tLinked - 0.04, name: 'bleep', vol: 0.35, note: 'arrow' }, { t: tLinked + 0.45, name: 'tap', vol: 0.25 }, { t: tLinked + 0.9, name: 'tap', vol: 0.25 },
  { t: tMorph - 0.05, name: 'swooshSlow', vol: 0.4, note: 'card flies into the TV' },
  { t: tRoom - 0.1, name: 'focus', vol: 0.3 },
  { t: tOffT - 0.04, name: 'powerUpStatic', vol: 0.4, rate: 0.8, note: 'CRT switch-off' },
  { t: tOffT + 0.25, name: 'heartbeat', vol: 0.35, note: 'loops into frame 0' },
];
export const Beat10: React.FC = () => {
  const { f, fps, t } = useTF();
  const card = springAt(f, fps, B10 + 0.02, { damping: 15, stiffness: 120 });
  const m = ramp(t, tMorph, 0.7, EASE.inOut);         // card → TV screen
  const room = ramp(t, tMorph + 0.05, 0.6, EASE.out);  // living room fades in around it
  const extras = 1 - ramp(t, tMorph - 0.1, 0.25);      // title, channel row, arrow
  // CRT switch-off on "off": collapse vertically, then horizontally, then black
  const c1 = ramp(t, tOffT - 0.02, 0.1, EASE.in), c2 = ramp(t, tOffT + 0.08, 0.08, EASE.in);
  const screenOn = t < tOffT + 0.16 ? 1 : 0;
  const led = 0.6 + 0.4 * Math.sin((t - END) * 3.4); // phase-matched to frame 0 for a seamless loop
  const thumb = <Img src={staticFile('short/long-thumb.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const crt = (
    <AbsoluteFill style={{ background: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scaleY(${1 - c1 * 0.99}) scaleX(${1 - c2})`, filter: `brightness(${1 + c1 * 2})` }}>{thumb}</div>
    </AbsoluteFill>
  );
  const arrowY = Math.abs(Math.sin((t - tLinked) * 5)) * 26;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <BgMesh a={C.red} b={C.blue} />
      {room > 0 && (
        <AbsoluteFill style={{ opacity: room }}>
          <Camera keys={[{ t: 0, x: 540, y: 960, z: 1 }]}>
            <VRoom led={t > tRoom ? led : 0.6} screen={t > tRoom ? crt : undefined} screenOn={t > tRoom ? screenOn : 0} person={room} />
          </Camera>
        </AbsoluteFill>
      )}
      {/* the video card (until it has become the TV screen) */}
      {t < tRoom + 0.05 && (
        <div style={{ position: 'absolute', left: lerp(CARD.x, SCREEN.x, m), top: lerp(CARD.y, SCREEN.y, m) + (1 - card) * 300, width: lerp(CARD.w, SCREEN.w, m), opacity: clamp(card * 1.5) }}>
          <div style={{ position: 'relative', width: '100%', height: lerp(CARD.h, SCREEN.h, m), borderRadius: lerp(26, 3, m), overflow: 'hidden', boxShadow: `0 50px 120px rgba(0,0,0,${0.7 * (1 - m)})` }}>
            {thumb}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${(1 + 0.06 * Math.sin(t * 5)) * extras})`, width: 130, height: 92, borderRadius: 26, background: '#ff0033', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(0,0,0,.6)' }}><Icon name="ph:play-fill" size={58} color="#fff" /></div>
            <div style={{ position: 'absolute', right: 16, bottom: 18, padding: '4px 12px', borderRadius: 8, background: 'rgba(0,0,0,.8)', fontFamily: fonts.body, fontWeight: 700, fontSize: 28, color: '#fff', opacity: extras }}>9:08</div>
            <div style={{ position: 'absolute', left: 0, bottom: 0, height: 7, width: `${30 * extras}%`, background: '#ff0033' }} />
          </div>
          <div style={{ marginTop: 26, display: 'flex', gap: 20, opacity: extras }}>
            <div style={{ width: 76, height: 76, flexShrink: 0, borderRadius: '50%', background: `linear-gradient(135deg, ${C.cyan}, ${C.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:cpu-bold" size={44} color="#04101c" /></div>
            <div>
              <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 40, lineHeight: 1.18, color: C.ink }}>Your TV Is "Off." So Why Is the Microphone Still Awake?</div>
              <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: C.dim, marginTop: 8 }}>MechivioTech · Full video</div>
            </div>
          </div>
        </div>
      )}
      <Pill x={540} y={300} at={tFull - 0.05} out={tMorph - 0.1} color={C.red} center size={34}><Icon name="ph:film-strip-bold" size={30} color={C.ink} /> FULL STORY · 9 MIN</Pill>
      {t > tLinked - 0.05 && extras > 0 && (
        <div style={{ position: 'absolute', left: 540, top: 1180 + arrowY, transform: `translate(-50%,-50%) scale(${ramp(t, tLinked - 0.05, 0.3, EASE.back) * extras})` }}>
          <Icon name="ph:arrow-fat-down-fill" size={130} color={C.amber} glow />
        </div>
      )}
      {t > tOffT + 0.06 && t < tOffT + 0.3 && <div style={{ position: 'absolute', left: SCREEN.x + SCREEN.w / 2 - 8, top: SCREEN.y + SCREEN.h / 2 - 8, width: 16, height: 16, borderRadius: 8, background: '#fff', boxShadow: '0 0 30px #fff', opacity: 1 - ramp(t, tOffT + 0.12, 0.18) }} />}
    </AbsoluteFill>
  );
};
