"use client";

import { useId, useState } from "react";
import type { WeddingContent } from "@/content/types";
import { getWeddingCalendarPayload } from "@/lib/calendar/from-wedding";
import {
  buildGoogleCalendarUrl,
  buildWeddingIcs,
  downloadIcsFile,
} from "@/lib/calendar/wedding-event";
import { BotanicalSprig } from "@/components/invitation/ornaments";

type SaveTheDateProps = {
  content: WeddingContent;
};

/**
 * Guardar la fecha — Google Calendar + .ics (Apple/Outlook).
 */
export function SaveTheDate({ content }: SaveTheDateProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const payload = getWeddingCalendarPayload(content);
  const googleUrl = buildGoogleCalendarUrl(payload);

  const linkClass =
    "inline-flex min-h-11 min-w-[12rem] items-center justify-center px-3 py-2.5 font-sans text-[0.75rem] font-medium tracking-[0.22em] text-ink uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe";

  return (
    <div
      className="mx-auto mt-12 w-full max-w-[18rem] text-center"
      data-testid="save-the-date"
    >
      <BotanicalSprig className="mx-auto h-4 w-14 text-taupe/50" />

      <p className="mt-7 font-display text-[clamp(1.2rem,4.5vw,1.4rem)] tracking-[0.2em] text-ink">
        <time dateTime={content.date.iso}>{content.date.display}</time>
      </p>
      <p className="mt-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-ink-subtle">
        {content.copy.locationLabel}
      </p>

      <button
        type="button"
        className="mt-8 inline-flex min-h-11 min-w-[12rem] items-center justify-center border border-taupe/70 bg-transparent px-6 py-3 font-sans text-[0.75rem] font-medium tracking-[0.28em] text-ink uppercase transition-[border-color,background-color] hover:border-taupe hover:bg-beige/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
        aria-expanded={open}
        aria-controls={panelId}
        data-testid="save-the-date-toggle"
        onClick={() => setOpen((value) => !value)}
      >
        Guardar la fecha
      </button>

      {open ? (
        <div
          id={panelId}
          className="mt-5 flex flex-col items-center gap-1"
          data-testid="save-the-date-options"
          role="region"
          aria-label="Opciones para guardar la fecha en el calendario"
        >
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            data-testid="calendar-google"
          >
            <span className="border-b border-taupe/55 pb-0.5">Google Calendar</span>
          </a>
          <button
            type="button"
            className={linkClass}
            data-testid="calendar-ics"
            onClick={() => {
              const ics = buildWeddingIcs(payload);
              downloadIcsFile("boda-silvia-y-omar.ics", ics);
            }}
          >
            <span className="border-b border-taupe/55 pb-0.5">
              Apple / Outlook (.ics)
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
