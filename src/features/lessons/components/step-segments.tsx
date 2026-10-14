import { cn } from "@/lib/utils";

/** Segmented progress: one segment per step, filled up to the current one. */
export function StepSegments({
  total,
  current,
  finished,
  label = "Progreso de la lección",
  className,
}: {
  total: number;
  current: number;
  finished: boolean;
  label?: string | undefined;
  className?: string;
}) {
  const done = finished ? total : current + 1;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-valuetext={finished ? "Lección completada" : `Paso ${current + 1} de ${total}`}
      className={cn("flex h-1.5 w-full gap-1", className)}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="relative flex-1 overflow-hidden rounded-full bg-surface-muted">
          <span
            className={cn(
              "absolute inset-0 origin-left rounded-full bg-brand transition-transform duration-(--duration-slow) ease-(--ease-out)",
              i < done ? "scale-x-100" : "scale-x-0",
            )}
          />
        </span>
      ))}
    </div>
  );
}
