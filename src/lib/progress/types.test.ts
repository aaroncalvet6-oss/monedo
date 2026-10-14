import { describe, expect, it } from "vitest";
import { recordAttempt } from "./assessment-progress";
import { createLessonProgress } from "./lesson-progress";
import { daySchema, lessonProgressSchema, progressSnapshotSchema } from "./types";

const now = new Date("2026-10-14T10:00:00.000Z");

describe("progress validation", () => {
  it("accepts what the app writes and strips unknown fields", () => {
    const lesson = createLessonProgress("c", "l", now);
    const snapshot = {
      version: 1,
      lessons: { "c/l": { ...lesson, extra: true } },
      activityDays: ["2026-10-14"],
      assessments: { c: recordAttempt(undefined, "c", 8, 10, true, now) },
      junk: 1,
    };
    const parsed = progressSnapshotSchema.parse(snapshot);
    expect(parsed.lessons["c/l"]).toEqual(lesson);
    expect(parsed).not.toHaveProperty("junk");
  });

  it("fills missing collections from older versions", () => {
    expect(progressSnapshotSchema.parse({ version: 1 })).toEqual({
      version: 1,
      lessons: {},
      activityDays: [],
      assessments: {},
    });
  });

  it("rejects wrong versions, bad dates and broken entries", () => {
    expect(progressSnapshotSchema.safeParse({ version: 2 }).success).toBe(false);
    expect(progressSnapshotSchema.safeParse(null).success).toBe(false);
    expect(progressSnapshotSchema.safeParse({ version: 1, activityDays: ["14/10"] }).success).toBe(
      false,
    );
    const lesson = createLessonProgress("c", "l", now);
    expect(lessonProgressSchema.safeParse({ ...lesson, startedAt: "ayer" }).success).toBe(false);
    expect(lessonProgressSchema.safeParse({ ...lesson, courseSlug: "" }).success).toBe(false);
    expect(lessonProgressSchema.safeParse({ ...lesson, answers: { q: 1 } }).success).toBe(false);
    expect(() => daySchema.parse("2026-1-1")).toThrow();
  });

  it("returns copies, not the input objects", () => {
    const lesson = createLessonProgress("c", "l", now);
    const parsed = lessonProgressSchema.parse(lesson);
    parsed.completedStepIds.push("x");
    expect(lesson.completedStepIds).toEqual([]);
  });
});
