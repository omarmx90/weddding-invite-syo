import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase solo servidor (service role).
 * Nunca importar este módulo en Client Components.
 * Nunca exponer SUPABASE_SERVICE_ROLE_KEY con prefijo NEXT_PUBLIC_.
 */
export function createServiceSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Supabase no está configurado en el servidor.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function hasSupabaseServerConfig(): boolean {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export function isVercelProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function isVercelPreview(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
