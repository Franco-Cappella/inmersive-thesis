import { Color, MathUtils } from "three";

// Color emisivo > 1: supera el umbral del Bloom (luminanceThreshold = 1), así que
// SOLO brilla lo que significa algo.
export const glow = (hex: string, k = 3) => new Color(hex).multiplyScalar(k);

export const clamp01 = (x: number) => MathUtils.clamp(x, 0, 1);

// Progreso local de un tramo [a, b] dentro de un progreso global 0..1.
export const range = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));

export const smooth = (x: number, a: number, b: number) => MathUtils.smoothstep(x, a, b);

// Campana 0 → 1 → 0 centrada en el medio del tramo.
export const bell = (x: number) => Math.sin(Math.PI * clamp01(x));

// Pseudoaleatorio determinístico (sin Math.random en el render).
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const easeOutBack = (x: number, s = 1.4) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);

export const FONT_URL = "/fonts/archivo-800.woff"; // troika no lee woff2: va el woff de @fontsource/archivo
