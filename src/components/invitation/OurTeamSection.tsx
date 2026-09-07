"use client";

import { useState } from "react";
import Image from "next/image";
import type { FamilyTeamContent } from "@/content/types";
import type { EditorialChapter } from "@/content/editorial-types";
import { Reveal } from "@/components/invitation/Reveal";
import { ChapterMark } from "@/components/invitation/ChapterMark";
import { FootballLightbox } from "@/components/invitation/FootballLightbox";
import { OrnamentalDivider } from "@/components/invitation/ornaments";

type OurTeamSectionProps = {
  content: FamilyTeamContent;
  chapter?: EditorialChapter;
  tone?: "canvas" | "surface";
};

function spanClass(span?: string) {
  switch (span) {
    case "hero":
      return "football-grid-item football-grid-item--hero";
    case "wide":
      return "football-grid-item football-grid-item--wide";
    case "tall":
      return "football-grid-item football-grid-item--tall";
    default:
      return "football-grid-item";
  }
}

/**
 * Nuestro equipo — tipografía + collage futbolero editorial + lightbox.
 */
export function OurTeamSection({
  content,
  chapter,
  tone = "surface",
}: OurTeamSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const rivalryOrder = ["Silvia", "Omar", "Mauro"] as const;
  const rivalryMembers = rivalryOrder
    .map((name) =>
      content.members.find((member) => member.name === name && member.team),
    )
    .filter(
      (member): member is NonNullable<typeof member> => Boolean(member),
    );
  const items = content.footballGallery.items;

  return (
    <section
      id="nuestro-equipo"
      className={`${background} football-pitch-section relative section-pad text-ink`}
      aria-labelledby="nuestro-equipo-title"
      data-testid="nuestro-equipo"
    >
      <Reveal className="relative z-[1] mx-auto w-full max-w-[min(100%,42rem)] text-center">
        {chapter ? <ChapterMark chapter={chapter} className="mb-8" /> : null}
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.34em] text-ink-subtle">
          {content.eyebrow}
        </p>

        <h2
          id="nuestro-equipo-title"
          className="font-display mt-5 text-[clamp(2.15rem,8.5vw,3rem)] leading-[0.95] font-medium tracking-[-0.02em] text-balance"
        >
          {content.title}
        </h2>

        <p className="mx-auto mt-8 max-w-[22rem] font-display text-[clamp(1.15rem,4.5vw,1.4rem)] leading-snug text-ink text-pretty">
          {content.line}
        </p>
        {content.lineSecondary ? (
          <p className="mx-auto mt-3 max-w-[22rem] font-sans text-[0.9375rem] leading-relaxed text-ink-subtle text-pretty">
            {content.lineSecondary}
          </p>
        ) : null}

        {rivalryMembers.length > 0 ? (
          <div
            className="mx-auto mt-12 max-w-[20rem]"
            data-testid="nuestro-equipo-rivalry"
          >
            {content.rivalryTitle ? (
              <p className="font-display text-[clamp(1.2rem,4.8vw,1.45rem)] leading-snug text-ink text-balance">
                {content.rivalryTitle}
              </p>
            ) : null}

            <ul className="mt-10 flex flex-col gap-7">
              {rivalryMembers.map((member) => (
                <li
                  key={`${member.name}-${member.team}`}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="font-display text-[clamp(1.45rem,6vw,1.85rem)] tracking-[-0.02em] text-ink uppercase">
                    {member.name}
                  </span>
                  <span className="h-px w-8 bg-sand" aria-hidden="true" />
                  <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-ink-subtle">
                    {member.team}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Reveal>

      {items.length > 0 ? (
        <div className="relative z-[1] mx-auto mt-14 w-full max-w-[min(100%,52rem)] px-[max(1.15rem,env(safe-area-inset-left))] pr-[max(1.15rem,env(safe-area-inset-right))]">
          <p className="text-center font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
            {content.footballGallery.title}
          </p>

          <ul
            className="football-grid mt-8 list-none p-0"
            data-testid="football-gallery"
          >
            {items.map((item, index) => (
              <li key={item.id} className={spanClass(item.span)}>
                <button
                  type="button"
                  className="football-grid-button group relative block h-full w-full overflow-hidden bg-beige/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Ver fotografía ${index + 1} de ${items.length}: ${item.alt}`}
                  data-testid={`football-photo-${item.id}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      item.span === "hero"
                        ? "(max-width: 768px) 92vw, 832px"
                        : "(max-width: 768px) 46vw, 400px"
                    }
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    style={{
                      objectPosition: item.objectPosition ?? "50% 40%",
                    }}
                    loading="lazy"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="relative z-[1] mx-auto mt-16 max-w-[18rem]">
        <OrnamentalDivider className="text-taupe/60" motif="monogram" />
      </div>

      <FootballLightbox
        items={items}
        openIndex={openIndex}
        galleryTitle={content.footballGallery.title}
        onClose={() => setOpenIndex(null)}
        onChangeIndex={setOpenIndex}
      />
    </section>
  );
}
