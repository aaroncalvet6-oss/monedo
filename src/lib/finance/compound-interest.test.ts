import { describe, expect, it } from "vitest";
import { compoundGrowth, MAX_AMOUNT, MAX_YEARS } from "./compound-interest";

describe("compoundGrowth", () => {
  it("grows a single amount by the yearly rate, compounded", () => {
    const result = compoundGrowth({ initial: 100, monthly: 0, years: 2, annualRate: 0.1 })!;
    expect(result.points.map((p) => p.balance)).toEqual([100, 110, 121]);
    expect(result.contributed).toBe(100);
    expect(result.growth).toBe(21);
  });

  it("adds the monthly contribution and counts it as contributed", () => {
    const result = compoundGrowth({ initial: 100, monthly: 12, years: 10, annualRate: 0.04 })!;
    expect(result.contributed).toBe(100 + 12 * 12 * 10);
    expect(result.points).toHaveLength(11);
    expect(result.balance).toBeGreaterThan(result.contributed);
    // Each year ends above the previous one.
    for (let i = 1; i < result.points.length; i += 1) {
      expect(result.points[i]!.balance).toBeGreaterThan(result.points[i - 1]!.balance);
    }
  });

  it("with a 0 % return, what you have is what you put in", () => {
    const result = compoundGrowth({ initial: 50, monthly: 10, years: 3, annualRate: 0 })!;
    expect(result.balance).toBe(410);
    expect(result.growth).toBe(0);
  });

  it("with 0 years, nothing changes", () => {
    const result = compoundGrowth({ initial: 250, monthly: 30, years: 0, annualRate: 0.05 })!;
    expect(result.points).toEqual([{ year: 0, contributed: 250, balance: 250 }]);
    expect(result.growth).toBe(0);
  });

  it("with everything at 0, the result is 0", () => {
    const result = compoundGrowth({ initial: 0, monthly: 0, years: 5, annualRate: 0.05 })!;
    expect(result.balance).toBe(0);
  });

  it("a negative return makes the money shrink", () => {
    const result = compoundGrowth({ initial: 1000, monthly: 0, years: 1, annualRate: -0.2 })!;
    expect(result.balance).toBe(800);
    expect(result.growth).toBe(-200);
  });

  it("rejects negative amounts, broken years and impossible rates", () => {
    const base = { initial: 100, monthly: 10, years: 5, annualRate: 0.04 };
    expect(compoundGrowth({ ...base, initial: -1 })).toBeNull();
    expect(compoundGrowth({ ...base, monthly: -5 })).toBeNull();
    expect(compoundGrowth({ ...base, years: -1 })).toBeNull();
    expect(compoundGrowth({ ...base, years: 2.5 })).toBeNull();
    expect(compoundGrowth({ ...base, years: MAX_YEARS + 1 })).toBeNull();
    expect(compoundGrowth({ ...base, annualRate: -1 })).toBeNull();
    expect(compoundGrowth({ ...base, annualRate: 1.5 })).toBeNull();
    expect(compoundGrowth({ ...base, initial: Number.NaN })).toBeNull();
    expect(compoundGrowth({ ...base, monthly: Number.POSITIVE_INFINITY })).toBeNull();
  });

  it("handles very large amounts without losing finiteness, and rejects absurd ones", () => {
    const big = compoundGrowth({
      initial: MAX_AMOUNT,
      monthly: MAX_AMOUNT,
      years: MAX_YEARS,
      annualRate: 1,
    })!;
    expect(Number.isFinite(big.balance)).toBe(true);
    expect(
      compoundGrowth({ initial: MAX_AMOUNT + 1, monthly: 0, years: 1, annualRate: 0 }),
    ).toBeNull();
  });
});
