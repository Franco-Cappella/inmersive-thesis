import { stops, type Stop } from "@/content/stops";
import { APILADO, PANEL_SUBIDO } from "@/scroll/layout";
import { scrollToY } from "@/scroll/smoothScroll";

// Posición de scroll de una parada. Las del hero (IT / OT) y las del final de cada tramo de una
// escena caen en un punto de la estadía: inicio + at × (fin − inicio). En modo lectura no hay estadía.
function stopY(stop: Stop) {
  const el = document.getElementById(stop.seccion);
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const reading = document.querySelector("main")?.dataset.reading === "true";
  if (stop.at === undefined || reading) return Math.round(top);
  const fin = top + el.offsetHeight - window.innerHeight; // el borde de abajo de la sección llega al de la pantalla
  // Apilado (celular o pantalla vertical): la estadía empieza cuando el panel ya subió, igual que en el director (stayOf).
  const panel = el.querySelector<HTMLElement>(".chapter__inner");
  if (panel && el.hasAttribute("data-escena") && matchMedia(APILADO).matches) {
    const inicio = panel.getBoundingClientRect().bottom + window.scrollY - PANEL_SUBIDO * window.innerHeight;
    return Math.round(inicio + stop.at * (fin - inicio));
  }
  return Math.round(top + stop.at * (fin - top));
}

// Mientras Lenis está llevando el scroll a una parada, la referencia es ese destino
// (si no, dos ← → seguidos calcularían desde una posición intermedia).
// `apurado`: el viaje en curso ya es uno rápido (ver stepStop).
let last = { y: 0, until: 0, apurado: false };
// Hay un viaje en curso (de → o clic) que todavía no llegó: un toque ahora apura en vez de avanzar.
let enViaje = false;

// En la presentación cada → es un viaje que deja ver actuar la escena: las animaciones van atadas al scroll,
// así que su ritmo es el del viaje. Dura según lo que recorre (2,6 s más 1,6 s por pantalla, hasta 7,5 s) y
// con una curva pareja (arranca y frena suave). Antes duraba de 1,2 a 3,2 s con la curva de Lenis, que hace
// casi todo el recorrido en el primer tercio: la escena se disparaba de golpe.
// La velocidad se ajusta en vivo con + y − (de 0,5× a 2×) y se recuerda en el navegador.
const VIAJE = { base: 2.6, porPantalla: 1.6, max: 7.5 };
// Velocidad al abrir el sitio, si el navegador no guardó otra (1 = la de arriba; 1,25 = apretar + una vez).
const VELOCIDAD_INICIAL = 1.25;
const parejo = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const CLAVE = "tesina-velocidad";

function leerVelocidad() {
  try {
    const v = parseFloat(localStorage.getItem(CLAVE) ?? "");
    return v >= 0.5 && v <= 2 ? v : VELOCIDAD_INICIAL;
  } catch {
    return VELOCIDAD_INICIAL;
  }
}
let velocidad = VELOCIDAD_INICIAL;
let leida = false;

export function velocidadActual() {
  if (!leida) {
    velocidad = leerVelocidad();
    leida = true;
  }
  return velocidad;
}

export function cambiarVelocidad(paso: number) {
  velocidad = Math.min(2, Math.max(0.5, Math.round((velocidadActual() + paso) * 4) / 4));
  try {
    localStorage.setItem(CLAVE, String(velocidad));
  } catch {
    // sin almacenamiento: vale solo para esta visita
  }
}

const RAPIDO = 0.9; // segundos de un viaje apurado (dos toques seguidos)

function go(y: number, modo: "salto" | "viaje" | "rapido" = "salto") {
  const html = document.documentElement;
  if (modo === "salto") {
    enViaje = false;
    last = { y, until: performance.now() + 1300, apurado: false };
    scrollToY(y, 1.2);
    return;
  }
  const screens = Math.abs(y - window.scrollY) / window.innerHeight;
  const duration =
    modo === "rapido" ? RAPIDO : Math.min(VIAJE.max, VIAJE.base + screens * VIAJE.porPantalla) / velocidadActual();
  last = { y, until: performance.now() + duration * 1000 + 300, apurado: modo === "rapido" };
  // Mientras dura el viaje, <html data-viajando>: los scripts de prueba esperan a que se apague.
  html.dataset.viajando = "true";
  enViaje = true;
  html.dataset.destino = String(y);
  const llegar = () => {
    if (last.y !== y) return;
    enViaje = false;
    delete html.dataset.viajando;
  };
  scrollToY(y, duration, parejo, llegar);
  window.setTimeout(llegar, duration * 1000 + 300); // por si Lenis salta sin animar (reduced motion)
}

export function goToStop(id: string) {
  const stop = stops.find((s) => s.id === id);
  const y = stop ? stopY(stop) : null;
  if (y !== null) go(y);
}

// Siguiente o anterior según la POSICIÓN, no la sección activa: desde el título del hero
// la primera → tiene que ir a la ficha IT, aunque la sección activa ya sea "it".
// Dos toques seguidos (flecha o clic) apuran: si llega un → mientras la escena viaja, el viaje termina rápido en
// la misma parada (no se saltea nada); otro → durante ese viaje rápido pasa a la siguiente, también rápido.
export function stepStop(dir: 1 | -1) {
  const viajando = enViaje;
  if (viajando && dir === 1 && !last.apurado) {
    go(last.y, "rapido");
    return;
  }
  // Cerca del destino anterior (a menos de 60 px) también vale ese destino: si el viaje todavía no terminó de
  // llegar, una → no puede repetir la misma parada.
  const ref = performance.now() < last.until || Math.abs(window.scrollY - last.y) < 60 ? last.y : window.scrollY;
  const ys = stops.map(stopY).filter((y): y is number => y !== null);
  const target = dir === 1 ? ys.find((y) => y > ref + 4) : ys.findLast((y) => y < ref - 4);
  if (target !== undefined) go(target, viajando && last.apurado ? "rapido" : "viaje");
}

// Parada en la que está el scroll (1 = la primera) y cuántas hay. La usa el cronómetro del ensayo.
export function stopProgress() {
  const ys = stops.map(stopY).filter((y): y is number => y !== null);
  const index = ys.filter((y) => y <= window.scrollY + 4).length;
  return { index, total: ys.length };
}
