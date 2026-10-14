import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getPublishedCourses } from "@/content";
import { ProfileSummary } from "@/features/progress/components/profile-summary";

export const metadata: Metadata = { title: "Perfil" };

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
