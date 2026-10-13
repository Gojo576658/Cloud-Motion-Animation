// Acts 4–7: Meta's response and the real numbers (20,225 people, back to April 17, the "separate code path"
// that didn't verify the email); why an AI makes this worse (built to be helpful = can be talked into it;
// social engineering, but on a machine you can retry); three protection steps; the outro question + the
// final "Happy to help!" with a TEMPORARILY DISABLED stamp.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S1 } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, GridBg, Helper, Label, Panel, BigNum } from './kit';

const talkAt = (t: number, c: number) => (t > C0(c) && t < C1(c) ? Math.abs(Math.sin(t * 15)) : 0);

// ================================================================ ACT 4 · Meta responds
const tFast = C0(29), tSwitch = P(29, 'switched off'), tResolved = C0(30), tNumbers = C0(31), tFiling = P(31, 'a filing'), t20k = P(31, 'twenty thousand');
const tStarted = C0(32), tApril = P(32, 'April'), tSix = P(32, 'six weeks'), tBug = C0(33), tWorked = P(33, 'worked as intended'), tSep = P(33, 'separate piece'), tVerify = P(33, 'did not properly');
const tPlain = C0(34), tNobody = P(34, 'nobody checked');
export const a4NoCaptions: [number, number][] = [];
export const a4Sfx: SfxEvent[] = [
  { t: tSwitch, name: 'powerUp', vol: 0.3, note: 'tool off' }, { t: tResolved, name: 'confirm', vol: 0.3 },
  { t: t20k, name: 'impactDeep', vol: 0.4 }, { t: tApril, name: 'clockSpin', vol: 0.35 }, { t: tSix, name: 'tick', vol: 0.3 },
  { t: tBug, name: 'scan', vol: 0.3 }, { t: tVerify, name: 'error', vol: 0.35 }, { t: tNobody, name: 'impactDeep', vol: 0.35 },
];
export const A4: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tNumbers - 0.2) {
    const steps: [number, string, string][] = [[tSwitch, 'ph:power-fill', 'SUPPORT TOOL OFF'], [tSwitch + 1.4, 'ph:link-break-bold', 'RESET LINKS CANCELLED'], [tSwitch + 2.6, 'ph:shield-check-fill', 'SECURITY CHECK FORCED']];
    const done = t > tResolved;
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(191,242,255,.05)" />
        <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.white} size={28}>META MOVED FAST</Label></div>
        {steps.map(([at, ic, lb], i) => <Pop key={lb} x={330 + i * 440} y={500} at={at - 0.05}><div style={{ textAlign: 'center', width: 360 }}><div style={{ width: 160, height: 160, margin: '0 auto', borderRadius: 36, background: '#16161c', border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={86} color={A.white} /></div><div style={{ marginTop: 18, ...fonts.H, fontWeight: 800, fontSize: 30, color: A.white }}>{lb}</div></div></Pop>)}
        {done && <Pop x={960} y={880} at={tResolved}><Label color={A.dim} size={30}>"The issue has been resolved." — Meta</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tBug - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.1)" />
        <div style={{ position: 'absolute', left: 960, top: 380, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <Mono size={26} color={A.dim}>META'S FILING · MAINE ATTORNEY GENERAL</Mono>
          <div style={{ marginTop: 16 }}><BigNum to={20225} at={t20k} d={1.6} size={240} /></div>
          <Mono size={28} color={A.white}>PEOPLE POSSIBLY AFFECTED</Mono>
        </div>
        {t > tStarted && <div style={{ position: 'absolute', left: 960, top: 760, transform: 'translateX(-50%)' }}><Label color={A.red} size={38}><Icon name="ph:calendar-x-fill" size={40} color={A.red} /> SINCE APRIL 17 · ABOUT 6 WEEKS</Label></div>}
      </AbsoluteFill>
    );
  }
  if (t < tPlain - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg />
        <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.dim} size={26}>SO WHAT WAS THE BUG?</Label></div>
        <div style={{ position: 'absolute', left: 260, top: 340 }}><Panel w={1400} pad={46}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: ramp(t, tWorked - 0.1, 0.3) }}><Icon name="ph:check-circle-fill" size={64} color={A.white} /><div style={{ ...fonts.H, fontWeight: 700, fontSize: 44, color: A.white }}>The tool itself worked as intended.</div></div>
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 24, opacity: ramp(t, tSep - 0.1, 0.3) }}><Icon name="ph:git-branch-bold" size={64} color={A.red} /><div style={{ ...fonts.H, fontWeight: 700, fontSize: 44, color: A.white }}>A <span style={{ color: A.red }}>separate piece of code</span> did not verify<br />that the email matched the account.</div></div>
        </Panel></div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.1)" />
      <div style={{ position: 'absolute', left: 960, top: 440, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <Mono size={26} color={A.dim}>IN PLAIN ENGLISH</Mono>
        <div style={{ marginTop: 20 }}><Kinetic at={tNobody + 0.1} size={90} align="center" words={[{ w: 'Nobody' }, { w: 'checked' }, { w: 'if' }, { w: 'it', br: true }, { w: 'was' }, { w: 'really', serif: true, color: A.red }, { w: 'yours.', serif: true, color: A.red }]} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ ACT 5 · why AI makes it worse
const tWhy = C0(35), tDiff = P(35, 'feel different'), tBuilt = C0(36), tHelpful = P(36, 'built to be helpful'), tWrong = P(36, 'the wrong person');
const tName = C0(37), tSocial = P(37, 'social engineering'), tMachine = P(37, 'a machine'), tAgain = P(37, 'again');
const tResearch = C0(38), tSurface = P(38, 'attack surface'), tMore = P(38, 'a lot more'), tWeeks = C0(39), tClaim = P(39, 'claimed they could');
export const a5NoCaptions: [number, number][] = [];
export const a5Sfx: SfxEvent[] = [
  { t: tWhy, name: 'mysteryHit', vol: 0.3 }, { t: tHelpful, name: 'sparkle', vol: 0.25 }, { t: tWrong, name: 'error', vol: 0.3 },
  { t: tSocial, name: 'techSlide', vol: 0.3 }, { t: tAgain, name: 'tick', vol: 0.3 }, { t: tAgain + 0.4, name: 'tick', vol: 0.3 }, { t: tAgain + 0.8, name: 'tick', vol: 0.3 },
  { t: tSurface, name: 'scan', vol: 0.3 }, { t: tClaim, name: 'notification', vol: 0.3 },
];
export const A5: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tName - 0.2) {
    const tilt = t > tWrong ? lerp(0, 24, ramp(t, tWrong, 0.6, EASE.inOut)) : 0;
    return (
      <AbsoluteFill>
        <GridBg />
        {t < tBuilt - 0.2 ? <div style={{ position: 'absolute', left: 960, top: 440, transform: 'translate(-50%,-50%)' }}><Kinetic at={tWhy + 0.1} size={96} align="center" words={[{ w: 'Why' }, { w: 'does' }, { w: 'this' }, { w: 'feel', br: true }, { w: 'different?', serif: true, color: A.red }]} /></div> : <>
          <Helper x={960} y={640} size={420} mood={t > tWrong ? 'guilty' : 'happy'} tilt={tilt * 0.3} talk={talkAt(t, 36)} seed={12} />
          <div style={{ position: 'absolute', left: 960, top: 180, transform: 'translateX(-50%)', textAlign: 'center' }}><Kinetic at={tHelpful} size={60} align="center" words={[{ w: 'Built' }, { w: 'to' }, { w: 'be' }, { w: 'helpful.', serif: true, color: A.red }]} /></div>
          {t > tWrong && <Pop x={960} y={940} at={tWrong}><Label color={A.red} size={36}>…so it can help the wrong person</Label></Pop>}
        </>}
      </AbsoluteFill>
    );
  }
  if (t < tResearch - 0.2) {
    const tries = Math.floor(ramp(t, tAgain, 2.5, EASE.in) * 40);
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.08)" />
        <div style={{ position: 'absolute', left: 960, top: 230, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <Mono size={26} color={A.dim}>THEY HAVE A NAME FOR IT</Mono>
          <div style={{ marginTop: 14 }}><Kinetic at={tSocial} size={92} align="center" words={[{ w: 'Social' }, { w: 'engineering.', serif: true, color: A.red }]} /></div>
          <div style={{ marginTop: 18, opacity: ramp(t, tMachine - 0.1, 0.4), ...fonts.H, fontWeight: 700, fontSize: 40, color: A.white }}>Tricking someone into breaking the rules.<br />Except now, the someone is <span style={{ color: A.red }}>a machine.</span></div>
        </div>
        {t > tAgain && <div style={{ position: 'absolute', left: 960, top: 760, transform: 'translateX(-50%)', display: 'flex', gap: 14 }}>{Array.from({ length: Math.min(tries, 40) }, (_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 4, background: A.red, opacity: 0.4 + 0.6 * Math.sin(i) }} />)}<span style={{ ...fonts.H, fontWeight: 800, fontSize: 30, color: A.white, marginLeft: 16 }}>try again, again, again…</span></div>}
      </AbsoluteFill>
    );
  }
  // ---- researcher quote + "still claim they can"
  return (
    <AbsoluteFill>
      <GridBg />
      {t < tWeeks - 0.2 ? <div style={{ position: 'absolute', left: 260, top: 340 }}><Panel w={1400} pad={52}>
        <div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 58, color: A.white, lineHeight: 1.3 }}>"AI chatbots create a new attack surface… we're likely going to see a lot more of these attacks."</div>
        <div style={{ marginTop: 26 }}><Mono size={22} color={A.dim}>— THREAT RESEARCHER, TO SECURITY JOURNALIST BRIAN KREBS</Mono></div>
      </Panel></div> : <>
        <div style={{ position: 'absolute', left: 230, top: 120 }}><Label color={A.dim} size={26}><Icon name="ph:telegram-logo-fill" size={32} color={A.dim} /> WEEKS LATER</Label></div>
        <div style={{ position: 'absolute', left: 500, top: 420, width: 940 }}><Kinetic at={tClaim} size={70} words={[{ w: 'Some' }, { w: 'sellers' }, { w: 'claimed', serif: true, color: A.red }, { w: 'they' }, { w: 'still', br: true }, { w: 'could' }, { w: 'do' }, { w: 'it.' }]} /></div>
        <Pop x={960} y={820} at={tClaim + 1.2}><Label color={A.dim} size={26}>Meta hasn't confirmed this</Label></Pop>
      </>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 6 · protect yourself
const tHow = C0(40), tT1 = C0(41), tApp = C0(42), tT2 = C0(43), tT3 = C0(44);
export const a6NoCaptions: [number, number][] = [];
const TIPS: [number, string, string, string][] = [
  [0, 'ph:lock-key-fill', 'TURN ON', '2-FACTOR AUTH'],
  [0, 'ph:device-mobile-fill', 'USE AN APP OR', 'PASSKEY, NOT SMS'],
  [0, 'ph:envelope-simple-fill', 'CHECK YOUR', 'EMAIL & PHONE'],
  [0, 'ph:warning-fill', 'UNKNOWN CODE?', 'NEVER SHARE IT'],
];
export const a6Sfx: SfxEvent[] = [
  { t: tHow - 0.1, name: 'powerUp', vol: 0.3 },
  ...[tT1, tApp, tT2, tT3].flatMap((x) => [{ t: x - 0.05, name: 'popUi' as const, vol: 0.3 }, { t: x + 1.0, name: 'confirm' as const, vol: 0.3 }]),
];
export const A6: React.FC = () => {
  const { f, fps, t } = useTF();
  const ats = [tT1, tApp, tT2, tT3];
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(191,242,255,.05)" />
      <div style={{ position: 'absolute', left: 960, top: 90, transform: 'translateX(-50%)', textAlign: 'center' }}>
        <Icon name="ph:shield-check-fill" size={80} color={A.white} style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 10, ...fonts.H, fontWeight: 900, fontSize: 56, color: A.white }}>DON'T BE NEXT</div>
      </div>
      {TIPS.map(([, ic, a, b], k) => {
        const at = ats[k]; if (t < at - 0.1) return null;
        const s = springAt(f, fps, at - 0.08, { damping: 15, stiffness: 180 });
        const done = t > at + 1.0;
        const cx = 620 + (k % 2) * 680, cy = 470 + Math.floor(k / 2) * 280;
        return (
          <div key={k} style={{ position: 'absolute', left: cx, top: cy, width: 600, height: 250, transform: `translate(-50%,-50%) translateY(${(1 - s) * 40}px)`, opacity: clamp(s * 1.6), borderRadius: 24, background: A.panel, border: `2px solid ${done ? A.white : A.line}`, display: 'flex', alignItems: 'center', gap: 30, padding: 36 }}>
            <div style={{ position: 'absolute', left: 20, top: 14, ...fonts.H, fontWeight: 900, fontSize: 40, color: A.red }}>{k < 3 ? k + 1 : '!'}</div>
            <Icon name={ic} size={110} color={done ? A.white : A.dim} />
            <div style={{ ...fonts.H, fontWeight: 800, fontSize: 36, color: A.white, lineHeight: 1.15 }}>{a}<br /><span style={{ color: A.red, fontWeight: 900 }}>{b}</span></div>
            {done && <div style={{ position: 'absolute', right: -16, top: -16, width: 56, height: 56, borderRadius: 28, background: A.white, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${springAt(f, fps, at + 1.0, { damping: 9, stiffness: 240 })})` }}><Icon name="ph:check-bold" size={34} color="#111" /></div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 7 · outro
const tQ = C0(45), tTrust = P(45, 'trust an AI'), tHuman = P(45, 'a real human'), tTell = P(45, 'Tell me'), tSub = C0(46), tNext = P(46, 'even stranger'), tBye = C0(47), tEnd = C1(47);
export const a7NoCaptions: [number, number][] = [[tEnd + 0.3, tEnd + 10]];
export const a7Sfx: SfxEvent[] = [
  { t: tQ, name: 'chime', vol: 0.3 }, { t: tTrust - 0.05, name: 'popUi', vol: 0.3 }, { t: tHuman - 0.05, name: 'popUi', vol: 0.3 }, { t: tTell, name: 'notify', vol: 0.3 },
  { t: tSub, name: 'clickModern', vol: 0.4 }, { t: tSub + 0.4, name: 'bell', vol: 0.3 }, { t: tBye, name: 'sparkle', vol: 0.3 }, { t: tBye + 0.5, name: 'error', vol: 0.4, note: 'disabled stamp' },
];
export const A7: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tSub - 0.2) {
    return (
      <AbsoluteFill>
        <GridBg glow="rgba(255,43,61,.08)" />
        <div style={{ position: 'absolute', left: 960, top: 200, transform: 'translateX(-50%)' }}><Kinetic at={tQ + 0.1} size={80} align="center" words={[{ w: 'Would' }, { w: 'you' }, { w: 'trust', serif: true, color: A.red }, { w: 'an' }, { w: 'AI?' }]} /></div>
        {[[tTrust, 'ph:robot-fill', 'TRUST THE AI', 'fast, but no judgement'], [tHuman, 'ph:user-fill', 'WANT A HUMAN', 'slow, but it can say no']].map(([at, ic, a, b], i) => <Pop key={a as string} x={620 + i * 680} y={580} at={(at as number) - 0.05}><div style={{ width: 560, borderRadius: 24, background: A.panel, border: `2px solid ${A.line}`, padding: 40, textAlign: 'center' }}><Icon name={ic as string} size={120} color={A.white} style={{ margin: '0 auto' }} /><div style={{ marginTop: 18, ...fonts.H, fontWeight: 900, fontSize: 46, color: A.white }}>{a as string}</div><div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 32, color: A.dim }}>{b as string}</div></div></Pop>)}
        {t > tTell && <Pop x={960} y={940} at={tTell}><Label color={A.red} size={34} solid><Icon name="ph:chat-circle-dots-fill" size={38} color={A.white} /> TELL ME IN THE COMMENTS</Label></Pop>}
      </AbsoluteFill>
    );
  }
  const subbed = t > tSub + 0.3;
  const stamp = t > tBye + 0.4;
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(191,242,255,.05)" />
      {t < tBye - 0.2 && <div style={{ position: 'absolute', left: 620, top: 300, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ padding: '22px 44px', borderRadius: 48, background: subbed ? '#1c1c22' : A.red, ...fonts.H, fontWeight: 900, fontSize: 50, color: A.white }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
        <Icon name={subbed ? 'ph:bell-ringing-fill' : 'ph:bell-fill'} size={72} color={A.white} />
      </div>}
      {t > tNext && t < tBye - 0.2 && <Pop x={620} y={480} at={tNext}><Label color={A.dim} size={30}>next time: an even stranger story</Label></Pop>}
      <div style={{ position: 'relative' }}><Helper x={t < tBye - 0.2 ? 1480 : 960} y={t < tBye - 0.2 ? 1000 : 940} size={t < tBye - 0.2 ? 460 : 620} mood={stamp ? 'off' : 'happy'} wave={t > tBye && !stamp} talk={talkAt(t, 47)} seed={13} /></div>
      {t > tBye && t < tBye + 0.5 && <div style={{ position: 'absolute', left: 960, top: 360, transform: 'translateX(-50%)' }}><Kinetic at={tBye} size={80} align="center" words={[{ w: 'Happy' }, { w: 'to' }, { w: 'help!', serif: true, color: A.red }]} /></div>}
      <Stamp x={960} y={230} at={tBye + 0.4} text="TEMPORARILY DISABLED" size={70} rot={-7} />
    </AbsoluteFill>
  );
};
