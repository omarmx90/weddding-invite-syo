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
  confirmedSeats: number;
  message: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertRsvpInput = {
  invitationId: string;
  attending: boolean;
  confirmedSeats: number;
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
  confirmedSeats: number;
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
        updatedAt: string;
      };
    }
  | {
      ok: false;
      code: RsvpActionErrorCode;
      message: string;
    };
