import type { AssessmentResult } from "./types";

/**
 * Folds a new attempt into a course's assessment result: keeps the best score, counts the
 * attempt and remembers the first time it was passed (failing later never takes it away).
 */
export function recordAttempt(
  previous: AssessmentResult | undefined,
  courseSlug: string,
  score: number,
  total: number,
  passed: boolean,
  now: Date,
): AssessmentResult {
  const at = now.toISOString();
  return {
    courseSlug,
    bestScore: Math.max(previous?.bestScore ?? 0, score),
    total,
    attempts: (previous?.attempts ?? 0) + 1,
    passedAt: previous?.passedAt ?? (passed ? at : null),
    updatedAt: at,
  };
}
