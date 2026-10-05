// S9 · How to Protect Yourself — five steps on a TV settings screen (toggles, checkboxes),
// a guest-network diagram, the living-room unplug that finally sticks, then the next-video
// tease (phone + smart glasses), subscribe click, comment prompt and the channel sign-off.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { LivingRoom, TVX, TVY, TVW, PORT, ROUTER } from '../components/LivingRoom';
import { BgMesh, Grade } from '../components/Look';
import { Grid, Dust, Glow } from '../components/Backdrop';
import { Chapter } from '../components/Blocks';
import { Kinetic } from '../components/Kinetic';
import { Flash, Pill, Toggle, Rings } from '../components/UI';
import { TV } from '../components/TV';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, S0, S1, EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(9), Z = S1(9);
const tFix = P(41, 'the fix'), tMenu = P(41, 'Menu names'), tSettings = P(41, 'open Settings'), tGeneral = P(41, 'then General'), tLook = P(41, 'look for');
const T1 = C0(42), tAR = P(42, 'Always Ready'), tQS = P(42, 'Quick Start'), tOff = P(42, 'so off');
const T2 = C0(43), tVoice = P(43, 'voice recognition'), tHi = P(43, 'wake word');
const T3 = C0(44), tUA = P(44, 'User Agreements'), tView = P(44, 'viewing information'), tVoiceI = P(44, 'voice information'), tAds = P(44, 'personalised ads'), tOther = P(44, 'On other'), tCR = P(44, 'content recognition');
const T4 = C0(45), tGuest = P(45, 'separate guest'), tCant = P(45, 'so it'), tPhones = P(45, 'your phones');
const T5 = C0(46), tNobody = P(46, 'almost nobody'), tDont = P(46, 'connect your smart'), tAll = P(46, 'at all'), tStick = P(46, 'Plug in'), tScreen = P(46, 'just be a screen');
const TB = C0(47), tOnly = P(47, 'only device'), tAlways = P(47, 'always-on'), tPocket = P(47, 'in your pocket'), tFace = P(47, 'on your face'), tNext = P(47, 'breaking down next'), tSub = P(47, 'Subscribe'), tTell = P(47, 'tell me'), tEndV = C1(47);
const tUnplug = tAll + 0.1, tClick = tSub + 0.55;

const STEPS = [
  { n: '01', at: T1, title: 'Always Ready &|Quick Start: OFF', sub: 'so off actually means off', icon: 'ph:power-bold' },
  { n: '02', at: T2, title: 'Voice recognition|& “Hi LG”: OFF', sub: 'if you don’t use them', icon: 'ph:microphone-slash-bold' },
  { n: '03', at: T3, title: 'User Agreements:|untick the data', sub: 'viewing · voice · personalised ads', icon: 'ph:list-checks-bold' },
  { n: '04', at: T4, title: 'Guest Wi-Fi|for the TV', sub: 'it can’t see your phones & laptops', icon: 'ph:wifi-high-bold' },
  { n: '05', at: T5, title: 'Don’t connect it|at all', sub: 'use a streaming stick you trust', icon: 'ph:plugs-bold' },
];

export const s9NoCaptions: [number, number][] = [[tFix - 0.1, tMenu - 0.15], [tTell - 0.1, Z]];

export const s9Sfx: SfxEvent[] = [
  { t: tFix - 0.08, name: 'impactBig', vol: 0.55, note: 'THE FIX' },
  { t: tMenu - 0.15, name: 'swoosh', vol: 0.4, note: 'TV slides in' }, { t: tMenu + 0.25, name: 'popUi', vol: 0.3, note: 'menu names vary' },
  { t: tSettings - 0.03, name: 'click', vol: 0.4 }, { t: tGeneral - 0.03, name: 'click', vol: 0.4 },
  ...[0, 1, 2, 3].map((k) => ({ t: tLook + k * 0.3, name: 'tick' as const, vol: 0.3 })),
  ...STEPS.map((s) => ({ t: s.at - 0.25, name: 'whooshQuick' as const, vol: 0.35, note: `step ${s.n}` })),
  ...STEPS.map((s) => ({ t: s.at - 0.02, name: 'typeHard' as const, vol: 0.45 })),
  { t: tAR + 0.32, name: 'toggle', vol: 0.55 }, { t: tQS + 0.32, name: 'toggle', vol: 0.55 }, { t: tOff + 0.15, name: 'switchLight', vol: 0.45, note: 'LED dies' },
  { t: tVoice + 0.38, name: 'toggle', vol: 0.55 }, { t: tHi + 0.28, name: 'toggle', vol: 0.55 },
  { t: tUA - 0.05, name: 'click', vol: 0.35 },
  { t: tView + 0.18, name: 'clickModern', vol: 0.5 }, { t: tVoiceI + 0.18, name: 'clickModern', vol: 0.5 }, { t: tAds + 0.18, name: 'clickModern', vol: 0.5 },
  { t: tOther - 0.02, name: 'popUi', vol: 0.3 }, { t: tCR - 0.02, name: 'popUi', vol: 0.3 },
  { t: tGuest - 0.02, name: 'click', vol: 0.4 }, { t: tGuest + 0.55, name: 'success', vol: 0.35, note: 'guest connected' },
  { t: tCant - 0.3, name: 'swoosh', vol: 0.35, note: 'network diagram' }, { t: tPhones + 0.1, name: 'lock', vol: 0.5, note: 'blocked' },
  { t: T5 - 0.3, name: 'whooshBig', vol: 0.45, note: 'into the room' },
  { t: tDont - 0.2, name: 'zoomIn', vol: 0.5, note: 'push in to router' },
  { t: tUnplug - 0.03, name: 'lockQuick', vol: 0.7, note: 'plug pulled for good' }, { t: tUnplug + 0.12, name: 'glitchElectric', vol: 0.35 }, { t: tUnplug + 0.35, name: 'popUi', vol: 0.35 },
  { t: tStick - 0.2, name: 'zoomOut', vol: 0.45 }, { t: tStick + 0.25, name: 'techSlide', vol: 0.4 }, { t: tStick + 0.8, name: 'lock', vol: 0.45, note: 'stick clicks in' },
  { t: tScreen - 0.3, name: 'powerUp', vol: 0.4, note: 'just a screen' },
  { t: TB - 0.3, name: 'whooshDeep', vol: 0.45 }, { t: TB + 0.1, name: 'pop', vol: 0.35, note: 'TV tile' },
  { t: tOnly, name: 'sweepSmall', vol: 0.3, note: 'ghost tiles' }, { t: tAlways - 0.05, name: 'heartbeat', vol: 0.45 },
  { t: tPocket - 0.05, name: 'pop', vol: 0.4, note: 'phone' }, { t: tFace - 0.05, name: 'pop', vol: 0.4, note: 'glasses' },
  { t: tNext - 1.2, name: 'riser', vol: 0.4, dur: 1.4 }, { t: tNext + 0.2, name: 'impact', vol: 0.5, note: 'NEXT VIDEO' },
  { t: tSub - 0.1, name: 'popUi', vol: 0.35 }, { t: tClick, name: 'clickModern', vol: 0.6 }, { t: tClick + 0.25, name: 'bell', vol: 0.4 },
  { t: tTell + 0.1, name: 'typing', vol: 0.3, dur: 2.4 },
  { t: tEndV + 0.55, name: 'shimmer', vol: 0.4 }, { t: tEndV + 0.3, name: 'impactDeep', vol: 0.5, note: 'sign-off' },
];

export const S9Fix: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const roomOn = t > T5 - 0.4 && t < TB + 0.1;
  return (
    <AbsoluteFill>
      <BgMesh a={C.green} b={C.blue} />
      <Grid opacity={0.14} perspective={false} />
      <Kinetic text="Here's the *fix.*" at={tFix - 0.05} out={tMenu - 0.25} y={520} size={170} weight={900} anim="slam" stagger={0.09} accent={C.green} />
      {t > tMenu - 0.4 && t < T5 + 0.2 && <Steps />}
      {roomOn && <Room />}
      {t > TB - 0.4 && <Outro />}
      <Dust count={30} opacity={0.26} />
      <Chapter n={9} title="Protect Yourself" at={A + 0.3} out={TB - 0.4} color={C.green} />
      <Grade />
    </AbsoluteFill>
  );
};

// ---------- steps 1-4: left column + TV settings screen ----------
const Steps: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const k = STEPS.reduce((acc, s, i) => (t >= s.at - 0.15 ? i : acc), -1);
  const tvIn = springAt(f, fps, tMenu - 0.15, { damping: 16, stiffness: 110 });
  const toNet = ramp(t, tCant - 0.35, 0.5, EASE.inOut); // TV gives way to the network diagram
  const exAll = ramp(t, T5 - 0.4, 0.35, EASE.in);
  const led = 1 - ramp(t, tOff + 0.1, 0.25);
  return (
    <AbsoluteFill style={{ opacity: 1 - exAll }}>
      {/* progress tracker */}
      {k >= 0 && (
        <div style={{ position: 'absolute', left: 960, top: 92, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 0, opacity: ramp(t, T1 - 0.3, 0.4) }}>
          {STEPS.map((s, i) => {
            const done = i < k, cur = i === k;
            return (
              <React.Fragment key={s.n}>
                {i > 0 && <div style={{ width: 90, height: 4, background: i <= k ? C.green : '#22325a' }} />}
                <div style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? C.green : cur ? `${C.green}33` : '#0c1324', border: `3px solid ${i <= k ? C.green : '#22325a'}`, boxShadow: cur ? `0 0 ${18 + 10 * Math.sin(t * 4)}px ${C.green}` : undefined, fontFamily: fonts.head, fontWeight: 900, fontSize: 22, color: done ? '#04140c' : C.ink }}>{done ? <Icon name="ph:check-bold" size={28} color="#04140c" /> : i + 1}</div>
              </React.Fragment>
            );
          })}
        </div>
      )}
      {/* left column: intro, then the current step */}
      {k < 0 && t > tMenu - 0.2 && (
        <div style={{ position: 'absolute', left: 120, top: 330, opacity: ramp(t, tMenu - 0.1, 0.4) * (1 - ramp(t, T1 - 0.35, 0.25)) }}>
          <Icon name="ph:gear-six-bold" size={150} color={C.green} style={{ transform: `rotate(${t * 40}deg)` }} />
          <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: C.ink, marginTop: 20, lineHeight: 1.1 }}>Settings<span style={{ color: C.dim }}> › </span><span style={{ color: C.green, opacity: ramp(t, tGeneral - 0.05, 0.3) }}>General</span></div>
        </div>
      )}
      <Pill x={120} y={760} at={tMenu + 0.2} out={T1 - 0.4} color={C.amber}><Icon name="ph:info-bold" size={28} color={C.ink} /> Menu names vary by model</Pill>
      {STEPS.slice(0, 4).map((s, i) => <StepText key={s.n} i={i} />)}
      {/* other brands */}
      {t > tOther - 0.1 && t < T4 && (
        <div style={{ position: 'absolute', left: 120, top: 760, opacity: ramp(t, tOther - 0.1, 0.3) * (1 - ramp(t, T4 - 0.35, 0.25)) }}>
          <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.2em', color: C.dim }}>OTHER BRANDS · LOOK FOR</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
            {[['Viewing information', tOther + 0.6], ['Content recognition', tCR]].map(([l, at]) => { const sp = springAt(f, fps, (at as number) - 0.05, { damping: 12, stiffness: 180 }); return <div key={l as string} style={{ padding: '10px 20px', borderRadius: 999, border: `2px solid ${C.cyan}`, background: `${C.cyan}18`, fontFamily: fonts.head, fontWeight: 800, fontSize: 28, color: C.ink, transform: `scale(${sp})`, opacity: clamp(sp * 1.4), whiteSpace: 'nowrap' }}>{l as string}</div>; })}
          </div>
        </div>
      )}
      {/* the TV with the settings UI */}
      {toNet < 1 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${(1 - tvIn) * 900}px) scale(${1 - toNet * 0.15})`, transformOrigin: '1300px 500px', opacity: clamp(tvIn * 1.4) * (1 - toNet) }}>
          <TV x={780} y={230} w={1040} led={led} screenOn={1} bias={0.5} screen={<Menu />} />
        </div>
      )}
      {toNet > 0 && <NetDiagram u={toNet} />}
    </AbsoluteFill>
  );
};

const StepText: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const s = STEPS[i], next = STEPS[i + 1]?.at ?? T5;
  if (t < s.at - 0.2 || t > next) return null;
  const sp = springAt(f, fps, s.at - 0.15, { damping: 14, stiffness: 150 });
  const ex = ramp(t, next - 0.3, 0.25, EASE.in);
  return (
    <div style={{ position: 'absolute', left: 120, top: 230, width: 640, opacity: clamp(sp * 1.4) * (1 - ex), transform: `translateY(${(1 - sp) * 60 - ex * 40}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 200, lineHeight: 1, color: C.green, letterSpacing: '-0.04em', textShadow: `0 0 50px ${C.green}55`, transform: `scale(${1.4 - 0.4 * clamp(sp)})`, transformOrigin: '0% 50%' }}>{s.n}</div>
        <div style={{ width: 96, height: 96, borderRadius: 24, background: `${C.green}18`, border: `2px solid ${C.green}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.icon} size={58} color={C.green} /></div>
      </div>
      <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 56, color: C.ink, lineHeight: 1.12, marginTop: 18 }}>{s.title.split('|').map((l, j) => <div key={j}>{l}</div>)}</div>
      <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: C.dim, marginTop: 16 }}>{s.sub}</div>
    </div>
  );
};

// TV settings menu (rendered inside the TV screen)
type Row = { label: string; kind: 'link' | 'toggle' | 'check' | 'wifi'; v?: number; icon: string; sub?: string };
const Menu: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  let crumb: string[] = [], rows: Row[] = [], cur = -1;
  const sw = (at: number) => 1 - ramp(t, at, 0.22, EASE.inOut); // on → off
  if (t < T1 - 0.15) {
    crumb = t > tGeneral - 0.05 ? ['Settings', 'General'] : t > tSettings - 0.05 ? ['Settings'] : [];
    if (t > tGeneral - 0.05) rows = [
      { label: 'Devices', kind: 'link', icon: 'ph:television-simple-bold', sub: 'Always Ready · Quick Start+' },
      { label: 'AI Service', kind: 'link', icon: 'ph:microphone-bold', sub: 'Voice recognition' },
      { label: 'System', kind: 'link', icon: 'ph:gear-six-bold', sub: 'User Agreements' },
      { label: 'Network', kind: 'link', icon: 'ph:wifi-high-bold', sub: 'Wi-Fi connection' },
    ];
    cur = t > tLook ? Math.min(3, Math.floor((t - tLook) / 0.3)) : -1;
  } else if (t < T2 - 0.15) {
    crumb = ['Settings', 'General', 'Devices'];
    rows = [{ label: 'Always Ready', kind: 'toggle', v: sw(tAR + 0.3), icon: 'ph:power-bold' }, { label: 'Quick Start+', kind: 'toggle', v: sw(tQS + 0.3), icon: 'ph:lightning-bold' }];
    cur = t > tQS + 0.1 ? 1 : 0;
  } else if (t < T3 - 0.15) {
    crumb = ['Settings', 'General', 'AI Service'];
    rows = [{ label: 'Voice Recognition', kind: 'toggle', v: sw(tVoice + 0.35), icon: 'ph:microphone-bold' }, { label: '“Hi LG” Wake Word', kind: 'toggle', v: sw(tHi + 0.25), icon: 'ph:waveform-bold' }];
    cur = t > tHi ? 1 : 0;
  } else if (t < T4 - 0.15) {
    crumb = ['General', 'System', 'User Agreements'];
    rows = [{ label: 'Viewing Information', kind: 'check', v: t > tView + 0.15 ? 0 : 1, icon: 'ph:eye-bold' }, { label: 'Voice Information', kind: 'check', v: t > tVoiceI + 0.15 ? 0 : 1, icon: 'ph:microphone-bold' }, { label: 'Personalised Advertising', kind: 'check', v: t > tAds + 0.15 ? 0 : 1, icon: 'ph:megaphone-bold' }];
    cur = t > tAds ? 2 : t > tVoiceI ? 1 : 0;
  } else {
    crumb = ['Settings', 'General', 'Network', 'Wi-Fi'];
    const g = t > tGuest + 0.5;
    rows = [{ label: 'Home_5G', kind: 'wifi', v: g ? 0 : 1, icon: 'ph:wifi-high-bold', sub: g ? 'Saved' : 'Connected' }, { label: 'Home_Guest', kind: 'wifi', v: g ? 1 : 0, icon: 'ph:wifi-high-bold', sub: g ? 'Connected · isolated' : 'Guest network' }];
    cur = t > tGuest - 0.1 ? 1 : 0;
  }
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg,#101a33,#070b16)', padding: '34px 46px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 700, fontSize: 30, color: C.dim, height: 44 }}>
        {crumb.length > 0 && <Icon name="ph:gear-six-bold" size={34} color={C.ink} />}
        {crumb.map((c, i) => <React.Fragment key={c}>{i > 0 && <Icon name="ph:caret-right-bold" size={22} color={C.dim} />}<span style={{ color: i === crumb.length - 1 ? C.ink : C.dim }}>{c}</span></React.Fragment>)}
      </div>
      <div style={{ height: 2, background: 'rgba(140,170,230,.18)', margin: '20px 0 22px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map((r, i) => {
          const focus = i === cur;
          return (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 24, height: 108, padding: '0 28px', borderRadius: 16, background: focus ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.03)', border: `2px solid ${focus ? C.ink : 'transparent'}`, transform: `scale(${focus ? 1.015 : 1})` }}>
              <Icon name={r.icon} size={50} color={C.ink} />
              <div>
                <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 40, color: C.ink, whiteSpace: 'nowrap' }}>{r.label}</div>
                {r.sub && <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 25, color: r.kind === 'wifi' && r.v ? C.green : C.dim }}>{r.sub}</div>}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                {r.kind === 'link' && <Icon name="ph:caret-right-bold" size={30} color={C.dim} />}
                {r.kind === 'toggle' && <Toggle on={r.v ?? 0} color={C.red} offColor={C.green} size={1.05} />}
                {r.kind === 'check' && <Icon name={r.v ? 'ph:check-square-fill' : 'ph:square-bold'} size={60} color={r.v ? C.red : C.green} />}
                {r.kind === 'wifi' && r.v ? <Icon name="ph:check-bold" size={40} color={C.green} /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// step 4: the TV on its own guest network, walled off from phones and laptops
const NetDiagram: React.FC<{ u: number }> = ({ u }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const R = { x: 1300, y: 300 };
  const zone = (x: number, label: string, color: string, icons: string[], at: number) => {
    const s = springAt(f, fps, at, { damping: 14, stiffness: 140 });
    return (
      <div style={{ position: 'absolute', left: x, top: 470, width: 400, height: 330, borderRadius: 28, border: `3px dashed ${color}`, background: `${color}10`, transform: `scale(${0.85 + 0.15 * s})`, opacity: clamp(s * 1.4) }}>
        <div style={{ position: 'absolute', left: 24, top: 18, fontFamily: fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: '0.18em', color }}>{label}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center', gap: 30 }}>{icons.map((ic) => <Icon key={ic} name={ic} size={icons.length > 1 ? 90 : 160} color={C.ink} />)}</div>
      </div>
    );
  };
  const blocked = ramp(t, tPhones, 0.3, EASE.back);
  const dash = ramp(t, tCant + 0.2, 0.8, EASE.inOut);
  return (
    <AbsoluteFill style={{ opacity: u }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible' }}>
        <path d={`M ${R.x} ${R.y + 50} C ${R.x} 400, 1000 380, 1000 470`} stroke={C.amber} strokeWidth="4" fill="none" opacity={0.8} />
        <path d={`M ${R.x} ${R.y + 50} C ${R.x} 400, 1600 380, 1600 470`} stroke={C.green} strokeWidth="4" fill="none" opacity={0.8} />
        {/* the TV trying to reach the phones */}
        <line x1={1120} y1={650} x2={1120 + 360 * dash} y2={650} stroke={C.red} strokeWidth="5" strokeDasharray="16 12" strokeDashoffset={-t * 60} />
      </svg>
      <div style={{ position: 'absolute', left: R.x - 70, top: R.y - 60, width: 140, height: 110, borderRadius: 24, background: 'rgba(12,18,34,.95)', border: `2px solid ${C.ink}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * u})` }}><Icon name="tabler:router" size={80} color={C.ink} /></div>
      {zone(800, 'GUEST WI-FI', C.amber, ['ph:television-simple-bold'], tCant - 0.2)}
      {zone(1400, 'HOME WI-FI', C.green, ['ph:device-mobile-bold', 'ph:laptop-bold'], tCant)}
      {blocked > 0 && <div style={{ position: 'absolute', left: 1300, top: 650, transform: `translate(-50%,-50%) scale(${blocked})`, width: 110, height: 110, borderRadius: '50%', background: '#1a0810', border: `4px solid ${C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${C.red}88` }}><Icon name="ph:shield-check-bold" size={64} color={C.red} /></div>}
      {blocked > 0 && <div style={{ position: 'absolute', left: 1300, top: 850, transform: 'translateX(-50%)', opacity: ramp(t, tPhones + 0.2, 0.3), fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: C.red, letterSpacing: '0.08em' }}>BLOCKED</div>}
    </AbsoluteFill>
  );
};

// ---------- step 5: the living room, unplugged for good ----------
const Room: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const plug = 1 - ramp(t, tUnplug, 0.3, EASE.back);
  const net = t > tUnplug + 0.1 ? 0 : 1;
  const R = { x: ROUTER.x + 60, y: ROUTER.y + 20 };
  const STICK = { x: TVX + TVW, y: TVY + 330 };
  const cam = [
    { t: T5 - 0.4, x: 960, y: 560, z: 1.12 },
    { t: tNobody + 0.4, x: 960, y: 560, z: 1.0, e: EASE.smooth },
    { t: tDont - 0.2, x: 990, y: 570, z: 1.04, e: EASE.smooth },
    { t: tDont + 0.6, x: R.x, y: R.y, z: 2.5, e: EASE.inOut },
    { t: tStick - 0.25, x: R.x + 10, y: R.y, z: 2.55, e: EASE.smooth },
    { t: tStick + 0.55, x: STICK.x - 60, y: STICK.y, z: 2.1, e: EASE.inOut },
    { t: tScreen - 0.4, x: STICK.x - 50, y: STICK.y, z: 2.15, e: EASE.smooth },
    { t: tScreen + 0.6, x: 960, y: 540, z: 1.05, e: EASE.inOut },
    { t: TB, x: 960, y: 530, z: 1.1, e: EASE.smooth },
  ];
  const stickIn = ramp(t, tStick + 0.2, 0.6, EASE.out);
  const on = ramp(t, tScreen - 0.3, 0.6, EASE.out);
  const screen = (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#5aa0ff,#ffd59a)' }}>
      <div style={{ position: 'absolute', left: '64%', top: '16%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,#fff7da,#ffc85a 70%)', boxShadow: '0 0 80px #ffc85a' }} />
      {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: -80 + k * 60 + Math.sin(t * 0.4 + k) * 30, right: -80, bottom: -30 - k * 10, height: 240 - k * 50, background: ['#2e5a8a', '#244a73', '#1a3657'][k], borderRadius: '50% 50% 0 0' }} />)}
    </AbsoluteFill>
  );
  const fade = ramp(t, T5 - 0.4, 0.4) * (1 - ramp(t, TB - 0.3, 0.35, EASE.in));
  return (
    <AbsoluteFill style={{ opacity: fade, background: C.bg0 }}>
      <Camera keys={cam}>
        <LivingRoom led={0} plug={plug} net={net} screen={screen} screenOn={on} />
        <Layer depth={1}>
          {t > tUnplug && t < tUnplug + 0.5 && Array.from({ length: 10 }, (_, i) => {
            const u = (t - tUnplug) / 0.5, a = (i / 10) * Math.PI * 1.4 - 2.4;
            return <div key={i} style={{ position: 'absolute', left: PORT.x - 20 + Math.cos(a) * u * 60, top: PORT.y + Math.sin(a) * u * 60, width: 4, height: 4, borderRadius: 2, background: C.amber, opacity: 1 - u, boxShadow: `0 0 8px ${C.amber}` }} />;
          })}
          {/* TV edge rim light + HDMI port, so the stick has something to plug into */}
          {t > tStick - 0.3 && <div style={{ position: 'absolute', left: STICK.x - 3, top: TVY + 6, width: 3, height: TVW * 0.575 - 12, background: 'linear-gradient(180deg, transparent, rgba(170,200,255,.45) 30%, rgba(170,200,255,.45) 70%, transparent)', opacity: ramp(t, tStick - 0.3, 0.4) * (1 - ramp(t, tScreen + 0.4, 0.5)) }} />}
          {t > tStick - 0.3 && <div style={{ position: 'absolute', left: STICK.x - 14, top: STICK.y - 12, width: 12, height: 24, borderRadius: 3, background: '#05070b', border: '1px solid rgba(170,200,255,.4)', opacity: ramp(t, tStick - 0.3, 0.4) }} />}
          {/* streaming stick slides into the TV's side HDMI port */}
          {t > tStick && (
            <div style={{ position: 'absolute', left: lerp(STICK.x + 260, STICK.x - 6, stickIn), top: STICK.y - 16, width: 110, height: 32, borderRadius: 8, background: 'linear-gradient(180deg,#2a2f3c,#0d1017)', border: '1px solid rgba(255,255,255,.15)', boxShadow: '0 8px 20px rgba(0,0,0,.6)', opacity: ramp(t, tStick, 0.2) }}>
              <div style={{ position: 'absolute', left: -12, top: 8, width: 14, height: 16, borderRadius: 2, background: '#8a93a6' }} />
              <div style={{ position: 'absolute', right: 12, top: 12, width: 7, height: 7, borderRadius: '50%', background: stickIn >= 1 ? C.green : '#333', boxShadow: stickIn >= 1 ? `0 0 10px ${C.green}` : undefined }} />
            </div>
          )}
          {t > tStick + 0.8 && t < tScreen + 0.4 && <div style={{ position: 'absolute', left: STICK.x + 60, top: STICK.y + 34, opacity: ramp(t, tStick + 0.8, 0.3) * (1 - ramp(t, tScreen, 0.3)), fontFamily: fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: '0.18em', color: C.green, whiteSpace: 'nowrap' }}>HDMI · STREAMING STICK</div>}
        </Layer>
      </Camera>
      <Pill x={960} y={120} at={T5 - 0.1} out={tScreen - 0.1} color={C.green} center><span style={{ fontFamily: fonts.head, fontWeight: 900 }}>05</span> Don’t connect it at all</Pill>
      <Pill x={1240} y={300} at={tUnplug + 0.3} out={tStick - 0.2} color={C.red}><Icon name="ph:wifi-slash-bold" size={30} color={C.ink} /> TV offline · for good</Pill>
      {t > tScreen && <Kinetic text="Just a *screen.*" at={tScreen + 0.4} out={TB - 0.4} y={140} size={70} weight={900} anim="rise" accent={C.green} />}
      <Flash at={tUnplug + 0.05} color={C.red} max={0.15} d={0.35} />
    </AbsoluteFill>
  );
};

// ---------- outro: phone + glasses tease, subscribe, comment, sign-off ----------
const Tile: React.FC<{ x: number; at: number; icon: string; label: string; ring: boolean }> = ({ x, at, icon, label, ring }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const s = springAt(f, fps, at, { damping: 12, stiffness: 150 });
  const ghost = t < at;
  return (
    <div style={{ position: 'absolute', left: x - 180, top: 0, width: 360, height: 400 }}>
      {ghost ? (
        <div style={{ position: 'absolute', inset: 0, borderRadius: 34, border: '3px dashed rgba(140,170,230,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ramp(t, tOnly, 0.4), fontFamily: fonts.head, fontWeight: 900, fontSize: 140, color: 'rgba(140,170,230,.3)' }}>?</div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, borderRadius: 34, background: 'linear-gradient(160deg, rgba(22,32,60,.94), rgba(8,12,24,.96))', border: `2px solid ${C.red}55`, transform: `scale(${0.6 + 0.4 * s})`, opacity: clamp(s * 1.4), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, boxShadow: '0 40px 100px rgba(0,0,0,.6)' }}>
          <div style={{ position: 'relative' }}>
            <Icon name={icon} size={190} color={C.ink} />
            <div style={{ position: 'absolute', right: -14, top: -6, width: 64, height: 64, borderRadius: '50%', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${24 + 14 * Math.sin(t * 5)}px ${C.red}` }}><Icon name="ph:microphone-fill" size={36} color="#fff" /></div>
          </div>
          <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 36, color: C.ink }}>{label}</div>
        </div>
      )}
      {ring && !ghost && <Rings x={180 + 150} y={60} at={at + 0.2} out={tNext} color={C.red} max={160} count={3} speed={0.8} />}
    </div>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const up = ramp(t, tNext - 0.2, 0.7, EASE.inOut);       // tiles move up for the end card
  const endFade = ramp(t, tEndV - 0.05, 0.35, EASE.in);      // end card gives way to the sign-off
  const clicked = t > tClick;
  const cur = { x: lerp(1000, 620, ramp(t, tSub, 0.5, EASE.inOut)), y: lerp(1000, 795, ramp(t, tSub, 0.5, EASE.inOut)) };
  const press = t > tClick - 0.05 && t < tClick + 0.12 ? 0.92 : 1;
  const comment = 'Are you unplugging your TV tonight?';
  const typed = Math.floor(clamp((t - tTell - 0.15) / 1.6) * comment.length);
  return (
    <AbsoluteFill style={{ opacity: ramp(t, TB - 0.35, 0.35) }}>
      <BgMesh a={C.red} b={C.blue} />
      <AbsoluteFill style={{ opacity: 1 - endFade }}>
        <div style={{ position: 'absolute', left: 0, top: lerp(250, 70, up), width: 1920, height: 400, transform: `scale(${1 - up * 0.45})`, transformOrigin: '960px 0px' }}>
          <Tile x={480} at={TB + 0.1} icon="ph:television-simple-bold" label="Smart TV" ring={t > tAlways} />
          <Tile x={960} at={tPocket - 0.05} icon="ph:device-mobile-bold" label="In your pocket" ring />
          <Tile x={1440} at={tFace - 0.05} icon="ph:eyeglasses-bold" label="On your face" ring />
        </div>
        {t > tAlways - 0.1 && t < tNext && <div style={{ position: 'absolute', left: 960, top: 760, transform: 'translateX(-50%)', opacity: ramp(t, tAlways - 0.1, 0.3) * (1 - ramp(t, tNext - 0.4, 0.3)), display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.head, fontWeight: 900, fontSize: 50, color: C.ink, whiteSpace: 'nowrap' }}><span style={{ width: 18, height: 18, borderRadius: 9, background: C.red, boxShadow: `0 0 16px ${C.red}`, opacity: 0.5 + 0.5 * Math.sin(t * 6) }} />Always-on <span style={{ color: C.red }}>microphones</span></div>}
        {/* end card */}
        {t > tNext - 0.1 && (
          <div style={{ position: 'absolute', left: 960, top: 400, transform: 'translateX(-50%)', textAlign: 'center', opacity: ramp(t, tNext + 0.1, 0.35) }}>
            <div style={{ display: 'inline-block', padding: '8px 22px', borderRadius: 10, background: C.red, fontFamily: fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: '0.24em', color: '#fff', transform: `scale(${0.6 + 0.4 * ramp(t, tNext + 0.1, 0.35, EASE.back)})` }}>NEXT VIDEO</div>
          </div>
        )}
        <Kinetic text="The Microphone | in Your *Pocket*" at={tNext + 0.25} out={tEndV - 0.3} y={560} size={92} weight={900} anim="rise" stagger={0.07} />
        {/* subscribe */}
        {t > tSub - 0.15 && (
          <div style={{ position: 'absolute', left: 580, top: 790, transform: `translate(-50%,-50%) scale(${press * (0.7 + 0.3 * ramp(t, tSub - 0.15, 0.35, EASE.back))})`, opacity: ramp(t, tSub - 0.15, 0.25), display: 'flex', alignItems: 'center', gap: 16, padding: '22px 40px', borderRadius: 999, background: clicked ? '#2a3044' : C.red, boxShadow: clicked ? undefined : `0 0 40px ${C.red}88`, fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: '#fff', whiteSpace: 'nowrap' }}>
            {clicked ? 'SUBSCRIBED' : 'SUBSCRIBE'}
            {clicked && <Icon name="ph:bell-ringing-fill" size={44} color={C.amber} style={{ transform: `rotate(${Math.sin((t - tClick) * 30) * 20 * (1 - ramp(t, tClick, 0.9))}deg)` }} />}
          </div>
        )}
        {t > tSub && t < tTell + 0.6 && <div style={{ position: 'absolute', left: cur.x, top: cur.y, opacity: 1 - ramp(t, tTell, 0.4), transform: `scale(${press})` }}><Icon name="ph:cursor-fill" size={64} color="#fff" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.6))' }} /></div>}
        {/* comment prompt */}
        {t > tTell - 0.1 && (
          <div style={{ position: 'absolute', left: 820, top: 730, width: 760, display: 'flex', gap: 18, padding: '22px 26px', borderRadius: 24, background: 'rgba(12,18,34,.94)', border: '1px solid rgba(140,170,230,.25)', opacity: ramp(t, tTell - 0.1, 0.3), transform: `translateY(${(1 - ramp(t, tTell - 0.1, 0.4, EASE.out)) * 30}px)` }}>
            <Icon name="ph:user-circle-fill" size={64} color={C.dim} />
            <div>
              <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 22, color: C.dim }}>Add a comment…</div>
              <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 34, color: C.ink, marginTop: 6, whiteSpace: 'nowrap' }}>{comment.slice(0, typed)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: C.cyan }}>|</span></div>
            </div>
          </div>
        )}
      </AbsoluteFill>
      {/* sign-off */}
      {t > tEndV + 0.25 && (
        <AbsoluteFill style={{ opacity: ramp(t, tEndV + 0.3, 0.45) * (1 - ramp(t, Z - 0.8, 0.7)) }}>
          <Glow x={960} y={520} r={600} color={C.cyan} opacity={0.18} />
          <div style={{ position: 'absolute', left: 960, top: 470, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * ramp(t, tEndV + 0.3, 1.2, EASE.out)})`, display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ width: 130, height: 130, borderRadius: 32, background: `linear-gradient(135deg, ${C.cyan}, ${C.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${C.cyan}66` }}><Icon name="ph:cpu-bold" size={84} color="#04101c" /></div>
            <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 110, color: C.ink, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Mechivio<span style={{ color: C.cyan }}>Tech</span></div>
          </div>
          <div style={{ position: 'absolute', left: 960, top: 600, transform: 'translateX(-50%)', fontFamily: fonts.body, fontWeight: 700, fontSize: 28, letterSpacing: '0.3em', color: C.dim, opacity: ramp(t, tEndV + 0.6, 0.5), whiteSpace: 'nowrap' }}>STAY CURIOUS · STAY PRIVATE</div>
          {/* light sweep over the logo */}
          <div style={{ position: 'absolute', left: lerp(300, 1700, ramp(t, tEndV + 0.6, 1.0, EASE.inOut)), top: 380, width: 120, height: 200, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent)', transform: 'skewX(-20deg)' }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
