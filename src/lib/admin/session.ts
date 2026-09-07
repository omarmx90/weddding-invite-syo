import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  isEmailAllowlisted,
  hasAdminAllowlistConfigured,
} from "@/lib/admin/allowlist";
import {
  ADMIN_E2E_COOKIE,
  isAdminE2EAuthEnabled,
  isSupabaseAuthConfiguredForAdmin,
  verifyAdminE2ESession,
} from "@/lib/admin/e2e-auth";
import { isVercelProduction } from "@/lib/supabase/server";

export type AdminSession = {
  email: string;
  mode: "supabase" | "e2e";
};

function getAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
}

export async function createSupabaseAuthServerClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const anonKey = getAnonKey();
  if (!url || !anonKey) {
    throw new Error("Supabase Auth no está configurado.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const cookie of cookiesToSet) {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          }
        } catch {
          // En Server Components set puede fallar; middleware refresca sesión.
        }
      },
    },
  });
}

/**
 * Sesión admin autorizada (allowlist).
 * Fail-closed en Production sin allowlist / sin auth real.
 */
export async function getAuthorizedAdminSession(): Promise<AdminSession | null> {
  if (!hasAdminAllowlistConfigured()) {
    return null;
  }

  if (isAdminE2EAuthEnabled()) {
    const cookieStore = await cookies();
    const e2e = verifyAdminE2ESession(
      cookieStore.get(ADMIN_E2E_COOKIE)?.value,
    );
    if (e2e) {
      return { email: e2e.email, mode: "e2e" };
    }
  }

  if (!isSupabaseAuthConfiguredForAdmin()) {
    return null;
  }

  try {
    const supabase = await createSupabaseAuthServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email) {
      return null;
    }
    if (!isEmailAllowlisted(data.user.email)) {
      return null;
    }
    return {
      email: data.user.email.trim().toLowerCase(),
      mode: "supabase",
    };
  } catch {
    return null;
  }
}

export async function requireAuthorizedAdmin(): Promise<AdminSession> {
  const session = await getAuthorizedAdminSession();
  if (!session) {
    throw new Error("No autorizado.");
  }
  if (isVercelProduction() && session.mode === "e2e") {
    throw new Error("No autorizado.");
  }
  return session;
}
