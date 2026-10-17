// Acts 4–7: ads get blurry, the $10B "best guess", the 26% crash and $230B gone → the way out: metaverse, the AI race,
// the spending spree → Muse, the agent that shops inside WhatsApp (no spy needed, no pop-up, maybe a cut of the sale)
// → glasses that buy what you see, the question, and the closing line.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S0 } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, GridBg, Phone, Label, Panel, BigNum, Host, AttPopup, Spy, Mark, Building, Helper, StockChart, Coin, Glasses } from './kit';

// ================================================================ ACT 4 · ten billion
const tBlur = C0(22), tSpent = P(22, 'so they spent less'), tFeb = C0(23), tTenB = P(23, 'ten billion'), tGuess = P(23, 'best guess');
const tNext = C0(24), tFell = P(24, 'fell about'), tGone = C0(25), tRecord = P(25, 'At the time'), tOne = C0(26), tDay = P(26, 'twenty seven');
export const a4NoCaptions: [number, number][] = [];
export const a4Sfx: SfxEvent[] = [{ t: tTenB, name: 'impactDeep', vol: 0.35 }, { t: tFell, name: 'impactBig', vol: 0.4 }, { t: tGone + 0.3, name: 'darkSweep', vol: 0.3 }, { t: tDay, name: 'coins', vol: 0.25 }];
export const A4: React.FC = () => {
  const { t } = useTF();
  let body: React.ReactNode, pose: React.ComponentProps<typeof Host>['pose'] = 'lookright', at = S0(4) + 0.2;
  if (t < tFeb - 0.15) {
    const blur = ramp(t, tBlur + 0.3, 1.5);
    body = <>
      <div style={{ position: 'absolute', left: 1080, top: 260, width: 300, height: 300, borderRadius: '50%', border: `6px solid ${A.red}`, filter: `blur(${blur * 9}px)`, opacity: 1 - blur * 0.5 }}><div style={{ position: 'absolute', left: '50%', top: -20, bottom: -20, width: 6, background: A.red, transform: 'translateX(-50%)' }} /><div style={{ position: 'absolute', top: '50%', left: -20, right: -20, height: 6, background: A.red, transform: 'translateY(-50%)' }} /><div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', filter: `blur(${blur * 4}px)` }}><Icon name="ph:user-fill" size={120} color={A.white} /></div></div>
      <Pop x={1230} y={200} at={tBlur + 0.2}><Label color={A.white} size={28}>ADS GOT LESS PRECISE</Label></Pop>
      {t > tSpent - 0.3 && <div style={{ position: 'absolute', left: 1540, top: 300, display: 'flex', alignItems: 'flex-end', gap: 22, height: 300 }}>{[1, 0.8, 0.55, 0.35].map((h, i) => <div key={i} style={{ width: 46, height: 300 * h * ramp(t, tSpent - 0.3 + i * 0.12, 0.4, EASE.out), background: i === 3 ? A.red : A.white, borderRadius: 6 }} />)}</div>}
      {t > tSpent && <Pop x={1620} y={680} at={tSpent}><Mono size={20} color={A.dim}>AD SPEND</Mono></Pop>}
    </>;
  } else if (t < tNext - 0.15) {
    pose = 'shocked'; at = tTenB - 0.1;
    body = <>
      <Pop x={1250} y={170} at={tFeb + 0.1}><Label color={A.white} size={26}>FEBRUARY 2022 · META EARNINGS CALL</Label></Pop>
      <div style={{ position: 'absolute', left: 1250, top: 430, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: ramp(t, tTenB - 0.2, 0.3) }}><BigNum to={10} at={tTenB} d={1.0} prefix="$" suffix=" BILLION" size={130} color={A.red} /><div style={{ marginTop: 6 }}><Mono size={22} color={A.dim}>THE APPLE CHANGE · COST IN ONE YEAR</Mono></div></div>
      {t > tGuess && <Pop x={1250} y={680} at={tGuess}><div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 64, color: A.white }}>“a best guess”</div></Pop>}
      {t > tGuess && <Pop x={1250} y={770} at={tGuess + 0.3}><Mono size={18} color={A.dim}>— META'S FINANCE CHIEF</Mono></Pop>}
    </>;
  } else if (t < tGone - 0.15) {
    pose = 'shocked'; at = tFell - 0.1;
    body = <>
      <StockChart x={800} y={240} w={820} h={420} at={tNext - 0.6} crashAt={tFell} />
      <div style={{ position: 'absolute', left: 830, top: 170 }}><Mono size={20} color={A.dim}>META STOCK · FEB 2022</Mono></div>
      {t > tFell + 0.3 && <Pop x={1250} y={770} at={tFell + 0.3}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 110, color: A.red, letterSpacing: '-0.05em' }}>−26%</div></Pop>}
    </>;
  } else if (t < tOne - 0.15) {
    pose = 'facepalm'; at = tGone + 0.6;
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 380, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><BigNum to={230} at={tGone + 0.1} d={1.4} prefix="$" suffix=" BILLION" size={130} /><div style={{ marginTop: 8 }}><Mono size={22} color={A.dim}>MARKET VALUE · GONE IN ONE DAY</Mono></div></div>
      {t > tRecord && <Pop x={1250} y={680} at={tRecord}><Label color={A.red} size={28} solid>BIGGEST ONE-DAY DROP FOR A US COMPANY (AT THE TIME)</Label></Pop>}
    </>;
  } else {
    pose = 'idle'; at = tOne - 0.1;
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 230, transform: 'translateX(-50%)' }}><Kinetic at={tOne + 0.1} size={92} stagger={0.12} words={[{ w: 'One' }, { w: 'button.', serif: true, color: A.red }]} /></div>
      {t > tDay - 0.2 && <div style={{ position: 'absolute', left: 1250, top: 560, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><BigNum to={27} at={tDay} d={1.0} prefix="$" suffix=" MILLION" size={120} color={A.white} /><div style={{ marginTop: 6 }}><Mono size={24} color={A.dim}>EVERY SINGLE DAY</Mono></div></div>}
    </>;
  }
  return <AbsoluteFill><GridBg x={70} glow={t > tFell ? 'rgba(255,43,61,.1)' : undefined} />{body}<Host pose={pose} at={at} /></AbsoluteFill>;
};

// ================================================================ ACT 5 · the AI race
const tOut = C0(27), tMeta = C0(28), tRace = P(28, 'Then the AI race'), tChase = P(28, 'chasing'), tFree = C0(29), tAhead = P(29, 'rivals kept'), tSpend = C0(30), tTeam = P(30, 'Billions'), tFee = P(30, 'pay packages');
export const a5NoCaptions: [number, number][] = [];
export const a5Sfx: SfxEvent[] = [{ t: tRace, name: 'whooshQuick', vol: 0.3 }, { t: tSpend + 0.2, name: 'coins', vol: 0.3 }, { t: tFee, name: 'impactDeep', vol: 0.25 }];
export const A5: React.FC = () => {
  const { t } = useTF();
  let body: React.ReactNode, pose: React.ComponentProps<typeof Host>['pose'] = 'lookright', at = S0(5) + 0.2;
  if (t < tMeta - 0.15) {
    const run = ramp(t, tOut + 0.6, 1.4, EASE.inOut);
    body = <>
      <Building x={830} y={940} w={520} h={760} label="THE PHONE BUILDING" lit={0.6}>
        <div style={{ position: 'absolute', right: 30, bottom: 0, width: 130, height: 220, background: A.red, borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 16, ...fonts.H, fontWeight: 900, fontSize: 30, color: A.white }}>EXIT</div>
      </Building>
      <Mark x={lerp(1150, 1600, run)} y={940} size={400} mood="focus" seed={3} />
    </>;
  } else if (t < tFree - 0.15) {
    const race = t > tRace - 0.1;
    body = race ? <>
      <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>{[0, 1, 2].map((i) => <line key={i} x1={780} x2={1720} y1={380 + i * 200} y2={380 + i * 200} stroke={A.line} strokeWidth={3} strokeDasharray="14 14" />)}<line x1={1680} x2={1680} y1={300} y2={820} stroke={A.white} strokeWidth={6} /></svg>
      {[['OPENAI', 0.9, 'ph:sparkle-fill'], ['GOOGLE', 0.8, 'ph:google-logo-bold'], ['META', 0.45, 'ph:infinity-bold']].map(([lb, p, ic], i) => { const x = lerp(820, 820 + 820 * (p as number), ramp(t, tRace, 2.2, EASE.out)); return <div key={lb as string} style={{ position: 'absolute', left: x, top: 380 + i * 200, transform: 'translate(-50%,-80%)', textAlign: 'center' }}><Icon name={ic as string} size={90} color={i === 2 ? A.red : A.white} /><div><Mono size={18} color={A.dim}>{lb as string}</Mono></div></div>; })}
      {t > tChase && <Pop x={1250} y={180} at={tChase}><Label color={A.white} size={28}>META: CHASING</Label></Pop>}
    </> : <>
      <Pop x={1250} y={480} at={tMeta + 0.2}><div style={{ textAlign: 'center' }}><Icon name="ph:virtual-reality-fill" size={220} color={A.white} style={{ margin: '0 auto' }} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 56, color: A.white }}>THE METAVERSE</div></div></Pop>
    </>;
  } else if (t < tSpend - 0.15) {
    body = <>
      <div style={{ position: 'absolute', left: 900, top: 300, display: 'flex', gap: 40 }}>{['LLAMA', 'LLAMA 2', 'LLAMA 3'].map((m, i) => <Pop key={m} x={0} y={0} at={tFree + 0.3 + i * 0.2}><div style={{ position: 'relative', left: i * 260, width: 230, height: 260, borderRadius: 24, background: A.panel, border: `2px solid ${A.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}><Icon name="ph:gift-fill" size={100} color={A.white} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 30, color: A.white }}>{m}</div><Mono size={16} color={A.dim}>FREE MODEL</Mono></div></Pop>)}</div>
      {t > tAhead && <Pop x={1250} y={780} at={tAhead}><Label color={A.red} size={28} solid>RIVALS KEPT PULLING AHEAD</Label></Pop>}
    </>;
  } else {
    pose = t > tFee ? 'laughing' : 'smirk'; at = t > tFee ? tFee + 0.4 : tSpend;
    body = <>
      {Array.from({ length: 22 }, (_, i) => { const x = 820 + ((i * 397) % 900), d = ((t - tSpend) * 260 + i * 97) % 1200 - 100; return t > tSpend ? <div key={i} style={{ position: 'absolute', left: x, top: d, opacity: 0.7, transform: `rotate(${i * 33}deg)` }}><Icon name="ph:currency-dollar-bold" size={60} color={i % 3 ? A.white : A.red} /></div> : null; })}
      {t > tTeam && <Pop x={1250} y={260} at={tTeam}><Label color={A.white} size={30} solid>NEW SUPERINTELLIGENCE TEAM</Label></Pop>}
      {t > tFee && <Pop x={1250} y={620} at={tFee}><div style={{ textAlign: 'center' }}><div style={{ width: 240, height: 250, margin: '0 auto', borderRadius: '40px 40px 20px 20px', background: A.red, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 120, color: A.white }}>10</div><div style={{ marginTop: 14, ...fonts.H, fontWeight: 900, fontSize: 36, color: A.white }}>TOP AI RESEARCHER</div><Mono size={18} color={A.dim}>PAY: "TRANSFER FEE" LEVEL (REPORTEDLY)</Mono></div></Pop>}
    </>;
  }
  return <AbsoluteFill><GridBg x={70} />{body}<Host pose={pose} at={at} /></AbsoluteFill>;
};

// ================================================================ ACT 6 · Muse
const tMuse = P(31, 'An AI agent called Muse'), tDoes = C0(32), tTrip = P(32, 'plan a trip'), tEmail = P(32, 'send an email'), tBuy = P(32, 'buy you something');
const tStores = C0(33), tWa = P(33, 'inside WhatsApp'), tFreeP = C0(34), tUs = P(34, 'For now'), tThink = C0(35), tTold = P(35, 'You just told'), tNoPop = C0(36), tNever = P(36, 'never even pops up');
const tCut = C0(37), tAd = P(37, 'from the ad'), tSale = P(37, 'from the sale');
export const a6NoCaptions: [number, number][] = [];
export const a6Sfx: SfxEvent[] = [{ t: tMuse, name: 'sparkle', vol: 0.3 }, { t: tWa + 0.2, name: 'notification', vol: 0.3 }, { t: tNever, name: 'error', vol: 0.25 }, { t: tAd, name: 'coins', vol: 0.25 }, { t: tSale, name: 'coins', vol: 0.25 }];
export const A6: React.FC = () => {
  const { t } = useTF();
  let body: React.ReactNode, pose: React.ComponentProps<typeof Host>['pose'] = 'pointright', at = S0(6) + 0.2;
  if (t < tDoes - 0.15) {
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 170, transform: 'translateX(-50%)' }}><Mono size={24} color={A.dim}>SEPTEMBER 2026</Mono></div>
      <Helper x={1420} y={860} size={420} mood={t > tMuse ? 'happy' : 'neutral'} sign={t > tMuse ? 'MUSE' : undefined} signAt={tMuse + 0.3} seed={4} />{t < tMuse && <Pop x={1420} y={300} at={C0(31) + 0.5}><Label color={A.white} size={28}>WHAT WAS ALL THAT MONEY FOR?</Label></Pop>}{t > tMuse - 0.2 && <div style={{ position: 'absolute', left: 1420, top: 220, transform: 'translateX(-50%)' }}><Kinetic at={tMuse} size={110} words={[{ w: 'Muse.', serif: true, color: A.red }]} /></div>}
    </>;
  } else if (t < tStores - 0.15) {
    pose = 'idle'; at = tDoes - 0.1;
    body = <>
      <Helper x={1600} y={900} size={300} mood="proud" seed={4} />
      {[[tTrip, 'ph:airplane-tilt-fill', 'PLAN A TRIP'], [tEmail, 'ph:envelope-simple-fill', 'SEND AN EMAIL'], [tBuy, 'ph:shopping-bag-fill', 'BUY SOMETHING']].map(([a, ic, lb], i) => <Pop key={lb as string} x={1150} y={300 + i * 170} at={(a as number) - 0.1}><div style={{ width: 520, padding: '24px 30px', borderRadius: 20, background: A.panel, border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', gap: 24 }}><Icon name={ic as string} size={60} color={A.white} /><div style={{ flex: 1, ...fonts.H, fontWeight: 800, fontSize: 34, color: A.white }}>{lb as string}</div><Icon name="ph:check-circle-fill" size={48} color={t > (a as number) + 0.5 ? A.red : '#2a2a33'} /></div></Pop>)}
    </>;
  } else if (t < tFreeP - 0.15) {
    pose = 'present'; at = tStores - 0.1;
    body = <>
      <Phone x={1180} y={530} w={360}><AbsoluteFill style={{ background: '#0f0f13', padding: '70px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><Icon name="ph:whatsapp-logo-fill" size={30} color={A.white} /><div style={{ ...fonts.H, fontWeight: 800, fontSize: 20, color: A.white }}>Muse</div></div>
        <div style={{ marginLeft: 'auto', width: '78%', padding: 14, borderRadius: 16, background: A.white, ...fonts.H, fontWeight: 600, fontSize: 19, color: '#111', opacity: ramp(t, tStores + 0.3, 0.3) }}>Get me white sneakers, size 9.</div>
        {t > tWa - 0.4 && <div style={{ marginTop: 14, width: '80%', padding: 14, borderRadius: 16, background: '#222229', ...fonts.H, fontWeight: 600, fontSize: 19, color: A.white, opacity: ramp(t, tWa - 0.4, 0.3) }}>Done. Ordered for you <span style={{ color: A.red }}>✓</span></div>}
      </AbsoluteFill></Phone>
      <div style={{ position: 'absolute', left: 1470, top: 300, display: 'flex', flexDirection: 'column', gap: 26 }}>{['WALMART', 'BEST BUY', 'SEPHORA'].map((s, i) => <Pop key={s} x={0} y={0} at={tStores + 0.6 + i * 0.25}><div style={{ position: 'relative', top: i * 110, padding: '18px 30px', borderRadius: 14, background: A.panel, border: `2px solid ${A.line}`, ...fonts.H, fontWeight: 900, fontSize: 30, color: A.white, whiteSpace: 'nowrap' }}>{s}</div></Pop>)}</div>
    </>;
  } else if (t < tThink - 0.15) {
    pose = 'idle'; at = tFreeP - 0.1;
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 450, transform: 'translate(-50%,-50%)', display: 'flex', gap: 30 }}>{[['FREE', 'to start'], ['$20', 'a month'], ['$100', 'a month']].map(([p, s], i) => <Pop key={p} x={0} y={0} at={tFreeP + 0.2 + i * 0.25}><div style={{ position: 'relative', left: (i - 1) * 270, width: 240, height: 260, borderRadius: 24, background: i ? A.panel : A.white, border: `2px solid ${A.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 72, color: i ? A.white : '#111' }}>{p}</div><Mono size={18} color={i ? A.dim : '#555'}>{s}</Mono></div></Pop>)}</div>
      {t > tUs && <Pop x={1250} y={750} at={tUs}><Label color={A.red} size={28} solid>US ONLY, FOR NOW</Label></Pop>}
    </>;
  } else if (t < tNoPop - 0.15) {
    pose = 'thinking'; at = tThink - 0.1;
    body = <>
      <Spy x={1150} y={860} size={330} mood={t > tTold ? 'sad' : 'sneak'} />
      {t > tTold && <Stamp x={1150} y={380} at={tTold} text="NOT NEEDED" size={70} rot={-8} />}
      <Pop x={1520} y={420} at={tThink + 0.4}><div style={{ width: 360, padding: 22, borderRadius: 18, background: A.white, ...fonts.H, fontWeight: 700, fontSize: 28, color: '#111' }}>"I want white sneakers."</div></Pop>
      <Helper x={1560} y={900} size={260} mood="heart" seed={6} />
    </>;
  } else if (t < tCut - 0.15) {
    pose = 'smirk'; at = tNoPop;
    const gone = ramp(t, tNever, 0.5, EASE.in);
    body = <>
      <div style={{ opacity: 1 - gone * 0.6, transform: `scale(${1 - gone * 0.2})`, transformOrigin: '1250px 520px' }}><AttPopup x={1250} y={520} w={560} at={tNoPop + 0.1} /></div>
      {t > tNever && <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}><line x1={990} y1={330} x2={1510} y2={720} stroke={A.red} strokeWidth={16} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - ramp(t, tNever, 0.3))} /><line x1={1510} y1={330} x2={990} y2={720} stroke={A.red} strokeWidth={16} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - ramp(t, tNever + 0.15, 0.3))} /></svg>}
      <Pop x={1250} y={170} at={tNoPop + 0.3}><Label color={A.white} size={28}>INSIDE META'S OWN APPS</Label></Pop>
    </>;
  } else {
    pose = 'lookright'; at = tCut;
    body = <>
      {t < tAd - 0.1 && <><Mark x={1150} y={900} size={380} mood="happy" seed={5} /><Helper x={1450} y={880} size={300} mood="wink" seed={7} /></>}
      <Pop x={1250} y={170} at={tCut + 0.2}><Label color={A.dim} size={24}>A POSSIBLE FUTURE · ZUCKERBERG, META CONNECT</Label></Pop>
      <Coin x={1080} y={480} at={tAd} label={'FROM\nTHE AD'} size={240} />
      <Coin x={1420} y={480} at={tSale} label={'CUT OF\nTHE SALE'} size={240} />
      {t > tAd && <div style={{ position: 'absolute', left: 1080, top: 640, transform: 'translateX(-50%)' }}><Mono size={20} color={A.dim}>ADS</Mono></div>}
      {t > tSale && <div style={{ position: 'absolute', left: 1420, top: 640, transform: 'translateX(-50%)' }}><Mono size={20} color={A.dim}>EVERY PURCHASE</Mono></div>}
    </>;
  }
  return <AbsoluteFill><GridBg x={70} glow="rgba(255,43,61,.06)" />{body}<Host pose={pose} at={at} /></AbsoluteFill>;
};

// ================================================================ ACT 7 · your turn
const tGlass = C0(38), tJacket = P(38, 'You see a jacket'), tAskG = P(38, 'you ask your glasses'), tWay = P(38, "it's on its way"), tCool = C0(39), tCreep = P(39, 'or the creepiest');
const tMist = C0(40), tTerms = P(40, 'reportedly'), tQ = C0(41), tSpendQ = P(41, 'spend your money'), tTell = P(41, 'Tell me'), tSub = C0(42), tNextT = P(42, 'Next time'), tEnd = C0(43), tBecome = P(43, 'Now Meta wants');
export const a7NoCaptions: [number, number][] = [[tEnd - 0.05, C1(43) + 10]];
export const a7Sfx: SfxEvent[] = [{ t: tWay, name: 'confirm', vol: 0.3 }, { t: tTell, name: 'notify', vol: 0.3 }, { t: tSub, name: 'clickModern', vol: 0.4 }, { t: tSub + 0.4, name: 'bell', vol: 0.3 }, { t: tBecome, name: 'impactDeep', vol: 0.35 }];
export const A7: React.FC = () => {
  const { t } = useTF();
  let body: React.ReactNode, pose: React.ComponentProps<typeof Host>['pose'] = 'lookright', at = S0(7) + 0.2;
  if (t < tCool - 0.15) {
    const stage = t > tWay ? 2 : t > tAskG ? 1 : 0;
    body = <>
      <Glasses x={1250} y={460} w={920}>
        <AbsoluteFill style={{ background: 'rgba(5,5,7,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {t > tJacket - 0.2 && <Icon name="ph:t-shirt-fill" size={110} color={A.white} />}
          {stage >= 1 && <Mono size={14} color={A.red}>{stage === 1 ? 'SCANNING…' : 'ORDERED ✓'}</Mono>}
        </AbsoluteFill>
      </Glasses>
      {stage >= 1 && <div style={{ position: 'absolute', left: 1305, top: 349, width: 340, height: 230, border: `3px solid ${A.red}`, borderRadius: 14, opacity: stage === 1 ? 0.5 + 0.5 * Math.sin(t * 12) : 1 }} />}
      {t > tGlass + 0.2 && <Pop x={1250} y={170} at={tGlass + 0.2}><Label color={A.white} size={28}><Icon name="ph:eyeglasses-bold" size={32} color={A.white} /> MUSE IN SMART GLASSES</Label></Pop>}
      {stage === 2 && <Pop x={1250} y={790} at={tWay}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><Icon name="ph:package-fill" size={70} color={A.white} /><Label color={A.red} size={28} solid>ON ITS WAY</Label></div></Pop>}
    </>;
  } else if (t < tMist - 0.15) {
    pose = 'smirk'; at = tCool - 0.1;
    body = <>{[[tCool + 0.2, 'ph:sparkle-fill', 'COOLEST'], [tCreep - 0.05, 'ph:eye-fill', 'CREEPIEST']].map(([a, ic, lb], i) => <Pop key={lb as string} x={1060 + i * 400} y={500} at={a as number}><div style={{ width: 340, height: 360, borderRadius: 26, background: i ? A.red : A.panel, border: `2px solid ${A.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}><Icon name={ic as string} size={130} color={A.white} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 46, color: A.white }}>{lb as string}</div></div></Pop>)}</>;
  } else if (t < tQ - 0.15) {
    pose = 'thinking'; at = tMist - 0.1;
    body = <>
      <Pop x={1250} y={380} at={tMist + 0.2}><div style={{ width: 760, padding: 40, borderRadius: 24, background: A.panel, border: `2px solid ${A.red}`, textAlign: 'center' }}><Icon name="ph:warning-fill" size={90} color={A.red} style={{ margin: '0 auto' }} /><div style={{ marginTop: 12, ...fonts.H, fontWeight: 900, fontSize: 44, color: A.white }}>MUSE CAN MAKE MISTAKES</div></div></Pop>
      {t > tTerms && <Pop x={1250} y={690} at={tTerms}><Label color={A.dim} size={24}>META'S PAYBACK FOR WRONG BUYS: LIMITED (REPORTEDLY)</Label></Pop>}
    </>;
  } else if (t < tSub - 0.15) {
    pose = 'idle'; at = tQ - 0.1;
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 200, transform: 'translateX(-50%)' }}><Kinetic at={tQ + 0.4} size={70} words={[{ w: 'Would' }, { w: 'you' }, { w: 'let' }, { w: "Meta's", br: true }, { w: 'AI' }, { w: 'spend' }, { w: 'your' }, { w: 'money?', serif: true, color: A.red }]} /></div>
      {t > tSpendQ && <div style={{ position: 'absolute', left: 1250, top: 560, transform: 'translate(-50%,-50%)', display: 'flex', gap: 40 }}>{['YES', 'NO WAY'].map((s, i) => <Pop key={s} x={0} y={0} at={tSpendQ + 0.2 + i * 0.2}><div style={{ position: 'relative', left: (i ? 1 : -1) * 190, width: 330, padding: '30px 0', borderRadius: 20, background: i ? A.red : A.white, textAlign: 'center', ...fonts.H, fontWeight: 900, fontSize: 52, color: i ? A.white : '#111' }}>{s}</div></Pop>)}</div>}
      {t > tTell && <Pop x={1250} y={790} at={tTell}><Label color={A.white} size={28}><Icon name="ph:chat-circle-dots-fill" size={32} color={A.white} /> TELL ME IN THE COMMENTS</Label></Pop>}
    </>;
  } else if (t < tEnd - 0.15) {
    pose = 'idle'; at = tSub - 0.1;
    const subbed = t > tSub + 0.3;
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 420, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 18 }}><div style={{ padding: '24px 48px', borderRadius: 50, background: subbed ? '#1c1c22' : A.red, ...fonts.H, fontWeight: 900, fontSize: 56, color: A.white }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div><Icon name={subbed ? 'ph:bell-ringing-fill' : 'ph:bell-fill'} size={80} color={A.white} /></div>
      {t > tNextT && <Pop x={1250} y={620} at={tNextT}><Label color={A.dim} size={28}>next time: another hidden tech war</Label></Pop>}
    </>;
  } else {
    pose = 'idle'; at = tEnd - 0.1;
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 260, transform: 'translateX(-50%)', opacity: 1 - ramp(t, tBecome, 0.3) * 0.6 }}><Kinetic at={tEnd + 0.1} size={66} words={[{ w: 'Apple' }, { w: 'took' }, { w: 'away' }, { w: 'the' }, { w: 'button.' }]} /></div>
      {t > tBecome - 0.1 && <div style={{ position: 'absolute', left: 1250, top: 420, transform: 'translateX(-50%)' }}><Kinetic at={tBecome} size={84} stagger={0.1} words={[{ w: 'Now' }, { w: 'Meta' }, { w: 'wants' }, { w: 'to', br: true }, { w: 'become' }, { w: 'the' }, { w: 'button.', serif: true, color: A.red }]} /></div>}
      <div style={{ position: 'absolute', left: 1250, top: 800, transform: 'translateX(-50%)', opacity: ramp(t, C1(43) + 0.4, 0.6) }}><Mono size={28} color={A.dim}>MECHIVIOTECH</Mono></div>
    </>;
  }
  return <AbsoluteFill><GridBg x={70} glow="rgba(255,43,61,.06)" />{body}<Host pose={pose} at={at} /></AbsoluteFill>;
};
