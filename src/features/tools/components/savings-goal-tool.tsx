"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addMonths,
  monthlyForGoal,
  monthsBetween,
  monthsToGoal,
  remainingToGoal,
} from "@/lib/finance/savings-goal";
import { formatEuro, formatMonthYear, parseEuroInput, toEuroInput, keepUnits } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import { MoneyField } from "./money-field";

const eur = (n: number) => formatEuro(n, { decimals: !Number.isInteger(n) });
const months = (n: number) => `${n} ${n === 1 ? "mes" : "meses"}`;
const amount = (text: string) => (text.trim() === "" ? 0 : parseEuroInput(text));
const invalid = (text: string) => text.trim() !== "" && Number.isNaN(parseEuroInput(text));

/** «unas zapatillas» → «unas zapatillas»; empty → «tu meta». */
function goalName(text: string) {
  const name = text.trim();
  return name === "" ? "tu meta" : name.charAt(0).toLowerCase() + name.slice(1);
}

/** «I save X a month: when?». Exported for tests; `today` only adds the calendar month. */
export function whenSentence(
  goal: string,
  price: number,
  saved: number,
  monthly: number,
  today?: Date,
): string {
  const remaining = remainingToGoal(price, saved);
  if (remaining === null) return "Escribe cantidades válidas para ver el resultado.";
  if (remaining === 0)
    return `Ya tienes lo que cuesta ${goalName(goal)}. No necesitas ahorrar más.`;
  const n = monthsToGoal(price, saved, monthly);
  if (n === null)
    return monthly === 0
      ? `Si no apartas nada cada mes, no llegarás. Te faltan ${eur(remaining)}: prueba con una cantidad pequeña, como el 20 % de tu paga.`
      : "A ese ritmo tardarías más de cien años. Prueba a apartar un poco más.";
  const when = today ? `, en ${formatMonthYear(addMonths(today, n))}` : "";
  return `Te faltan ${eur(remaining)}. Apartando ${eur(monthly)} al mes, conseguirás ${goalName(goal)} en ${months(n)}${when}.`;
}

/** «I want it by a date: how much a month?». Exported for tests. */
export function howMuchSentence(goal: string, price: number, saved: number, n: number): string {
  const remaining = remainingToGoal(price, saved);
  if (remaining === null) return "Escribe cantidades válidas para ver el resultado.";
  if (remaining === 0)
    return `Ya tienes lo que cuesta ${goalName(goal)}. No necesitas ahorrar más.`;
  const monthly = monthlyForGoal(price, saved, n);
  if (monthly === null) return "Elige una fecha a partir del mes que viene.";
  return `Te faltan ${eur(remaining)}. Para conseguir ${goalName(goal)} en ${months(n)}, aparta ${eur(monthly)} al mes.`;
}

/** "2027-06" for an <input type="month">. */
const monthValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

function parseMonthValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, 1) : null;
}

export function SavingsGoalTool() {
  const id = useId();
  const hydrated = useHydrated();
  const [goal, setGoal] = useState("Unos cascos");
  const [priceText, setPriceText] = useState(() => toEuroInput(80));
  const [savedText, setSavedText] = useState(() => toEuroInput(16));
  const [monthlyText, setMonthlyText] = useState(() => toEuroInput(8));
  const [target, setTarget] = useState<string | null>(null);

  const price = amount(priceText);
  const saved = amount(savedText);
  const monthly = amount(monthlyText);
  const today = hydrated ? new Date() : undefined;
  // Default date: when you would get there saving 8 € a month, so both modes agree at first.
  const targetValue = target ?? (today ? monthValue(addMonths(today, 8)) : "");
  const targetDate = parseMonthValue(targetValue);
  const monthsLeft = today && targetDate ? monthsBetween(today, targetDate) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-goal`}>Qué quieres conseguir</Label>
          <Input
            id={`${id}-goal`}
            value={goal}
            maxLength={60}
            onChange={(event) => setGoal(event.target.value)}
          />
        </div>
        <MoneyField
          label="Cuánto cuesta"
          value={priceText}
          onChange={setPriceText}
          invalid={invalid(priceText)}
        />
        <MoneyField
          label="Cuánto tienes ya"
          value={savedText}
          onChange={setSavedText}
          invalid={invalid(savedText)}
        />
      </div>

      <Tabs defaultValue="cuando" className="flex flex-col gap-2">
        <TabsList aria-label="Qué quieres calcular" className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="cuando">¿Cuándo llego?</TabsTrigger>
          <TabsTrigger value="cuanto">¿Cuánto al mes?</TabsTrigger>
        </TabsList>

        <TabsContent value="cuando" className="flex flex-col gap-6">
          <div className="md:max-w-xs">
            <MoneyField
              label="Cuánto apartas al mes"
              hint="Con 40 € de paga, el 20 % son 8 €."
              value={monthlyText}
              onChange={setMonthlyText}
              invalid={invalid(monthlyText)}
            />
          </div>
          <Result
            figure={(() => {
              const n = monthsToGoal(price, saved, monthly);
              return n === null ? "–" : months(n);
            })()}
            sentence={whenSentence(goal, price, saved, monthly, today)}
          />
        </TabsContent>

        <TabsContent value="cuanto" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 md:max-w-xs">
            <Label htmlFor={`${id}-date`}>Cuándo lo quieres</Label>
            {hydrated ? (
              <Input
                id={`${id}-date`}
                type="month"
                value={targetValue}
                min={today ? monthValue(addMonths(today, 1)) : undefined}
                onChange={(event) => setTarget(event.target.value)}
              />
            ) : (
              <Skeleton className="h-11 md:h-10" />
            )}
          </div>
          {monthsLeft === null ? (
            <Skeleton className="h-24" />
          ) : (
            <Result
              figure={(() => {
                const m = monthlyForGoal(price, saved, monthsLeft);
                return m === null ? "–" : `${eur(m)} al mes`;
              })()}
              sentence={howMuchSentence(goal, price, saved, monthsLeft)}
            />
          )}
        </TabsContent>
      </Tabs>
      <p className="measure text-base leading-7 text-fg-muted">
        Nada de lo que escribes sale de tu navegador.
      </p>
    </div>
  );
}

function Result({ figure, sentence }: { figure: string; sentence: string }) {
  return (
    <output aria-live="polite" className="flex flex-col gap-3 border-t border-border pt-6">
      <span className="font-mono tabular text-[clamp(2.5rem,12vw,3.75rem)] leading-none font-medium tracking-[-0.04em]">
        {figure}
      </span>
      <span className="measure text-lg leading-8">{keepUnits(sentence)}</span>
    </output>
  );
}
