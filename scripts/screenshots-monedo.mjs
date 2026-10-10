// Captures Monedo's five expressions in light and dark into docs/screenshots/monedo/.
// The character page only exists under `next dev`: run `npm run dev`, then
// `node scripts/screenshots-monedo.mjs`.
// Env: BASE_URL (default http://localhost:3000/monedo), PLAYWRIGHT_CHROMIUM_PATH (optional).
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000/monedo";
const outDir = fileURLToPath(new URL("../docs/screenshots/monedo/", import.meta.url));
const expressions = ["normal", "explaining", "thinking", "celebrating", "oops"];
const viewports = [
  ["desktop", { width: 1440, height: 900 }, 1],
  ["mobile", { width: 390, height: 844 }, 2],
];

await mkdir(outDir, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});

for (const colorScheme of ["light", "dark"]) {
  for (const [device, viewport, deviceScaleFactor] of viewports) {
    // Reduced motion keeps every frame still (no blink caught half-way).
    const page = await browser.newPage({
      viewport,
      deviceScaleFactor,
      colorScheme,
      reducedMotion: "reduce",
    });
    await page.goto(`${baseUrl}/design/monedo/`, { waitUntil: "networkidle" });
    // Hide the Next.js dev-tools badge.
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${outDir}monedo-${device}-${colorScheme}.png`, fullPage: true });
    console.log("saved", `monedo-${device}-${colorScheme}.png`);
    if (device === "desktop") {
      for (const expression of expressions) {
        const file = `${expression}-${colorScheme}.png`;
        await page.getByTestId(`monedo-${expression}`).screenshot({ path: outDir + file });
        console.log("saved", file);
      }
    }
    await page.close();
  }
}

await browser.close();
