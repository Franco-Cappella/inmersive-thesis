"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { site } from "@/content/hero";
import { chapters } from "@/content/story";
import { ui } from "@/content/ui";
import { initSmoothScroll } from "@/scroll/smoothScroll";
import { useStoryTimeline } from "@/scroll/useStoryTimeline";
import { useUI } from "@/state/store";
import { Chapter } from "./Chapter";
import { Ensayo } from "./Ensayo";
import { Hero } from "./Hero";
import { Masthead } from "./Masthead";
import { stepStop } from "./navigation";
import { ProgressNav } from "./ProgressNav";
import { References } from "./References";
import { Stage } from "./Stage";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Site() {
  const main = useRef<HTMLElement>(null);
  const reading = useUI((s) => s.reading);
  const presenting = useUI((s) => s.presenting);
  const estudio = useUI((s) => s.estudio);
  const booted = useUI((s) => s.booted);

  useEffect(() => useUI.getState().boot(), []);

  // Con zoom muy alto (menos de 320 px de alto: el 400 % de una pantalla común) el escenario fijo no entra en
  // la pantalla y el texto quedaría cortado. Ahí el sitio pasa solo al modo lectura, que fluye entero, y vuelve
  // cuando la pantalla crece si la lectura la había puesto él (WCAG 1.4.10, reflow).
  useEffect(() => {
    const bajo = matchMedia("(max-height: 320px)");
    let automatica = false;
    const revisar = () => {
      const s = useUI.getState();
      if (bajo.matches && !s.reading) {
        automatica = true;
        s.setReading(true);
      } else if (!bajo.matches && automatica) {
        automatica = false;
        if (s.reading) s.setReading(false);
      }
    };
    revisar();
    bajo.addEventListener("change", revisar);
    return () => bajo.removeEventListener("change", revisar);
  }, []);
  useStoryTimeline(main);
  useEffect(() => initSmoothScroll(), []);

  // El estudio y los modos viven en <html> para que los tokens de CSS cambien en toda la página. Hasta que boot()
  // lee la URL mandan los que puso el script del <head> (layout.tsx): escribir antes los valores por defecto
  // los pisaba un cuadro y la página parpadeaba.
  useEffect(() => {
    if (!booted) return;
    const html = document.documentElement;
    html.dataset.estudio = estudio;
    html.dataset.presenting = String(presenting);
    html.dataset.reading = String(reading);
    // La presentación agranda el texto (y cada estudio tiene su tipografía): cambia el alto de los capítulos
    // sin escena y, con él, dónde empieza cada tramo del scroll. Sin esto, los ScrollTrigger quedan corridos.
    ScrollTrigger.refresh();
  }, [booted, estudio, presenting, reading]);

  // Las fuentes cambian el alto de los textos: recalcular los ScrollTrigger una vez cargadas.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Sección activa para el índice (el hero informa IT/OT desde su propio timeline).
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-chapter], [data-section]").forEach((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && useUI.getState().setActive(el.id),
        }),
      );
      ScrollTrigger.refresh(); // el modo lectura cambia el alto de todo
    },
    { scope: main, dependencies: [reading], revertOnUpdate: true },
  );

  // Atajos: L lectura · P presentación · en presentación, ← → (y las teclas de un control remoto) por parada.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]")) return;
      const s = useUI.getState();
      const key = e.key.toLowerCase();
      if (key === "l") s.toggleReading();
      else if (key === "p") s.togglePresenting();
      else if (s.presenting && ["arrowright", "arrowdown", "pagedown", " "].includes(key)) {
        e.preventDefault();
        stepStop(1);
      } else if (s.presenting && ["arrowleft", "arrowup", "pageup"].includes(key)) {
        e.preventDefault();
        stepStop(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // En presentación el cursor se oculta si no se mueve.
  useEffect(() => {
    if (!presenting) return;
    const html = document.documentElement;
    let timer = 0;
    const wake = () => {
      html.dataset.idle = "false";
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (html.dataset.idle = "true"), 1800);
    };
    wake();
    window.addEventListener("pointermove", wake);
    return () => {
      window.removeEventListener("pointermove", wake);
      window.clearTimeout(timer);
      delete html.dataset.idle;
    };
  }, [presenting]);

  return (
    <>
      <a className="skip" href="#contenido">
        {ui.saltar}
      </a>
      <Stage />
      <Masthead />
      <ProgressNav />
      <Ensayo />
      <main ref={main} id="contenido" data-reading={reading}>
        <Hero />
        {chapters.map((ch, i) => (
          <Chapter key={ch.id} ch={ch} index={i} />
        ))}
        <References />
      </main>
      <footer className="sitio-pie">
        <span className="sitio-pie__nombre">{site.nombre.join(" ")}</span>
        <span>
          {ui.tesina} · {site.anio}
        </span>
      </footer>
    </>
  );
}
