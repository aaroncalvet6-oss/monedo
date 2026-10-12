import type { LessonInput } from "@/content/schema";

/**
 * Lesson 2.4. Brackets (fuente #14) are explained with invented figures that say so; real
 * brackets change and are not given. Employer contributions: fuente #13. What contributions
 * entitle you to (#15) is not verified yet and is left out.
 * Arithmetic: 13.000 − 10.000 = 3.000 · 3.000 × 20 % = 600 · 13.000 × 20 % = 2.600 ·
 * Q2 D: 13.000 × 10 % = 1.300.
 */
export const irpfYSeguridadSocial = {
  slug: "irpf-y-seguridad-social",
  title: "IRPF y Seguridad Social",
  summary: "A dónde va tu dinero y por qué.",
  minutes: 7,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "qué es el IRPF y por qué la retención es solo un adelanto",
        "cómo funcionan los tramos y por qué, en el IRPF, ganar más nunca te deja con menos dinero",
        "en qué se diferencian el IRPF y las cotizaciones a la Seguridad Social",
      ],
    },
    {
      type: "text",
      id: "que-es",
      title: "Qué es el IRPF",
      paragraphs: [
        "Un impuesto es dinero que pagamos entre todos para financiar los servicios públicos: institutos, hospitales, carreteras.",
        "El IRPF es el impuesto sobre lo que ganas en un año.",
        "La retención de cada nómina es un adelanto. El impuesto real se calcula una vez al año, en la declaración: si te retuvieron de más, te devuelven la diferencia; si fue de menos, la pagas tú.",
      ],
    },
    {
      type: "text",
      id: "tramos",
      title: "Los tramos",
      paragraphs: [
        "El IRPF va por tramos: franjas de ingresos con un porcentaje cada una. Hay una escala estatal y otra de tu comunidad autónoma.",
        "Cada porcentaje solo se aplica a la parte de tus ingresos que cae en su tramo.",
        "Por eso, en el IRPF, ganar más nunca te deja con menos dinero. Otras cosas con límites de ingresos, como algunas becas o ayudas, sí pueden tener saltos.",
      ],
    },
    {
      type: "example",
      id: "ejemplo-tramos",
      title: "Si a Sara le suben el sueldo",
      character: "Sara, años después",
      paragraphs: [
        "Los tramos de este ejemplo son inventados para entender la idea. Los reales cambian y no hace falta saberlos de memoria.",
        "Imagina que hasta 10.000 € al año pagas un 0 % y, por lo que pase de 10.000 €, un 20 %.",
        "Si Sara ganara 13.000 € al año, solo pagaría el 20 % de 3.000 €: 600 €. No el 20 % de 13.000 €, que serían 2.600 €.",
      ],
      figures: [
        { label: "Ingresos del año", value: 13000, unit: "€" },
        { label: "Hasta 10.000 € (0 %, inventado)", value: 0, unit: "€" },
        { label: "Parte que pasa del límite", value: 3000, unit: "€" },
        { label: "Impuesto (20 % de 3.000 €)", value: 600, unit: "€", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-tramos",
      value: 600,
      unit: "€",
      context:
        "es lo que pagaría Sara con los tramos inventados del ejemplo, y no 2.600 €. Ganar más le deja más dinero, no menos.",
    },
    {
      type: "text",
      id: "cotizaciones",
      title: "Las cotizaciones son otra cosa",
      paragraphs: [
        "Las cotizaciones a la Seguridad Social no son el IRPF: van a otro sitio y se calculan aparte.",
        "Se descuentan de tu nómina, y la empresa también cotiza por ti, más que tú.",
      ],
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "La retención de IRPF de cada nómina es un adelanto. Una vez al año, en la declaración, se calcula el impuesto real y te devuelven o pagas la diferencia.",
        "El IRPF va por tramos: cada porcentaje solo se aplica a la parte que cae en su tramo. Por el IRPF, ganar más nunca te deja con menos dinero.",
        "Las cotizaciones a la Seguridad Social son otra cosa: se descuentan de tu nómina y la empresa también cotiza por ti, más que tú.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-tramo",
          prompt:
            "Un amigo te dice: «No quiero que me suban el sueldo, que paso de tramo y voy a cobrar menos». ¿Tiene razón?",
          options: [
            {
              id: "a",
              text: "Sí: al pasar de tramo se aplica el porcentaje más alto a todo el sueldo",
            },
            {
              id: "b",
              text: "No: en el IRPF, el porcentaje más alto solo se aplica a la parte que pasa del límite",
            },
            { id: "c", text: "Sí, por eso a mucha gente no le compensa que le suban el sueldo" },
            { id: "d", text: "Depende del banco en el que cobres" },
          ],
          correctOptionId: "b",
          explanation:
            "Así funcionan los tramos del IRPF. Ojo: otras cosas con límites de ingresos, como algunas becas o ayudas, sí pueden tener saltos.",
        },
        {
          id: "q-calculo",
          prompt:
            "Con los tramos inventados de la lección (0 % hasta 10.000 €, 20 % por lo que pase de ahí), ¿cuánto paga alguien que gana 13.000 € al año?",
          options: [
            { id: "a", text: "2.600 €" },
            { id: "b", text: "600 €" },
            { id: "c", text: "0 €" },
            { id: "d", text: "1.300 €" },
          ],
          correctOptionId: "b",
          explanation:
            "Solo 3.000 € pasan del límite, y el 20 % de 3.000 € son 600 €. La A aplica el 20 % a todo.",
        },
        {
          id: "q-retencion",
          prompt: "¿Qué es la retención de IRPF que aparece en tu nómina?",
          options: [
            { id: "a", text: "El impuesto definitivo del año, que ya no cambia" },
            {
              id: "b",
              text: "Un adelanto: en la declaración se calcula el impuesto real y te devuelven o pagas la diferencia",
            },
            { id: "c", text: "Una multa por cobrar en verano" },
            { id: "d", text: "Tu cotización a la Seguridad Social" },
          ],
          correctOptionId: "b",
          explanation: "Es un adelanto a cuenta. El impuesto real se calcula en la declaración.",
        },
        {
          id: "q-diferencia",
          prompt:
            "¿Qué diferencia hay entre la retención de IRPF y la cotización a la Seguridad Social?",
          options: [
            { id: "a", text: "Ninguna: son lo mismo con dos nombres" },
            {
              id: "b",
              text: "La retención es un adelanto del impuesto sobre lo que ganas; la cotización va a la Seguridad Social, y la empresa también cotiza por ti",
            },
            { id: "c", text: "La cotización solo la pagan los autónomos" },
            { id: "d", text: "La retención solo se aplica a los mayores de edad" },
          ],
          correctOptionId: "b",
          explanation:
            "Son dos descuentos distintos: uno es un impuesto y el otro va a la Seguridad Social, donde la empresa también cotiza.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "¿Quién paga lo que usas?",
      description: "Mira a tu alrededor con otros ojos.",
      steps: [
        "Haz una lista de cinco servicios públicos que hayas usado esta semana: instituto, centro de salud, autobús, biblioteca, polideportivo.",
        "Al lado de cada uno, escribe quién crees que lo paga.",
        "Compruébalo en casa o en la web del servicio.",
      ],
    },
  ],
} satisfies LessonInput;
