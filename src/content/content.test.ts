import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { elDineroEsTiempo } from "./courses/fundamentos-del-dinero/el-dinero-es-tiempo";
import {
  getAdjacentLessons,
  getCourse,
  getCourses,
  getLesson,
  getLessonParams,
  getPublishedCourses,
  getUpcomingCourses,
  isPublished,
} from "./index";
import { lessonSchema } from "./schema";

describe("content registry", () => {
  it("loads the five courses in order", () => {
    expect(getCourses().map((c) => c.slug)).toEqual([
      "fundamentos-del-dinero",
      "tu-primer-sueldo",
      "bancos-y-pagos",
      "ahorro-e-inversion",
      "que-no-te-estafen",
    ]);
  });

  it("has the agreed syllabus sizes", () => {
    expect(getCourse("fundamentos-del-dinero")?.lessons).toHaveLength(6);
    expect(getCourse("tu-primer-sueldo")?.lessons).toHaveLength(5);
  });

  it("publishes a course only when every lesson is written", () => {
    for (const course of getCourses()) {
      const written = course.lessons.every((l) => getLesson(course.slug, l.slug));
      expect(isPublished(course), course.slug).toBe(written && !course.draft);
    }
    expect(getPublishedCourses().map((c) => c.slug)).toEqual([
      "fundamentos-del-dinero",
      "tu-primer-sueldo",
    ]);
    expect(getUpcomingCourses().map((c) => c.slug)).not.toContain("fundamentos-del-dinero");
  });

  it("publishes course 2 once reviewed: no draft flag left on a published course", () => {
    expect(isPublished(getCourse("tu-primer-sueldo")!)).toBe(true);
    for (const course of getPublishedCourses()) expect(course.draft, course.slug).toBe(false);
  });

  it("never shows drafts in the deployed site", () => {
    const workflow = readFileSync(join(process.cwd(), ".github/workflows/deploy.yml"), "utf8");
    expect(workflow).not.toContain("SHOW_DRAFTS");
  });

  it("generates pages only for lessons of published courses", () => {
    const published = new Set(getPublishedCourses().map((c) => c.slug));
    for (const { curso } of getLessonParams()) expect(published.has(curso)).toBe(true);
  });

  it("exposes lesson 1.1 for static generation", () => {
    expect(getLessonParams()).toContainEqual({
      curso: "fundamentos-del-dinero",
      leccion: "el-dinero-es-tiempo",
    });
    expect(
      getLesson("fundamentos-del-dinero", "el-dinero-es-tiempo")?.blocks.length,
    ).toBeGreaterThan(5);
  });

  it("finds syllabus neighbours", () => {
    const { previous, next } = getAdjacentLessons("fundamentos-del-dinero", "el-dinero-es-tiempo");
    expect(previous).toBeUndefined();
    expect(next?.slug).toBe("inflacion");
  });

  it("uses every block type in lesson 1.1 (the reader's reference lesson)", () => {
    const types = new Set(
      getLesson("fundamentos-del-dinero", "el-dinero-es-tiempo")?.blocks.map((b) => b.type),
    );
    expect([...types].sort()).toEqual([
      "challenge",
      "decision",
      "example",
      "interactive",
      "key-figure",
      "key-ideas",
      "objective",
      "quiz",
      "text",
    ]);
  });
});

describe("lesson schema rules", () => {
  const valid = structuredClone(elDineroEsTiempo);

  it("accepts lesson 1.1", () => {
    expect(lessonSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a correct answer that is not an option", () => {
    const broken = structuredClone(valid);
    const quiz = broken.blocks.find((b) => b.type === "quiz");
    if (quiz?.type !== "quiz") throw new Error("fixture");
    quiz.questions[0]!.correctOptionId = "z";
    expect(lessonSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects duplicate block ids", () => {
    const broken = structuredClone(valid);
    broken.blocks[1]!.id = "objetivo";
    expect(lessonSchema.safeParse(broken).success).toBe(false);
  });

  it("requires 3 to 5 quiz questions", () => {
    const broken = structuredClone(valid);
    const quiz = broken.blocks.find((b) => b.type === "quiz");
    if (quiz?.type !== "quiz") throw new Error("fixture");
    quiz.questions = quiz.questions.slice(0, 2);
    expect(lessonSchema.safeParse(broken).success).toBe(false);
  });

  it("requires exactly three key ideas", () => {
    const broken = structuredClone(valid) as { blocks: { type: string; items?: string[] }[] };
    const ideas = broken.blocks.find((b) => b.type === "key-ideas");
    ideas!.items = ["solo una"];
    expect(lessonSchema.safeParse(broken).success).toBe(false);
  });

  it("requires the objective first and a challenge", () => {
    const noChallenge = { ...valid, blocks: valid.blocks.filter((b) => b.type !== "challenge") };
    expect(lessonSchema.safeParse(noChallenge).success).toBe(false);
    const reordered = { ...valid, blocks: [...valid.blocks].reverse() };
    expect(lessonSchema.safeParse(reordered).success).toBe(false);
  });

  it("does not mention specific financial brands", () => {
    const json = JSON.stringify(getCourses()) + JSON.stringify(valid);
    // Representative list; extend when new content names entities.
    for (const brand of [
      "Santander",
      "BBVA",
      "CaixaBank",
      "ING",
      "Revolut",
      "eToro",
      "Binance",
      "Trade Republic",
    ]) {
      expect(json).not.toContain(brand);
    }
  });
});
