// Pósters de las escenas para el modo lectura y el PDF del jurado: cada capítulo con escena en su estado
// final, sin el panel ni el encabezado, en los tres estudios. Donde un solo cuadro no cuenta la escena,
// van varios en fila: el 03 en díptico (la trama llega al PLC → la válvula giró) y el 05 en tríptico,
// un cuadro al final de cada golpe (los tramos de src/scroll/timing.ts).
// Uso: node scripts/posters.cjs [url] [carpeta] [capítulos...]   (por defecto public/posters y todos los
// capítulos con escena; requiere Playwright y el build servido). Ejemplo: ... public/posters protocolos
// Después, `npm run build` para que viajen en out/. Volver a generarlos si cambia una escena o la paleta.
// Si cambian las medidas (ANCHO, ALTO o los cuadros en fila), actualizar POSTER en src/ui/Chapter.tsx.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const url = process.argv[2] || "http://localhost:4321";
const destino = process.argv[3] || path.join(process.cwd(), "public", "posters");
const SOLO = process.argv.slice(4);
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
const ESTUDIOS = ["sala", "plano", "noche"];
const ANCHO = 1024;
const ALTO = 640;
// Momento de cada cuadro (progreso de la estadía). Por defecto, el final.
const MOMENTOS = { protocolos: [0.42, 0.995], conflicto: [0.32, 0.65, 0.995] };
const OCULTAR = ".chapter__inner, .masthead, .progress, .skip, .ensayo { visibility: hidden !important; }";

(async () => {
  const browser = await chromium.launch({ args: GL });
  const page = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
  const errores = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => m.type() === "error" && errores.push(m.text()));

  for (const estudio of ESTUDIOS) {
    const carpeta = path.join(destino, estudio);
    fs.mkdirSync(carpeta, { recursive: true });
    await page.goto(`${url}/?calidad=alta&estudio=${estudio}`, { waitUntil: "load" });
    await page.waitForTimeout(4000);
    await page.addStyleTag({ content: OCULTAR });
    const todos = await page.evaluate(() => [...document.querySelectorAll("[data-escena]")].map((el) => el.id));
    const ids = SOLO.length ? todos.filter((id) => SOLO.includes(id)) : todos;
    for (const id of ids) {
      const momentos = MOMENTOS[id] ?? [0.995];
      const cuadros = [];
      for (const at of momentos) {
        // Salto directo: el director usa fromTo explícitos, así que el estado depende solo de la posición.
        const [inicio, fin] = await page.evaluate((id) => {
          const el = document.getElementById(id);
          const top = el.getBoundingClientRect().top + scrollY;
          return [top, top + el.offsetHeight - innerHeight];
        }, id);
        const y = Math.round(inicio + at * (fin - inicio));
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(3000); // la cámara amortiguada termina de llegar
        cuadros.push(await page.screenshot(momentos.length === 1 ? { type: "jpeg", quality: 78 } : { type: "png" }));
      }
      const jpg =
        cuadros.length === 1
          ? cuadros[0]
          : await enFila(browser, cuadros, await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
      fs.writeFileSync(path.join(carpeta, `${id}.jpg`), jpg);
      console.log(`${estudio}/${id}.jpg · ${Math.round(jpg.length / 1024)} KB`);
    }
  }
  console.log("consola:", errores.length ? `${errores.length} errores` : "limpia");
  errores.forEach((e) => console.log("  error:", e));
  await browser.close();
  process.exitCode = errores.length ? 1 : 0;
})();

// Varios cuadros en fila, recortados a la parte izquierda (donde actúa la escena, al costado del panel),
// del mismo ancho que los demás pósters y separados por el color del campo del estudio.
async function enFila(browser, cuadros, fondo) {
  const page = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
  const fuentes = cuadros.map((b) => `data:image/png;base64,${b.toString("base64")}`);
  const datos = await page.evaluate(
    async ({ fuentes, fondo, ANCHO, ALTO }) => {
      const imgs = await Promise.all(
        fuentes.map(
          (src) =>
            new Promise((ok) => {
              const img = new Image();
              img.onload = () => ok(img);
              img.src = src;
            }),
        ),
      );
      const corte = { x: 0, y: 0, w: ANCHO * 0.58, h: ALTO }; // el 03 y el 05 actúan en la parte izquierda
      const espacio = 8;
      const w = (ANCHO - espacio * (imgs.length - 1)) / imgs.length;
      const h = (w * corte.h) / corte.w;
      const lienzo = document.createElement("canvas");
      lienzo.width = ANCHO;
      lienzo.height = Math.round(h);
      const ctx = lienzo.getContext("2d");
      ctx.fillStyle = fondo;
      ctx.fillRect(0, 0, lienzo.width, lienzo.height);
      imgs.forEach((img, i) => ctx.drawImage(img, corte.x, corte.y, corte.w, corte.h, i * (w + espacio), 0, w, h));
      return lienzo.toDataURL("image/jpeg", 0.8);
    },
    { fuentes, fondo, ANCHO, ALTO },
  );
  await page.close();
  return Buffer.from(datos.split(",")[1], "base64");
}
