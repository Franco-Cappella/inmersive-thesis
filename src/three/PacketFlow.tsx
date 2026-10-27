"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Curve, InstancedMesh, Object3D, Vector3 } from "three";

// Paquetes de red viajando por una ruta. Un solo draw call (InstancedMesh).
// `visibility` se lee en cada frame desde rig: nunca pasa por React state.
export function PacketFlow({
  curve,
  count = 24,
  speed = 0.05,
  size = 0.07,
  color,
  visibility,
}: {
  curve: Curve<Vector3>;
  count?: number;
  speed?: number;
  size?: number;
  color: Color;
  visibility: () => number;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const tangent = useMemo(() => new Vector3(), []);
  const ahead = useMemo(() => new Vector3(), []);
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const v = visibility();
    m.visible = v > 0.001;
    if (!m.visible) return;
    const t = state.clock.elapsedTime * speed;
    for (let i = 0; i < count; i++) {
      const u = (i / count + t) % 1;
      curve.getPointAt(u, dummy.position);
      curve.getTangentAt(u, tangent);
      dummy.lookAt(ahead.copy(dummy.position).add(tangent)); // el paquete apunta hacia donde viaja
      dummy.scale.setScalar(v);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[size, size, size * 2.4]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
}
