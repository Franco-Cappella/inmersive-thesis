"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Group, InstancedMesh, MeshBasicMaterial, Object3D, TubeGeometry } from "three";
import { type Vec3 } from "@/scroll/rig";
import { glow, range, smooth } from "../helpers";
import { PacketFlow } from "../PacketFlow";
import type { Palette } from "../palette";
import { pipePath } from "../paths";
import { caseBeat, itInfection } from "../signals";
import { IT_FLOOR_Y, RACK, RACK_ROWS, RACKS } from "./ITFloor";

// Capítulo 07 · "Cuatro casos que no se leen en bloque". Un caso por tramo de fx.attack
// (CASOS_TRAMOS en src/scroll/timing.ts), en el orden de la lista del texto:
//   Colonial Pipeline  los racks de la oficina se ponen en rojo; la empresa corta los enlaces
//                      con la planta y la detiene (OTFloor/Convergencia vía colonialCut). El rojo no baja.
//   Oldsmar            recorrido en ÁMBAR desde el acceso remoto hasta la válvula: exposición, no ataque
//                      comprobado (el caso quedó en discusión). La válvula pasa a advertencia (OTFloor).
//   Stuxnet            recorrido rojo hasta el controlador de la derecha, que pasa a alarma.
//   Industroyer        recorrido rojo hasta el controlador de la izquierda, que pasa a alarma.

const TRACES: { beat: number; color: "warn" | "alarm"; points: Vec3[] }[] = [
  // Oldsmar: escritorio remoto desde afuera (arriba, fuera de cuadro) hasta la válvula
  { beat: 1, color: "warn", points: [[-4.4, 9, -3.2], [-4.4, -5.0, -3.2], [-3.2, -5.0, -3.6], [-3.2, -6.35, -3.6]] },
  // Stuxnet: desde un equipo de la oficina hasta el gabinete PLC de la derecha
  { beat: 2, color: "alarm", points: [[1.2, IT_FLOOR_Y + 1.4, -3.95], [1.2, -5.6, -3.95], [2.8, -5.6, -2.6], [2.8, -6.25, -2.6]] },
  // Industroyer: desde la oficina hasta el gabinete PLC de la izquierda
  { beat: 3, color: "alarm", points: [[-6.0, IT_FLOOR_Y + 1.4, -3.95], [-6.0, -5.6, -3.95], [-5.2, -5.6, -2.8], [-5.2, -6.25, -2.8]] },
];

// Colonial: la fila de racks del frente (la que se ve desde la planta) queda en rojo.
const INFECTED = RACKS.filter(([, , z]) => z === RACK_ROWS[0]);

function Trace({ beat, points, hex, warn }: { beat: number; points: Vec3[]; hex: string; warn: boolean }) {
  const curve = useMemo(() => pipePath(points, 0.4), [points]);
  const geometry = useMemo(() => new TubeGeometry(curve, 160, 0.07, 8, false), [curve]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const group = useRef<Group>(null);
  const total = geometry.index?.count ?? 0;
  // El ámbar con mucho brillo se satura a amarillo: la advertencia brilla menos que la alarma.
  const color = useMemo(() => glow(hex, warn ? 1.45 : 2.2), [hex, warn]);

  useFrame(() => {
    const reveal = range(caseBeat(beat), 0, 0.6);
    if (group.current) group.current.visible = reveal > 0;
    geometry.setDrawRange(0, Math.floor((total * reveal) / 6) * 6);
  });

  return (
    <>
      <group ref={group} visible={false}>
        <mesh geometry={geometry}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
      <PacketFlow curve={curve} count={8} speed={0.09} size={0.13} color={color} visibility={() => smooth(caseBeat(beat), 0.6, 0.8)} />
    </>
  );
}

function InfectedRacks({ palette }: { palette: Palette }) {
  const mesh = useRef<InstancedMesh>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const geometry = useMemo(() => new BoxGeometry(RACK.w * 0.92 + 0.08, RACK.h + 0.08, RACK.d + 0.08), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const color = useMemo(() => glow(palette.alarm, 1.3), [palette]);

  useLayoutEffect(() => {
    const d = new Object3D();
    INFECTED.forEach((p, i) => {
      d.position.set(...p);
      d.updateMatrix();
      mesh.current?.setMatrixAt(i, d.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    const v = itInfection();
    if (mesh.current) mesh.current.visible = v > 0.001;
    if (material.current) material.current.opacity = 0.55 * v;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, INFECTED.length]} visible={false}>
      <meshBasicMaterial ref={material} color={color} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}

export function Casos({ palette }: { palette: Palette }) {
  return (
    <group>
      <InfectedRacks palette={palette} />
      {TRACES.map((t) => (
        <Trace key={t.beat} beat={t.beat} points={t.points} hex={palette[t.color]} warn={t.color === "warn"} />
      ))}
    </group>
  );
}
