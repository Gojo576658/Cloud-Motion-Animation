// Acts 0–1: the airport where every screen turns blue, the world map, "not a hack", one file, the title;
// then Gus the guard, the computer as a house, the kernel basement, and why a kernel crash = blue screen.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, PE, S1 } from './ttime';
import { useTF, camAt, Layer, Pop, Count, Kinetic, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { B, Gus, Monitor, BSOD, DotMap, Tag, Card, Night } from './kit';

// ================================================================ ACT 0 · the airport
const tBlue = P(1, 'turns blue'), tDesk = P(2, 'check-in'), tBoard = P(2, 'departure'), tGate = P(2, 'gates'), tSame = P(2, 'Same blue');
const tWorld = C0(3), tBank = P(3, 'banks'), tHosp = P(3, 'hospitals'), tShop = P(3, 'supermarkets'), tTV = P(3, 'TV stations'), tAll = P(3, 'all over');
const tDate = C0(4), tHack = P(4, "wasn't a hack"), tFile = C0(5), tPhoto = P(5, 'smaller than'), tExtra = P(5, 'one tiny thing'), tCount = C0(6), tTitle = C1(6) + 0.35;
export const a0NoCaptions: [number, number][] = [[tTitle - 0.2, S1(0) + 0.3]];
export const a0Sfx: SfxEvent[] = [
  { t: 0.05, name: 'computerAmb', vol: 0.18, dur: 6, note: 'terminal hum' }, { t: 0.6, name: 'notify', vol: 0.2, note: 'airport chime' },
  { t: tBlue - 0.05, name: 'glitchStatic', vol: 0.35 }, { t: tBlue + 0.25, name: 'powerUpStatic', vol: 0.25 },
  { t: tDesk - 0.05, name: 'popUi', vol: 0.3 }, { t: tBoard - 0.05, name: 'popUi', vol: 0.3 }, { t: tGate - 0.05, name: 'popUi', vol: 0.3 }, { t: tSame, name: 'error', vol: 0.35 },
  { t: tWorld - 0.1, name: 'whooshDeep', vol: 0.4 }, { t: tBank, name: 'bleep', vol: 0.25 }, { t: tHosp, name: 'bleep', vol: 0.25 }, { t: tShop, name: 'bleep', vol: 0.25 }, { t: tTV, name: 'bleep', vol: 0.25 }, { t: tAll, name: 'darkSweep', vol: 0.35 },
  { t: tDate - 0.05, name: 'impactDeep', vol: 0.45 }, { t: tHack, name: 'stomp', vol: 0.45, note: 'NOT A HACK stamp' },
  { t: tFile - 0.05, name: 'sweepSmall', vol: 0.3 }, { t: tExtra, name: 'glitchElectric', vol: 0.35, note: '+1' },
  { t: tCount, name: 'dataLoad', vol: 0.3, dur: 2.5 },
  { t: tTitle - 0.05, name: 'impactEpic', vol: 0.5, note: 'TITLE' }, { t: tTitle, name: 'shimmer', vol: 0.3 },
];
// screen positions in the terminal (x, y, w) + the order they go blue
const SCREENS: [number, number, number][] = [[960, 440, 660], [360, 700, 230], [640, 700, 230], [1280, 700, 230], [1560, 700, 230], [140, 470, 150], [1780, 470, 150]];
const Board: React.FC<{ rows: number }> = ({ rows }) => {
  const cities = ['LONDON', 'NEW YORK', 'DUBAI', 'SYDNEY', 'BERLIN', 'TOKYO'];
  return (
    <AbsoluteFill style={{ background: '#0b0f17', padding: '6% 5%', fontFamily: fonts.mono, color: '#ffd36a' }}>
      <div style={{ fontSize: '1.7em', fontWeight: 800, letterSpacing: '0.2em', color: '#fff', marginBottom: '3%' }}>DEPARTURES</div>
      {cities.slice(0, rows).map((c, i) => <div key={c} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25em', fontWeight: 700, padding: '1.2% 0', borderBottom: '1px solid #222a38' }}><span>{`0${6 + i}:${i * 7 + 10}`}</span><span style={{ flex: 1, marginLeft: '6%' }}>{c}</span><span style={{ color: B.green }}>ON TIME</span></div>)}
    </AbsoluteFill>
  );
};
const Airport: React.FC<{ t: number; cam: { x: number; y: number; z: number } }> = ({ t, cam }) => {
  const blueAt = (i: number) => ramp(t, tBlue + [0, 0.35, 0.5, 0.65, 0.8, 0.95, 1.05][i], 0.18, EASE.in);
  return (
    <>
      <Layer cam={cam} d={0.2}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0e1d3c 0%,#2b3f6a 52%,#c9875a 64%,#1a2238 66%)' }} />
        {/* big terminal windows with planes outside */}
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: 'absolute', left: i * 220 - 20, top: 0, width: 10, height: 720, background: '#0a1224' }} />)}
        <div style={{ position: 'absolute', left: 1280 + Math.sin(t * 0.2) * 40, top: 560, transform: 'scale(1.6)' }}><Icon name="ph:airplane-tilt-fill" size={120} color="#0a1224" /></div>
        <div style={{ position: 'absolute', left: 300, top: 600, transform: 'scaleX(-1)' }}><Icon name="ph:airplane-fill" size={150} color="#0a1224" /></div>
      </Layer>
      <Layer cam={cam} d={0.55}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 640, bottom: 0, background: 'linear-gradient(180deg,#2a3346,#151a26)' }} />
        {SCREENS.map(([x, y, w], i) => <Monitor key={i} x={x} y={y} w={w} blue={blueAt(i)} stand={i > 0} fs={i ? 6 : 14}>{i === 0 ? <Board rows={6} /> : <AbsoluteFill style={{ background: '#0d2a52', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 800, fontSize: '2.4em', color: '#cfe0ff' }}>{i < 5 ? 'CHECK-IN' : 'GATE'}</AbsoluteFill>}</Monitor>)}
        {[360, 640, 1280, 1560].map((x) => <div key={x} style={{ position: 'absolute', left: x - 150, top: 740, width: 300, height: 200, borderRadius: 14, background: 'linear-gradient(180deg,#3b4458,#232a3a)' }} />)}
      </Layer>
      {/* POV: your coffee */}
      <Layer cam={cam} d={1.2}>
        <div style={{ position: 'absolute', left: 1500, top: 760 + (t > tBlue ? Math.sin(t * 40) * 3 * (1 - ramp(t, tBlue + 0.6, 0.8)) : 0), transform: 'rotate(-6deg)' }}>
          <div style={{ width: 200, height: 250, borderRadius: '12px 12px 40px 40px', background: 'linear-gradient(90deg,#f4efe6,#d9d2c4)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -10, top: -18, width: 220, height: 36, borderRadius: 10, background: '#3a2a20' }} />
            <div style={{ position: 'absolute', left: 30, top: 90, width: 140, height: 70, borderRadius: 8, background: '#8a5a32' }} />
          </div>
          <div style={{ position: 'absolute', left: -60, top: 140, width: 160, height: 120, borderRadius: 60, background: B.skin }} />
        </div>
      </Layer>
    </>
  );
};
export const A0: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t >= tTitle - 0.25) {
    const s = springAt(f, fps, tTitle, { damping: 18, stiffness: 120 });
    return (
      <AbsoluteFill>
        <Night glow="rgba(10,108,214,.35)" />
        <DotMap x={960} y={560} w={1500} lit={1} />
        <AbsoluteFill style={{ background: 'rgba(5,10,24,.55)' }} />
        <div style={{ position: 'absolute', left: 960, top: 520, transform: `translate(-50%,-50%) scale(${1.05 - 0.05 * s})`, textAlign: 'center' }}>
          <Kinetic at={tTitle - 0.1} size={170} stagger={0.09} words={[{ w: 'One' }, { w: 'extra' }, { w: 'number.', serif: true, color: B.blue2, br: true }]} />
          <div style={{ marginTop: 30, opacity: ramp(t, tTitle + 0.6, 0.6) }}><Mono size={28} color={B.dim}>THE DAY 8.5 MILLION COMPUTERS WENT BLUE</Mono></div>
        </div>
      </AbsoluteFill>
    );
  }
  // ---- the count: a wall of screens flipping blue
  if (t >= tCount - 0.2) {
    const cols = 24, rows = 12;
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 120, top: 150, display: 'grid', gridTemplateColumns: `repeat(${cols}, 62px)`, gap: 8 }}>
          {Array.from({ length: cols * rows }, (_, i) => { const r = ((i * 7919) % 997) / 997; const on = ramp(t, tCount + r * 2.6, 0.12) > 0.5; return <div key={i} style={{ width: 62, height: 40, borderRadius: 4, background: on ? B.blue : '#1a2336', boxShadow: on ? `0 0 12px ${B.blue}aa` : 'none' }} />; })}
        </div>
        <div style={{ position: 'absolute', left: 960, top: 540, transform: 'translate(-50%,-50%)', padding: '20px 44px', borderRadius: 20, background: 'rgba(5,10,24,.88)', textAlign: 'center' }}>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 130, color: B.white, letterSpacing: '-0.04em' }}><Count to={8500000} at={tCount + 0.2} d={2.6} /></div>
          <Mono size={28} color={B.blue2}>COMPUTERS · ONE MORNING</Mono>
        </div>
      </AbsoluteFill>
    );
  }
  // ---- one file
  if (t >= tFile - 0.2) {
    const plus = ramp(t, tExtra, 0.4, EASE.back);
    return (
      <AbsoluteFill>
        <Night glow="rgba(255,59,78,.12)" />
        <Pop x={600} y={520} at={tPhoto - 0.1}><div style={{ textAlign: 'center' }}>
          <div style={{ width: 240, height: 440, borderRadius: 36, background: '#10141c', padding: 14, boxShadow: '0 30px 60px rgba(0,0,0,.5)' }}><div style={{ width: '100%', height: '100%', borderRadius: 26, background: 'linear-gradient(160deg,#ffb36b,#e0577a 55%,#4a3a9a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:mountains-fill" size={110} color="rgba(255,255,255,.75)" /></div></div>
          <div style={{ marginTop: 20 }}><Mono size={26} color={B.dim}>ONE PHOTO</Mono></div>
        </div></Pop>
        <div style={{ position: 'absolute', left: 1250, top: 520, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tFile, { damping: 12, stiffness: 160 })})`, textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Icon name="ph:file-fill" size={150} color={B.white} />
            {plus > 0 && <div style={{ position: 'absolute', right: -70, top: -40, transform: `scale(${plus})`, padding: '6px 18px', borderRadius: 30, background: B.red, ...fonts.H, fontWeight: 900, fontSize: 54, color: '#fff', boxShadow: `0 0 40px ${B.red}` }}>+1</div>}
          </div>
          <div style={{ marginTop: 20 }}><Mono size={26} color={B.white}>ONE UPDATE FILE</Mono></div>
        </div>
        {t > tPhoto && <div style={{ position: 'absolute', left: 925, top: 500, ...fonts.H, fontWeight: 800, fontSize: 90, color: B.dim, opacity: ramp(t, tPhoto + 0.3, 0.4) }}>&gt;</div>}
      </AbsoluteFill>
    );
  }
  // ---- date + not a hack
  if (t >= tDate - 0.2) {
    return (
      <AbsoluteFill>
        <Night glow="rgba(10,108,214,.28)" />
        <div style={{ position: 'absolute', left: 960, top: 470, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <Mono size={30} color={B.blue2}>FRIDAY</Mono>
          <div style={{ marginTop: 14 }}><Kinetic at={tDate} size={150} stagger={0.08} words={[{ w: 'July' }, { w: '19,' }, { w: '2024', serif: true, color: B.blue2 }]} /></div>
        </div>
        {t > tHack - 0.3 && <Pop x={960} y={800} at={tHack - 0.3}><Tag color={B.dim}><Icon name="ph:detective-fill" size={40} color={B.dim} /> HACKERS?</Tag></Pop>}
        <Stamp x={1060} y={790} at={tHack + 0.25} text="NOT A HACK" size={70} rot={-8} />
      </AbsoluteFill>
    );
  }
  // ---- the world goes blue
  if (t >= tWorld - 0.2) {
    const lit = ramp(t, tWorld, C1(3) - tWorld + 0.3, EASE.inOut);
    const pins: [number, number, string, string, number][] = [[560, 360, 'ph:bank-fill', 'BANKS', tBank], [1060, 300, 'ph:first-aid-kit-fill', 'HOSPITALS', tHosp], [1380, 420, 'ph:shopping-cart-fill', 'SUPERMARKETS', tShop], [760, 640, 'ph:television-simple-fill', 'TV STATIONS', tTV]];
    return (
      <AbsoluteFill>
        <Night glow="rgba(10,108,214,.25)" />
        <DotMap x={960} y={540} w={1600} lit={lit} />
        {pins.map(([x, y, ic, lb, at]) => <Pop key={lb} x={x} y={y} at={at - 0.05}><div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 14, background: 'rgba(5,10,24,.88)', border: `2px solid ${B.blue2}88` }}><Icon name={ic} size={38} color={B.blue2} /><span style={{ ...fonts.H, fontWeight: 800, fontSize: 28, color: B.white }}>{lb}</span></div></Pop>)}
        {t > tAll && <div style={{ position: 'absolute', left: 960, top: 930, transform: 'translateX(-50%)' }}><Kinetic at={tAll} size={70} words={[{ w: 'All' }, { w: 'at' }, { w: 'once.', serif: true, color: B.blue2 }]} /></div>}
      </AbsoluteFill>
    );
  }
  // ---- the airport
  const cam = camAt(t, [[0, 0, 40, 1.0], [tBlue - 0.3, 0, 0, 1.08], [tDesk, -260, 120, 1.25], [tBoard, 0, -140, 1.3], [tGate, 330, 30, 1.35], [tSame, 0, 0, 1.05]]);
  return (
    <AbsoluteFill style={{ background: B.ink }}>
      <Airport t={t} cam={cam} />
      {t > tSame && <div style={{ position: 'absolute', left: 960, top: 120, transform: 'translateX(-50%)' }}><Kinetic at={tSame} size={74} words={[{ w: 'Same' }, { w: 'blue' }, { w: 'screen.', serif: true, color: B.blue2 }]} /></div>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 1 · meet the guard
const tMeet = C0(7), tHello = C0(8), tBig = C0(9), tFalcon = P(9, 'CrowdStrike Falcon'), tWatch = P(9, 'watches everything');
const tDoor = C0(10), tBase = P(10, 'lives in the basement'), tKernel = P(11, 'called the kernel'), tDeep = P(11, 'deepest part'), tHw = P(11, 'its own hardware');
const tStop = C0(12), tCatch = P(12, "there's a catch"), tSmall = P(12, 'no such thing'), tApp = C0(13), tKCrash = P(13, 'If something in the kernel'), tSafe = C0(14), tBlueS = P(14, 'blue screen');
export const a1NoCaptions: [number, number][] = [];
export const a1Sfx: SfxEvent[] = [
  { t: tMeet + 0.3, name: 'switchLight', vol: 0.45, note: 'spotlight on Gus' }, { t: tHello, name: 'sillyPop', vol: 0.35 }, { t: tHello + 1.6, name: 'toyWhistle', vol: 0.25 },
  { t: tBig - 0.1, name: 'swooshSlow', vol: 0.3 }, { t: tFalcon, name: 'popUi', vol: 0.35 }, { t: tWatch, name: 'scan', vol: 0.35 },
  { t: tDoor - 0.1, name: 'door', vol: 0.4 }, { t: tBase, name: 'whooshDeep', vol: 0.4, note: 'tilt down' }, { t: tKernel, name: 'impactDeep', vol: 0.4 }, { t: tHw, name: 'techSlide', vol: 0.3 },
  { t: tStop + 0.3, name: 'punch', vol: 0.4 }, { t: tStop + 1.0, name: 'punch', vol: 0.35 }, { t: tCatch, name: 'mysteryHit', vol: 0.4 }, { t: tSmall, name: 'alarm', vol: 0.15, dur: 1.2 },
  { t: tApp + 0.6, name: 'pop', vol: 0.35, note: 'app closes' }, { t: tKCrash + 0.4, name: 'glitchBreak', vol: 0.45, note: 'house shakes' },
  { t: tBlueS - 0.05, name: 'error', vol: 0.45 }, { t: tBlueS + 0.1, name: 'bassHit', vol: 0.4 },
];
// the computer as a house: three app rooms upstairs, the front door, and the kernel basement wired to the hardware
const HOUSE_TOP = 120, FLOOR = 520, BASE = 720;
const House: React.FC<{ t: number; shake?: number; dark?: number }> = ({ t, shake = 0, dark = 0 }) => {
  const sx = shake ? Math.sin(t * 60) * 10 * shake : 0;
  return (
    <div style={{ position: 'absolute', left: 360 + sx, top: HOUSE_TOP, width: 1200, height: 1400 }}>
      {/* roof */}
      <div style={{ position: 'absolute', left: -40, top: -100, width: 0, height: 0, borderLeft: '640px solid transparent', borderRight: '640px solid transparent', borderBottom: '110px solid #1b2a4c' }} />
      <div style={{ position: 'absolute', left: 430, top: -70, ...fonts.H, fontWeight: 800, fontSize: 30, color: B.dim, letterSpacing: '0.1em' }}>YOUR COMPUTER</div>
      {/* upstairs: apps */}
      <div style={{ position: 'absolute', left: 0, top: 10, width: 1200, height: FLOOR - 10, background: '#16233f', border: '6px solid #24365e' }}>
        {[['ph:browser-fill', 'BROWSER'], ['ph:game-controller-fill', 'GAMES'], ['ph:music-notes-fill', 'MUSIC']].map(([ic, lb], i) => (
          <div key={lb} style={{ position: 'absolute', left: 50 + i * 380, top: 60, width: 340, height: 220, borderRadius: 12, background: `rgba(95,212,255,${0.12 + 0.05 * Math.sin(t * 2 + i)})`, border: '3px solid #2f4a7a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Icon name={ic} size={80} color={B.cyan} /><Mono size={22} color={B.cyan}>{lb}</Mono>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 30, top: 320, ...fonts.H, fontWeight: 800, fontSize: 34, color: '#5d76a6' }}>APPS</div>
        {/* front door */}
        <div style={{ position: 'absolute', left: 520, top: 330, width: 160, height: 180, borderRadius: '80px 80px 0 0', background: '#3a2a20', border: '5px solid #5a4030' }}><div style={{ position: 'absolute', right: 22, top: 96, width: 14, height: 14, borderRadius: 7, background: '#d9b25a' }} /></div>
      </div>
      {/* ground line */}
      <div style={{ position: 'absolute', left: -400, top: FLOOR, width: 2000, height: 18, background: '#2c3a2a' }} />
      {/* basement: kernel */}
      <div style={{ position: 'absolute', left: 0, top: FLOOR + 18, width: 1200, height: BASE, background: 'linear-gradient(180deg,#0d1424,#060a14)', border: '6px solid #1b2a4c' }}>
        <div style={{ position: 'absolute', left: 60, top: 200, ...fonts.H, fontWeight: 900, fontSize: 84, letterSpacing: '-0.04em', color: B.amber, opacity: ramp(t, tKernel, 0.4) }}>KERNEL<div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: '0.16em', color: B.dim }}>THE DEEPEST PART OF WINDOWS</div></div>
        {/* stairs */}
        {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 700 + i * 40, top: i * 40, width: 44, height: 12, background: '#2a3550' }} />)}
        {/* hardware + pipes */}
        {[['ph:cpu-fill', 'CPU', 90], ['ph:memory-fill', 'MEMORY', 370], ['ph:hard-drives-fill', 'DISK', 650]].map(([ic, lb, x]) => (
          <div key={lb as string} style={{ position: 'absolute', left: x as number, top: 520, width: 180, textAlign: 'center', opacity: ramp(t, tHw - 0.1 + (x as number) / 3000, 0.4) }}>
            <div style={{ position: 'absolute', left: 86, top: -150, width: 8, height: 150, background: `linear-gradient(180deg, ${B.amber}00, ${B.amber})` }} />
            <Icon name={ic as string} size={110} color={B.amber} style={{ margin: '0 auto' }} /><Mono size={20} color={B.amber}>{lb as string}</Mono>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 176, top: 368, width: 568, height: 8, background: `${B.amber}99`, opacity: ramp(t, tHw, 0.5) }} />
      </div>
      {dark > 0 && <div style={{ position: 'absolute', left: -400, top: -200, width: 2000, height: 1800, background: '#000', opacity: dark }} />}
    </div>
  );
};
export const A1: React.FC = () => {
  const { f, fps, t } = useTF();
  // ---- Gus says hello
  if (t < tBig - 0.2) {
    const spot = ramp(t, tMeet + 0.25, 0.2);
    return (
      <AbsoluteFill style={{ background: '#03060f' }}>
        <div style={{ position: 'absolute', left: 960 - 500, top: 0, width: 1000, height: 1080, background: `radial-gradient(ellipse at 50% 85%, rgba(255,236,200,${0.28 * spot}), transparent 60%)` }} />
        <div style={{ position: 'absolute', left: 960 - 260, top: 0, width: 0, height: 0, borderLeft: '260px solid transparent', borderRight: '260px solid transparent', borderTop: `960px solid rgba(255,236,200,${0.07 * spot})` }} />
        <div style={{ opacity: spot }}><Gus x={960} y={940} size={560} mood={t > tHello ? 'happy' : 'neutral'} arm={t > tHello && t < C1(8) ? 'wave' : 'idle'} talk={t > tHello && t < C1(8) ? Math.abs(Math.sin(t * 15)) : 0} seed={3} /></div>
        {t > tHello + 0.1 && <Pop x={1420} y={330} at={tHello + 0.1} out={C1(8) + 0.4}><Tag color={B.amber}><Icon name="ph:shield-check-fill" size={36} color={B.amber} /> GUS · SECURITY</Tag></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- big companies: every PC has a guard
  if (t < tDoor - 0.2) {
    const r = rng(9);
    return (
      <AbsoluteFill>
        <Night />
        {Array.from({ length: 18 }, (_, i) => { const x = 230 + (i % 6) * 290, y = 330 + Math.floor(i / 6) * 260; const s = ramp(t, tBig + r() * 0.8, 0.4, EASE.back); return (
          <div key={i} style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${s})`, transformOrigin: `${x}px ${y}px` }}>
            <Monitor x={x} y={y} w={200} stand={false}><AbsoluteFill style={{ background: '#13284e' }} /></Monitor>
            <div style={{ position: 'absolute', left: x + 50, top: y - 40, transform: `scale(${ramp(t, tWatch + i * 0.03, 0.3, EASE.back)})` }}><Icon name="ph:shield-check-fill" size={46} color={B.amber} /></div>
            {t > tWatch && <div style={{ position: 'absolute', left: x - 96, top: y - 116 + ((t * 120 + i * 30) % 110), width: 192, height: 3, background: `${B.amber}aa` }} />}
          </div>); })}
        <Pop x={960} y={130} at={tFalcon - 0.05}><Tag color={B.white} size={36}>CROWDSTRIKE FALCON <span style={{ color: B.dim, fontWeight: 600 }}>· security software</span></Tag></Pop>
      </AbsoluteFill>
    );
  }
  // ---- the house: front door → basement → kernel → hardware
  if (t < tApp - 0.2) {
    const cam = camAt(t, [[tDoor, 0, -150, 0.92], [tBase - 0.2, 0, -150, 0.92], [tBase + 1.4, 0, 620, 1.0], [tKernel, 0, 640, 1.04], [tHw, 0, 660, 0.96], [tStop, 0, 660, 0.98], [tCatch, 0, 660, 1.1]]);
    const walk = ramp(t, tBase - 0.1, 1.3, EASE.inOut);
    const gx = lerp(960, 1300, walk), gy = lerp(HOUSE_TOP + FLOOR - 4, HOUSE_TOP + FLOOR + 18 + 690, walk);
    const atk = t > tStop && t < tCatch;
    return (
      <AbsoluteFill style={{ background: '#050a16' }}>
        <Layer cam={cam} d={0.25}><Night glow="rgba(61,143,240,.18)" y={20} /></Layer>
        <Layer cam={cam} d={1}>
          <House t={t} />
          <Gus x={gx} y={gy} size={300} mood={t > tCatch ? 'focus' : t > tKernel ? 'proud' : 'neutral'} arm={atk ? 'point' : 'idle'} look={walk > 0 && walk < 1 ? 1 : 0} seed={4} />
          {atk && [0, 1].map((k) => { const u = clamp((t - tStop - 0.3 - k * 0.7) / 0.6); return u > 0 && u < 1 ? <div key={k} style={{ position: 'absolute', left: lerp(1800, 1360, Math.min(1, u * 1.6)) + (u > 0.62 ? (u - 0.62) * 900 : 0), top: HOUSE_TOP + FLOOR + 480 - (u > 0.62 ? (u - 0.62) * 500 : 0), transform: `rotate(${u * 400}deg)` }}><Icon name="ph:bug-beetle-fill" size={80} color={B.red} /></div> : null; })}
        </Layer>
        {t > tSmall && <div style={{ position: 'absolute', left: 960, top: 110, transform: 'translateX(-50%)' }}><Kinetic at={tSmall} size={66} words={[{ w: 'No' }, { w: 'small' }, { w: 'mistakes.', serif: true, color: B.amber }]} /></div>}
      </AbsoluteFill>
    );
  }
  // ---- app crash vs kernel crash, then the blue screen
  if (t < tBlueS - 0.15) {
    const close = ramp(t, tApp + 0.6, 0.35, EASE.in);
    const shake = t > tKCrash + 0.4 ? 1 - ramp(t, tSafe + 0.5, 0.6) : 0;
    const dark = ramp(t, tKCrash + 0.6, 0.5);
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 150, top: 150, width: 790, height: 760, borderRadius: 26, background: '#0b1428', border: '2px solid #22365e', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 30, top: 24 }}><Mono size={26} color={B.green}>AN APP CRASHES</Mono></div>
          <div style={{ position: 'absolute', left: 115, top: 170, width: 560, height: 380, borderRadius: 14, background: '#1b2a4c', border: '3px solid #3a5288', transform: `scale(${1 - close})`, opacity: 1 - close }}>
            <div style={{ height: 40, background: '#2a3d68', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 14, gap: 10 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: i === 2 ? B.red : '#5d76a6' }} />)}</div>
            <div style={{ textAlign: 'center', marginTop: 70 }}><Icon name="ph:smiley-sad-fill" size={130} color={B.dim} style={{ margin: '0 auto' }} /></div>
          </div>
          {close > 0.9 && <Pop x={395} y={400} at={tApp + 0.95}><Tag color={B.green}><Icon name="ph:check-bold" size={34} color={B.green} /> EVERYTHING ELSE KEEPS RUNNING</Tag></Pop>}
        </div>
        <div style={{ position: 'absolute', left: 980, top: 150, width: 790, height: 760, borderRadius: 26, background: '#0b1428', border: `2px solid ${t > tKCrash ? B.red : '#22365e'}`, overflow: 'hidden', opacity: t > tKCrash - 0.2 ? 1 : 0.35 }}>
          <div style={{ position: 'absolute', left: 30, top: 24, zIndex: 2 }}><Mono size={26} color={B.red}>THE KERNEL CRASHES</Mono></div>
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${Math.sin(t * 60) * 12 * shake}px)` }}>
            {[['ph:browser-fill', 120, 150], ['ph:game-controller-fill', 420, 190], ['ph:music-notes-fill', 260, 380], ['ph:shield-check-fill', 520, 420]].map(([ic, x, y], i) => (
              <div key={i} style={{ position: 'absolute', left: x as number, top: y as number, width: 220, height: 160, borderRadius: 12, background: '#1b2a4c', border: '3px solid #3a5288', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${shake * Math.sin(t * 40 + i) * 4}deg)` }}><Icon name={ic as string} size={80} color={i === 3 ? B.amber : B.cyan} /></div>
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dark * 0.85 }} />
          {dark > 0.5 && <Pop x={395} y={640} at={tKCrash + 1.0}><Tag color={B.red}><Icon name="ph:x-bold" size={34} color={B.red} /> EVERYTHING STOPS</Tag></Pop>}
        </div>
      </AbsoluteFill>
    );
  }
  const pct = clamp((t - tBlueS) / 3) * 34;
  const zoom = 1 - 0.3 * ramp(t, tBlueS + 1.2, 1.6, EASE.inOut);
  return (
    <AbsoluteFill style={{ background: '#03060f' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, borderRadius: (1 - zoom) * 90, overflow: 'hidden', border: `${(1 - zoom) * 110}px solid #10141c`, fontSize: 30 }}><BSOD pct={pct} /></div>
    </AbsoluteFill>
  );
};
