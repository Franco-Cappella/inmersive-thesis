"use client";

import dynamic from "next/dynamic";
import { useUI } from "@/state/store";

// three y @react-three/* viven solo en este chunk: la capa DOM nunca los importa.
const Experience = dynamic(() => import("@/three/Experience"), { ssr: false });

export function Stage() {
  const booted = useUI((s) => s.booted);
  const tier = useUI((s) => s.tier);
  const reading = useUI((s) => s.reading);
  const show3D = booted && tier !== "static" && !reading;
  return (
    <div className="stage" aria-hidden="true">
      {show3D && <Experience />}
      <div className="stage__veil" />
    </div>
  );
}
