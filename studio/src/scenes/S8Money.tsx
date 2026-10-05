// S8 · Follow the Money — the neighbour Wi-Fi callback becomes an ad profile,
// the ad follows you from TV to phone, the cheap-TV price tag, Vizio's 2021 profit mix,
// LG's 360M reach, and "maybe you are the product".
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust, Glow } from '../components/Backdrop';
import { Chapter, useEnter } from '../components/Blocks';
import { Kinetic } from '../components/Kinetic';
import { Flash } from '../components/UI';
import { TV } from '../components/TV';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, S0, S1, EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(8), Z = S1(8);
const tAnswer = P(38, 'the answer'), tLoc = P(38, 'Location and'), tWho = P(38, 'who you are'), tWhere = P(38, 'where you live'), tPhone = P(38, 'which phone'), tLets = P(38, 'That lets'), tFollow = P(38, 'follow you');
const tPart = C0(39), tDeal = P(39, 'cheap 65-inch'), tVizio = P(39, 'In 2021'), tProfit = P(39, 'more profit'), tSelling = P(39, 'selling the TVs'), tLGad = P(39, 'ad business'), t360 = P(39, 'three hundred'), tUS = P(39, 'in the US');
const tProduct = C0(40), tYou = P(40, 'Maybe you');

export const s8NoCaptions: [number, number][] = [[tAnswer - 0.1, tLoc - 0.3], [tProduct - 0.1, Z]];

const SSIDS: [string, number, number][] = [['NETGEAR-5G', 330, 300], ['Smith_Home', 1420, 250], ['TP-Link_2.4', 1560, 640], ['DIRECT-HP-Print', 260, 690], ['Apt-3B-WiFi', 900, 200]];
const ROWS: [string, string, string, number][] = [
  ['ph:identification-card-bold', 'Who you are', 'Household · 2 adults · 1 teen', tWho],
  ['ph:map-pin-bold', 'Where you live', 'Home location · street level', tWhere],
  ['ph:device-mobile-bold', 'Which phone is yours', 'Phone ID ↔ TV linked', tPhone],
];

export const s8Sfx: SfxEvent[] = [
  { t: A + 0.15, name: 'whooshDeep', vol: 0.4, note: 'neighbourhood footage' },
  ...SSIDS.map((_, i) => ({ t: A + 0.6 + i * 0.32, name: 'popUi' as const, vol: 0.22 })),
  { t: tAnswer - 0.08, name: 'impact', vol: 0.5, note: 'ANSWER slam' },
  { t: tLoc - 0.3, name: 'swoosh', vol: 0.4, note: 'profile card' },
  { t: tLoc + 0.1, name: 'dataLoad', vol: 0.3, dur: 2.4 },
  ...ROWS.map(([, , , at]) => ({ t: at - 0.05, name: 'select' as const, vol: 0.35 })),
  { t: tPhone + 0.9, name: 'lockQuick', vol: 0.4, note: 'profile linked' },
  { t: tLets - 0.3, name: 'whooshQuick', vol: 0.35 },
  { t: tFollow - 0.05, name: 'swooshSlow', vol: 0.4, note: 'ad flies to phone' }, { t: tFollow + 0.75, name: 'notify', vol: 0.45 },
  { t: tPart - 0.3, name: 'zoomAir', vol: 0.4 }, { t: tDeal - 0.05, name: 'pop', vol: 0.4, note: 'price tag' }, { t: tDeal + 0.25, name: 'chime', vol: 0.25 },
  { t: tVizio - 0.25, name: 'sweep', vol: 0.4, note: 'chart' }, { t: tVizio + 0.5, name: 'techSlide', vol: 0.3, note: 'TV bar' },
  { t: tProfit - 0.05, name: 'riser', vol: 0.35, dur: 1.2 }, { t: tProfit + 0.9, name: 'impactZoom', vol: 0.45, note: 'ads bar overtakes' },
  { t: tSelling - 0.05, name: 'glassHit', vol: 0.3 },
  { t: tLGad - 0.2, name: 'whooshDeep', vol: 0.35 }, { t: tLGad + 0.2, name: 'compute', vol: 0.3, dur: tUS - tLGad - 0.3 }, { t: tUS - 0.05, name: 'impactBig', vol: 0.5, note: '360M lands' },
  { t: tProduct - 0.12, name: 'whooshQuick', vol: 0.4 }, { t: tYou - 0.08, name: 'impactEpic', vol: 0.55, note: 'you are the product' }, { t: tYou + 0.2, name: 'scan', vol: 0.3 },
];

export const S8Money: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill>
      <BgMesh a={C.violet} b={C.red} />
      <Grid opacity={0.14} perspective={false} />
      {t < tLoc + 0.1 && <Callback />}
      {t > tLoc - 0.45 && t < tLets + 0.1 && <Profile />}
      {t > tLets - 0.45 && t < tPart + 0.1 && <AdFollow />}
      {t > tPart - 0.45 && t < tVizio + 0.1 && <PriceTag />}
      {t > tVizio - 0.45 && t < tLGad + 0.1 && <Chart />}
      {t > tLGad - 0.45 && t < tProduct + 0.1 && <Reach />}
      {t > tProduct - 0.3 && <Product />}
      <Dust count={30} opacity={0.28} />
      <Chapter n={8} title="Follow the Money" at={A + 0.3} out={Z - 0.6} color={C.amber} />
      <Grade />
    </AbsoluteFill>
  );
};

// cue 38 opening: the neighbourhood, Wi-Fi names floating, "Here's the answer."
const Callback: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const out = 1 - ramp(t, tLoc - 0.35, 0.3, EASE.in);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Footage src="stock/neighborhood-night.mp4" at={A - 0.3} out={tLoc} zoom={[1.06, 1.16]} enter="fade" desat={0.3} />
      <AbsoluteFill style={{ background: `rgba(3,5,11,${0.25 + 0.4 * ramp(t, tAnswer - 0.3, 0.4)})` }} />
      {SSIDS.map(([name, x, y], i) => {
        const s = springAt(f, fps, A + 0.6 + i * 0.32, { damping: 12, stiffness: 170 });
        const bob = Math.sin(t * 1.4 + i) * 8;
        return <div key={name} style={{ position: 'absolute', left: x, top: y + bob, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * s})`, opacity: clamp(s * 1.4) * (1 - 0.5 * ramp(t, tAnswer - 0.2, 0.3)), display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderRadius: 14, background: 'rgba(8,12,24,.82)', border: `1px solid ${C.cyan}55`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: C.ink, boxShadow: `0 0 30px ${C.cyan}22` }}><Icon name="ph:wifi-high-bold" size={30} color={C.cyan} />{name}</div>;
      })}
      <Kinetic text="Here's the *answer.*" at={tAnswer - 0.05} out={tLoc - 0.4} y={540} size={130} weight={900} anim="slam" stagger={0.08} accent={C.amber} />
    </AbsoluteFill>
  );
};

// the ad profile assembles from location + nearby devices
const Profile: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const card = useEnter(tLoc - 0.3, tLets - 0.3, { rise: 70 });
  const inputs: [string, string, number][] = [['ph:map-pin-bold', 'Location', 380], ['ph:wifi-high-bold', 'Nearby Wi-Fi', 560], ['ph:devices-bold', 'Nearby devices', 740]];
  const done = ramp(t, tPhone + 0.85, 0.3, EASE.back);
  const ex = ramp(t, tLets - 0.35, 0.3, EASE.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - ex }}>
      {/* inputs on the left with data streaming into the card */}
      {inputs.map(([ic, label, y], i) => {
        const s = springAt(f, fps, tLoc + i * 0.25, { damping: 13, stiffness: 160 });
        return (
          <React.Fragment key={label}>
            <div style={{ position: 'absolute', left: 110, top: y - 50, width: 360, height: 100, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', borderRadius: 20, background: 'rgba(12,18,34,.9)', border: '1px solid rgba(140,170,230,.25)', transform: `translateX(${(1 - s) * -80}px)`, opacity: clamp(s * 1.4), fontFamily: fonts.body, fontWeight: 700, fontSize: 28, color: C.ink }}><Icon name={ic} size={44} color={C.cyan} />{label}</div>
            {s > 0.5 && Array.from({ length: 5 }, (_, k) => {
              const u = ((t - tLoc) * 0.9 + k / 5 + i * 0.13) % 1;
              return <div key={k} style={{ position: 'absolute', left: lerp(470, 690, u), top: lerp(y, 540, u) - 5, width: 10, height: 10, borderRadius: 5, background: C.cyan, opacity: Math.sin(u * Math.PI) * 0.9, boxShadow: `0 0 12px ${C.cyan}` }} />;
            })}
          </React.Fragment>
        );
      })}
      {card.visible && (
        <div style={{ position: 'absolute', left: 700, top: 210, width: 1080, padding: '40px 48px', borderRadius: 30, background: 'linear-gradient(160deg, rgba(26,20,52,.94), rgba(8,10,22,.96))', border: `1px solid ${C.violet}66`, boxShadow: '0 60px 140px rgba(0,0,0,.6)', ...card.style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ width: 130, height: 130, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, ${C.violet}66, #120c26)`, border: `3px solid ${C.violet}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${C.violet}55` }}><Icon name="ph:user-bold" size={80} color={C.ink} /></div>
            <div>
              <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: '0.22em', color: C.violet }}>AD PROFILE · BUILT FROM YOUR TV</div>
              <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 50, color: C.ink, marginTop: 6 }}>VIEWER #048213</div>
            </div>
            <div style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: 12, border: `3px solid ${done > 0 ? C.red : 'rgba(140,170,230,.3)'}`, color: done > 0 ? C.red : C.dim, fontFamily: fonts.head, fontWeight: 900, fontSize: 30, transform: `scale(${done > 0 ? 1.6 - 0.6 * done : 1}) rotate(${done > 0 ? -6 : 0}deg)`, opacity: 0.4 + 0.6 * Math.max(done, 0.0) }}>{done > 0 ? 'MATCHED' : 'BUILDING…'}</div>
          </div>
          <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {ROWS.map(([ic, k, v, at]) => {
              const u = ramp(t, at - 0.05, 0.45, EASE.out);
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '18px 24px', borderRadius: 18, background: u > 0 ? `rgba(139,107,255,${0.08 + 0.12 * (1 - ramp(t, at + 0.4, 0.6))})` : 'rgba(255,255,255,.03)', border: '1px solid rgba(140,170,230,.14)' }}>
                  <Icon name={ic} size={46} color={u > 0 ? C.amber : '#3a4a70'} />
                  <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 36, color: u > 0 ? C.ink : '#3a4a70', width: 440, whiteSpace: 'nowrap' }}>{k}</div>
                  <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: C.dim, opacity: u, transform: `translateX(${(1 - u) * 30}px)`, whiteSpace: 'nowrap' }}>{v}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// an ad shown on the TV jumps to your phone
const AdCard: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ width: 380 * scale, padding: 22 * scale, borderRadius: 20 * scale, background: 'linear-gradient(135deg,#ff8a3d,#ff2e6d)', boxShadow: '0 20px 60px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', gap: 18 * scale }}>
    <div style={{ width: 90 * scale, height: 90 * scale, borderRadius: 18 * scale, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:sneaker-move-bold" size={64 * scale} color="#fff" /></div>
    <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 36 * scale, color: '#fff', lineHeight: 1.05 }}>RUNNERS<br /><span style={{ fontSize: 48 * scale }}>-40%</span></div>
  </div>
);
const AdFollow: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const inU = ramp(t, tLets - 0.35, 0.5, EASE.out);
  const ex = ramp(t, tPart - 0.35, 0.3, EASE.in);
  const fly = ramp(t, tFollow, 0.75, EASE.inOut);
  const sx = lerp(520, 1420, fly), sy = 470 - Math.sin(fly * Math.PI) * 260;
  return (
    <AbsoluteFill style={{ opacity: inU * (1 - ex) }}>
      <div style={{ position: 'absolute', left: 120, top: 300, transform: `translateX(${(1 - inU) * -120}px)` }}>
        <TV x={0} y={0} w={800} screenOn={1} bias={0.7} screen={<AbsoluteFill style={{ background: 'linear-gradient(160deg,#1b1240,#0c1530)' }}><div style={{ position: 'absolute', left: 30, top: 24, fontFamily: fonts.mono, fontSize: 22, color: C.dim }}>AD · 0:15</div></AbsoluteFill>} />
      </div>
      <Footage src="stock/phone-bed.mp4" at={tLets - 0.3} out={tPart + 0.2} x={1100} y={150} w={700} h={720} radius={34} enter="scale" label="YOUR PHONE, LATER THAT NIGHT" />
      {/* the ad: sits on the TV, then flies into the phone footage as a notification */}
      <div style={{ position: 'absolute', left: sx, top: sy, transform: `translate(-50%,-50%) rotate(${Math.sin(fly * Math.PI) * -8}deg) scale(${1 - 0.15 * Math.sin(fly * Math.PI)})` }}><AdCard /></div>
      {fly >= 1 && <div style={{ position: 'absolute', left: 1450, top: 250, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * ramp(t, tFollow + 0.75, 0.3, EASE.back)})`, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 16, background: 'rgba(255,255,255,.92)', fontFamily: fonts.body, fontWeight: 700, fontSize: 24, color: '#111', boxShadow: '0 20px 50px rgba(0,0,0,.5)' }}><Icon name="ph:bell-ringing-bold" size={28} color={C.red} />Still thinking about these?</div>}
      {/* dotted trail */}
      {fly > 0 && fly < 1 && Array.from({ length: 10 }, (_, k) => { const u = fly - k * 0.05; if (u < 0) return null; return <div key={k} style={{ position: 'absolute', left: lerp(520, 1420, u) - 5, top: 470 - Math.sin(u * Math.PI) * 260 - 5, width: 10, height: 10, borderRadius: 5, background: C.amber, opacity: 1 - k / 10 }} />; })}
    </AbsoluteFill>
  );
};

// "that cheap 65-inch TV deal" — a store price tag swings off the TV corner
const PriceTag: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const inU = ramp(t, tPart - 0.35, 0.5, EASE.out);
  const ex = ramp(t, tVizio - 0.35, 0.3, EASE.in);
  const s = springAt(f, fps, tDeal - 0.05, { damping: 4, stiffness: 60 });
  const swing = (1 - s) * 28 + Math.sin(t * 1.6) * 3;
  const zoom = 0.94 + 0.08 * ramp(t, tPart, 3.2, EASE.smooth);
  return (
    <AbsoluteFill style={{ opacity: inU * (1 - ex), transform: `scale(${zoom})` }}>
      <Glow x={960} y={520} r={700} color={C.amber} opacity={0.12} />
      <TV x={460} y={210} w={1000} screenOn={0.9} bias={0.8} screen={<AbsoluteFill style={{ background: 'linear-gradient(135deg,#2a3a8a,#8a3a6a 60%,#f0a050)' }}><div style={{ position: 'absolute', left: 36, top: 28, padding: '6px 16px', borderRadius: 10, background: 'rgba(0,0,0,.35)', fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: 'rgba(255,255,255,.9)' }}>4K HDR · SMART</div><div style={{ position: 'absolute', left: '58%', top: '20%', width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle,#fff3c8,#ffb84a 70%)', boxShadow: '0 0 80px #ffb84a' }} /></AbsoluteFill>} />
      {/* 65" diagonal measure */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible' }}>
        <line x1={480} y1={760} x2={480 + 960 * ramp(t, tDeal, 0.6, EASE.out)} y2={760 - 530 * ramp(t, tDeal, 0.6, EASE.out)} stroke={C.amber} strokeWidth="4" strokeDasharray="14 10" opacity={0.8} />
      </svg>
      <div style={{ position: 'absolute', left: 900, top: 425, transform: 'translate(-50%,-50%) rotate(-29deg)', fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: C.amber, opacity: ramp(t, tDeal + 0.3, 0.3), textShadow: '0 4px 20px rgba(0,0,0,.6)' }}>65″</div>
      {/* tag on a string from the top-right corner */}
      {t > tDeal - 0.1 && (
        <div style={{ position: 'absolute', left: 1400, top: 220, transformOrigin: '0 0', transform: `rotate(${swing}deg)` }}>
          <div style={{ position: 'absolute', left: -2, top: 0, width: 3, height: 120, background: '#cfd6e4' }} />
          <div style={{ position: 'absolute', left: -130, top: 118, width: 270, padding: '26px 20px 22px', borderRadius: '14px 14px 18px 18px', background: '#ffd84a', boxShadow: '0 30px 60px rgba(0,0,0,.5)', textAlign: 'center', clipPath: 'polygon(20% 0, 80% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0a0f1c', margin: '0 auto 10px' }} />
            <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: '0.2em', color: '#7a2a00' }}>HOT DEAL</div>
            <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 84, color: '#1a0f00', lineHeight: 1 }}>$399</div>
            <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 24, color: '#7a2a00', textDecoration: 'line-through' }}>$899</div>
          </div>
        </div>
      )}
      <Kinetic text="Why is it *so cheap?*" at={tDeal + 1.0} out={tVizio - 0.4} y={135} size={64} anim="blur" accent={C.amber} />
    </AbsoluteFill>
  );
};

// Vizio 2021: more profit from ads & data than from selling TVs (relative bars)
const Chart: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const card = useEnter(tVizio - 0.3, tLGad - 0.35, { rise: 60 });
  const b1 = springAt(f, fps, tVizio + 0.5, { damping: 16, stiffness: 90 });
  const b2 = springAt(f, fps, tProfit, { damping: 14, stiffness: 70 });
  const H = 440, base = 860;
  const bar = (x: number, h: number, color: string, label: string, ic: string, dim: number) => (
    <>
      <div style={{ position: 'absolute', left: x, top: base - h, width: 260, height: h, borderRadius: '18px 18px 4px 4px', background: `linear-gradient(180deg, ${color}, ${color}55)`, boxShadow: `0 0 40px ${color}44`, opacity: 1 - dim * 0.55 }} />
      <div style={{ position: 'absolute', left: x + 130, top: base - h - 80, transform: 'translateX(-50%)', opacity: clamp(h / 60) }}><Icon name={ic} size={60} color={color} /></div>
      <div style={{ position: 'absolute', left: x + 130, top: base + 22, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 800, fontSize: 32, color: C.ink, whiteSpace: 'nowrap', opacity: 1 - dim * 0.5 }}>{label}</div>
    </>
  );
  if (!card.visible) return null;
  return (
    <AbsoluteFill style={card.style}>
      <div style={{ position: 'absolute', left: 160, top: 210 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: '0.2em', color: C.amber }}><Icon name="ph:chart-bar-bold" size={34} color={C.amber} />VIZIO · 2021 · WHERE THE PROFIT CAME FROM</div>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 76, color: C.ink, marginTop: 14, lineHeight: 1.05 }}>The TV is the<br /><span style={{ color: C.red }}>delivery box.</span></div>
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 24, color: C.dim, marginTop: 24, opacity: ramp(t, tProfit + 1, 0.5) }}>Bars show relative size · simplified</div>
      </div>
      <div style={{ position: 'absolute', left: 980, top: base, width: 780, height: 3, background: 'rgba(140,170,230,.4)' }} />
      {bar(1040, H * 0.42 * b1, C.cyan, 'Selling TVs', 'ph:television-simple-bold', ramp(t, tSelling, 0.4))}
      {bar(1420, H * b2, C.red, 'Ads & viewing data', 'ph:megaphone-bold', 0)}
      {b2 > 0.5 && <div style={{ position: 'absolute', left: 1550, top: base - H - 150, transform: `translateX(-50%) scale(${0.6 + 0.4 * ramp(t, tProfit + 0.8, 0.35, EASE.back)})`, opacity: ramp(t, tProfit + 0.8, 0.25), padding: '8px 18px', borderRadius: 12, background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 30, color: '#fff', whiteSpace: 'nowrap' }}>MORE PROFIT</div>}
      <Flash at={tProfit + 0.85} color={C.red} max={0.12} d={0.35} />
    </AbsoluteFill>
  );
};

// LG's ad business: 360,000,000+ connected devices
const Reach: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const inU = ramp(t, tLGad - 0.35, 0.5, EASE.out);
  const ex = ramp(t, tProduct - 0.3, 0.25, EASE.in);
  const cnt = EASE.inOut(clamp((t - tLGad - 0.25) / (tUS - tLGad - 0.25)));
  const r = rng(9);
  const N = 44 * 16;
  return (
    <AbsoluteFill style={{ opacity: inU * (1 - ex) }}>
      {/* field of devices lighting up */}
      {Array.from({ length: N }, (_, i) => {
        const cx = i % 44, cy = Math.floor(i / 44);
        const th = r();
        const on = cnt > th;
        return <div key={i} style={{ position: 'absolute', left: 70 + cx * 41.5, top: 160 + cy * 52, width: 8, height: 8, borderRadius: 4, background: on ? (th < 0.15 ? C.amber : C.red) : '#1c2848', opacity: on ? 0.55 + 0.45 * Math.sin(t * 3 + i) : 0.6, boxShadow: on ? `0 0 10px ${C.red}` : undefined }} />;
      })}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(3,5,11,.88) 25%, rgba(3,5,11,.2) 70%)' }} />
      <div style={{ position: 'absolute', left: 960, top: 330, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: '0.22em', color: C.red, opacity: ramp(t, tLGad, 0.4) }}><Icon name="ph:megaphone-bold" size={34} color={C.red} />LG AD SOLUTIONS · CLAIMED REACH</div>
      <div style={{ position: 'absolute', left: 960, top: 500, opacity: ramp(t, tLGad + 0.1, 0.3), transform: `translate(-50%,-50%) scale(${1 + 0.05 * ramp(t, tUS - 0.05, 0.15) * (1 - ramp(t, tUS + 0.1, 0.4))})`, fontFamily: fonts.head, fontWeight: 900, fontSize: 170, color: C.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', whiteSpace: 'nowrap', textShadow: '0 10px 50px rgba(0,0,0,.8)' }}>{Math.round(360e6 * cnt).toLocaleString('en-US')}<span style={{ color: C.red }}>+</span></div>
      <div style={{ position: 'absolute', left: 960, top: 640, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 16, fontFamily: fonts.head, fontWeight: 800, fontSize: 44, color: C.dim, opacity: ramp(t, tUS - 0.1, 0.4), whiteSpace: 'nowrap' }}>connected devices · <span style={{ color: C.amber }}>in the US alone</span></div>
    </AbsoluteFill>
  );
};

// "So maybe the TV isn't the product. Maybe you are."
const Product: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const s = springAt(f, fps, tYou - 0.05, { damping: 10, stiffness: 150 });
  const scanY = lerp(240, 760, ((t - tYou - 0.2) * 0.9) % 1);
  return (
    <AbsoluteFill style={{ opacity: ramp(t, tProduct - 0.3, 0.3) }}>
      <AbsoluteFill style={{ background: 'rgba(3,5,11,.6)' }} />
      <Kinetic text="The TV isn't the *product.*" at={tProduct} out={tYou - 0.15} y={540} size={96} weight={900} anim="rise" accent={C.cyan} />
      {t > tYou - 0.1 && (
        <>
          <div style={{ position: 'absolute', left: 430, top: 500, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * s})`, opacity: clamp(s * 1.4) }}>
            <div style={{ position: 'relative', width: 420, height: 520, borderRadius: 30, background: 'rgba(12,18,34,.9)', border: `2px solid ${C.red}66`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Icon name="ph:user-bold" size={300} color={C.ink} />
              {/* barcode */}
              <div style={{ display: 'flex', gap: 3, height: 70, marginTop: 6 }}>{Array.from({ length: 34 }, (_, i) => <div key={i} style={{ width: [2, 4, 3, 6, 2][i % 5], height: '100%', background: C.ink }} />)}</div>
            </div>
          </div>
          {t > tYou + 0.2 && <div style={{ position: 'absolute', left: 220, top: scanY, width: 420, height: 4, background: C.red, boxShadow: `0 0 24px ${C.red}, 0 0 60px ${C.red}` }} />}
          <Kinetic text="Maybe *you* are." at={tYou} out={Z + 0.4} x={1250} y={500} size={130} weight={900} anim="slam" stagger={0.1} />
          <div style={{ position: 'absolute', left: 1250, top: 640, transform: `translateX(-50%) scale(${ramp(t, tYou + 0.5, 0.3, EASE.back)})`, padding: '10px 24px', borderRadius: 12, border: `4px solid ${C.red}`, fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: C.red, letterSpacing: '0.1em' }}>THE PRODUCT</div>
          <Flash at={tYou - 0.02} color={C.red} max={0.25} d={0.4} />
        </>
      )}
    </AbsoluteFill>
  );
};
