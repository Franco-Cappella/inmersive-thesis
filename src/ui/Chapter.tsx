"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type CSSProperties } from "react";
import type { Chapter as ChapterData } from "@/content/story";
import { CASOS_TRAMOS, CONFLICTO_TRAMOS, ESCENARIO_PASOS, MATIZ_TRAMOS } from "@/scroll/timing";
import { useUI } from "@/state/store";
import { FiguraView } from "./Figuras";
import { SourceRefs } from "./Sources";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function Chapter({ ch, index }: { ch: ChapterData; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reading = useUI((s) => s.reading);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      // Forma de objeto: el callback corre si alguna condición coincide, por eso se mira `motion` adentro.
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", narrow: "(max-width: 760px)" }, (ctx) => {
        const { motion, narrow } = ctx.conditions as Record<string, boolean>;
        if (!motion) return;
        const title = section.querySelector("h2");
        if (title)
          SplitText.create(title, {
            type: "lines",
            mask: "lines",
            autoSplit: true, // aria: "auto" por defecto: los lectores de pantalla leen el título entero
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.9,
                ease: "power4.out",
                stagger: 0.09,
                scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
              }),
          });
        gsap.from(section.querySelectorAll("[data-reveal]"), {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 62%", toggleActions: "play none none reverse" },
        });
        // Texto al ritmo de la escena 3D (mismo scroll): los pasos del reloj del 01, los golpes del 05,
        // los casos del 07 y los pilares del 09 se encienden cuando actúa su parte de la escena. Los tiempos viven en src/scroll/timing.ts.
        const sincronizados: [string, number[]][] = [
          [".fig-reloj__pasos li", ESCENARIO_PASOS],
          [".fig--golpes > li", CONFLICTO_TRAMOS.map(([inicio]) => inicio)],
          [".fig--casos > li", CASOS_TRAMOS.map(([inicio]) => inicio)],
          [".fig--pilares > li", MATIZ_TRAMOS.map(([inicio]) => inicio)],
        ];
        // En el celular la escena actúa después del texto (stayOf): ahí la lista se lee entera, sin atenuar.
        for (const [selector, tiempos] of sincronizados) {
          const items = section.querySelectorAll<HTMLElement>(selector);
          if (reading || narrow || !section.hasAttribute("data-escena") || !items.length) continue;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true },
          });
          items.forEach((li, i) =>
            tl.fromTo(li, { opacity: 0.3 }, { opacity: 1, duration: 0.05 }, tiempos[i] ?? i / items.length),
          );
          tl.set({}, {}, 1); // el timeline dura exactamente la estadía
        }
        // Cifras: cuentan desde 0 hasta el valor de la tesina (formato es-AR: 125.000 · 2,3).
        section.querySelectorAll<HTMLElement>("[data-contador]").forEach((el) => {
          const original = el.textContent ?? "";
          const m = original.match(/(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?/);
          if (!m || m.index === undefined) return;
          const decimals = m[2]?.length ?? 0;
          const value = parseFloat(`${m[1].replace(/\./g, "")}.${m[2] ?? "0"}`);
          const [before, after] = [original.slice(0, m.index), original.slice(m.index + m[0].length)];
          const fmt = (v: number) =>
            v.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
          const n = { v: 0 };
          el.textContent = before + fmt(0) + after;
          gsap.to(n, {
            v: value,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = before + fmt(n.v) + after;
            },
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
          });
        });
        // Trama Modbus (03): los campos aparecen en orden, como llegan por la red.
        const campos = section.querySelectorAll(".fig-trama__bytes li");
        if (campos.length)
          gsap.from(campos, {
            autoAlpha: 0,
            y: 12,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: campos[0], start: "top 85%", toggleActions: "play none none reverse" },
          });
        // Brecha: los bloques IT y OT de "después" se juntan al entrar.
        section.querySelectorAll(".fig-brecha__bloques:not(.fig-brecha__bloques--separados)").forEach((el) =>
          gsap.from(el, {
            gap: "1.4rem",
            duration: 0.9,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
          }),
        );
        const bars = section.querySelectorAll(".barra");
        if (bars.length)
          gsap.from(bars, {
            scaleX: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.04,
            scrollTrigger: { trigger: bars[0], start: "top 80%", toggleActions: "play none none reverse" },
          });
        // Al revertir (modo lectura, cambio de preferencia) las cifras vuelven a su texto original.
        return () =>
          section.querySelectorAll<HTMLElement>("[data-contador]").forEach((el) => {
            const final = el.nextElementSibling?.textContent;
            if (final) el.textContent = final;
          });
      });
    },
    { scope: ref, dependencies: [reading], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id={ch.id}
      data-chapter={index}
      data-escena={ch.weight ? "" : undefined}
      className="chapter"
      style={ch.weight ? ({ "--weight": ch.weight } as CSSProperties) : undefined}
      aria-labelledby={`${ch.id}-title`}
    >
      <div className="chapter__inner">
        <header className="chapter__head">
          <span className="chapter__num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 id={`${ch.id}-title`}>{ch.titulo}</h2>
        </header>
        <p className="chapter__bajada" data-reveal>
          {ch.bajada}
        </p>
        <div data-reveal>
          <FiguraView figura={ch.figura} />
        </div>
        <div data-reveal>
          <SourceRefs keys={ch.fuentes} pending={ch.pendientes} />
        </div>
      </div>
    </section>
  );
}
