// Acts 2–3: the drive gets heavier (price climbs, chains), the eight-guess montage, "Two left.", the
// New York Times quote, the money meter; then why nobody can open it (the brute-force robot gag, the
// counter that survives a year, epoxy vs drill, no backdoor), "impossible… right?" and Ike's subscribe line.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { C } from '../lib/theme';
import { fonts } from './type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, PE, W } from './ttime';
import { useTF, P as COL, camAt, Layer, Ike, Vault, Person, Robot, QuoteCard, Pop, Count, Title, Mono } from './kit';
import { Stamp, Burst } from '../cpu/fx';

// ================================================================ ACT 2 · eight guesses
const tCheap = C0(18), tClimb = P(19, 'Then the price'), tP100 = P(19, 'A hundred'), tP1k = P(19, 'A thousand'), tP10k = P(19, 'Ten thousand');
const tValuable = P(20, 'every time'), tMoreLocked = P(20, 'got heavier');
const tGuessing = C0(21), tUsual = P(21, 'The passwords');
const MISS = [W(22, 0), W(22, 1), W(22, 2), W(22, 3), W(22, 4), W(22, 5), W(22, 6), C0(23)];
const tTwoLeft = C0(24), tQuote = C0(25), tLay = P(25, 'I would just'), tNight = P(26, 'every single night'), tMoney = C0(27), t220 = P(27, 'two hundred'), t900 = P(27, 'close to nine');
const tBreakQ = P(28, 'break it open');
export const a2NoCaptions: [number, number][] = [[tTwoLeft - 0.1, C1(24) + 0.6]];
export const a2Sfx: SfxEvent[] = [
  { t: tCheap, name: 'tick', vol: 0.3, note: 'Ike naps' }, { t: tClimb, name: 'riser', vol: 0.3, dur: 5 },
  ...[tP100, tP1k, tP10k].map((x, i) => ({ t: x, name: 'woodHit' as const, vol: 0.35 + i * 0.1, note: 'shelf sags' })), { t: tP10k + 0.3, name: 'glassHit', vol: 0.35, note: 'crack' },
  { t: tValuable - 0.1, name: 'lockQuick', vol: 0.4, note: 'chain' }, { t: tMoreLocked, name: 'lock', vol: 0.55, note: 'padlock' },
  { t: tGuessing - 0.1, name: 'switchLight', vol: 0.3, note: 'night' }, { t: tUsual, name: 'keyboard', vol: 0.3, dur: 2.5 },
  ...MISS.map((x, i) => ({ t: x, name: (i < 7 ? 'negGuitar' : 'loseTone') as 'negGuitar', vol: 0.32 + i * 0.03, rate: 1 - i * 0.04, note: `miss ${i + 1}` })),
  ...MISS.map((x, i) => ({ t: x + 0.05, name: 'heartbeat' as const, vol: 0.35 + i * 0.04 })),
  { t: tTwoLeft - 0.05, name: 'heartbeat', vol: 0.7, note: 'Two left.' },
  { t: tQuote - 0.2, name: 'swooshSlow', vol: 0.3 }, { t: tLay, name: 'paperSlide', vol: 0.35, note: 'quote card' },
  { t: tMoney - 0.1, name: 'riser', vol: 0.3, dur: 3 }, { t: t220, name: 'coins', vol: 0.4 }, { t: t900, name: 'impactDeep', vol: 0.45, note: '$880M' },
];
const Chart: React.FC<{ u: number }> = ({ u }) => {
  const pts = [[0, 0.02], [0.2, 0.03], [0.35, 0.08], [0.5, 0.18], [0.62, 0.3], [0.75, 0.52], [0.86, 0.7], [1, 0.97]];
  const W0 = 700, H0 = 420;
  const n = Math.max(1, Math.floor(u * (pts.length - 1)) + 1);
  const d = pts.slice(0, n + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x * W0} ${H0 - y * H0}`).join(' ');
  return (
    <svg width={W0} height={H0} style={{ overflow: 'visible' }}>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W0} y1={H0 * g} y2={H0 * g} stroke="rgba(255,255,255,.06)" strokeWidth="2" />)}
      <path d={d} stroke={COL.gold} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${COL.gold})` }} />
    </svg>
  );
};
export const A2: React.FC = () => {
  const { f, fps, t } = useTF();
  const r = rng(Math.round(t * 30));
  // ---- the drive gets heavier
  if (t < tGuessing - 0.2) {
    const lvl = [tP100, tP1k, tP10k].filter((x) => t > x).length;
    const sag = lerp(0, 70, lvl / 3) + (t > tP10k ? Math.sin((t - tP10k) * 30) * 6 * Math.exp(-(t - tP10k) * 4) : 0);
    const chains = ramp(t, tValuable - 0.2, 0.8);
    return (
      <AbsoluteFill>
        <Vault light={0.6} pedestal={false} />
        <div style={{ position: 'absolute', left: 120, top: 200, width: 820, height: 580, borderRadius: 26, background: 'rgba(7,11,22,.8)', border: '2px solid rgba(255,255,255,.08)', padding: '30px 60px' }}>
          <Mono size={24} color={COL.gold}>BITCOIN PRICE</Mono>
          <div style={{ marginTop: 40 }}><Chart u={ramp(t, tClimb, tP10k - tClimb + 0.6, EASE.inOut)} /></div>
          {[[tP100, '$100', 0.35], [tP1k, '$1,000', 0.62], [tP10k, '$10,000', 0.86]].map(([at, lb, x]) => <Pop key={lb as string} x={60 + (x as number) * 700} y={130 + (1 - (x as number)) * 330} at={(at as number) - 0.05}><div style={{ padding: '6px 16px', borderRadius: 10, background: COL.gold, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: '#2a1a00', whiteSpace: 'nowrap' }}>{lb as string}</div></Pop>)}
        </div>
        {/* shelf that sags */}
        <svg style={{ position: 'absolute', left: 1080, top: 760 }} width="640" height="200"><path d={`M0 10 Q320 ${10 + sag} 640 10 L640 40 Q320 ${40 + sag} 0 40 Z`} fill="#6b4a2e" stroke="#3a2614" strokeWidth="4" />{t > tP10k && <path d={`M320 ${12 + sag} l-12 14 l16 6 l-10 16`} stroke="#1a0e06" strokeWidth="4" fill="none" />}<rect x="20" y="40" width="24" height="160" fill="#3a2614" /><rect x="596" y="40" width="24" height="160" fill="#3a2614" /></svg>
        <Ike x={1400} y={768 + sag} size={430} count={0} eye={t < tClimb + 0.2 ? 'closed' : t > tMoreLocked ? 'narrow' : 'open'} glow={t < tClimb ? 0.2 : 1} squash={lvl * 0.08} seed={21} />
        {chains > 0 && <svg style={{ position: 'absolute', left: 1180, top: 380 }} width="440" height="400" viewBox="0 0 440 400" opacity={chains}>{[[-30, 0], [30, 40]].map(([rot, dy], i) => <g key={i} transform={`rotate(${rot} 220 200) translate(0 ${dy})`}>{Array.from({ length: 9 }, (_, k) => <ellipse key={k} cx={20 + k * 50} cy="200" rx="28" ry="14" fill="none" stroke="#c9d1dc" strokeWidth="9" opacity={k / 9 < chains ? 1 : 0} />)}</g>)}</svg>}
        {t > tMoreLocked - 0.05 && <Pop x={1400} y={560} at={tMoreLocked - 0.05}><Icon name="ph:lock-key-fill" size={150} color={COL.steel2} /></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- the guesses
  if (t < tQuote - 0.3) {
    const n = MISS.filter((x) => t > x).length;
    const last = MISS[n - 1] ?? 0;
    const shake = (n / 8) * 3;
    const two = t > tTwoLeft - 0.15;
    const xHit = n > 0 && t < last + 0.45 ? ramp(t, last, 0.12, EASE.out) : 0;
    if (two) {
      return (
        <AbsoluteFill style={{ background: '#03050b' }}>
          <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,46,77,.12), transparent 55%)' }} />
          <Ike x={960} y={980} size={760} count={8} eye="narrow" seed={22} />
        </AbsoluteFill>
      );
    }
    return (
      <AbsoluteFill style={{ transform: `translate(${(r() - 0.5) * shake}px, ${(r() - 0.5) * shake}px)` }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0a0f22,#05070f)' }} />
        <div style={{ position: 'absolute', left: 1460, top: 120, width: 300, height: 260, borderRadius: 10, background: 'linear-gradient(180deg,#0b1430,#060a18)', boxShadow: 'inset 0 0 0 10px #040611' }}><div style={{ position: 'absolute', left: 190, top: 40, width: 60, height: 60, borderRadius: '50%', background: '#f4f1d8', opacity: 0.85 }} /></div>
        {/* game-show board on the monitor */}
        <div style={{ position: 'absolute', left: 300, top: 120, width: 1000, height: 600, borderRadius: 24, background: '#0a0c12', boxShadow: '0 0 0 10px #1b1f2b, 0 0 120px rgba(51,225,255,.12)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 18, borderRadius: 12, background: 'radial-gradient(ellipse at 50% 30%, #1a2a5a, #0a1024 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
            <Mono size={30} color={COL.steel2}>IRONKEY · ENTER PASSWORD</Mono>
            <div style={{ width: 700, height: 90, borderRadius: 14, background: '#05070d', border: '3px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: fonts.mono, fontWeight: 700, fontSize: 50, color: C.ink, letterSpacing: '0.3em' }}>{'•'.repeat(Math.floor(((t * 7) % 12)))}</div>
            <Title size={86} color={COL.gold}>GUESS #{Math.min(8, n + 1)}</Title>
          </div>
          {xHit > 0 && <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${2.2 - 1.2 * xHit})`, opacity: xHit }}><Icon name="ph:x-bold" size={420} color={COL.red} /></div>}
        </div>
        <Person kind="stefan" x={260} y={1120} size={520} mood={n > 4 ? 'worried' : 'focused'} look={1} typing seed={23} />
        <div style={{ position: 'absolute', left: 1580, top: 0 }}><Ike x={0} y={1000} size={480} count={n} eye={n > 5 ? 'narrow' : 'open'} seed={24} /></div>
      </AbsoluteFill>
    );
  }
  // ---- the quote
  if (t < tMoney - 0.3) {
    const frags = ['p4ssw0rd?', 'Bitc0in2011', 'Stefan!!', 'ironkey#1', '7002btc', 'qwerty…', 'S4fe!', 'n0tthis1'];
    return (
      <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0a1024,#05070f)' }}>
        {frags.map((fr, i) => { const u = ((t - tQuote) * 0.12 + i / frags.length) % 1; return <div key={i} style={{ position: 'absolute', left: 140 + (i * 233) % 1600, top: 120 + u * 260, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: 'rgba(201,209,220,.35)', opacity: Math.sin(u * Math.PI), filter: `blur(${u * 4}px)` }}>{fr}</div>; })}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 860, bottom: 0, background: '#1a1f30' }} />
        <div style={{ position: 'absolute', left: 1180, top: 870, width: 700, height: 120, borderRadius: 20, background: '#3a4a7a' }} />
        <div style={{ position: 'absolute', left: 1190, top: 850, width: 200, height: 60, borderRadius: 30, background: '#e8ecf4' }} />
        <div style={{ position: 'absolute', left: 1250, top: 760, transform: 'rotate(-90deg)', transformOrigin: '50% 100%' }}><Person kind="stefan" x={0} y={200} size={300} mood="sad" look={0} seed={25} /></div>
        {t > tNight - 0.1 && <Pop x={840} y={150} at={tNight - 0.05}><Mono size={34} color={COL.red}>EVERY · SINGLE · NIGHT</Mono></Pop>}
        <QuoteCard x={840} y={430} w={1180} at={tLay - 0.2} text="I would just lay in bed and think about it. Then I would go to the computer with some new strategy, and it wouldn't work, and I would be desperate again." source="STEFAN THOMAS, TO THE NEW YORK TIMES (2021)" size={42} />
      </AbsoluteFill>
    );
  }
  // ---- the money meter
  const b1 = ramp(t, t220 - 0.1, 0.9, EASE.out), b2 = ramp(t, t900 - 0.2, 1.1, EASE.out);
  return (
    <AbsoluteFill>
      <Vault light={0.5} pedestal={false} />
      <div style={{ position: 'absolute', left: 260, bottom: 200, display: 'flex', gap: 120, alignItems: 'flex-end' }}>
        {[[b1, 220, '2021', t220], [b2, 883, 'OCT 2025 PEAK', t900]].map(([u, v, lb, at], i) => (
          <div key={i} style={{ width: 300, textAlign: 'center', opacity: t > (at as number) - 0.2 ? 1 : 0 }}>
            <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 56, color: COL.gold, whiteSpace: 'nowrap' }}>{i ? '≈ ' : ''}$<Count to={v as number} at={at as number} d={1} />M</div>
            <div style={{ margin: '14px auto 0', width: 220, height: 640 * ((v as number) / 900) * (u as number), borderRadius: '16px 16px 0 0', background: `linear-gradient(180deg, ${COL.gold}, #8a5a08)`, boxShadow: `0 0 50px ${COL.gold}55` }} />
            <div style={{ marginTop: 14 }}><Mono size={26} color={COL.steel2}>{lb as string}</Mono></div>
          </div>
        ))}
      </div>
      <Ike x={1480} y={900} size={520} count={8} eye="smug" seed={26} />
      {t > tBreakQ - 0.1 && <Pop x={1480} y={300} at={tBreakQ - 0.05} rot={-8}><Icon name="ph:hammer-fill" size={190} color={COL.steel2} /></Pop>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 3 · why nobody can open it
const tBreak = C0(29) - 0.3, tPlug = C0(29), tRemembers = P(29, 'remembers'), tMillion = P(30, 'counted');
const tEvery = C0(30), tUnplug = P(30, 'Unplug'), tYear = P(30, 'drawer'), tBack = P(30, 'plug it back'), tStill = P(30, 'still eight');
const tEpoxy = C0(31), tResist = P(31, 'hard epoxy'), tKing = C0(32), tBackdoor = P(32, 'No backdoor'), tMaster = P(32, 'No master');
const tImpossible = C0(33), tRight = P(33, 'Right'), tIke = C0(34), tSub = P(34, 'subscribe'), tWait = P(34, 'very good at waiting');
export const a3NoCaptions: [number, number][] = [];
export const a3Sfx: SfxEvent[] = [
  { t: tBreak + 0.2, name: 'machine', vol: 0.4, note: 'robot' }, { t: tPlug, name: 'clickModern', vol: 0.45, note: 'plug in' }, { t: tMillion, name: 'typing', vol: 0.35, dur: 1.6 },
  { t: tRemembers - 0.05, name: 'mysteryHit', vol: 0.5, note: 'Ike looks' }, { t: tRemembers + 0.3, name: 'chime', vol: 0.2 },
  { t: tUnplug, name: 'clickModern', vol: 0.4 }, { t: tYear, name: 'clockSpin', vol: 0.45, note: 'a year' }, { t: tYear + 0.4, name: 'pagesFast', vol: 0.35 }, { t: tBack, name: 'clickModern', vol: 0.4 },
  { t: tStill + 0.1, name: 'fallWhistle', vol: 0.4, note: 'robot faints' }, { t: tStill + 0.75, name: 'boingMetal', vol: 0.5 },
  { t: tEpoxy, name: 'scan', vol: 0.4, note: 'x-ray' }, { t: tEpoxy + 0.6, name: 'machine', vol: 0.35, note: 'drill' }, { t: tResist, name: 'glassHit', vol: 0.5, note: 'sparks' }, { t: tResist + 0.1, name: 'boing', vol: 0.35 },
  { t: tKing, name: 'popUi', vol: 0.4, note: 'support card' }, { t: tBackdoor - 0.05, name: 'creakyDoor', vol: 0.4 }, { t: tBackdoor + 0.5, name: 'woodHit', vol: 0.6, note: 'door slams' }, { t: tMaster, name: 'negGuitar', vol: 0.35 },
  { t: tImpossible, name: 'tick', vol: 0.4 }, { t: tRight, name: 'tick', vol: 0.4 },
  { t: tIke - 0.05, name: 'chime', vol: 0.3, note: 'Ike ting' }, { t: tSub - 0.05, name: 'clickModern', vol: 0.5, note: 'subscribe' }, { t: tSub + 0.4, name: 'bell', vol: 0.45 },
];
export const A3: React.FC = () => {
  const { f, fps, t } = useTF();
  // ---- robot + "the IronKey remembers" + a year later
  if (t < tEpoxy - 0.2) {
    const plugged = (t > tPlug && t < tUnplug) || t > tBack;
    const beard = ramp(t, tYear, 1.4, EASE.inOut);
    const faint = ramp(t, tStill + 0.2, 0.5, EASE.in);
    const comedy = t > tUnplug - 0.1 && t < tStill + 1.6;
    const zoom = comedy && t > tStill + 0.75 ? 1.25 : 1;
    const look = t > tRemembers - 0.1;
    const tries = Math.floor(ramp(t, tMillion, 2.2, EASE.in) * 999999);
    return (
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '35% 70%' }}>
        <Vault light={0.75} pedestal />
        <Ike x={960} y={812} size={430} count={8} eye={look ? 'narrow' : 'open'} seed={31} />
        <svg style={{ position: 'absolute', left: 0, top: 0 }} width="1920" height="1080">{plugged && <path d="M560 760 C 700 860, 820 520, 960 460" stroke="#2a3040" strokeWidth="14" fill="none" strokeLinecap="round" />}</svg>
        <Robot x={500} y={1040} size={380} beard={beard} tilt={-faint * 80} eyes={faint > 0.5 ? 'x' : 'on'} dizzy={faint > 0.8} />
        {t > tMillion - 0.1 && t < tUnplug && <div style={{ position: 'absolute', left: 240, top: 200, padding: '18px 26px', borderRadius: 14, background: 'rgba(5,7,13,.9)', border: `2px solid ${COL.cyan}55`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 32, color: COL.cyan, lineHeight: 1.4 }}>BRUTE FORCE…<br />TRYING #{String(tries).padStart(6, '0')}{look ? <><br /><span style={{ color: COL.red }}>⚠ 2 TRIES LEFT</span></> : ''}</div>}
        {t > tYear && t < tBack + 0.3 && <div style={{ position: 'absolute', left: 1330, top: 240, transform: 'rotate(4deg)', width: 260, padding: 20, borderRadius: 14, background: '#f4efe2', textAlign: 'center' }}><Mono size={22} color="#6b6250">1 YEAR LATER</Mono><div style={{ ...fonts.H, fontWeight: 900, fontSize: 80, color: '#2a2a35' }}>{['JAN', 'APR', 'JUL', 'OCT', 'JAN'][Math.min(4, Math.floor(ramp(t, tYear, 1.4) * 5))]}</div></div>}
        {t > tBack + 0.1 && <Pop x={960} y={300} at={tBack + 0.1}><div style={{ padding: '10px 26px', borderRadius: 14, background: 'rgba(7,11,22,.9)', border: `3px solid ${COL.red}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 52, color: COL.red }}>STILL 8/10</div></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- epoxy vs drill, no backdoor
  if (t < tImpossible - 0.2) {
    const drill = ramp(t, tEpoxy + 0.6, tResist - tEpoxy - 0.6, EASE.in), bounce = ramp(t, tResist, 0.5, EASE.out);
    const door = t > tBackdoor - 0.05 ? 1 - ramp(t, tBackdoor + 0.2, 0.3, EASE.in) : 0;
    return (
      <AbsoluteFill>
        <Vault light={0.6} pedestal={false} />
        {t < tKing - 0.1 ? <>
          <Ike x={960} y={1000} size={760} count={8} xray={ramp(t, tEpoxy, 0.5)} eye="wide" seed={32} />
          <div style={{ position: 'absolute', left: lerp(1700, 1120, drill) + bounce * 260, top: 560, transform: `rotate(${180 + Math.sin(t * 60) * 3}deg)` }}><Icon name="lucide:drill" size={220} color={C.ink} /></div>
          {t > tResist && <Burst x={1110} y={640} at={tResist} color={COL.amber} size={240} />}
          <Pop x={520} y={420} at={tEpoxy + 0.4}><div style={{ padding: '10px 22px', borderRadius: 12, background: 'rgba(7,11,22,.85)', border: `2px solid ${COL.amber}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: COL.amber }}>EPOXY ARMOR</div></Pop>
        </> : <>
          <Pop x={600} y={460} at={tKing}><div style={{ width: 760, padding: '34px 40px', borderRadius: 24, background: '#f3f4f8', boxShadow: '0 30px 80px rgba(0,0,0,.5)', fontFamily: fonts.body, color: '#1a1d2a' }}>
            <Mono size={22} color="#5a6274">SUPPORT · KINGSTON (2021)</Mono>
            <div style={{ ...fonts.H, fontWeight: 900, fontSize: 52, lineHeight: 1.1, marginTop: 14 }}>No way to recover the data.</div>
            <div style={{ fontWeight: 600, fontSize: 30, color: '#5a6274', marginTop: 10 }}>No backup password. By design.</div>
          </div></Pop>
          {/* the backdoor */}
          <div style={{ position: 'absolute', left: 1240, top: 230, width: 420, height: 620, borderRadius: '16px 16px 0 0', background: '#05070d', boxShadow: 'inset 0 0 0 12px #2a2f3d' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '16px 16px 0 0', background: 'linear-gradient(160deg,#3b4256,#232838)', transformOrigin: '0 50%', transform: `perspective(900px) rotateY(${-door * 60}deg)` }}>
              <div style={{ position: 'absolute', left: 40, right: 40, top: 60, padding: '14px 0', borderRadius: 10, background: COL.red, textAlign: 'center', ...fonts.H, fontWeight: 900, fontSize: 40, color: '#fff' }}>NO BACKDOOR</div>
              <div style={{ position: 'absolute', right: 34, top: 320, width: 26, height: 26, borderRadius: '50%', background: '#d8b45a' }} />
            </div>
          </div>
          {t > tMaster - 0.05 && <Stamp x={1450} y={940} at={tMaster - 0.03} text="NO MASTER PASSWORD" size={50} rot={-4} />}
        </>}
      </AbsoluteFill>
    );
  }
  // ---- "impossible… right?" + Ike's subscribe line
  const cam = camAt(t, [[tImpossible - 0.2, 0, 0, 1], [tIke, 0, -80, 1.25], [tIke + 0.5, 0, 0, 1]]);
  const talk = t > tIke && t < C1(34) ? Math.abs(Math.sin(t * 16)) : 0;
  const subbed = t > tSub;
  return (
    <AbsoluteFill>
      <Layer cam={cam} d={0.3}><Vault light={0.85} /></Layer>
      <Layer cam={cam} d={1}><Ike x={t > tIke ? 760 : 960} y={812} size={520} count={8} eye={t > tImpossible + 0.3 ? 'smug' : 'open'} talk={talk} seed={33} /></Layer>
      {t > tIke + 0.2 && <Pop x={1340} y={520} at={tIke + 0.2}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${t > tSub - 0.05 && t < tSub + 0.1 ? 0.92 : 1})` }}>
          <div style={{ padding: '22px 46px', borderRadius: 60, background: subbed ? '#3a4152' : COL.red, ...fonts.H, fontWeight: 900, fontSize: 48, color: '#fff', boxShadow: subbed ? 'none' : `0 0 50px ${COL.red}88` }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
          <div style={{ transform: `rotate(${t > tSub + 0.4 ? Math.sin((t - tSub) * 30) * 22 * Math.max(0, 1 - (t - tSub - 0.4) * 1.2) : 0}deg)`, transformOrigin: '50% 10%' }}><Icon name={t > tSub + 0.4 ? 'ph:bell-ringing-fill' : 'ph:bell-bold'} size={80} color={t > tSub + 0.4 ? COL.amber : C.ink} /></div>
        </div>
      </Pop>}
      {t > tWait && <Pop x={1340} y={700} at={tWait}><Mono size={30} color={COL.steel2}>…I'M VERY GOOD AT WAITING.</Mono></Pop>}
    </AbsoluteFill>
  );
};
