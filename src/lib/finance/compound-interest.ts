export type CompoundInput = {
  /** Money you start with, in euros. */
  initial: number;
  /** Money you add at the end of every month, in euros. */
  monthly: number;
  /** Whole years, 0 to {@link MAX_YEARS}. */
  years: number;
  /** Yearly return as a fraction (0.04 = 4 %). Can be negative, but not −100 % or less. */
  annualRate: number;
};

export type YearPoint = {
  year: number;
  /** Everything you have put in so far. */
  contributed: number;
  /** What you have: your money plus (or minus) what it earned. */
  balance: number;
};

export type CompoundResult = {
  /** One point per year, starting at year 0. */
  points: YearPoint[];
  contributed: number;
  balance: number;
  /** balance − contributed. Negative when the return is negative. */
  growth: number;
};

export const MAX_YEARS = 60;
/** Inputs above this are rejected: they are not realistic and lose precision. */
export const MAX_AMOUNT = 10_000_000;

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Compound growth with a monthly contribution. The yearly rate is converted to the equivalent
 * monthly rate, so a 4 % year is exactly 4 % after twelve months. Contributions are added at
 * the end of each month. Returns null for inputs that cannot give a meaningful answer.
 */
export function compoundGrowth(input: CompoundInput): CompoundResult | null {
  const { initial, monthly, years, annualRate } = input;
  const values = [initial, monthly, years, annualRate];
  if (!values.every(Number.isFinite)) return null;
  if (initial < 0 || monthly < 0 || initial > MAX_AMOUNT || monthly > MAX_AMOUNT) return null;
  if (!Number.isInteger(years) || years < 0 || years > MAX_YEARS) return null;
  if (annualRate <= -1 || annualRate > 1) return null;

  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const points: YearPoint[] = [{ year: 0, contributed: round2(initial), balance: round2(initial) }];
  let balance = initial;
  let contributed = initial;
  for (let year = 1; year <= years; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthly;
      contributed += monthly;
    }
    points.push({ year, contributed: round2(contributed), balance: round2(balance) });
  }
  const last = points[points.length - 1]!;
  return {
    points,
    contributed: last.contributed,
    balance: last.balance,
    growth: round2(last.balance - last.contributed),
  };
}
