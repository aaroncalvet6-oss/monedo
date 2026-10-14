// Progress runs in the browser on every page, so it is validated with a few small functions
// instead of a schema library (which would add hundreds of KB to every page). Content, which
// is only read at build time, keeps using Zod.
import { validator, type Validator } from "./validate";

export const PROGRESS_SCHEMA_VERSION = 1;

export type LessonProgress = {
  courseSlug: string;
  lessonSlug: string;
  /** Step the learner was on last; used to resume. */
  currentStepId: string | null;
  completedStepIds: string[];
  /** questionId → optionId of the first checked answer (answers lock once checked). */
  answers: Record<string, string>;
  /** decision block id → chosen option id. */
  decisions: Record<string, string>;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
};

/** Final assessment of one course: the best attempt counts. */
export type AssessmentResult = {
  courseSlug: string;
  bestScore: number;
  total: number;
  attempts: number;
  /** First time it was passed; the certificate shows this date. Null until passed. */
  passedAt: string | null;
  updatedAt: string;
};

export type ProgressSnapshot = {
  version: typeof PROGRESS_SCHEMA_VERSION;
  lessons: Record<string, LessonProgress>;
  /** Unique, sorted days with learning activity (streaks and weekly goal). */
  activityDays: string[];
  /** courseSlug → final assessment result. */
  assessments: Record<string, AssessmentResult>;
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === "string";
const isNonEmpty = (v: unknown): v is string => isString(v) && v.length > 0;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const isDay = (v: unknown): v is string => isString(v) && DAY.test(v);
const isDatetime = (v: unknown): v is string =>
  isString(v) && DATETIME.test(v) && !Number.isNaN(Date.parse(v));
const isCount = (v: unknown, min: number): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= min;
const isStringRecord = (v: unknown): v is Record<string, string> =>
  isObject(v) && Object.values(v).every(isString);

function recordOf<T>(value: unknown, item: Validator<T>): Record<string, T> | null {
  if (!isObject(value)) return null;
  const out: Record<string, T> = {};
  for (const [key, entry] of Object.entries(value)) {
    const parsed = item.safeParse(entry);
    if (!parsed.success) return null;
    out[key] = parsed.data;
  }
  return out;
}

/** ISO calendar day in the learner's local time zone: "2026-10-09". */
export const daySchema = validator<string>((v) => (isDay(v) ? v : null));

export const lessonProgressSchema = validator<LessonProgress>((v) => {
  if (!isObject(v)) return null;
  const { courseSlug, lessonSlug, currentStepId, completedStepIds, answers, decisions } = v;
  const { startedAt, updatedAt, completedAt } = v;
  if (!isNonEmpty(courseSlug) || !isNonEmpty(lessonSlug)) return null;
  if (currentStepId !== null && !isString(currentStepId)) return null;
  if (!Array.isArray(completedStepIds) || !completedStepIds.every(isString)) return null;
  if (!isStringRecord(answers) || !isStringRecord(decisions)) return null;
  if (!isDatetime(startedAt) || !isDatetime(updatedAt)) return null;
  if (completedAt !== null && !isDatetime(completedAt)) return null;
  return {
    courseSlug,
    lessonSlug,
    currentStepId,
    completedStepIds: [...completedStepIds],
    answers: { ...answers },
    decisions: { ...decisions },
    startedAt,
    updatedAt,
    completedAt,
  };
});

export const assessmentResultSchema = validator<AssessmentResult>((v) => {
  if (!isObject(v)) return null;
  const { courseSlug, bestScore, total, attempts, passedAt, updatedAt } = v;
  if (!isNonEmpty(courseSlug) || !isCount(bestScore, 0) || !isCount(total, 1)) return null;
  if (!isCount(attempts, 1) || !isDatetime(updatedAt)) return null;
  if (passedAt !== null && !isDatetime(passedAt)) return null;
  return { courseSlug, bestScore, total, attempts, passedAt, updatedAt };
});

/** A stored snapshot. Missing collections default to empty; any invalid entry rejects it. */
export const progressSnapshotSchema = validator<ProgressSnapshot>((v) => {
  if (!isObject(v) || v.version !== PROGRESS_SCHEMA_VERSION) return null;
  const lessons = v.lessons === undefined ? {} : recordOf(v.lessons, lessonProgressSchema);
  const assessments =
    v.assessments === undefined ? {} : recordOf(v.assessments, assessmentResultSchema);
  const days = v.activityDays ?? [];
  if (!lessons || !assessments || !Array.isArray(days) || !days.every(isDay)) return null;
  return { version: PROGRESS_SCHEMA_VERSION, lessons, activityDays: [...days], assessments };
});

export function emptySnapshot(): ProgressSnapshot {
  return { version: PROGRESS_SCHEMA_VERSION, lessons: {}, activityDays: [], assessments: {} };
}

/**
 * Persistence boundary for learner progress. The UI only talks to this interface:
 * v1 stores in the browser (LocalProgressRepository); v2 will add a Supabase
 * implementation without UI changes. All methods are async for that reason.
 */
export interface ProgressRepository {
  load(): Promise<ProgressSnapshot>;
  /** Insert or replace one lesson's progress. */
  saveLesson(progress: LessonProgress): Promise<void>;
  /** Insert or replace one course's assessment result. */
  saveAssessment(result: AssessmentResult): Promise<void>;
  /** Mark a day as active. Idempotent. */
  recordActivity(day: string): Promise<void>;
  /** Delete all progress for this learner. */
  clear(): Promise<void>;
}

/** Raised when progress cannot be persisted (storage full, blocked, unavailable). */
export class ProgressStorageError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ProgressStorageError";
  }
}
