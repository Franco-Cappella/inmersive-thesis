import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { useUI } from "@/state/store";
import { flat, heroShots, rig } from "./rig";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// El director del hero: UN timeline ligado al scroll (scrub: true) mueve la cámara,
// el giro y el descenso del 3D (vía rig) y las piezas HTML, con los mismos tiempos.
// Progreso 0..1 dentro de la sección:
//   0.00–0.15  título → aparece la ficha IT
//   0.32–0.74  descenso de IT a OT · 0.34–0.70 la pirámide gira · 0.44–0.62 los textos pasan a OT
//   0.84–0.94  cierre: "Prioridades diametralmente opuestas" y la cámara se aleja
const OT_FROM = 0.52; // a partir de acá la sección cuenta como "OT" (índice y modo presentación)

export function useHeroTimeline(scope: RefObject<HTMLElement | null>) {
  const reading = useUI((s) => s.reading);
  const setActive = useUI((s) => s.setActive);

  useGSAP(
    () => {
      const hero = scope.current;
      if (!hero || reading) return;
      let inHero = false;
      let world: "it" | "ot" = "it";
      const report = (p: number) => {
        world = p < OT_FROM ? "it" : "ot";
        if (inHero) setActive(world);
      };
      ScrollTrigger.create({
        trigger: hero,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          inHero = self.isActive;
          if (inHero) setActive(world);
        },
      });

      // Velo sobre el Canvas: el mundo 3D se atenúa cuando sube el primer capítulo.
      const veil = document.querySelector(".stage__veil");
      const next = hero.nextElementSibling;
      if (veil && next) {
        gsap.fromTo(
          veil,
          { opacity: 0 },
          { opacity: 1, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top 35%", scrub: true } },
        );
      }

      const mm = gsap.matchMedia();
      // Con la forma de objeto, GSAP ejecuta el callback si ALGUNA condición coincide:
      // por eso "motion" tiene que estar siempre en la lista.
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          portrait: "(orientation: portrait)",
        },
        (ctx) => {
        const { reduce, portrait } = ctx.conditions as Record<string, boolean>;
        const shot = (k: keyof typeof heroShots) => flat(heroShots[k][portrait ? "portrait" : "landscape"]);
        rig.snap = reduce;

        if (reduce) {
          // Sin interpolación: dos estados (IT / OT) que se aplican de una vez.
          // El HTML cambia con fundidos cortos de opacidad, definidos en CSS por data-mundo y data-fase.
          const apply = (p: number) => {
            const ot = p >= OT_FROM;
            Object.assign(rig.cam, shot(ot ? "ot" : "it"));
            rig.hero.flip = rig.hero.descent = ot ? 1 : 0;
            hero.dataset.mundo = ot ? "ot" : "it";
            hero.dataset.fase = p < 0.06 ? "intro" : p < 0.84 ? "ficha" : "cierre";
            rig.requestFrame();
          };
          ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              report(self.progress);
              apply(self.progress);
            },
            onRefresh: (self) => apply(self.progress),
          });
          return () => {
            delete hero.dataset.mundo;
            delete hero.dataset.fase;
          };
        }

        Object.assign(rig.cam, shot("it"));
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => report(self.progress),
          },
        });

        // 3D: fromTo con valores explícitos + immediateRender:false → reversible y sin depender del orden.
        const once = { immediateRender: false };
        tl.fromTo(rig.cam, shot("it"), { ...shot("mid"), ...once, ease: "power1.in", duration: 0.21 }, 0.32)
          .fromTo(rig.cam, shot("mid"), { ...shot("ot"), ...once, ease: "power2.out", duration: 0.21 }, 0.53)
          .fromTo(rig.cam, shot("ot"), { ...shot("out"), ...once, ease: "power1.inOut", duration: 0.12 }, 0.88)
          .fromTo(rig.hero, { descent: 0 }, { descent: 1, ...once, ease: "power1.inOut", duration: 0.42 }, 0.32)
          .fromTo(rig.hero, { flip: 0 }, { flip: 1, ...once, ease: "power2.inOut", duration: 0.36 }, 0.34);

        // HTML: el primer tween de cada pieza fija su estado inicial; los siguientes son .to().
        tl.fromTo(".hero__cue", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.03 }, 0)
          .fromTo(".hero__intro", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -70, duration: 0.09 }, 0.05)
          .fromTo(
            ".ficha",
            { autoAlpha: 0, y: 48, clipPath: "inset(0% 0% 100% 0%)" },
            { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.1 },
            0.1,
          )
          .fromTo(".pyr-card", { "--flip": 0 }, { "--flip": 1, ease: "power2.inOut", duration: 0.36 }, 0.34)
          .fromTo(".flap", { "--flap": 0 }, { "--flap": 1, ease: "power1.inOut", duration: 0.1 }, 0.46)
          .to(".prio__name[data-id='c']", { keyframes: { "0%": { yPercent: 0, x: 0 }, "50%": { yPercent: 100, x: 34 }, "100%": { yPercent: 200, x: 0 }, easeEach: "sine.inOut" }, duration: 0.26 }, 0.38)
          .to(".prio__name[data-id='a']", { keyframes: { "0%": { yPercent: 0, x: 0 }, "50%": { yPercent: -100, x: -34 }, "100%": { yPercent: -200, x: 0 }, easeEach: "sine.inOut" }, duration: 0.26 }, 0.38)
          .to(".swap .v-it", { yPercent: -100, autoAlpha: 0, duration: 0.06, stagger: 0.015 }, 0.46)
          .fromTo(".swap .v-ot", { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.06, stagger: 0.015 }, 0.48)
          .to(".ficha", { autoAlpha: 0, y: -48, duration: 0.07 }, 0.84)
          .fromTo(".hero__cierre", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.86);
        },
      );
    },
    { scope, dependencies: [reading], revertOnUpdate: true },
  );
}
