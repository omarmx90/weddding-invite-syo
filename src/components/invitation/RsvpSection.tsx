"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { submitRsvp } from "@/lib/rsvp/actions";
import { formatRsvpDeadlineCopy, rsvpCopy } from "@/lib/rsvp/copy";
import { Reveal } from "@/components/invitation/Reveal";

type ExistingRsvp = {
  attending: boolean;
  confirmedSeats: number;
};

type RsvpSectionProps = {
  slug: string;
  maxSeats: number;
  deadlineIso: string;
  accessToken?: string;
  existingRsvp?: ExistingRsvp | null;
  persistenceReady: boolean;
  deadlinePassed: boolean;
  tone?: "canvas" | "surface";
};

type AttendChoice = "yes" | "no" | null;

/**
 * Confirmación de asistencia — editorial, mobile-first, sin look SaaS.
 */
export function RsvpSection({
  slug,
  maxSeats,
  deadlineIso,
  accessToken,
  existingRsvp = null,
  persistenceReady,
  deadlinePassed,
  tone = "canvas",
}: RsvpSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(!existingRsvp);
  const [attend, setAttend] = useState<AttendChoice>(
    existingRsvp ? (existingRsvp.attending ? "yes" : "no") : null,
  );
  const [seats, setSeats] = useState<number>(
    existingRsvp?.attending
      ? existingRsvp.confirmedSeats
      : Math.min(maxSeats, Math.max(1, existingRsvp?.confirmedSeats ?? 1)),
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<ExistingRsvp | null>(existingRsvp);
  const [successFlash, setSuccessFlash] = useState<string | null>(null);

  const seatOptions = useMemo(
    () => Array.from({ length: maxSeats }, (_, index) => index + 1),
    [maxSeats],
  );

  const showForm = Boolean(accessToken) && persistenceReady && !deadlinePassed && editing;

  function onSubmit() {
    setError(null);
    setSuccessFlash(null);

    if (!accessToken) {
      setError(rsvpCopy.missingTokenBody);
      return;
    }
    if (attend === null) {
      setError(rsvpCopy.validationAttend);
      return;
    }

    startTransition(async () => {
      const result = await submitRsvp({
        slug,
        accessToken,
        attending: attend === "yes",
        confirmedSeats: attend === "yes" ? seats : 0,
        message: message.trim() || undefined,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setSaved({
        attending: result.rsvp.attending,
        confirmedSeats: result.rsvp.confirmedSeats,
      });
      setSuccessFlash(
        result.rsvp.attending ? rsvpCopy.successYes : rsvpCopy.successNo,
      );
      setEditing(false);
    });
  }

  return (
    <section
      className={`${background} section-pad text-ink`}
      aria-labelledby="rsvp-title"
      data-testid="rsvp-section"
      data-rsvp-ready={persistenceReady ? "true" : "false"}
      data-rsvp-deadline-passed={deadlinePassed ? "true" : "false"}
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          {rsvpCopy.eyebrow}
        </p>

        <h2
          id="rsvp-title"
          className="font-display mt-5 text-[clamp(1.85rem,7vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance"
        >
          {rsvpCopy.title}
        </h2>

        <p
          className="mt-6 font-sans text-[0.75rem] font-medium uppercase tracking-[0.22em] text-ink-subtle text-balance"
          data-testid="rsvp-deadline"
        >
          {formatRsvpDeadlineCopy(deadlineIso)}
        </p>

        {deadlinePassed ? (
          <div className="mx-auto mt-10 max-w-[22rem]" data-testid="rsvp-deadline-passed">
            <p className="font-display text-[clamp(1.25rem,5vw,1.5rem)] leading-snug text-ink text-balance">
              {rsvpCopy.deadlinePassedTitle}
            </p>
            <p className="mt-4 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
              {rsvpCopy.deadlinePassedBody}
            </p>
          </div>
        ) : null}

        {!deadlinePassed && !persistenceReady ? (
          <div className="mx-auto mt-10 max-w-[22rem]" data-testid="rsvp-unavailable">
            <p className="font-display text-[clamp(1.25rem,5vw,1.5rem)] leading-snug text-ink text-balance">
              {rsvpCopy.unavailableTitle}
            </p>
            <p className="mt-4 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
              {rsvpCopy.unavailableBody}
            </p>
          </div>
        ) : null}

        {!deadlinePassed && persistenceReady && !accessToken ? (
          <div className="mx-auto mt-10 max-w-[22rem]" data-testid="rsvp-missing-token">
            <p className="font-display text-[clamp(1.25rem,5vw,1.5rem)] leading-snug text-ink text-balance">
              {rsvpCopy.missingTokenTitle}
            </p>
            <p className="mt-4 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
              {rsvpCopy.missingTokenBody}
            </p>
          </div>
        ) : null}

        {!deadlinePassed &&
        persistenceReady &&
        accessToken &&
        saved &&
        !editing ? (
          <div className="mx-auto mt-10 max-w-[22rem]" data-testid="rsvp-confirmed">
            <p className="font-display text-[clamp(1.35rem,5.5vw,1.7rem)] leading-snug text-ink text-balance">
              {saved.attending ? rsvpCopy.confirmedTitle : rsvpCopy.declinedTitle}
            </p>
            {saved.attending ? (
              <p
                className="mt-4 font-display text-[clamp(1.5rem,6vw,1.85rem)] tracking-[-0.02em] text-ink"
                data-testid="rsvp-seats-summary"
              >
                {rsvpCopy.seatsSummary(saved.confirmedSeats, maxSeats)}
              </p>
            ) : (
              <p className="mt-4 font-sans text-[1.0625rem] leading-relaxed text-ink-muted">
                No podrán acompañarnos
              </p>
            )}
            {successFlash ? (
              <p
                className="mt-6 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty"
                data-testid="rsvp-success-message"
              >
                {successFlash}
              </p>
            ) : null}
            <button
              type="button"
              className="mt-10 inline-flex min-h-11 min-w-[12rem] items-center justify-center border border-taupe/70 bg-warm-white px-6 py-3 font-sans text-[0.75rem] font-medium uppercase tracking-[0.24em] text-ink transition-[border-color,background-color] hover:border-taupe hover:bg-beige focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
              data-testid="rsvp-edit"
              onClick={() => {
                setEditing(true);
                setSuccessFlash(null);
                setError(null);
                setAttend(saved.attending ? "yes" : "no");
                setSeats(
                  saved.attending
                    ? saved.confirmedSeats
                    : Math.min(maxSeats, 1),
                );
              }}
            >
              {rsvpCopy.update}
            </button>
          </div>
        ) : null}

        {showForm ? (
          <div className="mx-auto mt-10 w-full max-w-[22rem]" data-testid="rsvp-form">
            <p className="font-display text-[clamp(1.25rem,5vw,1.45rem)] leading-snug text-ink text-balance">
              {rsvpCopy.question}
            </p>

            <div
              className="mt-7 flex flex-col gap-3"
              role="group"
              aria-label={rsvpCopy.question}
            >
              <ChoiceButton
                selected={attend === "yes"}
                onClick={() => {
                  setAttend("yes");
                  setError(null);
                }}
                testId="rsvp-attend-yes"
              >
                {rsvpCopy.yes}
              </ChoiceButton>
              <ChoiceButton
                selected={attend === "no"}
                onClick={() => {
                  setAttend("no");
                  setError(null);
                }}
                testId="rsvp-attend-no"
              >
                {rsvpCopy.no}
              </ChoiceButton>
            </div>

            {attend === "yes" ? (
              <div className="mt-10" data-testid="rsvp-seats">
                <p className="font-display text-[clamp(1.15rem,4.5vw,1.35rem)] leading-snug text-ink text-balance">
                  {rsvpCopy.seatsQuestion}
                </p>
                <div
                  className={`mt-6 gap-3 ${
                    maxSeats <= 2 ? "grid grid-cols-2" : "grid grid-cols-3"
                  }`}
                  role="group"
                  aria-label={rsvpCopy.seatsQuestion}
                >
                  {seatOptions.map((value) => (
                    <button
                      key={value}
                      type="button"
                      data-testid={`rsvp-seat-${value}`}
                      aria-pressed={seats === value}
                      onClick={() => {
                        setSeats(value);
                        setError(null);
                      }}
                      className={`inline-flex min-h-12 items-center justify-center border font-display text-[1.35rem] tracking-[-0.02em] transition-[border-color,background-color,color] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe ${
                        seats === value
                          ? "border-ink bg-ink text-warm-white"
                          : "border-taupe/70 bg-warm-white text-ink hover:border-taupe hover:bg-beige"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <label className="mt-10 block text-left">
              <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
                {rsvpCopy.optionalMessageLabel}
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={280}
                rows={3}
                placeholder={rsvpCopy.optionalMessagePlaceholder}
                data-testid="rsvp-message"
                className="mt-3 w-full resize-none border border-taupe/60 bg-warm-white px-4 py-3 font-sans text-[1rem] leading-relaxed text-ink placeholder:text-ink-subtle/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-taupe"
              />
            </label>

            {error ? (
              <p
                className="mt-6 font-sans text-[0.9375rem] leading-relaxed text-ink-muted text-pretty"
                role="alert"
                data-testid="rsvp-error"
              >
                {error}
              </p>
            ) : null}

            <button
              type="button"
              data-testid="rsvp-submit"
              disabled={isPending || attend === null}
              onClick={onSubmit}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center border border-taupe/80 bg-ink px-6 py-3 font-sans text-[0.75rem] font-medium uppercase tracking-[0.28em] text-warm-white transition-[opacity,transform] hover:opacity-95 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? rsvpCopy.loading : rsvpCopy.submit}
            </button>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
  testId,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-12 w-full items-center justify-center border px-5 py-3 text-center font-sans text-[0.9375rem] leading-snug transition-[border-color,background-color,color] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe ${
        selected
          ? "border-ink bg-ink text-warm-white"
          : "border-taupe/70 bg-warm-white text-ink hover:border-taupe hover:bg-beige"
      }`}
    >
      {children}
    </button>
  );
}
