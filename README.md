# Monedo

Cursos cortos y gratuitos de educación financiera para jóvenes de 14 a 18 años en España: lo que
cuesta de verdad lo que compras, cómo ahorrar, tu primer sueldo y tu primera declaración de la
renta. Lecciones de 5 a 8 minutos con ejemplos reales en euros, herramientas para hacer tus
propias cuentas, una evaluación final por curso y un certificado de finalización.

**https://aaroncalvet6-oss.github.io/monedo/**

- **Educación, no asesoramiento**: no recomienda productos, entidades ni inversiones.
- **Datos verificados**: cada dato legal o fiscal sale de una fuente oficial (BOE, Agencia
  Tributaria…) y se apunta con enlace y fecha en [`docs/fuentes.md`](./docs/fuentes.md). Lo que no
  está verificado no entra en las lecciones. Se explica en la página pública
  [Fuentes y metodología](https://aaroncalvet6-oss.github.io/monedo/fuentes/).
- **Sin datos personales**: sin cuentas, sin analítica, sin cookies de terceros ni recursos
  externos. El progreso y el nombre del certificado se guardan solo en el navegador.

## Qué hay dentro

| Ruta                               | Qué es                                                           |
| ---------------------------------- | ---------------------------------------------------------------- |
| `/`                                | Portada: continuar, rutas por área, herramientas, por qué fiarse |
| `/cursos/<curso>/`                 | Ficha del curso, temario, evaluación y certificado               |
| `/cursos/<curso>/<lección>/`       | Lector de lecciones: una sección por pantalla                    |
| `/cursos/<curso>/evaluacion/`      | Evaluación final (preguntas al azar de un banco)                 |
| `/cursos/<curso>/certificado/`     | Certificado de finalización (PNG o PDF)                          |
| `/herramientas/<herramienta>/`     | Horas de trabajo, presupuesto, meta de ahorro, interés compuesto |
| `/fuentes/`, `/legal/`, `/perfil/` | Metodología, privacidad y uso educativo, progreso local          |

Next.js 16 (App Router, export estático) · React 19 · TypeScript · Tailwind CSS 4 · Zod (contenido,
solo en el build) · Zustand · Recharts · Vitest · Playwright. Las convenciones del proyecto
(arquitectura, sistema de diseño y reglas de contenido) están en [`CLAUDE.md`](./CLAUDE.md); el
temario y la hoja de ruta, en [`docs/temario.md`](./docs/temario.md).

## Ejecutarlo en local

Requiere Node 22 o superior.

```bash
npm install
npm run dev        # http://localhost:3000/monedo/  (sistema de diseño en /monedo/design/)
```

| Comando            | Qué hace                                                         |
| ------------------ | ---------------------------------------------------------------- |
| `npm run check`    | Lint, tipos, formato y tests unitarios (Vitest)                  |
| `npm run build`    | Export estático a `out/` (base `/monedo`, una carpeta por ruta)  |
| `npm run preview`  | Sirve `out/` como GitHub Pages en http://localhost:3100/monedo/  |
| `npm run test:e2e` | Playwright contra el export (hace el build y levanta el preview) |
| `npm run format`   | Prettier, con orden de clases de Tailwind                        |

Para revisar un curso en borrador (`draft: true`), compila con `NEXT_PUBLIC_SHOW_DRAFTS=1 npm run
build`. Nunca se usa en el despliegue (lo impide un test).

### Lighthouse

Con el export servido (`npm run build && npm run preview`), en móvil:

```bash
npx lighthouse@12 http://localhost:3100/monedo/ --view \
  --only-categories=performance,accessibility,best-practices,seo
```

El preview comprime con gzip, como GitHub Pages, para que las cifras sean comparables. Las últimas
mediciones están en [`docs/lighthouse.md`](./docs/lighthouse.md).

## Contenido

- **Cursos y lecciones** son datos TypeScript en `src/content/`, validados con Zod en el build: si
  una lección no cumple el esquema (objetivo, ideas clave, preguntas, reto, párrafos cortos…), el
  build falla. Un curso solo se publica cuando todas sus lecciones están escritas.
- **Fuentes**: los enlaces de las lecciones solo pueden ir a dominios oficiales (`OFFICIAL_DOMAINS`
  en `src/content/schema.ts`).
- **Imágenes para redes** (Open Graph, en `public/og/`): `node scripts/generate-og-images.mjs`
  al añadir un curso. Un test avisa si falta la de algún curso publicado.
- **Fuentes tipográficas**: Geist, autoalojada y recortada a los caracteres del español con
  `python3 scripts/subset-fonts.py` (requiere `pip install fonttools brotli`).

## Cómo se publica

Monedo es un sitio estático en GitHub Pages, sin servidor.

1. Cada push a `main` ejecuta [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml):
   `npm run check`, `npm run build`, los tests e2e contra el export y, si todo pasa, publica `out/`
   en GitHub Pages. En pull requests solo verifica.
2. En el repositorio, **Settings → Pages → Source** debe ser «GitHub Actions».
3. `next.config.ts` fija `output: "export"`, `basePath: "/monedo"` y `trailingSlash: true`. Si
   cambia la dirección del sitio, actualiza también `SITE_ORIGIN` en `src/lib/site.ts` (URLs
   canónicas, Open Graph y `sitemap.xml`).

El mapa del sitio se publica en `/monedo/sitemap.xml`. Un `robots.txt` solo vale en la raíz del
dominio, que en una web de proyecto de GitHub Pages no es de este repositorio: para Google, envía
el mapa del sitio desde Search Console.

## Contacto

El correo de contacto del proyecto se configura en `CONTACT_EMAIL` (`src/lib/site.ts`); mientras
esté vacío, la página legal no muestra la sección de contacto.
