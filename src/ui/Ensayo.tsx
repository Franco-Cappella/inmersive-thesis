"use client";

import { useEffect, useState } from "react";
import { ui } from "@/content/ui";
import { useUI } from "@/state/store";
import { stopProgress } from "./navigation";

// Cronómetro del ensayo (?presentacion&ensayo): arranca con la primera flecha y muestra la parada actual.
// El color es estado, como en todo el sitio: ámbar desde los 8 minutos y rojo pasados los 9 (la exposición dura de 5 a 9).
// También muestra los cuadros por segundo y la calidad del 3D: en la compu de la defensa, si el recorrido
// queda por debajo de 30 fps, conviene abrir con ?calidad=baja (docs/DEFENSA.md).
const AVANZAR = ["arrowright", "arrowdown", "pagedown", " "];
const FPS_MINIMO = 30;

export function Ensayo() {
  const visible = useUI((s) => s.presenting && s.ensayo);
  const tier = useUI((s) => s.tier);
  const [inicio, setInicio] = useState<number | null>(null);
  const [ahora, setAhora] = useState(0);
  const [parada, setParada] = useState({ index: 0, total: 0 });
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (AVANZAR.includes(e.key.toLowerCase())) setInicio((t) => t ?? performance.now());
    };
    // El Canvas dibuja dentro de requestAnimationFrame: contar sus vueltas da los cuadros que se ven.
    let cuadros = 0;
    let desde = performance.now();
    let vuelta = requestAnimationFrame(function contar() {
      cuadros++;
      vuelta = requestAnimationFrame(contar);
    });
    const tick = window.setInterval(() => {
      const t = performance.now();
      setAhora(t);
      setParada(stopProgress());
      setFps(Math.round((cuadros * 1000) / (t - desde)));
      cuadros = 0;
      desde = t;
    }, 500);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(vuelta);
      window.clearInterval(tick);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  if (!visible) return null;
  const segundos = inicio === null ? 0 : Math.max(0, Math.floor((ahora - inicio) / 1000));
  const estado = segundos >= 9 * 60 ? "alarma" : segundos >= 8 * 60 ? "advertencia" : "normal";
  const reloj = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`;
  const lento = tier !== "static" && fps !== null && fps < FPS_MINIMO;
  return (
    <div className="ensayo" data-estado={estado} aria-hidden="true">
      <span className="ensayo__titulo">{ui.ensayo}</span>
      <span className="ensayo__reloj">{reloj}</span>
      <span className="ensayo__parada">
        {parada.index}/{parada.total}
      </span>
      <span className="ensayo__fps" data-lento={lento || undefined}>
        {tier !== "static" && fps !== null && `${fps} fps · `}
        {ui.calidad[tier]}
      </span>
    </div>
  );
}
