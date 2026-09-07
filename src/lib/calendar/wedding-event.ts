/**
 * Calendario de la boda — Google Calendar + ICS (Apple/Outlook).
 * Horarios en America/Mexico_City; serialización ICS en UTC.
 */

export type WeddingCalendarPayload = {
  title: string;
  /** Descripción multilínea (LF); se escapa en ICS */
  description: string;
  /** Ubicación principal del evento (ceremonia) */
  location: string;
  timezone: "America/Mexico_City";
  /** YYYY-MM-DD */
  startDate: string;
  /** HH:mm 24h local */
  startTime: string;
  /** YYYY-MM-DD */
  endDate: string;
  /** HH:mm 24h local */
  endTime: string;
  uid: string;
};

/** México ya no aplica DST federal: CDMX = UTC−6 todo el año. */
const MEXICO_CITY_UTC_OFFSET_HOURS = -6;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseLocalParts(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return { y, m, d, hh, mm };
}

/** Convierte fecha/hora local CDMX a Date UTC. */
export function mexicoCityLocalToUtc(date: string, time: string): Date {
  const { y, m, d, hh, mm } = parseLocalParts(date, time);
  return new Date(
    Date.UTC(y, m - 1, d, hh - MEXICO_CITY_UTC_OFFSET_HOURS, mm, 0),
  );
}

function formatUtcCompact(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}` +
    `T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`
  );
}

function formatLocalCompact(date: string, time: string): string {
  const { y, m, d, hh, mm } = parseLocalParts(date, time);
  return `${y}${pad2(m)}${pad2(d)}T${pad2(hh)}${pad2(mm)}00`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let remaining = line;
  parts.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    parts.push(` ${remaining.slice(0, 74)}`);
    remaining = remaining.slice(74);
  }
  return parts.join("\r\n");
}

export function buildGoogleCalendarUrl(payload: WeddingCalendarPayload): string {
  const dates = `${formatLocalCompact(payload.startDate, payload.startTime)}/${formatLocalCompact(payload.endDate, payload.endTime)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: payload.title,
    dates,
    ctz: payload.timezone,
    details: payload.description,
    location: payload.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildWeddingIcs(payload: WeddingCalendarPayload, now = new Date()): string {
  const dtStart = formatUtcCompact(
    mexicoCityLocalToUtc(payload.startDate, payload.startTime),
  );
  const dtEnd = formatUtcCompact(
    mexicoCityLocalToUtc(payload.endDate, payload.endTime),
  );
  const dtStamp = formatUtcCompact(now);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Silvia y Omar//Wedding Invite//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${payload.uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(payload.title)}`,
    `DESCRIPTION:${escapeIcsText(payload.description)}`,
    `LOCATION:${escapeIcsText(payload.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

export function downloadIcsFile(filename: string, ics: string): void {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
