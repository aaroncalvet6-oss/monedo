import { readFileSync } from "node:fs";
import { route } from "./paths";
import { expect, test, type Page } from "@playwright/test";
import { getAssessment } from "../src/content";
import { keepUnits as nb } from "../src/lib/format";

const bank = getAssessment("fundamentos-del-dinero")!;
const title = (page: Page) => page.locator("#assessment-title");

test.beforeEach(async ({ page }) => {
  await page.goto(route("/"));
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("monedo:")) localStorage.removeItem(key);
    }
  });
});

/** Answers every question right (or wrong) and finishes. */
async function takeAssessment(page: Page, right: boolean) {
  await page.goto(route("/cursos/fundamentos-del-dinero/evaluacion"));
  await page.getByRole("button", { name: "Empezar la evaluación" }).click();
  for (let i = 0; i < bank.questionsPerAttempt; i += 1) {
    await expect(page.getByText(`Pregunta ${i + 1} de 10`)).toBeVisible();
    const prompt = (await title(page).textContent()) ?? "";
    const question = bank.questions.find((q) => nb(q.prompt) === prompt)!;
    const option = question.options.find((o) =>
      right ? o.id === question.correctOptionId : o.id !== question.correctOptionId,
    )!;
    await expect(page.getByRole("button", { name: /Siguiente|Terminar/ })).toBeDisabled();
    await page.getByRole("radio", { name: nb(option.text), exact: true }).click();
    await page.getByRole("button", { name: /Siguiente|Terminar evaluación/ }).click();
  }
}

test("a passed assessment unlocks the certificate, which downloads as image and PDF", async ({
  page,
}) => {
  await page.goto(route("/cursos/fundamentos-del-dinero/certificado"));
  await expect(page.getByRole("link", { name: "Ir a la evaluación final" })).toBeVisible();

  await takeAssessment(page, true);
  await expect(page.getByRole("heading", { name: "Has aprobado la evaluación" })).toBeVisible();
  await expect(page.getByText("Has acertado todas las preguntas.")).toBeVisible();
  await page.getByRole("link", { name: "Ver tu certificado" }).click();

  await expect(page.getByRole("heading", { name: "Certificado de finalización" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Descargar imagen" })).toBeDisabled();
  await page.getByLabel("Tu nombre, tal y como quieres que aparezca").fill("Lucía García");
  await expect(page.getByRole("img", { name: /Lucía García/ })).toBeVisible();

  const [png] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Descargar imagen" }).click(),
  ]);
  expect(png.suggestedFilename()).toBe("certificado-monedo-fundamentos-del-dinero.png");
  const [pdf] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Descargar PDF" }).click(),
  ]);
  expect(pdf.suggestedFilename()).toBe("certificado-monedo-fundamentos-del-dinero.pdf");
  expect(
    readFileSync((await pdf.path())!)
      .subarray(0, 8)
      .toString("latin1"),
  ).toBe("%PDF-1.4");

  // The name stays only in this browser, under Monedo's own key.
  expect(await page.evaluate(() => localStorage.getItem("monedo:certificate-name"))).toBe(
    "Lucía García",
  );
  await page.reload();
  await expect(page.getByLabel("Tu nombre, tal y como quieres que aparezca")).toHaveValue(
    "Lucía García",
  );

  await page.goto(route("/perfil"));
  await expect(page.getByRole("link", { name: /Fundamentos del dinero/ })).toBeVisible();
});

test("a failed assessment explains every mistake and can be repeated", async ({ page }) => {
  await takeAssessment(page, false);
  await expect(page.getByRole("heading", { name: "Esta vez no has aprobado" })).toBeVisible();
  const mistakes = page.getByRole("heading", { name: "Tus fallos, explicados" });
  await expect(mistakes).toBeVisible();
  await expect(page.getByRole("link", { name: /^Repasa «/ })).toHaveCount(10);
  await expect(page.getByRole("link", { name: "Ver tu certificado" })).toHaveCount(0);
  await page.getByRole("button", { name: "Repetir con otras preguntas" }).click();
  await expect(page.getByText("Pregunta 1 de 10")).toBeVisible();
});
