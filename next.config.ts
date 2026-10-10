import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Static export for GitHub Pages, served under https://<owner>.github.io/monedo/.
 * Every route is prerendered (dynamic routes use generateStaticParams with
 * dynamicParams = false), so `next build` writes a self-contained site to out/.
 */
const basePath = "/monedo";

export default function config(phase: string): NextConfig {
  return {
    output: "export",
    basePath,
    // Files named page.dev.tsx (the internal /design page) are routes only under `next dev`,
    // so they never reach the production build.
    pageExtensions: phase === PHASE_DEVELOPMENT_SERVER ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"],
    // Each route becomes <route>/index.html, which every static host serves reliably.
    trailingSlash: true,
    // No image optimisation server on a static host.
    images: { unoptimized: true },
    // Exposed so plain <a>/<img> tags (not next/link or next/image) can prefix asset paths.
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
  };
}
