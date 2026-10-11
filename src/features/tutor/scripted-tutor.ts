import type { MonedoExpression } from "@/components/graphics/monedo-expressions";
import type { Lesson, TutorStep } from "@/content/schema";
import type { Step } from "@/features/lessons/lib/steps";
import type {
  TutorCard,
  TutorMessage,
  TutorOpening,
  TutorPrompt,
  TutorProvider,
  TutorReaction,
} from "./types";

const CONTINUE = "Continuar";

/**
 * Monedo speaking from the lesson's written script (`lesson.tutor`), falling back to the
 * blocks' own text. Deterministic and offline: the same step always says the same thing.
 */
export class ScriptedTutor implements TutorProvider {
  constructor(private readonly lesson: Lesson) {}

  async open(step: Step): Promise<TutorOpening> {
    return this.openSync(step);
  }

  async react(step: Step, optionId: string): Promise<TutorReaction> {
    return this.reactSync(step, optionId);
  }

  /** Synchronous core of `open` (handy in tests). */
  openSync(step: Step): TutorOpening {
    const script = this.script(step.id);
    const bubbles = (texts: readonly string[], label?: string): TutorMessage[] =>
      texts.map((text, i) => ({
        id: `${step.id}:say:${i}`,
        kind: "bubble",
        text,
        label: i === 0 ? label : undefined,
      }));
    const card = (value: TutorCard): TutorMessage => ({
      id: `${step.id}:card`,
      kind: "card",
      card: value,
    });
    const after = bubbles(script.after ?? []).map((m) => ({
      ...m,
      id: m.id.replace(":say:", ":after:"),
    }));
    const proceed: TutorPrompt = { kind: "continue", label: script.reply ?? CONTINUE };

    if (step.kind === "question") {
      const { question } = step;
      return {
        expression: script.expression ?? "thinking",
        messages: bubbles(
          script.say ?? [question.prompt],
          `Pregunta ${step.number} de ${step.total}`,
        ),
        prompt: {
          kind: "choice",
          options: question.options.map((o) => ({ id: o.id, label: o.text })),
        },
      };
    }

    const { block } = step;
    const turn = (fallbackExpression: MonedoExpression, messages: TutorMessage[]) => ({
      expression: script.expression ?? fallbackExpression,
      messages,
      prompt: proceed,
    });
    switch (block.type) {
      case "objective":
        return turn("normal", [
          ...bubbles(script.say ?? []),
          card({ kind: "objective", items: block.items, minutes: this.lesson.minutes }),
          ...after,
        ]);
      case "text":
        return turn("explaining", [...bubbles(script.say ?? block.paragraphs), ...after]);
      case "example":
        return turn("explaining", [
          ...bubbles(script.say ?? block.paragraphs),
          card({ kind: "example", block }),
          ...after,
        ]);
      case "key-figure":
        return turn("explaining", [
          ...bubbles(script.say ?? []),
          card({ kind: "key-figure", block }),
          ...after,
        ]);
      case "interactive":
        return turn("normal", [
          ...bubbles(script.say ?? [block.instructions]),
          card({ kind: "interactive", block }),
          ...after,
        ]);
      case "key-ideas":
        return turn("normal", [
          ...bubbles(script.say ?? []),
          card({ kind: "key-ideas", block }),
          ...after,
        ]);
      case "challenge":
        return turn("normal", [
          ...bubbles(script.say ?? []),
          card({ kind: "challenge", block }),
          ...after,
        ]);
      case "decision":
        return {
          expression: script.expression ?? "thinking",
          messages: bubbles(script.say ?? [block.situation]),
          prompt: {
            kind: "choice",
            options: block.options.map((o) => ({ id: o.id, label: o.label })),
          },
        };
    }
  }

  reactSync(step: Step, optionId: string): TutorReaction {
    const script = this.script(step.id);
    const message = (suffix: string, text: string): TutorMessage => ({
      id: `${step.id}:react:${suffix}`,
      kind: "bubble",
      text,
    });
    const nextLabel =
      script.reply ??
      (step.kind === "question" && step.number < step.total ? "Siguiente pregunta" : CONTINUE);
    const next = { kind: "continue", label: nextLabel } as const;

    if (step.kind === "question") {
      const { question } = step;
      const correct = optionId === question.correctOptionId;
      const answer = question.options.find((o) => o.id === question.correctOptionId)?.text ?? "";
      return {
        expression: correct ? "celebrating" : "oops",
        correct,
        messages: correct
          ? [
              message("verdict", script.correct ?? "Correcto."),
              message("why", question.explanation),
            ]
          : [
              message("verdict", script.wrong ?? "Esa no era."),
              message("answer", `La respuesta correcta es «${answer}».`),
              message("why", question.explanation),
            ],
        next,
      };
    }
    if (step.block.type === "decision") {
      const option = step.block.options.find((o) => o.id === optionId);
      if (!option) throw new Error(`Unknown option "${optionId}" in "${step.id}"`);
      return {
        expression: "explaining",
        messages: [
          message("consequence", option.consequence),
          message("takeaway", step.block.takeaway),
        ],
        next,
      };
    }
    throw new Error(`Step "${step.id}" takes no answer`);
  }

  private script(stepId: string): TutorStep {
    return this.lesson.tutor[stepId] ?? {};
  }
}
