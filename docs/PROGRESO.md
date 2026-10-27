# Progreso: por dónde va el trabajo

Este archivo es el traspaso entre sesiones. Se actualiza al cerrar cada tanda de trabajo (antes del commit).

## Estado actual

- **Hero:** completo en lo funcional. La pirámide C·I·A se arma al cargar, gira 180° y baja de IT a OT con el scroll. La ficha IT/OT cambia con paletas y la lista de prioridades rueda fila por fila. Tiene respaldo SVG, modo reduced motion y modo lectura.
- **Capítulos 01–10:** HTML con el contenido condensado, figuras y fuentes. El **director de capítulos** (`src/scroll/useStoryTimeline.ts`) mueve la cámara y anima la escena por capítulo. **Todos los capítulos con escena prevista ya la tienen** (01, 02, 03, 05, 07, 09 y 10); el 04, el 06 y el 08 se leen sobre el velo (`dim: 1`), como dice el guion.
- **Verificación:** `scripts/capturas.cjs` (hero y capítulos en desktop y celular, consola, scroll horizontal) y `scripts/modos.cjs` (estudios, lectura, presentación, reduced motion, sin WebGL, scroll inverso). Última corrida: todo bien, consola limpia.

## Bitácora

### Sesión 1 (27/10/2026)
- Repo Next.js 16 (export estático), stack de la skill, contenido de la tesina condensado.
- Hero 3D completo; docs de guion, estilo, decisiones, roadmap, pendientes y opinión.
- Bugs corregidos: `matchMedia` sin la condición base (el timeline no corría) y Canvas en `demand` durante el hero (la escena quedaba congelada).
- Lista de prioridades: antes se cruzaban los nombres a mitad del giro; ahora cada fila rueda su contenido como el cartel de paletas.
- Agregados `CLAUDE.md`, este archivo y `scripts/capturas.cjs`.
- Verificación de modos con `scripts/modos.cjs`: estudios Plano y Noche, lectura, presentación, reduced motion, sin WebGL, scroll de ida y vuelta y tirón con la rueda. Todo responde.
- Subida la copia de texto de la tesina a `docs/fuente/TESINA_FINAL.md` (sin imágenes), como fuente de verdad para próximas sesiones.
- Corregidos: presentación que salteaba la parada IT, encabezado tapado por el velo, título cortado en Plano, letras de contorno en Plano, guía de scroll visible en reduced motion, tabla del modo lectura sin estilo.
- Medido el bundle: carga inicial 237 KB gzip (Next ~170 KB de eso), chunk 3D 312 KB diferido. Ver `docs/DECISIONES.md`.
- Director de capítulos: cámara por capítulo durante la entrada, `fx` durante la estadía, velo por `dim`. Reemplaza el velo fijo que tenía el hero.
- Escena 01 (`src/three/scenes/Escenario.tsx` + reacciones en `OTFloor.tsx`): parche que baja, HMI en blanco, flujo cortado, válvula ámbar → rojo y baliza ESD. En escritorio el panel queda fijo mientras la escena actúa. En presentación, los capítulos con escena tienen una parada oculta al final (la flecha muestra la escena terminada antes de pasar al siguiente).

### Sesión 2 (27/10/2026, 8:17–8:50 hora argentina)
- Escena 02 (`src/three/scenes/Convergencia.tsx`): borde del air gap entre los pisos, tres enlaces que bajan (racks y nube → PLC, válvula, tanque) revelados con `drawRange`, borde en ámbar y paquetes que cruzan a la planta.
- Director: lo que un capítulo apaga se resetea durante la entrada (la planta del 01 vuelve a funcionar al entrar al 02); lo que prende actúa en la estadía.
- `fx.triad`: la pirámide del hero se guarda al empezar los capítulos.
- Figuras HTML: las cifras de costo cuentan desde 0 (el lector de pantalla lee el valor final de una copia oculta) y los bloques IT/OT de "después" se juntan al entrar. Solo sin reduced motion.
- Capítulo 01: los pasos del reloj (03:14 → +3 h) se encienden sincronizados con la escena 3D. Los tiempos compartidos entre escena y texto viven en `src/scroll/timing.ts` (la capa DOM no puede importar las escenas).
- Modo lectura: los capítulos con escena vuelven a su altura natural y sin panel fijo.
- Capítulo 03: los campos de la trama Modbus aparecen en orden, como llegan por la red.

### Sesión 3 (27/10/2026, loop autónomo)
- Escena 07 (`src/three/scenes/Casos.tsx`): un caso por tramo de `fx.attack` (`CASOS_TRAMOS` en `src/scroll/timing.ts`), con la lista del texto encendiéndose al mismo ritmo. Colonial: racks en rojo, enlaces cortados y planta detenida por decisión, sin que el rojo baje. Oldsmar en ámbar (exposición, caso en discusión). Stuxnet e Industroyer: rojo hasta un PLC, que pasa a alarma.
- `src/three/signals.ts`: señales derivadas de `rig.fx` que comparten varias escenas (flujo de la planta, corte de Colonial, válvula expuesta, controladores comprometidos).
- El 08 (datos) vuelve a tapar el 3D con `dim: 1`.
- Escena 09 (`src/three/scenes/Matiz.tsx`): un pilar por tramo de `fx.zones` (`MATIZ_TRAMOS`), con la lista de pilares encendiéndose al mismo ritmo. La DMZ se cierra sobre el air gap, aparecen las zonas y una compuerta por enlace legítimo; los recorridos de los casos se retraen hasta la DMZ (señal `segmentation` en `signals.ts`) y la planta vuelve a azul. Después, un sensor pasivo en un puerto espejo y un gemelo digital que valida el parche. Verificada en los tres estudios, celular, reduced motion y scroll de vuelta al 07.
- Pasada de arte (detalle): `src/three/scenes/PlantDetails.tsx` (bridas y soportes en las cañerías, aros y faldones en los tanques, rejillas y manija en los gabinetes) y juntas entre servidores en los racks (`ITFloor.tsx`). Cinco `InstancedMesh`, en metal o tinta; verificado en los tres estudios. Bundle medido otra vez: carga inicial 239 KB y chunk 3D 319 KB gzip (`docs/DECISIONES.md`).
- Accesibilidad: `scripts/a11y.cjs` (axe-core 4.14 sobre el build, cinco vistas, más el orden de Tab). Encontró el azul de estado como texto chico en Sala (3,9:1): se agregaron `--c-flow-text` y `--c-warn-text` (ver `docs/ESTILO.md`). Los enlaces del índice tienen nombre explícito (antes se leía "0103:14 AM" o "IT IT:"). Ahora: sin violaciones.
- Escena 03 (`src/three/scenes/Protocolos.tsx`): la trama Modbus de la figura baja por el cable como una tarjeta en texto plano (los bytes salen de `story.ts`), entra al gabinete, la luz del PLC destella y la válvula gira (`valveTurn` en `signals.ts`; el volante ahora tiene rayos para que se vea girar). El 04 vuelve a `dim: 1`.
- Escena 05 (`src/three/scenes/Conflicto.tsx`): un golpe por tramo de `fx.hits` (`CONFLICTO_TRAMOS`), con la lista del texto y una parada de presentación por golpe. Parche (barra de actualización, HMI apagada, parada de emergencia), escaneo (ráfaga y controlador bloqueado en rojo) y MFA (reloj de token y válvula en alarma). Las reacciones de la planta salen de señales nuevas en `signals.ts` (`scadaReboot`, `esdTrip`, `scanLock`, `overpressure`) que también leen `Escenario.tsx` y `OTFloor.tsx`. El 06 vuelve a `dim: 1` y el 07 resetea `hits`.
- Modo presentación: una parada oculta al final de cada caso del 07 y de cada pilar del 09 (`src/content/stops.ts`, desde `src/scroll/timing.ts`), y viajes que duran según la distancia (`src/ui/navigation.ts`). El recorrido completo son 23 paradas.
- Preparación de la defensa: `scripts/offline.cjs` (ningún pedido sale de localhost y el recorrido sigue andando con la red cortada) y `scripts/video.cjs` (graba el recorrido en modo presentación). Los dos esperan con `load` y no con `networkidle`: el worker de troika (un blob) deja una conexión abierta y `networkidle` no llega nunca. Documentados en el README y en `CLAUDE.md`.
- Escena 10 (sin archivo propio: cámara y `fx.triad` en `story.ts`): la cámara sube y se aleja hasta ver la torre entera y la pirámide se rearma capa por capa en el orden A, I, C (`Pyramid.tsx`, cada capa escala con `fx.triad`). `src/three/FogRig.tsx` aleja la niebla cuando el encuadre se aleja (ver `docs/DECISIONES.md`).

## Deploy

El sitio se publica en Vercel conectado a `Franco-Cappella/inmersive-thesis`: cada push a `main` actualiza producción y cada rama genera una URL de preview. Las sesiones de Claude no tienen acceso a Vercel (la red lo bloquea y no hay credenciales): se trabaja contra el build local y se verifica con `scripts/capturas.cjs`.

## Próximo paso

**Celular durante las escenas.** Hoy, en los capítulos con escena, el panel de texto ocupa casi toda la pantalla del celular al principio de la estadía y la escena se ve recién cuando el panel sube. La skill pide el panel abajo y el objeto 3D encuadrado arriba (`portrait` de cada cámara).

1. Revisar `.chapter[data-escena]` en `src/styles/chapters.css` para pantallas de menos de 761 px: panel compacto abajo (con la lista sincronizada a la vista) y la escena arriba, o el panel arriba y más bajo.
2. Ajustar las cámaras `portrait` de cada capítulo para que el sujeto quede en la mitad visible.
3. Capturas de celular de cada capítulo con escena (0, 0,35, 0,65 y 1) antes y después.

## Cola (en orden)

1. Celular durante las escenas (panel y encuadre).
2. Probar con un lector de pantalla real y ensayar la presentación con tiempos (5 a 9 minutos).
3. Atmósfera propia del estudio que elija Franco.
4. En la compu de la defensa: correr `scripts/offline.cjs` con el wifi apagado y grabar el video con `scripts/video.cjs`.

## Bloqueado por Franco

- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
- Elegir el estudio de dirección de arte (`docs/ESTILO.md`).
- Resolver `docs/PENDIENTES-TESINA.md`, sobre todo las figuras 3 y 4 de la tesina.
- Título oficial, apellido, institución y materia para la portada.
