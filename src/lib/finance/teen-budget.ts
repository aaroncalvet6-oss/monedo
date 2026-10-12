/**
 * The teen budget from lesson 1.5: income in three parts (what you pay yourself, savings and
 * free spending). Savings are always the 20 % used across Monedo.
 */
export const SAVINGS_RATE = 0.2;

export type TeenBudgetInput = {
  /** Monthly pocket money. */
  allowance: number;
  /** Gifts, as a monthly average. */
  gifts: number;
  /** Small jobs, per month. */
  jobs: number;
  /** What you really pay yourself every month (phone top-up, transport, snacks…). */
  ownExpenses: number;
};

export type TeenBudgetStatus =
  /** Everything fits: own expenses, 20 % savings and something left to spend. */
  | "ok"
  /** Own expenses fit, but there is not enough left to save the full 20 %. */
  | "savings-short"
  /** What you pay yourself is more than what comes in. */
  | "over-income";

export type TeenBudget = {
  income: number;
  ownExpenses: number;
  /** The 20 % target. */
  savingsTarget: number;
  /** What you can actually save: the target, or what is left if that is less. */
  savings: number;
  /** What is left after own expenses and savings. Never negative. */
  freeSpending: number;
  /** How much is missing to cover own expenses + 20 % savings. 0 when everything fits. */
  shortfall: number;
  status: TeenBudgetStatus;
};

export const MAX_BUDGET_AMOUNT = 100_000;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Null when an amount is negative, not a number or unrealistically large. */
export function teenBudget(input: TeenBudgetInput): TeenBudget | null {
  const amounts = [input.allowance, input.gifts, input.jobs, input.ownExpenses];
  if (!amounts.every((n) => Number.isFinite(n) && n >= 0 && n <= MAX_BUDGET_AMOUNT)) return null;

  const income = round2(input.allowance + input.gifts + input.jobs);
  const ownExpenses = round2(input.ownExpenses);
  const savingsTarget = round2(income * SAVINGS_RATE);
  const afterOwn = round2(income - ownExpenses);
  const savings = Math.max(0, Math.min(savingsTarget, afterOwn));
  const freeSpending = Math.max(0, round2(afterOwn - savings));
  const shortfall = Math.max(0, round2(ownExpenses + savingsTarget - income));
  const status: TeenBudgetStatus =
    afterOwn < 0 ? "over-income" : shortfall > 0 ? "savings-short" : "ok";

  return { income, ownExpenses, savingsTarget, savings, freeSpending, shortfall, status };
}
