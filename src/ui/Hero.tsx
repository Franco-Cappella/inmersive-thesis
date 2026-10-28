"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";
import { hero, site } from "@/content/hero";
import { rig } from "@/scroll/rig";
import { useHeroTimeline } from "@/scroll/useHeroTimeline";
import { useUI } from "@/state/store";
import { Ficha } from "./hero/Ficha";
import { HeroTable } from "./hero/HeroTable";
import { PyramidCard } from "./hero/PyramidCard";

gsap.registerPlugin(useGSAP, SplitText);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reading = useUI((s) => s.reading);
  const stageReady = useUI((s) => s.stageReady);
  useHeroTimeline(ref);

  // Entrada al cargar (por tiempo, no por scroll): el título sube línea por línea.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(".hero__title", {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          // Terminada la entrada, el título vuelve a ser texto corrido: la máscara de cada línea recortaba la
          // palabra más larga si el usuario agranda el espaciado del texto (WCAG 1.4.12).
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 115,
              duration: 1,
              ease: "power4.out",
              stagger: 0.06,
              delay: 0.15,
              onComplete: () => requestAnimationFrame(() => self.revert()),
            }),
        });
        gsap.from(".hero__byline, .hero__question", {
          opacity: 0, // no autoAlpha: el título y la pregunta siguen en el árbol de accesibilidad
          y: 18,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.55,
        });
        gsap.from(".hero__cue-inner", { autoAlpha: 0, y: -10, duration: 0.6, ease: "power3.out", delay: 1.6 });
      });
    },
    { scope: ref, dependencies: [reading], revertOnUpdate: true },
  );

  // La pirámide se arma cuando el 3D ya dibujó su primer frame.
  useEffect(() => {
    if (!stageReady) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rig.hero.intro = 1;
      rig.requestFrame();
      return;
    }
    const tween = gsap.fromTo(rig.hero, { intro: 0 }, { intro: 1, duration: 2, ease: "none", delay: 0.2 });
    return () => {
      tween.kill();
    };
  }, [stageReady]);

  return (
    <section ref={ref} id="inicio" className="hero" data-stage-ready={stageReady} aria-labelledby="hero-title">
      <div className="hero__sticky">
        <div className="hero__intro">
          <p className="hero__byline">
            Tesina · {site.autor} · {site.anio}
          </p>
          <h1 id="hero-title" className="hero__title">
            {site.titulo}
          </h1>
          <p className="hero__question">{hero.pregunta}</p>
          <div className="hero__cue" aria-hidden="true">
            <span className="hero__cue-inner">
              <span className="hero__cue-line" />
              {hero.guia}
            </span>
          </div>
        </div>

        <Ficha />

        <div className="hero__figure">
          <PyramidCard />
        </div>

        <p className="hero__cierre">{hero.cierre}</p>

        <HeroTable />
      </div>
    </section>
  );
}
