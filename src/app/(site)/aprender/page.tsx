import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BASE_PATH } from "@/lib/base-path";

export const metadata: Metadata = { title: "Inicio", robots: { index: false, follow: true } };

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
