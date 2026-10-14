import { describe, expect, it, vi } from "vitest";
import { InMemoryProgressRepository } from "@/lib/progress/in-memory-progress-repository";
import { completeStep, createLessonProgress, visitStep } from "@/lib/progress/lesson-progress";
import { emptySnapshot, ProgressStorageError, type ProgressRepository } from "@/lib/progress/types";
import { createProgressStore } from "./progress-store";

const NOW = new Date(2026, 9, 9, 18, 0);
const clock = () => NOW;
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("progress store", () => {
  it("hydrates from the repository", async () => {
    const repo = new InMemoryProgressRepository({
      ...emptySnapshot(),
      lessons: { "c/l": visitStep(createLessonProgress("c", "l", NOW), "s2", NOW) },
    });
    const store = createProgressStore(repo, clock);
    expect(store.getState().status).toBe("idle");
    await store.getState().hydrate();
    expect(store.getState().status).toBe("ready");
    expect(store.getState().snapshot.lessons["c/l"]?.currentStepId).toBe("s2");
  });

  it("creates, updates and persists lesson progress and today's activity", async () => {
    const repo = new InMemoryProgressRepository();
    const store = createProgressStore(repo, clock);
    await store.getState().hydrate();
    store
      .getState()
      .updateLesson("c", "l", (p, now) => completeStep(visitStep(p, "s1", now), "s1", now));
    await flush();
    const saved = await repo.load();
    expect(saved.lessons["c/l"]).toMatchObject({ currentStepId: "s1", completedStepIds: ["s1"] });
    expect(saved.activityDays).toEqual(["2026-10-09"]);
    expect(store.getState().snapshot.activityDays).toEqual(["2026-10-09"]);
  });

  it("skips writes when the update changes nothing", async () => {
    const repo = new InMemoryProgressRepository();
    const save = vi.spyOn(repo, "saveLesson");
    const store = createProgressStore(repo, clock);
    store.getState().updateLesson("c", "l", (p, now) => visitStep(p, "s1", now));
    store.getState().updateLesson("c", "l", (p, now) => visitStep(p, "s1", now));
    await flush();
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("keeps progress made before hydration finished", async () => {
    const repo = new InMemoryProgressRepository({
      ...emptySnapshot(),
      lessons: { "c/old": createLessonProgress("c", "old", NOW) },
    });
    const store = createProgressStore(repo, clock);
    store.getState().updateLesson("c", "new", (p, now) => visitStep(p, "s1", now));
    await store.getState().hydrate();
    expect(Object.keys(store.getState().snapshot.lessons).sort()).toEqual(["c/new", "c/old"]);
  });

  it("flags failed saves and clears the flag after a successful one", async () => {
    let fail = true;
    const repo: ProgressRepository = {
      load: async () => emptySnapshot(),
      saveLesson: async () => {
        if (fail) throw new ProgressStorageError("full");
      },
      saveAssessment: async () => {},
      recordActivity: async () => {},
      clear: async () => {},
    };
    const store = createProgressStore(repo, clock);
    store.getState().updateLesson("c", "l", (p, now) => visitStep(p, "s1", now));
    await flush();
    expect(store.getState().saveFailed).toBe(true);
    // Progress stays usable in memory even if it could not be stored.
    expect(store.getState().snapshot.lessons["c/l"]?.currentStepId).toBe("s1");
    fail = false;
    store.getState().updateLesson("c", "l", (p, now) => visitStep(p, "s2", now));
    await flush();
    expect(store.getState().saveFailed).toBe(false);
  });

  it("still becomes ready if loading fails", async () => {
    const repo = new InMemoryProgressRepository();
    vi.spyOn(repo, "load").mockRejectedValue(new Error("boom"));
    const store = createProgressStore(repo, clock);
    await store.getState().hydrate();
    expect(store.getState().status).toBe("ready");
  });

  it("resets everything", async () => {
    const repo = new InMemoryProgressRepository();
    const store = createProgressStore(repo, clock);
    store.getState().updateLesson("c", "l", (p, now) => visitStep(p, "s1", now));
    await flush();
    await store.getState().reset();
    expect(store.getState().snapshot.lessons).toEqual({});
    expect((await repo.load()).lessons).toEqual({});
  });

  it("records assessment attempts, keeping the best score and the first pass", async () => {
    const repo = new InMemoryProgressRepository();
    const store = createProgressStore(repo, clock);
    store.getState().recordAssessment("c", 8, 10, true);
    store.getState().recordAssessment("c", 5, 10, false);
    await flush();
    const result = (await repo.load()).assessments["c"];
    expect(result).toMatchObject({ bestScore: 8, attempts: 2 });
    expect(result?.passedAt).not.toBeNull();
  });
});
