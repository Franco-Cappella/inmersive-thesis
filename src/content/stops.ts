import { CASOS_TRAMOS, CONFLICTO_TRAMOS, MATIZ_TRAMOS } from "@/scroll/timing";
import { chapters } from "./story";

// Paradas del recorrido: el índice de progreso y el modo presentación (← →) usan la misma lista.
// `at` es el progreso dentro de la sección (0 = arriba, 1 = fin del scroll de la sección).
// El hero tiene dos: IT (antes del giro) y OT (después). Los capítulos con escena 3D suman
// una parada oculta al final, para que en la presentación la escena termine de actuar. Los que
// actúan por tramos (un golpe, un caso o un pilar por vez) suman una al final de cada tramo: un → por caso.
export type Stop = { id: string; corto: string; nombre: string; seccion: string; at?: number; oculto?: boolean };

const TRAMOS: Record<string, [number, number][]> = { conflicto: CONFLICTO_TRAMOS, casos: CASOS_TRAMOS, matiz: MATIZ_TRAMOS };

export const stops: Stop[] = [
  { id: "it", corto: "IT", nombre: "IT: la tríada de la oficina", seccion: "inicio", at: 0.24 },
  { id: "ot", corto: "OT", nombre: "OT: la tríada invertida", seccion: "inicio", at: 0.79 },
  ...chapters.flatMap((c, i) => {
    const stop: Stop = { id: c.id, corto: String(i + 1).padStart(2, "0"), nombre: c.titulo, seccion: c.id };
    if (!c.weight) return [stop];
    const fines = TRAMOS[c.id]?.map(([, fin]) => fin) ?? [1];
    return [stop, ...fines.map((at, k) => ({ ...stop, id: `${c.id}-${k + 1}`, at: k === fines.length - 1 ? 1 : at, oculto: true }))];
  }),
  { id: "referencias", corto: "Ref", nombre: "Referencias y uso de IA", seccion: "referencias" },
];
