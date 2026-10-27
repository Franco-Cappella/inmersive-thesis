"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  DataTexture,
  LinearFilter,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  RGBAFormat,
  TubeGeometry,
} from "three";
import type { Vec3 } from "@/scroll/rig";
import type { Palette } from "./palette";
import { pipePath } from "./paths";

// Una franja clara por cada repetición: al desplazar el offset parece que el fluido avanza.
function dashTexture() {
  const w = 32;
  const data = new Uint8Array(w * 4);
  for (let x = 0; x < w; x++) {
    const v = x < 10 ? 255 * Math.sin((Math.PI * x) / 10) : 0;
    data.set([v, v, v, 255], x * 4);
  }
  const tex = new DataTexture(data, w, 1, RGBAFormat);
  tex.colorSpace = NoColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// Cañería de proceso. El flujo (color de estado `flow`) aparece según `amount()`, leído de rig.
export function FlowPipe({
  points,
  radius = 0.14,
  palette,
  amount,
  speed = 0.5,
}: {
  points: Vec3[];
  radius?: number;
  palette: Palette;
  amount: () => number;
  speed?: number;
}) {
  const material = useRef<MeshStandardMaterial>(null);
  const { geometry, tex } = useMemo(() => {
    const path = pipePath(points, 0.5);
    const length = path.getLength();
    const geometry = new TubeGeometry(path, Math.max(48, Math.round(length * 8)), radius, 12, false);
    const tex = dashTexture();
    tex.repeat.set(length / 1.1, 1);
    return { geometry, tex };
  }, [points, radius]);
  useEffect(() => () => {
    geometry.dispose();
    tex.dispose();
  }, [geometry, tex]);

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    const a = amount();
    m.emissiveIntensity = a * 3.2;
    // La textura se mueve a través del material (ref): mutar en el loop lo que devolvió useMemo no corresponde.
    if (a > 0.001 && m.emissiveMap) m.emissiveMap.offset.x -= delta * speed * a;
  });

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        ref={material}
        color={palette.metal}
        roughness={palette.rough}
        metalness={palette.metalness}
        emissive={palette.flow}
        emissiveMap={tex}
        emissiveIntensity={0}
      />
    </mesh>
  );
}
