# Lighthouse

Lighthouse 12, perfil móvil por defecto (Moto G Power simulado, 4G lenta, CPU ×4), contra el
export servido con `npm run preview` (con gzip, como GitHub Pages). Cinco ejecuciones seguidas el
14/10/2026; la puntuación de rendimiento varía unos puntos entre ejecuciones, así que se anota el
rango y la mediana.

| Página                                                        | Rendimiento (mín.–máx., mediana) | Accesibilidad | Buenas prácticas | SEO |
| ------------------------------------------------------------- | -------------------------------- | ------------- | ---------------- | --- |
| Portada `/`                                                   | 98–99 (99)                       | 100           | 100              | 100 |
| Curso `/cursos/fundamentos-del-dinero/`                       | 95–98 (96)                       | 100           | 100              | 100 |
| Lección `/cursos/fundamentos-del-dinero/el-dinero-es-tiempo/` | 95–99 (97)                       | 100           | 100              | 100 |
| Herramienta `/herramientas/interes-compuesto/`                | 95–97 (96)                       | 100           | 100              | 100 |

Qué hizo falta para llegar (fase 5):

- **Zod fuera del navegador**: el progreso se valida con funciones propias (`lib/progress`); Zod
  solo valida el contenido en el build. Unos 400 KB menos de JavaScript en cada página.
- **Sin librerías que no hacen falta en todas las páginas**: el menú de tema es propio (sin Radix),
  no hay proveedor de tooltips global, las animaciones de las lecciones son CSS (sin Motion) y el
  gráfico de interés compuesto se carga después de la página.
- **Primera pantalla de la lección en el HTML**: se prepara en el build, no tras cargar el JS.
- **Fuentes recortadas** a los caracteres del español (≈35 KB cada una en vez de ≈70 KB) y Geist
  Mono sin precarga.
- **Accesibilidad**: los deslizadores dan su nombre al control (no al contenedor) y el gráfico no
  recibe foco (los mismos datos están en la tabla).
