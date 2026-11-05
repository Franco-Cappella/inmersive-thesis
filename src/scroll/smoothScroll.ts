import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

// UN loop: gsap.ticker mueve lenis.raf y cada scroll de Lenis llama a ScrollTrigger.update.
// Lenis respeta prefers-reduced-motion por defecto (lerp 1 y scrollTo instantáneo).
export function initSmoothScroll() {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true }); // autoRaf false; touch nativo
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000); // el ticker va en segundos, Lenis en ms
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

// `easing` y `onComplete` los usa el modo presentación (ver src/ui/navigation.ts). Sin easing, Lenis usa el suyo,
// que hace casi todo el recorrido al principio: sirve para un salto, no para ver una escena actuar.
export function scrollToY(y: number, duration = 1.2, easing?: (t: number) => number, onComplete?: () => void) {
  if (lenis) lenis.scrollTo(y, { duration, easing, onComplete, force: true });
  else {
    window.scrollTo({ top: y });
    onComplete?.();
  }
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.2 });
  else el.scrollIntoView();
}
