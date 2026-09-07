import Image from "next/image";
import type { WeddingMediaAsset } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import { OrnamentalDivider } from "@/components/invitation/ornaments";
import { SectionEndMark } from "@/components/invitation/SectionEndMark";

type NarrativeBridgeProps = {
  text: string;
  tone?: "canvas" | "surface";
  testId?: string;
  /** Foto editorial bajo el texto de transición */
  media?: WeddingMediaAsset;
};

/**
 * Puente tipográfico breve entre secciones del día.
 * Separador S&O en lugar de regla lisa — un solo punto ornamental.
 */
export function NarrativeBridge({
  text,
  tone = "canvas",
  testId = "celebration-transition",
  media,
}: NarrativeBridgeProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      className={`${background} section-pad text-ink`}
      aria-label="Transición hacia la celebración"
      data-testid={testId}
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <OrnamentalDivider className="text-taupe/70" motif="monogram" />
        <p className="font-display mt-10 text-[clamp(1.35rem,5.5vw,1.7rem)] leading-snug text-ink text-balance">
          {text}
        </p>
      </Reveal>

      {media ? (
        <figure
          className="relative mx-auto mt-12 w-full max-w-[min(100%,40rem)] overflow-hidden bg-beige/40 md:mt-14"
          data-testid={`${testId}-photo`}
        >
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              style={{
                objectPosition: media.objectPosition ?? "50% 55%",
              }}
              loading="lazy"
            />
          </div>
        </figure>
      ) : null}

      <SectionEndMark />
    </section>
  );
}
