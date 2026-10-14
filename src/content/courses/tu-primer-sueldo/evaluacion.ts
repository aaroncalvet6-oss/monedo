import type { AssessmentInput } from "@/content/schema";

/**
 * Final assessment of course 2: 8 questions drawn from 12, pass with 6. Only verified data
 * (docs/fuentes.md): probation period (#5), parental consent (#22), 2 % minimum withholding
 * (#11), extra payments (#9), payslip terms (#12), withholding as a payment on account (#59),
 * the dependant allowance (#19) and when the return is filed (#16). Contribution rates and
 * tax brackets are example figures and say so.
 * Arithmetic: 1.000 − 60 − 20 = 920 · 16.800 / 14 = 1.200, 1.300 × 12 = 15.600 ·
 * 1.180 − 94 = 1.086 · (15.000 − 12.000) × 20 % = 600 · 300 − 180 = 120.
 */
export const evaluacionPrimerSueldo = {
  questionsPerAttempt: 8,
  passMark: 6,
  questions: [
    {
      id: "prueba-tres-meses",
      lesson: "tipos-de-contrato",
      prompt:
        "Álex, de 17 años, firma un contrato temporal de 3 meses para el verano. ¿Cuánto puede durar como máximo su periodo de prueba?",
      options: [
        { id: "a", text: "1 mes" },
        { id: "b", text: "2 meses" },
        { id: "c", text: "3 meses" },
        { id: "d", text: "6 meses" },
      ],
      correctOptionId: "a",
      explanation:
        "En los contratos temporales de hasta 6 meses, el periodo de prueba no puede pasar de 1 mes.",
    },
    {
      id: "consentimiento-16",
      lesson: "tipos-de-contrato",
      prompt:
        "Tienes 16 años y te ofrecen un trabajo de reponedor en un supermercado. ¿Qué necesitas para firmar el contrato?",
      options: [
        { id: "a", text: "El consentimiento de tus padres o tutores" },
        { id: "b", text: "Nada: con 16 años puedes firmarlo tú solo" },
        { id: "c", text: "Esperar a cumplir 18 años" },
      ],
      correctOptionId: "a",
      explanation:
        "Puedes trabajar desde los 16 años, pero hasta los 18 necesitas el consentimiento de tus padres o tutores para firmar.",
    },
    {
      id: "neto-mil",
      lesson: "bruto-y-neto",
      prompt:
        "Tu contrato dice 1.000 € brutos al mes. Con un 6 % de cotización (cifra de ejemplo) y un 2 % de retención, ¿cuánto te llega?",
      options: [
        { id: "a", text: "920 €" },
        { id: "b", text: "940 €" },
        { id: "c", text: "980 €" },
        { id: "d", text: "1.000 €" },
      ],
      correctOptionId: "a",
      explanation:
        "Se descuentan 60 € de cotización y 20 € de retención: 1.000 − 60 − 20 = 920 €. Hay que restar las dos cosas, no solo una.",
    },
    {
      id: "ofertas-anuales",
      lesson: "bruto-y-neto",
      prompt:
        "Oferta A: 16.800 € brutos al año en 14 pagas. Oferta B: 1.300 € brutos al mes en 12 pagas. ¿Cuál paga más al año?",
      options: [
        { id: "a", text: "La A: 16.800 € frente a 15.600 €" },
        { id: "b", text: "La B, porque cada mes cobras 1.300 € y con la A, 1.200 €" },
        { id: "c", text: "Pagan lo mismo" },
      ],
      correctOptionId: "a",
      explanation:
        "1.300 × 12 = 15.600 €, menos que 16.800 €. Compara siempre en la misma medida: todo en bruto al año.",
    },
    {
      id: "nomina-diciembre",
      lesson: "bruto-y-neto",
      prompt: "En diciembre cobras casi el doble que en noviembre. ¿Qué explicación encaja?",
      options: [
        {
          id: "a",
          text: "Cobras una de las dos pagas extra, que forman parte de tu sueldo del año",
        },
        { id: "b", text: "La empresa te hace un regalo de Navidad porque quiere" },
        { id: "c", text: "En diciembre no se descuenta nada de la nómina" },
      ],
      correctOptionId: "a",
      explanation:
        "Hay dos pagas extra al año, una en Navidad. No son un regalo: forman parte de tu sueldo anual.",
    },
    {
      id: "comprobar-nomina",
      lesson: "leer-una-nomina",
      prompt:
        "En tu nómina, los devengos suman 1.180 € y las deducciones, 94 €. A tu cuenta llegan 1.086 €. ¿Está bien?",
      options: [
        { id: "a", text: "Sí: devengos − deducciones = líquido total a percibir" },
        { id: "b", text: "No: tendrían que llegarte los 1.180 €" },
        { id: "c", text: "No: tendrían que llegarte 1.274 €" },
      ],
      correctOptionId: "a",
      explanation:
        "1.180 − 94 = 1.086 €. Es la cuenta que siempre tienes que comprobar: las deducciones se restan, no se suman.",
    },
    {
      id: "plus-transporte",
      lesson: "leer-una-nomina",
      prompt: "Tu empresa te paga un plus de transporte. ¿En qué parte de la nómina aparece?",
      options: [
        { id: "a", text: "En los devengos: es dinero que has ganado ese mes" },
        { id: "b", text: "En las deducciones: es un gasto" },
        { id: "c", text: "En ninguna: se paga aparte, fuera de la nómina" },
      ],
      correctOptionId: "a",
      explanation:
        "Los devengos son todo lo que has ganado: el salario base y los pluses o complementos, como el de transporte.",
    },
    {
      id: "tramos-quince-mil",
      lesson: "irpf-y-seguridad-social",
      prompt:
        "Con unos tramos inventados (0 % hasta 12.000 € y 20 % por lo que pase de ahí), ¿cuánto paga quien gana 15.000 € al año?",
      options: [
        { id: "a", text: "600 €" },
        { id: "b", text: "3.000 €" },
        { id: "c", text: "2.400 €" },
        { id: "d", text: "0 €" },
      ],
      correctOptionId: "a",
      explanation:
        "Solo 3.000 € pasan del límite, y el 20 % de 3.000 € son 600 €. El 20 % no se aplica a todo el sueldo.",
    },
    {
      id: "subida-de-tramo",
      lesson: "irpf-y-seguridad-social",
      prompt: "Te suben el sueldo y una parte pasa a un tramo más alto del IRPF. ¿Qué te pasa?",
      options: [
        {
          id: "a",
          text: "Te queda más dinero que antes: el porcentaje más alto solo se aplica a la parte que pasa del límite",
        },
        {
          id: "b",
          text: "Te puede quedar menos dinero, porque el porcentaje nuevo se aplica a todo el sueldo",
        },
        { id: "c", text: "Te queda lo mismo, porque la subida se va entera en impuestos" },
      ],
      correctOptionId: "a",
      explanation:
        "En el IRPF, cada porcentaje se aplica solo a la parte que cae en su tramo. Por eso, por el IRPF, ganar más nunca te deja con menos.",
    },
    {
      id: "retencion-de-mas",
      lesson: "irpf-y-seguridad-social",
      prompt:
        "Durante el año te retuvieron 300 € de IRPF, pero el impuesto que de verdad te toca es de 180 €. ¿Qué pasa en la declaración?",
      options: [
        { id: "a", text: "Te devuelven 120 €" },
        { id: "b", text: "Pagas 180 € más" },
        { id: "c", text: "Nada: lo retenido ya es el impuesto final" },
      ],
      correctOptionId: "a",
      explanation:
        "La retención es un adelanto. En la declaración se resta del impuesto real: te retuvieron 120 € de más y te los devuelven.",
    },
    {
      id: "hablarlo-en-casa",
      lesson: "primera-declaracion-de-la-renta",
      prompt:
        "Lucas, de 17 años, trabajó en verano y le retuvieron 60 €. No está obligado a declarar, pero quiere recuperarlos. ¿Qué es lo más sensato?",
      options: [
        {
          id: "a",
          text: "Hablarlo en casa antes: su familia podría perder más de lo que él recupera",
        },
        { id: "b", text: "Presentarla sin decir nada: si no está obligado, no afecta a nadie" },
        { id: "c", text: "No presentarla: los menores de edad no pueden hacer la declaración" },
      ],
      correctOptionId: "a",
      explanation:
        "Si presenta su declaración con ingresos por encima de un límite, sus padres pueden perder el mínimo por descendientes. Hay que mirarlo juntos.",
    },
    {
      id: "que-ano-declaras",
      lesson: "primera-declaracion-de-la-renta",
      prompt: "Trabajas el verano de 2027. ¿En qué declaración aparece ese dinero?",
      options: [
        { id: "a", text: "En la que se presenta en la primavera de 2028" },
        { id: "b", text: "En la que se presenta en la primavera de 2027" },
        { id: "c", text: "En ninguna, porque es un trabajo de verano" },
      ],
      correctOptionId: "a",
      explanation:
        "Cada primavera se declara lo que ganaste el año anterior. Lo del verano de 2027 se declara en 2028.",
    },
  ],
} satisfies AssessmentInput;
