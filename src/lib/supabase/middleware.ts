import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_E2E_COOKIE,
  isAdminE2EAuthEnabled,
} from "@/lib/admin/e2e-auth-shared";
import { isEmailAllowlisted } from "@/lib/admin/allowlist";

/**
 * Refresca sesión Supabase Auth y decide acceso a /admin.
 * En modo e2e solo comprueba presencia de cookie; la firma se valida en Node.
 */
export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith("/admin");
  if (!isAdminPath) {
    return response;
  }

  const isPublicAdminAuth =
    pathname === "/admin/login" || pathname.startsWith("/admin/auth/");

  if (isAdminE2EAuthEnabled()) {
    const hasCookie = Boolean(request.cookies.get(ADMIN_E2E_COOKIE)?.value);
    if (hasCookie) {
      if (pathname === "/admin/login") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
      return response;
    }
    if (!isPublicAdminAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const urlEnv = process.env.SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!urlEnv || !anonKey) {
    if (!isPublicAdminAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(urlEnv, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
        }
        response = NextResponse.next({ request });
        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authorized = Boolean(user?.email && isEmailAllowlisted(user.email));

  if (!authorized && !isPublicAdminAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    if (user?.email && !isEmailAllowlisted(user.email)) {
      url.searchParams.set("error", "unauthorized");
    }
    return NextResponse.redirect(url);
  }

  if (authorized && pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}
