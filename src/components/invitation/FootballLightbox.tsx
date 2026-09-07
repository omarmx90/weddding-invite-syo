"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import type { FootballGalleryItem } from "@/content/types";

type FootballLightboxProps = {
  items: FootballGalleryItem[];
  openIndex: number | null;
  galleryTitle: string;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
};

/**
 * Lightbox fullscreen — swipe, teclado, foco y sin scroll del body.
 */
export function FootballLightbox({
  items,
  openIndex,
  galleryTitle,
  onClose,
  onChangeIndex,
}: FootballLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();
  const open = openIndex !== null && items[openIndex] != null;
  const item = openIndex !== null ? items[openIndex] : null;

  const goPrev = useCallback(() => {
    if (openIndex === null || items.length === 0) return;
    onChangeIndex((openIndex - 1 + items.length) % items.length);
  }, [items.length, onChangeIndex, openIndex]);

  const goNext = useCallback(() => {
    if (openIndex === null || items.length === 0) return;
    onChangeIndex((openIndex + 1) % items.length);
  }, [items.length, onChangeIndex, openIndex]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose, open]);

  if (!open || !item || openIndex === null) return null;

  const counter = `${openIndex + 1} / ${items.length}`;

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-testid="football-lightbox"
      className="fixed inset-0 z-[80] flex flex-col bg-ink/92 text-warm-white"
      onKeyDown={onDialogKeyDown}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return;
        if (delta > 0) goPrev();
        else goNext();
      }}
    >
      <div className="flex items-center justify-between gap-3 px-[max(1rem,env(safe-area-inset-left))] pt-[max(0.85rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))]">
        <div className="min-w-0">
          <p
            id={titleId}
            className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-warm-white/75"
          >
            {galleryTitle}
          </p>
          <p
            className="mt-1 font-sans text-[0.75rem] tracking-[0.18em] text-warm-white/55 tabular-nums"
            data-testid="football-lightbox-counter"
          >
            {counter}
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-warm-white/35 px-3 font-sans text-[0.6875rem] font-medium tracking-[0.22em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-white"
          aria-label="Cerrar galería"
          data-testid="football-lightbox-close"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>

      <div className="relative mx-auto flex min-h-0 w-full max-w-[min(100%,56rem)] flex-1 items-center justify-center px-3 py-4">
        <div className="relative aspect-[3/4] w-full max-h-[min(72svh,780px)] md:aspect-[3/2]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-[max(1rem,env(safe-area-inset-left))] pb-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))] pr-[max(1rem,env(safe-area-inset-right))]">
        <button
          type="button"
          className="inline-flex min-h-11 min-w-[6.5rem] items-center justify-center font-sans text-[0.75rem] font-medium tracking-[0.22em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-white"
          aria-label="Fotografía anterior"
          data-testid="football-lightbox-prev"
          onClick={goPrev}
        >
          Anterior
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-[6.5rem] items-center justify-center font-sans text-[0.75rem] font-medium tracking-[0.22em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-white"
          aria-label="Fotografía siguiente"
          data-testid="football-lightbox-next"
          onClick={goNext}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
