// Vertical night living room (1080×1920) — the Short's opening and closing frame,
// staged like the thumbnail: moonlit window, switched-off TV with a red standby LED,
// a viewer on the sofa in the foreground. Parallax layers for the camera.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Layer } from '../components/Camera';
import { TV, ledPos } from '../components/TV';
import { C } from '../lib/theme';

export const VTV = { x: 90, y: 640, w: 900 };
export const VLED = ledPos(VTV.x, VTV.y, VTV.w);

export const VRoom: React.FC<{ led?: number; screen?: React.ReactNode; screenOn?: number; person?: number }> = ({ led = 1, screen, screenOn = 0, person = 1 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const glow = Math.max(0, led);
  const sway = Math.sin(t * 0.9) * 2;
  return (
    <AbsoluteFill>
      {/* ---------- wall + window (background) ---------- */}
      <Layer depth={0.8}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0b1636 0%,#10204a 40%,#0b1838 70%,#050a16 100%)' }} />
        <div style={{ position: 'absolute', left: -200, top: 0, width: 1500, height: 1400, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.012) 0 2px, transparent 2px 160px)' }} />
        {/* window */}
        <div style={{ position: 'absolute', left: 64, top: 200, width: 290, height: 380, borderRadius: 6, overflow: 'hidden', background: 'linear-gradient(180deg,#0f2a63 0%,#0a1a3c 100%)', boxShadow: 'inset 0 0 0 9px #060a16, 0 0 120px rgba(80,130,255,.25)' }}>
          {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: 'absolute', left: (i * 73) % 280, top: (i * 41) % 200, width: 2, height: 2, borderRadius: 1, background: '#cfe0ff', opacity: 0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + i)) }} />)}
          <div style={{ position: 'absolute', left: 150, top: 54, width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #f6f8ff, #c3d1f2 60%, #93a8d8)', boxShadow: '0 0 50px rgba(200,220,255,.9), 0 0 120px rgba(140,170,255,.5)' }} />
          {/* tree silhouettes */}
          <div style={{ position: 'absolute', left: -30, bottom: -20, width: 180, height: 200, borderRadius: '50% 50% 0 0', background: '#050a18' }} />
          <div style={{ position: 'absolute', left: 120, bottom: -40, width: 220, height: 160, borderRadius: '50% 50% 0 0', background: '#060c1c' }} />
          <div style={{ position: 'absolute', left: 140, top: 0, width: 9, height: '100%', background: '#060a16' }} />
          <div style={{ position: 'absolute', left: 0, top: 185, width: '100%', height: 9, background: '#060a16' }} />
        </div>
        {/* curtains */}
        <div style={{ position: 'absolute', left: 20, top: 160, width: 60, height: 560, borderRadius: '0 0 26px 26px', background: 'linear-gradient(90deg,#0a1124,#16224a 60%,#0a1124)' }} />
        <div style={{ position: 'absolute', left: 338, top: 160, width: 60, height: 560, borderRadius: '0 0 26px 26px', background: 'linear-gradient(90deg,#0a1124,#16224a 40%,#0a1124)' }} />
        {/* moonlight shaft onto the floor */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(130,170,255,.18), rgba(120,160,255,0) 60%)', clipPath: 'polygon(70px 210px, 350px 210px, 760px 1900px, 0px 1900px)' }} />
        {/* floor */}
        <div style={{ position: 'absolute', left: -200, top: 1330, width: 1500, height: 700, background: 'linear-gradient(180deg,#0b1124,#05080f)' }} />
        <div style={{ position: 'absolute', left: 120, top: 1420, width: 860, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(60,40,70,.35), transparent 70%)' }} />
      </Layer>
      {/* ---------- TV wall: red LED wash, TV, console, plant ---------- */}
      <Layer depth={1}>
        <div style={{ position: 'absolute', left: VLED.x - 620, top: VLED.y - 700, width: 1240, height: 1100, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 64%, rgba(255,30,60,${0.22 * glow}) 0%, rgba(255,30,60,${0.08 * glow}) 35%, transparent 65%)` }} />
        {/* red backlight halo around the switched-off TV (like the thumbnail) */}
        <div style={{ position: 'absolute', left: VTV.x + 30, top: VTV.y + 30, width: VTV.w - 60, height: VTV.w * 0.575 - 60, borderRadius: 20, boxShadow: `0 0 140px 40px rgba(255,30,60,${0.16 + 0.12 * glow}), 0 0 300px 80px rgba(255,30,60,${0.06 + 0.05 * glow})` }} />
        <TV x={VTV.x} y={VTV.y} w={VTV.w} led={led} screen={screen} screenOn={screenOn} bias={0.35} stand={false} />
        {/* console */}
        <div style={{ position: 'absolute', left: 110, top: 1180, width: 860, height: 120, borderRadius: 10, background: 'linear-gradient(180deg,#1a1410,#0c0907)', boxShadow: `0 -2px 0 rgba(255,60,80,${0.25 * glow}) inset, 0 30px 60px rgba(0,0,0,.7)` }}>
          {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 30 + i * 37, top: 22, width: 4, height: 76, background: 'rgba(0,0,0,.45)' }} />)}
        </div>
        <div style={{ position: 'absolute', left: VLED.x - 160, top: 1180, width: 320, height: 14, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,40,70,${0.55 * glow}), transparent 70%)` }} />
        {/* router on the console */}
        <div style={{ position: 'absolute', left: 800, top: 1140, width: 130, height: 40, borderRadius: 8, background: 'linear-gradient(180deg,#1b2233,#0b0f19)', boxShadow: '0 6px 14px rgba(0,0,0,.6)' }}>
          {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 74 + k * 16, top: 16, width: 6, height: 6, borderRadius: 3, background: C.green, boxShadow: `0 0 8px ${C.green}`, opacity: Math.sin(t * 9 + k * 2) > -0.3 ? 1 : 0.3 }} />)}
          <div style={{ position: 'absolute', left: 18, top: -70, width: 5, height: 72, borderRadius: 3, background: '#141a28', transform: 'rotate(-8deg)' }} />
          <div style={{ position: 'absolute', left: 104, top: -70, width: 5, height: 72, borderRadius: 3, background: '#141a28', transform: 'rotate(8deg)' }} />
        </div>
        {/* plant */}
        <svg style={{ position: 'absolute', left: 930, top: 980, overflow: 'visible' }} width="160" height="320">
          <g transform={`rotate(${sway} 70 300)`}>
            {[[-40, 0], [-15, 1], [10, 2], [35, 3], [-60, 4], [55, 5]].map(([a, k]) => <path key={k} d="M70 300 C 60 220, 30 160, 20 90 C 60 140, 80 210, 70 300" fill="#0d2a26" opacity={0.95} transform={`rotate(${a} 70 300)`} />)}
          </g>
          <rect x="35" y="290" width="70" height="70" rx="10" fill="#14100c" />
        </svg>
      </Layer>
      {/* ---------- foreground: sofa + viewer silhouette ---------- */}
      {person > 0 && (
        <Layer depth={1.3}>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: person }} width="1080" height="1920">
            <defs>
              <linearGradient id="rimL" x1="0" x2="1"><stop offset="0" stopColor="#5b7cff" stopOpacity=".55" /><stop offset=".12" stopColor="#5b7cff" stopOpacity="0" /></linearGradient>
              <linearGradient id="rimR" x1="1" x2="0"><stop offset="0" stopColor={C.red} stopOpacity={0.5 * glow} /><stop offset=".15" stopColor={C.red} stopOpacity="0" /></linearGradient>
            </defs>
            {/* viewer: head + shoulders, seen from behind */}
            <g transform={`translate(0 ${Math.sin(t * 1.1) * 2})`}>
              <path d="M150 1920 L150 1700 C 150 1600, 230 1560, 330 1545 C 360 1520, 365 1500, 360 1480 C 330 1460, 310 1400, 318 1340 C 326 1270, 380 1230, 440 1232 C 505 1235, 552 1282, 556 1350 C 560 1410, 540 1460, 512 1482 C 508 1505, 515 1525, 548 1545 C 650 1562, 730 1605, 730 1700 L730 1920 Z" fill="#03050b" />
              <path d="M150 1920 L150 1700 C 150 1600, 230 1560, 330 1545 C 360 1520, 365 1500, 360 1480 C 330 1460, 310 1400, 318 1340 C 326 1270, 380 1230, 440 1232 C 505 1235, 552 1282, 556 1350 C 560 1410, 540 1460, 512 1482 C 508 1505, 515 1525, 548 1545 C 650 1562, 730 1605, 730 1700 L730 1920 Z" fill="url(#rimL)" />
              <path d="M150 1920 L150 1700 C 150 1600, 230 1560, 330 1545 C 360 1520, 365 1500, 360 1480 C 330 1460, 310 1400, 318 1340 C 326 1270, 380 1230, 440 1232 C 505 1235, 552 1282, 556 1350 C 560 1410, 540 1460, 512 1482 C 508 1505, 515 1525, 548 1545 C 650 1562, 730 1605, 730 1700 L730 1920 Z" fill="url(#rimR)" />
            </g>
            {/* sofa back */}
            <path d="M-60 1640 C -60 1600, -20 1590, 40 1590 L 1040 1590 C 1100 1590, 1140 1600, 1140 1640 L 1140 1980 L -60 1980 Z" fill="#060912" />
            <path d="M-60 1640 C -60 1600, -20 1590, 40 1590 L 1040 1590 C 1100 1590, 1140 1600, 1140 1640" fill="none" stroke="rgba(110,140,255,.25)" strokeWidth="3" />
          </svg>
        </Layer>
      )}
    </AbsoluteFill>
  );
};
