export const MAX_GOAL = 1_000_000;
/** 100 years: beyond this the answer is not useful. */
export const MAX_MONTHS = 1200;

const valid = (n: number) => Number.isFinite(n) && n >= 0 && n <= MAX_GOAL;
const round2 = (n: number) => Math.round(n * 100) / 100;

/** What is still missing to reach the goal. Never negative. */
export function remainingToGoal(price: number, saved: number): number | null {
  if (!valid(price) || !valid(saved)) return null;
  return Math.max(0, round2(price - saved));
}

/**
 * «I save X a month: when do I get there?» Whole months needed (the last one may be partial).
 * 0 when you already have it. Null for invalid inputs, when you save nothing and still need
 * money, or when it would take more than {@link MAX_MONTHS}.
 */
export function monthsToGoal(price: number, saved: number, monthly: number): number | null {
  const remaining = remainingToGoal(price, saved);
  if (remaining === null || !valid(monthly)) return null;
  if (remaining === 0) return 0;
  if (monthly === 0) return null;
  // Round to cents first so 90 / 0.3 does not become 300.0000001 → 301.
  const months = Math.ceil(round2((remaining / monthly) * 100) / 100);
  return months > MAX_MONTHS ? null : months;
}

/**
 * «I want it in N months: how much a month?» Rounded up to the cent so you never fall short.
 * 0 when you already have it. Null for invalid inputs or a deadline that is not in the future.
 */
export function monthlyForGoal(price: number, saved: number, months: number): number | null {
  const remaining = remainingToGoal(price, saved);
  if (remaining === null) return null;
  if (remaining === 0) return 0;
  if (!Number.isInteger(months) || months < 1 || months > MAX_MONTHS) return null;
  return Math.ceil(Math.round((remaining / months) * 1e6) / 1e4) / 100;
}

/** Calendar months from `from` to `to`, ignoring days: March → June is 3. */
export function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

/** The month you reach the goal: `from` plus `months` calendar months. */
export function addMonths(from: Date, months: number): Date {
  return new Date(from.getFullYear(), from.getMonth() + months, 1);
}
