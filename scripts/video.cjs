// Video de respaldo para la defensa: graba el recorrido en modo presentación, parada por parada.
// Uso: node scripts/video.cjs [url] [carpeta] [segundos por parada]
//   (requiere Playwright y el build servido: npx serve out -l 4321)
// Sale un .webm de 1920×1080 en la carpeta. Para pasarlo a .mp4: ffmpeg -i recorrido.webm -c:v libx264 -crf 20 recorrido.mp4
// En una compu sin placa de video el 3D se dibuja por software y el video sale entrecortado:
// grabarlo en la compu de la defensa, o con GPU=1 para usar la placa (node scripts/video.cjs … con GPU=1 en el entorno).
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const url = process.argv[2] || "http://localhost:4321";
const out = process.argv[3] || path.join(process.cwd(), "video");
const pausa = Number(process.argv[4] || 4) * 1000; // tiempo en cada parada, además del viaje
fs.mkdirSync(out, { recursive: true });
const args = process.env.GPU ? ["--enable-gpu", "--ignore-gpu-blocklist"] : ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
const size = { width: 1920, height: 1080 };

(async () => {
  const browser = await chromium.launch({ args });
  const context = await browser.newContext({ viewport: size, recordVideo: { dir: out, size } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load" }); // networkidle no llega: el worker de troika (blob) queda abierto
  await page.waitForTimeout(4500); // el armado de la pirámide al cargar
  await page.keyboard.press("p");
  let paradas = 0;
  for (; paradas < 40; paradas++) {
    const y = await page.evaluate(() => scrollY);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(pausa);
    if ((await page.evaluate(() => scrollY)) === y) break; // llegó a la última parada
  }
  const video = page.video();
  await context.close(); // cierra y escribe el archivo
  const destino = path.join(out, "recorrido.webm");
  if (video) fs.renameSync(await video.path(), destino);
  await browser.close();
  console.log(`${paradas} paradas grabadas en ${destino}`);
})();
