import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatEuro,
  formatMinutes,
  formatNumber,
  formatPercent,
  keepUnits,
} from "./format";

// Intl may use narrow no-break spaces; normalise for readable assertions.
const n = (s: string) => s.replace(/[  ]/g, " ");

describe("formatEuro", () => {
  it("uses Spanish separators and a trailing euro sign", () => {
    expect(n(formatEuro(1234.5))).toBe("1.234,50 €");
  });
  it("can drop decimals", () => {
    expect(n(formatEuro(1234.5, { decimals: false }))).toBe("1.235 €");
  });
  it("never renders negative zero", () => {
    expect(n(formatEuro(-0))).toBe("0,00 €");
  });
  it("formats negative amounts", () => {
    expect(n(formatEuro(-12))).toBe("-12,00 €");
  });
});

describe("formatNumber", () => {
  it("groups thousands even for four digits", () => {
    expect(n(formatNumber(1500))).toBe("1.500");
  });
});

describe("formatPercent", () => {
  it("formats a fraction as a percentage", () => {
    expect(n(formatPercent(0.035))).toBe("3,5 %");
  });
});

describe("formatMinutes", () => {
  it.each([
    [6, "6 min"],
    [60, "1 h"],
    [95, "1 h 35 min"],
  ])("%d → %s", (input, expected) => {
    expect(formatMinutes(input)).toBe(expected);
  });
});

describe("formatDate", () => {
  it("uses long Spanish dates", () => {
    expect(formatDate(new Date("2026-10-05T10:00:00Z"))).toBe("5 de octubre de 2026");
  });
});

describe("keepUnits", () => {
  it("glues figures to their unit so they never wrap apart", () => {
    expect(keepUnits("le tiene que enviar 8 € por Bizum y 11 h al 20 %")).toBe(
      "le tiene que enviar 8 € por Bizum y 11 h al 20 %",
    );
    expect(keepUnits("En 7 minutos")).toBe("En 7 minutos");
  });
});
