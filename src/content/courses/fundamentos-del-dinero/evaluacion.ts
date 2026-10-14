import type { AssessmentInput } from "@/content/schema";

/**
 * Final assessment of course 1: 10 questions drawn from 15, pass with 7. New situations, not
 * the lesson questions, so it checks understanding. No legal or fiscal data.
 * Arithmetic: 45 / 7,5 = 6 · (5 + 8) × 12 = 156, 156 / 8 = 19,5 · 0,20 / 4 = 5 % ·
 * 70 − 25 = 45 · 35 × 20 % = 7 · (90 − 30) / 6 = 10 · 50 − 15 − 10 = 25 · 4 × 22 = 88 ·
 * 2 × 5,99 = 11,98, 1.200 − 1.000 = 200.
 */
export const evaluacionFundamentos = {
  questionsPerAttempt: 10,
  passMark: 7,
  questions: [
    {
      id: "horas-concierto",
      lesson: "el-dinero-es-tiempo",
      prompt:
        "Cobras 7,50 € netos por hora y quieres una entrada de concierto de 45 €. ¿Cuántas horas de trabajo te cuesta?",
      options: [
        { id: "a", text: "6 horas" },
        { id: "b", text: "4,5 horas" },
        { id: "c", text: "7,5 horas" },
        { id: "d", text: "337,5 horas" },
      ],
      correctOptionId: "a",
      explanation:
        "45 € entre 7,50 € por hora son 6 horas. Para pasar un precio a horas, divide el precio entre lo que cobras por hora.",
    },
    {
      id: "suscripciones-ano",
      lesson: "el-dinero-es-tiempo",
      prompt:
        "Iker paga dos suscripciones, de 5 € y de 8 € al mes, y cobra 8 € netos por hora. ¿Qué le cuestan en un año?",
      options: [
        { id: "a", text: "156 €: unas 19 horas y media de trabajo" },
        { id: "b", text: "13 €: poco más de hora y media de trabajo" },
        { id: "c", text: "156 €: unas 12 horas de trabajo" },
      ],
      correctOptionId: "a",
      explanation:
        "13 € al mes por 12 meses son 156 € al año, y 156 entre 8 € por hora son 19,5 horas. Lo pequeño que se repite suma mucho.",
    },
    {
      id: "subida-bocadillo",
      lesson: "inflacion",
      prompt: "El bocadillo de la cafetería costaba 4 € y ahora cuesta 4,20 €. ¿Cuánto ha subido?",
      options: [
        { id: "a", text: "Un 5 %" },
        { id: "b", text: "Un 20 %" },
        { id: "c", text: "Un 0,2 %" },
        { id: "d", text: "Un 4,2 %" },
      ],
      correctOptionId: "a",
      explanation:
        "Ha subido 0,20 €. Y 0,20 entre 4 es 0,05, es decir, un 5 %. Divide siempre la subida entre el precio de antes.",
    },
    {
      id: "paga-y-precios",
      lesson: "inflacion",
      prompt:
        "Este año tu paga sube un 5 % y los precios también suben un 5 %. ¿Qué pasa con lo que puedes comprar?",
      options: [
        { id: "a", text: "Más o menos lo mismo: tu paga y los precios suben al mismo ritmo" },
        { id: "b", text: "Más, porque ahora tienes más euros" },
        { id: "c", text: "Menos, porque los precios han subido" },
      ],
      correctOptionId: "a",
      explanation:
        "Lo que importa es el poder de compra: si tu dinero sube al mismo ritmo que los precios, puedes comprar lo mismo que antes.",
    },
    {
      id: "ahorro-bajo-inflacion",
      lesson: "inflacion",
      prompt:
        "Tu ahorro gana un 1 % al año y los precios suben un 3 % al año. Son cifras de ejemplo. ¿Qué pasa con tu dinero?",
      options: [
        { id: "a", text: "Tienes más euros, pero cada año compran un poco menos" },
        { id: "b", text: "Ganas poder de compra, porque tu dinero crece" },
        { id: "c", text: "Ganas un 4 % al año" },
      ],
      correctOptionId: "a",
      explanation:
        "Si lo que te da tu ahorro es menos que la inflación, tu dinero sigue perdiendo poder de compra, aunque tengas más euros.",
    },
    {
      id: "mochila-capricho",
      lesson: "necesidad-o-capricho",
      prompt:
        "Necesitas una mochila para el instituto. Una sencilla cuesta 25 € y la de marca, 70 €. ¿Qué parte es capricho?",
      options: [
        { id: "a", text: "Los 45 € de diferencia que pagas por la marca" },
        { id: "b", text: "La mochila entera de 70 €" },
        { id: "c", text: "Nada: la mochila es una necesidad" },
      ],
      correctOptionId: "a",
      explanation:
        "La mochila es necesaria, pero no la de 70 €. Lo que pagas de más por la marca es el capricho.",
    },
    {
      id: "coste-oportunidad-auriculares",
      lesson: "necesidad-o-capricho",
      prompt:
        "Tienes 50 €. Con ellos podrías salir el sábado con tus amigos y guardar el resto, o comprarte unos auriculares de 50 €. Si eliges los auriculares, ¿cuál es su coste de oportunidad?",
      options: [
        { id: "a", text: "La salida con tus amigos y lo que habrías guardado" },
        { id: "b", text: "Los 50 € que cuestan los auriculares" },
        { id: "c", text: "Ninguno, porque los auriculares te durarán más" },
      ],
      correctOptionId: "a",
      explanation:
        "El coste de oportunidad no es el precio: es lo que dejas de hacer con ese dinero por gastarlo en otra cosa.",
    },
    {
      id: "paga-primero-35",
      lesson: "pagate-primero",
      prompt:
        "Recibes 35 € de paga al mes y te pagas primero con el 20 %. ¿Cuánto apartas el día que cobras?",
      options: [
        { id: "a", text: "7 €" },
        { id: "b", text: "3,50 €" },
        { id: "c", text: "20 €" },
        { id: "d", text: "28 €" },
      ],
      correctOptionId: "a",
      explanation:
        "El 20 % de 35 € son 7 €. Lo apartas antes de gastar nada; los 28 € que quedan son para el resto del mes.",
    },
    {
      id: "meta-regalo",
      lesson: "pagate-primero",
      prompt:
        "Sofía quiere 90 € para un regalo dentro de 6 meses y ya tiene 30 €. ¿Cuánto tiene que apartar cada mes?",
      options: [
        { id: "a", text: "10 €" },
        { id: "b", text: "15 €" },
        { id: "c", text: "5 €" },
        { id: "d", text: "60 €" },
      ],
      correctOptionId: "a",
      explanation:
        "Le faltan 90 − 30 = 60 €. Repartidos en 6 meses, son 10 € al mes. Resta primero lo que ya tienes.",
    },
    {
      id: "por-que-primero",
      lesson: "pagate-primero",
      prompt:
        "¿Por qué funciona mejor apartar el ahorro el día que cobras que esperar a fin de mes?",
      options: [
        {
          id: "a",
          text: "Porque el dinero que tienes a mano tiende a gastarse y a fin de mes casi nunca sobra",
        },
        { id: "b", text: "Porque a principio de mes el dinero vale más" },
        { id: "c", text: "Porque así no necesitas ponerte una meta" },
      ],
      correctOptionId: "a",
      explanation:
        "Si esperas a ver lo que sobra, casi nunca sobra nada. Apartarlo primero no depende de tu fuerza de voluntad.",
    },
    {
      id: "presupuesto-alba",
      lesson: "tu-primer-presupuesto",
      prompt:
        "Alba recibe 50 € al mes. Paga ella 15 € de transporte y aparta el 20 % para ahorrar. ¿Cuánto le queda de gasto libre?",
      options: [
        { id: "a", text: "25 €" },
        { id: "b", text: "35 €" },
        { id: "c", text: "40 €" },
        { id: "d", text: "15 €" },
      ],
      correctOptionId: "a",
      explanation:
        "El 20 % de 50 € son 10 €. Y 50 − 15 − 10 = 25 € de gasto libre. Primero lo que pagas tú y el ahorro; lo que queda, para lo que quieras.",
    },
    {
      id: "regla-50-30-20",
      lesson: "tu-primer-presupuesto",
      prompt: "¿Por qué la regla 50/30/20 todavía no encaja con tu paga?",
      options: [
        {
          id: "a",
          text: "Porque tu familia cubre casi todas tus necesidades, así que no te hace falta guardar la mitad para ellas",
        },
        { id: "b", text: "Porque solo funciona con cantidades grandes" },
        { id: "c", text: "Porque con la paga no se puede ahorrar" },
      ],
      correctOptionId: "a",
      explanation:
        "La 50/30/20 es para cuando vivas de tu sueldo y pagues casa y comida. Con la paga, repártela en tres partes: lo que pagas tú, ahorro y gasto libre.",
    },
    {
      id: "zapatillas-cuotas",
      lesson: "trampas-de-consumo",
      prompt: "Unas zapatillas de 80 € se pueden pagar en 4 cuotas de 22 €. ¿Qué es verdad?",
      options: [
        { id: "a", text: "Pagas 88 €, 8 € más, y hasta la última cuota debes dinero" },
        { id: "b", text: "Pagas 80 €, lo mismo, porque son solo 4 cuotas" },
        { id: "c", text: "Pagas 8 € más, pero no es una deuda porque lo paga la tienda" },
      ],
      correctOptionId: "a",
      explanation:
        "4 × 22 = 88 €: pagas 8 € más que de una vez. Y pagar a plazos siempre es una deuda hasta la última cuota.",
    },
    {
      id: "urgencia-15-minutos",
      lesson: "trampas-de-consumo",
      prompt:
        "Una web muestra: «Precio especial solo durante los próximos 15 minutos». ¿Qué busca?",
      options: [
        { id: "a", text: "Meterte prisa con el tiempo para que no lo pienses: es urgencia" },
        { id: "b", text: "Avisarte de que quedan pocas unidades: es escasez" },
        { id: "c", text: "Informarte de que después el precio será más bajo" },
      ],
      correctOptionId: "a",
      explanation:
        "Una cuenta atrás es urgencia: te meten prisa con el tiempo. Si no lo necesitabas antes, espera 48 horas.",
    },
    {
      id: "monedas-juego",
      lesson: "trampas-de-consumo",
      prompt:
        "Un juego vende packs de 1.000 monedas a 5,99 €. Quieres un objeto de 1.200 monedas. ¿Qué pasa?",
      options: [
        { id: "a", text: "Compras dos packs: pagas 11,98 € y te sobran 800 monedas" },
        { id: "b", text: "Pagas 7,19 €, justo lo que valen 1.200 monedas" },
        { id: "c", text: "Pagas 5,99 € y el juego te regala las 200 que faltan" },
      ],
      correctOptionId: "a",
      explanation:
        "No puedes comprar «un pack y un poco». Pagas 11,98 € por 2.000 monedas y te sobran 800, para que vuelvas a comprar.",
    },
  ],
} satisfies AssessmentInput;
