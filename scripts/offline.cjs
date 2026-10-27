// Prueba sin conexión para la defensa. Dos chequeos sobre el build servido:
//   1. Ningún pedido sale del propio servidor (fuentes, modelos y scripts autoalojados).
//   2. Con la red cortada después de la carga, el recorrido en modo presentación sigue andando
//      (si se cae el wifi a mitad de la exposición, la página ya cargada no se rompe).
// Uso: node scripts/offline.cjs [url] [carpeta]   (requiere Playwright y el build servido: npx serve out -l 4321)
// Sale con código 1 si encuentra pedidos externos o errores de consola.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const url = process.argv[2] || "http://localhost:4321";
const out = process.argv[3] || path.join(process.cwd(), "capturas");
fs.mkdirSync(out, { recursive: true });
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];

(async () => {
  const browser = await chromium.launch({ args: GL });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const origin = new URL(url).origin;
  const pedidos = [];
  const externos = [];
  const errores = [];
  page.on("request", (r) => {
    const u = r.url();
    if (u.startsWith("data:") || u.startsWith("blob:")) return;
    pedidos.push(u);
    if (!u.startsWith(origin)) externos.push(u);
  });
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errores.push(m.text());
  });

  // 1. Carga y recorrido completo con red: dispara todas las cargas diferidas (chunk 3D, fuentes).
  await page.goto(url, { waitUntil: "load" }); // networkidle no llega: el worker de troika (blob) queda abierto
  await page.waitForTimeout(3000);
  const alto = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= alto; y += 450) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
  console.log(`pedidos con red: ${pedidos.length} · externos: ${externos.length}`);
  externos.forEach((u) => console.log("  externo:", u));

  // 2. Se corta la red y se hace el recorrido de la defensa: arriba, modo presentación y → hasta el final.
  await context.setOffline(true);
  const antes = pedidos.length;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.keyboard.press("p");
  let pasos = 0;
  for (; pasos < 40; pasos++) {
    const y = await page.evaluate(() => scrollY);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(3500); // el viaje más largo entre paradas dura 3,2 s
    if ((await page.evaluate(() => scrollY)) === y) break; // llegó a la última parada
  }
  await page.screenshot({ path: path.join(out, "offline-final.png") });
  const fin = await page.evaluate(() => ({
    canvas: !!document.querySelector("canvas"),
    parada: document.querySelector('[aria-current="step"] .progress__num')?.textContent,
  }));
  console.log(`sin red: ${pasos} paradas recorridas hasta "${fin.parada}" · pedidos nuevos: ${pedidos.length - antes} · canvas: ${fin.canvas ? "sí" : "no"}`);

  console.log("consola:", errores.length ? `${errores.length} errores` : "limpia");
  errores.forEach((e) => console.log("  error:", e));
  await browser.close();
  process.exitCode = externos.length || errores.length ? 1 : 0;
})();
