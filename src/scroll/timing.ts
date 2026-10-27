// Tiempos compartidos entre una escena 3D y su texto (progreso 0..1 de la estadía del capítulo).
// La capa DOM no puede importar las escenas (traerían three), así que los tiempos viven acá.

// Capítulo 01: cuándo se enciende cada paso del reloj. Coinciden con src/three/scenes/Escenario.tsx
// (parche 0.05–0.50 · HMI en blanco 0.50 · baliza ESD 0.62) y con la válvula en rojo de OTFloor (0.80–0.92).
export const ESCENARIO_PASOS = [0.05, 0.5, 0.62, 0.85];

// Capítulo 05: tramo de cada golpe dentro de la estadía, en el orden de la lista del texto
// (parche automático, escaneo activo, MFA en plena alarma). Los usan src/three/signals.ts y el resaltado del texto.
export const CONFLICTO_TRAMOS: [number, number][] = [
  [0.02, 0.32],
  [0.35, 0.65],
  [0.68, 0.98],
];

// Capítulo 07: tramo de cada caso dentro de la estadía, en el orden de la lista del texto
// (Colonial Pipeline, Oldsmar, Stuxnet, Industroyer). Los usan src/three/signals.ts y el resaltado del texto.
export const CASOS_TRAMOS: [number, number][] = [
  [0.02, 0.25],
  [0.27, 0.5],
  [0.52, 0.75],
  [0.77, 0.98],
];

// Capítulo 09: tramo de cada pilar dentro de la estadía, en el orden del texto
// (zonas y conductos, monitoreo pasivo, probar antes de parchear).
export const MATIZ_TRAMOS: [number, number][] = [
  [0.02, 0.4],
  [0.42, 0.7],
  [0.72, 0.98],
];
