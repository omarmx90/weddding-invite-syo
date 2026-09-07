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
      <dd className="font-sans text-[1.0625rem] leading-relaxed text-ink text-pretty">
        {value}
      </dd>
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
  const hasEditorialDate = Boolean(event.date);
  const ctaClassName =
    "group inline-flex min-h-11 min-w-[11rem] items-center justify-center px-2 py-3 font-sans text-[0.8125rem] font-medium tracking-[0.2em] text-ink uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe";

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

        {event.body ? (
          <p className="mx-auto mt-6 max-w-[22rem] font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
            {event.body}
          </p>
        ) : null}

        {hasEditorialDate && event.date ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.34em] text-ink-subtle">
              {event.date.weekday}
            </p>
            <p className="font-display text-[clamp(1.35rem,5.5vw,1.75rem)] leading-snug text-ink text-balance">
              {event.date.dayMonthYear}
            </p>
            <p
              className="mt-4 font-display text-[clamp(1.85rem,8vw,2.65rem)] leading-none tracking-[-0.02em] text-ink"
              data-testid={`${sectionId}-time`}
            >
              <time dateTime={event.timeDateTime}>{event.time}</time>
            </p>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-2">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
              {event.timeLabel}
            </p>
            <p
              className="font-display text-[clamp(1.85rem,8vw,2.65rem)] leading-none tracking-[-0.02em] text-ink"
              data-testid={`${sectionId}-time`}
            >
              <time dateTime={event.timeDateTime}>{event.time}</time>
            </p>
          </div>
        )}

        <dl className="mt-12 flex flex-col gap-9 text-center">
          <DetailRow label={event.venueLabel} value={event.venue} />
          <DetailRow label={event.addressLabel} value={event.address} />
        </dl>

        {hasMaps ? (
          <div className="mt-12">
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClassName}
              aria-label={`${event.ctaLabel}: abrir ubicación en Google Maps`}
              data-testid={`${sectionId}-maps-cta`}
            >
              <span className="border-b border-taupe/60 pb-1 transition-[border-color] group-hover:border-taupe">
                {event.ctaLabel}
              </span>
            </a>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
