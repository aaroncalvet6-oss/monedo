import { certificateText, type CertificateData } from "./certificate-text";

/** A4 landscape at a size that prints sharply. */
export const CERTIFICATE_WIDTH = 2000;
export const CERTIFICATE_HEIGHT = 1414;

// Light-theme tokens (globals.css): the certificate is always printed on white.
const COLORS = {
  surface: "#ffffff",
  border: "#e4e4e7",
  fg: "#09090b",
  muted: "#52525b",
  subtle: "#686871",
  brand: "#046c4e",
};

const MARGIN = 140;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Draws the certificate. `font` is the page's font-family (Geist), `logo` the light-background
 * logo already loaded. Pure drawing: the same input always gives the same picture.
 */
export function drawCertificate(
  ctx: CanvasRenderingContext2D,
  data: CertificateData,
  font: string,
  logo: CanvasImageSource | null,
): void {
  const text = certificateText(data);
  const W = CERTIFICATE_WIDTH;
  const H = CERTIFICATE_HEIGHT;
  const width = W - MARGIN * 2;
  ctx.save();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  ctx.fillStyle = COLORS.surface;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 3;
  ctx.strokeRect(56, 56, W - 112, H - 112);
  ctx.fillStyle = COLORS.brand;
  ctx.fillRect(56, 56, W - 112, 12);

  if (logo) ctx.drawImage(logo, MARGIN, 150, 504 * 0.75, 96 * 0.75);

  ctx.fillStyle = COLORS.brand;
  ctx.font = `600 34px ${font}`;
  ctx.letterSpacing = "6px";
  ctx.fillText(text.heading.toUpperCase(), MARGIN, 400);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 40px ${font}`;
  ctx.fillText(text.givenTo, MARGIN, 500);

  // The name: as large as fits on one line.
  ctx.fillStyle = COLORS.fg;
  let size = 112;
  ctx.font = `600 ${size}px ${font}`;
  while (ctx.measureText(text.name).width > width && size > 48) {
    size -= 4;
    ctx.font = `600 ${size}px ${font}`;
  }
  ctx.fillText(text.name, MARGIN, 640);
  ctx.fillStyle = COLORS.border;
  ctx.fillRect(MARGIN, 690, width, 3);

  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 44px ${font}`;
  wrap(ctx, text.body, width).forEach((line, i) => ctx.fillText(line, MARGIN, 790 + i * 64));

  ctx.fillStyle = COLORS.subtle;
  ctx.font = `500 30px ${font}`;
  ctx.fillText(text.dateLabel.toUpperCase(), MARGIN, 1060);
  ctx.fillStyle = COLORS.fg;
  ctx.font = `500 44px ${font}`;
  ctx.fillText(text.date, MARGIN, 1120);

  ctx.fillStyle = COLORS.subtle;
  ctx.font = `400 28px ${font}`;
  wrap(ctx, text.disclaimer, width).forEach((line, i) => ctx.fillText(line, MARGIN, 1230 + i * 40));
  ctx.restore();
}
