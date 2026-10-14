import { z } from "zod";

/** Kebab-case identifiers used in URLs and progress keys. */
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case");
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case ids");
const text = z.string().trim().min(1);
const paragraphs = z.array(text).min(1);

/**
 * Official sources lessons may link to (approved list, see docs/fuentes.md). A link to any
 * other domain fails validation, so a secondary source can never reach a learner.
 */
export const OFFICIAL_DOMAINS = [
  "agenciatributaria.gob.es",
  "seg-social.es",
  "boe.es",
  "sepe.es",
  "trabajo.gob.es",
  "mites.gob.es",
  "ine.es",
  "bde.es",
  "cnmv.es",
  "finanzasparatodos.es",
  "fgd.es",
  "consumo.gob.es",
  "cnmc.es",
  "educacionfpydeportes.gob.es",
  "ecb.europa.eu",
  "incibe.es",
  "aepd.es",
  "policia.es",
  "guardiacivil.es",
] as const;

const officialSource = z.object({
  /** What the learner will find there, e.g. «Agencia Tributaria: quién está obligado a declarar». */
  label: text,
  url: z.url().refine((value) => {
    const host = new URL(value).hostname;
    return OFFICIAL_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
  }, "Only official sources (OFFICIAL_DOMAINS) can be linked from a lesson"),
});
/** Up to three official links shown under a section («Fuente oficial»). */
const sources = z.array(officialSource).min(1).max(3).optional();

/** Published tools a lesson can link to (registry in features/tools/tools.ts). */
export const TOOL_IDS = [
  "horas-de-trabajo",
  "interes-compuesto",
  "presupuesto",
  "meta-de-ahorro",
] as const;
export type ToolId = (typeof TOOL_IDS)[number];

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
  sources,
  /** A tool to practise this section, linked under it. The tool links back to this lesson. */
  tool: z.enum(TOOL_IDS).optional(),
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
  sources,
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
// Tutor script: optional short lines per section
// ---------------------------------------------------------------------------

/** Longest paragraph in a lesson section. Short paragraphs read fast on a phone. */
export const MAX_PARAGRAPH_LENGTH = 220;
const shortParagraph = text.max(
  MAX_PARAGRAPH_LENGTH,
  `Paragraphs are at most ${MAX_PARAGRAPH_LENGTH} characters`,
);

/**
 * Optional per-section lines, keyed by block id or quiz question id. Anything left out
 * falls back to the block's own text (paragraphs, situation, question prompt…), which
 * must then also be short.
 */
export const tutorStepSchema = z.object({
  /** Short paragraphs. Text blocks: instead of the paragraphs. Others: before the card. */
  say: z.array(shortParagraph).min(1).max(4).optional(),
  /** Short paragraphs after the card (example, key figure, widget, ideas, challenge). */
  after: z.array(shortParagraph).min(1).max(3).optional(),
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

    // Tutor script: keys must be real steps, and every fallback text must be short.
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
      if (value.length > MAX_PARAGRAPH_LENGTH) {
        ctx.addIssue({
          code: "custom",
          message: `Too long for a lesson paragraph (${value.length} > ${MAX_PARAGRAPH_LENGTH}); shorten it or script it in "tutor"`,
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

/** Learning areas, in the order the home page and catalogue show them. */
export const AREAS = [
  { id: "tu-dinero-hoy", title: "Tu dinero hoy" },
  { id: "trabajo-e-ingresos", title: "Trabajo e ingresos" },
  { id: "hacer-crecer-tu-dinero", title: "Hacer crecer tu dinero" },
  { id: "protegete", title: "Protégete y entiende el mundo" },
] as const;
export type AreaId = (typeof AREAS)[number]["id"];

export const courseSchema = z
  .object({
    slug,
    area: z.enum(AREAS.map((a) => a.id) as [AreaId, ...AreaId[]]),
    /** Written but waiting for editorial review: never published, even if complete. */
    draft: z.boolean().default(false),
    order: z.number().int().positive(),
    title: text,
    tagline: text,
    description: text,
    level: z.enum(["Básico", "Intermedio"]),
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

// ---------------------------------------------------------------------------
// Final assessment
// ---------------------------------------------------------------------------

const explanation = text.max(
  MAX_PARAGRAPH_LENGTH,
  `Explanations are at most ${MAX_PARAGRAPH_LENGTH} characters`,
);

export const assessmentQuestionSchema = z.object({
  id,
  /** A situation to reason about, not a fact to recall. */
  prompt: text,
  /** 4 options only if all 4 are credible; otherwise 3. Shuffled on every attempt. */
  options: z.array(z.object({ id, text })).min(3).max(4),
  correctOptionId: id,
  /** Shown at the end for every mistake. */
  explanation,
  /** The lesson to review if this one is wrong. */
  lesson: slug,
});

/**
 * Final assessment of a course: each attempt draws `questionsPerAttempt` questions at random
 * from a bank 50 % larger, and passes with `passMark` right answers.
 */
export const assessmentSchema = z
  .object({
    questionsPerAttempt: z.number().int().positive(),
    passMark: z.number().int().positive(),
    questions: z.array(assessmentQuestionSchema),
  })
  .superRefine((assessment, ctx) => {
    const { questionsPerAttempt, passMark, questions } = assessment;
    if (questions.length !== questionsPerAttempt * 1.5) {
      ctx.addIssue({
        code: "custom",
        path: ["questions"],
        message: `The bank needs ${questionsPerAttempt * 1.5} questions (50 % more than each attempt), not ${questions.length}`,
      });
    }
    if (passMark > questionsPerAttempt) {
      ctx.addIssue({ code: "custom", path: ["passMark"], message: "Pass mark above the total" });
    }
    const ids = questions.map((q) => q.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: "custom", path: ["questions"], message: "Duplicate question ids" });
    }
    questions.forEach((question, index) => {
      const optionIds = question.options.map((o) => o.id);
      if (new Set(optionIds).size !== optionIds.length) {
        ctx.addIssue({ code: "custom", path: ["questions", index], message: "Duplicate options" });
      }
      if (!optionIds.includes(question.correctOptionId)) {
        ctx.addIssue({
          code: "custom",
          path: ["questions", index, "correctOptionId"],
          message: "The correct answer is not among the options",
        });
      }
    });
  });

export type AssessmentQuestion = z.infer<typeof assessmentQuestionSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentInput = z.input<typeof assessmentSchema>;
