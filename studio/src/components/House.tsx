// Top-down house plan (2.5D tilt) shared by the audio and network-scan sections,
// so the camera can carry the same house from one section into the next.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, fonts } from '../lib/theme';
import { Icon } from './Icon';

export const HOUSE = { x: 260, y: 140, w: 1400, h: 800 };
// TV sits on the living-room top wall
export const HOUSE_TV = { x: HOUSE.x + 330, y: HOUSE.y + 60 };

// device pins for the network scan (named ones get a label)
export const DEVICES: { x: number; y: number; icon: string; name?: string }[] = [
  { x: 520, y: 470, icon: 'ph:device-mobile-bold', name: 'Smartphone' },
  { x: 700, y: 520, icon: 'ph:watch-bold', name: 'Smartwatch' },
  { x: 1370, y: 760, icon: 'ph:printer-bold', name: '3D printer' },
  { x: 1500, y: 360, icon: 'ph:fan-bold', name: 'Air purifier' },
  { x: 980, y: 330, icon: 'ph:thermometer-simple-bold', name: 'Thermostat' },
  { x: 1240, y: 640, icon: 'ph:laptop-bold' }, { x: 1180, y: 300, icon: 'ph:speaker-hifi-bold' }, { x: 380, y: 300, icon: 'ph:game-controller-bold' },
  { x: 1560, y: 820, icon: 'ph:security-camera-bold' }, { x: 820, y: 800, icon: 'ph:lightbulb-bold' }, { x: 1080, y: 520, icon: 'tabler:fridge' },
  { x: 460, y: 820, icon: 'ph:device-tablet-bold' }, { x: 300, y: 600, icon: 'tabler:router' }, { x: 1420, y: 250, icon: 'ph:lightbulb-bold' },
];
// fill to 38 with small dots
for (let i = DEVICES.length; i < 38; i++) {
  const a = i * 2.39996, r = 0.25 + ((i * 37) % 70) / 100;
  DEVICES.push({ x: HOUSE.x + HOUSE.w / 2 + Math.cos(a) * r * 640, y: HOUSE.y + HOUSE.h / 2 + Math.sin(a) * r * 340, icon: ['ph:plug-bold', 'ph:lightbulb-bold', 'ph:device-mobile-bold', 'ph:speaker-simple-high-bold', 'ph:wifi-high-bold'][i % 5] });
}

const Wall: React.FC<{ d: string }> = ({ d }) => <path d={d} fill="none" stroke="#3a5488" strokeWidth="10" strokeLinecap="round" />;

export const House: React.FC<{ led?: number; dim?: number }> = ({ led = 1, dim = 0 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const { x, y, w, h } = HOUSE;
  const furn = (fx: number, fy: number, fw: number, fh: number, r = 10) => <rect x={fx} y={fy} width={fw} height={fh} rx={r} fill="#16213a" stroke="#2a3a60" strokeWidth="2" />;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible', opacity: 1 - dim * 0.6 }} viewBox="0 0 1920 1080">
      <defs>
        <pattern id="floor" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#0b1324" /><path d="M0 40 L40 0" stroke="#111c33" strokeWidth="2" /></pattern>
        <radialGradient id="tvglow"><stop offset="0" stopColor={C.red} stopOpacity=".5" /><stop offset="1" stopColor={C.red} stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx="18" fill="url(#floor)" />
      {/* rooms */}
      <Wall d={`M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`} />
      <Wall d={`M ${x + 700} ${y} V ${y + 290} M ${x + 700} ${y + 400} V ${y + h}`} />
      <Wall d={`M ${x} ${y + 470} H ${x + 300} M ${x + 420} ${y + 470} H ${x + 700}`} />
      <Wall d={`M ${x + 700} ${y + 420} H ${x + 1000} M ${x + 1110} ${y + 420} H ${x + w}`} />
      {/* furniture */}
      {furn(x + 210, y + 300, 300, 90, 30)} {furn(x + 290, y + 190, 140, 60, 12)}
      {furn(x + 60, y + 560, 220, 160)} {furn(x + 480, y + 580, 160, 80)}
      {furn(x + 760, y + 40, 560, 70)} {furn(x + 1240, y + 150, 100, 160)} {furn(x + 880, y + 200, 220, 130, 16)}
      {furn(x + 900, y + 520, 260, 220, 16)} {furn(x + 1200, y + 520, 140, 90)}
      {/* room labels */}
      {[['LIVING ROOM', x + 40, y + 440], ['KITCHEN', x + 740, y + 380], ['BEDROOM', x + 740, y + 780], ['OFFICE', x + 40, y + 780]].map(([l, lx, ly]) => <text key={l as string} x={lx as number} y={ly as number} fill="#4a5d86" style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.2em' }}>{l}</text>)}
      {/* the TV on the living-room wall */}
      <circle cx={HOUSE_TV.x} cy={HOUSE_TV.y} r={90} fill="url(#tvglow)" opacity={led * (0.6 + 0.4 * Math.sin(t * 3.4))} />
      <rect x={HOUSE_TV.x - 130} y={HOUSE_TV.y - 22} width="260" height="18" rx="5" fill="#0d1220" stroke="#5b6f9c" strokeWidth="2" />
      <circle cx={HOUSE_TV.x} cy={HOUSE_TV.y + 4} r="7" fill={C.red} opacity={0.5 + 0.5 * led} />
    </svg>
  );
};

// one device pin (icon in a glowing disc) that pops in at `at`
export const DevicePin: React.FC<{ x: number; y: number; icon: string; s: number; color?: string; ring?: number }> = ({ x, y, icon, s, color = C.cyan, ring = 0 }) => {
  if (s <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, transform: `scale(${s})` }}>
      <div style={{ position: 'absolute', inset: -ring * 40, borderRadius: '50%', border: `2px solid ${color}`, opacity: (1 - ring) * 0.7 }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(8,14,28,.92)', border: `2px solid ${color}`, boxShadow: `0 0 20px ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={30} color={color} /></div>
    </div>
  );
};
