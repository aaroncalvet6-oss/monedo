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
  components/graphics/    logotipo, SVG geométricos de marca y Monedo (el personaje)
  features/{courses,lessons,progress,tools,certificates}/   código por funcionalidad
  features/tutor/         TutorProvider + ScriptedTutor (lo que dice Monedo)
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
  validadas por Zod; se registran en `features/lessons/components/conversation/tutor-cards.tsx`.
- **Progreso**: `lib/progress/` (tipos, funciones puras y repositorios) + store Zustand en
  `features/progress/` inyectado con `<ProgressProvider>`. Se guarda en cada paso (paso actual,
  pasos completados, respuestas bloqueadas tras comprobar, decisiones, días de actividad).
  Cualquier repositorio nuevo debe pasar `describeProgressRepositoryContract`.
- **Lector** (`features/lessons/components/lesson-reader.tsx`): la lección es una **conversación
  con Monedo**. Monedo explica en burbujas cortas y muestra tarjetas (ejemplo, dato clave,
  calculadora, ideas clave, reto); el alumno avanza tocando su respuesta en la barra inferior
  o eligiendo una opción, y Monedo reacciona con su expresión (celebrando si acierta, «uy» si
  falla, con la respuesta correcta y la explicación). El historial queda en pantalla; al volver
  se reconstruye y Monedo retoma en el paso guardado. → continúa en escritorio; el foco sigue a la
  conversación; `role="log"` anuncia los mensajes nuevos.
- **Móvil**: Monedo va en su propia columna, dentro del flujo (nunca flotando): no tapa el texto
  ni la barra de acción. Los e2e lo comprueban en cada paso de la lección 1.1.

## Tutor (Monedo en las lecciones)

- **Interfaz** `TutorProvider` (`features/tutor/types.ts`): `open(step)` devuelve lo que Monedo
  dice al abrir un paso (burbujas, tarjetas, expresión y lo que puede contestar el alumno) y
  `react(step, optionId)` su reacción a una respuesta o decisión. Es asíncrona a propósito. El
  lector solo habla con esta interfaz.
- **`ScriptedTutor`** (la implementación actual): todo sale de `src/content`, nada se genera en
  tiempo real. Cada lección tiene un campo `tutor` con el guion por paso (clave = id del bloque o de
  la pregunta): `expression`, `say` (burbujas), `after` (burbujas tras la tarjeta), `reply` (la
  respuesta del alumno para avanzar) y, en preguntas, `correct` / `wrong`. Lo que no esté en el
  guion usa el texto del propio bloque.
- **Burbujas cortas**: máximo 220 caracteres; el esquema lo valida también en los textos de los
  bloques que se usan como burbuja. Respuestas del alumno: máximo 40.
- **Nombre**: en la interfaz es «Monedo, tu guía». Nunca «IA» (lo vigila un test).
- **Añadir el guion a una lección**: escribe su `tutor` en el archivo de la lección; si falta, la
  lección funciona igual con el texto de los bloques y respuestas «Continuar».

## Tutor con modelo (futuro)

Una versión de Monedo que responda con un modelo de IA real implementaría `TutorProvider` sin
tocar el lector. Antes de publicarla hace falta, como mínimo:

- **Backend propio** que guarde la clave de la API: nunca en el navegador ni en el repositorio. El
  export estático de GitHub Pages no basta; haría falta una función serverless o un servidor.
- **Respuestas limitadas al contenido de los cursos**: el backend envía al modelo solo la lección
  actual y sus reglas; si la pregunta se sale del temario, Monedo lo dice y vuelve a la lección.
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
- **Prohibido**: degradados morados o azules, emojis, otras mascotas o personajes (Monedo es el
  único), ilustraciones de stock, todo centrado, sombras en todas las tarjetas, el aspecto por
  defecto de shadcn.

## Monedo, el personaje

Monedo es **el único personaje de la marca** y el guía de las lecciones. En la interfaz se presenta
como «Monedo, tu guía». Nunca uses la palabra «IA» para referirte a él.

- **Diseño**: moneda original con cara simple (ojos y boca), en los colores de marca. Sin cifras,
  símbolos de divisa, retratos ni relieves de monedas reales; no debe recordar a ninguna mascota
  existente. SVG en `components/graphics/monedo-character.tsx`, solo con tokens (`fill-brand`,
  `fill-brand-hover`, `stroke-brand-fg`…), así que funciona en claro y oscuro sin cambios.
- **Expresiones** (`monedo-expressions.ts`): `normal`, `explaining` (explicando), `thinking`
  (pensando), `celebrating` (celebrando) y `oops` («uy», respuesta incorrecta).
- **Movimiento**: parpadeo irregular cada 2,5–5,5 s y rebote suave con la boca en movimiento
  mientras `talking`. Todo se desactiva con «reducir movimiento» (`useReducedMotion` +
  `MotionConfig`). Nada que distraiga de la lectura.
- **Accesibilidad**: decorativo por defecto (`aria-hidden`), porque el texto de la burbuja lleva el
  significado; pasa `label` solo si aparece solo.
- **Voz**: cercano y con humor ligero, nunca infantil. Habla de tú, frases cortas, sin emojis ni
  exclamaciones en cadena. Reacciona sin juzgar («Uy, esa no era. Le pasa a cualquiera»). Mismas
  reglas de contenido que el resto: nunca recomienda productos ni decisiones personales.
- **Canto estriado**: rayitas finas en el borde de la cara y en el grosor, para que se reconozca
  como moneda a primera vista (sin cifras ni símbolos).
- **Referencia**: `/design/monedo` (solo en desarrollo). Capturas en `docs/screenshots/monedo/`
  (`npm run dev` y luego `node scripts/screenshots-monedo.mjs`) y del lector en
  `docs/screenshots/reader/`.

Componentes: el registro de shadcn no es accesible desde el contenedor cloud, así que los componentes
se escriben a mano con el mismo patrón (código propio + `radix-ui` + `cva` + `cn`). `components.json`
está listo por si la CLI se puede usar en local.

## Reglas de contenido

- Frases cortas, segunda persona, situaciones de un adolescente en España, cifras en euros.
- Tono "modo formación": serio y claro, nunca infantil. Sin emojis.
- **Educación, no asesoramiento**: nunca recomendar productos, entidades, activos concretos ni
  decisiones personales de inversión. Ninguna marca de banco, bróker ni producto financiero.
- Toda mención a rentabilidad aclara que **no está garantizada y que las inversiones pueden bajar**.
- **No inventar cifras legales o fiscales.** Todo dato sobre IRPF, Seguridad Social, salario mínimo,
  umbrales para declarar, etc. lleva `// TODO(verify): fuente oficial` con la fuente a consultar
  (AEAT, Seguridad Social, BOE) y se añade a la lista de abajo.

## TODO(verify) — datos pendientes de verificar con fuente oficial

_Lista completa (20 datos, todos del curso 2) en [`docs/temario.md`](./docs/temario.md#lista-de-todoverify--datos-pendientes-de-fuente-oficial). Se copiará aquí, con el archivo de cada uno, al escribir las lecciones en la fase 3._

| Archivo | Dato | Fuente a consultar |
| ------- | ---- | ------------------ |

## Fases

1. ✅ Base: proyecto, tokens, componentes, `/design`, layout, navegación y modo oscuro.
2. ✅ Motor de cursos: esquema Zod, `ProgressRepository`, lector con todos los bloques, lección 1.1.
   ✅ Monedo y lector en formato conversación (`TutorProvider` + `ScriptedTutor`), lección 1.1
   adaptada. Pendiente: probar la 1.1 con alumnos antes de escribir el resto.
3. Contenido: resto de cursos 1 y 2, evaluaciones y certificados.
4. Panel, catálogo, fichas de curso, perfil y herramientas.
5. Landing, legal, SEO, tests e2e, Lighthouse y README de despliegue.

Al cerrar cada fase: `npm run check` + `npm run build` + e2e, commit y resumen.

## Decisiones de contenido (aprobadas)

- Preguntas con 4 opciones solo si las 4 son creíbles; si no, 3.
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
