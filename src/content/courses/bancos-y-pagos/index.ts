import type { CourseInput } from "@/content/schema";

export const bancosYPagos = {
  slug: "bancos-y-pagos",
  area: "tu-dinero-hoy",
  order: 3,
  title: "Bancos y pagos",
  tagline: "Cuentas, tarjetas y pagos con el móvil sin sorpresas.",
  description:
    "Cómo funciona una cuenta bancaria, la diferencia entre tarjeta de débito y de crédito, los pagos entre particulares con el móvil y cómo detectar comisiones.",
  level: "Básico",
  outcomes: [
    "Entender qué es una cuenta y qué te pueden cobrar por ella",
    "Distinguir una tarjeta de débito de una de crédito",
    "Usar los pagos entre particulares con el móvil con seguridad",
  ],
  lessons: [
    {
      slug: "tu-primera-cuenta",
      title: "Tu primera cuenta",
      summary: "Qué es y cómo funciona una cuenta bancaria.",
      minutes: 6,
    },
    {
      slug: "debito-y-credito",
      title: "Débito y crédito",
      summary: "Dos tarjetas que parecen iguales y no lo son.",
      minutes: 6,
    },
    {
      slug: "bizum",
      title: "Bizum y pagos con el móvil",
      summary: "Pagos al instante entre personas.",
      minutes: 5,
    },
    {
      slug: "comisiones",
      title: "Comisiones",
      summary: "Lo que cuesta tener una cuenta y cómo leerlo.",
      minutes: 6,
    },
  ],
} satisfies CourseInput;
