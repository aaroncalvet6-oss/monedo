import type { LessonInput } from "@/content/schema";

/**
 * Lesson 2.3. Uses an invented, simplified payslip with the terms of the official model
 * (devengos, deducciones, líquido total a percibir: fuente #12, Orden ESS/2098/2014). Employer
 * contributions are higher than the worker's (fuente #13).
 * Arithmetic: 1.150 + 50 = 1.200 · 72 + 24 = 96 · 1.200 − 96 = 1.104 · Q2: 1.050 − 98 = 952.
 */
export const leerUnaNomina = {
  slug: "leer-una-nomina",
  title: "Cómo leer una nómina",
  summary: "Una nómina explicada línea por línea.",
  minutes: 8,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "qué significa cada línea de una nómina",
        "comprobar que lo que cobras cuadra",
        "por qué tu trabajo le cuesta a la empresa más que tu sueldo",
      ],
    },
    {
      type: "text",
      id: "lo-que-ves",
      title: "Lo que vas a ver en una nómina",
      paragraphs: [
        "Una nómina recoge lo que has ganado en el mes, lo que te descuentan y lo que cobras.",
        "Lo que has ganado se llama devengos: el salario base, que es la parte fija, y los pluses o complementos, como el de transporte.",
        "Lo que te descuentan se llama deducciones: tus cotizaciones a la Seguridad Social y la retención de IRPF.",
      ],
      sources: [
        {
          label: "BOE: modelo oficial de nómina (Orden ESS/2098/2014)",
          url: "https://www.boe.es/buscar/doc.php?id=BOE-A-2014-11637",
        },
      ],
    },
    {
      type: "text",
      id: "la-cuenta",
      title: "La cuenta que siempre tienes que hacer",
      paragraphs: [
        "Lo que te ingresan se llama líquido total a percibir.",
        "Devengos − deducciones = líquido total a percibir. Y esa cifra tiene que ser la que llega a tu cuenta.",
        "Si no cuadra, pregunta en la empresa: puede haber un error.",
      ],
    },
    {
      type: "example",
      id: "ejemplo-sara",
      title: "La nómina de julio de Sara",
      character: "Sara, 17 años",
      paragraphs: [
        "Esta nómina es inventada y simplificada, con las cifras de Sara.",
        "Devengos: 1.150 € de salario base y 50 € de plus de transporte. En total, 1.200 €.",
        "Deducciones: 72 € de cotizaciones (6 %, cifra de ejemplo) y 24 € de retención de IRPF (2 %). En total, 96 €.",
      ],
      figures: [
        { label: "Salario base", value: 1150, unit: "€" },
        { label: "Plus de transporte", value: 50, unit: "€" },
        { label: "Total devengado", value: 1200, unit: "€" },
        { label: "Total a deducir", value: 96, unit: "€" },
        { label: "Líquido total a percibir", value: 1104, unit: "€", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-liquido",
      value: 1104,
      unit: "€",
      context:
        "es el líquido total a percibir de Sara: 1.200 € devengados menos 96 € de deducciones. Es lo que tiene que llegar a su cuenta.",
    },
    {
      type: "text",
      id: "empresa",
      title: "Lo que paga la empresa por ti",
      paragraphs: [
        "Además de tu sueldo, la empresa paga a la Seguridad Social por ti. No te lo descuentan: lo paga ella.",
        "Y paga más de lo que te descuentan a ti. Por eso tu trabajo le cuesta a la empresa más que tu sueldo bruto.",
      ],
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "En una nómina vas a ver lo que has ganado (devengos), lo que te descuentan (deducciones) y lo que cobras (líquido total a percibir).",
        "La cuenta que siempre tienes que comprobar: devengos − deducciones = líquido total a percibir = lo que llega a tu cuenta.",
        "La empresa paga a la Seguridad Social por ti más de lo que te descuentan a ti: tu trabajo le cuesta más que tu sueldo bruto.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-liquido",
          prompt: "¿Qué es el «líquido total a percibir»?",
          options: [
            { id: "a", text: "El sueldo bruto del contrato" },
            { id: "b", text: "Lo que te ingresan: los devengos menos las deducciones" },
            { id: "c", text: "Lo que pagas a Hacienda" },
            { id: "d", text: "Lo que paga la empresa a la Seguridad Social" },
          ],
          correctOptionId: "b",
          explanation: "Es lo que te ingresan: lo que has ganado menos lo que te descuentan.",
        },
        {
          id: "q-cuenta",
          prompt:
            "En tu nómina, el total devengado es 1.050 € y el total a deducir, 98 €. ¿Cuánto te llega?",
          options: [
            { id: "a", text: "1.148 €" },
            { id: "b", text: "952 €" },
            { id: "c", text: "1.050 €" },
            { id: "d", text: "98 €" },
          ],
          correctOptionId: "b",
          explanation: "1.050 − 98 = 952 €. La A suma las deducciones en lugar de restarlas.",
        },
        {
          id: "q-retencion",
          prompt: "¿En qué parte de la nómina aparece el dinero que se adelanta a Hacienda?",
          options: [
            { id: "a", text: "En los devengos, como un plus" },
            { id: "b", text: "En las deducciones, como retención de IRPF" },
            { id: "c", text: "En el salario base" },
            { id: "d", text: "En lo que paga la empresa a la Seguridad Social" },
          ],
          correctOptionId: "b",
          explanation: "La retención de IRPF es una deducción: se descuenta de lo que has ganado.",
        },
        {
          id: "q-empresa",
          prompt: "¿Quién paga más a la Seguridad Social por tu trabajo?",
          options: [
            { id: "a", text: "Tú, porque te lo descuentan de la nómina" },
            {
              id: "b",
              text: "La empresa: paga por ti más de lo que te descuentan a ti, sin sacarlo de tu sueldo",
            },
            { id: "c", text: "Los dos pagan exactamente lo mismo" },
            { id: "d", text: "Nadie: solo se paga cuando te jubilas" },
          ],
          correctOptionId: "b",
          explanation: "Tu trabajo le cuesta a la empresa más que tu sueldo bruto.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Comprueba una nómina",
      description: "Haz la cuenta que importa con una nómina de verdad.",
      steps: [
        "Usa la nómina de Sara o una real que alguien de tu familia quiera enseñarte, tapando los datos personales.",
        "Localiza los devengos, las deducciones y el líquido total a percibir.",
        "Comprueba que devengos − deducciones = líquido total a percibir.",
      ],
    },
  ],
} satisfies LessonInput;
