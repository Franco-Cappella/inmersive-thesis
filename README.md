# La tríada invertida · sitio inmersivo de la tesina IT/OT

Sitio de acompañamiento de la tesina sobre por qué la ciberseguridad IT fracasa al aplicarse sin adaptación en entornos OT. Arranca con un hero 3D: una pirámide C · I · A que, al scrollear, gira 180° y baja de la planta IT a la planta OT, donde queda invertida (A · I · C). Debajo siguen los capítulos de la tesina en formato corto.

Hecho con Next.js 16 en **export estático**: no necesita servidor y funciona sin conexión.

## Requisitos

- **Node.js 20 o más nuevo** (recomendado 22 LTS): https://nodejs.org
- Git
- Un navegador con WebGL2 (Chrome, Edge o Firefox actuales). Sin WebGL el sitio muestra una versión en SVG.

Para comprobar las versiones:

```bash
node -v
npm -v
```

## Cómo ejecutarlo

### 1. Clonar e instalar

```bash
git clone https://github.com/Franco-Cappella/inmersive-thesis.git
cd inmersive-thesis
npm install
```

En Windows funciona igual desde PowerShell, CMD o la terminal de VS Code.

### 2. Verlo en modo desarrollo

```bash
npm run dev
```

Abrí **http://localhost:3000** y scrolleá: el hero ocupa las primeras tres pantallas. Los cambios en el código se ven al instante.

### 3. Build final (el que se usa en la defensa)

```bash
npm run build
npx serve out
```

`npm run build` genera la carpeta `out/` con el sitio estático. `npx serve out` lo sirve en **http://localhost:3000**. Esa carpeta se puede copiar a un pendrive y servir en cualquier compu con Node, también sin internet.

> No abras `out/index.html` con doble clic (`file://`): los módulos de JavaScript necesitan un servidor, aunque sea local.

## Cómo usarlo

| Tecla o URL | Qué hace |
|---|---|
| Scroll | Recorre el hero (IT → giro → OT) y los capítulos |
| `L` o `?lectura` | Modo lectura: sin 3D, todo el texto en flujo normal. Sirve para el jurado y para imprimir |
| `P` o `?presentacion` | Modo presentación: `→` y `←` (o un control remoto) saltan entre paradas |
| `?estudio=plano` / `?estudio=noche` | Cambia la dirección de arte. También desde los botones del encabezado |

Si el sistema tiene activado "reducir movimiento", el sitio salta entre estados en vez de animar.

## Scripts

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build estático en `out/` |
| `npm run lint` | ESLint |

### Antes de la defensa

Con el build servido (`npx serve out -l 4321`) y Playwright instalado (`npm i -D playwright && npx playwright install chromium`):

| Comando | Para qué |
|---|---|
| `node scripts/offline.cjs http://localhost:4321` | Confirma que el sitio no pide nada a internet y que, con la red cortada después de cargar, el recorrido completo en modo presentación sigue andando. Sale con error si encuentra un pedido externo o un error de consola |
| `node scripts/a11y.cjs http://localhost:4321` | Revisión de accesibilidad con axe-core (WCAG 2.2 AA) en escritorio, celular, modo lectura y los tres estudios, más el orden de foco con Tab. Sale con error si encuentra violaciones |
| `node scripts/video.cjs http://localhost:4321 video 4` | Graba el recorrido en modo presentación (1920×1080, 4 s por parada) en `video/recorrido.webm`, como respaldo por si falla la compu. Conviene grabarlo en la compu de la defensa: en una sin placa de video el 3D sale entrecortado. Con `GPU=1` usa la placa. Para pasarlo a mp4: `ffmpeg -i video/recorrido.webm -c:v libx264 -crf 20 video/recorrido.mp4` |

## Estructura

```
src/
  app/        layout y página única
  content/    todo el texto: hero.ts, story.ts (capítulos), references.ts, stops.ts, ui.ts
  scroll/     rig.ts (estado compartido), useHeroTimeline.ts (director del scroll), smoothScroll.ts (Lenis)
  state/      store.ts (estado de la interfaz)
  three/      Experience.tsx (Canvas) y escenas: Pyramid, ITFloor, OTFloor
  ui/         Site, Hero, Chapter, Figuras, References, Masthead, ProgressNav
  styles/     tokens.css (colores por estudio), base.css, hero.css, chapters.css
docs/         guion, dirección de arte, decisiones, roadmap y pendientes de la tesina
```

Para editar textos, tocá solo `src/content/`. Ningún componente tiene texto propio.

## Problemas frecuentes

- **Pantalla gris sin 3D:** el navegador no tiene WebGL2 o la aceleración por hardware está apagada. Probá en Chrome o Edge, o usá `?lectura`.
- **`npm install` falla por versiones de React:** no actualices React por encima de 19.3. React Three Fiber 9.8 pide `>=19 <19.4`.
- **Va lento en una notebook:** el sitio baja la calidad solo si caen los FPS. Si igual no alcanza, usá el modo lectura.

## Estado y documentación

- `docs/ROADMAP.md`: qué está hecho y qué falta.
- `docs/GUION.md`: cada capítulo con su figura y su escena 3D.
- `docs/PENDIENTES-TESINA.md`: problemas de rigor a resolver en la tesina antes de presentar.
- `docs/DECISIONES.md`: por qué Next.js en export estático y versiones fijadas.
