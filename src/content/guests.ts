/**
 * Invitaciones personalizadas — copy y helpers de presentación.
 * Persistencia y tokens: `src/lib/rsvp/*` (hashes en DB; secretos fuera de git).
 */

import type {
  GuestInvitation,
  PersonalizationCopy,
  RsvpComingSoonCopy,
} from "@/content/guest-types";
import { formatLongDateEsMx } from "@/lib/locale";
import { wedding } from "@/content/wedding";
import {
  getEnabledGuestInvitations,
  getGuestBySlug,
} from "@/lib/rsvp/invitations";
import { PILOT_FAMILIES } from "@/lib/rsvp/pilot";

/** Snapshot local del piloto (tests / docs). Sin secrets. */
export const guestInvitations: GuestInvitation[] = PILOT_FAMILIES.map(
  (pilot) => ({
    slug: pilot.slug,
    displayName: pilot.displayName,
    seats: pilot.maxSeats,
    maxSeats: pilot.maxSeats,
    enabled: pilot.enabled,
  }),
);

export const personalizationCopy: PersonalizationCopy = {
  eyebrow: "Esta invitación es especialmente para",
  reservedPreface: "Hemos reservado",
  reservedSuffix: "para ustedes",
  seatSingular: "lugar",
  seatPlural: "lugares",
  warmLine: "Nos encantará compartir este día con ustedes.",
};

export const rsvpComingSoonCopy: RsvpComingSoonCopy = {
  title: "Confirmación de asistencia",
  body: "Pronto podrás confirmar desde aquí. Mientras tanto, guarda la fecha con cariño.",
  deadlineLabel: "Confirma antes del",
};

export { getEnabledGuestInvitations, getGuestBySlug };

export function formatReservedSeats(seats: number): string {
  const unit =
    seats === 1
      ? personalizationCopy.seatSingular
      : personalizationCopy.seatPlural;
  return `${seats} ${unit}`;
}

export function formatRsvpDeadlineLabel(
  deadlineIso = wedding.rsvp.deadlineIso,
): string {
  return `${rsvpComingSoonCopy.deadlineLabel} ${formatLongDateEsMx(deadlineIso)}`;
}
