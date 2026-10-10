import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GrowthField } from "@/components/graphics/growth-field";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <Container className="grid gap-10 pt-12 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="flex flex-col gap-5">
        <p className="text-sm font-medium text-brand-text">Educación financiera, 14–18 años</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Aprende a manejar tu dinero antes de que el dinero te maneje a ti.
        </h1>
        <p className="measure text-lg leading-8 text-fg-muted">
          Lecciones de 5 a 8 minutos con ejemplos reales en euros. Sin cuenta: tu progreso se guarda
          en tu navegador.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/cursos/fundamentos-del-dinero">
              Empezar el primer curso
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/cursos">Ver todos los cursos</Link>
          </Button>
        </div>
      </div>
      <GrowthField className="max-w-xl" />
    </Container>
  );
}
