import { wedding } from "@/content/wedding";
import { PRODUCT_TIMEZONE } from "@/lib/locale";

declare global {
  var __syoRsvpDeadlineOverride: boolean | undefined;
}

/**
 * Fin del día del deadline en America/Mexico_City (inclusive el 10 de octubre).
 * Tras ese instante, no se aceptan nuevas confirmaciones ni ediciones.
 */
export function getRsvpDeadlineInstant(
  deadlineIso = wedding.rsvp.deadlineIso,
  timezone = wedding.rsvp.timezone || PRODUCT_TIMEZONE,
): Date {
  const override = process.env.RSVP_DEADLINE_ISO_OVERRIDE?.trim();
  const iso = override || deadlineIso;
  const probe = new Date(`${iso}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(probe);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date(`${iso}T23:59:59.999-06:00`);
  }

  // Mexico City sin DST desde 2022 — offset fijo UTC-6.
  return new Date(`${year}-${month}-${day}T23:59:59.999-06:00`);
}

/** Solo memory/e2e — no afecta Supabase ni producción. */
export function setMemoryDeadlinePassed(passed: boolean): void {
  globalThis.__syoRsvpDeadlineOverride = passed;
}

export function clearMemoryDeadlineOverride(): void {
  globalThis.__syoRsvpDeadlineOverride = undefined;
}

export function isRsvpDeadlinePassed(now = new Date()): boolean {
  if (globalThis.__syoRsvpDeadlineOverride === true) {
    return true;
  }
  if (globalThis.__syoRsvpDeadlineOverride === false) {
    return false;
  }
  return now.getTime() > getRsvpDeadlineInstant().getTime();
}
