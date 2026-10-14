import { STORAGE_KEYS } from "@/lib/storage-keys";
import { addActivityDay, lessonKey } from "./lesson-progress";
import {
  assessmentResultSchema,
  daySchema,
  emptySnapshot,
  lessonProgressSchema,
  progressSnapshotSchema,
  ProgressStorageError,
  type AssessmentResult,
  type LessonProgress,
  type ProgressRepository,
  type ProgressSnapshot,
} from "./types";

export const PROGRESS_STORAGE_KEY = STORAGE_KEYS.progress;

type KeyValueStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStorage(): KeyValueStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Accessing localStorage throws when site data is blocked.
    return null;
  }
}

/**
 * Stores progress as one JSON document in localStorage (or any Storage-like object).
 * Reads are validated with Zod: unreadable or foreign data yields an empty snapshot
 * instead of crashing the app. Write failures reject with ProgressStorageError.
 */
export class LocalProgressRepository implements ProgressRepository {
  constructor(
    private readonly storage: KeyValueStorage | null = defaultStorage(),
    private readonly key: string = PROGRESS_STORAGE_KEY,
  ) {}

  async load(): Promise<ProgressSnapshot> {
    return this.read();
  }

  async saveLesson(progress: LessonProgress): Promise<void> {
    const valid = lessonProgressSchema.parse(progress);
    const snapshot = this.read();
    snapshot.lessons[lessonKey(valid.courseSlug, valid.lessonSlug)] = valid;
    this.write(snapshot);
  }

  async saveAssessment(result: AssessmentResult): Promise<void> {
    const valid = assessmentResultSchema.parse(result);
    const snapshot = this.read();
    snapshot.assessments[valid.courseSlug] = valid;
    this.write(snapshot);
  }

  async recordActivity(day: string): Promise<void> {
    const valid = daySchema.parse(day);
    const snapshot = this.read();
    if (snapshot.activityDays.includes(valid)) return;
    snapshot.activityDays = addActivityDay(snapshot.activityDays, valid);
    this.write(snapshot);
  }

  async clear(): Promise<void> {
    if (!this.storage) return;
    try {
      this.storage.removeItem(this.key);
    } catch (cause) {
      throw new ProgressStorageError("No se ha podido borrar el progreso", { cause });
    }
  }

  private read(): ProgressSnapshot {
    if (!this.storage) return emptySnapshot();
    let raw: string | null;
    try {
      raw = this.storage.getItem(this.key);
    } catch {
      return emptySnapshot();
    }
    if (!raw) return emptySnapshot();
    try {
      const parsed = progressSnapshotSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : emptySnapshot();
    } catch {
      return emptySnapshot();
    }
  }

  private write(snapshot: ProgressSnapshot): void {
    if (!this.storage) {
      throw new ProgressStorageError("El almacenamiento del navegador no está disponible");
    }
    try {
      this.storage.setItem(this.key, JSON.stringify(snapshot));
    } catch (cause) {
      throw new ProgressStorageError("No se ha podido guardar el progreso", { cause });
    }
  }
}
