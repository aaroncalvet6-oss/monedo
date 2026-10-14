import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getPublishedCourses } from "@/content";
import { ProfileSummary } from "@/features/progress/components/profile-summary";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Perfil",
  description:
    "Tu progreso en Monedo, tus certificados y tus datos, guardados solo en este navegador.",
  path: "/perfil",
  noindex: true,
});

export default function ProfilePage() {
  return (
    <Container>
      <PageHeader eyebrow="Tu perfil" title="Perfil" />
      <ProfileSummary
        courses={getPublishedCourses().map((c) => ({ slug: c.slug, title: c.title }))}
      />
    </Container>
  );
}
