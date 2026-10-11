import type { CourseInput } from "@/content/schema";

export const fundamentosDelDinero = {
  slug: "fundamentos-del-dinero",
  area: "tu-dinero-hoy",
  order: 1,
  title: "Fundamentos del dinero",
  tagline: "Lo que cuesta de verdad lo que compras y cómo empezar a ahorrar.",
  description:
    "Aprende a medir los precios en horas de trabajo, por qué el dinero quieto pierde valor, cómo ahorrar sin depender de la fuerza de voluntad y cómo hacer tu primer presupuesto con una paga real.",
  level: "Básico",
  outcomes: [
    "Calcular cuántas horas de trabajo cuesta una compra",
    "Entender qué es la inflación y cómo te afecta",
    "Distinguir necesidades de caprichos y frenar las compras impulsivas",
    "Ahorrar de forma automática con la regla «págate primero»",
    "Hacer un presupuesto sencillo con tu paga",
  ],
  lessons: [
    {
      slug: "el-dinero-es-tiempo",
      title: "El dinero es tiempo",
      summary: "Cuántas horas de trabajo cuesta lo que compras.",
      minutes: 7,
    },
    {
      slug: "inflacion",
      title: "Inflación",
      summary: "Por qué el dinero quieto pierde valor.",
      minutes: 6,
    },
    {
      slug: "necesidad-o-capricho",
      title: "Necesidad o capricho",
      summary: "Cómo distinguirlos y la regla de las 48 horas.",
      minutes: 6,
    },
    {
      slug: "pagate-primero",
      title: "Págate primero",
      summary: "Cómo ahorrar sin depender de la fuerza de voluntad.",
      minutes: 6,
    },
    {
      slug: "tu-primer-presupuesto",
      title: "Tu primer presupuesto",
      summary: "Reparte tu paga: lo que pagas tú, ahorro y gasto libre.",
      minutes: 8,
    },
    {
      slug: "trampas-de-consumo",
      title: "Trampas de consumo",
      summary: "Pagos a plazos, monedas virtuales y técnicas que te meten prisa.",
      minutes: 7,
    },
  ],
} satisfies CourseInput;
