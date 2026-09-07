import type { DaySchedule, ScheduleItemId } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import {
  LatinCross,
} from "@/components/invitation/ornaments";

type DayScheduleSectionProps = {
  schedule: DaySchedule;
  tone?: "canvas" | "surface";
};

function ScheduleMarker({ id }: { id: ScheduleItemId }) {
  if (id === "ceremony") {
    return <LatinCross className="h-4 w-3 text-taupe/75" />;
  }
  if (id === "reception") {
    return (
      <span className="inline-block size-1.5 rotate-45 border border-taupe/70" />
    );
  }
  if (id === "closing") {
    return (
      <span className="font-display text-[0.5rem] leading-none tracking-[0.08em] text-taupe/80">
        S&amp;O
      </span>
    );
  }
  return <span className="size-2 shrink-0 rounded-full bg-taupe/80" />;
}

/**
 * Línea temporal editorial del día — escaneable, con marcas ornamentales.
 */
export function DayScheduleSection({
  schedule,
  tone = "surface",
}: DayScheduleSectionProps) {
  if (schedule.items.length === 0) return null;

  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      id="itinerario"
      className={`${background} section-pad text-ink`}
      aria-labelledby="itinerario-title"
      data-testid="day-schedule"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)]">
        <div className="text-center">
          <hr className="invite-rule mx-auto" aria-hidden="true" />
          {schedule.eyebrow ? (
            <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
              {schedule.eyebrow}
            </p>
          ) : null}
          <h2
            id="itinerario-title"
            className="font-display mt-5 text-[clamp(2rem,8vw,2.75rem)] leading-tight font-medium tracking-[-0.01em] text-balance"
          >
            {schedule.title}
          </h2>
        </div>

        <ol className="mx-auto mt-12 max-w-[22rem] list-none p-0">
          {schedule.items.map((item, index) => {
            const isLast = index === schedule.items.length - 1;
            return (
              <li
                key={item.id}
                className="relative grid grid-cols-[1.35rem_1fr] gap-x-4 pb-10 last:pb-0"
                data-testid={`schedule-item-${item.id}`}
              >
                <div
                  className="relative flex flex-col items-center"
                  aria-hidden="true"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <ScheduleMarker id={item.id} />
                  </span>
                  {!isLast ? (
                    <span className="mt-2 w-px flex-1 bg-sand/90" />
                  ) : null}
                </div>

                <div className="min-w-0 text-left">
                  {item.time ? (
                    <p className="font-display text-[clamp(1.35rem,5vw,1.65rem)] leading-none tracking-[-0.01em] text-ink">
                      <time dateTime={item.timeDateTime}>{item.time}</time>
                    </p>
                  ) : null}
                  <h3 className="mt-3 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.22em] text-ink">
                    {item.title}
                  </h3>
                  {item.location ? (
                    <p className="mt-2 font-sans text-[0.975rem] leading-relaxed text-ink-muted text-pretty">
                      {item.location}
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-2 font-sans text-[0.9375rem] leading-relaxed text-ink-subtle text-pretty">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
