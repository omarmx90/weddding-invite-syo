"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

type GalleryRailProps = {
  children: ReactNode;
  itemCount: number;
  /** Accessible name for the scroll region */
  ariaLabel: string;
  testId: string;
  /** Swipe hint before first interaction */
  hint?: string;
  className?: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Riel editorial con peek, contador activo y hint de swipe.
 * Scroll nativo; índice activo por proximidad al snap (sin librería).
 */
export function GalleryRail({
  children,
  itemCount,
  ariaLabel,
  testId,
  hint = "Desliza para descubrir",
  className = "",
}: GalleryRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const liveId = useId();
  const rafRef = useRef<number | null>(null);

  const atStart = activeIndex <= 0;
  const atEnd = activeIndex >= itemCount - 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const resolveActiveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail || itemCount === 0) return;
    const slides = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-gallery-slide]"),
    );
    if (slides.length === 0) return;

    const target = rail.scrollLeft;
    let bestIndex = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    for (const slide of slides) {
      const index = Number(slide.dataset.gallerySlide);
      if (!Number.isFinite(index)) continue;
      const dist = Math.abs(slide.offsetLeft - target);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = index;
      }
    }

    // Near the end, prefer the last slide when mostly scrolled through.
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    if (maxScroll > 0 && rail.scrollLeft >= maxScroll - 8) {
      bestIndex = slides.length - 1;
    }

    setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
  }, [itemCount]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        resolveActiveIndex();
        setInteracted(true);
      });
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    resolveActiveIndex();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [resolveActiveIndex]);

  const markInteracted = useCallback(() => {
    setInteracted(true);
  }, []);

  const scrollBySlide = useCallback(
    (direction: -1 | 1) => {
      const rail = railRef.current;
      if (!rail) return;
      markInteracted();
      const slide = rail.querySelector<HTMLElement>("[data-gallery-slide]");
      const delta =
        (slide?.getBoundingClientRect().width ?? rail.clientWidth * 0.8) + 16;
      rail.scrollBy({ left: direction * delta, behavior: "smooth" });
    },
    [markInteracted],
  );

  const showFullHint = !interacted && !atEnd;
  const showArrow = !atEnd;

  return (
    <div className={`gallery-rail-shell ${className}`.trim()}>
      <div
        ref={railRef}
        className="gallery-rail min-w-0 w-full"
        data-testid={testId}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
      >
        <ul className="gallery-rail-track">{children}</ul>
      </div>

      <div className="gallery-rail-chrome" data-testid={`${testId}-chrome`}>
        <p
          id={liveId}
          className="gallery-rail-counter font-display tabular-nums"
          data-testid={`${testId}-counter`}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">
            Fotografía {activeIndex + 1} de {itemCount}.{" "}
          </span>
          <span aria-hidden="true">
            {pad(activeIndex + 1)}
            <span className="gallery-rail-counter-sep"> / </span>
            {pad(itemCount)}
          </span>
        </p>

        <div className="gallery-rail-hint-row">
          {showFullHint ? (
            <p
              className={`gallery-rail-hint ${reducedMotion ? "" : "gallery-rail-hint--pulse"}`}
              data-testid={`${testId}-hint`}
            >
              <span>{hint}</span>
              <span
                className={`gallery-rail-hint-arrow ${reducedMotion ? "" : "gallery-rail-hint-arrow--nudge"}`}
                aria-hidden="true"
              >
                →
              </span>
            </p>
          ) : showArrow ? (
            <p
              className="gallery-rail-hint gallery-rail-hint--quiet"
              data-testid={`${testId}-hint`}
              aria-hidden="true"
            >
              <span className="gallery-rail-hint-arrow">→</span>
            </p>
          ) : (
            <p
              className="gallery-rail-hint gallery-rail-hint--quiet"
              data-testid={`${testId}-hint`}
              data-at-end="true"
            >
              <span className="sr-only">Última fotografía del álbum.</span>
            </p>
          )}

          <div className="gallery-rail-desktop-nav">
            <button
              type="button"
              className="gallery-rail-nav-btn"
              aria-label="Foto anterior"
              data-testid={`${testId}-prev`}
              disabled={atStart}
              onClick={() => scrollBySlide(-1)}
            >
              ←
            </button>
            <button
              type="button"
              className="gallery-rail-nav-btn"
              aria-label="Foto siguiente"
              data-testid={`${testId}-next`}
              disabled={atEnd}
              onClick={() => scrollBySlide(1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Marca cada slide para el índice activo. */
export function GalleryRailSlide({
  index,
  className,
  children,
}: {
  index: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <li className={className} data-gallery-slide={index}>
      {children}
    </li>
  );
}
