"use client";

import { Edges, Grid, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MeshBasicMaterial, MeshStandardMaterial } from "three";
import { rig, type Vec3 } from "@/scroll/rig";
import { FlowPipe } from "../FlowPipe";
import { FONT_URL, smooth } from "../helpers";
import type { Palette } from "../palette";

// Planta OT (abajo): tanques, cañerías con flujo, una válvula y gabinetes PLC.
export const OT_FLOOR_Y = -8;

const TANKS: { x: number; z: number; r: number; h: number }[] = [
  { x: -7.4, z: -6.6, r: 1.3, h: 4.2 },
  { x: -3.9, z: -9.8, r: 1.0, h: 3.4 },
  { x: 4.6, z: -6.9, r: 1.35, h: 4.0 },
  { x: 8.1, z: -10.2, r: 1.0, h: 3.2 },
];

const Y = OT_FLOOR_Y;
const PIPES: Vec3[][] = [
  [[-12, Y + 0.8, -3.6], [12, Y + 0.8, -3.6]],
  [[-6.1, Y + 1.9, -6.6], [-1.6, Y + 1.9, -6.6], [-1.6, Y + 0.8, -3.6]],
  [[3.25, Y + 2.6, -6.9], [1.4, Y + 2.6, -6.9], [1.4, Y + 0.8, -3.6]],
  [[-3.9, Y + 2.9, -8.8], [-3.9, Y + 3.9, -8.8], [4.6, Y + 3.9, -8.8], [4.6, Y + 3.3, -8.8]],
];
const CABINETS: Vec3[] = [
  [2.8, Y + 0.9, -2.6],
  [-5.2, Y + 0.9, -2.8],
];
// El gabinete PLC al que llega el parche en el capítulo 01.
export const PLC_POS = CABINETS[1];

// El proceso corre cuando llegamos a la planta y se corta cuando la planta se detiene (capítulo 01).
const otFlow = () => smooth(rig.hero.descent, 0.45, 0.95) * (1 - smooth(rig.fx.halt, 0.55, 0.75));

function Tank({ x, z, r, h, palette }: { x: number; z: number; r: number; h: number; palette: Palette }) {
  return (
    <group position={[x, OT_FLOOR_Y, z]}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r, r, h, 40]} />
        <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
        <Edges threshold={30} color={palette.edge[0]} lineWidth={1} transparent opacity={palette.edge[1] * 0.6} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <sphereGeometry args={[r, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
      </mesh>
    </group>
  );
}

function StatusLight({ position, palette }: { position: Vec3; palette: Palette }) {
  const material = useRef<MeshBasicMaterial>(null);
  useFrame((state) => {
    if (!material.current) return;
    const pulse = 0.75 + 0.25 * Math.sin(state.clock.elapsedTime * 2.4);
    material.current.color.set(palette.flow).multiplyScalar(1 + 2.2 * otFlow() * pulse);
  });
  return (
    <mesh position={position}>
      <boxGeometry args={[0.22, 0.08, 0.02]} />
      <meshBasicMaterial ref={material} toneMapped={false} />
    </mesh>
  );
}

// Válvula de alivio sobre el colector principal. En el capítulo 01 se traba:
// pasa a ámbar (advertencia) y después a rojo (alarma). El color es estado.
export const VALVE_POS: Vec3 = [-3.2, OT_FLOOR_Y + 0.8, -3.6];

function Valve({ palette }: { palette: Palette }) {
  const body = useRef<MeshStandardMaterial>(null);
  const wheel = useRef<MeshStandardMaterial>(null);
  const c = useMemo(
    () => ({ metal: new Color(palette.metal), ink: new Color(palette.ink), warn: new Color(palette.warn), alarm: new Color(palette.alarm), state: new Color() }),
    [palette],
  );
  useFrame(() => {
    if (!body.current || !wheel.current) return;
    const h = rig.fx.halt;
    const warn = smooth(h, 0.6, 0.7);
    const alarm = smooth(h, 0.8, 0.92);
    c.state.copy(c.warn).lerp(c.alarm, alarm);
    body.current.color.copy(c.metal).lerp(c.state, warn);
    body.current.emissive.copy(c.state);
    body.current.emissiveIntensity = warn * (1.2 + alarm * 1.8);
    wheel.current.color.copy(c.ink).lerp(c.state, warn);
    wheel.current.emissive.copy(c.state);
    wheel.current.emissiveIntensity = warn * (1.2 + alarm * 1.8);
  });
  return (
    <group position={VALVE_POS}>
      <mesh>
        <boxGeometry args={[0.6, 0.55, 0.55]} />
        <meshStandardMaterial ref={body} color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
      </mesh>
      <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.045, 8, 28]} />
        <meshStandardMaterial ref={wheel} color={palette.ink} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function OTFloor({ palette }: { palette: Palette }) {
  return (
    <group>
      <Grid
        position={[0, OT_FLOOR_Y, 0]}
        args={[60, 60]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor={palette.grid[0]}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={palette.grid[1]}
        fadeDistance={42}
        fadeStrength={1.4}
        infiniteGrid
      />
      {TANKS.map((t, i) => (
        <Tank key={i} {...t} palette={palette} />
      ))}
      {PIPES.map((p, i) => (
        <FlowPipe key={i} points={p} radius={i === 0 ? 0.2 : 0.14} palette={palette} amount={otFlow} speed={0.45 + i * 0.08} />
      ))}
      <Valve palette={palette} />
      {CABINETS.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <boxGeometry args={[0.95, 1.8, 0.6]} />
            <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
            <Edges threshold={20} color={palette.edge[0]} lineWidth={1} transparent opacity={palette.edge[1] * 0.7} />
          </mesh>
          <StatusLight position={[0.2, 0.55, 0.31]} palette={palette} />
        </group>
      ))}
      {palette.sodium && (
        <>
          <pointLight position={[-5.5, OT_FLOOR_Y + 5.2, -3.5]} color={palette.sodium} intensity={34} distance={18} decay={2} />
          <pointLight position={[5.5, OT_FLOOR_Y + 4.8, -5]} color={palette.sodium} intensity={30} distance={18} decay={2} />
        </>
      )}
      <Text
        font={FONT_URL}
        fontSize={9}
        position={[1.5, OT_FLOOR_Y + 4.6, -15]}
        color={palette.lettersOutline ? palette.field : palette.letters}
        outlineWidth={palette.lettersOutline ? 0.06 : 0}
        outlineColor={palette.ink}
        anchorX="center"
        anchorY="middle"
      >
        OT
      </Text>
    </group>
  );
}
