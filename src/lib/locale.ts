/**
 * Locale oficial del producto.
 * Siempre usar es-MX de forma explícita; no depender del locale del dispositivo.
 */
export const PRODUCT_LOCALE = "es-MX" as const;

export const PRODUCT_TIMEZONE = "America/Mexico_City" as const;

/**
 * Fecha larga en español de México, p. ej. "Viernes 16 de octubre de 2026".
 * Usa mediodía local para evitar desfases de zona horaria en fechas solo-calendario.
 * Se elimina la coma tras el día de la semana para un tono más editorial de invitación.
 */
export function formatLongDateEsMx(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  const formatted = new Intl.DateTimeFormat(PRODUCT_LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: PRODUCT_TIMEZONE,
  }).format(date);

  const withoutWeekdayComma = formatted.replace(/^(\p{L}+),/u, "$1");
  return capitalizeFirstLetter(withoutWeekdayComma);
}

function capitalizeFirstLetter(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase(PRODUCT_LOCALE) + value.slice(1);
}
