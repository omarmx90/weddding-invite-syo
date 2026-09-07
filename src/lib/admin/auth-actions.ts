"use server";

import { headers } from "next/headers";
import { resolveAdminAuthEmailRedirectTo } from "@/lib/admin/auth-redirect";
import { requestAdminMagicLink } from "@/lib/admin/request-magic-link";

/**
 * Solicitud magic link admin — allowlist en servidor, sin exponer ADMIN_EMAILS.
 * Respuesta al cliente: solo ok + mensaje (sin outcome que permita enumerar).
 */
export async function requestAdminMagicLinkAction(email: string): Promise<{
  ok: boolean;
  message: string;
}> {
  const headerStore = await headers();
  const proto = headerStore.get("x-forwarded-proto");
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
  const requestOrigin =
    proto && host ? `${proto}://${host}` : host ? `https://${host}` : null;

  const emailRedirectTo = resolveAdminAuthEmailRedirectTo({ requestOrigin });

  const result = await requestAdminMagicLink({
    email,
    emailRedirectTo,
    requestOrigin,
  });

  return {
    ok: result.ok,
    message: result.message,
  };
}
