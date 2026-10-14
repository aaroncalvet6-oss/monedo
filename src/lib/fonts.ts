import localFont from "next/font/local";

/** Geist, self-hosted (copied from the `geist` package). Preloaded: it is all the text. */
export const GeistSans = localFont({
  src: "../fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

/**
 * Geist Mono for figures. Not preloaded: it only styles numbers, so it can arrive after the
 * first paint without holding up the page.
 */
export const GeistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
});
