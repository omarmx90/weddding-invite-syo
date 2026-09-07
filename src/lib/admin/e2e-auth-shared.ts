/**
 * Helpers Edge-safe para decidir si el modo e2e admin está activo.
 * Sin node:crypto ni imports de stores.
 */
export const ADMIN_E2E_COOKIE = "syo_admin_e2e";

export function isAdminE2EAuthEnabled(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  if (process.env.ADMIN_AUTH_MODE?.trim().toLowerCase() !== "test") {
    return false;
  }
  if (process.env.RSVP_STORE?.trim().toLowerCase() !== "memory") {
    return false;
  }
  return Boolean(process.env.ADMIN_E2E_SECRET?.trim());
}

export function isSupabaseAuthConfiguredForAdmin(): boolean {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.ADMIN_EMAILS?.trim(),
  );
}

export function adminRuntimeLabel(): string {
  const env = process.env.VERCEL_ENV;
  if (env === "production") return "production";
  if (env === "preview") return "preview";
  return "development";
}
