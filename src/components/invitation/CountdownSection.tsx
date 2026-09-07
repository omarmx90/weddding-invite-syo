"use client";

import { useEffect, useState } from "react";
import type { CountdownContent } from "@/content/types";
import type { EditorialChapter } from "@/content/editorial-types";
import {
  getCountdownParts,
  padCountdownValue,
  type CountdownParts,
} from "@/lib/countdown";
import { Reveal } from "@/components/invitation/Reveal";
import { ChapterMark } from "@/components/invitation/ChapterMark";
import { SaveTheDate } from "@/components/invitation/SaveTheDate";
import type { WeddingContent } from "@/content/types";

type CountdownSectionProps = {
  content: CountdownContent;
  accessibleSummary: string;
  chapter?: EditorialChapter;
  tone?: "canvas" | "surface";
  /** Contenido completo para Guardar la fecha */
  wedding: WeddingContent;
};

function msUntilNextMinuteBoundary(nowMs: number): number {
  return 60_000 - (nowMs % 60_000) + 20;
}

/**
 * Cuenta regresiva editorial — tipografía Didone grande, labels mínimos.
 */
export function CountdownSection({
  content,
  accessibleSummary,
  chapter,
  tone = "canvas",
  wedding,
}: CountdownSectionProps) {
  const [parts, setParts] = useState<CountdownParts | null>(null);
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const update = () => {
      setParts(
        getCountdownParts(
          Date.now(),
          content.targetIsoDate,
          content.targetTime,
          content.timezone,
        ),
      );
    };

    update();
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60_000);
    }, msUntilNextMinuteBoundary(Date.now()));

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [content.targetIsoDate, content.targetTime, content.timezone]);

  const mounted = parts !== null;
  const display: CountdownParts = parts ?? {
    days: 0,
    hours: 0,
    minutes: 0,
    arrived: false,
  };

  const units = [
    {
      key: "days",
      value: mounted ? String(display.days) : "—",
      label: content.labels.days,
    },
    {
      key: "hours",
      value: mounted ? padCountdownValue(display.hours) : "—",
      label: content.labels.hours,
    },
    {
      key: "minutes",
      value: mounted ? padCountdownValue(display.minutes) : "—",
      label: content.labels.minutes,
    },
  ] as const;

  return (
    <section
      className={`${background} section-pad text-ink`}
      aria-labelledby="countdown-title"
      data-testid="countdown-section"
      data-target-date={content.targetIsoDate}
      data-target-time={content.targetTime}
      data-timezone={content.timezone}
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        {chapter ? <ChapterMark chapter={chapter} className="mb-8" /> : null}
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="sr-only" id="countdown-title">
          {accessibleSummary}
        </p>

        {display.arrived ? (
          <p
            className="font-display mt-10 text-[clamp(1.75rem,7vw,2.35rem)] leading-snug text-ink text-balance"
            data-testid="countdown-arrived"
          >
            {content.arrivedMessage}
          </p>
        ) : (
          <div data-testid="countdown-active">
            <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.36em] text-ink-subtle">
              {content.preface}
            </p>

            <div
              className="mt-9 grid grid-cols-3 gap-1 sm:gap-5"
              aria-hidden="true"
              data-testid="countdown-units"
            >
              {units.map((unit) => (
                <div key={unit.key} className="flex flex-col items-center">
                  <p
                    className="font-display countdown-value text-ink"
                    data-testid={`countdown-${unit.key}`}
                  >
                    {unit.value}
                  </p>
                  <p className="countdown-label">{unit.label}</p>
                </div>
              ))}
            </div>

            <div
              className="mx-auto mt-9 flex w-full max-w-[14rem] items-center gap-3"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-sand" />
              <span className="size-1 rounded-full bg-taupe/70" />
              <span className="h-px flex-1 bg-sand" />
            </div>

            <p className="mt-6 font-display text-[clamp(1.1rem,4.2vw,1.3rem)] leading-snug tracking-[0.02em] text-ink-muted text-balance">
              {content.suffix}
            </p>
          </div>
        )}

        <SaveTheDate content={wedding} />
      </Reveal>
    </section>
  );
}
