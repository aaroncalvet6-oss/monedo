/** Public origin of the deployed site (GitHub Pages). */
export const SITE_ORIGIN = "https://aaroncalvet6-oss.github.io";
/** Base path on that origin; same as `basePath` in next.config.ts. */
const SITE_BASE_PATH = "/monedo";
export const SITE_NAME = "Monedo";
export const SITE_DESCRIPTION =
  "Cursos cortos y gratuitos de educación financiera para jóvenes de 14 a 18 años en España: tu paga, tu primer sueldo, el ahorro y las trampas de consumo.";

/**
 * Contact e-mail of the project, shown on /legal. It must be a project address, never a
 * personal one. While it is null, the contact section is not rendered at all.
 */
export const CONTACT_EMAIL: string | null = null;

/** Absolute URL of a route, with the base path and the trailing slash the export uses. */
export function absoluteUrl(path: `/${string}`): string {
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return `${SITE_ORIGIN}${SITE_BASE_PATH}${withSlash}`;
}
