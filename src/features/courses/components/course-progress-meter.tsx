"use client";

import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/features/progress/progress-provider";
import { courseProgress, type CourseOutline } from "@/lib/progress/continue";

/** «2/6 lecciones» with a bar, from local progress. Neutral until progress is read. */
export function CourseProgressMeter({ course }: { course: CourseOutline }) {
  const lessons = useProgress((s) => s.snapshot.lessons);
  const ready = useProgress((s) => s.status === "ready");
  const { done, total } = courseProgress(course, lessons);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm text-fg-muted">
        <span>{ready && done === total ? "Completado" : "Tu progreso"}</span>
        <span className="font-mono tabular">
          {ready ? done : 0}/{total} lecciones
        </span>
      </div>
      <Progress
        value={ready ? done / total : 0}
        label={`Lecciones completadas de ${course.title}`}
      />
    </div>
  );
}
