// Presupuestos del 3D (sección 8 de la skill), parada por parada del modo presentación:
// llamadas de dibujo y triángulos por frame. Se cuentan envolviendo las llamadas de WebGL desde afuera,
// sin tocar la app (incluye las pasadas del posprocesado). No mide fps: acá el 3D se dibuja por software;
// los fps reales se ven en la compu de la defensa con ?presentacion&ensayo.
// Uso: node scripts/presupuesto.cjs [url] [alta|baja]   (requiere Playwright y el build servido: npx serve out -l 4321)
// Sale con código 1 si alguna parada se pasa del presupuesto del tier.
const { chromium } = require("playwright");

const url = process.argv[2] || "http://localhost:4321";
const calidad = process.argv[3] === "baja" ? "baja" : "alta";
const TOPE = calidad === "alta" ? { llamadas: 150, triangulos: 500_000 } : { llamadas: 80, triangulos: 200_000 };
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
const FRAMES = 12;

(async () => {
  const browser = await chromium.launch({ args: GL });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    const s = { llamadas: 0, triangulos: 0 };
    window.__dibujo = s;
    // 4 = TRIANGLES, 5 = TRIANGLE_STRIP, 6 = TRIANGLE_FAN; líneas y puntos cuentan como llamada sin triángulos.
    const tri = (modo, n) => (modo === 4 ? n / 3 : modo === 5 || modo === 6 ? Math.max(0, n - 2) : 0);
    const cuentas = {
      drawArrays: (a) => tri(a[0], a[2]),
      drawElements: (a) => tri(a[0], a[1]),
      drawRangeElements: (a) => tri(a[0], a[3]),
      drawArraysInstanced: (a) => tri(a[0], a[2]) * a[3],
      drawElementsInstanced: (a) => tri(a[0], a[1]) * a[4],
    };
    for (const C of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
      if (!C) continue;
      for (const [nombre, cuenta] of Object.entries(cuentas)) {
        const original = C.prototype[nombre];
        if (!original) continue;
        C.prototype[nombre] = function (...a) {
          s.llamadas++;
          // Una cantidad de instancias infinita (three la manda así si la geometría no tiene atributos
          // instanciados) WebGL la toma como 0: no dibuja nada.
          const n = cuenta(a);
          if (Number.isFinite(n)) s.triangulos += n;
          return original.apply(this, a);
        };
      }
    }
  });
  const page = await context.newPage();
  const errores = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => m.type() === "error" && errores.push(m.text()));

  await page.goto(`${url}/?presentacion&ensayo&calidad=${calidad}`, { waitUntil: "load" });
  await page.waitForTimeout(5000);

  // Promedio por frame en la parada actual. Con el velo tapando la escena, el Canvas no dibuja (0 frames).
  const medir = () =>
    page.evaluate(async (n) => {
      const s = window.__dibujo;
      const frame = () => new Promise((r) => requestAnimationFrame(r));
      await frame();
      const [l0, t0] = [s.llamadas, s.triangulos];
      for (let i = 0; i < n; i++) await frame();
      return {
        llamadas: Math.round((s.llamadas - l0) / n),
        triangulos: Math.round((s.triangulos - t0) / n),
        tier: document.querySelector(".stage")?.getAttribute("data-tier"),
        parada: document.querySelector(".ensayo__parada")?.textContent ?? "",
        seccion: document.querySelector('[aria-current="step"] .progress__num')?.textContent ?? "",
      };
    }, FRAMES);

  const filas = [];
  for (let pasos = 0; pasos < 40; pasos++) {
    const fila = await medir();
    filas.push(fila);
    const y = await page.evaluate(() => scrollY);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(3500); // el viaje más largo entre paradas dura 3,2 s
    if ((await page.evaluate(() => scrollY)) === y) break; // era la última parada
  }

  console.log(`calidad ${calidad} · tope: ${TOPE.llamadas} llamadas y ${TOPE.triangulos / 1000} k triángulos por frame`);
  console.log("parada  sección  tier   llamadas  triángulos");
  let pasados = 0;
  for (const f of filas) {
    const pasa = f.llamadas > TOPE.llamadas || f.triangulos > TOPE.triangulos;
    if (pasa) pasados++;
    console.log(
      `${f.parada.padEnd(7)} ${f.seccion.padEnd(8)} ${String(f.tier).padEnd(6)} ${String(f.llamadas).padStart(8)}  ${(f.triangulos / 1000).toFixed(1).padStart(8)} k${pasa ? "  ← se pasa" : ""}`,
    );
  }
  const max = (k) => Math.max(...filas.map((f) => f[k]));
  console.log(`máximo: ${max("llamadas")} llamadas · ${(max("triangulos") / 1000).toFixed(1)} k triángulos · paradas que se pasan: ${pasados}`);
  console.log("consola:", errores.length ? `${errores.length} errores` : "limpia");
  errores.forEach((e) => console.log("  error:", e));
  await browser.close();
  process.exitCode = pasados || errores.length ? 1 : 0;
})();
