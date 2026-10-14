@AGENTS.md

# Monedo — convenciones del proyecto

Plataforma web de cursos cortos de educación financiera para jóvenes de 14 a 18 años en España.
Repositorio `aaroncalvet6-oss/monedo`. Se publica como sitio estático en GitHub Pages en
`https://aaroncalvet6-oss.github.io/monedo/` (el origen `<cuenta>.github.io` lo comparten todos
los proyectos de Pages de la cuenta: ver «Almacenamiento»).

## Idioma

- Código, nombres, comentarios y commits: **inglés**.
- Interfaz y contenido: **español de España**, euros, ejemplos reales del contexto español.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 estricto · Tailwind CSS 4 · componentes
estilo shadcn/ui sobre `radix-ui` · Motion (`motion/react`) · Lucide · Recharts · Zustand · Zod ·
Vitest + Testing Library · Playwright · ESLint 9 (flat) + Prettier · fuentes Geist autoalojadas (`geist`).

Next 16 cambia APIs respecto a versiones anteriores: consulta `node_modules/next/dist/docs/` antes de
usar una API nueva (p. ej. `params` es asíncrono, `LayoutProps`/`PageProps` son globales generados).

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # export estático a out/ (basePath /monedo, una carpeta por ruta)
npm run preview      # sirve out/ como GitHub Pages en http://localhost:3100/monedo/
npm run lint         # ESLint
npm run typecheck    # next typegen + tsc --noEmit
npm run format       # Prettier (con orden de clases de Tailwind)
npm run test         # Vitest (unitarios)
npm run test:e2e     # Playwright contra el export estático (build + preview en :3100)
npm run check        # lint + typecheck + format:check + test  ← ejecutar al cerrar cada fase
```

En el contenedor cloud: `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run test:e2e`.

## Estructura

```
src/
  app/                    rutas; solo composición, sin lógica de negocio
    (site)/               páginas con cabecera, pie y navegación inferior
    (site)/design/        sistema de diseño, solo en `npm run dev` (page.dev.tsx; no se publica)
    globals.css           tokens de diseño (fuente de verdad del CSS)
  components/ui/          primitivas (button, card, badge, input, slider, tabs, progress-ring…)
  components/layout/      cabecera, navegación inferior, pie, contenedor, selector de tema
  components/graphics/    logotipo y SVG geométricos de marca
  features/{courses,lessons,progress,tools,certificates}/   código por funcionalidad
  features/tutor/         TutorProvider + ScriptedTutor (de dónde sale el texto de cada lección)
  content/                cursos y lecciones como datos TS validados con Zod
  lib/finance/            funciones financieras puras + tests
  lib/progress/           ProgressRepository + LocalProgressRepository
  lib/design/             espejo TS de los tokens + utilidades de contraste
  lib/format.ts           formateo es-ES (€, %, fechas, minutos)
e2e/                      tests de Playwright
```

Reglas de arquitectura:

- **Progreso** solo a través de la interfaz `ProgressRepository` (asíncrona). Nunca `localStorage`
  directamente desde componentes o stores. En v2 llegará `SupabaseProgressRepository`.
- **Contenido** = datos. Añadir un curso es añadir archivos en `src/content/`; si no valida con Zod,
  el build falla.
- **Lógica financiera** solo en `src/lib/finance/`, funciones puras con tests de casos límite.
- **Herramientas**: registro en `features/tools/tools.ts` (`TOOL_IDS` en `content/schema.ts`). Cada
  una enlaza a la lección que la explica, y esa lección la enlaza con el campo `tool` de un bloque
  `text` (lo vigila `tools.test.ts`). Valores de ejemplo cargados, resultado explicado en una frase
  y nada se guarda: el estado vive solo en la página.
- **Nada a medio hacer a la vista**: un curso solo se publica (catálogo, inicio, ficha y páginas de
  lección) cuando **todas** sus lecciones están escritas y sus datos verificados (`isPublished` en
  `content/index.ts`). Los demás aparecen, como mucho, por su título en «Próximos cursos» al final del
  catálogo. Un curso con `draft: true` está escrito pero pendiente de revisión editorial: nunca se
  publica; para revisarlo, compila en local con `NEXT_PUBLIC_SHOW_DRAFTS=1 npm run build` (un test
  impide usarlo en el despliegue). Nada de «Pronto», «Próximamente» ni herramientas sin terminar
  (`features/tools/tools.ts` lista solo las publicadas). Las lecciones no remiten a cursos sin
  publicar.
- **Web pública solo para el alumno**: nada de textos sobre cómo está hecha la web (tecnologías,
  sistema de diseño, notas para desarrolladores, «en construcción»). Lo vigila `e2e/shell.spec.ts`.
  Las páginas internas se nombran `page.dev.tsx`: `next.config.ts` solo las reconoce en `next dev`,
  así que no entran en el build, la navegación ni un futuro sitemap.
- **Privacidad**: sin analítica, sin cookies de terceros, sin recursos externos (fuentes incluidas).
- **Almacenamiento**: todas las claves de `localStorage` llevan el prefijo `monedo:` y se definen
  solo en `src/lib/storage-keys.ts` (lo vigila un test). El origen `<cuenta>.github.io` se comparte
  con otros proyectos de Pages: nunca uses `localStorage.clear()`, borra solo las claves `monedo:`.

## Despliegue (GitHub Pages)

- `next.config.ts`: `output: "export"`, `basePath: "/monedo"`, `trailingSlash: true`,
  `images.unoptimized`. Todas las rutas dinámicas usan `generateStaticParams` con
  `dynamicParams = false`; nada de cookies, headers, redirects, rewrites ni route handlers dinámicos.
- `next/link` y los iconos de metadata añaden el basePath solos. Para `<a href>` a archivos o
  `<img src>` usa `asset("/ruta")` de `src/lib/base-path.ts`.
- `.github/workflows/deploy.yml`: en cada push a `main` ejecuta check, export, e2e contra el export
  y publica `out/` en Pages. En pull requests solo verifica. Requiere Settings → Pages → Source =
  «GitHub Actions».
  El nombre del certificado solo se guarda en local.
- Con `exactOptionalPropertyTypes`, las props opcionales que puedan recibir `undefined` se tipan
  como `prop?: T | undefined`.

## Motor de cursos

- **Contenido** (`src/content/`): `schema.ts` define cursos, lecciones y una unión discriminada de
  bloques (`objective`, `text`, `example`, `key-figure`, `interactive`, `decision`, `key-ideas`,
  `quiz`, `challenge`). Reglas en `superRefine`: ids únicos, objetivo primero, un único quiz de 3–5
  preguntas con la respuesta correcta entre las opciones, exactamente 3 ideas clave y un reto.
  `index.ts` valida todo al cargar y comprueba que el título/resumen/minutos de cada lección
  coinciden con el temario del curso.
- **Añadir una lección**: crea `src/content/courses/<curso>/<leccion>.ts` (`satisfies LessonInput`),
  regístrala en `lessonContent` de `src/content/index.ts` y listo: se genera su página estática.
- **Widgets interactivos**: el contenido los referencia por id (`config.widget`) con props
  validadas por Zod; se registran en `features/lessons/components/section-cards.tsx`.
- **Progreso**: `lib/progress/` (tipos, funciones puras y repositorios) + store Zustand en
  `features/progress/` inyectado con `<ProgressProvider>`. Se guarda en cada paso (paso actual,
  pasos completados, respuestas bloqueadas tras comprobar, decisiones, días de actividad).
  Cualquier repositorio nuevo debe pasar `describeProgressRepositoryContract`.
- **Lector** (`features/lessons/components/lesson-reader.tsx`): formato de formación, una sección
  por pantalla y una pregunta por pantalla: etiqueta, título, párrafos cortos de tú, ejemplo con
  cifras, dato clave, interactivo cuando aporta, ideas clave, preguntas con «Comprobar» y
  explicación, y reto. Preguntas y decisiones bloquean «Continuar» hasta responder; retoma donde lo
  dejaste; ← → en escritorio; el foco va al título de cada paso nuevo; barra de acción inferior con
  zona segura en móvil. Sin personaje.

## Evaluación final y certificado

- **Banco de preguntas** en `src/content/courses/<curso>/evaluacion.ts` (`assessmentSchema`): el
  banco es un 50 % mayor que cada intento; cada pregunta indica la lección que repasar. Situaciones
  nuevas (no las de las lecciones) y solo datos verificados. Las opciones se barajan en cada
  intento: ninguna opción ni explicación puede citar una letra («la B…»). Lo vigila
  `content/assessment.test.ts`. Un curso publicado necesita su evaluación.
- **Intentos** (`lib/assessment/attempt.ts`): preguntas y opciones al azar, sin corrección hasta el
  final; al terminar se explica cada fallo con enlace a su lección. El resultado (mejor nota, número
  de intentos y fecha del primer aprobado) se guarda con `ProgressRepository.saveAssessment`.
- **Certificado**: se llama siempre «Certificado de finalización», nunca «título» ni «acreditación»,
  y dice que no tiene validez académica oficial. Solo aparece con la evaluación aprobada. El nombre
  lo escribe el alumno y solo se guarda en su navegador (`monedo:certificate-name`,
  `lib/certificates/certificate-name.ts`). Se dibuja en un canvas y se descarga como PNG o PDF
  (`lib/pdf/image-pdf.ts`, sin dependencias); «Compartir» solo si el navegador lo permite.

## Página de inicio y navegación

- **Inicio** (`app/(site)/page.tsx`) es el centro: propuesta de valor con botón principal
  (Empezar o Continuar), «Continúa donde lo dejaste» (solo con progreso, `lib/progress/continue.ts`),
  rutas de aprendizaje por área con su progreso, herramientas, cómo funciona y por qué fiarse, y
  sección para familias y centros. `/aprender` ya no existe: redirige a inicio.
- **Navegación**: Inicio, Cursos y Herramientas (barra inferior en móvil, cabecera en escritorio);
  Perfil es un icono en la cabecera.
- **Áreas** (`AREAS` en `content/schema.ts`): Tu dinero hoy · Trabajo e ingresos · Hacer crecer tu
  dinero · Protégete y entiende el mundo. Cada curso declara su `area`.

## Tutor (texto de las lecciones)

- **Interfaz** `TutorProvider` (`features/tutor/types.ts`): `open(step)` devuelve la sección de un
  paso (etiqueta, título, párrafos, tarjeta y opciones) y `react(step, optionId)` el feedback de una
  respuesta o decisión. Es asíncrona a propósito: el lector solo habla con esta interfaz.
- **`ScriptedTutor`** (la implementación actual): todo sale de `src/content`, nada se genera en
  tiempo real. Usa el texto de cada bloque; el campo opcional `tutor` de la lección permite, por paso,
  párrafos `say` (en lugar de los del bloque o antes de la tarjeta) y `after` (tras la tarjeta).
- **Párrafos cortos**: máximo 220 caracteres; el esquema lo valida en todos los textos que se
  muestran como párrafo. Frases cortas y de tú.
- Nunca se usa la palabra «IA» en la interfaz ni en el contenido (lo vigila un test).

## Tutor con modelo (futuro)

Una versión de las lecciones que responda con un modelo de IA real implementaría
`TutorProvider` sin tocar el lector. Antes de publicarla hace falta, como mínimo:

- **Backend propio** que guarde la clave de la API: nunca en el navegador ni en el repositorio. El
  export estático de GitHub Pages no basta; haría falta una función serverless o un servidor.
- **Respuestas limitadas al contenido de los cursos**: el backend envía al modelo solo la lección
  actual y sus reglas; si la pregunta se sale del temario, lo dice y vuelve a la lección.
- **Sin asesoramiento personalizado**: nada de recomendar productos, entidades, inversiones ni
  decisiones personales (mismas «Reglas de contenido»), con filtro de salida además del prompt.
- **Aviso claro de que es una IA** en el momento en que se usa el modelo (las partes guionizadas
  siguen sin llamarse IA). Revisar los requisitos legales para menores antes de lanzarlo.
- **Sin guardar conversaciones**: ni en el backend ni en registros; solo métricas agregadas sin
  texto del alumno.
- **Límite de gasto**: tope mensual en el proveedor, límite de peticiones por usuario y por IP,
  respuestas cortas (máximo de tokens) y vuelta automática a `ScriptedTutor` si se supera.
- Los e2e y los tests de contenido siguen usando `ScriptedTutor` (determinista).

## Sistema de diseño

Referencia viva: `/design` (solo en desarrollo: `npm run dev` → `/monedo/design`). Listón: Linear,
Vercel, Stripe, Brilliant.

- **Solo tokens semánticos.** La paleta por defecto de Tailwind está desactivada (`--color-*: initial`).
  Usa `bg-surface`, `text-fg-muted`, `border-border`, `bg-brand`, `text-brand-text`, etc.
- Si cambias un color, cámbialo en `globals.css` (`:root`, `[data-theme="dark"]` y el bloque
  `prefers-color-scheme`) **y** en `src/lib/design/tokens.ts`. El test de tokens verifica que
  coinciden y que todos los pares cumplen WCAG AA (texto ≥ 4,5:1, UI ≥ 3:1).
- **Color**: neutros zinc fríos; un solo color de marca (esmeralda profundo); **ámbar solo para
  logros y rachas**; `success`/`danger` para acierto y error.
- **Tema**: sigue al sistema; el selector guarda `light`/`dark` en `localStorage` (`monedo:theme`)
  y un script inline lo aplica antes de pintar. Variante `dark:` disponible pero preferir tokens.
  Los tokens usan `@theme inline`, así que `data-theme` también funciona en un contenedor.
- **Tipografía**: Geist Sans para todo; **números y euros con `<Money>`, `<Num>`, `<Percent>`
  o `font-mono tabular`**. Escala: xs 12 · sm 14 · base 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 ·
  4xl 38 · 5xl 48 · 6xl 60. Texto de lección con la utilidad `measure` (68ch) y `leading-7/8`.
  - **12 px (`text-xs`) solo para etiquetas e insignias.** Nada por debajo de 12 px (lo vigila
    `typography.test.ts`).
  - **Texto de lectura ≥ 16 px** (párrafos, descripciones, avisos, diálogos, lecciones: `text-lg`).
    14 px solo para botones, navegación y metadatos de escritorio.
  - **Campos de formulario a 16 px en móvil** (`text-base md:text-sm`) para evitar el zoom de iOS.
- **Dato clave**: el sello de la marca. Usa `<KeyFigure>`: cifra grande en Geist Mono tabular,
  unidad en sans y una línea de contexto. Como mucho uno por pantalla.
- **Logotipo**: `<Logo>` (símbolo + nombre en trazados) y `<LogoMark small>` por debajo de 20 px.
  Archivos en `public/brand/`; el nombre se regenera con `scripts/generate-wordmark.py`.
- **Forma**: bordes 1 px; radios `xs 4 · sm 6 · md 10 · lg 14`; sombra solo en capas
  flotantes (`shadow-overlay`). Jerarquía con espacio y tipografía, no con cajas.
- **Estados** obligatorios en todo lo interactivo: hover, `focus-visible`, disabled y loading.
  El **anillo de foco** es de 2 px con el color de marca (`outline-focus`: esmeralda en claro,
  esmeralda claro en oscuro).
- **Zonas táctiles ≥ 44×44 px en móvil.** Los botones y controles crecen por debajo de `md`
  (`h-11 md:h-10`); si algo debe seguir siendo pequeño, usa la utilidad `touch-hit`. Lo comprueba
  `e2e/accessibility.spec.ts`.
- **Movimiento**: `--duration-fast/base/slow` (120/200/320 ms) y `--ease-out`. Motion va envuelto en
  `MotionConfig reducedMotion="user"` y hay un fallback CSS para `prefers-reduced-motion`.
- **Mobile-first**: navegación inferior fija en móvil, cabecera en `md+`. Sin scroll horizontal a 390 px.
- **Prohibido**: degradados morados o azules, emojis, **mascotas o personajes** («Monedo» es solo
  la marca), ilustraciones de stock, todo centrado, sombras en todas las tarjetas, el aspecto por
  defecto de shadcn.

Componentes: el registro de shadcn no es accesible desde el contenedor cloud, así que los componentes
se escriben a mano con el mismo patrón (código propio + `radix-ui` + `cva` + `cn`). `components.json`
está listo por si la CLI se puede usar en local.

## Reglas de contenido

- Frases cortas, segunda persona, situaciones de un adolescente en España, cifras en euros.
- Tono "modo formación": serio y claro, nunca infantil. Sin emojis.
- **Educación, no asesoramiento**: nunca recomendar productos, entidades, activos concretos ni
  decisiones personales de inversión. Ninguna marca de banco, bróker ni producto financiero.
- Toda mención a rentabilidad aclara que **no está garantizada y que las inversiones pueden bajar**.
- **Nada de cifras que cambian cada año** (límites para declarar, tramos del IRPF, porcentajes de
  cotización, fechas de campaña): explica el concepto y enlaza a la fuente oficial con el campo
  `sources` de los bloques `text` y `key-figure`. El esquema solo acepta dominios de
  `OFFICIAL_DOMAINS`, así que una fuente secundaria nunca llega al alumno.
- **Fuentes**: cada dato legal o fiscal se verifica en una fuente oficial y se apunta en
  [`docs/fuentes.md`](./docs/fuentes.md) con enlace exacto y fecha de consulta. Fuentes oficiales
  válidas: Agencia Tributaria, Seguridad Social, BOE, SEPE, Ministerio de Trabajo, INE, Banco de
  España (y su Portal del Cliente Bancario), CNMV, finanzasparatodos.es, Fondo de Garantía de
  Depósitos, Ministerio de Consumo, CNMC, Ministerio de Educación, BCE, INCIBE, AEPD, Policía
  Nacional y Guardia Civil. Una fuente secundaria solo vale si cita el texto legal literalmente;
  queda marcada «secundaria» y se sustituye por la oficial antes de publicar la lección. Sin fila
  verificada, el dato no entra en una lección.
- **No inventar cifras legales o fiscales.** Todo dato sobre IRPF, Seguridad Social, salario mínimo,
  umbrales para declarar, etc. lleva `// TODO(verify) #n` (su fila en `docs/fuentes.md`) hasta que
  se verifica; entonces `// fuente #n` con el enlace oficial.

## TODO(verify) — datos pendientes de verificar con fuente oficial

_Lista completa en [`docs/fuentes.md`](./docs/fuentes.md): 59 datos, 16 verificados (9 en web
oficial, 6 en reproducción literal del texto legal con enlace al BOE y 1 en mutua colaboradora con la
Seguridad Social) y 43 sin verificar (35 de ellos, filas 24 a 58, son de los cursos de la hoja de
ruta). En el temario cada dato lleva
`✓ fuente #n` o `TODO(verify) #n`. Lo que está sin verificar no entra en las lecciones._

## Fases

1. ✅ Base: proyecto, tokens, componentes, `/design`, layout, navegación y modo oscuro.
2. ✅ Motor de cursos: esquema Zod, `ProgressRepository`, lector, `TutorProvider` + `ScriptedTutor`.
3. Contenido. ✅ Curso 1 completo (6 lecciones). ✅ Curso 2 publicado (5 lecciones), revisado y con
   todas sus fuentes verificadas. ✅ Evaluación final y certificado de finalización de los dos cursos.
   Hoja de ruta del catálogo (13 cursos en 4 áreas) en `docs/temario.md`.
4. ✅ Inicio como centro (con el panel), catálogo por áreas, fichas de curso y perfil. ✅ Herramientas
   (horas de trabajo, presupuesto, meta de ahorro e interés compuesto), cada una en
   `/herramientas/<id>` y enlazada con su lección en los dos sentidos.
5. Landing, legal, SEO, tests e2e, Lighthouse y README de despliegue.

Al cerrar cada fase: `npm run check` + `npm run build` + e2e, commit y resumen.

## Decisiones de contenido (aprobadas)

- Preguntas con 4 opciones solo si las 4 son creíbles; si no, 3.
- Un solo porcentaje de ahorro de ejemplo en todo Monedo: **el 20 %** (lecciones, preguntas,
  evaluaciones y herramientas, incluida Meta de ahorro).
- Se enseñan las palabras reales (coste de oportunidad, urgencia, escasez…), explicadas con
  sencillez.
- Con la paga, el presupuesto se hace en tres partes (lo que pagas tú, ahorro y gasto libre). La
  regla 50/30/20 es para el primer sueldo y se presenta como puente al curso 2.
- Evaluación final: curso 1 con 10 preguntas (aprobado 7/10) y curso 2 con 8 (aprobado 6/8).
  Banco de preguntas un 50 % más grande (15 y 12), elegidas al azar en cada intento; se puede
  repetir y al terminar se explica cada fallo.

## Decisiones registradas

- Nació en la carpeta `monedo/` de `calculofifo.github.io` y se movió a este repositorio con
  `git subtree split` (historial conservado).
- GitHub Pages con export estático en lugar de Vercel: sin servidor y sin cuentas extra. Los e2e
  se ejecutan contra `out/` servido por `scripts/serve-static.mjs`, que imita a Pages.
- TypeScript 5 y ESLint 9: son las versiones que fija `create-next-app` para Next 16 (TS 7 y
  ESLint 10 aún no tienen soporte oficial del plugin de Next).
- `@types/node` 22 para casar con Node 22 (`engines`) y con las peer deps de Vitest.
- Separador de miles siempre activo en euros (`1.234 €`), aunque es-ES lo omite por defecto en
  cifras de 4 dígitos: las cifras se leen y alinean igual en toda la interfaz.
- Tema sin dependencias (`next-themes` no hace falta): script inline + `useSyncExternalStore`.
