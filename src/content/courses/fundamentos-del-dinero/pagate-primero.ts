import type { LessonInput } from "@/content/schema";

/**
 * Lesson 1.4. Example savings rate across Monedo: 20 %.
 * Arithmetic: 40 × 20 % = 8 € · 80 / 10 = 8 € (September to June, 10 months) ·
 * 50 × 20 % = 10 €, 50 − 10 = 40 € · 60 / 6 = 10 €.
 */
export const pagatePrimero = {
  slug: "pagate-primero",
  title: "Págate primero",
  summary: "Cómo ahorrar sin depender de la fuerza de voluntad.",
  minutes: 6,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "por qué «ahorrar lo que sobre» casi nunca funciona",
        "cómo ponerte una meta de ahorro con nombre, cifra y fecha",
        "cómo ahorrar sin depender de la fuerza de voluntad",
      ],
    },
    {
      type: "text",
      id: "lo-que-sobra",
      title: "Lo que sobra no existe",
      paragraphs: [
        "Ahorrar es guardar una parte del dinero que recibes para usarla más adelante.",
        "Si esperas a final de mes para ver lo que sobra, casi nunca sobra nada. El dinero que tienes a mano tiende a gastarse.",
      ],
    },
    {
      type: "text",
      id: "pagate-primero",
      title: "Págate primero",
      paragraphs: [
        "Págate primero significa apartar tu ahorro el mismo día que recibes dinero, antes de gastar nada.",
        "Puede ser una cantidad fija o un porcentaje. Un buen punto de partida es el 20 %: de cada 10 €, apartas 2 €.",
        "Y ponlo difícil de tocar: en un sitio separado, como otra hucha, un sobre o una cuenta distinta. Si puedes, que se haga solo cada mes.",
      ],
    },
    {
      type: "text",
      id: "meta",
      title: "Una meta con nombre y cifra",
      paragraphs: [
        "Una meta de ahorro dice para qué ahorras, cuánto necesitas y para cuándo. Por ejemplo: «80 € para unos cascos en junio».",
        "Con una meta así, ahorrar tiene sentido y es más fácil decir que no a un capricho.",
        "Para saber cuánto apartar cada mes, divide lo que necesitas entre los meses que faltan.",
      ],
    },
    {
      type: "example",
      id: "ejemplo-ivan",
      title: "Los cascos de Iván",
      character: "Iván, 16 años",
      paragraphs: [
        "Iván recibe 40 € de paga al mes. El año pasado intentó ahorrar «lo que sobrara» y en diciembre tenía 0 €.",
        "Este año se pone una meta: 80 € para unos cascos en junio. De septiembre a junio hay 10 pagas: 80 entre 10 son 8 € al mes.",
        "8 € es justo el 20 % de su paga. Cada vez que cobra, aparta 8 € en una hucha que no abre. En junio tiene sus 80 €.",
      ],
      figures: [
        { label: "Paga al mes", value: 40, unit: "€" },
        { label: "Meses hasta junio", value: 10, unit: "meses" },
        { label: "Meta: unos cascos", value: 80, unit: "€" },
        { label: "Aparta cada mes (20 %)", value: 8, unit: "€", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-ivan",
      value: 8,
      unit: "€",
      context: "es lo que aparta Iván cada mes, el 20 % de su paga, para tener 80 € en junio.",
    },
    {
      type: "decision",
      id: "decision-cumpleanos",
      title: "¿Qué haces con el regalo?",
      situation:
        "Por tu cumpleaños te regalan 50 €. Estás ahorrando para unos cascos de 80 €. ¿Qué haces?",
      options: [
        {
          id: "aparta-20",
          label: "Aparto el 20 % y el resto lo gasto",
          consequence:
            "Apartas 10 € y te quedan 40 € para lo que quieras. Tu meta avanza sin renunciar a todo.",
        },
        {
          id: "aparta-todo",
          label: "Lo guardo todo para los cascos",
          consequence:
            "Tu meta da un gran salto: 50 € de 80 €. A cambio, ese dinero no lo disfrutas ahora.",
        },
        {
          id: "gasta-todo",
          label: "Me lo gasto todo",
          consequence:
            "Lo disfrutas ahora, pero tu meta se queda donde estaba. Si se repite, junio llegará sin los cascos.",
        },
      ],
      takeaway:
        "No hay una única respuesta correcta. Lo importante es decidir cuánto va a tu meta antes de empezar a gastar.",
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Si esperas a ver lo que sobra, no sobra nada: aparta el ahorro primero, el mismo día que recibes dinero. Un buen punto de partida es el 20 %.",
        "Se ahorra mejor con una meta con nombre, cifra y fecha. Para saber cuánto apartar al mes, divide la meta entre los meses que faltan.",
        "Ponlo difícil de tocar: en un sitio separado y, si puedes, que se haga solo cada mes.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-pagate-primero",
          prompt: "¿Qué significa «págate primero»?",
          options: [
            { id: "a", text: "Ahorrar lo que te sobre al final del mes" },
            {
              id: "b",
              text: "Apartar tu ahorro el mismo día que recibes el dinero, antes de gastar",
            },
            { id: "c", text: "Pagar primero lo que debes a tus amigos" },
            { id: "d", text: "Gastar primero en lo que te gusta y luego ahorrar" },
          ],
          correctOptionId: "b",
          explanation:
            "Es tratar tu ahorro como el primer gasto del mes, no como lo que queda al final.",
        },
        {
          id: "q-lo-que-sobre",
          prompt: "¿Por qué ahorrar «lo que sobre» suele fallar?",
          options: [
            { id: "a", text: "Porque así se ahorra demasiado y te quedas sin dinero" },
            {
              id: "b",
              text: "Porque el dinero que tienes disponible se acaba gastando y al final no sobra nada",
            },
            { id: "c", text: "Porque los bancos cobran por guardar lo que sobra" },
            { id: "d", text: "Porque solo funciona con sueldos grandes" },
          ],
          correctOptionId: "b",
          explanation:
            "Si esperas a final de mes, el dinero se va en pequeños gastos y no queda nada que ahorrar.",
        },
        {
          id: "q-meta",
          prompt:
            "Quieres 60 € para un regalo dentro de 6 meses. ¿Cuánto tienes que apartar cada mes?",
          options: [
            { id: "a", text: "6 €" },
            { id: "b", text: "10 €" },
            { id: "c", text: "12 €" },
            { id: "d", text: "60 €" },
          ],
          correctOptionId: "b",
          explanation: "60 entre 6 son 10. Divide siempre la meta entre los meses que faltan.",
        },
        {
          id: "q-plan",
          prompt: "¿Qué te ayuda más a cumplir tu plan de ahorro?",
          options: [
            {
              id: "a",
              text: "Llevar todo el dinero junto en la cartera e intentar no tocar la parte del ahorro",
            },
            {
              id: "b",
              text: "Tener una meta con nombre y cifra, guardar el ahorro aparte y apartarlo siempre el mismo día",
            },
            { id: "c", text: "Ahorrar solo los meses en los que te acuerdes" },
            { id: "d", text: "Ahorrar el 100 % y no gastar nada" },
          ],
          correctOptionId: "b",
          explanation:
            "Si el ahorro está mezclado con el resto, acabarás gastándolo sin darte cuenta. Y sin meta, cualquier capricho parece mejor plan.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Tu primera meta",
      description: "Pon en marcha tu ahorro esta semana.",
      steps: [
        "Ponle nombre, cifra y fecha a una meta. Por ejemplo: «80 € para unos cascos en junio».",
        "Divide la cifra entre los meses que faltan. Si no sabes por dónde empezar, prueba con el 20 % de tu paga.",
        "Elige dónde lo vas a guardar, separado del resto.",
        "Apártalo la próxima vez que recibas dinero. Si tienes cuenta, pregunta en casa si se puede programar cada mes.",
      ],
    },
  ],
} satisfies LessonInput;
