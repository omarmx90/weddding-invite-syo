import { PRODUCT_LOCALE, PRODUCT_TIMEZONE } from "@/lib/locale";

export function formatAdminDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat(PRODUCT_LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: PRODUCT_TIMEZONE,
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** Fecha RSVP secundaria, es-MX — sin hora técnica. */
export function formatAdminConfirmedDate(iso: string): string {
  try {
    const date = new Intl.DateTimeFormat(PRODUCT_LOCALE, {
      day: "numeric",
      month: "long",
      timeZone: PRODUCT_TIMEZONE,
    }).format(new Date(iso));
    return `Confirmado el ${date}`;
  } catch {
    return "";
  }
}

/**
 * Desglose adultos/niños sin ruido de “0 niños”.
 * No inventa datos: solo formatea conteos ya resueltos.
 */
export function formatAdminPartyLine(
  adultCount: number,
  childCount: number,
): string {
  const parts: string[] = [];
  if (adultCount > 0) {
    parts.push(`${adultCount} ${adultCount === 1 ? "adulto" : "adultos"}`);
  }
  if (childCount > 0) {
    parts.push(`${childCount} ${childCount === 1 ? "niño" : "niños"}`);
  }
  return parts.join(" · ");
}
