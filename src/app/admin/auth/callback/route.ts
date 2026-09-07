import { NextResponse } from "next/server";
import { createSupabaseAuthServerClient } from "@/lib/admin/session";
import { isEmailAllowlisted } from "@/lib/admin/allowlist";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = "/admin";

  if (code) {
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email && isEmailAllowlisted(data.user.email)) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL("/admin/login?error=unauthorized", requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL("/admin/login?error=auth", requestUrl.origin),
  );
}
