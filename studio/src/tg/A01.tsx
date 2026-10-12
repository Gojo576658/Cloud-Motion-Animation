// Acts 0–1: the vault cold open (half a billion, two guesses, the wipe preview, "Go on. Try.", three case
// files, title) and the 2011 story (a cartoon paid in bitcoin, the IronKey and its rule, the lost paper).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { Pill } from '../components/UI';
import { C } from '../lib/theme';
import { fonts } from './type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, PE, S0, S1, W } from './ttime';
import { Kinetic, useTF, P as COL, camAt, Layer, Ike, Vault, Person, Coin, CaseCard, Pop, Count, Title, Mono } from './kit';
import { Stamp, FreezeFrame } from '../cpu/fx';
import { Chip } from '../cpu/chars';

// ================================================================ ACT 0 · cold open
const tHalf = P(0, 'half a billion'), tBank = P(1, 'Not in a bank'), tSteel = P(1, 'tiny steel'), tLocked = P(2, 'locked'), tForgot = P(2, 'forgotten');
const tTen = P(3, 'ten tries'), tTwo = P(3, 'used eight'), tWrong = P(4, 'Get them wrong'), tDestroy = P(4, 'gone'), tForever = P(4, 'Forever');
const tTry = C0(5), tOwns = C0(6), tYears = P(6, 'happening right now');
const tWhat = P(6, 'real person'), tHow = P(7, 'hackers'), tWhy = P(7, 'open it'), tNo = P(7, 'said no'), tTitle = C1(8) + 0.35;
export const a0NoCaptions: [number, number][] = [[tTitle - 0.2, S1(0) + 0.3]];
export const a0Sfx: SfxEvent[] = [
  { t: 0.1, name: 'switchLight', vol: 0.6, note: 'spotlight snaps on' }, { t: 0.15, name: 'hum', vol: 0.25, dur: 4, note: 'Ike hum' }, { t: 0.4, name: 'chime', vol: 0.25, note: 'Ike ting' },
  { t: tHalf, name: 'coins', vol: 0.35, note: 'price tag' }, { t: tTwo - 0.05, name: 'bleepHi', vol: 0.3, note: 'screen on' }, { t: tTwo, name: 'mysteryHit', vol: 0.45 },
  { t: tTwo + 0.1, name: 'heartbeat', vol: 0.5 }, { t: tTwo + 1.1, name: 'heartbeat', vol: 0.45 },
  { t: tWrong, name: 'glitch', vol: 0.3, note: 'preview' }, { t: tDestroy - 0.05, name: 'glitchBreak', vol: 0.45, note: 'WIPING' }, { t: tDestroy + 0.5, name: 'glassBreak', vol: 0.4, note: 'money shatters' },
  { t: tForever + 0.4, name: 'reverseWhoosh', vol: 0.35, note: 'snap back' },
  { t: tTry - 0.05, name: 'chime', vol: 0.25, note: 'Ike ting' },
  { t: tYears, name: 'clockSpin', vol: 0.35, note: 'years fly' }, { t: tLocked - 0.05, name: 'lock', vol: 0.55, note: 'padlock' },
  { t: tWhat - 0.05, name: 'stomp', vol: 0.4, note: 'case file 1' }, { t: tHow - 0.05, name: 'stomp', vol: 0.4 }, { t: tWhy - 0.05, name: 'stomp', vol: 0.45 }, { t: tNo, name: 'scratch', vol: 0.4 },
  { t: tTitle - 0.05, name: 'impactEpic', vol: 0.5, note: 'TITLE' }, { t: tTitle, name: 'shimmer', vol: 0.3 },
];
export const A0: React.FC = () => {
  const { f, fps, t } = useTF();
  const light = ramp(t, 0.08, 0.12, EASE.out);
  // camera: slow push, then into the LED on "two guesses", back out for the preview, close on "Go on. Try."
  const cam = camAt(t, [[0, -30, 40, 1.08], [tTwo - 0.2, 0, 0, 1.18], [tTwo + 1.3, 0, -210, 1.55], [tWrong, 0, -60, 1.18], [tTry - 0.3, 0, -60, 1.18], [tTry + 0.2, 0, -120, 1.36], [tOwns + 0.1, 0, 0, 1.0], [tWhat, 0, 0, 1.0]]);
  const screenOn = t > tTwo - 0.05;
  const preview = t > tWrong - 0.1 && t < tForever + 0.4;
  const wipe = preview ? ramp(t, tWrong, tDestroy - tWrong) : 0;
  const shatter = ramp(t, tDestroy + 0.4, 0.9, EASE.in);
  const dust = ramp(t, tYears, 4, EASE.inOut);
  const r = rng(77);
  if (t >= tTitle - 0.25) {
    // title card
    const s = springAt(f, fps, tTitle, { damping: 18, stiffness: 120 });
    return (
      <AbsoluteFill>
        <Vault light={0.6} pedestal={false} />
        <div style={{ position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) scale(${1.06 - 0.06 * s})`, textAlign: 'center' }}>
          <div style={{ width: 520, height: 520, borderRadius: '50%', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, rgba(255,46,77,.28), transparent 65%)` }} />
          <div style={{ position: 'relative' }}><Kinetic at={tTitle - 0.1} size={176} stagger={0.09} words={[{ w: 'Two' }, { w: 'guesses' }, { w: 'left.', serif: true, color: COL.red, br: true }]} /></div>
          <div style={{ position: 'relative', marginTop: 26, opacity: ramp(t, tTitle + 0.5, 0.6) }}><Mono size={28} color={COL.steel2}>THE DRIVE THAT NEVER FORGETS</Mono></div>
        </div>
        {Array.from({ length: 16 }, (_, i) => { const a = r() * 6.28, d = ramp(t, tTitle, 0.8, EASE.out) * (200 + r() * 500); return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(a) * d, top: 540 + Math.sin(a) * d * 0.5, width: 4, height: 4, borderRadius: 2, background: '#ffd9a0', opacity: 1 - ramp(t, tTitle + 0.2, 0.8) }} />; })}
      </AbsoluteFill>
    );
  }
  const cards = t > tWhat - 0.2;
  return (
    <AbsoluteFill style={{ background: COL.ink, filter: preview ? `saturate(${1 - 0.7 * ramp(t, tWrong, 0.3)}) contrast(1.1)` : undefined }}>
      <Layer cam={cam} d={0.25}><Vault light={light * (cards ? 0.55 : 1)} pedestal={false} /></Layer>
      {/* years flying behind (act 0 · "known it for years") */}
      {t > tYears - 0.2 && t < tWhat && <Layer cam={cam} d={0.4}>{Array.from({ length: 16 }, (_, i) => { const yr = 2011 + i, u = (t - tYears) * 2.2 - i * 0.28; return u > 0 && u < 1.6 ? <div key={yr} style={{ position: 'absolute', left: lerp(1700, 160, u / 1.6), top: 220 + (i % 3) * 60, fontFamily: fonts.mono, fontWeight: 700, fontSize: 64, color: 'rgba(201,209,220,.16)' }}>{yr}</div> : null; })}</Layer>}
      <Layer cam={cam} d={1}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 960 - 190, top: 830, width: 380, height: 300, background: 'linear-gradient(90deg,#1a1d28,#2c3142 45%,#151822)' }} />
          <div style={{ position: 'absolute', left: 960 - 230, top: 800, width: 460, height: 46, borderRadius: 10, background: 'linear-gradient(180deg,#5a1424,#3a0c18)' }} />
          <Ike x={960} y={812} size={cards ? 330 : 520} count={8} eye={t > tTry - 0.1 && t < tOwns ? 'smug' : t > tLocked ? 'narrow' : 'open'} glow={light} wipe={wipe} screenText={screenOn ? undefined : ''} talk={t > tTry && t < C1(5) ? Math.abs(Math.sin(t * 18)) : 0} dust={dust} seed={1} />
          {t > tLocked - 0.1 && t < tTen + 0.2 && <div style={{ position: 'absolute', left: 960, top: 700 - (1 - ramp(t, tLocked - 0.1, 0.25, EASE.in)) * 500, transform: 'translateX(-50%)', opacity: 1 - ramp(t, tTen - 0.1, 0.3) }}><Icon name="ph:lock-key-fill" size={170} color={COL.steel2} /></div>}
        </AbsoluteFill>
      </Layer>
      {/* price tag + shatter */}
      {t > tHalf - 0.1 && !cards && <div style={{ position: 'absolute', left: 1380, top: 360, transform: `translate(-50%,-50%) rotate(-6deg) scale(${springAt(f, fps, tHalf - 0.1, { damping: 16, stiffness: 150 })})`, opacity: 1 - shatter }}>
        <div style={{ padding: '18px 34px', borderRadius: 18, background: 'rgba(7,11,22,.85)', border: `3px solid ${COL.gold}`, boxShadow: `0 0 40px ${COL.gold}55` }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 60, color: COL.gold, whiteSpace: 'nowrap' }}>≈ $<Count to={580000000} at={tHalf} d={1.2} /></div>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 22, color: C.dim, marginTop: 4 }}>at today's bitcoin price</div>
        </div>
      </div>}
      {shatter > 0 && shatter < 1 && Array.from({ length: 30 }, (_, i) => { const a = r() * 6.28, d = shatter * (120 + r() * 360); return <div key={i} style={{ position: 'absolute', left: 1380 + Math.cos(a) * d, top: 360 + Math.sin(a) * d + shatter * shatter * 300, width: 18, height: 18, background: COL.gold, opacity: 1 - shatter, transform: `rotate(${a * 90}deg)` }} />; })}
      {/* cue 1-3: not a bank · the steel drive · the password · ten tries */}
      {!cards && t > tBank - 0.1 && <Pop x={470} y={360} at={tBank - 0.05} out={tLocked - 0.1} rot={-4}><div style={{ position: 'relative', padding: '20px 30px', borderRadius: 18, background: 'rgba(7,11,22,.85)', border: `2px solid ${COL.steel}` }}><Icon name="ph:bank-bold" size={110} color={COL.steel2} /><div style={{ position: 'absolute', left: -10, right: -10, top: '50%', height: 10, background: COL.red, transform: `rotate(-24deg) scaleX(${ramp(t, tBank + 0.5, 0.25, EASE.out)})`, borderRadius: 5 }} /></div></Pop>}
      {!cards && t > tSteel - 0.1 && <Pop x={470} y={560} at={tSteel - 0.05} out={tLocked - 0.1}><Mono size={30} color={COL.steel2}>TINY · STEEL · USB DRIVE →</Mono></Pop>}
      {!cards && t > tForgot - 0.1 && <Pop x={470} y={380} at={tForgot - 0.05} out={tWrong - 0.1} rot={-3}><div style={{ padding: '22px 30px', borderRadius: 16, background: 'rgba(7,11,22,.9)', border: `2px solid ${COL.steel}`, minWidth: 420 }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 20, letterSpacing: '0.18em', color: COL.steel }}>PASSWORD</div>
        <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 10, background: '#05070e', border: `2px solid ${t > tTwo ? COL.red : COL.steel}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: COL.steel2, letterSpacing: '0.1em' }}>?????????<span style={{ opacity: Math.sin(t * 9) > 0 ? 1 : 0 }}>|</span></div>
        {t > tTen && <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>{Array.from({ length: 10 }, (_, i) => { const used = i < 8 && t > tTwo + i * 0.06; return <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: used ? COL.red : 'transparent', border: `3px solid ${used ? COL.red : COL.green}`, boxShadow: used ? `0 0 14px ${COL.red}` : `0 0 14px ${COL.green}88`, transform: `scale(${springAt(f, fps, tTen + i * 0.04, { damping: 14, stiffness: 200 })})` }} />; })}</div>}
      </div></Pop>}
      {preview && <div style={{ position: 'absolute', left: 80, top: 60, padding: '6px 16px', border: `2px solid ${COL.red}`, borderRadius: 8, fontFamily: fonts.mono, fontWeight: 700, fontSize: 36, color: COL.red, opacity: Math.sin(t * 8) > -0.3 ? 1 : 0.4 }}>● WHAT IF…</div>}
      {/* the three questions */}
      {cards && <>
        <CaseCard x={420} y={330} at={tWhat - 0.05} text="REAL PERSON" rot={-4} />
        <CaseCard x={960} y={300} at={tHow - 0.05} text="HACKERS: WE CAN OPEN IT" rot={2} />
        <CaseCard x={1500} y={330} at={tNo - 0.05} text={'HIS ANSWER: "NO"'} rot={-2} stamp="?!" stampAt={tNo + 0.3} />
      </>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 1 · the cartoon that paid in bitcoin
const tMeet = C0(9), t2011 = P(9, 'in 2011'), tVideo = P(9, 'animated video'), tNobody = P(9, 'strange new');
const tCartoon = P(9, 'called Bitcoin'), tLike = tCartoon + 0.2, tPaid = P(10, 'His payment'), tSeven = P(10, 'Seven thousand');
const tBack = C0(11), tPocket = P(11, 'pocket money'), tCareful = C0(12), tKeys = P(12, 'the keys'), tIronKey = P(12, 'an IronKey');
const tNot = C0(13), tMil = P(13, 'normal USB'), tChip = P(13, 'tiny bank vault'), tRule = P(13, 'one rule');
const tTen1 = C0(14), tWipes = P(14, 'destroys'), tUndo = P(14, 'No reset'), tReset = P(14, 'No recovery'), tCS = P(14, "No 'forgot");
const tPicked = C0(15), tWrote = P(15, 'wrote'), tLost = C0(17) - 0.1;
export const a1NoCaptions: [number, number][] = [];
export const a1Sfx: SfxEvent[] = [
  { t: tMeet - 0.1, name: 'swooshSlow', vol: 0.3, note: '2011 warm' }, { t: t2011, name: 'popUi', vol: 0.3 }, { t: tVideo, name: 'write', vol: 0.3, note: 'storyboards' },
  { t: tCartoon - 0.05, name: 'zoomOut', vol: 0.35, note: 'pull back into monitor' }, { t: tLike + 0.2, name: 'sillyPop', vol: 0.45, note: 'Chip winks' }, { t: tLike + 0.7, name: 'rimshot', vol: 0.45 },
  { t: tPaid, name: 'coins', vol: 0.5, note: 'coins pour' }, { t: tSeven, name: 'moneyBag', vol: 0.45 },
  { t: tBack + 0.3, name: 'boing', vol: 0.35, note: 'pile shrinks' }, { t: tPocket, name: 'sadTrombone', vol: 0.25, dur: 1.2 },
  { t: tKeys, name: 'shimmer', vol: 0.35, note: 'golden key' }, { t: tIronKey, name: 'lock', vol: 0.45, note: 'key in' }, { t: tIronKey + 0.3, name: 'chime', vol: 0.25, note: 'Ike ting' },
  { t: tNot, name: 'scan', vol: 0.4, note: 'x-ray' }, { t: tMil - 0.05, name: 'popUi', vol: 0.35 }, { t: tChip - 0.05, name: 'popUi', vol: 0.35 }, { t: tChip + 1.2, name: 'popUi', vol: 0.35 },
  { t: tRule, name: 'drumRoll', vol: 0.3, dur: 1.2 }, { t: tTen1 - 0.03, name: 'stomp', vol: 0.55, note: 'the rule' },
  { t: tWipes, name: 'glitchBreak', vol: 0.35, note: 'key shatters' }, { t: tUndo, name: 'negGuitar', vol: 0.3 }, { t: tReset, name: 'negGuitar', vol: 0.3 }, { t: tCS - 0.05, name: 'negGuitar', vol: 0.3 },
  { t: tWrote, name: 'write', vol: 0.4, note: 'password on paper' }, { t: tLost - 0.2, name: 'whooshDeep', vol: 0.45, note: 'wind takes the paper' }, { t: PE(17, 'lost it') + 0.15, name: 'scratch', vol: 0.45, note: 'freeze' },
];
const Monitor2011: React.FC<{ x: number; y: number; w: number; children?: React.ReactNode }> = ({ x, y, w, children }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y, width: w, height: w * 0.8, borderRadius: 26, background: 'linear-gradient(180deg,#d8d0bc,#b8ae96)', boxShadow: '0 30px 70px rgba(0,0,0,.45)', padding: w * 0.07 }}>
    <div style={{ position: 'relative', width: '100%', height: '82%', borderRadius: 18, background: 'radial-gradient(ellipse at 50% 40%, #2c4a5a, #0e1a22)', overflow: 'hidden', boxShadow: 'inset 0 0 40px rgba(0,0,0,.7)' }}>{children}</div>
  </div>
);
export const A1: React.FC = () => {
  const { f, fps, t } = useTF();
  const r = rng(Math.round(t * 30));
  // ---- 2011 desk + "a cartoon, like this one" + coins
  if (t < tCareful - 0.2) {
    const pull = ramp(t, tCartoon - 0.1, 0.8, EASE.inOut) * (1 - ramp(t, tPaid - 0.3, 0.6, EASE.inOut));
    const coinsOut = t > tPaid - 0.05;
    const shrink = ramp(t, tBack + 0.3, 0.7, EASE.inOut);
    return (
      <AbsoluteFill style={{ background: '#1c140c' }}>
        <AbsoluteFill style={{ transform: `scale(${1 - 0.45 * pull}) translateY(${-pull * 60}px)`, transformOrigin: '50% 45%' }}>
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 40% 35%, #6a4a2a, #2a1a0e 75%)', filter: 'sepia(.25)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 780, bottom: 0, background: 'linear-gradient(180deg,#4a3018,#2a1a0e)' }} />
          <Monitor2011 x={1220} y={260} w={640}>
            {/* tiny coin cartoon on the old monitor */}
            <Coin x={250 + Math.sin(t * 3) * 120} y={200 - Math.abs(Math.sin(t * 6)) * 70} size={70} spin={t * 4} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', ...fonts.H, fontWeight: 900, fontSize: 34, color: '#ffd9a0', opacity: ramp(t, tVideo, 0.4) }}>WHAT IS BITCOIN?</div>
          </Monitor2011>
          {t > tVideo && [0, 1, 2].map((k) => <Pop key={k} x={300 + k * 210} y={300 + (k % 2) * 30} at={tVideo + k * 0.12} out={tPaid - 0.4} rot={-6 + k * 6}><div style={{ width: 180, height: 130, background: '#f4ead6', border: '4px solid #6b5636', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={['ph:coins-bold', 'ph:arrows-left-right-bold', 'ph:globe-bold'][k]} size={70} color="#6b5636" /></div></Pop>)}
          <Person kind="stefan" x={520} y={1120} size={560} mood={t > tPocket - 0.2 ? 'smile' : 'neutral'} look={1} seed={11} />
          <div style={{ position: 'absolute', left: 120, top: 90 }}><Pill x={0} y={0} at={t2011 - 0.1} color={COL.amber} size={30}>2011</Pill></div>
          {t > tNobody && t < tPaid - 0.3 && <div style={{ position: 'absolute', left: 120, top: 170, display: 'flex', gap: 10, opacity: ramp(t, tNobody, 0.3) }}>{Array.from({ length: 10 }, (_, i) => <Icon key={i} name="ph:user-bold" size={40} color={i === 9 ? COL.amber : '#7a6a52'} />)}<span style={{ ...fonts.H, fontWeight: 900, fontSize: 30, color: '#ffd9a0', marginLeft: 12 }}>"Bit-what?"</span></div>}
        </AbsoluteFill>
        {pull > 0.05 && <div style={{ position: 'absolute', inset: 0, border: `${pull * 60}px solid #0b0f1a`, boxShadow: `inset 0 0 0 ${pull * 8}px #2a3040` }} />}
        {t > tLike + 0.15 && t < tPaid && <Chip x={1640} y={1000} size={220} mood="wink" seed={12} arms="wave" />}
        {/* coins pouring + 7,002 */}
        {coinsOut && Array.from({ length: 40 }, (_, i) => { const u = clamp((t - tPaid - i * 0.03) / 0.7); if (u <= 0) return null; const px = 1220 + (i % 9 - 4) * 26 * u, py = lerp(520, 860 - (i % 6) * 22, EASE.in(u)); return <Coin key={i} x={lerp(px, 960 + (i % 9 - 4) * 30, shrink)} y={lerp(py, 900, shrink)} size={lerp(70, 22, shrink)} spin={i + t * 3 * (1 - u)} />; })}
        {coinsOut && <div style={{ position: 'absolute', left: 560, top: 150, transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 110, color: COL.gold, textShadow: `0 0 40px ${COL.gold}66` }}><Count to={7002} at={tPaid} d={1.4} /> BTC</div>
          {t > tBack && <div style={{ ...fonts.H, fontWeight: 900, fontSize: 44, color: '#ffd9a0', opacity: ramp(t, tBack, 0.4) }}>back then: worth almost nothing</div>}
        </div>}
        {t > tPocket && <Pop x={960} y={900} at={tPocket}><div style={{ width: 120, height: 90, borderRadius: '30px 30px 50px 50px', background: '#8a5a2a', border: '5px solid #5a3a18', display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 26, color: '#ffd9a0' }}>pocket<br />money</div></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- the IronKey: key goes in, x-ray, the rule
  if (t < tPicked - 0.2) {
    const xr = ramp(t, tNot + 0.3, 0.8) * (1 - ramp(t, tTen1 - 0.4, 0.4));
    const cam = camAt(t, [[tCareful, 0, 0, 1], [tNot, 0, 0, 1.0], [tNot + 1.2, 0, -60, 1.35], [tTen1 - 0.5, 0, -60, 1.35], [tTen1, 0, 0, 1]]);
    const keyFly = ramp(t, tKeys, tIronKey - tKeys + 0.1, EASE.inOut);
    const keyBreak = ramp(t, tWipes + 0.3, 0.7);
    const ruleDown = ramp(t, tRule, 1.2, EASE.out) * 0.35 + ramp(t, tTen1 - 0.05, 0.25, EASE.out) * 0.65;
    return (
      <AbsoluteFill>
        <Layer cam={cam} d={0.3}><Vault light={0.9} /></Layer>
        <Layer cam={cam} d={1}>
          <Ike x={960} y={812} size={480} count={0} eye={t < tIronKey + 0.1 ? 'closed' : t > tCS ? 'smug' : 'open'} glow={ramp(t, tIronKey, 0.6)} xray={xr} seed={2} />
          {keyBreak < 1 && t > tKeys - 0.05 && <div style={{ position: 'absolute', left: lerp(500, 960, keyFly), top: lerp(500, 560, keyFly), transform: `translate(-50%,-50%) scale(${lerp(1.4, 0.4, keyFly)}) rotate(${lerp(-30, 0, keyFly)}deg)`, opacity: t > tIronKey + 0.1 && t < tWipes ? 0 : 1 - keyBreak, filter: `drop-shadow(0 0 20px ${COL.gold})` }}><Icon name="ph:key-fill" size={160} color={COL.gold} /></div>}
          {xr > 0.2 && [[tMil, 'AES ENCRYPTION', 1360, 420], [tChip, 'SECURE CHIP', 1380, 620], [tChip + 1.2, 'TAMPER-RESISTANT', 560, 560]].map(([at, label, x, y]) => <Pop key={label as string} x={x as number} y={y as number} at={(at as number) - 0.05} out={tTen1 - 0.5}><div style={{ padding: '10px 22px', borderRadius: 12, background: 'rgba(7,11,22,.85)', border: `2px solid ${COL.amber}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: COL.amber, whiteSpace: 'nowrap' }}>{label as string}</div></Pop>)}
        </Layer>
        {t > tRule - 0.05 && <div style={{ position: 'absolute', left: 960, top: lerp(-260, 170, ruleDown), transform: 'translateX(-50%)', padding: '18px 40px', borderRadius: 16, background: COL.red, boxShadow: `0 20px 60px ${COL.red}66`, opacity: 1 - ramp(t, tPicked - 0.6, 0.3) }}><Title size={66}>10 WRONG = GONE FOREVER</Title></div>}
        {[[tUndo, 'NO RESET', 400], [tReset, 'NO RECOVERY', 900], [tCS, 'NO "FORGOT PASSWORD"', 1480]].map(([at, s, x]) => t > (at as number) - 0.05 && <Pop key={s as string} x={x as number} y={360} at={(at as number) - 0.05} out={tPicked - 0.6}><div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 12, background: 'rgba(7,11,22,.85)', border: `2px solid ${COL.red}`, ...fonts.H, fontWeight: 900, fontSize: 40, color: COL.red, whiteSpace: 'nowrap' }}><Icon name="ph:x-bold" size={38} color={COL.red} />{s as string}</div></Pop>)}
      </AbsoluteFill>
    );
  }
  // ---- the paper + lost
  const fly = ramp(t, tLost - 0.2, 1.0, EASE.in);
  const scene = (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #2a2f42, #0b0f1a 75%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 800, bottom: 0, background: 'linear-gradient(180deg,#2a2218,#151008)' }} />
      <Person kind="stefan" x={1460} y={1120} size={520} mood={t > tLost ? 'shock' : 'smile'} look={-1} seed={13} />
      <div style={{ position: 'absolute', left: lerp(760, 2100, fly), top: lerp(520, 80, fly) + Math.sin(t * 9) * 30 * fly, width: 400, height: 300, transform: `translate(-50%,-50%) rotate(${-4 + fly * 260}deg) scale(${springAt(f, fps, tPicked - 0.1, { damping: 14, stiffness: 160 })})`, background: '#fbf6e6', borderRadius: 6, boxShadow: '0 20px 50px rgba(0,0,0,.5)', padding: 30 }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: '#6b6250' }}>IRONKEY PASSWORD:</div>
        <div style={{ marginTop: 18, ...fonts.H, fontWeight: 800, fontSize: 46, color: '#2a3a8a', filter: 'blur(9px)' }}>{t > tWrote ? 'x7#Lq!m2Ra9' : ''}</div>
        <div style={{ position: 'absolute', left: 30, right: 30, bottom: 40, height: 4, background: '#d8cfb6' }} />
      </div>
      {Array.from({ length: 10 }, (_, i) => { const u = clamp((t - tLost + 0.3 - i * 0.05) / 0.8); return u > 0 && u < 1 ? <div key={i} style={{ position: 'absolute', left: lerp(200, 1900, u), top: 300 + i * 50 + Math.sin(u * 8 + i) * 20, width: 120, height: 3, background: 'rgba(200,210,230,.35)', borderRadius: 2 }} /> : null; })}
    </AbsoluteFill>
  );
  const fz = PE(17, 'lost it') + 0.15;
  return <FreezeFrame at={fz} out={S1(1) + 1} label="SPOILER: THIS IS A PROBLEM.">{scene}</FreezeFrame>;
};
