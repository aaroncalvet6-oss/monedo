import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAssessment, getCourse, getCourseParams, isPublished } from "@/content";
import { AssessmentRunner } from "@/features/assessment/components/assessment-runner";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourseParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/cursos/[curso]/evaluacion">): Promise<Metadata> {
  const course = getCourse((await params).curso);
  return course ? { title: `Evaluación final · ${course.title}`, description: course.tagline } : {};
}

export default async function AssessmentPage({ params }: PageProps<"/cursos/[curso]/evaluacion">) {
  const course = getCourse((await params).curso);
  const assessment = course ? getAssessment(course.slug) : undefined;
  if (!course || !assessment || !isPublished(course)) notFound();
  return (
    <AssessmentRunner
      course={{
        slug: course.slug,
        title: course.title,
        lessonTitles: Object.fromEntries(course.lessons.map((l) => [l.slug, l.title])),
      }}
      assessment={assessment}
    />
  );
}
