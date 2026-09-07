import Image from "next/image";
import type { FamilyTeamContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";

type OurTeamSectionProps = {
  content: FamilyTeamContent;
  tone?: "canvas" | "surface";
};

/**
 * Sección familiar editorial con guiño futbolero discreto.
 * Conserva la paleta beige/arena; los equipos son tipografía, no branding.
 */
export function OurTeamSection({
  content,
  tone = "surface",
}: OurTeamSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const photo = content.photo;
  const hasPhoto = Boolean(photo?.src);
  const rivalryOrder = ["Mauro", "Omar", "Silvia"] as const;
  const rivalryMembers = rivalryOrder
    .map((name) => content.members.find((member) => member.name === name && member.team))
    .filter((member): member is NonNullable<typeof member> => Boolean(member));


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

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {content.members.map((member) => (
            <li
              key={member.name}
              className="font-display text-[1.1rem] tracking-wide text-ink"
            >
              {member.name}
            </li>
          ))}
        </ul>

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
        {content.lineSecondary ? (
          <p className="mx-auto mt-3 max-w-[22rem] font-sans text-[0.9375rem] leading-relaxed text-ink-subtle text-pretty">
            {content.lineSecondary}
          </p>
        ) : null}

        {rivalryMembers.length > 0 ? (
          <div
            className="mx-auto mt-12 max-w-[22rem]"
            data-testid="nuestro-equipo-rivalry"
          >
            {content.rivalryTitle ? (
              <p className="font-display text-[clamp(1.15rem,4.5vw,1.35rem)] leading-snug text-ink text-balance">
                {content.rivalryTitle}
              </p>
            ) : null}

            <ul className="mt-8 flex flex-col gap-5">
              {rivalryMembers.map((member) => (
                <li
                  key={`${member.name}-${member.team}`}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className="font-display text-[1.2rem] tracking-wide text-ink">
                    {member.name}
                  </span>
                  <span
                    className="h-px w-6 bg-sand"
                    aria-hidden="true"
                  />
                  <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
                    {member.team}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
