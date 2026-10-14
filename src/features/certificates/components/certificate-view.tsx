"use client";

import { Download, FileText, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/features/progress/progress-provider";
import { asset } from "@/lib/base-path";
import { certificateName, cleanName, MAX_NAME_LENGTH } from "@/lib/certificates/certificate-name";
import { buildImagePdf } from "@/lib/pdf/image-pdf";
import { useHydrated } from "@/lib/use-hydrated";
import { certificateText } from "../certificate-text";
import { CERTIFICATE_HEIGHT, CERTIFICATE_WIDTH, drawCertificate } from "../draw-certificate";

export type CertificateCourse = { slug: string; title: string; lessons: number };

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Web Share with files (mostly phones). Without it, the share button stays hidden. */
function supportsFileShare(): boolean {
  try {
    const probe = new File([new Blob()], "x.png", { type: "image/png" });
    return Boolean(navigator.canShare?.({ files: [probe] }));
  } catch {
    return false;
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob"))), type, quality),
  );

/**
 * The «Certificado de finalización» of a course: only once the final assessment is passed.
 * The learner types their name; it is saved only in this browser.
 */
export function CertificateView({ course }: { course: CertificateCourse }) {
  const status = useProgress((s) => s.status);
  const result = useProgress((s) => s.snapshot.assessments[course.slug]);

  if (status !== "ready") return <Skeleton className="aspect-[1.414] w-full" />;
  if (!result?.passedAt) {
    return (
      <div className="flex measure flex-col gap-6">
        <p className="text-lg leading-8">
          Este certificado se consigue al aprobar la evaluación final del curso. Cuando la apruebes,
          podrás escribir tu nombre y descargarlo.
        </p>
        <Button asChild size="lg" className="self-start">
          <Link href={`/cursos/${course.slug}/evaluacion`}>Ir a la evaluación final</Link>
        </Button>
      </div>
    );
  }
  return (
    <Certificate
      course={course}
      score={result.bestScore}
      total={result.total}
      passedAt={new Date(result.passedAt)}
    />
  );
}

function Certificate({
  course,
  score,
  total,
  passedAt,
}: {
  course: CertificateCourse;
  score: number;
  total: number;
  passedAt: Date;
}) {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(() => certificateName.load());
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [fontReady, setFontReady] = useState(false);
  const [busy, setBusy] = useState<"png" | "pdf" | "share" | null>(null);
  const canShare = useHydrated() && supportsFileShare();
  const clean = cleanName(name);
  const data = {
    name: clean || "Tu nombre",
    courseTitle: course.title,
    lessons: course.lessons,
    score,
    total,
    passedAt,
  };

  // Load the logo and the page font once, then draw.
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => !cancelled && setLogo(image);
    image.src = asset("/brand/monedo-logo-light-bg.svg");
    const family = getComputedStyle(document.body).fontFamily;
    Promise.all([
      document.fonts.load(`600 48px ${family}`),
      document.fonts.load(`400 48px ${family}`),
    ])
      .catch(() => undefined)
      .then(() => !cancelled && setFontReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawCertificate(ctx, data, getComputedStyle(document.body).fontFamily, logo);
    // data is rebuilt each render from these values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clean, logo, fontReady, score, total, passedAt.getTime()]);

  const filename = `certificado-monedo-${course.slug}`;
  const save = async (kind: "png" | "pdf" | "share") => {
    const canvas = canvasRef.current;
    if (!canvas || !clean) return;
    setBusy(kind);
    try {
      if (kind === "pdf") {
        const jpeg = new Uint8Array(await (await toBlob(canvas, "image/jpeg", 0.92)).arrayBuffer());
        const pdf = buildImagePdf({
          jpeg,
          width: CERTIFICATE_WIDTH,
          height: CERTIFICATE_HEIGHT,
          title: `Certificado de finalización · ${course.title}`,
        });
        download(new Blob([pdf.slice().buffer], { type: "application/pdf" }), `${filename}.pdf`);
      } else {
        const png = await toBlob(canvas, "image/png");
        if (kind === "png") download(png, `${filename}.png`);
        else
          await navigator.share({
            files: [new File([png], `${filename}.png`, { type: "image/png" })],
            title: "Certificado de finalización",
          });
      }
    } catch {
      // Share cancelled or the browser refused: nothing to report.
    } finally {
      setBusy(null);
    }
  };

  const text = certificateText(data);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex measure flex-col gap-2">
        <Label htmlFor={`${id}-name`}>Tu nombre, tal y como quieres que aparezca</Label>
        <Input
          id={`${id}-name`}
          value={name}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="name"
          aria-describedby={`${id}-privacy`}
          onChange={(event) => {
            setName(event.target.value);
            certificateName.save(event.target.value);
          }}
        />
        <p id={`${id}-privacy`} className="text-base leading-7 text-fg-muted">
          Tu nombre solo se guarda en este navegador. Nada de lo que escribes sale de tu navegador.
        </p>
        {clean ? (
          <Button
            variant="link"
            className="self-start"
            onClick={() => {
              setName("");
              certificateName.clear();
            }}
          >
            <Trash2 />
            Borrar mi nombre
          </Button>
        ) : null}
      </div>

      <figure className="flex flex-col gap-3">
        <canvas
          ref={canvasRef}
          width={CERTIFICATE_WIDTH}
          height={CERTIFICATE_HEIGHT}
          role="img"
          aria-label={`${text.heading}. ${text.givenTo} ${text.name}, ${text.body} ${text.dateLabel}: ${text.date}.`}
          className="h-auto w-full rounded-md border border-border"
        />
        <figcaption className="text-sm text-fg-muted">Vista previa del certificado</figcaption>
      </figure>

      {clean ? null : (
        <Callout tone="info">Escribe tu nombre para descargar el certificado.</Callout>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" disabled={!clean || busy !== null} onClick={() => save("png")}>
          <Download />
          {busy === "png" ? "Preparando…" : "Descargar imagen"}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          disabled={!clean || busy !== null}
          onClick={() => save("pdf")}
        >
          <FileText />
          {busy === "pdf" ? "Preparando…" : "Descargar PDF"}
        </Button>
        {canShare ? (
          <Button
            size="lg"
            variant="secondary"
            disabled={!clean || busy !== null}
            onClick={() => save("share")}
          >
            <Share2 />
            Compartir
          </Button>
        ) : null}
      </div>
    </div>
  );
}
