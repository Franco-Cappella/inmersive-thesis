"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, Group, MeshBasicMaterial, TubeGeometry } from "three";
import { rig, type Vec3 } from "@/scroll/rig";
import { glow, range, smooth } from "../helpers";
import { PacketFlow } from "../PacketFlow";
import type { Palette } from "../palette";
import { colonialCut, dmzShown } from "../signals";
import { pipePath } from "../paths";
import { IT_FLOOR_Y } from "./ITFloor";

// Capítulo 02 · "Industria 4.0: se rompe el air gap".
// Línea de tiempo dentro de la estadía (fx.bridge de 0 a 1):
//   0.00–0.10  aparece el borde del air gap entre la oficina y la planta (intacto, en tinta)
//   0.25–0.65  bajan los enlaces: de los racks y de la nube hacia un PLC, un tanque y una válvula
//   0.45–0.65  el borde pasa a ámbar: el aislamiento físico ya no existe
//   0.60–0.80  los paquetes empiezan a cruzar hacia la planta
// En el capítulo 09 el borde se apaga (la DMZ toma su lugar) y cada enlace pasa por una compuerta (Matiz).

export const GAP_Y = -1.7; // a mitad de camino entre el piso IT (y ≈ 0.35) y el techo de la planta
const GAP: Vec3[] = [
  [-11, GAP_Y, 1.5],
  [11, GAP_Y, 1.5],
  [11, GAP_Y, -12.5],
  [-11, GAP_Y, -12.5],
  [-11, GAP_Y, 1.5],
];

// Recorridos de arriba hacia abajo: los paquetes viajan de IT a OT.
export const LINKS: Vec3[][] = [
  // rack de la oficina → gabinete PLC (derecha)
  [[2.4, IT_FLOOR_Y + 1.4, -3.95], [2.4, -5.4, -3.95], [2.8, -5.4, -2.6], [2.8, -6.25, -2.6]],
  // la nube (fuera del edificio) → sensor de un tanque
  [[6.0, 9, -6.1], [6.0, -3.2, -6.1], [4.6, -3.2, -6.9], [4.6, -3.95, -6.9]],
  // rack de la oficina → actuador de la válvula
  [[-1.2, IT_FLOOR_Y + 1.4, -3.95], [-1.2, -5.2, -3.95], [-3.2, -5.2, -3.6], [-3.2, -6.35, -3.6]],
];

function Link({ points, palette, delay }: { points: Vec3[]; palette: Palette; delay: number }) {
  const curve = useMemo(() => pipePath(points, 0.4), [points]);
  const geometry = useMemo(() => new TubeGeometry(curve, 160, 0.045, 6, false), [curve]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const mesh = useRef<Group>(null);
  const total = geometry.index?.count ?? 0;
  const color = useMemo(() => glow(palette.flow, 1.8), [palette]);
  const cutColor = useMemo(() => new Color(palette.ink).multiplyScalar(0.6), [palette]);
  const packet = useMemo(() => glow(palette.flow, 3), [palette]);
  const material = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    const reveal = range(rig.fx.bridge, 0.25 + delay, 0.65 + delay);
    if (mesh.current) mesh.current.visible = reveal > 0;
    // 07, Colonial Pipeline: la empresa corta los enlaces con la planta (pasan a gris y dejan de llevar paquetes).
    if (material.current) material.current.color.copy(color).lerp(cutColor, colonialCut());
    // Revelar la ruta: drawRange sobre los índices del tubo, que van a lo largo del recorrido.
    geometry.setDrawRange(0, Math.floor((total * reveal) / 6) * 6);
  });

  return (
    <>
      <group ref={mesh} visible={false}>
        <mesh geometry={geometry}>
          <meshBasicMaterial ref={material} color={color} toneMapped={false} />
        </mesh>
      </group>
      <PacketFlow curve={curve} count={10} speed={0.06} size={0.11} color={packet} visibility={() => smooth(rig.fx.bridge, 0.6 + delay, 0.8) * (1 - colonialCut())} />
    </>
  );
}

export function Convergencia({ palette }: { palette: Palette }) {
  const border = useRef<Group>(null);
  const c = useMemo(() => ({ ink: new Color(palette.ink), warn: glow(palette.warn, 1.4) }), [palette]);

  useFrame(() => {
    const g = border.current;
    if (!g) return;
    const b = rig.fx.bridge;
    // 09: la DMZ ocupa el lugar del air gap y el borde punteado se apaga mientras aparece.
    const fade = 1 - dmzShown();
    g.visible = b > 0.001 && fade > 0.001;
    const line = g.children[0] as unknown as { material?: MeshBasicMaterial & { opacity: number } };
    if (line?.material) {
      line.material.color.copy(c.ink).lerp(c.warn, smooth(b, 0.45, 0.65));
      line.material.opacity = smooth(b, 0, 0.1) * fade;
    }
  });

  return (
    <group>
      <group ref={border} visible={false}>
        <Line points={GAP} color={palette.ink} lineWidth={2} dashed dashSize={0.5} gapSize={0.3} transparent opacity={0} />
      </group>
      {LINKS.map((points, i) => (
        <Link key={i} points={points} palette={palette} delay={i * 0.05} />
      ))}
    </group>
  );
}
