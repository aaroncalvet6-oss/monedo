import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getCourse, getPublishedCourses } from "@/content";
import { absoluteUrl, CONTACT_EMAIL } from "@/lib/site";
import { courseJsonLd } from "./course-json-ld";
import { pageMetadata } from "./page-metadata";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("SEO", () => {
  it("uses the same base path as next.config.ts", () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(config).toContain('const basePath = "/monedo";');
  });

  it("builds absolute URLs with the base path and a trailing slash", () => {
    expect(absoluteUrl("/")).toBe("https://aaroncalvet6-oss.github.io/monedo/");
    expect(absoluteUrl("/cursos/tu-primer-sueldo")).toBe(
      "https://aaroncalvet6-oss.github.io/monedo/cursos/tu-primer-sueldo/",
    );
  });

  it("gives every page a canonical URL, Open Graph and a Twitter card", () => {
    const meta = pageMetadata({ title: "Cursos", description: "Descripción", path: "/cursos" });
    expect(meta.alternates?.canonical).toBe(absoluteUrl("/cursos"));
    expect(meta.openGraph).toMatchObject({ locale: "es_ES", url: absoluteUrl("/cursos") });
    expect(JSON.stringify(meta.openGraph)).toContain("/monedo/og/monedo.png");
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
    expect(meta.robots).toBeUndefined();
    expect(pageMetadata({ description: "x", path: "/perfil", noindex: true }).robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it("has a social image for every published course", () => {
    for (const course of getPublishedCourses()) {
      expect(
        existsSync(join(process.cwd(), `public/og/curso-${course.slug}.png`)),
        course.slug,
      ).toBe(true);
    }
    expect(existsSync(join(process.cwd(), "public/og/monedo.png"))).toBe(true);
  });

  it("describes courses as free schema.org Courses with their lessons", () => {
    const course = getCourse("fundamentos-del-dinero")!;
    const data = courseJsonLd(course);
    expect(data).toMatchObject({
      "@type": "Course",
      name: course.title,
      inLanguage: "es-ES",
      isAccessibleForFree: true,
      provider: { "@type": "Organization", name: "Monedo" },
      offers: { price: 0, priceCurrency: "EUR" },
      hasCourseInstance: { courseMode: "Online" },
    });
    expect(data.hasPart).toHaveLength(course.lessons.length);
  });
});

describe("no personal data in the public site", () => {
  it("only the GitHub Pages address carries the account name; no phones or postal addresses", () => {
    const offenders = sourceFiles(join(process.cwd(), "src")).filter((file) => {
      if (file.endsWith(join("lib", "site.ts"))) return false;
      const code = readFileSync(file, "utf8");
      return /aaron|calvet/i.test(code) || /\b[679]\d{2}[ .]?\d{3}[ .]?\d{3}\b/.test(code);
    });
    expect(offenders).toEqual([]);
  });

  it("the contact slot is a project address or empty", () => {
    expect(CONTACT_EMAIL === null || /^[^\s@]+@[^\s@]+$/.test(CONTACT_EMAIL)).toBe(true);
  });
});
