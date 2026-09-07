"use client";

import { useEffect, useState } from "react";
import type { CountdownContent } from "@/content/types";
import {
  getCountdownParts,
  padCountdownValue,
  type CountdownParts,
} from "@/lib/countdown";
import { Reveal } from "@/components/invitation/Reveal";

type CountdownSectionProps = {
  content: CountdownContent;
  accessibleSummary: string;
  tone?: "canvas" | "surface";
};

function msUntilNextMinuteBoundary(nowMs: number): number {
  return 60_000 - (nowMs % 60_000) + 20;
}

/**
 * Cuenta regresiva editorial — actualiza al límite del minuto (sin polling por segundo).
 * Los números visuales son decorativos; la fecha/hora se anuncia una sola vez.
 */
export function CountdownSection({
  content,
  accessibleSummary,
  tone = "canvas",
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
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="sr-only" id="countdown-title">
          {accessibleSummary}
        </p>

        {display.arrived ? (
          <p
            className="font-display mt-10 text-[clamp(1.65rem,6.5vw,2.15rem)] leading-snug text-ink text-balance"
            data-testid="countdown-arrived"
          >
            {content.arrivedMessage}
          </p>
        ) : (
          <div data-testid="countdown-active">
            <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.34em] text-ink-subtle">
              {content.preface}
            </p>

            <div
              className="mt-8 grid grid-cols-3 gap-2 sm:gap-6"
              aria-hidden="true"
              data-testid="countdown-units"
            >
              {units.map((unit, index) => (
                <div key={unit.key} className="flex flex-col items-center">
                  <p
                    className="font-display text-[clamp(2.35rem,12vw,3.75rem)] leading-none tracking-[-0.03em] text-ink tabular-nums"
                    data-testid={`countdown-${unit.key}`}
                  >
                    {unit.value}
                  </p>
                  <p className="mt-3 font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle sm:text-[0.6875rem] sm:tracking-[0.32em]">
                    {unit.label}
                  </p>
                  {index < units.length - 1 ? (
                    <span className="sr-only">·</span>
                  ) : null}
                </div>
              ))}
            </div>

            <div
              className="mx-auto mt-8 flex w-full max-w-[16rem] items-center gap-3"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-sand" />
              <span className="size-1 rounded-full bg-taupe/70" />
              <span className="h-px flex-1 bg-sand" />
            </div>

            <p className="mt-6 font-display text-[clamp(1.05rem,4vw,1.25rem)] leading-snug text-ink-muted text-balance">
              {content.suffix}
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
