# Decisiones técnicas

## Next.js en lugar de Vite (desvío de la skill, a pedido de Franco)

La skill `tesina-itot-web-inmersiva` fija Vite + React como SPA y descarta Next.js. El pedido de Franco fue explícito: arrancar el repositorio con **Next.js**. Se hizo así, con estas condiciones para mantener lo que la skill protege:

- `output: "export"`: no hay servidor, el resultado es HTML/JS/CSS estático. Sigue funcionando sin conexión.
- El 3D se carga solo en el cliente con `next/dynamic(..., { ssr: false })`, así que three.js no entra en el HTML prerenderizado.
- El texto de la tesina sí queda prerenderizado en `out/index.html`: el sitio se lee sin JavaScript.
- Sin `cacheComponents`, sin rutas dinámicas, sin Server Actions, sin imágenes con optimizador (no hace falta en export).

Si Franco prefiere Vite, la migración es mecánica: `src/content`, `src/scroll`, `src/three` y `src/ui` no dependen de Next, solo `app/` y `next/dynamic`.

## Presupuesto de JavaScript (medido el 27/10/2026; segunda medición al terminar todas las escenas; tercera el 28/10/2026)

| Parte | gzip | Presupuesto de la skill | Comentario |
|---|---|---|---|
| Carga inicial total | 237 KB → 239 KB → 250 KB | ≤ 150 KB | Excedido por el costo fijo de Next |
| · React DOM + runtime de Next | ~170 KB | — | Viene con el framework; con Vite sería ~60 KB |
| · Código propio + GSAP + Lenis | ~66 KB → ~80 KB | — | Dentro de lo razonable |
| Chunk 3D (three, R3F, drei, postprocessing) | 312 KB → 319 KB → 328,5 KB | ≤ 350 KB | Se carga diferido; no entra en la carga inicial. Las siete escenas y la pasada de arte sumaron 7 KB; la fusión de piezas (`BufferGeometryUtils`), menos de 1 KB |

Para medirlo de nuevo: sumar el gzip de los `<script>` de `out/index.html` y buscar el chunk que contiene `WebGLRenderer` (tiene que quedar fuera de la carga inicial). Si en algún momento la carga inicial importa más que Next, es el argumento más concreto para volver a Vite.

## Presupuesto del 3D: llamadas de dibujo y triángulos (medido el 28/10/2026)

La skill fija topes por frame para la compu de la defensa (sección 8). `scripts/presupuesto.cjs` los cuenta en cada una de las 27 paradas de la presentación, envolviendo las llamadas de WebGL desde afuera (incluye las pasadas del posprocesado):

| Tier | Antes | Después | Tope de la skill |
|---|---|---|---|
| Alto (`?calidad=alta`) | 122 llamadas | 91 llamadas · 45 k triángulos | ≤ 150 · ≤ 500 k |
| Bajo (`?calidad=baja`) | 105 llamadas: el 09 y el 10 se pasaban | 74 llamadas · 45 k triángulos | ≤ 80 · ≤ 200 k |

El pico está en el final del 10 (la torre entera a la vista, con la pirámide). Para bajarlo se fusionaron piezas quietas que comparten material y se instanciaron las que se repiten, sin cambiar el aspecto (`src/three/merge.ts`):

- Tanques: cuerpo, domo y contorno de los cuatro en dos llamadas (eran 12).
- Gabinetes PLC: cuerpos y contornos fusionados y las luces de estado instanciadas, cada una con su color (eran 6, son 3).
- Volante de la válvula: manija y rayos en una pieza (eran 3).
- Capítulo 09: cuerpos y luces de las tres compuertas instanciados (el contorno sigue por compuerta, porque cada una crece por su cuenta) y los cuatro campos del sensor en una sola malla.
- Paquetes: `PacketFlow` acepta varias rutas en una sola malla instanciada (las tres bandejas de la oficina y los tres enlaces del 02). Las bandejas, además, en un solo trazo.
- Marca del bloqueo de cada caso (esfera y disco) en una pieza.

Las capturas de las 27 paradas antes y después difieren solo en lo que se mueve (paquetes, flujo de las cañerías, LEDs). Los cuadros por segundo no se pueden medir acá (el 3D se dibuja por software): se ven en la compu de la defensa con `?presentacion&ensayo`.

## Zoom muy alto: modo lectura automático (28/10/2026)

Con el zoom del 400 % que exige WCAG 1.4.10 (320 px de ancho; en una pantalla común, menos de 320 px de alto), el escenario fijo del hero y los paneles al costado de la escena no entran: el texto quedaba cortado sin forma de leerlo. En vez de un tercer diseño para ese caso, el sitio pasa solo al modo lectura, que ya fluye entero (con los pósters de las escenas), y vuelve al modo normal cuando la pantalla crece si la lectura la había puesto él. No toca la URL. El umbral (320 px de alto) deja afuera a los celulares apaisados (360 px o más), que siguen con el 3D. Si Franco prefiere otro umbral, está en `src/ui/Site.tsx`.

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

## Imagen para compartir

`src/app/opengraph-image.png` (1200×630, una captura del hero) y su texto alternativo en `opengraph-image.alt.txt`, con la convención de archivos de Next. No se fija `metadataBase`: en un build de producción en Vercel, Next arma la URL absoluta con `VERCEL_PROJECT_PRODUCTION_URL` (y en los previews con la URL de la rama), según `next/dist/lib/metadata/resolvers/resolve-url.js`. En el build local aparece el aviso "metadataBase property … is not set" y la URL apunta a `localhost:3000`: es esperable. Si el sitio se publica en otro dominio, ahí sí hay que fijar `metadataBase` en `src/app/layout.tsx`.

Para regenerar la imagen después de un cambio visual del hero: capturar el hero a 1200×630 con la barra de estudios, el índice y la guía de scroll ocultos.

## Niebla según el encuadre

La niebla de cada estudio está pensada para la distancia de trabajo de la cámara (unas 26 unidades entre la cámara y su objetivo). En el cierre del 10 la cámara se aleja hasta 40 o 45 y con la niebla fija la planta quedaba lavada. `src/three/FogRig.tsx` escala `near` y `far` con esa distancia cuando la supera; hasta 26 deja la niebla del estudio como está.

## Errores que ya se encontraron y se corrigieron

- **`matchMedia` sin la condición base:** con la forma de objeto, GSAP ejecuta el callback si *alguna* condición coincide. Sin `(prefers-reduced-motion: no-preference)` en la lista, el timeline del hero nunca corría.
- **Canvas en `demand` durante el scroll:** la lógica "3D activo solo en `inicio`" dejaba congelada la escena, porque el propio timeline cambia la sección activa a `it` / `ot`. Ahora el loop corre mientras el hero está en pantalla.
- **Texto de la guía de scroll sobre la pregunta en celular:** se oculta en vertical.
- **Presentación salteaba la parada IT:** la flecha calculaba la siguiente parada por sección activa; ahora la calcula por posición de scroll (`src/ui/navigation.ts`).
- **Encabezado tapado por el velo del hero:** `main` pintaba encima; el encabezado y el índice ahora van con `z-index: 30` y una franja de fondo.
- **Título cortado en el estudio Plano:** el tamaño del título se ajusta al ancho de su columna con unidades de contenedor (`cqi`).
