"use client";

import { useId, useState } from "react";
import { InputWithUnit } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatNumber, parseEuroInput, toEuroInput as toInputValue } from "@/lib/format";
import { workHoursFor } from "@/lib/finance/work-hours";
import { cn } from "@/lib/utils";

const presets = [
  { label: "Menú", price: 12 },
  { label: "Videojuego", price: 70 },
  { label: "Zapatillas", price: 90 },
  { label: "Móvil", price: 600 },
];

export { parseEuroInput };

export function WorkHoursWidget({
  defaultPrice,
  defaultHourlyWage,
}: {
  defaultPrice: number;
  defaultHourlyWage: number;
}) {
  const id = useId();
  const [priceText, setPriceText] = useState(() => toInputValue(defaultPrice));
  const [wage, setWage] = useState(defaultHourlyWage);
  const price = parseEuroInput(priceText);
  const result = workHoursFor(price, wage);
  const invalid = priceText.trim() !== "" && result === null;

  return (
    <div className="flex measure flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <Label id={`${id}-wage`}>Cobras por hora (neto)</Label>
          <span className="text-lg">
            <span className="font-mono tabular">{formatNumber(wage, 2)}</span>
            <span className="ml-1 text-fg-muted">€/h</span>
          </span>
        </div>
        <Slider
          aria-labelledby={`${id}-wage`}
          aria-valuetext={`${formatNumber(wage, 2)} euros por hora`}
          min={4}
          max={20}
          step={0.5}
          value={[wage]}
          onValueChange={([v]) => setWage(v ?? defaultHourlyWage)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor={`${id}-price`}>Precio de lo que quieres</Label>
        <InputWithUnit
          id={`${id}-price`}
          unit="€"
          value={priceText}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onChange={(event) => setPriceText(event.target.value)}
        />
        {invalid ? (
          <p id={`${id}-error`} className="text-sm text-danger">
            Escribe un precio válido, por ejemplo 89,99.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Precios de ejemplo">
          {presets.map((preset) => {
            const active = price === preset.price;
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => setPriceText(toInputValue(preset.price))}
                className={cn(
                  "inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-base transition-colors duration-(--duration-fast) md:h-9 md:text-sm",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  active
                    ? "border-brand bg-brand-subtle text-brand-subtle-fg"
                    : "border-border-strong text-fg-muted hover:border-border-control hover:text-fg",
                )}
              >
                {preset.label}
                <span>
                  <span className="font-mono tabular">{formatNumber(preset.price)}</span> €
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <output
        htmlFor={`${id}-price`}
        aria-live="polite"
        className="flex flex-col gap-2 border-t border-border pt-6"
      >
        <span className="text-sm text-fg-muted">Te cuesta</span>
        <span className="flex flex-wrap items-baseline gap-x-3 leading-none">
          <span className="font-mono tabular text-[clamp(3rem,14vw,4.5rem)] font-medium tracking-[-0.05em]">
            {result ? formatNumber(result.hours, 2) : "–"}
          </span>
          <span className="text-2xl font-medium text-fg-muted">horas</span>
        </span>
        {result ? (
          <span className="text-base text-fg-muted">
            {result.wholeHours} h{result.minutes > 0 ? ` ${result.minutes} min` : ""} de trabajo
            {result.hours >= 8 ? ` · ${formatNumber(result.hours / 8, 1)} jornadas de 8 horas` : ""}
          </span>
        ) : null}
      </output>
    </div>
  );
}
