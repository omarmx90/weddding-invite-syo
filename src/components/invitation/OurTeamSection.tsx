"use client";

import { useState } from "react";
import Image from "next/image";
import type { FamilyTeamContent, FootballGalleryItem } from "@/content/types";
import type { EditorialChapter } from "@/content/editorial-types";
import { Reveal } from "@/components/invitation/Reveal";
import { ChapterMark } from "@/components/invitation/ChapterMark";
import { FootballLightbox } from "@/components/invitation/FootballLightbox";
import { SectionEndMark } from "@/components/invitation/SectionEndMark";

type OurTeamSectionProps = {
  content: FamilyTeamContent;
  chapter?: EditorialChapter;
  tone?: "canvas" | "surface";
};

function slideClass(item: FootballGalleryItem, index: number) {
  if (index === 0 || item.span === "hero") {
    return "gallery-rail-slide gallery-rail-slide--lead";
  }
  if (item.span === "tall" || item.orientation === "portrait") {
    return "gallery-rail-slide gallery-rail-slide--portrait";
  }
  if (item.span === "wide") {
    return "gallery-rail-slide gallery-rail-slide--featured";
  }
  return "gallery-rail-slide gallery-rail-slide--landscape";
}

/**
 * Nuestro equipo — tipografía + riel fotográfico (como Nuestros momentos) + lightbox.
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
      className={`${background} football-pitch-section relative section-pad-y text-ink`}
      aria-labelledby="nuestro-equipo-title"
      data-testid="nuestro-equipo"
    >
      <Reveal className="relative z-[1] mx-auto w-full max-w-[min(100%,42rem)] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] text-center">
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
        <div className="relative z-[1] mt-14 w-full">
          <p className="px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] text-center font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
            {content.footballGallery.title}
          </p>
          <p className="mt-3 px-[max(1.25rem,env(safe-area-inset-left))] text-center font-sans text-[0.6875rem] tracking-[0.2em] text-ink-subtle uppercase md:hidden">
            Desliza para ver más
          </p>

          <div
            className="gallery-rail mt-8 min-w-0 w-full"
            data-testid="football-gallery"
            tabIndex={0}
            role="region"
            aria-label={`${content.footballGallery.title}: álbum familiar. Desplaza horizontalmente para ver más. Toca una foto para ampliarla.`}
          >
            <ul className="gallery-rail-track">
              {items.map((item, index) => {
                const number = String(index + 1).padStart(2, "0");
                return (
                  <li key={item.id} className={slideClass(item, index)}>
                    <figure className="gallery-slide-figure">
                      <div className="relative h-full w-full overflow-hidden bg-beige/40">
                        <button
                          type="button"
                          className="group absolute inset-0 block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
                          onClick={() => setOpenIndex(index)}
                          aria-label={`Ver fotografía ${index + 1} de ${items.length}: ${item.alt}`}
                          data-testid={`football-photo-${item.id}`}
                        >
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="(max-width: 430px) 88vw, (max-width: 768px) 72vw, 500px"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            style={{
                              objectPosition: item.objectPosition ?? "50% 40%",
                            }}
                            loading="lazy"
                          />
                        </button>
                      </div>
                      <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
                        <span className="font-sans text-[0.625rem] font-medium tracking-[0.24em] text-ink-subtle tabular-nums">
                          {number}
                        </span>
                        <span className="sr-only">{item.alt}</span>
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="relative z-[1]">
        <SectionEndMark />
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
