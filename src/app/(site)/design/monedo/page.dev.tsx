import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { MonedoCharacter } from "@/components/graphics/monedo-character";
import {
  MONEDO_EXPRESSIONS,
  MONEDO_EXPRESSION_LABELS,
  type MonedoExpression,
} from "@/components/graphics/monedo-expressions";

export const metadata: Metadata = {
  title: "Monedo, el personaje",
  robots: { index: false, follow: false },
};

/** Sample lines to judge voice and expression together. Not lesson content. */
const samples: Record<MonedoExpression, string> = {
  normal: "Hola, soy Monedo. Te acompaño en cada lección, sin rollos.",
  explaining:
    "Mira: si cobras 8 € la hora, unas zapatillas de 90 € son más de 11 horas de trabajo.",
  thinking: "Antes de responder, piénsalo un segundo. No hay prisa.",
  celebrating: "Exacto. Lo has pillado a la primera.",
  oops: "Uy, esa no era. Le pasa a cualquiera: vamos a verlo con calma.",
};

export default function MonedoCharacterPage() {
  return (
    <Container width="wide">
      <PageHeader
        eyebrow="Personaje"
        title="Monedo, tu guía"
        description="Cinco expresiones. Parpadea cada pocos segundos y rebota un poco al hablar; con «reducir movimiento» se queda quieto."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {MONEDO_EXPRESSIONS.map((expression) => (
          <li
            key={expression}
            data-testid={`monedo-${expression}`}
            className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-center py-4">
              <MonedoCharacter
                expression={expression}
                className="size-32"
                label={`Monedo, ${MONEDO_EXPRESSION_LABELS[expression]}`}
              />
            </div>
            <p className="text-sm font-medium text-fg-muted">
              {MONEDO_EXPRESSION_LABELS[expression]}
            </p>
            <p className="rounded-md rounded-tl-xs bg-surface-muted px-4 py-3 text-base leading-7">
              {samples[expression]}
            </p>
          </li>
        ))}
      </ul>
      <section className="mt-12 flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Tamaños</h2>
        <div className="flex items-end gap-6">
          {[
            ["size-8", "32"],
            ["size-12", "48"],
            ["size-16", "64"],
            ["size-24", "96"],
          ].map(([size, px]) => (
            <div key={px} className="flex flex-col items-center gap-2">
              <MonedoCharacter className={size} />
              <span className="font-mono tabular text-xs text-fg-subtle">{px}px</span>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
