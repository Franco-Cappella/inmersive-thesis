// Cuándo el panel de un capítulo con escena no entra al costado de la escena: celular o cualquier
// pantalla vertical (una tableta parada, un monitor girado). Ahí primero se lee el texto y después la
// escena actúa con la pantalla libre (stayOf en useStoryTimeline). La misma condición está escrita en
// src/styles/chapters.css: si cambia acá, cambia allá.
export const APILADO = "(max-width: 760px), (orientation: portrait)";
