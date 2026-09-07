"use server";

import { isRsvpDeadlinePassed } from "@/lib/rsvp/deadline";
import { rsvpCopy } from "@/lib/rsvp/copy";
import {
  getRsvpStore,
  isRsvpPersistenceReady,
} from "@/lib/rsvp/repository";
import { verifyInviteToken } from "@/lib/rsvp/token";
import { validateRsvpInput } from "@/lib/rsvp/validation";
import type { RsvpActionResult, RsvpSubmitPayload } from "@/lib/rsvp/types";

/**
 * Guarda o actualiza el RSVP (relación 1:1 por invitación).
 * Requiere token cuya huella coincida con access_token_hash.
 * Nunca registrar el token ni URLs con `t=` en logs.
 */
export async function submitRsvp(
  payload: RsvpSubmitPayload,
): Promise<RsvpActionResult> {
  try {
    if (!isRsvpPersistenceReady()) {
      return {
        ok: false,
        code: "unavailable",
        message: rsvpCopy.persistError,
      };
    }

    if (isRsvpDeadlinePassed()) {
      return {
        ok: false,
        code: "deadline",
        message: `${rsvpCopy.deadlinePassedTitle} ${rsvpCopy.deadlinePassedBody}`,
      };
    }

    const slug = payload.slug?.trim();
    const accessToken = payload.accessToken?.trim();

    if (!slug || !accessToken) {
      return {
        ok: false,
        code: "invalid_token",
        message: rsvpCopy.missingTokenBody,
      };
    }

    const store = getRsvpStore();
    const invitation = await store.getInvitationBySlug(slug);

    if (!invitation) {
      return {
        ok: false,
        code: "not_found",
        message: "No encontramos esta invitación.",
      };
    }

    if (!verifyInviteToken(accessToken, invitation.accessTokenHash)) {
      return {
        ok: false,
        code: "invalid_token",
        message: rsvpCopy.missingTokenBody,
      };
    }

    const validation = validateRsvpInput({
      attending: Boolean(payload.attending),
      maxSeats: invitation.maxSeats,
      adultCount: payload.adultCount,
      childCount: payload.childCount,
      confirmedSeats: payload.confirmedSeats,
    });

    if (!validation.ok) {
      return {
        ok: false,
        code: "validation",
        message: validation.message,
      };
    }

    const message =
      typeof payload.message === "string" && payload.message.trim()
        ? payload.message.trim().slice(0, 280)
        : null;

    const rsvp = await store.upsertRsvp({
      invitationId: invitation.id,
      attending: Boolean(payload.attending),
      confirmedSeats: validation.confirmedSeats,
      adultCount: validation.adultCount,
      childCount: validation.childCount,
      message,
    });

    return {
      ok: true,
      rsvp: {
        attending: rsvp.attending,
        confirmedSeats: rsvp.confirmedSeats,
        adultCount: rsvp.adultCount ?? validation.adultCount,
        childCount: rsvp.childCount ?? validation.childCount,
        updatedAt: rsvp.updatedAt,
      },
    };
  } catch {
    return {
      ok: false,
      code: "persist",
      message: rsvpCopy.persistError,
    };
  }
}
