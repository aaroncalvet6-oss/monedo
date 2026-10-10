import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MonedoCharacter } from "./monedo-character";
import { MONEDO_EXPRESSIONS } from "./monedo-expressions";

describe("MonedoCharacter", () => {
  it("is decorative unless it gets a label", () => {
    const { container, rerender } = render(<MonedoCharacter />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<MonedoCharacter label="Monedo, tu guía" />);
    expect(container.querySelector("svg")?.getAttribute("role")).toBe("img");
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Monedo, tu guía");
  });

  it("draws a different face for each expression", () => {
    const faces = MONEDO_EXPRESSIONS.map((expression) => {
      const { container, unmount } = render(<MonedoCharacter expression={expression} />);
      expect(container.querySelector("svg")?.getAttribute("data-expression")).toBe(expression);
      const face = container.innerHTML.replace(/style="[^"]*"/g, "");
      unmount();
      return face;
    });
    expect(new Set(faces).size).toBe(MONEDO_EXPRESSIONS.length);
  });

  it("uses only brand tokens, never hard-coded colours", () => {
    const { container } = render(<MonedoCharacter expression="celebrating" />);
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(/i);
  });
});
