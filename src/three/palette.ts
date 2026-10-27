import type { Estudio } from "@/state/store";

// Refleja en JavaScript los tokens de styles/tokens.css. Se mantienen sincronizados a mano:
// field, ink, flow, warn y alarm tienen que coincidir con --c-* de cada estudio.
// Regla de la dirección de arte: el color significa estado, nunca decoración.
export type Palette = {
  field: string; // fondo, niebla y paneles
  ink: string; // aristas y texto
  surface: string; // caras de la pirámide
  metal: string; // racks, tanques, cañerías
  flow: string; // proceso normal: flujo, paquetes legítimos, prioridad N° 1
  warn: string; // advertencia: el choque de prioridades
  alarm: string; // alarma / ataque
  letters: string; // letras gigantes IT / OT
  lettersOutline: boolean; // plano: letras dibujadas solo con contorno
  grid: [cell: string, section: string];
  fog: [near: number, far: number];
  hemi: [sky: string, ground: string, intensity: number];
  key: [color: string, intensity: number];
  rough: number;
  metalness: number;
  edge: [color: string, opacity: number];
  sodium: string | null; // noche: luces de sodio sobre la planta
  bloom: number;
};

export const palettes: Record<Estudio, Palette> = {
  // Sala de control (ISA-101): campo gris HMI, maqueta clara, color solo para estados.
  sala: {
    field: "#c9ccce",
    ink: "#1f2326",
    surface: "#e6e8e9",
    metal: "#8a9096",
    flow: "#2f6f8f",
    warn: "#d99a1e",
    alarm: "#c62828",
    letters: "#b3b7ba",
    lettersOutline: false,
    grid: ["#b7bbbe", "#9ea4a8"],
    fog: [17, 46],
    hemi: ["#ffffff", "#8a9096", 1.15],
    key: ["#ffffff", 1.6],
    rough: 0.85,
    metalness: 0.05,
    edge: ["#1f2326", 0.8],
    sodium: null,
    bloom: 0.55,
  },
  // Plano P&ID: papel, líneas de ingeniería y luz plana.
  plano: {
    field: "#eeede7",
    ink: "#1b2430",
    surface: "#f8f7f2",
    metal: "#f3f2ec",
    flow: "#1f5f8b",
    warn: "#c27c0e",
    alarm: "#b3261e",
    letters: "#1b2430",
    lettersOutline: true,
    grid: ["#d3dbe2", "#b5c3cf"],
    fog: [24, 64],
    hemi: ["#ffffff", "#e6e4dc", 2.3],
    key: ["#ffffff", 0.35],
    rough: 1,
    metalness: 0,
    edge: ["#1b2430", 1],
    sodium: null,
    bloom: 0.35,
  },
  // Planta de noche: campo oscuro, metal mojado y luces de sodio ámbar.
  noche: {
    field: "#0f1316",
    ink: "#e9e6df",
    surface: "#3b4249",
    metal: "#2c3339",
    flow: "#4aa3c8",
    warn: "#f0a020",
    alarm: "#ff5a47",
    letters: "#1d2429",
    lettersOutline: false,
    grid: ["#1c2328", "#2a333a"],
    fog: [11, 36],
    hemi: ["#56636e", "#0f1316", 0.45],
    key: ["#ffc27a", 1.1],
    rough: 0.36,
    metalness: 0.55,
    edge: ["#6b7782", 0.55],
    sodium: "#ffa94d",
    bloom: 1.1,
  },
};
