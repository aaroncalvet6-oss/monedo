import type { MonedoExpression } from "@/components/graphics/monedo-expressions";
import type { Block } from "@/content/schema";
import type { Step } from "@/features/lessons/lib/steps";

type BlockOf<T extends Block["type"]> = Extract<Block, { type: T }>;

/** Rich content Monedo shows inside the conversation (not a speech bubble). */
export type TutorCard =
  | { kind: "objective"; items: readonly string[]; minutes: number }
  | { kind: "example"; block: BlockOf<"example"> }
  | { kind: "key-figure"; block: BlockOf<"key-figure"> }
  | { kind: "interactive"; block: BlockOf<"interactive"> }
  | { kind: "key-ideas"; block: BlockOf<"key-ideas"> }
  | { kind: "challenge"; block: BlockOf<"challenge"> };

export type TutorMessage =
  | { id: string; kind: "bubble"; text: string; label?: string | undefined }
  | { id: string; kind: "card"; card: TutorCard };

/** What the learner can do after Monedo speaks. */
export type TutorPrompt =
  | { kind: "continue"; label: string }
  | { kind: "choice"; options: readonly { id: string; label: string }[] };

/** One turn of Monedo: messages shown together with one expression. */
export type TutorTurn = {
  expression: MonedoExpression;
  messages: readonly TutorMessage[];
};

export type TutorOpening = TutorTurn & { prompt: TutorPrompt };

export type TutorReaction = TutorTurn & {
  /** Quiz questions only: whether the answer was right. */
  correct?: boolean | undefined;
  /** The learner's reply that moves on after the reaction. */
  next: { kind: "continue"; label: string };
};

/**
 * Who speaks as Monedo in a lesson. The reader only talks to this interface.
 *
 * v1 is `ScriptedTutor`: every word comes from reviewed content in `src/content`.
 * A future model-backed tutor can implement the same methods (they are async for that
 * reason) without changes to the reader. See «Tutor con modelo (futuro)» in CLAUDE.md for what that
 * version needs before it can ship.
 */
export interface TutorProvider {
  /** Monedo opens a step: explains, shows a card or asks, and offers the learner a reply. */
  open(step: Step): Promise<TutorOpening>;
  /** Monedo reacts to the learner's choice on a question or decision step. */
  react(step: Step, optionId: string): Promise<TutorReaction>;
}
