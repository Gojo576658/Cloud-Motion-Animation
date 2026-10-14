// Acts 0–3: red screens in a hospital → over a hundred countries → a 22-year-old, $10.69, then the FBI → title;
// what WannaCry was (ransomware that spreads by itself, a leaked tool, an unpatched world, the NHS); Marcus on
// his week off finds a strange unregistered address and buys it; the kill switch (the burglar who knocks).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S1, TTL } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { DotMap } from '../bf/kit';
import { A, GridBg, Phone, TypeOn, Label, Panel, BigNum, Marcus, Worm, Agent, RansomScreen } from './kit';

const Screen: React.FC<{ x: number; y: number; w: number; children: React.ReactNode }> = ({ x, y, w, children }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - w * 0.3, width: w, height: w * 0.6, borderRadius: w * 0.03, background: '#111116', padding: w * 0.025, boxShadow: '0 30px 70px rgba(0,0,0,.6)' }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: w * 0.012, fontSize: w / 50 }}>{children}</div>
  </div>
);
const JUNK = 'xq7hdkf2l0aposjhw8erqztbv3nmglkwe.com';

// ================================================================ ACT 0 · cold open
const tRed = P(0, 'every computer screen'), tMsg = C0(1), tPay = P(1, 'Pay three hundred'), tWorld = C0(2), tSame = P(2, 'At the same time'), tKid = C0(3), tBed = P(3, 'in his bedroom'), tOff = P(3, 'week off');
const tCash = C0(4), tArrest = C0(5), tFbi = P(5, 'the FBI'), tStory = C0(6), tTitle = C1(6) + 0.35;
export const a0NoCaptions: [number, number][] = [[tCash - 0.05, C1(4) + 0.3], [tTitle - 0.2, S1(0) + 0.3]];
export const a0Sfx: SfxEvent[] = [
  { t: tRed, name: 'error', vol: 0.35 }, { t: tPay, name: 'alarm', vol: 0.15, dur: 1.5 }, { t: tWorld + 0.2, name: 'darkSweep', vol: 0.3 },
  { t: tCash, name: 'coins', vol: 0.3 }, { t: tFbi, name: 'impactDeep', vol: 0.4 }, { t: tTitle - 0.05, name: 'impactEpic', vol: 0.45, note: 'TITLE' },
];
export const A0: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t >= tTitle - 0.25) {
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.1)" />
        <div style={{ position: 'absolute', left: 960, top: 450, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <Kinetic at={tTitle - 0.1} size={170} stagger={0.1} words={[{ w: 'The' }, { w: 'accidental' }, { w: 'hero.', serif: true, color: A.red, br: true }]} />
          <div style={{ marginTop: 30, opacity: ramp(t, tTitle + 0.6, 0.5) }}><Mono size={26} color={A.dim}>$10.69 · ONE DOMAIN · ONE GLOBAL CYBERATTACK</Mono></div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t >= tArrest - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.12)" />
        <Marcus x={760} y={900} size={480} mood={t > tFbi ? 'shock' : 'happy'} cuffs={t > tFbi + 0.4} seed={2} />
        <Agent x={1250} y={920} size={500} flip />
        <Stamp x={960} y={220} at={tArrest + 0.2} text="3 MONTHS LATER" size={64} rot={-4} />
      </AbsoluteFill>
    );
  }
  if (t >= tKid - 0.2) {
    const cash = t > tCash - 0.1;
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 140, top: 640, width: 900, height: 300, borderRadius: 18, background: '#16161c' }} />
        <Marcus x={560} y={900} size={520} mood={cash ? 'happy' : 'focus'} laptop seed={3} />
        {[[tKid + 0.6, '22 YEARS OLD', 170], [tBed, 'IN HIS BEDROOM', 270], [tOff, 'ON HIS WEEK OFF', 370]].map(([at, lb, y]) => t > (at as number) - 0.1 && !cash && <div key={lb as string} style={{ position: 'absolute', left: 1120, top: y as number }}><Pop x={0} y={0} at={(at as number) - 0.05}><div style={{ transform: 'translate(50%,0)' }}><Label color={A.white} size={46}>{lb as string}</Label></div></Pop></div>)}
        {cash && <div style={{ position: 'absolute', left: 1360, top: 470, transform: `translate(-50%,-50%) rotate(-6deg) scale(${springAt(f, fps, tCash, { damping: 9, stiffness: 180 })})`, padding: '30px 54px', borderRadius: 26, background: A.white, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 170, color: '#111', letterSpacing: '-0.05em' }}>$10.69</div></div>}
      </AbsoluteFill>
    );
  }
  if (t >= tWorld - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ filter: 'hue-rotate(140deg) saturate(1.4)' }}><DotMap x={960} y={560} w={1600} lit={ramp(t, tWorld, C1(2) - tWorld, EASE.inOut)} /></div>
        {t > tSame && <div style={{ position: 'absolute', left: 960, top: 930, transform: 'translateX(-50%)' }}><Kinetic at={tSame} size={66} words={[{ w: 'At' }, { w: 'the' }, { w: 'same' }, { w: 'time.', serif: true, color: A.red }]} /></div>}
        <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.red} size={30}>100+ COUNTRIES</Label></div>
      </AbsoluteFill>
    );
  }
  // ---- hospital: every screen red, then the ransom note
  const reds = (i: number) => ramp(t, tRed + i * 0.12, 0.15) > 0.5;
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.08)" />
      {t < tMsg - 0.1 ? <>
        <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.white} size={28}><Icon name="ph:first-aid-kit-fill" size={34} color={A.white} /> A HOSPITAL IN ENGLAND</Label></div>
        {[[480, 400, 420], [1000, 380, 420], [1500, 410, 380], [700, 760, 360], [1250, 770, 360]].map(([x, y, w], i) => <Screen key={i} x={x} y={y} w={w}>{reds(i) ? <RansomScreen /> : <AbsoluteFill style={{ background: '#1b2433', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:heartbeat-bold" size={w * 0.25} color="#7aa0c8" /></AbsoluteFill>}</Screen>)}
      </> : <>
        <Screen x={960} y={450} w={1000}><RansomScreen at={tMsg} /></Screen>
        {t > tPay && <Pop x={960} y={840} at={tPay}><Label color={A.red} size={36} solid>$300 IN BITCOIN, OR LOSE EVERYTHING</Label></Pop>}
      </>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 1 · WannaCry
const tName = C0(7), tRansom = P(7, 'ransomware'), tHostage = P(7, 'holds them hostage'), tWorse = C0(8), tNoClick = P(8, "didn't wait"), tSpread = P(8, 'spread by itself');
const tTool = C0(9), tNSA = P(9, 'National Security'), tLeak = P(9, 'Shadow Brokers'), tFix = C0(10), tNever = P(10, 'never installed'), tOld = P(10, 'so old');
const tTore = C0(11), t200 = P(11, 'More than two hundred'), tFact = P(11, 'Factories'), tTrain = P(11, 'Train stations'), tPhoneCo = P(11, 'Phone companies');
const tNHS = C0(12), tThird = P(12, 'About a third'), t19k = P(12, 'nineteen thousand');
export const a1NoCaptions: [number, number][] = [];
export const a1Sfx: SfxEvent[] = [
  { t: tRansom, name: 'lock', vol: 0.35 }, { t: tSpread, name: 'glitch', vol: 0.3 }, { t: tLeak, name: 'paperSlide', vol: 0.3 },
  { t: tFix, name: 'confirm', vol: 0.3 }, { t: tNever, name: 'error', vol: 0.3 }, { t: t200, name: 'dataLoad', vol: 0.2, dur: 2 }, { t: t19k, name: 'impactDeep', vol: 0.35 },
];
export const A1: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tWorse - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 960, top: 140, transform: 'translateX(-50%)' }}><Kinetic at={tName + 0.1} size={110} words={[{ w: 'Wanna' }, { w: 'Cry.', serif: true, color: A.red }]} /></div>
        <Worm x={520} y={600} size={320} mood="cry" seed={1} />
        <div style={{ position: 'absolute', left: 900, top: 420, display: 'grid', gridTemplateColumns: 'repeat(4, 150px)', gap: 24 }}>
          {Array.from({ length: 8 }, (_, i) => { const locked = t > tHostage + i * 0.1; return <div key={i} style={{ position: 'relative', textAlign: 'center' }}><Icon name="ph:file-fill" size={110} color={locked ? '#3a3a44' : A.white} style={{ margin: '0 auto' }} />{locked && <div style={{ position: 'absolute', left: '50%', top: 34, transform: 'translateX(-50%)' }}><Icon name="ph:lock-key-fill" size={50} color={A.red} /></div>}</div>; })}
        </div>
        {t > tRansom && <Pop x={1240} y={340} at={tRansom}><Label color={A.red} size={34}>RANSOMWARE</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tTool - 0.2) {
    const pcs = Array.from({ length: 32 }, (_, i) => ({ x: 360 + (i % 8) * 170, y: 330 + Math.floor(i / 8) * 150 }));
    const reach = (i: number) => (i === 0 ? tSpread : tSpread + 0.15 + (Math.abs((i % 8) - 0) + Math.floor(i / 8)) * 0.35);
    return (
      <AbsoluteFill>
        <GridBg />
        {pcs.map((p, i) => { const hit = t > reach(i); return <div key={i} style={{ position: 'absolute', left: p.x - 60, top: p.y - 40, width: 120, height: 80, borderRadius: 8, background: hit ? '#7a0010' : '#16161c', border: `2px solid ${hit ? A.red : A.line}` }}>{hit && <div style={{ position: 'absolute', left: 60, top: 40 }}><Worm x={0} y={0} size={56} seed={i} /></div>}</div>; })}
        {t > tNoClick && <div style={{ position: 'absolute', left: 230, top: 120 }}><Pop x={0} y={0} at={tNoClick}><div style={{ transform: 'translate(50%,0)' }}><Label color={A.white} size={34}><Icon name="ph:cursor-click-bold" size={36} color={A.white} /> NO CLICK NEEDED</Label></div></Pop></div>}
      </AbsoluteFill>
    );
  }
  if (t < tFix - 0.2) {
    const out = ramp(t, tLeak, 1.2, EASE.out);
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 300, top: 300, width: 520, height: 520, borderRadius: 40, background: '#16161c', border: `4px solid ${A.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Icon name="ph:vault-fill" size={200} color={A.soft} /><Mono size={22} color={A.dim}>{t > tNSA ? 'NSA TOOLS (REPORTEDLY)' : 'SECRET HACKING TOOLS'}</Mono>
        </div>
        <div style={{ position: 'absolute', left: lerp(560, 1260, out), top: lerp(560, 460, out), transform: `translate(-50%,-50%) rotate(${lerp(0, -8, out)}deg)`, padding: '30px 40px', borderRadius: 16, background: A.white, opacity: ramp(t, tTool + 0.5, 0.3) }}>
          <Mono size={18} color="#555">EXPLOIT</Mono>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 64, color: '#111', letterSpacing: '-0.03em' }}>EternalBlue</div>
        </div>
        {t > tLeak && <Pop x={1260} y={690} at={tLeak}><Label color={A.red} size={32}>LEAKED ONLINE · APRIL 2017</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tTore - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 260, top: 300 }}><Panel w={560} pad={40}>
          <Mono size={22} color={A.dim}>MARCH 2017</Mono>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 20 }}><Icon name="ph:check-circle-fill" size={70} color={A.white} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 52, color: A.white }}>Fix released</div></div>
        </Panel></div>
        <div style={{ position: 'absolute', left: 980, top: 260, display: 'grid', gridTemplateColumns: 'repeat(4, 150px)', gap: 20 }}>
          {Array.from({ length: 12 }, (_, i) => { const bad = t > tNever && i % 5 !== 0; const old = t > tOld && i % 4 === 1; return <div key={i} style={{ height: 110, borderRadius: 10, background: '#16161c', border: `2px solid ${bad ? A.red : A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, opacity: ramp(t, tFix + i * 0.04, 0.3) }}><Icon name={old ? 'ph:desktop-tower-bold' : 'ph:desktop-bold'} size={50} color={bad ? A.red : A.white} /><Mono size={12} color={bad ? A.red : A.dim}>{old ? 'TOO OLD' : bad ? 'NOT UPDATED' : 'UPDATED'}</Mono></div>; })}
        </div>
      </AbsoluteFill>
    );
  }
  if (t < tNHS - 0.2) {
    const icons: [number, string, string][] = [[tFact, 'ph:factory-fill', 'FACTORIES'], [tTrain, 'ph:train-fill', 'TRAIN STATIONS'], [tPhoneCo, 'ph:cell-signal-full-bold', 'PHONE COMPANIES']];
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.1)" />
        <div style={{ position: 'absolute', left: 960, top: 330, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><BigNum to={200000} at={t200} d={1.6} suffix="+" size={190} /><div style={{ marginTop: 18 }}><Mono size={26} color={A.dim}>COMPUTERS HIT</Mono></div></div>
        {icons.map(([at, ic, lb], i) => <Pop key={lb} x={520 + i * 440} y={720} at={at - 0.05}><div style={{ textAlign: 'center' }}><Icon name={ic} size={120} color={A.red} style={{ margin: '0 auto' }} /><div style={{ marginTop: 12, ...fonts.H, fontWeight: 800, fontSize: 34, color: A.white }}>{lb}</div></div></Pop>)}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.1)" />
      <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.white} size={30}><Icon name="ph:first-aid-kit-fill" size={34} color={A.white} /> BRITAIN'S NATIONAL HEALTH SERVICE</Label></div>
      <div style={{ position: 'absolute', left: 300, top: 320, display: 'grid', gridTemplateColumns: 'repeat(6, 70px)', gap: 16 }}>{Array.from({ length: 18 }, (_, i) => { const hit = t > tThird && i % 3 === 0; return <div key={i} style={{ width: 70, height: 70, borderRadius: 12, background: hit ? A.red : '#16161c', border: `2px solid ${hit ? A.red : A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:hospital-fill" size={40} color={hit ? A.white : '#4a4a55'} /></div>; })}</div>
      {t > tThird && <div style={{ position: 'absolute', left: 300, top: 640 }}><Label color={A.red} size={32}>ABOUT 1 IN 3 HOSPITAL TRUSTS HIT</Label></div>}
      <div style={{ position: 'absolute', left: 1360, top: 470, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: ramp(t, t19k - 0.2, 0.3) }}><BigNum to={19000} at={t19k} d={1.2} prefix="~" size={150} /><div style={{ marginTop: 16 }}><Mono size={24} color={A.dim}>APPOINTMENTS CANCELLED</Mono></div></div>
    </AbsoluteFill>
  );
};

// ================================================================ ACT 2 · the accidental hero
const tTown = C0(13), tMarcus = P(13, 'Marcus Hutchins'), tSelf = C0(14), tApart = P(14, 'taking malware apart'), tLunch = C0(15), tNews = P(15, 'saw the news'), tCopy = P(15, 'got hold');
const tInside = C0(16), tVisit = P(16, 'tried to visit'), tJumble = P(16, 'A long'), tNobody = C0(17), tBuy = C0(18), tBought = P(18, 'So Marcus bought it'), tPrice = P(18, 'For ten');
export const a2NoCaptions: [number, number][] = [];
export const a2Sfx: SfxEvent[] = [
  { t: tTown, name: 'swooshSlow', vol: 0.25 }, { t: tNews, name: 'notification', vol: 0.3 }, { t: tCopy, name: 'dataLoad', vol: 0.2, dur: 1 },
  { t: tJumble, name: 'typing', vol: 0.25, dur: 2 }, { t: tNobody, name: 'mysteryHit', vol: 0.35 }, { t: tBought, name: 'clickModern', vol: 0.4 }, { t: tPrice, name: 'coins', vol: 0.3 },
];
export const A2: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tLunch - 0.2) {
    const seaside = t < tSelf - 0.2;
    return (
      <AbsoluteFill>
        <GridBg />
        {seaside && <svg style={{ position: 'absolute', left: 0, top: 760 }} width={1920} height={200}>{[0, 1, 2].map((k) => <path key={k} d={`M0 ${40 + k * 40} ${Array.from({ length: 13 }, (_, i) => `Q ${i * 160 + 80} ${20 + k * 40 + Math.sin(t * 2 + i + k) * 12} ${(i + 1) * 160} ${40 + k * 40}`).join(' ')}`} stroke={k ? '#2a2a33' : A.soft} strokeWidth={4} fill="none" opacity={1 - k * 0.3} />)}</svg>}
        {seaside && <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.white} size={28}><Icon name="ph:waves-bold" size={34} color={A.white} /> A SEASIDE TOWN, ENGLAND</Label></div>}
        <Marcus x={seaside ? 1300 : 640} y={seaside ? 820 : 960} size={seaside ? 420 : 520} mood={seaside ? 'happy' : 'focus'} laptop={!seaside} seed={4} />
        {seaside && t > tMarcus && <Pop x={1300} y={240} at={tMarcus}><Label color={A.red} size={44} solid>MARCUS HUTCHINS</Label></Pop>}
        {!seaside && <>
          <Pop x={1300} y={300} at={tSelf + 0.3}><Label color={A.white} size={40}>22 · MOSTLY SELF-TAUGHT</Label></Pop>
          {t > tApart && <div style={{ position: 'absolute', left: 1300, top: 600, transform: 'translate(-50%,-50%)' }}><Worm x={0} y={0} size={170} mood="scared" seed={5} /><div style={{ position: 'absolute', left: -150, top: -150, width: 300, height: 300, borderRadius: '50%', border: `10px solid ${A.white}` }} /><div style={{ position: 'absolute', left: 90, top: 90, width: 30, height: 170, borderRadius: 14, background: A.white, transform: 'rotate(-45deg)', transformOrigin: '0 0' }} /></div>}
        </>}
      </AbsoluteFill>
    );
  }
  if (t < tInside - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg />
        <Marcus x={520} y={980} size={480} mood={t > tNews ? 'shock' : 'happy'} seed={6} />
        {t < tNews && <div style={{ position: 'absolute', left: 470, top: 420 }}><Icon name="ph:hamburger-fill" size={110} color="#d9a36a" /></div>}
        <Phone x={1300} y={560} w={360}>
          <AbsoluteFill style={{ padding: '90px 24px', color: A.white }}>
            {t > tNews && <div style={{ padding: 18, borderRadius: 16, background: A.red, transform: `scale(${springAt(f, fps, tNews, { damping: 13, stiffness: 200 })})` }}><Mono size={12} color={A.white}>BREAKING</Mono><div style={{ ...fonts.H, fontWeight: 900, fontSize: 26, lineHeight: 1.1, marginTop: 6 }}>Global cyberattack hits hospitals</div></div>}
            {t > tCopy && <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, background: '#16161c', opacity: ramp(t, tCopy, 0.3) }}><Icon name="ph:folder-simple-lock-fill" size={44} color={A.red} /><div style={{ ...fonts.H, fontWeight: 700, fontSize: 22 }}>wannacry_sample</div></div>}
          </AbsoluteFill>
        </Phone>
      </AbsoluteFill>
    );
  }
  if (t < tBuy - 0.2) {
    const nobody = t > tNobody - 0.1;
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 260, top: 230 }}><Panel w={1400} pad={40}>
          <Mono size={20} color={A.dim}>INSIDE WANNACRY · BEFORE IT ATTACKS</Mono>
          <div style={{ marginTop: 24, fontFamily: fonts.mono, fontSize: 30, color: A.soft, lineHeight: 1.8 }}>
            <div style={{ opacity: ramp(t, tInside + 0.3, 0.3) }}>step 1: <span style={{ color: A.white }}>visit this address</span> →</div>
            <div style={{ marginTop: 8, padding: '12px 18px', borderRadius: 10, background: '#16161c', border: `2px solid ${nobody ? A.red : A.line}`, color: A.white, fontWeight: 700 }}>{t > tJumble - 0.3 ? <TypeOn text={JUNK} at={tJumble - 0.3} cps={26} /> : '…'}</div>
            <div style={{ marginTop: 8, opacity: ramp(t, tVisit + 0.8, 0.3) }}>step 2: <span style={{ color: A.red }}>spread & lock files</span></div>
          </div>
        </Panel></div>
        {nobody && <Pop x={960} y={820} at={tNobody}><Label color={A.red} size={48} solid>OWNER: NOBODY</Label></Pop>}
      </AbsoluteFill>
    );
  }
  const bought = t > tBought + 0.5;
  return (
    <AbsoluteFill>
      <GridBg />
      <div style={{ position: 'absolute', left: 260, top: 260 }}><Panel w={1000} pad={44}>
        <Mono size={20} color={A.dim}>DOMAIN SEARCH</Mono>
        <div style={{ marginTop: 18, padding: '18px 22px', borderRadius: 12, background: '#16161c', fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: A.white }}>{JUNK}</div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 64, color: A.white }}>$10.69</div>
          <div style={{ padding: '18px 36px', borderRadius: 14, background: bought ? A.white : A.red, ...fonts.H, fontWeight: 900, fontSize: 34, color: bought ? '#111' : A.white, transform: `scale(${t > tBought && t < tBought + 0.15 ? 0.94 : 1})` }}>{bought ? 'PURCHASED ✓'.replace(' ✓', '') : 'ADD TO CART'}</div>
        </div>
      </Panel></div>
      <Marcus x={1500} y={910} size={400} mood={bought ? 'happy' : 'focus'} laptop seed={7} />
    </AbsoluteFill>
  );
};

// ================================================================ ACT 3 · the kill switch
const tSlow = C0(19), tWhy = C0(20), tNoAns = P(20, 'If nobody answered'), tSome = P(20, 'But if someone'), tSwOff = C0(21);
const tBurglar = C0(22), tNoHome = P(22, "If nobody's home"), tAnswers = P(22, 'If someone answers'), tDoor = P(22, 'Marcus had just answered'), tEvery = P(22, 'For every computer');
const tAcc = C0(23), tHuss = C0(24), tNewV = P(24, 'New versions'), tWave = P(24, 'the biggest wave'), tSub = C0(25), tLess = P(25, 'It costs');
export const a3NoCaptions: [number, number][] = [];
export const a3Sfx: SfxEvent[] = [
  { t: tSlow, name: 'reverseWhoosh', vol: 0.3 }, { t: tNoAns, name: 'error', vol: 0.3 }, { t: tSwOff, name: 'powerUp', vol: 0.3, rate: 0.7 },
  { t: tBurglar + 0.4, name: 'tap', vol: 0.4, note: 'knock' }, { t: tBurglar + 0.7, name: 'tap', vol: 0.4 }, { t: tDoor, name: 'door', vol: 0.4 }, { t: tDoor + 0.6, name: 'whooshQuick', vol: 0.35, note: 'worm runs' },
  { t: tSub, name: 'clickModern', vol: 0.4 }, { t: tSub + 0.4, name: 'bell', vol: 0.3 },
];
export const A3: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tWhy - 0.2) {
    const pts = Array.from({ length: 40 }, (_, i) => { const x = i / 39; const y = x < 0.6 ? Math.pow(x / 0.6, 2) : 1 - (x - 0.6) * 0.25; return [260 + x * 1400, 840 - y * 520]; });
    const k = Math.floor(ramp(t, tSlow - 0.4, 2.2, EASE.inOut) * 39);
    return (
      <AbsoluteFill>
        <GridBg />
        <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}><polyline points={pts.slice(0, k + 1).map((p) => p.join(',')).join(' ')} stroke={A.red} strokeWidth={8} fill="none" strokeLinejoin="round" /></svg>
        <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.dim} size={26}>NEW INFECTIONS</Label></div>
        {k > 24 && <Pop x={1400} y={260} at={tSlow + 0.8}><Label color={A.white} size={40}>…SLOWING DOWN</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tBurglar - 0.2) {
    const off = t > tSwOff - 0.1;
    return (
      <AbsoluteFill>
        <GridBg />
        <Worm x={460} y={580} size={300} mood={off ? 'off' : t > tSome ? 'scared' : 'mean'} seed={2} />
        <div style={{ position: 'absolute', left: 780, top: 400, width: 900 }}>
          <div style={{ ...fonts.H, fontWeight: 800, fontSize: 48, color: A.white, opacity: ramp(t, tWhy + 0.4, 0.3) }}>Anyone at that address?</div>
          <div style={{ marginTop: 40, display: 'flex', gap: 30 }}>
            <div style={{ flex: 1, padding: 30, borderRadius: 18, background: '#16161c', border: `2px solid ${A.red}`, opacity: ramp(t, tNoAns - 0.1, 0.3) }}><Mono size={20} color={A.dim}>NO ANSWER</Mono><div style={{ ...fonts.H, fontWeight: 900, fontSize: 44, color: A.red }}>→ ATTACK</div></div>
            <div style={{ flex: 1, padding: 30, borderRadius: 18, background: off ? A.white : '#16161c', border: `2px solid ${A.white}`, opacity: ramp(t, tSome - 0.1, 0.3) }}><Mono size={20} color={off ? '#555' : A.dim}>SOMEONE ANSWERS</Mono><div style={{ ...fonts.H, fontWeight: 900, fontSize: 44, color: off ? '#111' : A.white }}>{off ? '→ SWITCH OFF' : '→ ?'}</div></div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < tAcc - 0.2) {
    const open = t > tDoor;
    const flee = ramp(t, tDoor + 0.5, 0.8, EASE.in);
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 1000, top: 260, width: 360, height: 640, background: '#1c1c22', border: `8px solid ${A.line}`, borderBottom: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#2a2a33', transformOrigin: '0 50%', transform: `perspective(900px) rotateY(${open ? -70 : 0}deg)` }}><div style={{ position: 'absolute', right: 30, top: 320, width: 22, height: 22, borderRadius: 11, background: A.soft }} /></div>
          {open && <div style={{ position: 'absolute', left: 180, top: 640 }}><Marcus x={0} y={0} size={460} mood="happy" seed={8} /></div>}
        </div>
        <div style={{ position: 'absolute', left: 1000, top: 900, width: 1000, height: 10, background: A.line }} />
        <Worm x={lerp(780, -300, flee)} y={760 - Math.sin(flee * 3.1) * 60} size={220} mood={open ? 'scared' : 'mean'} flip={flee > 0} seed={3} />
        {t > tBurglar + 0.4 && t < tDoor && <Pop x={860} y={540} at={tBurglar + 0.4}><Label color={A.white} size={34}>knock knock</Label></Pop>}
        {t > tEvery && <div style={{ position: 'absolute', left: 230, top: 160 }}><Kinetic at={tEvery} size={60} align="left" words={[{ w: 'For' }, { w: 'every' }, { w: 'computer', br: true }, { w: 'in' }, { w: 'the' }, { w: 'world.', serif: true, color: A.red }]} /></div>}
      </AbsoluteFill>
    );
  }
  if (t < tSub - 0.2) {
    const huss = t > tHuss - 0.1;
    return (
      <AbsoluteFill>
        <GridBg />
        {!huss ? <>
          <Marcus x={760} y={980} size={500} mood="shock" seed={9} />
          <Pop x={1300} y={420} at={tAcc + 0.4}><Label color={A.white} size={50}>"at first, it was an accident"</Label></Pop>
        </> : <>
          <div style={{ position: 'absolute', left: 300, top: 300, display: 'flex', gap: 60 }}>
            {[['MARCUS HUTCHINS', 'England'], ['DARIEN HUSS', 'another researcher']].map(([n, w]) => <Panel key={n} w={520} pad={34}><Icon name="ph:user-circle-fill" size={90} color={A.white} /><div style={{ marginTop: 12, ...fonts.H, fontWeight: 900, fontSize: 40, color: A.white }}>{n}</div><Mono size={18} color={A.dim}>{w}</Mono></Panel>)}
          </div>
          {t > tNewV && <div style={{ position: 'absolute', left: 300, top: 720, display: 'flex', alignItems: 'center', gap: 30 }}>{[0, 1, 2].map((i) => <Worm key={i} x={60 + i * 120} y={60} size={90} seed={i} />)}<div style={{ marginLeft: 400 }}><Label color={A.dim} size={30}>new versions came later</Label></div></div>}
          {t > tWave && <Pop x={1400} y={760} at={tWave}><Label color={A.red} size={36} solid>BIGGEST WAVE: STOPPED</Label></Pop>}
        </>}
      </AbsoluteFill>
    );
  }
  const subbed = t > tSub + 0.3;
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.08)" />
      <div style={{ position: 'absolute', left: 620, top: 440, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ padding: '24px 48px', borderRadius: 50, background: subbed ? '#1c1c22' : A.red, ...fonts.H, fontWeight: 900, fontSize: 56, color: A.white }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
        <Icon name={subbed ? 'ph:bell-ringing-fill' : 'ph:bell-fill'} size={80} color={A.white} />
      </div>
      {t > tLess && <div style={{ position: 'absolute', left: 1360, top: 440, transform: `translate(-50%,-50%) rotate(8deg) scale(${springAt(f, fps, tLess, { damping: 10, stiffness: 200 })})`, padding: '20px 36px', borderRadius: 18, background: A.white }}><Mono size={20} color="#555">COSTS LESS THAN</Mono><div style={{ ...fonts.H, fontWeight: 900, fontSize: 80, color: '#111', letterSpacing: '-0.04em', position: 'relative' }}>$10.69</div></div>}
    </AbsoluteFill>
  );
};
