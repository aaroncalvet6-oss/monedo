import { BookOpen } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getCourse } from "@/content";
import type { Tool } from "../tools";

/** Shared layout of a tool page: header, the tool, and the lesson that explains it. */
export function ToolPage({
  tool,
  intro,
  children,
}: {
  tool: Tool;
  intro: string;
  children: ReactNode;
}) {
  const course = getCourse(tool.lesson.course);
  const lesson = course?.lessons.find((l) => l.slug === tool.lesson.lesson);
  if (!course || !lesson) throw new Error(`Tool ${tool.id} points to a missing lesson`);
  return (
    <Container>
      <PageHeader
        eyebrow={
          <Link
            href="/herramientas"
            className="touch-hit hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Herramientas
          </Link>
        }
        title={tool.title}
        description={intro}
      />
      <div className="flex flex-col gap-12 border-t border-border pt-8">
        {children}
        <Link
          href={`/cursos/${course.slug}/${lesson.slug}`}
          className="flex measure items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors duration-(--duration-fast) hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-subtle text-brand-subtle-fg">
            <BookOpen aria-hidden className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-sm text-fg-muted">Se explica en la lección</span>
            <span className="text-lg font-medium">{lesson.title}</span>
            <span className="text-sm text-fg-muted">{course.title}</span>
          </span>
        </Link>
      </div>
    </Container>
  );
}
