import type { LessonInput } from "@/content/schema";

/**
 * Lesson 2.2. The 6 % contribution is an example figure and says so (real rates change
 * every year, #10 unverified). The 2 % is the minimum withholding for contracts under a
 * year (fuente #11). Extra payments: fuente #9.
 * Arithmetic: 1.200 × 6 % = 72 · 1.200 × 2 % = 24 · 1.200 − 96 = 1.104 ·
 * 14.000 / 14 = 1.000 · 14.000 / 12 = 1.166,67 · 15.400 / 14 = 1.100 · 1.250 × 12 = 15.000 ·
 * Q3: 1.200 − 72 = 1.128 (B), 1.200 − 24 = 1.176 (C).
 */
export const brutoYNeto = {
  slug: "bruto-y-neto",
  title: "Sueldo bruto y sueldo neto",
  summary: "Por qué no te llega todo lo que pone en el contrato.",
  minutes: 6,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "por qué no te llega todo lo que pone en el contrato",
        "cómo pasar del sueldo bruto al neto",
        "cómo comparar dos ofertas de trabajo",
      ],
    },
    {
      type: "text",
      id: "bruto-neto",
      title: "Bruto y neto",
      paragraphs: [
        "El sueldo bruto es lo que pone en el contrato, antes de descuentos. El neto es lo que te llega a la cuenta.",
        "Entre uno y otro se descuentan dos cosas: tus cotizaciones a la Seguridad Social y la retención de IRPF, que es un adelanto de tus impuestos.",
      ],
    },
    {
      type: "text",
      id: "la-cuenta",
      title: "La cuenta",
      paragraphs: [
        "Neto = bruto − cotizaciones − retención de IRPF.",
        "Los porcentajes de cotización cambian cada año, así que en esta lección usamos un 6 % de ejemplo.",
        "La retención de IRPF depende de cada persona, pero en los contratos de menos de un año hay un mínimo del 2 %.",
      ],
    },
    {
      type: "example",
      id: "ejemplo-sara",
      title: "Lo que le llega a Sara",
      character: "Sara, 17 años",
      paragraphs: [
        "El contrato de verano de Sara dice 1.200 € brutos al mes.",
        "Con un 6 % de cotizaciones de ejemplo se le descuentan 72 €. Con la retención mínima del 2 %, otros 24 €.",
        "En total, 96 € de descuentos. A su cuenta le llegan 1.104 €.",
      ],
      figures: [
        { label: "Sueldo bruto", value: 1200, unit: "€" },
        { label: "Cotizaciones (6 %, ejemplo)", value: 72, unit: "€" },
        { label: "Retención de IRPF (2 %)", value: 24, unit: "€" },
        { label: "Sueldo neto", value: 1104, unit: "€", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-neto",
      value: 1104,
      unit: "€",
      context:
        "es lo que le llega a Sara de un sueldo de 1.200 € brutos, con una cotización de ejemplo y la retención mínima del 2 %.",
    },
    {
      type: "text",
      id: "pagas",
      title: "12 o 14 pagas",
      paragraphs: [
        "Hay dos pagas extra al año: una en Navidad y otra cuando fije el convenio.",
        "Por eso un sueldo anual se cobra en 14 pagas. Solo se reparte en 12 nóminas si el convenio lo acuerda.",
        "El total del año es el mismo: 14.000 € brutos son 1.000 € al mes en 14 pagas o 1.166,67 € al mes en 12.",
      ],
    },
    {
      type: "text",
      id: "comparar",
      title: "Compara ofertas en la misma medida",
      paragraphs: [
        "Para comparar dos ofertas, ponlas en la misma medida: todo en bruto al año o todo en neto al mes.",
        "15.400 € brutos al año en 14 pagas son 1.100 € al mes. Y 1.250 € al mes en 12 pagas son 15.000 € al año.",
        "La segunda parece mejor cada mes, pero la primera paga más al año.",
      ],
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Neto = bruto − cotizaciones a la Seguridad Social − retención de IRPF.",
        "Un sueldo anual se cobra en 14 pagas (12 nóminas y 2 pagas extra) o, si el convenio lo acuerda, en 12: el total del año es el mismo.",
        "Para comparar ofertas, compáralas igual: todo en bruto al año o todo en neto al mes.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-llega",
          prompt: "Tu contrato dice 1.200 € brutos al mes. ¿Cuánto te llega a la cuenta?",
          options: [
            { id: "a", text: "1.200 €" },
            {
              id: "b",
              text: "Menos de 1.200 €, porque se descuentan las cotizaciones y la retención de IRPF",
            },
            { id: "c", text: "Más de 1.200 €, porque se suman las pagas extra cada mes" },
            { id: "d", text: "Depende del banco donde cobres" },
          ],
          correctOptionId: "b",
          explanation:
            "Del bruto se descuentan las cotizaciones y la retención de IRPF. Lo que llega es el neto.",
        },
        {
          id: "q-ofertas",
          prompt:
            "Dos ofertas: A, 15.400 € brutos al año en 14 pagas; B, 1.250 € brutos al mes en 12 pagas. ¿Cuál paga más al año?",
          options: [
            { id: "a", text: "La A: 15.400 € frente a 15.000 €" },
            { id: "b", text: "La B, porque cada mes cobras más (1.250 € frente a 1.100 €)" },
            { id: "c", text: "Pagan lo mismo" },
            { id: "d", text: "No se puede saber sin ver las nóminas" },
          ],
          correctOptionId: "a",
          explanation:
            "1.250 × 12 = 15.000 €, menos que 15.400 €. Compáralas siempre en la misma medida.",
        },
        {
          id: "q-calculo",
          prompt:
            "Con los porcentajes de la lección (6 % de cotizaciones de ejemplo y 2 % de IRPF), ¿cuánto te llega de 1.200 € brutos?",
          options: [
            { id: "a", text: "1.104 €" },
            { id: "b", text: "1.128 €" },
            { id: "c", text: "1.176 €" },
            { id: "d", text: "1.200 €" },
          ],
          correctOptionId: "a",
          explanation:
            "1.200 − 72 − 24 = 1.104 €. La B solo resta la cotización y la C solo la retención.",
        },
        {
          id: "q-paga-extra",
          prompt: "¿Qué es una paga extra?",
          options: [
            { id: "a", text: "Un premio que la empresa da si quiere" },
            {
              id: "b",
              text: "Parte de tu sueldo anual: hay dos al año, una en Navidad y otra cuando fije el convenio",
            },
            { id: "c", text: "Lo que te pagan por las horas extra" },
            { id: "d", text: "El dinero que te devuelve Hacienda" },
          ],
          correctOptionId: "b",
          explanation: "No es un premio: forma parte de tu sueldo del año.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "De bruto a neto",
      description: "Haz las cuentas con una oferta real.",
      steps: [
        "Busca una oferta de trabajo que diga el sueldo en bruto al año.",
        "Calcula cuánto sería al mes en 14 pagas y en 12.",
        "Aplica los descuentos de la lección (6 % y 2 %) para hacerte una idea aproximada del neto al mes.",
      ],
    },
  ],
} satisfies LessonInput;
