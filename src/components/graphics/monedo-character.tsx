"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { MonedoExpression } from "./monedo-expressions";

const FACE = "stroke-brand-fg";
const line = {
  fill: "none",
  strokeWidth: 3.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Both eyes share one group so a blink squashes them together around this line. */
const EYE_Y = 57;

function Eyes({ expression }: { expression: MonedoExpression }) {
  switch (expression) {
    case "celebrating":
      // Closed, smiling eyes: nothing to blink.
      return (
        <>
          <path d="M41 59 Q47 51 53 59" className={FACE} {...line} />
          <path d="M67 59 Q73 51 79 59" className={FACE} {...line} />
        </>
      );
    case "thinking":
      // Looking up and to the side.
      return (
        <>
          <ellipse cx="50" cy="53" rx="5" ry="6.5" className="fill-brand-fg" />
          <ellipse cx="76" cy="53" rx="5" ry="6.5" className="fill-brand-fg" />
        </>
      );
    case "oops":
      return (
        <>
          <circle cx="47" cy={EYE_Y} r="6" className="fill-brand-fg" />
          <circle cx="73" cy={EYE_Y} r="6" className="fill-brand-fg" />
        </>
      );
    default:
      return (
        <>
          <ellipse cx="47" cy={EYE_Y} rx="5" ry="7" className="fill-brand-fg" />
          <ellipse cx="73" cy={EYE_Y} rx="5" ry="7" className="fill-brand-fg" />
        </>
      );
  }
}

function Brows({ expression }: { expression: MonedoExpression }) {
  switch (expression) {
    case "explaining":
      return (
        <>
          <path d="M41 43 Q47 39.5 53 43" className={FACE} {...line} strokeWidth={3} />
          <path d="M67 43 Q73 39.5 79 43" className={FACE} {...line} strokeWidth={3} />
        </>
      );
    case "thinking":
      return (
        <>
          <path d="M44 42.5 L55 42.5" className={FACE} {...line} strokeWidth={3} />
          <path d="M70 39 Q76 35 82 39" className={FACE} {...line} strokeWidth={3} />
        </>
      );
    case "oops":
      // Inner ends up: worried.
      return (
        <>
          <path d="M40 44 L52 40" className={FACE} {...line} strokeWidth={3} />
          <path d="M68 40 L80 44" className={FACE} {...line} strokeWidth={3} />
        </>
      );
    default:
      return null;
  }
}

function Mouth({ expression, talking }: { expression: MonedoExpression; talking: boolean }) {
  switch (expression) {
    case "explaining":
      return (
        <motion.path
          d="M49 71 Q60 73 71 71 Q69 83 60 83 Q51 83 49 71 Z"
          className="fill-brand-fg"
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          animate={talking ? { scaleY: [1, 0.45, 1, 0.7, 1] } : { scaleY: 1 }}
          transition={
            talking ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.12 }
          }
        />
      );
    case "thinking":
      return <path d="M54 77 Q60 75 67 74" className={FACE} {...line} />;
    case "celebrating":
      return (
        <path d="M45 68 Q60 70.5 75 68 Q73 86 60 86 Q47 86 45 68 Z" className="fill-brand-fg" />
      );
    case "oops":
      return <path d="M49 78 Q54.5 73 60 78 Q65.5 83 71 78" className={FACE} {...line} />;
    default:
      return <path d="M49 72 Q60 81 71 72" className={FACE} {...line} />;
  }
}

/** Small marks outside the coin that make each mood readable at a glance. */
function Extras({ expression }: { expression: MonedoExpression }) {
  switch (expression) {
    case "thinking":
      return (
        <g className="fill-fg-subtle">
          <circle cx="99" cy="26" r="2.5" />
          <circle cx="106" cy="17" r="3.5" />
          <circle cx="114" cy="7" r="4.5" />
        </g>
      );
    case "celebrating":
      return (
        <g className="fill-brand-text">
          <path d="M13 24 L15 31 L22 33 L15 35 L13 42 L11 35 L4 33 L11 31 Z" />
          <path d="M106 14 L107.5 19 L112.5 20.5 L107.5 22 L106 27 L104.5 22 L99.5 20.5 L104.5 19 Z" />
          <path d="M108 88 L109.2 92 L113 93.2 L109.2 94.4 L108 98.4 L106.8 94.4 L103 93.2 L106.8 92 Z" />
        </g>
      );
    case "oops":
      return (
        <path
          d="M96 30 C96 30 90.5 37 90.5 40.5 A5.5 5.5 0 0 0 101.5 40.5 C101.5 37 96 30 96 30 Z"
          className="fill-fg-subtle"
        />
      );
    default:
      return null;
  }
}

function useBlink(enabled: boolean): boolean {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      // Irregular gaps (2.5–5.5 s) read as alive; a fixed rhythm reads as a machine.
      timer = setTimeout(
        () => {
          setClosed(true);
          timer = setTimeout(() => {
            setClosed(false);
            schedule();
          }, 130);
        },
        2500 + Math.random() * 3000,
      );
    };
    schedule();
    return () => clearTimeout(timer);
  }, [enabled]);
  return enabled && closed;
}

/**
 * Reeded edge, the fine grooves that make a coin read as a coin: radial ticks around the rim
 * of the face and vertical grooves on the visible thickness below it. Computed once.
 */
const RIM_TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const [cos, sin] = [Math.cos(a), Math.sin(a)];
  const r = (n: number) => n.toFixed(2);
  return `M${r(60 + 38.5 * cos)} ${r(62 + 38.5 * sin)}L${r(60 + 41.5 * cos)} ${r(62 + 41.5 * sin)}`;
}).join("");

const EDGE_GROOVES = Array.from({ length: 27 }, (_, i) => {
  const dx = -39 + i * 3;
  const y = 62 + Math.sqrt(42 * 42 - dx * dx);
  return `M${60 + dx} ${(y + 0.6).toFixed(2)}V${(y + 3.6).toFixed(2)}`;
}).join("");

/**
 * Monedo, the course guide: an original coin with a simple face, in brand colours.
 * Five expressions; blinks every few seconds and bounces gently while `talking`.
 * All motion stops when the learner asks for reduced motion.
 * Decorative by default (the words next to it carry the meaning); pass `label` when it
 * stands alone.
 */
export function MonedoCharacter({
  expression = "normal",
  talking = false,
  label,
  className,
}: {
  expression?: MonedoExpression | undefined;
  talking?: boolean | undefined;
  label?: string | undefined;
  className?: string | undefined;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const blinking = useBlink(!reduceMotion && expression !== "celebrating");
  const animateTalk = talking && !reduceMotion;

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-16 shrink-0 overflow-visible", className)}
      data-expression={expression}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <Extras expression={expression} />
      <motion.g
        key={expression}
        // Same on server and client (no hydration mismatch); MotionConfig skips it on reduced motion.
        initial={{ scale: 0.94 }}
        animate={animateTalk ? { scale: 1, y: [0, -3, 0, -1.5, 0] } : { scale: 1, y: 0 }}
        transition={
          animateTalk
            ? { scale: { duration: 0.2 }, y: { duration: 0.9, repeat: Infinity } }
            : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
        }
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      >
        {/* Coin: the darker disc peeking below gives it thickness; the grooves make it a coin. */}
        <circle cx="60" cy="66" r="42" className="fill-brand-hover" />
        <circle cx="60" cy="62" r="42" className="fill-brand" />
        <path d={EDGE_GROOVES} className="stroke-brand-fg" strokeOpacity={0.28} strokeWidth={1.2} />
        <path d={RIM_TICKS} className="stroke-brand-fg" strokeOpacity={0.22} strokeWidth={1.4} />
        <circle
          cx="60"
          cy="62"
          r="35"
          fill="none"
          className="stroke-brand-fg"
          strokeOpacity={0.2}
          strokeWidth={2}
        />
        <path
          d="M27.5 50 A35 35 0 0 1 45 30"
          fill="none"
          className="stroke-brand-fg"
          strokeOpacity={0.4}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Brows expression={expression} />
        <motion.g
          style={{ transformOrigin: `60px ${EYE_Y}px` }}
          animate={{ scaleY: blinking ? 0.1 : 1 }}
          transition={{ duration: 0.07 }}
        >
          <Eyes expression={expression} />
        </motion.g>
        <Mouth expression={expression} talking={animateTalk} />
      </motion.g>
    </svg>
  );
}
