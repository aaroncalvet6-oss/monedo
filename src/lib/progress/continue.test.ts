import { describe, expect, it } from "vitest";
import { continueTarget, courseProgress, type CourseOutline } from "./continue";
import { completeLesson, createLessonProgress, lessonKey } from "./lesson-progress";
import type { LessonProgress } from "./types";

const course = (slug: string, n: number): CourseOutline => ({
  slug,
  title: slug,
  lessons: Array.from({ length: n }, (_, i) => ({
    slug: `l${i + 1}`,
    title: `L${i + 1}`,
    minutes: 5,
  })),
});
const c1 = course("c1", 3);
const c2 = course("c2", 2);

function progress(entries: [string, string, number, boolean][]): Record<string, LessonProgress> {
  return Object.fromEntries(
    entries.map(([c, l, minute, done]) => {
      const at = new Date(Date.UTC(2026, 9, 11, 10, minute));
      const p = createLessonProgress(c, l, at);
      return [lessonKey(c, l), done ? completeLesson(p, at) : p];
    }),
  );
}

describe("continueTarget", () => {
  it("is null without progress", () => {
    expect(continueTarget([c1, c2], {})).toBeNull();
  });

  it("resumes the unfinished lesson touched last", () => {
    const t = continueTarget(
      [c1, c2],
      progress([
        ["c1", "l1", 1, true],
        ["c1", "l2", 2, false],
      ]),
    );
    expect(t).toMatchObject({ course: c1, lesson: { slug: "l2" }, inProgress: true });
    expect(t?.progress).toEqual({ done: 1, total: 3, started: true });
  });

  it("moves to the next lesson after finishing one", () => {
    const t = continueTarget([c1, c2], progress([["c1", "l1", 1, true]]));
    expect(t).toMatchObject({ lesson: { slug: "l2" }, inProgress: false });
  });

  it("moves to the next course when a course is finished", () => {
    const done = progress([
      ["c1", "l1", 1, true],
      ["c1", "l2", 2, true],
      ["c1", "l3", 3, true],
    ]);
    expect(continueTarget([c1, c2], done)).toMatchObject({ course: c2, lesson: { slug: "l1" } });
  });

  it("is null when everything is finished", () => {
    const all = progress([
      ["c1", "l1", 1, true],
      ["c1", "l2", 2, true],
      ["c1", "l3", 3, true],
      ["c2", "l1", 4, true],
      ["c2", "l2", 5, true],
    ]);
    expect(continueTarget([c1, c2], all)).toBeNull();
  });
});

describe("courseProgress", () => {
  it("counts completed lessons", () => {
    expect(
      courseProgress(
        c1,
        progress([
          ["c1", "l1", 1, true],
          ["c1", "l3", 2, false],
        ]),
      ),
    ).toEqual({
      done: 1,
      total: 3,
      started: true,
    });
  });
});
