import type { LessonInput } from "@/content/schema";

/**
 * Lesson 1.2. The 3 % inflation is an example figure and says so on screen; no real CPI
 * is quoted (if one ever is, the source is the INE).
 * Arithmetic: 100 / 1,03³ = 91,51 € · 10 × 1,03³ = 10,93 € · 2,10 − 2 = 0,10; 0,10 / 2 = 5 %.
 */
export const inflacion = {
  slug: "inflacion",
  title: "Inflación",
  summary: "Por qué el dinero quieto pierde valor.",
  minutes: 6,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "qué es la inflación",
        "por qué el dinero que no se mueve pierde valor",
        "cómo calcular cuánto ha subido un precio",
      ],
    },
    {
      type: "text",
      id: "precios-suben",
      title: "Los precios no se quedan quietos",
      paragraphs: [
        "La inflación es la subida general de los precios con el tiempo. No sube una cosa sola: suben muchas a la vez.",
        "En España se mide con el IPC, el Índice de Precios de Consumo. Lo calcula el INE mirando cada mes los precios de miles de productos.",
      ],
    },
    {
      type: "text",
      id: "poder-de-compra",
      title: "Lo que importa es lo que puedes comprar",
      paragraphs: [
        "El poder de compra es lo que puedes comprar con una cantidad de dinero.",
        "Si los precios suben y tu dinero no, tu poder de compra baja. Tienes los mismos billetes, pero te llegan para menos.",
        "Por eso el dinero quieto en un cajón pierde valor año tras año, aunque siga siendo la misma cantidad.",
      ],
    },
    {
      type: "text",
      id: "porcentajes",
      title: "Cómo calcular cuánto ha subido algo",
      paragraphs: [
        "Un porcentaje significa «de cada 100». Que algo suba un 3 % quiere decir que, de cada 100 €, el precio sube 3 €.",
        "Para saber cuánto ha subido un precio, resta el precio de antes al de hoy, divídelo entre el de antes y multiplica por 100.",
        "Un helado pasa de 2 € a 2,10 €: sube 0,10 €. Y 0,10 entre 2 es 0,05, es decir, un 5 %.",
      ],
    },
    {
      type: "example",
      id: "ejemplo-marcos",
      title: "Los 100 € de Marcos",
      character: "Marcos, 14 años",
      paragraphs: [
        "En su cumpleaños, la abuela de Marcos le regala 100 € y él los guarda en un cajón «para cuando los necesite».",
        "Imagina que los precios suben un 3 % cada año. Es una cifra de ejemplo, no un dato real.",
        "Dentro de tres años, sus 100 € comprarán lo mismo que hoy compran 91,51 €. Una entrada de cine de 10 € costará unos 10,93 €.",
      ],
      figures: [
        { label: "Dinero en el cajón", value: 100, unit: "€" },
        { label: "Inflación de ejemplo", value: 3, unit: "% al año" },
        { label: "Entrada de cine dentro de 3 años", value: 10.93, unit: "€", fractionDigits: 2 },
        {
          label: "Lo que podrán comprar sus 100 € en 3 años",
          value: 91.51,
          unit: "€",
          fractionDigits: 2,
          emphasis: true,
        },
      ],
    },
    {
      type: "key-figure",
      id: "dato-cajon",
      value: 91.51,
      fractionDigits: 2,
      unit: "€",
      context:
        "es lo que podrán comprar dentro de tres años los 100 € de Marcos si los precios suben un 3 % al año (cifra de ejemplo).",
    },
    {
      type: "text",
      id: "interes-compuesto",
      title: "El mismo efecto, a tu favor",
      paragraphs: [
        "La inflación se acumula. Con el ahorro puede pasar lo mismo, a tu favor: si tu dinero gana un porcentaje y lo dejas ahí, al año siguiente también gana sobre lo ganado. Es el interés compuesto.",
        "Pero si lo que te da tu ahorro es menos que la inflación, tu dinero sigue perdiendo poder de compra, aunque tengas más euros.",
        "Ninguna rentabilidad está garantizada y las inversiones pueden bajar. Pruébalo con cifras de ejemplo.",
      ],
      tool: "interes-compuesto",
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Con inflación, los billetes no cambian, pero cada año compran un poco menos.",
        "El dinero quieto en un cajón pierde poder de compra año tras año.",
        "Para que tu dinero no pierda valor, tendría que crecer al menos lo mismo que los precios.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-paga",
          prompt:
            "Este año los precios han subido un 5 % y tu paga sigue siendo de 20 €. ¿Qué ha pasado?",
          options: [
            { id: "a", text: "Puedes comprar lo mismo que antes, porque tienes los mismos 20 €" },
            { id: "b", text: "Puedes comprar un poco menos que antes" },
            { id: "c", text: "Puedes comprar más, porque los precios suben y el dinero vale más" },
            { id: "d", text: "Tu paga ahora vale 25 €" },
          ],
          correctOptionId: "b",
          explanation: "Tienes los mismos euros, pero cada cosa cuesta más.",
        },
        {
          id: "q-helado",
          prompt: "Un helado costaba 2 € y ahora cuesta 2,10 €. ¿Cuánto ha subido?",
          options: [
            { id: "a", text: "Un 10 %" },
            { id: "b", text: "Un 5 %" },
            { id: "c", text: "Un 0,10 %" },
            { id: "d", text: "Un 2 %" },
          ],
          correctOptionId: "b",
          explanation: "Ha subido 0,10 €. Y 0,10 entre 2 es 0,05, es decir, un 5 %.",
        },
        {
          id: "q-frase",
          prompt: "¿Cuál de estas frases es correcta?",
          options: [
            { id: "a", text: "La inflación solo afecta a quien tiene mucho dinero ahorrado" },
            {
              id: "b",
              text: "Si todos los precios suben un 3 % y tu paga también sube un 3 %, puedes comprar lo mismo que antes",
            },
            {
              id: "c",
              text: "La inflación significa que los billetes valen menos porque se desgastan",
            },
            { id: "d", text: "Si sube el precio de los móviles, ya hay inflación seguro" },
          ],
          correctOptionId: "b",
          explanation:
            "Lo que importa es si tu dinero sube al mismo ritmo que los precios. Y la inflación es una subida general, no de una sola cosa.",
        },
        {
          id: "q-hucha",
          prompt:
            "Guardas 100 € en una hucha durante un año con una inflación del 2 %. Al abrirla…",
          options: [
            { id: "a", text: "Hay 98 € en la hucha" },
            {
              id: "b",
              text: "Sigue habiendo 100 €, pero compran más o menos lo que antes compraban 98 €",
            },
            { id: "c", text: "Hay 102 €, porque la inflación lo hace crecer" },
            { id: "d", text: "Hay 100 € y compran exactamente lo mismo que antes" },
          ],
          correctOptionId: "b",
          explanation:
            "Los billetes no desaparecen: siguen siendo 100 €. Lo que baja es lo que puedes comprar con ellos.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Precios de antes y de ahora",
      description: "Comprueba la inflación con precios que conoces.",
      steps: [
        "Pregunta en casa cuánto costaban hace unos años tres cosas: una barra de pan, una entrada de cine y un menú.",
        "Busca cuánto cuestan hoy.",
        "Calcula cuánto ha subido cada una: (precio de hoy − precio de antes) ÷ precio de antes × 100.",
      ],
    },
  ],
} satisfies LessonInput;
