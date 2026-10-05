// 0:00 – title. Night living room, the microphone that never sleeps, the router unplug test
// with a time-lapse "days later", "not one brand", the five-settings promise, and the title sting.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { LivingRoom, TVX, TVY, TVW, PORT, ROUTER } from '../components/LivingRoom';
import { TV, ledPos } from '../components/TV';
import { Kinetic, Label } from '../components/Kinetic';
import { Pill, Panel, Toggle, Brackets, Wipe, Flash, Rings, glitchOffset } from '../components/UI';
import { Gradient, Grid, Dust, Glow } from '../components/Backdrop';
import { BgMesh, Grade } from '../components/Look';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, PE, TL, EASE, ramp, track, springAt, rng, clamp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const LED = ledPos(TVX, TVY, TVW);

// ---- key moments (Whisper word timing)
const tWhy = P(0, 'So why'), tMic = P(0, 'microphone');
const tSept = C0(1), tCut = P(1, 'cut off its internet'), tTalk = P(1, 'talked around it'), tDays = P(1, 'Days later'), tPlug = P(1, 'plugged the'), tBackIn = PE(1, 'back in'), tWatch = P(1, 'watched what');
const tBrand = C0(2), tPrivate = P(2, 'most private');
const tFive = C0(3), tSwitch = P(3, 'switch off'), tLast = P(3, 'The last one');
const tTitle = TL.titleAt, tEnd = TL.sections[1].start;
const tUnplug = tCut + 0.55;     // plug leaves the router
const tReplug = tBackIn - 0.15;  // plug goes back in

export const coldOpenNoCaptions: [number, number][] = [[0, C1(0) + 0.2], [tDays - 0.3, tPlug + 0.2], [tWatch + 0.1, C1(1) + 0.1], [tBrand - 0.3, tEnd + 0.5]];

export const coldOpenSfx: SfxEvent[] = [
  { t: 0.15, name: 'drone', vol: 0.22, note: 'room tone' },
  { t: 0.9, name: 'heartbeat', vol: 0.45 }, { t: 2.2, name: 'heartbeat', vol: 0.4 }, { t: 3.5, name: 'heartbeat', vol: 0.45 },
  { t: P(0, 'The screen') - 0.05, name: 'tap', vol: 0.25 }, { t: P(0, 'The room') - 0.05, name: 'tap', vol: 0.25 },
  { t: tWhy - 0.1, name: 'zoomTech', vol: 0.55, note: 'camera dives to the LED' },
  { t: tMic - 0.05, name: 'bassHitFx', vol: 0.5, note: 'LED flare' },
  { t: C1(0) + 0.05, name: 'whooshDeep', vol: 0.45, note: 'pull back out' },
  { t: tSept + 0.45, name: 'popUi', vol: 0.4, note: 'date card' },
  ...[0, 1, 2, 3, 4, 5].map((k) => ({ t: tSept + 0.65 + k * 0.22, name: 'tick' as const, vol: 0.25 })),
  { t: tSept + 1.25, name: 'scan', vol: 0.35, note: 'focus brackets' },
  { t: tCut - 0.05, name: 'zoomFast', vol: 0.5, note: 'push in to router' },
  { t: tUnplug - 0.03, name: 'lockQuick', vol: 0.7, note: 'plug pulled' },
  { t: tUnplug + 0.12, name: 'glitchElectric', vol: 0.4, note: 'net LED goes red' },
  { t: tUnplug + 0.35, name: 'popUi', vol: 0.35, note: 'OFFLINE chip' },
  { t: tTalk + 0.6, name: 'whooshQuick', vol: 0.35, note: 'pull back to the room' },
  { t: tDays - 0.35, name: 'rewind', vol: 0.45, note: 'time-lapse' },
  { t: tDays + 0.2, name: 'pageTurn', vol: 0.45 }, { t: tDays + 0.95, name: 'pageTurn', vol: 0.45 }, { t: tDays + 1.6, name: 'pageTurnBig', vol: 0.4 },
  { t: tPlug - 0.05, name: 'zoomFast', vol: 0.5 },
  { t: tReplug - 0.02, name: 'lock', vol: 0.65, note: 'plug back in' },
  { t: tReplug + 0.25, name: 'confirm', vol: 0.35, note: 'ONLINE chip' },
  { t: tWatch + 0.1, name: 'whooshDeep', vol: 0.4 },
  { t: tWatch + 0.65, name: 'dataLoad', vol: 0.35, note: 'data leaves the TV' },
  { t: tBrand - 0.45, name: 'whooshBig', vol: 0.55, note: 'wipe' }, { t: tBrand, name: 'impact', vol: 0.5 },
  { t: tBrand + 0.3, name: 'impactZoom', vol: 0.45, note: 'NOT ONE BRAND' },
  ...[0, 1, 2, 3].map((k) => ({ t: tBrand + 0.95 + k * 0.35, name: 'bleepHi' as const, vol: 0.12 })),
  { t: tPrivate - 0.2, name: 'swooshSlow', vol: 0.4 },
  { t: tFive - 0.45, name: 'whoosh', vol: 0.5 }, { t: tFive + 0.3, name: 'popUi', vol: 0.4, note: 'privacy panel' },
  ...[0, 1, 2, 3].map((k) => ({ t: tSwitch + k * 0.25, name: 'toggle' as const, vol: 0.55 })),
  { t: tLast + 0.75, name: 'glitch', vol: 0.45, note: '#5 ?' },
  { t: tTitle - 1.6, name: 'riser', vol: 0.55 }, { t: tTitle, name: 'impactEpic', vol: 0.75, note: 'TITLE' },
  { t: tTitle + 0.5, name: 'shimmer', vol: 0.35, note: 'light sweep' },
];

export const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  // ---- states
  const plug = t < tUnplug ? 1 : t < tReplug ? 1 - ramp(t, tUnplug, 0.3, EASE.back) : ramp(t, tReplug, 0.22, EASE.out);
  const net = t > tUnplug + 0.1 && t < tReplug + 0.15 ? 0 : 1;
  const pulse = 0.6 + 0.4 * Math.sin(t * 3.4);
  const flare = Math.max(ramp(t, tMic - 0.1, 0.4) * (1 - ramp(t, C1(0) + 0.2, 0.6)), 0);
  const led = pulse + flare * 1.6 + (t > tWatch ? 0.8 * ramp(t, tWatch, 0.5) : 0);
  // time-lapse: two day/night cycles while "days later" plays
  const lapse = ramp(t, tDays - 0.3, tPlug - tDays + 0.1, EASE.inOut);
  const day = lapse * 2;
  const calendar = 7 + Math.min(2, lapse * 2.2);

  const R = { x: ROUTER.x + 60, y: ROUTER.y + 20 };
  const cam = [
    { t: 0, x: 960, y: 560, z: 1.0 },
    { t: tWhy, x: 960, y: 590, z: 1.1, e: EASE.smooth },
    { t: C1(0) + 0.1, x: LED.x, y: LED.y - 20, z: 3.4, e: EASE.inOut },
    { t: tSept + 1.0, x: 960, y: 560, z: 1.02, e: EASE.inOut },
    { t: tCut - 0.05, x: 1000, y: 560, z: 1.06, e: EASE.smooth },
    { t: tCut + 0.5, x: R.x, y: R.y, z: 2.7, e: EASE.inOut },
    { t: tTalk + 0.5, x: R.x + 10, y: R.y, z: 2.75, e: EASE.smooth },
    { t: tTalk + 1.3, x: 900, y: 580, z: 1.05, e: EASE.inOut },
    { t: tPlug - 0.05, x: 930, y: 560, z: 1.0, e: EASE.smooth },
    { t: tPlug + 0.45, x: R.x, y: R.y, z: 2.7, e: EASE.inOut },
    { t: tWatch, x: R.x + 10, y: R.y, z: 2.75, e: EASE.smooth },
    { t: tWatch + 0.9, x: 960, y: 470, z: 1.35, e: EASE.inOut },
    { t: C1(1), x: 960, y: 450, z: 1.5, e: EASE.smooth },
    { t: tBrand + 4, x: 960, y: 450, z: 1.5 },
    { t: tPrivate - 0.2, x: 960, y: 540, z: 0.96, e: EASE.inOut },
    { t: C1(2), x: 900, y: 560, z: 1.04, e: EASE.smooth },
  ];

  const roomVisible = t < tBrand + 0.05 || (t > tPrivate - 0.6 && t < tFive + 0.4);
  const r = rng(5);

  return (
    <AbsoluteFill style={{ background: C.bg0 }}>
      {roomVisible && (
        <Camera keys={cam}>
          <LivingRoom led={led} plug={plug} net={net} day={day} calendar={calendar} />
          <Layer depth={1}>
            <Rings x={560} y={760} at={tTalk - 0.1} out={tDays - 0.2} color={C.cyan} max={520} count={4} speed={0.7} />
            <Rings x={LED.x} y={LED.y} at={tMic - 0.1} out={C1(0) + 0.3} color={C.red} max={260} count={4} speed={0.9} />
            {/* sparks when the plug leaves the port */}
            {t > tUnplug && t < tUnplug + 0.5 && Array.from({ length: 10 }, (_, i) => {
              const u = (t - tUnplug) / 0.5, a = (i / 10) * Math.PI * 1.4 - 2.4;
              return <div key={i} style={{ position: 'absolute', left: PORT.x - 20 + Math.cos(a) * u * 60, top: PORT.y + Math.sin(a) * u * 60, width: 4, height: 4, borderRadius: 2, background: C.amber, opacity: 1 - u, boxShadow: `0 0 8px ${C.amber}` }} />;
            })}
            {/* data leaving the TV after reconnect */}
            {t > tWatch + 0.6 && t < C1(1) + 0.3 && Array.from({ length: 26 }, (_, i) => {
              const u = ((t - tWatch - 0.6) * 0.8 + i / 26) % 1;
              return <div key={i} style={{ position: 'absolute', left: 560 + r() * 800, top: 250 - u * 420, width: 8, height: 26, borderRadius: 4, background: i % 3 ? C.red : C.amber, opacity: (1 - u) * 0.9 * ramp(t, tWatch + 0.6, 0.4), boxShadow: `0 0 14px ${C.red}` }} />;
            })}
          </Layer>
        </Camera>
      )}

      {/* --- cue 0 kinetic lines */}
      <Kinetic text="Your TV is *off.*" at={0.95} out={P(0, 'The screen') - 0.1} y={955} size={64} />
      <Kinetic text="The screen is black." at={P(0, 'The screen')} out={P(0, 'The room') - 0.1} y={955} size={64} />
      <Kinetic text="The room is silent." at={P(0, 'The room')} out={tWhy - 0.1} y={955} size={64} />
      <Kinetic text="So why is the *microphone* still *awake?*" at={tWhy} out={C1(0) - 0.05} y={955} size={66} anim="pop" stagger={0.07} />

      {/* --- cue 1: lab date card, focus brackets, router offline / online */}
      <Panel x={110} y={180} w={330} at={tSept + 0.5} out={tCut - 0.3} from="left" accent={C.red}>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.24em', color: C.red }}>LAB TEST</div>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 92, color: C.ink, lineHeight: 1.05, marginTop: 6 }}>SEPT<br /><span style={{ color: C.red }}>{String(Math.round(track(t, [[tSept + 0.6, 1], [tSept + 2.0, 7]], EASE.out))).padStart(2, '0')}</span></div>
        <div style={{ fontFamily: fonts.mono, fontSize: 30, color: C.dim, marginTop: 4 }}>2026</div>
      </Panel>
      {t > tSept + 1.2 && t < tCut - 0.3 && <Brackets x={TVX - 30} y={TVY - 30} w={TVW + 60} h={TVW * 0.575 + 60} at={tSept + 1.3} out={tCut - 0.5} color={C.cyan} label="LG OLED · STANDBY" />}
      <Pill x={1240} y={300} at={tUnplug + 0.3} out={tTalk + 0.9} color={C.red}><Icon name="ph:wifi-slash-bold" size={30} color={C.ink} /> Offline</Pill>
      <Pill x={1240} y={300} at={tReplug + 0.2} out={tWatch + 0.8} color={C.green}><Icon name="ph:wifi-high-bold" size={30} color={C.ink} /> Online</Pill>
      {t > tUnplug && t < tUnplug + 0.5 && <Flash at={tUnplug + 0.05} color={C.red} max={0.22} d={0.4} />}
      {t > tDays - 0.3 && t < tPlug + 0.2 && <TimeLapseHud at={tDays - 0.25} out={tPlug + 0.1} lapse={lapse} />}
      <Kinetic text="…and watched what the TV did *next.*" at={tWatch + 0.2} out={C1(1) - 0.05} y={960} size={60} anim="rise" />

      {/* --- cue 2: not one brand */}
      {t > tBrand - 0.1 && t < tPrivate - 0.2 && <ManyTVs at={tBrand} out={tPrivate - 0.4} />}
      <Kinetic text="Not one *brand.*" at={tBrand + 0.3} out={tPrivate - 0.5} y={540} size={150} weight={900} anim="zoom" upper />
      <Kinetic text="The most *private* room | of our homes" at={tPrivate} out={C1(2) - 0.05} y={950} size={58} anim="rise" />
      <Wipe at={tBrand} colors={[C.red, '#0b1224']} />

      {/* --- cue 3: five settings */}
      {t > tFive - 0.2 && t < tTitle && <FiveSettings at={tFive} tSwitch={tSwitch} tLast={tLast} out={tTitle - 0.5} />}
      <Wipe at={tFive} colors={[C.cyan, '#0b1224']} />

      {/* --- title sting */}
      {t > tTitle - 0.6 && t < tEnd + 0.4 && <Title at={tTitle} out={tEnd} />}
      <Grade amount={0.06} />
    </AbsoluteFill>
  );
};

// time-lapse overlay: streaking "DAYS LATER" + date counter, the room itself does the day/night cycle
const TimeLapseHud: React.FC<{ at: number; out: number; lapse: number }> = ({ at, out, lapse }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = Math.min(ramp(t, at, 0.3), 1 - ramp(t, out - 0.25, 0.25));
  // same clock as the room: calendar = 7 + lapse*2.2 (flip at .5), hours from the day/night phase
  const cal = 7 + Math.min(2, lapse * 2.2);
  const day = Math.floor(cal) + (cal % 1 > 0.5 ? 1 : 0);
  const hours = Math.floor(((lapse * 2) % 1) * 24);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {/* speed streaks */}
      {Array.from({ length: 14 }, (_, i) => {
        const y = 80 + i * 70, w = 300 + ((i * 137) % 500), x = ((t * (1800 + i * 90) + i * 300) % 2600) - 600;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: 2, background: 'linear-gradient(90deg, transparent, rgba(160,200,255,.35), transparent)' }} />;
      })}
      <div style={{ position: 'absolute', left: 960, top: 470, transform: `translate(-50%,-50%) scale(${0.96 + 0.04 * Math.sin(t * 8)})`, textAlign: 'center' }}>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 120, color: C.ink, letterSpacing: '0.02em', textShadow: `0 0 50px rgba(0,0,0,.8), -6px 0 0 ${C.cyan}66, 6px 0 0 ${C.red}66` }}>DAYS LATER</div>
        <div style={{ marginTop: 8, display: 'inline-flex', gap: 22, alignItems: 'center', padding: '12px 28px', borderRadius: 999, background: 'rgba(5,9,20,.7)', border: `2px solid ${C.cyan}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: C.cyan }}>
          <Icon name="ph:clock-countdown-bold" size={36} color={C.cyan} />
          SEPT {String(day).padStart(2, '0')} · {String(hours).padStart(2, '0')}:00
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ManyTVs: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const a = 1 - ramp(t, out, 0.35, EASE.in);
  const r = rng(11);
  const items = [];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 5; col++) {
    const i = row * 5 + col;
    const w = 250 + r() * 70;
    const s = springAt(f, fps, at + 0.05 + i * 0.045, { damping: 14, stiffness: 150 });
    const lit = t > at + 0.9 + ((i * 7) % 15) * 0.09;
    items.push(<div key={i} style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${100 + col * 360 + (350 - w) / 2}px, ${120 + row * 290 + (1 - s) * 120 + Math.sin(t * 1.2 + i) * 3}px)`, opacity: clamp(s * 1.4) * a }}>
      <div style={{ position: 'relative', width: w, height: w * 0.62 }}><TV x={0} y={0} w={w} led={lit ? 1.1 + 0.4 * Math.sin(t * 4 + i) : 0} stand={i % 3 !== 1} bias={0.9} screenOn={0.25} screen={<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1b2a52,#0a1022)' }} />} /></div>
    </div>);
  }
  return (
    <AbsoluteFill>
      <BgMesh a="#5b2bff" b={C.red} />
      <Grid opacity={0.22} />
      {items}
      <Dust count={40} color="#ff8fa0" opacity={0.25} />
    </AbsoluteFill>
  );
};

const FiveSettings: React.FC<{ at: number; tSwitch: number; tLast: number; out: number }> = ({ at, tSwitch, tLast, out }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const g = glitchOffset(t, tLast + 0.8, 0.6, 22);
  const icons = ['ph:power-bold', 'ph:microphone-bold', 'ph:eye-bold', 'ph:wifi-high-bold', 'ph:question-bold'];
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.cyan} />
      <Grid opacity={0.28} />
      <Dust count={50} opacity={0.35} />
      <Panel x={330} y={330} w={1260} h={440} at={at + 0.3} out={out} from="scale" accent={C.cyan} pad={0}>
        <div style={{ position: 'absolute', left: 60, top: 46, fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.24em', color: C.cyan }}>SMART TV · PRIVACY</div>
        {Array.from({ length: 5 }, (_, i) => {
          const last = i === 4;
          const s = springAt(f, fps, at + 0.6 + i * 0.12, { damping: 13, stiffness: 160 });
          const off = last ? 0 : ramp(t, tSwitch + i * 0.25, 0.3, EASE.back);
          return (
            <div key={i} style={{ position: 'absolute', left: 80 + i * 225, top: 120, transform: `translateY(${(1 - s) * 60}px) ${last ? `translateX(${g.x}px) skewX(${g.skew}deg)` : ''}`, opacity: clamp(s * 1.5), textAlign: 'center', width: 170 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}><Icon name={icons[i]} size={52} color={last ? C.red : off > 0.5 ? C.green : C.dim} /></div>
              <div style={{ display: 'flex', justifyContent: 'center' }}><Toggle on={1 - off} color={C.red} offColor={C.green} size={1.15} /></div>
              <div style={{ marginTop: 22, fontFamily: fonts.mono, fontWeight: 700, fontSize: 32, color: last ? C.red : C.dim }}>{last ? '#5 ?' : `#${i + 1}`}</div>
              {last && t > tLast && <div style={{ position: 'absolute', left: -20, top: -24, width: 210, height: 270, borderRadius: 30, border: `3px dashed ${C.red}`, opacity: 0.5 + 0.5 * Math.sin(t * 6), boxShadow: `0 0 30px ${C.red}55` }} />}
            </div>
          );
        })}
      </Panel>
      <Kinetic text="5 settings to switch off *tonight*" at={at + 0.2} out={out - 0.1} y={230} size={70} anim="rise" />
      <Label x={960} y={815} at={tLast} out={out} color={C.red} align="center" size={26}>the last one · almost nobody does it</Label>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const s = springAt(f, fps, at, { damping: 10, stiffness: 110 });
  const sweep = ramp(t, at + 0.5, 1.0, EASE.inOut);
  const g = glitchOffset(t, at + 0.05, 0.35, 26);
  return (
    <AbsoluteFill style={{ background: C.bg0 }}>
      <BgMesh a="#7a1030" b={C.red} />
      <Glow x={960} y={560} r={700} color="rgba(255,46,77,.22)" opacity={s} />
      <Rings x={960} y={560} at={at - 0.5} out={out} color={C.red} max={900} count={6} speed={0.45} />
      <Dust count={70} color="#ff9aa9" opacity={0.4} />
      <div style={{ position: 'absolute', left: 960, top: 560, width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: '50%', background: C.red, boxShadow: `0 0 30px ${C.red}, 0 0 90px ${C.red}`, opacity: 1 - ramp(t, at, 0.3) }} />
      <div style={{ position: 'absolute', left: 960, top: 545, transform: `translate(-50%,-50%) translateX(${g.x}px) skewX(${g.skew}deg) scale(${0.9 + 0.1 * s + 0.03 * ramp(t, at, out - at, EASE.smooth)})`, textAlign: 'center' }}>
        <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 64, color: C.ink, letterSpacing: '0.04em', opacity: clamp(s * 1.3), transform: `translateY(${(1 - s) * 30}px)` }}>IS YOUR SMART TV</div>
        <div style={{ position: 'relative', fontFamily: fonts.head, fontWeight: 900, fontSize: 210, lineHeight: 1, color: C.red, letterSpacing: '-0.02em', textShadow: `0 0 40px ${C.red}aa, 0 0 120px ${C.red}66`, opacity: clamp(s * 1.6), transform: `scale(${1.4 - 0.4 * s})` }}>
          LISTENING?
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${sweep * 120 - 30}%, rgba(255,255,255,.75) ${sweep * 120 - 15}%, transparent ${sweep * 120}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textShadow: 'none' }}>LISTENING?</div>
        </div>
      </div>
      <Flash at={at} color="#ff9aa9" max={0.5} d={0.5} />
    </AbsoluteFill>
  );
};
