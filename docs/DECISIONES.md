# Decisiones técnicas

## Next.js en lugar de Vite (desvío de la skill, pendiente de confirmar con Franco)

La skill `tesina-itot-web-inmersiva` fija Vite + React como SPA y descarta Next.js. El pedido de Franco fue explícito: arrancar el repositorio con **Next.js**. Se hizo así, con estas condiciones para mantener lo que la skill protege:

- `output: "export"`: no hay servidor, el resultado es HTML/JS/CSS estático. Sigue funcionando sin conexión.
- El 3D se carga solo en el cliente con `next/dynamic(..., { ssr: false })`, así que three.js no entra en el HTML prerenderizado.
- El texto de la tesina sí queda prerenderizado en `out/index.html`: el sitio se lee sin JavaScript.
- Sin `cacheComponents`, sin rutas dinámicas, sin Server Actions, sin imágenes con optimizador (no hace falta en export).

Si Franco prefiere Vite, la migración es mecánica: `src/content`, `src/scroll`, `src/three` y `src/ui` no dependen de Next, solo `app/` y `next/dynamic`.

## Presupuesto de JavaScript (medido el 27/10/2026; segunda medición al terminar todas las escenas)

| Parte | gzip | Presupuesto de la skill | Comentario |
|---|---|---|---|
| Carga inicial total | 237 KB → 239 KB | ≤ 150 KB | Excedido por el costo fijo de Next |
| · React DOM + runtime de Next | ~170 KB | — | Viene con el framework; con Vite sería ~60 KB |
| · Código propio + GSAP + Lenis | ~66 KB | — | Dentro de lo razonable |
| Chunk 3D (three, R3F, drei, postprocessing) | 312 KB → 319 KB | ≤ 350 KB | Se carga diferido; no entra en la carga inicial. Las siete escenas y la pasada de arte sumaron 7 KB |

Para medirlo de nuevo: sumar el gzip de los `<script>` de `out/index.html` y buscar el chunk que contiene `WebGLRenderer` (tiene que quedar fuera de la carga inicial). Si en algún momento la carga inicial importa más que Next, es el argumento más concreto para volver a Vite.

## Stack (versiones fijadas)

| Paquete | Versión | Motivo |
|---|---|---|
| next | 16.4.3 | Pedido de Franco. Trae React 19.3 por dentro |
| react / react-dom | 19.3.0 | R3F 9.8 pide `>=19 <19.4`: no subir React por encima |
| three | 0.186.1 | |
| @react-three/fiber | 9.8.2 | |
| @react-three/drei | 10.7.9 | |
| @react-three/postprocessing | 3.2.2 · postprocessing 6.39.5 | Bloom, viñeta y tone mapping en el tier alto |
| gsap · @gsap/react | 3.15.0 · 2.1.2 | ScrollTrigger, SplitText. Plugins gratuitos desde 3.13 |
| lenis | 1.3.27 | Un solo loop: `gsap.ticker` mueve Lenis |
| maath | 0.10.8 | `damp3` para la cámara |
| zustand | 5.0.16 | Estado discreto |
| @fontsource-variable/archivo · source-serif-4 | 5.3.0 · 5.3.1 | Fuentes autoalojadas (offline) |

## Niebla según el encuadre

La niebla de cada estudio está pensada para la distancia de trabajo de la cámara (unas 26 unidades entre la cámara y su objetivo). En el cierre del 10 la cámara se aleja hasta 40 o 45 y con la niebla fija la planta quedaba lavada. `src/three/FogRig.tsx` escala `near` y `far` con esa distancia cuando la supera; hasta 26 deja la niebla del estudio como está.

## Errores que ya se encontraron y se corrigieron

- **`matchMedia` sin la condición base:** con la forma de objeto, GSAP ejecuta el callback si *alguna* condición coincide. Sin `(prefers-reduced-motion: no-preference)` en la lista, el timeline del hero nunca corría.
- **Canvas en `demand` durante el scroll:** la lógica "3D activo solo en `inicio`" dejaba congelada la escena, porque el propio timeline cambia la sección activa a `it` / `ot`. Ahora el loop corre mientras el hero está en pantalla.
- **Texto de la guía de scroll sobre la pregunta en celular:** se oculta en vertical.
- **Presentación salteaba la parada IT:** la flecha calculaba la siguiente parada por sección activa; ahora la calcula por posición de scroll (`src/ui/navigation.ts`).
- **Encabezado tapado por el velo del hero:** `main` pintaba encima; el encabezado y el índice ahora van con `z-index: 30` y una franja de fondo.
- **Título cortado en el estudio Plano:** el tamaño del título se ajusta al ancho de su columna con unidades de contenedor (`cqi`).
