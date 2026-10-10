"use client";

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

/** Learner stats from local progress, plus a way to delete it. */
export function ProfileSummary() {
  const ready = useProgress((s) => s.status === "ready");
  const lessons = useProgress((s) => s.snapshot.lessons);
  const activityDays = useProgress((s) => s.snapshot.activityDays.length);
  const reset = useProgress((s) => s.reset);
  const completed = Object.values(lessons).filter((l) => l.completedAt).length;
  const started = Object.keys(lessons).length;
  const show = (n: number) => (ready ? n : "–");

  return (
    <div className="flex flex-col gap-10">
      <dl className="grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-3">
        <Stat label="Lecciones completadas" value={show(completed)} />
        <Stat label="Lecciones empezadas" value={show(started)} />
        <Stat label="Días aprendiendo" value={show(activityDays)} />
      </dl>
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
            <Button variant="secondary" className="w-fit" disabled={!ready || started === 0}>
              Borrar mi progreso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>¿Borrar todo tu progreso?</DialogTitle>
            <DialogDescription>
              Se borrarán tus lecciones, respuestas y días de actividad de este navegador.
            </DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="danger" onClick={() => void reset()}>
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
