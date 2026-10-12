"use client";

import { useId } from "react";
import { InputWithUnit } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** A euro amount field with its label, an optional hint and an error when it is not valid. */
export function MoneyField({
  label,
  hint,
  value,
  onChange,
  invalid,
  unit = "€",
}: {
  label: string;
  hint?: string | undefined;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  unit?: string | undefined;
}) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : null, invalid ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-fg-muted">
          {hint}
        </p>
      ) : null}
      <InputWithUnit
        id={id}
        unit={unit}
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {invalid ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          Escribe una cantidad válida, por ejemplo 12,50.
        </p>
      ) : null}
    </div>
  );
}
