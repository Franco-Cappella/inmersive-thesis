import { create } from "zustand";

// Estado DISCRETO de la interfaz. Lo que cambia por frame vive en scroll/rig.ts.

export type Tier = "high" | "low" | "static";
export type Estudio = "sala" | "plano" | "noche";
export const estudios: { id: Estudio; nombre: string }[] = [
  { id: "sala", nombre: "Sala de control" },
  { id: "plano", nombre: "Plano P&ID" },
  { id: "noche", nombre: "Planta de noche" },
];

const hasWebGL2 = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

const isEstudio = (v: string | null): v is Estudio => estudios.some((e) => e.id === v);

// Refleja el modo en la URL para que un reload o un link compartido lo conserve.
function syncQuery(key: string, value: string | null) {
  const url = new URL(location.href);
  if (value === null) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  history.replaceState(history.state, "", url);
}

type UI = {
  booted: boolean; // ya se leyeron la URL y las capacidades del navegador (solo en el cliente)
  active: string; // id de la sección visible: "inicio", un capítulo o "referencias"
  tier: Tier;
  tierFijo: boolean; // ?calidad= en la URL: el PerformanceMonitor ya no lo cambia
  reading: boolean;
  presenting: boolean;
  ensayo: boolean; // ?ensayo: cronómetro y número de parada en el modo presentación (para ensayar)
  estudio: Estudio;
  stageReady: boolean; // el Canvas ya dibujó su primer frame
  boot: () => void;
  setActive: (id: string) => void;
  setTier: (t: Tier) => void;
  setEstudio: (e: Estudio) => void;
  setStageReady: (v: boolean) => void;
  toggleReading: () => void;
  togglePresenting: () => void;
};

// En el prerender de Next no hay window: el estado arranca con valores neutros
// y boot() los corrige en el cliente antes de montar el 3D.
export const useUI = create<UI>((set, get) => ({
  booted: false,
  active: "inicio",
  tier: "high",
  tierFijo: false,
  reading: false,
  presenting: false,
  ensayo: false,
  estudio: "sala",
  stageReady: false,
  boot: () => {
    const q = new URLSearchParams(location.search);
    const estudio = q.get("estudio");
    // ?calidad=baja (sin posprocesado y a resolución 1×) o ?calidad=estatica (sin 3D): para una compu lenta.
    // ?calidad=alta fija el tier alto (para medir el peor caso con scripts/presupuesto.cjs).
    const calidad = q.get("calidad");
    const webgl = hasWebGL2();
    const fijo: Tier | null =
      calidad === "estatica" || (calidad && !webgl)
        ? "static"
        : calidad === "baja"
          ? "low"
          : calidad === "alta"
            ? "high"
            : null;
    set({
      booted: true,
      tier: fijo ?? (webgl ? "high" : "static"),
      tierFijo: fijo !== null,
      reading: q.has("lectura"),
      presenting: q.has("presentacion"),
      ensayo: q.has("ensayo"),
      estudio: isEstudio(estudio) ? estudio : "sala",
    });
  },
  setActive: (active) => set({ active }),
  // Sin WebGL no se sube de tier, y si la URL fijó la calidad, el PerformanceMonitor no la cambia.
  setTier: (tier) => set((s) => (s.tier === "static" || s.tierFijo ? s : { tier })),
  setEstudio: (estudio) => {
    syncQuery("estudio", estudio === "sala" ? null : estudio);
    set({ estudio });
  },
  setStageReady: (stageReady) => set({ stageReady }),
  toggleReading: () => {
    const reading = !get().reading;
    syncQuery("lectura", reading ? "" : null);
    set({ reading });
  },
  togglePresenting: () => {
    const presenting = !get().presenting;
    syncQuery("presentacion", presenting ? "" : null);
    set({ presenting });
  },
}));
