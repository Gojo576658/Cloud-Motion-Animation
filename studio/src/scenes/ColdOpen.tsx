// 0:00 – title. Night living room, the microphone that never sleeps, the unplug test,
// "not one brand", the five-settings promise, and the title sting.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { LivingRoom, TVX, TVY, TVW } from '../components/LivingRoom';
import { TV, ledPos } from '../components/TV';
import { Kinetic, Label } from '../components/Kinetic';
import { Pill, Panel, Toggle, Brackets, Wipe, Flash, Rings, glitchOffset } from '../components/UI';
import { Gradient, Grid, Dust, Glow } from '../components/Backdrop';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, TL, EASE, ramp, track, springAt, rng, clamp } from '../lib/time';

const LED = ledPos(TVX, TVY, TVW);
const JACK = { x: 1523, y: 823 };

export const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  // ---- key moments (all from the real voiceover)
  const tWhy = P(0, 'So why'), tMic = P(0, 'microphone');
  const tSept = C0(1), tCut = P(1, 'cut off its internet'), tTalk = P(1, 'talked around it'), tDays = P(1, 'Days later'), tPlug = P(1, 'plugged the'), tWatch = P(1, 'watched what');
  const tBrand = C0(2), tPrivate = P(2, 'most private');
  const tFive = C0(3), tSwitch = P(3, 'switch off'), tLast = P(3, 'The last one');
  const tTitle = TL.titleAt, tEnd = TL.sections[1].start;

  // ---- states
  const plugged = t < tCut + 0.3 ? 1 : t < tPlug + 0.6 ? 1 - ramp(t, tCut + 0.3, 0.4, EASE.out) : ramp(t, tPlug + 0.6, 0.35, EASE.inOut);
  const pulse = 0.6 + 0.4 * Math.sin(t * 3.4);
  const flare = Math.max(ramp(t, tMic - 0.1, 0.4) * (1 - ramp(t, C1(0) + 0.2, 0.6)), 0);
  const led = pulse + flare * 1.6 + (t > tWatch ? 0.8 * ramp(t, tWatch, 0.5) : 0);

  // ---- camera (scene coordinates)
  const cam = [
    { t: 0, x: 960, y: 560, z: 1.0 },
    { t: tWhy, x: 960, y: 590, z: 1.1, e: EASE.smooth },
    { t: C1(0) + 0.1, x: LED.x, y: LED.y - 20, z: 3.4, e: EASE.inOut },
    { t: tSept + 1.2, x: 960, y: 560, z: 1.02, e: EASE.inOut },
    { t: tCut - 0.6, x: 1000, y: 560, z: 1.06, e: EASE.smooth },
    { t: tCut + 0.4, x: JACK.x - 40, y: JACK.y - 10, z: 2.6, e: EASE.inOut },
    { t: tTalk + 0.2, x: JACK.x - 40, y: JACK.y - 10, z: 2.65, e: EASE.smooth },
    { t: tTalk + 1.1, x: 900, y: 600, z: 1.08, e: EASE.inOut },
    { t: tPlug - 0.1, x: 920, y: 600, z: 1.1, e: EASE.smooth },
    { t: tPlug + 0.6, x: JACK.x - 40, y: JACK.y - 10, z: 2.6, e: EASE.inOut },
    { t: tWatch, x: JACK.x - 40, y: JACK.y - 10, z: 2.65, e: EASE.smooth },
    { t: tWatch + 1.0, x: 960, y: 470, z: 1.35, e: EASE.inOut },
    { t: C1(1), x: 960, y: 450, z: 1.5, e: EASE.smooth },
    { t: tBrand + 4, x: 960, y: 450, z: 1.5 },
    { t: tPrivate - 0.2, x: 960, y: 540, z: 0.96, e: EASE.inOut },
    { t: C1(2), x: 900, y: 560, z: 1.04, e: EASE.smooth },
  ];

  const roomVisible = t < tBrand + 0.05 || (t > tPrivate - 0.6 && t < tFive + 0.4);
  const days = t > tDays - 0.2 && t < tPlug + 0.2;
  const r = rng(5);

  return (
    <AbsoluteFill style={{ background: C.bg0 }}>
      {roomVisible && (
        <Camera keys={cam}>
          <LivingRoom led={led} plug={plugged} portLed={plugged > 0.9 ? 1 : 0} />
          {/* researchers talking: sound rings from the sofa */}
          <Layer depth={1}>
            <Rings x={560} y={760} at={tTalk - 0.1} out={tDays} color={C.cyan} max={520} count={4} speed={0.7} />
            <Rings x={LED.x} y={LED.y} at={tMic - 0.1} out={C1(0) + 0.3} color={C.red} max={260} count={4} speed={0.9} />
            {/* data teaser leaving the TV */}
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

      {/* --- cue 1: date card, lab HUD, offline / online, days later */}
      <Panel x={110} y={180} w={330} at={tSept + 0.5} out={tCut - 0.3} from="left" accent={C.red}>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.24em', color: C.red }}>LAB TEST</div>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 92, color: C.ink, lineHeight: 1.05, marginTop: 6 }}>SEPT<br /><span style={{ color: C.red }}>{String(Math.round(track(t, [[tSept + 0.6, 1], [tSept + 2.0, 7]], EASE.out))).padStart(2, '0')}</span></div>
        <div style={{ fontFamily: fonts.mono, fontSize: 30, color: C.dim, marginTop: 4 }}>2026</div>
      </Panel>
      {t > tSept + 1.2 && t < tCut - 0.3 && <Brackets x={TVX - 30} y={TVY - 30} w={TVW + 60} h={TVW * 0.575 + 60} at={tSept + 1.3} out={tCut - 0.5} color={C.cyan} label="LG OLED · STANDBY" />}
      <Pill x={1160} y={260} at={tCut + 0.5} out={tTalk + 0.9} color={C.red}>Offline</Pill>
      <Pill x={1160} y={260} at={tPlug + 0.8} out={tWatch + 0.9} color={C.green}>Online</Pill>
      {t > tCut + 0.4 && t < tCut + 1.0 && <Flash at={tCut + 0.45} color={C.red} max={0.25} d={0.4} />}
      <Kinetic text="…and simply *talked* around it." at={tTalk + 0.1} out={tDays - 0.2} y={960} size={56} anim="blur" accent={C.cyan} />
      {days && <DaysLater at={tDays - 0.2} out={tPlug + 0.2} />}
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
      {t > tTitle - 0.6 && t < tEnd + 0.2 && <Title at={tTitle} out={tEnd} />}
    </AbsoluteFill>
  );
};

const DaysLater: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = Math.min(ramp(t, at, 0.3), 1 - ramp(t, out - 0.3, 0.3));
  const spin = (t - at) * 1400;
  const day = 1 + Math.min(3, Math.floor((t - at) * 2.2));
  return (
    <AbsoluteFill style={{ background: `rgba(3,5,11,${0.82 * a})`, opacity: a }}>
      <div style={{ position: 'absolute', left: 960 - 170, top: 380 - 170, width: 340, height: 340, borderRadius: '50%', border: `6px solid ${C.cyan}`, boxShadow: `0 0 60px ${C.cyan}55, inset 0 0 40px ${C.cyan}33` }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 167, top: 14, width: 6, height: 26, background: C.cyan, transformOrigin: '3px 156px', transform: `rotate(${i * 30}deg)`, opacity: 0.7 }} />)}
        <div style={{ position: 'absolute', left: 166, top: 60, width: 8, height: 115, background: C.ink, borderRadius: 4, transformOrigin: '4px 110px', transform: `rotate(${spin}deg)` }} />
        <div style={{ position: 'absolute', left: 167, top: 95, width: 6, height: 80, background: C.red, borderRadius: 4, transformOrigin: '3px 75px', transform: `rotate(${spin / 12}deg)` }} />
      </div>
      <div style={{ position: 'absolute', left: 960, top: 640, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 96, color: C.ink, letterSpacing: '0.02em', textShadow: '0 0 40px rgba(0,0,0,.7)' }}>DAYS LATER…</div>
      <div style={{ position: 'absolute', left: 960, top: 770, transform: 'translateX(-50%)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: C.cyan }}>+{day} DAY{day > 1 ? 'S' : ''}</div>
    </AbsoluteFill>
  );
};

const ManyTVs: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const a = 1 - ramp(t, out, 0.4, EASE.in);
  const r = rng(11);
  const items = [];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 5; col++) {
    const i = row * 5 + col;
    const w = 250 + r() * 70;
    const s = springAt(f, fps, at + 0.05 + i * 0.045, { damping: 14, stiffness: 150 });
    const lit = t > at + 0.9 + ((i * 7) % 15) * 0.09;
    items.push(<div key={i} style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${100 + col * 360 + (350 - w) / 2}px, ${120 + row * 290 + (1 - s) * 120}px)`, opacity: clamp(s * 1.4) * a }}>
      <div style={{ position: 'relative', width: w, height: w * 0.62 }}><TV x={0} y={0} w={w} led={lit ? 1.1 + 0.4 * Math.sin(t * 4 + i) : 0} stand={i % 3 !== 1} bias={0.9} screenOn={0.25} screen={<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1b2a52,#0a1022)' }} />} /></div>
    </div>);
  }
  return (
    <AbsoluteFill>
      <Gradient hue="#1a1030" />
      <Grid opacity={0.25} />
      {items}
      <Dust count={40} color="#ff8fa0" opacity={0.25} />
    </AbsoluteFill>
  );
};

const FiveSettings: React.FC<{ at: number; tSwitch: number; tLast: number; out: number }> = ({ at, tSwitch, tLast, out }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const g = glitchOffset(t, tLast + 0.8, 0.6, 22);
  return (
    <AbsoluteFill>
      <Gradient hue="#0f2342" y={45} />
      <Grid opacity={0.3} />
      <Dust count={50} opacity={0.35} />
      <Panel x={330} y={330} w={1260} h={420} at={at + 0.3} out={out} from="scale" accent={C.cyan} pad={0}>
        <div style={{ position: 'absolute', left: 60, top: 50, fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.24em', color: C.cyan }}>SMART TV · PRIVACY</div>
        {Array.from({ length: 5 }, (_, i) => {
          const last = i === 4;
          const s = springAt(f, fps, at + 0.6 + i * 0.12, { damping: 13, stiffness: 160 });
          const off = last ? 0 : ramp(t, tSwitch + i * 0.25, 0.3, EASE.inOut);
          return (
            <div key={i} style={{ position: 'absolute', left: 80 + i * 225, top: 150, transform: `translateY(${(1 - s) * 60}px) ${last ? `translateX(${g.x}px) skewX(${g.skew}deg)` : ''}`, opacity: clamp(s * 1.5), textAlign: 'center', width: 170 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><Toggle on={1 - off} color={C.red} offColor={C.green} size={1.15} /></div>
              <div style={{ marginTop: 26, fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: last ? C.red : C.dim }}>{last ? '#5 ?' : `#${i + 1}`}</div>
              {last && t > tLast && <div style={{ position: 'absolute', left: -20, top: -30, width: 210, height: 180, borderRadius: 30, border: `3px dashed ${C.red}`, opacity: 0.5 + 0.5 * Math.sin(t * 6), boxShadow: `0 0 30px ${C.red}55` }} />}
            </div>
          );
        })}
      </Panel>
      <Kinetic text="5 settings to switch off *tonight*" at={at + 0.2} out={out - 0.1} y={230} size={70} anim="rise" />
      <Label x={960} y={800} at={tLast} out={out} color={C.red} align="center" size={26}>the last one · almost nobody does it</Label>
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
      <Gradient hue="#2a0b18" y={50} />
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
