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
        {stops.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.seccion}`}
              aria-current={active === s.id ? "step" : undefined}
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
