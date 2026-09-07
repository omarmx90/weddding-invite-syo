import { randomUUID } from "node:crypto";
import { PILOT_FAMILIES } from "@/lib/rsvp/pilot";
import { generateInviteToken, hashInviteToken } from "@/lib/rsvp/token";
import type {
  InvitationRecord,
  RsvpRecord,
  RsvpStore,
  UpsertRsvpInput,
} from "@/lib/rsvp/types";

type MemoryState = {
  invitations: InvitationRecord[];
  /** Solo en memoria de proceso — para e2e. Nunca persistir ni loguear. */
  plaintextTokensBySlug: Map<string, string>;
  rsvps: Map<string, RsvpRecord>;
  failNextWrite: boolean;
};

declare global {
  var __syoRsvpMemoryStore: MemoryState | undefined;
}

function createSeedState(): MemoryState {
  const plaintextTokensBySlug = new Map<string, string>();
  const invitations = PILOT_FAMILIES.filter((pilot) => pilot.enabled).map(
    (pilot) => {
      const token = generateInviteToken();
      plaintextTokensBySlug.set(pilot.slug, token);
      return {
        id: `mem-${pilot.slug}`,
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
    plaintextTokensBySlug,
    rsvps: new Map(),
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
  return getState().plaintextTokensBySlug.get(slug) ?? null;
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
