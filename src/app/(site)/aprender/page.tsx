import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getCourses, hasContent } from "@/content";
import { CourseProgressActions } from "@/features/courses/components/course-progress-actions";

export const metadata: Metadata = { title: "Aprender" };

export default function LearnPage() {
  // Only courses the learner can start today: available and with at least one written lesson.
  const courses = getCourses().filter(
    (course) =>
      course.status === "available" && course.lessons.some((l) => hasContent(course.slug, l.slug)),
  );
  return (
    <Container>
      <PageHeader
        eyebrow="Tu panel"
        title="Continúa donde lo dejaste"
        description="Tu progreso se guarda en este navegador. Retoma cada curso en la lección que te toca."
      />
      <ul className="flex flex-col gap-10 border-t border-border pt-8">
        {courses.map((course) => (
          <li key={course.slug} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-fg-subtle">Curso {course.order}</p>
              <h2 className="text-xl font-semibold tracking-tight">
                <Link
                  href={`/cursos/${course.slug}`}
                  className="touch-hit rounded-xs hover:text-brand-text focus-visible:outline-2 focus-visible:outline-focus"
                >
                  {course.title}
                </Link>
              </h2>
            </div>
            <CourseProgressActions
              courseSlug={course.slug}
              lessons={course.lessons.map((l) => ({
                ...l,
                available: hasContent(course.slug, l.slug),
              }))}
            />
          </li>
        ))}
      </ul>
    </Container>
  );
}
