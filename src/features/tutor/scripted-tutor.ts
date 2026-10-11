import type { Lesson, TutorStep } from "@/content/schema";
import { stepLabel, type Step } from "@/features/lessons/lib/steps";
import type { TutorCard, TutorFeedback, TutorProvider, TutorSection } from "./types";

/**
 * Lesson text from the written content: each block's own text, plus the optional short
 * lines in `lesson.tutor`. Deterministic and offline: the same step always reads the same.
 */
export class ScriptedTutor implements TutorProvider {
  constructor(private readonly lesson: Lesson) {}

  async open(step: Step): Promise<TutorSection> {
    return this.section(step);
  }

  async react(step: Step, optionId: string): Promise<TutorFeedback> {
    return this.feedback(step, optionId);
  }

  /** Synchronous core of `open` (handy in tests). */
  section(step: Step): TutorSection {
    const script = this.script(step.id);
    const label = stepLabel(step);
    const after = script.after ?? [];

    if (step.kind === "question") {
      const { question } = step;
      return {
        label,
        title: question.prompt,
        paragraphs: script.say ?? [],
        after,
        choice: {
          kind: "question",
          options: question.options.map((o) => ({ id: o.id, label: o.text })),
        },
      };
    }

    const { block } = step;
    const withCard = (title: string, card: TutorCard, fallback: readonly string[] = []) => ({
      label,
      title,
      paragraphs: script.say ?? fallback,
      card,
      after,
    });
    switch (block.type) {
      case "objective":
        return withCard("Al terminar sabrás…", {
          kind: "objective",
          items: block.items,
          minutes: this.lesson.minutes,
        });
      case "text":
        return { label, title: block.title, paragraphs: script.say ?? block.paragraphs, after };
      case "example":
        // The character goes in the label so the reader meets them before the story.
        return {
          ...withCard(block.title, { kind: "example", block }, block.paragraphs),
          label: `${label} · ${block.character}`,
        };
      case "key-figure":
        return withCard("Dato clave", { kind: "key-figure", block });
      case "interactive":
        return withCard(block.title, { kind: "interactive", block }, [block.instructions]);
      case "key-ideas":
        return withCard("Lo que te llevas", { kind: "key-ideas", block });
      case "challenge":
        return withCard(block.title, { kind: "challenge", block }, [block.description]);
      case "decision":
        return {
          label,
          title: block.title,
          paragraphs: script.say ?? [block.situation],
          after,
          choice: {
            kind: "decision",
            options: block.options.map((o) => ({ id: o.id, label: o.label })),
          },
        };
    }
  }

  /** Synchronous core of `react`. */
  feedback(step: Step, optionId: string): TutorFeedback {
    if (step.kind === "question") {
      const { question } = step;
      if (optionId === question.correctOptionId) {
        return { tone: "correct", title: "Correcto", paragraphs: [question.explanation] };
      }
      const answer = question.options.find((o) => o.id === question.correctOptionId)?.text ?? "";
      return {
        tone: "incorrect",
        title: `No es correcto. La respuesta es «${answer}».`,
        paragraphs: [question.explanation],
      };
    }
    if (step.block.type === "decision") {
      const option = step.block.options.find((o) => o.id === optionId);
      if (!option) throw new Error(`Unknown option "${optionId}" in "${step.id}"`);
      return {
        tone: "info",
        title: "Qué pasa",
        paragraphs: [option.consequence, step.block.takeaway],
      };
    }
    throw new Error(`Step "${step.id}" takes no answer`);
  }

  private script(stepId: string): TutorStep {
    return this.lesson.tutor[stepId] ?? {};
  }
}
