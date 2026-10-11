import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getLesson } from "@/content";
import { MAX_BUBBLE_LENGTH } from "@/content/schema";
import { buildSteps } from "@/features/lessons/lib/steps";
import { ScriptedTutor } from "./scripted-tutor";
import type { TutorTurn } from "./types";

const lesson = getLesson("fundamentos-del-dinero", "el-dinero-es-tiempo")!;
const steps = buildSteps(lesson);
const tutor = new ScriptedTutor(lesson);

describe("ScriptedTutor on lesson 1.1", () => {
  it("opens every step with something to say and a way to go on", async () => {
    for (const step of steps) {
      const opening = await tutor.open(step);
      expect(opening.messages.length, step.id).toBeGreaterThan(0);
      if (step.kind === "question" || (step.kind === "block" && step.block.type === "decision")) {
        expect(opening.prompt.kind).toBe("choice");
      } else {
        expect(opening.prompt.kind).toBe("continue");
      }
    }
  });

  it("greets as Monedo, your guide, and ends with the finish reply", async () => {
    const first = await tutor.open(steps[0]!);
    expect(first.messages[0]).toMatchObject({
      kind: "bubble",
      text: expect.stringContaining("Monedo"),
    });
    const last = await tutor.open(steps.at(-1)!);
    expect(last.prompt).toEqual({ kind: "continue", label: "Terminar lección" });
  });

  it("celebrates a right answer and says «uy» with the right one on a wrong answer", async () => {
    const question = steps.find((s) => s.kind === "question")!;
    if (question.kind !== "question") throw new Error("no question");
    const right = await tutor.react(question, question.question.correctOptionId);
    expect(right).toMatchObject({ expression: "celebrating", correct: true });

    const wrongId = question.question.options.find(
      (o) => o.id !== question.question.correctOptionId,
    )!.id;
    const wrong = await tutor.react(question, wrongId);
    expect(wrong).toMatchObject({ expression: "oops", correct: false });
    const texts = wrong.messages.map((m) => (m.kind === "bubble" ? m.text : ""));
    expect(texts[0]).toMatch(/^Uy/);
    expect(texts.join(" ")).toContain("«7 horas»");
    expect(texts.join(" ")).toContain(question.question.explanation);
  });

  it("explains the consequence of a decision without judging it", async () => {
    const decision = steps.find((s) => s.kind === "block" && s.block.type === "decision")!;
    const reaction = await tutor.react(decision, "no-comprar");
    expect(reaction.expression).toBe("explaining");
    expect(reaction.messages).toHaveLength(2);
  });

  it("is deterministic: the same step always says the same thing", async () => {
    for (const step of steps) {
      expect(await tutor.open(step)).toEqual(await new ScriptedTutor(lesson).open(step));
    }
  });

  it("keeps every bubble short", async () => {
    for (const step of steps) {
      const turns: TutorTurn[] = [await tutor.open(step)];
      if (step.kind === "question") {
        for (const o of step.question.options) turns.push(await tutor.react(step, o.id));
      }
      for (const turn of turns) {
        for (const m of turn.messages) {
          if (m.kind === "bubble")
            expect(m.text.length, m.id).toBeLessThanOrEqual(MAX_BUBBLE_LENGTH + 40);
        }
      }
    }
  });
});

describe("naming", () => {
  function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) ? [path] : [];
    });
  }

  it('never calls Monedo an "IA" in content or interface', () => {
    const offenders = files(join(process.cwd(), "src"))
      .filter((f) => !f.endsWith(".test.ts"))
      .filter((f) => /["'`«][^"'`»\n]*\bIA\b/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
