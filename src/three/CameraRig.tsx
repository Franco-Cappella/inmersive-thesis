"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo } from "react";
import { Vector3 } from "three";
import { rig } from "@/scroll/rig";

export function CameraRig() {
  const goal = useMemo(() => new Vector3(), []); // vectores creados UNA vez, nunca en el loop
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  useFrame((state, delta) => {
    const c = rig.cam;
    goal.set(c.px, c.py, c.pz);
    target.set(c.tx, c.ty, c.tz);
    if (rig.snap) {
      state.camera.position.copy(goal);
      look.copy(target);
    } else {
      goal.x += state.pointer.x * 0.35; // parallax sutil (decorativo)
      goal.y += state.pointer.y * 0.22;
      easing.damp3(state.camera.position, goal, 0.35, delta);
      easing.damp3(look, target, 0.35, delta);
    }
    state.camera.lookAt(look);
  });
  return null;
}
