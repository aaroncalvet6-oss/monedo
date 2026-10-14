"use client";

import { ArrowLeft, ArrowRight, ListOrdered, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import type { Lesson } from "@/content/schema";
import { useProgress } from "@/features/progress/progress-provider";
import { ScriptedTutor } from "@/features/tutor/scripted-tutor";
import type { TutorFeedback, TutorProvider, TutorSection } from "@/features/tutor/types";
import {
  answerQuestion,
  chooseDecision,
  completeLesson,
  completeStep,
  lessonKey,
  resumeIndex,
  visitStep,
} from "@/lib/progress/lesson-progress";
import type { LessonProgress } from "@/lib/progress/types";
import { cn } from "@/lib/utils";
import { buildSteps, isStepUnlocked, quizScore, stepLabel, type Step } from "../lib/steps";
import { LessonComplete } from "./lesson-complete";
import type { ReaderCourse, ReaderNextLesson } from "./reader-types";
import { StepSegments } from "./step-segments";
import { SectionView, STEP_TITLE_ID } from "./section-view";
import { Syllabus } from "./syllabus";

/** Keys inside these elements belong to the control (arrows move radios and sliders). */
const KEY_OWNERS =
  'input, textarea, select, [role="radio"], [role="slider"], [contenteditable="true"]';

const feedbackKey = (stepId: string, choice: string) => `${stepId}:${choice}`;

/** The learner's stored answer (questions) or choice (decisions) for a step. */
function storedChoice(step: Step, progress: LessonProgress | undefined): string | undefined {
  if (step.kind === "question") return progress?.answers[step.question.id];
  if (step.block.type === "decision") return progress?.decisions[step.block.id];
  return undefined;
}

/**
 * Lesson reader: one section per screen, one question per screen. The words come from a
 * TutorProvider (written content in v1); progress is saved at every step.
 */
export function LessonReader({
  course,
  lesson,
  next,
  tutor: tutorProp,
  initialSections,
}: {
  course: ReaderCourse;
  lesson: Lesson;
  next: ReaderNextLesson;
  tutor?: TutorProvider | undefined;
  /** Sections prepared on the server (the first screen), so it is in the static HTML. */
  initialSections?: Record<string, TutorSection> | undefined;
}) {
  const tutor = useMemo(() => tutorProp ?? new ScriptedTutor(lesson), [tutorProp, lesson]);
  const steps = useMemo(() => buildSteps(lesson), [lesson]);
  const stepIds = useMemo(() => steps.map((s) => s.id), [steps]);
  const key = lessonKey(course.slug, lesson.slug);

  const progress = useProgress((s) => s.snapshot.lessons[key]);
  const status = useProgress((s) => s.status);
  const saveFailed = useProgress((s) => s.saveFailed);
  const updateLesson = useProgress((s) => s.updateLesson);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [finished, setFinished] = useState(false);
  const [resumedAt, setResumedAt] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [syllabusDialog, setSyllabusDialog] = useState(false);

  const [resumeChecked, setResumeChecked] = useState(false);
  const [sections, setSections] = useState<Record<string, TutorSection>>(initialSections ?? {});
  const [feedback, setFeedback] = useState<Record<string, TutorFeedback>>({});
  const shouldFocus = useRef(false);

  const step = steps[index]!;
  const isLast = index === steps.length - 1;
  const unlocked = isStepUnlocked(step, progress);
  const update = useCallback(
    (fn: (p: LessonProgress, now: Date) => LessonProgress) =>
      updateLesson(course.slug, lesson.slug, fn),
    [updateLesson, course.slug, lesson.slug],
  );

  // Resume once, as soon as stored progress has been read (state adjusted during render,
  // see https://react.dev/learn/you-might-not-need-an-effect).
  if (status === "ready" && !resumeChecked) {
    setResumeChecked(true);
    const at = progress && !progress.completedAt ? resumeIndex(stepIds, progress) : 0;
    if (at > 0) {
      setIndex(at);
      setResumedAt(at);
    }
  }

  // Load every section once from the tutor (instant for written content).
  useEffect(() => {
    let cancelled = false;
    void Promise.all(steps.map(async (s) => [s.id, await tutor.open(s)] as const)).then(
      (entries) => {
        if (!cancelled) setSections(Object.fromEntries(entries));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [steps, tutor]);

  // Feedback for every answered question or decision (new answers and resumed ones),
  // cached by step and choice.
  useEffect(() => {
    let cancelled = false;
    const pending = steps.flatMap((s) => {
      const choice = storedChoice(s, progress);
      return choice && !(feedbackKey(s.id, choice) in feedback) ? [{ s, choice }] : [];
    });
    if (pending.length === 0) return;
    void Promise.all(
      pending.map(
        async ({ s, choice }) => [feedbackKey(s.id, choice), await tutor.react(s, choice)] as const,
      ),
    ).then((results) => {
      if (!cancelled) setFeedback((current) => ({ ...current, ...Object.fromEntries(results) }));
    });
    return () => {
      cancelled = true;
    };
  }, [steps, progress, tutor, feedback]);

  // Save the step being viewed (per-block progress), only after resuming was decided.
  useEffect(() => {
    if (!resumeChecked || finished) return;
    update((p, now) => visitStep(p, step.id, now));
  }, [resumeChecked, step.id, finished, update]);

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= steps.length || target === index) return;
      setDirection(target > index ? 1 : -1);
      shouldFocus.current = true;
      setIndex(target);
      setResumedAt(null);
      window.scrollTo({ top: 0 });
    },
    [index, steps.length],
  );

  const choice = step.kind === "question" ? selected[step.question.id] : undefined;
  const needsCheck = step.kind === "question" && !unlocked;

  const primary = useCallback(() => {
    if (step.kind === "question" && !unlocked) {
      if (!choice) return;
      const questionId = step.question.id;
      update((p, now) => completeStep(answerQuestion(p, questionId, choice, now), step.id, now));
      return;
    }
    if (!unlocked) return;
    update((p, now) => completeStep(p, step.id, now));
    if (isLast) {
      update((p, now) => completeLesson(p, now));
      shouldFocus.current = true;
      setFinished(true);
      window.scrollTo({ top: 0 });
      return;
    }
    goTo(index + 1);
  }, [step, unlocked, choice, update, isLast, goTo, index]);

  const back = useCallback(() => {
    if (finished) {
      shouldFocus.current = true;
      setFinished(false);
      return;
    }
    goTo(index - 1);
  }, [finished, goTo, index]);

  const review = useCallback(() => {
    setFinished(false);
    setDirection(-1);
    shouldFocus.current = true;
    setIndex(0);
    window.scrollTo({ top: 0 });
  }, []);

  // Keyboard: ← → move between steps unless a control owns the arrows.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest(KEY_OWNERS)) return;
      if (syllabusDialog) return;
      if (event.key === "ArrowRight" && !finished) {
        event.preventDefault();
        primary();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [primary, back, finished, syllabusDialog]);

  // Focus the new step title so screen readers announce it; only after user navigation.
  const focusTitleIfRequested = useCallback(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    document.getElementById(STEP_TITLE_ID)?.focus({ preventScroll: true });
  }, []);

  const completedIndexes = stepIds
    .map((id, i) => (progress?.completedStepIds.includes(id) ? i : -1))
    .filter((i) => i >= 0);
  const reachable = Math.min(
    steps.length - 1,
    Math.max(index, ...completedIndexes.map((i) => i + 1)),
  );

  const primaryLabel = needsCheck ? "Comprobar" : isLast ? "Terminar lección" : "Continuar";
  const primaryDisabled = needsCheck ? !choice : !unlocked;

  const syllabus = (
    <Syllabus
      course={course}
      currentLesson={lesson.slug}
      steps={steps}
      index={index}
      reachable={reachable}
      onJump={(i) => {
        setFinished(false);
        setSyllabusDialog(false);
        goTo(i);
      }}
    />
  );

  const stepKey = finished ? "complete" : step.id;
  const firstStepKey = useRef(stepKey);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="flex h-14 items-center gap-1 px-2 sm:gap-2 md:px-4">
          <Button asChild variant="ghost" size="icon-sm">
            <Link
              href={`/cursos/${course.slug}`}
              aria-label={`Salir de la lección y volver a ${course.title}`}
            >
              <X />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:inline-flex"
            aria-controls="lesson-syllabus"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "Ocultar temario" : "Mostrar temario"}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-1">
            <p className="hidden truncate text-sm font-medium md:block">{lesson.title}</p>
            <StepSegments total={steps.length} current={index} finished={finished} />
          </div>
          <span className="w-14 text-center font-mono tabular text-sm text-fg-muted" aria-hidden>
            {finished ? "Fin" : `${index + 1}/${steps.length}`}
          </span>
          <span className="hidden text-sm text-fg-subtle md:inline">{lesson.minutes} min</span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Ver temario"
            onClick={() => setSyllabusDialog(true)}
          >
            <ListOrdered />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop syllabus */}
        <aside
          id="lesson-syllabus"
          className={cn(
            "sticky top-14 hidden h-[calc(100dvh-3.5rem)] shrink-0 overflow-y-auto border-r border-border transition-[width] duration-(--duration-slow) ease-(--ease-out) lg:block",
            sidebarOpen ? "w-72" : "w-0 border-r-0",
          )}
        >
          <div className={cn("w-72 p-4", !sidebarOpen && "invisible")}>{syllabus}</div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main id="contenido" className="flex-1 px-5 pt-8 pb-12 sm:px-8 md:pt-14">
            <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-6">
              {saveFailed ? (
                <Callout tone="warning" title="No podemos guardar tu progreso">
                  Tu navegador no permite guardar datos (modo privado o almacenamiento lleno).
                  Puedes seguir la lección, pero el avance se perderá al cerrar la página.
                </Callout>
              ) : null}
              {resumedAt !== null && resumedAt === index ? (
                <p
                  className="flex flex-wrap items-center gap-x-3 text-base text-fg-muted"
                  role="status"
                >
                  Retomamos donde lo dejaste.
                  <Button variant="link" onClick={() => goTo(0)}>
                    Empezar desde el principio
                  </Button>
                </p>
              ) : null}

              <p className="sr-only" aria-live="polite">
                {finished
                  ? "Lección completada"
                  : `Paso ${index + 1} de ${steps.length}: ${stepLabel(step)}`}
              </p>

              {/* CSS slide-in on every step change (not on the first one shown). */}
              <div
                key={stepKey}
                className={cn(
                  stepKey !== firstStepKey.current &&
                    (direction > 0 ? "animate-step-in-next" : "animate-step-in-prev"),
                )}
              >
                <OnStepMount onMount={focusTitleIfRequested} />
                {finished ? (
                  <LessonComplete
                    courseSlug={course.slug}
                    lessonTitle={lesson.title}
                    minutes={lesson.minutes}
                    score={quizScore(steps, progress)}
                    next={next}
                    onReview={review}
                  />
                ) : (
                  <StepContent
                    section={sections[step.id]}
                    step={step}
                    selected={choice}
                    answer={storedChoice(step, progress)}
                    feedback={
                      storedChoice(step, progress) !== undefined
                        ? feedback[feedbackKey(step.id, storedChoice(step, progress)!)]
                        : undefined
                    }
                    onSelect={(optionId) => {
                      if (step.kind === "question") {
                        setSelected((s) => ({ ...s, [step.question.id]: optionId }));
                      } else if (step.block.type === "decision") {
                        const blockId = step.block.id;
                        update((p, now) => chooseDecision(p, blockId, optionId, now));
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </main>

          {/* Action bar: thumb-reachable on mobile, respects the home indicator. */}
          {!finished ? (
            <div className="sticky bottom-0 z-20 border-t border-border bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-8">
              <div className="mx-auto flex w-full max-w-[42rem] items-center gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-12 shrink-0 px-0 md:w-auto md:px-4"
                  onClick={back}
                  disabled={index === 0}
                  aria-label="Paso anterior"
                >
                  <ArrowLeft />
                  <span className="hidden md:inline">Anterior</span>
                </Button>
                <span className="hidden flex-1 items-center justify-center gap-1.5 text-xs text-fg-subtle lg:flex">
                  <Kbd>←</Kbd>
                  <Kbd>→</Kbd>
                  para navegar
                </span>
                <Button
                  size="lg"
                  className="flex-1 lg:flex-none"
                  onClick={primary}
                  disabled={primaryDisabled}
                >
                  {primaryLabel}
                  {needsCheck ? null : <ArrowRight />}
                </Button>
              </div>
              {!unlocked && step.kind === "block" && step.block.type === "decision" ? (
                <p className="mx-auto mt-2 max-w-[42rem] text-center text-sm text-fg-muted">
                  Elige una opción para continuar.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <Dialog open={syllabusDialog} onOpenChange={setSyllabusDialog}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogTitle className="sr-only">Temario</DialogTitle>
          {syllabus}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Runs when a step mounts (each step is keyed, so it remounts on every change); used to move
 * focus to the new step's title, so screen readers announce the new content.
 * Only when navigation was user-initiated, never on first load.
 */
function OnStepMount({ onMount }: { onMount: () => void }) {
  useEffect(onMount, [onMount]);
  return null;
}

function StepContent({
  section,
  step,
  selected,
  answer,
  feedback,
  onSelect,
}: {
  section: TutorSection | undefined;
  step: Step;
  selected: string | undefined;
  answer: string | undefined;
  feedback: TutorFeedback | undefined;
  onSelect: (optionId: string) => void;
}) {
  if (!section) {
    return (
      <div className="flex flex-col gap-4" aria-hidden>
        <div className="h-3 w-24 rounded-xs bg-surface-muted" />
        <div className="h-8 w-3/4 rounded-xs bg-surface-muted" />
        <div className="h-24 w-full rounded-xs bg-surface-muted" />
      </div>
    );
  }
  return (
    <SectionView
      section={section}
      selected={selected}
      answer={answer}
      correctOptionId={step.kind === "question" ? step.question.correctOptionId : undefined}
      feedback={feedback}
      onSelect={onSelect}
    />
  );
}
