import Image from "next/image";
import type { FamilyTeamContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";

type OurTeamSectionProps = {
  content: FamilyTeamContent;
  tone?: "canvas" | "surface";
};

/**
 * Sección familiar con guiño futbolero sutil.
 * Lista para fotografía real vía content.photo + objectPosition.
 */
export function OurTeamSection({
  content,
  tone = "surface",
}: OurTeamSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const hasPhoto = Boolean(content.photo?.src);

  return (
    <section
      id="nuestro-equipo"
      className={`${background} section-pad text-ink`}
      aria-labelledby="nuestro-equipo-title"
      data-testid="nuestro-equipo"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          {content.eyebrow}
        </p>

        <h2
          id="nuestro-equipo-title"
          className="font-display mt-5 text-[clamp(2rem,8vw,2.75rem)] leading-tight font-medium tracking-[-0.01em] text-balance"
        >
          {content.title}
        </h2>

        {/* Guiño: línea de campo + tres posiciones */}
        <div
          className="mx-auto mt-10 flex w-full max-w-[14rem] flex-col items-center gap-5"
          aria-hidden="true"
        >
          <div className="h-px w-full bg-sand/80" />
          <div className="flex w-full items-center justify-between px-2">
            {content.members.map((member) => (
              <span
                key={member.name}
                className="block size-2 rounded-full bg-taupe/80"
                title={member.name}
              />
            ))}
          </div>
          <div className="h-px w-full bg-sand/80" />
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {content.members.map((member) => (
            <li
              key={member.name}
              className="font-display text-[1.125rem] tracking-wide text-ink"
            >
              {member.name}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-[22rem] font-sans text-[1.0625rem] leading-relaxed text-ink-muted text-pretty">
          {content.line}
        </p>

        <div className="relative mx-auto mt-12 aspect-[4/5] w-full max-w-[20rem] overflow-hidden bg-beige/70 sm:aspect-[3/4]">
          {hasPhoto && content.photo ? (
            <Image
              src={content.photo.src}
              alt={content.photo.alt}
              fill
              sizes="(max-width: 430px) 85vw, 320px"
              className="object-cover"
              style={{
                objectPosition: content.photo.objectPosition ?? "50% 50%",
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
              {/* Motivo circular abstracto (balón muy sutil) */}
              <div
                className="relative size-14 rounded-full border border-sand/90"
                aria-hidden="true"
              >
                <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-sand/80" />
                <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-sand/80" />
              </div>
              <p className="font-sans text-[0.75rem] tracking-[0.18em] text-ink-subtle uppercase text-balance">
                {content.photoPlaceholderLabel}
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
