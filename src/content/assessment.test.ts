import { describe, expect, it } from "vitest";
import { getAssessment, getCourse, getLesson, getPublishedCourses } from "./index";
import { assessmentSchema } from "./schema";

describe("final assessments", () => {
  it("every published course has one", () => {
    for (const course of getPublishedCourses()) {
      expect(getAssessment(course.slug), course.slug).toBeDefined();
    }
  });

  it("match the agreed sizes: course 1 10 of 15 (7 to pass), course 2 8 of 12 (6 to pass)", () => {
    expect(getAssessment("fundamentos-del-dinero")).toMatchObject({
      questionsPerAttempt: 10,
      passMark: 7,
    });
    expect(getAssessment("fundamentos-del-dinero")?.questions).toHaveLength(15);
    expect(getAssessment("tu-primer-sueldo")).toMatchObject({
      questionsPerAttempt: 8,
      passMark: 6,
    });
    expect(getAssessment("tu-primer-sueldo")?.questions).toHaveLength(12);
  });

  it("cover every lesson of the course", () => {
    for (const course of getPublishedCourses()) {
      const covered = new Set(getAssessment(course.slug)!.questions.map((q) => q.lesson));
      expect([...covered].sort(), course.slug).toEqual(course.lessons.map((l) => l.slug).sort());
    }
  });

  it("ask new questions, not the lesson ones (understanding, not memory)", () => {
    for (const course of getPublishedCourses()) {
      const lessonPrompts = new Set(
        course.lessons.flatMap(
          (l) =>
            getLesson(course.slug, l.slug)?.blocks.flatMap((b) =>
              b.type === "quiz" ? b.questions.map((q) => q.prompt) : [],
            ) ?? [],
        ),
      );
      for (const q of getAssessment(course.slug)!.questions) {
        expect(lessonPrompts.has(q.prompt), q.id).toBe(false);
      }
    }
  });

  it("make sense in any order: options are shuffled, so nothing refers to a letter", () => {
    for (const course of getPublishedCourses()) {
      for (const q of getAssessment(course.slug)!.questions) {
        for (const o of q.options) {
          expect(o.text, q.id).not.toMatch(/anteriores|todas las|ninguna de las/i);
        }
        expect(q.explanation, q.id).not.toMatch(/\b[Ll]as? [ABCD]\b/);
      }
    }
  });

  it("reject a bank that is not 50 % larger than an attempt", () => {
    const course = getCourse("fundamentos-del-dinero")!;
    const bank = getAssessment(course.slug)!;
    const result = assessmentSchema.safeParse({ ...bank, questions: bank.questions.slice(0, 14) });
    expect(result.success).toBe(false);
  });
});
