import type { CourseInput } from "@/content/schema";

export const ahorroEInversion = {
  slug: "ahorro-e-inversion",
  area: "hacer-crecer-tu-dinero",
  order: 4,
  title: "Ahorro e inversión: lo básico",
  tagline: "Conceptos para entender cómo crece (y cómo puede bajar) el dinero.",
  description:
    "Interés compuesto, riesgo, diversificación y qué es un fondo indexado. Todo explicativo: Monedo no recomienda productos ni decisiones de inversión, y ninguna rentabilidad está garantizada.",
  level: "Intermedio",
  outcomes: [
    "Entender el interés compuesto y por qué importa el tiempo",
    "Saber que más rentabilidad esperada implica más riesgo",
    "Explicar qué es diversificar y qué es un fondo indexado",
  ],
  lessons: [
    {
      slug: "interes-compuesto",
      title: "Interés compuesto",
      summary: "Intereses que generan intereses.",
      minutes: 7,
    },
    {
      slug: "riesgo",
      title: "Riesgo y rentabilidad",
      summary: "Por qué las inversiones pueden bajar.",
      minutes: 7,
    },
    {
      slug: "diversificacion",
      title: "Diversificación",
      summary: "No poner todos los huevos en la misma cesta.",
      minutes: 6,
    },
    {
      slug: "fondo-indexado",
      title: "Qué es un fondo indexado",
      summary: "Una explicación, no una recomendación.",
      minutes: 7,
    },
  ],
} satisfies CourseInput;
