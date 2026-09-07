import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseAuthBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error("Supabase Auth no está disponible en el cliente.");
  }
  return createBrowserClient(url, anonKey);
}
