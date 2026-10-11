import { CheckCircle2 } from "lucide-react";
import { KeyFigure } from "@/components/ui/key-figure";
import type { TutorCard } from "@/features/tutor/types";
import { formatNumber, keepUnits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WorkHoursWidget } from "./widgets/work-hours-widget";

/** Structured content of a lesson section. Widgets are registered here by id. */
export function SectionCard({ card }: { card: TutorCard }) {
  switch (card.kind) {
    case "objective":
      return (
        <div className="flex measure flex-col gap-5">
          <ul className="flex flex-col gap-4">
            {card.items.map((item) => (
              <li key={item} className="flex gap-3 text-lg leading-8">
                <CheckCircle2 aria-hidden className="mt-1.5 size-5 shrink-0 text-brand-text" />
                <span>{keepUnits(item.charAt(0).toUpperCase() + item.slice(1))}.</span>
              </li>
            ))}
          </ul>
          <p className="text-base text-fg-muted">
            {card.minutes} minutos · Tu progreso se guarda en cada paso.
          </p>
        </div>
      );
    case "example": {
      const { block } = card;
      return (
        <div className="flex measure flex-col gap-4">
          {block.figures ? (
            <dl className="divide-y divide-border border-y border-border">
              {block.figures.map((figure) => (
                <div
                  key={figure.label}
                  className={cn(
                    "flex items-baseline justify-between gap-4 py-3 text-base",
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
        </div>
      );
    }
    case "key-figure":
      return (
        <KeyFigure
          value={card.block.value}
          fractionDigits={card.block.fractionDigits}
          unit={card.block.unit}
          context={keepUnits(card.block.context)}
          source={card.block.source}
        />
      );
    case "interactive": {
      const { config } = card.block;
      return config.widget === "work-hours" ? (
        <WorkHoursWidget
          defaultPrice={config.defaultPrice}
          defaultHourlyWage={config.defaultHourlyWage}
        />
      ) : null;
    }
    case "key-ideas":
      return (
        <ol className="flex measure flex-col">
          {card.block.items.map((item, index) => (
            <li key={item} className="flex gap-5 border-t border-border py-5 last:border-b">
              <span className="font-mono tabular text-3xl leading-none font-medium tracking-tight text-brand-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-lg leading-8">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "challenge":
      return (
        <ol className="flex measure flex-col gap-4">
          {card.block.steps.map((step, index) => (
            <li key={step} className="flex gap-4 text-lg leading-8">
              <span
                aria-hidden
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-border-strong font-mono text-sm text-fg-muted"
              >
                {index + 1}
              </span>
              {keepUnits(step)}
            </li>
          ))}
        </ol>
      );
  }
}
