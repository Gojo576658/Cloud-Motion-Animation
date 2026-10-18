// Acts 0–3: a quiet night, the fridges start heating, Vio introduces himself → how the controller and the
// defrost cycle work → why the box is on the internet, and why it's old → what is known about how they got in.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S0 } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, GridBg, Label, Panel, Host, beatOf, Fridge, Temp, Controller, Coil, Store, FranceMap, Clock, Browser, Wire, Hacker, Owner, FOOD } from './kit';

// shared bits
export const Chip: React.FC<{ x: number; y: number; at: number; icon?: string; red?: boolean; size?: number; children: React.ReactNode; solid?: boolean }> = ({ x, y, at, icon, red = false, size = 30, children, solid = false }) => (
  <Pop x={x} y={y} at={at}><Label color={red ? A.red : A.white} size={size} solid={solid}>{icon && <Icon name={icon} size={size * 1.1} color={solid ? (red ? A.white : '#111') : red ? A.red : A.white} />}{children}</Label></Pop>
);
export const Crossed: React.FC<{ x: number; y: number; at: number; icon: string; label: string; size?: number }> = ({ x, y, at, icon, label, size = 150 }) => {
  const { t } = useTF();
  const u = ramp(t, at + 0.35, 0.3, EASE.out);
  return (
    <Pop x={x} y={y} at={at}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: size * 1.4, height: size * 1.4, margin: '0 auto', borderRadius: '50%', background: A.panel, border: `3px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={size * 0.8} color={A.white} />
          <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 100 100"><line x1={18} y1={82} x2={18 + 64 * u} y2={82 - 64 * u} stroke={A.red} strokeWidth={7} strokeLinecap="round" /></svg>
        </div>
        <div style={{ marginTop: 16 }}><Mono size={24} color={A.white}>{label}</Mono></div>
      </div>
    </Pop>
  );
};
const Moon: React.FC<{ x: number; y: number }> = ({ x, y }) => { const { t } = useTF(); return <div style={{ position: 'absolute', left: x, top: y + Math.sin(t * 0.6) * 4 }}><Icon name="ph:moon-fill" size={90} color={A.soft} glow /></div>; };
// a temperature that climbs through `keys` [[t, °C], ...]
export const tempAt = (t: number, keys: [number, number][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], EASE.inOut(clamp((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]))));
  return keys[keys.length - 1][1];
};
const CX = 1300; // centre of the content area (Vio holds the left third)

// ================================================================ ACT 0 · cold open
const tNight = P(0, 'quiet Sunday night'), tInside = P(0, 'And inside every'), tEuros = P(0, 'millions of euros');
const tOneByOne = P(1, 'one by one'), tTen = P(2, 'Ten degrees'), tTwenty = P(2, 'Twenty'), tThirty = P(2, 'Thirty'), tFifty = P(2, 'fifty degrees'), tDesert = P(2, "That's a hot");
const tMorning = C0(3), tFires = P(3, 'reports of fires'), tWindow = C0(4), tTouch = P(4, 'Nobody touched'), tBox = P(4, 'The attack came'), tNet = P(4, 'connected to the internet');
const tVio = C0(5), tStory = P(5, 'this is the story');
export const a0NoCaptions: [number, number][] = [];
export const a0Sfx: SfxEvent[] = [{ t: tFifty, name: 'impactDeep', vol: 0.35 }, { t: tVio - 0.1, name: 'whooshDeep', vol: 0.25 }];
const HEAT0: [number, number][] = [[C0(2), -18], [tTen, 10], [tTwenty, 20], [tThirty, 30], [tFifty + 0.6, 50]];
export const A0: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [0, 1, 2, 3, 4, 5]);
  let body: React.ReactNode = null;
  if (b === 0 && t < tInside - 0.15) {
    body = <><Moon x={1640} y={130} /><Store x={CX} y={860} w={860} lit={0} /><Chip x={CX} y={190} at={tNight} icon="ph:moon-stars-fill">SUNDAY NIGHT · FRANCE</Chip></>;
  } else if (b === 0) {
    body = <>{[0, 1, 2].map((i) => <Fridge key={i} x={1000 + i * 300} y={860} w={270} h={560} seed={i + 1} temp={-18} label={i === 1 ? 'FROZEN' : 'FRESH'} />)}
      <Chip x={CX} y={190} at={tEuros} icon="ph:currency-eur-bold">MILLIONS OF EUROS OF FOOD</Chip></>;
  } else if (b === 1) {
    body = <><FranceMap x={CX} y={500} size={640} pins={140} at={tOneByOne} spread={Math.max(1.5, C1(1) - tOneByOne)} /><Chip x={CX} y={110} at={tOneByOne} red>HUNDREDS OF STORES</Chip></>;
  } else if (b === 2) {
    const v = tempAt(t, HEAT0), heat = clamp((v + 18) / 68);
    body = <>
      <Fridge x={1110} y={900} w={430} h={680} heat={heat} seed={4} temp={v} />
      <div style={{ position: 'absolute', left: 1600, top: 380, transform: 'translate(-50%,-50%)' }}><Temp v={v} size={170} sub={t > tDesert ? undefined : 'INSIDE THE FREEZER'} /></div>
      {t > tDesert && <Pop x={1600} y={600} at={tDesert}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><Icon name="ph:sun-fill" size={64} color={A.white} /><Mono size={26} color={A.white}>A DESERT SUMMER DAY</Mono></div></Pop>}
    </>;
  } else if (b === 3) {
    body = <>
      <Pop x={CX} y={170} at={tMorning}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><Icon name="ph:sun-horizon-fill" size={70} color={A.white} /><Mono size={28} color={A.white}>MORNING</Mono></div></Pop>
      <div style={{ position: 'absolute', left: CX, top: 470, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(4, 150px)', gap: 26 }}>
        {FOOD.map((ic, i) => { const u = ramp(t, tMorning + 0.2 + i * 0.07, 0.35); return <div key={ic} style={{ position: 'relative', height: 150, borderRadius: 20, background: A.panel, border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: u, transform: `translateY(${(1 - u) * 20}px)` }}><Icon name={ic} size={80} color="#ffd0d4" /><div style={{ position: 'absolute', right: 8, top: 8, opacity: ramp(t, tMorning + 0.6 + i * 0.07, 0.2) }}><Icon name="ph:x-bold" size={36} color={A.red} /></div></div>; })}
      </div>
      {t > tFires - 0.1 && <Chip x={CX} y={790} at={tFires} icon="ph:fire-fill" red solid>REPORTED FIRES</Chip>}
    </>;
  } else if (b === 4 && t < tBox - 0.15) {
    body = <><Crossed x={1060} y={460} at={tWindow + 0.1} icon="ph:hammer-fill" label="NO BROKEN WINDOW" /><Crossed x={1560} y={460} at={tTouch} icon="ph:hand-fill" label="NO ONE TOUCHED A FRIDGE" /></>;
  } else if (b === 4) {
    body = <>
      <div style={{ position: 'absolute', left: 820, top: 160, width: 520, height: 680, borderRadius: 12, background: '#101015', border: `2px solid ${A.line}` }} />
      <Controller x={1080} y={470} w={360} at={tBox} />
      <Wire d="M 1080 610 Q 1100 820 1380 760 T 1640 420" at={tNet - 0.3} dur={0.8} red />
      <Pop x={1650} y={340} at={tNet}><div style={{ textAlign: 'center' }}><Icon name="ph:globe-hemisphere-west-fill" size={150} color={A.white} /><div style={{ marginTop: 8 }}><Mono size={24} color={A.red}>THE INTERNET</Mono></div></div></Pop>
      <Chip x={1080} y={760} at={tBox + 0.3}>THE BOX ON THE WALL</Chip>
    </>;
  } else {
    const heat = ramp(t, tStory + 0.6, 2.2, EASE.inOut);
    body = <>
      <Chip x={CX} y={170} at={tVio + 0.05} red solid>VIO · YOUR HOST</Chip>
      <Fridge x={CX} y={900} w={300} h={420} heat={heat} seed={9} />
      <div style={{ position: 'absolute', left: CX, top: 270, transform: 'translateX(-50%)' }}><Kinetic at={tStory} size={84} words={[{ w: 'The' }, { w: 'night' }, { w: 'fridges' }, { w: 'became', br: true }, { w: 'ovens.', serif: true, color: A.red }]} /></div>
    </>;
  }
  return <AbsoluteFill><GridBg glow={b === 2 || b === 5 ? 'rgba(255,43,61,.1)' : 'rgba(255,255,255,.05)'} x={68} />{body}<Host at={0.15} decode={b === 4 && t > tBox ? 0.8 : 0} /></AbsoluteFill>;
};

// ================================================================ ACT 1 · the brain
const tKitchen = P(6, 'in your kitchen'), tDozens = C0(7), tBrain = P(7, 'one brain'), tCtrl = P(7, 'A refrigeration controller');
const tBack = P(8, 'back room'), tWarm = P(8, 'If a freezer'), tFix = P(8, 'it fixes it'), tAlarm = P(8, 'sends an alarm');
const tDefrost = P(9, 'defrost cycle'), tIce = C0(10), tFew = P(10, 'every few hours'), tWarmC = P(10, 'warms the coils'), tMelt = P(10, 'the ice melts'), tCold = P(10, 'the cold comes back'), tHour = P(10, 'Normally');
const tDuring = C0(11), tStop = P(11, 'when to stop'), tOrders = C0(12), tSwitch = C0(13), tPurpose = P(13, 'on purpose'), tRemember = P(13, 'Remember that'), tPulled = P(13, 'the hackers pulled');
export const a1NoCaptions: [number, number][] = [];
export const a1Sfx: SfxEvent[] = [{ t: tAlarm, name: 'notification', vol: 0.25 }, { t: tOrders + 0.2, name: 'impactDeep', vol: 0.3 }, { t: tPurpose, name: 'clickModern', vol: 0.4 }];
const Toggle: React.FC<{ x: number; y: number; on: number; label: string }> = ({ x, y, on, label }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
    <div style={{ position: 'relative', width: 360, height: 170, borderRadius: 85, background: on > 0.5 ? A.red : '#1d1d24', border: `4px solid ${on > 0.5 ? A.red : A.line}`, boxShadow: on > 0.5 ? '0 0 80px rgba(255,43,61,.5)' : undefined }}>
      <div style={{ position: 'absolute', top: 15, left: 15 + 190 * on, width: 140, height: 140, borderRadius: '50%', background: A.white, boxShadow: '0 10px 30px rgba(0,0,0,.5)' }} />
    </div>
    <div style={{ marginTop: 26, ...fonts.H, fontWeight: 900, fontSize: 64, color: A.white, letterSpacing: '0.02em' }}>{label}</div>
    <div style={{ marginTop: 6 }}><Mono size={26} color={on > 0.5 ? A.red : A.dim}>{on > 0.5 ? 'ON' : 'OFF'}</Mono></div>
  </div>
);
export const A1: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [6, 7, 8, 9, 10, 11, 12, 13]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <Fridge x={1100} y={900} w={460} h={660} seed={2} doors={3} label="SUPERMARKET" />
      {t > tKitchen - 0.2 && <><Pop x={1440} y={560} at={tKitchen - 0.1}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 110, color: A.red }}>≠</div></Pop>
        <Pop x={1680} y={560} at={tKitchen}><div style={{ textAlign: 'center' }}><Icon name="mdi:fridge-outline" size={260} color={A.white} /><Mono size={22} color={A.dim}>YOUR KITCHEN</Mono></div></Pop></>}
    </>;
  } else if (b === 1) {
    const cases = Array.from({ length: 8 }, (_, i) => [900 + (i % 4) * 250, i < 4 ? 400 : 640]);
    body = <>
      {cases.map(([x, y], i) => <Pop key={i} x={0} y={0} at={tDozens + i * 0.06} from={20}><Fridge x={x + 30} y={y} w={150} h={210} seed={i + 3} doors={1} label={' '} /></Pop>)}
      {cases.map(([x, y], i) => <Wire key={`w${i}`} d={`M ${x + 30} ${y} Q ${x + 30} 820 ${1300} 860`} at={tBrain - 0.2 + i * 0.03} dur={0.5} len={900} width={3} flow={false} />)}
      <Pop x={1300} y={900} at={tBrain}><Label color={A.red} size={34} solid>ONE BRAIN</Label></Pop>
      <Chip x={1300} y={130} at={tCtrl}>REFRIGERATION CONTROLLER</Chip>
    </>;
  } else if (b === 2) {
    const warm = t > tWarm + 0.4 && t < tFix + 0.3;
    body = <>
      <Controller x={1250} y={470} w={560} at={C0(8)} mode={t > tAlarm ? 'ALARM' : 'COOL'} rows={[['CASE 01', warm ? '-14.1' : '-18.2'], ['CASE 02', '-19.0'], ['COLD RM', '+2.1']]} hot={warm ? [0] : []} />
      <Chip x={1250} y={130} at={tBack} icon="ph:door-fill">IN THE BACK ROOM</Chip>
      {t > tFix && t < tAlarm && <Chip x={1250} y={810} at={tFix} icon="ph:check-bold">FIXED</Chip>}
      {t > tAlarm - 0.1 && <Chip x={1250} y={810} at={tAlarm} icon="ph:bell-ringing-fill" red solid>ALARM</Chip>}
    </>;
  } else if (b === 3) {
    body = <>
      <Pop x={1300} y={300} at={C0(9)}><Icon name="ph:snowflake-bold" size={150} color={A.white} /></Pop>
      <div style={{ position: 'absolute', left: 1300, top: 480, transform: 'translateX(-50%)' }}><Kinetic at={tDefrost - 0.1} size={110} words={[{ w: 'The' }, { w: 'defrost', serif: true, color: A.red }, { w: 'cycle.' }]} /></div>
    </>;
  } else if (b === 4) {
    const ice = ramp(t, tIce, Math.max(0.6, tFew - tIce), EASE.inOut) * (1 - ramp(t, tMelt, 1.2, EASE.inOut));
    const heat = ramp(t, tWarmC, 0.5) * (1 - ramp(t, tCold, 0.6));
    body = <>
      <Coil x={1300} y={440} w={720} ice={ice} heat={heat} />
      <Chip x={1300} y={150} at={tIce + 0.2} icon="ph:snowflake-bold">ICE BUILDS ON THE COILS</Chip>
      {t > tFew && <Chip x={1300} y={720} at={tFew}>EVERY FEW HOURS</Chip>}
      {t > tHour && <Chip x={1300} y={820} at={tHour} red>NORMALLY ~1 HOUR</Chip>}
    </>;
  } else if (b === 5) {
    body = <>
      <Fridge x={1060} y={900} w={400} h={620} heat={0.28} seed={6} temp={4} />
      <Controller x={1600} y={420} w={380} mode="DEFROST" rows={[['DEFROST', '+4.0'], ['TIMER', '58m']]} at={tDuring + 0.2} />
      {t > tStop && <Chip x={1600} y={700} at={tStop} icon="ph:check-bold">KNOWS WHEN TO STOP</Chip>}
    </>;
  } else if (b === 6) {
    body = <>
      <Controller x={1150} y={470} w={460} mode="COOL" at={tOrders} />
      <Hacker x={1640} y={900} size={420} laptop />
      <Chip x={1300} y={130} at={tOrders + 0.3} red solid>SOMEONE ELSE GIVING ORDERS</Chip>
    </>;
  } else {
    const on = ramp(t, tPurpose, 0.25, EASE.out);
    body = <>
      <Toggle x={1300} y={440} on={on} label="DEFROST" />
      {t > tRemember && <Chip x={1300} y={130} at={tRemember} red>REMEMBER THIS SWITCH</Chip>}
      {t > tPulled && <Chip x={1300} y={800} at={tPulled} icon="ph:warning-fill">THE ONE THEY PULLED</Chip>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} glow={b >= 6 ? 'rgba(255,43,61,.1)' : undefined} />{body}<Host at={S0(1) + 0.2} decode={b === 6 ? 0.8 : 0} /></AbsoluteFill>;
};

// ================================================================ ACT 2 · the open door
const tWhy = C0(14), tConv = C0(15), tChain = P(15, 'A supermarket chain'), tDrive = P(15, "can't drive"), tPage = P(15, 'web page'), tLogin = P(15, 'technicians log in');
const tSave = C0(16), tMoney = P(16, 'It saves money'), tThree = P(16, 'three in the morning'), tHome = P(16, 'from home');
const tAnyone = P(17, 'so can anybody else'), tDanfoss = P(18, 'Danfoss'), tOld = P(18, 'Really old');
const t2016 = P(19, '2016'), t2021 = P(19, '2021'), tNoUpd = P(19, 'no longer get');
const tMarch = P(20, 'March'), tAug = P(20, 'August'), tMonths = P(20, 'Months before');
const tTouches = P(21, 'nobody touches them'), tCost = P(21, 'Replacing them'), tStopped = P(21, 'stopped fixing them');
const tThousands = P(22, 'Thousands of old boxes'), tFacing = P(22, 'facing the internet'), tLocks = P(22, 'no new locks');
export const a2NoCaptions: [number, number][] = [];
export const a2Sfx: SfxEvent[] = [{ t: tAnyone, name: 'impactDeep', vol: 0.3 }, { t: tNoUpd + 0.3, name: 'impactDeep', vol: 0.25 }, { t: tLocks + 0.2, name: 'impactDeep', vol: 0.25 }];
const YearCard: React.FC<{ x: number; y: number; at: number; year: string; label: string; red?: boolean }> = ({ x, y, at, year, label, red = false }) => (
  <Pop x={x} y={y} at={at}><Panel w={330} pad={26}><div style={{ textAlign: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 84, color: red ? A.red : A.white, lineHeight: 1 }}>{year}</div><div style={{ marginTop: 10 }}><Mono size={22} color={A.soft}>{label}</Mono></div></div></Panel></Pop>
);
export const A2: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [14, 15, 16, 17, 18, 19, 20, 21, 22]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <Controller x={1060} y={470} w={400} at={tWhy} />
      <Wire d="M 1260 470 Q 1420 360 1600 440" at={tWhy + 0.3} dur={0.6} />
      <Pop x={1680} y={460} at={tWhy + 0.5}><Icon name="ph:globe-hemisphere-west-fill" size={170} color={A.white} /></Pop>
      <Pop x={1420} y={240} at={tWhy + 0.8}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 160, color: A.red }}>?</div></Pop>
    </>;
  } else if (b === 1) {
    const stores = Array.from({ length: 15 }, (_, i) => [1040 + (i % 5) * 130, 330 + Math.floor(i / 5) * 130]);
    body = <>
      <div style={{ position: 'absolute', left: 1300, top: 110, transform: 'translateX(-50%)' }}><Kinetic at={tConv} size={80} words={[{ w: 'Convenience.', serif: true }]} /></div>
      {t > tChain - 0.1 && stores.map(([x, y], i) => <Pop key={i} x={x} y={y} at={tChain + i * 0.04}><Icon name="ph:storefront-fill" size={84} color={t > tLogin && i % 3 !== 1 ? A.white : A.soft} /></Pop>)}
      {t > tDrive && t < tPage && <Crossed x={1560} y={800} at={tDrive} icon="ph:truck-fill" label="CAN'T VISIT THEM ALL" size={70} />}
      {t > tPage - 0.1 && <Pop x={1300} y={810} at={tPage}><Label color={A.white} size={28}><Icon name="ph:browser-fill" size={32} color={A.white} /> A WEB PAGE · REMOTE ACCESS</Label></Pop>}
    </>;
  } else if (b === 2) {
    body = <>
      <Chip x={1060} y={180} at={tSave} icon="ph:clock-fill">SAVES TIME</Chip>
      <Chip x={1560} y={180} at={tMoney} icon="ph:currency-eur-bold">SAVES MONEY</Chip>
      {t > tThree - 0.1 && <Clock x={1060} y={520} size={300} from={3} to={3.1} at={tThree} d={2} />}
      {t > tHome - 0.1 && <><Owner x={1580} y={880} size={430} mood="sleepy" /><Chip x={1580} y={360} at={tHome} icon="ph:house-fill">FIXED FROM HOME</Chip></>}
    </>;
  } else if (b === 3) {
    const dots = Array.from({ length: 9 }, (_, i) => [1680 + Math.cos(i * 0.8) * 120, 300 + i * 60]);
    body = <>
      <Browser x={1180} y={460} w={620} h={420} url="controller · remote access" at={C0(17)}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}><Icon name="mdi:fridge-industrial" size={120} color={A.white} /><Mono size={22} color={A.soft}>STORE 042 · TEMPERATURES</Mono></div>
      </Browser>
      <Pop x={1180} y={830} at={C0(17) + 0.3}><Label size={26}><Icon name="ph:wrench-fill" size={28} color={A.white} /> TECHNICIAN</Label></Pop>
      {t > tAnyone - 0.2 && dots.map(([x, y], i) => <Wire key={i} d={`M ${x} ${y} Q ${1560} ${y} 1490 ${460}`} at={tAnyone - 0.1 + i * 0.05} dur={0.4} red len={500} width={3} flow={false} />)}
      {t > tAnyone - 0.2 && dots.map(([x, y], i) => <Pop key={`d${i}`} x={x} y={y} at={tAnyone - 0.1 + i * 0.05}><Icon name="ph:user-fill" size={34} color={A.red} /></Pop>)}
      {t > tAnyone && <Chip x={1560} y={150} at={tAnyone} red solid>ANYBODY ELSE</Chip>}
    </>;
  } else if (b === 4) {
    body = <>
      <Pop x={1300} y={170} at={tDanfoss}><Label size={34}>DANFOSS · DENMARK</Label></Pop>
      <Controller x={1300} y={500} w={480} at={tDanfoss + 0.2} old={ramp(t, tOld - 0.3, 0.6)} brand="LEGACY UNIT" />
      {t > tOld && <Stamp x={1300} y={820} at={tOld} text="OLD" size={80} rot={-6} />}
    </>;
  } else if (b === 5) {
    body = <>
      <div style={{ position: 'absolute', left: 900, top: 470, width: 820, height: 4, background: A.line }} />
      <YearCard x={1080} y={470} at={t2016 - 0.1} year="2016" label="ONE MODEL PHASED OUT" />
      <YearCard x={1540} y={470} at={t2021 - 0.1} year="2021" label="ANOTHER: END OF LIFE" />
      <Stamp x={1310} y={790} at={tNoUpd + 0.3} text="NO SECURITY UPDATES" size={62} rot={-4} />
    </>;
  } else if (b === 6) {
    body = <>
      <div style={{ position: 'absolute', left: 860, top: 470, width: 900, height: 4, background: A.line }} />
      <YearCard x={1000} y={470} at={tMarch - 0.1} year="MAR" label="2025 · SECURITY WARNING" />
      <YearCard x={1330} y={470} at={tAug - 0.1} year="AUG" label="2025 · SECURITY WARNING" />
      <YearCard x={1660} y={470} at={tMonths} year="OCT" label="2026 · THE ATTACK" red />
      {t > tMonths && <Chip x={1330} y={760} at={tMonths + 0.2} red>MONTHS BEFORE</Chip>}
    </>;
  } else if (b === 7) {
    body = <>
      <Controller x={1300} y={420} w={420} at={C0(21)} old={0.5} />
      <Crossed x={1000} y={790} at={tTouches} icon="ph:hand-fill" label="NOBODY TOUCHES IT" size={60} />
      {t > tCost && <Chip x={1330} y={790} at={tCost} icon="ph:currency-eur-bold">REPLACING COSTS MONEY</Chip>}
      {t > tStopped && <Chip x={1300} y={150} at={tStopped} red>NO MORE FIXES</Chip>}
    </>;
  } else {
    body = <>
      <div style={{ position: 'absolute', left: 1300, top: 470, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(10, 82px)', gap: 14 }}>
        {Array.from({ length: 40 }, (_, i) => { const u = ramp(t, tThousands + ((i * 13) % 40) * 0.025, 0.3); const open = t > tFacing + (i % 7) * 0.05; return <div key={i} style={{ height: 64, borderRadius: 8, background: open ? '#2a1418' : A.soft, border: `2px solid ${open ? A.red : '#3a3a44'}`, opacity: u, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{open && <Icon name="ph:door-open-fill" size={34} color={A.red} />}</div>; })}
      </div>
      {t > tFacing && <Chip x={1300} y={150} at={tFacing} icon="ph:globe-hemisphere-west-fill">FACING THE INTERNET</Chip>}
      <Stamp x={1300} y={800} at={tLocks + 0.2} text="NO NEW LOCKS. EVER." size={64} rot={-4} />
    </>;
  }
  return <AbsoluteFill><GridBg x={68} />{body}<Host at={S0(2) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 3 · how did they get in (what is known)
const tHow = C0(23), tNobody = C0(24), tInvest = P(24, 'The investigation');
const tSame = C0(25), tOldDev = P(25, 'Old devices'), tReach = P(25, 'reachable from the internet'), tNoUpd3 = P(25, 'no updates');
const tWarned = C0(26), tNotJust = P(26, 'Not just fridges'), tCams = P(26, 'Cameras'), tFact = P(26, 'factory machines'), tPower = P(26, 'power systems');
const tFirm = P(27, 'One security firm'), tPatched = P(27, 'later patched'), tUnconf = P(27, 'nobody has officially');
const tScary = C0(28), tBreak = P(28, "didn't need to break"), tFeature = P(28, 'a feature');
const tDef = C0(29), tWrong = P(29, 'the wrong time');
export const a3NoCaptions: [number, number][] = [];
export const a3Sfx: SfxEvent[] = [{ t: tInvest + 0.3, name: 'impactDeep', vol: 0.25 }, { t: tUnconf + 0.4, name: 'impactDeep', vol: 0.25 }, { t: tDef + 0.2, name: 'clickModern', vol: 0.4 }];
export const A3: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [23, 24, 25, 26, 27, 28, 29]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <div style={{ position: 'absolute', left: 1300, top: 380, transform: 'translateX(-50%)' }}><Kinetic at={tHow + 0.05} size={110} words={[{ w: 'How' }, { w: 'did' }, { w: 'they', br: true }, { w: 'get' }, { w: 'in?', serif: true, color: A.red }]} /></div>;
  } else if (b === 1) {
    body = <>
      <Pop x={1300} y={400} at={tNobody}><Icon name="ph:magnifying-glass-bold" size={220} color={A.white} /></Pop>
      <Stamp x={1300} y={720} at={tInvest + 0.3} text="UNDER INVESTIGATION" size={66} rot={-5} />
    </>;
  } else if (b === 2) {
    body = <>
      <Controller x={1300} y={400} w={420} at={tSame} old={0.6} />
      <Chip x={960} y={760} at={tOldDev} icon="ph:clock-counter-clockwise-fill">OLD</Chip>
      <Chip x={1300} y={760} at={tReach} icon="ph:globe-hemisphere-west-fill">REACHABLE ONLINE</Chip>
      <Chip x={1650} y={760} at={tNoUpd3} icon="ph:x-bold" red>NO UPDATES</Chip>
    </>;
  } else if (b === 3) {
    const items: [number, string, string][] = [[tNotJust, 'mdi:fridge-industrial', 'FRIDGES'], [tCams, 'mdi:cctv', 'CAMERAS'], [tFact, 'ph:factory-fill', 'FACTORIES'], [tPower, 'mdi:transmission-tower', 'POWER']];
    body = <>
      <Chip x={1300} y={170} at={tWarned + 0.1} icon="ph:warning-fill">EXPERTS WARNED FOR YEARS</Chip>
      {items.map(([at, ic, lb], i) => <Pop key={lb} x={980 + i * 220} y={480} at={at}><div style={{ textAlign: 'center' }}><div style={{ width: 170, height: 170, borderRadius: 30, background: A.panel, border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={100} color={A.white} /></div><div style={{ marginTop: 12 }}><Mono size={20} color={A.soft}>{lb}</Mono></div></div></Pop>)}
    </>;
  } else if (b === 4) {
    body = <>
      <Pop x={1300} y={400} at={tFirm}><Panel w={720} pad={36}><div style={{ textAlign: 'center' }}><Mono size={22} color={A.dim}>2025 · SECURITY RESEARCH</Mono><div style={{ marginTop: 14, ...fonts.H, fontWeight: 800, fontSize: 46, color: A.white, lineHeight: 1.1 }}>Weaknesses found in some controllers</div>{t > tPatched && <div style={{ marginTop: 16 }}><Mono size={24} color={A.white}>LATER PATCHED</Mono></div>}</div></Panel></Pop>
      <Stamp x={1300} y={760} at={tUnconf + 0.4} text="NOT CONFIRMED AS THE CAUSE" size={52} rot={-4} />
    </>;
  } else if (b === 5) {
    body = <>
      <Fridge x={1100} y={900} w={400} h={600} seed={7} temp={-18} />
      {t > tBreak && <Chip x={1600} y={380} at={tBreak} icon="ph:check-bold">NOTHING BROKEN</Chip>}
      {t > tFeature && <Chip x={1600} y={520} at={tFeature} red>A FEATURE ALREADY THERE</Chip>}
      {t > tFeature && <Pop x={1600} y={620} at={tFeature + 0.2}><Mono size={20} color={A.dim}>REPORTEDLY</Mono></Pop>}
    </>;
  } else {
    const on = ramp(t, tDef + 0.2, 0.25, EASE.out);
    body = <>
      <Toggle x={1300} y={420} on={on} label="DEFROST" />
      {t > tWrong && <Chip x={1300} y={790} at={tWrong} red solid>WRONG TIME. WRONG REASON.</Chip>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} glow={b === 6 ? 'rgba(255,43,61,.1)' : undefined} />{body}<Host at={S0(3) + 0.2} /></AbsoluteFill>;
};
