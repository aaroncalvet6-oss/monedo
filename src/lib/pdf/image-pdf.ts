/**
 * A minimal one-page PDF that shows a single JPEG filling the page. Enough to save or print
 * a certificate, with no third-party library and nothing sent anywhere.
 */

const encoder = new TextEncoder();

/** PDF text string in UTF-16BE hex, so accents (é, ó, ñ) survive in the metadata. */
function pdfText(text: string): string {
  let hex = "FEFF";
  for (let i = 0; i < text.length; i += 1) {
    hex += text.charCodeAt(i).toString(16).padStart(4, "0").toUpperCase();
  }
  return `<${hex}>`;
}

export type ImagePdfOptions = {
  /** JPEG bytes (baseline, RGB). */
  jpeg: Uint8Array;
  /** Pixel size of the JPEG. */
  width: number;
  height: number;
  /** Page size in points; defaults to A4 landscape (842 × 595). */
  pageWidth?: number | undefined;
  pageHeight?: number | undefined;
  title?: string | undefined;
};

export function buildImagePdf({
  jpeg,
  width,
  height,
  pageWidth = 842,
  pageHeight = 595,
  title,
}: ImagePdfOptions): Uint8Array {
  if (!(width > 0 && height > 0 && jpeg.length > 0)) throw new Error("Empty image");
  const content = `q ${pageWidth} 0 0 ${pageHeight} 0 0 cm /Im0 Do Q`;
  const objects: (string | [string, Uint8Array, string])[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    [
      `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
      jpeg,
      "\nendstream",
    ],
    `<< /Producer ${pdfText("Monedo")}${title ? ` /Title ${pdfText(title)}` : ""} >>`,
  ];

  const chunks: Uint8Array[] = [];
  let length = 0;
  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    chunks.push(bytes);
    length += bytes.length;
  };

  // The binary comment line tells tools the file contains binary data.
  push("%PDF-1.4\n%âãÏÓ\n");
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(length);
    push(`${index + 1} 0 obj\n`);
    if (typeof object === "string") push(object);
    else object.forEach(push);
    push("\nendobj\n");
  });
  const xref = length;
  push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (const offset of offsets) push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  push(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xref}\n%%EOF\n`,
  );

  const out = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) {
    out.set(chunk, position);
    position += chunk.length;
  }
  return out;
}
