"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { MonedoCharacter } from "@/components/graphics/monedo-character";
import type { MonedoExpression } from "@/components/graphics/monedo-expressions";
import type { TutorMessage } from "@/features/tutor/types";
import { cn } from "@/lib/utils";
import { TutorCardView } from "./tutor-cards";

export const TUTOR_NAME = "Monedo, tu guía";

/** Keeps figures with their unit on one line in narrow bubbles: «90 €», «8 €/h», «11 h». */
export function keepUnits(text: string): string {
  return text.replace(/(\d) (?=(€|h\b|%|horas|años))/g, "$1\u00a0");
}

/** Pause before each new bubble, so the conversation reads at a human pace. */
export const BUBBLE_DELAY_MS = 450;

const enter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
} as const;

/**
 * One turn of Monedo: avatar with the turn's expression, then bubbles and cards. With
 * `reveal`, messages appear one at a time (all at once with reduced motion) and
 * `onRevealed` fires when the last one is shown.
 */
export function MonedoTurn({
  expression,
  messages,
  reveal,
  showName,
  onRevealed,
}: {
  expression: MonedoExpression;
  messages: readonly TutorMessage[];
  reveal: boolean;
  showName: boolean;
  onRevealed?: (() => void) | undefined;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const animate = reveal && !reduceMotion;
  const [visible, setVisible] = useState(animate ? 0 : messages.length);
  const done = visible >= messages.length;

  useEffect(() => {
    if (done) {
      onRevealed?.();
      return;
    }
    const timer = setTimeout(() => setVisible((v) => v + 1), BUBBLE_DELAY_MS);
    return () => clearTimeout(timer);
    // onRevealed is called once per completion; the parent keeps it stable per turn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, done]);

  return (
    <div className="flex gap-3">
      {/* Its own column, sticky under the top bar: visible while it talks, never over text. */}
      <div className="sticky top-18 w-10 shrink-0 self-start pt-0.5 sm:w-12">
        <MonedoCharacter expression={expression} talking={!done} className="size-10 sm:size-12" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {showName ? (
          <p className="text-sm font-medium text-fg-muted">{TUTOR_NAME}</p>
        ) : (
          <span className="sr-only">Monedo:</span>
        )}
        {messages.slice(0, visible).map((message) =>
          message.kind === "bubble" ? (
            <motion.div
              key={message.id}
              {...(animate ? enter : {})}
              className="flex flex-col gap-1"
            >
              {message.label ? (
                <p className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase">
                  {message.label}
                </p>
              ) : null}
              <p className="w-fit max-w-[36rem] rounded-lg rounded-tl-xs border border-border bg-surface px-4 py-2.5 text-lg leading-7">
                {keepUnits(message.text)}
              </p>
            </motion.div>
          ) : (
            <motion.div key={message.id} {...(animate ? enter : {})} className="max-w-[36rem]">
              <TutorCardView card={message.card} />
            </motion.div>
          ),
        )}
        {!done ? <TypingDots /> : null}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div
      aria-hidden
      className="flex w-fit gap-1 rounded-lg rounded-tl-xs border border-border bg-surface px-4 py-4"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-fg-subtle"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/** What the learner said: right-aligned, in the brand's subtle tone. */
export function LearnerBubble({ text }: { text: string }) {
  return (
    <motion.div {...enter} className="flex justify-end pl-12">
      <span className="sr-only">Tú:</span>
      <p className="rounded-lg rounded-tr-xs bg-brand-subtle px-4 py-2.5 text-lg leading-7 text-brand-subtle-fg">
        {keepUnits(text)}
      </p>
    </motion.div>
  );
}

/** Answer options. Tapping one answers straight away, like replying in a chat. */
export function ChoiceList({
  options,
  label,
  onChoose,
  autoFocus,
}: {
  options: readonly { id: string; label: string }[];
  label: string;
  onChoose: (optionId: string) => void;
  autoFocus: boolean;
}) {
  return (
    <motion.div
      {...enter}
      role="group"
      aria-label={label}
      className="ml-13 flex max-w-[36rem] flex-col gap-2 sm:ml-15"
    >
      {options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          // Focus only follows the learner's own navigation, never on first load.
          autoFocus={autoFocus && index === 0}
          onClick={() => onChoose(option.id)}
          className={cn(
            "group flex min-h-11 w-full cursor-pointer items-start gap-3 rounded-md border border-border-strong bg-surface p-3.5 text-left text-lg leading-7",
            "transition-[border-color,background-color] duration-(--duration-fast) ease-(--ease-out)",
            "hover:border-brand hover:bg-brand-subtle/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          )}
        >
          <span
            aria-hidden
            className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-sm border border-border-strong font-mono text-xs font-medium text-fg-muted group-hover:border-brand group-hover:text-brand-text"
          >
            {String.fromCharCode(65 + index)}
          </span>
          <span className="min-w-0">{option.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
