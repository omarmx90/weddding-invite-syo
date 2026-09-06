import type { EventLocation } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";

type EventSectionProps = {
  event: EventLocation;
  sectionId: string;
  tone?: "canvas" | "surface";
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
        {label}
      </dt>
      <dd className="font-sans text-[1.0625rem] leading-relaxed text-ink">{value}</dd>
    </div>
  );
}

export function EventSection({
  event,
  sectionId,
  tone = "canvas",
}: EventSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const hasMaps = Boolean(event.mapsUrl.trim());
  const ctaClassName =
    "group inline-flex min-h-11 items-center justify-center px-1 py-3 font-sans text-[0.8125rem] font-medium tracking-[0.2em] text-ink uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe";

  return (
    <section
      id={sectionId}
      className={`${background} section-pad text-ink`}
      aria-labelledby={`${sectionId}-title`}
      data-testid={sectionId}
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <h2
          id={`${sectionId}-title`}
          className="font-display mt-10 text-[clamp(2rem,8vw,2.75rem)] leading-tight font-medium tracking-[-0.01em] text-balance"
        >
          {event.title}
        </h2>

        {event.dateLabel ? (
          <p className="mt-5 font-display text-[1.125rem] tracking-wide text-ink-muted">
            {event.dateLabel}
          </p>
        ) : null}

        <dl className="mt-12 flex flex-col gap-9 text-center">
          <DetailRow label={event.timeLabel} value={event.time} />
          <DetailRow label={event.venueLabel} value={event.venue} />
          <DetailRow label={event.addressLabel} value={event.address} />
        </dl>

        <div className="mt-12">
          {hasMaps ? (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClassName}
            >
              <span className="border-b border-taupe/60 pb-1 transition-[border-color] group-hover:border-taupe">
                {event.ctaLabel}
              </span>
            </a>
          ) : (
            <button type="button" className={ctaClassName} aria-disabled="true">
              <span className="border-b border-taupe/50 pb-1 opacity-90">
                {event.ctaLabel}
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
