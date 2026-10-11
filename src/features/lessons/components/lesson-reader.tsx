"use client";

import { ArrowRight, ListOrdered, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MonedoCharacter } from "@/components/graphics/monedo-character";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Lesson } from "@/content/schema";
import { useProgress } from "@/features/progress/progress-provider";
import { ScriptedTutor } from "@/features/tutor/scripted-tutor";
import type { TutorPrompt, TutorProvider, TutorTurn } from "@/features/tutor/types";
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
import { buildSteps, quizScore, type Step } from "../lib/steps";
import { ChoiceList, LearnerBubble, MonedoTurn, TUTOR_NAME } from "./conversation/chat-parts";
import { LESSON_COMPLETE_TITLE_ID, LessonComplete } from "./lesson-complete";
import type { ReaderCourse, ReaderNextLesson } from "./reader-types";
import { StepSegments } from "./step-segments";
import { Syllabus } from "./syllabus";

/** Keys inside these elements belong to the control (arrows move sliders, carets…). */
const KEY_OWNERS =
  'input, textarea, select, [role="radio"], [role="slider"], [contenteditable="true"]';

type Entry =
  | { key: string; stepId: string; who: "monedo"; turn: TutorTurn; reveal: boolean }
  | { key: string; stepId: string; who: "learner"; text: string };

type Pending = { stepIndex: number; prompt: TutorPrompt; ready: boolean };

const anchorId = (stepId: string) => `paso-${stepId}`;

/** The learner's stored answer for a question or decision step, if any. */
function storedChoice(step: Step, progress: LessonProgress | undefined): string | undefined {
  if (step.kind === "question") return progress?.answers[step.question.id];
  if (step.block.type === "decision") return progress?.decisions[step.block.id];
  return undefined;
}

/**
 * Lesson as a conversation with Monedo. Monedo explains in short bubbles and asks; the
 * learner moves on by tapping a reply or choosing an answer, and Monedo reacts with the
 * matching expression. All words come from the TutorProvider (scripted content in v1).
 * Progress is saved per step exactly as before, so learners resume where they left off.
 */
export function LessonReader({
  course,
  lesson,
  next,
  tutor: tutorProp,
}: {
  course: ReaderCourse;
  lesson: Lesson;
  next: ReaderNextLesson;
  tutor?: TutorProvider | undefined;
}) {
  const tutor = useMemo(() => tutorProp ?? new ScriptedTutor(lesson), [tutorProp, lesson]);
  const steps = useMemo(() => buildSteps(lesson), [lesson]);
  const stepIds = useMemo(() => steps.map((s) => s.id), [steps]);
  const key = lessonKey(course.slug, lesson.slug);

  const progress = useProgress((s) => s.snapshot.lessons[key]);
  const status = useProgress((s) => s.status);
  const saveFailed = useProgress((s) => s.saveFailed);
  const updateLesson = useProgress((s) => s.updateLesson);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [resumedAt, setResumedAt] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [syllabusDialog, setSyllabusDialog] = useState(false);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Move focus to the new prompt only after the learner acted (never on first load). */
  const [userActed, setUserActed] = useState(false);
  const startRequested = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  const update = useCallback(
    (fn: (p: LessonProgress, now: Date) => LessonProgress) =>
      updateLesson(course.slug, lesson.slug, fn),
    [updateLesson, course.slug, lesson.slug],
  );

  /** Opens step `at`: Monedo speaks, and the prompt waits until the bubbles are shown. */
  const openStep = useCallback(
    async (at: number, stored: LessonProgress | undefined, reveal: boolean) => {
      const step = steps[at]!;
      const opening = await tutor.open(step);
      const add: Entry[] = [
        { key: `${step.id}:open`, stepId: step.id, who: "monedo", turn: opening, reveal },
      ];
      let prompt: TutorPrompt = opening.prompt;
      let ready = !reveal;
      const choice = storedChoice(step, stored);
      if (opening.prompt.kind === "choice" && choice) {
        // Answered before leaving: show the answer and Monedo's reaction again.
        const label = opening.prompt.options.find((o) => o.id === choice)?.label ?? choice;
        const reaction = await tutor.react(step, choice);
        add[0] = { ...add[0]!, reveal: false } as Entry;
        ready = true;
        add.push(
          { key: `${step.id}:choice`, stepId: step.id, who: "learner", text: label },
          {
            key: `${step.id}:react`,
            stepId: step.id,
            who: "monedo",
            turn: reaction,
            reveal: false,
          },
        );
        prompt = reaction.next;
      }
      return { add, prompt, ready };
    },
    [steps, tutor],
  );

  // Start once stored progress is known: replay earlier steps silently, then open the
  // step to resume at with Monedo speaking.
  useEffect(() => {
    if (status !== "ready" || startRequested.current) return;
    startRequested.current = true;
    const stored = progress;
    const at = stored && !stored.completedAt ? resumeIndex(stepIds, stored) : 0;
    void (async () => {
      const history: Entry[] = [];
      for (let i = 0; i < at; i += 1) {
        const { add, prompt } = await openStep(i, stored, false);
        history.push(...add.map((e) => (e.who === "monedo" ? { ...e, reveal: false } : e)));
        if (prompt.kind === "continue") {
          history.push({
            key: `${steps[i]!.id}:continue`,
            stepId: steps[i]!.id,
            who: "learner",
            text: prompt.label,
          });
        }
      }
      const { add, prompt, ready } = await openStep(at, stored, true);
      setEntries([...history, ...add]);
      setStarted(true);
      setIndex(at);
      setPending({ stepIndex: at, prompt, ready });
      if (at > 0) setResumedAt(steps[at]!.id);
    })();
  }, [status, progress, stepIds, steps, openStep]);

  const step = steps[index]!;
  const isLast = index === steps.length - 1;

  // Save the step being viewed so the learner resumes here.
  useEffect(() => {
    if (!started || finished) return;
    update((p, now) => visitStep(p, step.id, now));
  }, [started, step.id, finished, update]);

  // Keep the newest message in view, above the action bar.
  useEffect(() => {
    if (!userActed) return;
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [entries, pending, userActed]);

  const onRevealed = useCallback(() => {
    setPending((p) => (p && !p.ready ? { ...p, ready: true } : p));
  }, []);

  const proceed = useCallback(async () => {
    if (!pending?.ready || pending.prompt.kind !== "continue" || busy) return;
    setBusy(true);
    setUserActed(true);
    const label = pending.prompt.label;
    const current = steps[pending.stepIndex]!;
    update((p, now) => completeStep(p, current.id, now));
    const said: Entry = {
      key: `${current.id}:continue`,
      stepId: current.id,
      who: "learner",
      text: label,
    };
    if (pending.stepIndex === steps.length - 1) {
      update((p, now) => completeLesson(p, now));
      setEntries((e) => [...e, said]);
      setPending(null);
      setFinished(true);
      setBusy(false);
      return;
    }
    const at = pending.stepIndex + 1;
    const { add, prompt, ready } = await openStep(at, progress, true);
    setEntries((e) => [...e, said, ...add]);
    setIndex(at);
    setPending({ stepIndex: at, prompt, ready });
    setResumedAt(null);
    setBusy(false);
  }, [pending, busy, steps, update, openStep, progress]);

  const choose = useCallback(
    async (optionId: string) => {
      if (!pending?.ready || pending.prompt.kind !== "choice" || busy) return;
      setBusy(true);
      setUserActed(true);
      const current = steps[pending.stepIndex]!;
      const label = pending.prompt.options.find((o) => o.id === optionId)?.label ?? optionId;
      if (current.kind === "question") {
        const questionId = current.question.id;
        update((p, now) =>
          completeStep(answerQuestion(p, questionId, optionId, now), current.id, now),
        );
      } else {
        update((p, now) => chooseDecision(p, current.id, optionId, now));
      }
      const reaction = await tutor.react(current, optionId);
      setEntries((e) => [
        ...e,
        { key: `${current.id}:choice`, stepId: current.id, who: "learner", text: label },
        {
          key: `${current.id}:react`,
          stepId: current.id,
          who: "monedo",
          turn: reaction,
          reveal: true,
        },
      ]);
      setPending({ stepIndex: pending.stepIndex, prompt: reaction.next, ready: false });
      setBusy(false);
    },
    [pending, busy, steps, update, tutor],
  );

  // Focus follows the conversation for keyboard and screen reader users.
  useEffect(() => {
    if (!userActed || !pending?.ready || pending.prompt.kind !== "continue") return;
    continueRef.current?.focus({ preventScroll: true });
  }, [pending, userActed]);
  useEffect(() => {
    if (finished) document.getElementById(LESSON_COMPLETE_TITLE_ID)?.focus({ preventScroll: true });
  }, [finished]);

  // Keyboard: → continues when Monedo is waiting for a tap.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest(KEY_OWNERS)) return;
      if (syllabusDialog || event.key !== "ArrowRight") return;
      event.preventDefault();
      void proceed();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [proceed, syllabusDialog]);

  const scrollToStep = useCallback((stepId: string) => {
    document.getElementById(anchorId(stepId))?.scrollIntoView({ block: "start" });
  }, []);

  const firstMonedoKey = entries.find((e) => e.who === "monedo")?.key;
  const firstKeyByStep = new Map<string, string>();
  for (const entry of entries) {
    if (!firstKeyByStep.has(entry.stepId)) firstKeyByStep.set(entry.stepId, entry.key);
  }

  const prompt = pending?.ready ? pending.prompt : null;
  const upcoming = pending?.prompt;
  const continueLabel =
    upcoming?.kind === "continue" ? upcoming.label : isLast ? "Terminar lección" : "Continuar";

  const syllabus = (
    <Syllabus
      course={course}
      currentLesson={lesson.slug}
      steps={steps}
      index={finished ? steps.length - 1 : index}
      reachable={finished ? steps.length - 1 : index}
      onJump={(i) => {
        setSyllabusDialog(false);
        scrollToStep(steps[i]!.id);
      }}
    />
  );

  return (
    <div className="flex min-h-dvh flex-col">
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
          <main id="contenido" className="flex-1 px-4 pt-6 pb-8 sm:px-8 md:pt-10">
            <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-5">
              <h1 className="sr-only">
                {lesson.title}: conversación con {TUTOR_NAME}
              </h1>
              {saveFailed ? (
                <Callout tone="warning" title="No podemos guardar tu progreso">
                  Tu navegador no permite guardar datos (modo privado o almacenamiento lleno).
                  Puedes seguir la lección, pero el avance se perderá al cerrar la página.
                </Callout>
              ) : null}

              {!started ? (
                <div className="flex gap-3" aria-hidden>
                  <MonedoCharacter className="size-10 sm:size-12" />
                </div>
              ) : null}

              <div
                role="log"
                aria-live="polite"
                aria-label="Conversación"
                className="flex flex-col gap-5"
              >
                {entries.map((entry) => {
                  const anchor =
                    firstKeyByStep.get(entry.stepId) === entry.key
                      ? anchorId(entry.stepId)
                      : undefined;
                  return (
                    <div key={entry.key} id={anchor} className="scroll-mt-20">
                      {resumedAt === entry.stepId && anchor ? (
                        <p
                          role="status"
                          className="mb-4 flex flex-wrap items-center gap-x-3 border-t border-border pt-4 text-base text-fg-muted"
                        >
                          Retomamos donde lo dejaste.
                          <Button
                            variant="link"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                          >
                            Ver desde el principio
                          </Button>
                        </p>
                      ) : null}
                      {entry.who === "monedo" ? (
                        <MonedoTurn
                          expression={entry.turn.expression}
                          messages={entry.turn.messages}
                          reveal={entry.reveal}
                          showName={entry.key === firstMonedoKey}
                          onRevealed={entry.reveal ? onRevealed : undefined}
                        />
                      ) : (
                        <LearnerBubble text={entry.text} />
                      )}
                    </div>
                  );
                })}
              </div>

              {prompt?.kind === "choice" ? (
                <ChoiceList
                  options={prompt.options}
                  label={step.kind === "question" ? "Elige tu respuesta" : "Elige qué harías"}
                  onChoose={(id) => void choose(id)}
                  autoFocus={userActed}
                />
              ) : null}

              {finished ? (
                <MonedoCompletion>
                  <LessonComplete
                    courseSlug={course.slug}
                    lessonTitle={lesson.title}
                    minutes={lesson.minutes}
                    score={quizScore(steps, progress)}
                    next={next}
                    onReview={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  />
                </MonedoCompletion>
              ) : null}
              {/* Scroll target: stops above the sticky action bar. */}
              <div ref={endRef} aria-hidden className="scroll-mb-32" />
            </div>
          </main>

          {/* Action bar: thumb-reachable on mobile, respects the home indicator. Nothing
              floats over it or over the conversation. */}
          {!finished ? (
            <div className="sticky bottom-0 z-20 border-t border-border bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-8">
              <div className="mx-auto flex min-h-12 w-full max-w-[42rem] items-center">
                {upcoming?.kind === "choice" ? (
                  <p className="w-full text-center text-base text-fg-muted">
                    {prompt ? "Elige una respuesta para seguir." : "Monedo está escribiendo…"}
                  </p>
                ) : (
                  <Button
                    ref={continueRef}
                    size="lg"
                    data-testid="tutor-continue"
                    className="w-full sm:ml-auto sm:w-auto"
                    onClick={() => void proceed()}
                    disabled={!prompt || busy}
                  >
                    {continueLabel}
                    <ArrowRight />
                  </Button>
                )}
              </div>
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

/** The closing card, said by a celebrating Monedo. */
function MonedoCompletion({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 border-t border-border pt-6">
      <div className="w-10 shrink-0 sm:w-12">
        <MonedoCharacter expression="celebrating" className="size-10 sm:size-12" />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
