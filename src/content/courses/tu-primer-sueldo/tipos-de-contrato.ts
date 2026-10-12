import type { LessonInput } from "@/content/schema";

const ET = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430";

/**
 * Lesson 2.1. Legal data (docs/fuentes.md): minimum age 16 (fuente #1), no night work,
 * overtime or dangerous work under 18 (fuente #2), indefinite or temporary contracts, with the
 * detail left to the Estatuto (fuente #3), probation period (fuente #5), parental consent from
 * 16 to 18 (fuente #22). Left out until verified: contract types in detail (#3, #4), written
 * contract and copy as a right (#6), checking registration (#7), collective agreements (#8),
 * night-time hours (#23).
 */
export const tiposDeContrato = {
  slug: "tipos-de-contrato",
  title: "Tipos de contrato",
  summary: "Qué firmas y en qué fijarte antes de hacerlo.",
  minutes: 7,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "qué es un contrato de trabajo y qué revisar antes de firmar",
        "qué tipos de contrato hay",
        "qué no te pueden pedir si tienes menos de 18 años",
      ],
    },
    {
      type: "text",
      id: "que-es",
      title: "Qué es un contrato de trabajo",
      paragraphs: [
        "Un contrato de trabajo es el acuerdo con la empresa en el que se fija qué haces, cuántas horas, cuánto cobras y durante cuánto tiempo.",
        "Trabajar con contrato y dado de alta en la Seguridad Social es trabajar de forma legal: tu trabajo queda registrado oficialmente.",
        "«Sin papeles» significa que, oficialmente, ese trabajo no existe.",
      ],
    },
    {
      type: "text",
      id: "tipos",
      title: "Los tipos de contrato",
      paragraphs: [
        "Un contrato puede ser indefinido, sin fecha de fin, o temporal, para un tiempo concreto.",
        "La ley regula varios tipos de contrato temporal y cuánto pueden durar. Si quieres el detalle, está en el Estatuto de los Trabajadores.",
      ],
      sources: [{ label: "BOE: Estatuto de los Trabajadores", url: ET }],
    },
    {
      type: "text",
      id: "periodo-de-prueba",
      title: "El periodo de prueba",
      paragraphs: [
        "Al empezar puede haber un periodo de prueba. Durante ese tiempo, cualquiera de las dos partes, la empresa o tú, puede terminar la relación.",
        "Tiene un máximo. Si tu contrato es temporal y dura hasta 6 meses, el periodo de prueba no puede pasar de 1 mes.",
      ],
      sources: [{ label: "BOE: Estatuto de los Trabajadores, artículo 14", url: `${ET}#a14` }],
    },
    {
      type: "text",
      id: "menores",
      title: "Si tienes menos de 18 años",
      paragraphs: [
        "Puedes trabajar desde los 16 años. Hasta los 18, necesitas el consentimiento de tus padres o tutores para firmar el contrato.",
        "Y la ley te protege más: no puedes trabajar de noche, ni hacer horas extra, ni hacer trabajos peligrosos.",
        "Las horas extra son las que trabajas por encima de tu jornada. Aunque te las paguen aparte, con menos de 18 años no puedes hacerlas.",
      ],
      sources: [
        { label: "BOE: Estatuto de los Trabajadores, artículo 6", url: `${ET}#a6` },
        { label: "BOE: Estatuto de los Trabajadores, artículo 7", url: `${ET}#a7` },
      ],
    },
    {
      type: "example",
      id: "ejemplo-sara",
      title: "El primer contrato de Sara",
      character: "Sara, 17 años, Cádiz",
      paragraphs: [
        "Sara consigue trabajo de camarera en un chiringuito para julio y agosto. Como tiene 17 años, sus padres dan su consentimiento para que firme.",
        "Su contrato es temporal, de 2 meses, con 30 horas a la semana y 1.200 € brutos al mes.",
        "Ve que no pone el horario y lo pregunta antes de firmar. Cuando firma, pide una copia.",
      ],
      figures: [
        { label: "Duración", value: 2, unit: "meses" },
        { label: "Jornada", value: 30, unit: "h a la semana" },
        { label: "Sueldo bruto", value: 1200, unit: "€ al mes" },
        { label: "Periodo de prueba, como máximo", value: 1, unit: "mes", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-prueba",
      value: 1,
      unit: "mes",
      context:
        "es lo máximo que puede durar el periodo de prueba de Sara: su contrato es temporal y dura menos de 6 meses.",
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "Trabaja con contrato y dado de alta: así tu trabajo existe oficialmente. Antes de firmar, lee jornada, sueldo, duración y periodo de prueba, y quédate una copia.",
        "Un contrato puede ser indefinido o temporal. Si es temporal y dura hasta 6 meses, el periodo de prueba no puede pasar de 1 mes.",
        "Con menos de 18 años, la ley te protege más: no puedes trabajar de noche, ni hacer horas extra, ni trabajos peligrosos, aunque te lo pidan o tú quieras ganar más.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-sin-papeles",
          prompt:
            "A Marta, de 17 años, le ofrecen trabajar de camarera en verano «sin papeles, te pago en mano». ¿Cuál es el problema principal?",
          options: [
            { id: "a", text: "Ninguno, si le pagan lo acordado" },
            {
              id: "b",
              text: "No tiene contrato ni está dada de alta: oficialmente ese trabajo no existe",
            },
            { id: "c", text: "Que cobrará menos que con contrato" },
            { id: "d", text: "Que tendrá que hacer la declaración de la renta" },
          ],
          correctOptionId: "b",
          explanation:
            "Trabajar con contrato y dado de alta es trabajar de forma legal. Sin papeles, ese trabajo no queda registrado en ningún sitio.",
        },
        {
          id: "q-horas-extra",
          prompt:
            "Tienes 17 años y en el chiringuito te piden quedarte hasta la 1:00 a cerrar, «y te lo pago como horas extra». ¿Qué dice la ley?",
          options: [
            { id: "a", text: "Puedes, siempre que te lo paguen aparte" },
            {
              id: "b",
              text: "No puedes: con menos de 18 años no se puede trabajar de noche ni hacer horas extra",
            },
            { id: "c", text: "Puedes, si tus padres firman una autorización" },
            { id: "d", text: "Solo puedes hacerlo los fines de semana" },
          ],
          correctOptionId: "b",
          explanation:
            "La prohibición protege a los menores: no cambia aunque te paguen más ni aunque tú quieras.",
        },
        {
          id: "q-prueba",
          prompt:
            "Sara tiene un contrato temporal de 2 meses. ¿Cuánto puede durar como máximo su periodo de prueba?",
          options: [
            { id: "a", text: "1 mes" },
            { id: "b", text: "2 meses" },
            { id: "c", text: "6 meses" },
            { id: "d", text: "No puede tener periodo de prueba" },
          ],
          correctOptionId: "a",
          explanation:
            "En los contratos temporales de hasta 6 meses, el periodo de prueba no puede pasar de 1 mes.",
        },
        {
          id: "q-firma",
          prompt: "Te dan el contrato y te dicen: «Firma aquí, ya lo leerás en casa». ¿Qué haces?",
          options: [
            { id: "a", text: "Firmo: es lo normal y si no, pierdo el trabajo" },
            {
              id: "b",
              text: "Pido tiempo para leerlo, compruebo horas, sueldo, duración y periodo de prueba, y pido una copia",
            },
            { id: "c", text: "Firmo y pido la copia más adelante" },
            { id: "d", text: "No firmo nunca ningún contrato" },
          ],
          correctOptionId: "b",
          explanation:
            "Lo que firmas te compromete. Léelo antes, pregunta lo que no entiendas y guarda una copia.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Lee una oferta de verdad",
      description: "Practica con una oferta real antes de tu primer trabajo.",
      steps: [
        "Busca una oferta de trabajo de verano en un portal de empleo.",
        "Localiza el tipo de contrato, las horas, el sueldo bruto y la duración.",
        "Apunta lo que falte y qué preguntarías antes de firmar.",
      ],
    },
  ],
} satisfies LessonInput;
