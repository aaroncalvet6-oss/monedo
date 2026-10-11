import { CheckCircle2 } from "lucide-react";
import { KeyFigure } from "@/components/ui/key-figure";
import type { TutorCard } from "@/features/tutor/types";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WorkHoursWidget } from "../widgets/work-hours-widget";

/** Rich content inside the conversation: a bordered panel, wider than a bubble. */
export function TutorCardView({ card }: { card: TutorCard }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <CardBody card={card} />
    </div>
  );
}

function CardTitle({ label, title }: { label: string; title?: string | undefined }) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <p className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase">{label}</p>
      {title ? <h3 className="text-lg font-semibold tracking-tight">{title}</h3> : null}
    </div>
  );
}

function CardBody({ card }: { card: TutorCard }) {
  switch (card.kind) {
    case "objective":
      return (
        <>
          <CardTitle label="Al terminar sabrás" />
          <ul className="flex flex-col gap-3">
            {card.items.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7">
                <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-brand-text" />
                <span>{item.charAt(0).toUpperCase() + item.slice(1)}.</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-fg-muted">
            {card.minutes} minutos · Tu progreso se guarda solo.
          </p>
        </>
      );
    case "example":
      return (
        <>
          <CardTitle label="Ejemplo" title={card.block.title} />
          <p className="mb-3 text-sm text-fg-muted">{card.block.character}</p>
          {card.block.figures ? (
            <dl className="divide-y divide-border border-y border-border">
              {card.block.figures.map((figure) => (
                <div
                  key={figure.label}
                  className={cn(
                    "flex items-baseline justify-between gap-4 py-2.5 text-base",
                    figure.emphasis && "font-medium",
                  )}
                >
                  <dt className={figure.emphasis ? "text-fg" : "text-fg-muted"}>{figure.label}</dt>
                  <dd
                    className={cn(
                      "font-mono tabular",
                      figure.emphasis ? "text-xl text-brand-text" : "text-fg",
                    )}
                  >
                    {formatNumber(figure.value, figure.fractionDigits ?? 0)}
                    {figure.unit ? (
                      <span className="ml-1 font-sans text-fg-muted">{figure.unit}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </>
      );
    case "key-figure":
      return (
        <KeyFigure
          value={card.block.value}
          fractionDigits={card.block.fractionDigits}
          unit={card.block.unit}
          context={card.block.context}
          source={card.block.source}
        />
      );
    case "interactive": {
      const { config } = card.block;
      return (
        <>
          <CardTitle label="Practica" title={card.block.title} />
          {config.widget === "work-hours" ? (
            <WorkHoursWidget
              defaultPrice={config.defaultPrice}
              defaultHourlyWage={config.defaultHourlyWage}
            />
          ) : null}
        </>
      );
    }
    case "key-ideas":
      return (
        <>
          <CardTitle label="Ideas clave" title="Lo que te llevas" />
          <ol className="flex flex-col">
            {card.block.items.map((item, index) => (
              <li key={item} className="flex gap-4 border-t border-border py-4 last:pb-0">
                <span className="font-mono tabular text-2xl leading-none font-medium tracking-tight text-brand-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base leading-7">{item}</span>
              </li>
            ))}
          </ol>
        </>
      );
    case "challenge":
      return (
        <>
          <CardTitle label="Reto práctico" title={card.block.title} />
          <p className="mb-4 text-base leading-7 text-fg-muted">{card.block.description}</p>
          <ol className="flex flex-col gap-3">
            {card.block.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-base leading-7">
                <span
                  aria-hidden
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border-strong font-mono text-xs text-fg-muted"
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </>
      );
  }
}
