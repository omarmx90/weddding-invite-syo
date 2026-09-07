import { randomUUID } from "node:crypto";
import {
  encryptInviteToken,
  decryptInviteToken,
  hasInviteTokenEncryptionKey,
} from "@/lib/admin/encryption";
import {
  computeStats,
  statusFromRsvp,
  type AdminGuestStore,
} from "@/lib/admin/store-types";
import type {
  CreateInvitationInput,
  GuestDetail,
  GuestListItem,
  UpdateInvitationInput,
} from "@/lib/admin/types";
import { allocateUniqueSlug } from "@/lib/admin/slug";
import { buildInviteCapabilityUrl } from "@/lib/admin/messages";
import { PILOT_FAMILIES } from "@/lib/rsvp/pilot";
import { generateInviteToken, hashInviteToken } from "@/lib/rsvp/token";
import type {
  InvitationRecord,
  RsvpRecord,
  RsvpStore,
  UpsertRsvpInput,
} from "@/lib/rsvp/types";

type AuditRow = {
  id: string;
  createdAt: string;
  action: string;
  invitationId: string | null;
  adminEmail: string;
  metadata: Record<string, unknown>;
};

type MemoryState = {
  invitations: InvitationRecord[];
  /** Solo memoria de proceso — e2e / admin reveal. Nunca loguear. */
  plaintextTokensById: Map<string, string>;
  ciphertextById: Map<string, string>;
  rsvps: Map<string, RsvpRecord>;
  audit: AuditRow[];
  failNextWrite: boolean;
};

declare global {
  var __syoRsvpMemoryStore: MemoryState | undefined;
}

function storeSecret(invitationId: string, token: string, state: MemoryState) {
  state.plaintextTokensById.set(invitationId, token);
  if (hasInviteTokenEncryptionKey()) {
    state.ciphertextById.set(invitationId, encryptInviteToken(token));
  } else {
    state.ciphertextById.set(invitationId, `plain:${token}`);
  }
}

function readSecret(invitationId: string, state: MemoryState): string {
  const plain = state.plaintextTokensById.get(invitationId);
  if (plain) return plain;
  const cipher = state.ciphertextById.get(invitationId);
  if (!cipher) {
    throw new Error("No hay secreto de invitación almacenado.");
  }
  if (cipher.startsWith("plain:")) {
    return cipher.slice("plain:".length);
  }
  return decryptInviteToken(cipher);
}

function createSeedState(): MemoryState {
  const plaintextTokensById = new Map<string, string>();
  const ciphertextById = new Map<string, string>();
  const invitations = PILOT_FAMILIES.filter((pilot) => pilot.enabled).map(
    (pilot) => {
      const id = `mem-${pilot.slug}`;
      const token = generateInviteToken();
      plaintextTokensById.set(id, token);
      if (hasInviteTokenEncryptionKey()) {
        ciphertextById.set(id, encryptInviteToken(token));
      } else {
        ciphertextById.set(id, `plain:${token}`);
      }
      return {
        id,
        slug: pilot.slug,
        displayName: pilot.displayName,
        maxSeats: pilot.maxSeats,
        accessTokenHash: hashInviteToken(token),
        enabled: pilot.enabled,
      };
    },
  );

  return {
    invitations,
    plaintextTokensById,
    ciphertextById,
    rsvps: new Map(),
    audit: [],
    failNextWrite: false,
  };
}

function getState(): MemoryState {
  if (!globalThis.__syoRsvpMemoryStore) {
    globalThis.__syoRsvpMemoryStore = createSeedState();
  }
  return globalThis.__syoRsvpMemoryStore;
}

/** Solo para tests e2e — reinicia RSVPs y rota tokens de memoria. */
export function resetMemoryRsvpStore(): void {
  globalThis.__syoRsvpMemoryStore = createSeedState();
}

export function setMemoryFailNextWrite(fail: boolean): void {
  getState().failNextWrite = fail;
}

/** Solo memory/e2e — devuelve el token en claro del slug. */
export function getMemoryPlaintextToken(slug: string): string | null {
  const state = getState();
  const invitation = state.invitations.find((item) => item.slug === slug);
  if (!invitation) return null;
  try {
    return readSecret(invitation.id, state);
  } catch {
    return null;
  }
}

function toListItem(
  invitation: InvitationRecord,
  rsvp: RsvpRecord | undefined,
): GuestListItem {
  return {
    id: invitation.id,
    slug: invitation.slug,
    displayName: invitation.displayName,
    maxSeats: invitation.maxSeats,
    enabled: invitation.enabled,
    status: statusFromRsvp(rsvp ?? null),
    confirmedSeats: rsvp?.attending ? rsvp.confirmedSeats : 0,
    updatedAt: rsvp?.updatedAt ?? null,
  };
}

function toDetail(
  invitation: InvitationRecord,
  rsvp: RsvpRecord | undefined,
): GuestDetail {
  return {
    ...toListItem(invitation, rsvp),
    message: rsvp?.message ?? null,
    rsvpCreatedAt: rsvp?.createdAt ?? null,
  };
}

export function createMemoryRsvpStore(): RsvpStore {
  return {
    mode: "memory",

    async listEnabledInvitations() {
      return getState().invitations.filter((item) => item.enabled);
    },

    async getInvitationBySlug(slug: string) {
      return (
        getState().invitations.find(
          (item) => item.enabled && item.slug === slug,
        ) ?? null
      );
    },

    async getRsvpByInvitationId(invitationId: string) {
      return getState().rsvps.get(invitationId) ?? null;
    },

    async upsertRsvp(input: UpsertRsvpInput) {
      const state = getState();
      if (state.failNextWrite) {
        state.failNextWrite = false;
        throw new Error("simulated persist failure");
      }
      const existing = state.rsvps.get(input.invitationId);
      const now = new Date().toISOString();
      const next: RsvpRecord = {
        id: existing?.id ?? randomUUID(),
        invitationId: input.invitationId,
        attending: input.attending,
        confirmedSeats: input.confirmedSeats,
        message: input.message ?? null,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      state.rsvps.set(input.invitationId, next);
      return next;
    },
  };
}

export function createMemoryAdminGuestStore(): AdminGuestStore {
  return {
    async listGuests() {
      const state = getState();
      return state.invitations
        .map((invitation) =>
          toListItem(invitation, state.rsvps.get(invitation.id)),
        )
        .sort((a, b) => a.displayName.localeCompare(b.displayName, "es-MX"));
    },

    async getGuest(invitationId: string) {
      const state = getState();
      const invitation = state.invitations.find(
        (item) => item.id === invitationId,
      );
      if (!invitation) return null;
      return toDetail(invitation, state.rsvps.get(invitation.id));
    },

    async getStats() {
      return computeStats(await this.listGuests());
    },

    async slugExists(slug: string) {
      return getState().invitations.some((item) => item.slug === slug);
    },

    async createInvitation(input: CreateInvitationInput, adminEmail: string) {
      const state = getState();
      const displayName = input.displayName.trim();
      const maxSeats = Math.floor(input.maxSeats);
      if (!displayName || maxSeats < 1 || maxSeats > 20) {
        throw new Error("Datos de invitación inválidos.");
      }

      const slug = await allocateUniqueSlug(displayName, async (candidate) =>
        state.invitations.some((item) => item.slug === candidate),
      );
      const token = generateInviteToken();
      const invitation: InvitationRecord = {
        id: randomUUID(),
        slug,
        displayName,
        maxSeats,
        accessTokenHash: hashInviteToken(token),
        enabled: true,
      };
      state.invitations.push(invitation);
      storeSecret(invitation.id, token, state);
      await this.writeAudit({
        action: "invitation_created",
        invitationId: invitation.id,
        adminEmail,
        metadata: { slug, maxSeats },
      });

      return {
        invitation: toDetail(invitation, undefined),
        inviteUrl: buildInviteCapabilityUrl(slug, token),
        token,
      };
    },

    async updateInvitation(input: UpdateInvitationInput, adminEmail: string) {
      const state = getState();
      const invitation = state.invitations.find(
        (item) => item.id === input.invitationId,
      );
      if (!invitation) {
        throw new Error("Invitación no encontrada.");
      }
      const rsvp = state.rsvps.get(invitation.id);
      const maxSeats = Math.floor(input.maxSeats);
      if (maxSeats < 1 || maxSeats > 20) {
        throw new Error("Número de lugares inválido.");
      }
      if (
        rsvp?.attending &&
        rsvp.confirmedSeats > 0 &&
        maxSeats < rsvp.confirmedSeats
      ) {
        throw new Error(
          "No se pueden reducir los lugares por debajo de los confirmados.",
        );
      }

      invitation.displayName = input.displayName.trim();
      invitation.maxSeats = maxSeats;
      invitation.enabled = input.enabled;

      await this.writeAudit({
        action: "invitation_updated",
        invitationId: invitation.id,
        adminEmail,
        metadata: { maxSeats, enabled: input.enabled },
      });

      return toDetail(invitation, rsvp);
    },

    async disableInvitation(invitationId: string, adminEmail: string) {
      const state = getState();
      const invitation = state.invitations.find(
        (item) => item.id === invitationId,
      );
      if (!invitation) {
        throw new Error("Invitación no encontrada.");
      }
      invitation.enabled = false;
      await this.writeAudit({
        action: "invitation_disabled",
        invitationId,
        adminEmail,
      });
      return toDetail(invitation, state.rsvps.get(invitation.id));
    },

    async rotateInviteLink(invitationId: string, adminEmail: string) {
      const state = getState();
      const invitation = state.invitations.find(
        (item) => item.id === invitationId,
      );
      if (!invitation) {
        throw new Error("Invitación no encontrada.");
      }
      const token = generateInviteToken();
      invitation.accessTokenHash = hashInviteToken(token);
      storeSecret(invitation.id, token, state);
      await this.writeAudit({
        action: "invite_link_rotated",
        invitationId,
        adminEmail,
        metadata: { slug: invitation.slug },
      });
      return {
        inviteUrl: buildInviteCapabilityUrl(invitation.slug, token),
        token,
      };
    },

    async revealInviteToken(invitationId: string) {
      return readSecret(invitationId, getState());
    },

    async writeAudit(input) {
      const state = getState();
      state.audit.push({
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        action: input.action,
        invitationId: input.invitationId,
        adminEmail: input.adminEmail,
        metadata: input.metadata ?? {},
      });
    },
  };
}
