import type { GuestInvitation } from "@/content/guest-types";
import type { InvitationRecord, RsvpRecord } from "@/lib/rsvp/types";
import {
  getInvitationBySlug as getInvitationRecordBySlug,
  getLocalPilotInvitations,
  getRsvpStore,
  isRsvpPersistenceReady,
  listEnabledInvitations,
} from "@/lib/rsvp/repository";
import { verifyInviteToken } from "@/lib/rsvp/token";

export function toGuestInvitation(record: InvitationRecord): GuestInvitation {
  return {
    slug: record.slug,
    displayName: record.displayName,
    seats: record.maxSeats,
    maxSeats: record.maxSeats,
    enabled: record.enabled,
  };
}

/**
 * Listado para generateStaticParams — catálogo piloto local (sin I/O, sin secrets).
 */
export function getEnabledGuestInvitations(): GuestInvitation[] {
  return getLocalPilotInvitations().map(toGuestInvitation);
}

export async function getGuestBySlug(
  slug: string,
): Promise<GuestInvitation | undefined> {
  const record = await getInvitationRecordBySlug(slug);
  return record ? toGuestInvitation(record) : undefined;
}

export async function resolveInvitationAccess(
  slug: string,
  accessToken: string | undefined,
): Promise<{
  invitation: InvitationRecord | null;
  tokenValid: boolean;
  rsvp: RsvpRecord | null;
}> {
  const invitation = await getInvitationRecordBySlug(slug);
  if (!invitation) {
    return { invitation: null, tokenValid: false, rsvp: null };
  }

  const tokenValid = Boolean(
    accessToken &&
      verifyInviteToken(accessToken, invitation.accessTokenHash),
  );

  if (!tokenValid || !isRsvpPersistenceReady()) {
    return { invitation, tokenValid: false, rsvp: null };
  }

  try {
    const rsvp = await getRsvpStore().getRsvpByInvitationId(invitation.id);
    return { invitation, tokenValid: true, rsvp };
  } catch {
    return { invitation, tokenValid: true, rsvp: null };
  }
}

export async function listGuestsFromStore(): Promise<GuestInvitation[]> {
  const rows = await listEnabledInvitations();
  return rows.map(toGuestInvitation);
}
