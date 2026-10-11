import type { Course } from "@/content/schema";
import type { CourseOutline } from "@/lib/progress/continue";

/** Serializable outline for client components (progress, continue). */
export function toOutline(course: Course): CourseOutline {
  return {
    slug: course.slug,
    title: course.title,
    lessons: course.lessons.map(({ slug, title, minutes }) => ({ slug, title, minutes })),
  };
}
