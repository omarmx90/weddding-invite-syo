import {
  formatRsvpDeadlineLabel,
  rsvpComingSoonCopy,
} from "@/content/guests";
import { Reveal } from "@/components/invitation/Reveal";

type RsvpComingSoonSectionProps = {
  deadlineIso: string;
  tone?: "canvas" | "surface";
};

/**
 * Aviso elegante de RSVP futuro — sin botón falso ni formulario simulado.
 */
export function RsvpComingSoonSection({
  deadlineIso,
  tone = "surface",
}: RsvpComingSoonSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      className={`${background} section-pad text-ink`}
      aria-labelledby="rsvp-coming-soon-title"
      data-testid="rsvp-coming-soon"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          Próximamente
        </p>

        <h2
          id="rsvp-coming-soon-title"
          className="font-display mt-5 text-[clamp(1.85rem,7vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance"
        >
          {rsvpComingSoonCopy.title}
        </h2>

        <p className="mx-auto mt-6 max-w-[22rem] font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
          {rsvpComingSoonCopy.body}
        </p>

        <p
          className="mt-8 font-sans text-[0.75rem] font-medium uppercase tracking-[0.22em] text-ink-subtle text-balance"
          data-testid="rsvp-deadline"
        >
          {formatRsvpDeadlineLabel(deadlineIso)}
        </p>
      </Reveal>
    </section>
  );
}
