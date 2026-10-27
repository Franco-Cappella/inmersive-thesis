@AGENTS.md

# Sitio inmersivo de la tesina IT/OT

Antes de tocar nada, leer **`docs/PROGRESO.md`**: dice por dónde va el trabajo y cuál es el próximo paso.

- Las decisiones de diseño y técnica vienen de la skill `tesina-itot-web-inmersiva`. La única diferencia acordada: se usa **Next.js en export estático** en lugar de Vite (`docs/DECISIONES.md`).
- El contenido sale de la tesina: copia de texto en **`docs/fuente/TESINA_FINAL.md`** (sin imágenes). Nunca inventar un dato: si falta la fuente, va como pendiente en `src/content/` y en `docs/PENDIENTES-TESINA.md`.
- Todo el texto vive en `src/content/`. Los componentes no tienen texto propio.

## Reglas de arquitectura

- Un solo director por tramo de scroll: `useHeroTimeline` (hero) y `useStoryTimeline` (capítulos) escriben `rig`; las escenas 3D solo leen `rig` en `useFrame`.
- La capa DOM nunca importa `three` ni `@react-three/*`. El 3D entra por `next/dynamic` con `ssr: false` en `src/ui/Stage.tsx`.
- `useFrame` siempre con prioridad 0. Nunca `gl.render` a mano: EffectComposer renderiza.
- `gsap.matchMedia().add({...})` con forma de objeto: incluir siempre `motion: "(prefers-reduced-motion: no-preference)"`, porque el callback corre solo si alguna condición coincide.
- Tweens de scroll sobre `rig`: `fromTo` con valores explícitos, `immediateRender: false` y `scrub: true`. El suavizado vive solo en `CameraRig` (`damp3`).

## Comandos

```bash
npm run dev            # http://localhost:3000
npm run build          # export estático en out/
npx serve out -l 4321  # servir el build
node scripts/capturas.cjs http://localhost:4321 /ruta/de/salida   # capturas + consola (requiere Playwright)
node scripts/modos.cjs http://localhost:4321 /ruta/de/salida      # estudios, lectura, presentación, reduced motion, sin WebGL
```

## Al cerrar una tanda de trabajo

1. `npx tsc --noEmit && npm run build` sin errores.
2. Capturas con `scripts/capturas.cjs` y revisarlas.
3. Actualizar `docs/PROGRESO.md` (qué se hizo, qué sigue) y `docs/ROADMAP.md`.
4. Commit y push a `main`.
