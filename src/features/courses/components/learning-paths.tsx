import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AREAS, type Course } from "@/content/schema";
import { toOutline } from "../outline";
import { CourseProgressMeter } from "./course-progress-meter";

/** Published courses grouped by area. Areas without published courses are not shown. */
export function LearningPaths({
  courses,
  headingLevel = "h3",
}: {
  courses: readonly Course[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const areas = AREAS.map((area) => ({
    ...area,
    courses: courses.filter((c) => c.area === area.id),
  })).filter((area) => area.courses.length > 0);

  return (
    <div className="flex flex-col gap-10">
      {areas.map((area) => (
        <section key={area.id} aria-labelledby={`area-${area.id}`} className="flex flex-col gap-4">
          <Heading
            id={`area-${area.id}`}
            className="text-sm font-medium tracking-[0.06em] text-fg-muted uppercase"
          >
            {area.title}
          </Heading>
          <ul className="grid gap-4 md:grid-cols-2">
            {area.courses.map((course) => (
              <li key={course.slug}>
                <CourseCard course={course} headingLevel={headingLevel === "h2" ? "h3" : "h4"} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function CourseCard({ course, headingLevel }: { course: Course; headingLevel: "h3" | "h4" }) {
  const Heading = headingLevel;
  const minutes = course.lessons.reduce((sum, l) => sum + l.minutes, 0);
  return (
    <article className="relative flex h-full flex-col gap-5 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-fg-subtle">
          {course.level} · <span className="font-mono tabular">{course.lessons.length}</span>{" "}
          lecciones · <span className="font-mono tabular">{minutes}</span> min
        </p>
        <Heading className="text-xl font-semibold tracking-tight">
          <Link
            href={`/cursos/${course.slug}`}
            className="rounded-xs after:absolute after:inset-0 after:rounded-lg focus-visible:outline-2 focus-visible:outline-focus"
          >
            {course.title}
          </Link>
        </Heading>
        <p className="text-base leading-7 text-fg-muted">{course.tagline}</p>
      </div>
      <div className="mt-auto flex items-end gap-4">
        <div className="flex-1">
          <CourseProgressMeter course={toOutline(course)} />
        </div>
        <ArrowRight aria-hidden className="mb-1 size-4 text-fg-subtle" />
      </div>
    </article>
  );
}
