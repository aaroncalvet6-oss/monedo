import type { CourseInput } from "@/content/schema";

export const queNoTeEstafen = {
  slug: "que-no-te-estafen",
  area: "protegete",
  order: 5,
  title: "Que no te estafen",
  tagline: "Reconoce los engaños más comunes antes de caer en ellos.",
  description:
    "Phishing, estafas con pagos por el móvil, falsos gurús de las redes y promesas de dinero fácil con criptomonedas: cómo funcionan y qué señales los delatan.",
  level: "Básico",
  outcomes: [
    "Detectar mensajes de phishing",
    "Reconocer las estafas más habituales con pagos por el móvil",
    "Desconfiar de las promesas de rentabilidad alta y segura",
  ],
  lessons: [
    {
      slug: "phishing",
      title: "Phishing",
      summary: "Mensajes que se hacen pasar por quien no son.",
      minutes: 6,
    },
    {
      slug: "estafas-bizum",
      title: "Estafas con Bizum",
      summary: "Cuando te piden que aceptes un pago.",
      minutes: 6,
    },
    {
      slug: "falsos-gurus",
      title: "Falsos gurús",
      summary: "Quien vende cursos para hacerse rico.",
      minutes: 6,
    },
    {
      slug: "cripto",
      title: "Cripto y dinero fácil",
      summary: "Promesas que suenan demasiado bien.",
      minutes: 7,
    },
  ],
} satisfies CourseInput;
