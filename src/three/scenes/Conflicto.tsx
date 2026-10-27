"use client";

import { Billboard, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, Group, Mesh, MeshBasicMaterial, RingGeometry } from "three";
import { type Vec3 } from "@/scroll/rig";
import { bell, easeOutBack, glow, range, smooth } from "../helpers";
import { PacketFlow } from "../PacketFlow";
import type { Palette } from "../palette";
import { pipePath } from "../paths";
import { hitBeat, overpressure, scanLock, tokenWait } from "../signals";
import { ROUTE } from "./Escenario";
import { PLC_POS, VALVE_POS } from "./OTFloor";

// Capítulo 05 · "Tres controles IT, tres formas de parar". Un golpe por tramo de fx.hits
// (CONFLICTO_TRAMOS en src/scroll/timing.ts), en el orden de la lista del texto, sobre el gabinete
// del 01 y su válvula. En cada golpe la planta se detiene y se repone cuando empieza el siguiente:
//   Parche automático   barra de actualización en la HMI; el SCADA se reinicia, la pantalla se apaga
//                       y salta la parada de emergencia (Escenario vía scadaReboot y esdTrip).
//   Escaneo activo      una ráfaga de paquetes baja por el cable del 01 y el controlador queda en rojo.
//   MFA en plena alarma un reloj de token corre junto a la válvula mientras sube la presión (ámbar);
//                       cuando termina, la válvula ya está en alarma (OTFloor vía overpressure).

const [px, py, pz] = PLC_POS;
// La pantalla de la HMI del gabinete (Escenario): 0,56 × 0,38, centrada en (px - 0,12, py + 0,15).
const BAR = { x: px - 0.34, y: py + 0.05, z: pz + 0.312, w: 0.44, h: 0.05 };
const CLOCK: Vec3 = [VALVE_POS[0] + 1.1, VALVE_POS[1] + 0.75, VALVE_POS[2] + 0.4];
const SEGMENTS = 64;

// Golpe 1: la barra de la actualización avanza en la HMI hasta que el servidor se reinicia.
function UpdateBar({ palette }: { palette: Palette }) {
  const group = useRef<Group>(null);
  const fill = useRef<Mesh>(null);
  const color = useMemo(() => glow(palette.warn, 2.2), [palette]);
  const track = useMemo(() => new Color(palette.ink).multiplyScalar(0.5), [palette]);
  useFrame(() => {
    const b = hitBeat(0);
    const t = range(b, 0.04, 0.28);
    if (group.current) group.current.visible = b > 0 && b < 0.3;
    if (fill.current) {
      fill.current.scale.x = Math.max(0.001, t);
      fill.current.position.x = (BAR.w * t) / 2;
    }
  });
  return (
    <group ref={group} position={[BAR.x, BAR.y, BAR.z]} visible={false}>
      <mesh position={[BAR.w / 2, 0, -0.001]}>
        <planeGeometry args={[BAR.w, BAR.h]} />
        <meshBasicMaterial color={track} toneMapped={false} />
      </mesh>
      <mesh ref={fill}>
        <planeGeometry args={[BAR.w, BAR.h]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Golpe 2: la ráfaga del escáner baja por el cable del 01 hasta el controlador.
function Burst({ palette }: { palette: Palette }) {
  const curve = useMemo(() => pipePath(ROUTE, 0.45), []);
  const points = useMemo(() => curve.getSpacedPoints(80), [curve]);
  const cable = useRef<Group>(null);
  const color = useMemo(() => glow(palette.warn, 1.8), [palette]);
  const burst = () => bell(range(hitBeat(1), 0.05, 0.72));
  useFrame(() => {
    if (cable.current) cable.current.visible = burst() > 0.05;
  });
  return (
    <>
      <group ref={cable} visible={false}>
        <Line points={points} color={palette.warn} lineWidth={1.2} dashed dashSize={0.18} gapSize={0.12} />
      </group>
      <PacketFlow curve={curve} count={28} speed={0.3} size={0.085} color={color} visibility={burst} />
    </>
  );
}

// Golpe 2: el controlador bloqueado queda envuelto en rojo (además de su luz de estado).
function LockShell({ palette }: { palette: Palette }) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const color = useMemo(() => glow(palette.alarm, 1.3), [palette]);
  useFrame(() => {
    const v = scanLock();
    if (mesh.current) mesh.current.visible = v > 0.001;
    if (material.current) material.current.opacity = 0.5 * v;
  });
  return (
    <mesh ref={mesh} position={PLC_POS} visible={false}>
      <boxGeometry args={[0.95 + 0.08, 1.8 + 0.08, 0.6 + 0.08]} />
      <meshBasicMaterial ref={material} color={color} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

// Golpe 3: el reloj del token. Se llena en sentido horario; en ámbar mientras corre, en rojo cuando ya es tarde.
function TokenClock({ palette }: { palette: Palette }) {
  const group = useRef<Group>(null);
  const hand = useRef<Group>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const ring = useMemo(() => new RingGeometry(0.3, 0.38, SEGMENTS, 1, Math.PI / 2, Math.PI * 2), []);
  const track = useMemo(() => new RingGeometry(0.3, 0.38, SEGMENTS, 1), []);
  useEffect(
    () => () => {
      ring.dispose();
      track.dispose();
    },
    [ring, track],
  );
  const c = useMemo(() => ({ warn: glow(palette.warn, 1.6), alarm: glow(palette.alarm, 2.4) }), [palette]);

  useFrame(() => {
    const b = hitBeat(2);
    const t = tokenWait();
    if (group.current) {
      group.current.visible = b > 0;
      group.current.scale.setScalar(Math.max(0.001, easeOutBack(smooth(b, 0, 0.1))));
    }
    ring.setDrawRange(0, Math.floor(SEGMENTS * t) * 6);
    if (hand.current) hand.current.rotation.z = -Math.PI * 2 * t;
    if (material.current) material.current.color.copy(c.warn).lerp(c.alarm, overpressure());
  });

  return (
    <Billboard position={CLOCK}>
      <group ref={group} visible={false}>
        <mesh geometry={track}>
          <meshBasicMaterial color={palette.ink} transparent opacity={0.25} depthWrite={false} />
        </mesh>
        {/* espejado en X: el arco crece en sentido horario desde las 12 */}
        <mesh geometry={ring} scale={[-1, 1, 1]}>
          <meshBasicMaterial ref={material} toneMapped={false} />
        </mesh>
        <group ref={hand}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.035, 0.24, 0.01]} />
            <meshBasicMaterial color={palette.ink} />
          </mesh>
        </group>
      </group>
    </Billboard>
  );
}

export function Conflicto({ palette }: { palette: Palette }) {
  return (
    <group>
      <UpdateBar palette={palette} />
      <Burst palette={palette} />
      <LockShell palette={palette} />
      <TokenClock palette={palette} />
    </group>
  );
}
