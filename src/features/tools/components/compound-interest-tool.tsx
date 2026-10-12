"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Callout } from "@/components/ui/callout";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { compoundGrowth, type YearPoint } from "@/lib/finance/compound-interest";
import { formatEuro, formatNumber, parseEuroInput, toEuroInput, keepUnits } from "@/lib/format";
import { MoneyField } from "./money-field";

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

function SliderField({
  id,
  label,
  value,
  display,
  valueText,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  valueText: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <Label id={id}>{label}</Label>
        <span className="font-mono tabular text-lg">{display}</span>
      </div>
      <Slider
        aria-labelledby={id}
        aria-valuetext={valueText}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v ?? value)}
      />
    </div>
  );
}

const SERIES = [
  { key: "balance", label: "Lo que acumulas", color: "var(--chart-1)" },
  { key: "contributed", label: "Lo que aportas", color: "var(--chart-2)" },
] as const;

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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: "var(--border-strong)" }}
              tick={{ fill: "var(--fg-muted)", fontSize: 12 }}
              tickFormatter={(year: number) => `${year}`}
              minTickGap={16}
            />
            <YAxis
              width={56}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--fg-muted)", fontSize: 12 }}
              tickFormatter={(n: number) => euros(n)}
            />
            <Tooltip
              cursor={{ stroke: "var(--border-strong)" }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="flex flex-col gap-1 rounded-md border border-border bg-surface-raised p-3 text-sm shadow-overlay">
                    <span className="font-medium">Año {label}</span>
                    {SERIES.map((s) => {
                      const point = payload[0]?.payload as YearPoint | undefined;
                      return (
                        <span key={s.key} className="flex items-center gap-2 text-fg-muted">
                          <span
                            aria-hidden
                            className="size-2 rounded-full"
                            style={{ background: s.color }}
                          />
                          {s.label}:{" "}
                          <span className="font-mono tabular text-fg">
                            {point ? euros(point[s.key]) : ""}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="var(--chart-1)"
              fillOpacity={0.12}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="contributed"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="var(--chart-2)"
              fillOpacity={0.15}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
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
