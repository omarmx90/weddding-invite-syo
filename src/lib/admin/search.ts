/**
 * Normaliza texto de búsqueda admin: minúsculas + sin acentos.
 */
export function normalizeAdminSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Coincide familia por display name o slug (nunca por token).
 */
export function guestMatchesAdminQuery(
  guest: { displayName: string; slug: string },
  query: string,
): boolean {
  const q = normalizeAdminSearchText(query);
  if (!q) return true;
  return (
    normalizeAdminSearchText(guest.displayName).includes(q) ||
    normalizeAdminSearchText(guest.slug).includes(q)
  );
}
