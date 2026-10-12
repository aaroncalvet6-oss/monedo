import { describe, expect, it } from "vitest";
import { MAX_BUDGET_AMOUNT, teenBudget } from "./teen-budget";

const hugo = { allowance: 60, gifts: 0, jobs: 0, ownExpenses: 20 };

describe("teenBudget", () => {
  it("reproduces Hugo's budget from lesson 1.5: 20 / 12 / 28", () => {
    expect(teenBudget(hugo)).toEqual({
      income: 60,
      ownExpenses: 20,
      savingsTarget: 12,
      savings: 12,
      freeSpending: 28,
      shortfall: 0,
      status: "ok",
    });
  });

  it("adds every income source", () => {
    const budget = teenBudget({ allowance: 40, gifts: 10, jobs: 25, ownExpenses: 15 })!;
    expect(budget.income).toBe(75);
    expect(budget.savings).toBe(15);
    expect(budget.freeSpending).toBe(45);
  });

  it("everything at 0 is a valid, empty budget", () => {
    expect(teenBudget({ allowance: 0, gifts: 0, jobs: 0, ownExpenses: 0 })).toMatchObject({
      income: 0,
      savings: 0,
      freeSpending: 0,
      status: "ok",
    });
  });

  it("when own expenses leave too little, saves what is left and reports the gap", () => {
    const budget = teenBudget({ ...hugo, ownExpenses: 55 })!;
    expect(budget.status).toBe("savings-short");
    expect(budget.savings).toBe(5);
    expect(budget.freeSpending).toBe(0);
    expect(budget.shortfall).toBe(7);
  });

  it("warns when what you pay is more than what comes in", () => {
    const budget = teenBudget({ ...hugo, ownExpenses: 75 })!;
    expect(budget.status).toBe("over-income");
    expect(budget.savings).toBe(0);
    expect(budget.freeSpending).toBe(0);
    expect(budget.shortfall).toBe(27);
  });

  it("an exact fit is ok", () => {
    expect(teenBudget({ ...hugo, ownExpenses: 48 })?.status).toBe("ok");
  });

  it("rejects negative, non-numeric and absurd amounts", () => {
    expect(teenBudget({ ...hugo, allowance: -1 })).toBeNull();
    expect(teenBudget({ ...hugo, ownExpenses: -5 })).toBeNull();
    expect(teenBudget({ ...hugo, gifts: Number.NaN })).toBeNull();
    expect(teenBudget({ ...hugo, jobs: MAX_BUDGET_AMOUNT + 1 })).toBeNull();
  });

  it("keeps cents right with decimal amounts", () => {
    const budget = teenBudget({ allowance: 12.5, gifts: 0.1, jobs: 0.2, ownExpenses: 3.3 })!;
    expect(budget.income).toBe(12.8);
    expect(budget.savings).toBe(2.56);
    expect(budget.freeSpending).toBe(6.94);
  });
});
