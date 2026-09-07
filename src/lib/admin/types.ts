export type GuestRsvpStatus = "pending" | "confirmed" | "declined";

export type GuestListItem = {
  id: string;
  slug: string;
  displayName: string;
  maxSeats: number;
  enabled: boolean;
  status: GuestRsvpStatus;
  confirmedSeats: number;
  updatedAt: string | null;
};

export type GuestDetail = GuestListItem & {
  message: string | null;
  rsvpCreatedAt: string | null;
};

export type DashboardStats = {
  totalFamilies: number;
  totalReservedSeats: number;
  confirmedFamilies: number;
  declinedFamilies: number;
  pendingFamilies: number;
  confirmedSeats: number;
};

export type AdminAuditAction =
  | "invitation_created"
  | "invitation_updated"
  | "invitation_disabled"
  | "invite_link_rotated";

export type CreateInvitationInput = {
  displayName: string;
  maxSeats: number;
};

export type UpdateInvitationInput = {
  invitationId: string;
  displayName: string;
  maxSeats: number;
  enabled: boolean;
};

export type CreateInvitationResult = {
  invitation: GuestDetail;
  /** Solo se entrega una vez al crear/rotar — no loguear */
  inviteUrl: string;
  token: string;
};

export type RotateInviteResult = {
  inviteUrl: string;
  token: string;
};
