"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, BufferGeometry, Color, CylinderGeometry, InstancedMesh, Matrix4, Object3D, Quaternion, TorusGeometry, Vector3 } from "three";
import type { Vec3 } from "@/scroll/rig";
import type { Palette } from "../palette";
import { CABINET, CABINETS, OT_FLOOR_Y, PIPES, pipeRadius, TANKS } from "./OTFloor";

// Pasada de arte de la planta: detalle que hace leer "instalación industrial" sin modelos externos.
// Todo en metal o tinta (el color es estado, nunca decoración) y en pocas llamadas de dibujo:
// cada grupo es un InstancedMesh (bridas, soportes, aros, faldones y frentes de gabinete).

const UP = new Vector3(0, 1, 0);

function matrices(list: { p: Vec3; dir?: Vec3; s: Vec3 }[]) {
  const o = new Object3D();
  const q = new Quaternion();
  return list.map(({ p, dir, s }) => {
    o.position.set(...p);
    o.quaternion.copy(dir ? q.setFromUnitVectors(UP, new Vector3(...dir).normalize()) : q.identity());
    o.scale.set(...s);
    o.updateMatrix();
    return o.matrix.clone();
  });
}

// Bridas a lo largo de cada tramo recto (más o menos cada 3 unidades) y soportes bajo los tramos horizontales.
const FLANGES: { p: Vec3; dir: Vec3; s: Vec3 }[] = [];
const SUPPORTS: { p: Vec3; s: Vec3 }[] = [];
PIPES.forEach((pts, i) => {
  const r = pipeRadius(i);
  for (let k = 0; k < pts.length - 1; k++) {
    const [a, b] = [pts[k], pts[k + 1]];
    const d: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const len = Math.hypot(...d);
    const n = Math.max(1, Math.floor(len / 3));
    for (let j = 1; j <= n; j++) {
      const t = j / (n + 1);
      const p: Vec3 = [a[0] + d[0] * t, a[1] + d[1] * t, a[2] + d[2] * t];
      FLANGES.push({ p, dir: d, s: [r * 1.45, 1, r * 1.45] });
      const horizontal = Math.abs(d[1]) < 1e-6 && p[1] - r > OT_FLOOR_Y + 0.2;
      if (horizontal) {
        const top = p[1] - r;
        SUPPORTS.push({ p: [p[0], (top + OT_FLOOR_Y) / 2, p[2]], s: [1, top - OT_FLOOR_Y, 1] });
      }
    }
  }
});

// Aros de refuerzo a un tercio y dos tercios de cada tanque (el toro se acuesta: su eje pasa a ser vertical),
// y un faldón en la base.
const HOOPS = TANKS.flatMap(({ x, z, r, h }) =>
  [0.33, 0.66].map((f) => ({ p: [x, OT_FLOOR_Y + h * f, z] as Vec3, dir: [0, 0, 1] as Vec3, s: [r + 0.02, r + 0.02, r + 0.02] as Vec3 })),
);
const SKIRTS = TANKS.map(({ x, z, r }) => ({ p: [x, OT_FLOOR_Y + 0.09, z] as Vec3, s: [r + 0.07, 0.18, r + 0.07] as Vec3 }));

// Frente de los gabinetes: tres rejillas abajo y una manija a la derecha.
const VENTS = CABINETS.flatMap(([x, y, z]) =>
  [0, 1, 2].map((k) => ({ p: [x - 0.1, y - 0.58 - k * 0.09, z + CABINET.d / 2 + 0.005] as Vec3, s: [0.5, 0.035, 0.01] as Vec3 })),
);
const HANDLES = CABINETS.map(([x, y, z]) => ({ p: [x + 0.38, y - 0.05, z + CABINET.d / 2 + 0.02] as Vec3, s: [0.04, 0.26, 0.04] as Vec3 }));

function Instances({ geometry, items, color, palette }: { geometry: BufferGeometry; items: Matrix4[]; color: Color; palette: Palette }) {
  const mesh = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    items.forEach((m, i) => mesh.current?.setMatrixAt(i, m));
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [items]);
  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, items.length]}>
      <meshStandardMaterial color={color} roughness={palette.rough} metalness={palette.metalness} />
    </instancedMesh>
  );
}

export function PlantDetails({ palette }: { palette: Palette }) {
  const g = useMemo(
    () => ({
      flange: new CylinderGeometry(1, 1, 0.09, 20),
      support: new BoxGeometry(0.11, 1, 0.11),
      hoop: new TorusGeometry(1, 0.03, 6, 56),
      skirt: new CylinderGeometry(1, 1, 1, 40),
      box: new BoxGeometry(1, 1, 1),
    }),
    [],
  );
  useEffect(() => () => Object.values(g).forEach((x) => x.dispose()), [g]);
  const m = useMemo(
    () => ({
      flanges: matrices(FLANGES),
      supports: matrices(SUPPORTS),
      hoops: matrices(HOOPS),
      skirts: matrices(SKIRTS),
      fronts: matrices([...VENTS, ...HANDLES]),
    }),
    [],
  );
  const c = useMemo(
    () => ({ dark: new Color(palette.metal).multiplyScalar(0.72), darker: new Color(palette.metal).multiplyScalar(0.55), ink: new Color(palette.ink) }),
    [palette],
  );
  return (
    <group>
      <Instances geometry={g.flange} items={m.flanges} color={c.dark} palette={palette} />
      <Instances geometry={g.support} items={m.supports} color={c.darker} palette={palette} />
      <Instances geometry={g.hoop} items={m.hoops} color={c.dark} palette={palette} />
      <Instances geometry={g.skirt} items={m.skirts} color={c.darker} palette={palette} />
      <Instances geometry={g.box} items={m.fronts} color={c.ink} palette={palette} />
    </group>
  );
}
