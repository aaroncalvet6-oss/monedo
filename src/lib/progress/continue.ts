import { lessonKey } from "./lesson-progress";
import type { LessonProgress } from "./types";

/** The minimum a course needs for progress summaries (built on the server, serializable). */
export type CourseOutline = {
  slug: string;
  title: string;
  lessons: readonly { slug: string; title: string; minutes: number }[];
};

export type CourseProgressSummary = { done: number; total: number; started: boolean };

export function courseProgress(
  course: CourseOutline,
  lessons: Readonly<Record<string, LessonProgress>>,
): CourseProgressSummary {
  const entries = course.lessons.map((l) => lessons[lessonKey(course.slug, l.slug)]);
  return {
    done: entries.filter((p) => p?.completedAt).length,
    total: course.lessons.length,
    started: entries.some(Boolean),
  };
}

export type ContinueTarget = {
  course: CourseOutline;
  lesson: CourseOutline["lessons"][number];
  /** True if the learner is in the middle of this lesson (not just the next one). */
  inProgress: boolean;
  progress: CourseProgressSummary;
};

/**
 * Where to pick up: the lesson touched most recently if it is unfinished; otherwise the
 * next unfinished lesson of that course, then of the following courses. Null when the
 * learner has no progress yet or has finished everything.
 */
export function continueTarget(
  courses: readonly CourseOutline[],
  lessons: Readonly<Record<string, LessonProgress>>,
): ContinueTarget | null {
  const known = courses.flatMap((course) =>
    course.lessons.flatMap((lesson) => {
      const p = lessons[lessonKey(course.slug, lesson.slug)];
      return p ? [{ course, lesson, p }] : [];
    }),
  );
  if (known.length === 0) return null;
  const latest = known.reduce((a, b) => (b.p.updatedAt > a.p.updatedAt ? b : a));
  if (!latest.p.completedAt) {
    return {
      course: latest.course,
      lesson: latest.lesson,
      inProgress: true,
      progress: courseProgress(latest.course, lessons),
    };
  }
  const start = courses.indexOf(latest.course);
  for (const course of [...courses.slice(start), ...courses.slice(0, start)]) {
    const lesson = course.lessons.find(
      (l) => !lessons[lessonKey(course.slug, l.slug)]?.completedAt,
    );
    if (lesson) {
      return {
        course,
        lesson,
        inProgress: Boolean(lessons[lessonKey(course.slug, lesson.slug)]),
        progress: courseProgress(course, lessons),
      };
    }
  }
  return null;
}
