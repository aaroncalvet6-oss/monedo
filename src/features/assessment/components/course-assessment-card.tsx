"use client";

import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/features/progress/progress-provider";

/** On the course page: the final assessment, the best result and, once passed, the certificate. */
export function CourseAssessmentCard({
  courseSlug,
  questions,
  passMark,
}: {
  courseSlug: string;
  questions: number;
  passMark: number;
}) {
  const result = useProgress((s) =>
    s.status === "ready" ? s.snapshot.assessments[courseSlug] : undefined,
  );
  const passed = Boolean(result?.passedAt);
  return (
    <section
      aria-labelledby="evaluacion-final"
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="evaluacion-final" className="text-xl font-semibold tracking-tight">
          Evaluación final y certificado
        </h2>
        <p className="text-base leading-7 text-fg-muted">
          {questions} preguntas al azar. Con {passMark} aciertos consigues el certificado de
          finalización del curso.
          {result ? ` Tu mejor resultado: ${result.bestScore} de ${result.total}.` : ""}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant={passed ? "secondary" : "primary"}>
          <Link href={`/cursos/${courseSlug}/evaluacion`}>
            {result ? "Repetir la evaluación" : "Hacer la evaluación final"}
            <ArrowRight />
          </Link>
        </Button>
        {passed ? (
          <Button asChild>
            <Link href={`/cursos/${courseSlug}/certificado`}>
              <Award />
              Ver tu certificado
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
