import type { ToolId } from "@/content/schema";

/** Tools that are built and published. Only these are shown anywhere on the site. */
export type Tool = {
  id: ToolId;
  title: string;
  description: string;
  /** The lesson that explains the idea behind the tool. It links back to the tool. */
  lesson: { course: string; lesson: string };
};

export const tools = [
  {
    id: "horas-de-trabajo",
    title: "¿Cuántas horas de trabajo cuesta?",
    description: "Traduce cualquier precio a las horas que tendrías que trabajar para pagarlo.",
    lesson: { course: "fundamentos-del-dinero", lesson: "el-dinero-es-tiempo" },
  },
  {
    id: "presupuesto",
    title: "Presupuesto para adolescentes",
    description: "Reparte lo que recibes en tres partes: lo que pagas tú, ahorro y gasto libre.",
    lesson: { course: "fundamentos-del-dinero", lesson: "tu-primer-presupuesto" },
  },
  {
    id: "meta-de-ahorro",
    title: "Meta de ahorro",
    description: "Calcula cuándo llegas a lo que quieres o cuánto apartar cada mes.",
    lesson: { course: "fundamentos-del-dinero", lesson: "pagate-primero" },
  },
  {
    id: "interes-compuesto",
    title: "Interés compuesto",
    description: "Mira cómo crece un ahorro cuando lo que gana también gana.",
    lesson: { course: "fundamentos-del-dinero", lesson: "inflacion" },
  },
] as const satisfies readonly Tool[];

export function getTool(id: ToolId): Tool {
  const tool = tools.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}

export const toolHref = (tool: Pick<Tool, "id">) => `/herramientas/${tool.id}`;
