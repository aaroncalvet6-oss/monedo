/** Tools that are built and published. Only these are shown anywhere on the site. */
export type Tool = { id: string; title: string; description: string };

export const tools: readonly Tool[] = [
  {
    id: "horas-de-trabajo",
    title: "¿Cuántas horas de trabajo cuesta?",
    description: "Traduce cualquier precio a las horas que tendrías que trabajar para pagarlo.",
  },
];

export const toolHref = (tool: Tool) => `/herramientas#${tool.id}`;
