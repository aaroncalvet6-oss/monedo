import { route } from "./paths";
import { expect, test, type Page } from "@playwright/test";
import { getLesson } from "../src/content";
import { keepUnits as nb } from "../src/lib/format";

const COURSE = route("/cursos/fundamentos-del-dinero");
const LESSON = route("/cursos/fundamentos-del-dinero/el-dinero-es-tiempo");
const lesson = getLesson("fundamentos-del-dinero", "el-dinero-es-tiempo")!;
const questions = lesson.blocks.flatMap((b) => (b.type === "quiz" ? b.questions : []));

const primary = (page: Page) =>
  page.getByRole("button", { name: /^(Continuar|Comprobar|Terminar lección)$/ });
const title = (page: Page) => page.locator("#lesson-step-title");

/** Walks the whole lesson answering every question correctly. */
async function completeLesson(page: Page, isMobile: boolean) {
  for (let guard = 0; guard < 40; guard += 1) {
    if (await page.getByText("Has terminado «El dinero es tiempo»").isVisible()) return;

    if (isMobile) {
      const width = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      expect(width[0], "no horizontal scroll").toBeLessThanOrEqual(width[1]!);
      const bar = await primary(page).boundingBox();
      const viewport = page.viewportSize()!;
      expect(bar!.y + bar!.height, "action bar inside the viewport").toBeLessThanOrEqual(
        viewport.height,
      );
      expect(bar!.height).toBeGreaterThanOrEqual(44);
    }

    const heading = (await title(page).textContent()) ?? "";
    const question = questions.find((q) => nb(q.prompt) === heading);
    if (question) {
      const correct = question.options.find((o) => o.id === question.correctOptionId)!;
      await expect(page.getByRole("button", { name: "Comprobar" })).toBeDisabled();
      await page.getByRole("radio", { name: nb(correct.text), exact: true }).click();
      await page.getByRole("button", { name: "Comprobar" }).click();
      await expect(page.getByText("Correcto", { exact: true })).toBeVisible();
    } else if (heading === "¿Lo compras ya?") {
      await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();
      await page.getByRole("radio", { name: "Lo pienso y decido no comprarlo" }).click();
      await expect(page.getByText("Qué pasa")).toBeVisible();
    }
    await primary(page).click();
    await expect(title(page)).not.toHaveText(heading);
  }
  throw new Error("Lesson did not finish");
}

test.beforeEach(async ({ page }) => {
  await page.goto(route("/"));
  // Remove only Monedo's keys: the origin may be shared with other sites.
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("monedo:")) localStorage.removeItem(key);
    }
  });
});

test("start course 1, complete lesson 1.1 and see the progress", async ({ page, isMobile }) => {
  test.setTimeout(90_000);
  await page.goto(COURSE);
  await page.getByRole("link", { name: "Empezar el curso" }).click();
  await expect(page).toHaveURL(LESSON);
  await expect(title(page)).toHaveText("Al terminar sabrás…");
  // A training format, not a character: no mascot, no speech bubbles.
  await expect(page.getByText("Monedo, tu guía")).toHaveCount(0);
  await expect(page.locator("svg[data-expression]")).toHaveCount(0);

  await completeLesson(page, isMobile);
  await expect(page.getByText("Lección completada").first()).toBeVisible();
  await expect(page.getByText("4/4")).toBeVisible();

  await expect(page.getByRole("link", { name: "Siguiente: Inflación" })).toBeVisible();
  await page.goto(COURSE);
  await expect(page.getByText("1/6 lecciones")).toBeVisible();
  // Home now offers to continue with the next lesson.
  await page.goto(route("/"));
  await expect(page.getByText("Continúa donde lo dejaste")).toBeVisible();
  await expect(page.getByText("Inflación", { exact: true })).toBeVisible();
});

test("resumes at the last step after a reload", async ({ page }) => {
  await page.goto(LESSON);
  await expect(title(page)).toHaveText("Al terminar sabrás…");
  for (const next of [
    "El precio real no está en la etiqueta",
    "Primero, tu precio por hora",
    "Las zapatillas de Lucía",
  ]) {
    await primary(page).click();
    await expect(title(page)).toHaveText(next);
  }
  await page.reload();
  await expect(title(page)).toHaveText("Las zapatillas de Lucía");
  await expect(page.getByText("Retomamos donde lo dejaste.")).toBeVisible();

  await page.getByRole("button", { name: "Empezar desde el principio" }).click();
  await expect(title(page)).toHaveText("Al terminar sabrás…");
});

test("keyboard navigation with arrows, gated on questions", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation is a desktop concern");
  await page.goto(LESSON);
  await expect(title(page)).toHaveText("Al terminar sabrás…");
  await page.keyboard.press("ArrowRight");
  await expect(title(page)).toHaveText("El precio real no está en la etiqueta");
  // Focus moves to the new step title for screen readers.
  await expect(title(page)).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(title(page)).toHaveText("Al terminar sabrás…");

  // Jump to the first question from the syllabus is not allowed before reaching it.
  const firstQuestion = page.getByRole("button", { name: "Pregunta 1", exact: true });
  await expect(firstQuestion).toBeDisabled();
});

test("a wrong answer shows the right one and the explanation", async ({ page }) => {
  await page.goto(LESSON);
  await expect(title(page)).toHaveText("Al terminar sabrás…");
  for (let guard = 0; guard < 20; guard += 1) {
    const heading = (await title(page).textContent()) ?? "";
    if (heading.startsWith(nb("Cobras 9 €"))) break;
    if (heading === "¿Lo compras ya?") {
      await page.getByRole("radio", { name: "Lo pienso y decido no comprarlo" }).click();
    }
    await primary(page).click();
    await expect(title(page)).not.toHaveText(heading);
  }
  await page.getByRole("radio", { name: nb("5 horas"), exact: true }).click();
  await page.getByRole("button", { name: "Comprobar" }).click();
  await expect(page.getByText(nb("No es correcto. La respuesta es «7 horas»."))).toBeVisible();
  await expect(
    page.getByText(nb("63 € entre 9 € por hora son 7 horas"), { exact: false }),
  ).toBeVisible();
});

test("every lesson of course 1 opens", async ({ page }) => {
  for (const slug of [
    "el-dinero-es-tiempo",
    "inflacion",
    "necesidad-o-capricho",
    "pagate-primero",
    "tu-primer-presupuesto",
    "trampas-de-consumo",
  ]) {
    await page.goto(route(`/cursos/fundamentos-del-dinero/${slug}`));
    await expect(title(page)).toHaveText("Al terminar sabrás…");
  }
});

test("every lesson of course 2 opens", async ({ page }) => {
  for (const slug of [
    "tipos-de-contrato",
    "bruto-y-neto",
    "leer-una-nomina",
    "irpf-y-seguridad-social",
    "primera-declaracion-de-la-renta",
  ]) {
    await page.goto(route(`/cursos/tu-primer-sueldo/${slug}`));
    await expect(title(page)).toHaveText("Al terminar sabrás…");
  }
});

test("unknown lessons are 404", async ({ page }) => {
  const response = await page.goto(route("/cursos/fundamentos-del-dinero/no-existe"));
  expect(response?.status()).toBe(404);
});
