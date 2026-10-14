import type { Metadata } from "next";
import { CompoundInterestTool } from "@/features/tools/components/compound-interest-tool";
import { ToolPage } from "@/features/tools/components/tool-page";
import { getTool } from "@/features/tools/tools";
import { pageMetadata } from "@/lib/seo/page-metadata";

const tool = getTool("interes-compuesto");

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.description,
  path: "/herramientas/interes-compuesto",
});

export default function Page() {
  return (
    <ToolPage
      tool={tool}
      intro="Mira cuánto podría crecer un ahorro con el tiempo cuando lo que gana también gana."
    >
      <CompoundInterestTool />
    </ToolPage>
  );
}
