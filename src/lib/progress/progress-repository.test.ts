import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProgressRepository } from "./in-memory-progress-repository";
import { createLessonProgress } from "./lesson-progress";
import { LocalProgressRepository, PROGRESS_STORAGE_KEY } from "./local-progress-repository";
import { describeProgressRepositoryContract } from "./repository-contract";
import { ProgressStorageError } from "./types";

const NOW = new Date("2026-10-09T10:00:00.000Z");

/** Minimal Storage double whose failures can be switched on. */
class FakeStorage {
  data = new Map<string, string>();
  failReads = false;
  failWrites = false;
  getItem(key: string) {
    if (this.failReads) throw new DOMException("blocked", "SecurityError");
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    if (this.failWrites) throw new DOMException("full", "QuotaExceededError");
    this.data.set(key, value);
  }
  removeItem(key: string) {
    if (this.failWrites) throw new DOMException("blocked", "SecurityError");
    this.data.delete(key);
  }
}

describeProgressRepositoryContract(
  "InMemoryProgressRepository",
  () => new InMemoryProgressRepository(),
);
describeProgressRepositoryContract(
  "LocalProgressRepository",
  () => new LocalProgressRepository(new FakeStorage()),
);

describe("LocalProgressRepository with window.localStorage", () => {
  beforeEach(() => localStorage.clear());

  it("uses localStorage by default and survives a new instance (page reload)", async () => {
    await new LocalProgressRepository().saveLesson(createLessonProgress("c", "l", NOW));
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toContain('"c/l"');
    const reloaded = await new LocalProgressRepository().load();
    expect(reloaded.lessons["c/l"]?.lessonSlug).toBe("l");
  });
});

describe("LocalProgressRepository resilience", () => {
  let storage: FakeStorage;
  let repo: LocalProgressRepository;
  beforeEach(() => {
    storage = new FakeStorage();
    repo = new LocalProgressRepository(storage);
  });

  it.each([
    ["invalid JSON", "{not json"],
    ["a JSON primitive", "42"],
    ["an unknown schema version", JSON.stringify({ version: 99, lessons: {} })],
    [
      "a lesson with the wrong shape",
      JSON.stringify({ version: 1, lessons: { "c/l": { courseSlug: 1 } }, activityDays: [] }),
    ],
  ])("treats %s as empty progress", async (_, raw) => {
    storage.data.set(PROGRESS_STORAGE_KEY, raw);
    expect(await repo.load()).toEqual({
      version: 1,
      lessons: {},
      activityDays: [],
      assessments: {},
    });
  });

  it("fills in fields missing from older documents", async () => {
    storage.data.set(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 1 }));
    expect(await repo.load()).toEqual({
      version: 1,
      lessons: {},
      activityDays: [],
      assessments: {},
    });
  });

  it("returns empty progress when storage reads are blocked", async () => {
    storage.failReads = true;
    expect((await repo.load()).lessons).toEqual({});
  });

  it("rejects with ProgressStorageError when the quota is exceeded", async () => {
    storage.failWrites = true;
    await expect(repo.saveLesson(createLessonProgress("c", "l", NOW))).rejects.toBeInstanceOf(
      ProgressStorageError,
    );
    await expect(repo.recordActivity("2026-10-09")).rejects.toBeInstanceOf(ProgressStorageError);
  });

  it("rejects writes when there is no storage at all (e.g. server)", async () => {
    const noStorage = new LocalProgressRepository(null);
    expect((await noStorage.load()).lessons).toEqual({});
    await expect(noStorage.saveLesson(createLessonProgress("c", "l", NOW))).rejects.toBeInstanceOf(
      ProgressStorageError,
    );
    await expect(noStorage.clear()).resolves.toBeUndefined();
  });

  it("refuses to persist invalid progress or days", async () => {
    await expect(
      repo.saveLesson({ ...createLessonProgress("c", "l", NOW), startedAt: "ayer" }),
    ).rejects.toThrow();
    await expect(repo.recordActivity("9/10/2026")).rejects.toThrow();
    expect(storage.data.size).toBe(0);
  });

  it("does not rewrite storage when the day is already recorded", async () => {
    await repo.recordActivity("2026-10-09");
    storage.failWrites = true;
    await expect(repo.recordActivity("2026-10-09")).resolves.toBeUndefined();
  });

  it("keeps other keys untouched and uses a custom key", async () => {
    storage.data.set("monedo:theme", "dark");
    const custom = new LocalProgressRepository(storage, "custom-key");
    await custom.saveLesson(createLessonProgress("c", "l", NOW));
    expect(storage.data.get("monedo:theme")).toBe("dark");
    expect(storage.data.has("custom-key")).toBe(true);
    expect(storage.data.has(PROGRESS_STORAGE_KEY)).toBe(false);
  });
});
