import { BufferGeometry, EdgesGeometry, Matrix4 } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Vec3 } from "@/scroll/rig";

// Piezas quietas que comparten material: se fusionan en una sola geometría, una llamada de dibujo en vez
// de una por pieza (presupuesto de la sección 8 de la skill; se mide con scripts/presupuesto.cjs).
export type Pieza = { geometry: BufferGeometry; position: Vec3 };

export function fusionar(piezas: Pieza[]) {
  const m = new Matrix4();
  const movidas = piezas.map(({ geometry, position }) => geometry.clone().applyMatrix4(m.makeTranslation(...position)));
  const fusion = mergeGeometries(movidas);
  movidas.forEach((g) => g.dispose());
  return fusion;
}

// Los contornos que dibuja <Edges> de drei (los bordes donde las caras se doblan más de `threshold` grados),
// de varias piezas en una sola lista de segmentos para <Line segments>: un trazo en vez de uno por pieza.
export function contornos(piezas: Pieza[], threshold: number) {
  const puntos: number[] = [];
  for (const { geometry, position } of piezas) {
    const bordes = new EdgesGeometry(geometry, threshold);
    const a = bordes.attributes.position.array;
    for (let i = 0; i < a.length; i += 3) puntos.push(a[i] + position[0], a[i + 1] + position[1], a[i + 2] + position[2]);
    bordes.dispose();
  }
  return puntos;
}
