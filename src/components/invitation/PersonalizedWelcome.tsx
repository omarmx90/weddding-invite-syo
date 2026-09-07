import type { GuestInvitation } from "@/content/guest-types";
import {
  formatReservedSeats,
  personalizationCopy,
} from "@/content/guests";
import { Reveal } from "@/components/invitation/Reveal";

type PersonalizedWelcomeProps = {
  guest: GuestInvitation;
  tone?: "canvas" | "surface";
};

/**
 * Saludo editorial al inicio de la invitación personalizada.
 */
export function PersonalizedWelcome({
  guest,
  tone = "surface",
}: PersonalizedWelcomeProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const seatsLabel = formatReservedSeats(guest.seats);

  return (
    <section
      className={`${background} section-pad text-ink`}
      aria-labelledby="personalized-welcome-title"
      data-testid="personalized-welcome"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          {personalizationCopy.eyebrow}
        </p>

        <h2
          id="personalized-welcome-title"
          className="font-display mt-5 text-[clamp(1.85rem,7vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance"
          data-testid="personalized-guest-name"
        >
          {guest.displayName}
        </h2>

        <p className="mt-8 font-sans text-[0.75rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
          {personalizationCopy.reservedPreface}
        </p>

        <p
          className="font-display mt-3 text-[clamp(1.75rem,7vw,2.35rem)] leading-none tracking-[-0.02em] text-ink"
          data-testid="personalized-seats"
        >
          {seatsLabel}
        </p>

        <p className="mt-3 font-sans text-[0.75rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
          {personalizationCopy.reservedSuffix}
        </p>

        <p className="mx-auto mt-8 max-w-[20rem] font-sans text-[1.0625rem] leading-relaxed text-ink-muted text-pretty">
          {personalizationCopy.warmLine}
        </p>
      </Reveal>
    </section>
  );
}
