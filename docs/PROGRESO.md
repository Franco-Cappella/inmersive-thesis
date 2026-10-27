# Progreso: por dónde va el trabajo

Este archivo es el traspaso entre sesiones. Se actualiza al cerrar cada tanda de trabajo (antes del commit).

## Estado actual

- **Hero:** completo en lo funcional. La pirámide C·I·A se arma al cargar, gira 180° y baja de IT a OT con el scroll. La ficha IT/OT cambia con paletas y la lista de prioridades rueda fila por fila. Tiene respaldo SVG, modo reduced motion y modo lectura.
- **Capítulos 01–10:** HTML con el contenido condensado, figuras y fuentes. El **director de capítulos** (`src/scroll/useStoryTimeline.ts`) mueve la cámara y anima la escena por capítulo. **El capítulo 01 ya tiene su escena 3D**; los demás usan `dim: 1` (el velo tapa el 3D) hasta que se construya la suya.
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
- Director de capítulos: cámara por capítulo durante la entrada, `fx` durante la estadía, velo por `dim`. Reemplaza el velo fijo que tenía el hero.
- Escena 01 (`src/three/scenes/Escenario.tsx` + reacciones en `OTFloor.tsx`): parche que baja, HMI en blanco, flujo cortado, válvula ámbar → rojo y baliza ESD. En escritorio el panel queda fijo mientras la escena actúa. En presentación, los capítulos con escena tienen una parada oculta al final (la flecha muestra la escena terminada antes de pasar al siguiente).

## Próximo paso

**Escena 3D del capítulo 02 (convergencia: se rompe el air gap).** Ver `docs/GUION.md`, sección "Cómo se agrega la escena de un capítulo".

1. `src/content/story.ts`: al capítulo `convergencia`, `weight`, `camara` y `fx: { dim: 0, bridge: 1 }`; sumar `bridge` a `SceneFx`/`FX_INICIAL`. El capítulo 03 tiene que volver a `dim: 1` (o tener su escena).
2. `src/three/scenes/Convergencia.tsx`: entre el piso IT y la planta hay un hueco (el air gap). Con `bridge` aparece un enlace (nube/ERP → PLC) y los paquetes empiezan a cruzar hacia la planta.
3. Verificar con `scripts/capturas.cjs` (captura la estadía de los capítulos con escena) y `scripts/modos.cjs`.

## Cola (en orden)

1. Escenas 02 (air gap), 07 (casos en rojo) y 09 (zonas y conductos).
2. Animaciones de las figuras HTML (contadores, reloj, brecha).
3. Pasada de arte del hero y de los estudios.

## Bloqueado por Franco

- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
- Elegir el estudio de dirección de arte (`docs/ESTILO.md`).
- Resolver `docs/PENDIENTES-TESINA.md`, sobre todo las figuras 3 y 4 de la tesina.
- Título oficial, apellido, institución y materia para la portada.
