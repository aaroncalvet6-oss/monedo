import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentLessons, getCourse, getLesson, getLessonParams, isPublished } from "@/content";
import { LessonReader } from "@/features/lessons/components/lesson-reader";
import type { ReaderCourse } from "@/features/lessons/components/reader-types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLessonParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/cursos/[curso]/[leccion]">): Promise<Metadata> {
  const { curso, leccion } = await params;
  const course = getCourse(curso);
  const lesson = getLesson(curso, leccion);
  if (!course || !lesson) return {};
  return {
    title: `${lesson.title} · ${course.title}`,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: PageProps<"/cursos/[curso]/[leccion]">) {
  const { curso, leccion } = await params;
  const course = getCourse(curso);
  const lesson = getLesson(curso, leccion);
  if (!course || !lesson || !isPublished(course)) notFound();

  const readerCourse: ReaderCourse = {
    slug: course.slug,
    title: course.title,
    lessons: course.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      minutes: l.minutes,
    })),
  };
  const { next } = getAdjacentLessons(course.slug, lesson.slug);

  return (
    <LessonReader
      course={readerCourse}
      lesson={lesson}
      next={next ? { slug: next.slug, title: next.title } : null}
    />
  );
}
