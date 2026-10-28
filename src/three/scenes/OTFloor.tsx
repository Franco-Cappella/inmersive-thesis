"use client";

import { Grid, Line, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, CylinderGeometry, Group, InstancedMesh, MeshStandardMaterial, Object3D, SphereGeometry } from "three";
import { rig, type Vec3 } from "@/scroll/rig";
import { FlowPipe } from "../FlowPipe";
import { FONT_URL, glow, smooth } from "../helpers";
import { contornos, fusionar } from "../merge";
import type { Palette } from "../palette";
import { hitBeat, oldsmarExposure, overpressure, plantFlow, plcCompromised, valveTurn } from "../signals";

// Planta OT (abajo): tanques, cañerías con flujo, una válvula y gabinetes PLC.
export const OT_FLOOR_Y = -8;

export const TANKS: { x: number; z: number; r: number; h: number }[] = [
  { x: -7.4, z: -6.6, r: 1.3, h: 4.2 },
  { x: -3.9, z: -9.8, r: 1.0, h: 3.4 },
  { x: 4.6, z: -6.9, r: 1.35, h: 4.0 },
  { x: 8.1, z: -10.2, r: 1.0, h: 3.2 },
];

const Y = OT_FLOOR_Y;
// Las cañerías: el colector principal (radio 0,2) y tres ramales (0,14). PlantDetails les pone bridas y soportes.
export const PIPES: Vec3[][] = [
  [[-12, Y + 0.8, -3.6], [12, Y + 0.8, -3.6]],
  [[-6.1, Y + 1.9, -6.6], [-1.6, Y + 1.9, -6.6], [-1.6, Y + 0.8, -3.6]],
  [[3.25, Y + 2.6, -6.9], [1.4, Y + 2.6, -6.9], [1.4, Y + 0.8, -3.6]],
  [[-3.9, Y + 2.9, -8.8], [-3.9, Y + 3.9, -8.8], [4.6, Y + 3.9, -8.8], [4.6, Y + 3.3, -8.8]],
];
export const pipeRadius = (i: number) => (i === 0 ? 0.2 : 0.14);
export const CABINET = { w: 0.95, h: 1.8, d: 0.6 };
export const CABINETS: Vec3[] = [
  [2.8, Y + 0.9, -2.6],
  [-5.2, Y + 0.9, -2.8],
];
// El gabinete PLC al que llega el parche en el capítulo 01.
export const PLC_POS = CABINETS[1];

// El proceso corre cuando llegamos a la planta y se corta si la planta se detiene (ver signals.ts).
const otFlow = plantFlow;

// Los cuatro tanques en una sola geometría (cuerpo y domo) y sus contornos en un solo trazo: son piezas
// quietas que comparten material. El contorno, como antes, es solo el del cuerpo.
function Tanks({ palette }: { palette: Palette }) {
  const { body, outline } = useMemo(() => {
    const cuerpos = TANKS.map(({ x, z, r, h }) => ({ geometry: new CylinderGeometry(r, r, h, 40), position: [x, OT_FLOOR_Y + h / 2, z] as Vec3 }));
    const domos = TANKS.map(({ x, z, r, h }) => ({
      geometry: new SphereGeometry(r, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      position: [x, OT_FLOOR_Y + h, z] as Vec3,
    }));
    const fusion = { body: fusionar([...cuerpos, ...domos]), outline: contornos(cuerpos, 30) };
    [...cuerpos, ...domos].forEach((p) => p.geometry.dispose());
    return fusion;
  }, []);
  useEffect(() => () => body.dispose(), [body]);
  return (
    <>
      <mesh geometry={body}>
        <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
      </mesh>
      <Line segments points={outline} color={palette.edge[0]} lineWidth={1} transparent opacity={palette.edge[1] * 0.6} />
    </>
  );
}

// Gabinetes PLC: cuerpos y contornos fusionados como los tanques. La luz de estado de cada uno va instanciada,
// con su propio color: azul en marcha; roja si el controlador está comprometido (capítulo 07).
const STATUS_LIGHT: Vec3 = [0.2, 0.55, 0.31];

function Cabinets({ palette }: { palette: Palette }) {
  const { body, outline } = useMemo(() => {
    const piezas = CABINETS.map((position) => ({ geometry: new BoxGeometry(CABINET.w, CABINET.h, CABINET.d), position }));
    const fusion = { body: fusionar(piezas), outline: contornos(piezas, 20) };
    piezas.forEach((p) => p.geometry.dispose());
    return fusion;
  }, []);
  useEffect(() => () => body.dispose(), [body]);
  const lights = useRef<InstancedMesh>(null);
  const c = useMemo(() => ({ alarm: glow(palette.alarm, 3), light: new Color() }), [palette]);
  useLayoutEffect(() => {
    const m = lights.current;
    if (!m) return;
    const d = new Object3D();
    CABINETS.forEach(([x, y, z], i) => {
      d.position.set(x + STATUS_LIGHT[0], y + STATUS_LIGHT[1], z + STATUS_LIGHT[2]);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, c.light.set(palette.flow));
    });
    m.instanceMatrix.needsUpdate = true;
  }, [c, palette]);
  useFrame((state) => {
    const m = lights.current;
    if (!m?.instanceColor) return;
    const pulse = 0.75 + 0.25 * Math.sin(state.clock.elapsedTime * 2.4);
    for (let i = 0; i < CABINETS.length; i++) {
      c.light
        .set(palette.flow)
        .multiplyScalar(1 + 2.2 * otFlow() * pulse)
        .lerp(c.alarm, plcCompromised(i));
      m.setColorAt(i, c.light);
    }
    m.instanceColor.needsUpdate = true;
  });
  return (
    <>
      <mesh geometry={body}>
        <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
      </mesh>
      <Line segments points={outline} color={palette.edge[0]} lineWidth={1} transparent opacity={palette.edge[1] * 0.7} />
      <instancedMesh ref={lights} args={[undefined, undefined, CABINETS.length]}>
        <boxGeometry args={[0.22, 0.08, 0.02]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

// Válvula de alivio sobre el colector principal. En el capítulo 01 se traba:
// pasa a ámbar (advertencia) y después a rojo (alarma). El color es estado.
export const VALVE_POS: Vec3 = [-3.2, OT_FLOOR_Y + 0.8, -3.6];

function handwheelSpokes() {
  const piezas = [
    { geometry: new CylinderGeometry(0.035, 0.035, 0.2, 8), position: [0.32, 0.92, 0] as Vec3 },
    { geometry: new BoxGeometry(0.62, 0.035, 0.035), position: [0, 0.82, 0] as Vec3 },
    { geometry: new BoxGeometry(0.035, 0.035, 0.62), position: [0, 0.82, 0] as Vec3 },
  ];
  const fusion = fusionar(piezas);
  piezas.forEach((p) => p.geometry.dispose());
  return fusion;
}

function Valve({ palette }: { palette: Palette }) {
  const spokes = useMemo(() => handwheelSpokes(), []);
  useEffect(() => () => spokes.dispose(), [spokes]);
  const body = useRef<MeshStandardMaterial>(null);
  const wheel = useRef<MeshStandardMaterial>(null);
  const handle = useRef<Group>(null);
  const c = useMemo(
    () => ({ metal: new Color(palette.metal), ink: new Color(palette.ink), warn: new Color(palette.warn), alarm: new Color(palette.alarm), state: new Color() }),
    [palette],
  );
  useFrame(() => {
    // 03: la trama escribe un valor y el volante gira (y el vástago sube un poco).
    if (handle.current) {
      const turn = valveTurn();
      handle.current.rotation.y = turn * Math.PI * 3;
      handle.current.position.y = turn * 0.14;
    }
    if (!body.current || !wheel.current) return;
    const h = rig.fx.halt;
    // 01: se traba (ámbar → rojo). 05, MFA: la presión sube (ámbar) y la maniobra llega tarde (rojo).
    // 07, Oldsmar: queda expuesta (solo ámbar: el caso está en discusión).
    const warn = Math.max(smooth(h, 0.6, 0.7), smooth(hitBeat(2), 0.1, 0.25), oldsmarExposure());
    const alarm = Math.max(smooth(h, 0.8, 0.92), overpressure());
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
      <group ref={handle}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
        </mesh>
        <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.045, 8, 28]} />
          <meshStandardMaterial ref={wheel} color={palette.ink} roughness={0.6} />
        </mesh>
        {/* rayos y manija del volante (una sola pieza): sin ellos no se ve que gira */}
        <mesh geometry={spokes}>
          <meshStandardMaterial color={palette.ink} roughness={0.6} />
        </mesh>
      </group>
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
      <Tanks palette={palette} />
      {PIPES.map((p, i) => (
        <FlowPipe key={i} points={p} radius={pipeRadius(i)} palette={palette} amount={otFlow} speed={0.45 + i * 0.08} />
      ))}
      <Valve palette={palette} />
      <Cabinets palette={palette} />
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
