import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  brand: "text-chart-1",
  amber: "text-amber",
} as const;

/** Circular progress. `value` is a fraction between 0 and 1; fills in with a CSS animation. */
export function ProgressRing({
  value,
  label,
  size = 56,
  stroke = 5,
  tone = "brand",
  children,
  className,
}: {
  value: number;
  label: string;
  size?: number;
  stroke?: number;
  tone?: keyof typeof tones;
  children?: ReactNode;
  className?: string;
}) {
  const clamped = Math.min(1, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="currentColor"
          className={cn("animate-ring-fill", tones[tone])}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          style={{ "--ring-empty": circumference } as CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
