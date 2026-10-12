import type { LessonInput } from "@/content/schema";

/**
 * Lesson 1.5. Pocket-money budget in three parts; 50/30/20 is presented as the rule for
 * a first salary. Arithmetic: Hugo 60 − 20 − 12 = 28 € · 32 / 4 = 8 € · 3 × 8 = 24 € ·
 * 28 − 24 = 4 € · Q1: 50 × 20 % = 10; 50 − 15 − 10 = 25 € (B forgets savings: 35 €;
 * C takes 20 % of what is left: 35 − 7 = 28 €).
 */
export const tuPrimerPresupuesto = {
  slug: "tu-primer-presupuesto",
  title: "Tu primer presupuesto",
  summary: "Reparte tu paga: lo que pagas tú, ahorro y gasto libre.",
  minutes: 8,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "hacer un presupuesto sencillo con tu paga en tres partes: lo que pagas tú, ahorro y gasto libre",
        "seguir tus gastos para ver si lo cumples",
        "qué regla usarás cuando cobres tu primer sueldo",
      ],
    },
    {
      type: "text",
      id: "que-es",
      title: "Un presupuesto es un plan",
      paragraphs: [
        "Un presupuesto es un plan de cuánto vas a gastar y en qué, hecho antes de gastar.",
        "No es para prohibirte cosas. Es decidir tú a dónde va tu dinero antes de que desaparezca.",
        "Empieza por tus ingresos: todo el dinero que te entra al mes, como la paga, los regalos o algún trabajo.",
      ],
    },
    {
      type: "text",
      id: "tres-partes",
      title: "Tu paga en tres partes",
      paragraphs: [
        "Lo que pagas tú: los gastos que cubres tú de verdad cada mes, no tu familia. Por ejemplo, la recarga del móvil, el transporte o el almuerzo.",
        "Ahorro: el 20 % de lo que recibes, apartado el primer día.",
        "Gasto libre: lo que queda, para lo que quieras. Cine, juegos, salir.",
      ],
      tool: "presupuesto",
    },
    {
      type: "example",
      id: "ejemplo-hugo",
      title: "El presupuesto de Hugo",
      character: "Hugo, 15 años",
      paragraphs: [
        "Hugo recibe 60 € de paga al mes. Su familia le paga la comida y la ropa.",
        "Él paga la recarga del móvil y algunos almuerzos: 20 €. Aparta el 20 % de la paga, 12 €, y le quedan 28 € de gasto libre.",
        "En marzo paga 32 € de pizzas para los cuatro que van a un cumpleaños, él incluido. Cada amigo le tiene que enviar 8 € por Bizum.",
      ],
      figures: [
        { label: "Paga", value: 60, unit: "€" },
        { label: "Lo que paga él", value: 20, unit: "€" },
        { label: "Ahorro (20 %)", value: 12, unit: "€" },
        { label: "Gasto libre", value: 28, unit: "€", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-hugo",
      value: 4,
      unit: "€",
      context:
        "es lo que le quedaría a Hugo de gasto libre para todo el mes si no reclama los 24 € de las pizzas. Lo apunta y se lo recuerda a sus amigos esa misma noche.",
    },
    {
      type: "text",
      id: "apuntar",
      title: "Apuntar es lo que hace que funcione",
      paragraphs: [
        "Un presupuesto sin apuntar lo que gastas es solo un deseo.",
        "Apunta cada gasto, aunque sea de 1 €, en una nota del móvil. A final de mes, compáralo con lo que planeaste.",
        "Si te pasas, no pasa nada: mira en qué te pasaste y ajusta el mes siguiente.",
      ],
    },
    {
      type: "text",
      id: "primer-sueldo",
      title: "Cuando cobres tu primer sueldo",
      paragraphs: [
        "Cuando vivas de tu sueldo y pagues casa y comida, se suele usar otra regla: la 50/30/20.",
        "Es un 50 % para necesidades, un 30 % para gustos y un 20 % para ahorro.",
        "Con la paga no encaja, porque tu familia cubre casi todas tus necesidades. Por eso, de momento, usa las tres partes. El sueldo lo verás en el curso «Tu primer sueldo».",
      ],
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Un presupuesto no es para prohibirte cosas: es decidir tú a dónde va tu dinero antes de que desaparezca.",
        "Con la paga, reparte en tres: lo que pagas tú de verdad, ahorro (el 20 %) y gasto libre. La regla 50/30/20 es para tu primer sueldo, cuando pagues casa y comida.",
        "Apuntar lo que gastas es lo que hace que un presupuesto funcione. Sin apuntar, solo es un deseo.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-gasto-libre",
          prompt:
            "Recibes 50 € de paga, pagas tú 15 € de transporte y apartas el 20 % de la paga. ¿Cuánto te queda de gasto libre?",
          options: [
            { id: "a", text: "25 €" },
            { id: "b", text: "35 €" },
            { id: "c", text: "28 €" },
            { id: "d", text: "15 €" },
          ],
          correctOptionId: "a",
          explanation:
            "El 20 % de 50 € son 10 €. 50 − 15 − 10 = 25 €. El 20 % se calcula sobre la paga, no sobre lo que queda.",
        },
        {
          id: "q-me-paso",
          prompt:
            "Hugo se ha gastado 38 € de gasto libre en lugar de 28 €. ¿Qué es lo más útil que puede hacer?",
          options: [
            { id: "a", text: "Dejar el presupuesto, porque está claro que no le funciona" },
            {
              id: "b",
              text: "Ver en qué se pasó y ajustar: gastar menos el resto del mes o planear mejor el siguiente",
            },
            { id: "c", text: "Pedir que le suban la paga" },
            { id: "d", text: "Coger lo que le falta del ahorro y no darle más vueltas" },
          ],
          correctOptionId: "b",
          explanation:
            "Un presupuesto se ajusta. Ver en qué te pasaste es justo lo que te ayuda a planear mejor el mes siguiente.",
        },
        {
          id: "q-50-30-20",
          prompt: "¿Para quién está pensada la regla 50/30/20?",
          options: [
            {
              id: "a",
              text: "Para repartir la paga de un adolescente cuya familia paga casa y comida",
            },
            {
              id: "b",
              text: "Para quien vive de su sueldo y paga casa y comida: la usarás con tu primer sueldo",
            },
            { id: "c", text: "Solo para empresas" },
            { id: "d", text: "Para quien no quiere ahorrar" },
          ],
          correctOptionId: "b",
          explanation:
            "Si tu familia te paga casa y comida, el 50 % para necesidades no encaja con tu paga.",
        },
        {
          id: "q-pizzas",
          prompt:
            "Pagas 32 € de pizzas para cuatro personas, tú incluido. ¿Cuánto te tiene que enviar cada amigo por Bizum?",
          options: [
            { id: "a", text: "10,67 €" },
            { id: "b", text: "8 €" },
            { id: "c", text: "32 €" },
            { id: "d", text: "6 €" },
          ],
          correctOptionId: "b",
          explanation:
            "32 entre 4 son 8 €. El error frecuente es dividir entre 3 y olvidar que tú también comiste.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Tu presupuesto del mes",
      description: "Haz tu primer presupuesto en una nota del móvil.",
      steps: [
        "Apunta cuánto vas a recibir el mes que viene.",
        "Resta lo que pagas tú de verdad y aparta el 20 % para ahorrar.",
        "Lo que queda es tu gasto libre.",
        "Durante dos semanas, apunta todo lo que gastes, aunque sea 1 €, y compáralo con lo que planeaste.",
      ],
    },
  ],
} satisfies LessonInput;
