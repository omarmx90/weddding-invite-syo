import type {
  AdminAuditAction,
  CreateInvitationInput,
  CreateInvitationResult,
  DashboardStats,
  GuestDetail,
  GuestListItem,
  RotateInviteResult,
  UpdateInvitationInput,
} from "@/lib/admin/types";

export type AdminGuestStore = {
  listGuests(): Promise<GuestListItem[]>;
  getGuest(invitationId: string): Promise<GuestDetail | null>;
  getStats(): Promise<DashboardStats>;
  slugExists(slug: string): Promise<boolean>;
  createInvitation(
    input: CreateInvitationInput,
    adminEmail: string,
  ): Promise<CreateInvitationResult>;
  updateInvitation(
    input: UpdateInvitationInput,
    adminEmail: string,
  ): Promise<GuestDetail>;
  disableInvitation(
    invitationId: string,
    adminEmail: string,
  ): Promise<GuestDetail>;
  rotateInviteLink(
    invitationId: string,
    adminEmail: string,
  ): Promise<RotateInviteResult>;
  revealInviteToken(invitationId: string): Promise<string>;
  writeAudit(input: {
    action: AdminAuditAction;
    invitationId: string | null;
    adminEmail: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
};

export function computeStats(guests: GuestListItem[]): DashboardStats {
  const enabled = guests.filter((guest) => guest.enabled);
  const confirmed = enabled.filter((guest) => guest.status === "confirmed");
  return {
    totalFamilies: enabled.length,
    totalReservedSeats: enabled.reduce((sum, guest) => sum + guest.maxSeats, 0),
    confirmedFamilies: confirmed.length,
    declinedFamilies: enabled.filter((guest) => guest.status === "declined")
      .length,
    pendingFamilies: enabled.filter((guest) => guest.status === "pending")
      .length,
    confirmedSeats: confirmed.reduce(
      (sum, guest) => sum + guest.confirmedSeats,
      0,
    ),
    confirmedAdults: confirmed.reduce(
      (sum, guest) => sum + guest.adultCount,
      0,
    ),
    confirmedChildren: confirmed.reduce(
      (sum, guest) => sum + guest.childCount,
      0,
    ),
  };
}

export function statusFromRsvp(
  rsvp: { attending: boolean; confirmedSeats: number } | null | undefined,
): GuestListItem["status"] {
  if (!rsvp) return "pending";
  return rsvp.attending ? "confirmed" : "declined";
}
