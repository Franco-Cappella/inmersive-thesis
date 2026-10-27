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
- Lámina comparativa de estudios (`docs/estudios.jpg`): hero IT, hero OT, el 07 y el cierre del 10 en Sala, Plano y Noche, capturados a 1440×900 con `?estudio=` y armados en una grilla de 3 × 4 (Pillow). Al armarla apareció la cita del 10 en mayúsculas en Plano: ahora la cita va siempre en caja normal.
- Impresión y PDF: `scripts/pdf.cjs` imprime el modo lectura en A4. Al probarlo aparecieron fallas que también tenía imprimir desde el navegador: capítulos en blanco (las animaciones de entrada dejan estilos en línea al volver arriba), capítulos con escena con su alto de varias pantallas, cifras impresas como "USD 0" (el contador vuelve a 0) y barras del 08 sin fondo. Se corrigieron en la hoja de impresión (`chapters.css`); además, en el modo lectura las cifras ya no animan. Hay reglas de corte de página (tablas, cifras, ítems y títulos enteros).
- Cronómetro de ensayo (`src/ui/Ensayo.tsx`): con `?presentacion&ensayo` muestra el tiempo desde la primera flecha y la parada actual (`stopProgress` en `navigation.ts`); el borde pasa a ámbar a los 8 minutos y a rojo a los 9.
- Página 404 en castellano (`src/app/not-found.tsx`, textos en `ui.ts`): sale como `out/404.html`, con el panel del sitio y un enlace al inicio.
- ESLint en cero: los scripts `.cjs` de Node pueden usar `require` (`eslint.config.mjs`), y `CameraRig`/`FlowPipe` mutan en el loop a través de refs, como pide la regla del compilador de React. `npm run lint` pasa a la lista de cierre de `CLAUDE.md`.
- `docs/DEFENSA.md`: la lista del día de la defensa adaptada a este proyecto (servidores sin internet probados: `npx serve out` y `python3 -m http.server` dentro de `out/`), las 27 paradas con lo que muestra cada una y un tiempo sugerido, y los respaldos en orden.
- Hero en el celular: con la cámara vertical de OT anterior, la punta de la pirámide invertida (C) quedaba tapada por la ficha. La cámara se alejó y mira más abajo (`heroShots.ot.portrait` en `rig.ts`): la pirámide entra entera entre los botones y la ficha.
- Encuadres del celular revisados al final de cada escena: están centrados; solo se acercó el cierre del 10 (la torre y la pirámide quedaban chicas).
- Calidad fija desde la URL para la compu de la defensa: `?calidad=baja` (sin posprocesado, resolución 1×) y `?calidad=estatica` (sin 3D). Con la calidad fija, el `PerformanceMonitor` ya no la cambia (`tierFijo` en `src/state/store.ts`). El tier queda visible en `data-tier` del `.stage` para las pruebas.
- Imagen para compartir: `src/app/opengraph-image.png` (captura del hero a 1200×630) con texto alternativo, y metadatos Open Graph y de tarjeta grande (`layout.tsx`). En Vercel la URL absoluta sale del dominio de producción (ver `docs/DECISIONES.md`).
- Descripción en texto de cada escena: en los capítulos con escena, el campo `escena` de `story.ts` se lee como párrafo oculto a la vista ("Qué muestra la ilustración: …"), porque el Canvas es decorativo. Se corrigieron las descripciones del 04, el 09 y el 10 para que coincidan con lo que hoy hace el 3D.
- Celular durante las escenas: hasta 760 px, la estadía de cada capítulo con escena empieza cuando el panel ya subió (`stayOf` en `useStoryTimeline.ts`; la sección suma ese espacio con `padding-bottom` en `chapters.css`). La escena actúa con la pantalla libre y las listas sincronizadas se leen enteras, sin atenuar.
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

**Lo que queda depende de Franco o de la compu de la defensa** (ver "Bloqueado por Franco" y la fase 5 de `docs/ROADMAP.md`). Mientras tanto, mejoras posibles sin decidir nada por él:

1. Nada urgente: el sitio está completo para lo que se puede decidir sin Franco. Si hay tiempo, revisar con Franco `docs/DEFENSA.md` y ajustar los tiempos en un ensayo real.

## Cola (en orden)

1. Probar con un lector de pantalla real y ensayar la presentación con tiempos (5 a 9 minutos).
2. Atmósfera propia del estudio que elija Franco.
3. En la compu de la defensa: correr `scripts/offline.cjs` con el wifi apagado y grabar el video con `scripts/video.cjs`.

## Bloqueado por Franco

- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
- Elegir el estudio de dirección de arte (`docs/ESTILO.md`). Para decidir de un vistazo: `docs/estudios.jpg` (los mismos cuatro momentos en los tres estudios).
- Resolver `docs/PENDIENTES-TESINA.md`, sobre todo las figuras 3 y 4 de la tesina.
- Título oficial, apellido, institución y materia para la portada.
