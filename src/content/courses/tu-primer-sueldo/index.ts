import type { CourseInput } from "@/content/schema";

export const tuPrimerSueldo = {
  slug: "tu-primer-sueldo",
  area: "trabajo-e-ingresos",
  // Waiting for editorial review before release.
  draft: true,
  order: 2,
  title: "Tu primer sueldo",
  tagline: "Qué firmas, qué cobras y a dónde va lo que no te llega.",
  description:
    "Antes de tu primer trabajo: tipos de contrato, la diferencia entre bruto y neto, cómo leer una nómina línea por línea, para qué sirven el IRPF y la Seguridad Social y cómo funciona la declaración de la renta.",
  level: "Básico",
  outcomes: [
    "Reconocer los tipos de contrato más habituales y qué revisar antes de firmar",
    "Calcular la diferencia entre sueldo bruto y neto",
    "Leer una nómina línea por línea",
    "Entender a dónde van el IRPF y las cotizaciones a la Seguridad Social",
    "Saber qué es la declaración de la renta y cuándo te afecta",
  ],
  lessons: [
    {
      slug: "tipos-de-contrato",
      title: "Tipos de contrato",
      summary: "Qué firmas y en qué fijarte antes de hacerlo.",
      minutes: 7,
    },
    {
      slug: "bruto-y-neto",
      title: "Sueldo bruto y sueldo neto",
      summary: "Por qué no te llega todo lo que pone en el contrato.",
      minutes: 6,
    },
    {
      slug: "leer-una-nomina",
      title: "Cómo leer una nómina",
      summary: "Una nómina explicada línea por línea.",
      minutes: 8,
    },
    {
      slug: "irpf-y-seguridad-social",
      title: "IRPF y Seguridad Social",
      summary: "A dónde va tu dinero y por qué.",
      minutes: 7,
    },
    {
      slug: "primera-declaracion-de-la-renta",
      title: "Tu primera declaración de la renta",
      summary: "Qué es, quién la hace y cómo se presenta.",
      minutes: 7,
    },
  ],
} satisfies CourseInput;
