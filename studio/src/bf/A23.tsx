// Acts 2–3: daily instructions arrive as update files; the form that should have 20 boxes has 21; Gus counts,
// reaches for box 21, grabs memory that isn't his, crash, boot loop. Then the world map goes blue, the four
// things that stopped, 8.5 million, and why less than one percent was enough.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, W } from './ttime';
import { useTF, Pop, Count, Kinetic, Mono } from '../tg/kit';
import { B, Gus, Monitor, BSOD, BootDots, DotMap, Form, Tag, Card, Night } from './kit';

// ================================================================ ACT 2 · twenty-one
const tTricks = C0(15), tNew = P(15, 'new instructions'), tSends = C0(16), tNoRe = P(16, 'No restart'), tNoBtn = P(16, 'No button'), tArrive = P(16, 'They just arrive');
const tDeliv = C0(17), tForm = P(17, 'comes with a form'), tKnows = P(17, 'knows exactly'), tTwenty = P(18, 'twenty boxes');
const t409 = C0(19), tWent = P(19, 'a new update'), t21 = P(19, 'twenty-one');
const COUNT = [W(20, 0), W(20, 1), W(20, 2), W(20, 3)], tOne = W(21, 1);
const tReach = C0(22), tNotHis = P(22, "didn't belong"), tFatal = P(22, 'fatal'), tCrash = C0(23);
const tCruel = C0(24), tRestart = P(24, 'restarted'), tWoke = P(24, 'woke up first'), tRead = P(24, 'read the same'), tAgain = [P(25, 'crashed again'), P(25, 'And again'), W(25, 5)];
export const a2NoCaptions: [number, number][] = [[tCrash - 0.05, C1(23) + 0.5]];
export const a2Sfx: SfxEvent[] = [
  { t: tTricks + 0.2, name: 'pagesFast', vol: 0.3, note: 'calendar' }, { t: tNew, name: 'paperSlide', vol: 0.3 },
  { t: tSends - 0.05, name: 'sweepDigital', vol: 0.35 }, { t: tSends + 0.6, name: 'dataLoad', vol: 0.25, dur: 3 }, { t: tNoRe - 0.05, name: 'popUi', vol: 0.3 }, { t: tNoBtn - 0.05, name: 'popUi', vol: 0.3 }, { t: tArrive, name: 'notify', vol: 0.3 },
  { t: tDeliv + 0.3, name: 'hitSoft', vol: 0.4, note: 'package lands' }, { t: tForm, name: 'paperSlide', vol: 0.35 }, { t: tTwenty, name: 'confirm', vol: 0.35 },
  { t: t409 - 0.05, name: 'clockSpin', vol: 0.35 }, { t: tWent, name: 'hitSoft', vol: 0.4 }, { t: t21, name: 'glitchElectric', vol: 0.4, note: 'box 21' },
  ...COUNT.map((x) => ({ t: x, name: 'tick' as const, vol: 0.45 })), { t: tOne, name: 'mysteryHit', vol: 0.45 },
  { t: tReach + 0.3, name: 'suspenseStrings', vol: 0.3, dur: 3 }, { t: tNotHis, name: 'glitchStatic', vol: 0.35 }, { t: tFatal, name: 'heartbeat', vol: 0.5 },
  { t: tCrash - 0.03, name: 'glitchBreak', vol: 0.55 }, { t: tCrash, name: 'impactBig', vol: 0.5 },
  { t: tRestart, name: 'powerUp', vol: 0.3 }, { t: tWoke, name: 'chime', vol: 0.25 }, { t: tRead, name: 'paperSlide', vol: 0.3 },
  ...tAgain.map((x, i) => ({ t: x, name: 'error' as const, vol: 0.35 + i * 0.05 })), { t: C1(25) + 0.1, name: 'dizzy', vol: 0.3 },
];
const Pkg: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 150 * s, height: 120 * s, transform: 'translate(-50%,-50%)', borderRadius: 10 * s, background: 'linear-gradient(160deg,#d9a866,#a8763c)', boxShadow: '0 20px 40px rgba(0,0,0,.45)' }}>
    <div style={{ position: 'absolute', left: '44%', top: 0, width: '12%', height: '100%', background: '#e8d3a8' }} />
    <div style={{ position: 'absolute', left: '10%', top: '30%', ...fonts.H, fontWeight: 900, fontSize: 18 * s, color: '#5a3a18' }}>UPDATE</div>
  </div>
);
const Basement: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0d1424,#060a14)' }} />
    <div style={{ position: 'absolute', left: 60, top: 50 }}><Mono size={26} color={B.amber}>KERNEL · GUS'S DESK</Mono></div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 880, height: 200, background: '#0a0f1c', borderTop: '4px solid #1b2a4c' }} />
    <div style={{ position: 'absolute', left: 1180, top: 0, width: 4, height: 300, background: '#2a3550' }} />
    <div style={{ position: 'absolute', left: 1120, top: 300, width: 124, height: 50, borderRadius: '0 0 60px 60px', background: '#3a4560', boxShadow: '0 30px 120px rgba(255,236,200,.25)' }} />
  </>
);
export const A2: React.FC = () => {
  const { f, fps, t } = useTF();
  // ---- new tricks every day
  if (t < tSends - 0.2) {
    const day = Math.floor(ramp(t, tTricks + 0.2, 3, EASE.inOut) * 6);
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 300, top: 260, width: 360, height: 400, borderRadius: 20, background: B.paper, boxShadow: '0 30px 70px rgba(0,0,0,.5)', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ height: 90, background: B.red, ...fonts.H, fontWeight: 900, fontSize: 44, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JULY</div>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 200, color: '#1a1a22', marginTop: 10 }}>{13 + day}</div>
        </div>
        {Array.from({ length: day + 1 }, (_, i) => <Pop key={i} x={820 + (i % 3) * 170} y={300 + Math.floor(i / 3) * 190} at={tTricks + 0.2 + i * 0.5}><div style={{ padding: 18, borderRadius: 20, background: 'rgba(255,59,78,.12)', border: `2px solid ${B.red}66` }}><Icon name={['ph:bug-beetle-fill', 'ph:bug-fill', 'ph:skull-fill', 'ph:bug-droid-fill', 'ph:virus-fill', 'ph:warning-diamond-fill'][i % 6]} size={90} color={B.red} /></div></Pop>)}
        <Gus x={1600} y={940} size={420} mood={t > tNew ? 'focus' : 'neutral'} arm={t > tNew ? 'clip' : 'idle'} look={-1} seed={6} />
        {t > tNew && <Pop x={1600} y={380} at={tNew}><Tag color={B.amber}>NEW INSTRUCTIONS · DAILY</Tag></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- updates fly out to millions of computers
  if (t < tDeliv - 0.2) {
    const r = rng(21);
    const pcs = Array.from({ length: 40 }, (_, i) => ({ x: 820 + (i % 8) * 125, y: 230 + Math.floor(i / 8) * 150, d: r() }));
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 220, top: 420, width: 300, height: 220, borderRadius: 30, background: 'linear-gradient(160deg,#1f3f78,#0b1630)', border: `3px solid ${B.blue2}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 0 60px ${B.blue}55` }}>
          <Icon name="ph:cloud-arrow-down-fill" size={110} color={B.blue2} /><Mono size={20} color={B.white}>CROWDSTRIKE CLOUD</Mono>
        </div>
        {pcs.map((p, i) => { const u = ((t - tSends - 0.4 - p.d * 1.2) / 0.9) % 2.4; const fly = u > 0 && u < 1; return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: p.x - 40, top: p.y - 30, width: 80, height: 54, borderRadius: 6, background: '#1a2a4a', border: `2px solid ${u > 1 && u < 1.4 ? B.green : '#2c4170'}` }} />
            {fly && <div style={{ position: 'absolute', left: lerp(520, p.x, EASE.inOut(u)) - 12, top: lerp(530, p.y, EASE.inOut(u)) - 14 - Math.sin(u * Math.PI) * 80, width: 24, height: 28, borderRadius: 4, background: B.white, boxShadow: `0 0 14px ${B.white}` }} />}
          </React.Fragment>); })}
        {[[tNoRe, 'NO RESTART', 300], [tNoBtn, 'NO BUTTON TO CLICK', 760], [tArrive, 'THEY JUST ARRIVE', 1300]].map(([at, lb, x]) => <Pop key={lb as string} x={x as number} y={960} at={(at as number) - 0.05}><Tag color={lb === 'THEY JUST ARRIVE' ? B.amber : B.white}>{lb as string}</Tag></Pop>)}
      </AbsoluteFill>
    );
  }
  // ---- the form: 20 boxes, then 4:09 and 21
  if (t < tReach - 0.2) {
    const drop1 = ramp(t, tDeliv, 0.5, EASE.in), second = t > tWent - 0.2;
    const drop2 = ramp(t, tWent - 0.2, 0.5, EASE.in);
    const hi = t < COUNT[0] ? (t > tTwenty ? 20 : 0) : COUNT.filter((x) => t > x).length + 16;
    const counting = t > COUNT[0] - 0.2;
    return (
      <AbsoluteFill>
        <Basement />
        {!second && t < tForm && <Pkg x={1500} y={lerp(-100, 830, drop1)} s={1.3} />}
        {second && t < t21 - 0.3 && <Pkg x={1500} y={lerp(-100, 830, drop2)} s={1.3} />}
        {!second && <Form x={760} y={520} at={tForm - 0.05} n={20} hi={hi} w={620} title="FORM 291 · EXPECTED: 20" />}
        {second && t > t21 - 0.3 && <Form x={720} y={520} at={t21 - 0.3} n={21} hi={counting ? hi : 0} bad={t > tOne ? 1 : 0} w={620} title="FORM 291 · NEW UPDATE" />}
        <Gus x={1560} y={900} size={460} mood={t > tOne ? 'confused' : counting ? 'focus' : t > tTwenty ? 'proud' : 'neutral'} arm={counting ? 'point' : t > tKnows ? 'clip' : 'idle'} look={-1} talk={counting && t < C1(21) ? Math.abs(Math.sin(t * 14)) : 0} seed={7} clipCount={12} />
        {t > tTwenty && !second && <Pop x={760} y={160} at={tTwenty}><Tag color={B.green}><Icon name="ph:check-bold" size={34} color={B.green} /> EXPECTS 20</Tag></Pop>}
        {t > t409 - 0.1 && t < t21 + 0.4 && <Pop x={760} y={200} at={t409 - 0.1} out={t21 + 0.2}><div style={{ textAlign: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 150, color: B.white, letterSpacing: '-0.04em' }}>04:09</div><Mono size={26} color={B.blue2}>UTC · JULY 19</Mono></div></Pop>}
        {t > tOne && <div style={{ position: 'absolute', left: 1600, top: 330, ...fonts.H, fontWeight: 900, fontSize: 160, color: B.red, transform: `scale(${springAt(f, fps, tOne, { damping: 8, stiffness: 240 })})`, textShadow: `0 0 40px ${B.red}` }}>?</div>}
      </AbsoluteFill>
    );
  }
  // ---- reaching into memory that isn't his
  if (t < tCrash - 0.05) {
    const reach = ramp(t, tReach + 0.4, 1.6, EASE.inOut);
    return (
      <AbsoluteFill>
        <Night glow="rgba(255,59,78,.12)" />
        <div style={{ position: 'absolute', left: 200, top: 560 }}><Mono size={24} color={B.green}>GUS'S MEMORY · BOXES 1–20</Mono></div>
        <div style={{ position: 'absolute', left: 1320, top: 560, opacity: ramp(t, tNotHis - 0.2, 0.4) }}><Mono size={24} color={B.red}>NOT HIS MEMORY</Mono></div>
        <div style={{ position: 'absolute', left: 200, top: 620, display: 'flex', gap: 8 }}>
          {Array.from({ length: 28 }, (_, i) => { const mine = i < 20; const zap = !mine && t > tNotHis; return <div key={i} style={{ width: 48, height: 200, borderRadius: 6, background: mine ? `${B.green}2a` : zap ? (Math.sin(t * 30 + i * 2) > 0 ? '#3a0f18' : '#1a0a10') : '#1a2236', border: `2px solid ${mine ? B.green : zap ? B.red : '#2a3550'}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6, ...fonts.H, fontWeight: 800, fontSize: 18, color: mine ? B.green : B.red }}>{mine ? i + 1 : i === 20 ? '21?' : ''}</div>; })}
        </div>
        <div style={{ position: 'absolute', left: 300, top: 758, width: lerp(140, 1070, reach), height: 40, borderRadius: 20, background: B.uniform }}><div style={{ position: 'absolute', right: -24, top: -6, width: 52, height: 52, borderRadius: 26, background: B.skin }} /></div>
        <Gus x={230} y={1010} size={420} mood={t > tNotHis ? 'shock' : 'focus'} arm="idle" seed={8} />
        {t > tFatal && <div style={{ position: 'absolute', left: 960, top: 230, transform: 'translateX(-50%)' }}><Kinetic at={tFatal} size={88} words={[{ w: 'In' }, { w: 'the' }, { w: 'kernel:' }, { w: 'fatal.', serif: true, color: B.red }]} /></div>}
      </AbsoluteFill>
    );
  }
  // ---- crash
  if (t < tCruel - 0.2) {
    const flash = 1 - ramp(t, tCrash, 0.35);
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ fontSize: 22 }}><BSOD pct={clamp((t - tCrash) / 2) * 12} /></AbsoluteFill>
        <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
        <div style={{ position: 'absolute', left: 1120, top: 640, transform: `rotate(-10deg) scale(${springAt(f, fps, tCrash + 0.1, { damping: 10, stiffness: 200 })})`, ...fonts.H, fontWeight: 900, fontSize: 150, color: '#fff', letterSpacing: '-0.04em' }}>CRASH.</div>
      </AbsoluteFill>
    );
  }
  // ---- the boot loop
  const stations: [string, string][] = [['ph:power-bold', 'RESTART'], ['ph:sun-horizon-fill', 'GUS WAKES UP'], ['ph:file-text-fill', 'READS FILE 291'], ['ph:warning-octagon-fill', 'CRASH']];
  const speed = 1 + ramp(t, tAgain[0], 2.5, EASE.in) * 2.2;
  const phase = t < tRestart ? 0 : t < tWoke ? 0.25 * ramp(t, tRestart, tWoke - tRestart) : t < tRead ? 0.25 + 0.25 * ramp(t, tWoke, tRead - tWoke) : t < tAgain[0] ? 0.5 + 0.5 * ramp(t, tRead, tAgain[0] - tRead) : 1 + (t - tAgain[0]) * 0.7 * speed;
  const ang = phase * Math.PI * 2 - Math.PI / 2;
  const loops = Math.max(0, Math.floor(phase));
  const flash = tAgain.some((x) => t > x && t < x + 0.18) ? 1 : 0;
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: 'absolute', left: 960 - 290, top: 500 - 290, width: 580, height: 580, borderRadius: '50%', border: '6px dashed #2c4170' }} />
      {stations.map(([ic, lb], i) => { const a = (i / 4) * Math.PI * 2 - Math.PI / 2; const x = 960 + Math.cos(a) * 290, y = 500 + Math.sin(a) * 290; const lit = Math.abs(((phase % 1) + 1) % 1 - i / 4) < 0.08; return (
        <div key={lb} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${lit ? 1.15 : 1})`, textAlign: 'center' }}>
          <div style={{ width: 150, height: 150, borderRadius: '50%', background: i === 3 ? `${B.blue}` : '#13213e', border: `4px solid ${lit ? B.amber : '#2c4170'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><Icon name={ic} size={70} color={i === 3 ? '#fff' : B.white} /></div>
          <div style={{ marginTop: 10 }}><Mono size={20} color={B.white}>{lb}</Mono></div>
        </div>); })}
      <div style={{ position: 'absolute', left: 960 + Math.cos(ang) * 290 - 22, top: 500 + Math.sin(ang) * 290 - 22, width: 44, height: 44, borderRadius: 22, background: B.amber, boxShadow: `0 0 30px ${B.amber}` }} />
      <div style={{ position: 'absolute', left: 960, top: 500, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <Gus x={0} y={60} size={260} mood={loops > 1 ? 'dizzy' : t > tWoke ? 'focus' : 'neutral'} seed={9} />
        <div style={{ position: 'absolute', left: -120, top: 80, width: 240 }}><Mono size={26} color={B.red}>{loops > 0 ? `CRASH ×${loops}` : ''}</Mono></div>
      </div>
      <AbsoluteFill style={{ background: B.blue, opacity: flash * 0.85 }} />
    </AbsoluteFill>
  );
};

// ================================================================ ACT 3 · the world goes blue
const tSpread = C0(26), tFlights = P(27, 'Flights'), tPen = P(27, 'Hospitals'), tPay = P(27, 'Payment'), tAir = P(27, 'TV channels');
const tMS = C0(28), tDown = P(28, 'eight and a half'), tCrazy = C0(29), tOne1 = P(29, 'less than one percent'), tRuns = P(30, 'But it was'), tSub = C0(31), tHit = P(31, 'hit subscribe'), tWont = P(31, "won't crash");
export const a3NoCaptions: [number, number][] = [];
export const a3Sfx: SfxEvent[] = [
  { t: tSpread, name: 'darkSweep', vol: 0.4 }, { t: tSpread + 0.4, name: 'computerAmb', vol: 0.2, dur: 3 },
  { t: tFlights - 0.05, name: 'stomp', vol: 0.35 }, { t: tPen - 0.05, name: 'stomp', vol: 0.35 }, { t: tPay - 0.05, name: 'stomp', vol: 0.35 }, { t: tAir - 0.05, name: 'staticFx', vol: 0.3 },
  { t: tDown, name: 'impactDeep', vol: 0.45 }, { t: tOne1, name: 'tick', vol: 0.4 }, { t: tRuns, name: 'zoomIn', vol: 0.35 },
  { t: tHit - 0.05, name: 'clickModern', vol: 0.5 }, { t: tHit + 0.35, name: 'bell', vol: 0.4 }, { t: tWont, name: 'boing', vol: 0.4, note: 'bsod bounces off' },
];
export const A3: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tFlights - 0.2) {
    const lit = ramp(t, tSpread, C1(26) - tSpread + 0.4, EASE.inOut);
    const mins = Math.floor(9 + lit * 50);
    return (
      <AbsoluteFill>
        <Night glow="rgba(10,108,214,.25)" />
        <DotMap x={960} y={560} w={1650} lit={lit} />
        <div style={{ position: 'absolute', left: 1560, top: 90 }}><Card pad={22}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 64, color: B.white, letterSpacing: '-0.03em' }}>04:{String(mins).padStart(2, '0')}</div><Mono size={18} color={B.blue2}>UTC</Mono></Card></div>
      </AbsoluteFill>
    );
  }
  if (t < tMS - 0.2) {
    const panels: [number, string, string, string][] = [[tFlights, 'ph:airplane-tilt-fill', 'FLIGHTS GROUNDED', 'CANCELLED'], [tPen, 'ph:clipboard-text-fill', 'HOSPITALS', 'PEN & PAPER'], [tPay, 'ph:credit-card-fill', 'PAYMENTS', 'ERROR'], [tAir, 'ph:television-simple-fill', 'TV CHANNELS', 'OFF AIR']];
    return (
      <AbsoluteFill>
        <Night />
        {panels.map(([at, ic, lb, st], i) => { const x = 540 + (i % 2) * 860, y = 310 + Math.floor(i / 2) * 400; return (
          <Pop key={lb} x={x} y={y} at={at - 0.05}><Card w={740} pad={34}><div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
            <div style={{ width: 170, height: 170, borderRadius: 30, background: `${B.blue}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={110} color={B.blue2} /></div>
            <div><div style={{ ...fonts.H, fontWeight: 800, fontSize: 46, color: B.white }}>{lb}</div><div style={{ marginTop: 12, display: 'inline-block', padding: '6px 16px', borderRadius: 8, background: B.red, ...fonts.H, fontWeight: 900, fontSize: 30, color: '#fff' }}>{st}</div></div>
          </div></Card></Pop>); })}
      </AbsoluteFill>
    );
  }
  if (t < tCrazy - 0.2) {
    return (
      <AbsoluteFill>
        <Night glow="rgba(10,108,214,.3)" />
        <div style={{ position: 'absolute', left: 960, top: 470, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <Mono size={28} color={B.dim}>MICROSOFT'S ESTIMATE</Mono>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 210, color: B.white, letterSpacing: '-0.05em', lineHeight: 1 }}><Count to={8.5} at={tDown} d={1.2} fmt={(n) => n.toFixed(1)} /><span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 400, color: B.blue2 }}> million</span></div>
          <Mono size={28} color={B.white}>WINDOWS COMPUTERS DOWN</Mono>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < tSub - 0.2) {
    const zoom = ramp(t, tRuns, 1.2, EASE.inOut);
    const big = 1 + zoom * 9;
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) scale(${big})`, transformOrigin: `${-30 + 4.5 * 60}px ${4.5 * 60 - 30}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 52px)', gap: 8, opacity: 1 - zoom * 0.7 }}>
            {Array.from({ length: 100 }, (_, i) => { const on = i === 44 && t > tOne1; return <div key={i} style={{ width: 52, height: 52, borderRadius: 6, background: on ? B.blue : '#1d2944', boxShadow: on ? `0 0 20px ${B.blue}` : 'none', transform: `scale(${ramp(t, tCrazy + i * 0.008, 0.3, EASE.back)})` }} />; })}
          </div>
        </div>
        {t < tRuns && t > tOne1 && <Pop x={960} y={140} at={tOne1}><Tag color={B.blue2} size={40}>LESS THAN 1% OF ALL WINDOWS PCs</Tag></Pop>}
        {zoom > 0.6 && <AbsoluteFill style={{ background: B.blue, opacity: ramp(t, tRuns + 0.8, 0.3) * 0.9 }} />}
        {zoom > 0.8 && [['ph:airplane-tilt-fill', 'AIRPORTS', P(30, 'airports')], ['ph:bank-fill', 'BANKS', P(30, 'banks')], ['ph:first-aid-kit-fill', 'HOSPITALS', P(30, 'hospitals')]].map(([ic, lb, at], i) => <Pop key={lb as string} x={500 + i * 460} y={540} at={(at as number) - 0.05}><div style={{ textAlign: 'center' }}><Icon name={ic as string} size={170} color="#fff" style={{ margin: '0 auto' }} /><div style={{ marginTop: 16, ...fonts.H, fontWeight: 900, fontSize: 52, color: '#fff' }}>{lb as string}</div></div></Pop>)}
      </AbsoluteFill>
    );
  }
  const subbed = t > tHit;
  const bounce = ramp(t, tWont - 0.1, 0.7, EASE.out);
  return (
    <AbsoluteFill>
      <Night glow="rgba(255,182,72,.12)" />
      <div style={{ position: 'absolute', left: 960, top: 480, transform: `translate(-50%,-50%) scale(${t > tHit - 0.05 && t < tHit + 0.1 ? 0.92 : 1})`, display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ padding: '26px 54px', borderRadius: 60, background: subbed ? '#2a2f3d' : '#ff0033', ...fonts.H, fontWeight: 900, fontSize: 60, color: '#fff' }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
        <div style={{ transform: `rotate(${subbed ? Math.sin((t - tHit) * 30) * 20 * Math.max(0, 1 - (t - tHit) * 1.2) : 0}deg)`, transformOrigin: '50% 10%' }}><Icon name={subbed ? 'ph:bell-ringing-fill' : 'ph:bell-bold'} size={90} color={subbed ? B.amber : B.white} /></div>
      </div>
      {t > tWont - 0.4 && <div style={{ position: 'absolute', left: lerp(1700, 1300, ramp(t, tWont - 0.4, 0.3)) + bounce * 500, top: 300 - bounce * 300 + bounce * bounce * 200, width: 220, height: 140, borderRadius: 10, overflow: 'hidden', transform: `rotate(${bounce * 200}deg)`, fontSize: 5, opacity: 1 - ramp(t, tWont + 0.6, 0.3) }}><BSOD /></div>}
      <Gus x={480} y={960} size={360} mood={subbed ? 'happy' : 'neutral'} arm={subbed ? 'salute' : 'idle'} look={1} seed={10} />
    </AbsoluteFill>
  );
};
