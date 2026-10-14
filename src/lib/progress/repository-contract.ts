import { describe, expect, it } from "vitest";
import { recordAttempt } from "./assessment-progress";
import { createLessonProgress, lessonKey } from "./lesson-progress";
import type { ProgressRepository } from "./types";

const NOW = new Date("2026-10-09T10:00:00.000Z");

/**
 * Behaviour every ProgressRepository must have. Run it for each implementation
 * (in-memory, localStorage and, in v2, Supabase) so they stay interchangeable.
 */
export function describeProgressRepositoryContract(
  name: string,
  create: () => ProgressRepository,
): void {
  describe(`${name} (ProgressRepository contract)`, () => {
    it("starts empty", async () => {
      const snapshot = await create().load();
      expect(snapshot).toEqual({ version: 1, lessons: {}, activityDays: [], assessments: {} });
    });

    it("saves and loads a lesson", async () => {
      const repo = create();
      const progress = {
        ...createLessonProgress("fundamentos-del-dinero", "el-dinero-es-tiempo", NOW),
        currentStepId: "ejemplo-lucia",
        completedStepIds: ["objetivo"],
        answers: { "q-precio-real": "b" },
      };
      await repo.saveLesson(progress);
      const snapshot = await repo.load();
      expect(snapshot.lessons[lessonKey("fundamentos-del-dinero", "el-dinero-es-tiempo")]).toEqual(
        progress,
      );
    });

    it("replaces a lesson instead of duplicating it", async () => {
      const repo = create();
      const first = createLessonProgress("c", "l", NOW);
      await repo.saveLesson(first);
      await repo.saveLesson({ ...first, currentStepId: "paso-2" });
      const { lessons } = await repo.load();
      expect(Object.keys(lessons)).toEqual(["c/l"]);
      expect(lessons["c/l"]?.currentStepId).toBe("paso-2");
    });

    it("keeps lessons from different courses apart", async () => {
      const repo = create();
      await repo.saveLesson(createLessonProgress("curso-a", "intro", NOW));
      await repo.saveLesson(createLessonProgress("curso-b", "intro", NOW));
      expect(Object.keys((await repo.load()).lessons).sort()).toEqual([
        "curso-a/intro",
        "curso-b/intro",
      ]);
    });

    it("records activity days once, sorted", async () => {
      const repo = create();
      await repo.recordActivity("2026-10-09");
      await repo.recordActivity("2026-10-07");
      await repo.recordActivity("2026-10-09");
      expect((await repo.load()).activityDays).toEqual(["2026-10-07", "2026-10-09"]);
    });

    it("returns copies: mutating a loaded snapshot does not change stored data", async () => {
      const repo = create();
      await repo.saveLesson(createLessonProgress("c", "l", NOW));
      const loaded = await repo.load();
      loaded.lessons["c/l"]!.completedStepIds.push("hack");
      loaded.activityDays.push("2000-01-01");
      const again = await repo.load();
      expect(again.lessons["c/l"]?.completedStepIds).toEqual([]);
      expect(again.activityDays).toEqual([]);
    });

    it("does not keep a reference to the saved object", async () => {
      const repo = create();
      const progress = createLessonProgress("c", "l", NOW);
      await repo.saveLesson(progress);
      progress.completedStepIds.push("later-mutation");
      expect((await repo.load()).lessons["c/l"]?.completedStepIds).toEqual([]);
    });

    it("saves an assessment result per course and replaces it", async () => {
      const repo = create();
      const result = recordAttempt(undefined, "c", 8, 10, true, NOW);
      await repo.saveAssessment(result);
      await repo.saveAssessment(recordAttempt(result, "c", 6, 10, false, NOW));
      await repo.saveAssessment(recordAttempt(undefined, "d", 3, 8, false, NOW));
      const { assessments } = await repo.load();
      expect(Object.keys(assessments).sort()).toEqual(["c", "d"]);
      expect(assessments["c"]).toMatchObject({ bestScore: 8, attempts: 2 });
      expect(assessments["c"]?.passedAt).toBe(NOW.toISOString());
    });

    it("clears everything", async () => {
      const repo = create();
      await repo.saveLesson(createLessonProgress("c", "l", NOW));
      await repo.recordActivity("2026-10-09");
      await repo.saveAssessment(recordAttempt(undefined, "c", 8, 10, true, NOW));
      await repo.clear();
      expect(await repo.load()).toEqual({
        version: 1,
        lessons: {},
        activityDays: [],
        assessments: {},
      });
    });
  });
}
