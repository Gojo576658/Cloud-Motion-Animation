// Short beats 0–5: hook in the room, $70,000 lab, audio saved + uploaded, "WORSE",
// 38-device scan that pulls out to the neighbours' Wi-Fi.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer, useCam } from '../components/Camera';
import { BgMesh, Footage } from '../components/Look';
import { Grid, Glow } from '../components/Backdrop';
import { Pill, Rings, Brackets, Flash } from '../components/UI';
import { TV } from '../components/TV';
import { DevicePin } from '../components/House';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import { C0, P, PE } from './stime';
import { VRoom, VLED } from './VRoom';
import type { SfxEvent } from '../lib/sfx';

export const B1 = C0(1) - 0.1, B2 = C0(2) - 0.09, B3 = C0(3) - 0.17, B4 = C0(4) - 0.1, B6 = C0(6) - 0.15;
const useTF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };

// ---------------- 0 · "Your TV is off. So why is its microphone still awake?"
const tOff = P(0, 'off'), tSo = P(0, 'So why'), tMic = P(0, 'microphone'), tAwake = P(0, 'awake');
export const sfx0: SfxEvent[] = [
  { t: 0, name: 'drone', vol: 0.25, dur: 3.7, note: 'room tone' },
  { t: 0.05, name: 'heartbeat', vol: 0.4 },
  { t: tOff - 0.04, name: 'popUi', vol: 0.35, note: 'TV · OFF chip' },
  { t: tSo - 0.1, name: 'swooshSlow', vol: 0.3, note: 'slow push' },
  { t: tMic - 0.05, name: 'popElectric', vol: 0.4, note: 'MIC · ON chip' },
  { t: tMic + 0.05, name: 'zoomTech', vol: 0.55, note: 'dive to the LED' },
  { t: tAwake - 0.04, name: 'bassHitFx', vol: 0.55, note: 'LED flare' },
  { t: B1 - 0.12, name: 'shutter', vol: 0.4, note: 'white flash cut' },
];
export const Beat0: React.FC = () => {
  const { t } = useTF();
  const flare = ramp(t, tAwake - 0.1, 0.3) * 1.8;
  const led = 0.6 + 0.4 * Math.sin(t * 3.4) + flare;
  const cam = [
    { t: 0, x: 540, y: 960, z: 1 },
    { t: tSo, x: 540, y: 975, z: 1.05, e: EASE.smooth },
    { t: tMic, x: 540, y: 990, z: 1.1, e: EASE.smooth },
    { t: tAwake + 0.05, x: VLED.x, y: VLED.y - 6, z: 3.3, e: EASE.inOut },
    { t: B1 + 0.3, x: VLED.x, y: VLED.y - 6, z: 3.8, e: EASE.smooth },
  ];
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <Camera keys={cam}>
        <VRoom led={led} />
        <Layer depth={1}><Rings x={VLED.x} y={VLED.y} at={tAwake - 0.1} out={B1 + 0.2} color={C.red} max={320} count={4} speed={1} /></Layer>
      </Camera>
      <Pill x={540} y={300} at={tOff - 0.05} out={tAwake + 0.1} color={C.dim} center size={34}><Icon name="ph:power-bold" size={34} color={C.ink} /> TV · OFF</Pill>
      <Pill x={540} y={392} at={tMic - 0.05} out={tAwake + 0.1} color={C.red} center size={34}><Icon name="ph:microphone-fill" size={34} color={C.ink} /> MIC · ON</Pill>
    </AbsoluteFill>
  );
};

// ---------------- 1 · "$70,000 testing brand-new LG TVs"
const tRes = P(1, 'Researchers'), tSev = P(1, 'seventy'), tDol = PE(1, 'dollars'), tTest = P(1, 'testing'), tNew = P(1, 'brand-new');
const tLand = tDol + 0.05;
export const sfx1: SfxEvent[] = [
  { t: tRes - 0.05, name: 'popUi', vol: 0.35, note: 'lab chip' },
  { t: tSev - 0.05, name: 'compute', vol: 0.3, dur: tLand - tSev + 0.05, note: 'counter roll' },
  { t: tLand - 0.03, name: 'impactZoom', vol: 0.55, note: '$70,000 lands' }, { t: tLand + 0.02, name: 'sparkle', vol: 0.3 },
  { t: tRes + 0.1, name: 'whooshQuick', vol: 0.35, note: 'TV rises' }, { t: tTest + 0.15, name: 'scan', vol: 0.3, note: 'brackets + scan line' },
  { t: tNew - 0.03, name: 'stomp', vol: 0.4, note: 'NEW sticker' },
];
export const Beat1: React.FC = () => {
  const { f, fps, t } = useTF();
  const u = clamp((t - tSev) / (tLand - tSev));
  const val = 70000 * EASE.out(u);
  const land = ramp(t, tLand, 0.08) - ramp(t, tLand + 0.08, 0.35);
  const tvS = springAt(f, fps, tRes + 0.15, { damping: 15, stiffness: 120 });
  const newS = springAt(f, fps, tNew - 0.03, { damping: 9, stiffness: 220 });
  const r = rng(7);
  const scanY = ((t - tTest) * 0.9) % 1;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <Footage src="stock/lab-coding.mp4" at={B1 - 0.1} out={B2 + 0.4} w={1080} h={1920} zoom={[1.2, 1.32]} pan={[-40, 30]} enter="fade" desat={0.35} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(3,5,11,.35), rgba(3,5,11,.62) 45%, rgba(3,5,11,.88))' }} />
      <Pill x={540} y={300} at={tRes - 0.05} color={C.cyan} center size={34}><Icon name="ph:flask-bold" size={32} color={C.ink} /> RESEARCHERS · LAB TEST</Pill>
      {t > tSev - 0.1 && (
        <div style={{ position: 'absolute', left: 540, top: 500, transform: `translate(-50%,-50%) scale(${(0.8 + 0.2 * ramp(t, tSev - 0.1, 0.3)) * (1 + 0.1 * land)})`, opacity: ramp(t, tSev - 0.1, 0.2), fontFamily: fonts.head, fontWeight: 900, fontSize: 196, color: C.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textShadow: `0 10px 50px rgba(0,0,0,.9)${t > tLand ? `, 0 0 60px ${C.amber}55` : ''}`, filter: u > 0 && u < 0.95 ? 'blur(1.2px)' : undefined }}>
          <span style={{ color: C.amber }}>$</span>{Math.round(val).toLocaleString('en-US')}
        </div>
      )}
      {/* sparks when the number lands */}
      {t > tLand && t < tLand + 0.8 && Array.from({ length: 26 }, (_, i) => {
        const a = r() * Math.PI * 2, d = 160 + r() * 320, k = ramp(t, tLand, 0.7, EASE.out);
        return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(a) * d * k, top: 500 + Math.sin(a) * d * k * 0.6, width: 6, height: 6, borderRadius: 3, background: i % 3 ? C.amber : '#fff', opacity: 1 - k, boxShadow: `0 0 10px ${C.amber}` }} />;
      })}
      <div style={{ position: 'absolute', left: 540, top: 618, transform: 'translateX(-50%)', fontFamily: fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.34em', color: C.dim, opacity: ramp(t, tLand, 0.4), whiteSpace: 'nowrap' }}>SPENT ON TESTING</div>
      {t > tRes + 0.1 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${(1 - tvS) * 260}px)`, opacity: clamp(tvS * 1.6) }}>
          <TV x={210} y={880} w={660} screenOn={1} bias={0.7} screen={<AbsoluteFill style={{ background: 'linear-gradient(160deg,#0b1430,#04060c)' }}><div style={{ position: 'absolute', left: 0, right: 0, top: `${scanY * 100}%`, height: 3, background: C.cyan, boxShadow: `0 0 20px ${C.cyan}` }} /><div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(51,225,255,.06) 0 2px, transparent 2px 22px)' }} /></AbsoluteFill>} />
        </div>
      )}
      {t > tTest && <Brackets x={185} y={855} w={710} h={430} at={tTest + 0.1} color={C.cyan} label="LG OLED · BRAND-NEW" />}
      {t > tNew - 0.05 && (
        <div style={{ position: 'absolute', left: 830, top: 880, transform: `translate(-50%,-50%) rotate(${-14 + (1 - newS) * 40}deg) scale(${newS})`, width: 150, height: 150, borderRadius: '50%', background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 44, color: '#1a0f00', boxShadow: `0 0 40px ${C.amber}88`, clipPath: 'polygon(50% 0,61% 12%,76% 6%,80% 21%,95% 24%,90% 39%,100% 50%,90% 61%,95% 76%,80% 79%,76% 94%,61% 88%,50% 100%,39% 88%,24% 94%,20% 79%,5% 76%,10% 61%,0 50%,10% 39%,5% 24%,20% 21%,24% 6%,39% 12%)' }}>NEW</div>
      )}
      <Flash at={B1 - 0.04} color="#fff" max={0.9} d={0.35} />
    </AbsoluteFill>
  );
};

// ---------------- 2 · "With the screen black, they say it was still saving audio… and uploading it later."
const tScreen = P(2, 'screen black'), tThey = P(2, 'they say'), tSaving = P(2, 'saving'), tAudio = P(2, 'audio'), tUp = P(2, 'uploading'), tLater = P(2, 'later');
const NF = 14, slot = (k: number) => ({ x: 170 + (k % 7) * 112, y: 1078 + Math.floor(k / 7) * 98 });
const CLOUD = { x: 880, y: 300 };
const fileIn = (k: number) => tAudio - 0.15 + k * 0.07, fileOut = (k: number) => tUp + 0.05 + k * 0.07;
export const sfx2: SfxEvent[] = [
  { t: tScreen - 0.05, name: 'popUi', vol: 0.3, note: 'SCREEN · BLACK' },
  { t: tThey - 0.03, name: 'tap', vol: 0.25, note: 'attribution' },
  { t: tSaving - 0.08, name: 'scan', vol: 0.3, note: 'waveform on the black screen' },
  ...[0, 3, 6, 9, 12].map((k) => ({ t: fileIn(k), name: 'pop' as const, vol: 0.28, note: 'files drop' })),
  { t: tUp - 0.05, name: 'dataLoad', vol: 0.35, dur: 1.4, note: 'upload' },
  { t: fileOut(NF - 1) + 0.4, name: 'success', vol: 0.3, note: 'upload done' },
  { t: tLater - 0.03, name: 'tick', vol: 0.35, note: 'LATER clock' },
];
export const Beat2: React.FC = () => {
  const { f, fps, t } = useTF();
  const led = 0.6 + 0.4 * Math.sin(t * 3.4);
  const waveOn = ramp(t, tSaving - 0.1, 0.3) * (1 - ramp(t, tAudio + 0.4, 0.3));
  const wave = (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg,#07090f,#020306)' }}>
      <svg width="100%" height="100%" viewBox="0 0 900 500" preserveAspectRatio="none" style={{ opacity: waveOn }}>
        <polyline fill="none" stroke={C.red} strokeWidth="5" style={{ filter: `drop-shadow(0 0 10px ${C.red})` }} points={Array.from({ length: 91 }, (_, i) => { const u = i / 90, env = Math.sin(u * Math.PI); return `${u * 900},${250 + (Math.sin(u * 44 + t * 11) * 0.55 + Math.sin(u * 97 - t * 15) * 0.3) * env * 150}`; }).join(' ')} />
      </svg>
      {t > tSaving && t < tUp && <div style={{ position: 'absolute', left: 24, top: 18, fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: C.red, opacity: Math.floor(t * 3) % 2 ? 1 : 0.4 }}>● SAVING</div>}
    </AbsoluteFill>
  );
  const done = clamp((t - tUp) / (NF * 0.07 + 0.3));
  const cloudS = springAt(f, fps, tUp - 0.15, { damping: 12, stiffness: 170 });
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.red} />
      <Grid opacity={0.12} perspective={false} />
      <Glow x={540} y={640} r={700} color={C.red} opacity={0.12 * led} />
      <div style={{ position: 'absolute', left: 120, top: 430, width: 840, height: 457, borderRadius: 18, boxShadow: `0 0 140px 40px rgba(255,30,60,${0.12 + 0.08 * led})` }} />
      <TV x={90} y={400} w={900} led={led} screen={wave} screenOn={1} bias={1} stand={false} />
      <Pill x={540} y={300} at={tScreen - 0.05} out={tUp - 0.2} color={C.dim} center size={34}><Icon name="ph:monitor-bold" size={32} color={C.ink} /> SCREEN · BLACK</Pill>
      <div style={{ position: 'absolute', left: 96, top: 936, fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: '0.18em', color: C.amber, opacity: ramp(t, tThey - 0.05, 0.3) }}>* ACCORDING TO RESEARCHERS</div>
      {/* local storage tray */}
      <div style={{ position: 'absolute', left: 110, top: 990, width: 860, height: 250, borderRadius: 26, background: 'rgba(10,14,28,.92)', border: `1px solid ${C.red}55`, opacity: ramp(t, tAudio - 0.3, 0.3), transform: `translateY(${(1 - ramp(t, tAudio - 0.3, 0.4, EASE.out)) * 40}px)` }}>
        <div style={{ position: 'absolute', left: 26, top: 18, display: 'flex', alignItems: 'center', gap: 10, fontFamily: fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: '0.18em', color: C.red }}><Icon name="ph:hard-drive-bold" size={28} color={C.red} />TV LOCAL STORAGE</div>
        <div style={{ position: 'absolute', right: 26, top: 16, fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: t > tUp ? C.cyan : C.ink }}>{t > tUp ? `UPLOADING ${Math.round(done * 100)}%` : `${Math.min(NF, Math.max(0, Math.floor((t - tAudio + 0.15) / 0.07) + 1))} FILES`}</div>
        {t > tUp && <div style={{ position: 'absolute', left: 26, right: 26, top: 228, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.08)' }}><div style={{ width: `${done * 100}%`, height: '100%', borderRadius: 3, background: C.cyan, boxShadow: `0 0 12px ${C.cyan}` }} /></div>}
      </div>
      {/* files: drop into the tray, then fly to the cloud */}
      {Array.from({ length: NF }, (_, k) => {
        const s = slot(k);
        const ti = ramp(t, fileIn(k), 0.25, EASE.back);
        if (ti <= 0) return null;
        const to = ramp(t, fileOut(k), 0.55, EASE.inOut);
        if (to >= 1) return <div key={k} style={{ position: 'absolute', left: s.x - 30, top: s.y - 34, width: 60, height: 70, borderRadius: 8, border: '2px dashed rgba(140,170,230,.25)' }} />;
        const x = lerp(s.x, CLOUD.x, to), y = lerp(s.y, CLOUD.y, to) - Math.sin(to * Math.PI) * 220;
        return <div key={k} style={{ position: 'absolute', left: x, top: y + (1 - ti) * -120, transform: `translate(-50%,-50%) scale(${(0.5 + 0.5 * ti) * (1 - to * 0.6)}) rotate(${to * 30}deg)`, opacity: clamp(ti * 2) * (1 - ramp(t, fileOut(k) + 0.45, 0.1)) }}><Icon name="ph:file-audio-fill" size={68} color={to > 0 ? C.cyan : '#e8edf7'} glow={to > 0} /></div>;
      })}
      {t > tUp - 0.2 && (
        <div style={{ position: 'absolute', left: CLOUD.x, top: CLOUD.y, transform: `translate(-50%,-50%) scale(${cloudS * (1 + 0.06 * Math.sin(t * 14) * (done > 0 && done < 1 ? 1 : 0))})`, opacity: clamp(cloudS * 1.5) }}>
          <Icon name="ph:cloud-arrow-up-fill" size={150} color={C.cyan} glow />
        </div>
      )}
      <Pill x={880} y={420} at={tLater - 0.05} color={C.amber} center size={34}><Icon name="ph:clock-bold" size={28} color={C.ink} /> LATER</Pill>
    </AbsoluteFill>
  );
};

// ---------------- 3 · "Then it got worse."
const tThen = P(3, 'Then'), tWorse = P(3, 'worse');
export const sfx3: SfxEvent[] = [
  { t: B3 + 0.02, name: 'staticFx', vol: 0.18, dur: 0.25, note: 'cut to black' },
  { t: tThen - 0.03, name: 'typeKey', vol: 0.35 },
  { t: tWorse - 0.06, name: 'impactEpic', vol: 0.6, note: 'WORSE slam' }, { t: tWorse, name: 'glitchBreak', vol: 0.4 },
];
export const Beat3: React.FC = () => {
  const { t } = useTF();
  const r = rng(Math.round(t * 30));
  const shake = Math.max(0, 1 - (t - tWorse) / 0.5) * (t > tWorse ? 1 : 0);
  const sl = ramp(t, tWorse - 0.06, 0.18, EASE.in);
  const gl = t > tWorse && t < tWorse + 0.4;
  return (
    <AbsoluteFill style={{ background: '#020306', transform: `translate(${(r() - 0.5) * 28 * shake}px, ${(r() - 0.5) * 28 * shake}px)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,30,60,${0.35 * shake + 0.08}), transparent 60%)` }} />
      <div style={{ position: 'absolute', left: 540, top: 800, transform: 'translate(-50%,-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 76, color: C.ink, letterSpacing: '0.04em', opacity: ramp(t, tThen - 0.05, 0.15), whiteSpace: 'nowrap' }}>THEN IT GOT</div>
      {t > tWorse - 0.08 && (
        <div style={{ position: 'absolute', left: 540, top: 960, transform: `translate(-50%,-50%) scale(${3 - 2 * sl}) translateX(${gl ? (r() - 0.5) * 30 : 0}px) skewX(${gl ? (r() - 0.5) * 14 : 0}deg)`, opacity: sl, fontFamily: fonts.head, fontWeight: 900, fontSize: 196, color: C.red, letterSpacing: '-0.03em', whiteSpace: 'nowrap', textShadow: gl ? `${(r() - 0.5) * 30}px 0 rgba(51,225,255,.9), ${(r() - 0.5) * 30}px 0 rgba(255,255,255,.6), 0 0 60px ${C.red}` : `0 0 60px ${C.red}aa` }}>WORSE.</div>
      )}
      {gl && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: r() * 1920, height: 6 + r() * 40, background: `rgba(255,46,77,${0.15 + r() * 0.3})`, transform: `translateX(${(r() - 0.5) * 200}px)` }} />)}
    </AbsoluteFill>
  );
};

// ---------------- 4–5 · 38 devices → the neighbours' Wi-Fi → "WHY?"
const tScan = P(4, 'scanned'), t38 = P(4, 'thirty-eight'), tNet = PE(4, 'home network'), tPhones = P(4, 'Phones'), tWatches = P(4, 'Watches'), tPrinter = P(4, '3D printer');
const tNeigh = P(5, "neighbour's"), tWifi = P(5, 'Wi-Fi'), tWhy = P(5, 'Why would');
const PLAN = { x: 90, y: 420, w: 900, h: 820 }, PTV = { x: 540, y: 446 };
const NAMED: { x: number; y: number; icon: string; name: string; at: number }[] = [
  { x: 400, y: 690, icon: 'ph:device-mobile-bold', name: 'PHONE', at: tPhones },
  { x: 700, y: 640, icon: 'ph:watch-bold', name: 'WATCH', at: tWatches },
  { x: 230, y: 1150, icon: 'ph:printer-bold', name: '3D PRINTER', at: tPrinter },
];
const OTHER = ['ph:laptop-bold', 'ph:speaker-hifi-bold', 'ph:game-controller-bold', 'ph:lightbulb-bold', 'ph:security-camera-bold', 'tabler:fridge', 'ph:device-tablet-bold', 'ph:thermometer-simple-bold', 'ph:lightbulb-bold', 'ph:plug-bold', 'tabler:router'];
const DOTS = (() => {
  const out: { x: number; y: number; icon: string }[] = [];
  for (let i = 0; i < 35; i++) {
    const a = i * 2.39996, rr = 0.18 + ((i * 37) % 80) / 100;
    out.push({ x: 540 + Math.cos(a) * rr * 400, y: 830 + Math.sin(a) * rr * 370, icon: OTHER[i % OTHER.length] });
  }
  return out;
})();
const pinAt = (i: number) => t38 - 0.05 + i * ((tNet - t38 + 0.1) / 38);
const NEIGH = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].map(([dx, dy], i) => ({ x: 540 + dx * 1060, y: 830 + dy * 980, ssid: ['NETGEAR-5G', 'Smith_Home', 'TP-Link_2.4', 'Apt-3B', 'Home_Guest', 'Linksys_88', 'Casa_WiFi', 'DIRECT-HP'][i] }));
const detectAt = (n: { x: number; y: number }) => tNeigh - 0.15 + Math.hypot(n.x - PTV.x, n.y - PTV.y) / 2600;
export const sfx45: SfxEvent[] = [
  { t: B4 - 0.05, name: 'whooshDeep', vol: 0.4, note: 'plan zooms in' },
  { t: tScan - 0.05, name: 'sweepSciFi', vol: 0.4, note: 'radar' },
  { t: t38 - 0.05, name: 'compute', vol: 0.28, dur: tNet - t38 + 0.2, note: 'pins pop' },
  ...[0, 6, 12, 18, 24, 30, 36].map((i) => ({ t: pinAt(i), name: 'popUi' as const, vol: 0.2 })),
  { t: tNet + 0.05, name: 'impactZoom', vol: 0.45, note: '38 lands' },
  ...NAMED.map((n) => ({ t: n.at - 0.08, name: 'zoomIn' as const, vol: 0.3, note: `focus ${n.name}` })),
  ...NAMED.map((n) => ({ t: n.at, name: 'select' as const, vol: 0.4 })),
  { t: tNeigh - 0.55, name: 'zoomOut', vol: 0.55, note: 'pull out over the street' },
  { t: tNeigh - 0.1, name: 'sweepDigital', vol: 0.35, note: 'scan ring' },
  ...NEIGH.slice(0, 8).filter((_, i) => i % 2 === 0).map((n) => ({ t: detectAt(n), name: 'bleepHi' as const, vol: 0.18 })),
  { t: tWhy - 0.08, name: 'impactBig', vol: 0.55, note: 'WHY?' },
];
const MiniPlan: React.FC<{ x: number; y: number; dim?: boolean }> = ({ x, y, dim }) => (
  <svg style={{ position: 'absolute', left: x - 450, top: y - 410, overflow: 'visible' }} width="900" height="820">
    <rect x="0" y="0" width="900" height="820" rx="18" fill={dim ? '#0a1121' : '#0b1324'} stroke={dim ? '#24345a' : '#3a5488'} strokeWidth="10" />
    <path d="M0 380 H900 M470 380 V820 M0 620 H470" stroke={dim ? '#24345a' : '#3a5488'} strokeWidth="10" fill="none" strokeDasharray={dim ? undefined : '0'} />
  </svg>
);
export const Beat45: React.FC = () => {
  const { f, fps, t } = useTF();
  const cam = [
    { t: B4, x: 540, y: 920, z: 1.3 },
    { t: tScan + 0.2, x: 540, y: 940, z: 1.0, e: EASE.out },
    { t: tPhones - 0.05, x: 470, y: 840, z: 1.22, e: EASE.inOut },
    { t: tWatches - 0.05, x: 650, y: 800, z: 1.22, e: EASE.inOut },
    { t: tPrinter - 0.05, x: 330, y: 1060, z: 1.22, e: EASE.inOut },
    { t: tNeigh - 0.55, x: 540, y: 940, z: 1.0, e: EASE.inOut },
    { t: tWifi + 0.25, x: 540, y: 1010, z: 0.36, e: EASE.inOut },
    { t: B6 + 0.3, x: 540, y: 1010, z: 0.33, e: EASE.smooth },
  ];
  const count = Math.min(38, Math.max(0, Math.floor((t - t38 + 0.05) / ((tNet - t38 + 0.1) / 38)) + 1));
  const sweep = (t - tScan) * 260;
  const ringR = (t - tNeigh + 0.15) * 2600;
  const why = springAt(f, fps, tWhy - 0.05, { damping: 10, stiffness: 160 });
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <BgMesh a={C.blue} b={C.cyan} />
      <Camera keys={cam}>
        <Layer depth={0.6}><Grid opacity={0.18} perspective={false} /></Layer>
        <Layer depth={1}>
          {NEIGH.map((n, i) => {
            const det = t > detectAt(n);
            return (
              <React.Fragment key={i}>
                <div style={{ opacity: ramp(t, tNeigh - 0.6, 0.6) }}><MiniPlan x={n.x} y={n.y} dim /></div>
                <NeighbourTag x={n.x} y={n.y} ssid={n.ssid} on={ramp(t, tNeigh - 0.3 + i * 0.04, 0.3)} det={det} />
              </React.Fragment>
            );
          })}
          <HousePlan />
          {/* radar sweep from the TV */}
          {t > tScan - 0.1 && t < tNeigh && (
            <div style={{ position: 'absolute', left: PLAN.x, top: PLAN.y, width: PLAN.w, height: PLAN.h, borderRadius: 18, overflow: 'hidden', opacity: ramp(t, tScan - 0.1, 0.3) * (1 - ramp(t, tNeigh - 0.4, 0.3)) }}><div style={{ position: 'absolute', left: PTV.x - PLAN.x - 1000, top: PTV.y - PLAN.y - 1000, width: 2000, height: 2000, borderRadius: '50%', background: `conic-gradient(from ${sweep}deg, rgba(51,225,255,0) 0deg, rgba(51,225,255,.24) 38deg, rgba(51,225,255,0) 39deg)` }} /></div>
          )}
          {/* scan ring that reaches the neighbours */}
          {t > tNeigh - 0.15 && ringR < 3200 && <div style={{ position: 'absolute', left: PTV.x - ringR, top: PTV.y - ringR, width: ringR * 2, height: ringR * 2, borderRadius: '50%', border: `${8}px solid ${C.red}`, opacity: 0.8 * (1 - ringR / 3200), boxShadow: `0 0 40px ${C.red}` }} />}
          {DOTS.map((d, i) => <DevicePin key={i} x={d.x} y={d.y} icon={d.icon} s={0.62 * clamp(springAt(f, fps, pinAt(i + 3), { damping: 12, stiffness: 200 }))} color={C.cyan} />)}
          {NAMED.map((n, i) => {
            const s = springAt(f, fps, pinAt(i), { damping: 12, stiffness: 200 });
            const hi = ramp(t, n.at - 0.05, 0.3, EASE.back);
            return (
              <React.Fragment key={n.name}>
                <DevicePin x={n.x} y={n.y} icon={n.icon} s={clamp(s) * (0.75 + 0.55 * hi)} color={hi > 0 ? C.red : C.cyan} ring={hi > 0 ? ((t - n.at) * 1.4) % 1 : 0} />
                {hi > 0 && <PinLabel x={n.x} y={n.y - 70} text={n.name} u={hi} />}
              </React.Fragment>
            );
          })}
        </Layer>
      </Camera>
      {/* device counter (screen space) */}
      <div style={{ position: 'absolute', left: 540, top: 330, transform: 'translate(-50%,-50%)', textAlign: 'center', padding: '14px 46px 6px', borderRadius: 28, background: 'rgba(3,5,11,.72)', border: '1px solid rgba(140,170,230,.18)', backdropFilter: 'blur(8px)', opacity: ramp(t, tScan, 0.3) * (1 - ramp(t, tNeigh - 0.4, 0.3)) }}>
        <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: '0.3em', color: C.dim }}>DEVICES FOUND</div>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 150, lineHeight: 1, color: count >= 38 ? C.red : C.ink, textShadow: count >= 38 ? `0 0 50px ${C.red}88` : undefined, transform: `scale(${1 + 0.12 * (ramp(t, tNet + 0.05, 0.08) - ramp(t, tNet + 0.13, 0.3))})`, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
      </div>
      <Pill x={540} y={300} at={tNeigh - 0.2} out={tWhy - 0.15} color={C.red} center size={34}><Icon name="ph:wifi-high-bold" size={32} color={C.ink} /> NEIGHBOURS' WI-FI · DETECTED</Pill>
      {t > tWhy - 0.1 && (
        <AbsoluteFill style={{ background: `rgba(3,5,11,${0.55 * clamp(why)})` }}>
          <div style={{ position: 'absolute', left: 540, top: 820, transform: `translate(-50%,-50%) scale(${0.3 + 0.7 * why}) rotate(${(1 - why) * -8}deg)`, opacity: clamp(why * 1.5), fontFamily: fonts.head, fontWeight: 900, fontSize: 236, color: C.red, letterSpacing: '-0.03em', textShadow: `0 0 70px ${C.red}99, 0 12px 40px rgba(0,0,0,.9)` }}>WHY?</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
const HousePlan: React.FC = () => {
  const { t } = useTF();
  const { x, y, w, h } = PLAN;
  const furn = (fx: number, fy: number, fw: number, fh: number, r = 10) => <rect x={fx} y={fy} width={fw} height={fh} rx={r} fill="#16213a" stroke="#2a3a60" strokeWidth="2" />;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width="1080" height="1920">
      <defs><pattern id="sfloor" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#0b1324" /><path d="M0 40 L40 0" stroke="#111c33" strokeWidth="2" /></pattern></defs>
      <rect x={x} y={y} width={w} height={h} rx="18" fill="url(#sfloor)" />
      <rect x={x} y={y} width={w} height={h} rx="18" fill="none" stroke="#3a5488" strokeWidth="10" />
      <path d={`M${x} ${y + 380} H${x + 330} M${x + 450} ${y + 380} H${x + w} M${x + 470} ${y + 380} V${y + 560} M${x + 470} ${y + 660} V${y + h} M${x} ${y + 620} H${x + 180} M${x + 290} ${y + 620} H${x + 470}`} stroke="#3a5488" strokeWidth="10" fill="none" strokeLinecap="round" />
      {furn(x + 210, y + 250, 480, 90, 30)} {furn(x + 330, y + 150, 240, 60, 14)}
      {furn(x + 30, y + 420, 200, 150, 12)} {furn(x + 520, y + 420, 340, 70)} {furn(x + 800, y + 500, 70, 160)} {furn(x + 560, y + 600, 200, 140, 16)}
      {furn(x + 40, y + 680, 260, 90)}
      {[['LIVING ROOM', x + 30, y + 360], ['BEDROOM', x + 30, y + 600], ['KITCHEN', x + 500, y + 800], ['OFFICE', x + 30, y + 800]].map(([l, lx, ly]) => <text key={l as string} x={lx as number} y={ly as number} fill="#4a5d86" style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.2em' }}>{l}</text>)}
      <circle cx={PTV.x} cy={PTV.y} r="110" fill={C.red} opacity={0.18 + 0.1 * Math.sin(t * 3.4)} style={{ filter: 'blur(30px)' }} />
      <rect x={PTV.x - 150} y={PTV.y - 26} width="300" height="20" rx="5" fill="#0d1220" stroke="#5b6f9c" strokeWidth="2" />
      <circle cx={PTV.x} cy={PTV.y - 4} r="8" fill={C.red} />
    </svg>
  );
};
const PinLabel: React.FC<{ x: number; y: number; text: string; u: number }> = ({ x, y, text, u }) => {
  const cam = useCam();
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-100%) scale(${u / Math.max(0.5, cam.z)})`, transformOrigin: '50% 100%', padding: '10px 20px', borderRadius: 12, background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: '#fff', whiteSpace: 'nowrap', boxShadow: `0 0 30px ${C.red}88` }}>{text}</div>;
};
const NeighbourTag: React.FC<{ x: number; y: number; ssid: string; on: number; det: boolean }> = ({ x, y, ssid, on, det }) => {
  const cam = useCam();
  if (on <= 0) return null;
  const k = 1 / Math.max(0.3, cam.z);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${on * k * 0.85})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: on }}>
      <Icon name="ph:wifi-high-bold" size={70} color={det ? C.red : C.cyan} glow />
      <div style={{ padding: '8px 18px', borderRadius: 12, background: det ? C.red : 'rgba(8,12,24,.9)', border: `2px solid ${det ? C.red : C.cyan}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 32, color: '#fff', whiteSpace: 'nowrap' }}>{ssid}</div>
    </div>
  );
};
