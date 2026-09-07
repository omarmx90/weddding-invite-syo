import { site } from "@/content/site";
import { isVercelProduction } from "@/lib/supabase/server";

/**
 * Destino del magic link admin.
 * Production: siempre dominio canónico (INVITE_SITE_URL / site.url).
 * Dev/Preview: origen explícito del request o localhost.
 */
export function resolveAdminAuthEmailRedirectTo(options?: {
  requestOrigin?: string | null;
}): string {
  if (isVercelProduction()) {
    const base = (
      process.env.INVITE_SITE_URL?.trim() || site.url
    ).replace(/\/$/, "");
    const redirectTo = `${base}/admin/auth/callback`;
    assertProductionAdminRedirectSafe(redirectTo);
    return redirectTo;
  }

  const origin = (options?.requestOrigin || "").replace(/\/$/, "");
  if (origin && /^https?:\/\//i.test(origin)) {
    return `${origin}/admin/auth/callback`;
  }

  const fromEnv = process.env.INVITE_SITE_URL?.trim()?.replace(/\/$/, "");
  if (fromEnv) {
    return `${fromEnv}/admin/auth/callback`;
  }

  return "http://127.0.0.1:3000/admin/auth/callback";
}

export function assertProductionAdminRedirectSafe(redirectTo: string): void {
  if (!isVercelProduction()) return;
  if (/localhost|127\.0\.0\.1/i.test(redirectTo)) {
    throw new Error("Redirect admin de Production apunta a localhost.");
  }
  if (!redirectTo.startsWith("https://silvia-y-omar.com/")) {
    throw new Error("Redirect admin de Production fuera del dominio canónico.");
  }
}
