import { route } from "./paths";
import { expect, test, type Page } from "@playwright/test";
import { getLesson } from "../src/content";

const COURSE = route("/cursos/fundamentos-del-dinero");
const LESSON = route("/cursos/fundamentos-del-dinero/el-dinero-es-tiempo");
const lesson = getLesson("fundamentos-del-dinero", "el-dinero-es-tiempo")!;
const questions = lesson.blocks.flatMap((b) => (b.type === "quiz" ? b.questions : []));

const log = (page: Page) => page.getByRole("log", { name: "Conversación" });
const ready = (page: Page) => page.locator('[data-testid="tutor-continue"]:enabled');
const choices = (page: Page) => page.getByRole("group", { name: /^Elige/ });
const lastExpression = (page: Page) => log(page).locator("svg[data-expression]").last();

/** Nothing may cover the action bar, and the newest message must sit above it. */
async function expectLayoutOnMobile(page: Page) {
  const viewport = page.viewportSize()!;
  const width = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(width[0], "no horizontal scroll").toBeLessThanOrEqual(width[1]!);
  const bar = page.locator("div.sticky.bottom-0");
  const box = (await bar.boundingBox())!;
  expect(box.y + box.height, "action bar inside the viewport").toBeLessThanOrEqual(
    viewport.height + 1,
  );
  const onTop = await page.evaluate(
    ([x, y]) => Boolean(document.elementFromPoint(x!, y!)?.closest("div.sticky.bottom-0")),
    [box.x + 8, box.y + box.height / 2],
  );
  expect(onTop, "nothing covers the action bar").toBe(true);
  await expect
    .poll(
      async () => {
        const last = await log(page).locator(":scope > div").last().boundingBox();
        return last ? Math.round(last.y + last.height) : 0;
      },
      { message: "newest message is not hidden behind the action bar" },
    )
    .toBeLessThanOrEqual(Math.round(box.y) + 1);
}

/** Talks through the whole lesson, answering every question correctly. */
async function completeLesson(page: Page, isMobile: boolean) {
  for (let guard = 0; guard < 60; guard += 1) {
    if (await page.getByText("Has terminado «El dinero es tiempo»").isVisible()) return;
    await expect(ready(page).or(choices(page))).toBeVisible();
    if (isMobile) await expectLayoutOnMobile(page);

    if (await choices(page).isVisible()) {
      const group = choices(page);
      const question = await findQuestion(page);
      if (question) {
        const correct = question.options.find((o) => o.id === question.correctOptionId)!;
        await group.getByRole("button", { name: correct.text, exact: true }).click();
        await expect(lastExpression(page)).toHaveAttribute("data-expression", "celebrating");
      } else {
        await group.getByRole("button", { name: "Lo pienso y decido no comprarlo" }).click();
        await expect(log(page).getByText("Lo pienso y decido no comprarlo")).toBeVisible();
      }
      continue;
    }
    await ready(page).click();
  }
  throw new Error("Lesson did not finish");
}

async function findQuestion(page: Page) {
  for (const question of questions) {
    const first = question.options[0]!.text;
    if (await choices(page).getByRole("button", { name: first, exact: true }).count()) {
      return question;
    }
  }
  return undefined;
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

test("lesson 1.1 is a conversation with Monedo, start to finish", async ({ page, isMobile }) => {
  test.setTimeout(120_000);
  await page.goto(COURSE);
  await page.getByRole("link", { name: "Empezar el curso" }).click();
  await expect(page).toHaveURL(LESSON);
  await expect(page.getByText("Monedo, tu guía", { exact: true })).toBeVisible();
  await expect(log(page).getByText("Hola, soy Monedo, tu guía en este curso.")).toBeVisible();
  await expect(page.getByText(/\bIA\b/)).toHaveCount(0);

  await completeLesson(page, isMobile);
  await expect(page.getByText("Lección completada").first()).toBeVisible();
  await expect(page.getByText("4/4")).toBeVisible();

  await page.getByRole("link", { name: "Volver al curso" }).click();
  await expect(page).toHaveURL(COURSE);
  await expect(page.getByText("1/6 lecciones")).toBeVisible();
});

test("Monedo says «uy» and gives the right answer after a mistake", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(LESSON);
  const firstQuestion = choices(page).getByRole("button", { name: "5 horas", exact: true });
  for (let guard = 0; guard < 30; guard += 1) {
    await expect(ready(page).or(choices(page))).toBeVisible();
    if (await firstQuestion.isVisible()) break;
    if (await choices(page).isVisible()) await choices(page).getByRole("button").first().click();
    else await ready(page).click();
  }
  await choices(page).getByRole("button", { name: "5 horas", exact: true }).click();
  await expect(lastExpression(page)).toHaveAttribute("data-expression", "oops");
  await expect(log(page).getByText("Uy, esa no era. Le pasa a cualquiera.")).toBeVisible();
  await expect(log(page).getByText("La respuesta correcta es «7 horas».")).toBeVisible();
  await expect(ready(page)).toHaveText(/Siguiente pregunta/);
});

test("resumes the conversation after a reload", async ({ page }) => {
  await page.goto(LESSON);
  for (const reply of ["Vamos allá", "¿Y cómo se calcula?", "Vale. ¿Un ejemplo?"]) {
    await expect(ready(page)).toHaveText(reply);
    await ready(page).click();
    await expect(log(page).getByText(reply, { exact: true })).toBeVisible();
  }
  await expect(log(page).getByText(/Te presento a Lucía/)).toBeVisible();
  await page.reload();
  await expect(page.getByText("Retomamos donde lo dejaste.")).toBeVisible();
  // Earlier messages are still there, and Monedo picks up at Lucía's example.
  await expect(log(page).getByText("Hola, soy Monedo, tu guía en este curso.")).toBeAttached();
  await expect(log(page).getByText(/Te presento a Lucía/)).toBeVisible();
  await expect(ready(page)).toHaveText("Uf. Dos sábados.");

  await page.getByRole("button", { name: "Ver desde el principio" }).click();
  await expect(log(page).getByText("Hola, soy Monedo, tu guía en este curso.")).toBeInViewport();
});

test("keyboard: → continues and focus follows the conversation", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation is a desktop concern");
  await page.goto(LESSON);
  await expect(ready(page)).toHaveText("Vamos allá");
  await page.keyboard.press("ArrowRight");
  await expect(log(page).getByText("Vamos allá", { exact: true })).toBeVisible();
  await expect(ready(page)).toHaveText("¿Y cómo se calcula?");
  await expect(ready(page)).toBeFocused();
});

test("with reduced motion, Monedo stays still and messages appear at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(LESSON);
  await expect(ready(page)).toBeVisible({ timeout: 2_000 });
  await expect(log(page).getByText(/Hoy vas a mirar los precios/)).toBeVisible();
});

test("unknown lessons are 404", async ({ page }) => {
  const response = await page.goto(route("/cursos/fundamentos-del-dinero/no-existe"));
  expect(response?.status()).toBe(404);
});
