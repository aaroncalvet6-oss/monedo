import { addActivityDay, lessonKey } from "./lesson-progress";
import {
  emptySnapshot,
  type AssessmentResult,
  type LessonProgress,
  type ProgressRepository,
  type ProgressSnapshot,
} from "./types";

/** Non-persistent repository for tests and server rendering. */
export class InMemoryProgressRepository implements ProgressRepository {
  private snapshot: ProgressSnapshot;

  constructor(initial: ProgressSnapshot = emptySnapshot()) {
    this.snapshot = structuredClone(initial);
  }

  async load(): Promise<ProgressSnapshot> {
    return structuredClone(this.snapshot);
  }

  async saveLesson(progress: LessonProgress): Promise<void> {
    const key = lessonKey(progress.courseSlug, progress.lessonSlug);
    this.snapshot = {
      ...this.snapshot,
      lessons: { ...this.snapshot.lessons, [key]: structuredClone(progress) },
    };
  }

  async saveAssessment(result: AssessmentResult): Promise<void> {
    this.snapshot = {
      ...this.snapshot,
      assessments: { ...this.snapshot.assessments, [result.courseSlug]: structuredClone(result) },
    };
  }

  async recordActivity(day: string): Promise<void> {
    this.snapshot = {
      ...this.snapshot,
      activityDays: addActivityDay(this.snapshot.activityDays, day),
    };
  }

  async clear(): Promise<void> {
    this.snapshot = emptySnapshot();
  }
}
