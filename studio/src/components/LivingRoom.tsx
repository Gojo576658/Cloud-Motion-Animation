// Night living room, illustrated in parallax layers.
// Router on the console; the ethernet cable runs from BEHIND the TV into the router.
// `day` drives a time-lapse (0 = night, 0.5 = noon, 1 = night again).
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Layer } from './Camera';
import { TV } from './TV';
import { Glow } from './Backdrop';
import { C, fonts } from '../lib/theme';
import { clamp, lerp } from '../lib/time';

export const TVX = 470, TVY = 250, TVW = 980;
export const ROUTER = { x: 1300, y: 812, w: 190, h: 64 };   // on the console top (y 876)
export const PORT = { x: ROUTER.x + 34, y: ROUTER.y + 44 }; // ethernet port (left side of the router face)

const mixHex = (a: string, b: string, u: number) => {
  const pa = a.match(/\w\w/g)!.map((x) => parseInt(x, 16)), pb = b.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], u))).join(',')})`;
};

export const LivingRoom: React.FC<{
  led?: number; screen?: React.ReactNode; screenOn?: number; person?: number; lamp?: number;
  plug?: number;        // 1 = plugged into the router, 0 = pulled out
  net?: number;         // router internet LED: 1 green, 0 red
  day?: number;         // time-lapse phase
  calendar?: number;    // day shown on the wall calendar (fractional = page flipping)
}> = ({ led = 1, screen, screenOn = 0, person = 1, lamp = 1, plug = 1, net = 1, day = 0, calendar = 7 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  // daylight amount 0..1 (0 at night)
  const sun = clamp(Math.sin(Math.PI * day * 2 - Math.PI / 2) * 0.5 + 0.5);
  const skyTop = mixHex('14306b', '6fa8ff', sun), skyBot = mixHex('0a1734', 'ffd9a0', sun * 0.8);
  const lampOn = lamp * (1 - sun);
  const u = 1 - plug; // 0 plugged, 1 pulled out
  const blink = (k: number) => (Math.sin(t * 9 + k * 2.1) > -0.2 ? 1 : 0.25);
  const page = Math.floor(calendar), flip = calendar - page;
  return (
    <AbsoluteFill>
      {/* ---------- wall ---------- */}
      <Layer depth={0.85}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0a1124 0%,#0b1430 45%,#081022 75%,#050914 100%)' }} />
        <div style={{ position: 'absolute', left: -400, top: 0, width: 2720, height: 900, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.012) 0 2px, transparent 2px 180px)' }} />
        {/* window with sky time-lapse */}
        <div style={{ position: 'absolute', left: 70, top: 160, width: 300, height: 470, borderRadius: 6, overflow: 'hidden', background: `linear-gradient(180deg,${skyTop} 0%,${skyBot} 100%)`, boxShadow: `inset 0 0 0 10px #070c18, 0 0 ${80 + sun * 120}px rgba(${sun > 0.3 ? '255,210,150' : '70,120,255'},${0.25 + sun * 0.3})` }}>
          {/* moon / sun travel across the window */}
          {(() => {
            const arc = (day % 0.5) / 0.5; // each half cycle one body crosses
            const isSun = day % 1 > 0.25 && day % 1 < 0.75;
            const x = lerp(-40, 320, (((day % 1) + 0.25) % 0.5) / 0.5), y = 70 + Math.pow((x - 140) / 180, 2) * 120;
            void arc;
            return <div style={{ position: 'absolute', left: x, top: y, width: 54, height: 54, borderRadius: '50%', background: isSun ? 'radial-gradient(circle,#fff6d8,#ffc95a 70%)' : 'radial-gradient(circle at 40% 40%, #f4f7ff, #b9c9ef 60%, #8ea4d8)', boxShadow: isSun ? '0 0 60px rgba(255,200,90,.9)' : '0 0 40px rgba(200,220,255,.6)' }} />;
          })()}
          {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 10, right: 10, top: 14 + i * 32, height: 3, background: 'rgba(5,9,20,.55)' }} />)}
          <div style={{ position: 'absolute', left: 145, top: 0, width: 10, height: '100%', background: '#070c18' }} />
        </div>
        {/* curtains */}
        <div style={{ position: 'absolute', left: 20, top: 120, width: 70, height: 760, background: 'linear-gradient(90deg,#0b1226,#16224a 60%,#0b1226)', borderRadius: '0 0 30px 30px' }} />
        <div style={{ position: 'absolute', left: 350, top: 120, width: 70, height: 760, background: 'linear-gradient(90deg,#0b1226,#16224a 40%,#0b1226)', borderRadius: '0 0 30px 30px' }} />
        {/* light shaft from the window (warm by day, cool by night), sweeps with the sun */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: `linear-gradient(115deg, rgba(${sun > 0.3 ? '255,215,160' : '120,160,255'},${0.10 + sun * 0.12}), rgba(120,160,255,0) 60%)`, clipPath: `polygon(90px 170px, 360px 170px, ${1150 + (day % 1) * 500}px 1080px, ${420 + (day % 1) * 400}px 1080px)` }} />
        {/* wall calendar */}
        <div style={{ position: 'absolute', left: 1700, top: 140, width: 120, height: 140, borderRadius: 8, background: '#e9edf6', boxShadow: '0 10px 24px rgba(0,0,0,.5)', overflow: 'visible' }}>
          <div style={{ height: 34, borderRadius: '8px 8px 0 0', background: C.red, fontFamily: fonts.body, fontWeight: 800, fontSize: 16, color: '#fff', textAlign: 'center', lineHeight: '34px', letterSpacing: '0.2em' }}>SEPT</div>
          <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: '#141a28', textAlign: 'center', lineHeight: '100px' }}>{String(page + (flip > 0.5 ? 1 : 0)).padStart(2, '0')}</div>
          {flip > 0.02 && flip < 0.98 && (
            <div style={{ position: 'absolute', left: 0, top: 34, width: 120, height: 106, background: '#f6f8fc', transformOrigin: '50% 0', transform: `perspective(400px) rotateX(${flip * 180}deg) translateY(${flip * 30}px)`, opacity: 1 - flip * 0.6, boxShadow: '0 6px 14px rgba(0,0,0,.35)', fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: '#141a28', textAlign: 'center', lineHeight: '100px', backfaceVisibility: 'hidden' }}>{String(page).padStart(2, '0')}</div>
          )}
          <div style={{ position: 'absolute', left: 30, top: -8, width: 8, height: 18, borderRadius: 4, background: '#8a93a8' }} />
          <div style={{ position: 'absolute', right: 30, top: -8, width: 8, height: 18, borderRadius: 4, background: '#8a93a8' }} />
        </div>
        {/* floor */}
        <div style={{ position: 'absolute', left: -400, top: 870, width: 2720, height: 400, background: 'linear-gradient(180deg,#0d1427 0%,#070b16 100%)' }} />
        <div style={{ position: 'absolute', left: -400, top: 870, width: 2720, height: 400, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 2px, transparent 2px 160px)', transform: 'perspective(600px) rotateX(55deg)', transformOrigin: '50% 0' }} />
        <div style={{ position: 'absolute', left: -400, top: 868, width: 2720, height: 3, background: 'rgba(120,150,220,.18)' }} />
        {/* floor lamp (warm, off in daylight) */}
        <div style={{ position: 'absolute', left: 1640, top: 380, width: 8, height: 500, background: 'linear-gradient(90deg,#141924,#2c3445,#141924)' }} />
        <div style={{ position: 'absolute', left: 1580, top: 330, width: 128, height: 90, background: 'linear-gradient(180deg,#3a2c22,#20170f)', clipPath: 'polygon(22% 0, 78% 0, 100% 100%, 0 100%)' }} />
        <Glow x={1644} y={430} r={300} color={`rgba(255,170,90,${0.35 * lampOn})`} />
        <div style={{ position: 'absolute', left: 1580, top: 420, width: 128, height: 460, background: `linear-gradient(180deg, rgba(255,170,90,${0.18 * lampOn}), rgba(255,170,90,0))`, clipPath: 'polygon(0 0, 100% 0, 150% 100%, -50% 100%)' }} />
        {/* plant */}
        <svg style={{ position: 'absolute', left: 1730, top: 560, width: 180, height: 320 }} viewBox="0 0 180 320">
          <path d="M60 230 h60 l-8 90 h-44 z" fill="#161c2b" />
          {[[-40, 1], [-20, 0.9], [0, 1.05], [20, 0.95], [40, 1], [-55, 0.7], [55, 0.75]].map(([a, s], i) => (
            <path key={i} transform={`translate(90 235) rotate(${a + Math.sin(t * 0.8 + i) * 1.5}) scale(${s})`} d="M0 0 C -26 -60 -18 -150 0 -200 C 18 -150 26 -60 0 0 Z" fill={i % 2 ? '#123527' : '#0f2b21'} stroke="rgba(120,255,190,.08)" />
          ))}
        </svg>
      </Layer>

      {/* ---------- console, cable (behind the TV), TV, router ---------- */}
      <Layer depth={1}>
        <div style={{ position: 'absolute', left: 380, top: 876, width: 1160, height: 120, borderRadius: 8, background: 'linear-gradient(180deg,#1a2133 0%,#0d111c 30%,#080b13 100%)', boxShadow: '0 30px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)' }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 30 + i * 380, top: 30, width: 340, height: 70, borderRadius: 4, background: 'rgba(255,255,255,.02)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04)' }} />)}
        </div>
        {/* ethernet: starts behind the TV body, peeks out under its right edge, drops into the router */}
        {(() => {
          const px = PORT.x - u * 36, py = PORT.y + u * 18;
          return (
            <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible', pointerEvents: 'none' }} viewBox="0 0 1920 1080">
              <path d={`M 1300 520 C 1330 640, 1250 800, 1268 ${846 + u * 6} S ${px - 26} ${py + 6}, ${px - 14} ${py}`} stroke="#2f6bff" strokeWidth="9" fill="none" strokeLinecap="round" />
              <g transform={`rotate(${-u * 22} ${px} ${py})`}>
                <rect x={px - 16} y={py - 9} width="24" height="18" rx="3" fill="#3a78ff" stroke="#9bbcff" strokeWidth="1.5" />
                <rect x={px + 8} y={py - 5} width={u > 0.05 ? 9 : 2} height="10" rx="1" fill="#c9d4ea" />
              </g>
            </svg>
          );
        })()}
        <TV x={TVX} y={TVY} w={TVW} led={led} screen={screen} screenOn={screenOn} />
        <Glow x={960} y={884} r={120} color={`rgba(255,46,77,${0.22 * Math.min(1, led)})`} />
        {/* router */}
        <div style={{ position: 'absolute', left: ROUTER.x, top: ROUTER.y, width: ROUTER.w, height: ROUTER.h, borderRadius: 14, background: 'linear-gradient(180deg,#232a3a,#10141e)', boxShadow: '0 12px 26px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.12)' }}>
          {/* antennas */}
          {[22, ROUTER.w - 30].map((ax, i) => <div key={i} style={{ position: 'absolute', left: ax, top: -78, width: 8, height: 82, borderRadius: 4, background: 'linear-gradient(90deg,#141a26,#2c3445,#141a26)', transformOrigin: '50% 100%', transform: `rotate(${i ? 10 : -10}deg)` }} />)}
          {/* port */}
          <div style={{ position: 'absolute', left: 22, top: 34, width: 26, height: 20, borderRadius: 3, background: '#0a0d14', boxShadow: 'inset 0 0 0 2px #2a3242' }} />
          {/* status LEDs: power, wifi, internet */}
          {[{ c: C.green, on: 1 }, { c: C.cyan, on: blink(1) }, { c: net > 0.5 ? C.green : C.red, on: net > 0.5 ? blink(2) : 0.5 + 0.5 * Math.sin(t * 6) }].map((l, i) => (
            <div key={i} style={{ position: 'absolute', left: 80 + i * 30, top: 26, width: 10, height: 10, borderRadius: '50%', background: l.c, opacity: 0.35 + 0.65 * l.on, boxShadow: `0 0 ${10 * l.on}px ${l.c}, 0 0 ${24 * l.on}px ${l.c}88` }} />
          ))}
          <div style={{ position: 'absolute', left: 80, top: 44, fontFamily: fonts.mono, fontSize: 9, color: '#6f7a92', letterSpacing: '0.12em' }}>PWR  WIFI  NET</div>
        </div>
        <Glow x={ROUTER.x + 125} y={ROUTER.y + 30} r={70} color={net > 0.5 ? 'rgba(60,240,160,.12)' : 'rgba(255,46,77,.18)'} />
      </Layer>

      {/* ---------- foreground: sofa back + person (rim-lit by the TV) ---------- */}
      <Layer depth={1.22}>
        <div style={{ position: 'absolute', left: -120, top: 930, width: 1500, height: 260, borderRadius: '90px 90px 0 0', background: 'linear-gradient(180deg,#141b2c 0%,#090d17 40%,#05070d 100%)', boxShadow: 'inset 0 2px 0 rgba(120,150,255,.15)', opacity: person }} />
        <svg style={{ position: 'absolute', left: 300, top: 640 + Math.sin(t * 0.9) * 2, width: 520, height: 460, opacity: person }} viewBox="0 0 520 460">
          <defs>
            <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7ea6ff" stopOpacity=".55" /><stop offset=".5" stopColor="#3d63c9" stopOpacity=".15" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
          </defs>
          <path d="M260 40 C 312 40 340 82 336 132 C 333 168 318 196 300 210 C 300 226 304 238 318 246 C 400 262 470 300 492 360 L 500 460 L 20 460 L 28 360 C 50 300 120 262 202 246 C 216 238 220 226 220 210 C 202 196 187 168 184 132 C 180 82 208 40 260 40 Z" fill="#03050a" stroke="url(#rim)" strokeWidth="5" />
        </svg>
      </Layer>

      {/* daylight wash over the whole room during the time-lapse */}
      {sun > 0.01 && <AbsoluteFill style={{ background: `rgba(255,214,160,${sun * 0.16})`, pointerEvents: 'none' }} />}
    </AbsoluteFill>
  );
};
