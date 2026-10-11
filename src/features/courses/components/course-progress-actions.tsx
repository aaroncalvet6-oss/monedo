"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/features/progress/progress-provider";
import { lessonKey } from "@/lib/progress/lesson-progress";

/** Start/continue button and progress for a course page, from local progress. */
export function CourseProgressActions({
  courseSlug,
  lessons,
}: {
  courseSlug: string;
  lessons: readonly { slug: string; title: string }[];
}) {
  const stored = useProgress((s) => s.snapshot.lessons);
  const ready = useProgress((s) => s.status === "ready");
  const done = lessons.filter((l) => stored[lessonKey(courseSlug, l.slug)]?.completedAt).length;
  const started = lessons.some((l) => stored[lessonKey(courseSlug, l.slug)]);
  const nextLesson =
    lessons.find((l) => !stored[lessonKey(courseSlug, l.slug)]?.completedAt) ?? lessons[0];

  return (
    <div className="flex flex-col gap-4">
      {nextLesson ? (
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={`/cursos/${courseSlug}/${nextLesson.slug}`}>
            {ready && started ? `Continuar: ${nextLesson.title}` : "Empezar el curso"}
            <ArrowRight />
          </Link>
        </Button>
      ) : null}
      <div className="flex max-w-sm flex-col gap-2">
        <div className="flex justify-between text-sm text-fg-muted">
          <span>Tu progreso</span>
          <span className="font-mono tabular">
            {done}/{lessons.length} lecciones
          </span>
        </div>
        <Progress value={done / lessons.length} label="Lecciones completadas del curso" />
      </div>
    </div>
  );
}
