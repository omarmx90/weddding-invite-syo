/**
 * Slug amigable y seguro a partir del nombre de familia.
 * No incluye secretos; colisiones se resuelven con sufijo numérico.
 */
export function slugifyFamilyName(displayName: string): string {
  const normalized = displayName
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/familia\s+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  const base = normalized || "invitacion";
  return base.slice(0, 64);
}

export async function allocateUniqueSlug(
  displayName: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugifyFamilyName(displayName);
  if (!(await exists(base))) return base;

  for (let index = 2; index <= 50; index += 1) {
    const candidate = `${base.slice(0, 60)}-${index}`;
    if (!(await exists(candidate))) return candidate;
  }

  throw new Error("No se pudo generar un slug único.");
}
