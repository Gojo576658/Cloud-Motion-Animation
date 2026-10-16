// Kill Switch Short (1080×1920, ~30 s): $10.69 on frame 1 over a red world → WannaCry locks screens everywhere →
// the strange address nobody owned, bought → the worm knocks, someone answers, it switches off → the FBI →
// end card that loops back. Same black-grid, white/red language as the long video; few SFX.
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook } from '../components/Backdrop';
import { Icon } from '../components/Icon';
import { SfxTrack, type SfxEvent } from '../lib/sfx';
import { EASE, ramp, springAt, clamp } from '../lib/time';
import { ShortCaptions } from '../short/ShortCaptions';
import { fonts } from '../tg/type';
import { Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { DotMap } from '../bf/kit';
import { A, GridBg, TypeOn, Label, Panel, Marcus, Worm, Agent, RansomScreen } from '../ks/kit';
import timeline from './timeline.json';
import { C0, C1, P } from './stime';

const TL = timeline as { duration: number; words: { w: string; s: number; e: number }[] };
const tStop = P(0, 'stopped'), t100 = P(0, 'over a hundred');
const tWC = P(1, 'WannaCry'), tHosp = P(1, 'Hospitals'), tFact = P(1, 'Factories'), tTrain = P(1, 'Trains');
const tAddr = P(2, 'strange web'), tNobody = P(2, 'nobody owned'), tBought = P(2, 'So he bought');
const tCheck = P(3, 'checked'), tAnswer = P(3, 'Now someone'), tSwitch = P(3, 'switched');
const tLater = C0(4), tFbi = P(4, 'the FBI'), tEnd = C0(5);
const JUNK = 'xq7hdkf2l0aposjhw8erqztbv3nmglkwe.com';
const KEYS = /^(wannacry|nobody|bought|switched|fbi|arrested)$/i;
const SFX: SfxEvent[] = [
  { t: 0.05, name: 'impactDeep', vol: 0.45 }, { t: tWC, name: 'glitch', vol: 0.3 }, { t: tBought + 0.4, name: 'clickModern', vol: 0.4 },
  { t: tAnswer, name: 'door', vol: 0.4 }, { t: tSwitch, name: 'powerUp', vol: 0.3, rate: 0.7 }, { t: tFbi, name: 'impactDeep', vol: 0.5 },
  { t: tEnd - 0.1, name: 'whooshDeep', vol: 0.3 },
];
const useT = () => useCurrentFrame() / useVideoConfig().fps;

const Price: React.FC<{ at: number; size?: number; rot?: number }> = ({ at, size = 200, rot = -6 }) => {
  const f = useCurrentFrame();
  const s = springAt(f, 30, at, { damping: 10, stiffness: 190 });
  return <div style={{ display: 'inline-block', transform: `rotate(${rot * s}deg) scale(${0.3 + 0.7 * s})`, opacity: clamp(s * 2), padding: `${size * 0.16}px ${size * 0.32}px`, borderRadius: size * 0.14, background: A.white, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: size, color: '#111', letterSpacing: '-0.05em', lineHeight: 1 }}>$10.69</div></div>;
};

const Hook: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.14)" y={50} />
      <div style={{ position: 'absolute', left: 540, top: 430, transform: 'translate(-50%,-50%)' }}><Price at={0} /></div>
      <div style={{ position: 'absolute', left: 540, top: 690, transform: 'translateX(-50%)', opacity: ramp(t, 0.3, 0.4) }}><Mono size={30} color={A.dim}>ONE DOMAIN NAME</Mono></div>
      <div style={{ filter: 'hue-rotate(140deg) saturate(1.4)' }}><DotMap x={540} y={960} w={1000} lit={1 - ramp(t, tStop, 2.4, EASE.inOut) * 0.85} /></div>
      {t > t100 && <Pop x={540} y={1170} at={t100}><Label color={A.red} size={44} solid>100+ COUNTRIES</Label></Pop>}
    </AbsoluteFill>
  );
};

const Spread: React.FC = () => {
  const t = useT();
  const order = [4, 1, 7, 3, 5, 0, 8, 2, 6];
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.1)" />
      <div style={{ position: 'absolute', left: 540, top: 250, transform: 'translateX(-50%)' }}><Kinetic at={tWC} size={130} words={[{ w: 'Wanna' }, { w: 'Cry.', serif: true, color: A.red }]} /></div>
      <div style={{ position: 'absolute', left: 90, top: 470, display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 30 }}>
        {Array.from({ length: 9 }, (_, i) => {
          const red = t > tWC + order.indexOf(i) * 0.22;
          return <div key={i} style={{ position: 'relative', width: 280, height: 170, borderRadius: 12, background: '#111116', padding: 8, overflow: 'hidden' }}><div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 6, fontSize: 6 }}>{red ? <RansomScreen /> : <AbsoluteFill style={{ background: '#1b2433' }} />}</div></div>;
        })}
      </div>
      {([[tHosp, 'ph:hospital-fill', 'HOSPITALS', 220], [tFact, 'ph:factory-fill', 'FACTORIES', 540], [tTrain, 'ph:train-fill', 'TRAINS', 860]] as [number, string, string, number][]).map(([at, ic, lb, x]) => <Pop key={lb} x={x} y={1150} at={at - 0.05}><div style={{ textAlign: 'center' }}><Icon name={ic} size={110} color={A.red} style={{ margin: '0 auto' }} /><div style={{ marginTop: 8, ...fonts.H, fontWeight: 900, fontSize: 40, color: A.white }}>{lb}</div></div></Pop>)}
    </AbsoluteFill>
  );
};

const Domain: React.FC = () => {
  const t = useT();
  const buy = t > tBought - 0.1, done = t > tBought + 0.5;
  return (
    <AbsoluteFill>
      <GridBg />
      <div style={{ position: 'absolute', left: 110, top: 250 }}><Panel w={860} pad={36}>
        {!buy ? <>
          <Mono size={24} color={A.dim}>INSIDE THE WORM'S CODE</Mono>
          <div style={{ marginTop: 20, fontFamily: fonts.mono, fontSize: 30, color: A.soft }}>visit this address →</div>
          <div style={{ marginTop: 14, padding: '16px 18px', borderRadius: 10, background: '#16161c', border: `2px solid ${t > tNobody ? A.red : A.line}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 27, color: A.white }}>{t > tAddr - 0.2 ? <TypeOn text={JUNK} at={tAddr - 0.2} cps={30} /> : '…'}</div>
        </> : <>
          <Mono size={24} color={A.dim}>DOMAIN SEARCH</Mono>
          <div style={{ marginTop: 16, fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: A.white }}>{JUNK}</div>
          <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...fonts.H, fontWeight: 900, fontSize: 90, color: A.white }}>$10.69</div>
            <div style={{ padding: '22px 40px', borderRadius: 16, background: done ? A.white : A.red, ...fonts.H, fontWeight: 900, fontSize: 40, color: done ? '#111' : A.white, transform: `scale(${t > tBought + 0.4 && t < tBought + 0.55 ? 0.92 : 1})` }}>{done ? 'PURCHASED' : 'BUY'}</div>
          </div>
        </>}
      </Panel></div>
      {t > tNobody && !buy && <Pop x={540} y={720} at={tNobody}><Label color={A.red} size={50} solid>OWNER: NOBODY</Label></Pop>}
      <Marcus x={540} y={1230} size={520} mood={done ? 'happy' : 'focus'} laptop seed={3} />
    </AbsoluteFill>
  );
};

const Switch: React.FC = () => {
  const t = useT();
  const open = t > tAnswer, off = t > tSwitch;
  const knock = t > C0(3) + 0.4 && t < tAnswer;
  const fall = ramp(t, tSwitch + 0.1, 0.5, EASE.in);
  return (
    <AbsoluteFill>
      <GridBg />
      <div style={{ position: 'absolute', left: 560, top: 420, width: 360, height: 650, background: '#1c1c22', border: `8px solid ${A.line}`, borderBottom: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#2a2a33', transformOrigin: '0 50%', transform: `perspective(900px) rotateY(${open ? -72 : 0}deg)` }}><div style={{ position: 'absolute', right: 30, top: 320, width: 24, height: 24, borderRadius: 12, background: A.soft }} /></div>
        {open && <div style={{ position: 'absolute', left: 180, top: 650 }}><Marcus x={0} y={0} size={440} mood="happy" seed={8} /></div>}
      </div>
      <div style={{ position: 'absolute', left: 60, top: 1070, width: 960, height: 10, background: A.line }} />
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `rotate(${fall * -80}deg)`, transformOrigin: '330px 1060px' }}><Worm x={330} y={950} size={230} mood={off ? 'off' : open ? 'scared' : 'mean'} seed={3} /></div>
      {knock && <Pop x={300} y={720} at={C0(3) + 0.4}><Label color={A.white} size={40}>knock knock</Label></Pop>}
      {t > tCheck && !open && <div style={{ position: 'absolute', left: 540, top: 250, transform: 'translateX(-50%)' }}><Kinetic at={tCheck} size={70} words={[{ w: 'Anyone' }, { w: 'home?', serif: true, color: A.red }]} /></div>}
      <Stamp x={540} y={270} at={tSwitch + 0.1} text="SWITCHED OFF" size={88} rot={-6} />
    </AbsoluteFill>
  );
};

const Arrest: React.FC = () => {
  const t = useT();
  const caught = t > tFbi;
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.14)" />
      <Stamp x={540} y={330} at={tLater + 0.1} out={tFbi - 0.1} text="3 MONTHS LATER" size={74} rot={-5} />
      <Marcus x={370} y={1210} size={520} mood={caught ? 'shock' : 'happy'} cuffs={t > tFbi + 0.4} seed={2} />
      <Agent x={790} y={1230} size={560} flip />
      <Stamp x={540} y={460} at={tFbi + 0.2} text="ARRESTED" size={120} rot={-8} />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,255,255,.05)" />
      <div style={{ position: 'absolute', left: 540, top: 330, transform: 'translateX(-50%)', textAlign: 'center' }}><Kinetic at={tEnd} size={96} words={[{ w: 'Full' }, { w: 'story' }, { w: 'on', br: true }, { w: 'the' }, { w: 'channel.', serif: true, color: A.red }]} /></div>
      <Marcus x={540} y={1200} size={540} mood="happy" laptop seed={16} />
      <div style={{ position: 'absolute', left: 540, top: 1290, transform: 'translateX(-50%)', opacity: ramp(t, tEnd + 0.5, 0.4) }}><Mono size={30} color={A.dim}>MECHIVIOTECH</Mono></div>
    </AbsoluteFill>
  );
};

const BEATS: [React.FC, number][] = [[Hook, 0], [Spread, C0(1) - 0.15], [Domain, C0(2) - 0.15], [Switch, C0(3) - 0.15], [Arrest, C0(4) - 0.15], [End, C0(5) - 0.15]];

export const KillSwitchShort: React.FC = () => {
  const t = useT();
  const k = BEATS.filter(([, at]) => t >= at).length - 1;
  const [Comp, at] = BEATS[Math.max(0, k)];
  const nextAt = BEATS[k + 1]?.[1] ?? TL.duration + 1;
  // camera: slow push on every beat, a punch on the arrest, a quick zoom-through into the next beat
  const push = 1.04 + 0.08 * clamp((t - at) / Math.max(1, nextAt - at));
  const into = ramp(t, nextAt - 0.18, 0.18, EASE.in), out = 1 - ramp(t, at, 0.22, EASE.out);
  const punch = Comp === Arrest ? 0.1 * (1 - ramp(t, tFbi, 0.6)) * (t > tFbi ? 1 : 0) : 0;
  const drift = Math.sin(t * 0.9) * 10;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <AbsoluteFill style={{ transform: `translate(${drift}px, ${Math.cos(t * 0.7) * 8}px) scale(${push + punch + into * 0.5 + (k ? out * 0.25 : 0)}) rotate(${Math.sin(t * 0.5) * 0.4}deg)`, filter: into + (k ? out : 0) > 0.05 ? `blur(${((into + (k ? out : 0)) * 14).toFixed(1)}px)` : undefined }}><Comp /></AbsoluteFill>
      <ShortCaptions words={TL.words} keys={KEYS} hide={[[tEnd - 0.1, TL.duration + 1]]} />
      <FilmLook vignette={0.5} grain={0.07} />
      <Audio src={staticFile('kss/soundtrack.wav')} />
      <SfxTrack events={SFX} />
    </AbsoluteFill>
  );
};
export const kssEnd = C1(5);
