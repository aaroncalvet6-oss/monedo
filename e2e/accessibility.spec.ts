import { route } from "./paths";
import { expect, test, type Page } from "@playwright/test";

const INTERACTIVE =
  'a[href], button, input, select, textarea, [role="radio"], [role="slider"], [role="tab"], [role="menuitemradio"], [role="menuitem"]';

/** Effective hit area: the element box, or its ::after when the touch-hit utility extends it. */
async function smallTargets(page: Page) {
  return page.$$eval(INTERACTIVE, (elements) =>
    elements.flatMap((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (rect.width === 0 || rect.height === 0 || style.visibility === "hidden") return [];
      if (el.closest("[aria-hidden='true'], [inert]")) return [];
      const after = getComputedStyle(el, "::after");
      let width = Math.max(rect.width, parseFloat(after.minWidth) || 0);
      let height = Math.max(rect.height, parseFloat(after.minHeight) || 0);
      // Stretched links: an absolute ::after with inset 0 covers its containing block.
      const stretched =
        after.content !== "none" &&
        after.position === "absolute" &&
        [after.top, after.right, after.bottom, after.left].every((v) => v === "0px");
      if (stretched) {
        const block = style.position !== "static" ? el : (el as HTMLElement).offsetParent;
        const box = block?.getBoundingClientRect();
        if (box) {
          width = Math.max(width, box.width);
          height = Math.max(height, box.height);
        }
      }
      if (width >= 43.5 && height >= 43.5) return [];
      const label = el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 40) ?? "";
      return [`${el.tagName.toLowerCase()} "${label}" ${Math.round(width)}×${Math.round(height)}`];
    }),
  );
}

test.describe("touch targets", () => {
  test.skip(({ isMobile }) => !isMobile, "touch targets are checked on mobile");

  for (const path of [
    "/",
    "/herramientas",
    "/herramientas/interes-compuesto",
    "/herramientas/presupuesto",
    "/herramientas/meta-de-ahorro",
    "/perfil",
    "/legal",
    "/cursos",
    "/cursos/fundamentos-del-dinero",
    "/cursos/fundamentos-del-dinero/el-dinero-es-tiempo",
    "/cursos/fundamentos-del-dinero/tu-primer-presupuesto",
  ]) {
    test(`every control on ${path} is at least 44×44`, async ({ page }) => {
      await page.goto(route(path));
      expect(await smallTargets(page)).toEqual([]);
    });
  }
});

test.describe("focus ring", () => {
  test.skip(({ isMobile }) => isMobile, "keyboard focus is checked on desktop");

  for (const [scheme, color] of [
    ["light", "rgb(4, 108, 78)"],
    ["dark", "rgb(60, 207, 152)"],
  ] as const) {
    test(`uses the brand colour in ${scheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(route("/"));
      const button = page.getByRole("link", { name: "Ver cursos", exact: true });
      await button.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(button).toBeFocused();
      const outline = await button.evaluate((el) => {
        const s = getComputedStyle(el);
        return { color: s.outlineColor, width: s.outlineWidth, style: s.outlineStyle };
      });
      expect(outline).toEqual({ color, width: "2px", style: "solid" });
    });
  }
});
