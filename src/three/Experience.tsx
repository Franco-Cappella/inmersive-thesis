"use client";

// Se carga con next/dynamic y ssr: false (ui/Stage.tsx). Es el único punto de
// entrada a three y @react-three/*: la capa DOM no los importa nunca.

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useEffect, useMemo } from "react";
import { NeutralToneMapping } from "three";
import { chapters, fxOf } from "@/content/story";
import { rig } from "@/scroll/rig";
import { useUI } from "@/state/store";
import { CameraRig } from "./CameraRig";
import { FogRig } from "./FogRig";
import { palettes } from "./palette";
import { Casos } from "./scenes/Casos";
import { Conflicto } from "./scenes/Conflicto";
import { Convergencia } from "./scenes/Convergencia";
import { Escenario } from "./scenes/Escenario";
import { ITFloor } from "./scenes/ITFloor";
import { Matiz } from "./scenes/Matiz";
import { OTFloor } from "./scenes/OTFloor";
import { Pyramid } from "./scenes/Pyramid";

function FrameBridge() {
  // Conecta rig.requestFrame con este Canvas sin que el DOM importe R3F.
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    rig.requestFrame = () => invalidate();
    return () => {
      rig.requestFrame = () => {};
    };
  }, [invalidate]);
  return null;
}

export default function Experience() {
  const tier = useUI((s) => s.tier);
  const estudio = useUI((s) => s.estudio);
  // El Canvas corre mientras se ve: en el hero y en los capítulos cuyo velo no lo tapa del todo.
  const stageActive = useUI((s) => {
    if (["inicio", "it", "ot"].includes(s.active)) return true;
    const i = chapters.findIndex((c) => c.id === s.active);
    return i >= 0 && fxOf(i).dim < 1;
  });
  const setTier = useUI((s) => s.setTier);
  const setStageReady = useUI((s) => s.setStageReady);
  const palette = palettes[estudio];
  const reduce = useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  // Tone mapping neutro: deja el color del campo igual al de CSS (el fondo de los paneles).
  const gl = useMemo(
    () => ({ antialias: tier !== "high", powerPreference: "high-performance" as const, toneMapping: NeutralToneMapping }),
    [tier],
  );

  useEffect(() => () => setStageReady(false), [setStageReady]);

  return (
    <div className="stage__canvas">
      <Canvas
        dpr={tier === "high" ? [1, 2] : 1}
        frameloop={reduce || !stageActive ? "demand" : "always"}
        camera={{ fov: 38, near: 0.1, far: 120, position: [4, 9, 24] }}
        gl={gl}
        eventSource={document.body}
        eventPrefix="client"
        onCreated={() => requestAnimationFrame(() => setStageReady(true))}
      >
        <color attach="background" args={[palette.field]} />
        <fog attach="fog" args={[palette.field, palette.fog[0], palette.fog[1]]} />
        <hemisphereLight args={[palette.hemi[0], palette.hemi[1], palette.hemi[2]]} />
        <directionalLight position={[5, 10, 6]} color={palette.key[0]} intensity={palette.key[1]} />
        <PerformanceMonitor
          onDecline={() => setTier("low")}
          onIncline={() => setTier("high")}
          flipflops={3}
          onFallback={() => setTier("low")}
        />
        <Suspense fallback={null}>
          <Pyramid palette={palette} />
          <ITFloor palette={palette} />
          <OTFloor palette={palette} />
          <Escenario palette={palette} />
          <Convergencia palette={palette} />
          <Conflicto palette={palette} />
          <Casos palette={palette} />
          <Matiz palette={palette} />
        </Suspense>
        <CameraRig />
        <FogRig near={palette.fog[0]} far={palette.fog[1]} />
        <FrameBridge />
        {tier === "high" && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur luminanceThreshold={1} intensity={palette.bloom} />
            <Vignette darkness={estudio === "noche" ? 0.55 : 0.3} offset={0.3} />
            <ToneMapping mode={ToneMappingMode.NEUTRAL} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
