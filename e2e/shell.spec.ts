import { route } from "./paths";
import { expect, test } from "@playwright/test";
import { STORAGE_KEYS } from "../src/lib/storage-keys";

test("main navigation reaches every section", async ({ page, isMobile }) => {
  await page.goto(route("/"));
  const nav = page.getByRole("navigation", { name: "Principal" }).filter({ visible: true });
  for (const [label, path] of [
    ["Cursos", "/cursos"],
    ["Herramientas", "/herramientas"],
    ["Perfil", "/perfil"],
    ["Aprender", "/aprender"],
  ] as const) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(route(path));
    await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
  }
  // Bottom nav only on mobile, header nav only on desktop.
  await expect(nav).toHaveCount(1);
  expect(isMobile).toBe(await page.locator("nav.fixed").isVisible());
});

test("theme choice persists across reloads without flashing", async ({ page }) => {
  await page.goto(route("/"));
  await page.getByRole("button", { name: "Cambiar tema" }).click();
  await page.getByRole("menuitemradio", { name: "Oscuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Cambiar tema" }).click();
  await page.getByRole("menuitemradio", { name: "Sistema" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
});

test("skip link is the first focusable element", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation is a desktop concern");
  await page.goto(route("/"));
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test("the internal design page is not published", async ({ page }) => {
  const response = await page.goto(route("/design"));
  expect(response?.status()).toBe(404);
});

test("public pages say nothing about how the site is built", async ({ page }) => {
  for (const path of ["/", "/aprender", "/cursos", "/herramientas", "/perfil", "/legal"]) {
    await page.goto(route(path));
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const word of ["sistema de diseño", "en construcción", "next.js", "tailwind", "fase "]) {
      expect(text, `${path} mentions "${word}"`).not.toContain(word);
    }
    await expect(page.locator('a[href*="/design"]')).toHaveCount(0);
  }
});

test("profile shows progress and can delete it", async ({ page }) => {
  await page.goto(route("/perfil"));
  await expect(page.getByRole("button", { name: "Borrar mi progreso" })).toBeDisabled();
  await page.evaluate((key) => {
    const now = new Date().toISOString();
    localStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        lessons: {
          "fundamentos-del-dinero/el-dinero-es-tiempo": {
            courseSlug: "fundamentos-del-dinero",
            lessonSlug: "el-dinero-es-tiempo",
            currentStepId: null,
            completedStepIds: [],
            answers: {},
            decisions: {},
            startedAt: now,
            updatedAt: now,
            completedAt: now,
          },
        },
        activityDays: [now.slice(0, 10)],
      }),
    );
  }, STORAGE_KEYS.progress);
  await page.reload();
  const completed = page.locator("dd").filter({ hasText: /^1$/ });
  await expect(completed.first()).toBeVisible();
  await page.getByRole("button", { name: "Borrar mi progreso" }).click();
  await page.getByRole("button", { name: "Borrar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Borrar mi progreso" })).toBeDisabled();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.progress)).toBeNull();
});
