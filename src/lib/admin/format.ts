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
