export const MONEDO_EXPRESSIONS = [
  "normal",
  "explaining",
  "thinking",
  "celebrating",
  "oops",
] as const;

export type MonedoExpression = (typeof MONEDO_EXPRESSIONS)[number];

/** Spanish names, for accessible labels and the character page. */
export const MONEDO_EXPRESSION_LABELS: Record<MonedoExpression, string> = {
  normal: "normal",
  explaining: "explicando",
  thinking: "pensando",
  celebrating: "celebrando",
  oops: "uy",
};
