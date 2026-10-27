"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type CSSProperties } from "react";
import type { Chapter as ChapterData } from "@/content/story";
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
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
        const bars = section.querySelectorAll(".barra");
        if (bars.length)
          gsap.from(bars, {
            scaleX: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.04,
            scrollTrigger: { trigger: bars[0], start: "top 80%", toggleActions: "play none none reverse" },
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
