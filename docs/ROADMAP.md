# Roadmap

Estado al cierre de esta fase. El detalle de por dónde va el trabajo está en `docs/PROGRESO.md`. Lo marcado como **hecho** se verificó en Chromium (desktop 1440×900 y celular 390×844) con consola limpia.

## Fase 1 · Base del proyecto — hecho
- Next.js 16 con export estático, stack fijado, TypeScript sin errores, `npm run build` correcto.
- Contenido de la tesina en `src/content/` (hero, 9 capítulos, bibliografía, declaración de IA).

## Fase 2 · Hero (pirámide IT → OT) — hecho en lo principal
- [x] Pirámide 3D con C · I · A: se arma al cargar, gira 180° y baja de la planta IT a la OT con el scroll.
- [x] Color por estado: la prioridad N° 1 de cada mundo se marca en azul; el choque de prioridades en ámbar.
- [x] Ficha IT/OT con cartel de paletas (split-flap); cada fila de prioridades rueda su contenido (ya no se cruzan los nombres).
- [x] Respaldo SVG sin WebGL y para reduced motion; tabla de la tesina como contenido real.
- [ ] **Pasada de arte:** los racks y las cañerías son primitivas grises. Falta modelado y la atmósfera de cada estudio.
- [ ] Revisar en una compu real de la defensa (GPU integrada): el tier bajo tiene que sostener 30 fps.

## Fase 3 · Capítulos — hecho en el esqueleto
- [x] 9 capítulos con título, bajada, figura en HTML y fuentes enlazadas.
- [x] Índice de progreso, atajos L / P / ← →, modo lectura.
- [x] **Director de capítulos** (`useStoryTimeline`): cámara por capítulo, `fx` acumulados y velo (`dim`) por capítulo. Reversible y con reduced motion.
- [x] Escena 3D del capítulo 01 (el parche que apaga la planta).
- [x] Escena 3D del capítulo 02 (se rompe el air gap).
- [ ] Escenas 3D de los demás capítulos (03, 05, 07, 09, 10 según `docs/GUION.md`). Hoy usan `dim: 1`.
- [ ] Pasar a las figuras de los capítulos las animaciones de la guía (`docs/GUION.md`, columna "Movimiento").

## Fase 4 · Estudios de dirección — parcial
- [x] Los 3 estudios (Sala de control, Plano P&ID, Planta de noche) están en los tokens y la paleta del 3D, verificados con capturas.
- [ ] Elegir uno con Franco (ver `docs/ESTILO.md`). Hoy el default es "Sala de control".

## Fase 5 · Verificación y defensa — parcial
- [x] Capturas del recorrido completo en celular y desktop, scroll hacia atrás incluido (`scripts/capturas.cjs`, `scripts/modos.cjs`).
- [x] Modo presentación: ← → recorren IT, OT y los capítulos en orden.
- [ ] Modo presentación ensayado con el proyector y con tiempos (5 a 9 minutos).
- [ ] Probar sin conexión con el wifi apagado.
- [ ] Video de respaldo del recorrido.
- [ ] Revisión de accesibilidad con teclado y lector de pantalla.

## Bloqueado por Franco
- Resolver los pendientes de rigor de `docs/PENDIENTES-TESINA.md` antes de presentar el sitio.
- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
