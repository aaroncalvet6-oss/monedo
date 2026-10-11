const LOCALE = "es-ES";

// es-ES skips the thousands separator for 4-digit numbers by default ("1234 €");
// we always group so figures align and read the same everywhere.
const euro = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  useGrouping: "always",
});
const euroRounded = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  useGrouping: "always",
});

/** Formats an amount in euros the Spanish way: `1.234,50 €`. */
export function formatEuro(amount: number, options: { decimals?: boolean } = {}): string {
  const { decimals = true } = options;
  // Normalise -0 so we never render "-0 €".
  const value = Object.is(amount, -0) ? 0 : amount;
  return (decimals ? euro : euroRounded).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits,
    useGrouping: "always",
  }).format(value);
}

/** `ratio` is a fraction: 0.035 → `3,5 %`. */
export function formatPercent(ratio: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits }).format(ratio);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(date);
}

/** Keeps figures with their unit on one line in narrow columns: «90 €», «8 €/h», «11 h», «20 %». */
export function keepUnits(text: string): string {
  return text.replace(/(\d) (?=(€|h\b|%|horas|meses|años|gemas|min\b))/g, "$1 ");
}
