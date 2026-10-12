import type { LessonInput } from "@/content/schema";

const AEAT = "https://sede.agenciatributaria.gob.es";

/**
 * Lesson 2.5. Official sources (docs/fuentes.md): campaign and identification (fuentes #16,
 * #20), who must file (#17), low earnings leave the tax at 0 € (#18), dependant allowance
 * (#19), minimum 2 % withholding (#11). Figures that change every year (limits, dates,
 * allowances) are not given: the lesson links to the source.
 * Arithmetic: 1.200 × 2 = 2.400 € · 2.400 × 2 % = 48 €.
 */
export const primeraDeclaracionDeLaRenta = {
  slug: "primera-declaracion-de-la-renta",
  title: "Tu primera declaración de la renta",
  summary: "Qué es, quién la hace y cómo se presenta.",
  minutes: 7,
  blocks: [
    {
      type: "objective",
      id: "objetivo",
      items: [
        "qué es la declaración de la renta y cuándo se hace",
        "por qué puede interesarte presentarla aunque no estés obligado",
        "por qué tienes que hablarlo en casa antes de presentarla",
      ],
    },
    {
      type: "text",
      id: "que-es",
      title: "Qué es la declaración",
      paragraphs: [
        "La declaración de la renta es el trámite anual en el que le cuentas a Hacienda lo que ganaste el año anterior. Con eso se calcula tu IRPF real.",
        "Si te retuvieron más de lo que te tocaba pagar, te devuelven la diferencia. Si fue menos, la pagas tú.",
        "Se presenta en primavera. Las fechas exactas cambian cada año: consúltalas en la Agencia Tributaria.",
      ],
      sources: [
        {
          label: "Agencia Tributaria: campaña de la Renta",
          url: `${AEAT}/static_files/Sede/Actualidad/Notas_prensa/2026/NP_Inicio_Campana_renta_2025.pdf`,
        },
      ],
    },
    {
      type: "text",
      id: "obligado",
      title: "¿Estás obligado?",
      paragraphs: [
        "No todo el mundo está obligado a presentarla: depende de cuánto hayas ganado y de cuántos pagadores hayas tenido.",
        "Los límites cambian, así que consúltalos en la fuente oficial.",
        "Aunque no estés obligado, puedes presentarla. Puede servirte para recuperar lo que te retuvieron.",
      ],
      sources: [
        {
          label: "Agencia Tributaria: quién está obligado a declarar",
          url: `${AEAT}/Sede/Ayuda/25Presentacion/100/2.html`,
        },
      ],
    },
    {
      type: "text",
      id: "como",
      title: "Cómo se presenta",
      paragraphs: [
        "Se hace por internet, con Renta Web, la herramienta de la Agencia Tributaria.",
        "Te identificas con Cl@ve, con un número de referencia o con un certificado digital.",
        "Hacienda te prepara un borrador con los datos que ya tiene. Tú lo revisas y lo confirmas o lo corriges.",
      ],
      sources: [
        {
          label: "Agencia Tributaria: Renta y formas de identificarse",
          url: `${AEAT}/static_files/Sede/Actualidad/Notas_prensa/2026/NP_Inicio_Campana_renta_2025.pdf`,
        },
      ],
    },
    {
      type: "example",
      id: "ejemplo-sara",
      title: "El verano de Sara",
      character: "Sara, 17 años",
      paragraphs: [
        "Sara trabajó de camarera en julio y agosto: 2.400 € brutos. En sus nóminas le retuvieron 48 € de IRPF, el 2 % mínimo en contratos de menos de un año.",
        "Con un solo pagador y esos ingresos, no está obligada a declarar. Con unos ingresos de trabajo tan bajos, su impuesto real del año sale 0 €.",
        "Si presenta la declaración, Hacienda le devuelve los 48 €. Pero antes tiene que hablarlo en casa.",
      ],
      figures: [
        { label: "Ingresos de julio y agosto", value: 2400, unit: "€" },
        { label: "Retención de IRPF (2 %)", value: 48, unit: "€" },
        { label: "Impuesto real del año", value: 0, unit: "€" },
        { label: "Le devolverían", value: 48, unit: "€", emphasis: true },
      ],
    },
    {
      type: "key-figure",
      id: "dato-devolucion",
      value: 48,
      unit: "€",
      context:
        "es lo que puede recuperar Sara de su trabajo de verano si presenta la declaración. Con ingresos de trabajo bajos, las reducciones y el mínimo personal dejan el impuesto en 0 €.",
      sources: [
        {
          label: "Agencia Tributaria: reducción por obtención de rendimientos del trabajo",
          url: `${AEAT}/Sede/en_gb/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/7-cumplimentacion-irpf/7_1-rendimientos-trabajo-personal/7_1_6-reduccion-obtencion-rendimientos-trabajo.html`,
        },
        {
          label: "Agencia Tributaria: mínimo del contribuyente",
          url: `${AEAT}/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-contribuyente.html`,
        },
      ],
    },
    {
      type: "text",
      id: "familia",
      title: "Antes de presentarla, háblalo en casa",
      paragraphs: [
        "Tus padres pueden restar en su declaración una cantidad por tenerte a su cargo: el mínimo por descendientes.",
        "Si presentas tu propia declaración con ingresos por encima de un límite, lo pierden. Y eso puede costarles más de lo que tú recuperas.",
        "Sara y sus padres lo miran juntos en la web de la Agencia Tributaria y deciden con los números delante.",
      ],
      sources: [
        {
          label: "Agencia Tributaria: mínimo por descendientes",
          url: `${AEAT}/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/concepto-requisitos-descendientes.html`,
        },
      ],
    },
    {
      type: "key-ideas",
      id: "ideas-clave",
      items: [
        "La declaración se hace una vez al año, en primavera, sobre lo que ganaste el año anterior. Las fechas exactas, en la Agencia Tributaria.",
        "No todo el mundo está obligado: depende de cuánto hayas ganado y de cuántos pagadores hayas tenido. Aunque no estés obligado, presentarla puede servir para recuperar lo que te retuvieron.",
        "Antes de presentar tu declaración, háblalo en casa: en algunos casos tu familia puede perder más de lo que tú recuperas.",
      ],
    },
    {
      type: "quiz",
      id: "preguntas",
      questions: [
        {
          id: "q-devolucion",
          prompt:
            "A Sara le retuvieron 48 € y su impuesto real del año es 0 €. Si presenta la declaración…",
          options: [
            { id: "a", text: "Tiene que pagar 48 € más" },
            { id: "b", text: "Le devuelven los 48 €" },
            { id: "c", text: "No pasa nada, porque ya está todo pagado" },
            { id: "d", text: "Le devuelven los 2.400 €" },
          ],
          correctOptionId: "b",
          explanation:
            "La retención es un adelanto. Si el impuesto real es 0 €, le devuelven todo lo retenido.",
        },
        {
          id: "q-borrador",
          prompt: "¿Qué es el borrador de la declaración?",
          options: [
            { id: "a", text: "Una hoja en blanco que tienes que rellenar tú desde cero" },
            {
              id: "b",
              text: "La declaración que prepara Hacienda con los datos que ya tiene, para que la revises y la confirmes o la corrijas",
            },
            { id: "c", text: "El justificante de que has pagado" },
            { id: "d", text: "Una multa por no declarar a tiempo" },
          ],
          correctOptionId: "b",
          explanation:
            "Hacienda lo prepara con los datos que tiene. Tú lo revisas antes de confirmarlo.",
        },
        {
          id: "q-no-obligado",
          prompt: "Si no estás obligado a hacer la declaración…",
          options: [
            { id: "a", text: "Está prohibido presentarla" },
            {
              id: "b",
              text: "Puedes presentarla para recuperar lo que te retuvieron, pero antes háblalo en casa: tu familia podría perder más de lo que tú recuperas",
            },
            { id: "c", text: "Te multan si la presentas" },
            { id: "d", text: "Tus padres tienen que presentarla por ti en todos los casos" },
          ],
          correctOptionId: "b",
          explanation:
            "Presentarla puede devolverte lo retenido, pero también puede hacer que tus padres pierdan el mínimo por descendientes.",
        },
        {
          id: "q-cuando",
          prompt: "Trabajaste el verano de 2026. ¿Cuándo declaras ese dinero?",
          options: [
            { id: "a", text: "En el verano de 2026, en cuanto termina el contrato" },
            { id: "b", text: "En la primavera de 2027, en la declaración del año anterior" },
            { id: "c", text: "Todos los meses, en cada nómina" },
            { id: "d", text: "Solo si la empresa te despide" },
          ],
          correctOptionId: "b",
          explanation: "La declaración de cada primavera recoge lo que ganaste el año anterior.",
        },
      ],
    },
    {
      type: "challenge",
      id: "reto",
      title: "Explora la Renta",
      description: "Conoce la web antes de necesitarla.",
      steps: [
        "Entra en la web de la Agencia Tributaria sin iniciar sesión y busca la sección de la Renta.",
        "Apunta las fechas de la campaña de este año y las formas de identificarte.",
        "Si alguien en casa hace la declaración, pregúntale si usa el borrador y si te tiene en cuenta como descendiente.",
      ],
    },
  ],
} satisfies LessonInput;
