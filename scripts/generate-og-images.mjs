// Generates the social images (Open Graph, 1200 × 630) in public/og/.
// Run after adding or renaming a published course:  node scripts/generate-og-images.mjs
// A content test fails if a published course has no image.
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const font = (file) =>
  `data:font/woff2;base64,${readFileSync(`node_modules/geist/dist/fonts/geist-sans/${file}`).toString("base64")}`;
const mark = readFileSync("public/brand/monedo-logo-light-bg.svg", "utf8");

const images = [
  {
    file: "monedo",
    eyebrow: "Educación financiera · 14 a 18 años",
    title: "Aprende a manejar tu dinero",
    text: "Cursos cortos y gratuitos con ejemplos reales en euros y datos verificados en fuentes oficiales.",
  },
  {
    file: "curso-fundamentos-del-dinero",
    eyebrow: "Curso 1 · Tu dinero hoy",
    title: "Fundamentos del dinero",
    text: "Lo que cuesta de verdad lo que compras y cómo empezar a ahorrar.",
  },
  {
    file: "curso-tu-primer-sueldo",
    eyebrow: "Curso 2 · Trabajo e ingresos",
    title: "Tu primer sueldo",
    text: "Qué firmas, qué cobras y a dónde va lo que no te llega.",
  },
];

const html = (image) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face { font-family: Geist; src: url(${font("Geist-Regular.woff2")}); font-weight: 400; }
@font-face { font-family: Geist; src: url(${font("Geist-SemiBold.woff2")}); font-weight: 600; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; font-family: Geist; background: #fafafa; color: #09090b;
  display: flex; flex-direction: column; justify-content: space-between; padding: 72px 80px;
  border-top: 14px solid #046c4e; }
.logo svg { height: 56px; width: auto; display: block; }
.eyebrow { color: #046c4e; font-weight: 600; font-size: 28px; letter-spacing: 0.04em; text-transform: uppercase; }
h1 { font-weight: 600; font-size: 84px; line-height: 1.02; letter-spacing: -0.035em; margin-top: 18px; max-width: 980px; }
p { color: #52525b; font-size: 34px; line-height: 1.35; margin-top: 22px; max-width: 960px; }
</style></head><body>
<div class="logo">${mark}</div>
<div><div class="eyebrow">${image.eyebrow}</div><h1>${image.title}</h1><p>${image.text}</p></div>
</body></html>`;

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const image of images) {
  await page.setContent(html(image));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/og/${image.file}.png` });
  console.log(`public/og/${image.file}.png`);
}
await browser.close();
