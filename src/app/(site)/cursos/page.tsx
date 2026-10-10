import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getCourses } from "@/content";
import { CourseList } from "@/features/courses/components/course-list";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Cursos cortos con lecciones de 5 a 8 minutos y ejemplos reales en euros.",
};

export default function CoursesPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Catálogo"
        title="Cursos"
        description="Rutas cortas con lecciones de 5 a 8 minutos y ejemplos reales en euros."
      />
      <CourseList courses={getCourses()} />
    </Container>
  );
}
