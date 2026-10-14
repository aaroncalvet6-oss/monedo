"use client";

import { useId, useState } from "react";
import dynamic from "next/dynamic";
import { Callout } from "@/components/ui/callout";
import { compoundGrowth, type YearPoint } from "@/lib/finance/compound-interest";
import { formatEuro, formatNumber, parseEuroInput, toEuroInput, keepUnits } from "@/lib/format";
import { MoneyField } from "./money-field";
import { SERIES } from "./growth-series";
import { SliderField } from "./slider-field";

// The chart library is large: it loads after the page, which is already usable without it
// (the same figures are in the sentence and the table).
const GrowthAreaChart = dynamic(() => import("./growth-area-chart"), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-md bg-surface-muted" />,
});

const euros = (n: number) => formatEuro(n, { decimals: false });

/** The sentence that explains the result. Exported for tests. */
export function compoundSentence(
  contributed: number,
  balance: number,
  years: number,
  ratePercent: number,
): string {
  const rate = `${formatNumber(Math.abs(ratePercent), 1)} %`;
  const put = `Si pones ${euros(contributed)} en ${years} ${years === 1 ? "año" : "años"}`;
  if (years === 0) return `Hoy tienes ${euros(balance)}: el interés compuesto necesita tiempo.`;
  if (ratePercent === 0)
    return `${put} y no gana nada, tendrías lo mismo que pusiste: ${euros(balance)}.`;
  const diff = Math.abs(balance - contributed);
  return ratePercent > 0
    ? `${put} y crece un ${rate} al año, tendrías unos ${euros(balance)}. De ellos, ${euros(diff)} los habría ganado tu dinero, no tú.`
    : `${put} y pierde un ${rate} al año, tendrías unos ${euros(balance)}: ${euros(diff)} menos de lo que pusiste.`;
}

export function CompoundInterestTool() {
  const id = useId();
  const [initialText, setInitialText] = useState(() => toEuroInput(100));
  const [monthlyText, setMonthlyText] = useState(() => toEuroInput(12));
  const [years, setYears] = useState(10);
  const [ratePercent, setRatePercent] = useState(4);

  const initial = parseEuroInput(initialText);
  const monthly = parseEuroInput(monthlyText);
  const result = compoundGrowth({ initial, monthly, years, annualRate: ratePercent / 100 });

  return (
    <div className="flex flex-col gap-8">
      <Callout tone="info" title="Ejemplo para aprender">
        Las rentabilidades no están garantizadas y las inversiones pueden bajar.
      </Callout>

      <div className="grid gap-6 md:grid-cols-2">
        <MoneyField
          label="Aportación inicial"
          value={initialText}
          onChange={setInitialText}
          invalid={initialText.trim() !== "" && !(initial >= 0)}
        />
        <MoneyField
          label="Aportación cada mes"
          value={monthlyText}
          onChange={setMonthlyText}
          invalid={monthlyText.trim() !== "" && !(monthly >= 0)}
        />
        <SliderField
          id={`${id}-years`}
          label="Años"
          value={years}
          display={`${years} ${years === 1 ? "año" : "años"}`}
          valueText={`${years} años`}
          min={1}
          max={40}
          step={1}
          onChange={setYears}
        />
        <SliderField
          id={`${id}-rate`}
          label="Rentabilidad anual de ejemplo"
          value={ratePercent}
          display={`${formatNumber(ratePercent, 1)} %`}
          valueText={`${formatNumber(ratePercent, 1)} por ciento al año`}
          min={-5}
          max={10}
          step={0.5}
          onChange={setRatePercent}
        />
      </div>

      <output aria-live="polite" className="flex flex-col gap-3 border-t border-border pt-6">
        <span className="text-sm text-fg-muted">Tendrías</span>
        <span className="font-mono tabular text-[clamp(2.5rem,12vw,3.75rem)] leading-none font-medium tracking-[-0.04em]">
          {result ? euros(result.balance) : "–"}
        </span>
        <span className="measure text-lg leading-8">
          {result
            ? keepUnits(compoundSentence(result.contributed, result.balance, years, ratePercent))
            : "Escribe cantidades válidas para ver el resultado."}
        </span>
      </output>

      {result ? <GrowthChart points={result.points} /> : null}
    </div>
  );
}

function GrowthChart({ points }: { points: YearPoint[] }) {
  return (
    <figure className="flex flex-col gap-4">
      <figcaption className="flex flex-col gap-3">
        <span className="text-lg font-semibold tracking-tight">
          Lo que aportas y lo que acumulas
        </span>
        <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Leyenda">
          {SERIES.map((s) => (
            <li key={s.key} className="flex items-center gap-2 text-base text-fg-muted">
              <span
                aria-hidden
                className="h-0.5 w-5 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </li>
          ))}
        </ul>
      </figcaption>
      <div aria-hidden className="h-60 w-full md:h-72">
        <GrowthAreaChart points={points} />
      </div>
      <details className="group measure">
        <summary className="inline-flex min-h-11 cursor-pointer items-center text-base text-brand-text underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-focus md:min-h-0">
          Ver los datos año a año
        </summary>
        <table className="mt-3 w-full text-base">
          <caption className="sr-only">Lo que aportas y lo que acumulas cada año</caption>
          <thead>
            <tr className="border-b border-border text-left text-sm text-fg-muted">
              <th scope="col" className="py-2 font-medium">
                Año
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Aportas
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Acumulas
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.year} className="border-b border-border">
                <th scope="row" className="py-2 text-left font-normal">
                  {p.year}
                </th>
                <td className="py-2 text-right font-mono tabular">{euros(p.contributed)}</td>
                <td className="py-2 text-right font-mono tabular">{euros(p.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
