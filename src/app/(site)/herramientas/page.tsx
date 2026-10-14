import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ToolList } from "@/features/tools/components/tool-list";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Herramientas",
  description:
    "Calculadoras gratuitas para hacer tus propias cuentas: horas de trabajo, presupuesto para adolescentes, meta de ahorro e interés compuesto.",
  path: "/herramientas",
});

export default function ToolsPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Calculadoras"
        title="Herramientas"
        description="Haz tus propias cuentas. Cada herramienta enlaza a la lección donde se explica."
      />
      <ToolList />
    </Container>
  );
}
