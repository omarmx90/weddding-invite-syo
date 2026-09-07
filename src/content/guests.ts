import type {
  GuestInvitation,
  PersonalizationCopy,
  RsvpComingSoonCopy,
} from "@/content/guest-types";
import { formatLongDateEsMx } from "@/lib/locale";
import { wedding } from "@/content/wedding";

/**
 * Invitaciones piloto — fuente local tipada.
 * Sustituir por consulta a Supabase en una fase posterior.
 */
export const guestInvitations: GuestInvitation[] = [
  {
    slug: "granados-montero",
    displayName: "Familia Granados Montero",
    seats: 2,
    enabled: true,
  },
  {
    slug: "montero-aguilar",
    displayName: "Familia Montero Aguilar",
    seats: 3,
    enabled: true,
  },
  {
    slug: "nava-munoz",
    displayName: "Familia Nava Muñoz",
    seats: 3,
    enabled: true,
  },
];

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

export function getEnabledGuestInvitations(): GuestInvitation[] {
  return guestInvitations.filter((guest) => guest.enabled);
}

export function getGuestBySlug(slug: string): GuestInvitation | undefined {
  return getEnabledGuestInvitations().find((guest) => guest.slug === slug);
}

export function formatReservedSeats(seats: number): string {
  const unit =
    seats === 1
      ? personalizationCopy.seatSingular
      : personalizationCopy.seatPlural;
  return `${seats} ${unit}`;
}

export function formatRsvpDeadlineLabel(deadlineIso = wedding.rsvp.deadlineIso): string {
  return `${rsvpComingSoonCopy.deadlineLabel} ${formatLongDateEsMx(deadlineIso)}`;
}

/**
 * Migración futura a Supabase (documentación de arquitectura):
 *
 * 1. Tabla `guest_invitations` con columnas alineadas a `GuestInvitation`.
 * 2. `getGuestBySlug` pasa a leer de Supabase (SSR / cache tags).
 * 3. RSVP escribe `confirmedSeats` + `status` sin cambiar la UI de presentación.
 * 4. Los slugs piloto de este archivo se importan una sola vez o se reemplazan.
 */
