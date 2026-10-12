import { ArrowRight, BadgeCheck, BookOpen, Calculator, Lock, Scale, Target } from "lucide-react";
import Link from "next/link";
import { GrowthField } from "@/components/graphics/growth-field";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getPublishedCourses } from "@/content";
import { LearningPaths } from "@/features/courses/components/learning-paths";
import { toOutline } from "@/features/courses/outline";
import { ContinueLearning, PrimaryAction } from "@/features/progress/components/continue-learning";
import { ToolList } from "@/features/tools/components/tool-list";

const steps = [
  {
    icon: BookOpen,
    title: "Elige un curso",
    text: "Cada curso es una ruta corta sobre un tema: tu paga, tu primer sueldo, cómo no caer en trampas.",
  },
  {
    icon: Target,
    title: "Aprende en 5 a 8 minutos",
    text: "Lecciones con ejemplos reales en euros, un dato clave y preguntas que te explican cada respuesta.",
  },
  {
    icon: Calculator,
    title: "Llévalo a tu vida",
    text: "Cada lección termina con un reto práctico, y las herramientas te ayudan a hacer tus propias cuentas.",
  },
];

const trust = [
  {
    icon: BadgeCheck,
    title: "Contenido verificado",
    text: "Cada dato legal o fiscal se comprueba en fuentes oficiales (Agencia Tributaria, Seguridad Social, BOE) antes de publicarse.",
  },
  {
    icon: Lock,
    title: "Sin datos personales",
    text: "No hay registro. Tu progreso se guarda solo en tu navegador. Sin publicidad, sin analítica y sin cookies de terceros.",
  },
  {
    icon: Scale,
    title: "Educación, no asesoramiento",
    text: "Explicamos cómo funciona el dinero. No recomendamos productos, entidades ni inversiones concretas.",
  },
];

export default function HomePage() {
  const courses = getPublishedCourses();
  const outlines = courses.map(toOutline);

  return (
    <div className="flex flex-col gap-20 pb-8 sm:gap-24">
      {/* a) Value proposition */}
      <Container className="grid gap-10 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <p className="text-sm font-medium text-brand-text">
            Educación financiera para jóvenes de 14 a 18 años
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Aprende a manejar tu dinero antes de que el dinero te maneje a ti.
          </h1>
          <p className="measure text-lg leading-8 text-fg-muted">
            Cursos cortos con ejemplos reales en euros, contenido verificado y sin registro.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryAction courses={outlines} />
            <Button asChild size="lg" variant="secondary">
              <Link href="/cursos">Ver cursos</Link>
            </Button>
          </div>
        </div>
        <GrowthField className="hidden max-w-xl lg:block" />
      </Container>

      {/* b) Continue, only with progress */}
      <Container className="-mt-8 empty:hidden sm:-mt-10">
        <ContinueLearning courses={outlines} />
      </Container>

      {/* c) Learning paths */}
      <Container>
        <section aria-labelledby="rutas" className="flex flex-col gap-8">
          <SectionHeading
            id="rutas"
            title="Rutas de aprendizaje"
            description="Elige un área y empieza por el curso que más te sirva ahora."
            action={{ href: "/cursos", label: "Todos los cursos" }}
          />
          <LearningPaths courses={courses} />
        </section>
      </Container>

      {/* d) Tools */}
      <Container>
        <section aria-labelledby="herramientas" className="flex flex-col gap-8">
          <SectionHeading
            id="herramientas"
            title="Herramientas"
            description="Calculadoras para hacer tus propias cuentas."
          />
          <ToolList />
        </section>
      </Container>

      {/* e) How it works and why trust it */}
      <Container>
        <section aria-labelledby="como-funciona" className="flex flex-col gap-8">
          <SectionHeading id="como-funciona" title="Cómo funciona" />
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3 border-t border-border pt-5">
                <span className="font-mono tabular text-sm text-brand-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="text-base leading-7 text-fg-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="confianza" className="mt-16 flex flex-col gap-8">
          <SectionHeading id="confianza" title="Por qué puedes fiarte" />
          <ul className="grid gap-8 md:grid-cols-3">
            {trust.map((item) => (
              <li key={item.title} className="flex flex-col gap-3">
                <item.icon aria-hidden className="size-5 text-brand-text" />
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="text-base leading-7 text-fg-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      {/* f) Families and schools */}
      <Container>
        <section
          aria-labelledby="familias"
          className="grid gap-6 rounded-lg border border-border bg-surface-muted p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr]"
        >
          <h2 id="familias" className="text-2xl font-semibold tracking-tight">
            Para familias y centros educativos
          </h2>
          <div className="flex flex-col gap-4 text-base leading-7 text-fg-muted">
            <p>
              Monedo se puede usar en casa o en clase sin crear cuentas ni recoger datos de los
              alumnos: cada persona ve su progreso en su propio dispositivo.
            </p>
            <p>
              Cada lección dura de 5 a 8 minutos, trabaja con situaciones reales de adolescentes en
              España y termina con un reto práctico, así que encaja en una sesión de tutoría.
            </p>
            <p>
              Es contenido educativo: no vende ni recomienda productos financieros.{" "}
              <Link
                href="/legal"
                className="inline-flex min-h-11 items-center gap-1 font-medium text-brand-text underline-offset-4 hover:underline md:min-h-0"
              >
                Privacidad y uso educativo
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </p>
          </div>
        </section>
      </Container>
    </div>
  );
}

function SectionHeading({
  id,
  title,
  description,
  action,
}: {
  id: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="flex flex-col gap-2">
        <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description ? <p className="text-base leading-7 text-fg-muted">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-11 items-center gap-1 text-base font-medium text-brand-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-focus md:min-h-0 md:text-sm"
        >
          {action.label}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
