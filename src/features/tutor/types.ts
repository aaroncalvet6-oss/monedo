import type { Block } from "@/content/schema";
import type { Step } from "@/features/lessons/lib/steps";

type BlockOf<T extends Block["type"]> = Extract<Block, { type: T }>;

/** Structured content shown inside a section: a ledger, a key figure, a widget… */
export type TutorCard =
  | { kind: "objective"; items: readonly string[]; minutes: number }
  | { kind: "example"; block: BlockOf<"example"> }
  | { kind: "key-figure"; block: BlockOf<"key-figure"> }
  | { kind: "interactive"; block: BlockOf<"interactive"> }
  | { kind: "key-ideas"; block: BlockOf<"key-ideas"> }
  | { kind: "challenge"; block: BlockOf<"challenge"> };

/** One section of a lesson, ready to render. */
export type TutorSection = {
  /** Small label above the title: «Idea», «Ejemplo», «Pregunta 2 de 4»… */
  label: string;
  title: string;
  /** Short paragraphs before the card. */
  paragraphs: readonly string[];
  card?: TutorCard | undefined;
  /** Short paragraphs after the card. */
  after: readonly string[];
  /** Questions and decisions: the options to choose from. */
  choice?:
    | { kind: "question" | "decision"; options: readonly { id: string; label: string }[] }
    | undefined;
};

/** What the learner sees after answering a question or making a decision. */
export type TutorFeedback = {
  tone: "correct" | "incorrect" | "info";
  title: string;
  paragraphs: readonly string[];
};

/**
 * Where the words of a lesson come from. The reader only talks to this interface.
 *
 * v1 is `ScriptedTutor`: every word comes from reviewed content in `src/content`.
 * A future model-backed tutor can implement the same methods (they are async for that
 * reason) without changes to the reader. See «Tutor con modelo (futuro)» in CLAUDE.md for
 * what that version needs before it can ship.
 */
export interface TutorProvider {
  /** The section for a step: title, short text, card and, if any, the options. */
  open(step: Step): Promise<TutorSection>;
  /** Feedback on the learner's answer to a question or choice in a decision. */
  react(step: Step, optionId: string): Promise<TutorFeedback>;
}
