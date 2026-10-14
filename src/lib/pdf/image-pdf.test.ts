import { describe, expect, it } from "vitest";
import { buildImagePdf } from "./image-pdf";

// Not a real photo: the PDF writer only copies the bytes.
const fakeJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 0xff, 0xd9]);
const latin1 = (bytes: Uint8Array) => Array.from(bytes, (b) => String.fromCharCode(b)).join("");

describe("buildImagePdf", () => {
  const pdf = buildImagePdf({
    jpeg: fakeJpeg,
    width: 2000,
    height: 1414,
    title: "Certificado de finalización",
  });
  const text = latin1(pdf);

  it("is a PDF with one A4 landscape page showing the JPEG", () => {
    expect(text.startsWith("%PDF-1.4\n")).toBe(true);
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
    expect(text).toContain("/MediaBox [0 0 842 595]");
    expect(text).toContain("/Filter /DCTDecode");
    expect(text).toContain("/Width 2000 /Height 1414");
    expect(text).toContain(`/Length ${fakeJpeg.length}`);
    expect(text).toContain(latin1(fakeJpeg));
  });

  it("has a cross-reference table whose offsets point at each object", () => {
    const startxref = Number(/startxref\n(\d+)/.exec(text)![1]);
    expect(text.slice(startxref, startxref + 4)).toBe("xref");
    const entries = [...text.slice(startxref).matchAll(/(\d{10}) 00000 n /g)].map((m) =>
      Number(m[1]),
    );
    expect(entries).toHaveLength(6);
    entries.forEach((offset, index) => {
      expect(text.slice(offset, offset + 8)).toBe(`${index + 1} 0 obj\n`);
    });
  });

  it("keeps accents in the title by writing it in UTF-16", () => {
    expect(text).toContain("/Title <FEFF");
    expect(text).toContain("00F3"); // ó
  });

  it("refuses an empty image", () => {
    expect(() => buildImagePdf({ jpeg: new Uint8Array(), width: 10, height: 10 })).toThrow();
    expect(() => buildImagePdf({ jpeg: fakeJpeg, width: 0, height: 10 })).toThrow();
  });
});
