import { ahorroEInversion } from "./courses/ahorro-e-inversion";
import { bancosYPagos } from "./courses/bancos-y-pagos";
import { fundamentosDelDinero } from "./courses/fundamentos-del-dinero";
import { elDineroEsTiempo } from "./courses/fundamentos-del-dinero/el-dinero-es-tiempo";
import { inflacion } from "./courses/fundamentos-del-dinero/inflacion";
import { necesidadOCapricho } from "./courses/fundamentos-del-dinero/necesidad-o-capricho";
import { pagatePrimero } from "./courses/fundamentos-del-dinero/pagate-primero";
import { trampasDeConsumo } from "./courses/fundamentos-del-dinero/trampas-de-consumo";
import { tuPrimerPresupuesto } from "./courses/fundamentos-del-dinero/tu-primer-presupuesto";
import { queNoTeEstafen } from "./courses/que-no-te-estafen";
import { tuPrimerSueldo } from "./courses/tu-primer-sueldo";
import { courseSchema, lessonSchema, type Course, type Lesson, type LessonEntry } from "./schema";

/**
 * Content registry. Everything is validated with Zod when this module loads, which
 * happens during `next build` (generateStaticParams), so invalid content fails the build.
 * To add a course: create its folder, export it here. To add a lesson: add its file and
 * register it under its course in `lessonContent`.
 */
const courses: readonly Course[] = [
  fundamentosDelDinero,
  tuPrimerSueldo,
  bancosYPagos,
  ahorroEInversion,
  queNoTeEstafen,
]
  .map((course) => courseSchema.parse(course))
  .sort((a, b) => a.order - b.order);

const lessonContent: Record<string, readonly Lesson[]> = {
  "fundamentos-del-dinero": [
    elDineroEsTiempo,
    inflacion,
    necesidadOCapricho,
    pagatePrimero,
    tuPrimerPresupuesto,
    trampasDeConsumo,
  ].map((lesson) => lessonSchema.parse(lesson)),
};

function assertRegistryConsistency(): void {
  const courseSlugs = new Set(courses.map((c) => c.slug));
  if (courseSlugs.size !== courses.length) throw new Error("Duplicate course slugs");
  for (const [courseSlug, lessons] of Object.entries(lessonContent)) {
    const course = courses.find((c) => c.slug === courseSlug);
    if (!course) throw new Error(`Lesson content for unknown course "${courseSlug}"`);
    for (const lesson of lessons) {
      const entry = course.lessons.find((l) => l.slug === lesson.slug);
      if (!entry) throw new Error(`"${courseSlug}/${lesson.slug}" is not in the course syllabus`);
      for (const field of ["title", "summary", "minutes"] as const) {
        if (entry[field] !== lesson[field]) {
          throw new Error(`"${courseSlug}/${lesson.slug}": ${field} differs from the syllabus`);
        }
      }
    }
  }
}
assertRegistryConsistency();

export function getCourses(): readonly Course[] {
  return courses;
}

/**
 * A course is published only when every lesson in its syllabus is written (and, by
 * process, its legal data verified in docs/fuentes.md). Nothing half-done is shown.
 */
export function isPublished(course: Course): boolean {
  return course.lessons.every((lesson) => hasContent(course.slug, lesson.slug));
}

export function getPublishedCourses(): readonly Course[] {
  return courses.filter(isPublished);
}

/** Courses in preparation: listed only by title in «Próximos cursos». */
export function getUpcomingCourses(): readonly Course[] {
  return courses.filter((course) => !isPublished(course));
}

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string): Lesson | undefined {
  return lessonContent[courseSlug]?.find((lesson) => lesson.slug === lessonSlug);
}

export function hasContent(courseSlug: string, lessonSlug: string): boolean {
  return getLesson(courseSlug, lessonSlug) !== undefined;
}

/** Lessons of published courses, for static generation. */
export function getLessonParams(): { curso: string; leccion: string }[] {
  return getPublishedCourses().flatMap((course) =>
    course.lessons.map((lesson) => ({ curso: course.slug, leccion: lesson.slug })),
  );
}

/** Syllabus neighbours, regardless of whether they have content yet. */
export function getAdjacentLessons(
  courseSlug: string,
  lessonSlug: string,
): { previous: LessonEntry | undefined; next: LessonEntry | undefined } {
  const lessons = getCourse(courseSlug)?.lessons ?? [];
  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 ? lessons[index + 1] : undefined,
  };
}

export type { Block, Course, Lesson, LessonEntry, QuizQuestion } from "./schema";
