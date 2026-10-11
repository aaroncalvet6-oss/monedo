import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getLesson } from "@/content";
import { MAX_PARAGRAPH_LENGTH } from "@/content/schema";
import { buildSteps } from "@/features/lessons/lib/steps";
import { ScriptedTutor } from "./scripted-tutor";

const lesson = getLesson("fundamentos-del-dinero", "el-dinero-es-tiempo")!;
const steps = buildSteps(lesson);
const tutor = new ScriptedTutor(lesson);

describe("ScriptedTutor on lesson 1.1", () => {
  it("gives every step a label, a title and something to read or do", async () => {
    for (const step of steps) {
      const section = await tutor.open(step);
      expect(section.label, step.id).not.toBe("");
      expect(section.title, step.id).not.toBe("");
      expect(
        section.paragraphs.length + (section.card ? 1 : 0) + (section.choice ? 1 : 0),
        step.id,
      ).toBeGreaterThan(0);
      const takesAnswer =
        step.kind === "question" || (step.kind === "block" && step.block.type === "decision");
      expect(Boolean(section.choice), step.id).toBe(takesAnswer);
    }
  });

  it("marks a right answer as correct and gives the right one after a mistake", async () => {
    const question = steps.find((s) => s.kind === "question")!;
    if (question.kind !== "question") throw new Error("no question");
    const right = await tutor.react(question, question.question.correctOptionId);
    expect(right).toMatchObject({ tone: "correct", title: "Correcto" });
    const wrongId = question.question.options.find(
      (o) => o.id !== question.question.correctOptionId,
    )!.id;
    const wrong = await tutor.react(question, wrongId);
    expect(wrong.tone).toBe("incorrect");
    expect(wrong.title).toContain("«7 horas»");
    expect(wrong.paragraphs).toContain(question.question.explanation);
  });

  it("explains the consequence of a decision without judging it", async () => {
    const decision = steps.find((s) => s.kind === "block" && s.block.type === "decision")!;
    const feedback = await tutor.react(decision, "no-comprar");
    expect(feedback.tone).toBe("info");
    expect(feedback.paragraphs).toHaveLength(2);
  });

  it("is deterministic and keeps paragraphs short", async () => {
    for (const step of steps) {
      const section = await tutor.open(step);
      expect(section).toEqual(await new ScriptedTutor(lesson).open(step));
      for (const p of [...section.paragraphs, ...section.after]) {
        expect(p.length, step.id).toBeLessThanOrEqual(MAX_PARAGRAPH_LENGTH);
      }
    }
  });
});

describe("no character, no «IA»", () => {
  function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) ? [path] : [];
    });
  }
  const sources = files(join(process.cwd(), "src")).filter((f) => !/\.test\.tsx?$/.test(f));

  it('never says "IA" in content or interface', () => {
    const offenders = sources.filter((f) => /["'`«][^"'`»\n]*\bIA\b/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("has no mascot or character left in the code", () => {
    const offenders = sources.filter((f) =>
      /MonedoCharacter|monedo-expressions|«Monedo, tu guía»|Monedo, tu guía/.test(
        readFileSync(f, "utf8"),
      ),
    );
    expect(offenders).toEqual([]);
  });
});
