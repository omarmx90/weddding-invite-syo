export type InvitationRecord = {
  id: string;
  slug: string;
  displayName: string;
  maxSeats: number;
  /** SHA-256 hex del token — nunca el secreto en claro */
  accessTokenHash: string;
  enabled: boolean;
};

export type RsvpRecord = {
  id: string;
  invitationId: string;
  attending: boolean;
  /** Total de asistentes — fuente canónica de capacidad */
  confirmedSeats: number;
  /** Desglose; null = RSVP legado sin breakdown */
  adultCount: number | null;
  childCount: number | null;
  message: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertRsvpInput = {
  invitationId: string;
  attending: boolean;
  confirmedSeats: number;
  adultCount: number;
  childCount: number;
  message?: string | null;
};

export type RsvpStore = {
  readonly mode: "memory" | "supabase";
  listEnabledInvitations(): Promise<InvitationRecord[]>;
  getInvitationBySlug(slug: string): Promise<InvitationRecord | null>;
  getRsvpByInvitationId(invitationId: string): Promise<RsvpRecord | null>;
  upsertRsvp(input: UpsertRsvpInput): Promise<RsvpRecord>;
};

export type RsvpSubmitPayload = {
  slug: string;
  accessToken: string;
  attending: boolean;
  adultCount?: number;
  childCount?: number;
  /**
   * Compatibilidad: si no vienen adult/child, el total se interpreta
   * como adultos (RSVP legado / clientes antiguos).
   */
  confirmedSeats?: number;
  message?: string;
};

export type RsvpActionErrorCode =
  | "invalid_token"
  | "not_found"
  | "validation"
  | "deadline"
  | "unavailable"
  | "persist";

export type RsvpActionResult =
  | {
      ok: true;
      rsvp: {
        attending: boolean;
        confirmedSeats: number;
        adultCount: number;
        childCount: number;
        updatedAt: string;
      };
    }
  | {
      ok: false;
      code: RsvpActionErrorCode;
      message: string;
    };
