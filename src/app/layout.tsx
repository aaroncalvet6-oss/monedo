import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { GeistMono, GeistSans } from "@/lib/fonts";
import { SITE_ORIGIN } from "@/lib/site";
import { themeInitScript } from "@/lib/theme/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Monedo · Aprende a manejar tu dinero",
    template: "%s · Monedo",
  },
  description:
    "Cursos cortos de educación financiera para jóvenes de 14 a 18 años: paga, primer sueldo, ahorro, bancos y cómo evitar estafas.",
  applicationName: "Monedo",
  metadataBase: new URL(SITE_ORIGIN),
};

export const viewport: Viewport = {
  // Lets layouts use env(safe-area-inset-*) around the notch and home indicator.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
