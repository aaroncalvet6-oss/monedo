import { route } from "./paths";
import { expect, test } from "@playwright/test";
import { STORAGE_KEYS } from "../src/lib/storage-keys";

test("main navigation is Inicio, Cursos and Herramientas, with Perfil in the header", async ({
  page,
  isMobile,
}) => {
  await page.goto(route("/cursos"));
  const nav = page.getByRole("navigation", { name: "Principal" }).filter({ visible: true });
  await expect(nav.getByRole("link")).toHaveCount(3);
  for (const [label, path] of [
    ["Herramientas", "/herramientas"],
    ["Cursos", "/cursos"],
    ["Inicio", "/"],
  ] as const) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(route(path));
    await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
  }
  await page.getByRole("banner").getByRole("link", { name: "Perfil" }).click();
  await expect(page).toHaveURL(route("/perfil"));
  // Bottom nav only on mobile, header nav only on desktop.
  await expect(nav).toHaveCount(1);
  expect(isMobile).toBe(await page.locator("nav.fixed").isVisible());
});

test("the old /aprender page sends you to the home page", async ({ page }) => {
  await page.goto(route("/aprender"));
  await expect(page).toHaveURL(route("/"));
});

test("home shows paths, tools, how it works and a section for families", async ({ page }) => {
  await page.goto(route("/"));
  for (const heading of [
    "Rutas de aprendizaje",
    "Herramientas",
    "Cómo funciona",
    "Por qué puedes fiarte",
    "Para familias y centros educativos",
  ]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "Fundamentos del dinero" })).toBeVisible();
  // No progress yet: no «continue» card and the main button says «Empezar».
  await expect(page.getByText("Continúa donde lo dejaste")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Empezar" })).toBeVisible();
});

test("nothing half-done is shown: no «Pronto», upcoming courses only as a short list", async ({
  page,
}) => {
  await page.goto(route("/cursos"));
  await expect(page.getByText(/Pronto|Próximamente/)).toHaveCount(0);
  const upcoming = page.getByRole("region", { name: "Próximos cursos" });
  await expect(upcoming).toBeVisible();
  await expect(upcoming.getByRole("link")).toHaveCount(0);
  const response = await page.goto(route("/cursos/bancos-y-pagos"));
  expect(response?.status()).toBe(404);
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
  for (const path of ["/", "/cursos", "/herramientas", "/perfil", "/legal"]) {
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
