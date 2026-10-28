// Revisión de accesibilidad con axe-core sobre el build servido (WCAG 2.2 A y AA).
// Revisa la página entera en escritorio, en celular, en modo lectura y en los otros dos estudios, y recorre con Tab los
// primeros elementos enfocables para confirmar que el foco se ve y sigue un orden lógico.
// También confirma que, en cualquier punto del scroll, ningún texto del contenido queda con visibility: hidden
// (salvo dentro de aria-hidden): eso lo saca del árbol de accesibilidad y del orden de Tab, y un lector de
// pantalla que lee desde arriba no lo encuentra. Las animaciones de entrada del texto van solo con opacidad.
// Uso: node scripts/a11y.cjs [url]   (requiere Playwright y el build servido: npx serve out -l 4321)
// Sale con código 1 si axe encuentra violaciones o si algún texto del contenido queda fuera del árbol.
const { chromium } = require("playwright");

const url = process.argv[2] || "http://localhost:4321";
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
const AXE = require.resolve("axe-core/axe.min.js");
const vistas = [
  { nombre: "escritorio", viewport: { width: 1440, height: 900 }, query: "" },
  { nombre: "celular", viewport: { width: 390, height: 844 }, query: "" },
  { nombre: "lectura", viewport: { width: 1440, height: 900 }, query: "?lectura" },
  { nombre: "estudio plano", viewport: { width: 1440, height: 900 }, query: "?estudio=plano" },
  { nombre: "estudio noche", viewport: { width: 1440, height: 900 }, query: "?estudio=noche" },
];

// Textos del contenido fuera del árbol de accesibilidad: con visibility: hidden y sin un aria-hidden que los marque
// como decorativos a propósito.
const ocultos = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter((el) => !el.closest('[aria-hidden="true"]') && getComputedStyle(el).visibility === "hidden")
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      .map((el) => el.textContent.trim().replace(/\s+/g, " ").slice(0, 60)),
  );

(async () => {
  const browser = await chromium.launch({ args: GL });
  let total = 0;
  for (const v of vistas) {
    const page = await browser.newPage({ viewport: v.viewport });
    await page.goto(url + v.query, { waitUntil: "load" });
    await page.waitForTimeout(3500);
    // Recorrer la página para que se apliquen las animaciones de entrada (si no, axe mide texto a medio aparecer).
    // En cada punto del recorrido, el texto del contenido tiene que seguir en el árbol de accesibilidad.
    const fuera = new Set(await ocultos(page));
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 700) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(80);
      (await ocultos(page)).forEach((t) => fuera.add(t));
    }
    if (fuera.size) {
      total += fuera.size;
      console.log(`${v.nombre}: ${fuera.size} textos con visibility: hidden en algún punto del scroll`);
      [...fuera].slice(0, 8).forEach((t) => console.log(`  "${t}"`));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => {
      const res = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
      return res.violations.map((x) => ({ id: x.id, impacto: x.impact, ayuda: x.help, nodos: x.nodes.slice(0, 30).map((n) => `${n.target.join(" ")} ${n.any[0]?.data ? `(${n.any[0].data.contrastRatio}:1, ${n.any[0].data.fgColor} sobre ${n.any[0].data.bgColor})` : ""}`) }));
    });
    total += r.length;
    console.log(`${v.nombre}: ${r.length ? `${r.length} violaciones` : "sin violaciones"}`);
    r.forEach((x) => console.log(`  [${x.impacto}] ${x.id}: ${x.ayuda}\n    ${x.nodos.join("\n    ")}`));

    if (v.nombre === "escritorio") {
      // Teclado: los primeros 12 Tab. Cada elemento enfocado tiene que tener un contorno visible.
      await page.evaluate(() => window.scrollTo(0, 0));
      const foco = [];
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press("Tab");
        foco.push(
          await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return "(body)";
            const cs = getComputedStyle(el);
            const visible = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
            // Nombre aproximado: aria-label o el texto sin lo que está oculto para el lector de pantalla.
            const copia = el.cloneNode(true);
            copia.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
            const nombre = (el.getAttribute("aria-label") || copia.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28);
            return `${el.tagName.toLowerCase()} "${nombre}"${visible ? "" : " (SIN CONTORNO)"}`;
          }),
        );
      }
      console.log("  Tab:", foco.join(" → "));
    }
    await page.close();
  }
  await browser.close();
  process.exitCode = total ? 1 : 0;
})();
