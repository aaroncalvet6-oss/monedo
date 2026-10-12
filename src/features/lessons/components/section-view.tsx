"use client";

import { ArrowRight, Calculator, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Callout } from "@/components/ui/callout";
import { ChoiceGroup, ChoiceItem, type ChoiceStatus } from "@/components/ui/choice-group";
import { getTool, toolHref } from "@/features/tools/tools";
import type { TutorFeedback, TutorSection } from "@/features/tutor/types";
import { keepUnits } from "@/lib/format";
import { SectionCard } from "./section-cards";

export const STEP_TITLE_ID = "lesson-step-title";

/**
 * One lesson section: label, focusable title (focused on step change), short paragraphs,
 * structured content and, for questions and decisions, the options and the feedback.
 */
export function SectionView({
  section,
  selected,
  answer,
  correctOptionId,
  feedback,
  onSelect,
}: {
  section: TutorSection;
  /** Option picked but not yet checked (questions). */
  selected: string | undefined;
  /** Locked answer (questions, once checked) or current choice (decisions). */
  answer: string | undefined;
  /** Questions only, to mark the right option once answered. */
  correctOptionId?: string | undefined;
  feedback: TutorFeedback | undefined;
  onSelect: (optionId: string) => void;
}) {
  const { choice } = section;
  const locked = choice?.kind === "question" && answer !== undefined;
  const statusFor = (optionId: string): ChoiceStatus | undefined => {
    if (!locked) return undefined;
    if (optionId === correctOptionId) return "correct";
    if (optionId === answer) return "incorrect";
    return undefined;
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase">
          {section.label}
        </p>
        <h2
          id={STEP_TITLE_ID}
          tabIndex={-1}
          className="text-[1.625rem] leading-tight font-semibold tracking-tight outline-none sm:text-3xl"
        >
          {keepUnits(section.title)}
        </h2>
      </header>
      <Paragraphs items={section.paragraphs} />
      {section.card ? <SectionCard card={section.card} /> : null}
      <Paragraphs items={section.after} />
      {section.sources ? (
        <div className="flex measure flex-col gap-1 border-l-2 border-border pl-4">
          <p className="text-sm font-medium text-fg-muted">Fuente oficial</p>
          <ul className="flex flex-col">
            {section.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 text-base text-brand-text underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-focus md:min-h-0"
                >
                  {source.label}
                  <ExternalLink aria-hidden className="size-3.5 shrink-0" />
                  <span className="sr-only">(se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {section.tool ? <ToolLink id={section.tool} /> : null}
      {choice ? (
        <ChoiceGroup
          aria-labelledby={STEP_TITLE_ID}
          value={choice.kind === "question" ? (answer ?? selected ?? "") : (answer ?? "")}
          onValueChange={onSelect}
          disabled={locked}
          className="measure"
        >
          {choice.options.map((option, index) => (
            <ChoiceItem
              key={option.id}
              value={option.id}
              letter={String.fromCharCode(65 + index)}
              status={statusFor(option.id)}
              className="text-lg"
            >
              {keepUnits(option.label)}
            </ChoiceItem>
          ))}
        </ChoiceGroup>
      ) : null}
      <div aria-live="polite" className="measure">
        <AnimatePresence mode="wait" initial={false}>
          {feedback ? (
            <motion.div
              key={feedback.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Callout
                tone={
                  feedback.tone === "correct"
                    ? "success"
                    : feedback.tone === "incorrect"
                      ? "danger"
                      : "info"
                }
                title={keepUnits(feedback.title)}
              >
                <span className="flex flex-col gap-3">
                  {feedback.paragraphs.map((p) => (
                    <span key={p}>{keepUnits(p)}</span>
                  ))}
                </span>
              </Callout>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Paragraphs({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex measure flex-col gap-5 text-lg leading-8 text-fg">
      {items.map((paragraph) => (
        <p key={paragraph}>{keepUnits(paragraph)}</p>
      ))}
    </div>
  );
}

function ToolLink({ id }: { id: NonNullable<TutorSection["tool"]> }) {
  const tool = getTool(id);
  return (
    <Link
      href={toolHref(tool)}
      className="flex measure items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors duration-(--duration-fast) hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-subtle text-brand-subtle-fg">
        <Calculator aria-hidden className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm text-fg-muted">Practica con la herramienta</span>
        <span className="text-lg font-medium">{tool.title}</span>
      </span>
      <ArrowRight aria-hidden className="size-5 shrink-0 text-fg-muted" />
    </Link>
  );
}
