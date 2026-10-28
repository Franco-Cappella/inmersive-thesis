"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Curve, InstancedMesh, Object3D, Vector3 } from "three";

// Paquetes de red viajando por una o varias rutas del mismo color. Un solo draw call (InstancedMesh)
// para todas: cada ruta tiene su cantidad, su velocidad y su visibilidad.
// `visibility` se lee en cada frame desde rig: nunca pasa por React state.
export type PacketRoute = { curve: Curve<Vector3>; count: number; speed: number; visibility: () => number };

export function PacketFlow({ routes, size = 0.07, color }: { routes: PacketRoute[]; size?: number; color: Color }) {
  const mesh = useRef<InstancedMesh>(null);
  const total = routes.reduce((n, r) => n + r.count, 0);
  const dummy = useMemo(() => new Object3D(), []);
  const tangent = useMemo(() => new Vector3(), []);
  const ahead = useMemo(() => new Vector3(), []);
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    m.visible = routes.some((r) => r.visibility() > 0.001);
    if (!m.visible) return;
    let k = 0;
    for (const { curve, count, speed, visibility } of routes) {
      const v = visibility(); // una ruta apagada deja sus paquetes en tamaño 0
      const t = state.clock.elapsedTime * speed;
      for (let i = 0; i < count; i++, k++) {
        const u = (i / count + t) % 1;
        curve.getPointAt(u, dummy.position);
        curve.getTangentAt(u, tangent);
        dummy.lookAt(ahead.copy(dummy.position).add(tangent)); // el paquete apunta hacia donde viaja
        dummy.scale.setScalar(v);
        dummy.updateMatrix();
        m.setMatrixAt(k, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, total]} frustumCulled={false}>
      <boxGeometry args={[size, size, size * 2.4]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
}
