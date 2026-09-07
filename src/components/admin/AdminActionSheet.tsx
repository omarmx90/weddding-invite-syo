"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

type AdminActionSheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  testId?: string;
};

/**
 * Bottom sheet ligero para acciones secundarias en móvil.
 * Sin dependencias externas; Escape + focus return.
 */
export function AdminActionSheet({
  open,
  title,
  onClose,
  children,
  testId = "admin-action-sheet",
}: AdminActionSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      );
      first?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" data-testid={testId}>
      <button
        type="button"
        className="absolute inset-0 bg-ink/35"
        aria-label="Cerrar menú"
        data-testid="admin-action-sheet-backdrop"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto border-t border-taupe/40 bg-warm-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-none sm:inset-x-auto sm:bottom-8 sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:border sm:border-taupe/40"
        data-testid="admin-action-sheet-panel"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-taupe/50 sm:hidden" aria-hidden="true" />
        <div className="flex items-center justify-between gap-3">
          <h2
            id={titleId}
            className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink-subtle"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-testid="admin-action-sheet-close"
            className="inline-flex min-h-11 min-w-11 items-center justify-center font-sans text-[0.75rem] uppercase tracking-[0.16em] text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
          >
            Cerrar
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-2 pb-2">{children}</div>
      </div>
    </div>
  );
}
