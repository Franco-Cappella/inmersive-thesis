# Qué falta: lista para revisar

Estado al 28/10/2026: el sitio está en la **fase 8 de 8** del flujo de la skill (verificación y defensa). Todo lo que se podía hacer y verificar sin Franco ni la compu de la defensa está hecho y en `main`; el detalle de lo hecho está en `docs/PROGRESO.md`. Lo que sigue **no lo puede resolver una sesión de Claude sola**: son decisiones, datos de la tesina o pruebas en la máquina real.

Cada punto dice quién lo hace, qué hay que hacer y dónde está el detalle.

## 1 · Decisiones de Franco (bloquean el cierre)

| # | Qué decidir | Dónde mirar | Qué pasa después |
|---|---|---|---|
| 1.1 | **Estudio de dirección de arte**: Sala de control (el actual), Plano P&ID o Planta de noche | `docs/estudios.jpg` (los mismos momentos en los tres) y `docs/ESTILO.md` | Dejarlo como default, darle su atmósfera propia (luz, niebla y materiales en `src/three/palette.ts`) y volver a generar `docs/estudios.jpg`, la imagen para compartir y los pósters (`node scripts/posters.cjs`). Si se sacan los botones de estudio, se pueden borrar los pósters de los otros dos |
| 1.2 | **Next.js en lugar de Vite** (el único desvío de la skill) | `docs/DECISIONES.md` | Si se queda Next, no hay que hacer nada. Si se vuelve a Vite, es una migración de la base (el contenido, las escenas y los scripts sirven igual) |
| 1.3 | **Modo lectura automático con zoom muy alto** (menos de 320 px de alto) | `docs/DECISIONES.md`, "Zoom muy alto" | Ya está andando; solo confirmar el umbral o cambiarlo en `src/ui/Site.tsx` |
| 1.4 | **La trama Modbus del 03** (es un ejemplo armado para el sitio, no está en la tesina) | `docs/PENDIENTES-TESINA.md`, punto 10 | Mantenerla rotulada "de ejemplo", citar la especificación de Modbus o sacarla |

## 2 · Arreglos en la tesina (el sitio la cita tal cual)

Detalle completo en `docs/PENDIENTES-TESINA.md`. Lo más importante primero:

- [ ] **Figuras 3 y 4**: las imágenes no son las de sus pies de figura (son gráficos de SANS sobre experiencia y certificaciones). El sitio no las usa, pero la tesina tiene que corregirse.
- [ ] **Afirmaciones sin fuente**: ciclos de vida (3 a 5 y 15 a 30 años), las tres características de los protocolos, los tres mecanismos de la Sección 2, la tríada AIC e ISA/IEC 62443 sin parte ni año. En el sitio figuran como "Fuente pendiente".
- [ ] **Datos a confirmar contra el original** (no se pudieron abrir desde acá): ABB 2023, Siemens 2024, testimonio de Blount, títulos y autores de BBC, WeLiveSecurity y Tampa Bay Times, autores de NIST SP 800-82r3. En el sitio figuran con "Verificar".
- [ ] **Atribución de la figura 1** (el diagrama de niveles con DMZ se atribuye a un blog de NIST).
- [ ] **Escenario de apertura**: aclarar en la tesina que es hipotético (el sitio ya lo rotula así).
- [ ] **Datos de portada**: título oficial, apellido, institución, materia y año. Hoy el sitio dice "Tesina · Franco · 2026" como provisorio (`src/content/hero.ts`).
- [ ] **Referencias** en el formato que pida la cátedra (hoy APA 7 en `src/content/references.ts`).
- [ ] "Gemini(Google)" sin espacio en la declaración de IA.

Cuando algo de esto se resuelva, el cambio en el sitio es solo de texto en `src/content/` (y sacar la marca de pendiente).

## 3 · En la compu de la defensa (no se puede probar acá)

Pasos completos en `docs/DEFENSA.md`. Acá el 3D se dibuja por software, así que la fluidez real solo se ve en esa máquina.

- [ ] Copiar `out/` (después de `npm run build`) y servirlo sin internet (`npx serve out` o `python3 -m http.server`).
- [ ] Con el wifi apagado: `node scripts/offline.cjs http://localhost:PUERTO` → tiene que decir "externos: 0" y llegar hasta "Ref".
- [ ] Ensayo con el proyector real en `?presentacion&ensayo`: tiempo total (5 a 9 minutos; la tabla de `DEFENSA.md` propone unos 7 min 50 s para las 27 paradas) y **cuadros por segundo** (se ven al lado del cronómetro). Si quedan por debajo de 30 (en ámbar), presentar con `?calidad=baja`.
- [ ] Grabar el video de respaldo en esa misma compu: `node scripts/video.cjs http://localhost:PUERTO video 4`.
- [ ] Si el jurado quiere el sitio en papel: `node scripts/pdf.cjs http://localhost:PUERTO tesina-sitio.pdf` (16 hojas, con las escenas como imágenes).

## 4 · Pruebas con personas

- [ ] **Lector de pantalla real** (NVDA en Windows o VoiceOver en Mac) en al menos un capítulo con escena. Lo automático ya está: el árbol de accesibilidad tiene todo el texto en cualquier punto del scroll y Tab llega a todas las fuentes; falta escucharlo.
- [ ] **Una segunda mirada** (sección 13 de la skill): que alguien que no armó la página la recorra con la checklist de la sección 10, otro día u otra persona.

## 5 · Cómo verificar después de cualquier cambio

Con el build servido (`npm run build` y `npx serve out -l 4321`):

```bash
node scripts/capturas.cjs http://localhost:4321 capturas   # recorrido, consola limpia
node scripts/modos.cjs http://localhost:4321 capturas      # estudios, lectura, presentación, reduced motion, sin WebGL
node scripts/offline.cjs http://localhost:4321             # sin pedidos externos, 27 paradas sin red
node scripts/a11y.cjs http://localhost:4321                # axe-core y texto siempre en el árbol de accesibilidad
node scripts/reflow.cjs http://localhost:4321              # zoom 200/400 %, espaciado de texto, colores forzados
node scripts/presupuesto.cjs http://localhost:4321 baja    # llamadas de dibujo por parada (tope 80 en baja, 150 en alta)
```

Último resultado (28/10/2026): todo en verde.
