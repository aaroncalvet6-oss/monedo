import { describe, expect, it } from "vitest";
import {
  addMonths,
  MAX_GOAL,
  MAX_MONTHS,
  monthlyForGoal,
  monthsBetween,
  monthsToGoal,
  remainingToGoal,
} from "./savings-goal";

describe("remainingToGoal", () => {
  it("is the price minus what you have, never below 0", () => {
    expect(remainingToGoal(120, 30)).toBe(90);
    expect(remainingToGoal(120, 150)).toBe(0);
    expect(remainingToGoal(0, 0)).toBe(0);
  });

  it("rejects negative, non-numeric and absurd amounts", () => {
    expect(remainingToGoal(-1, 0)).toBeNull();
    expect(remainingToGoal(100, -1)).toBeNull();
    expect(remainingToGoal(Number.NaN, 0)).toBeNull();
    expect(remainingToGoal(MAX_GOAL + 1, 0)).toBeNull();
  });
});

describe("monthsToGoal", () => {
  it("rounds up to whole months", () => {
    expect(monthsToGoal(120, 30, 12)).toBe(8); // 90 / 12 = 7,5
    expect(monthsToGoal(120, 0, 12)).toBe(10);
  });

  it("is 0 when you already have it, even saving nothing", () => {
    expect(monthsToGoal(100, 100, 0)).toBe(0);
    expect(monthsToGoal(0, 0, 0)).toBe(0);
  });

  it("is null when you save nothing and still need money", () => {
    expect(monthsToGoal(100, 10, 0)).toBeNull();
  });

  it("does not add a month because of floating-point noise", () => {
    expect(monthsToGoal(0.9, 0, 0.3)).toBe(3);
  });

  it("is null for negative inputs or when it would take too long", () => {
    expect(monthsToGoal(100, 0, -5)).toBeNull();
    expect(monthsToGoal(MAX_GOAL, 0, 0.01)).toBeNull();
  });

  it("handles large goals", () => {
    expect(monthsToGoal(MAX_GOAL, 0, 1000)).toBe(1000);
  });
});

describe("monthlyForGoal", () => {
  it("splits what is missing over the months, rounded up to the cent", () => {
    expect(monthlyForGoal(120, 30, 6)).toBe(15);
    expect(monthlyForGoal(100, 0, 3)).toBe(33.34);
  });

  it("is 0 when you already have it", () => {
    expect(monthlyForGoal(80, 100, 4)).toBe(0);
  });

  it("is null when the deadline is not in the future or not a whole month", () => {
    expect(monthlyForGoal(120, 30, 0)).toBeNull();
    expect(monthlyForGoal(120, 30, -2)).toBeNull();
    expect(monthlyForGoal(120, 30, 1.5)).toBeNull();
    expect(monthlyForGoal(120, 30, MAX_MONTHS + 1)).toBeNull();
  });

  it("is null for negative amounts", () => {
    expect(monthlyForGoal(-120, 0, 6)).toBeNull();
  });

  it("never falls short of the goal", () => {
    for (const [price, months] of [
      [100, 3],
      [999.99, 7],
      [MAX_GOAL, 11],
    ] as const) {
      expect(monthlyForGoal(price, 0, months)! * months).toBeGreaterThanOrEqual(price);
    }
  });
});

describe("calendar months", () => {
  it("counts months ignoring days, across years", () => {
    expect(monthsBetween(new Date(2026, 9, 31), new Date(2027, 3, 1))).toBe(6);
    expect(monthsBetween(new Date(2026, 9, 1), new Date(2026, 9, 28))).toBe(0);
    expect(monthsBetween(new Date(2026, 9, 1), new Date(2026, 5, 1))).toBe(-4);
  });

  it("adds months on the first day, so 31 October + 4 is February", () => {
    const date = addMonths(new Date(2026, 9, 31), 4);
    expect([date.getFullYear(), date.getMonth()]).toEqual([2027, 1]);
  });
});
