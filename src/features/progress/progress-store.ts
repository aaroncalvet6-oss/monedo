import { createStore } from "zustand/vanilla";
import {
  addActivityDay,
  createLessonProgress,
  lessonKey,
  toDay,
} from "@/lib/progress/lesson-progress";
import { recordAttempt } from "@/lib/progress/assessment-progress";
import {
  emptySnapshot,
  type LessonProgress,
  type ProgressRepository,
  type ProgressSnapshot,
} from "@/lib/progress/types";

export type ProgressState = {
  snapshot: ProgressSnapshot;
  /** "ready" once the repository has been read; before that the UI shows a neutral state. */
  status: "idle" | "loading" | "ready";
  /** True if the last write failed (storage full or blocked). */
  saveFailed: boolean;
  hydrate: () => Promise<void>;
  /**
   * Applies a pure update to one lesson's progress (created on first use), persists it
   * and records today's activity.
   */
  updateLesson: (
    courseSlug: string,
    lessonSlug: string,
    update: (progress: LessonProgress, now: Date) => LessonProgress,
  ) => void;
  /** Records a finished assessment attempt (best score and first pass are kept). */
  recordAssessment: (courseSlug: string, score: number, total: number, passed: boolean) => void;
  reset: () => Promise<void>;
};

export type ProgressStore = ReturnType<typeof createProgressStore>;

export function createProgressStore(
  repository: ProgressRepository,
  clock: () => Date = () => new Date(),
) {
  const store = createStore<ProgressState>()((set, get) => {
    const persist = (task: Promise<void>) =>
      task.then(
        () => (get().saveFailed ? set({ saveFailed: false }) : undefined),
        () => set({ saveFailed: true }),
      );

    return {
      snapshot: emptySnapshot(),
      status: "idle",
      saveFailed: false,

      hydrate: async () => {
        if (get().status !== "idle") return;
        set({ status: "loading" });
        try {
          const snapshot = await repository.load();
          // Merge: anything done before hydration finished wins over stored data.
          set((state) => ({
            status: "ready",
            snapshot: {
              ...snapshot,
              lessons: { ...snapshot.lessons, ...state.snapshot.lessons },
              activityDays: state.snapshot.activityDays.reduce(
                addActivityDay,
                snapshot.activityDays,
              ),
              assessments: { ...snapshot.assessments, ...state.snapshot.assessments },
            },
          }));
        } catch {
          set({ status: "ready" });
        }
      },

      updateLesson: (courseSlug, lessonSlug, update) => {
        const now = clock();
        const key = lessonKey(courseSlug, lessonSlug);
        const { snapshot } = get();
        const current = snapshot.lessons[key] ?? createLessonProgress(courseSlug, lessonSlug, now);
        const next = update(current, now);
        if (next === snapshot.lessons[key]) return;

        const day = toDay(now);
        const newDay = !snapshot.activityDays.includes(day);
        set({
          snapshot: {
            ...snapshot,
            lessons: { ...snapshot.lessons, [key]: next },
            activityDays: newDay
              ? addActivityDay(snapshot.activityDays, day)
              : snapshot.activityDays,
          },
        });
        void persist(
          (async () => {
            await repository.saveLesson(next);
            if (newDay) await repository.recordActivity(day);
          })(),
        );
      },

      recordAssessment: (courseSlug, score, total, passed) => {
        const now = clock();
        const { snapshot } = get();
        const next = recordAttempt(
          snapshot.assessments[courseSlug],
          courseSlug,
          score,
          total,
          passed,
          now,
        );
        const day = toDay(now);
        const newDay = !snapshot.activityDays.includes(day);
        set({
          snapshot: {
            ...snapshot,
            assessments: { ...snapshot.assessments, [courseSlug]: next },
            activityDays: newDay
              ? addActivityDay(snapshot.activityDays, day)
              : snapshot.activityDays,
          },
        });
        void persist(
          (async () => {
            await repository.saveAssessment(next);
            if (newDay) await repository.recordActivity(day);
          })(),
        );
      },

      reset: async () => {
        set({ snapshot: emptySnapshot() });
        await persist(repository.clear());
      },
    };
  });
  return store;
}
