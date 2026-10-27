"use client";

import { stops } from "@/content/stops";
import { ui } from "@/content/ui";
import { useUI } from "@/state/store";
import { goToStop } from "./navigation";

// Índice de progreso: los "pisos" del recorrido. El hero tiene dos (IT y OT).
export function ProgressNav() {
  const active = useUI((s) => s.active);
  return (
    <nav className="progress" aria-label={ui.indice}>
      <ol>
        {stops.filter((s) => !s.oculto).map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.seccion}`}
              aria-current={active === s.id ? "step" : undefined}
              // Nombre explícito: sin esto el número y el título se leen pegados ("0103:14 AM").
              // Tiene que incluir lo que se ve ("IT:" y "OT:" ya empiezan así; "Ref" no está entero en "Referencias").
              aria-label={s.nombre.startsWith(`${s.corto}:`) ? s.nombre : `${s.corto}. ${s.nombre}`}
              onClick={(e) => {
                e.preventDefault();
                goToStop(s.id);
              }}
            >
              <span className="progress__num">{s.corto}</span>
              <span className="progress__label">{s.nombre}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
