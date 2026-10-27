// Verificación visual del build: capturas del hero y de los capítulos en escritorio y celular,
// errores de consola y estado del timeline del hero en varios puntos del scroll.
//
// Uso:  node scripts/capturas.cjs [url] [carpeta]
//       url por defecto http://localhost:4321 (npx serve out -l 4321)
// Requiere Playwright con Chromium (npm i -D playwright && npx playwright install chromium).
// WebGL por software: --use-angle=swiftshader (lento, pero sirve para validar encuadres).

const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const url = process.argv[2] || "http://localhost:4321";
const out = process.argv[3] || path.join(process.cwd(), "capturas");
fs.mkdirSync(out, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const HERO_POINTS = [0, 0.3, 0.5, 0.8]; // progreso dentro del hero

(async () => {
  const browser = await chromium.launch({
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const problems = [];
    page.on("console", (m) => {
      const t = m.text();
      if (m.type() === "error" || (m.type() === "warning" && !/THREE\.Clock|GPU stall/.test(t))) problems.push(`${m.type()}: ${t}`);
    });
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(5000); // el 3D tarda con WebGL por software

    const heroScroll = await page.evaluate(() => {
      const h = document.querySelector(".hero");
      return h ? h.offsetHeight - innerHeight : 0;
    });
    for (const p of HERO_POINTS) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroScroll * p));
      await page.waitForTimeout(1800);
      const state = await page.evaluate(() => ({
        ficha: getComputedStyle(document.querySelector(".ficha")).opacity,
        flip: getComputedStyle(document.querySelector(".pyr-card")).getPropertyValue("--flip"),
        activo: document.querySelector('[aria-current="step"]')?.querySelector(".progress__num")?.textContent,
      }));
      console.log(vp.name, `hero ${p}`, JSON.stringify(state));
      await page.screenshot({ path: path.join(out, `${vp.name}-hero-${String(p).replace(".", "_")}.png`) });
    }

    const ids = await page.evaluate(() => [...document.querySelectorAll("[data-chapter]")].map((s) => s.id));
    for (const id of ids) {
      await page.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(out, `${vp.name}-${id}.png`) });
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(vp.name, "scroll horizontal:", overflow > 0 ? `${overflow}px (MAL)` : "no");
    console.log(vp.name, "consola:", problems.length ? problems.join("\n  ") : "limpia");
    await page.close();
  }
  await browser.close();
  console.log("capturas en", out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
