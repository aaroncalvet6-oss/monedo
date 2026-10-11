"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/features/progress/progress-provider";
import { continueTarget, type CourseOutline } from "@/lib/progress/continue";

const lessonHref = (courseSlug: string, lessonSlug: string) =>
  `/cursos/${courseSlug}/${lessonSlug}`;

/** «Continúa donde lo dejaste». Renders nothing until there is progress to resume. */
export function ContinueLearning({ courses }: { courses: readonly CourseOutline[] }) {
  const lessons = useProgress((s) => s.snapshot.lessons);
  const ready = useProgress((s) => s.status === "ready");
  const target = ready ? continueTarget(courses, lessons) : null;
  if (!target) return null;
  const { course, lesson, progress } = target;
  return (
    <section
      aria-labelledby="continuar"
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-2">
        <h2 id="continuar" className="text-sm font-medium text-brand-text">
          Continúa donde lo dejaste
        </h2>
        <p className="text-xl font-semibold tracking-tight">{lesson.title}</p>
        <p className="text-base text-fg-muted">
          {course.title} · {lesson.minutes} min
        </p>
        <div className="flex max-w-xs items-center gap-3">
          <Progress value={progress.done / progress.total} label={`Progreso en ${course.title}`} />
          <span className="shrink-0 font-mono tabular text-sm text-fg-muted">
            {progress.done}/{progress.total}
          </span>
        </div>
      </div>
      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href={lessonHref(course.slug, lesson.slug)}>
          Continuar
          <ArrowRight />
        </Link>
      </Button>
    </section>
  );
}

/** Hero button: «Continuar» to the lesson to resume, or «Empezar» with the first course. */
export function PrimaryAction({ courses }: { courses: readonly CourseOutline[] }) {
  const lessons = useProgress((s) => s.snapshot.lessons);
  const ready = useProgress((s) => s.status === "ready");
  const target = ready ? continueTarget(courses, lessons) : null;
  const first = courses[0];
  const href = target
    ? lessonHref(target.course.slug, target.lesson.slug)
    : first
      ? `/cursos/${first.slug}`
      : "/cursos";
  return (
    <Button asChild size="lg">
      <Link href={href}>
        {target ? "Continuar" : "Empezar"}
        <ArrowRight />
      </Link>
    </Button>
  );
}
