import { z } from "zod";
import { MONEDO_EXPRESSIONS } from "@/components/graphics/monedo-expressions";

/** Kebab-case identifiers used in URLs and progress keys. */
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case");
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case ids");
const text = z.string().trim().min(1);
const paragraphs = z.array(text).min(1);

// ---------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------

export const objectiveBlockSchema = z.object({
  type: z.literal("objective"),
  id,
  /** Completes the sentence "Al terminar sabrás…". */
  items: z.array(text).min(1).max(4),
});

export const textBlockSchema = z.object({
  type: z.literal("text"),
  id,
  title: text,
  /** One idea per screen: keep it to 1–3 short paragraphs. */
  paragraphs: paragraphs.max(3),
});

export const exampleBlockSchema = z.object({
  type: z.literal("example"),
  id,
  title: text,
  /** The young person in the story, e.g. "Lucía, 17 años". */
  character: text,
  paragraphs: paragraphs.max(4),
  /** Worked figures shown as a small ledger. Amounts in euros unless `unit` is given. */
  figures: z
    .array(
      z.object({
        label: text,
        value: z.number().finite(),
        unit: z.string().optional(),
        fractionDigits: z.number().int().min(0).max(2).optional(),
        emphasis: z.boolean().optional(),
      }),
    )
    .max(5)
    .optional(),
});

export const keyFigureBlockSchema = z.object({
  type: z.literal("key-figure"),
  id,
  value: z.number().finite(),
  fractionDigits: z.number().int().min(0).max(2).default(0),
  unit: z.string().optional(),
  context: text,
  source: z.string().optional(),
});

/** Interactive widgets are referenced by id; each widget validates its own props. */
export const workHoursWidgetSchema = z.object({
  widget: z.literal("work-hours"),
  defaultPrice: z.number().positive(),
  defaultHourlyWage: z.number().positive(),
});

export const interactiveBlockSchema = z.object({
  type: z.literal("interactive"),
  id,
  title: text,
  instructions: text,
  config: z.discriminatedUnion("widget", [workHoursWidgetSchema]),
});

export const decisionBlockSchema = z.object({
  type: z.literal("decision"),
  id,
  title: text,
  situation: text,
  options: z
    .array(
      z.object({
        id,
        label: text,
        consequence: text,
      }),
    )
    .min(2)
    .max(4),
  /** Shown after any choice: there is no single "right" decision, only trade-offs. */
  takeaway: text,
});

export const keyIdeasBlockSchema = z.object({
  type: z.literal("key-ideas"),
  id,
  items: z.tuple([text, text, text]),
});

export const quizQuestionSchema = z.object({
  id,
  prompt: text,
  options: z.array(z.object({ id, text })).min(2).max(4),
  correctOptionId: id,
  explanation: text,
});

export const quizBlockSchema = z.object({
  type: z.literal("quiz"),
  id,
  questions: z.array(quizQuestionSchema).min(3).max(5),
});

export const challengeBlockSchema = z.object({
  type: z.literal("challenge"),
  id,
  title: text,
  description: text,
  steps: z.array(text).min(1).max(5),
});

export const blockSchema = z.discriminatedUnion("type", [
  objectiveBlockSchema,
  textBlockSchema,
  exampleBlockSchema,
  keyFigureBlockSchema,
  interactiveBlockSchema,
  decisionBlockSchema,
  keyIdeasBlockSchema,
  quizBlockSchema,
  challengeBlockSchema,
]);

// ---------------------------------------------------------------------------
// Tutor script: what Monedo says in the conversational reader
// ---------------------------------------------------------------------------

/** Longest text Monedo may say in one bubble. Short bubbles read like a chat, not a page. */
export const MAX_BUBBLE_LENGTH = 220;
const bubble = text.max(MAX_BUBBLE_LENGTH, `Bubbles are at most ${MAX_BUBBLE_LENGTH} characters`);

/**
 * Optional per-step script, keyed by block id or quiz question id. Anything left out falls
 * back to the block's own text (paragraphs, situation, question prompt…), which must then
 * also fit in a bubble.
 */
export const tutorStepSchema = z.object({
  expression: z.enum(MONEDO_EXPRESSIONS).optional(),
  /** Monedo's bubbles. Text blocks: instead of the paragraphs. Others: before the card. */
  say: z.array(bubble).min(1).max(4).optional(),
  /** Bubbles after the card (example, key figure, widget, ideas, challenge). */
  after: z.array(bubble).min(1).max(3).optional(),
  /** The learner's tap-to-continue reply, e.g. «¿Y cómo se calcula?». */
  reply: z.string().trim().min(1).max(40).optional(),
  /** Quiz questions: Monedo's first reaction; the explanation follows. */
  correct: bubble.optional(),
  wrong: bubble.optional(),
});

// ---------------------------------------------------------------------------
// Lessons and courses
// ---------------------------------------------------------------------------

export const lessonSchema = z
  .object({
    slug,
    title: text,
    summary: text,
    minutes: z.number().int().min(3).max(10),
    blocks: z.array(blockSchema).min(3),
    tutor: z.record(id, tutorStepSchema).default({}),
  })
  .superRefine((lesson, ctx) => {
    const seen = new Set<string>();
    const add = (key: string, path: (string | number)[]) => {
      if (seen.has(key)) ctx.addIssue({ code: "custom", message: `Duplicate id "${key}"`, path });
      seen.add(key);
    };

    lesson.blocks.forEach((block, index) => {
      add(block.id, ["blocks", index, "id"]);
      if (block.type === "quiz") {
        block.questions.forEach((question, q) => {
          add(question.id, ["blocks", index, "questions", q, "id"]);
          const optionIds = question.options.map((o) => o.id);
          if (new Set(optionIds).size !== optionIds.length) {
            ctx.addIssue({
              code: "custom",
              message: `Duplicate option ids in question "${question.id}"`,
              path: ["blocks", index, "questions", q, "options"],
            });
          }
          if (!optionIds.includes(question.correctOptionId)) {
            ctx.addIssue({
              code: "custom",
              message: `correctOptionId "${question.correctOptionId}" is not an option`,
              path: ["blocks", index, "questions", q, "correctOptionId"],
            });
          }
        });
      }
    });

    const types = lesson.blocks.map((b) => b.type);
    const required = ["objective", "key-ideas", "quiz", "challenge"] as const;
    for (const type of required) {
      if (!types.includes(type)) {
        ctx.addIssue({
          code: "custom",
          message: `Lesson needs a "${type}" block`,
          path: ["blocks"],
        });
      }
    }
    if (types[0] !== "objective") {
      ctx.addIssue({
        code: "custom",
        message: "First block must be the objective",
        path: ["blocks", 0],
      });
    }
    if (types.filter((t) => t === "quiz").length > 1) {
      ctx.addIssue({ code: "custom", message: "Only one quiz block per lesson", path: ["blocks"] });
    }

    // Tutor script: keys must be real steps, and every fallback text must fit in a bubble.
    for (const key of Object.keys(lesson.tutor)) {
      if (!seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          message: `Tutor key "${key}" is not a step`,
          path: ["tutor", key],
        });
      }
    }
    const long = (value: string, path: (string | number)[]) => {
      if (value.length > MAX_BUBBLE_LENGTH) {
        ctx.addIssue({
          code: "custom",
          message: `Too long for a bubble (${value.length} > ${MAX_BUBBLE_LENGTH}); shorten it or script it in "tutor"`,
          path,
        });
      }
    };
    lesson.blocks.forEach((block, index) => {
      const scripted = lesson.tutor[block.id]?.say !== undefined;
      if (block.type === "text" && !scripted) {
        block.paragraphs.forEach((p, i) => long(p, ["blocks", index, "paragraphs", i]));
      }
      if (block.type === "example" && !scripted) {
        block.paragraphs.forEach((p, i) => long(p, ["blocks", index, "paragraphs", i]));
      }
      if (block.type === "decision") {
        if (!scripted) long(block.situation, ["blocks", index, "situation"]);
        block.options.forEach((o, i) => long(o.consequence, ["blocks", index, "options", i]));
        long(block.takeaway, ["blocks", index, "takeaway"]);
      }
      if (block.type === "interactive" && !scripted) long(block.instructions, ["blocks", index]);
      if (block.type === "quiz") {
        block.questions.forEach((q, i) => {
          if (lesson.tutor[q.id]?.say === undefined)
            long(q.prompt, ["blocks", index, "questions", i]);
          long(q.explanation, ["blocks", index, "questions", i, "explanation"]);
        });
      }
    });
  });

/** Syllabus entry. `content` is present once the lesson is written. */
export const lessonEntrySchema = z.object({
  slug,
  title: text,
  summary: text,
  minutes: z.number().int().min(3).max(10),
});

export const courseSchema = z
  .object({
    slug,
    order: z.number().int().positive(),
    title: text,
    tagline: text,
    description: text,
    level: z.enum(["Básico", "Intermedio"]),
    status: z.enum(["available", "coming-soon"]),
    outcomes: z.array(text).min(3).max(6),
    lessons: z.array(lessonEntrySchema).min(1),
  })
  .superRefine((course, ctx) => {
    const slugs = course.lessons.map((l) => l.slug);
    if (new Set(slugs).size !== slugs.length) {
      ctx.addIssue({ code: "custom", message: "Duplicate lesson slugs", path: ["lessons"] });
    }
  });

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type LessonInput = z.input<typeof lessonSchema>;
export type TutorStep = z.infer<typeof tutorStepSchema>;
export type LessonEntry = z.infer<typeof lessonEntrySchema>;
export type Course = z.infer<typeof courseSchema>;
export type CourseInput = z.input<typeof courseSchema>;
export type InteractiveConfig = z.infer<typeof interactiveBlockSchema>["config"];
