import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { APPROVED_SOURCES, publishedSources } from "@/features/sources/sources";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Fuentes y metodología",
  description:
    "Cómo verifica Monedo cada dato legal o fiscal: solo fuentes oficiales, con fecha de consulta, y nada sin verificar en las lecciones. Lista de fuentes por lección.",
  path: "/fuentes",
});

/** Last time every source used by a published lesson was checked. */
const REVIEWED_AT = "12 de octubre de 2026";

const method = [
  {
    title: "Solo fuentes oficiales",
    text: "Cada dato legal o fiscal (contratos, nóminas, impuestos, Seguridad Social) se comprueba en la web de un organismo público, como el BOE o la Agencia Tributaria.",
  },
  {
    title: "Con enlace y fecha de consulta",
    text: "De cada dato apuntamos la página exacta y el día en que la consultamos. Si un texto legal se comprobó en una copia literal, la lección enlaza siempre a la versión oficial.",
  },
  {
    title: "Nada sin verificar en las lecciones",
    text: "Si un dato no se ha podido confirmar en una fuente oficial, no entra en ninguna lección, ni en las evaluaciones.",
  },
  {
    title: "Sin cifras que caducan",
    text: "Los tramos del IRPF, los límites para declarar o las fechas de la campaña cambian cada año. Explicamos la idea y enlazamos a la fuente oficial para que veas la cifra de este año.",
  },
  {
    title: "Los ejemplos lo dicen",
    text: "Cuando una cifra es de ejemplo (una rentabilidad, unos tramos inventados, un porcentaje de cotización), la lección lo indica. Ninguna rentabilidad está garantizada y las inversiones pueden bajar.",
  },
  {
    title: "Educación, no asesoramiento",
    text: "No recomendamos productos, entidades ni inversiones. El objetivo es que entiendas cómo funciona el dinero y decidas tú.",
  },
];

export default function SourcesPage() {
  const groups = publishedSources();
  return (
    <Container>
      <PageHeader
        eyebrow="Por qué puedes fiarte"
        title="Fuentes y metodología"
        description="Cómo comprobamos lo que enseñamos y de dónde sale cada dato de las lecciones."
      />
      <div className="flex flex-col gap-14 border-t border-border pt-8">
        <section aria-labelledby="como-verificamos" className="flex flex-col gap-6">
          <h2 id="como-verificamos" className="text-2xl font-semibold tracking-tight">
            Cómo verificamos cada dato
          </h2>
          <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {method.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span className="font-mono tabular text-2xl leading-none font-medium text-brand-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="text-base leading-7 text-fg-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="fuentes-oficiales" className="flex measure flex-col gap-4">
          <h2 id="fuentes-oficiales" className="text-2xl font-semibold tracking-tight">
            Fuentes que aceptamos
          </h2>
          <p className="text-lg leading-8 text-fg-muted">
            Solo estos organismos públicos. Una lección no puede enlazar a ninguna otra web.
          </p>
          <ul className="flex flex-wrap gap-2">
            {APPROVED_SOURCES.map((name) => (
              <li
                key={name}
                className="rounded-full border border-border px-3 py-1.5 text-base text-fg-muted"
              >
                {name}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="fuentes-lecciones" className="flex flex-col gap-6">
          <div className="flex measure flex-col gap-2">
            <h2 id="fuentes-lecciones" className="text-2xl font-semibold tracking-tight">
              Fuentes que usan las lecciones
            </h2>
            <p className="text-lg leading-8 text-fg-muted">
              Revisadas el {REVIEWED_AT}. Las revisamos cada vez que cambian las cifras oficiales.
            </p>
          </div>
          {groups.map((group) => (
            <section
              key={group.organisation}
              aria-label={group.organisation}
              className="flex flex-col gap-3"
            >
              <h3 className="text-lg font-semibold tracking-tight">{group.organisation}</h3>
              <ul className="flex flex-col divide-y divide-border border-y border-border">
                {group.sources.map((source) => (
                  <li key={source.url} className="flex flex-col gap-1 py-4">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1 self-start text-base font-medium text-brand-text underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-focus md:min-h-0"
                    >
                      {source.label}
                      <ExternalLink aria-hidden className="size-3.5 shrink-0" />
                      <span className="sr-only">(se abre en otra pestaña)</span>
                    </a>
                    <p className="text-base text-fg-muted">
                      Se usa en{" "}
                      {source.lessons.map((lesson, i) => (
                        <span key={`${lesson.course}/${lesson.lesson}`}>
                          {i > 0 ? ", " : null}
                          <Link
                            href={`/cursos/${lesson.course}/${lesson.lesson}`}
                            className="underline underline-offset-4 hover:text-fg"
                          >
                            {lesson.title}
                          </Link>
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </section>
      </div>
    </Container>
  );
}
