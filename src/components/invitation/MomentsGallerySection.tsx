import Image from "next/image";
import type { GalleryContent } from "@/content/types";
import { getFeaturedGalleryItems } from "@/content/wedding";
import { Reveal } from "@/components/invitation/Reveal";

type MomentsGallerySectionProps = {
  content: GalleryContent;
  tone?: "canvas" | "surface";
};

/**
 * Riel editorial horizontal con scroll-snap nativo.
 * Solo renderiza ítems `featured`; sin autoplay ni JS de slider.
 */
export function MomentsGallerySection({
  content,
  tone = "canvas",
}: MomentsGallerySectionProps) {
  const items = getFeaturedGalleryItems(content);
  if (items.length === 0) return null;

  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      id="nuestros-momentos"
      className={`${background} section-pad text-ink`}
      aria-labelledby="nuestros-momentos-title"
      data-testid="nuestros-momentos"
    >
      <Reveal className="mx-auto w-full max-w-[min(100%,48rem)]">
        <div className="text-center">
          <hr className="invite-rule mx-auto" aria-hidden="true" />
          <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
            {content.eyebrow}
          </p>
          <h2
            id="nuestros-momentos-title"
            className="font-display mt-5 text-[clamp(2rem,8vw,2.75rem)] leading-tight font-medium tracking-[-0.01em] text-balance"
          >
            {content.title}
          </h2>
          {content.hint ? (
            <p className="mt-4 font-sans text-[0.75rem] tracking-[0.18em] text-ink-subtle uppercase md:hidden">
              {content.hint}
            </p>
          ) : null}
        </div>

        <div
          className="gallery-rail mt-10 min-w-0 max-w-full"
          data-testid="gallery-rail"
          tabIndex={0}
          role="region"
          aria-label={`${content.title}: galería de fotografías. Desplaza horizontalmente para ver más.`}
        >
          <ul className="gallery-rail-track">
            {items.map((item) => (
              <li key={item.id} className="gallery-rail-slide">
                <figure className="relative h-full w-full overflow-hidden bg-beige/40 ring-1 ring-sand/40">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 430px) 78vw, (max-width: 768px) 70vw, 420px"
                    className="object-cover"
                    style={{
                      objectPosition: item.objectPosition ?? "50% 50%",
                    }}
                    loading="lazy"
                  />
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
