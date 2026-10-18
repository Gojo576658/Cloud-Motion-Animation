// Acts 4–7: the night of 11 October (defrost that never ends, the morning after) → how big it was and who is
// investigating → it has happened before (Target, Stuxnet, Ukraine, the casino fish tank) → what happens now,
// the viewer's own devices, the question, and the closer.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, clamp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S0, TTL } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, GridBg, Label, Panel, BigNum, Host, beatOf, Fridge, Temp, Controller, Store, FranceMap, Clock, Wire, Owner, Centrifuge, House, FishTank, Subscribe, FOOD } from './kit';
import { Chip, Crossed, tempAt } from './A0123';

const CX = 1300;
const Tile: React.FC<{ x: number; y: number; at: number; icon: string; label: string; red?: boolean; size?: number }> = ({ x, y, at, icon, label, red = false, size = 170 }) => (
  <Pop x={x} y={y} at={at}><div style={{ textAlign: 'center' }}><div style={{ width: size, height: size, margin: '0 auto', borderRadius: size * 0.18, background: A.panel, border: `2px solid ${red ? A.red : A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={size * 0.6} color={red ? A.red : A.white} /></div><div style={{ marginTop: 12 }}><Mono size={20} color={A.soft}>{label}</Mono></div></div></Pop>
);

// ================================================================ ACT 4 · the night
const tDate = C0(30), tHijack = P(31, 'hijacked'), tLocked = P(31, 'locked the fridges'), tInstead = P(31, 'Instead of one hour'), tSix = P(31, 'six hours or more');
const tClosed = C0(32), tNobody = P(32, 'nobody there'), tHours = C0(33), tRetailer = P(33, 'One retailer said');
const tSame = C0(34), tCoord = P(34, 'coordinated attack'), tClimb = C0(35), tCook = P(35, 'slowly cooking');
const FOODS: [string, string, string][] = [['Meat', 'mdi:food-steak', 'MEAT'], ['fish', 'ph:fish-fill', 'FISH'], ['milk', 'mdi:bottle-soda', 'MILK'], ['cheese', 'mdi:cheese', 'CHEESE'], ['ice cream', 'mdi:ice-cream', 'ICE CREAM']];
const tFood = FOODS.map(([p]) => P(35, p));
const tMorning = C0(36), tWarmF = P(36, 'warm freezers'), tMelted = P(36, 'melted food'), tFire = P(36, 'reports of fires');
const tManager = C0(37), tWall = P(37, 'a wall of heat'), tEvery = P(37, 'Every fridge'), tWhy = P(37, 'no idea why');
const tTons = P(38, 'tons of food'), tBreakfast = P(38, 'before most people'), tSub = C0(39), tPress = P(39, 'hit subscribe');
export const a4NoCaptions: [number, number][] = [];
export const a4Sfx: SfxEvent[] = [{ t: tLocked + 0.2, name: 'error', vol: 0.25 }, { t: tCoord + 0.2, name: 'impactDeep', vol: 0.3 }, { t: tPress, name: 'clickModern', vol: 0.4 }];
const HEAT4: [number, number][] = [[tHours, -18], [C1(33), 20], [tClimb, 30], [tCook, 50]];
export const A4: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <Store x={CX} y={900} w={700} lit={0} />
      <Pop x={CX} y={190} at={tDate}><div style={{ textAlign: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 120, color: A.white, letterSpacing: '-0.03em', lineHeight: 1 }}>11 OCTOBER</div><div style={{ marginTop: 10 }}><Mono size={28} color={A.red}>SUNDAY NIGHT · 2026</Mono></div></div></Pop>
    </>;
  } else if (b === 1) {
    const normal = ramp(t, tInstead, 0.5), locked = ramp(t, tSix - 0.2, 1.4, EASE.inOut);
    body = <>
      <Controller x={1060} y={380} w={400} mode={t > tLocked ? 'LOCKED' : 'DEFROST'} at={tHijack} rows={[['DEFROST', 'ON'], ['CASE 01', '+12.0']]} hot={t > tLocked ? [0, 1] : []} />
      {t > tLocked && <Pop x={1540} y={380} at={tLocked}><div style={{ textAlign: 'center' }}><Icon name="ph:lock-key-fill" size={140} color={A.red} /><div style={{ marginTop: 8 }}><Mono size={22} color={A.red}>CYCLE LOCKED · REPORTEDLY</Mono></div></div></Pop>}
      {t > tInstead - 0.1 && <div style={{ position: 'absolute', left: 860, top: 660, width: 920 }}>
        <Mono size={22} color={A.soft}>NORMAL DEFROST</Mono>
        <div style={{ marginTop: 8, height: 34, width: 120 * normal, borderRadius: 6, background: A.white }} />
        <div style={{ marginTop: 22 }}><Mono size={22} color={A.red}>THAT NIGHT</Mono></div>
        <div style={{ marginTop: 8, height: 34, width: 820 * locked, borderRadius: 6, background: A.red, boxShadow: '0 0 30px rgba(255,43,61,.4)' }} />
        <div style={{ position: 'absolute', left: 130, top: 34 }}><Mono size={20} color={A.white}>~1 H</Mono></div>
        {locked > 0.9 && <div style={{ position: 'absolute', right: 0, top: 112 }}><Mono size={20} color={A.white}>6+ H</Mono></div>}
      </div>}
    </>;
  } else if (b === 2) {
    body = <>
      <Store x={CX} y={900} w={760} lit={0} heat={0.25} />
      <div style={{ position: 'absolute', left: 1680, top: 130 }}><Icon name="ph:moon-fill" size={90} color={A.soft} glow /></div>
      {t > tNobody && <Chip x={CX} y={190} at={tNobody} icon="ph:user-fill">NOBODY THERE</Chip>}
    </>;
  } else if (b === 3) {
    const v = tempAt(t, HEAT4);
    body = <>
      <Clock x={1050} y={430} size={330} from={23} to={29} at={tHours} d={Math.max(2, C1(33) - tHours)} red />
      <div style={{ position: 'absolute', left: 1570, top: 420, transform: 'translate(-50%,-50%)' }}><Temp v={v} size={150} sub="CASE 01" /></div>
      {t > tRetailer && <Chip x={CX} y={800} at={tRetailer} icon="ph:quotes-fill">ONE RETAILER: ~6 HOURS HOT</Chip>}
    </>;
  } else if (b === 4) {
    body = <>
      <FranceMap x={CX} y={480} size={640} pins={320} at={tSame + 0.1} all={1} />
      <Stamp x={CX} y={820} at={tCoord + 0.2} text="COORDINATED" size={74} rot={-5} />
    </>;
  } else if (b === 5) {
    const v = tempAt(t, HEAT4), heat = clamp((v + 18) / 68);
    body = <>
      <Fridge x={1080} y={900} w={420} h={660} heat={heat} seed={11} temp={v} doors={2} />
      <div style={{ position: 'absolute', left: 1600, top: 230, transform: 'translate(-50%,-50%)' }}><Temp v={v} size={120} /></div>
      {FOODS.map(([, ic, lb], i) => <Pop key={lb} x={1600} y={360 + i * 92} at={tFood[i]}><Label size={26} color={t > tCook ? A.red : A.white}><Icon name={ic} size={30} color={t > tCook ? A.red : A.white} /> {lb}</Label></Pop>)}
    </>;
  } else if (b === 6) {
    body = <>
      <Store x={CX} y={900} w={760} lit={1} heat={0.9} closed={false} />
      <div style={{ position: 'absolute', left: 1660, top: 120 }}><Icon name="ph:sun-horizon-fill" size={100} color={A.white} /></div>
      <Chip x={1000} y={200} at={tWarmF} icon="ph:thermometer-hot-fill" red>WARM FREEZERS</Chip>
      <Chip x={1380} y={200} at={tMelted} icon="ph:drop-fill">MELTED FOOD</Chip>
      {t > tFire - 0.1 && <Chip x={CX} y={300} at={tFire} icon="ph:fire-fill" red solid>REPORTED FIRES</Chip>}
    </>;
  } else if (b === 7) {
    const wave = ramp(t, tWall, 0.5);
    body = <>
      {t > tEvery - 0.1 && [0, 1, 2, 3].map((i) => <Pop key={i} x={0} y={0} at={tEvery + i * 0.08} from={20}><Fridge x={930 + i * 270} y={640} w={230} h={360} heat={0.95} seed={20 + i} doors={1} /></Pop>)}
      <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${900 + i * 200} 900 q 30 -60 0 -120 q -30 -60 0 -120`} stroke={A.red} strokeWidth={6} fill="none" opacity={wave * (0.4 + 0.4 * Math.sin(t * 4 + i))} transform={`translate(0 ${-((t * 40 + i * 20) % 60)})`} />)}</svg>
      <Owner x={1300} y={1000} size={440} mood={t > tWall ? 'shock' : 'calm'} />
      {t > tWhy && <Pop x={1560} y={400} at={tWhy}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 150, color: A.white }}>?</div></Pop>}
      <Chip x={CX} y={130} at={tManager + 0.1} icon="ph:storefront-fill">THE STORE MANAGER</Chip>
    </>;
  } else if (b === 8) {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 640, transform: 'translate(-50%,-50%)' }}><Icon name="ph:trash-fill" size={320} color={A.soft} /></div>
      {FOOD.map((ic, i) => { const u = ((t - C0(38)) * 0.9 + i * 0.13) % 1; return <div key={ic} style={{ position: 'absolute', left: CX - 120 + (i % 4) * 80, top: 150 + u * 380, opacity: Math.sin(u * Math.PI), transform: `rotate(${u * 180}deg)` }}><Icon name={ic} size={70} color="#ffd0d4" /></div>; })}
      {t > tTons && <Chip x={CX} y={130} at={tTons} red solid>TONS OF FOOD THROWN AWAY</Chip>}
      {t > tBreakfast && <Chip x={CX} y={870} at={tBreakfast} icon="ph:coffee-fill">BEFORE BREAKFAST</Chip>}
    </>;
  } else {
    body = <Subscribe x={CX} y={480} at={tSub + 0.2} press={tPress + 0.3} />;
  }
  return <AbsoluteFill><GridBg x={68} glow={b >= 3 && b <= 7 ? 'rgba(255,43,61,.1)' : undefined} />{body}<Host at={S0(4) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 5 · how big
const tBig = C0(40), tInter = P(41, 'Intermarché'), tCarre = P(41, 'Carrefour'), tMono = P(41, 'Monoprix'), tLecl = P(41, 'Leclerc'), tCoop = P(41, 'Coopérative');
const tEarly = C0(42), tSeven = P(42, 'seven hundred'), tTenK = P(42, 'ten thousand'), tAlsace = P(43, 'two hundred and seventy'), tMult = P(43, 'multiply that');
const tAgency = P(44, 'national cyber agency'), tCope = P(44, 'Copeland'), tDix = P(44, 'Dixell'), tNL = P(45, 'Netherlands'), tCheck = P(45, 'still being checked');
const tPM = C0(46), tPros = P(46, 'Paris prosecutors'), tClaim = P(46, 'nobody has claimed'), tHybrid = P(47, 'hybrid attacks'), tNoEv = P(47, 'no public evidence');
export const a5NoCaptions: [number, number][] = [];
export const a5Sfx: SfxEvent[] = [{ t: tSeven, name: 'impactDeep', vol: 0.3 }, { t: tNoEv + 0.3, name: 'impactDeep', vol: 0.25 }];
const ROW: React.FC<{ y: number; at: number; name: string; note: string; red?: boolean }> = ({ y, at, name, note, red = false }) => {
  const { t } = useTF();
  const u = ramp(t, at - 0.1, 0.4, EASE.out);
  return <div style={{ position: 'absolute', left: 900, top: y, width: 860, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', borderRadius: 14, background: A.panel, border: `2px solid ${red ? A.red : A.line}`, opacity: u, transform: `translateX(${(1 - u) * 60}px)` }}>
    <div style={{ ...fonts.H, fontWeight: 900, fontSize: 40, color: A.white }}>{name}</div><Mono size={22} color={red ? A.red : A.soft}>{note}</Mono>
  </div>;
};
export const A5: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [40, 41, 42, 43, 44, 45, 46, 47]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <div style={{ position: 'absolute', left: CX, top: 390, transform: 'translateX(-50%)' }}><Kinetic at={tBig + 0.05} size={120} words={[{ w: 'How' }, { w: 'big?', serif: true, color: A.red }]} /></div>;
  } else if (b === 1) {
    body = <>
      <ROW y={150} at={tInter} name="INTERMARCHÉ + NETTO" note="UP TO ~300 · REPORTED" red />
      <ROW y={290} at={tCarre} name="CARREFOUR" note="ABOUT 80" />
      <ROW y={430} at={tMono} name="MONOPRIX" note="AFFECTED" />
      <ROW y={570} at={tLecl} name="LECLERC" note="AFFECTED" />
      <ROW y={710} at={tCoop} name="COOPÉRATIVE U" note="AFFECTED" />
    </>;
  } else if (b === 2) {
    body = <>
      <FranceMap x={1080} y={480} size={560} pins={t > tSeven ? 400 : 160} at={t > tSeven ? tSeven - 0.4 : tEarly} spread={0.8} />
      <Pop x={1600} y={300} at={tEarly + 0.2}><Mono size={24} color={A.soft}>EARLY COUNTS: A FEW HUNDRED</Mono></Pop>
      {t > tSeven - 0.1 && <div style={{ position: 'absolute', left: 1600, top: 470, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><BigNum to={700} at={tSeven} d={0.9} size={190} color={A.red} /><Mono size={24} color={A.white}>STORES · FINANCE MINISTER</Mono></div>}
      {t > tTenK && <Chip x={1600} y={700} at={tTenK}>OUT OF ~10,000</Chip>}
    </>;
  } else if (b === 3) {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 380, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><BigNum to={270000} at={tAlsace} d={1.1} prefix="€" size={170} /><div style={{ marginTop: 10 }}><Mono size={24} color={A.soft}>2 STORES IN ALSACE · REPORTED</Mono></div></div>
      {t > tMult && <Chip x={CX} y={700} at={tMult} red solid>× HUNDREDS OF STORES</Chip>}
    </>;
  } else if (b === 4) {
    body = <>
      <Chip x={CX} y={160} at={tAgency} icon="ph:shield-check-fill">ANSSI · FRANCE'S CYBER AGENCY</Chip>
      <Controller x={980} y={500} w={300} at={tCope - 0.7} brand="DANFOSS" />
      <Controller x={1300} y={500} w={300} at={tCope} brand="COPELAND" />
      <Controller x={1620} y={500} w={300} at={tDix} brand="DIXELL" />
      {t > tDix + 0.3 && <Chip x={CX} y={780} at={tDix + 0.3} red>AT LEAST 3 MAKERS</Chip>}
    </>;
  } else if (b === 5) {
    body = <>
      <FranceMap x={1150} y={560} size={520} pins={200} at={C0(45) - 1} all={1} neighbours={ramp(t, tNL - 0.2, 0.5)} />
      {t > tNL && <><Pop x={1600} y={280} at={tNL}><Label size={30}>NETHERLANDS · BELGIUM</Label></Pop><Pop x={1600} y={360} at={tNL + 0.2}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 80, color: A.red }}>?</div></Pop></>}
      {t > tCheck && <Chip x={1600} y={480} at={tCheck}>STILL BEING CHECKED</Chip>}
    </>;
  } else if (b === 6) {
    body = <>
      <Tile x={1050} y={420} at={tPM + 0.1} icon="ph:bank-fill" label="PM → ANSSI: INVESTIGATE" />
      <Tile x={1550} y={420} at={tPros} icon="ph:gavel-fill" label="PARIS PROSECUTORS: CASE OPEN" />
      <Stamp x={CX} y={760} at={tClaim + 0.2} text="NO CLAIM OF RESPONSIBILITY" size={52} rot={-4} />
    </>;
  } else {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 260, transform: 'translateX(-50%)' }}><Kinetic at={tHybrid - 0.1} size={96} words={[{ w: '"Hybrid' }, { w: 'attacks"?', serif: true }]} /></div>
      <Stamp x={CX} y={640} at={tNoEv + 0.3} text="NO PUBLIC EVIDENCE" size={70} rot={-5} />
    </>;
  }
  return <AbsoluteFill><GridBg x={68} />{body}<Host at={S0(5) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 6 · it happened before
const tBefore = C0(48), t2013 = P(49, '2013'), tForty = P(49, 'forty million'), tWayIn = P(49, 'the way in'), tHvac = P(49, 'heating and air');
const tReal = P(50, 'real world'), tStux = P(51, 'Stuxnet'), tDamaged = P(51, 'damaged'), tScreens = P(51, 'the screens showed');
const t2015 = P(52, '2015'), tOff = P(52, 'switched off the power'), tWinter = P(52, 'middle of winter');
const tCasino = P(53, 'casino'), tThermo = P(53, 'smart thermometer'), tTank = P(53, 'fish tank');
const tA1 = P(54, 'A fish tank'), tA2 = P(54, 'A heater'), tA3 = P(54, 'A fridge'), tNoUp = P(54, 'Nobody updates them'), tNets = P(54, 'same networks');
const tSaying = C0(55), tFront = P(55, 'front door'), tBoiler = P(55, 'boiler room');
export const a6NoCaptions: [number, number][] = [[tSaying, C1(55)]];
export const a6Sfx: SfxEvent[] = [{ t: tOff + 0.4, name: 'impactDeep', vol: 0.3 }, { t: tBoiler, name: 'impactDeep', vol: 0.3 }];
export const A6: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [48, 49, 50, 51, 52, 53, 54, 55]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <div style={{ position: 'absolute', left: CX, top: 360, transform: 'translateX(-50%)' }}><Kinetic at={tBefore + 0.2} size={100} words={[{ w: 'This' }, { w: 'has' }, { w: 'happened', br: true }, { w: 'before.', serif: true, color: A.red }]} /></div>;
  } else if (b === 1) {
    body = <>
      <Chip x={CX} y={140} at={t2013}>2013 · TARGET · USA</Chip>
      {t > tForty - 0.1 && t < tWayIn && <div style={{ position: 'absolute', left: CX, top: 460, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}><Icon name="ph:credit-card-fill" size={120} color={A.white} /><BigNum to={40} at={tForty} d={0.8} suffix="M" size={170} color={A.red} /></div><Mono size={24} color={A.soft}>SHOPPERS' CARDS · AROUND</Mono></div>}
      {t > tWayIn - 0.1 && <>
        <Tile x={980} y={460} at={tWayIn} icon="ph:fan-fill" label="HEATING & AIR VENDOR" />
        <Wire d="M 1080 460 L 1520 460" at={tHvac - 0.2} dur={0.6} red />
        <Tile x={1300} y={340} at={tHvac - 0.1} icon="ph:key-fill" label="STOLEN LOGIN" red size={120} />
        <Tile x={1620} y={460} at={tHvac + 0.3} icon="ph:storefront-fill" label="TARGET'S NETWORK" />
      </>}
    </>;
  } else if (b === 2) {
    body = <div style={{ position: 'absolute', left: CX, top: 360, transform: 'translateX(-50%)' }}><Kinetic at={C0(50) + 0.1} size={92} words={[{ w: 'Not' }, { w: 'just' }, { w: 'data.', br: true }, { w: 'Real' }, { w: 'things.', serif: true, color: A.red }]} /></div>;
  } else if (b === 3) {
    const bad = ramp(t, tDamaged, 0.6);
    body = <>
      <Chip x={CX} y={130} at={tStux}>STUXNET · IRAN · ~2010</Chip>
      {[0, 1, 2, 3, 4].map((i) => <Centrifuge key={i} x={920 + i * 120} y={760} h={380} bad={bad} seed={i} />)}
      {t > tScreens - 0.1 && <Pop x={1640} y={520} at={tScreens}><Panel w={300} pad={26}><div style={{ textAlign: 'center' }}><Icon name="ph:monitor-fill" size={70} color={A.white} /><div style={{ marginTop: 10 }}><Mono size={22} color={A.white}>SCREEN: ALL NORMAL</Mono></div></div></Panel></Pop>}
    </>;
  } else if (b === 4) {
    const dark = (i: number) => 1 - ramp(t, tOff + 0.3 + i * 0.12, 0.2);
    body = <>
      <Chip x={CX} y={130} at={t2015}>UKRAINE · 2015</Chip>
      <Pop x={950} y={560} at={t2015 + 0.2}><Icon name="mdi:transmission-tower" size={300} color={A.soft} /></Pop>
      {[0, 1, 2, 3, 4, 5].map((i) => <House key={i} x={1180 + (i % 3) * 200} y={i < 3 ? 520 : 760} size={150} lit={dark(i)} />)}
      {t > tWinter && <Chip x={CX} y={850} at={tWinter} icon="ph:snowflake-bold">HUNDREDS OF THOUSANDS · IN WINTER</Chip>}
    </>;
  } else if (b === 5) {
    body = <>
      <Chip x={CX} y={130} at={tCasino} icon="ph:poker-chip-fill">A CASINO · REPORTED BY A SECURITY FIRM</Chip>
      <FishTank x={1180} y={760} w={520} signal={ramp(t, tThermo, 0.5)} />
      {t > tThermo && <Wire d="M 1420 380 Q 1560 300 1680 460" at={tThermo + 0.3} dur={0.6} red />}
      {t > tThermo && <Tile x={1700} y={560} at={tThermo + 0.7} icon="ph:database-fill" label="THE NETWORK" red size={140} />}
      {t > tTank && <Pop x={1180} y={850} at={tTank}><Mono size={22} color={A.white}>LOBBY FISH TANK</Mono></Pop>}
    </>;
  } else if (b === 6) {
    const items: [number, string, string][] = [[tA1, 'mdi:fishbowl-outline', 'FISH TANK'], [tA2, 'mdi:radiator', 'HEATER'], [tA3, 'mdi:fridge-industrial', 'FRIDGE']];
    body = <>
      {items.map(([at, ic, lb], i) => <Tile key={lb} x={1000 + i * 300} y={360} at={at} icon={ic} label={lb} />)}
      {t > tNets && items.map((_, i) => <Wire key={i} d={`M ${1000 + i * 300} 470 Q ${1000 + i * 300} 640 1300 680`} at={tNets + i * 0.08} dur={0.4} len={600} width={3} flow={false} />)}
      {t > tNets && <Tile x={CX} y={760} at={tNets + 0.3} icon="ph:network-fill" label="SAME NETWORK" size={110} />}
      <Stamp x={CX} y={130} at={tNoUp + 0.2} text="NOBODY UPDATES THEM" size={56} rot={-4} />
    </>;
  } else {
    body = <>
      <Pop x={CX} y={160} at={tSaying}><Mono size={24} color={A.soft}>A SECURITY SAYING</Mono></Pop>
      <Tile x={1050} y={480} at={tFront} icon="ph:door-fill" label="FRONT DOOR · LOCKED" />
      <Tile x={1550} y={480} at={tBoiler} icon="ph:door-open-fill" label="BOILER ROOM · OPEN" red />
      {t > tBoiler && <div style={{ position: 'absolute', left: CX, top: 700, transform: 'translateX(-50%)' }}><Kinetic at={tBoiler} size={64} words={[{ w: 'Through' }, { w: 'the' }, { w: 'boiler', serif: true, color: A.red }, { w: 'room.' }]} /></div>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} />{body}<Host at={S0(6) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 7 · your turn
const tNow = C0(56), tOffNet = P(57, 'off the open internet'), tPriv = P(57, 'private connection'), tPw = P(57, 'default passwords');
const tRepl = P(58, 'replaced'), tLot = P(58, 'a lot of new boxes'), tYou = C0(59), tRouter = P(59, 'Your router'), tTv = P(59, 'smart TV'), tBell = P(59, 'doorbell camera'), tWhen = P(59, 'When did you'), tPass = P(59, 'the password');
const tPay = P(60, 'Who should pay'), tMarkets = P(60, 'The supermarkets'), tMaker = P(60, 'the company'), tComments = P(60, 'Tell me in the comments');
const tSub2 = C0(61), tNext = P(61, 'another everyday object'), tEnd = C0(62), tNight = P(62, 'And one night'), tOven = P(62, 'became an oven');
export const a7NoCaptions: [number, number][] = [[tEnd, TTL.duration]];
export const a7Sfx: SfxEvent[] = [{ t: tOven, name: 'impactDeep', vol: 0.35 }];
const Check: React.FC<{ y: number; at: number; text: string }> = ({ y, at, text }) => {
  const { t } = useTF();
  const u = ramp(t, at - 0.1, 0.4, EASE.out);
  return <div style={{ position: 'absolute', left: 940, top: y, display: 'flex', alignItems: 'center', gap: 24, opacity: u, transform: `translateX(${(1 - u) * 50}px)` }}>
    <div style={{ width: 66, height: 66, borderRadius: 14, background: A.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:check-bold" size={44} color="#111" /></div>
    <div style={{ ...fonts.H, fontWeight: 800, fontSize: 44, color: A.white }}>{text}</div>
  </div>;
};
export const A7: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [56, 57, 58, 59, 60, 61, 62]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <div style={{ position: 'absolute', left: CX, top: 380, transform: 'translateX(-50%)' }}><Kinetic at={tNow + 0.05} size={104} words={[{ w: 'What' }, { w: 'happens', br: true }, { w: 'now?', serif: true, color: A.red }]} /></div>;
  } else if (b === 1) {
    body = <>
      <Chip x={CX} y={160} at={C0(57)} icon="ph:shield-check-fill">ANSSI'S ADVICE</Chip>
      <Check y={330} at={tOffNet} text="Off the open internet" />
      <Check y={470} at={tPriv} text="Behind a private connection" />
      <Check y={610} at={tPw} text="Change default passwords" />
    </>;
  } else if (b === 2) {
    const swap = ramp(t, tRepl, 0.7, EASE.inOut);
    body = <>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-swap * 500}px)`, opacity: 1 - swap }}><Controller x={1300} y={440} w={420} old={0.8} brand="LEGACY UNIT" /></div>
      {swap > 0 && <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - swap) * 500}px)`, opacity: swap }}><Controller x={1300} y={440} w={420} brand="NEW UNIT" /></div>}
      {t > tLot && [0, 1, 2, 3, 4, 5].map((i) => <Pop key={i} x={960 + i * 136} y={800} at={tLot + i * 0.06}><div style={{ width: 110, height: 86, borderRadius: 10, background: A.soft }} /></Pop>)}
      {t > tRepl && <Chip x={CX} y={140} at={tRepl}>REPLACE THE OLDEST UNITS</Chip>}
    </>;
  } else if (b === 3) {
    const items: [number, string, string][] = [[tRouter, 'mdi:router-wireless', 'ROUTER'], [tTv, 'mdi:television', 'SMART TV'], [tBell, 'mdi:doorbell-video', 'DOORBELL CAM']];
    body = <>
      <Chip x={CX} y={140} at={tYou + 0.1} icon="ph:house-fill">YOUR HOME</Chip>
      {items.map(([at, ic, lb], i) => <Tile key={lb} x={1000 + i * 300} y={430} at={at} icon={ic} label={lb} />)}
      {t > tWhen && items.map((_, i) => <Pop key={i} x={1000 + i * 300} y={640} at={tWhen + i * 0.1}><Mono size={20} color={A.red}>LAST UPDATE: ?</Mono></Pop>)}
      {t > tPass && <Chip x={CX} y={780} at={tPass} icon="ph:password-fill" red>PASSWORD: ?</Chip>}
    </>;
  } else if (b === 4) {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 110, transform: 'translateX(-50%)' }}><Kinetic at={tPay} size={84} words={[{ w: 'Who' }, { w: 'should' }, { w: 'pay?', serif: true, color: A.red }]} /></div>
      <Tile x={1060} y={500} at={tMarkets} icon="ph:storefront-fill" label="THE SUPERMARKETS" />
      <Pop x={CX} y={500} at={tMaker - 0.2}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 60, color: A.dim }}>OR</div></Pop>
      <Tile x={1540} y={500} at={tMaker} icon="mdi:fridge-industrial" label="THE BOX MAKER" />
      {t > tComments && <Chip x={CX} y={800} at={tComments} icon="ph:chat-circle-text-fill" red solid>TELL ME IN THE COMMENTS</Chip>}
    </>;
  } else if (b === 5) {
    body = <>
      <Subscribe x={CX} y={360} at={tSub2 + 0.1} press={tSub2 + 0.9} />
      {t > tNext && <Pop x={CX} y={660} at={tNext}><div style={{ display: 'flex', alignItems: 'center', gap: 20 }}><div style={{ width: 150, height: 150, borderRadius: 24, background: A.panel, border: `3px dashed ${A.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 100, color: A.red }}>?</div><Mono size={24} color={A.white}>NEXT: ANOTHER EVERYDAY OBJECT</Mono></div></Pop>}
    </>;
  } else {
    const heat = ramp(t, tNight, Math.max(0.8, tOven - tNight + 0.4), EASE.inOut);
    body = <>
      <Fridge x={1100} y={900} w={420} h={640} heat={heat} seed={13} temp={-18 + 68 * heat} />
      <div style={{ position: 'absolute', left: 1600, top: 300, transform: 'translateX(-50%)' }}><Kinetic at={tEnd + 0.1} size={64} words={[{ w: 'Nobody' }, { w: 'updated', br: true }, { w: 'the' }, { w: 'fridge.' }]} /></div>
      {t > tOven - 0.2 && <div style={{ position: 'absolute', left: 1600, top: 560, transform: 'translateX(-50%)' }}><Kinetic at={tOven - 0.1} size={92} words={[{ w: 'An' }, { w: 'oven.', serif: true, color: A.red }]} /></div>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} glow={b === 6 ? 'rgba(255,43,61,.12)' : undefined} />{body}<Host at={S0(7) + 0.2} /></AbsoluteFill>;
};
