import { stops, type Stop } from "@/content/stops";
import { scrollToY } from "@/scroll/smoothScroll";

// Posición de scroll de una parada. Las del hero (IT / OT) caen en un punto del timeline,
// no en el borde de la sección: top + at × (alto − viewport). En modo lectura no hay timeline.
function stopY(stop: Stop) {
  const el = document.getElementById(stop.seccion);
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const reading = document.querySelector("main")?.dataset.reading === "true";
  if (stop.at === undefined || reading) return Math.round(top);
  return Math.round(top + stop.at * (el.offsetHeight - window.innerHeight));
}

// Mientras Lenis está llevando el scroll a una parada, la referencia es ese destino
// (si no, dos ← → seguidos calcularían desde una posición intermedia).
let last = { y: 0, at: 0 };

function go(y: number) {
  last = { y, at: performance.now() };
  scrollToY(y);
}

export function goToStop(id: string) {
  const stop = stops.find((s) => s.id === id);
  const y = stop ? stopY(stop) : null;
  if (y !== null) go(y);
}

// Siguiente o anterior según la POSICIÓN, no la sección activa: desde el título del hero
// la primera → tiene que ir a la ficha IT, aunque la sección activa ya sea "it".
export function stepStop(dir: 1 | -1) {
  const ref = performance.now() - last.at < 1300 ? last.y : window.scrollY;
  const ys = stops.map(stopY).filter((y): y is number => y !== null);
  const target = dir === 1 ? ys.find((y) => y > ref + 4) : ys.findLast((y) => y < ref - 4);
  if (target !== undefined) go(target);
}
