import Image from "next/image";
import type {
  EventLocation,
  ReceptionHospitalityContent,
  WeddingMediaAsset,
} from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import {
  BotanicalSprig,
  LatinCross,
  OrnamentalDivider,
} from "@/components/invitation/ornaments";
import { SectionEndMark } from "@/components/invitation/SectionEndMark";

type EventSectionProps = {
  event: EventLocation;
  sectionId: string;
  tone?: "canvas" | "surface";
  /** Foto editorial debajo del CTA Cómo llegar */
  detail?: WeddingMediaAsset;
  /** Notas editoriales de la celebración (solo recepción) */
  hospitality?: ReceptionHospitalityContent;
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

function ReceptionHospitality({
  hospitality,
}: {
  hospitality: ReceptionHospitalityContent;
}) {
  return (
    <div
      className="mx-auto mt-12 w-full max-w-[22rem] text-center md:mt-14"
      data-testid="reception-hospitality"
    >
      <OrnamentalDivider className="text-taupe/65" motif="sprig" />

      <p
        className="mt-9 font-sans text-[1.0625rem] leading-[1.75] text-ink-muted text-pretty"
        data-testid="reception-hospitality-lead"
      >
        {hospitality.lead}
      </p>

      <p
        className="mt-5 font-sans text-[1.0625rem] leading-[1.75] text-ink-muted text-pretty"
        data-testid="reception-hospitality-food"
      >
        {hospitality.food}
      </p>

      <div
        className="mx-auto mt-10 flex w-full max-w-[12rem] items-center gap-3"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-sand" />
        <span className="size-1 rounded-full bg-taupe/65" />
        <span className="h-px flex-1 bg-sand" />
      </div>

      <BotanicalSprig className="mx-auto mt-10 h-4 w-14 text-taupe/50" />

      <p
        className="mt-6 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-ink-subtle"
        data-testid="reception-children-title"
      >
        {hospitality.childrenTitle}
      </p>

      <p
        className="mt-4 font-sans text-[1.0625rem] leading-[1.75] text-ink-muted text-pretty"
        data-testid="reception-children-body"
      >
        {hospitality.childrenBody}
      </p>

      <p
        className="mt-10 font-sans text-[0.9375rem] leading-[1.7] text-ink-subtle text-pretty"
        data-testid="reception-drinks-note"
      >
        {hospitality.drinksNote}
      </p>
    </div>
  );
}

export function EventSection({
  event,
  sectionId,
  tone = "canvas",
  detail,
  hospitality,
}: EventSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const hasMaps = Boolean(event.mapsUrl.trim());
  const hasEditorialDate = Boolean(event.date);
  const isCeremony = sectionId === "ceremony";
  const isReception = sectionId === "reception";
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
        {isCeremony ? (
          <LatinCross className="mx-auto h-6 w-4 text-taupe/65" />
        ) : isReception ? (
          <BotanicalSprig className="mx-auto h-5 w-16 text-taupe/55" />
        ) : (
          <hr className="invite-rule mx-auto" aria-hidden="true" />
        )}

        <h2
          id={`${sectionId}-title`}
          className={`font-display leading-tight font-medium tracking-[-0.01em] text-balance ${
            isCeremony || isReception
              ? "mt-7 text-[clamp(2rem,8vw,2.75rem)]"
              : "mt-10 text-[clamp(2rem,8vw,2.75rem)]"
          }`}
        >
          {event.title}
        </h2>

        {event.body && !hospitality ? (
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
        ) : null}

        {!hasEditorialDate ? (
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
        ) : null}

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

        {hospitality ? <ReceptionHospitality hospitality={hospitality} /> : null}
      </Reveal>

      {detail ? (
        <figure
          className={`relative mx-auto mt-14 w-full overflow-hidden bg-beige/40 md:mt-16 ${
            detail.height && detail.width && detail.height > detail.width
              ? "max-w-[min(100%,26rem)]"
              : "max-w-[min(100%,40rem)]"
          }`}
          data-testid={`${sectionId}-detail-photo`}
        >
          <div
            className={`relative w-full ${
              detail.height && detail.width && detail.height > detail.width
                ? "aspect-[2/3]"
                : "aspect-[3/2]"
            }`}
          >
            <Image
              src={detail.src}
              alt={detail.alt}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              style={{
                objectPosition: detail.objectPosition ?? "50% 45%",
              }}
              loading="lazy"
            />
          </div>
        </figure>
      ) : null}

      <SectionEndMark />
    </section>
  );
}
