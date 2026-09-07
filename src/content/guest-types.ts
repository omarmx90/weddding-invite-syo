/**
 * Invitaciones personalizadas (fase piloto local).
 * Preparado para migrar a Supabase sin cambiar el contrato de UI.
 */

export type GuestInvitationStatus =
  | "draft"
  | "sent"
  | "opened"
  | "confirmed"
  | "declined";

/**
 * Invitación por familia / grupo.
 * Campos opcionales anticipan la migración a Supabase.
 */
export type GuestInvitation = {
  slug: string;
  displayName: string;
  /** Lugares reservados (pilares del piloto) */
  seats: number;
  enabled: boolean;
  /** Futuro: techo de confirmación */
  maxSeats?: number;
  /** Futuro: lugares ya confirmados */
  confirmedSeats?: number;
  status?: GuestInvitationStatus;
  /** Futuro: nombres individuales */
  guestNames?: string[];
  /** Futuro: override de deadline */
  rsvpDeadlineIso?: string;
  notes?: string;
  dietaryRestrictions?: string;
  childrenCount?: number;
  whatsapp?: string;
  /** Futuro: código / token de acceso */
  inviteCode?: string;
};

export type PersonalizationCopy = {
  eyebrow: string;
  reservedPreface: string;
  reservedSuffix: string;
  seatSingular: string;
  seatPlural: string;
  warmLine: string;
};

export type RsvpComingSoonCopy = {
  title: string;
  body: string;
  deadlineLabel: string;
};
