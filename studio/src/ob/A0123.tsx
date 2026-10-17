// Acts 0–3: the tracking pop-up and the ten-billion tap (Vio introduces himself) → Meta is a tenant in Apple's and
// Google's buildings → the hidden ID and the Spy that follows you → iOS 14.5, the newspaper ads, and the 4–6% who said yes.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, S0 } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, GridBg, Phone, Label, Panel, BigNum, Host, AttPopup, Tap, Spy, Mark, Building, Paper, Helper } from './kit';

const APPS: [string, string][] = [['ph:instagram-logo-fill', 'INSTAGRAM'], ['ph:whatsapp-logo-fill', 'WHATSAPP'], ['ph:facebook-logo-fill', 'FACEBOOK']];
const AppRow: React.FC<{ x: number; y: number; at: number; size?: number; gap?: number }> = ({ x, y, at, size = 110, gap = 60 }) => (
  <>{APPS.map(([ic, lb], i) => <Pop key={lb} x={x + (i - 1) * (size + gap)} y={y} at={at + i * 0.12}><div style={{ textAlign: 'center' }}><div style={{ width: size, height: size, borderRadius: size * 0.26, background: A.white, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><Icon name={ic} size={size * 0.62} color="#111" /></div><div style={{ marginTop: 10 }}><Mono size={16} color={A.dim}>{lb}</Mono></div></div></Pop>)}</>
);

// ================================================================ ACT 0 · cold open
const tBox = P(0, 'Remember this little box'), tTap = P(1, 'Ask App Not'), tMillions = C0(2), tMeta = P(2, 'And Meta'), tTen = P(2, 'ten billion');
const tVio = C0(3), tWar = P(3, 'started a war'), tMark = C0(4), tShops = P(4, 'an AI that shops');
export const a0NoCaptions: [number, number][] = [];
export const a0Sfx: SfxEvent[] = [
  { t: tBox, name: 'popUi', vol: 0.3 }, { t: tTap, name: 'clickModern', vol: 0.4 }, { t: tTen, name: 'impactDeep', vol: 0.4 }, { t: tMark + 0.2, name: 'whooshDeep', vol: 0.25 },
];
export const A0: React.FC = () => {
  const { t } = useTF();
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.08)" x={70} />
      {t < tMillions - 0.15 && <>
        <Phone x={1230} y={520} w={400}>
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#1b1b22,#0d0d11)' }}>
            {t > tBox - 0.2 && <AttPopup x={186} y={400} w={340} at={tBox} pick={t > tTap + 0.05 ? 'deny' : 'none'} />}
          </AbsoluteFill>
        </Phone>
        <Tap x={1180} y={598} at={tTap} size={70} />
      </>}
      {t >= tMillions - 0.15 && t < tVio - 0.15 && <>
        <div style={{ position: 'absolute', left: 820, top: 170, display: 'grid', gridTemplateColumns: 'repeat(14, 54px)', gap: 12 }}>
          {Array.from({ length: 42 }, (_, i) => { const on = t > tMillions + ((i * 37) % 42) * 0.03; return <div key={i} style={{ height: 34, borderRadius: 6, background: on ? '#26262c' : '#16161c', border: `2px solid ${on ? A.white : A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <Icon name="ph:x-bold" size={18} color={A.red} />}</div>; })}
        </div>
        {t > tMeta - 0.1 && t < tTen - 0.2 && <AppRow x={1270} y={560} at={tMeta} />}
        {t > tTen - 0.2 && <div style={{ position: 'absolute', left: 1270, top: 600, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <BigNum to={10} at={tTen} d={0.8} prefix="$" suffix="B" size={220} color={A.red} />
          <div style={{ marginTop: 8 }}><Mono size={24} color={A.dim}>A YEAR · META'S OWN ESTIMATE</Mono></div>
        </div>}
      </>}
      {t >= tVio - 0.15 && t < tMark - 0.15 && <>
        <Pop x={560} y={300} at={tVio + 0.1}><Label color={A.red} size={30} solid>VIO · YOUR HOST</Label></Pop>
        <div style={{ position: 'absolute', left: 1240, top: 470, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 40 }}>
          {['ph:apple-logo-fill', 'ph:infinity-bold'].map((ic, i) => <Pop key={ic} x={0} y={0} at={tWar - 0.3 + i * 0.15}><div style={{ position: 'relative', left: i ? 200 : -200, width: 220, height: 220, borderRadius: 40, background: A.panel, border: `3px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={130} color={A.white} /></div></Pop>)}
          {t > tWar + 0.1 && <div style={{ position: 'absolute', left: 0, top: -60, transform: `translateX(-50%) scale(${springAt(Math.round(t * 30), 30, tWar + 0.1, { damping: 8, stiffness: 220 })})` }}><Icon name="ph:lightning-fill" size={150} color={A.red} /></div>}
        </div>
        <Pop x={1240} y={720} at={tWar + 0.3}><Mono size={26} color={A.dim}>APPLE  VS  META</Mono></Pop>
      </>}
      {t >= tMark - 0.15 && <>
        <Mark x={1060} y={830} size={420} mood="focus" seed={2} />
        {t > tShops - 0.1 && <Helper x={1460} y={600} size={300} mood="happy" sign="MUSE" signAt={tShops} seed={3} />}
        <div style={{ position: 'absolute', left: 1240, top: 120, transform: 'translateX(-50%)' }}><Kinetic at={tMark + 0.1} size={88} words={[{ w: 'One' }, { w: 'button.', serif: true, color: A.red }]} /></div>
      </>}
      <Host at={0.15} />
    </AbsoluteFill>
  );
};

// ================================================================ ACT 1 · the landlord
const tOwns = P(5, 'Meta owns the apps'), tNot = P(5, "doesn't own"), tPhones = C0(6), tApple = P(6, 'made by Apple'), tGoogle = P(6, "running Google's");
const tShop = C0(7), tRich = C0(8), tRules = P(8, 'the landlord still'), tPriv = C0(9), tBill = P(9, 'a giant billboard');
export const a1NoCaptions: [number, number][] = [];
export const a1Sfx: SfxEvent[] = [{ t: tNot, name: 'error', vol: 0.25 }, { t: tRules + 0.4, name: 'impactDeep', vol: 0.3 }, { t: tBill, name: 'swooshSlow', vol: 0.25 }];
export const A1: React.FC = () => {
  const { t } = useTF();
  let body: React.ReactNode;
  if (t < tPhones - 0.15) {
    const bad = t > tNot;
    body = <>
      <Phone x={1250} y={540} w={380}><AbsoluteFill style={{ background: '#101015' }}><div style={{ position: 'absolute', left: '50%', top: 300, transform: 'translateX(-50%)', display: 'grid', gridTemplateColumns: 'repeat(3, 84px)', gap: 18 }}>{APPS.map(([ic], i) => <div key={i} style={{ width: 84, height: 84, borderRadius: 22, background: A.white, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ramp(t, tOwns + i * 0.1, 0.25) }}><Icon name={ic} size={52} color="#111" /></div>)}</div></AbsoluteFill></Phone>
      {bad && <div style={{ position: 'absolute', left: 1250 - 205, top: 540 - 400, width: 410, height: 800, borderRadius: 52, border: `8px solid ${A.red}`, opacity: ramp(t, tNot, 0.25) }} />}
      <Pop x={1250} y={150} at={tOwns}><Label color={A.white} size={30}>META OWNS THE APPS</Label></Pop>
      {bad && <Pop x={1250} y={950 - 30} at={tNot + 0.1}><Label color={A.red} size={30} solid>NOT THE PHONES</Label></Pop>}
    </>;
  } else if (t < tShop - 0.15) {
    body = <>{[[tApple, 'ph:apple-logo-fill', 'APPLE', 1050], [tGoogle, 'ph:android-logo-fill', 'GOOGLE', 1470]].map(([at, ic, lb, x]) => <React.Fragment key={lb as string}>
      <Pop x={x as number} y={500} at={(at as number) - 0.1}><div style={{ width: 280, height: 560, borderRadius: 46, background: '#111116', boxShadow: 'inset 0 0 0 3px #2a2a33', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}><Icon name={ic as string} size={120} color={A.white} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 40, color: A.white }}>{lb as string}</div><div style={{ display: 'flex', gap: 10 }}>{APPS.map(([a]) => <Icon key={a} name={a} size={40} color={A.dim} />)}</div></div></Pop>
    </React.Fragment>)}</>;
  } else if (t < tPriv - 0.15) {
    const rules = t > tRules;
    body = <>
      <Building x={900} y={940} w={700} h={820} label="THE PHONE BUILDING" lit={0.8}>
        <div style={{ position: 'absolute', left: 190, bottom: 0, width: 320, height: 210, background: A.white, borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 46, color: '#111' }}>META</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>{APPS.map(([a]) => <Icon key={a} name={a} size={38} color="#111" />)}</div>
        </div>
      </Building>
      <Pop x={1720 - 120} y={760} at={tShop + 0.6}><div style={{ textAlign: 'center' }}><Icon name="ph:currency-dollar-bold" size={90} color={A.white} /><div><Mono size={20} color={A.dim}>RENT</Mono></div></div></Pop>
      {t > tRich && <Pop x={1250} y={180} at={tRich}><Label color={A.white} size={30}>HUGE. VERY RICH. STILL A TENANT.</Label></Pop>}
      <Stamp x={1250} y={480} at={tRules + 0.35} text="LANDLORD'S RULES" size={70} rot={-7} />
    </>;
  } else {
    body = <>
      <div style={{ position: 'absolute', left: 820, top: 260, width: 880, height: 400, background: A.white, border: '14px solid #1d1d24', boxShadow: '0 40px 90px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 50, opacity: ramp(t, tBill - 0.2, 0.4), transform: `translateY(${(1 - ramp(t, tBill - 0.2, 0.6, EASE.out)) * 40}px)` }}>
        <div style={{ ...fonts.H, fontWeight: 900, fontSize: 62, color: '#111', lineHeight: 1.05, textAlign: 'center' }}>What happens on your iPhone, stays on your iPhone.</div>
      </div>
      <div style={{ position: 'absolute', left: 1050, top: 660, width: 24, height: 280, background: '#1d1d24' }} /><div style={{ position: 'absolute', left: 1460, top: 660, width: 24, height: 280, background: '#1d1d24' }} />
      <Pop x={1260} y={170} at={tPriv + 0.2}><Label color={A.white} size={28}><Icon name="ph:lock-key-fill" size={30} color={A.white} /> "THE PRIVACY COMPANY"</Label></Pop>
      {t > tBill && <div style={{ position: 'absolute', left: 1260, top: 720, transform: 'translateX(-50%)' }}><Mono size={22} color={A.dim}>LAS VEGAS · 2019</Mono></div>}
    </>;
  }
  return <AbsoluteFill><GridBg x={70} />{body}<Host pose="lookright" at={S0(1) + 0.2} /></AbsoluteFill>;
};

// ================================================================ ACT 2 · the spy
const tAds = C0(10), tKnow = P(10, 'Ads that seem'), tSneak = C0(11), tLater = P(11, 'Ten minutes later'), tId = C0(12), tFollow = P(12, 'follow you'), tTell = P(12, 'tell Meta');
const tBoring = C0(13), tIdfa = P(13, 'The I D F A'), tFortune = P(13, 'worth a fortune'), tSpy = C0(14), tPaid = P(14, 'advertisers paid'), tIdea = C0(15);
export const a2NoCaptions: [number, number][] = [];
export const a2Sfx: SfxEvent[] = [{ t: tLater, name: 'notification', vol: 0.3 }, { t: tIdfa, name: 'glitch', vol: 0.2 }, { t: tSpy + 0.3, name: 'swooshSlow', vol: 0.25 }];
const Sneaker: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = A.red }) => <Icon name="ph:sneaker-fill" size={size} color={color} />;
export const A2: React.FC = () => {
  const { t } = useTF();
  if (t < tSneak - 0.15) {
    return (
      <AbsoluteFill><GridBg />
        <div style={{ position: 'absolute', left: 960, top: 200, transform: 'translateX(-50%)' }}><Kinetic at={tAds + 0.1} size={96} words={[{ w: 'Ads' }, { w: 'that' }, { w: 'know', serif: true, color: A.red }, { w: 'you.' }]} /></div>
        <div style={{ position: 'absolute', left: 960, top: 560, transform: 'translate(-50%,-50%)', display: 'flex', gap: 40 }}>
          {['ph:sneaker-fill', 'ph:headphones-fill', 'ph:game-controller-fill', 'ph:pizza-fill'].map((ic, i) => <Pop key={ic} x={0} y={0} at={tAds + 0.4 + i * 0.15}><div style={{ position: 'relative', width: 230, height: 260, borderRadius: 24, background: A.panel, border: `2px solid ${t > tKnow && i === 0 ? A.red : A.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}><Icon name={ic} size={100} color={A.white} /><Mono size={16} color={A.dim}>SPONSORED</Mono></div></Pop>)}
        </div>
        {t > tKnow && <Pop x={960} y={830} at={tKnow}><Label color={A.red} size={30}><Icon name="ph:eye-fill" size={32} color={A.red} /> TARGETED TO YOU</Label></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tId - 0.15) {
    const later = t > tLater;
    return (
      <AbsoluteFill><GridBg />
        <Phone x={640} y={520} w={340}><AbsoluteFill style={{ background: '#101015', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}><Mono size={14} color={A.dim}>SHOPPING APP</Mono><Sneaker size={150} /><div style={{ ...fonts.H, fontWeight: 800, fontSize: 24, color: A.white }}>Runner X · $89</div></AbsoluteFill></Phone>
        <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}><path d={`M840 520 Q 1060 ${380} 1260 520`} stroke={A.white} strokeWidth={4} strokeDasharray="12 12" fill="none" opacity={ramp(t, tLater - 0.4, 0.4)} /></svg>
        {later && <Pop x={1060} y={380} at={tLater}><Mono size={22} color={A.white}>10 MINUTES LATER</Mono></Pop>}
        <Phone x={1440} y={520} w={340}><AbsoluteFill style={{ background: '#101015' }}>
          <div style={{ position: 'absolute', left: 20, top: 60, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="ph:instagram-logo-fill" size={30} color={A.white} /><Mono size={14} color={A.dim}>FEED</Mono></div>
          {later && <div style={{ position: 'absolute', left: 20, right: 20, top: 120, borderRadius: 16, background: '#1b1b22', padding: 18, textAlign: 'center', transform: `scale(${springAt(Math.round(t * 30), 30, tLater, { damping: 12, stiffness: 200 })})` }}><Mono size={12} color={A.red}>SPONSORED</Mono><div style={{ margin: '14px 0' }}><Sneaker size={140} /></div><div style={{ ...fonts.H, fontWeight: 800, fontSize: 22, color: A.white }}>Still thinking about these?</div></div>}
        </AbsoluteFill></Phone>
      </AbsoluteFill>
    );
  }
  if (t < tBoring - 0.15) {
    const k = ramp(t, tFollow, 1.6, EASE.inOut);
    const stops = [[900, 360], [1250, 560], [1600, 360]];
    const seg = Math.min(1.999, k * 2), a = stops[Math.floor(seg)], b = stops[Math.floor(seg) + 1];
    const u = seg - Math.floor(seg);
    return (
      <AbsoluteFill><GridBg x={70} />
        {stops.map(([x, y], i) => <div key={i} style={{ position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 34, background: A.panel, border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={['ph:shopping-bag-fill', 'ph:music-notes-fill', 'ph:map-pin-fill'][i]} size={70} color={A.white} /></div>)}
        <div style={{ position: 'absolute', left: lerp(a[0], b[0], u), top: lerp(a[1], b[1], u) + 110, transform: 'translate(-50%,-50%)', padding: '10px 18px', borderRadius: 10, background: A.red, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: A.white, opacity: ramp(t, tId + 0.3, 0.3) }}>ID 6D92-41F7-A0C3</div>
        {t > tTell && <><svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}><path d="M1250 690 L1250 820" stroke={A.red} strokeWidth={5} strokeDasharray="10 10" /></svg><Pop x={1250} y={880} at={tTell}><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Icon name="ph:infinity-bold" size={60} color={A.white} /><Label color={A.white} size={28}>REPORTED BACK TO META</Label></div></Pop></>}
        <Host pose="lookright" at={tId - 0.1} />
      </AbsoluteFill>
    );
  }
  if (t < tSpy - 0.15) {
    return (
      <AbsoluteFill><GridBg glow="rgba(255,43,61,.07)" />
        <div style={{ position: 'absolute', left: 960, top: 300, transform: 'translate(-50%,-50%)' }}><Kinetic at={tIdfa} size={200} words={[{ w: 'I·D·F·A' }]} /></div>
        {t > tIdfa + 0.4 && <div style={{ position: 'absolute', left: 960, top: 450, transform: 'translateX(-50%)', opacity: ramp(t, tIdfa + 0.4, 0.4) }}><Mono size={30} color={A.dim}>IDENTIFIER FOR ADVERTISERS</Mono></div>}
        {t > tFortune - 0.1 && <div style={{ position: 'absolute', left: 960, top: 640, transform: 'translateX(-50%)', display: 'flex', gap: 30 }}>{[0, 1, 2, 3, 4].map((i) => <Pop key={i} x={0} y={0} at={tFortune + i * 0.1}><div style={{ position: 'relative', left: (i - 2) * 140 }}><Icon name="ph:currency-dollar-bold" size={110} color={i % 2 ? A.red : A.white} /></div></Pop>)}</div>}
      </AbsoluteFill>
    );
  }
  if (t < tIdea - 0.15) {
    const walk = ramp(t, tSpy, C1(14) - tSpy, (x) => x);
    return (
      <AbsoluteFill><GridBg />
        <div style={{ position: 'absolute', left: 300, top: 300, display: 'flex', gap: 60 }}>{['ph:shopping-bag-fill', 'ph:music-notes-fill', 'ph:map-pin-fill', 'ph:game-controller-fill', 'ph:newspaper-fill'].map((ic, i) => <div key={i} style={{ width: 200, height: 200, borderRadius: 40, background: A.panel, border: `2px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={100} color={A.white} /></div>)}</div>
        <div style={{ position: 'absolute', left: lerp(380, 1500, walk), top: 820, transform: 'translate(-50%,-100%)' }}><Icon name="ph:person-simple-walk-fill" size={220} color={A.white} /></div>
        <Spy x={lerp(380, 1500, walk) - 280} y={830} size={320} mood="sneak" />
        {t > tPaid && <div style={{ position: 'absolute', left: 1500, top: 150, display: 'flex', gap: 14 }}>{[0, 1, 2].map((i) => <Pop key={i} x={0} y={0} at={tPaid + i * 0.12}><div style={{ position: 'relative', left: i * 110 }}><Icon name="ph:coins-fill" size={90} color={A.white} /></div></Pop>)}</div>}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill><GridBg x={70} />
      <div style={{ position: 'absolute', left: 1250, top: 860, transform: 'translate(-50%,-100%)' }}><Icon name="ph:person-simple-fill" size={300} color={A.white} /></div>
      <Spy x={1560} y={870} size={300} mood="sneak" />
      <Pop x={1250} y={300} at={tIdea + 0.4}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 120, color: A.red }}>?</div></Pop>
      <Pop x={1300} y={150} at={tIdea + 0.2}><Label color={A.white} size={30}>NO IDEA THE SPY WAS THERE</Label></Pop>
      <Host pose="thinking" at={tIdea - 0.1} />
    </AbsoluteFill>
  );
};

// ================================================================ ACT 3 · the button
const tIos = C0(16), tAsk = C0(17), tYesNo = P(17, 'yes or no'), tPapers = C0(18), tStand = P(18, "we're standing up"), tReply = C0(19), tUsers = P(19, 'standing up for its users');
const tDoor = C0(20), tNo = P(20, 'Most people'), tChose = C0(21), tFew = P(21, 'only around');
export const a3NoCaptions: [number, number][] = [];
export const a3Sfx: SfxEvent[] = [{ t: tIos + 0.5, name: 'confirm', vol: 0.25 }, { t: tAsk + 0.2, name: 'popUi', vol: 0.3 }, { t: tPapers + 0.3, name: 'paperSlide', vol: 0.3 }, { t: tNo, name: 'error', vol: 0.25 }, { t: tFew, name: 'impactDeep', vol: 0.3 }];
export const A3: React.FC = () => {
  const { f, fps, t } = useTF();
  let body: React.ReactNode, pose: React.ComponentProps<typeof Host>['pose'] = 'lookright', at = S0(3) + 0.2;
  if (t < tAsk - 0.15) {
    const prog = ramp(t, tIos + 0.4, 2.2, EASE.inOut);
    body = <Phone x={1250} y={540} w={380}><AbsoluteFill style={{ background: '#0d0d11', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <Icon name="ph:apple-logo-fill" size={90} color={A.white} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 52, color: A.white }}>iOS 14.5</div><Mono size={16} color={A.dim}>APRIL 2021</Mono>
      <div style={{ width: 240, height: 10, borderRadius: 5, background: '#26262c' }}><div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 5, background: A.white }} /></div>
    </AbsoluteFill></Phone>;
  } else if (t < tPapers - 0.15) {
    body = <><AttPopup x={1250} y={520} w={620} at={tAsk + 0.1} />{t > tYesNo && <Pop x={1250} y={860} at={tYesNo}><Label color={A.white} size={30}>EVERY APP HAS TO ASK FIRST</Label></Pop>}</>;
  } else if (t < tReply - 0.15) {
    pose = 'present'; at = tPapers - 0.1;
    body = <>
      <Paper x={1170} y={500} at={tPapers + 0.2} rot={-4} name="The Morning Ledger" kicker="FULL-PAGE AD · DECEMBER 2020" head="Standing up to Apple" />
      <Paper x={1330} y={540} at={tStand - 0.2} rot={3} name="The National Post" kicker="FULL-PAGE AD · META" head="“We're standing up to Apple for small businesses everywhere.”" w={640} />
    </>;
  } else if (t < tDoor - 0.15) {
    body = <>
      <div style={{ position: 'absolute', left: 1250, top: 500, transform: 'translate(-50%,-50%)', width: 760, padding: 50, borderRadius: 28, background: A.panel, border: `2px solid ${A.line}`, textAlign: 'center', opacity: ramp(t, tReply + 0.1, 0.3) }}>
        <Icon name="ph:apple-logo-fill" size={90} color={A.white} style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 20 }}><Mono size={20} color={A.dim}>APPLE'S ANSWER</Mono></div>
        {t > tUsers - 0.2 && <div style={{ marginTop: 16 }}><Kinetic at={tUsers - 0.1} size={64} words={[{ w: 'Standing' }, { w: 'up' }, { w: 'for', br: true }, { w: 'our' }, { w: 'users.', serif: true, color: A.red }]} /></div>}
      </div>
    </>;
  } else if (t < tChose - 0.15) {
    const shut = t > tNo + 0.4;
    body = <>
      <div style={{ position: 'absolute', left: 1000, top: 260, width: 360, height: 620, background: '#1c1c22', border: `8px solid ${A.line}`, borderBottom: 'none' }}>
        <div style={{ position: 'absolute', left: 30, right: 30, top: 120, padding: 18, background: A.white, transform: 'rotate(-2deg)', ...fonts.H, fontWeight: 800, fontSize: 26, color: '#111', lineHeight: 1.15, textAlign: 'center' }}>Do you want this shop to watch what you do?</div>
        <div style={{ position: 'absolute', right: 30, top: 330, width: 22, height: 22, borderRadius: 11, background: A.soft }} />
      </div>
      <div style={{ position: 'absolute', left: 1000, top: 880, width: 760, height: 10, background: A.line }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 1460 + i * 100, top: 880, transform: 'translate(-50%,-100%)' }}><Icon name="ph:person-simple-fill" size={180} color={A.white} />{t > tNo + i * 0.15 && <div style={{ position: 'absolute', left: '50%', top: -60, transform: 'translateX(-50%)', padding: '6px 14px', borderRadius: 10, background: A.red, ...fonts.H, fontWeight: 900, fontSize: 30, color: A.white }}>NO</div>}</div>)}
      <Spy x={880} y={890} size={260} mood={shut ? 'locked' : 'sneak'} />
    </>;
  } else {
    pose = 'shocked'; at = tFew - 0.1;
    body = <>
      <div style={{ position: 'absolute', left: 840, top: 220, display: 'grid', gridTemplateColumns: 'repeat(10, 46px)', gap: 12 }}>{Array.from({ length: 100 }, (_, i) => { const yes = i % 19 === 7; const on = t > tChose + 0.2 + i * 0.012; return <div key={i} style={{ width: 46, height: 46, borderRadius: 23, background: !on ? '#16161c' : yes ? A.white : A.red, opacity: on ? 1 : 0.6 }} />; })}</div>
      <div style={{ position: 'absolute', left: 1560, top: 470, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: ramp(t, tFew - 0.2, 0.3) }}>
        <div style={{ ...fonts.H, fontWeight: 900, fontSize: 150, color: A.white, letterSpacing: '-0.05em' }}>4–6%</div>
        <Mono size={20} color={A.dim}>SAID YES · US · FIRST WEEKS</Mono><div style={{ marginTop: 6 }}><Mono size={16} color={A.dim}>(ANALYTICS-FIRM ESTIMATE)</Mono></div>
      </div>
    </>;
  }
  return <AbsoluteFill><GridBg x={70} glow="rgba(255,255,255,.04)" />{body}<Host pose={pose} at={at} /></AbsoluteFill>;
};
