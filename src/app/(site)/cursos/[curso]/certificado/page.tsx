import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getAssessment, getCourse, getCourseParams, isPublished } from "@/content";
import { CertificateView } from "@/features/certificates/components/certificate-view";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourseParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/cursos/[curso]/certificado">): Promise<Metadata> {
  const course = getCourse((await params).curso);
  if (!course) return {};
  return pageMetadata({
    title: `Certificado de finalización · ${course.title}`,
    description: `Descarga tu certificado de finalización del curso «${course.title}» de Monedo.`,
    path: `/cursos/${course.slug}/certificado`,
    noindex: true,
  });
}

export default async function CertificatePage({
  params,
}: PageProps<"/cursos/[curso]/certificado">) {
  const course = getCourse((await params).curso);
  if (!course || !isPublished(course) || !getAssessment(course.slug)) notFound();
  return (
    <Container>
      <PageHeader
        eyebrow={
          <Link
            href={`/cursos/${course.slug}`}
            className="touch-hit hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {course.title}
          </Link>
        }
        title="Certificado de finalización"
        description="Para guardarlo o compartirlo. Indica que has completado el curso en Monedo."
      />
      <div className="border-t border-border pt-8">
        <CertificateView
          course={{ slug: course.slug, title: course.title, lessons: course.lessons.length }}
        />
      </div>
    </Container>
  );
}
