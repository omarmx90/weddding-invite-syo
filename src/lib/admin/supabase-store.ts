import {
  encryptInviteToken,
  decryptInviteToken,
} from "@/lib/admin/encryption";
import { buildInviteCapabilityUrl } from "@/lib/admin/messages";
import { allocateUniqueSlug } from "@/lib/admin/slug";
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
import { generateInviteToken, hashInviteToken } from "@/lib/rsvp/token";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

type InvitationRow = {
  id: string;
  slug: string;
  display_name: string;
  max_seats: number;
  access_token_hash: string;
  enabled: boolean;
};

type RsvpRow = {
  invitation_id: string;
  attending: boolean;
  confirmed_seats: number;
  message: string | null;
  created_at: string;
  updated_at: string;
};

function toListItem(invitation: InvitationRow, rsvp?: RsvpRow | null): GuestListItem {
  const status = statusFromRsvp(
    rsvp
      ? { attending: rsvp.attending, confirmedSeats: rsvp.confirmed_seats }
      : null,
  );
  return {
    id: invitation.id,
    slug: invitation.slug,
    displayName: invitation.display_name,
    maxSeats: invitation.max_seats,
    enabled: invitation.enabled,
    status,
    confirmedSeats: rsvp?.attending ? rsvp.confirmed_seats : 0,
    updatedAt: rsvp?.updated_at ?? null,
  };
}

function toDetail(invitation: InvitationRow, rsvp?: RsvpRow | null): GuestDetail {
  return {
    ...toListItem(invitation, rsvp),
    message: rsvp?.message ?? null,
    rsvpCreatedAt: rsvp?.created_at ?? null,
  };
}

export function createSupabaseAdminGuestStore(): AdminGuestStore {
  const supabase = createServiceSupabaseClient();

  async function loadRsvpMap(): Promise<Map<string, RsvpRow>> {
    const { data, error } = await supabase
      .from("rsvps")
      .select(
        "invitation_id, attending, confirmed_seats, message, created_at, updated_at",
      );
    if (error) {
      throw new Error("No se pudieron leer las confirmaciones.");
    }
    const map = new Map<string, RsvpRow>();
    for (const row of (data ?? []) as RsvpRow[]) {
      map.set(row.invitation_id, row);
    }
    return map;
  }

  return {
    async listGuests() {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, slug, display_name, max_seats, access_token_hash, enabled")
        .order("display_name", { ascending: true });
      if (error) {
        throw new Error("No se pudieron leer las invitaciones.");
      }
      const rsvps = await loadRsvpMap();
      return ((data ?? []) as InvitationRow[]).map((row) =>
        toListItem(row, rsvps.get(row.id)),
      );
    },

    async getGuest(invitationId: string) {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, slug, display_name, max_seats, access_token_hash, enabled")
        .eq("id", invitationId)
        .maybeSingle();
      if (error) {
        throw new Error("No se pudo leer la invitación.");
      }
      if (!data) return null;
      const { data: rsvp } = await supabase
        .from("rsvps")
        .select(
          "invitation_id, attending, confirmed_seats, message, created_at, updated_at",
        )
        .eq("invitation_id", invitationId)
        .maybeSingle();
      return toDetail(data as InvitationRow, (rsvp as RsvpRow | null) ?? null);
    },

    async getStats() {
      return computeStats(await this.listGuests());
    },

    async slugExists(slug: string) {
      const { data, error } = await supabase
        .from("invitations")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (error) {
        throw new Error("No se pudo validar el slug.");
      }
      return Boolean(data);
    },

    async createInvitation(input: CreateInvitationInput, adminEmail: string) {
      const displayName = input.displayName.trim();
      const maxSeats = Math.floor(input.maxSeats);
      if (!displayName || maxSeats < 1 || maxSeats > 20) {
        throw new Error("Datos de invitación inválidos.");
      }

      const slug = await allocateUniqueSlug(displayName, (candidate) =>
        this.slugExists(candidate),
      );
      const token = generateInviteToken();
      const ciphertext = encryptInviteToken(token);

      const { data, error } = await supabase
        .from("invitations")
        .insert({
          slug,
          display_name: displayName,
          max_seats: maxSeats,
          access_token_hash: hashInviteToken(token),
          enabled: true,
        })
        .select("id, slug, display_name, max_seats, access_token_hash, enabled")
        .single();

      if (error || !data) {
        throw new Error("No se pudo crear la invitación.");
      }

      const invitation = data as InvitationRow;
      const { error: secretError } = await supabase
        .from("invitation_secrets")
        .insert({
          invitation_id: invitation.id,
          token_ciphertext: ciphertext,
        });

      if (secretError) {
        await supabase.from("invitations").delete().eq("id", invitation.id);
        throw new Error("No se pudo guardar el secreto de la invitación.");
      }

      await this.writeAudit({
        action: "invitation_created",
        invitationId: invitation.id,
        adminEmail,
        metadata: { slug, maxSeats },
      });

      return {
        invitation: toDetail(invitation, null),
        inviteUrl: buildInviteCapabilityUrl(slug, token),
        token,
      };
    },

    async updateInvitation(input: UpdateInvitationInput, adminEmail: string) {
      const current = await this.getGuest(input.invitationId);
      if (!current) {
        throw new Error("Invitación no encontrada.");
      }
      const maxSeats = Math.floor(input.maxSeats);
      if (maxSeats < 1 || maxSeats > 20) {
        throw new Error("Número de lugares inválido.");
      }
      if (
        current.status === "confirmed" &&
        current.confirmedSeats > 0 &&
        maxSeats < current.confirmedSeats
      ) {
        throw new Error(
          "No se pueden reducir los lugares por debajo de los confirmados.",
        );
      }

      const { data, error } = await supabase
        .from("invitations")
        .update({
          display_name: input.displayName.trim(),
          max_seats: maxSeats,
          enabled: input.enabled,
        })
        .eq("id", input.invitationId)
        .select("id, slug, display_name, max_seats, access_token_hash, enabled")
        .single();

      if (error || !data) {
        throw new Error("No se pudo actualizar la invitación.");
      }

      await this.writeAudit({
        action: "invitation_updated",
        invitationId: input.invitationId,
        adminEmail,
        metadata: { maxSeats, enabled: input.enabled },
      });

      return this.getGuest(input.invitationId) as Promise<GuestDetail>;
    },

    async disableInvitation(invitationId: string, adminEmail: string) {
      const { data, error } = await supabase
        .from("invitations")
        .update({ enabled: false })
        .eq("id", invitationId)
        .select("id, slug, display_name, max_seats, access_token_hash, enabled")
        .single();
      if (error || !data) {
        throw new Error("No se pudo desactivar la invitación.");
      }
      await this.writeAudit({
        action: "invitation_disabled",
        invitationId,
        adminEmail,
      });
      return (await this.getGuest(invitationId)) as GuestDetail;
    },

    async rotateInviteLink(invitationId: string, adminEmail: string) {
      const guest = await this.getGuest(invitationId);
      if (!guest) {
        throw new Error("Invitación no encontrada.");
      }
      const token = generateInviteToken();
      const ciphertext = encryptInviteToken(token);

      const { error: inviteError } = await supabase
        .from("invitations")
        .update({ access_token_hash: hashInviteToken(token) })
        .eq("id", invitationId);
      if (inviteError) {
        throw new Error("No se pudo rotar el enlace.");
      }

      const { error: secretError } = await supabase
        .from("invitation_secrets")
        .upsert({
          invitation_id: invitationId,
          token_ciphertext: ciphertext,
          updated_at: new Date().toISOString(),
        });
      if (secretError) {
        throw new Error("No se pudo guardar el nuevo secreto.");
      }

      await this.writeAudit({
        action: "invite_link_rotated",
        invitationId,
        adminEmail,
        metadata: { slug: guest.slug },
      });

      return {
        inviteUrl: buildInviteCapabilityUrl(guest.slug, token),
        token,
      };
    },

    async revealInviteToken(invitationId: string) {
      const { data, error } = await supabase
        .from("invitation_secrets")
        .select("token_ciphertext")
        .eq("invitation_id", invitationId)
        .maybeSingle();
      if (error || !data) {
        throw new Error(
          "No hay enlace recuperable. Regenera el enlace para obtener uno nuevo.",
        );
      }
      return decryptInviteToken(
        (data as { token_ciphertext: string }).token_ciphertext,
      );
    },

    async writeAudit(input) {
      const { error } = await supabase.from("admin_audit_events").insert({
        action: input.action,
        invitation_id: input.invitationId,
        admin_email: input.adminEmail,
        metadata: input.metadata ?? {},
      });
      if (error) {
        throw new Error("No se pudo registrar la auditoría.");
      }
    },
  };
}
