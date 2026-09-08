import Image from "next/image";
import type { PresenceGiftContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import { BotanicalSprig } from "@/components/invitation/ornaments";
import { SectionEndMark } from "@/components/invitation/SectionEndMark";

type PresenceGiftSectionProps = {
  content: PresenceGiftContent;
  tone?: "canvas" | "surface";
};

/**
 * Pausa editorial: su presencia es nuestro regalo.
 * Copy → S&O → fotografía vertical → puente hacia RSVP.
 */
export function PresenceGiftSection({
  content,
  tone = "surface",
}: PresenceGiftSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const { photo } = content;
  const isPortrait = Boolean(
    photo.height && photo.width && photo.height > photo.width,
  );

  return (
    <section
      id="su-presencia"
      className={`${background} section-pad text-ink`}
      aria-labelledby="presence-gift-title"
      data-testid="presence-gift-section"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <BotanicalSprig className="mx-auto h-5 w-16 text-taupe/55" />

        <h2
          id="presence-gift-title"
          className="font-display mx-auto mt-10 max-w-[16rem] text-[clamp(1.85rem,7vw,2.45rem)] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:max-w-[20rem]"
        >
          {content.title}
        </h2>

        <div className="mx-auto mt-9 max-w-[22rem] space-y-6">
          {content.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="font-sans text-[1.0625rem] leading-[1.85] text-ink-muted text-pretty"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      <SectionEndMark className="mt-12 md:mt-14" />

      <Reveal className="mx-auto mt-12 w-full max-w-[var(--content-max)] md:mt-14">
        <figure
          className={`relative mx-auto w-full overflow-hidden bg-beige/40 ${
            isPortrait
              ? "max-w-[min(100%,26rem)]"
              : "max-w-[min(100%,40rem)]"
          }`}
          data-testid="presence-gift-photo"
        >
          <div
            className={`relative w-full ${
              isPortrait ? "aspect-[2/3]" : "aspect-[3/2]"
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={
                isPortrait
                  ? "(max-width: 768px) 100vw, 416px"
                  : "(max-width: 768px) 100vw, 640px"
              }
              className="object-cover"
              style={{
                objectPosition: photo.objectPosition ?? "50% 42%",
              }}
              loading="lazy"
            />
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
