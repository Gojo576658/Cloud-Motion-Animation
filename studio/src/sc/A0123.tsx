// Acts 0–3: the sealed box, the 24 words, the balance at zero, Vio's intro → why the words are the money and why a
// hardware wallet exists → the hidden implant Ledger confirmed (reads the screen, sends over its own mobile link,
// passes the authenticity check) → October 9: the drain, the numbers, and the scammer who got robbed.
import React from 'react';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S0 } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, AbsoluteFill, GridBg, Phone, Label, Panel, BigNum, Hacker, Host, beatOf, CX, Chip, Crossed, Tile, Wallet, SeedSheet, Box, Signal, Balance, Wire } from './kit';

const Words = ({ n = 3 }: { n?: number }) => <div style={{ lineHeight: 1.35 }}>{['1. river', '2. candle', '3. orbit', '4. velvet'].slice(0, n).map((w) => <div key={w}>{w}</div>)}</div>;
const drain = (t: number, at: number, from = 48250, d = 1.2) => lerp(from, 0, ramp(t, at, d, EASE.in));

// ================================================================ ACT 0 · cold open
const tSafest = P(0, 'safest crypto wallet'), tSecret = P(0, 'Keep your secret safe'), tSetup = C0(1), tWords = P(1, 'twenty four words'), tPaper = P(1, 'write them down');
const tGone = P(2, 'every coin'), tTyped = P(2, 'You never typed'), tLink = P(2, 'You never clicked'), tNotPc = C0(3), tInBox = P(3, 'The thief came');
const tVio = C0(4), tNinety = P(4, 'ninety million'), tOngoing = P(4, 'the investigation');
export const a0NoCaptions: [number, number][] = [];
export const a0Sfx: SfxEvent[] = [{ t: tGone, name: 'error', vol: 0.25 }, { t: tInBox, name: 'impactDeep', vol: 0.35 }, { t: tVio - 0.1, name: 'whooshDeep', vol: 0.25 }];
export const A0: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [0, 1, 2, 3, 4]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <Box x={CX} y={520} w={480} />
      <Chip x={CX} y={190} at={tSafest} icon="ph:shield-check-fill">THE SAFEST WALLET</Chip>
      {t > tSecret && <Chip x={CX} y={800} at={tSecret} icon="ph:lock-key-fill">ONE JOB: KEEP YOUR SECRET</Chip>}
    </>;
  } else if (b === 1) {
    const open = ramp(t, tSetup, 0.8, EASE.inOut);
    body = <>
      {t < tPaper - 0.1 ? <>
        <Box x={CX} y={640} w={420} open={open} />
        <Wallet x={CX} y={lerp(640, 380, open)} w={440} screen={t > tWords ? <Words n={2} /> : 'SET UP'} />
        {t > tWords && <Chip x={CX} y={170} at={tWords}>24 WORDS</Chip>}
      </> : <>
        <SeedSheet x={CX} y={450} at={tPaper} w={760} paper />
        <Chip x={CX} y={170} at={tPaper} icon="ph:pencil-simple-fill">WRITTEN ON PAPER</Chip>
      </>}
    </>;
  } else if (b === 2) {
    body = <>
      <Phone x={1080} y={470} w={330}><Balance v={drain(t, tGone)} red={t > tGone} /></Phone>
      <Crossed x={1560} y={300} at={tTyped} icon="ph:keyboard-fill" label="NEVER TYPED THEM" size={90} />
      <Crossed x={1560} y={650} at={tLink} icon="ph:link-bold" label="NO BAD LINK" size={90} />
    </>;
  } else if (b === 3) {
    const open = ramp(t, tInBox - 0.2, 0.7, EASE.inOut);
    body = <>
      {t < tInBox - 0.2 ? <Crossed x={CX} y={450} at={tNotPc} icon="ph:laptop-fill" label="NOT ON YOUR COMPUTER" size={130} /> : <>
        <Wallet x={CX} y={560} w={560} open={open} implant={ramp(t, tInBox + 0.2, 0.4)} />
        <div style={{ position: 'absolute', left: CX, top: 140, transform: 'translateX(-50%)' }}><Kinetic at={tInBox} size={78} words={[{ w: 'The' }, { w: 'thief' }, { w: 'came' }, { w: 'in' }, { w: 'the' }, { w: 'box.', serif: true, color: A.red }]} /></div>
      </>}
    </>;
  } else {
    body = <>
      <Chip x={CX} y={170} at={tVio + 0.05} red solid>VIO · YOUR HOST</Chip>
      {t > tNinety - 0.1 && <div style={{ position: 'absolute', left: CX, top: 440, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><BigNum to={90} at={tNinety} d={0.8} prefix="$" suffix="M+" size={190} color={A.red} /><div style={{ marginTop: 8 }}><Mono size={24} color={A.soft}>DRAINED · HUNDREDS OF WALLETS</Mono></div></div>}
      {t > tOngoing && <Chip x={CX} y={760} at={tOngoing} icon="ph:magnifying-glass-bold">STILL UNDER INVESTIGATION</Chip>}
    </>;
  }
  return <AbsoluteFill><GridBg glow={b >= 2 ? 'rgba(255,43,61,.09)' : undefined} x={68} />{body}<Host at={0.15} decode={b === 3 && t > tInBox ? 0.8 : 0} /></AbsoluteFill>;
};

// ================================================================ ACT 1 · the safest box
const tOne = C0(5), tNotPw = P(6, 'not a password'), tMoney = P(6, 'They are the money'), tRebuild = P(6, 'rebuild your wallet');
const tExists = C0(7), tInside = P(7, 'inside a special chip'), tNever = P(7, 'never sends them'), tCheck = C0(8), tPasses = P(8, 'the device passes');
const tHow = C0(9), tNoHack = P(9, "You don't hack"), tAdd = P(9, 'You add something');
export const a1NoCaptions: [number, number][] = [];
export const a1Sfx: SfxEvent[] = [{ t: tAdd, name: 'impactDeep', vol: 0.3 }];
export const A1: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [5, 6, 7, 8, 9]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <Pop x={CX} y={330} at={tOne + 0.1}><Icon name="ph:key-fill" size={170} color={A.white} /></Pop>
      <div style={{ position: 'absolute', left: CX, top: 500, transform: 'translateX(-50%)' }}><Kinetic at={tOne + 0.3} size={80} words={[{ w: 'One' }, { w: 'thing', serif: true }, { w: 'to' }, { w: 'know.' }]} /></div>
    </>;
  } else if (b === 1) {
    body = <>
      <SeedSheet x={CX} y={420} at={C0(6)} w={760} red={t > tMoney} />
      {t > tNotPw && t < tMoney && <Chip x={CX} y={760} at={tNotPw} icon="ph:x-bold">NOT A PASSWORD</Chip>}
      {t > tMoney && t < tRebuild && <Chip x={CX} y={760} at={tMoney} red solid>THEY ARE THE MONEY</Chip>}
      {t > tRebuild && <Chip x={CX} y={760} at={tRebuild} icon="ph:globe-hemisphere-west-fill">ANY DEVICE · ANYWHERE</Chip>}
    </>;
  } else if (b === 2) {
    body = <>
      <Wallet x={CX} y={360} w={500} screen={t > tInside ? <Words n={2} /> : 'HELLO'} />
      {t > tInside && t < tNever && <Chip x={CX} y={560} at={tInside} icon="ph:cpu-fill">MADE INSIDE A SPECIAL CHIP</Chip>}
      {t > tNever - 0.1 && <><Crossed x={1050} y={680} at={tNever} icon="ph:laptop-fill" label="NOT TO YOUR LAPTOP" size={80} /><Crossed x={1490} y={680} at={tNever + 0.4} icon="ph:globe-hemisphere-west-fill" label="NOT TO THE INTERNET" size={80} /></>}
    </>;
  } else if (b === 3) {
    body = <>
      <Wallet x={CX} y={460} w={500} screen="GENUINE?" check={t > tPasses ? 'pass' : 'none'} />
      <Chip x={CX} y={170} at={tCheck + 0.2} icon="ph:seal-check-fill">THE AUTHENTICITY CHECK</Chip>
    </>;
  } else {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 230, transform: 'translateX(-50%)' }}><Kinetic at={tHow + 0.1} size={64} words={[{ w: 'How' }, { w: 'do' }, { w: 'you' }, { w: 'steal' }, { w: 'from' }, { w: 'it?', serif: true }]} /></div>
      {t > tNoHack && <Crossed x={1050} y={600} at={tNoHack} icon="ph:code-bold" label="DON'T HACK IT" size={90} />}
      {t > tAdd && <Pop x={1500} y={600} at={tAdd}><div style={{ textAlign: 'center' }}><div style={{ width: 170, height: 170, borderRadius: '50%', background: A.red, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(255,43,61,.5)' }}><Icon name="ph:plus-bold" size={100} color={A.white} /></div><div style={{ marginTop: 14 }}><Mono size={22} color={A.red}>ADD SOMETHING</Mono></div></div></Pop>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} />{body}<Host at={S0(1) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 2 · the spy inside
const tOct13 = C0(10), tSecond = C0(11), tNotSupposed = P(11, "It wasn't supposed"), tWatching = P(11, 'It was watching');
const tSetup2 = C0(12), tRead = P(12, 'read them right off'), tSent = C0(13), tWifi = P(13, 'Not through your Wi-Fi'), tPc = P(13, 'Not through your computer'), tOwn = P(13, 'own mobile connection'), tSim = P(13, 'digital SIM'), tPhone = P(13, 'tiny phone');
const tClever = C0(14), tAway = P(14, 'away from the internet'), tBrought = P(14, 'brought its own internet');
const tInvisible = C0(15), tPassCheck = P(15, 'could still pass'), tGenuine = P(15, 'The box said genuine'), tLying = P(15, 'it was lying');
const tWait = C0(16), tWaited = P(16, 'they waited'), tWeek = P(16, 'week after week'), tOct9 = C0(17), tTrigger = P(17, 'pulled the trigger');
export const a2NoCaptions: [number, number][] = [];
export const a2Sfx: SfxEvent[] = [{ t: tSecond + 0.3, name: 'glitch', vol: 0.2 }, { t: tLying + 0.2, name: 'impactDeep', vol: 0.3 }, { t: tTrigger, name: 'impactDeep', vol: 0.35 }];
export const A2: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [10, 11, 12, 13, 14, 15, 16, 17]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <Chip x={CX} y={170} at={tOct13 + 0.1} icon="ph:calendar-fill">OCT 13 · LEDGER'S SECURITY TEAM</Chip>
      <Wallet x={CX} y={540} w={560} open={ramp(t, tOct13 + 1, 1.2, EASE.inOut)} />
      <Pop x={1640} y={360} at={tOct13 + 0.5}><Icon name="ph:magnifying-glass-bold" size={110} color={A.white} /></Pop>
    </>;
  } else if (b === 1) {
    body = <>
      <Wallet x={CX} y={540} w={600} open={1} implant={ramp(t, tSecond + 0.2, 0.6)} />
      {t > tNotSupposed && t < tWatching && <Chip x={CX} y={190} at={tNotSupposed} red solid>NOT SUPPOSED TO BE THERE</Chip>}
      {t > tWatching && <Chip x={CX} y={190} at={tWatching} icon="ph:eye-fill" red>IT WAS WATCHING THE SCREEN</Chip>}
      <Pop x={CX} y={800} at={tSecond + 0.6}><Mono size={22} color={A.soft}>SECURE CHIP: UNTOUCHED</Mono></Pop>
    </>;
  } else if (b === 2) {
    const scan = ramp(t, tRead - 0.2, 1.4, EASE.inOut);
    body = <>
      <Wallet x={CX} y={300} w={520} screen={<Words n={3} />} pulse={t > tRead ? 0.6 : 0} />
      {t > tRead - 0.2 && scan < 1 && <div style={{ position: 'absolute', left: CX - 210, top: 245 + scan * 110, width: 320, height: 4, background: A.red, boxShadow: `0 0 20px ${A.red}` }} />}
      <SeedSheet x={CX} y={680} at={tSetup2} w={720} read={tRead} />
      {t > tRead && <Pop x={CX} y={170} at={tRead}><Mono size={22} color={A.red}>READ OFF THE DISPLAY · REPORTEDLY</Mono></Pop>}
    </>;
  } else if (b === 3) {
    body = <>
      <Wallet x={1080} y={560} w={460} open={1} implant={1} />
      <Signal x={1080 + 460 * 0.3} y={560} on={ramp(t, tSent, 0.4)} size={170} />
      {t > tWifi && t < tOwn && <><Crossed x={1560} y={360} at={tWifi} icon="ph:wifi-high-bold" label="NOT YOUR WI-FI" size={80} /><Crossed x={1560} y={680} at={tPc} icon="ph:laptop-fill" label="NOT YOUR COMPUTER" size={80} /></>}
      {t > tOwn && <Tile x={1580} y={380} at={tOwn} icon="ph:cell-tower-fill" label="ITS OWN MOBILE LINK" red size={150} />}
      {t > tSim && <Tile x={1580} y={720} at={tSim} icon="mdi:sim" label="BUILT-IN DIGITAL SIM" size={120} />}
      {t > tPhone && <Pop x={1080} y={250} at={tPhone}><Label color={A.red} size={28}>A TINY PHONE, INSIDE YOUR WALLET</Label></Pop>}
    </>;
  } else if (b === 4) {
    body = <>
      <Wallet x={CX} y={520} w={520} screen="OFFLINE" />
      {t > tAway && t < tBrought && <Pop x={CX} y={230} at={tAway}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><Icon name="ph:wifi-slash-bold" size={70} color={A.white} /><Mono size={24} color={A.white}>KEPT AWAY FROM THE INTERNET</Mono></div></Pop>}
      {t > tBrought && <><Signal x={CX} y={520} on={1} size={260} /><div style={{ position: 'absolute', left: CX, top: 150, transform: 'translateX(-50%)' }}><Kinetic at={tBrought} size={64} words={[{ w: 'It' }, { w: 'brought' }, { w: 'its' }, { w: 'own' }, { w: 'internet.', serif: true, color: A.red }]} /></div></>}
    </>;
  } else if (b === 5) {
    body = <>
      <Wallet x={CX} y={500} w={520} screen="GENUINE" check={t > tPassCheck ? 'pass' : 'none'} />
      {t > tGenuine && <Stamp x={CX} y={760} at={tLying} text="LYING" size={90} rot={-6} />}
    </>;
  } else if (b === 6) {
    const v = lerp(1200, 48250, ramp(t, tWait + 0.4, Math.max(1.5, C1(16) - tWait - 0.4), EASE.inOut));
    body = <>
      <Phone x={1080} y={470} w={330}><Balance v={v} /></Phone>
      {['WEEK 1', 'WEEK 2', 'WEEK 3'].map((w, i) => <Chip key={w} x={1560} y={300 + i * 140} at={tWait + 0.6 + i * 0.7} icon="ph:arrow-up-bold">{w}</Chip>)}
      {t > tWaited && <Chip x={1560} y={760} at={tWaited} icon="ph:hourglass-medium-fill" red>THEY WAITED</Chip>}
    </>;
  } else {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 300, transform: 'translateX(-50%)', textAlign: 'center' }}><Kinetic at={tOct9 + 0.1} size={130} words={[{ w: 'October' }, { w: '9.', serif: true, color: A.red }]} /></div>
      {t > tTrigger && <Chip x={CX} y={650} at={tTrigger} icon="ph:lightning-fill" red solid>THE DRAIN BEGINS</Chip>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} glow={b === 1 || b === 3 || b === 7 ? 'rgba(255,43,61,.1)' : undefined} />{body}<Host at={S0(2) + 0.2} decode={b === 1 || b === 3 ? 0.8 : 0} /></AbsoluteFill>;
};

// ================================================================ ACT 3 · the drain
const tWave = C0(18), tThree = P(18, 'more than three hundred'), tN70 = P(19, 'seventy million'), tN86 = P(19, 'eighty six'), tN93 = P(19, 'ninety three'), tN100 = P(19, 'over a hundred');
const tVerify = C0(20), tSmall = P(20, 'nobody is arguing'), tImagine = C0(21), tFriday = P(21, 'normal Friday'), tZero = P(21, 'says zero'), tDesk = P(21, 'still on your desk');
const tTether = C0(22), tFreeze = P(22, 'freeze'), tMixer = P(22, 'crypto mixer'), tChain = C0(23), tScam = C0(24), tFake = P(24, 'fake reviews');
const tSep = C0(25), tOct = P(25, 'October ninth'), tSixty = P(25, 'Over sixty bitcoin'), tRob = C0(26);
export const a3NoCaptions: [number, number][] = [];
export const a3Sfx: SfxEvent[] = [{ t: tZero, name: 'error', vol: 0.25 }, { t: tOct, name: 'impactDeep', vol: 0.3 }];
const NUMS: [number, string][] = [[tN70, '$70M'], [tN86, '$86M'], [tN93, '$93M'], [tN100, '$100M+']];
export const A3: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [18, 19, 20, 21, 22, 23, 24, 25, 26]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 450, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(8, 92px)', gap: 14 }}>
        {Array.from({ length: 32 }, (_, i) => { const hit = t > tWave + 0.3 + ((i * 11) % 32) * 0.07; return <div key={i} style={{ height: 52, borderRadius: 12, background: hit ? '#2a1418' : '#1a1a20', border: `2px solid ${hit ? A.red : '#3a3a44'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 16, color: hit ? A.red : A.dim }}>{hit ? '$0' : '•••'}</div>; })}
      </div>
      {t > tThree && <Chip x={CX} y={800} at={tThree} red>300+ WALLETS · ON-CHAIN INVESTIGATORS</Chip>}
    </>;
  } else if (b === 1) {
    const k = NUMS.reduce((a, [at], i) => (t >= at - 0.05 ? i : a), 0);
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 400, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <Pop x={0} y={0} at={NUMS[k][0]} from={20}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 210, color: k === 3 ? A.red : A.white, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>{NUMS[k][1]}</div></Pop>
      </div>
      <div style={{ position: 'absolute', left: CX, top: 640, transform: 'translateX(-50%)', display: 'flex', gap: 18 }}>{NUMS.map(([at, l], i) => <div key={l} style={{ opacity: t > at ? (i === k ? 1 : 0.4) : 0.12 }}><Mono size={24} color={i === k ? A.red : A.soft}>{l}</Mono></div>)}</div>
      <Pop x={CX} y={760} at={C0(19) + 0.2}><Mono size={20} color={A.dim}>ESTIMATES · UNVERIFIED BY LEDGER</Mono></Pop>
    </>;
  } else if (b === 2) {
    body = <>
      <Tile x={1060} y={430} at={tVerify + 0.1} icon="ph:question-bold" label="LEDGER: NOT VERIFIED" size={150} />
      {t > tSmall && <Tile x={1500} y={430} at={tSmall} icon="ph:warning-fill" label="NOT SMALL" red size={150} />}
    </>;
  } else if (b === 3) {
    body = <>
      <Phone x={1080} y={470} w={330}><Balance v={t > tZero ? 0 : 48250} red={t > tZero} /></Phone>
      {t > tFriday && <Chip x={1560} y={230} at={tFriday} icon="ph:calendar-fill">A NORMAL FRIDAY</Chip>}
      {t > tDesk && <><Wallet x={1560} y={520} w={340} screen="•••" /><Pop x={1560} y={700} at={tDesk + 0.2}><Mono size={20} color={A.soft}>STILL ON YOUR DESK</Mono></Pop></>}
    </>;
  } else if (b === 4) {
    body = <>
      <Tile x={1060} y={440} at={tFreeze} icon="ph:snowflake-bold" label="TETHER FREEZES SOME USDT" size={160} />
      {t > tMixer && <Tile x={1500} y={440} at={tMixer} icon="ph:shuffle-bold" label="SENT THROUGH A MIXER · REPORTEDLY" red size={160} />}
      <Chip x={CX} y={170} at={tTether + 0.1} icon="ph:currency-dollar-bold">FOLLOW THE MONEY</Chip>
    </>;
  } else if (b === 5) {
    body = <><Pop x={CX} y={380} at={tChain + 0.1}><Icon name="ph:magnifying-glass-bold" size={180} color={A.white} /></Pop><Chip x={CX} y={640} at={tChain + 0.3}>CHAINALYSIS FOUND SOMETHING</Chip></>;
  } else if (b === 6) {
    body = <>
      <Hacker x={1500} y={900} size={420} grin laptop />
      <Chip x={1060} y={300} at={tScam + 0.2} icon="ph:mask-happy-fill" red>A SCAMMER'S WALLET</Chip>
      {t > tFake && <Chip x={1060} y={430} at={tFake} icon="ph:star-fill">FAKE JOB · FAKE REVIEWS</Chip>}
    </>;
  } else if (b === 7) {
    const empt = t > tOct;
    body = <>
      <Chip x={1060} y={170} at={tSep} icon="ph:calendar-fill">SEP 22 · STOLEN MONEY STORED</Chip>
      {[0, 1, 2].map((i) => <Wallet key={i} x={940 + i * 230} y={440} w={200} screen={empt ? '$0' : '₿'} pulse={empt ? 0.5 : 0} />)}
      {empt && [0, 1, 2].map((i) => <Wire key={`w${i}`} d={`M ${940 + i * 230} 520 Q ${1170} 640 1600 700`} at={tOct + i * 0.1} dur={0.5} red len={900} width={3} />)}
      {empt && <Tile x={1640} y={720} at={tOct + 0.4} icon="ph:user-fill" label="ONE THIEF'S WALLET" red size={110} />}
      {t > tSixty && <Pop x={1080} y={780} at={tSixty}><div style={{ textAlign: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 80, color: A.red, letterSpacing: '-0.03em' }}>60+ BTC</div><Mono size={22} color={A.white}>≈ $4.8 MILLION · CHAINALYSIS</Mono></div></Pop>}
    </>;
  } else {
    body = <div style={{ position: 'absolute', left: CX, top: 330, transform: 'translateX(-50%)' }}><Kinetic at={tRob + 0.05} size={100} words={[{ w: 'Thieves,' }, { w: 'robbing', br: true }, { w: 'a' }, { w: 'thief.', serif: true, color: A.red }]} /></div>;
  }
  return <AbsoluteFill><GridBg x={68} glow={b === 0 || b === 3 ? 'rgba(255,43,61,.09)' : undefined} />{body}<Host at={S0(3) + 0.2} /></AbsoluteFill>;
};
