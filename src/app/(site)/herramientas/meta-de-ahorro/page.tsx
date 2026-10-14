import type { Metadata } from "next";
import { SavingsGoalTool } from "@/features/tools/components/savings-goal-tool";
import { ToolPage } from "@/features/tools/components/tool-page";
import { getTool } from "@/features/tools/tools";
import { pageMetadata } from "@/lib/seo/page-metadata";

const tool = getTool("meta-de-ahorro");

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.description,
  path: "/herramientas/meta-de-ahorro",
});

export default function Page() {
  return (
    <ToolPage
      tool={tool}
      intro="Ponle nombre y cifra a lo que quieres. Calcula cuándo llegas o cuánto apartar cada mes."
    >
      <SavingsGoalTool />
    </ToolPage>
  );
}
