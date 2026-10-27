// Tiempos compartidos entre una escena 3D y su texto (progreso 0..1 de la estadía del capítulo).
// La capa DOM no puede importar las escenas (traerían three), así que los tiempos viven acá.

// Capítulo 01: cuándo se enciende cada paso del reloj. Coinciden con src/three/scenes/Escenario.tsx
// (parche 0.05–0.50 · HMI en blanco 0.50 · baliza ESD 0.62) y con la válvula en rojo de OTFloor (0.80–0.92).
export const ESCENARIO_PASOS = [0.05, 0.5, 0.62, 0.85];
