# Progreso: por dónde va el trabajo

Este archivo es el traspaso entre sesiones. Se actualiza al cerrar cada tanda de trabajo (antes del commit).

## Estado actual

- **Hero:** completo en lo funcional. La pirámide C·I·A se arma al cargar, gira 180° y baja de IT a OT con el scroll. La ficha IT/OT cambia con paletas y la lista de prioridades rueda fila por fila. Tiene respaldo SVG, modo reduced motion y modo lectura.
- **Capítulos 01–10:** esqueleto en HTML con el contenido condensado, figuras y fuentes. **Todavía sin escenas 3D:** después del hero, un velo tapa el Canvas.
- **Verificación:** `scripts/capturas.cjs` (hero y capítulos en desktop y celular, consola, scroll horizontal) y `scripts/modos.cjs` (estudios, lectura, presentación, reduced motion, sin WebGL, scroll inverso). Última corrida: todo bien, consola limpia.

## Bitácora

### Sesión 1 (27/10/2026)
- Repo Next.js 16 (export estático), stack de la skill, contenido de la tesina condensado.
- Hero 3D completo; docs de guion, estilo, decisiones, roadmap, pendientes y opinión.
- Bugs corregidos: `matchMedia` sin la condición base (el timeline no corría) y Canvas en `demand` durante el hero (la escena quedaba congelada).
- Lista de prioridades: antes se cruzaban los nombres a mitad del giro; ahora cada fila rueda su contenido como el cartel de paletas.
- Agregados `CLAUDE.md`, este archivo y `scripts/capturas.cjs`.
- Verificación de modos con `scripts/modos.cjs`: estudios Plano y Noche, lectura, presentación, reduced motion, sin WebGL, scroll de ida y vuelta y tirón con la rueda. Todo responde.
- Corregidos: presentación que salteaba la parada IT, encabezado tapado por el velo, título cortado en Plano, letras de contorno en Plano, guía de scroll visible en reduced motion, tabla del modo lectura sin estilo.
- Medido el bundle: carga inicial 237 KB gzip (Next ~170 KB de eso), chunk 3D 312 KB diferido. Ver `docs/DECISIONES.md`.

## Próximo paso

**Director de capítulos + escena 3D del capítulo 01** (tarea más grande que sigue):

1. `src/content/story.ts`: sumar a cada capítulo `camara` (landscape y portrait), `fx` (estado final) y `dim` (cuánto se atenúa el 3D).
2. `src/scroll/useStoryTimeline.ts`: por capítulo, la cámara viaja del keyframe anterior al propio mientras la sección entra (`top bottom → top top`), y los `fx` se animan mientras se lee. El primer capítulo arranca desde el shot `out` del hero.
3. Reemplazar el velo fijo de `useHeroTimeline` por el `dim` de cada capítulo.
4. Escena del 01 (`src/three/scenes/Escenario.tsx`): el parche baja de la torre IT a la planta, las HMI se ponen en blanco, el flujo se corta y la válvula pasa de ámbar a rojo.

## Cola (en orden)

1. Director de capítulos + escena 01.
2. Escenas 02 (air gap), 07 (casos en rojo) y 09 (zonas y conductos).
3. Animaciones de las figuras HTML (contadores, reloj, brecha).
4. Pasada de arte del hero y de los estudios.

## Bloqueado por Franco

- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
- Elegir el estudio de dirección de arte (`docs/ESTILO.md`).
- Resolver `docs/PENDIENTES-TESINA.md`, sobre todo las figuras 3 y 4 de la tesina.
- Título oficial, apellido, institución y materia para la portada.
