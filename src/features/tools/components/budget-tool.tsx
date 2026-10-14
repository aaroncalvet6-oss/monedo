"use client";

import { useId, useState } from "react";
import { Callout } from "@/components/ui/callout";
import {
  MAX_SAVINGS_RATE,
  SAVINGS_RATE,
  teenBudget,
  type TeenBudget,
} from "@/lib/finance/teen-budget";
import { formatEuro, parseEuroInput, toEuroInput, keepUnits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MoneyField } from "./money-field";
import { SliderField } from "./slider-field";

const eur = (n: number) => formatEuro(n, { decimals: !Number.isInteger(n) });
const pct = (rate: number) => `${Math.round(rate * 100)} %`;

/** The sentence that explains the budget. Exported for tests. */
export function budgetSentence(budget: TeenBudget): string {
  const {
    income,
    ownExpenses,
    savings,
    freeSpending,
    savingsTarget,
    savingsRate,
    shortfall,
    status,
  } = budget;
  if (income === 0 && ownExpenses === 0) return "Escribe lo que recibes al mes para empezar.";
  if (status === "over-income")
    return `Lo que pagas tú (${eur(ownExpenses)}) supera lo que recibes (${eur(income)}): te faltan ${eur(ownExpenses - income)} al mes. Revisa qué gastos puedes recortar antes de pensar en ahorrar.`;
  if (status === "savings-short")
    return `De tus ${eur(income)} al mes, ${eur(ownExpenses)} van a lo que pagas tú. Solo te quedan ${eur(savings)} para ahorrar: te faltan ${eur(shortfall)} para llegar al ${pct(savingsRate)} (${eur(savingsTarget)}).`;
  const saving =
    savingsRate === 0
      ? "No apartas nada para ahorrar"
      : `Apartas ${eur(savings)} (el ${pct(savingsRate)}) el día que cobras`;
  return `De tus ${eur(income)} al mes, ${eur(ownExpenses)} van a lo que pagas tú. ${saving} y te quedan ${eur(freeSpending)} de gasto libre.`;
}

const PARTS = [
  { key: "ownExpenses", label: () => "Lo que pagas tú", className: "bg-fg-subtle" },
  { key: "savings", label: (rate: number) => `Ahorro (${pct(rate)})`, className: "bg-brand" },
  { key: "freeSpending", label: () => "Gasto libre", className: "bg-chart-2" },
] as const;

export function BudgetTool() {
  const id = useId();
  const [savingsPercent, setSavingsPercent] = useState(SAVINGS_RATE * 100);
  const [fields, setFields] = useState({
    allowance: toEuroInput(60),
    gifts: toEuroInput(0),
    jobs: toEuroInput(0),
    ownExpenses: toEuroInput(20),
  });
  const set = (key: keyof typeof fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }));
  const amount = (text: string) => (text.trim() === "" ? 0 : parseEuroInput(text));
  const invalid = (text: string) => text.trim() !== "" && Number.isNaN(parseEuroInput(text));

  const budget = teenBudget({
    allowance: amount(fields.allowance),
    gifts: amount(fields.gifts),
    jobs: amount(fields.jobs),
    ownExpenses: amount(fields.ownExpenses),
    savingsRate: savingsPercent / 100,
  });

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-6">
        <legend className="mb-4 text-lg font-semibold tracking-tight">Lo que recibes al mes</legend>
        <div className="grid gap-6 md:grid-cols-3">
          <MoneyField
            label="Paga"
            value={fields.allowance}
            onChange={set("allowance")}
            invalid={invalid(fields.allowance)}
          />
          <MoneyField
            label="Regalos"
            hint="De media, al mes"
            value={fields.gifts}
            onChange={set("gifts")}
            invalid={invalid(fields.gifts)}
          />
          <MoneyField
            label="Trabajos"
            hint="Canguro, clases…"
            value={fields.jobs}
            onChange={set("jobs")}
            invalid={invalid(fields.jobs)}
          />
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-6">
        <legend className="mb-4 text-lg font-semibold tracking-tight">
          Lo que pagas tú de verdad
        </legend>
        <div className="md:max-w-xs">
          <MoneyField
            label="Gastos que pagas tú al mes"
            hint="Recarga del móvil, transporte, almuerzos… Lo que no paga tu familia."
            value={fields.ownExpenses}
            onChange={set("ownExpenses")}
            invalid={invalid(fields.ownExpenses)}
          />
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 text-lg font-semibold tracking-tight">Lo que ahorras</legend>
        <div className="md:max-w-sm">
          <SliderField
            id={`${id}-savings`}
            label="Porcentaje de ahorro"
            value={savingsPercent}
            display={`${savingsPercent} %`}
            valueText={`${savingsPercent} por ciento de lo que recibes`}
            min={0}
            max={MAX_SAVINGS_RATE * 100}
            step={5}
            onChange={setSavingsPercent}
          />
        </div>
        <p className="measure text-base leading-7 text-fg-muted">
          Empieza por el {SAVINGS_RATE * 100} %. Si tu familia te paga casi todo, puedes ahorrar
          más.
        </p>
      </fieldset>

      <output aria-live="polite" className="flex flex-col gap-6 border-t border-border pt-6">
        {budget ? (
          <>
            {budget.status === "over-income" ? (
              <Callout tone="danger" title="Tus gastos superan tus ingresos">
                Lo que pagas tú es más de lo que recibes cada mes.
              </Callout>
            ) : budget.status === "savings-short" ? (
              <Callout tone="info" title={`No te llega para ahorrar el ${savingsPercent} %`}>
                Lo que pagas tú y el ahorro suman más de lo que recibes.
              </Callout>
            ) : null}
            <p className="measure text-lg leading-8">{keepUnits(budgetSentence(budget))}</p>
            {budget.status !== "over-income" && budget.income > 0 ? (
              <BudgetBar budget={budget} />
            ) : null}
          </>
        ) : (
          <p className="text-lg">Escribe cantidades válidas para ver tu presupuesto.</p>
        )}
      </output>
      <p className="measure text-base leading-7 text-fg-muted">
        Nada de lo que escribes sale de tu navegador.
      </p>
    </div>
  );
}

function BudgetBar({ budget }: { budget: TeenBudget }) {
  return (
    <div className="flex flex-col gap-4">
      <div aria-hidden className="flex h-4 w-full gap-0.5 overflow-hidden rounded-xs">
        {PARTS.map((part) =>
          budget[part.key] > 0 ? (
            <span
              key={part.key}
              className={cn("h-full first:rounded-l-xs last:rounded-r-xs", part.className)}
              style={{ width: `${(budget[part.key] / budget.income) * 100}%` }}
            />
          ) : null,
        )}
      </div>
      <dl className="flex flex-col divide-y divide-border border-y border-border">
        {PARTS.map((part) => (
          <div key={part.key} className="flex items-center justify-between gap-4 py-3 text-base">
            <dt className="flex items-center gap-2 text-fg-muted">
              <span aria-hidden className={cn("size-3 rounded-xs", part.className)} />
              {part.label(budget.savingsRate)}
            </dt>
            <dd className="font-mono tabular">{eur(budget[part.key])}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-3 text-base font-medium">
          <dt>Total que recibes</dt>
          <dd className="font-mono tabular">{eur(budget.income)}</dd>
        </div>
      </dl>
    </div>
  );
}
