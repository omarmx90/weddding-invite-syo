"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { wedding } from "@/content/wedding";
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
  const reduceMotion = useReducedMotion();
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

  const ceremonyMapsUrl = wedding.event.ceremony.mapsUrl.trim();
  const celebrationMapsUrl = wedding.event.reception.mapsUrl.trim();

  const showForm =
    Boolean(accessToken) && persistenceReady && !deadlinePassed && editing;

  function onSubmit() {
    if (isPending) return;

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

        <p className="mt-7 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          {rsvpCopy.eyebrow}
        </p>

        <h2
          id="rsvp-title"
          className="font-display mx-auto mt-2.5 max-w-[12em] text-[clamp(1.45rem,5.2vw,2.05rem)] leading-[1.16] font-medium tracking-[-0.01em] text-balance"
        >
          {rsvpCopy.title}
        </h2>

        <p
          className="mt-3.5 font-sans text-[0.75rem] font-medium uppercase tracking-[0.22em] text-ink-subtle text-balance"
          data-testid="rsvp-deadline"
        >
          {formatRsvpDeadlineCopy(deadlineIso)}
        </p>

        {deadlinePassed ? (
          <div
            className="mx-auto mt-8 max-w-[22rem]"
            data-testid="rsvp-deadline-passed"
          >
            <p className="font-display text-[clamp(1.25rem,5vw,1.5rem)] leading-snug text-ink text-balance">
              {rsvpCopy.deadlinePassedTitle}
            </p>
            <p className="mt-4 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
              {rsvpCopy.deadlinePassedBody}
            </p>
          </div>
        ) : null}

        {!deadlinePassed && !persistenceReady ? (
          <div
            className="mx-auto mt-8 max-w-[22rem]"
            data-testid="rsvp-unavailable"
          >
            <p className="font-display text-[clamp(1.25rem,5vw,1.5rem)] leading-snug text-ink text-balance">
              {rsvpCopy.unavailableTitle}
            </p>
            <p className="mt-4 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty">
              {rsvpCopy.unavailableBody}
            </p>
          </div>
        ) : null}

        {!deadlinePassed && persistenceReady && !accessToken ? (
          <div
            className="mx-auto mt-8 max-w-[22rem]"
            data-testid="rsvp-missing-token"
          >
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
          <ConfirmedState
            saved={saved}
            maxSeats={maxSeats}
            successFlash={successFlash}
            ceremonyMapsUrl={ceremonyMapsUrl}
            celebrationMapsUrl={celebrationMapsUrl}
            reduceMotion={Boolean(reduceMotion)}
            onEdit={() => {
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
          />
        ) : null}

        {showForm ? (
          <div
            className="mx-auto mt-6 w-full max-w-[22rem]"
            data-testid="rsvp-form"
          >
            <p className="font-display text-[clamp(1.15rem,4.5vw,1.35rem)] leading-snug text-ink text-balance">
              {rsvpCopy.question}
            </p>

            <div
              className="mt-4 flex flex-col gap-2.5"
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
              <div className="mt-6" data-testid="rsvp-seats">
                <p className="font-display text-[clamp(1.05rem,4vw,1.22rem)] leading-snug text-ink text-balance">
                  {rsvpCopy.seatsQuestion}
                </p>
                <div
                  className={`mt-3.5 gap-2.5 ${
                    maxSeats <= 2 ? "grid grid-cols-2" : "grid grid-cols-3"
                  }`}
                  role="group"
                  aria-label={rsvpCopy.seatsQuestion}
                >
                  {seatOptions.map((value) => {
                    const selected = seats === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        data-testid={`rsvp-seat-${value}`}
                        aria-pressed={selected}
                        onClick={() => {
                          setSeats(value);
                          setError(null);
                        }}
                        className={`inline-flex min-h-11 items-center justify-center border font-display text-[1.28rem] tracking-[-0.02em] transition-[border-color,background-color,color,transform] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe active:scale-[0.98] ${
                          selected
                            ? "border-ink/85 bg-beige/70 text-ink"
                            : "border-taupe/50 bg-transparent text-ink-muted hover:border-taupe hover:bg-beige/40 hover:text-ink"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <label className="mt-6 block text-left">
              <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
                {rsvpCopy.optionalMessageLabel}
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={280}
                rows={2}
                placeholder={rsvpCopy.optionalMessagePlaceholder}
                data-testid="rsvp-message"
                className="mt-2 max-h-[6.75rem] min-h-[3.5rem] w-full resize-none overflow-y-auto border border-taupe/40 bg-warm-white/70 px-3.5 py-2 font-sans text-[0.9375rem] leading-relaxed text-ink placeholder:text-ink-subtle/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-taupe"
              />
            </label>

            {error ? (
              <p
                className="mt-4 font-sans text-[0.9375rem] leading-relaxed text-ink-muted text-pretty"
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
              aria-busy={isPending}
              onClick={onSubmit}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center border border-ink/80 bg-ink px-6 py-3.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-warm-white transition-[opacity,transform,background-color] hover:opacity-95 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="inline-flex min-h-[1.25rem] items-center">
                {isPending ? rsvpCopy.loading : rsvpCopy.submit}
              </span>
            </button>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}

function ConfirmedState({
  saved,
  maxSeats,
  successFlash,
  ceremonyMapsUrl,
  celebrationMapsUrl,
  reduceMotion,
  onEdit,
}: {
  saved: ExistingRsvp;
  maxSeats: number;
  successFlash: string | null;
  ceremonyMapsUrl: string;
  celebrationMapsUrl: string;
  reduceMotion: boolean;
  onEdit: () => void;
}) {
  return (
    <motion.div
      className="mx-auto mt-6 max-w-[22rem]"
      data-testid="rsvp-confirmed"
      initial={reduceMotion ? false : { opacity: 0.88, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0.15 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="flex flex-col items-center"
        aria-live={successFlash ? "polite" : undefined}
        aria-atomic="true"
      >
        <span
          className="mb-4 inline-flex h-8 w-8 items-center justify-center text-taupe"
          data-testid="rsvp-success-mark"
          role="img"
          aria-label={rsvpCopy.confirmedStatusSr}
        >
          <EditorialCheck />
        </span>

        <p className="font-display text-[clamp(1.35rem,5.5vw,1.7rem)] leading-snug text-ink text-balance">
          {saved.attending ? rsvpCopy.confirmedTitle : rsvpCopy.declinedTitle}
        </p>

        {saved.attending ? (
          <p
            className="mt-3 font-display text-[clamp(1.45rem,5.8vw,1.8rem)] tracking-[-0.02em] text-ink"
            data-testid="rsvp-seats-summary"
          >
            {rsvpCopy.seatsSummary(saved.confirmedSeats, maxSeats)}
          </p>
        ) : (
          <p className="mt-3 font-sans text-[1.0625rem] leading-relaxed text-ink-muted">
            {rsvpCopy.declinedSummary}
          </p>
        )}

        {successFlash ? (
          <p
            className="mt-5 font-sans text-[1.0625rem] leading-[1.7] text-ink-muted text-pretty"
            data-testid="rsvp-success-message"
          >
            {successFlash}
          </p>
        ) : null}

        {saved.attending ? (
          <p
            className="mt-5 font-sans text-[0.8125rem] font-medium tracking-[0.08em] text-ink-subtle"
            data-testid="rsvp-see-you"
          >
            {rsvpCopy.seeYouLine}
          </p>
        ) : null}
      </div>

      {(ceremonyMapsUrl || celebrationMapsUrl) && saved.attending ? (
        <div
          className="mt-7 flex flex-col items-center gap-3"
          data-testid="rsvp-maps-links"
        >
          {ceremonyMapsUrl ? (
            <a
              href={ceremonyMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
              data-testid="rsvp-ceremony-maps"
            >
              <span className="border-b border-taupe/50 pb-0.5">
                {rsvpCopy.ceremonyMapsLabel}
              </span>
            </a>
          ) : null}
          {celebrationMapsUrl ? (
            <a
              href={celebrationMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
              data-testid="rsvp-celebration-maps"
            >
              <span className="border-b border-taupe/50 pb-0.5">
                {rsvpCopy.celebrationMapsLabel}
              </span>
            </a>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className="mt-8 inline-flex min-h-11 min-w-[12rem] items-center justify-center border border-taupe/55 bg-transparent px-6 py-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink-muted transition-[border-color,background-color,color] hover:border-taupe hover:bg-beige/50 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
        data-testid="rsvp-edit"
        onClick={onEdit}
      >
        {rsvpCopy.update}
      </button>
    </motion.div>
  );
}

function EditorialCheck() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.5 12.5 10 17l8.5-9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
      className={`inline-flex min-h-12 w-full items-center justify-center border px-5 py-3 text-center font-sans text-[0.9375rem] leading-snug transition-[border-color,background-color,color,transform] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe active:scale-[0.99] ${
        selected
          ? "border-ink bg-ink text-warm-white active:opacity-90"
          : "border-taupe/55 bg-warm-white/90 text-ink hover:border-taupe hover:bg-beige/60 active:bg-beige"
      }`}
    >
      {children}
    </button>
  );
}
