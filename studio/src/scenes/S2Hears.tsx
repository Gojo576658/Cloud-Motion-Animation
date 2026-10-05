// S2 · How a TV Hears You — remote mic + built-in far-field mic, the "Hi LG" wake word,
// the ring buffer ("loop of tape"), match / no match, and Always Ready standby.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust, Glow } from '../components/Backdrop';
import { Callout, Chapter, useEnter } from '../components/Blocks';
import { Kinetic, Label } from '../components/Kinetic';
import { Pill, Panel, Rings, glitchOffset } from '../components/UI';
import { TV, ledPos } from '../components/TV';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, PE, S0, S1, EASE, ramp, clamp, lerp, springAt } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(2), Z = S1(2);
const tRemote = P(8, 'in the remote'), tBuilt = P(8, 'built right into'), tFar = P(8, 'far-field'), tSpeaker = P(8, 'same idea'), tWake = P(8, 'It listens'), tHi = P(8, 'Hi LG');
const tChip = P(9, 'low-power chip'), tBuffer = P(9, 'short memory buffer'), tLoop = P(9, 'like a loop'), tCompare = P(9, 'It compares');
const tNo = P(9, 'No match'), tThrown = P(9, 'thrown away'), tMatch = P(9, 'Match? The TV') , tSends = P(9, 'sends your command');
const tRemember = C0(10), tQuestion = P(10, 'The question'), tWhat = P(10, "It's what");
const tAlways = P(11, 'Always Ready'), tLooks = P(11, 'looks off'), tLow = P(11, 'low-power mode');
const tHonest = P(12, 'least honest');

const BIG = { x: 360, y: 160, w: 1200 };            // big TV for the mic callouts
const BIG_LED = ledPos(BIG.x, BIG.y, BIG.w);

export const s2NoCaptions: [number, number][] = [[tHi - 0.2, C1(8) + 0.3], [tRemember, C1(10) + 0.2], [tHonest - 0.6, Z]];

export const s2Sfx: SfxEvent[] = [
  { t: tRemote - 0.1, name: 'whooshQuick', vol: 0.35 }, { t: tRemote + 0.2, name: 'popUi', vol: 0.35, note: 'remote mic callout' },
  { t: tBuilt - 0.25, name: 'whooshDeep', vol: 0.4, note: 'cut to the TV' }, { t: tBuilt + 0.25, name: 'popUi', vol: 0.35 },
  { t: tFar - 0.05, name: 'sweepSciFi', vol: 0.3, note: 'far-field rings' },
  { t: tSpeaker - 0.15, name: 'swoosh', vol: 0.4, note: 'speaker PiP' },
  { t: tWake - 0.1, name: 'scan', vol: 0.3, note: 'listening wave' }, { t: C0(11) + 0.1, name: 'snap', vol: 0.45, note: 'puzzle piece' },
  { t: tHi - 0.1, name: 'impactZoom', vol: 0.45, note: 'HI LG bubble' }, { t: tHi + 0.05, name: 'chime', vol: 0.3 },
  { t: C0(9) - 0.1, name: 'vacuum', vol: 0.45, note: 'into the chip' },
  { t: tChip - 0.05, name: 'machine', vol: 0.35 },
  { t: tBuffer - 0.05, name: 'techMove', vol: 0.35, note: 'ring buffer appears' },
  { t: tLoop, name: 'reverseWhoosh', vol: 0.25, dur: 2.5 },
  { t: tCompare - 0.05, name: 'scan', vol: 0.35 },
  { t: tNo - 0.05, name: 'error', vol: 0.4 },
  { t: tThrown - 0.05, name: 'whooshQuick', vol: 0.35, note: 'audio into the bin' },
  { t: tMatch - 0.05, name: 'success', vol: 0.4 }, { t: tSends - 0.05, name: 'whooshElectric', vol: 0.35, note: 'command to the cloud' },
  { t: tRemember - 0.1, name: 'zoomIn', vol: 0.45, note: 'push into the loop' },
  { t: tQuestion - 0.05, name: 'tap', vol: 0.3 }, { t: tWhat - 0.05, name: 'bassHit', vol: 0.35 },
  { t: C0(11) - 0.2, name: 'whoosh', vol: 0.4 }, { t: tAlways - 0.05, name: 'switchLight', vol: 0.45, note: 'Always Ready chip' },
  { t: tLooks - 0.05, name: 'powerUpStatic', vol: 0.3, note: 'power meter' },
  { t: tHonest - 0.6, name: 'zoomIn', vol: 0.35 }, { t: tHonest - 0.05, name: 'glitchStatic', vol: 0.45 },
];

// ---- the chip diagram: mic -> DSP -> ring buffer -> wake-word check -> bin / cloud
const RING = { x: 1010, y: 560, r: 190 };
const RingBuffer: React.FC<{ t: number }> = ({ t }) => {
  const N = 48;
  const head = (t * 1.3) % (Math.PI * 2);
  const appear = ramp(t, tBuffer - 0.1, 0.8, EASE.out);
  return (
    <svg style={{ position: 'absolute', left: RING.x - 260, top: RING.y - 260, width: 520, height: 520, overflow: 'visible' }} viewBox="-260 -260 520 520">
      <circle r={RING.r + 34} fill="none" stroke="rgba(51,225,255,.12)" strokeWidth="2" strokeDasharray="4 10" transform={`rotate(${-t * 12})`} />
      {Array.from({ length: N }, (_, i) => {
        const a0 = (i / N) * Math.PI * 2, a1 = ((i + 0.78) / N) * Math.PI * 2;
        let age = (head - a0) / (Math.PI * 2); if (age < 0) age += 1;
        const on = i / N <= appear;
        const lum = on ? 0.14 + 0.86 * Math.pow(1 - age, 3) : 0;
        const fresh = age < 0.04;
        const r0 = RING.r - 22, r1 = RING.r + 22 + (1 - age) * 10;
        const p = (a: number, r: number) => `${Math.cos(a - Math.PI / 2) * r} ${Math.sin(a - Math.PI / 2) * r}`;
        return <path key={i} d={`M ${p(a0, r0)} L ${p(a0, r1)} A ${r1} ${r1} 0 0 1 ${p(a1, r1)} L ${p(a1, r0)} A ${r0} ${r0} 0 0 0 ${p(a0, r0)} Z`} fill={fresh ? C.red : C.cyan} opacity={lum} />;
      })}
      {/* write head */}
      <g transform={`rotate(${(head * 180) / Math.PI})`} opacity={appear}>
        <path d={`M 0 ${-RING.r - 40} l -12 -22 h 24 z`} fill={C.red} />
        <line x1="0" y1={-RING.r + 30} x2="0" y2={-RING.r - 36} stroke={C.red} strokeWidth="3" />
      </g>
      <text x="0" y="-8" textAnchor="middle" fill={C.ink} style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 30 }} opacity={appear}>LAST FEW</text>
      <text x="0" y="28" textAnchor="middle" fill={C.cyan} style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 30 }} opacity={appear}>SECONDS</text>
    </svg>
  );
};

const Wave: React.FC<{ x: number; y: number; w: number; t: number; color?: string; amp?: number; on?: number }> = ({ x, y, w, t, color = C.red, amp = 30, on = 1 }) => {
  const pts = Array.from({ length: 90 }, (_, i) => { const u = i / 89; return `${x + u * w},${y + Math.sin(u * 40 - t * 12) * amp * Math.sin(u * Math.PI) * (0.6 + 0.4 * Math.sin(t * 2 + u * 5))}`; }).join(' ');
  return <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible' }}><polyline points={pts} fill="none" stroke={color} strokeWidth="4" opacity={on} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${color})` }} /></svg>;
};

const ChipDiagram: React.FC = () => {
  const f = useCurrentFrame(); const t = f / useVideoConfig().fps;
  const mic = useEnter(C0(9) + 0.1, C1(10) + 0.4, { rise: 40 });
  const chip = useEnter(tChip - 0.1, C1(10) + 0.4, { rise: 40 });
  const cmp = useEnter(tCompare - 0.1, tRemember, { rise: 40 });
  const bin = useEnter(tNo - 0.1, tMatch - 0.35, { rise: 30 });
  const cloud = useEnter(tMatch, tRemember, { rise: 30 });
  const noU = ramp(t, tThrown - 0.2, 0.9, EASE.in);
  const okU = ramp(t, tSends - 0.1, 0.9, EASE.inOut);
  return (
    <>
      {/* mic */}
      {mic.visible && <div style={{ position: 'absolute', left: 120, top: 470, width: 180, height: 180, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,46,77,.12)', border: `2px solid ${C.red}88`, ...mic.style }}><Icon name="ph:microphone-bold" size={96} color={C.red} glow /></div>}
      {mic.visible && <Label x={210} y={680} at={C0(9) + 0.3} out={C1(10)} align="center" color={C.dim}>microphone</Label>}
      <Wave x={300} y={560} w={200} t={t} on={mic.s} />
      {/* DSP chip */}
      {chip.visible && <div style={{ position: 'absolute', left: 500, top: 460, width: 210, height: 200, ...chip.style }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(160deg,#1c2436,#0a0e17)', border: '1px solid rgba(255,255,255,.12)', boxShadow: `0 20px 50px rgba(0,0,0,.6), 0 0 30px ${C.cyan}22` }} />
        {Array.from({ length: 6 }, (_, i) => <React.Fragment key={i}><div style={{ position: 'absolute', left: 22 + i * 30, top: -14, width: 10, height: 14, background: '#8a95ab' }} /><div style={{ position: 'absolute', left: 22 + i * 30, bottom: -14, width: 10, height: 14, background: '#8a95ab' }} /></React.Fragment>)}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Icon name="ph:cpu-bold" size={64} color={C.cyan} /><div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: C.dim }}>LOW-POWER</div></div>
      </div>}
      <Wave x={712} y={560} w={110} t={t + 1} color={C.cyan} amp={18} on={chip.s} />
      <RingBuffer t={t} />
      {/* compare */}
      {cmp.visible && <div style={{ position: 'absolute', left: 1300, top: 250, width: 440, padding: '22px 26px', borderRadius: 22, background: 'rgba(8,12,24,.92)', border: `1px solid ${C.cyan}55`, ...cmp.style }}>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 18, letterSpacing: '0.2em', color: C.dim }}>COMPARE TO WAKE WORD</div>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 56, color: C.cyan, marginTop: 6 }}>"HI LG" ?</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 14, height: 46, alignItems: 'center' }}>{Array.from({ length: 34 }, (_, i) => <div key={i} style={{ width: 8, borderRadius: 4, height: 8 + Math.abs(Math.sin(i * 0.9 + t * 7)) * 36, background: i % 9 < 5 ? C.cyan : '#3a4560' }} />)}</div>
      </div>}
      {/* no match -> bin */}
      {bin.visible && <div style={{ position: 'absolute', left: 1360, top: 690, display: 'flex', alignItems: 'center', gap: 18, ...bin.style }}>
        <div style={{ width: 120, height: 120, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,46,77,.12)', border: `2px solid ${C.red}` }}><Icon name="ph:trash-bold" size={64} color={C.red} /></div>
        <div><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 44, color: C.red }}>NO MATCH</div><div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 22, color: C.dim }}>thrown away</div></div>
      </div>}
      {/* a chunk of the loop flies into the bin */}
      {noU > 0 && noU < 1 && [0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: lerp(RING.x + 120, 1420, noU) + k * 14, top: lerp(RING.y - 150, 740, noU) - Math.sin(noU * Math.PI) * 160 + k * 10, width: 36, height: 18, borderRadius: 4, background: C.cyan, opacity: 1 - noU * 0.6, transform: `rotate(${noU * 300}deg)` }} />)}
      {/* match -> TV wakes -> cloud */}
      {cloud.visible && <div style={{ position: 'absolute', left: 1360, top: 690, display: 'flex', alignItems: 'center', gap: 18, ...cloud.style }}>
        <div style={{ width: 120, height: 120, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(60,240,160,.12)', border: `2px solid ${C.green}` }}><Icon name="ph:check-circle-bold" size={64} color={C.green} /></div>
        <div><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 44, color: C.green }}>MATCH</div><div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 22, color: C.dim }}>TV wakes · command sent</div></div>
      </div>}
      {okU > 0 && okU < 1 && <div style={{ position: 'absolute', left: lerp(1440, 1700, okU), top: lerp(700, 140, okU), opacity: Math.sin(okU * Math.PI) }}><Icon name="ph:cloud-arrow-up-bold" size={70} color={C.green} glow /></div>}
    </>
  );
};

// "it listens for a wake word": a live waveform across the black screen
const ListenWave: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = ramp(t, at, 0.35) * (1 - ramp(t, out, 0.25));
  const x0 = BIG.x + 140, x1 = BIG.x + BIG.w - 140, y = BIG.y + BIG.w * 0.29;
  const pts = Array.from({ length: 121 }, (_, i) => {
    const u = i / 120, env = Math.sin(u * Math.PI);
    const v = Math.sin(u * 38 + t * 9) * 0.5 + Math.sin(u * 91 - t * 13) * 0.3 + Math.sin(u * 17 + t * 4) * 0.2;
    return `${lerp(x0, x1, u).toFixed(1)},${(y + v * env * 70 * (0.6 + 0.4 * Math.sin(t * 3))).toFixed(1)}`;
  }).join(' ');
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: a }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible' }}>
        <polyline points={pts} fill="none" stroke={C.cyan} strokeWidth="4" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
      </svg>
      <div style={{ position: 'absolute', left: (x0 + x1) / 2, top: y - 150, transform: 'translateX(-50%)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: C.cyan, whiteSpace: 'nowrap' }}>● LISTENING FOR WAKE WORD…</div>
    </div>
  );
};

export const S2Hears: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const g = glitchOffset(t, tHonest, 0.5, 20);
  const pulse = 0.6 + 0.4 * Math.sin(t * 3.4);
  const tvScene = (t > tBuilt - 0.3 && t < C0(9) + 0.2) || (t > C0(11) - 0.4);
  const camTV = [
    { t: tBuilt - 0.3, x: 960, y: 520, z: 0.92 }, { t: tBuilt + 0.4, x: 960, y: 560, z: 1.0, e: EASE.out },
    { t: tFar, x: 960, y: 560, z: 1.0, e: EASE.smooth }, { t: tSpeaker, x: 820, y: 560, z: 1.05, e: EASE.inOut },
    { t: tHi - 0.3, x: 960, y: 540, z: 1.0, e: EASE.inOut }, { t: C1(8), x: 960, y: 540, z: 1.04, e: EASE.smooth },
    { t: C0(11) - 0.4, x: 960, y: 520, z: 0.95 }, { t: tLooks, x: 960, y: 520, z: 1.0, e: EASE.smooth },
    { t: tHonest - 0.6, x: 960, y: 500, z: 1.06, e: EASE.smooth }, { t: Z, x: 960, y: 480, z: 1.6, e: EASE.in },
  ];
  const camChip = [
    { t: C0(9) - 0.2, x: 960, y: 540, z: 1.25 }, { t: C0(9) + 0.8, x: 960, y: 540, z: 1.0, e: EASE.out },
    { t: tCompare, x: 1010, y: 540, z: 1.0, e: EASE.smooth }, { t: tRemember - 0.1, x: 1060, y: 560, z: 1.02, e: EASE.smooth },
    { t: tRemember + 0.8, x: RING.x, y: RING.y - 70, z: 1.55, e: EASE.inOut }, { t: C1(10), x: RING.x, y: RING.y - 80, z: 1.7, e: EASE.smooth },
  ];
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.red} />
      {/* 1. remote mic: real footage */}
      <Footage src="stock/remote-hand.mp4" at={A} out={tBuilt - 0.1} zoom={[1.08, 1.18]} pan={[20, -20]} enter="fade" />
      <Callout x={1010} y={500} at={tRemote + 0.15} out={tBuilt - 0.2} icon="ph:microphone-bold" text="Mic #1 · in the remote" color={C.red} />
      <Kinetic text="How does a smart TV *listen?*" at={A + 0.1} out={tRemote - 0.15} y={200} size={66} anim="rise" accent={C.cyan} />
      {/* 2. TV with built-in far-field mic; speaker PiP; "HI LG" */}
      {tvScene && t < C0(9) + 0.3 && (
        <Camera keys={camTV}>
          <Layer depth={0.7}><Grid opacity={0.22} /></Layer>
          <Layer depth={1}>
            <TV x={BIG.x} y={BIG.y} w={BIG.w} led={pulse + (t > tHi ? 1 : 0)} bias={0.9} />
            <Rings x={BIG_LED.x} y={BIG_LED.y} at={tFar - 0.1} out={tWake} color={C.cyan} max={700} count={5} speed={0.6} />
            {t > tWake - 0.15 && t < tHi + 0.2 && <ListenWave at={tWake - 0.1} out={tHi - 0.1} />}
          </Layer>
        </Camera>
      )}
      {t < C0(9) && <Callout x={BIG_LED.x} y={BIG_LED.y - 30} at={tBuilt + 0.2} out={tSpeaker - 0.2} icon="ph:microphone-stage-bold" text="Mic #2 · built into the TV" color={C.red} />}
      <Pill x={960} y={140} at={tFar} out={tWake - 0.1} color={C.cyan} center><Icon name="ph:broadcast-bold" size={30} color={C.ink} />Far-field voice recognition</Pill>
      <Footage src="stock/smart-speaker.mp4" at={tSpeaker - 0.1} out={tWake - 0.05} from={3} x={1180} y={220} w={620} h={350} radius={26} enter="scale" label="≈ A SMART SPEAKER" />
      {t > tHi - 0.3 && t < C0(9) + 0.1 && <HiLG at={tHi - 0.2} out={C1(8) + 0.2} />}
      {/* 3. the chip */}
      {t > C0(9) - 0.25 && t < C1(10) + 0.5 && (
        <AbsoluteFill style={{ opacity: ramp(t, C0(9) - 0.25, 0.3) * (1 - ramp(t, C1(10) + 0.1, 0.35)) }}>
          <BgMesh a="#0f5c4a" b={C.blue} />
          <Camera keys={camChip}>
            <Layer depth={0.6}><Grid opacity={0.3} color="rgba(60,240,160,0.16)" /></Layer>
            <Layer depth={1}><ChipDiagram /></Layer>
          </Camera>
          <Kinetic text="A loop of tape that | *records over itself*" at={tLoop} out={tCompare - 0.1} y={180} size={56} accent={C.cyan} />
          <Kinetic text="It's not *whether* it has a microphone…" at={tQuestion} out={tWhat - 0.1} y={170} size={56} anim="blur" />
          <Kinetic text="It's what happens when it's | *supposed* to be thrown away." at={tWhat} out={C1(10)} y={190} size={56} anim="rise" />
          <Kinetic text="Remember this *loop*" at={tRemember} out={tQuestion - 0.1} y={170} size={60} anim="pop" accent={C.cyan} />
        </AbsoluteFill>
      )}
      {/* 4. Always Ready */}
      {t > C0(11) - 0.4 && (
        <AbsoluteFill style={{ opacity: ramp(t, C0(11) - 0.4, 0.4) }}>
          <BgMesh a={C.blue} b={C.violet} />
          <Camera keys={camTV}>
            <Layer depth={0.7}><Grid opacity={0.2} /></Layer>
            <Layer depth={1}><TV x={BIG.x} y={BIG.y} w={BIG.w} led={pulse} bias={0.8} /></Layer>
          </Camera>
          {t < tAlways + 0.3 && (() => {
            const sp = springAt(f, fps, C0(11) + 0.15, { damping: 11, stiffness: 140 });
            const ex = ramp(t, tAlways - 0.2, 0.3, EASE.in);
            return <div style={{ position: 'absolute', left: 960, top: 500, transform: `translate(-50%,-50%) rotate(${(1 - sp) * -40}deg) scale(${(0.4 + 0.6 * sp) * (1 - ex * 0.5)})`, opacity: clamp(sp * 1.4) * (1 - ex) }}><Icon name="ph:puzzle-piece-bold" size={170} color={C.cyan} glow /></div>;
          })()}
          <Pill x={120} y={150} at={tAlways - 0.05} out={tHonest - 0.4} color={C.cyan}><Icon name="ph:lightning-bold" size={30} color={C.ink} />Always Ready · ON</Pill>
          <PowerHud at={tLooks - 0.1} out={tHonest - 0.4} />
          <Kinetic text="Looks off ≠ *is off*" at={P(11, 'it often')} out={C1(11)} y={880} size={64} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, transform: `translateX(${g.x}px) skewX(${g.skew}deg)` }}>
            <Kinetic text="The least *honest* thing | in your living room" at={tHonest - 0.5} out={Z + 0.2} y={540} size={86} weight={900} anim="zoom" />
          </div>
        </AbsoluteFill>
      )}
      <Dust count={36} opacity={0.3} />
      <Chapter n={2} title="How a TV Hears You" at={A + 0.4} out={Z - 0.6} color={C.cyan} />
      <Grade />
    </AbsoluteFill>
  );
};

const HiLG: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const e = useEnter(at, out, { rise: 40, scale: 0.4 });
  if (!e.visible) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(3,5,11,${0.55 * (e.style.opacity as number)})` }}>
      <div style={{ position: 'absolute', left: 960, top: 470, transform: 'translate(-50%,-50%)' }}><div style={e.style}>
        <div style={{ position: 'relative', padding: '40px 80px', borderRadius: 60, background: 'linear-gradient(160deg,#0f2a44,#07121f)', border: `3px solid ${C.cyan}`, boxShadow: `0 0 80px ${C.cyan}55` }}>
          <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 170, color: C.cyan, lineHeight: 1, textShadow: `0 0 40px ${C.cyan}aa` }}>"HI LG"</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20, height: 60, alignItems: 'center' }}>{Array.from({ length: 40 }, (_, i) => <div key={i} style={{ width: 9, borderRadius: 5, height: 10 + Math.abs(Math.sin(i * 0.7 + e.t * 9)) * 50, background: C.cyan, opacity: 0.85 }} />)}</div>
          <div style={{ position: 'absolute', left: 120, bottom: -40, width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: `40px solid ${C.cyan}` }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 60, fontFamily: fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: C.dim }}>THE WAKE WORD</div>
      </div></div>
    </AbsoluteFill>
  );
};

const PowerHud: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const e = useEnter(at, out, { rise: 40 });
  if (!e.visible) return null;
  const t = e.t;
  const pts = Array.from({ length: 60 }, (_, i) => `${i * 7},${50 - Math.abs(Math.sin(i * 0.5 + t * 6)) * 26 - (i % 11 === 0 ? 14 : 0)}`).join(' ');
  return (
    <div style={{ position: 'absolute', left: 1380, top: 140, width: 440, padding: '24px 28px', borderRadius: 22, background: 'rgba(8,12,24,.92)', border: '1px solid rgba(140,170,230,.2)', ...e.style }}>
      <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 18, letterSpacing: '0.2em', color: C.dim }}>POWER STATE</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color: C.ink }}><span style={{ width: 16, height: 16, borderRadius: '50%', background: C.red, boxShadow: `0 0 14px ${C.red}` }} />STANDBY</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 20, color: C.dim, marginTop: 6 }}>screen <span style={{ color: C.ink }}>OFF</span> · chip <span style={{ color: C.cyan }}>AWAKE</span> · mic <span style={{ color: C.red }}>READY</span></div>
      <svg width="420" height="60" style={{ marginTop: 10 }}><polyline points={pts} fill="none" stroke={C.cyan} strokeWidth="3" /></svg>
    </div>
  );
};
