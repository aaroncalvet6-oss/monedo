import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Privacidad y uso educativo" };

const sections = [
  {
    id: "educacion",
    title: "Educación, no asesoramiento",
    body: [
      "Monedo sirve para aprender cómo funciona el dinero. No es asesoramiento financiero: no recomendamos productos, entidades, inversiones ni decisiones personales concretas.",
      "Los ejemplos con cifras son ilustrativos. Ninguna rentabilidad está garantizada y las inversiones pueden bajar. Antes de una decisión importante, consúltala con un adulto de confianza o un profesional.",
    ],
  },
  {
    id: "privacidad",
    title: "Tu privacidad",
    body: [
      "No necesitas cuenta. Tu progreso y tu preferencia de tema se guardan solo en tu navegador y no salen de tu dispositivo.",
      "No usamos cookies de terceros, analítica ni publicidad, y no cargamos recursos de otros servidores.",
      "Puedes borrar tu progreso cuando quieras desde tu perfil, o borrando los datos del sitio en tu navegador.",
    ],
  },
];

export default function LegalPage() {
  return (
    <Container>
      <PageHeader eyebrow="Legal" title="Privacidad y uso educativo" />
      <div className="flex measure flex-col gap-10 border-t border-border pt-8">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id} className="flex flex-col gap-3">
            <h2 id={section.id} className="text-xl font-semibold tracking-tight">
              {section.title}
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-fg-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Container>
  );
}
