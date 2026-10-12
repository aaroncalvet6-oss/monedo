import type { LessonInput } from "@/content/schema";

/**
 * Lesson 1.1. All wages and prices are hypothetical examples, not legal or market data.
 * Arithmetic: 40 €/5 h = 8 €/h · 90/8 = 11,25 h · 600/8 = 75 h = 15 sábados de 5 h ·
 * 13 × 12 = 156 € · 156/8 = 19,5 h · 70/8 = 8,75 h · 40/8 = 5 h · 63/9 = 7 h · 10 × 12 = 120 €.
 */
export const elDineroEsTiempo = {
  slug: "el-dinero-es-tiempo",
  title: "El dinero es tiempo",
  summary: "Cuántas horas de trabajo cuesta lo que compras.",
  minutes: 7,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "calcular cuántas horas de trabajo cuesta cualquier cosa que quieras comprar",
        "comparar precios en horas, no solo en euros",
        "detectar los gastos pequeños que, sumados, se comen muchas horas",
      ],
    },
    {
      type: "text",
      id: "precio-real",
      title: "El precio real no está en la etiqueta",
      paragraphs: [
        "Cuando ves unas zapatillas a 90 €, piensas en euros. Pero esos euros salen de algún sitio: de horas de trabajo, tuyas o de tu familia.",
        "Si traduces el precio a horas, ves lo que de verdad cuesta algo. La compra es la misma, pero decides mejor.",
      ],
    },
    {
      type: "text",
      id: "precio-por-hora",
      title: "Primero, tu precio por hora",
      paragraphs: [
        "Para hacer la cuenta necesitas saber cuánto ganas por cada hora de trabajo. Divide lo que cobras entre las horas que trabajas.",
        "Usa lo que te llega de verdad: el sueldo neto, lo que queda después de impuestos y cotizaciones.",
        "¿Aún no trabajas? Haz la misma cuenta con tu paga: cuántas semanas de paga cuesta algo.",
      ],
      tool: "horas-de-trabajo",
    },
    {
      type: "example",
      id: "ejemplo-lucia",
      title: "Las zapatillas de Lucía",
      character: "Lucía, 17 años, Valencia",
      paragraphs: [
        "Lucía trabaja los sábados en una heladería. Hace 5 horas y cobra 40 € netos por día.",
        "Quiere unas zapatillas de 90 €. Antes de comprarlas, hace la cuenta: 40 € entre 5 horas son 8 € por hora.",
        "90 € entre 8 € por hora son más de 11 horas. Más de dos sábados enteros en la heladería.",
      ],
      figures: [
        { label: "Cobra por sábado", value: 40, unit: "€" },
        { label: "Horas por sábado", value: 5, unit: "h" },
        { label: "Precio por hora", value: 8, unit: "€/h" },
        { label: "Zapatillas", value: 90, unit: "€" },
        { label: "Horas de trabajo", value: 11.25, unit: "h", fractionDigits: 2, emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-movil",
      value: 75,
      unit: "horas",
      context:
        "es lo que le costaría a Lucía un móvil de 600 €. Son 15 sábados seguidos en la heladería: casi cuatro meses de trabajo.",
    },
    {
      type: "interactive",
      id: "calculadora-horas",
      title: "Calcula tus horas",
      instructions:
        "Elige cuánto cobras por hora y escribe el precio de algo que quieras. Mira cuántas horas de trabajo cuesta.",
      config: { widget: "work-hours", defaultPrice: 90, defaultHourlyWage: 8 },
    },
    {
      type: "text",
      id: "gastos-repetidos",
      title: "Lo pequeño también suma",
      paragraphs: [
        "Los gastos que se repiten engañan más que los grandes. Una suscripción de 13 € al mes parece poca cosa.",
        "Pero en un año son 156 €. Para Lucía, casi 20 horas de trabajo: cuatro sábados en la heladería solo para pagar esa suscripción.",
      ],
    },
    {
      type: "decision",
      id: "decision-videojuego",
      title: "¿Lo compras ya?",
      situation:
        "Sale un videojuego que te apetece mucho. Cuesta 70 € y cobras 8 € por hora. ¿Qué haces?",
      options: [
        {
          id: "comprar-ya",
          label: "Lo compro el día que sale",
          consequence:
            "Lo disfrutas desde el primer día. Te cuesta casi 9 horas de trabajo: 70 € entre 8 € por hora son 8,75 horas.",
        },
        {
          id: "esperar-rebaja",
          label: "Espero a que baje de precio",
          consequence:
            "Muchos juegos bajan con el tiempo, aunque no siempre ni en una fecha concreta. Si baja a 40 €, te cuesta 5 horas: casi 4 horas menos de trabajo.",
        },
        {
          id: "no-comprar",
          label: "Lo pienso y decido no comprarlo",
          consequence:
            "Te quedan 70 € para otra cosa o para ahorrar. Quizá descubras que no lo echas de menos. O quizá sí, y eso también es información útil.",
        },
      ],
      takeaway:
        "No hay una única respuesta correcta. Lo importante es decidir sabiendo lo que te cuesta en horas, no solo en euros.",
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Precio en horas = precio en euros ÷ lo que cobras por hora (neto).",
        "Pensar en horas te ayuda a decidir si algo vale lo que cuesta para ti.",
        "Los gastos pequeños que se repiten pueden costar más horas que una compra grande.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-calculo",
          prompt: "Cobras 9 € netos por hora. ¿Cuántas horas te cuesta una chaqueta de 63 €?",
          options: [
            { id: "a", text: "5 horas" },
            { id: "b", text: "7 horas" },
            { id: "c", text: "9 horas" },
            { id: "d", text: "63 horas" },
          ],
          correctOptionId: "b",
          explanation:
            "63 € entre 9 € por hora son 7 horas. Divide siempre el precio entre lo que cobras por hora.",
        },
        {
          id: "q-neto",
          prompt: "¿Qué sueldo tienes que usar para calcular tu precio por hora?",
          options: [
            { id: "a", text: "El sueldo bruto, el que aparece en el contrato" },
            { id: "b", text: "El sueldo neto, el que te llega a la cuenta" },
            { id: "c", text: "Da igual, sale lo mismo" },
          ],
          correctOptionId: "b",
          explanation:
            "El neto es lo que de verdad puedes gastar. El bruto incluye impuestos y cotizaciones que no llegan a tu bolsillo, así que la cuenta saldría demasiado optimista.",
        },
        {
          id: "q-repetidos",
          prompt: "Una suscripción cuesta 10 € al mes. ¿Cuánto pagas en un año?",
          options: [
            { id: "a", text: "10 €" },
            { id: "b", text: "100 €" },
            { id: "c", text: "120 €" },
          ],
          correctOptionId: "c",
          explanation:
            "10 € por 12 meses son 120 €. Multiplicar por 12 es la forma rápida de ver lo que cuesta de verdad un gasto mensual.",
        },
        {
          id: "q-utilidad",
          prompt: "¿Para qué sirve traducir un precio a horas de trabajo?",
          options: [
            { id: "a", text: "Para no comprar nunca nada" },
            {
              id: "b",
              text: "Para decidir con más información si algo vale lo que cuesta para ti",
            },
            { id: "c", text: "Para que las cosas salgan más baratas" },
          ],
          correctOptionId: "b",
          explanation:
            "No se trata de no gastar, sino de gastar sabiendo lo que te cuesta. El precio no cambia, pero tu decisión mejora.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Tu lista en horas",
      description: "Esta semana, aplica la idea a tu vida real.",
      steps: [
        "Apunta tres cosas que te gustaría comprar y su precio.",
        "Calcula tu precio por hora, o por semana de paga si aún no trabajas.",
        "Traduce cada precio a horas o semanas y vuelve a ordenar la lista.",
        "Pregúntate si sigues queriendo las tres.",
      ],
    },
  ],
} satisfies LessonInput;
