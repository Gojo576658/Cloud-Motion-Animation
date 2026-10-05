// Premium OLED TV, drawn with CSS: slim bezel, glass screen with reflections,
// a microphone/standby LED with real glow, and an optional screen layer.
import React from 'react';
import { C } from '../lib/theme';

export const TV: React.FC<{
  x: number; y: number; w: number;          // top-left of the screen body, width
  led?: number;                              // 0..1 red mic LED intensity (+ >1 = flare)
  ledColor?: string;
  screen?: React.ReactNode;                  // content shown on the screen
  screenOn?: number;                         // 0..1 screen brightness (adds bias glow)
  stand?: boolean;
  bias?: number;                             // blue wall glow behind the TV
}> = ({ x, y, w, led = 0, ledColor = C.red, screen, screenOn = 0, stand = true, bias = 0.6 }) => {
  const h = w * 0.575;
  const lr = Math.max(0, led);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      {/* bias light on the wall */}
      <div style={{ position: 'absolute', left: -w * 0.35, top: -h * 0.45, width: w * 1.7, height: h * 1.9, background: `radial-gradient(ellipse at center, rgba(60,110,255,${0.32 * bias + 0.25 * screenOn}) 0%, rgba(40,70,190,${0.12 * bias}) 40%, transparent 70%)` }} />
      {/* body */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: w * 0.008, background: 'linear-gradient(180deg,#232937 0%,#0d1018 55%,#07090e 100%)', boxShadow: `0 ${w * 0.04}px ${w * 0.08}px rgba(0,0,0,.65), inset 0 0 0 1px rgba(255,255,255,.09), inset 0 1px 0 rgba(255,255,255,.18)` }} />
      {/* screen */}
      <div style={{ position: 'absolute', left: w * 0.008, top: w * 0.008, right: w * 0.008, bottom: w * 0.02, borderRadius: w * 0.003, overflow: 'hidden', background: 'linear-gradient(160deg,#0b0f19 0%,#04060b 55%,#020306 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: screenOn }}>{screen}</div>
        {/* glass: diagonal sheen + soft window reflection + edge falloff */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(170,200,255,.10) 0%, rgba(170,200,255,.03) 32%, rgba(255,255,255,0) 33%, rgba(170,200,255,.045) 52%, rgba(255,255,255,0) 70%)' }} />
        <div style={{ position: 'absolute', left: '6%', top: '10%', width: '22%', height: '50%', background: 'linear-gradient(180deg, rgba(120,160,255,.07), rgba(120,160,255,0))', filter: 'blur(6px)', transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,.8)' }} />
      </div>
      {/* chin with mic LED */}
      <div style={{ position: 'absolute', left: '50%', bottom: w * 0.005, transform: 'translateX(-50%)', width: w * 0.06, height: w * 0.008, borderRadius: 3, background: 'linear-gradient(180deg,#2a303d,#11141b)' }} />
      <div style={{ position: 'absolute', left: '50%', bottom: w * 0.0065, transform: 'translate(-50%, 50%)', width: w * 0.007, height: w * 0.007, borderRadius: '50%', background: lr > 0.02 ? ledColor : '#2a1015', boxShadow: lr > 0.02 ? `0 0 ${w * 0.006}px ${ledColor}, 0 0 ${w * 0.02 * lr}px ${ledColor}` : 'none', opacity: 0.35 + 0.65 * Math.min(1, lr) }} />
      {lr > 0.02 && <div style={{ position: 'absolute', left: '50%', bottom: w * 0.0065, transform: 'translate(-50%, 50%)', width: w * 0.12 * (0.6 + lr), height: w * 0.12 * (0.6 + lr), borderRadius: '50%', background: `radial-gradient(circle, ${ledColor}66 0%, ${ledColor}22 30%, transparent 65%)`, pointerEvents: 'none' }} />}
      {/* stand */}
      {stand && <>
        <div style={{ position: 'absolute', left: '50%', top: h, transform: 'translateX(-50%)', width: w * 0.05, height: w * 0.05, background: 'linear-gradient(90deg,#11151d,#2b3240 50%,#11151d)' }} />
        <div style={{ position: 'absolute', left: '50%', top: h + w * 0.05, transform: 'translateX(-50%)', width: w * 0.34, height: w * 0.014, borderRadius: w * 0.01, background: 'linear-gradient(180deg,#363d4c,#0f1218)', boxShadow: `0 ${w * 0.01}px ${w * 0.03}px rgba(0,0,0,.6)` }} />
      </>}
    </div>
  );
};

// the LED's screen position for a TV placed at (x, y, w): useful for camera targets
export const ledPos = (x: number, y: number, w: number) => ({ x: x + w / 2, y: y + w * 0.575 - w * 0.0065 });
