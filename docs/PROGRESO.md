# Progreso: por dónde va el trabajo

Este archivo es el traspaso entre sesiones. Se actualiza al cerrar cada tanda de trabajo (antes del commit).

## Estado actual

- **Hero:** completo en lo funcional. La pirámide C·I·A se arma al cargar, gira 180° y baja de IT a OT con el scroll. La ficha IT/OT cambia con paletas y la lista de prioridades rueda fila por fila. Tiene respaldo SVG, modo reduced motion y modo lectura.
- **Capítulos 01–10:** HTML con el contenido condensado, figuras y fuentes. El **director de capítulos** (`src/scroll/useStoryTimeline.ts`) mueve la cámara y anima la escena por capítulo. **Los capítulos 01 y 02 ya tienen su escena 3D**; los demás usan `dim: 1` (el velo tapa el 3D) hasta que se construya la suya.
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

## Deploy

El sitio se publica en Vercel conectado a `Franco-Cappella/inmersive-thesis`: cada push a `main` actualiza producción y cada rama genera una URL de preview. Las sesiones de Claude no tienen acceso a Vercel (la red lo bloquea y no hay credenciales): se trabaja contra el build local y se verifica con `scripts/capturas.cjs`.

## Próximo paso

**Escena 3D del capítulo 07 (casos: los recorridos en rojo).** Es la "audacia" de la dirección de arte (la otra es el descenso). Ver `docs/GUION.md`, "Cómo se agrega la escena de un capítulo".

1. `src/content/story.ts`: al capítulo `casos`, `weight`, `camara` y `fx: { dim: 0, attack: 1 }` (sumar `attack` a `SceneFx`/`FX_INICIAL`). Los capítulos 03 a 06 siguen con `dim: 1`; el 08 (datos) tiene que volver a `dim: 1`.
2. `src/three/scenes/Casos.tsx`: un recorrido rojo (`palette.alarm`) por caso, de la oficina o la nube hacia la planta, reutilizando los enlaces del 02. Colonial Pipeline: el rojo se queda en IT y la planta se detiene igual (corte por decisión, sin que el ataque llegue a OT). Oldsmar: el recorrido llega a la válvula por acceso remoto. Stuxnet e Industroyer: llegan a un PLC.
3. El texto del capítulo nombra cada caso: el color nunca es el único portador de significado.

## Cola (en orden)

1. Escenas 07 (casos en rojo) y 09 (zonas y conductos que bloquean el rojo).
2. Pasada de arte del hero y de los estudios.
3. Escenas 3D restantes: 03 (PLC que ejecuta una trama), 05 (tres golpes), 10 (postura: vuelve la pirámide AIC con `triad: 1`).

## Bloqueado por Franco

- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
- Elegir el estudio de dirección de arte (`docs/ESTILO.md`).
- Resolver `docs/PENDIENTES-TESINA.md`, sobre todo las figuras 3 y 4 de la tesina.
- Título oficial, apellido, institución y materia para la portada.
