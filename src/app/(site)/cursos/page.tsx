import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getPublishedCourses, getUpcomingCourses } from "@/content";
import { LearningPaths } from "@/features/courses/components/learning-paths";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Cursos",
  description:
    "Cursos gratuitos de educación financiera por áreas, con lecciones de 5 a 8 minutos, ejemplos reales en euros y datos verificados en fuentes oficiales.",
  path: "/cursos",
});

export default function CoursesPage() {
  const upcoming = getUpcomingCourses();
  return (
    <Container>
      <PageHeader
        eyebrow="Catálogo"
        title="Cursos"
        description="Rutas cortas con lecciones de 5 a 8 minutos, ejemplos reales en euros y contenido verificado."
      />
      <LearningPaths courses={getPublishedCourses()} headingLevel="h2" />
      {upcoming.length > 0 ? (
        <section
          aria-labelledby="proximos"
          className="mt-16 flex flex-col gap-3 border-t border-border pt-6"
        >
          <h2 id="proximos" className="text-sm font-medium text-fg-muted">
            Próximos cursos
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-base text-fg-subtle">
            {upcoming.map((course) => (
              <li key={course.slug}>{course.title}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
