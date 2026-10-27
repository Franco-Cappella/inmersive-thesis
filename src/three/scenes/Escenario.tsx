"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { rig, type Vec3 } from "@/scroll/rig";
import { glow, range, smooth } from "../helpers";
import type { Palette } from "../palette";
import { pipePath } from "../paths";
import { IT_FLOOR_Y } from "./ITFloor";
import { PLC_POS } from "./OTFloor";

// Capítulo 01 · "03:14 AM" (escenario hipotético de la tesina).
// Línea de tiempo dentro de la estadía del capítulo (fx.patch y fx.halt van de 0 a 1 juntos):
//   patch 0.05–0.50  el parche baja de un rack de la oficina al gabinete PLC
//   halt  0.50–0.58  la HMI se congela en un cuadro blanco
//   halt  0.55–0.75  el flujo de las cañerías se corta (OTFloor)
//   halt  0.60–0.92  la válvula de alivio pasa de ámbar a rojo (OTFloor) · baliza de parada de emergencia

const [px, py, pz] = PLC_POS;
const ROUTE: Vec3[] = [
  [-3.6, IT_FLOOR_Y + 1.7, -3.95], // frente de un rack del piso IT
  [-3.6, -5.4, -3.95],
  [px, -5.4, pz],
  [px, py + 0.9, pz], // techo del gabinete PLC
];

export function Escenario({ palette }: { palette: Palette }) {
  const curve = useMemo(() => pipePath(ROUTE, 0.45), []);
  const points = useMemo(() => curve.getSpacedPoints(80), [curve]);
  const packet = useRef<Mesh>(null);
  const cable = useRef<Group>(null);
  const screen = useRef<MeshBasicMaterial>(null);
  const beacon = useRef<MeshBasicMaterial>(null);
  const c = useMemo(
    () => ({
      patch: glow(palette.warn, 3.2),
      screenOk: new Color(palette.flow).multiplyScalar(1.4),
      screenFrozen: new Color("#ffffff").multiplyScalar(2.2),
      alarm: glow(palette.alarm, 3),
      off: new Color(palette.ink).multiplyScalar(0.4),
      tmp: new Vector3(),
    }),
    [palette],
  );

  useFrame((state) => {
    const { patch, halt } = rig.fx;
    const travel = range(patch, 0.05, 0.5);
    if (packet.current) {
      packet.current.visible = travel > 0 && travel < 1;
      curve.getPointAt(Math.min(travel, 0.999), packet.current.position);
    }
    if (cable.current) cable.current.visible = patch > 0.01;
    if (screen.current) screen.current.color.copy(c.screenOk).lerp(c.screenFrozen, smooth(halt, 0.5, 0.58));
    if (beacon.current) {
      const on = smooth(halt, 0.62, 0.7);
      const pulse = rig.snap ? 1 : 0.55 + 0.45 * Math.sin(state.clock.elapsedTime * 7);
      beacon.current.color.copy(c.off).lerp(c.alarm, on * pulse);
    }
  });

  return (
    <group>
      <group ref={cable} visible={false}>
        <Line points={points} color={palette.warn} lineWidth={1.5} dashed dashSize={0.18} gapSize={0.12} />
      </group>
      <mesh ref={packet} visible={false}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshBasicMaterial color={c.patch} toneMapped={false} />
      </mesh>
      {/* HMI del gabinete: azul en marcha, cuadro blanco cuando se congela */}
      <mesh position={[px - 0.12, py + 0.15, pz + 0.305]}>
        <planeGeometry args={[0.56, 0.38]} />
        <meshBasicMaterial ref={screen} toneMapped={false} />
      </mesh>
      {/* Baliza de parada de emergencia (ESD) */}
      <mesh position={[px + 0.3, py + 1.02, pz]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 16]} />
        <meshBasicMaterial ref={beacon} toneMapped={false} />
      </mesh>
    </group>
  );
}
