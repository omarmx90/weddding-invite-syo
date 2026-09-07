import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitación no encontrada",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * 404 editorial — branding cálido, sin detalles internos.
 */
export default function NotFound() {
  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-[max(1.35rem,env(safe-area-inset-left))] pr-[max(1.35rem,env(safe-area-inset-right))] py-[max(3rem,env(safe-area-inset-top))] text-center text-ink"
      data-testid="not-found"
    >
      <hr className="invite-rule" aria-hidden="true" />

      <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
        Silvia & Omar
      </p>

      <h1 className="font-display mt-5 max-w-[20rem] text-[clamp(1.85rem,7vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance">
        No encontramos esta invitación
      </h1>

      <p className="mt-6 max-w-[22rem] font-sans text-[1.0625rem] leading-relaxed text-ink-muted text-pretty">
        Revisa el enlace que recibiste. Si el problema continúa, escríbenos y
        con gusto te ayudamos.
      </p>

      <Link
        href="/"
        className="mt-12 inline-flex min-h-11 items-center justify-center px-2 py-3 font-sans text-[0.8125rem] font-medium tracking-[0.2em] text-ink uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
      >
        <span className="border-b border-taupe/60 pb-1">Ir al inicio</span>
      </Link>
    </main>
  );
}
