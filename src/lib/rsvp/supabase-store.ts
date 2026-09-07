import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type {
  InvitationRecord,
  RsvpRecord,
  RsvpStore,
  UpsertRsvpInput,
} from "@/lib/rsvp/types";

type InvitationRow = {
  id: string;
  slug: string;
  display_name: string;
  max_seats: number;
  access_token_hash: string;
  enabled: boolean;
};

type RsvpRow = {
  id: string;
  invitation_id: string;
  attending: boolean;
  confirmed_seats: number;
  message: string | null;
  created_at: string;
  updated_at: string;
};

function mapInvitation(row: InvitationRow): InvitationRecord {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    maxSeats: row.max_seats,
    accessTokenHash: row.access_token_hash,
    enabled: row.enabled,
  };
}

function mapRsvp(row: RsvpRow): RsvpRecord {
  return {
    id: row.id,
    invitationId: row.invitation_id,
    attending: row.attending,
    confirmedSeats: row.confirmed_seats,
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const INVITATION_COLUMNS =
  "id, slug, display_name, max_seats, access_token_hash, enabled";

export function createSupabaseRsvpStore(): RsvpStore {
  const supabase = createServiceSupabaseClient();

  return {
    mode: "supabase",

    async listEnabledInvitations() {
      const { data, error } = await supabase
        .from("invitations")
        .select(INVITATION_COLUMNS)
        .eq("enabled", true)
        .order("slug", { ascending: true });

      if (error) {
        throw new Error("No se pudieron leer las invitaciones.");
      }

      return (data as InvitationRow[]).map(mapInvitation);
    },

    async getInvitationBySlug(slug: string) {
      const { data, error } = await supabase
        .from("invitations")
        .select(INVITATION_COLUMNS)
        .eq("slug", slug)
        .eq("enabled", true)
        .maybeSingle();

      if (error) {
        throw new Error("No se pudo leer la invitación.");
      }

      return data ? mapInvitation(data as InvitationRow) : null;
    },

    async getRsvpByInvitationId(invitationId: string) {
      const { data, error } = await supabase
        .from("rsvps")
        .select(
          "id, invitation_id, attending, confirmed_seats, message, created_at, updated_at",
        )
        .eq("invitation_id", invitationId)
        .maybeSingle();

      if (error) {
        throw new Error("No se pudo leer la confirmación.");
      }

      return data ? mapRsvp(data as RsvpRow) : null;
    },

    async upsertRsvp(input: UpsertRsvpInput) {
      const { data, error } = await supabase
        .from("rsvps")
        .upsert(
          {
            invitation_id: input.invitationId,
            attending: input.attending,
            confirmed_seats: input.confirmedSeats,
            message: input.message ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "invitation_id" },
        )
        .select(
          "id, invitation_id, attending, confirmed_seats, message, created_at, updated_at",
        )
        .single();

      if (error || !data) {
        throw new Error("No se pudo guardar la confirmación.");
      }

      return mapRsvp(data as RsvpRow);
    },
  };
}
