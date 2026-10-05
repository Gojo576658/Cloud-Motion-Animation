// 2.5D camera: keyframed pan/zoom/rotate with parallax layers and velocity-based motion blur.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { track, EASE } from '../lib/time';

export type CamKey = { t: number; x: number; y: number; z: number; r?: number; e?: (u: number) => number };
type Cam = { x: number; y: number; z: number; r: number; blur: number };
const Ctx = createContext<Cam>({ x: 0, y: 0, z: 1, r: 0, blur: 0 });

function evalCam(keys: CamKey[], t: number): Omit<Cam, 'blur'> {
  const get = (k: 'x' | 'y' | 'z' | 'r') => {
    if (t <= keys[0].t) return keys[0][k] ?? 0;
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (t <= b.t) return track(t, [[a.t, a[k] ?? 0], [b.t, b[k] ?? 0]], b.e ?? EASE.inOut);
    }
    return keys[keys.length - 1][k] ?? 0;
  };
  return { x: get('x'), y: get('y'), z: get('z'), r: get('r') };
}

// x,y = the scene point (in 1920x1080 space) the camera looks at; z = zoom
export const Camera: React.FC<{ keys: CamKey[]; children: React.ReactNode; blur?: boolean }> = ({ keys, children, blur = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const c = evalCam(keys, t);
  const p = evalCam(keys, t - 1 / fps);
  const v = Math.hypot((c.x - p.x) * c.z, (c.y - p.y) * c.z) + Math.abs(Math.log(c.z / p.z)) * 900;
  const mb = blur ? Math.min(10, v * 0.06) : 0;
  return <Ctx.Provider value={{ ...c, blur: mb }}>{children}</Ctx.Provider>;
};

// A parallax layer. depth 1 = moves with the camera, <1 = background, >1 = foreground.
export const Layer: React.FC<{ depth?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ depth = 1, children, style }) => {
  const c = useContext(Ctx);
  const z = 1 + (c.z - 1) * depth;
  const cx = 960 + (c.x - 960) * depth, cy = 540 + (c.y - 540) * depth;
  return (
    <AbsoluteFill style={{ transform: `translate(960px, 540px) rotate(${c.r * depth}deg) scale(${z}) translate(${-cx}px, ${-cy}px)`, transformOrigin: '0 0', filter: c.blur > 0.4 ? `blur(${(c.blur * Math.min(1.5, depth)).toFixed(1)}px)` : undefined, ...style }}>
      {children}
    </AbsoluteFill>
  );
};

export const useCam = () => useContext(Ctx);
