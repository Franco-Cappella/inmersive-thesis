"use client";

import { Grid, Line, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, InstancedMesh, Object3D } from "three";
import { rig, type Vec3 } from "@/scroll/rig";
import { FONT_URL, glow, hash, smooth } from "../helpers";
import { PacketFlow } from "../PacketFlow";
import type { Palette } from "../palette";
import { pipePath } from "../paths";

// Piso IT (arriba): un datacenter de racks con LEDs de estado y paquetes por las bandejas.
export const IT_FLOOR_Y = 0.35;

const RACK = { w: 1.0, h: 2.3, d: 1.2 };
const ROWS = [-4.6, -7.6, -10.6];
const RACKS: Vec3[] = ROWS.flatMap((z) =>
  Array.from({ length: 17 }, (_, i) => [-9.6 + i * 1.2, IT_FLOOR_Y + RACK.h / 2, z] as Vec3),
);
const LEDS: Vec3[] = RACKS.flatMap(([x, , z]) =>
  Array.from({ length: 6 }, (_, k) => [x - 0.22 + (k % 2) * 0.44, IT_FLOOR_Y + 0.55 + Math.floor(k / 2) * 0.62, z + RACK.d / 2 + 0.02] as Vec3),
);

const TRAY_Y = IT_FLOOR_Y + RACK.h + 0.45;
const ROUTES: Vec3[][] = [
  [[-11, TRAY_Y, -3.4], [11, TRAY_Y, -3.4]],
  [[11, TRAY_Y, -6.4], [-11, TRAY_Y, -6.4]],
  [[-9, TRAY_Y, -9.4], [-3, TRAY_Y, -9.4], [-3, TRAY_Y, -3.4], [3, TRAY_Y, -3.4], [3, TRAY_Y, -9.4], [9, TRAY_Y, -9.4]],
];

const itVisibility = () => 1 - 0.8 * smooth(rig.hero.descent, 0.3, 0.9);

function Racks({ palette }: { palette: Palette }) {
  const racks = useRef<InstancedMesh>(null);
  const leds = useRef<InstancedMesh>(null);
  const rackGeometry = useMemo(() => new BoxGeometry(RACK.w * 0.92, RACK.h, RACK.d), []);
  useEffect(() => () => rackGeometry.dispose(), [rackGeometry]);
  const on = useMemo(() => glow(palette.flow, 2.6), [palette]);
  const off = useMemo(() => new Color(palette.ink).multiplyScalar(0.35), [palette]);
  const dim = useMemo(() => new Color(), []);

  useLayoutEffect(() => {
    const d = new Object3D();
    RACKS.forEach((p, i) => {
      d.position.set(...p);
      d.updateMatrix();
      racks.current?.setMatrixAt(i, d.matrix);
    });
    LEDS.forEach((p, i) => {
      d.position.set(...p);
      d.updateMatrix();
      leds.current?.setMatrixAt(i, d.matrix);
      leds.current?.setColorAt(i, off);
    });
    if (racks.current) racks.current.instanceMatrix.needsUpdate = true;
    if (leds.current) leds.current.instanceMatrix.needsUpdate = true;
  }, [off]);

  useFrame((state) => {
    const m = leds.current;
    if (!m || !m.instanceColor) return;
    const t = state.clock.elapsedTime;
    const v = itVisibility();
    for (let i = 0; i < LEDS.length; i++) {
      const rate = 0.6 + hash(i) * 3;
      const lit = hash(i * 7.13 + Math.floor(t * rate)) > 0.35;
      m.setColorAt(i, lit ? dim.copy(on).multiplyScalar(v) : off);
    }
    m.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={racks} args={[rackGeometry, undefined, RACKS.length]}>
        <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
      </instancedMesh>
      <instancedMesh ref={leds} args={[undefined, undefined, LEDS.length]}>
        <boxGeometry args={[0.16, 0.05, 0.02]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

export function ITFloor({ palette }: { palette: Palette }) {
  const curves = useMemo(() => ROUTES.map((r) => pipePath(r, 0.3)), []);
  const packet = useMemo(() => glow(palette.flow, 2.8), [palette]);
  return (
    <group>
      <Grid
        position={[0, IT_FLOOR_Y, 0]}
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
      <Racks palette={palette} />
      {ROUTES.map((r, i) => (
        <Line key={i} points={r} color={palette.ink} lineWidth={1} transparent opacity={0.25} />
      ))}
      {curves.map((c, i) => (
        <PacketFlow key={i} curve={c} count={14} speed={0.035 + i * 0.01} color={packet} visibility={itVisibility} />
      ))}
      <Text
        font={FONT_URL}
        fontSize={9}
        position={[1.5, IT_FLOOR_Y + 4.3, -15]}
        color={palette.lettersOutline ? palette.field : palette.letters}
        outlineWidth={palette.lettersOutline ? 0.06 : 0}
        outlineColor={palette.ink}
        anchorX="center"
        anchorY="middle"
      >
        IT
      </Text>
    </group>
  );
}
