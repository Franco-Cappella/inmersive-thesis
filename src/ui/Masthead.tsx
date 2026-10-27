"use client";

import { site } from "@/content/hero";
import { ui } from "@/content/ui";
import { estudios, useUI } from "@/state/store";

export function Masthead() {
  const reading = useUI((s) => s.reading);
  const presenting = useUI((s) => s.presenting);
  const estudio = useUI((s) => s.estudio);
  const setEstudio = useUI((s) => s.setEstudio);
  const toggleReading = useUI((s) => s.toggleReading);
  const togglePresenting = useUI((s) => s.togglePresenting);

  return (
    <header className="masthead">
      <a className="masthead__brand" href="#inicio">
        {site.titulo}
      </a>
      <div className="masthead__tools">
        {/* Selector temporal: sirve para elegir uno de los 3 estudios de dirección (docs/DIRECCION-DE-ARTE.md). */}
        <div className="segmented" role="group" aria-label={ui.estudio}>
          {estudios.map((e) => (
            <button key={e.id} type="button" aria-pressed={estudio === e.id} onClick={() => setEstudio(e.id)}>
              {e.nombre}
            </button>
          ))}
        </div>
        <button type="button" className="tool" aria-pressed={reading} onClick={toggleReading}>
          {ui.lectura} <kbd>L</kbd>
        </button>
        <button type="button" className="tool tool--present" aria-pressed={presenting} onClick={togglePresenting}>
          {ui.presentar} <kbd>P</kbd>
        </button>
      </div>
    </header>
  );
}
