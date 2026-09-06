import Image from "next/image";
import type { FamilyTeamContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";

type OurTeamSectionProps = {
  content: FamilyTeamContent;
  tone?: "canvas" | "surface";
};

/**
 * Sección familiar con fotografía real en composición editorial.
 * Prioriza no cortar a ninguna de las tres personas (foto horizontal 3:2).
 */
export function OurTeamSection({
  content,
  tone = "surface",
}: OurTeamSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const photo = content.photo;
  const hasPhoto = Boolean(photo?.src);

  return (
    <section
      id="nuestro-equipo"
      className={`${background} section-pad text-ink`}
      aria-labelledby="nuestro-equipo-title"
      data-testid="nuestro-equipo"
    >
      <Reveal className="mx-auto w-full max-w-[min(100%,42rem)] text-center">
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
          className="mx-auto mt-9 flex w-full max-w-[13rem] flex-col items-center gap-4"
          aria-hidden="true"
        >
          <div className="h-px w-full bg-sand/80" />
          <div className="flex w-full items-center justify-between px-2">
            {content.members.map((member) => (
              <span
                key={member.name}
                className="block size-1.5 rounded-full bg-taupe/85"
                title={member.name}
              />
            ))}
          </div>
          <div className="h-px w-full bg-sand/80" />
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {content.members.map((member) => (
            <li
              key={member.name}
              className="font-display text-[1.05rem] tracking-wide text-ink"
            >
              {member.name}
            </li>
          ))}
        </ul>

        {/*
          Contenedor 3:2 alineado a la foto real (7008×4672).
          Evita crop vertical agresivo que cortaría a Silvia u Omar.
        */}
        <figure
          className="relative mx-auto mt-10 w-full overflow-hidden bg-beige/50 ring-1 ring-sand/50"
          data-testid="nuestro-equipo-photo"
        >
          <div className="relative aspect-[3/2] w-full">
            {hasPhoto && photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 430px) 92vw, (max-width: 768px) 88vw, 672px"
                className="object-cover"
                style={{
                  objectPosition: photo.objectPosition ?? "50% 42%",
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
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
        </figure>

        <p className="mx-auto mt-9 max-w-[22rem] font-sans text-[1.0625rem] leading-relaxed text-ink-muted text-pretty">
          {content.line}
        </p>
      </Reveal>
    </section>
  );
}
