"use client";

import { ArrowLeft, ArrowRight, Award, BookOpen, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ChoiceGroup, ChoiceItem } from "@/components/ui/choice-group";
import type { Assessment } from "@/content/schema";
import { StepSegments } from "@/features/lessons/components/step-segments";
import { useProgress } from "@/features/progress/progress-provider";
import {
  drawAttempt,
  scoreAttempt,
  type AttemptQuestion,
  type AttemptResult,
} from "@/lib/assessment/attempt";
import { keepUnits } from "@/lib/format";

export type AssessmentCourse = {
  slug: string;
  title: string;
  /** lesson slug → title, to point each mistake to its lesson. */
  lessonTitles: Record<string, string>;
};

type Phase =
  | { name: "intro" }
  | { name: "question"; questions: AttemptQuestion[]; index: number }
  | { name: "results"; questions: AttemptQuestion[]; result: AttemptResult };

const TITLE_ID = "assessment-title";

/**
 * Final assessment: a fresh random draw on every attempt, one question per screen, no
 * feedback until the end, and then every mistake explained with the lesson to review.
 */
export function AssessmentRunner({
  course,
  assessment,
}: {
  course: AssessmentCourse;
  assessment: Assessment;
}) {
  const [phase, setPhase] = useState<Phase>({ name: "intro" });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const recordAssessment = useProgress((s) => s.recordAssessment);
  const previous = useProgress((s) => s.snapshot.assessments[course.slug]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const screenKey =
    phase.name === "question" ? `q-${phase.index}-${phase.questions[phase.index]!.id}` : phase.name;

  // Move focus to the new screen's title, like the lesson reader.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    titleRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [screenKey]);

  const start = () => {
    setAnswers({});
    setPhase({ name: "question", questions: drawAttempt(assessment), index: 0 });
  };

  const finish = (questions: AttemptQuestion[]) => {
    const result = scoreAttempt(questions, answers, assessment.passMark);
    recordAssessment(course.slug, result.correct, result.total, result.passed);
    setPhase({ name: "results", questions, result });
  };

  const total = assessment.questionsPerAttempt;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="flex h-14 items-center gap-2 px-2 md:px-4">
          <Button asChild variant="ghost" size="icon-sm">
            <Link
              href={`/cursos/${course.slug}`}
              aria-label={`Salir de la evaluación y volver a ${course.title}`}
            >
              <X />
            </Link>
          </Button>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-1">
            <p className="truncate text-sm font-medium">Evaluación final · {course.title}</p>
            {phase.name === "question" ? (
              <StepSegments
                total={phase.questions.length}
                current={phase.index}
                finished={false}
                label="Progreso de la evaluación"
              />
            ) : null}
          </div>
          {phase.name === "question" ? (
            <span className="w-14 text-center font-mono tabular text-sm text-fg-muted" aria-hidden>
              {phase.index + 1}/{phase.questions.length}
            </span>
          ) : null}
        </div>
      </header>

      <main id="contenido" className="flex-1 px-5 pt-8 pb-12 sm:px-8 md:pt-14">
        <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-6">
          {phase.name === "intro" ? (
            <Intro
              titleRef={titleRef}
              courseTitle={course.title}
              total={total}
              passMark={assessment.passMark}
              best={previous ? `${previous.bestScore} de ${previous.total}` : null}
              passed={Boolean(previous?.passedAt)}
              certificateHref={`/cursos/${course.slug}/certificado`}
              onStart={start}
            />
          ) : phase.name === "question" ? (
            <QuestionScreen
              key={screenKey}
              titleRef={titleRef}
              question={phase.questions[phase.index]!}
              number={phase.index + 1}
              total={phase.questions.length}
              value={answers[phase.questions[phase.index]!.id]}
              onChange={(optionId) =>
                setAnswers((current) => ({
                  ...current,
                  [phase.questions[phase.index]!.id]: optionId,
                }))
              }
            />
          ) : (
            <Results
              titleRef={titleRef}
              course={course}
              questions={phase.questions}
              result={phase.result}
              answers={answers}
              onRetry={start}
            />
          )}
        </div>
      </main>

      {phase.name === "question" ? (
        <div className="sticky bottom-0 z-20 border-t border-border bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-8">
          <div className="mx-auto flex w-full max-w-[42rem] items-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-12 shrink-0 px-0 md:w-auto md:px-4"
              disabled={phase.index === 0}
              aria-label="Pregunta anterior"
              onClick={() => setPhase({ ...phase, index: phase.index - 1 })}
            >
              <ArrowLeft />
              <span className="hidden md:inline">Anterior</span>
            </Button>
            <Button
              size="lg"
              className="flex-1 md:ml-auto md:flex-none"
              disabled={answers[phase.questions[phase.index]!.id] === undefined}
              onClick={() =>
                phase.index === phase.questions.length - 1
                  ? finish(phase.questions)
                  : setPhase({ ...phase, index: phase.index + 1 })
              }
            >
              {phase.index === phase.questions.length - 1 ? "Terminar evaluación" : "Siguiente"}
              <ArrowRight />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type TitleRef = React.RefObject<HTMLHeadingElement | null>;

function Title({ titleRef, children }: { titleRef: TitleRef; children: React.ReactNode }) {
  return (
    <h1
      id={TITLE_ID}
      ref={titleRef}
      tabIndex={-1}
      className="text-[1.625rem] leading-tight font-semibold tracking-tight outline-none sm:text-3xl"
    >
      {children}
    </h1>
  );
}

function Intro({
  titleRef,
  courseTitle,
  total,
  passMark,
  best,
  passed,
  certificateHref,
  onStart,
}: {
  titleRef: TitleRef;
  courseTitle: string;
  total: number;
  passMark: number;
  best: string | null;
  passed: boolean;
  certificateHref: string;
  onStart: () => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase">
          Evaluación final
        </p>
        <Title titleRef={titleRef}>{courseTitle}</Title>
      </header>
      <ul className="flex measure flex-col gap-3 text-lg leading-8">
        <li>
          {total} preguntas, elegidas al azar en cada intento. Apruebas con {passMark} de {total}.
        </li>
        <li>No verás si aciertas hasta el final. Puedes volver atrás y cambiar tus respuestas.</li>
        <li>Al terminar, te explicamos cada fallo y qué lección repasar. Puedes repetirla.</li>
      </ul>
      {best ? (
        <p className="text-base text-fg-muted">
          Tu mejor resultado: <span className="font-mono tabular text-fg">{best}</span>
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={onStart}>
          {best ? "Hacer la evaluación otra vez" : "Empezar la evaluación"}
          <ArrowRight />
        </Button>
        {passed ? (
          <Button asChild size="lg" variant="secondary">
            <Link href={certificateHref}>
              <Award />
              Ver tu certificado
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function QuestionScreen({
  titleRef,
  question,
  number,
  total,
  value,
  onChange,
}: {
  titleRef: TitleRef;
  question: AttemptQuestion;
  number: number;
  total: number;
  value: string | undefined;
  onChange: (optionId: string) => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase">
          Pregunta {number} de {total}
        </p>
        <Title titleRef={titleRef}>{keepUnits(question.prompt)}</Title>
      </header>
      <ChoiceGroup
        aria-labelledby={TITLE_ID}
        value={value ?? ""}
        onValueChange={onChange}
        className="measure"
      >
        {question.options.map((option, index) => (
          <ChoiceItem
            key={option.id}
            value={option.id}
            letter={String.fromCharCode(65 + index)}
            className="text-lg"
          >
            {keepUnits(option.text)}
          </ChoiceItem>
        ))}
      </ChoiceGroup>
    </section>
  );
}

function Results({
  titleRef,
  course,
  questions,
  result,
  answers,
  onRetry,
}: {
  titleRef: TitleRef;
  course: AssessmentCourse;
  questions: AttemptQuestion[];
  result: AttemptResult;
  answers: Record<string, string>;
  onRetry: () => void;
}) {
  const optionText = (question: AttemptQuestion, optionId: string | undefined) =>
    question.options.find((o) => o.id === optionId)?.text;
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase">Resultado</p>
        <Title titleRef={titleRef}>
          {result.passed ? "Has aprobado la evaluación" : "Esta vez no has aprobado"}
        </Title>
      </header>
      <div className="flex flex-col gap-2 border-y border-border py-6">
        <span className="flex items-baseline gap-3 leading-none">
          <span className="font-mono tabular text-[clamp(3rem,14vw,4.5rem)] font-medium tracking-[-0.05em]">
            {result.correct}
          </span>
          <span className="text-2xl font-medium text-fg-muted">de {result.total}</span>
        </span>
        <span className="text-lg text-fg-muted">
          {result.passed
            ? `Necesitabas ${result.passMark}. Ya tienes tu certificado de finalización.`
            : `Necesitas ${result.passMark} de ${result.total}. Repasa los fallos y vuelve a intentarlo: saldrán otras preguntas.`}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {result.passed ? (
          <Button asChild size="lg">
            <Link href={`/cursos/${course.slug}/certificado`}>
              <Award />
              Ver tu certificado
            </Link>
          </Button>
        ) : null}
        <Button size="lg" variant={result.passed ? "secondary" : "primary"} onClick={onRetry}>
          <RotateCcw />
          Repetir con otras preguntas
        </Button>
      </div>

      {result.mistakes.length > 0 ? (
        <section aria-labelledby="fallos" className="flex flex-col gap-4">
          <h2 id="fallos" className="text-xl font-semibold tracking-tight">
            {result.mistakes.length === 1 ? "Tu fallo, explicado" : "Tus fallos, explicados"}
          </h2>
          <ol className="flex flex-col gap-4">
            {result.mistakes.map(({ question }) => {
              const asked = questions.find((q) => q.id === question.id)!;
              const chosen = optionText(asked, answers[question.id]);
              return (
                <li
                  key={question.id}
                  className="flex measure flex-col gap-3 rounded-lg border border-border bg-surface p-4"
                >
                  <p className="text-lg font-medium">{keepUnits(question.prompt)}</p>
                  <dl className="flex flex-col gap-1 text-base">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-fg-muted">Tu respuesta:</dt>
                      <dd className="text-danger">
                        {chosen ? keepUnits(chosen) : "Sin responder"}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-fg-muted">Correcta:</dt>
                      <dd className="text-success">
                        {keepUnits(optionText(asked, question.correctOptionId) ?? "")}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-base leading-7">{keepUnits(question.explanation)}</p>
                  <Link
                    href={`/cursos/${course.slug}/${question.lesson}`}
                    className="inline-flex min-h-11 items-center gap-2 self-start text-base text-brand-text underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-focus md:min-h-0"
                  >
                    <BookOpen aria-hidden className="size-4" />
                    Repasa «{course.lessonTitles[question.lesson]}»
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ) : (
        <Callout tone="success" title="Sin fallos">
          Has acertado todas las preguntas.
        </Callout>
      )}

      <Button asChild variant="ghost" className="self-start">
        <Link href={`/cursos/${course.slug}`}>Volver al curso</Link>
      </Button>
    </section>
  );
}
