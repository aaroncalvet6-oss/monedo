import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BASE_PATH } from "@/lib/base-path";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Inicio",
  description: "Esta página se ha movido a la portada de Monedo.",
  path: "/",
  noindex: true,
});

/** Old dashboard URL. Static hosting has no server redirects: refresh to the home page. */
export default function LearnRedirectPage() {
  return (
    <Container className="pt-12">
      <meta httpEquiv="refresh" content={`0; url=${BASE_PATH}/`} />
      <p className="text-base text-fg-muted">
        Tu panel ahora está en la página de inicio.{" "}
        <Link href="/" className="font-medium text-brand-text underline underline-offset-4">
          Ir al inicio
        </Link>
      </p>
    </Container>
  );
}
