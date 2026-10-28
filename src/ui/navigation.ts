import { stops, type Stop } from "@/content/stops";
import { APILADO, PANEL_SUBIDO } from "@/scroll/layout";
import { scrollToY } from "@/scroll/smoothScroll";

// Posición de scroll de una parada. Las del hero (IT / OT) y las del final de cada tramo de una
// escena caen en un punto de la estadía: inicio + at × (fin − inicio). En modo lectura no hay estadía.
function stopY(stop: Stop) {
  const el = document.getElementById(stop.seccion);
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const reading = document.querySelector("main")?.dataset.reading === "true";
  if (stop.at === undefined || reading) return Math.round(top);
  const fin = top + el.offsetHeight - window.innerHeight; // el borde de abajo de la sección llega al de la pantalla
  // Apilado (celular o pantalla vertical): la estadía empieza cuando el panel ya subió, igual que en el director (stayOf).
  const panel = el.querySelector<HTMLElement>(".chapter__inner");
  if (panel && el.hasAttribute("data-escena") && matchMedia(APILADO).matches) {
    const inicio = panel.getBoundingClientRect().bottom + window.scrollY - PANEL_SUBIDO * window.innerHeight;
    return Math.round(inicio + stop.at * (fin - inicio));
  }
  return Math.round(top + stop.at * (fin - top));
}

// Mientras Lenis está llevando el scroll a una parada, la referencia es ese destino
// (si no, dos ← → seguidos calcularían desde una posición intermedia).
let last = { y: 0, until: 0 };

// En la presentación el viaje dura según lo que recorre (1,2 s por pantalla, entre 1,2 y 3,2 s):
// el giro del hero o el final de una escena se ven actuar en vez de pasar de golpe.
function go(y: number, paced = false) {
  const screens = Math.abs(y - window.scrollY) / window.innerHeight;
  const duration = paced ? Math.min(3.2, Math.max(1.2, screens * 1.2)) : 1.2;
  last = { y, until: performance.now() + duration * 1000 + 100 };
  scrollToY(y, duration);
}

export function goToStop(id: string) {
  const stop = stops.find((s) => s.id === id);
  const y = stop ? stopY(stop) : null;
  if (y !== null) go(y);
}

// Siguiente o anterior según la POSICIÓN, no la sección activa: desde el título del hero
// la primera → tiene que ir a la ficha IT, aunque la sección activa ya sea "it".
export function stepStop(dir: 1 | -1) {
  const ref = performance.now() < last.until ? last.y : window.scrollY;
  const ys = stops.map(stopY).filter((y): y is number => y !== null);
  const target = dir === 1 ? ys.find((y) => y > ref + 4) : ys.findLast((y) => y < ref - 4);
  if (target !== undefined) go(target, true);
}

// Parada en la que está el scroll (1 = la primera) y cuántas hay. La usa el cronómetro del ensayo.
export function stopProgress() {
  const ys = stops.map(stopY).filter((y): y is number => y !== null);
  const index = ys.filter((y) => y <= window.scrollY + 4).length;
  return { index, total: ys.length };
}
