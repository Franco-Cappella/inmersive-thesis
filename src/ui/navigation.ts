import { stops } from "@/content/stops";
import { scrollToSection, scrollToY } from "@/scroll/smoothScroll";

// Lleva el scroll a una parada. Las del hero (IT / OT) caen en un punto del timeline,
// no en el borde de la sección: top + at × (alto − viewport).
export function goToStop(id: string) {
  const stop = stops.find((s) => s.id === id);
  if (!stop) return;
  const el = document.getElementById(stop.seccion);
  if (!el) return;
  if (stop.at === undefined || document.querySelector("main")?.dataset.reading === "true") {
    scrollToSection(stop.seccion);
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(top + stop.at * (el.offsetHeight - window.innerHeight));
}

export function stepStop(active: string, dir: 1 | -1) {
  const i = stops.findIndex((s) => s.id === active);
  const next = stops[Math.min(stops.length - 1, Math.max(0, (i < 0 ? 0 : i) + dir))];
  goToStop(next.id);
}
