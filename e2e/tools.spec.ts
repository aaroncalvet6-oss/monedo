import { route } from "./paths";
import { expect, test, type Page } from "@playwright/test";

/** Intl and keepUnits use non-breaking spaces; match words, not spaces. */
const text = (page: Page, words: string) =>
  page.getByText(new RegExp(words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s")));

const noHorizontalScroll = async (page: Page) => {
  const [scroll, inner] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    innerWidth,
  ]);
  expect(scroll).toBeLessThanOrEqual(inner!);
};

test("the tools page lists the four tools", async ({ page }) => {
  await page.goto(route("/herramientas"));
  for (const name of [
    "¿Cuántas horas de trabajo cuesta?",
    "Presupuesto para adolescentes",
    "Meta de ahorro",
    "Interés compuesto",
  ]) {
    await expect(
      page.getByRole("link", { name: new RegExp(name.replace("?", "\\?")) }),
    ).toBeVisible();
  }
});

test("compound interest opens with an example, the warning and a chart", async ({ page }) => {
  await page.goto(route("/herramientas/interes-compuesto"));
  await expect(page.getByText("Ejemplo para aprender")).toBeVisible();
  await expect(
    page.getByText("Las rentabilidades no están garantizadas y las inversiones pueden bajar."),
  ).toBeVisible();
  await expect(text(page, "Si pones 1.540 € en 10 años y crece un 4 % al año")).toBeVisible();
  await expect(page.locator(".recharts-area").first()).toBeVisible();
  await page.getByLabel("Aportación cada mes").fill("0");
  await expect(text(page, "Si pones 100 € en 10 años")).toBeVisible();
  await noHorizontalScroll(page);
});

test("budget opens with Hugo's example and warns when spending is more than income", async ({
  page,
}) => {
  await page.goto(route("/herramientas/presupuesto"));
  await expect(text(page, "De tus 60 € al mes, 20 € van a lo que pagas tú")).toBeVisible();
  await page.getByLabel("Gastos que pagas tú al mes").fill("75");
  await expect(page.getByText("Tus gastos superan tus ingresos")).toBeVisible();
  await expect(text(page, "te faltan 15 € al mes")).toBeVisible();
  await noHorizontalScroll(page);
});

test("savings goal answers both questions", async ({ page }) => {
  await page.goto(route("/herramientas/meta-de-ahorro"));
  await expect(
    text(page, "Apartando 8 € al mes, conseguirás unos cascos en 8 meses, en"),
  ).toBeVisible();
  await page.getByRole("tab", { name: "¿Cuánto al mes?" }).click();
  await expect(
    text(page, "Para conseguir unos cascos en 8 meses, aparta 8 € al mes."),
  ).toBeVisible();
  await noHorizontalScroll(page);
});

test("each tool links to its lesson, and the lesson links back", async ({ page }) => {
  for (const [tool, lesson, title] of [
    ["meta-de-ahorro", "pagate-primero", "Una meta con nombre y cifra"],
    ["presupuesto", "tu-primer-presupuesto", "Tu paga en tres partes"],
    ["interes-compuesto", "inflacion", "El mismo efecto, a tu favor"],
  ] as const) {
    await page.goto(route(`/herramientas/${tool}`));
    await page.getByRole("link", { name: /Se explica en la lección/ }).click();
    await expect(page).toHaveURL(new RegExp(`/cursos/fundamentos-del-dinero/${lesson}/`));
    // Walk the lesson until the section that links to the tool.
    const heading = page.locator("#lesson-step-title");
    for (let i = 0; i < 12; i += 1) {
      const current = (await heading.textContent()) ?? "";
      if (current === title) break;
      await page.getByRole("button", { name: "Continuar" }).click();
      await expect(heading).not.toHaveText(current);
    }
    await page.getByRole("link", { name: /Practica con la herramienta/ }).click();
    await expect(page).toHaveURL(new RegExp(`/herramientas/${tool}/`));
  }
});
