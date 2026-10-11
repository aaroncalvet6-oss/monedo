// Captures key pages in mobile/desktop × light/dark into docs/screenshots/.
// Usage: npm run build && npm run preview, then `npm run screenshots`.
// Env: BASE_URL (default http://localhost:3100/monedo), PLAYWRIGHT_CHROMIUM_PATH (optional).
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3100/monedo";
const outDir = fileURLToPath(new URL("../docs/screenshots/", import.meta.url));
const pages = [
  ["home", "/"],
  ["course", "/cursos/fundamentos-del-dinero/"],
  ["lesson", "/cursos/fundamentos-del-dinero/el-dinero-es-tiempo/"],
];
const viewports = [
  ["mobile", { width: 390, height: 844 }, 2],
  ["desktop", { width: 1440, height: 900 }, 1],
];
const schemes = ["light", "dark"];

await mkdir(outDir, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const errors = [];

for (const [name, path] of pages) {
  for (const [device, viewport, deviceScaleFactor] of viewports) {
    for (const colorScheme of schemes) {
      const page = await browser.newPage({ viewport, deviceScaleFactor, colorScheme });
      page.on("console", (m) => m.type() === "error" && errors.push(`${path}: ${m.text()}`));
      page.on("pageerror", (e) => errors.push(`${path}: ${e.message}`));
      await page.goto(baseUrl + path, { waitUntil: "networkidle" });
      // Full-page shots: park the fixed mobile tab bar at the end of the page instead of
      // leaving it floating halfway down the image.
      await page.addStyleTag({
        content: "body{position:relative} nav.fixed{position:absolute!important}",
      });
      await page.waitForTimeout(2500); // let entrance animations and Monedo's first bubbles settle
      const file = `${name}-${device}-${colorScheme}.png`;
      await page.screenshot({ path: outDir + file, fullPage: true });
      console.log("saved", file);
      await page.close();
    }
  }
}

await browser.close();
if (errors.length) {
  console.error("Console errors:\n" + errors.join("\n"));
  process.exit(1);
}
