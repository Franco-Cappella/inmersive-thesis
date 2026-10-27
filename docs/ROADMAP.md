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
- [x] Escena 3D del capítulo 07 (los cuatro casos, sincronizados con la lista del texto).
- [x] Escena 3D del capítulo 09 (zonas, conductos, sensor pasivo y gemelo digital, sincronizados con los pilares del texto).
- [x] Escena 3D del capítulo 10 (la torre segmentada en marcha y la pirámide AIC que se rearma).
- [x] Escena 3D del capítulo 05 (tres golpes sobre la misma planta, sincronizados con la lista del texto).
- [ ] Escena 3D del capítulo 03 (según `docs/GUION.md`). Hoy usa `dim: 1`.
- [x] Animaciones de figuras HTML: contador en las cifras de costo, brecha IT/OT que se cierra, barras SANS que crecen.
- [x] Reloj del 01: los pasos se encienden con la escena 3D.
- [x] Trama Modbus (03): los campos aparecen en orden.

## Fase 4 · Estudios de dirección — parcial
- [x] Los 3 estudios (Sala de control, Plano P&ID, Planta de noche) están en los tokens y la paleta del 3D, verificados con capturas.
- [ ] Elegir uno con Franco (ver `docs/ESTILO.md`). Hoy el default es "Sala de control".

## Fase 5 · Verificación y defensa — parcial
- [x] Capturas del recorrido completo en celular y desktop, scroll hacia atrás incluido (`scripts/capturas.cjs`, `scripts/modos.cjs`).
- [x] Modo presentación: ← → recorren IT, OT y los capítulos en orden. En el 07 y el 09 hay una parada por caso y por pilar (el texto y la escena avanzan juntos), y el viaje dura según lo que recorre (de 1,2 a 3,2 s).
- [ ] Modo presentación ensayado con el proyector y con tiempos (5 a 9 minutos).
- [x] Prueba sin conexión automatizada (`scripts/offline.cjs`): 0 pedidos externos y el recorrido completo (23 paradas) con la red cortada, consola limpia.
- [ ] Probarlo también en la compu de la defensa, con el wifi apagado y el build servido desde `out/`.
- [x] Script del video de respaldo (`scripts/video.cjs`): graba el recorrido en modo presentación a 1920×1080.
- [ ] Grabar el video en la compu de la defensa (acá el 3D se dibuja por software y sale entrecortado).
- [ ] Revisión de accesibilidad con teclado y lector de pantalla.

## Bloqueado por Franco
- Resolver los pendientes de rigor de `docs/PENDIENTES-TESINA.md` antes de presentar el sitio.
- Confirmar Next.js en lugar de Vite (`docs/DECISIONES.md`).
