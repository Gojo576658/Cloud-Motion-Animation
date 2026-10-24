// Acts 4–7: where the devices came from (one reseller, the chain of hands, the sealed-bottle analogy, who reacted)
// → the report from Germany and the European sales stop → the public fight on X (Karpelès vs Gauthier, CZ, the
// 2020 leak and the fake devices by mail) → what to do, the question, and the closer.
import React from 'react';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S0, TTL } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, AbsoluteFill, GridBg, Label, Panel, Host, beatOf, CX, Chip, Crossed, Tile, Wallet, Box, Node, Post, Bottle, Wire, Subscribe } from './kit';

const Person: React.FC<{ x: number; y: number; at: number; initials: string; name: string; role: string; red?: boolean }> = ({ x, y, at, initials, name, role, red = false }) => (
  <Pop x={x} y={y} at={at}><div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 26px', borderRadius: 18, background: A.panel, border: `2px solid ${red ? A.red : A.line}` }}>
    <div style={{ width: 84, height: 84, borderRadius: '50%', background: red ? A.red : A.white, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 32, color: red ? A.white : '#111' }}>{initials}</div>
    <div><div style={{ ...fonts.H, fontWeight: 900, fontSize: 38, color: A.white, whiteSpace: 'nowrap' }}>{name}</div><Mono size={20} color={red ? A.red : A.soft}>{role}</Mono></div>
  </div></Pop>
);
const Check: React.FC<{ y: number; at: number; text: string; x?: number }> = ({ y, at, text, x = 900 }) => {
  const { t } = useTF();
  const u = ramp(t, at - 0.1, 0.4, EASE.out);
  return <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 22, opacity: u, transform: `translateX(${(1 - u) * 50}px)` }}>
    <div style={{ width: 62, height: 62, borderRadius: 14, background: A.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="ph:check-bold" size={40} color="#111" /></div>
    <div style={{ ...fonts.H, fontWeight: 800, fontSize: 40, color: A.white, maxWidth: 780, lineHeight: 1.15 }}>{text}</div>
  </div>;
};
const CHAIN: [string, string][] = [['ph:factory-fill', 'FACTORY'], ['ph:warehouse-fill', 'WAREHOUSE'], ['ph:storefront-fill', 'RESELLER'], ['ph:user-fill', 'BUYER']];
const ChainRow: React.FC<{ at: number; red?: number; y?: number; labels?: [string, string][] }> = ({ at, red = 2, y = 470, labels = CHAIN }) => (
  <>
    {labels.slice(1).map((_, i) => <Wire key={i} d={`M ${930 + i * 230 + 80} ${y} H ${930 + (i + 1) * 230 - 80}`} at={at + 0.2 + i * 0.2} dur={0.3} len={100} width={4} flow={false} />)}
    {labels.map(([ic, l], i) => <Node key={l} x={930 + i * 230} y={y} at={at + i * 0.2} icon={ic} label={l} red={i === red} />)}
  </>
);

// ================================================================ ACT 4 · the middleman
const tWhere = C0(27), tOneSeller = C0(28), tCB = P(28, 'CryptoBilis'), tMiddle = P(29, 'A middleman'), tWeak = P(29, 'the weak spot'), tOpened = P(29, 'opened these boxes');
const tBottle = C0(30), tOpenB = P(30, 'if someone opened'), tChanged = P(30, "changed what's inside"), tClosed = P(30, 'closed it again'), tDrink = P(30, 'just drink it');
const tWho = C0(31), tLedger = C0(32), tTrezor = P(32, 'Trezor'), tOneKey = P(32, 'OneKey'), tRegion = C0(33), tGermany = P(33, 'Germany');
export const a4NoCaptions: [number, number][] = [];
export const a4Sfx: SfxEvent[] = [{ t: tWeak, name: 'impactDeep', vol: 0.25 }];
export const A4: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [27, 28, 29, 30, 31, 32, 33]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <div style={{ position: 'absolute', left: CX, top: 340, transform: 'translateX(-50%)' }}><Kinetic at={tWhere + 0.05} size={96} words={[{ w: 'Where' }, { w: 'did' }, { w: 'they', br: true }, { w: 'come' }, { w: 'from?', serif: true, color: A.red }]} /></div>;
  } else if (b === 1) {
    body = <>
      <Node x={CX} y={420} at={tOneSeller + 0.2} icon="ph:storefront-fill" label="ONE RESELLER" red={t > tCB} />
      {t > tCB && <Chip x={CX} y={640} at={tCB} red solid>CRYPTOBILIS · SOUTHEAST ASIA</Chip>}
      <Chip x={CX} y={170} at={tOneSeller + 0.4}>EVERY CONFIRMED LOSS · PER LEDGER</Chip>
    </>;
  } else if (b === 2) {
    body = <>
      <ChainRow at={C0(29)} red={t > tMiddle ? 2 : -1} />
      {t > tWeak && <Chip x={CX} y={190} at={tWeak} red>THE WEAK SPOT</Chip>}
      {t > tOpened && <><Box x={1390} y={770} w={250} open={ramp(t, tOpened, 0.5) * (1 - ramp(t, tOpened + 1.6, 0.5))} /><Pop x={1600} y={770} at={tOpened + 0.6}><Label color={A.red} size={24}>+ IMPLANT · RESEALED</Label></Pop></>}
    </>;
  } else if (b === 3) {
    const open = ramp(t, tOpenB, 0.4) * (1 - ramp(t, tClosed, 0.4));
    body = <>
      <Bottle x={CX} y={860} open={open} bad={ramp(t, tChanged, 0.6)} h={480} />
      {t > tBottle && <Chip x={CX} y={190} at={tBottle + 0.2} icon="ph:lock-key-fill">SEALED = TRUSTED</Chip>}
      {t > tDrink && <Pop x={1620} y={520} at={tDrink}><Mono size={24} color={A.red}>YOU'D NEVER KNOW</Mono></Pop>}
    </>;
  } else if (b === 4) {
    body = <><Pop x={CX} y={380} at={tWho + 0.1}><Icon name="ph:magnifying-glass-bold" size={170} color={A.white} /></Pop><Stamp x={CX} y={650} at={tWho + 0.5} text="WHO? WHERE? UNKNOWN" size={50} rot={-4} /></>;
  } else if (b === 5) {
    body = <>
      <Tile x={960} y={420} at={tLedger + 0.1} icon="ph:prohibit-bold" label="LEDGER: SE ASIA SALES STOPPED" size={150} />
      {t > tTrezor && <Tile x={1290} y={420} at={tTrezor} icon="ph:storefront-fill" label="TREZOR: DROPPED THE SELLER" size={150} />}
      {t > tOneKey && <Tile x={1610} y={420} at={tOneKey} icon="ph:arrows-clockwise-bold" label="ONEKEY: FREE REPLACEMENTS" size={150} />}
    </>;
  } else {
    body = <>
      <Pop x={1050} y={420} at={tRegion + 0.1}><div style={{ textAlign: 'center' }}><Icon name="ph:globe-hemisphere-east-fill" size={190} color={A.soft} /><div style={{ marginTop: 10 }}><Mono size={22} color={A.soft}>ONE REGION?</Mono></div></div></Pop>
      {t > tGermany && <Pop x={1520} y={420} at={tGermany}><div style={{ textAlign: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 90, color: A.red }}>GERMANY</div><Mono size={22} color={A.white}>A NEW REPORT</Mono></div></Pop>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} />{body}<Host at={S0(4) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 5 · spreading
const tGer = C0(34), tStore = P(34, 'regular store'), tNotConf = P(35, "hasn't been confirmed"), tMM = P(35, 'MediaMarkt'), tStopped = P(35, 'stopped selling');
const tOther = C0(36), tNobody = P(36, 'nobody can say'), tPeople = C0(37), tTrust = P(37, "don't have to trust"), tEvery = P(37, 'every hand'), tSub = C0(38), tPress = P(38, 'hit subscribe');
export const a5NoCaptions: [number, number][] = [];
export const a5Sfx: SfxEvent[] = [{ t: tStopped, name: 'impactDeep', vol: 0.25 }, { t: tPress, name: 'clickModern', vol: 0.4 }];
export const A5: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [34, 35, 36, 37, 38]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <>
      <Chip x={CX} y={170} at={tGer + 0.1} icon="ph:map-pin-fill" red>GERMANY · REPORTEDLY</Chip>
      <Tile x={1060} y={480} at={tGer + 0.4} icon="ph:storefront-fill" label="A REGULAR STORE · EUROPE" size={160} />
      {t > tStore && <Wallet x={1530} y={480} w={360} open={0.6} implant={1} />}
    </>;
  } else if (b === 1) {
    body = <>
      <Stamp x={CX} y={230} at={tNotConf} text="NOT CONFIRMED" size={60} rot={-4} />
      {t > tMM && <><Tile x={1080} y={540} at={tMM} icon="ph:storefront-fill" label="MEDIAMARKT" size={150} /><Tile x={1460} y={540} at={tMM + 0.3} icon="ph:storefront-fill" label="SATURN" size={150} /></>}
      {t > tStopped && <Chip x={CX} y={790} at={tStopped} icon="ph:prohibit-bold" red solid>LEDGER SALES STOPPED</Chip>}
    </>;
  } else if (b === 2) {
    body = <>
      <Chip x={CX} y={170} at={tOther + 0.1} icon="ph:magnifying-glass-bold">LEDGER REVIEWING OTHER REPORTS</Chip>
      {[[980, 420], [1300, 360], [1590, 470], [1150, 640], [1480, 680]].map(([x, y], i) => <Pop key={i} x={x} y={y} at={tOther + 0.6 + i * 0.25}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 110, color: i % 2 ? A.red : A.white }}>?</div></Pop>)}
      {t > tNobody && <Pop x={CX} y={830} at={tNobody}><Mono size={24} color={A.white}>HOW FAR DOES IT GO?</Mono></Pop>}
    </>;
  } else if (b === 3) {
    body = <>
      {t < tEvery - 0.1 ? <>
        {t > tTrust && <Crossed x={CX} y={420} at={tTrust} icon="ph:users-three-fill" label="TRUST NOBODY · THAT WAS THE POINT" size={120} />}
      </> : <>
        {[0, 1, 2, 3, 4].map((i) => <Pop key={i} x={920 + i * 175} y={420} at={tEvery + i * 0.12}><Icon name="ph:hand-fill" size={110} color={i === 3 ? A.red : A.white} /></Pop>)}
        <Box x={CX} y={700} w={260} />
        <Chip x={CX} y={190} at={tEvery} red>TRUST EVERY HAND</Chip>
      </>}
    </>;
  } else {
    body = <Subscribe x={CX} y={460} at={tSub + 0.2} press={tPress + 0.3} />;
  }
  return <AbsoluteFill><GridBg x={68} />{body}<Host at={S0(5) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 6 · the fight
const tPublic = C0(39), tKarp = P(40, 'Mark Karpelès'), tGox = P(40, 'Mount Gox'), tGuide = P(41, 'a guide'), tBuried = P(41, 'buried'), tMild = P(41, 'far too mild'), tSaved = P(41, 'could have saved');
const tGauth = P(42, 'Pascal Gauthier'), tProtect = P(42, 'works hard'), tBefore = P(42, 'before it ever reached');
const tMessy = C0(43), tMarch = P(43, 'published in March'), tSept = P(43, 'updated in September'), tUnclear = P(43, 'not even clear');
const tPersonal = C0(44), tQuote = P(44, 'you are no white knight'), tCZ = C0(45), tZQuote = P(45, 'a small number');
const tHist = C0(46), t2020 = P(46, 'twenty twenty'), tMail = P(46, 'fake Ledger devices'), tLetter = P(46, 'a letter');
export const a6NoCaptions: [number, number][] = [[tQuote, C1(44)]];
export const a6Sfx: SfxEvent[] = [{ t: tQuote, name: 'impactDeep', vol: 0.3 }];
export const A6: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [39, 40, 41, 42, 43, 44, 45, 46]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <div style={{ position: 'absolute', left: CX, top: 360, transform: 'translateX(-50%)' }}><Kinetic at={tPublic + 0.05} size={100} words={[{ w: 'The' }, { w: 'fight', serif: true, color: A.red }, { w: 'went', br: true }, { w: 'public.' }]} /></div>;
  } else if (b === 1) {
    body = <>
      <Person x={CX} y={300} at={tKarp} initials="MK" name="Mark Karpelès" role="OCT 17 · ON X" />
      {t > tGox && <Tile x={CX} y={620} at={tGox} icon="ph:currency-btc-bold" label="RAN MT. GOX · COLLAPSED IN 2014" red size={150} />}
    </>;
  } else if (b === 2) {
    body = <>
      <Person x={CX} y={190} at={C0(41)} initials="MK" name="Karpelès says" role="PARAPHRASED" />
      <Pop x={CX} y={460} at={tGuide}><Panel w={520} pad={26}><div style={{ textAlign: 'center' }}><Icon name="ph:note-pencil-fill" size={60} color={A.white} /><div style={{ marginTop: 8 }}><Mono size={20} color={A.soft}>LEDGER GUIDE · SINCE MARCH</Mono></div></div></Panel></Pop>
      {t > tBuried && <Chip x={1060} y={700} at={tBuried} red>BURIED</Chip>}
      {t > tMild && <Chip x={1480} y={700} at={tMild} red>TOO MILD</Chip>}
      {t > tSaved && <Pop x={CX} y={820} at={tSaved}><Mono size={22} color={A.white}>"COULD HAVE SAVED PEOPLE" · HIS CLAIM</Mono></Pop>}
    </>;
  } else if (b === 3) {
    body = <>
      <Person x={CX} y={260} at={tGauth} initials="PG" name="Pascal Gauthier" role="LEDGER CEO" red />
      {t > tProtect && <Chip x={CX} y={500} at={tProtect} icon="ph:shield-check-fill">"WE WORK HARD TO PROTECT CUSTOMERS"</Chip>}
      {t > tBefore && <Chip x={CX} y={640} at={tBefore} icon="ph:package-fill">TAMPERED BEFORE IT REACHED THEM</Chip>}
    </>;
  } else if (b === 4) {
    body = <>
      <Pop x={CX} y={380} at={tMessy + 0.2}><Panel w={620} pad={30}><div style={{ textAlign: 'center' }}><Mono size={20} color={A.dim}>LEDGER GUIDE</Mono>
        <div style={{ marginTop: 14, ...fonts.H, fontWeight: 800, fontSize: 40, color: A.white, opacity: t > tMarch ? 1 : 0.2 }}>Published: March</div>
        <div style={{ marginTop: 6, ...fonts.H, fontWeight: 800, fontSize: 40, color: A.red, opacity: t > tSept ? 1 : 0.2 }}>Updated: September</div></div></Panel></Pop>
      {t > tUnclear && <Chip x={CX} y={700} at={tUnclear} icon="ph:question-bold">WHAT DID THE ORIGINAL SAY?</Chip>}
    </>;
  } else if (b === 5) {
    body = <Post x={CX} y={440} at={tQuote - 0.3} name="Pascal Gauthier" handle="Ledger CEO, replying to Karpelès" initials="PG" text={'"You are no white knight. Get real."'} red />;
  } else if (b === 6) {
    body = <>
      <Person x={CX} y={280} at={tCZ + 0.1} initials="CZ" name="Changpeng Zhao" role="BINANCE FOUNDER" />
      {t > tZQuote && <Pop x={CX} y={540} at={tZQuote}><Panel w={820} pad={28}><div style={{ ...fonts.H, fontWeight: 700, fontSize: 38, color: A.white, lineHeight: 1.25, textAlign: 'center' }}>"A small number of people probably bought fake (or tampered) Ledgers"</div></Panel></Pop>}
    </>;
  } else {
    body = <>
      <Tile x={1060} y={420} at={t2020} icon="ph:database-fill" label="2020 · CUSTOMER DATA LEAKED" size={150} />
      {t > tMail && <Tile x={1500} y={420} at={tMail} icon="ph:envelope-simple-fill" label="2021 · FAKE DEVICES BY MAIL" red size={150} />}
      {t > tLetter && <Chip x={CX} y={720} at={tLetter} icon="ph:note-pencil-fill">A LETTER POSING AS THE CEO</Chip>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} glow={b === 5 ? 'rgba(255,43,61,.1)' : undefined} />{body}<Host at={S0(6) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 7 · your turn
const tDo = C0(47), tMaker = C0(48), tCheap = P(48, 'A cheaper price'), tNeverSet = C0(49), tCreated = P(49, 'created by the device');
const tAdvice = C0(50), tUnused = P(50, "Don't set up"), tMove = P(50, 'move your money'), tOldWords = P(50, 'Typing the old words');
const tLesson = C0(51), tHands = P(51, 'Factories'), tStep = P(51, 'every step'), tQ = C0(52), tLedgerQ = P(52, 'Ledger, the reseller'), tComments = P(52, 'Tell me in the comments');
const tSub2 = C0(53), tNext = P(53, 'another hack'), tEnd = C0(54), tKept = P(54, 'kept the secret'), tOnly = P(54, "wasn't the only thing");
export const a7NoCaptions: [number, number][] = [[tEnd, TTL.duration]];
export const a7Sfx: SfxEvent[] = [{ t: tOnly, name: 'impactDeep', vol: 0.35 }];
export const A7: React.FC = () => {
  const { t } = useTF();
  const b = beatOf(t, [47, 48, 49, 50, 51, 52, 53, 54]);
  let body: React.ReactNode = null;
  if (b === 0) {
    body = <div style={{ position: 'absolute', left: CX, top: 360, transform: 'translateX(-50%)' }}><Kinetic at={tDo + 0.05} size={100} words={[{ w: 'What' }, { w: 'should', br: true }, { w: 'you' }, { w: 'do?', serif: true, color: A.red }]} /></div>;
  } else if (b === 1) {
    body = <>
      <Check y={250} at={tMaker + 0.2} text="Buy from the maker, or a store it lists as official" />
      {t > tCheap && <Crossed x={CX} y={640} at={tCheap} icon="ph:tag-fill" label="CHEAPER RANDOM SELLER = RISK" size={100} />}
    </>;
  } else if (b === 2) {
    body = <>
      <Crossed x={1060} y={380} at={tNeverSet + 0.2} icon="ph:note-pencil-fill" label="ARRIVES SET UP / WORDS INCLUDED" size={100} />
      {t > tCreated && <Check y={680} at={tCreated} text="Words made by the device, in front of you" />}
    </>;
  } else if (b === 3) {
    body = <>
      <Chip x={CX} y={170} at={tAdvice + 0.1} icon="ph:shield-check-fill">LEDGER'S ADVICE · CRYPTOBILIS BUYERS</Chip>
      {t > tUnused && <Check y={290} at={tUnused} text="Don't set up an unused device" />}
      {t > tMove && <Check y={430} at={tMove} text="Move funds to a new device with NEW words" />}
      {t > tOldWords && <Crossed x={CX} y={760} at={tOldWords} icon="ph:key-fill" label="OLD WORDS ON A NEW DEVICE = STILL EXPOSED" size={80} />}
    </>;
  } else if (b === 4) {
    body = <>
      <ChainRow at={tHands - 0.3} red={-1} labels={[['ph:factory-fill', 'FACTORY'], ['ph:warehouse-fill', 'WAREHOUSE'], ['ph:storefront-fill', 'RESELLER'], ['ph:truck-fill', 'DELIVERY']]} />
      {t > tStep && <Chip x={CX} y={760} at={tStep} red>SECURITY = EVERY STEP</Chip>}
      <Chip x={CX} y={190} at={tLesson + 0.1}>THE CHAIN OF HANDS</Chip>
    </>;
  } else if (b === 5) {
    body = <>
      <div style={{ position: 'absolute', left: CX, top: 110, transform: 'translateX(-50%)' }}><Kinetic at={tQ + 0.1} size={84} words={[{ w: 'Who' }, { w: 'should' }, { w: 'pay?', serif: true, color: A.red }]} /></div>
      {t > tLedgerQ - 0.1 && [['ph:shield-check-fill', 'LEDGER'], ['ph:storefront-fill', 'THE RESELLER'], ['ph:user-fill', 'NOBODY']].map(([ic, l], i) => <Tile key={l} x={1000 + i * 290} y={470} at={tLedgerQ + i * 0.5} icon={ic} label={l} size={140} />)}
      {t > tComments && <Chip x={CX} y={760} at={tComments} icon="ph:chat-circle-text-fill" red solid>TELL ME IN THE COMMENTS</Chip>}
    </>;
  } else if (b === 6) {
    body = <>
      <Subscribe x={CX} y={360} at={tSub2 + 0.1} press={tSub2 + 0.9} />
      {t > tNext && <Pop x={CX} y={650} at={tNext}><div style={{ display: 'flex', alignItems: 'center', gap: 20 }}><div style={{ width: 140, height: 140, borderRadius: 24, background: A.panel, border: `3px dashed ${A.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 96, color: A.red }}>?</div><Mono size={24} color={A.white}>NEXT: DANGER INSIDE SOMETHING TRUSTED</Mono></div></Pop>}
    </>;
  } else {
    const open = ramp(t, tOnly - 0.3, 0.8, EASE.inOut);
    body = <>
      <Wallet x={1100} y={560} w={460} open={open} implant={open} screen="SAFE" />
      <div style={{ position: 'absolute', left: 1500, top: 260, transform: 'translateX(-50%)' }}><Kinetic at={tKept} size={54} words={[{ w: 'It' }, { w: 'kept' }, { w: 'the', br: true }, { w: 'secret' }, { w: 'safe.' }]} /></div>
      {t > tOnly - 0.2 && <div style={{ position: 'absolute', left: 1500, top: 520, transform: 'translateX(-50%)' }}><Kinetic at={tOnly} size={60} words={[{ w: 'Just' }, { w: 'not' }, { w: 'alone', br: true }, { w: 'in' }, { w: 'the' }, { w: 'box.', serif: true, color: A.red }]} /></div>}
    </>;
  }
  return <AbsoluteFill><GridBg x={68} glow={b === 7 ? 'rgba(255,43,61,.12)' : undefined} />{body}<Host at={S0(7) + 0.2} /></AbsoluteFill>;
};
