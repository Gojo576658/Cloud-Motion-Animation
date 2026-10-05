// Night living room, illustrated in layers for parallax.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Layer } from './Camera';
import { TV } from './TV';
import { Glow } from './Backdrop';
import { C } from '../lib/theme';

export const TVX = 470, TVY = 250, TVW = 980;

export const LivingRoom: React.FC<{
  led?: number; screen?: React.ReactNode; screenOn?: number; person?: number; lamp?: number;
  plug?: number;   // 1 = plugged in, 0 = pulled out
  portLed?: number;
}> = ({ led = 1, screen, screenOn = 0, person = 1, lamp = 1, plug = 1, portLed = 1 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill>
      {/* wall */}
      <Layer depth={0.85}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#0a1124 0%,#0b1430 45%,#081022 75%,#050914 100%)' }} />
        <div style={{ position: 'absolute', left: -400, top: 0, width: 2720, height: 900, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.012) 0 2px, transparent 2px 180px)' }} />
        {/* window */}
        <div style={{ position: 'absolute', left: 70, top: 160, width: 300, height: 470, borderRadius: 6, background: 'linear-gradient(180deg,#14306b 0%,#0d1f48 60%,#0a1734 100%)', boxShadow: 'inset 0 0 0 10px #070c18, 0 0 80px rgba(70,120,255,.25)' }}>
          <div style={{ position: 'absolute', left: 190, top: 60, width: 54, height: 54, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #f4f7ff, #b9c9ef 60%, #8ea4d8)', boxShadow: '0 0 40px rgba(200,220,255,.6)' }} />
          {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 10, right: 10, top: 14 + i * 32, height: 3, background: 'rgba(5,9,20,.55)' }} />)}
          <div style={{ position: 'absolute', left: 145, top: 0, width: 10, height: '100%', background: '#070c18' }} />
        </div>
        {/* curtains */}
        <div style={{ position: 'absolute', left: 20, top: 120, width: 70, height: 760, background: 'linear-gradient(90deg,#0b1226,#16224a 60%,#0b1226)', borderRadius: '0 0 30px 30px' }} />
        <div style={{ position: 'absolute', left: 350, top: 120, width: 70, height: 760, background: 'linear-gradient(90deg,#0b1226,#16224a 40%,#0b1226)', borderRadius: '0 0 30px 30px' }} />
        {/* moonlight shaft onto the floor */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: 'linear-gradient(115deg, rgba(120,160,255,.10), rgba(120,160,255,0) 60%)', clipPath: 'polygon(90px 170px, 360px 170px, 1150px 1080px, 420px 1080px)' }} />
        {/* floor */}
        <div style={{ position: 'absolute', left: -400, top: 870, width: 2720, height: 400, background: 'linear-gradient(180deg,#0d1427 0%,#070b16 100%)' }} />
        <div style={{ position: 'absolute', left: -400, top: 870, width: 2720, height: 400, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 2px, transparent 2px 160px)', transform: 'perspective(600px) rotateX(55deg)', transformOrigin: '50% 0' }} />
        <div style={{ position: 'absolute', left: -400, top: 868, width: 2720, height: 3, background: 'rgba(120,150,220,.18)' }} />
        {/* floor lamp (warm) */}
        <div style={{ position: 'absolute', left: 1640, top: 380, width: 8, height: 500, background: 'linear-gradient(90deg,#141924,#2c3445,#141924)' }} />
        <div style={{ position: 'absolute', left: 1580, top: 330, width: 128, height: 90, background: 'linear-gradient(180deg,#3a2c22,#20170f)', clipPath: 'polygon(22% 0, 78% 0, 100% 100%, 0 100%)' }} />
        <Glow x={1644} y={430} r={300} color={`rgba(255,170,90,${0.35 * lamp})`} />
        <div style={{ position: 'absolute', left: 1580, top: 420, width: 128, height: 460, background: `linear-gradient(180deg, rgba(255,170,90,${0.18 * lamp}), rgba(255,170,90,0))`, clipPath: 'polygon(0 0, 100% 0, 150% 100%, -50% 100%)' }} />
        {/* plant */}
        <svg style={{ position: 'absolute', left: 1730, top: 560, width: 180, height: 320 }} viewBox="0 0 180 320">
          <path d="M60 230 h60 l-8 90 h-44 z" fill="#161c2b" />
          {[[-40, 1], [-20, 0.9], [0, 1.05], [20, 0.95], [40, 1], [-55, 0.7], [55, 0.75]].map(([a, s], i) => (
            <path key={i} transform={`translate(90 235) rotate(${a}) scale(${s})`} d="M0 0 C -26 -60 -18 -150 0 -200 C 18 -150 26 -60 0 0 Z" fill={i % 2 ? '#123527' : '#0f2b21'} stroke="rgba(120,255,190,.08)" />
          ))}
        </svg>
      </Layer>

      {/* media console + TV */}
      <Layer depth={1}>
        <div style={{ position: 'absolute', left: 380, top: 876, width: 1160, height: 120, borderRadius: 8, background: 'linear-gradient(180deg,#1a2133 0%,#0d111c 30%,#080b13 100%)', boxShadow: '0 30px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)' }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 30 + i * 380, top: 30, width: 340, height: 70, borderRadius: 4, background: 'rgba(255,255,255,.02)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04)' }} />)}
        </div>
        <TV x={TVX} y={TVY} w={TVW} led={led} screen={screen} screenOn={screenOn} />
        {/* red reflection of the LED on the console top */}
        <Glow x={960} y={884} r={120} color={`rgba(255,46,77,${0.22 * Math.min(1, led)})`} />
        {/* wall jack + ethernet cable */}
        <div style={{ position: 'absolute', left: 1500, top: 790, width: 46, height: 66, borderRadius: 6, background: 'linear-gradient(180deg,#cfd6e4,#9aa4b8)', boxShadow: '0 4px 12px rgba(0,0,0,.5)' }}>
          <div style={{ position: 'absolute', left: 13, top: 20, width: 20, height: 18, background: '#1b2130', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: 36, top: 8, width: 6, height: 6, borderRadius: '50%', background: portLed > 0.5 ? C.green : '#2a1d1d', boxShadow: portLed > 0.5 ? `0 0 10px ${C.green}` : 'none' }} />
        </div>
        {(() => {
          const u = 1 - plug; // 0 plugged, 1 pulled out
          const px = 1523 + u * 26, py = 823 + u * 46; // plug head position
          return (
            <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible', pointerEvents: 'none' }} viewBox="0 0 1920 1080">
              <path d={`M 1420 700 C 1440 800, 1450 ${880 + u * 20}, 1480 ${875 + u * 30} S ${px} ${py + 40}, ${px} ${py + 12}`} stroke="#2f6bff" strokeWidth="8" fill="none" strokeLinecap="round" />
              <g transform={`rotate(${u * 28} ${px} ${py})`}>
                <rect x={px - 11} y={py - 14} width="22" height="28" rx="4" fill="#3a78ff" stroke="#9bbcff" strokeWidth="1.5" />
                <rect x={px - 6} y={py - 22} width="12" height="9" rx="1" fill="#c9d4ea" opacity={u > 0.05 ? 1 : 0} />
              </g>
            </svg>
          );
        })()}
      </Layer>

      {/* foreground: sofa back + person (rim-lit by the TV) */}
      <Layer depth={1.22}>
        <div style={{ position: 'absolute', left: -120, top: 930, width: 1500, height: 260, borderRadius: '90px 90px 0 0', background: 'linear-gradient(180deg,#141b2c 0%,#090d17 40%,#05070d 100%)', boxShadow: 'inset 0 2px 0 rgba(120,150,255,.15)', opacity: person }} />
        <svg style={{ position: 'absolute', left: 300, top: 640, width: 520, height: 460, opacity: person }} viewBox="0 0 520 460">
          <defs>
            <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7ea6ff" stopOpacity=".55" /><stop offset=".5" stopColor="#3d63c9" stopOpacity=".15" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
          </defs>
          <path d="M260 40 C 312 40 340 82 336 132 C 333 168 318 196 300 210 C 300 226 304 238 318 246 C 400 262 470 300 492 360 L 500 460 L 20 460 L 28 360 C 50 300 120 262 202 246 C 216 238 220 226 220 210 C 202 196 187 168 184 132 C 180 82 208 40 260 40 Z" fill="#03050a" stroke="url(#rim)" strokeWidth="5" />
        </svg>
      </Layer>
    </AbsoluteFill>
  );
};
