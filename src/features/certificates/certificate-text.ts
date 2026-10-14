import { formatDate } from "@/lib/format";

export type CertificateData = {
  name: string;
  courseTitle: string;
  lessons: number;
  score: number;
  total: number;
  /** When the final assessment was first passed. */
  passedAt: Date;
};

/** Every line of the certificate. It never claims official recognition. */
export function certificateText(data: CertificateData) {
  return {
    heading: "Certificado de finalización",
    givenTo: "Se entrega a",
    name: data.name,
    body: `por completar el curso «${data.courseTitle}» de Monedo (${data.lessons} lecciones) y aprobar su evaluación final con ${data.score} de ${data.total} respuestas correctas.`,
    dateLabel: "Fecha",
    date: formatDate(data.passedAt),
    disclaimer:
      "Monedo es una plataforma de educación financiera. Este certificado indica que has completado un curso; no tiene validez académica oficial.",
  };
}
