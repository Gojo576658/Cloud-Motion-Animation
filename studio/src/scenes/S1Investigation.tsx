// S1 · The Investigation — who tested what, how, and the three findings ("boxes").
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust } from '../components/Backdrop';
import { NameCard, Stat, Terminal, hexLines, Chapter, useEnter } from '../components/Blocks';
import { Kinetic } from '../components/Kinetic';
import { Pill, glitchOffset } from '../components/UI';
import { TV } from '../components/TV';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, PE, S0, S1, EASE, ramp, clamp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(1), Z = S1(1);
const tVideo = P(4, 'published a video'), tHours = P(4, 'more than two hours');
const tTeam = P(4, 'They had teamed'), tL1 = P(4, 'Level1Techs'), tInd = P(4, 'independent security');
const tTogether = P(4, 'Together'), t500 = P(4, 'five hundred hours'), t70k = P(4, 'seventy thousand'), tG5 = P(4, 'including the 2025');
const tPkt = P(5, 'captured every packet'), tFw = P(5, 'decompiled the firmware'), tLogs = P(5, 'read the system logs');
const tParts = P(6, 'three parts'), tHears = P(6, 'what your TV hears'), tSees = P(6, 'what it sees inside'), tNot = P(6, 'Not on the screen');
const tThird = P(6, 'And the third'), tWho = P(6, "It's about who"), tOpen = C0(7);

export const s1NoCaptions: [number, number][] = [[tNot - 0.1, PE(6, 'Inside your house') + 0.2]];

export const s1Sfx: SfxEvent[] = [
  { t: A + 0.35, name: 'popUi', vol: 0.4, note: 'player card' },
  { t: tHours - 0.05, name: 'clockSpin', vol: 0.4, note: 'duration counter' },
  { t: tTeam - 0.05, name: 'whooshQuick', vol: 0.35 }, { t: tTeam + 0.05, name: 'tap', vol: 0.35 },
  { t: tL1 - 0.05, name: 'whooshQuick', vol: 0.35 }, { t: tL1 + 0.05, name: 'tap', vol: 0.35 },
  { t: tInd - 0.05, name: 'whooshQuick', vol: 0.35 }, { t: tInd + 0.05, name: 'tap', vol: 0.35 },
  { t: tTogether - 0.15, name: 'sweepSmall', vol: 0.4, note: 'stats come in' },
  { t: t500 - 0.05, name: 'impactZoom', vol: 0.4 }, { t: t500 + 0.1, name: 'compute', vol: 0.25, dur: 1.4 },
  { t: t70k - 0.05, name: 'impactZoom', vol: 0.4 }, { t: t70k + 0.1, name: 'compute', vol: 0.25, dur: 1.4 },
  { t: tG5 - 0.05, name: 'popElectric', vol: 0.4 },
  { t: tPkt - 0.1, name: 'techSlide', vol: 0.4 }, { t: tPkt, name: 'scan', vol: 0.3 },
  { t: tFw - 0.1, name: 'techSlide', vol: 0.4 }, { t: tFw, name: 'typing', vol: 0.3, dur: 1.6 },
  { t: tLogs - 0.1, name: 'techSlide', vol: 0.4 }, { t: tLogs, name: 'keyboard', vol: 0.25, dur: 2 },
  { t: tParts - 0.2, name: 'swoosh', vol: 0.4, note: 'three cards' },
  { t: tHears - 0.05, name: 'bleepHi', vol: 0.3 }, { t: tSees - 0.05, name: 'bleepHi', vol: 0.3 },
  { t: tNot - 0.05, name: 'tap', vol: 0.3 },
  { t: tThird - 0.05, name: 'bassHitFx', vol: 0.4 }, { t: tWho - 0.05, name: 'glitchBreak', vol: 0.45 },
  { t: tOpen + 0.4, name: 'zoomAir', vol: 0.5, note: 'dive into box 01' },
];

const Player: React.FC = () => {
  const e = useEnter(A + 0.3, tTeam - 0.2, { rise: 60, scale: 0.1 });
  if (!e.visible) return null;
  const t = e.t;
  const prog = ramp(t, tHours, 2.2, EASE.out);
  const secs = Math.round(prog * (2 * 3600 + 14 * 60 + 37));
  const hh = Math.floor(secs / 3600), mm = Math.floor((secs % 3600) / 60), ss = secs % 60;
  return (
    <div style={{ position: 'absolute', left: 410, top: 190, width: 1100, height: 620, borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(160deg,#141d36,#070b16)', border: '1px solid rgba(140,170,230,.2)', boxShadow: '0 50px 120px rgba(0,0,0,.65)', ...e.style }}>
      <Footage src="stock/pcb-macro.mp4" at={A + 0.3} out={tTeam} from={2} zoom={[1.1, 1.2]} enter="fade" />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(3,6,14,.2), rgba(3,6,14,.85))' }} />
      <div style={{ position: 'absolute', left: '50%', top: '42%', transform: `translate(-50%,-50%) scale(${1 + Math.sin(t * 3) * 0.04})`, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,46,77,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${C.red}88` }}><Icon name="ph:play-fill" size={64} color="#fff" /></div>
      <div style={{ position: 'absolute', left: 40, bottom: 92, fontFamily: fonts.head, fontWeight: 800, fontSize: 44, color: C.ink }}>LG Smart TV Investigation</div>
      <div style={{ position: 'absolute', left: 40, bottom: 56, fontFamily: fonts.body, fontWeight: 600, fontSize: 22, letterSpacing: '0.14em', color: C.dim }}>HARDWARE CHANNEL · INDEPENDENT TESTING</div>
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 26, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.12)' }}><div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 3, background: C.red }} /></div>
      <div style={{ position: 'absolute', right: 40, top: 30, padding: '10px 18px', borderRadius: 10, background: 'rgba(0,0,0,.6)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: prog > 0.98 ? C.amber : C.ink }}>{hh}:{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</div>
    </div>
  );
};

const FindingCard: React.FC<{ i: number; x: number; icon: string; title: string; on: number; color: string }> = ({ i, x, icon, title, on, color }) => {
  const e = useEnter(tParts + i * 0.12, i === 0 ? Z + 0.3 : tOpen + 0.6, { rise: 80, scale: 0.12 });
  const f = useCurrentFrame(); const t = f / useVideoConfig().fps;
  if (!e.visible) return null;
  const lit = ramp(t, on, 0.35, EASE.out);
  const g = i === 2 ? glitchOffset(t, tWho, 0.5, 16) : { x: 0, skew: 0 };
  // box 01 dives toward camera at "Let's open the first box"
  const dive = i === 0 ? ramp(t, tOpen + 0.2, Z - tOpen, EASE.in) : 0;
  const others = i !== 0 ? ramp(t, tOpen + 0.2, 0.4, EASE.in) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: 300, width: 500, height: 440, ...e.style, transform: `${e.style.transform} translateX(${g.x}px) skewX(${g.skew}deg) scale(${1 + dive * 4})`, opacity: (e.style.opacity as number) * (1 - others) }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: `linear-gradient(160deg, rgba(22,32,60,.9), rgba(8,12,24,.92))`, border: `2px solid ${lit > 0.5 ? color : 'rgba(140,170,230,.2)'}`, boxShadow: `0 40px 100px rgba(0,0,0,.6), 0 0 ${60 * lit}px ${color}55` }} />
      <div style={{ position: 'absolute', left: 40, top: 36, fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: lit > 0.5 ? color : C.dim }}>0{i + 1}</div>
      <div style={{ position: 'absolute', right: 40, top: 36 }}><Icon name={lit > 0.5 ? 'ph:lock-open-bold' : 'ph:lock-bold'} size={36} color={lit > 0.5 ? color : C.dim} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 150, height: 150, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}${lit > 0.5 ? '26' : '0d'}`, transform: `scale(${1 + lit * 0.08})` }}><Icon name={icon} size={92} color={lit > 0.5 ? color : '#56627d'} glow={lit > 0.5} /></div>
      </div>
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 44, textAlign: 'center', fontFamily: fonts.head, fontWeight: 800, fontSize: 36, lineHeight: 1.15, color: lit > 0.5 ? C.ink : C.dim, textTransform: 'uppercase' }}>{title}</div>
    </div>
  );
};

export const S1Investigation: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cam = [
    { t: A, x: 960, y: 540, z: 1.0 }, { t: tTeam, x: 960, y: 540, z: 1.04, e: EASE.smooth },
    { t: tTogether, x: 960, y: 560, z: 1.0, e: EASE.inOut }, { t: C1(4), x: 960, y: 540, z: 1.05, e: EASE.smooth },
    { t: C0(5) + 0.2, x: 960, y: 540, z: 1.0, e: EASE.inOut }, { t: C1(5), x: 960, y: 520, z: 1.05, e: EASE.smooth },
    { t: tParts, x: 960, y: 540, z: 1.0, e: EASE.inOut }, { t: tOpen, x: 960, y: 540, z: 1.06, e: EASE.smooth },
    { t: Z, x: 380, y: 520, z: 1.6, e: EASE.in },
  ];
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.cyan} />
      <Camera keys={cam}>
        <Layer depth={0.55}>
          <Footage src="stock/lab-coding.mp4" at={A} out={tTogether} zoom={[1.05, 1.15]} enter="fade" desat={0.35} />
          <Footage src="stock/pcb-macro.mp4" at={tTogether - 0.1} out={C1(4) + 0.2} from={6} zoom={[1.1, 1.2]} enter="fade" desat={0.25} />
          <Footage src="stock/code-running.mp4" at={C0(5) - 0.2} out={C1(5) + 0.2} zoom={[1.06, 1.16]} enter="fade" desat={0.3} />
          <AbsoluteFill style={{ background: 'rgba(3,6,14,.55)' }} />
          <Grid opacity={0.18} />
        </Layer>
        <Layer depth={1}>
          <Pill x={410} y={120} at={A + 0.5} out={tTeam - 0.3} color={C.red}>Sept 7, 2026</Pill>
          <Player />
          {/* who */}
          <NameCard x={110} y={440} at={tTeam} out={tTogether - 0.3} icon="ph:video-camera-bold" title="Gamers Nexus" sub="Hardware channel" color={C.red} />
          <NameCard x={700} y={440} at={tL1} out={tTogether - 0.3} icon="ph:wrench-bold" title="Level1Techs" sub="Tech lab" color={C.cyan} />
          <NameCard x={1290} y={440} at={tInd} out={tTogether - 0.3} icon="ph:shield-check-bold" title="Security researchers" sub="Independent" color={C.green} w={540} />
          {t > tL1 && t < tTogether && [0, 1].map((k) => <div key={k} style={{ position: 'absolute', left: 630 + k * 590, top: 500, width: 70 * ramp(t, (k ? tInd : tL1) - 0.1, 0.4), height: 4, background: `linear-gradient(90deg, ${C.dim}, ${C.ink})`, borderRadius: 2 }} />)}
          {/* how much */}
          <Stat x={150} y={330} at={t500 - 0.1} out={C1(4) - 0.1} to={500} fmt={(v) => `${Math.round(v)}+`} label="hours of testing" icon="ph:clock-bold" />
          <Stat x={620} y={330} at={t70k - 0.1} out={C1(4) - 0.1} to={70000} fmt={(v) => `$${Math.round(v).toLocaleString('en-US')}`} label="spent" icon="ph:currency-dollar-bold" color={C.amber} w={480} />
          <TVCard at={tG5 - 0.1} out={C1(4) - 0.1} />
          {/* how */}
          <Terminal x={110} y={250} w={540} h={470} at={tPkt - 0.1} out={C1(5)} title="Packet capture" icon="ph:broadcast-bold" lines={(k) => hexLines(k)} speed={14} />
          <Terminal x={690} y={250} w={540} h={470} at={tFw - 0.1} out={C1(5)} title="Firmware · decompiled" icon="ph:cpu-bold" color={C.amber} typed speed={8} lines={() => ['void voice_loop() {', '  buf = ring_alloc(SEC(4));', '  while (standby) {', '    mic_read(buf);', '    if (!wake_word(buf))', '!      store_local(buf);', '  }', '}', '', 'int net_scan(lan *l) {', '!  probe_all(l->hosts);', '}']} />
          <Terminal x={1270} y={250} w={540} h={470} at={tLogs - 0.1} out={C1(5)} title="System log" icon="ph:list-magnifying-glass-bold" color={C.green} speed={10} lines={(k) => Array.from({ length: 12 }, (_, j) => { const n = j + k; return `${['>', ' ', '!', ' '][n % 4]}[22:${String((n * 7) % 60).padStart(2, '0')}] ${['audiod: buffer flush', 'netd: host found', 'acr: frame sent', 'audiod: 14 files queued', 'upload: pending'][n % 5]}`; })} />
          {/* what they found */}
          <Kinetic text="What they found" at={tParts - 0.2} out={tOpen + 0.2} y={200} size={60} anim="rise" />
          <FindingCard i={0} x={130} icon="ph:ear-bold" title="What your TV hears" on={tHears} color={C.cyan} />
          <FindingCard i={1} x={710} icon="ph:house-line-bold" title="What it sees in your home" on={tSees} color={C.cyan} />
          <FindingCard i={2} x={1290} icon="ph:skull-bold" title="Who else could get in" on={tThird} color={C.red} />
          <Kinetic text="Not on the screen. *Inside* your house." at={tNot} out={PE(6, 'Inside your house') + 0.1} y={860} size={52} anim="blur" accent={C.cyan} />
        </Layer>
      </Camera>
      <Dust count={40} opacity={0.3} />
      <Chapter n={1} title="The Investigation" at={A + 0.4} out={Z - 0.6} color={C.cyan} />
      <Grade />
    </AbsoluteFill>
  );
};

const TVCard: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const e = useEnter(at, out, { rise: 60 });
  if (!e.visible) return null;
  return (
    <div style={{ position: 'absolute', left: 1140, top: 330, width: 640, height: 330, borderRadius: 26, background: 'linear-gradient(160deg, rgba(22,32,60,.86), rgba(8,12,24,.9))', border: '1px solid rgba(140,170,230,.18)', boxShadow: '0 40px 90px rgba(0,0,0,.55)', overflow: 'hidden', ...e.style }}>
      <div style={{ position: 'absolute', left: 32, top: 28, display: 'flex', alignItems: 'center', gap: 12, fontFamily: fonts.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.18em', color: C.dim }}><Icon name="ph:television-simple-bold" size={26} color={C.dim} />TESTED</div>
      <div style={{ position: 'absolute', left: 32, top: 70, fontFamily: fonts.head, fontWeight: 900, fontSize: 70, color: C.ink }}>LG G5</div>
      <div style={{ position: 'absolute', left: 32, top: 160, fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: C.dim }}>2025 OLED<br />retail units</div>
      <div style={{ position: 'absolute', left: 300, top: 70 }}><div style={{ position: 'relative', width: 300, height: 190 }}><TV x={0} y={0} w={300} led={1} bias={0.7} /></div></div>
    </div>
  );
};
