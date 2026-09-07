import { NextResponse } from "next/server";
import { createSupabaseAuthServerClient } from "@/lib/admin/session";
import { isEmailAllowlisted } from "@/lib/admin/allowlist";
import {
  assertProductionAdminRedirectSafe,
  resolveAdminAuthEmailRedirectTo,
} from "@/lib/admin/auth-redirect";
import { isVercelProduction } from "@/lib/supabase/server";

/**
 * Callback PKCE: Supabase redirige con ?code=…
 * Intercambio: exchangeCodeForSession(code).
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error");
  const next = "/admin";

  const origin = isVercelProduction()
    ? resolveAdminAuthEmailRedirectTo().replace(/\/admin\/auth\/callback$/, "")
    : requestUrl.origin;

  if (isVercelProduction()) {
    assertProductionAdminRedirectSafe(`${origin}/admin/auth/callback`);
  }

  if (authError) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent(authError)}`, origin),
    );
  }

  if (code) {
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email && isEmailAllowlisted(data.user.email)) {
        return NextResponse.redirect(new URL(next, origin));
      }
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL("/admin/login?error=unauthorized", origin),
      );
    }
  }

  return NextResponse.redirect(new URL("/admin/login?error=auth", origin));
}
