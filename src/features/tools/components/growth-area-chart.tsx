"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearPoint } from "@/lib/finance/compound-interest";
import { formatEuro } from "@/lib/format";
import { SERIES } from "./growth-series";

const euros = (n: number) => formatEuro(n, { decimals: false });

/** What you put in against what you have, year by year. Loaded on demand (recharts). */
export default function GrowthAreaChart({ points }: { points: YearPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={points}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        // Hidden from assistive tech: the same data is in the table below.
        accessibilityLayer={false}
        tabIndex={-1}
      >
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
  );
}
