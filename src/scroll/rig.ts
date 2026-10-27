// Estado CONTINUO compartido: GSAP lo escribe desde el DOM y useFrame lo lee en
// el 3D. Nunca pasa por React. Este archivo no importa three: lo usa la capa DOM.

import { FX_INICIAL, type SceneFx } from "@/content/story";

export type Vec3 = [number, number, number];
export type Shot = { position: Vec3; target: Vec3 };
export type FlatShot = { px: number; py: number; pz: number; tx: number; ty: number; tz: number };

export const flat = (s: Shot): FlatShot => ({
  px: s.position[0],
  py: s.position[1],
  pz: s.position[2],
  tx: s.target[0],
  ty: s.target[1],
  tz: s.target[2],
});

// Altura del centro de la pirámide en cada mundo: el piso IT arriba, la planta abajo.
export const PYRAMID_Y = { it: 2.6, ot: -4.9 };

// Keyframes de cámara del hero. `portrait` es obligatorio: en vertical la cámara
// se aleja y la pirámide queda arriba, porque el panel de texto va abajo.
export const heroShots: Record<"it" | "mid" | "ot" | "out", { landscape: Shot; portrait: Shot }> = {
  it: {
    landscape: { position: [2.4, 7.2, 13.5], target: [-1.6, 2.2, 0] },
    portrait: { position: [0, 4.4, 17], target: [0, 0.1, 0] },
  },
  mid: {
    landscape: { position: [7.5, -0.4, 10], target: [-1.8, -1.4, 0] },
    portrait: { position: [5.5, -0.9, 17.5], target: [0, -3.4, 0] },
  },
  ot: {
    landscape: { position: [1.2, -3.6, 15], target: [-1.6, -5.0, 0] },
    // En vertical la ficha ocupa la mitad de abajo: la pirámide invertida va entera entre los botones y la ficha.
    portrait: { position: [0, -3.0, 21], target: [0, -8.7, 0] },
  },
  out: {
    landscape: { position: [0.6, -1.6, 19], target: [-1.2, -6.4, -3] },
    portrait: { position: [0, -1.4, 23], target: [0, -8.4, -3] },
  },
};

export const rig = {
  cam: flat(heroShots.it.landscape),
  hero: {
    intro: 0, // 0..1 armado de la pirámide al cargar (por tiempo, no por scroll)
    flip: 0, // 0 = IT (C arriba) · 1 = OT (A arriba)
    descent: 0, // 0 = piso IT · 1 = planta OT
  },
  fx: { ...FX_INICIAL } as SceneFx, // estado de la escena por capítulo (lo escribe useStoryTimeline)
  snap: false, // true con reduced motion: la cámara salta en vez de amortiguar
  requestFrame: () => {}, // lo reemplaza el Canvas con su invalidate()
};
