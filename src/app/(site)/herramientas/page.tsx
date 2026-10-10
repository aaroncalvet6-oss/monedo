import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { WorkHoursWidget } from "@/features/lessons/components/widgets/work-hours-widget";

export const metadata: Metadata = {
  title: "Herramientas",
  description: "Calcula cuántas horas de trabajo te cuesta lo que quieres comprar.",
};

export default function ToolsPage() {
  return (
    <Container>
      <PageHeader eyebrow="Calculadoras" title="Herramientas" />
      <section aria-labelledby="horas-de-trabajo" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-t border-border pt-8">
          <h2 id="horas-de-trabajo" className="text-xl font-semibold tracking-tight">
            ¿Cuántas horas de trabajo cuesta?
          </h2>
          <p className="measure text-base leading-7 text-fg-muted">
            Escribe un precio y lo que cobras por hora. Verás cuánto tiempo de tu vida vale esa
            compra.
          </p>
        </div>
        <WorkHoursWidget defaultPrice={90} defaultHourlyWage={8} />
      </section>
    </Container>
  );
}
