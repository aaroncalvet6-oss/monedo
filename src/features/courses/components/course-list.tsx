import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/content/schema";

/** Catalogue rows: number, title, tagline and length. Unavailable courses are not links. */
export function CourseList({ courses }: { courses: readonly Course[] }) {
  return (
    <ol className="flex flex-col border-t border-border">
      {courses.map((course) => {
        const minutes = course.lessons.reduce((sum, l) => sum + l.minutes, 0);
        const available = course.status === "available";
        return (
          <li
            key={course.slug}
            className="relative flex items-start gap-4 border-b border-border py-5"
          >
            <span className="font-mono tabular text-sm text-fg-subtle">
              {String(course.order).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {available ? (
                <Link
                  href={`/cursos/${course.slug}`}
                  className="w-fit rounded-xs text-lg font-semibold tracking-tight after:absolute after:inset-0 hover:text-brand-text focus-visible:outline-2 focus-visible:outline-focus"
                >
                  {course.title}
                </Link>
              ) : (
                <span className="text-lg font-semibold tracking-tight text-fg-muted">
                  {course.title}
                </span>
              )}
              <p className="text-base leading-7 text-fg-muted">{course.tagline}</p>
              <p className="text-sm text-fg-subtle">
                {course.level} · <span className="font-mono tabular">{course.lessons.length}</span>{" "}
                lecciones · <span className="font-mono tabular">{minutes}</span> min
              </p>
            </div>
            {available ? (
              <ArrowRight aria-hidden className="mt-1.5 size-4 shrink-0 text-fg-subtle" />
            ) : (
              <Badge variant="outline" className="shrink-0">
                <Lock aria-hidden /> Próximamente
              </Badge>
            )}
          </li>
        );
      })}
    </ol>
  );
}
