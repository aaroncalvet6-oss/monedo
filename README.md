# Monedo

Plataforma de cursos cortos de educación financiera para jóvenes de 14 a 18 años en España.
Contenido educativo: no es asesoramiento financiero.

Publicada en **https://aaroncalvet6-oss.github.io/monedo/** (GitHub Pages, export estático de Next.js).

```bash
npm install
npm run dev       # http://localhost:3000/monedo/  (sistema de diseño en /monedo/design/, solo en desarrollo)
npm run check     # lint, typecheck, formato y tests unitarios
npm run build     # export estático a out/
npm run preview   # sirve out/ como GitHub Pages: http://localhost:3100/monedo/
npm run test:e2e  # Playwright contra el export estático
```

Cada push a `main` verifica y publica con `.github/workflows/deploy.yml`. Convenciones del
proyecto en [`CLAUDE.md`](./CLAUDE.md) y temario en [`docs/temario.md`](./docs/temario.md).
