"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

/** A labelled slider that shows its current value. */
export function SliderField({
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
