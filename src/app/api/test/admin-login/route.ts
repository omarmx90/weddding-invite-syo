import { NextResponse } from "next/server";
import {
  ADMIN_E2E_COOKIE,
  isAdminE2EAuthEnabled,
  signAdminE2ESession,
} from "@/lib/admin/e2e-auth";
import {
  getAdminAllowlist,
  isEmailAllowlisted,
  normalizeAdminEmail,
} from "@/lib/admin/allowlist";

/**
 * Login de prueba para Playwright — SOLO memory + ADMIN_AUTH_MODE=test.
 * Fail-closed en Production.
 */
export async function POST(request: Request) {
  if (!isAdminE2EAuthEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    secret?: string;
  };

  const expected = process.env.ADMIN_E2E_SECRET?.trim();
  if (!expected || body.secret !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const email = normalizeAdminEmail(
    body.email || getAdminAllowlist()[0] || "",
  );
  if (!email || !isEmailAllowlisted(email)) {
    return NextResponse.json({ ok: false, code: "not_allowlisted" }, {
      status: 403,
    });
  }

  const token = signAdminE2ESession(email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_E2E_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
  });
  return response;
}

export async function DELETE() {
  if (!isAdminE2EAuthEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_E2E_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
