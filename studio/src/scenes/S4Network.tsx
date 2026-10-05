// S4 · What They Found: The Network Scan — continues on the same house plan from S3:
// radar sweep, "ten? twenty?" -> 38 devices, neighbours' Wi-Fi over real aerial footage,
// "why would a TV need that?", and the data flowing to LG Ad Solutions.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust } from '../components/Backdrop';
import { Chapter, useEnter } from '../components/Blocks';
import { Kinetic, Label } from '../components/Kinetic';
import { Pill, Rings } from '../components/UI';
import { House, HOUSE, HOUSE_TV, DEVICES, DevicePin } from '../components/House';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, PE, S0, S1, EASE, ramp, clamp, lerp, springAt } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(4), Z = S1(4);
const tWifi = P(20, 'same Wi-Fi'), tPackets = P(20, 'packet captures'), tScanned = P(20, 'repeatedly scanned');
const tHowMany = P(21, 'how many'), tTen = P(21, 'Ten'), tTwenty = P(21, 'Twenty'), t38 = P(21, 'thirty-eight');
const NAMED: [string, number][] = [['Smartphone', P(21, 'Smartphones')], ['Smartwatch', P(21, 'Smartwatches')], ['3D printer', P(21, '3D printer')], ['Air purifier', P(21, 'air purifier')], ['Thermostat', P(21, 'thermostats')]];
const tNames = P(22, 'names of nearby'), tNeigh = P(22, 'including your'), tSignal = P(22, 'signal strength'), tLoc = P(22, 'location data');
const tWhy = C0(23), tHold = P(23, 'Hold that thought'), tIndustry = P(23, 'entire industry');
const tAd = P(24, 'LG Ad Solutions'), tAdv = P(24, 'advertising business');

export const s4NoCaptions: [number, number][] = [[tTen - 0.2, t38 + 1.0], [tWhy - 0.1, PE(23, 'thought') + 0.2]];

export const s4Sfx: SfxEvent[] = [
  { t: tWifi - 0.05, name: 'notify', vol: 0.3, note: 'wifi badge' },
  { t: tPackets - 0.1, name: 'techSlide', vol: 0.35 },
  { t: tScanned - 0.1, name: 'scan', vol: 0.45, note: 'radar sweep starts' }, { t: tScanned + 1.6, name: 'scan', vol: 0.3 },
  { t: tHowMany - 0.05, name: 'tone', vol: 0.3 },
  { t: tTen - 0.03, name: 'typeHard', vol: 0.45 }, { t: tTwenty - 0.03, name: 'typeHard', vol: 0.45 },
  { t: t38 - 0.1, name: 'impactBig', vol: 0.6, note: '38!' },
  ...Array.from({ length: 12 }, (_, k) => ({ t: t38 + 0.05 + k * 0.07, name: 'popElectric' as const, vol: 0.12 })),
  ...NAMED.map(([, at]) => ({ t: at - 0.05, name: 'popUi' as const, vol: 0.35 })),
  { t: C0(22) - 0.25, name: 'whooshBig', vol: 0.45, note: 'pull out to the neighbourhood' },
  { t: tNames, name: 'scan', vol: 0.3 },
  ...[0, 1, 2, 3, 4].map((k) => ({ t: tNames + 0.3 + k * 0.3, name: 'bleepHi' as const, vol: 0.18 })),
  { t: tLoc - 0.05, name: 'lockQuick', vol: 0.35, note: 'location pins' },
  { t: tWhy - 0.1, name: 'bassHit', vol: 0.4 }, { t: tHold - 0.05, name: 'typing', vol: 0.3, dur: 1.2 },
  { t: C0(24) - 0.2, name: 'swoosh', vol: 0.4 }, { t: tAd - 0.1, name: 'whooshElectric', vol: 0.45, note: 'data stream to ad server' },
  { t: tAdv - 0.05, name: 'impact', vol: 0.4 },
];

const SSIDS = [
  { x: 420, y: 330, n: 'NETGEAR_7F2A', b: 3 }, { x: 1440, y: 280, n: 'Khan_Family_5G', b: 4 }, { x: 760, y: 700, n: 'TP-Link_8F2A', b: 2 },
  { x: 1320, y: 640, n: 'HOME-4C1E', b: 3 }, { x: 260, y: 640, n: "Sarah's iPhone", b: 1 }, { x: 1040, y: 430, n: 'FiberHome_22', b: 2 },
];

export const S4Network: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const houseOn = t < C0(22) + 0.1;
  const sweepA = Math.min(ramp(t, tScanned - 0.2, 0.5), 1 - ramp(t, C0(22) - 0.3, 0.3));
  const cam = [
    { t: A - 0.6, x: 960, y: 540, z: 0.9 }, { t: tPackets, x: 960, y: 540, z: 0.98, e: EASE.smooth },
    { t: tHowMany, x: 1100, y: 560, z: 0.9, e: EASE.inOut }, { t: t38 - 0.1, x: 1120, y: 540, z: 0.86, e: EASE.inOut },
    { t: t38 + 0.35, x: 1120, y: 540, z: 0.89, e: EASE.back }, { t: C1(21), x: 1120, y: 540, z: 0.92, e: EASE.smooth },
    { t: C0(22) + 0.1, x: 960, y: 540, z: 0.55, e: EASE.in },
  ];
  // 38 count, with "10? 20?" guesses first
  const count = Math.round(38 * EASE.out(clamp((t - t38) / 1.0)));
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.cyan} />
      {houseOn && (
        <AbsoluteFill style={{ opacity: 1 - ramp(t, C0(22) - 0.15, 0.25) }}>
          <Camera keys={cam}>
            <Layer depth={0.6}><Grid opacity={0.2} /></Layer>
            <Layer depth={1}>
              <div style={{ position: 'absolute', inset: 0, transform: 'perspective(1800px) rotateX(18deg)', transformOrigin: '50% 60%' }}>
                <House led={1} />
                {/* radar sweep from the TV */}
                {sweepA > 0 && <div style={{ position: 'absolute', left: HOUSE_TV.x - 1100, top: HOUSE_TV.y - 1100, width: 2200, height: 2200, borderRadius: '50%', background: `conic-gradient(from ${t * 140}deg, rgba(51,225,255,0) 0deg, rgba(51,225,255,.0) 300deg, rgba(51,225,255,.32) 358deg, rgba(51,225,255,0) 360deg)`, opacity: sweepA, clipPath: `inset(1100px 0 0 0)` }} />}
                <Rings x={HOUSE_TV.x} y={HOUSE_TV.y} at={tScanned} out={C0(22) - 0.2} color={C.cyan} max={1300} count={3} speed={0.45} />
                {/* device pins */}
                {DEVICES.map((d, i) => {
                  const named = d.name ? NAMED.find(([n]) => n === d.name) : null;
                  const at = t38 + (named ? 0 : 0.05) + i * 0.035;
                  const s = springAt(f, fps, at, { damping: 9, stiffness: 180 });
                  const ring = ((t - at) * 0.9 + i * 0.13) % 1;
                  const lit = named && t > named[1] - 0.05;
                  return <DevicePin key={i} x={d.x} y={d.y} icon={d.icon} s={s * (1 - ramp(t, C0(22) - 0.3, 0.3))} color={lit ? C.red : C.cyan} ring={ring} />;
                })}
          {/* labels for the named devices (inside the tilted plan so they follow the camera) */}
                {NAMED.map(([n, at]) => {
                  const d = DEVICES.find((x) => x.name === n)!;
                  const e = ramp(t, at - 0.05, 0.35, EASE.back) * (1 - ramp(t, C1(21) + 0.3, 0.3));
                  if (e <= 0) return null;
                  return <div key={n} style={{ position: 'absolute', left: d.x, top: d.y - 52, transform: `translate(-50%,-100%) scale(${e})`, padding: '8px 16px', borderRadius: 10, background: 'rgba(40,6,14,.92)', border: `2px solid ${C.red}`, fontFamily: fonts.body, fontWeight: 700, fontSize: 24, color: C.ink, whiteSpace: 'nowrap', boxShadow: `0 0 20px ${C.red}55` }}>{n}</div>;
                })}
                {/* wifi badge over the router */}
                <div style={{ position: 'absolute', left: 300 - 40, top: 600 - 110, opacity: ramp(t, tWifi - 0.1, 0.4) * (1 - ramp(t, t38, 0.3)) }}><Icon name="ph:wifi-high-bold" size={80} color={C.cyan} glow /></div>
              </div>
            </Layer>
          </Camera>
          <Pill x={120} y={150} at={tPackets - 0.1} out={tHowMany - 0.2} color={C.cyan}><Icon name="ph:broadcast-bold" size={30} color={C.ink} />Scanning the home network…</Pill>
          {/* the guess-and-count */}
          {t > tTen - 0.1 && t < C1(21) + 0.4 && (
            <div style={{ position: 'absolute', right: 120, top: 140, textAlign: 'right', opacity: 1 - ramp(t, C1(21), 0.3) }}>
              <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: '0.22em', color: C.dim }}>DEVICES FOUND</div>
              <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 210, lineHeight: 1, color: t > t38 ? C.red : C.ink, textShadow: t > t38 ? `0 0 50px ${C.red}88` : undefined, fontVariantNumeric: 'tabular-nums', transform: `scale(${t > t38 ? 1 + 0.15 * (1 - ramp(t, t38, 0.4)) : 1})`, transformOrigin: '100% 50%' }}>
                {t < tTwenty ? '10?' : t < t38 ? '20?' : count}
              </div>
            </div>
          )}
          {/* smartwatch footage inset at "smartwatches" */}
          <Footage src="stock/smartwatch.mp4" at={NAMED[1][1] - 0.1} out={NAMED[3][1]} x={110} y={680} w={420} h={236} radius={22} enter="scale" label="SMARTWATCH" />
        </AbsoluteFill>
      )}
      {/* the neighbourhood: real aerial footage + Wi-Fi labels */}
      {t > C0(22) - 0.35 && t < Z + 0.5 && (
        <AbsoluteFill style={{ opacity: ramp(t, C0(22) - 0.35, 0.35) }}>
          <Footage src="stock/neighborhood-night.mp4" at={C0(22) - 0.35} out={C1(23) + 0.3} zoom={[1.15, 1.02]} pan={[0, 0]} enter="fade" desat={0.1} tint="#0a1a40" />
          {SSIDS.map((s, i) => <Ssid key={i} {...s} at={tNames + 0.2 + i * 0.3} tSignal={tSignal} tLoc={tLoc} out={tWhy - 0.1} />)}
          <Pill x={960} y={140} at={tNames} out={tWhy - 0.2} color={C.cyan} center><Icon name="ph:wifi-high-bold" size={30} color={C.ink} />Nearby Wi-Fi names · signal strength · location</Pill>
          {t > tWhy - 0.3 && <AbsoluteFill style={{ background: `rgba(3,5,11,${0.72 * ramp(t, tWhy - 0.3, 0.4)})` }} />}
          <Kinetic text="Why would a TV need | your *neighbour's* Wi-Fi?" at={tWhy} out={tHold - 0.1} y={520} size={92} weight={900} anim="pop" stagger={0.05} />
          <Kinetic text="Hold that thought…" at={tHold} out={C1(23)} y={520} size={80} anim="type" />
          {t > tHold && t < C1(23) && <div style={{ position: 'absolute', left: 960, top: 640, transform: 'translateX(-50%)', opacity: ramp(t, tHold + 0.4, 0.4) }}><Icon name="ph:push-pin-bold" size={70} color={C.amber} glow /></div>}
        </AbsoluteFill>
      )}
      {/* data to LG Ad Solutions */}
      {t > C0(24) - 0.35 && <AdFlow />}
      <Dust count={36} opacity={0.3} />
      <Chapter n={4} title="What They Found · The Network Scan" at={A + 0.2} out={Z - 0.6} color={C.cyan} />
      <Grade />
    </AbsoluteFill>
  );
};

const Ssid: React.FC<{ x: number; y: number; n: string; b: number; at: number; tSignal: number; tLoc: number; out: number }> = ({ x, y, n, b, at, tSignal, tLoc, out }) => {
  const e = useEnter(at, out, { rise: 30, scale: 0.3 });
  if (!e.visible) return null;
  const sig = ramp(e.t, tSignal - 0.1, 0.4), loc = ramp(e.t, tLoc - 0.1 + (x % 3) * 0.08, 0.4, EASE.back);
  return (
    <div style={{ position: 'absolute', left: x, top: y, ...e.style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 12, background: 'rgba(5,10,22,.88)', border: `2px solid ${C.cyan}`, boxShadow: `0 0 26px ${C.cyan}44`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: C.ink, whiteSpace: 'nowrap' }}>
        <Icon name="ph:wifi-high-bold" size={26} color={C.cyan} />{n}
        <span style={{ display: 'inline-flex', gap: 3, alignItems: 'flex-end', marginLeft: 6, opacity: sig }}>{[1, 2, 3, 4].map((k) => <span key={k} style={{ width: 6, height: 6 + k * 5, borderRadius: 2, background: k <= b ? C.green : '#2a3346' }} />)}</span>
      </div>
      <div style={{ position: 'absolute', left: 14, top: 58, transform: `scale(${loc})`, transformOrigin: '50% 0' }}><Icon name="ph:map-pin-fill" size={40} color={C.red} glow /></div>
    </div>
  );
};

const AdFlow: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = ramp(t, C0(24) - 0.35, 0.35);
  const home = { x: 420, y: 560 }, srv = { x: 1500, y: 520 };
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BgMesh a={C.blue} b={C.amber} />
      <Grid opacity={0.25} />
      {/* home */}
      <div style={{ position: 'absolute', left: home.x - 120, top: home.y - 120, width: 240, height: 240, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(51,225,255,.08)', border: `2px solid ${C.cyan}66`, transform: `scale(${0.8 + 0.2 * a})` }}><Icon name="ph:house-line-bold" size={140} color={C.cyan} /></div>
      <Label x={home.x} y={home.y + 150} at={C0(24)} align="center" color={C.dim}>your home network</Label>
      {/* stream of data packets along an arc */}
      {Array.from({ length: 24 }, (_, i) => {
        const u = ((t - tAd + 0.3) * 0.55 + i / 24) % 1;
        if (t < tAd - 0.3) return null;
        const x = lerp(home.x + 120, srv.x - 140, u), y = lerp(home.y, srv.y, u) - Math.sin(u * Math.PI) * 260;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 18, height: 18, borderRadius: 5, background: i % 3 ? C.cyan : C.amber, boxShadow: `0 0 14px ${C.cyan}`, opacity: Math.sin(u * Math.PI) }} />;
      })}
      {/* ad server */}
      <div style={{ position: 'absolute', left: srv.x - 150, top: srv.y - 170, width: 300, height: 340, borderRadius: 30, background: 'linear-gradient(160deg,#1d2338,#0a0d16)', border: `2px solid ${C.amber}88`, boxShadow: `0 0 60px ${C.amber}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `scale(${0.8 + 0.2 * ramp(t, tAd - 0.2, 0.5, EASE.back)})`, opacity: ramp(t, tAd - 0.2, 0.3) }}>
        <Icon name="ph:hard-drives-bold" size={120} color={C.amber} />
        <div style={{ display: 'flex', gap: 8 }}>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ width: 10, height: 10, borderRadius: '50%', background: Math.sin(t * 9 + k) > 0 ? C.green : C.red }} />)}</div>
      </div>
      <div style={{ position: 'absolute', left: srv.x, top: srv.y + 200, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', opacity: ramp(t, tAd, 0.4) }}>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 50, color: C.ink }}>LG Ad Solutions</div>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: '0.2em', color: C.amber, opacity: ramp(t, tAdv - 0.1, 0.4) }}>LG'S ADVERTISING BUSINESS</div>
      </div>
    </AbsoluteFill>
  );
};
