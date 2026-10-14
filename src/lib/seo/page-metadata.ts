import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export type PageMetadataInput = {
  /** Page title; the root layout appends « · Monedo». */
  title?: string | undefined;
  description: string;
  /** Route without base path, e.g. "/cursos/fundamentos-del-dinero". */
  path: `/${string}`;
  /** Social image under /og (1200 × 630). Defaults to the generic Monedo image. */
  image?: `/og/${string}.png` | undefined;
  /** Personal pages (profile, certificate) are kept out of search results. */
  noindex?: boolean | undefined;
};

/** Metadata for every page: description, canonical URL, Open Graph and Twitter card. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/og/monedo.png",
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = title
    ? `${title} · ${SITE_NAME}`
    : `${SITE_NAME} · Aprende a manejar tu dinero`;
  const imageUrl = `${absoluteUrl("/").replace(/\/$/, "")}${image}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [imageUrl] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
