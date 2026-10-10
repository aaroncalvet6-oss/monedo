import {
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  Clock,
  Flame,
  GraduationCap,
  Info,
  Lock,
  PiggyBank,
  Receipt,
  ShieldCheck,
  Trophy,
  UserRound,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import { GrowthField } from "@/components/graphics/growth-field";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, InputWithUnit } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Money, Num, Percent } from "@/components/ui/num";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { KeyFigure } from "@/components/ui/key-figure";
import { Stat } from "@/components/ui/stat";
import { StreakBadge } from "@/components/ui/streak-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { BrandSection } from "./_components/brand-section";
import { ColorSwatches, ContrastTable } from "./_components/color-swatches";
import { DialogDemo } from "./_components/dialog-demo";
import { LessonLayoutDemo } from "./_components/lesson-layout-demo";
import { LoadingDemo } from "./_components/loading-demo";
import { ProgressDemo } from "./_components/progress-demo";
import { QuizDemo } from "./_components/quiz-demo";
import { DesignSection, Specimen } from "./_components/section";
import { SliderDemo } from "./_components/slider-demo";

export const metadata: Metadata = {
  title: "Sistema de diseño",
  robots: { index: false, follow: false },
};

const toc = [
  ["principios", "Principios"],
  ["logotipo", "Logotipo"],
  ["color", "Color"],
  ["contraste", "Contraste"],
  ["tipografia", "Tipografía"],
  ["forma", "Espacio y forma"],
  ["botones", "Botones"],
  ["campos", "Campos"],
  ["insignias", "Insignias"],
  ["progreso", "Progreso"],
  ["dato-clave", "Dato clave"],
  ["tarjetas", "Tarjetas y cifras"],
  ["avisos", "Avisos"],
  ["preguntas", "Preguntas"],
  ["navegacion", "Navegación"],
  ["iconos", "Iconos"],
  ["movimiento", "Movimiento"],
  ["lector", "Lector de lecciones"],
  ["graficos", "Gráficos"],
] as const;

const typeScale = [
  ["text-6xl", "60 / 64", "Tu dinero, bajo control"],
  ["text-5xl", "48 / 52", "Tu dinero, bajo control"],
  ["text-4xl", "38 / 44", "Tu dinero, bajo control"],
  ["text-3xl", "30 / 36", "Título de página"],
  ["text-2xl", "24 / 32", "Título de sección"],
  ["text-xl", "20 / 28", "Subtítulo o pregunta"],
  ["text-lg", "18 / 28", "Texto de lección en pantallas grandes"],
  ["text-base", "16 / 24", "Texto de interfaz y párrafos"],
  ["text-sm", "14 / 20", "Botones, navegación y metadatos en escritorio"],
  ["text-xs", "12 / 16", "SOLO ETIQUETAS E INSIGNIAS"],
] as const;

const icons = [
  [GraduationCap, "Aprender"],
  [BookOpen, "Cursos"],
  [Calculator, "Herramientas"],
  [UserRound, "Perfil"],
  [Wallet, "Paga"],
  [PiggyBank, "Ahorro"],
  [Receipt, "Nómina"],
  [ShieldCheck, "Seguridad"],
  [Clock, "Duración"],
  [Flame, "Racha"],
  [Trophy, "Certificado"],
  [Lock, "Bloqueado"],
] as const;

export default function DesignPage() {
  return (
    <Container width="wide">
      <PageHeader
        eyebrow="Interno · v1"
        title="Sistema de diseño"
        description="Tokens, tipografía y componentes de Monedo. Todo lo que aparece aquí funciona en modo claro y oscuro; cambia el tema desde la cabecera para comprobarlo."
      />

      <div className="grid gap-12 lg:grid-cols-[180px_minmax(0,1fr)]">
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="sticky top-20 flex flex-col gap-0.5 text-sm">
            {toc.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block rounded-sm px-2 py-1 text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-focus"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <DesignSection id="principios" title="Principios">
            <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Modo formación",
                  "Serio, claro y moderno. Nada infantil: ni mascotas, ni emojis, ni dibujos.",
                ],
                [
                  "Espacio antes que cajas",
                  "La jerarquía se crea con tipografía y espacio en blanco. Bordes de 1 px, sombras solo en capas flotantes.",
                ],
                [
                  "Un solo color de marca",
                  "Esmeralda para acciones y progreso. Ámbar solo para logros y rachas.",
                ],
                [
                  "Cifras exactas",
                  "Números y euros en Geist Mono con cifras tabulares, siempre en formato español.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="flex flex-col gap-1.5">
                  <dt className="font-medium">{title}</dt>
                  <dd className="text-base leading-7 text-fg-muted">{body}</dd>
                </div>
              ))}
            </dl>
          </DesignSection>

          <DesignSection
            id="logotipo"
            title="Logotipo"
            description="Símbolo y nombre en SVG, en trazados. Funciona sobre claro y oscuro y se mantiene legible a 16 px como favicon."
          >
            <BrandSection />
          </DesignSection>

          <DesignSection
            id="color"
            title="Color"
            description="Base neutra fría (zinc) y un único color de marca. Los componentes solo usan tokens semánticos: la paleta por defecto de Tailwind está desactivada."
          >
            <ColorSwatches />
          </DesignSection>

          <DesignSection
            id="contraste"
            title="Contraste"
            description="Ratios WCAG calculados a partir de los tokens. Texto ≥ 4,5:1 y elementos de interfaz ≥ 3:1 en los dos modos; un test unitario lo comprueba en cada cambio."
          >
            <ContrastTable />
          </DesignSection>

          <DesignSection
            id="tipografia"
            title="Tipografía"
            description="Geist Sans para la interfaz y el texto; Geist Mono con cifras tabulares para números y euros."
          >
            <div className="flex flex-col divide-y divide-border">
              {typeScale.map(([cls, metrics, sample]) => (
                <div
                  key={cls}
                  className="grid gap-1 py-3 sm:grid-cols-[140px_1fr] sm:items-baseline"
                >
                  <span className="font-mono text-xs text-fg-subtle">
                    {cls} · {metrics}
                  </span>
                  <span className={`${cls} truncate font-semibold`}>{sample}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              <Specimen label="Cifras · font-mono tabular">
                <div className="flex flex-col gap-1 font-mono tabular text-2xl">
                  <Money value={1234.5} />
                  <Money value={89.99} />
                  <Money value={-12} />
                  <span className="text-base text-fg-muted">
                    <Num value={1500} /> € · <Percent value={0.035} /> ·{" "}
                    <Num value={38.5} fractionDigits={1} /> h
                  </span>
                </div>
              </Specimen>
              <Specimen label="Texto de lección · measure (68ch) · leading-8">
                <p className="measure text-lg leading-8 text-fg-muted">
                  Lucía cobra 40 € de paga al mes y quiere unas zapatillas de 90 €. Si ahorra la
                  mitad cada mes, tardará cinco meses en comprarlas. Si espera 48 horas antes de
                  decidir, quizá descubra que no las necesita tanto.
                </p>
              </Specimen>
            </div>
          </DesignSection>

          <DesignSection
            id="forma"
            title="Espacio y forma"
            description="Escala de espaciado de 4 px. Radios moderados y consistentes, bordes de 1 px."
          >
            <div className="flex flex-wrap items-end gap-6">
              {[
                ["xs", "4 px", "rounded-xs"],
                ["sm", "6 px", "rounded-sm"],
                ["md", "10 px", "rounded-md"],
                ["lg", "14 px", "rounded-lg"],
              ].map(([name, px, cls]) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className={`size-16 border border-border-strong bg-surface-muted ${cls}`} />
                  <span className="font-mono text-xs text-fg-subtle">
                    {name} · {px}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-end gap-3">
              {[1, 2, 3, 4, 6, 8, 12, 16, 24].map((n) => (
                <div key={n} className="flex flex-col items-center gap-2">
                  <div className="w-3 rounded-xs bg-brand" style={{ height: n * 4 }} />
                  <span className="font-mono text-xs text-fg-subtle">{n * 4}</span>
                </div>
              ))}
            </div>
          </DesignSection>

          <DesignSection
            id="botones"
            title="Botones"
            description="Una acción principal por vista. Todos tienen estados de hover, foco visible, deshabilitado y carga. Pulsa Tab para ver el foco."
          >
            <div className="flex flex-col gap-8">
              <Specimen label="Variantes">
                <Button>Empezar curso</Button>
                <Button variant="secondary">Ver temario</Button>
                <Button variant="subtle">Repasar</Button>
                <Button variant="ghost">Saltar</Button>
                <Button variant="danger">Reiniciar</Button>
                <Button variant="link">Leer más</Button>
              </Specimen>
              <Specimen label="Tamaños">
                <Button size="sm">Pequeño</Button>
                <Button>Mediano</Button>
                <Button size="lg">
                  Grande
                  <ArrowRight />
                </Button>
                <Button size="icon" variant="secondary" aria-label="Siguiente">
                  <ArrowRight />
                </Button>
                <Button size="icon-sm" variant="ghost" aria-label="Información">
                  <Info />
                </Button>
              </Specimen>
              <Specimen label="Deshabilitado y carga">
                <Button disabled>Comprobar</Button>
                <Button variant="secondary" disabled>
                  Ver temario
                </Button>
                <Button loading>Guardando</Button>
                <LoadingDemo />
              </Specimen>
            </div>
          </DesignSection>

          <DesignSection
            id="campos"
            title="Campos"
            description="Borde de control con contraste 3:1; el foco cambia el borde a esmeralda."
          >
            <div className="flex flex-col gap-10">
              <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="d-name">Tu nombre (para el certificado)</Label>
                  <Input id="d-name" placeholder="Lucía García" autoComplete="off" />
                  <p className="text-sm text-fg-subtle">Solo se guarda en este navegador.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="d-amount">Ahorro mensual</Label>
                  <InputWithUnit id="d-amount" unit="€" defaultValue="25" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="d-invalid">Tipo de interés</Label>
                  <InputWithUnit
                    id="d-invalid"
                    unit="%"
                    defaultValue="-3"
                    aria-invalid
                    aria-describedby="d-invalid-msg"
                  />
                  <p id="d-invalid-msg" className="text-sm text-danger">
                    Introduce un valor entre 0 y 20.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="d-disabled">Campo deshabilitado</Label>
                  <Input id="d-disabled" disabled defaultValue="No editable" />
                </div>
              </div>
              <SliderDemo />
            </div>
          </DesignSection>

          <DesignSection id="insignias" title="Insignias">
            <div className="flex flex-col gap-6">
              <Specimen label="Variantes">
                <Badge>Básico</Badge>
                <Badge variant="outline">6 lecciones</Badge>
                <Badge variant="brand">En curso</Badge>
                <Badge variant="success">
                  <Check aria-hidden />
                  Completado
                </Badge>
                <Badge variant="amber">
                  <Trophy aria-hidden />
                  Certificado
                </Badge>
                <Badge variant="danger">Suspendido</Badge>
                <Badge variant="outline">
                  <Lock aria-hidden />
                  Próximamente
                </Badge>
              </Specimen>
              <Specimen label="Racha">
                <StreakBadge days={0} />
                <StreakBadge days={1} />
                <StreakBadge days={12} />
              </Specimen>
            </div>
          </DesignSection>

          <DesignSection
            id="progreso"
            title="Progreso"
            description="Anillos y barras animados. Usa los botones para ver la transición."
          >
            <ProgressDemo />
          </DesignSection>

          <DesignSection
            id="dato-clave"
            title="Dato clave"
            description="El sello de la marca: una cifra grande en Geist Mono con cifras tabulares, la unidad en sans y una línea de contexto. Uno por pantalla, como mucho."
          >
            <div className="grid gap-12 lg:grid-cols-2">
              <KeyFigure
                value={75}
                unit="horas"
                context="es lo que cuesta un móvil de 600 € si cobras 8 € netos por hora. Casi dos semanas de trabajo a jornada completa."
              />
              <KeyFigure
                value={156}
                unit="€ al año"
                context="suma una suscripción de 13 € al mes. Los gastos pequeños y repetidos son los que menos se notan."
              />
            </div>
          </DesignSection>

          <DesignSection
            id="tarjetas"
            title="Tarjetas y cifras"
            description="Tarjetas planas con borde fino, solo cuando agrupan algo navegable."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card interactive>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="brand">En curso</Badge>
                    <Badge variant="outline">Básico</Badge>
                  </div>
                  <CardTitle className="mt-2">
                    <a href="#tarjetas" className="outline-none after:absolute after:inset-0">
                      Fundamentos del dinero
                    </a>
                  </CardTitle>
                  <CardDescription>
                    Horas de trabajo, inflación, ahorro y tu primer presupuesto.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-fg-subtle">
                    <span>6 lecciones · 40 min</span>
                    <span className="font-mono tabular">33 %</span>
                  </div>
                  <Progress value={2 / 6} label="Progreso de Fundamentos del dinero" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Lock aria-hidden />
                      Próximamente
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-fg-muted">Bancos y pagos</CardTitle>
                  <CardDescription>Cuentas, débito y crédito, Bizum y comisiones.</CardDescription>
                </CardHeader>
                <CardFooter className="mt-5 text-sm text-fg-subtle">
                  5 lecciones · 35 min
                </CardFooter>
              </Card>
              <Card className="md:col-span-2 xl:col-span-1">
                <CardContent>
                  <dl className="grid grid-cols-2 gap-6">
                    <Stat label="Lecciones" value="8" hint="de 11" />
                    <Stat label="Racha" value="12" hint="días seguidos" />
                    <Stat label="Aciertos" value="86" unit="%" />
                    <Stat label="Tiempo" value="54" unit="min" />
                  </dl>
                </CardContent>
              </Card>
            </div>
          </DesignSection>

          <DesignSection id="avisos" title="Avisos">
            <div className="grid max-w-3xl gap-3">
              <Callout tone="info" title="Contenido educativo">
                Monedo explica cómo funciona el dinero. No es asesoramiento financiero ni recomienda
                productos concretos.
              </Callout>
              <Callout tone="tip" title="Reto práctico">
                Apunta durante una semana todo lo que gastas, aunque sea un euro.
              </Callout>
              <Callout tone="warning" title="Rentabilidad no garantizada">
                Las inversiones pueden subir y bajar. Las rentabilidades pasadas no garantizan las
                futuras.
              </Callout>
              <Callout tone="success" title="Lección completada">
                Has terminado “El dinero es tiempo”.
              </Callout>
              <Callout tone="danger" title="No has llegado al 70 %">
                Repasa las lecciones y vuelve a intentarlo.
              </Callout>
            </div>
          </DesignSection>

          <DesignSection
            id="preguntas"
            title="Preguntas"
            description="Opción múltiple con feedback inmediato y explicación. Se navega con las flechas del teclado."
          >
            <QuizDemo />
          </DesignSection>

          <DesignSection id="navegacion" title="Pestañas, acordeón, diálogo y tooltip">
            <div className="grid gap-12 lg:grid-cols-2">
              <Tabs defaultValue="mensual">
                <TabsList aria-label="Periodo">
                  <TabsTrigger value="mensual">Mensual</TabsTrigger>
                  <TabsTrigger value="anual">Anual</TabsTrigger>
                  <TabsTrigger value="total" disabled>
                    Total
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="mensual">
                  <p className="text-base text-fg-muted">
                    Ahorras <Money value={25} decimals={false} className="text-fg" /> al mes.
                  </p>
                </TabsContent>
                <TabsContent value="anual">
                  <p className="text-base text-fg-muted">
                    Ahorras <Money value={300} decimals={false} className="text-fg" /> al año.
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap items-start gap-3">
                <DialogDemo />
                <Tooltip content="Las cifras son orientativas">
                  <Button variant="ghost">Pasa el cursor o enfoca</Button>
                </Tooltip>
                <span className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
                  <Kbd>Tab</Kbd> <Kbd>Enter</Kbd> <Kbd>Esc</Kbd>
                </span>
              </div>

              <Accordion type="single" collapsible className="lg:col-span-2">
                <AccordionItem value="1">
                  <AccordionTrigger>¿Monedo me dice en qué invertir?</AccordionTrigger>
                  <AccordionContent>
                    No. Monedo es educación: explica conceptos para que entiendas cómo funciona el
                    dinero, pero nunca recomienda productos, entidades ni decisiones personales de
                    inversión.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger>¿Necesito crear una cuenta?</AccordionTrigger>
                  <AccordionContent>
                    No. Tu progreso se guarda solo en este navegador y no recogemos datos
                    personales.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DesignSection>

          <DesignSection
            id="iconos"
            title="Iconos"
            description="Lucide, trazo de 1,75 a 2 px, tamaño 16 o 20 px. Siempre con texto o etiqueta accesible."
          >
            <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {icons.map(([Icon, label]) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-md py-3 text-fg-muted"
                >
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  <span className="text-xs">{label}</span>
                </li>
              ))}
            </ul>
          </DesignSection>

          <DesignSection
            id="movimiento"
            title="Movimiento"
            description="Transiciones cortas con salida suave. Con «reducir movimiento» activado en el sistema, todas se desactivan."
          >
            <dl className="grid gap-6 sm:grid-cols-3">
              {[
                ["fast · 120 ms", "Hover, color y bordes"],
                ["base · 200 ms", "Entrada de elementos y feedback"],
                ["slow · 320 ms", "Paneles, progreso y pasos de lección"],
              ].map(([name, use]) => (
                <div key={name} className="flex flex-col gap-1">
                  <dt className="font-mono text-sm">{name}</dt>
                  <dd className="text-base text-fg-muted">{use}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-mono text-xs text-fg-subtle">
              ease-out · cubic-bezier(0.22, 1, 0.36, 1)
            </p>
          </DesignSection>

          <DesignSection
            id="lector"
            title="Lector de lecciones (prototipo)"
            description="Temario plegable en escritorio, un paso por pantalla, progreso arriba y navegación con flechas. Enfoca el contenido y usa ← →."
          >
            <LessonLayoutDemo />
          </DesignSection>

          <DesignSection
            id="graficos"
            title="Gráficos, esqueletos y carga"
            description="Sin ilustraciones ni emojis: geometría y datos. El campo de puntos dibuja un crecimiento compuesto real."
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <span className="inline-flex items-center gap-2 text-sm text-fg-muted">
                  <Spinner /> Cargando…
                </span>
              </div>
              <GrowthField />
            </div>
          </DesignSection>
        </div>
      </div>
    </Container>
  );
}
