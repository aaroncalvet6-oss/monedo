import Link from "next/link";
import { Logo } from "@/components/graphics/logo";
import { Container } from "./container";

const links = [
  { href: "/cursos", label: "Cursos" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/legal", label: "Privacidad y uso educativo" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <Container width="wide" className="flex flex-col gap-8 py-10 md:flex-row md:justify-between">
        <div className="flex max-w-md flex-col gap-3">
          <Logo className="self-start" />
          <p className="text-base leading-7 text-fg-muted">
            Monedo es una plataforma educativa. Su contenido sirve para aprender y no constituye
            asesoramiento financiero: no recomendamos productos, entidades ni inversiones concretas.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="flex flex-col text-base md:gap-2 md:text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-xs text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-focus md:min-h-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container width="wide" className="pb-8 text-sm text-fg-subtle">
        © {new Date().getFullYear()} Monedo. Sin cookies de terceros ni analítica.
      </Container>
    </footer>
  );
}
