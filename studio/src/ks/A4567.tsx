// Acts 4–7: the accidental hero becomes famous (newspapers, a small ransom haul, the governments' blame);
// the arrest after DEF CON over Kronos; the guilty plea and the judge's surprise; the outro question.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, GridBg, Label, Panel, BigNum, Marcus, Worm, Agent, Judge } from './kit';

const Paper: React.FC<{ x: number; y: number; at: number; rot: number; kicker: string; head: string; w?: number }> = ({ x, y, at, rot, kicker, head, w = 560 }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.05) return null;
  const s = springAt(f, fps, at, { damping: 14, stiffness: 160 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) rotate(${rot * s + (1 - s) * 30}deg) scale(${0.4 + 0.6 * s})`, opacity: clamp(s * 2), background: '#ecebe6', padding: '22px 28px', boxShadow: '0 30px 80px rgba(0,0,0,.7)' }}>
      <div style={{ fontFamily: fonts.serif, fontSize: 40, color: '#111', borderBottom: '3px solid #111', paddingBottom: 6, textAlign: 'center' }}>The Daily Byte</div>
      <Mono size={16} color={A.red}>{kicker}</Mono>
      <div style={{ ...fonts.H, fontWeight: 900, fontSize: 52, lineHeight: 1.0, color: '#111', marginTop: 6 }}>{head}</div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 8, background: '#bdbcb6', width: i % 2 ? '70%' : '100%' }} />)}</div>
    </div>
  );
};

// ================================================================ ACT 4 · famous
const tHero = C0(26), tPapers = P(26, 'Newspapers'), tFound = P(26, 'and found it');
const tAtk = C0(27), tFew = P(27, 'Very few'), tOnly = P(27, 'only a little'), tGov = C0(28), tNK = P(28, 'North Korea'), tFame = C0(29), tMost = P(29, 'most famous');
export const a4NoCaptions: [number, number][] = [];
export const a4Sfx: SfxEvent[] = [
  { t: tPapers, name: 'paperSlide', vol: 0.3 }, { t: tFound, name: 'mysteryHit', vol: 0.3 }, { t: tOnly, name: 'coins', vol: 0.25 },
  { t: tNK, name: 'impactDeep', vol: 0.3 }, { t: tMost, name: 'sparkle', vol: 0.3 },
];
export const A4: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tAtk - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg />
        <Marcus x={1480} y={980} size={480} mood={t > tFound ? 'shock' : 'proud'} seed={10} />
        <Paper x={760} y={520} at={tHero + 0.5} rot={-6} kicker="CYBERATTACK" head="Accidental hero stops global attack" />
        <Paper x={900} y={470} at={tPapers} rot={4} kicker="EXCLUSIVE" head="Who is the mystery researcher?" />
        <Paper x={700} y={560} at={tPapers + 0.7} rot={-2} kicker="REVEALED" head="Hero hacker named" />
        <Stamp x={1480} y={360} at={tFound + 0.1} text="NAME FOUND" size={60} rot={-8} />
      </AbsoluteFill>
    );
  }
  if (t < tGov - 0.2) {
    const paid = t > tFew;
    return (
      <AbsoluteFill>
        <GridBg />
        <Worm x={420} y={330} size={240} mood={t > tOnly ? 'cry' : 'mean'} seed={4} />
        <div style={{ position: 'absolute', left: 230, top: 520, display: 'grid', gridTemplateColumns: 'repeat(10, 64px)', gap: 12 }}>
          {Array.from({ length: 30 }, (_, i) => { const p = paid && i % 13 === 4; return <div key={i} style={{ width: 64, height: 50, borderRadius: 8, background: '#16161c', border: `2px solid ${p ? A.white : A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ramp(t, tAtk + i * 0.02, 0.3) }}><Icon name={p ? 'ph:currency-btc-bold' : 'ph:x-bold'} size={28} color={p ? A.white : '#4a4a55'} /></div>; })}
        </div>
        {paid && <div style={{ position: 'absolute', left: 230, top: 760 }}><Label color={A.dim} size={28}>VERY FEW VICTIMS PAID</Label></div>}
        <div style={{ position: 'absolute', left: 1360, top: 470, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: ramp(t, tOnly - 0.2, 0.3) }}>
          <Mono size={22} color={A.dim}>TOTAL RANSOM, ROUGHLY</Mono>
          <div style={{ margin: '10px 0 16px' }}><BigNum to={100} at={tOnly} d={1.0} prefix="$" suffix="K+" size={170} /></div>
          <div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 40, color: A.red }}>for a worldwide attack</div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < tFame - 0.2) {
    const go = ramp(t, tNK - 0.3, 0.6, EASE.out);
    return (
      <AbsoluteFill>
        <GridBg />
        <div>
          {['US GOVERNMENT', 'UK GOVERNMENT'].map((g, i) => <Pop key={g} x={490} y={340 + i * 160} at={tGov + 0.3 + i * 0.3}><div style={{ width: 460, padding: '26px 30px', borderRadius: 18, background: A.panel, border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', gap: 20 }}><Icon name="ph:bank-fill" size={60} color={A.white} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 36, color: A.white }}>{g}</div></div></Pop>)}
        </div>
        <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}><line x1={760} y1={420} x2={lerp(760, 1130, go)} y2={420} stroke={A.red} strokeWidth={8} />{go > 0.95 && <path d="M1130 400 L1166 420 L1130 440 Z" fill={A.red} />}</svg>
        <div style={{ position: 'absolute', left: 1440, top: 420, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tNK, { damping: 12, stiffness: 180 })})`, textAlign: 'center' }}>
          <div style={{ padding: '30px 44px', borderRadius: 20, background: A.red, ...fonts.H, fontWeight: 900, fontSize: 64, color: A.white }}>NORTH KOREA</div>
          <div style={{ marginTop: 16 }}><Mono size={22} color={A.dim}>WHAT THEY SAID THEY BELIEVED</Mono></div>
        </div>
        <div style={{ position: 'absolute', left: 260, top: 720 }}><Mono size={22} color={A.dim}>MONTHS LATER · DECEMBER 2017</Mono></div>
      </AbsoluteFill>
    );
  }
  const glow = ramp(t, tFame, 0.8);
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,255,255,.05)" />
      <div style={{ position: 'absolute', left: 960, top: 980, width: 900, height: 900, transform: 'translate(-50%,-100%)', background: 'radial-gradient(ellipse at 50% 100%, rgba(244,244,246,.18), transparent 65%)', opacity: glow }} />
      <Marcus x={960} y={980} size={540} mood="happy" seed={11} />
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + t * 0.4; const r = 330 + Math.sin(t * 2 + i) * 20; return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(a) * r * 1.3, top: 640 + Math.sin(a) * r * 0.6, opacity: glow * (0.5 + 0.5 * Math.sin(t * 4 + i)) }}><Icon name="ph:camera-fill" size={40} color={A.white} /></div>; })}
      {t > tMost && <div style={{ position: 'absolute', left: 960, top: 150, transform: 'translateX(-50%)' }}><Kinetic at={tMost} size={70} words={[{ w: 'Most' }, { w: 'famous' }, { w: 'good', serif: true, color: A.red }, { w: 'hacker.' }]} /></div>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 5 · the arrest
const tVegas = C0(30), tLV = P(30, 'Las Vegas'), tDef = P(30, 'DEF CON'), tAir = C0(31), tArr = P(31, 'the FBI arrested');
const tNot = C0(32), tEarlier = P(32, 'For something'), tTeen = P(32, 'teenager'), tPros = C0(33), tBank = P(33, 'online banking'), tKronos = P(33, 'Kronos');
const tPrison = C0(34), tFace = P(34, 'could now face');
export const a5NoCaptions: [number, number][] = [];
export const a5Sfx: SfxEvent[] = [
  { t: tLV, name: 'swooshSlow', vol: 0.3, note: 'plane' }, { t: tDef, name: 'powerUp', vol: 0.25 }, { t: tArr, name: 'impactDeep', vol: 0.45 }, { t: tArr + 0.4, name: 'lock', vol: 0.3, note: 'cuffs' },
  { t: tEarlier, name: 'reverseWhoosh', vol: 0.3 }, { t: tKronos, name: 'impactDeep', vol: 0.3 }, { t: tFace, name: 'door', vol: 0.35, note: 'cell bars' },
];
export const A5: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tAir - 0.2) {
    const fly = ramp(t, tLV - 0.3, 2.2, EASE.inOut);
    const neon = t > tDef - 0.1 && Math.sin(t * 9) > -0.6;
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.08)" />
        <div style={{ position: 'absolute', left: 260, top: 300 }}><Mono size={26} color={A.dim}>AUGUST 2017</Mono></div>
        <div style={{ position: 'absolute', left: lerp(160, 1720, fly), top: 420 - Math.sin(fly * Math.PI) * 120, transform: `translate(-50%,-50%) rotate(${lerp(-12, 10, fly)}deg)`, opacity: ramp(t, tVegas, 0.3) * (1 - ramp(t, tDef + 0.6, 0.4)) }}><Icon name="ph:airplane-tilt-fill" size={130} color={A.white} /></div>
        {t > tLV && <div style={{ position: 'absolute', left: 960, top: 560, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><Kinetic at={tLV} size={120} words={[{ w: 'Las' }, { w: 'Vegas.', serif: true }]} /></div>}
        {t > tDef - 0.1 && <div style={{ position: 'absolute', left: 960, top: 790, transform: 'translate(-50%,-50%)', padding: '14px 40px', border: `4px solid ${A.red}`, borderRadius: 14, ...fonts.H, fontWeight: 900, fontSize: 64, letterSpacing: '0.08em', color: neon ? A.red : '#5a1a22', textShadow: neon ? `0 0 24px ${A.red}` : 'none', boxShadow: neon ? `0 0 30px rgba(255,43,61,.5)` : 'none' }}>DEF CON</div>}
      </AbsoluteFill>
    );
  }
  if (t < tNot - 0.2) {
    const caught = t > tArr;
    const walk = ramp(t, tArr - 1.2, 1.0, EASE.out);
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 1180, top: 160, width: 540, padding: '18px 24px', borderRadius: 12, background: '#111116', border: `2px solid ${A.line}` }}>
          <Mono size={18} color={A.dim}>DEPARTURES</Mono>
          {[['LONDON', caught ? 'DELAYED' : 'BOARDING'], ['NEW YORK', 'ON TIME'], ['DENVER', 'ON TIME']].map(([c, s], i) => <div key={c} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: i === 0 && caught ? A.red : A.white }}><span>{c}</span><span>{s}</span></div>)}
        </div>
        <div style={{ position: 'absolute', left: 300, top: 790, width: 90, height: 130, borderRadius: 14, background: '#2a2a33', border: `3px solid ${A.line}` }} />
        <Marcus x={560} y={910} size={480} mood={caught ? 'shock' : 'calm'} cuffs={t > tArr + 0.4} seed={12} />
        <Agent x={lerp(1900, 1020, walk)} y={1000} size={500} flip />
        <Agent x={lerp(2100, 1360, walk)} y={1000} size={460} flip />
        <Stamp x={760} y={330} at={tArr + 0.2} text="ARRESTED" size={80} rot={-8} />
      </AbsoluteFill>
    );
  }
  if (t < tPros - 0.2) {
    const back = t > tEarlier;
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 520, top: 480, transform: 'translate(-50%,-50%)' }}>
          <Worm x={0} y={0} size={260} mood="scared" seed={6} />
          <svg style={{ position: 'absolute', left: -170, top: -170, overflow: 'visible' }} width={340} height={340}><circle cx={170} cy={170} r={150} stroke={A.red} strokeWidth={16} fill="none" opacity={ramp(t, tNot + 0.2, 0.3)} /><line x1={64} y1={276} x2={276} y2={64} stroke={A.red} strokeWidth={16} strokeDasharray={300} strokeDashoffset={300 * (1 - ramp(t, tNot + 0.3, 0.35))} /></svg>
          <div style={{ position: 'absolute', left: 0, top: 230, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}><Label color={A.white} size={34}>NOT FOR WANNACRY</Label></div>
        </div>
        {back && <div style={{ position: 'absolute', left: 1320, top: 440, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', transform: `rotate(${-ramp(t, tEarlier, 1.6, EASE.out) * 720}deg)` }}><Icon name="ph:clock-counter-clockwise-bold" size={200} color={A.white} /></div>
          <div style={{ marginTop: 20, ...fonts.H, fontWeight: 900, fontSize: 64, color: A.white }}>YEARS EARLIER</div>
        </div>}
        {back && t > tTeen && <Pop x={1320} y={750} at={tTeen}><Label color={A.red} size={36} solid>WHEN HE WAS A TEENAGER</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tPrison - 0.2) {
    const steal = ramp(t, tBank + 0.3, 1.4, EASE.inOut);
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 230, top: 160 }}><Label color={A.dim} size={28}><Icon name="ph:scales-fill" size={32} color={A.dim} /> PROSECUTORS SAID</Label></div>
        <div style={{ position: 'absolute', left: 300, top: 330 }}><Panel w={520} pad={36}>
          <Icon name="ph:bank-fill" size={90} color={A.white} />
          <div style={{ marginTop: 10, ...fonts.H, fontWeight: 900, fontSize: 40, color: A.white }}>Online banking</div>
          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: '#16161c', fontFamily: fonts.mono, fontSize: 30, color: A.soft }}>password: ••••••••</div>
        </Panel></div>
        {t > tBank && <div style={{ position: 'absolute', left: lerp(560, 1200, steal), top: lerp(600, 520, steal) - Math.sin(steal * Math.PI) * 140, transform: 'translate(-50%,-50%)' }}><Icon name="ph:key-fill" size={90} color={A.red} /></div>}
        <div style={{ position: 'absolute', left: 1340, top: 520, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: ramp(t, tBank + 0.6, 0.3) }}><Icon name="ph:bug-beetle-fill" size={170} color={A.red} /><Mono size={22} color={A.dim}>MALWARE</Mono></div>
        <Stamp x={1340} y={800} at={tKronos} text="KRONOS" size={84} rot={-6} />
      </AbsoluteFill>
    );
  }
  const bars = ramp(t, tFace - 0.1, 0.5, EASE.in);
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.08)" />
      <Marcus x={960} y={980} size={540} mood="sad" seed={13} />
      <div style={{ position: 'absolute', left: 560, top: lerp(-700, 220, bars), width: 800, height: 700 }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: 'absolute', left: i * 108, top: 0, width: 18, height: 700, borderRadius: 9, background: '#c9c9d1', boxShadow: '0 0 20px rgba(0,0,0,.6)' }} />)}<div style={{ position: 'absolute', left: 0, top: 120, width: 774, height: 18, borderRadius: 9, background: '#c9c9d1' }} /></div>
      {t > tFace + 0.5 && <Pop x={960} y={150} at={tFace + 0.5}><Label color={A.red} size={40} solid>COULD FACE YEARS IN A US PRISON</Label></Pop>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 6 · the verdict
const tPlea = C0(35), tTwo = P(35, 'two charges'), tRegret = P(35, 'regretted'), tProtect = P(35, 'protect people');
const tJuly = C0(36), tJudge = P(36, 'a judge'), tNo = C0(37), tServed = P(37, 'Time already'), tYear = P(37, 'one year');
const tWhy = C0(38), tYoung = P(38, 'how young'), tTurned = P(38, 'turned his life'), tHelped = P(38, 'helped stop'), tToday = C0(39), tSide = P(39, 'on the side');
export const a6NoCaptions: [number, number][] = [[tNo - 0.05, tServed - 0.1]];
export const a6Sfx: SfxEvent[] = [
  { t: tTwo, name: 'impactDeep', vol: 0.3 }, { t: tProtect, name: 'confirm', vol: 0.25 }, { t: tJudge, name: 'swooshSlow', vol: 0.25 },
  { t: tNo, name: 'impactEpic', vol: 0.45, note: 'gavel' }, { t: tYoung - 0.05, name: 'popUi', vol: 0.3 }, { t: tTurned - 0.05, name: 'popUi', vol: 0.3 }, { t: tHelped - 0.05, name: 'popUi', vol: 0.3 },
  { t: tSide, name: 'sparkle', vol: 0.3 },
];
export const A6: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tJuly - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg />
        <Marcus x={560} y={980} size={500} mood={t > tProtect ? 'calm' : 'sad'} seed={14} />
        <div style={{ position: 'absolute', left: 1000, top: 260 }}><Panel w={680} pad={40}>
          <Mono size={22} color={A.dim}>2019</Mono>
          <div style={{ marginTop: 10, ...fonts.H, fontWeight: 900, fontSize: 60, color: A.white, opacity: ramp(t, tPlea + 0.3, 0.3) }}>Pleaded guilty</div>
          {t > tTwo && <div style={{ marginTop: 10, ...fonts.H, fontWeight: 900, fontSize: 48, color: A.red, opacity: ramp(t, tTwo, 0.25) }}>2 charges</div>}
        </Panel></div>
        {t > tRegret && <Pop x={1340} y={640} at={tRegret}><Label color={A.white} size={32}>said he regretted those mistakes</Label></Pop>}
        {t > tProtect && <Pop x={1340} y={760} at={tProtect}><Label color={A.dim} size={30}><Icon name="ph:shield-check-fill" size={34} color={A.white} /> years spent protecting people</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tWhy - 0.2) {
    const bang = t > tNo - 0.15 && t < tNo + 0.25 ? 1 - Math.abs(t - tNo) / 0.25 : 0;
    const noP = t > tNo - 0.05;
    return (
      <AbsoluteFill>
        <GridBg glow={noP ? 'rgba(255,255,255,.05)' : undefined} />
        <div style={{ position: 'absolute', left: 300, top: 780, width: 900, height: 120, borderRadius: 14, background: '#3a2a1c' }} />
        <Judge x={750} y={800} size={460} bang={bang} />
        {!noP && <Pop x={1360} y={360} at={tJudge}><div style={{ textAlign: 'center' }}><Mono size={24} color={A.dim}>JULY 2019</Mono><div style={{ marginTop: 10, ...fonts.H, fontWeight: 900, fontSize: 56, color: A.white }}>The decision</div></div></Pop>}
        {noP && <div style={{ position: 'absolute', left: 1290, top: 330, transform: 'translate(-50%,-50%)' }}><Kinetic at={tNo} size={118} words={[{ w: 'No' }, { w: 'prison.', serif: true, color: A.red }]} /></div>}
        {t > tServed && <Pop x={1290} y={540} at={tServed}><Label color={A.white} size={36}>TIME ALREADY SERVED</Label></Pop>}
        {t > tYear && <Pop x={1290} y={660} at={tYear}><Label color={A.dim} size={32}>+ 1 YEAR SUPERVISED RELEASE</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tToday - 0.2) {
    const R: [number, string, string][] = [[tYoung, 'ph:baby-bold', 'HE WAS YOUNG'], [tTurned, 'ph:arrow-u-up-left-bold', 'TURNED HIS LIFE AROUND'], [tHelped, 'ph:shield-check-fill', 'HELPED STOP WANNACRY']];
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 960, top: 180, transform: 'translateX(-50%)' }}><Kinetic at={tWhy + 0.1} size={64} words={[{ w: "The" }, { w: "judge's" }, { w: 'reasons', serif: true }]} /></div>
        {R.map(([at, ic, lb], i) => { if (t < at - 0.1) return null; const s = springAt(f, fps, at - 0.05, { damping: 14, stiffness: 180 }); return <div key={lb} style={{ position: 'absolute', left: 500 + i * 460, top: 560, width: 400, height: 330, transform: `translate(-50%,-50%) translateY(${(1 - s) * 50}px)`, opacity: clamp(s * 1.6), borderRadius: 24, background: A.panel, border: `2px solid ${i === 2 ? A.red : A.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30, textAlign: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 40, color: A.red }}>{i + 1}</div><Icon name={ic} size={100} color={A.white} /><div style={{ ...fonts.H, fontWeight: 800, fontSize: 32, color: A.white, lineHeight: 1.15 }}>{lb}</div></div>; })}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,255,255,.04)" />
      <Marcus x={720} y={980} size={540} mood="proud" laptop seed={15} />
      <div style={{ position: 'absolute', left: 1320, top: 440, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tSide, { damping: 11, stiffness: 160 })})`, textAlign: 'center' }}>
        <Icon name="ph:shield-check-fill" size={240} color={A.white} style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 10, ...fonts.H, fontWeight: 900, fontSize: 50, color: A.white }}>DEFENDER</div>
      </div>
      <div style={{ position: 'absolute', left: 230, top: 160, opacity: ramp(t, tToday + 0.2, 0.3) }}><Label color={A.dim} size={28}>TODAY · STILL IN CYBERSECURITY</Label></div>
    </AbsoluteFill>
  );
};

// ================================================================ ACT 7 · outro
const tQ = C0(40), tDeed = P(40, 'Should one good deed'), tPast = P(40, 'Or should'), tTell = P(40, 'Tell me'), tSub = C0(41), tNext = P(41, 'next time'), tBye = C0(42), tEnd = C1(42);
export const a7NoCaptions: [number, number][] = [[tBye - 0.05, tEnd + 10]];
export const a7Sfx: SfxEvent[] = [
  { t: tDeed - 0.05, name: 'popUi', vol: 0.3 }, { t: tPast - 0.05, name: 'popUi', vol: 0.3 }, { t: tTell, name: 'notify', vol: 0.3 },
  { t: tSub, name: 'clickModern', vol: 0.4 }, { t: tSub + 0.4, name: 'bell', vol: 0.3 }, { t: tBye, name: 'coins', vol: 0.3 },
];
export const A7: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tSub - 0.2) {
    const cards: [number, string, string, string][] = [[tDeed, 'ph:sparkle-fill', 'WIPE IT OUT', 'one good deed is enough'], [tPast, 'ph:scales-fill', 'THE PAST COUNTS', 'mistakes still matter']];
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.08)" />
        <div style={{ position: 'absolute', left: 960, top: 190, transform: 'translateX(-50%)' }}><Kinetic at={tQ + 0.1} size={76} words={[{ w: 'Your' }, { w: 'verdict?', serif: true, color: A.red }]} /></div>
        {cards.map(([at, ic, a, b], i) => <Pop key={a} x={620 + i * 680} y={520} at={at - 0.05}><div style={{ width: 560, borderRadius: 24, background: A.panel, border: `2px solid ${A.line}`, padding: 40, textAlign: 'center' }}><Icon name={ic} size={110} color={A.white} style={{ margin: '0 auto' }} /><div style={{ marginTop: 18, ...fonts.H, fontWeight: 900, fontSize: 46, color: A.white }}>{a}</div><div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 32, color: A.dim }}>{b}</div></div></Pop>)}
        {t > tTell && <Pop x={960} y={800} at={tTell}><Label color={A.red} size={34} solid><Icon name="ph:chat-circle-dots-fill" size={38} color={A.white} /> TELL ME IN THE COMMENTS</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tBye - 0.2) {
    const subbed = t > tSub + 0.3;
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.08)" />
        <div style={{ position: 'absolute', left: 700, top: 400, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ padding: '22px 44px', borderRadius: 48, background: subbed ? '#1c1c22' : A.red, ...fonts.H, fontWeight: 900, fontSize: 54, color: A.white }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
          <Icon name={subbed ? 'ph:bell-ringing-fill' : 'ph:bell-fill'} size={76} color={A.white} />
        </div>
        {t > tNext && <Pop x={700} y={590} at={tNext}><Label color={A.dim} size={30}>next time: another hacker story</Label></Pop>}
        <Marcus x={1450} y={980} size={480} mood="happy" laptop seed={16} />
      </AbsoluteFill>
    );
  }
  const s = springAt(f, fps, tBye, { damping: 10, stiffness: 170 });
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,255,255,.05)" />
      <div style={{ position: 'absolute', left: 960, top: 360, transform: `translate(-50%,-50%) rotate(${-6 * s}deg) scale(${s})`, padding: '34px 64px', borderRadius: 28, background: A.white, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 190, color: '#111', letterSpacing: '-0.05em' }}>$10.69</div></div>
      <div style={{ position: 'absolute', left: 960, top: 660, transform: 'translateX(-50%)' }}><Kinetic at={tBye + 1.6} size={84} words={[{ w: 'The' }, { w: 'best' }, { w: 'money', serif: true, color: A.red }, { w: 'ever' }, { w: 'spent.' }]} /></div>
      <div style={{ position: 'absolute', left: 960, top: 860, transform: 'translateX(-50%)', opacity: ramp(t, tEnd + 0.3, 0.6) }}><Mono size={28} color={A.dim}>MECHIVIOTECH</Mono></div>
    </AbsoluteFill>
  );
};
