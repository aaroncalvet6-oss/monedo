"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/features/progress/progress-provider";
import { lessonKey } from "@/lib/progress/lesson-progress";
import { cn } from "@/lib/utils";
import type { Step } from "../lib/steps";
import { stepNavTitle } from "../lib/steps";
import type { ReaderCourse } from "./reader-types";

/**
 * Course syllabus for the reader. The current lesson lists its steps; steps up to the
 * furthest one reached can be revisited.
 */
export function Syllabus({
  course,
  currentLesson,
  steps,
  index,
  reachable,
  onJump,
}: {
  course: ReaderCourse;
  currentLesson: string;
  steps: readonly Step[];
  index: number;
  reachable: number;
  onJump: (index: number) => void;
}) {
  const lessons = useProgress((s) => s.snapshot.lessons);
  return (
    <nav aria-label="Temario del curso" className="flex flex-col gap-4">
      <p className="px-2 text-xs font-medium tracking-[0.08em] text-fg-subtle uppercase">
        {course.title}
      </p>
      <ol className="flex flex-col gap-0.5">
        {course.lessons.map((lesson, position) => {
          const current = lesson.slug === currentLesson;
          const done = Boolean(lessons[lessonKey(course.slug, lesson.slug)]?.completedAt);
          const marker = (
            <span
              aria-hidden
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border font-mono text-xs",
                done
                  ? "border-brand bg-brand text-brand-fg"
                  : current
                    ? "border-brand text-brand-text"
                    : "border-border-strong text-fg-subtle",
              )}
            >
              {done ? <Check className="size-3.5" /> : position + 1}
            </span>
          );
          const label = (
            <>
              {marker}
              <span className="min-w-0 flex-1">
                <span className="block truncate">{lesson.title}</span>
              </span>
              {done ? <span className="sr-only">(completada)</span> : null}
            </>
          );
          const rowClass =
            "flex min-h-11 items-center gap-3 rounded-sm px-2 py-1.5 text-base md:min-h-9 md:text-sm";
          return (
            <li key={lesson.slug}>
              {current ? (
                <>
                  <span
                    aria-current="page"
                    className={cn(rowClass, "bg-surface-muted font-medium")}
                  >
                    {label}
                  </span>
                  <ol className="my-1 ml-5 flex flex-col border-l border-border pl-3">
                    {steps.map((step, i) => {
                      const canJump = i <= reachable && i !== index;
                      return (
                        <li key={step.id}>
                          <button
                            type="button"
                            disabled={!canJump}
                            aria-current={i === index ? "step" : undefined}
                            onClick={() => onJump(i)}
                            className={cn(
                              "flex min-h-11 w-full cursor-pointer items-center rounded-sm px-2 text-left text-base md:min-h-8 md:text-sm",
                              "focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-default",
                              i === index
                                ? "font-medium text-fg"
                                : canJump
                                  ? "text-fg-muted hover:bg-surface-muted hover:text-fg"
                                  : "text-fg-subtle",
                            )}
                          >
                            <span className="truncate">{stepNavTitle(step)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </>
              ) : (
                <Link
                  href={`/cursos/${course.slug}/${lesson.slug}`}
                  className={cn(
                    rowClass,
                    "text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-focus",
                  )}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
