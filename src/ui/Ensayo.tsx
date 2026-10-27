"use client";

import { useEffect, useState } from "react";
import { ui } from "@/content/ui";
import { useUI } from "@/state/store";
import { stopProgress } from "./navigation";

// Cronómetro del ensayo (?presentacion&ensayo): arranca con la primera flecha y muestra la parada actual.
// El color es estado, como en todo el sitio: ámbar desde los 8 minutos y rojo pasados los 9 (la exposición dura de 5 a 9).
const AVANZAR = ["arrowright", "arrowdown", "pagedown", " "];

export function Ensayo() {
  const visible = useUI((s) => s.presenting && s.ensayo);
  const [inicio, setInicio] = useState<number | null>(null);
  const [ahora, setAhora] = useState(0);
  const [parada, setParada] = useState({ index: 0, total: 0 });

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (AVANZAR.includes(e.key.toLowerCase())) setInicio((t) => t ?? performance.now());
    };
    const tick = window.setInterval(() => {
      setAhora(performance.now());
      setParada(stopProgress());
    }, 500);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  if (!visible) return null;
  const segundos = inicio === null ? 0 : Math.max(0, Math.floor((ahora - inicio) / 1000));
  const estado = segundos >= 9 * 60 ? "alarma" : segundos >= 8 * 60 ? "advertencia" : "normal";
  const reloj = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`;
  return (
    <div className="ensayo" data-estado={estado} aria-hidden="true">
      <span className="ensayo__titulo">{ui.ensayo}</span>
      <span className="ensayo__reloj">{reloj}</span>
      <span className="ensayo__parada">
        {parada.index}/{parada.total}
      </span>
    </div>
  );
}
