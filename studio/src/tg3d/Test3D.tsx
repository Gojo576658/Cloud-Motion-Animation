// 3D feasibility test: a steel drive with an LED eye, key light + red rim, moving camera.
import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer, Bloom, Vignette, DepthOfField, Noise } from '@react-three/postprocessing';

const body = new RoundedBoxGeometry(1.4, 2.2, 0.55, 6, 0.18);
const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 60;
  return (
    <>
      <color attach="background" args={['#070b16']} />
      <fog attach="fog" args={['#070b16', 6, 16]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[0, 6, 3]} angle={0.45} penumbra={0.6} intensity={60} castShadow />
      <pointLight position={[-2.5, 1.5, -2]} intensity={25} color="#ff2e4d" />
      <pointLight position={[3, 0.5, 2]} intensity={6} color="#33e1ff" />
      <group position={[0, 0.2, 0]} rotation={[0, Math.sin(a) * 0.4, 0]}>
        <mesh geometry={body} castShadow><meshPhysicalMaterial color="#c9d1dc" metalness={1} roughness={0.32} clearcoat={0.4} /></mesh>
        <mesh position={[0, 1.35, 0]}><boxGeometry args={[0.7, 0.55, 0.3]} /><meshStandardMaterial color="#e8edf3" metalness={1} roughness={0.2} /></mesh>
        <mesh position={[0, 0.45, 0.29]}><circleGeometry args={[0.2, 48]} /><meshStandardMaterial color="#ff2e4d" emissive="#ff2e4d" emissiveIntensity={3} /></mesh>
        <mesh position={[0, -0.35, 0.28]}><planeGeometry args={[0.9, 0.55]} /><meshStandardMaterial color="#05070d" emissive="#ff2e4d" emissiveIntensity={0.15} /></mesh>
      </group>
      <mesh position={[0, -1.05, 0]} receiveShadow><cylinderGeometry args={[1.6, 1.7, 0.25, 64]} /><meshStandardMaterial color="#5a1424" roughness={0.9} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#0b1020" roughness={1} /></mesh>
    </>
  );
};
export const Test3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  const f = useCurrentFrame();
  const r = 6 - f / 60;
  return (
    <AbsoluteFill style={{ background: '#070b16' }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ position: [Math.sin(f / 90) * r, 1.2, Math.cos(f / 90) * r], fov: 35 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <CamLook />
        <Env />
        <Scene />

      </ThreeCanvas>
    </AbsoluteFill>
  );
};
import { useThree } from '@react-three/fiber';
const CamLook: React.FC = () => { const { camera } = useThree(); const f = useCurrentFrame(); camera.position.set(Math.sin(f / 90) * (6 - f / 60), 1.2, Math.cos(f / 90) * (6 - f / 60)); camera.lookAt(0, 0.2, 0); return null; };

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  React.useMemo(() => { const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.6; }, [gl, scene]);
  return null;
};
