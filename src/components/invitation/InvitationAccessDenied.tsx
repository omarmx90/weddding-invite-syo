import Link from "next/link";
import { rsvpCopy } from "@/lib/rsvp/copy";

/**
 * Vista elegante cuando falta o falla el token.
 * No revela nombre de familia ni lugares.
 */
export function InvitationAccessDenied() {
  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 py-16 text-ink"
      data-testid="invitation-access-denied"
    >
      <div className="mx-auto w-full max-w-[22rem] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />
        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          Invitación
        </p>
        <h1 className="font-display mt-5 text-[clamp(1.85rem,7vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance">
          {rsvpCopy.missingTokenTitle}
        </h1>
        <p className="mt-6 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
          {rsvpCopy.missingTokenBody}
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-11 items-center justify-center border border-taupe/70 bg-warm-white px-6 py-3 font-sans text-[0.75rem] font-medium uppercase tracking-[0.24em] text-ink transition-[border-color,background-color] hover:border-taupe hover:bg-beige focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
