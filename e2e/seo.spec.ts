import { route } from "./paths";
import { expect, test } from "@playwright/test";

test("every public page has a description, a canonical URL and an Open Graph image", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/cursos",
    "/cursos/fundamentos-del-dinero",
    "/cursos/fundamentos-del-dinero/el-dinero-es-tiempo",
    "/cursos/tu-primer-sueldo/evaluacion",
    "/herramientas/meta-de-ahorro",
    "/fuentes",
    "/legal",
  ]) {
    await page.goto(route(path));
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, path).toBe(`https://aaroncalvet6-oss.github.io${route(path)}`);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image, path).toMatch(/\/monedo\/og\/.+\.png$/);
    const local = image!.replace("https://aaroncalvet6-oss.github.io", "");
    expect((await page.request.get(local)).status(), local).toBe(200);
  }
});

test("course pages describe themselves as a schema.org Course", async ({ page }) => {
  await page.goto(route("/cursos/tu-primer-sueldo"));
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(json!);
  expect(data).toMatchObject({
    "@type": "Course",
    name: "Tu primer sueldo",
    provider: { name: "Monedo" },
    isAccessibleForFree: true,
  });
});

test("the sitemap lists public pages only", async ({ request }) => {
  const xml = await (await request.get(route("/sitemap.xml").replace(/\/$/, ""))).text();
  expect(xml).toContain("<loc>https://aaroncalvet6-oss.github.io/monedo/fuentes/</loc>");
  expect(xml).toContain("/cursos/tu-primer-sueldo/leer-una-nomina/</loc>");
  expect(xml).not.toContain("/perfil/");
  expect(xml).not.toContain("/certificado/");
});

test("personal pages are kept out of search engines", async ({ page }) => {
  for (const path of ["/perfil", "/cursos/fundamentos-del-dinero/certificado"]) {
    await page.goto(route(path));
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});

test("Fuentes y metodología explains the method and lists the official sources by lesson", async ({
  page,
}) => {
  await page.goto(route("/"));
  await page.getByRole("link", { name: "Fuentes y metodología" }).first().click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Fuentes y metodología" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Nada sin verificar en las lecciones" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Boletín Oficial del Estado (BOE)" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Estatuto de los Trabajadores, artículo 14/ }),
  ).toHaveAttribute("href", /^https:\/\/www\.boe\.es\//);
});

test("the legal page covers privacy, hosting and educational use, with no personal data", async ({
  page,
}) => {
  await page.goto(route("/legal"));
  for (const heading of [
    "Educación, no asesoramiento",
    "Qué datos recogemos",
    "Qué se guarda en tu navegador",
    "Dónde se aloja Monedo",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
  await expect(page.getByText(/dirección IP/)).toBeVisible();
  const text = (await page.locator("main").textContent()) ?? "";
  expect(text).not.toMatch(/@|\+34|\b[679]\d{8}\b/);
});
