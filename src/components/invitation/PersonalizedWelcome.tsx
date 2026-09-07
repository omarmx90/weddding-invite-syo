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

function splitFamilyName(displayName: string): { prefix: string; rest: string } {
  const match = displayName.match(/^(Familia)\s+(.+)$/i);
  if (match) {
    return { prefix: match[1], rest: match[2] };
  }
  return { prefix: "", rest: displayName };
}

/**
 * Saludo editorial — el nombre de familia como pieza tipográfica.
 */
export function PersonalizedWelcome({
  guest,
  tone = "surface",
}: PersonalizedWelcomeProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const seatsLabel = formatReservedSeats(guest.seats);
  const { prefix, rest } = splitFamilyName(guest.displayName);

  return (
    <section
      className={`${background} section-pad text-ink`}
      aria-labelledby="personalized-welcome-title"
      data-testid="personalized-welcome"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.34em] text-ink-subtle">
          {personalizationCopy.eyebrow}
        </p>

        <h2
          id="personalized-welcome-title"
          className="font-display mt-6 text-ink"
          data-testid="personalized-guest-name"
        >
          {prefix ? (
            <>
              <span className="block text-[0.75rem] font-sans font-medium uppercase tracking-[0.36em] text-ink-subtle">
                {prefix}
              </span>
              {/* Espacio en el árbol de texto: el nombre accesible sigue siendo "Familia …" */}
              {" "}
              <span className="mt-3 block text-[clamp(2rem,8.5vw,2.85rem)] leading-[0.95] font-medium tracking-[-0.02em] uppercase text-balance">
                {rest}
              </span>
            </>
          ) : (
            <span className="block text-[clamp(1.85rem,7vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance">
              {guest.displayName}
            </span>
          )}
        </h2>

        <div className="mx-auto mt-10 max-w-[16rem]">
          <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            {personalizationCopy.reservedPreface}
          </p>
          <p
            className="font-display mt-3 text-[clamp(2rem,8vw,2.65rem)] leading-none tracking-[-0.03em] text-ink"
            data-testid="personalized-seats"
          >
            {seatsLabel}
          </p>
          <p className="mt-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            {personalizationCopy.reservedSuffix}
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-[20rem] font-sans text-[1.0625rem] leading-relaxed text-ink-muted text-pretty">
          {personalizationCopy.warmLine}
        </p>
      </Reveal>
    </section>
  );
}
