"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { ReaderNextLesson } from "./reader-types";
import { STEP_TITLE_ID } from "./section-view";

export function LessonComplete({
  courseSlug,
  lessonTitle,
  minutes,
  score,
  next,
  onReview,
}: {
  courseSlug: string;
  lessonTitle: string;
  minutes: number;
  score: { correct: number; total: number };
  next: ReaderNextLesson;
  onReview: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="relative w-fit">
        <ProgressRing value={1} label="Lección completada" size={96} stroke={6}>
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 380, damping: 22 }}
            className="grid size-12 place-items-center rounded-full bg-brand text-brand-fg"
          >
            <Check aria-hidden className="size-6" strokeWidth={2.5} />
          </motion.span>
        </ProgressRing>
      </div>
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase">
          Lección completada
        </p>
        <h2
          id={STEP_TITLE_ID}
          tabIndex={-1}
          className="text-[1.625rem] leading-tight font-semibold tracking-tight outline-none sm:text-3xl"
        >
          Has terminado «{lessonTitle}»
        </h2>
      </header>
      <dl className="flex gap-10 border-y border-border py-5">
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-fg-muted">Aciertos</dt>
          <dd className="font-mono tabular text-3xl font-medium tracking-tight">
            {score.correct}
            <span className="text-fg-subtle">/{score.total}</span>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-fg-muted">Duración</dt>
          <dd className="font-mono tabular text-3xl font-medium tracking-tight">
            {minutes}
            <span className="ml-1 font-sans text-lg text-fg-muted">min</span>
          </dd>
        </div>
      </dl>
      <p className="measure text-lg leading-8 text-fg-muted">
        {score.correct === score.total
          ? "Todas bien. No olvides el reto práctico: es lo que convierte la idea en costumbre."
          : "Repasa las explicaciones de las preguntas que fallaste: es la forma más rápida de fijarlo."}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {next ? (
          <Button asChild size="lg">
            <Link href={`/cursos/${courseSlug}/${next.slug}`}>
              Siguiente: {next.title}
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href={`/cursos/${courseSlug}/evaluacion`}>
              Hacer la evaluación final
              <ArrowRight />
            </Link>
          </Button>
        )}
        <Button variant="secondary" size="lg" onClick={onReview}>
          <RotateCcw />
          Repasar la lección
        </Button>
      </div>
    </div>
  );
}
