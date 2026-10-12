import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ToolList } from "@/features/tools/components/tool-list";

export const metadata: Metadata = {
  title: "Herramientas",
  description:
    "Calculadoras para hacer tus propias cuentas: horas de trabajo, presupuesto, meta de ahorro e interés compuesto.",
};

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
