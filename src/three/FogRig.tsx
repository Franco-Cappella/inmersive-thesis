"use client";

import { useFrame } from "@react-three/fiber";
import { Fog } from "three";
import { rig } from "@/scroll/rig";

// La niebla da profundidad, no tapa el tema: cuando el encuadre se aleja (el cierre del 10),
// se aleja con él. Hasta FOG_REF de distancia entre la cámara y su objetivo queda la del estudio.
const FOG_REF = 26;

export function FogRig({ near, far }: { near: number; far: number }) {
  useFrame(({ scene }) => {
    if (!(scene.fog instanceof Fog)) return;
    const c = rig.cam;
    const k = Math.max(1, Math.hypot(c.px - c.tx, c.py - c.ty, c.pz - c.tz) / FOG_REF);
    scene.fog.near = near * k;
    scene.fog.far = far * k;
  });
  return null;
}
