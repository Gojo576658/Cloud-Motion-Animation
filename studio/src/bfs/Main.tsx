// Blue Friday Short (1080×1920, ~25 s): the hook number on frame 1, the 20-box form and box 21, Gus counting,
// crash → the world goes blue, the hand-fix, end card that loops back. Shorts captions, camera drift, SFX.
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook } from '../components/Backdrop';
import { Icon } from '../components/Icon';
import { SfxTrack, type SfxEvent } from '../lib/sfx';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import { ShortCaptions } from '../short/ShortCaptions';
import { fonts } from '../tg/type';
import { Pop, Count, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { B, Gus, Monitor, BSOD, BootDots, DotMap, Form, Tag, Night } from '../bf/kit';
import timeline from './timeline.json';
import { C0, C1, P, W } from './stime';

const TL = timeline as { duration: number; words: { w: string; s: number; e: number }[] };
const tForm = P(1, 'expected twenty'), t21 = P(1, 'twenty-one'), COUNT = [W(2, 0), W(2, 1), W(2, 2)], tOne = W(3, 1);
const tCrash = C0(4), tAir = P(4, 'Airports'), tBank = P(4, 'banks'), tHosp = P(4, 'hospitals'), tEvery = P(4, 'Blue screens');
const tFix = C0(5), tWalk = P(5, 'Someone had'), tHand = P(5, 'by hand'), tEnd = C0(6);
const KEYS = /^(crashed|twenty-one|crash|blue|hand|one\?)$/i;
const SFX: SfxEvent[] = [
  { t: 0, name: 'glitchStatic', vol: 0.4 }, { t: 0.05, name: 'impactDeep', vol: 0.45 }, { t: 0.2, name: 'dataLoad', vol: 0.25, dur: 2 },
  { t: C0(1) - 0.15, name: 'whooshQuick', vol: 0.35 }, { t: tForm, name: 'paperSlide', vol: 0.35 }, { t: t21, name: 'glitchElectric', vol: 0.4 },
  ...COUNT.map((x) => ({ t: x, name: 'tick' as const, vol: 0.5 })), { t: tOne, name: 'mysteryHit', vol: 0.5 },
  { t: tCrash - 0.03, name: 'glitchBreak', vol: 0.55 }, { t: tCrash, name: 'impactBig', vol: 0.5 }, { t: tAir, name: 'bleep', vol: 0.3 }, { t: tBank, name: 'bleep', vol: 0.3 }, { t: tHosp, name: 'bleep', vol: 0.3 }, { t: tEvery, name: 'darkSweep', vol: 0.4 },
  { t: tFix, name: 'error', vol: 0.35 }, { t: tWalk, name: 'tap', vol: 0.3 }, { t: tHand, name: 'stomp', vol: 0.4 },
  { t: tEnd - 0.1, name: 'whooshBig', vol: 0.35 }, { t: tEnd + 0.2, name: 'bell', vol: 0.3 },
];
const useT = () => useCurrentFrame() / useVideoConfig().fps;

const Hook: React.FC = () => {
  const t = useT();
  const cols = 9, rows = 14;
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: 'absolute', left: 60, top: 160, display: 'grid', gridTemplateColumns: `repeat(${cols}, 100px)`, gap: 10 }}>
        {Array.from({ length: cols * rows }, (_, i) => { const r = ((i * 7919) % 997) / 997; const on = ramp(t, r * 2.2, 0.1) > 0.5; return <div key={i} style={{ width: 100, height: 70, borderRadius: 6, background: on ? B.blue : '#1a2336', boxShadow: on ? `0 0 14px ${B.blue}aa` : 'none' }} />; })}
      </div>
      <div style={{ position: 'absolute', left: 540, top: 700, transform: 'translate(-50%,-50%)', padding: '30px 40px', borderRadius: 30, background: 'rgba(5,10,24,.9)', textAlign: 'center', width: 900 }}>
        <div style={{ ...fonts.H, fontWeight: 900, fontSize: 150, color: B.white, letterSpacing: '-0.05em', lineHeight: 1 }}><Count from={1200000} to={8500000} at={0} d={2.4} /></div>
        <Mono size={30} color={B.blue2}>COMPUTERS · ONE MORNING</Mono>
        <div style={{ marginTop: 26 }}><Kinetic at={0.2} size={78} words={[{ w: 'One' }, { w: 'extra' }, { w: 'number.', serif: true, color: B.red }]} /></div>
      </div>
    </AbsoluteFill>
  );
};
const FormBeat: React.FC = () => {
  const t = useT();
  const counting = t > COUNT[0] - 0.1;
  const hi = counting ? 17 + COUNT.filter((x) => t > x).length : t > tForm ? 20 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0d1424,#060a14)' }} />
      <div style={{ position: 'absolute', left: 540, top: 170, transform: 'translateX(-50%)' }}><Tag color={B.amber} size={32}>SECURITY SOFTWARE · UPDATE FILE</Tag></div>
      <Form x={500} y={560} at={C0(1)} n={t > t21 - 0.3 ? 21 : 20} hi={hi} bad={t > tOne ? 1 : 0} w={760} title={t > t21 - 0.3 ? 'NEW UPDATE · 21 FIELDS' : 'EXPECTED: 20 FIELDS'} />
      <Gus x={760} y={1260} size={520} mood={t > tOne ? 'confused' : counting ? 'focus' : 'neutral'} arm={counting ? 'point' : 'clip'} look={-1} talk={counting && t < C1(3) ? Math.abs(Math.sin(t * 14)) : 0} seed={21} clipCount={12} />
      {t > tOne && <div style={{ position: 'absolute', left: 230, top: 880, ...fonts.H, fontWeight: 900, fontSize: 220, color: B.red, textShadow: `0 0 50px ${B.red}`, transform: `scale(${springAt(useCurrentFrame(), 30, tOne, { damping: 8, stiffness: 240 })})` }}>?</div>}
    </AbsoluteFill>
  );
};
const CrashBeat: React.FC = () => {
  const t = useT();
  const flash = 1 - ramp(t, tCrash, 0.3);
  const map = t > tAir - 0.2;
  return (
    <AbsoluteFill>
      {!map ? <AbsoluteFill style={{ fontSize: 16 }}><BSOD pct={20} /></AbsoluteFill> : <>
        <Night glow="rgba(10,108,214,.3)" />
        <div style={{ position: 'absolute', left: 540, top: 330, transform: 'translateX(-50%)' }}><Kinetic at={tEvery} size={96} words={[{ w: 'Blue' }, { w: 'screens', br: true }, { w: 'everywhere.', serif: true, color: B.blue2 }]} /></div>
        <DotMap x={540} y={760} w={1040} lit={ramp(t, tAir - 0.2, 2.2, EASE.inOut)} />
        {[[tAir, 'ph:airplane-tilt-fill', 'AIRPORTS', 220], [tBank, 'ph:bank-fill', 'BANKS', 540], [tHosp, 'ph:first-aid-kit-fill', 'HOSPITALS', 860]].map(([at, ic, lb, x]) => <Pop key={lb as string} x={x as number} y={1090} at={(at as number) - 0.05}><div style={{ textAlign: 'center' }}><Icon name={ic as string} size={110} color={B.white} style={{ margin: '0 auto' }} /><div style={{ marginTop: 8, ...fonts.H, fontWeight: 900, fontSize: 40, color: B.white }}>{lb as string}</div></div></Pop>)}
      </>}
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
      {!map && <div style={{ position: 'absolute', left: 540, top: 1000, transform: `translate(-50%,-50%) rotate(-8deg) scale(${springAt(useCurrentFrame(), 30, tCrash + 0.05, { damping: 10, stiffness: 200 })})`, ...fonts.H, fontWeight: 900, fontSize: 200, color: '#fff' }}>CRASH.</div>}
    </AbsoluteFill>
  );
};
const FixBeat: React.FC = () => {
  const t = useT();
  const blue = Math.floor((t - tFix) / 0.8) % 2 === 0;
  const walk = ramp(t, tWalk - 0.1, 1.6, EASE.inOut);
  const done = Math.floor(ramp(t, tWalk, C1(5) - tWalk + 0.5, (x) => x) * 4);
  return (
    <AbsoluteFill>
      <Night glow="rgba(255,59,78,.12)" />
      <Monitor x={540} y={700} w={860}>{blue ? <AbsoluteFill style={{ fontSize: 14 }}><BSOD pct={30} /></AbsoluteFill> : <BootDots size={80} />}</Monitor>
      <div style={{ position: 'absolute', left: 540, top: 170, transform: 'translateX(-50%)' }}><Tag color={B.red} size={36}><Icon name="ph:prohibit-bold" size={40} color={B.red} /> CAN'T DOWNLOAD A FIX</Tag></div>
      {t > tWalk - 0.1 && <>
        <div style={{ position: 'absolute', left: lerp(1100, 700, walk), top: 820 }}><Icon name="ph:person-simple-walk-fill" size={260} color={B.dim} /></div>
        <div style={{ position: 'absolute', left: 120, top: 860, ...fonts.H, fontWeight: 900, fontSize: 120, color: B.white, letterSpacing: '-0.04em' }}>{done}<span style={{ color: B.dim }}> / </span><span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 400, color: B.amber }}>millions</span></div>
      </>}
      {t > tHand && <Stamp x={540} y={1170} at={tHand} text="BY HAND" size={90} rot={-6} />}
    </AbsoluteFill>
  );
};
const EndBeat: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Night glow="rgba(255,182,72,.14)" y={60} />
      <div style={{ position: 'absolute', left: 540, top: 380, transform: 'translateX(-50%)', textAlign: 'center' }}><Kinetic at={tEnd} size={96} words={[{ w: 'Full' }, { w: 'story', br: true }, { w: 'on' }, { w: 'the' }, { w: 'channel.', serif: true, color: B.amber }]} /></div>
      <Gus x={540} y={1250} size={560} mood="happy" arm="salute" seed={22} />
      <div style={{ position: 'absolute', left: 540, top: 1500, transform: 'translateX(-50%)', opacity: ramp(t, tEnd + 0.5, 0.4) }}><Mono size={30} color={B.dim}>MECHIVIOTECH</Mono></div>
    </AbsoluteFill>
  );
};
const BEATS: [React.FC, number][] = [[Hook, 0], [FormBeat, C0(1) - 0.15], [CrashBeat, C0(4) - 0.05], [FixBeat, C0(5) - 0.15], [EndBeat, C0(6) - 0.15]];

export const BlueFridayShort: React.FC = () => {
  const t = useT();
  const k = BEATS.filter(([, at]) => t >= at).length - 1;
  const [Comp, at] = BEATS[Math.max(0, k)];
  const nextAt = BEATS[k + 1]?.[1] ?? TL.duration + 1;
  // camera: slow push on every beat, a punch on the crash, a quick zoom-through into the next beat
  const push = 1.04 + 0.08 * clamp((t - at) / Math.max(1, nextAt - at));
  const into = ramp(t, nextAt - 0.18, 0.18, EASE.in), out = 1 - ramp(t, at, 0.22, EASE.out);
  const punch = Comp === CrashBeat ? 0.1 * (1 - ramp(t, tCrash, 0.5)) : 0;
  const drift = Math.sin(t * 0.9) * 10;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <AbsoluteFill style={{ transform: `translate(${drift}px, ${Math.cos(t * 0.7) * 8}px) scale(${push + punch + into * 0.5 + (k ? out * 0.25 : 0)}) rotate(${Math.sin(t * 0.5) * 0.4}deg)`, filter: into + (k ? out : 0) > 0.05 ? `blur(${((into + (k ? out : 0)) * 14).toFixed(1)}px)` : undefined }}><Comp /></AbsoluteFill>
      <ShortCaptions words={TL.words} keys={KEYS} hide={[[tCrash - 0.05, tCrash + 0.5]]} />
      <FilmLook vignette={0.5} grain={0.07} />
      <Audio src={staticFile('bfs/soundtrack.wav')} />
      <SfxTrack events={SFX} />
    </AbsoluteFill>
  );
};
