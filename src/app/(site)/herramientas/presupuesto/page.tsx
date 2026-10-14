import type { Metadata } from "next";
import { BudgetTool } from "@/features/tools/components/budget-tool";
import { ToolPage } from "@/features/tools/components/tool-page";
import { getTool } from "@/features/tools/tools";
import { pageMetadata } from "@/lib/seo/page-metadata";

const tool = getTool("presupuesto");

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.description,
  path: "/herramientas/presupuesto",
});

export default function Page() {
  return (
    <ToolPage
      tool={tool}
      intro="Reparte lo que recibes cada mes en tres partes: lo que pagas tú, ahorro y gasto libre."
    >
      <BudgetTool />
    </ToolPage>
  );
}
