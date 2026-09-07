import { createHmac, timingSafeEqual } from "node:crypto";
import { isAdminE2EAuthEnabled } from "@/lib/admin/e2e-auth-shared";
import {
  isEmailAllowlisted,
  normalizeAdminEmail,
} from "@/lib/admin/allowlist";

export {
  ADMIN_E2E_COOKIE,
  isAdminE2EAuthEnabled,
  isSupabaseAuthConfiguredForAdmin,
  adminRuntimeLabel,
} from "@/lib/admin/e2e-auth-shared";

function getE2ESecret(): string {
  const secret = process.env.ADMIN_E2E_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_E2E_SECRET no configurado.");
  }
  return secret;
}

export function signAdminE2ESession(email: string): string {
  const normalized = normalizeAdminEmail(email);
  if (!isEmailAllowlisted(normalized)) {
    throw new Error("Email no allowlisted para e2e admin.");
  }
  const payload = Buffer.from(
    JSON.stringify({
      email: normalized,
      exp: Date.now() + 1000 * 60 * 60 * 8,
    }),
    "utf8",
  ).toString("base64url");
  const sig = createHmac("sha256", getE2ESecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminE2ESession(
  value: string | undefined | null,
): { email: string } | null {
  if (!value || !isAdminE2EAuthEnabled()) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;

  const expected = createHmac("sha256", getE2ESecret())
    .update(payload)
    .digest("base64url");

  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { email?: string; exp?: number };
    if (!parsed.email || !parsed.exp || parsed.exp < Date.now()) {
      return null;
    }
    if (!isEmailAllowlisted(parsed.email)) return null;
    return { email: normalizeAdminEmail(parsed.email) };
  } catch {
    return null;
  }
}
