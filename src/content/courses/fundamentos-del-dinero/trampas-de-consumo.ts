import type { LessonInput } from "@/content/schema";

/**
 * Lesson 1.6. The age needed to sign up for instalments is not verified yet
 * (docs/fuentes.md #21), so this lesson does not mention it.
 * Arithmetic: 6 × 55 = 330 €, 330 − 300 = 30 € · 6 × 50 = 300 € · 2 × 9,99 = 19,98 €,
 * 2.000 − 1.200 = 800 gems · 2 × 4,99 = 9,98 €, 1.000 − 800 = 200 gems · 4 × 30 = 120 €.
 */
export const trampasDeConsumo = {
  slug: "trampas-de-consumo",
  title: "Trampas de consumo",
  summary: "Pagos a plazos, monedas virtuales y técnicas que te meten prisa.",
  minutes: 7,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "por qué pagar a plazos es siempre una deuda, con intereses o sin ellos",
        "cuánto cuestan de verdad las monedas virtuales de los juegos",
        "reconocer la urgencia y la escasez, dos técnicas de venta para meterte prisa",
      ],
    },
    {
      type: "text",
      id: "plazos",
      title: "Pagar a plazos es una deuda",
      paragraphs: [
        "Pagar a plazos es pagar algo en varias partes, durante varios meses, en lugar de todo de golpe.",
        "Mientras no termines de pagar, debes dinero: eso es una deuda. Y si te retrasas en una cuota, te pueden cobrar un recargo.",
        "«Compra ahora, paga después» es lo mismo: alguien te adelanta el dinero y tú lo devuelves en cuotas.",
      ],
    },
    {
      type: "text",
      id: "intereses",
      title: "Con intereses o sin intereses",
      paragraphs: [
        "Los intereses son lo que pagas de más por pagar más tarde. Con intereses, al final pagas más que el precio.",
        "Sin intereses, pagas lo mismo, pero sigue siendo una deuda hasta la última cuota. Lee la letra pequeña: a veces hay comisiones.",
      ],
    },
    {
      type: "text",
      id: "monedas-virtuales",
      title: "Gemas, monedas y cajas de botín",
      paragraphs: [
        "Muchos juegos venden monedas virtuales: gemas, monedas o puntos que compras con euros para gastarlos dentro del juego.",
        "Esconden el precio real en euros y casi nunca puedes comprar justo lo que necesitas. Siempre te sobra algo, para que vuelvas a comprar.",
        "Las cajas de botín son pagos en los que no sabes qué te va a tocar.",
      ],
    },
    {
      type: "text",
      id: "urgencia-escasez",
      title: "Urgencia y escasez",
      paragraphs: [
        "«La oferta acaba en 10 minutos» es urgencia: te meten prisa con el tiempo.",
        "«Quedan 2» es escasez: te meten prisa con la cantidad.",
        "Son técnicas de venta. Si no lo necesitabas antes, aplica la regla de las 48 horas.",
      ],
    },
    {
      type: "example",
      id: "ejemplo-marta-leo",
      title: "El móvil de Marta y las gemas de Leo",
      character: "Leo, 16 años, y su hermana Marta, 19",
      paragraphs: [
        "Marta quiere un móvil de 300 €. La tienda le ofrece 6 cuotas de 55 € con intereses: pagaría 330 €, 30 € más.",
        "También le ofrece 6 cuotas de 50 € sin intereses: pagaría 300 €, lo mismo, pero durante seis meses debería dinero.",
        "En casa, Leo quiere una skin de 1.200 gemas. El pack de 1.000 gemas cuesta 9,99 €: tiene que comprar dos, paga 19,98 € y le sobran 800 gemas.",
      ],
      figures: [
        { label: "Móvil al contado", value: 300, unit: "€" },
        { label: "6 cuotas de 55 € con intereses", value: 330, unit: "€" },
        { label: "Paga de más a plazos", value: 30, unit: "€", emphasis: true },
        { label: "Dos packs de gemas", value: 19.98, unit: "€", fractionDigits: 2 },
        { label: "Gemas que le sobran", value: 800, unit: "gemas" },
      ],
    },
    {
      type: "key-figure",
      id: "dato-plazos",
      value: 30,
      unit: "€",
      context: "es lo que paga de más Marta si elige el móvil a plazos con intereses.",
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Pagar a plazos es una deuda. Con intereses, pagas más que el precio. Sin intereses, no pagas más, pero sigue siendo una deuda: si te retrasas en una cuota, hay recargos.",
        "Las monedas virtuales esconden el precio real en euros y casi nunca puedes comprar justo lo que necesitas: siempre te sobra algo, para que vuelvas a comprar.",
        "«La oferta acaba en 10 minutos» es urgencia y «quedan 2» es escasez: dos técnicas de venta para meterte prisa. Si no lo necesitabas antes, espera 48 horas.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-plazos",
          prompt:
            "Un móvil cuesta 300 € al contado o 6 cuotas de 55 €. ¿Cuánto más pagas a plazos?",
          options: [
            { id: "a", text: "0 €, es el mismo móvil" },
            { id: "b", text: "30 €" },
            { id: "c", text: "55 €" },
            { id: "d", text: "330 €" },
          ],
          correctOptionId: "b",
          explanation: "6 × 55 = 330 €. Y 330 − 300 = 30 € más que pagándolo de una vez.",
        },
        {
          id: "q-gemas",
          prompt:
            "Un pack de 500 gemas cuesta 4,99 € y el objeto que quieres cuesta 800 gemas. ¿Qué pasa?",
          options: [
            { id: "a", text: "Te gastas 4,99 €" },
            {
              id: "b",
              text: "Tienes que comprar dos packs: te gastas 9,98 € y te sobran 200 gemas",
            },
            { id: "c", text: "Te gastas exactamente 7,98 €, que es lo que valen 800 gemas" },
            { id: "d", text: "El juego te devuelve el cambio en euros" },
          ],
          correctOptionId: "b",
          explanation:
            "No puedes comprar «medio» pack. 7,98 € es lo que costaría si pudieras comprar justo lo que necesitas.",
        },
        {
          id: "q-prisa",
          prompt:
            "En una web ves: «Quedan 2 unidades · La oferta termina en 09:59». ¿Qué es lo más sensato?",
          options: [
            { id: "a", text: "Comprar ya: si lo pone, es que es verdad" },
            {
              id: "b",
              text: "Reconocer la escasez y la urgencia, dos técnicas para meterte prisa, y, si no lo necesitabas, esperar 48 horas",
            },
            { id: "c", text: "Denunciar la web, porque es ilegal poner eso" },
            { id: "d", text: "Comprar dos, por si se acaban" },
          ],
          correctOptionId: "b",
          explanation:
            "Esos mensajes buscan que decidas rápido. Si de verdad lo necesitas, seguirá teniendo sentido dentro de dos días.",
        },
        {
          id: "q-sin-intereses",
          prompt:
            "«Compra ahora, paga después, sin intereses»: unos cascos de 120 € en 4 cuotas de 30 €. ¿Qué es verdad?",
          options: [
            { id: "a", text: "Es gratis: como no hay intereses, no es una deuda" },
            {
              id: "b",
              text: "Pagas 120 €, lo mismo, pero es una deuda: si te retrasas en una cuota, puede haber recargo",
            },
            { id: "c", text: "Pagas 30 € más que al contado" },
            { id: "d", text: "Solo tienes que pagar la primera cuota" },
          ],
          correctOptionId: "b",
          explanation:
            "4 × 30 = 120 €, así que no pagas más. Pero hasta la última cuota debes dinero.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Caza la trampa",
      description: "Mira tus gastos y las ofertas con otros ojos.",
      steps: [
        "Revisa, o pide ver en casa, cuánto has gastado en juegos y apps el último mes, y súmalo en euros.",
        "Busca una oferta con urgencia o escasez: una cuenta atrás, «quedan pocas».",
        "Vuelve a mirarla una semana después. ¿Seguía ahí?",
      ],
    },
  ],
} satisfies LessonInput;
