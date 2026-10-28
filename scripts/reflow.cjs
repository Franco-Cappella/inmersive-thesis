// Zoom y texto ampliado (WCAG 1.4.10 reflow, 1.4.12 espaciado de texto) y colores forzados, sobre el build servido.
// En cada caso recorre la página y busca dos cosas: que la página se mueva de costado, y texto del contenido
// cortado por una caja con overflow oculto (lo que tiene aria-hidden o es solo para lectores de pantalla no cuenta).
// Uso: node scripts/reflow.cjs [url] [carpeta]   (requiere Playwright y el build servido: npx serve out -l 4321)
// Con carpeta, guarda una captura del inicio de cada caso. Sale con código 1 si encuentra algo.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const url = process.argv[2] || "http://localhost:4321";
const out = process.argv[3];
if (out) fs.mkdirSync(out, { recursive: true });
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
// Los valores de WCAG 1.4.12: interlineado 1,5, párrafos 2 em, letras 0,12 em y palabras 0,16 em.
const ESPACIADO =
  "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }";
const casos = [
  // 400 % de zoom en 1280×1024: con menos de 320 px de alto el sitio pasa solo al modo lectura
  { nombre: "zoom 400 % (320×256)", contexto: { viewport: { width: 320, height: 256 } } },
  { nombre: "celular angosto (320×568)", contexto: { viewport: { width: 320, height: 568 } } },
  { nombre: "zoom 200 % (960×540)", contexto: { viewport: { width: 960, height: 540 } } },
  { nombre: "espaciado (1440×900)", contexto: { viewport: { width: 1440, height: 900 } }, css: ESPACIADO },
  { nombre: "espaciado (390×844)", contexto: { viewport: { width: 390, height: 844 } }, css: ESPACIADO },
  { nombre: "espaciado en lectura", contexto: { viewport: { width: 1440, height: 900 } }, query: "?lectura", css: ESPACIADO },
  { nombre: "colores forzados", contexto: { viewport: { width: 1440, height: 900 }, forcedColors: "active" } },
];

function revisar() {
  const ancho = document.documentElement.clientWidth;
  // Invisible a propósito: aria-hidden, solo para lectores, visibility: hidden o fundido del todo (opacidad efectiva 0,
  // como el título del hero cuando el scroll ya pasó a la ficha)
  const opacidad = (el) => {
    let o = 1;
    for (let a = el; a; a = a.parentElement) o *= parseFloat(getComputedStyle(a).opacity);
    return o;
  };
  const oculto = (el) =>
    el.closest('[aria-hidden="true"], .sr-only') || getComputedStyle(el).visibility === "hidden" || opacidad(el) < 0.01;
  const conTexto = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const cortados = [];
  for (const el of document.querySelectorAll("main *")) {
    if (!conTexto(el) || oculto(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    // ¿Alguna caja que recorta lo deja afuera, aunque sea en parte?
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (!/hidden|clip/.test(cs.overflowX + cs.overflowY)) continue;
      const c = a.getBoundingClientRect();
      if (c.width <= 1 && c.height <= 1) break; // caja de 1×1: texto solo para lectores de pantalla (como la tabla del hero)
      if (r.left < c.left - 1 || r.right > c.right + 1 || r.top < c.top - 1 || r.bottom > c.bottom + 1) {
        // Solo cuenta si la parte cortada estaría en pantalla (lo que sale de la pantalla se ve con el scroll)
        if (r.bottom > 0 && r.top < innerHeight) cortados.push(`"${el.textContent.trim().replace(/\s+/g, " ").slice(0, 50)}"`);
        break;
      }
    }
  }
  return { deCostado: document.documentElement.scrollWidth > ancho + 1, cortados };
}

(async () => {
  const browser = await chromium.launch({ args: GL });
  let fallas = 0;
  for (const c of casos) {
    const context = await browser.newContext(c.contexto);
    const page = await context.newPage();
    await page.goto(url + (c.query ?? ""), { waitUntil: "load" });
    await page.waitForTimeout(3000);
    if (c.css) await page.addStyleTag({ content: c.css });
    await page.waitForTimeout(300);
    if (out) await page.screenshot({ path: path.join(out, `${c.nombre.replace(/[^\w]+/g, "-")}.png`) });
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    let deCostado = false;
    const cortados = new Set();
    for (let y = 0; y < alto; y += 400) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(120);
      const r = await page.evaluate(revisar);
      deCostado ||= r.deCostado;
      r.cortados.forEach((t) => cortados.add(t));
    }
    const lectura = await page.evaluate(() => document.querySelector("main")?.dataset.reading === "true");
    const n = (deCostado ? 1 : 0) + cortados.size;
    fallas += n;
    console.log(`${c.nombre}${lectura && !c.query ? " (pasó solo a lectura)" : ""}: ${n ? "" : "bien"}${deCostado ? "la página se mueve de costado " : ""}${cortados.size ? `${cortados.size} textos cortados` : ""}`);
    [...cortados].slice(0, 6).forEach((t) => console.log("   cortado:", t));
    await context.close();
  }
  await browser.close();
  process.exitCode = fallas ? 1 : 0;
})();
