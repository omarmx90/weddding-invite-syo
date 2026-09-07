import Image from "next/image";
import type { GalleryContent, GalleryItem } from "@/content/types";
import type { EditorialChapter } from "@/content/editorial-types";
import { getFeaturedGalleryItems } from "@/content/wedding";
import { Reveal } from "@/components/invitation/Reveal";
import { ChapterMark } from "@/components/invitation/ChapterMark";

type MomentsGallerySectionProps = {
  content: GalleryContent;
  chapter?: EditorialChapter;
  tone?: "canvas" | "surface";
};

function slideClass(item: GalleryItem, index: number) {
  if (index === 0) {
    return "gallery-rail-slide gallery-rail-slide--lead";
  }
  switch (item.frame) {
    case "featured":
      return "gallery-rail-slide gallery-rail-slide--featured";
    case "portrait":
      return "gallery-rail-slide gallery-rail-slide--portrait";
    case "square":
      return "gallery-rail-slide gallery-rail-slide--square";
    default:
      return "gallery-rail-slide gallery-rail-slide--landscape";
  }
}

/**
 * Álbum editorial — primera foto protagonista, ritmo de ratios.
 */
export function MomentsGallerySection({
  content,
  chapter,
  tone = "canvas",
}: MomentsGallerySectionProps) {
  const items = getFeaturedGalleryItems(content);
  if (items.length === 0) return null;

  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      id="nuestros-momentos"
      className={`${background} section-pad-y text-ink`}
      aria-labelledby="nuestros-momentos-title"
      data-testid="nuestros-momentos"
    >
      <Reveal className="mx-auto w-full max-w-[min(100%,52rem)] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))]">
        <div className="text-center">
          {chapter ? <ChapterMark chapter={chapter} className="mb-8" /> : null}
          <hr className="invite-rule mx-auto" aria-hidden="true" />
          <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.34em] text-ink-subtle">
            {content.eyebrow}
          </p>
          <h2
            id="nuestros-momentos-title"
            className="font-display mt-5 text-[clamp(2.15rem,8.5vw,3rem)] leading-[0.95] font-medium tracking-[-0.02em] text-balance"
          >
            {content.title}
          </h2>
          {content.hint ? (
            <p className="mt-4 font-sans text-[0.6875rem] tracking-[0.2em] text-ink-subtle uppercase md:hidden">
              {content.hint}
            </p>
          ) : null}
        </div>
      </Reveal>

      <div
        className="gallery-rail mt-12 min-w-0 w-full"
        data-testid="gallery-rail"
        tabIndex={0}
        role="region"
        aria-label={`${content.title}: álbum de fotografías. Desplaza horizontalmente para ver más.`}
      >
        <ul className="gallery-rail-track">
          {items.map((item, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <li key={item.id} className={slideClass(item, index)}>
                <figure className="gallery-slide-figure">
                  <div className="relative h-full w-full overflow-hidden bg-beige/40">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 430px) 88vw, (max-width: 768px) 72vw, 500px"
                      className="object-cover"
                      style={{
                        objectPosition: item.objectPosition ?? "50% 40%",
                      }}
                      loading="lazy"
                      data-testid={`gallery-photo-${item.id}`}
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
                    <span className="font-sans text-[0.625rem] font-medium tracking-[0.24em] text-ink-subtle tabular-nums">
                      {number}
                    </span>
                    {item.caption ? (
                      <span className="font-display text-[0.95rem] leading-snug text-ink-muted text-right">
                        {item.caption}
                      </span>
                    ) : (
                      <span className="sr-only">{item.alt}</span>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
