import { describe, expect, it } from "vitest";
import { isActivePath, mainNav } from "./nav-items";

describe("isActivePath", () => {
  it("matches the exact path and nested paths", () => {
    expect(isActivePath("/cursos", "/cursos")).toBe(true);
    expect(isActivePath("/cursos/", "/cursos")).toBe(true);
    expect(isActivePath("/cursos/fundamentos-del-dinero", "/cursos")).toBe(true);
  });
  it("does not match siblings that share a prefix", () => {
    expect(isActivePath("/cursosx", "/cursos")).toBe(false);
  });
  it("only marks Inicio on the home page", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/cursos", "/")).toBe(false);
  });
});

describe("mainNav", () => {
  it("is minimal: Inicio, Cursos and Herramientas", () => {
    expect(mainNav.map((i) => i.label)).toEqual(["Inicio", "Cursos", "Herramientas"]);
  });
});
