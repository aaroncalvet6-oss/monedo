import type { Metadata } from "next";
import { WorkHoursWidget } from "@/features/lessons/components/widgets/work-hours-widget";
import { ToolPage } from "@/features/tools/components/tool-page";
import { getTool } from "@/features/tools/tools";
import { pageMetadata } from "@/lib/seo/page-metadata";

const tool = getTool("horas-de-trabajo");

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.description,
  path: "/herramientas/horas-de-trabajo",
});

export default function Page() {
  return (
    <ToolPage
      tool={tool}
      intro="Escribe un precio y lo que cobras por hora. Verás cuánto tiempo de tu vida vale esa compra."
    >
      <WorkHoursWidget defaultPrice={90} defaultHourlyWage={8} />
    </ToolPage>
  );
}
