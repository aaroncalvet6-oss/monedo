import type { Course } from "@/content/schema";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

/** schema.org Course for a published course page. */
export function courseJsonLd(course: Course): Record<string, unknown> {
  const minutes = course.lessons.reduce((sum, l) => sum + l.minutes, 0);
  const url = absoluteUrl(`/cursos/${course.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url,
    inLanguage: "es-ES",
    educationalLevel: course.level,
    isAccessibleForFree: true,
    teaches: course.outcomes,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "Jóvenes de 14 a 18 años",
    },
    provider: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    offers: { "@type": "Offer", category: "Free", price: 0, priceCurrency: "EUR" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: `PT${minutes}M`,
    },
    hasPart: course.lessons.map((lesson) => ({
      "@type": "LearningResource",
      name: lesson.title,
      description: lesson.summary,
      url: absoluteUrl(`/cursos/${course.slug}/${lesson.slug}`),
      timeRequired: `PT${lesson.minutes}M`,
    })),
  };
}
