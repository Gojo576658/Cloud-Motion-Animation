// S6 · LG's Response — researchers vs LG side by side, the word "OPTIONAL",
// what the statement didn't answer, "who's right?", "some of it is already proven".
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust } from '../components/Backdrop';
import { Chapter, useEnter } from '../components/Blocks';
import { Kinetic } from '../components/Kinetic';
import { Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, PE, S0, S1, EASE, ramp, springAt, clamp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(6), Z = S1(6);
const tDenied = P(30, 'strongly denied'), tCont = P(30, 'do not continuously'), tOnly = P(30, 'only processed'), tNoWake = P(30, 'If no wake'), tAlso = P(30, 'LG also says'), tOptional0 = P(30, 'optional');
const tCatch = C0(31), tOpt = P(31, 'Optional'), tNotOff = P(31, 'Not off'), tOpt2 = P(31, 'off. Optional', 0.3), tCritics = P(31, 'Critics'), tScan = P(31, 'network scanning'), tMuch = P(31, 'how much data'), tShared = P(31, "who it's shared");
const tWho = C0(32), tReg = P(32, 'until regulators'), tBut = P(32, 'But some'), tProven = P(32, 'already been proven');

export const s6NoCaptions: [number, number][] = [[tDenied - 0.2, tCont - 0.1], [tCatch - 0.1, tCritics - 0.1], [tWho - 0.1, tBut - 0.1], [tBut + 0.1, Z]];

const RES = ['Audio captured in standby', 'Stored offline, uploaded later', '38 devices scanned', 'Data sent to LG Ad Solutions'];
const LGS: [string, number, string][] = [['No continuous recording', tCont, 'ph:record-bold'], ['Voice only on button or "Hi LG"', tOnly, 'ph:microphone-bold'], ['No wake word → not stored or sent', tNoWake, 'ph:trash-bold'], ['ACR, voice & ads are optional', tAlso, 'ph:toggle-left-bold']];

export const s6Sfx: SfxEvent[] = [
  { t: A + 0.25, name: 'whooshDeep', vol: 0.4 },
  ...RES.map((_, i) => ({ t: A + 0.9 + i * 0.3, name: 'tap' as const, vol: 0.25 })),
  { t: tDenied - 0.1, name: 'swoosh', vol: 0.4, note: 'LG panel' },
  ...LGS.map(([, at]) => ({ t: at - 0.05, name: 'popUi' as const, vol: 0.3 })),
  { t: tOptional0 - 0.05, name: 'shimmer', vol: 0.35, note: 'optional highlights' },
  { t: tOpt - 0.1, name: 'impactBig', vol: 0.6, note: 'OPTIONAL fills the screen' },
  { t: tNotOff - 0.05, name: 'glassHit', vol: 0.45, note: '≠ OFF' },
  { t: tOpt2 - 0.05, name: 'bassHit', vol: 0.35 },
  { t: tCritics - 0.1, name: 'swoosh', vol: 0.35 },
  { t: tScan - 0.05, name: 'popElectric', vol: 0.3 }, { t: tMuch - 0.05, name: 'popElectric', vol: 0.3 }, { t: tShared - 0.05, name: 'popElectric', vol: 0.3 },
  { t: tWho - 0.1, name: 'impactZoom', vol: 0.4 },
  { t: tReg - 0.1, name: 'swooshSlow', vol: 0.35 }, { t: tReg + 0.6, name: 'hit', vol: 0.3, note: 'gavel' },
  { t: tBut - 0.1, name: 'riser', vol: 0.45, dur: 2.2 }, { t: tProven - 0.05, name: 'impactEpic', vol: 0.55, note: 'PROVEN' },
];

const Row: React.FC<{ text: string; at: number; color: string; icon: string; hi?: boolean }> = ({ text, at, color, icon, hi }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const u = ramp(t, at, 0.45, EASE.out);
  if (u <= 0) return null;
  return <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: u, transform: `translateX(${(1 - u) * 40}px)`, fontFamily: fonts.body, fontWeight: 600, fontSize: 34, color: C.ink, padding: hi ? '6px 12px' : undefined, margin: hi ? '-6px -12px' : undefined, borderRadius: 10, background: hi ? `${C.amber}22` : undefined }}><Icon name={icon} size={36} color={color} />{text}</div>;
};

export const S6Response: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const panels = useEnter(A + 0.2, tOpt - 0.25, { rise: 60 });
  const lgPanel = useEnter(tDenied - 0.1, tOpt - 0.25, { rise: 60 });
  const optS = springAt(f, fps, tOpt - 0.1, { damping: 12, stiffness: 120 });
  const optUp = ramp(t, tNotOff - 0.15, 0.45, EASE.inOut);
  const optOut = ramp(t, tCritics - 0.25, 0.3, EASE.in);
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.amber} />
      <Grid opacity={0.15} perspective={false} />
      {/* split screen */}
      {panels.visible && (
        <div style={{ position: 'absolute', left: 110, top: 220, width: 820, padding: '34px 40px', borderRadius: 28, background: 'linear-gradient(160deg, rgba(40,10,18,.9), rgba(12,6,10,.92))', border: `1px solid ${C.red}55`, ...panels.style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: '0.2em', color: C.red }}><Icon name="ph:magnifying-glass-bold" size={32} color={C.red} />RESEARCHERS SAY</div>
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 26 }}>{RES.map((r, i) => <Row key={r} text={r} at={A + 0.9 + i * 0.3} color={C.red} icon="ph:warning-circle-bold" />)}</div>
        </div>
      )}
      {lgPanel.visible && (
        <div style={{ position: 'absolute', left: 990, top: 220, width: 820, padding: '34px 40px', borderRadius: 28, background: 'linear-gradient(160deg, rgba(10,30,44,.9), rgba(6,12,20,.92))', border: `1px solid ${C.cyan}55`, ...lgPanel.style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: '0.2em', color: C.cyan }}><Icon name="ph:megaphone-bold" size={32} color={C.cyan} />LG SAYS</div>
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 26 }}>{LGS.map(([r, at, ic], i) => <Row key={r} text={r} at={at} color={C.cyan} icon={ic} hi={i === 3 && t > tOptional0} />)}</div>
        </div>
      )}
      <Kinetic text="LG strongly *denied* the claims" at={tDenied - 0.1} out={tCont - 0.2} y={890} size={52} anim="blur" accent={C.cyan} />
      {/* OPTIONAL */}
      {t > tOpt - 0.15 && t < tCritics + 0.1 && (
        <AbsoluteFill style={{ background: `rgba(3,5,11,${0.8 * clamp(optS)})`, opacity: 1 - optOut }}>
          <div style={{ position: 'absolute', left: 960, top: 520 - optUp * 160, transform: `translate(-50%,-50%) scale(${(0.2 + 0.8 * optS) * (1 - optUp * 0.4)})`, fontFamily: fonts.head, fontWeight: 900, fontSize: 280, color: C.amber, letterSpacing: '-0.02em', textShadow: `0 0 60px ${C.amber}66`, whiteSpace: 'nowrap' }}>OPTIONAL</div>
          {t > tNotOff - 0.1 && <div style={{ position: 'absolute', left: 960, top: 640, transform: `translate(-50%,-50%) scale(${3 - 2 * ramp(t, tNotOff - 0.1, 0.22, EASE.in)})`, opacity: ramp(t, tNotOff - 0.1, 0.22), fontFamily: fonts.head, fontWeight: 900, fontSize: 170, color: C.ink }}>≠ <span style={{ color: C.red, textShadow: `0 0 40px ${C.red}88` }}>OFF</span></div>}
          <Flash at={tOpt - 0.05} color={C.amber} max={0.2} d={0.4} />
        </AbsoluteFill>
      )}
      {/* unanswered questions */}
      {t > tCritics - 0.2 && t < C1(31) + 0.4 && (
        <AbsoluteFill style={{ opacity: 1 - ramp(t, C1(31), 0.3) }}>
          <div style={{ position: 'absolute', left: 960, top: 300, transform: 'translateX(-50%)', fontFamily: fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: C.dim, opacity: ramp(t, tCritics, 0.4) }}>NOT ANSWERED BY LG'S STATEMENT</div>
          {[['Network scanning?', tScan, 'ph:broadcast-bold'], ['How much data?', tMuch, 'ph:database-bold'], ['Shared with whom?', tShared, 'ph:share-network-bold']].map(([q, at, ic], i) => {
            const s = springAt(f, fps, at as number, { damping: 12, stiffness: 160 });
            return <div key={q as string} style={{ position: 'absolute', left: 120 + i * 580, top: 440, width: 540, padding: '34px 30px', borderRadius: 26, background: 'rgba(12,18,34,.92)', border: `1px solid ${C.red}55`, transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + 0.1 * s})`, opacity: clamp(s * 1.4), display: 'flex', alignItems: 'center', gap: 22 }}><Icon name={ic as string} size={56} color={C.red} /><div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 40, color: C.ink }}>{q as string}</div></div>;
          })}
        </AbsoluteFill>
      )}
      {/* who's right? */}
      {t > tWho - 0.2 && (
        <AbsoluteFill style={{ opacity: ramp(t, tWho - 0.2, 0.3) }}>
          <Footage src="stock/gavel.mp4" at={tReg - 0.2} out={tBut + 0.1} zoom={[1.05, 1.15]} enter="fade" desat={0.4} />
          {t > tReg && <AbsoluteFill style={{ background: 'rgba(3,5,11,.45)' }} />}
          <div style={{ position: 'absolute', left: 960, top: 360, transform: 'translateX(-50%)', opacity: ramp(t, tWho, 0.3) * (1 - ramp(t, tReg - 0.3, 0.3)) }}><Icon name="ph:scales-bold" size={170} color={C.ink} style={{ transform: `rotate(${Math.sin(t * 2.2) * 8}deg)` }} /></div>
          <Kinetic text="Who's *right?*" at={tWho} out={tReg - 0.2} y={640} size={130} weight={900} anim="zoom" />
          <Kinetic text="Until regulators test these TVs independently…" at={tReg} out={tBut - 0.1} y={880} size={46} anim="blur" />
          <Kinetic text="Some of it is already *proven.*" at={tBut + 0.2} out={Z + 0.3} y={520} size={100} weight={900} anim="slam" stagger={0.1} />
        </AbsoluteFill>
      )}
      <Dust count={30} opacity={0.3} />
      <Chapter n={6} title="LG's Response" at={A + 0.3} out={Z - 0.6} color={C.amber} />
      <Grade />
    </AbsoluteFill>
  );
};
