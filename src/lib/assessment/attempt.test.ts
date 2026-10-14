import { describe, expect, it } from "vitest";
import { getAssessment } from "@/content";
import { drawAttempt, scoreAttempt, shuffle } from "./attempt";

/** Deterministic pseudo-random numbers (mulberry32). */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const course1 = getAssessment("fundamentos-del-dinero")!;
const course2 = getAssessment("tu-primer-sueldo")!;

describe("shuffle", () => {
  it("keeps every item exactly once and does not change the input", () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input, seeded(1));
    expect([...output].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles empty and single-item lists", () => {
    expect(shuffle([], seeded(1))).toEqual([]);
    expect(shuffle(["a"], seeded(1))).toEqual(["a"]);
  });
});

describe("drawAttempt", () => {
  it("draws 10 of 15 for course 1 and 8 of 12 for course 2, without repeats", () => {
    for (const [assessment, n] of [
      [course1, 10],
      [course2, 8],
    ] as const) {
      const attempt = drawAttempt(assessment, seeded(7));
      expect(attempt).toHaveLength(n);
      expect(new Set(attempt.map((q) => q.id)).size).toBe(n);
    }
  });

  it("changes the questions and the order of the options between attempts", () => {
    const first = drawAttempt(course1, seeded(1));
    const second = drawAttempt(course1, seeded(2));
    expect(first.map((q) => q.id)).not.toEqual(second.map((q) => q.id));
    const positions = new Set(
      Array.from({ length: 20 }, (_, i) => {
        const q = drawAttempt(course1, seeded(i)).find((x) => x.id === "subida-bocadillo");
        return q?.options.findIndex((o) => o.id === q.correctOptionId);
      }).filter((p) => p !== undefined),
    );
    expect(positions.size).toBeGreaterThan(1);
  });

  it("over many attempts, every question of the bank comes up", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 50; i += 1) drawAttempt(course2, seeded(i)).forEach((q) => seen.add(q.id));
    expect(seen.size).toBe(course2.questions.length);
  });
});

describe("scoreAttempt", () => {
  const questions = course1.questions.slice(0, 10);
  const allRight = Object.fromEntries(questions.map((q) => [q.id, q.correctOptionId]));

  it("passes with 7 of 10 and fails with 6", () => {
    const three = questions.slice(0, 3).map((q) => q.id);
    const four = questions.slice(0, 4).map((q) => q.id);
    const wrong = (ids: string[]) => ({
      ...allRight,
      ...Object.fromEntries(ids.map((id) => [id, "zz"])),
    });
    expect(scoreAttempt(questions, wrong(three), 7)).toMatchObject({ correct: 7, passed: true });
    expect(scoreAttempt(questions, wrong(four), 7)).toMatchObject({ correct: 6, passed: false });
  });

  it("lists each mistake with what was chosen, and counts unanswered as wrong", () => {
    const rest = Object.fromEntries(
      Object.entries(allRight).filter(([id]) => id !== questions[0]!.id),
    );
    const result = scoreAttempt(questions, { ...rest, [questions[1]!.id]: "x" }, 7);
    expect(result.correct).toBe(8);
    expect(result.mistakes.map((m) => [m.question.id, m.chosenOptionId])).toEqual([
      [questions[0]!.id, undefined],
      [questions[1]!.id, "x"],
    ]);
  });

  it("a perfect attempt has no mistakes", () => {
    expect(scoreAttempt(questions, allRight, 7)).toMatchObject({
      correct: 10,
      total: 10,
      passed: true,
      mistakes: [],
    });
  });
});
