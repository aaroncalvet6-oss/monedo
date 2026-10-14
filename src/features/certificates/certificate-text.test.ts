import { describe, expect, it } from "vitest";
import { certificateText } from "./certificate-text";

const text = certificateText({
  name: "Lucía García",
  courseTitle: "Fundamentos del dinero",
  lessons: 6,
  score: 8,
  total: 10,
  passedAt: new Date("2026-10-14T10:00:00.000Z"),
});
const all = Object.values(text).join(" ");

describe("certificate text", () => {
  it("is a «Certificado de finalización» with the name, course, score and date", () => {
    expect(text.heading).toBe("Certificado de finalización");
    expect(all).toContain("Lucía García");
    expect(all).toContain("«Fundamentos del dinero»");
    expect(all).toContain("8 de 10");
    expect(text.date).toBe("14 de octubre de 2026");
  });

  it("never calls itself a title or an accreditation, nor claims official recognition", () => {
    expect(all).not.toMatch(/\btítulo\b|acredit|homolog|oficialmente|reconocid|avalad/i);
    expect(text.disclaimer).toContain("no tiene validez académica oficial");
  });
});
