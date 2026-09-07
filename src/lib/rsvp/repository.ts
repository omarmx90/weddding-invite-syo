import { createMemoryRsvpStore } from "@/lib/rsvp/memory-store";
import { createSupabaseRsvpStore } from "@/lib/rsvp/supabase-store";
import type { InvitationRecord, RsvpStore } from "@/lib/rsvp/types";
import { PILOT_FAMILIES } from "@/lib/rsvp/pilot";
import {
  hasSupabaseServerConfig,
  isVercelPreview,
  isVercelProduction,
} from "@/lib/supabase/server";

export type RsvpStoreMode = "memory" | "supabase" | "unavailable";

/**
 * Resolución fail-closed:
 * - memory → solo si se pide explícitamente o Preview/dev
 * - supabase sin credenciales → unavailable (NUNCA memory en Production)
 */
export function resolveRsvpStoreMode(): RsvpStoreMode {
  const forced = process.env.RSVP_STORE?.trim().toLowerCase();

  if (forced === "memory") {
    return "memory";
  }

  if (forced === "supabase") {
    return hasSupabaseServerConfig() ? "supabase" : "unavailable";
  }

  // auto
  if (isVercelProduction()) {
    return hasSupabaseServerConfig() ? "supabase" : "unavailable";
  }

  if (isVercelPreview()) {
    // Preview no reutiliza service role de producción por defecto.
    return "memory";
  }

  // Desarrollo local (incl. next dev). Playwright fuerza RSVP_STORE=memory.
  return "memory";
}

export function isRsvpPersistenceReady(): boolean {
  const mode = resolveRsvpStoreMode();
  return mode === "memory" || mode === "supabase";
}

export function getRsvpStore(): RsvpStore {
  const mode = resolveRsvpStoreMode();
  if (mode === "memory") return createMemoryRsvpStore();
  if (mode === "supabase") return createSupabaseRsvpStore();
  throw new Error("Persistencia RSVP no disponible.");
}

/**
 * Catálogo local para generateStaticParams.
 * Sin hashes reales — no sirve para autorizar RSVP.
 */
export function getLocalPilotInvitations(): InvitationRecord[] {
  return PILOT_FAMILIES.filter((item) => item.enabled).map((pilot) => ({
    id: `local-${pilot.slug}`,
    slug: pilot.slug,
    displayName: pilot.displayName,
    maxSeats: pilot.maxSeats,
    accessTokenHash: `unset:${pilot.slug}`,
    enabled: pilot.enabled,
  }));
}

export async function listEnabledInvitations(): Promise<InvitationRecord[]> {
  if (!isRsvpPersistenceReady()) {
    return getLocalPilotInvitations();
  }
  return getRsvpStore().listEnabledInvitations();
}

export async function getInvitationBySlug(
  slug: string,
): Promise<InvitationRecord | null> {
  if (!isRsvpPersistenceReady()) {
    return getLocalPilotInvitations().find((item) => item.slug === slug) ?? null;
  }
  return getRsvpStore().getInvitationBySlug(slug);
}
