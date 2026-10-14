import type { MetadataRoute } from "next";
import { getCourseParams, getLessonParams } from "@/content";
import { tools } from "@/features/tools/tools";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Every public page, built with the export. Personal pages (profile, certificates) and the
 * old /aprender redirect are left out: they are noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: `/${string}`[] = [
    "/",
    "/cursos",
    ...getCourseParams().flatMap(({ curso }) => [
      `/cursos/${curso}` as const,
      `/cursos/${curso}/evaluacion` as const,
    ]),
    ...getLessonParams().map(({ curso, leccion }) => `/cursos/${curso}/${leccion}` as const),
    "/herramientas",
    ...tools.map((tool) => `/herramientas/${tool.id}` as const),
    "/fuentes",
    "/legal",
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
