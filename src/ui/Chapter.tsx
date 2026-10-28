"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type CSSProperties } from "react";
import type { Chapter as ChapterData } from "@/content/story";
import { ui } from "@/content/ui";
import { AL_COSTADO, APILADO } from "@/scroll/layout";
import { CASOS_TRAMOS, CONFLICTO_TRAMOS, ESCENARIO_PASOS, MATIZ_TRAMOS } from "@/scroll/timing";
import { useUI } from "@/state/store";
import { FiguraView } from "./Figuras";
import { SourceRefs } from "./Sources";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Texto al ritmo de la escena 3D (mismo scroll): los pasos del reloj del 01, los golpes del 05,
// los casos del 07 y los pilares del 09 se encienden cuando actúa su parte de la escena.
// Los tiempos viven en src/scroll/timing.ts.
const SINCRONIZADOS: [string, number[]][] = [
  [".fig-reloj__pasos li", ESCENARIO_PASOS],
  [".fig--golpes > li", CONFLICTO_TRAMOS.map(([inicio]) => inicio)],
  [".fig--casos > li", CASOS_TRAMOS.map(([inicio]) => inicio)],
  [".fig--pilares > li", MATIZ_TRAMOS.map(([inicio]) => inicio)],
];
const MARGEN = 24; // aire entre el panel y el borde de abajo de la pantalla
// Pósters de las escenas (scripts/posters.cjs): 1024×640, salvo el díptico del 03 y el tríptico del 05,
// más bajos. Si el script cambia las medidas, cambian acá (así la página no salta mientras cargan).
const POSTER = { ancho: 1024, alto: 640 };
const POSTER_ALTO: Record<string, number> = { protocolos: 547, conflicto: 362 };

export function Chapter({ ch, index }: { ch: ChapterData; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reading = useUI((s) => s.reading);
  const estudio = useUI((s) => s.estudio);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      // Forma de objeto: el callback corre si alguna condición coincide, por eso se mira `motion` adentro.
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", narrow: APILADO }, (ctx) => {
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
        // Solo opacidad (no autoAlpha): con visibility: hidden el bloque sale del árbol de accesibilidad y del
        // orden de Tab hasta que se llega a él, y un lector de pantalla no lo encuentra leyendo desde arriba.
        gsap.from(section.querySelectorAll("[data-reveal]"), {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 62%", toggleActions: "play none none reverse" },
        });
        // Apilado (celular o pantalla vertical) la escena actúa después del texto (stayOf): ahí la lista
        // se lee entera, sin atenuar.
        for (const [selector, tiempos] of SINCRONIZADOS) {
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
        // En el modo lectura (para el jurado y para imprimir) las cifras quedan quietas, con su valor.
        if (!reading) {
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
        }
        // Trama Modbus (03): los campos aparecen en orden, como llegan por la red.
        const campos = section.querySelectorAll(".fig-trama__bytes li");
        if (campos.length)
          gsap.from(campos, {
            opacity: 0,
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
      // Panel fijo más alto que la pantalla (un proyector de 720 px, el texto más grande de la presentación):
      // durante la estadía el panel sube lo que le sobra, y con lista sincronizada lo hace tramo a tramo,
      // lo justo para que el ítem que se enciende se vea entero. Corre también con reduced motion: es el
      // mismo scroll, no una animación aparte.
      mm.add(AL_COSTADO, () => {
        const panel = section.querySelector<HTMLElement>(".chapter__inner");
        if (reading || !panel || !section.hasAttribute("data-escena")) return;
        const lista = SINCRONIZADOS.find(([selector]) => section.querySelector(selector));
        const items = lista ? [...section.querySelectorAll<HTMLElement>(lista[0])] : [];
        let curva: [number, number][] = [[0, 0]];
        let medidas = { arriba: 0, alto: 0, seccion: 0, pie: 0 };
        const medir = () => {
          const arriba = parseFloat(getComputedStyle(panel).top) || 0;
          medidas = {
            arriba,
            alto: panel.offsetHeight,
            seccion: section.offsetHeight,
            pie: parseFloat(getComputedStyle(section).paddingBottom) || 0,
          };
          const sobra = Math.max(0, panel.offsetHeight + arriba + MARGEN - innerHeight);
          const desdeArriba = panel.getBoundingClientRect().top;
          // Cuánto subir para ver entero el borde de abajo de cada ítem (sin pasarse de lo que sobra).
          const hasta = items.map((li) =>
            Math.min(sobra, Math.max(0, li.getBoundingClientRect().bottom - desdeArriba + arriba + MARGEN - innerHeight)),
          );
          curva = [[0, 0]];
          let antes = 0;
          hasta.forEach((h, i) => {
            const t = lista?.[1][i] ?? 0;
            curva.push([Math.max(0, t - 0.02), antes], [t + 0.06, Math.max(antes, h)]);
            antes = Math.max(antes, h);
          });
          // Con lista, el panel se queda en el último ítem: al terminar la estadía sube solo con la sección y
          // deja ver su pie de a poco. Sin lista, sube parejo hasta mostrar el pie al final de la estadía.
          curva.push([1, items.length ? antes : sobra]);
        };
        // Interpolación lineal sobre la curva (progreso de la estadía → cuánto sube el panel).
        const sube = (p: number) => {
          for (let i = 1; i < curva.length; i++) {
            const [t0, v0] = curva[i - 1];
            const [t1, v1] = curva[i];
            if (p <= t1) return t1 > t0 ? v0 + ((v1 - v0) * Math.max(0, p - t0)) / (t1 - t0) : v1;
          }
          return curva[curva.length - 1][1];
        };
        // Navegando con Tab, lo que tiene el foco siempre a la vista: durante la estadía el borde de arriba del
        // panel queda en `arriba - sube`, así que el desplazamiento se acota para que el elemento entre entero.
        let foco: HTMLElement | null = null;
        const conFoco = (s: number) => {
          if (!foco) return s;
          const caja = panel.getBoundingClientRect();
          const el = foco.getBoundingClientRect();
          const [desde, hasta] = [el.top - caja.top, el.bottom - caja.top]; // dentro del panel
          return Math.min(desde, Math.max(s, hasta + medidas.arriba + MARGEN - innerHeight));
        };
        // El sticky suelta el panel solo cuando su borde de abajo llega al final de la sección. Se calcula dónde
        // estaría sin desplazamiento (con las medidas, no leyendo la pantalla: así da bien también antes y
        // después de la estadía) y se lo lleva a donde tiene que estar.
        let progreso = 0;
        const aplicar = (p: number) => {
          progreso = p;
          const { arriba, alto, seccion, pie } = medidas;
          const recorrido = p * (seccion - innerHeight);
          const natural = Math.min(arriba, seccion - recorrido - pie - alto);
          gsap.set(panel, { y: arriba - conFoco(sube(p)) - natural });
        };
        const enfocar = (e: FocusEvent) => {
          foco = e.type === "focusin" ? (e.target as HTMLElement) : null;
          aplicar(progreso);
        };
        panel.addEventListener("focusin", enfocar);
        panel.addEventListener("focusout", enfocar);
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onRefresh: (self) => {
            gsap.set(panel, { y: 0 });
            medir();
            aplicar(self.progress);
          },
          onUpdate: (self) => aplicar(self.progress),
        });
        return () => {
          panel.removeEventListener("focusin", enfocar);
          panel.removeEventListener("focusout", enfocar);
          gsap.set(panel, { clearProps: "transform" });
        };
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
        {/* El Canvas es decorativo (aria-hidden): la escena se describe en texto para quien no la ve.
            En el modo lectura (sin 3D: lo que lee e imprime el jurado) la escena se ve como póster, con la
            misma descripción como epígrafe; la imagen no repite el texto (alt vacío). */}
        {ch.weight &&
          (reading ? (
            <figure className="chapter__poster" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element -- export estático: no hay optimizador de imágenes */}
              <img
                src={`/posters/${estudio}/${ch.id}.jpg`}
                alt=""
                width={POSTER.ancho}
                height={POSTER_ALTO[ch.id] ?? POSTER.alto}
                decoding="async"
              />
              <figcaption>
                <strong>{ui.escena}</strong> {ch.escena}
              </figcaption>
            </figure>
          ) : (
            <p className="sr-only">
              {ui.escena} {ch.escena}
            </p>
          ))}
        <div data-reveal>
          <SourceRefs keys={ch.fuentes} pending={ch.pendientes} />
        </div>
      </div>
    </section>
  );
}
