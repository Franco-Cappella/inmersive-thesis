# Roadmap

Estado al cierre de la sesión 3: el sitio está en la fase 8 de 8 del flujo de la skill (verificación y defensa). El detalle de por dónde va el trabajo está en `docs/PROGRESO.md`. Lo marcado como **hecho** se verificó en Chromium (escritorio 1440×900, celular 390×844 y tableta 768×1024 y 1024×768) con consola limpia.

## Fase 1 · Base del proyecto — hecho
- Next.js 16 con export estático, stack fijado, TypeScript sin errores, `npm run build` correcto.
- Contenido de la tesina en `src/content/` (hero, 10 capítulos, bibliografía, declaración de IA).

## Fase 2 · Hero (pirámide IT → OT) — hecho en lo principal
- [x] Pirámide 3D con C · I · A: se arma al cargar, gira 180° y baja de la planta IT a la OT con el scroll.
- [x] Color por estado: la prioridad N° 1 de cada mundo se marca en azul; el choque de prioridades en ámbar.
- [x] Ficha IT/OT con cartel de paletas (split-flap); cada fila de prioridades rueda su contenido (ya no se cruzan los nombres).
- [x] Respaldo SVG sin WebGL y para reduced motion; tabla de la tesina como contenido real.
- [x] **Pasada de arte (detalle):** juntas entre servidores en los racks, bridas y soportes en las cañerías, aros y faldones en los tanques, rejillas y manija en los gabinetes (`src/three/scenes/PlantDetails.tsx`). Todo instanciado y en metal o tinta: cinco llamadas de dibujo más.
- [x] Presupuestos del 3D de la sección 8 de la skill, medidos parada por parada (`scripts/presupuesto.cjs`): 91 llamadas de dibujo como máximo en el tier alto y 74 en el bajo (topes 150 y 80), 45 k triángulos.
- [ ] Atmósfera propia de cada estudio (luz, niebla, materiales), cuando Franco elija uno.
- [ ] Revisar en una compu real de la defensa (GPU integrada): el tier bajo tiene que sostener 30 fps. Si no llega, abrir con `?calidad=baja` (fija el tier bajo desde el principio) o `?calidad=estatica` (sin 3D).

## Fase 3 · Capítulos — hecho
- [x] 10 capítulos con título, bajada, figura en HTML y fuentes enlazadas.
- [x] Índice de progreso, atajos L / P / ← →, modo lectura.
- [x] **Director de capítulos** (`useStoryTimeline`): cámara por capítulo, `fx` acumulados y velo (`dim`) por capítulo. Reversible y con reduced motion.
- [x] Escena 3D del capítulo 01 (el parche que apaga la planta).
- [x] Escena 3D del capítulo 02 (se rompe el air gap).
- [x] Escena 3D del capítulo 07 (los cuatro casos, sincronizados con la lista del texto).
- [x] Escena 3D del capítulo 09 (zonas, conductos, sensor pasivo y gemelo digital, sincronizados con los pilares del texto).
- [x] Escena 3D del capítulo 10 (la torre segmentada en marcha y la pirámide AIC que se rearma).
- [x] Escena 3D del capítulo 05 (tres golpes sobre la misma planta, sincronizados con la lista del texto).
- [x] Escena 3D del capítulo 03 (la trama en texto plano que el PLC ejecuta sin preguntar).
- Los capítulos 04, 06 y 08 no llevan escena: se leen sobre el velo (`dim: 1`).
- [x] Animaciones de figuras HTML: contador en las cifras de costo, brecha IT/OT que se cierra, barras SANS que crecen.
- [x] Reloj del 01: los pasos se encienden con la escena 3D.
- [x] Celular y pantallas verticales (tableta parada): en los capítulos con escena, primero el texto y después la escena actúa con la pantalla libre (antes el panel la tapaba mientras actuaba).
- [x] Trama Modbus (03): los campos aparecen en orden.

## Fase 4 · Estudios de dirección — parcial
- [x] Los 3 estudios (Sala de control, Plano P&ID, Planta de noche) están en los tokens y la paleta del 3D, verificados con capturas.
- [ ] Elegir uno con Franco (ver `docs/ESTILO.md`). Hoy el default es "Sala de control".

## Fase 5 · Verificación y defensa — parcial
- [x] Capturas del recorrido completo en celular y desktop, scroll hacia atrás incluido (`scripts/capturas.cjs`, `scripts/modos.cjs`).
- [x] Modo presentación: ← → recorren IT, OT y los capítulos en orden. En el 05, el 07 y el 09 hay una parada por golpe, por caso y por pilar (el texto y la escena avanzan juntos), y el viaje dura según lo que recorre (de 1,2 a 3,2 s). Con `?ensayo`, cronómetro y número de parada.
- [x] PDF del modo lectura para el jurado (`scripts/pdf.cjs`) e impresión desde el navegador corregida.
- [x] Pósters de las escenas (sección 10 de la skill): en el modo lectura y en el PDF cada capítulo con escena muestra una imagen fija con su descripción como epígrafe; el 03 en díptico y el 05 en tríptico (`scripts/posters.cjs`, los tres estudios).
- [x] Pantallas bajas de proyector (1280×720, 1024×768, 1366×768): el panel de los capítulos con escena sube tramo a tramo para que cada ítem que se enciende se vea entero.
- [x] El ensayo (`?presentacion&ensayo`) muestra los fps y la calidad del 3D: por debajo de 30 fps se marcan en ámbar y conviene `?calidad=baja`.
- [ ] Modo presentación ensayado con el proyector y con tiempos (5 a 9 minutos). `docs/DEFENSA.md` tiene las 27 paradas con un reparto sugerido de unos 7 min 50 s.
- [x] Prueba sin conexión automatizada (`scripts/offline.cjs`): 0 pedidos externos y el recorrido completo (27 paradas) con la red cortada, consola limpia.
- [ ] Probarlo también en la compu de la defensa, con el wifi apagado y el build servido desde `out/`.
- [x] Script del video de respaldo (`scripts/video.cjs`): graba el recorrido en modo presentación a 1920×1080.
- [ ] Grabar el video en la compu de la defensa (acá el 3D se dibuja por software y sale entrecortado).
- [x] Revisión de accesibilidad automatizada (`scripts/a11y.cjs`, axe-core, WCAG 2.2 AA): sin violaciones en escritorio, celular, modo lectura y los tres estudios. Orden de Tab lógico y foco visible.
- [x] Checklist de la sección 10 de la skill: un solo `h1`, títulos sin saltos, figuras descritas en texto y áreas de toque de 44×44 en pantallas táctiles.
- [x] Árbol de accesibilidad revisado en cinco puntos del scroll: todo el texto está siempre (antes, lo que no se había revelado quedaba afuera, incluso el `h1` a mitad del hero), y con Tab se llega a todas las fuentes, que se ven al recibir el foco. `scripts/a11y.cjs` lo controla.
- [x] Las listas sincronizadas marcan el ítem que actúa sin bajar el contraste del texto (tinta suave en vez de opacidad).
- [ ] Probar con un lector de pantalla real (NVDA o VoiceOver) antes de la defensa.

## Bloqueado por Franco
- Resolver los pendientes de rigor de `docs/PENDIENTES-TESINA.md` antes de presentar el sitio.
- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
