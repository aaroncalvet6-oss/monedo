import type { LessonInput } from "@/content/schema";

/**
 * Lesson 1.3. Arithmetic: 120 − 35 = 85 € · Nerea: 60 − 45 = 15 €; 60 − 15 = 45 € missing,
 * 45 / 25 = 1,8 months of pocket money («casi dos meses») · 100 × 0,6 = 60 €.
 */
export const necesidadOCapricho = {
  slug: "necesidad-o-capricho",
  title: "Necesidad o capricho",
  summary: "Cómo distinguirlos y la regla de las 48 horas.",
  minutes: 6,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "distinguir una necesidad de un capricho",
        "frenar las compras por impulso con la regla de las 48 horas",
        "pensar en lo que dejas de comprar cada vez que compras algo",
      ],
    },
    {
      type: "text",
      id: "necesidad-o-capricho",
      title: "Necesidad o capricho",
      paragraphs: [
        "Una necesidad es algo sin lo que tendrías un problema real: comer, ir a clase, el material del instituto.",
        "Un capricho es algo que te apetece, pero sin lo que puedes vivir perfectamente.",
        "Muchas compras mezclan las dos cosas. Necesitas zapatillas, pero no necesariamente las más caras: la diferencia de precio es el capricho.",
      ],
    },
    {
      type: "text",
      id: "regla-48-horas",
      title: "La regla de las 48 horas",
      paragraphs: [
        "Una compra por impulso es comprar algo en el momento, sin pensarlo, porque te ha entrado el antojo.",
        "La regla de las 48 horas la frena: si algo no es necesario, espera dos días antes de comprarlo.",
        "Si pasado ese tiempo sigues queriéndolo, adelante. Muchas veces las ganas desaparecen solas.",
      ],
    },
    {
      type: "text",
      id: "coste-de-oportunidad",
      title: "Lo que dejas de comprar",
      paragraphs: [
        "Todo lo que compras es algo que no compras. Eso tiene nombre: coste de oportunidad.",
        "Es lo que dejas de poder hacer con un dinero por gastarlo en otra cosa.",
        "Antes de pagar, pregúntate: «¿Qué otra cosa podría hacer con este dinero?»",
      ],
    },
    {
      type: "example",
      id: "ejemplo-nerea",
      title: "La sudadera de Nerea",
      character: "Nerea, 14 años",
      paragraphs: [
        "Nerea recibe 25 € de paga al mes y tiene 60 € ahorrados. Un viernes ve en redes una sudadera de 45 € que lleva todo el mundo.",
        "Quiere comprarla esa misma noche, pero aplica la regla de las 48 horas. El domingo ya no le apetece tanto.",
        "Entonces se acuerda del concierto de su grupo favorito en primavera: la entrada cuesta 60 €. Con la sudadera, le habrían faltado 45 €, casi dos meses de paga.",
      ],
      figures: [
        { label: "Ahorros", value: 60, unit: "€" },
        { label: "Sudadera", value: 45, unit: "€" },
        { label: "Le quedarían", value: 15, unit: "€" },
        { label: "Entrada del concierto", value: 60, unit: "€" },
        { label: "Le faltarían para el concierto", value: 45, unit: "€", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-sudadera",
      value: 45,
      unit: "€",
      context:
        "le habrían faltado a Nerea para el concierto si se hubiera comprado la sudadera: casi dos meses de paga. Ese es su coste de oportunidad.",
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Muchas compras mezclan necesidad y capricho: necesitas zapatillas, pero no necesariamente las más caras. La diferencia de precio es el capricho.",
        "La regla de las 48 horas: si algo no es necesario, espera dos días antes de comprarlo. Si las ganas siguen, adelante; muchas veces desaparecen.",
        "Todo lo que compras es algo que no compras: eso se llama coste de oportunidad. Antes de pagar, pregúntate qué otra cosa podrías hacer con ese dinero.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-zapatillas",
          prompt:
            "Necesitas zapatillas para Educación Física. Hay unas de 35 € y otras de moda de 120 €. ¿Qué parte es necesidad?",
          options: [
            { id: "a", text: "Las dos son necesidad por igual, porque necesitas zapatillas" },
            { id: "b", text: "Tener zapatillas es necesidad; los 85 € de diferencia son capricho" },
            { id: "c", text: "Ninguna: en clase te pueden dejar unas" },
            { id: "d", text: "Las de 120 €, porque las caras siempre duran más" },
          ],
          correctOptionId: "b",
          explanation:
            "Necesitas zapatillas, pero no unas de 120 €. Lo que pagas de más por la marca o la moda es el capricho.",
        },
        {
          id: "q-48-horas",
          prompt: "¿Para qué sirve la regla de las 48 horas?",
          options: [
            { id: "a", text: "Para que te dé tiempo a encontrar un precio más barato" },
            { id: "b", text: "Para comprobar si las ganas siguen cuando se pasa el impulso" },
            { id: "c", text: "Para no comprarte nunca un capricho" },
            { id: "d", text: "Porque las tiendas suelen bajar el precio a los dos días" },
          ],
          correctOptionId: "b",
          explanation:
            "No se trata de prohibirte nada: se trata de dejar que pase el impulso y decidir con la cabeza fría.",
        },
        {
          id: "q-coste-oportunidad",
          prompt:
            "Tienes 30 €. Si te compras una skin de 20 € en un juego, ¿cuál es su coste de oportunidad?",
          options: [
            { id: "a", text: "20 €" },
            {
              id: "b",
              text: "Lo que podrías haber hecho con esos 20 € en lugar de la skin, como ir al cine con tus amigos",
            },
            { id: "c", text: "Los 10 € que te quedan" },
            { id: "d", text: "Ninguno, porque es tu dinero" },
          ],
          correctOptionId: "b",
          explanation:
            "El coste de oportunidad no es un precio: es aquello a lo que renuncias por gastar ese dinero en otra cosa.",
        },
        {
          id: "q-descuento",
          prompt:
            "Te salta un anuncio: «Solo hoy, −40 %» en unos cascos que no pensabas comprar. ¿Qué haces?",
          options: [
            { id: "a", text: "Los compro ya: con un 40 % de descuento estoy ahorrando dinero" },
            {
              id: "b",
              text: "Espero 48 horas: el descuento no convierte en necesidad algo que no necesitaba",
            },
            { id: "c", text: "Pregunto en el grupo de amigos y, si les gustan, los compro" },
            { id: "d", text: "No compro nunca nada que esté rebajado" },
          ],
          correctOptionId: "b",
          explanation:
            "Si los cascos costaban 100 €, gastar 60 € en algo que no ibas a comprar no es ahorrar 40 €: es gastar 60 €.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Tu semana de 48 horas",
      description: "Pon a prueba la regla con tus propios antojos.",
      steps: [
        "Durante una semana, apunta en el móvil cada cosa que te apetezca comprar, con su precio y la fecha.",
        "Antes de comprar cualquiera, espera 48 horas.",
        "Al final de la semana, cuenta cuántas sigues queriendo.",
      ],
    },
  ],
} satisfies LessonInput;
