import { createMemoryAdminGuestStore } from "@/lib/rsvp/memory-store";
import { createSupabaseAdminGuestStore } from "@/lib/admin/supabase-store";
import { resolveRsvpStoreMode } from "@/lib/rsvp/repository";
import {
  hasInviteTokenEncryptionKey,
} from "@/lib/admin/encryption";
import type { AdminGuestStore } from "@/lib/admin/store-types";

export function isAdminPersistenceReady(): boolean {
  const mode = resolveRsvpStoreMode();
  if (mode === "memory") return true;
  if (mode === "supabase") {
    return hasInviteTokenEncryptionKey();
  }
  return false;
}

export function getAdminGuestStore(): AdminGuestStore {
  const mode = resolveRsvpStoreMode();
  if (mode === "memory") return createMemoryAdminGuestStore();
  if (mode === "supabase") {
    if (!hasInviteTokenEncryptionKey()) {
      throw new Error("Cifrado de invitaciones no configurado.");
    }
    return createSupabaseAdminGuestStore();
  }
  throw new Error("Persistencia admin no disponible.");
}
