// S5 · The Hacking Part — remote code execution, the mic switched on in standby,
// "every hacker who finds the same bug", responsible disclosure, and the government teaser.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust, Glow } from '../components/Backdrop';
import { Chapter, useEnter } from '../components/Blocks';
import { Kinetic } from '../components/Kinetic';
import { Pill, Rings, Flash, glitchOffset } from '../components/UI';
import { TV, ledPos } from '../components/TV';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, PE, S0, S1, EASE, ramp, clamp, lerp, rng, springAt } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(5), Z = S1(5);
const tRCE = P(25, 'discovered remote-code-execution'), tSimple = P(25, 'In simple words'), tAttacker = P(25, 'let an attacker'), tTouch = P(25, 'without ever touching');
const tPoc = C0(26), tSwitch = P(26, 'switch on'), tStandby = P(26, 'in standby');
const tTrust = C0(27), tEvery = P(27, 'every hacker'), tSame = P(27, 'same bug');
const tReported = C0(28), tPrivately = P(28, 'privately');
const tGov = P(29, 'government'), tAlready = P(29, 'already happened'), tYears = P(29, 'Years ago'), tShow = P(29, "I'll show you");

const TVP = { x: 1060, y: 250, w: 760 };
const LED = ledPos(TVP.x, TVP.y, TVP.w);

export const s5NoCaptions: [number, number][] = [[tRCE - 0.1, tSimple - 0.1], [tEvery - 0.2, C1(27) + 0.2], [tAlready - 0.1, PE(29, 'ago') + 0.2]];

export const s5Sfx: SfxEvent[] = [
  { t: A + 0.2, name: 'hum', vol: 0.25, dur: 6 },
  { t: tRCE - 0.1, name: 'glitchBreak', vol: 0.55, note: 'RCE title' },
  { t: tSimple - 0.1, name: 'techSlide', vol: 0.35 },
  { t: tAttacker - 0.05, name: 'sweepSciFi', vol: 0.4, note: 'code travels to the TV' }, { t: tAttacker + 0.6, name: 'glitchStatic', vol: 0.35 },
  { t: tTouch - 0.05, name: 'tap', vol: 0.3 },
  { t: tPoc - 0.1, name: 'popUi', vol: 0.35, note: 'proof of concept' },
  { t: tSwitch - 0.08, name: 'switchLight', vol: 0.55, note: 'mic switches ON' }, { t: tSwitch + 0.05, name: 'bassHitFx', vol: 0.45 },
  { t: tStandby - 0.05, name: 'heartbeat', vol: 0.4 },
  { t: tTrust - 0.1, name: 'confirm', vol: 0.3 },
  { t: tEvery - 0.1, name: 'impactZoom', vol: 0.45 },
  ...Array.from({ length: 10 }, (_, k) => ({ t: tEvery + 0.1 + k * 0.12, name: 'glitchElectric' as const, vol: 0.12 })),
  { t: tReported - 0.15, name: 'paperSlide', vol: 0.4 }, { t: tPrivately - 0.05, name: 'lock', vol: 0.45, note: 'disclosed privately' },
  { t: tGov - 0.1, name: 'drone', vol: 0.3, dur: 3 },
  { t: tAlready - 0.05, name: 'stomp', vol: 0.6, note: 'IT ALREADY HAPPENED' },
  { t: tYears - 0.05, name: 'rewind', vol: 0.4 },
];

// red code rain (deterministic)
const CodeRain: React.FC<{ a: number }> = ({ a }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  if (a <= 0) return null;
  const r = rng(42);
  const cols = Array.from({ length: 48 }, () => ({ sp: 140 + r() * 260, off: r() * 1200 }));
  return (
    <AbsoluteFill style={{ opacity: a, fontFamily: fonts.mono, fontWeight: 700, fontSize: 24 }}>
      {cols.map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: i * 40 + 6, top: 0 }}>
          {Array.from({ length: 14 }, (_, k) => {
            const y = ((t * c.sp + c.off + k * 30) % 1300) - 120;
            return <div key={k} style={{ position: 'absolute', top: y, color: `rgba(255,46,77,${(k / 14) * 0.8})` }}>{String.fromCharCode(33 + ((i * 13 + k * 7 + Math.floor(t * 10)) % 90))}</div>;
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const S5Hack: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const g = glitchOffset(t, tRCE, 0.6, 24);
  const micOn = t > tSwitch;
  const rain = Math.min(ramp(t, A, 0.6), 1 - ramp(t, tReported - 0.3, 0.6)) * 0.55;
  const hacked = ramp(t, tAttacker + 0.5, 0.4);
  const cam = [
    { t: A - 0.2, x: 960, y: 540, z: 1.0 }, { t: tSimple, x: 960, y: 540, z: 1.03, e: EASE.smooth },
    { t: tPoc - 0.2, x: 1000, y: 540, z: 1.0, e: EASE.inOut }, { t: tSwitch - 0.1, x: LED.x, y: LED.y - 120, z: 1.25, e: EASE.inOut },
    { t: C1(26), x: LED.x, y: LED.y - 140, z: 1.32, e: EASE.smooth }, { t: tTrust + 0.3, x: 960, y: 540, z: 0.95, e: EASE.inOut },
    { t: C1(27), x: 960, y: 540, z: 1.0, e: EASE.smooth },
  ];
  return (
    <AbsoluteFill>
      <BgMesh a="#5a0d1f" b={C.red} />
      {/* real footage of an attacker, behind everything */}
      <Footage src="stock/hacker.mp4" at={A - 0.3} out={tSimple + 0.2} zoom={[1.06, 1.16]} enter="fade" desat={0.4} tint="#3a0010" />
      <CodeRain a={rain} />
      {/* RCE title */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${g.x}px) skewX(${g.skew}deg)` }}>
        <Kinetic text="Remote code *execution*" at={tRCE - 0.05} out={tSimple - 0.15} y={520} size={124} weight={900} anim="glitch" upper />
      </div>
      {/* attacker -> TV diagram, then the mic */}
      {t > tSimple - 0.2 && t < C1(27) + 0.3 && (
        <AbsoluteFill style={{ opacity: ramp(t, tSimple - 0.2, 0.35) * (1 - ramp(t, C1(27), 0.3)) }}>
          <Camera keys={cam}>
            <Layer depth={0.6}><Grid opacity={0.2} color="rgba(255,46,77,0.18)" /></Layer>
            <Layer depth={1}>
              <Attacker t={t} />
              <TV x={TVP.x} y={TVP.y} w={TVP.w} led={micOn ? 1.6 + 0.4 * Math.sin(t * 6) : 0.4} bias={0.6} screenOn={hacked * 0.9} screen={<HackScreen />} />
              {micOn && <Rings x={LED.x} y={LED.y} at={tSwitch} out={C1(26) + 0.4} color={C.red} max={420} count={4} speed={0.8} />}
              <MicHud on={micOn} at={tPoc + 0.1} out={C1(26) + 0.2} />
            </Layer>
          </Camera>
          <Pill x={120} y={150} at={tPoc - 0.1} out={C1(26)} color={C.amber}><Icon name="ph:flask-bold" size={30} color={C.ink} />Proof-of-concept demo</Pill>
          {t > tTouch - 0.1 && t < tPoc && <div style={{ position: 'absolute', left: 960, top: 880, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 18, opacity: ramp(t, tTouch - 0.1, 0.3) }}><Icon name="ph:hand-bold" size={60} color={C.ink} /><Icon name="ph:prohibit-bold" size={60} color={C.red} /><span style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 44, color: C.ink }}>without touching it</span></div>}
        </AbsoluteFill>
      )}
      {/* every hacker who finds the bug */}
      {t > tEvery - 0.3 && t < C1(27) + 0.4 && <Swarm at={tEvery} out={C1(27)} />}
      <Kinetic text="Do you trust *every hacker* | who finds the same bug?" at={tEvery - 0.1} out={C1(27)} y={520} size={84} weight={900} anim="pop" stagger={0.05} />
      {/* responsible disclosure */}
      {t > tReported - 0.3 && t < C1(28) + 0.4 && <Disclosure />}
      {/* government teaser */}
      {t > C0(29) - 0.3 && (
        <AbsoluteFill style={{ opacity: ramp(t, C0(29) - 0.3, 0.3) }}>
          <BgMesh a="#1a1a1a" b={C.red} base="#050608" />
          <Grid opacity={0.12} perspective={false} />
          <Kinetic text="A government? *Never…*" at={tGov - 0.2} out={tAlready - 0.15} y={500} size={90} anim="blur" />
          {t > tAlready - 0.1 && <ClassifiedSlam at={tAlready} />}
          <Kinetic text="Years ago." at={tYears} out={Z} y={760} size={54} color={C.dim} anim="type" />
          <Kinetic text="I'll show you in a moment" at={tShow} out={Z} y={860} size={34} color={C.dim} anim="blur" />
        </AbsoluteFill>
      )}
      <Dust count={30} color="#ff9aa9" opacity={0.25} />
      <Chapter n={5} title="The Hacking Part" at={A + 0.3} out={Z - 0.6} color={C.red} />
      <Grade tint="#4a0a18" amount={0.1} />
    </AbsoluteFill>
  );
};

const Attacker: React.FC<{ t: number }> = ({ t }) => {
  const e = useEnter(tSimple, C1(26) + 0.3, { rise: 40 });
  if (!e.visible) return null;
  const flow = ramp(t, tAttacker - 0.1, 0.8, EASE.inOut);
  return (
    <>
      <div style={{ position: 'absolute', left: 130, top: 360, width: 320, height: 300, borderRadius: 30, background: 'rgba(30,6,12,.9)', border: `2px solid ${C.red}88`, boxShadow: `0 0 50px ${C.red}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, ...e.style }}>
        <Icon name="ph:laptop-bold" size={120} color={C.red} />
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: C.red }}>&gt;_ attacker</div>
      </div>
      {/* code packets travel to the TV */}
      {flow > 0 && Array.from({ length: 16 }, (_, i) => {
        const u = ((t - tAttacker) * 0.9 + i / 16) % 1;
        const x = lerp(470, 1060, u), y = 510 - Math.sin(u * Math.PI) * 120;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: C.red, opacity: flow * Math.sin(u * Math.PI), textShadow: `0 0 12px ${C.red}` }}>{['{', '}', '0x', '</', ';', '$'][i % 6]}</div>;
      })}
    </>
  );
};

const HackScreen: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ background: '#12030a', fontFamily: fonts.mono, fontSize: 16, color: C.red, padding: 20, overflow: 'hidden' }}>
      {Array.from({ length: 16 }, (_, k) => <div key={k} style={{ opacity: 0.3 + 0.7 * ((k + Math.floor(t * 6)) % 3 ? 1 : 0.3) }}>{`> exec payload_${(k * 37 + Math.floor(t * 4)) % 999} ... ok`}</div>)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '42%', textAlign: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 52, color: C.red, opacity: Math.floor(t * 3) % 2 ? 1 : 0.4, textShadow: `0 0 20px ${C.red}` }}>ACCESS GRANTED</div>
    </AbsoluteFill>
  );
};

const MicHud: React.FC<{ on: boolean; at: number; out: number }> = ({ on, at, out }) => {
  const e = useEnter(at, out, { rise: 40 });
  if (!e.visible) return null;
  return (
    <div style={{ position: 'absolute', left: 140, top: 700, width: 460, padding: '24px 30px', borderRadius: 22, background: 'rgba(8,12,24,.94)', border: `2px solid ${on ? C.red : 'rgba(140,170,230,.2)'}`, boxShadow: on ? `0 0 40px ${C.red}44` : undefined, ...e.style }}>
      <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 18, letterSpacing: '0.2em', color: C.dim }}>BUILT-IN MICROPHONE</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
        <Icon name={on ? 'ph:microphone-bold' : 'ph:microphone-slash-bold'} size={52} color={on ? C.red : C.dim} glow={on} />
        <span style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 58, color: on ? C.red : C.ink }}>{on ? 'ON' : 'OFF'}</span>
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 20, color: C.dim, marginTop: 6 }}>TV state: <span style={{ color: C.ink }}>STANDBY</span></div>
    </div>
  );
};

const Swarm: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const r = rng(5);
  const items = Array.from({ length: 30 }, (_, i) => ({ x: 80 + r() * 1700, y: 100 + r() * 860, d: r() * 1.2 }));
  return (
    <AbsoluteFill style={{ background: `rgba(10,2,5,${0.75 * ramp(t, at - 0.3, 0.3)})`, opacity: 1 - ramp(t, out, 0.3) }}>
      {items.filter((p) => Math.abs(p.y - 520) > 150).map((p, i) => {
        const s = springAt(f, fps, at + p.d, { damping: 10, stiffness: 200 });
        return <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, transform: `scale(${s})`, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, border: `1px solid ${C.red}88`, background: 'rgba(40,0,10,.75)', fontFamily: fonts.mono, fontSize: 20, color: C.red }}><Icon name="ph:skull-bold" size={22} color={C.red} />attacker</div>;
      })}
    </AbsoluteFill>
  );
};

const Disclosure: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const e = useEnter(tReported - 0.1, C1(28) + 0.1, { rise: 60, scale: 0.1 });
  if (!e.visible) return null;
  const lock = ramp(t, tPrivately - 0.1, 0.4, EASE.back);
  return (
    <AbsoluteFill style={{ background: `rgba(3,5,11,${0.85 * (e.style.opacity as number)})` }}>
      <div style={{ position: 'absolute', left: 960, top: 500, transform: 'translate(-50%,-50%)' }}><div style={{ ...e.style, display: 'flex', alignItems: 'center', gap: 40, padding: '44px 60px', borderRadius: 30, background: 'linear-gradient(160deg, rgba(14,40,50,.95), rgba(6,14,22,.95))', border: `2px solid ${C.cyan}66` }}>
        <div style={{ position: 'relative' }}><Icon name="ph:envelope-simple-bold" size={130} color={C.cyan} /><div style={{ position: 'absolute', right: -20, bottom: -10, transform: `scale(${lock})` }}><Icon name="ph:lock-key-fill" size={64} color={C.green} glow /></div></div>
        <div>
          <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 58, color: C.ink }}>Reported to LG privately</div>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 26, letterSpacing: '0.16em', color: C.cyan, marginTop: 8 }}>RESPONSIBLE DISCLOSURE · DETAILS WITHHELD</div>
        </div>
      </div></div>
    </AbsoluteFill>
  );
};

const ClassifiedSlam: React.FC<{ at: number }> = ({ at }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const s = ramp(t, at - 0.05, 0.22, EASE.in);
  return (
    <>
      <div style={{ position: 'absolute', left: 960, top: 520, transform: `translate(-50%,-50%) scale(${3 - 2 * s})`, opacity: s, fontFamily: fonts.head, fontWeight: 900, fontSize: 130, color: C.ink, whiteSpace: 'nowrap', textShadow: '0 10px 40px rgba(0,0,0,.8)' }}>IT ALREADY <span style={{ color: C.red, textShadow: `0 0 40px ${C.red}88` }}>HAPPENED.</span></div>
      <div style={{ position: 'absolute', left: 1300, top: 280, transform: `rotate(12deg) scale(${2.4 - 1.4 * ramp(t, at + 0.3, 0.2, EASE.in)})`, opacity: ramp(t, at + 0.3, 0.2), padding: '10px 26px', border: `6px solid ${C.red}`, borderRadius: 10, fontFamily: fonts.head, fontWeight: 900, fontSize: 54, color: C.red, letterSpacing: '0.06em' }}>CLASSIFIED</div>
      <Flash at={at} color="#ffffff" max={0.25} d={0.3} />
    </>
  );
};
