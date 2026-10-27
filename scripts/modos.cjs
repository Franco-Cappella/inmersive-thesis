// Verificación de modos: estudios, lectura, presentación, reduced motion, sin WebGL y scroll inverso.
// Uso: node scripts/modos.cjs [url] [carpeta]   (mismo requisito que capturas.cjs: Playwright)
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const url = process.argv[2] || "http://localhost:4321";
const out = process.argv[3] || path.join(process.cwd(), "capturas");
fs.mkdirSync(out, { recursive: true });
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
const vp = { width: 1440, height: 900 };

async function heroTo(page, p) {
  await page.evaluate((p) => {
    const h = document.querySelector(".hero");
    window.scrollTo(0, Math.round((h.offsetHeight - innerHeight) * p));
  }, p);
  await page.waitForTimeout(1800);
}
const state = (page) =>
  page.evaluate(() => {
    const hero = document.querySelector(".hero");
    return {
      canvas: !!document.querySelector("canvas"),
      ficha: getComputedStyle(document.querySelector(".ficha")).opacity,
      flip: getComputedStyle(document.querySelector(".pyr-card")).getPropertyValue("--flip").trim(),
      figura: getComputedStyle(document.querySelector(".hero__figure")).opacity,
      mundo: hero.dataset.mundo,
      fase: hero.dataset.fase,
      activo: document.querySelector('[aria-current="step"] .progress__num')?.textContent,
      y: Math.round(scrollY),
    };
  });

(async () => {
  const log = (...a) => console.log(...a);
  let browser = await chromium.launch({ args: GL });

  for (const estudio of ["plano", "noche"]) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(`${url}/?estudio=${estudio}`, { waitUntil: "load" });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(out, `estudio-${estudio}-0.png`) });
    await heroTo(page, 0.8);
    await page.screenshot({ path: path.join(out, `estudio-${estudio}-ot.png`) });
    await page.evaluate(() => document.getElementById("costo").scrollIntoView());
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(out, `estudio-${estudio}-capitulo.png`) });
    log("estudio", estudio, JSON.stringify(await state(page)));
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(`${url}/?lectura`, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    log("lectura", JSON.stringify(await state(page)));
    await page.screenshot({ path: path.join(out, "lectura-top.png") });
    await page.evaluate(() => window.scrollTo(0, 1100));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(out, "lectura-tabla.png") });
    await page.keyboard.press("l");
    await page.waitForTimeout(3000);
    log("lectura → L", JSON.stringify(await state(page)));
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(`${url}/?presentacion`, { waitUntil: "load" });
    await page.waitForTimeout(4000);
    const seq = [];
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(2200);
      const s = await state(page);
      seq.push(`${s.activo}@${s.y}`);
    }
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(2200);
    const s = await state(page);
    seq.push(`← ${s.activo}@${s.y}`);
    log("presentación", seq.join(" | "));
    await page.screenshot({ path: path.join(out, "presentacion.png") });
    await page.close();
  }

  {
    const ctx = await browser.newContext({ viewport: vp, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(4000);
    for (const p of [0, 0.3, 0.8, 0.95]) {
      await heroTo(page, p);
      log("reduced", p, JSON.stringify(await state(page)));
      await page.screenshot({ path: path.join(out, `reduced-${String(p).replace(".", "_")}.png`) });
    }
    // Capítulo con escena: salta directo al estado final; al volver al hero, la escena se resetea.
    await page.evaluate(() => document.getElementById("escenario").scrollIntoView());
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(out, "reduced-escenario.png") });
    await heroTo(page, 0.8);
    await page.screenshot({ path: path.join(out, "reduced-vuelta-hero.png") });
    await ctx.close();
  }

  {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(4000);
    await heroTo(page, 0.8);
    const ida = await state(page);
    await heroTo(page, 0.2);
    const vuelta = await state(page);
    await page.mouse.move(700, 450);
    for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 900); // tirón rápido con la rueda (Lenis)
    await page.waitForTimeout(1500);
    for (let i = 0; i < 12; i++) await page.mouse.wheel(0, -900);
    await page.waitForTimeout(2500);
    const tiron = await state(page);
    log("scroll ida", JSON.stringify(ida));
    log("scroll vuelta", JSON.stringify(vuelta));
    log("tirón y vuelta", JSON.stringify(tiron));
    await page.close();
  }
  await browser.close();

  browser = await chromium.launch({ args: ["--disable-webgl", "--disable-3d-apis"] });
  {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    log("sin WebGL", JSON.stringify(await state(page)));
    await heroTo(page, 0.8);
    log("sin WebGL OT", JSON.stringify(await state(page)));
    await page.screenshot({ path: path.join(out, "sin-webgl-ot.png") });
    await page.close();
  }
  await browser.close();
  log("capturas en", out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
