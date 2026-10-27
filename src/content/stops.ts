import { chapters } from "./story";

// Paradas del recorrido: el índice de progreso y el modo presentación (← →) usan la misma lista.
// El hero tiene dos: IT (antes del giro) y OT (después). `at` es el progreso dentro del hero.
export type Stop = { id: string; corto: string; nombre: string; seccion: string; at?: number };

export const stops: Stop[] = [
  { id: "it", corto: "IT", nombre: "IT: la tríada de la oficina", seccion: "inicio", at: 0.24 },
  { id: "ot", corto: "OT", nombre: "OT: la tríada invertida", seccion: "inicio", at: 0.79 },
  ...chapters.map((c, i) => ({ id: c.id, corto: String(i + 1).padStart(2, "0"), nombre: c.titulo, seccion: c.id })),
  { id: "referencias", corto: "Ref", nombre: "Referencias y uso de IA", seccion: "referencias" },
];
