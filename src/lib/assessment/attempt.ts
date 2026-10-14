import type { Assessment, AssessmentQuestion } from "@/content/schema";

/** A number in [0, 1), like Math.random. Injected so attempts are reproducible in tests. */
export type Random = () => number;

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/**
 * One attempt: `questionsPerAttempt` questions drawn at random from the bank, each with its
 * options in a new order, so the answer cannot be learnt by position.
 */
export function drawAttempt(assessment: Assessment, random: Random = Math.random) {
  return shuffle(assessment.questions, random)
    .slice(0, assessment.questionsPerAttempt)
    .map((question) => ({ ...question, options: shuffle(question.options, random) }));
}

export type AttemptQuestion = ReturnType<typeof drawAttempt>[number];

export type AttemptResult = {
  correct: number;
  total: number;
  passMark: number;
  passed: boolean;
  /** Wrong or unanswered questions, in the order they were asked, with what was chosen. */
  mistakes: { question: AssessmentQuestion; chosenOptionId: string | undefined }[];
};

/** Scores an attempt. `answers` maps question id → chosen option id. */
export function scoreAttempt(
  questions: readonly AssessmentQuestion[],
  answers: Readonly<Record<string, string>>,
  passMark: number,
): AttemptResult {
  const mistakes = questions
    .filter((q) => answers[q.id] !== q.correctOptionId)
    .map((question) => ({ question, chosenOptionId: answers[question.id] }));
  const correct = questions.length - mistakes.length;
  return { correct, total: questions.length, passMark, passed: correct >= passMark, mistakes };
}
