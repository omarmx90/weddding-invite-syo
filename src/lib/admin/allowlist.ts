/**
 * Allowlist de administradores — solo servidor.
 * ADMIN_EMAILS=email1@example.com,email2@example.com
 */
export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim() ?? "";
  if (!raw) return [];
  const emails = raw
    .split(",")
    .map((email) => normalizeAdminEmail(email))
    .filter(Boolean);
  return [...new Set(emails)];
}

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isEmailAllowlisted(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = normalizeAdminEmail(email);
  return getAdminAllowlist().includes(normalized);
}

export function hasAdminAllowlistConfigured(): boolean {
  return getAdminAllowlist().length > 0;
}
