import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { chapters, FX_INICIAL, fxOf, type SceneFx } from "@/content/story";
import { useUI } from "@/state/store";
import { APILADO, PANEL_SUBIDO } from "./layout";
import { flat, heroShots, rig, type FlatShot } from "./rig";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Cámara al terminar el capítulo i: la propia o la última declarada antes.
// Antes del primer capítulo, el shot "out" con el que termina el hero.
function camOf(i: number, portrait: boolean): FlatShot {
  for (let k = i; k >= 0; k--) {
    const c = chapters[k].camara;
    if (c) return flat(portrait ? c.portrait : c.landscape);
  }
  return flat(heroShots.out[portrait ? "portrait" : "landscape"]);
}

const sameShot = (a: FlatShot, b: FlatShot) =>
  (Object.keys(a) as (keyof FlatShot)[]).every((k) => a[k] === b[k]);

const pick = (fx: SceneFx, keys: (keyof SceneFx)[]) => Object.fromEntries(keys.map((k) => [k, fx[k]]));

// La estadía de un capítulo. En escritorio, mientras la sección está fija con el panel al costado.
// Cuando el panel no entra al costado (APILADO: celular o pantalla vertical) taparía la escena:
// la estadía empieza cuando el panel ya subió (su borde de abajo pasa el 70 % de la pantalla)
// y termina con la sección (ver chapters.css).
export function stayOf(el: HTMLElement, narrow: boolean): ScrollTrigger.Vars {
  const panel = el.querySelector<HTMLElement>(".chapter__inner");
  if (narrow && panel && el.hasAttribute("data-escena"))
    return { trigger: panel, start: `bottom ${PANEL_SUBIDO * 100}%`, endTrigger: el, end: "bottom bottom", scrub: true };
  return { trigger: el, start: "top top", end: "bottom bottom", scrub: true };
}

// El director de los capítulos. Por capítulo i:
//  ENTRADA (la sección sube: "top bottom" → "top top"): la cámara viaja del keyframe i-1 al i
//          y el velo pasa del dim anterior al propio.
//  ESTADÍA ("top top" → "bottom bottom"): se animan los fx que se prenden en i (la escena "actúa").
//           Los que se apagan se resetean durante la entrada.
// Todo fromTo con valores explícitos + immediateRender:false → reversible y sin depender del orden.
export function useStoryTimeline(scope: RefObject<HTMLElement | null>) {
  const reading = useUI((s) => s.reading);

  useGSAP(
    () => {
      if (reading) return;
      const sections = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      const veil = document.querySelector<HTMLElement>(".stage__veil");
      if (!sections.length) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          portrait: "(orientation: portrait)",
          narrow: APILADO,
        },
        (ctx) => {
          const { reduce, portrait, narrow } = ctx.conditions as Record<string, boolean>;
          const cam = (i: number) => camOf(i, portrait);

          if (reduce) {
            // Sin interpolación: cada capítulo aplica su estado final al cruzar el centro.
            const apply = (i: number) => {
              Object.assign(rig.cam, cam(i));
              Object.assign(rig.fx, fxOf(i));
              if (veil) veil.style.opacity = String(rig.fx.dim);
              rig.requestFrame();
            };
            sections.forEach((el, i) =>
              ScrollTrigger.create({
                trigger: el,
                start: "top center",
                end: "bottom center",
                onToggle: (self) => self.isActive && apply(i),
              }),
            );
            ScrollTrigger.create({
              trigger: sections[0],
              start: "top center",
              onLeaveBack: () => {
                Object.assign(rig.fx, FX_INICIAL); // de vuelta en el hero
                if (veil) veil.style.opacity = "0";
                rig.requestFrame();
              },
            });
            return () => {
              if (veil) veil.style.opacity = "";
            };
          }

          sections.forEach((el, i) => {
            const entry = { trigger: el, start: "top bottom", end: "top top", scrub: true };
            if (!sameShot(cam(i - 1), cam(i)))
              gsap.fromTo(rig.cam, cam(i - 1), {
                ...cam(i),
                ease: "power2.inOut",
                immediateRender: false,
                scrollTrigger: entry,
              });

            const before = fxOf(i - 1);
            const after = fxOf(i);
            if (veil && before.dim !== after.dim)
              gsap.fromTo(
                veil,
                { opacity: before.dim },
                { opacity: after.dim, ease: "none", immediateRender: false, scrollTrigger: entry },
              );

            // Lo que se APAGA en este capítulo (por ejemplo, la planta detenida del 01) se resetea
            // durante la entrada; lo que se PRENDE actúa durante la estadía, con el panel a la vista.
            const changed = (Object.keys(after) as (keyof SceneFx)[]).filter((k) => k !== "dim" && before[k] !== after[k]);
            const off = changed.filter((k) => after[k] < before[k]);
            const on = changed.filter((k) => after[k] > before[k]);
            if (off.length)
              gsap.fromTo(rig.fx, pick(before, off), {
                ...pick(after, off),
                ease: "none",
                immediateRender: false,
                scrollTrigger: entry,
              });
            if (on.length)
              gsap.fromTo(rig.fx, pick(before, on), {
                ...pick(after, on),
                ease: "none",
                immediateRender: false,
                scrollTrigger: stayOf(el, narrow),
              });
          });
        },
      );
    },
    { scope, dependencies: [reading], revertOnUpdate: true },
  );
}
