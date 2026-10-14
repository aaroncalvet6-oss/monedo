"use client";

import { Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Stat } from "@/components/ui/stat";
import { useProgress } from "@/features/progress/progress-provider";
import { certificateName } from "@/lib/certificates/certificate-name";

/** Learner stats from local progress, earned certificates, and a way to delete it all. */
export function ProfileSummary({ courses }: { courses: { slug: string; title: string }[] }) {
  const ready = useProgress((s) => s.status === "ready");
  const lessons = useProgress((s) => s.snapshot.lessons);
  const activityDays = useProgress((s) => s.snapshot.activityDays.length);
  const assessments = useProgress((s) => s.snapshot.assessments);
  const reset = useProgress((s) => s.reset);
  const earned = courses.filter((c) => assessments[c.slug]?.passedAt);
  const completed = Object.values(lessons).filter((l) => l.completedAt).length;
  const started = Object.keys(lessons).length;
  const hasData = started > 0 || Object.keys(assessments).length > 0;
  const show = (n: number) => (ready ? n : "–");

  return (
    <div className="flex flex-col gap-10">
      <dl className="grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-3">
        <Stat label="Lecciones completadas" value={show(completed)} />
        <Stat label="Lecciones empezadas" value={show(started)} />
        <Stat label="Días aprendiendo" value={show(activityDays)} />
      </dl>
      <section aria-labelledby="certificados" className="flex flex-col gap-4">
        <h2 id="certificados" className="text-lg font-semibold tracking-tight">
          Tus certificados
        </h2>
        {!ready ? null : earned.length === 0 ? (
          <p className="measure text-base leading-7 text-fg-muted">
            Aprueba la evaluación final de un curso para conseguir su certificado de finalización.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {earned.map((course) => (
              <li key={course.slug}>
                <Link
                  href={`/cursos/${course.slug}/certificado`}
                  className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-amber-subtle text-amber-text">
                    <Award aria-hidden className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm text-fg-muted">Certificado de finalización</span>
                    <span className="text-lg font-medium">{course.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section aria-labelledby="tus-datos" className="flex measure flex-col gap-3">
        <h2 id="tus-datos" className="text-lg font-semibold tracking-tight">
          Tus datos
        </h2>
        <p className="text-base leading-7 text-fg-muted">
          Tu progreso solo se guarda en este navegador. No tienes cuenta ni enviamos nada a ningún
          servidor. Si lo borras, no se puede recuperar.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-fit" disabled={!ready || !hasData}>
              Borrar mi progreso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>¿Borrar todo tu progreso?</DialogTitle>
            <DialogDescription>
              Se borrarán de este navegador tus lecciones, respuestas, evaluaciones, días de
              actividad y el nombre de tus certificados.
            </DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="danger"
                  onClick={() => {
                    certificateName.clear();
                    void reset();
                  }}
                >
                  Borrar
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
