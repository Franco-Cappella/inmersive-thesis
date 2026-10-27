// PDF del sitio para el jurado: el modo lectura impreso con la hoja de estilos de impresión (A4).
// Uso: node scripts/pdf.cjs [url] [archivo.pdf]   (requiere Playwright y el build servido: npx serve out -l 4321)
const { chromium } = require("playwright");
const path = require("node:path");

const url = process.argv[2] || "http://localhost:4321";
const destino = process.argv[3] || path.join(process.cwd(), "tesina-sitio.pdf");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto(`${url}/?lectura`, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  // Recorrer la página para que se apliquen las animaciones de entrada (si no, quedan textos a medio aparecer).
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += 600) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: destino, format: "A4", printBackground: false, margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" } });
  await browser.close();
  console.log("PDF en", destino);
})();
