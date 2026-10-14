import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacidad y uso educativo",
  description:
    "Monedo no recoge datos personales: tu progreso y tu nombre solo se guardan en tu navegador. Es contenido educativo, no asesoramiento financiero.",
  path: "/legal",
});

const UPDATED_AT = "14 de octubre de 2026";
const GITHUB_PRIVACY =
  "https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement";

const linkClass =
  "font-medium text-brand-text underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-focus";
/** Links that stand on their own line get a full touch target on phones. */
const blockLinkClass = `${linkClass} inline-flex min-h-11 items-center md:min-h-0`;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-lg leading-8 text-fg-muted">{children}</div>
    </section>
  );
}

export default function LegalPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legal"
        title="Privacidad y uso educativo"
        description={`Actualizado el ${UPDATED_AT}.`}
      />
      <div className="flex measure flex-col gap-10 border-t border-border pt-8">
        <Section id="educacion" title="Educación, no asesoramiento">
          <p>
            Monedo sirve para aprender cómo funciona el dinero. No es asesoramiento financiero: no
            recomendamos productos, entidades, inversiones ni decisiones personales concretas.
          </p>
          <p>
            Los ejemplos con cifras son para aprender, y cuando una cifra es inventada la lección lo
            dice. Ninguna rentabilidad está garantizada y las inversiones pueden bajar. Antes de una
            decisión importante, háblalo con un adulto de confianza o con un profesional.
          </p>
          <p>
            Los datos legales y fiscales se comprueban en fuentes oficiales.{" "}
            <Link href="/fuentes" className={blockLinkClass}>
              Fuentes y metodología
            </Link>
          </p>
        </Section>

        <Section id="datos" title="Qué datos recogemos">
          <p>
            Ninguno. No hay cuentas ni formularios, y no usamos analítica, cookies de terceros ni
            publicidad. Tampoco cargamos fuentes ni recursos de otros servidores.
          </p>
        </Section>

        <Section id="navegador" title="Qué se guarda en tu navegador">
          <p>
            Para que puedas seguir donde lo dejaste, tu navegador guarda tu progreso en las
            lecciones, los resultados de las evaluaciones y si prefieres el tema claro u oscuro.
          </p>
          <p>
            Si escribes tu nombre en un certificado, también se guarda solo en tu navegador. Nada de
            esto se envía a ningún sitio: Monedo no lo ve.
          </p>
          <p>
            Puedes borrarlo cuando quieras desde{" "}
            <Link href="/perfil" className={linkClass}>
              tu perfil
            </Link>{" "}
            o borrando los datos de este sitio en tu navegador.
          </p>
        </Section>

        <Section id="alojamiento" title="Dónde se aloja Monedo">
          <p>
            Monedo es una web estática alojada en GitHub Pages, un servicio de GitHub. Como
            cualquier alojamiento web, GitHub registra datos técnicos de las visitas, como la
            dirección IP, por motivos de seguridad. Monedo no recibe esos registros ni los usa.
          </p>
          <p>
            <a
              href={GITHUB_PRIVACY}
              target="_blank"
              rel="noopener noreferrer"
              className={blockLinkClass}
            >
              Declaración de privacidad de GitHub
              <ExternalLink aria-hidden className="ml-1 inline size-3.5" />
              <span className="sr-only">(se abre en otra pestaña)</span>
            </a>
          </p>
        </Section>

        <Section id="enlaces" title="Enlaces a otras webs">
          <p>
            Las lecciones enlazan a fuentes oficiales, como el BOE o la Agencia Tributaria. Si las
            abres, se aplican sus propias condiciones y su política de privacidad.
          </p>
        </Section>

        {CONTACT_EMAIL ? (
          <Section id="contacto" title="Contacto">
            <p>
              ¿Has visto un error o tienes una duda?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>
        ) : null}
      </div>
    </Container>
  );
}
