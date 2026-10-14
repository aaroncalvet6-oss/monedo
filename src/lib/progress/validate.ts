/** A minimal parse/safeParse pair, shaped like the schema-library API it replaces. */
export type Validator<T> = {
  parse(value: unknown): T;
  safeParse(value: unknown): { success: true; data: T } | { success: false };
};

/** Builds a validator from a function that returns a clean copy, or null if invalid. */
export function validator<T>(check: (value: unknown) => T | null): Validator<T> {
  return {
    parse(value) {
      const result = check(value);
      if (result === null) throw new TypeError("Invalid progress data");
      return result;
    },
    safeParse(value) {
      const result = check(value);
      return result === null ? { success: false } : { success: true, data: result };
    },
  };
}
