import { describe, expect, it } from "vitest";
import { keepUnits } from "./chat-parts";

describe("keepUnits", () => {
  it("glues figures to their unit so they never wrap apart", () => {
    expect(keepUnits("unas zapatillas de 90 € son 11 h y 8 €/h")).toBe(
      "unas zapatillas de 90 € son 11 h y 8 €/h",
    );
    expect(keepUnits("En 7 minutos")).toBe("En 7 minutos");
  });
});
