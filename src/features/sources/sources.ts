import { getLesson, getPublishedCourses } from "@/content";
import { OFFICIAL_DOMAINS } from "@/content/schema";

type OfficialDomain = (typeof OFFICIAL_DOMAINS)[number];

/** Public name of each approved official source. */
export const SOURCE_NAMES: Record<OfficialDomain, string> = {
  "agenciatributaria.gob.es": "Agencia Tributaria",
  "seg-social.es": "Seguridad Social",
  "boe.es": "Boletín Oficial del Estado (BOE)",
  "sepe.es": "Servicio Público de Empleo Estatal (SEPE)",
  "trabajo.gob.es": "Ministerio de Trabajo y Economía Social",
  "mites.gob.es": "Ministerio de Trabajo y Economía Social",
  "ine.es": "Instituto Nacional de Estadística (INE)",
  "bde.es": "Banco de España (y su Portal del Cliente Bancario)",
  "cnmv.es": "Comisión Nacional del Mercado de Valores (CNMV)",
  "finanzasparatodos.es": "Finanzas para todos (Banco de España y CNMV)",
  "fgd.es": "Fondo de Garantía de Depósitos",
  "consumo.gob.es": "Ministerio de Consumo",
  "cnmc.es": "Comisión Nacional de los Mercados y la Competencia (CNMC)",
  "educacionfpydeportes.gob.es": "Ministerio de Educación",
  "ecb.europa.eu": "Banco Central Europeo",
  "incibe.es": "Instituto Nacional de Ciberseguridad (INCIBE)",
  "aepd.es": "Agencia Española de Protección de Datos (AEPD)",
  "policia.es": "Policía Nacional",
  "guardiacivil.es": "Guardia Civil",
};

/** Approved official sources, without repeating an organisation. */
export const APPROVED_SOURCES = [...new Set(Object.values(SOURCE_NAMES))];

export function organisationOf(url: string): string {
  const host = new URL(url).hostname;
  const domain = OFFICIAL_DOMAINS.find((d) => host === d || host.endsWith(`.${d}`));
  if (!domain) throw new Error(`Not an official source: ${url}`);
  return SOURCE_NAMES[domain];
}

export type UsedSource = {
  label: string;
  url: string;
  /** Lessons that link to it. */
  lessons: { course: string; courseTitle: string; lesson: string; title: string }[];
};

/** Official sources linked from published lessons, grouped by organisation. */
export function publishedSources(): { organisation: string; sources: UsedSource[] }[] {
  const byUrl = new Map<string, UsedSource>();
  for (const course of getPublishedCourses()) {
    for (const entry of course.lessons) {
      const lesson = getLesson(course.slug, entry.slug);
      for (const block of lesson?.blocks ?? []) {
        if (!("sources" in block) || !block.sources) continue;
        for (const source of block.sources) {
          const used = byUrl.get(source.url) ?? { ...source, lessons: [] };
          if (!used.lessons.some((l) => l.course === course.slug && l.lesson === entry.slug)) {
            used.lessons.push({
              course: course.slug,
              courseTitle: course.title,
              lesson: entry.slug,
              title: entry.title,
            });
          }
          byUrl.set(source.url, used);
        }
      }
    }
  }
  const groups = new Map<string, UsedSource[]>();
  for (const source of byUrl.values()) {
    const organisation = organisationOf(source.url);
    groups.set(organisation, [...(groups.get(organisation) ?? []), source]);
  }
  return [...groups].map(([organisation, sources]) => ({ organisation, sources }));
}
