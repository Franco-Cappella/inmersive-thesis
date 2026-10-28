// Cuándo el panel de un capítulo con escena no entra al costado de la escena: celular o cualquier
// pantalla vertical (una tableta parada, un monitor girado). Ahí primero se lee el texto y después la
// escena actúa con la pantalla libre (stayOf en useStoryTimeline). La misma condición está escrita en
// src/styles/chapters.css: si cambia acá, cambia allá.
export const APILADO = "(max-width: 760px), (orientation: portrait)";

// En el diseño apilado, la estadía de un capítulo con escena empieza cuando el borde de abajo del
// panel pasa este punto de la pantalla (0,7 = el 70 % desde arriba). Lo usan el director (stayOf)
// y las paradas de la presentación (src/ui/navigation.ts), para que las dos caigan en el mismo tramo.
export const PANEL_SUBIDO = 0.7;
