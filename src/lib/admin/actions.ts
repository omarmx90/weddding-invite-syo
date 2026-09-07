"use server";

import QRCode from "qrcode";
import { requireAuthorizedAdmin } from "@/lib/admin/session";
import { getAdminGuestStore, isAdminPersistenceReady } from "@/lib/admin/repository";
import {
  buildInviteCapabilityUrl,
  buildWhatsAppMessage,
  buildWhatsAppShareHref,
} from "@/lib/admin/messages";
import { guestMatchesAdminQuery } from "@/lib/admin/search";
import type {
  CreateInvitationInput,
  DashboardStats,
  GuestDetail,
  GuestListItem,
  GuestRsvpStatus,
  UpdateInvitationInput,
} from "@/lib/admin/types";

export type AdminActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

function fail<T>(message: string): AdminActionResult<T> {
  return { ok: false, message };
}

function toSafeAdminErrorMessage(error: unknown): string {
  const message =
    error instanceof Error ? error.message : "No se pudo completar la acción.";
  if (
    /INVITE_TOKEN|SERVICE_ROLE|encryption|ciphertext|token|SECRET|KEY/i.test(
      message,
    )
  ) {
    return "No se pudo completar la acción.";
  }
  return message;
}

async function withAdmin<T>(
  run: (email: string) => Promise<T>,
): Promise<AdminActionResult<T>> {
  try {
    if (!isAdminPersistenceReady()) {
      return fail("El administrador no está disponible en este entorno.");
    }
    const admin = await requireAuthorizedAdmin();
    const data = await run(admin.email);
    return { ok: true, data };
  } catch (error) {
    return fail(toSafeAdminErrorMessage(error));
  }
}

export async function getAdminDashboard(): Promise<
  AdminActionResult<{ stats: DashboardStats; guests: GuestListItem[] }>
> {
  return withAdmin(async () => {
    const store = getAdminGuestStore();
    const [stats, guests] = await Promise.all([
      store.getStats(),
      store.listGuests(),
    ]);
    return { stats, guests };
  });
}

export async function listAdminGuests(filters?: {
  query?: string;
  status?: GuestRsvpStatus | "all" | "inactive";
}): Promise<AdminActionResult<GuestListItem[]>> {
  return withAdmin(async () => {
    const store = getAdminGuestStore();
    let guests = await store.listGuests();
    const status = filters?.status ?? "all";
    if (status === "inactive") {
      guests = guests.filter((guest) => !guest.enabled);
    } else if (status !== "all") {
      guests = guests.filter(
        (guest) => guest.enabled && guest.status === status,
      );
    }
    const query = filters?.query?.trim();
    if (query) {
      guests = guests.filter((guest) => guestMatchesAdminQuery(guest, query));
    }
    return guests;
  });
}

export async function getAdminGuest(
  invitationId: string,
): Promise<AdminActionResult<GuestDetail>> {
  return withAdmin(async () => {
    const guest = await getAdminGuestStore().getGuest(invitationId);
    if (!guest) {
      throw new Error("Invitación no encontrada.");
    }
    return guest;
  });
}

export async function createAdminInvitation(
  input: CreateInvitationInput,
): Promise<
  AdminActionResult<{
    invitation: GuestDetail;
    inviteUrl: string;
  }>
> {
  return withAdmin(async (email) => {
    const created = await getAdminGuestStore().createInvitation(input, email);
    return {
      invitation: created.invitation,
      inviteUrl: created.inviteUrl,
    };
  });
}

export async function updateAdminInvitation(
  input: UpdateInvitationInput,
): Promise<AdminActionResult<GuestDetail>> {
  return withAdmin(async (email) => {
    return getAdminGuestStore().updateInvitation(input, email);
  });
}

export async function disableAdminInvitation(
  invitationId: string,
): Promise<AdminActionResult<GuestDetail>> {
  return withAdmin(async (email) => {
    return getAdminGuestStore().disableInvitation(invitationId, email);
  });
}

export async function rotateAdminInviteLink(
  invitationId: string,
): Promise<AdminActionResult<{ inviteUrl: string }>> {
  return withAdmin(async (email) => {
    const rotated = await getAdminGuestStore().rotateInviteLink(
      invitationId,
      email,
    );
    return { inviteUrl: rotated.inviteUrl };
  });
}

export async function revealAdminInviteUrl(
  invitationId: string,
): Promise<AdminActionResult<{ inviteUrl: string }>> {
  return withAdmin(async () => {
    const store = getAdminGuestStore();
    const guest = await store.getGuest(invitationId);
    if (!guest) {
      throw new Error("Invitación no encontrada.");
    }
    const token = await store.revealInviteToken(invitationId);
    return {
      inviteUrl: buildInviteCapabilityUrl(guest.slug, token),
    };
  });
}

export async function prepareAdminWhatsApp(
  invitationId: string,
): Promise<
  AdminActionResult<{ message: string; shareHref: string; inviteUrl: string }>
> {
  return withAdmin(async () => {
    const store = getAdminGuestStore();
    const guest = await store.getGuest(invitationId);
    if (!guest) {
      throw new Error("Invitación no encontrada.");
    }
    const token = await store.revealInviteToken(invitationId);
    const inviteUrl = buildInviteCapabilityUrl(guest.slug, token);
    const message = buildWhatsAppMessage(guest.displayName, inviteUrl);
    return {
      message,
      shareHref: buildWhatsAppShareHref(message),
      inviteUrl,
    };
  });
}

export async function generateAdminInviteQr(
  invitationId: string,
): Promise<AdminActionResult<{ pngDataUrl: string }>> {
  return withAdmin(async () => {
    const store = getAdminGuestStore();
    const guest = await store.getGuest(invitationId);
    if (!guest) {
      throw new Error("Invitación no encontrada.");
    }
    const token = await store.revealInviteToken(invitationId);
    const inviteUrl = buildInviteCapabilityUrl(guest.slug, token);
    const pngDataUrl = await QRCode.toDataURL(inviteUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 512,
      color: {
        dark: "#4b443d",
        light: "#fcfaf7",
      },
    });
    return { pngDataUrl };
  });
}
