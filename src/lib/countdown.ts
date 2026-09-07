import { PRODUCT_TIMEZONE } from "./locale";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  /** true cuando el instante objetivo ya pasó */
  arrived: boolean;
};

type WallParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function getZonedParts(utcMs: number, timeZone: string): WallParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(utcMs));

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

/**
 * Convierte una hora de pared en una zona IANA al instante UTC (ms).
 * No asume UTC ni el timezone del dispositivo como zona del evento.
 */
export function wallTimeInZoneToUtcMs(
  isoDate: string,
  hour: number,
  minute: number,
  timeZone: string,
): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Fecha ISO inválida: ${isoDate}`);
  }

  // Primera aproximación: interpretar los números como UTC y corregir por offset de zona.
  let utcMs = Date.UTC(year, month - 1, day, hour, minute, 0);

  for (let i = 0; i < 4; i += 1) {
    const wall = getZonedParts(utcMs, timeZone);
    const asIfUtc = Date.UTC(
      wall.year,
      wall.month - 1,
      wall.day,
      wall.hour,
      wall.minute,
      wall.second,
    );
    const desired = Date.UTC(year, month - 1, day, hour, minute, 0);
    const delta = desired - asIfUtc;
    if (delta === 0) break;
    utcMs += delta;
  }

  return utcMs;
}

export function parseTargetTime(hhmm: string): { hour: number; minute: number } {
  const [hourRaw, minuteRaw] = hhmm.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Hora inválida: ${hhmm}`);
  }
  return { hour, minute };
}

/**
 * Calcula días / horas / minutos restantes hasta el instante del evento.
 * Nunca devuelve valores negativos.
 */
export function getCountdownParts(
  nowMs: number,
  targetIsoDate: string,
  targetTime: string,
  timeZone: string = PRODUCT_TIMEZONE,
): CountdownParts {
  const { hour, minute } = parseTargetTime(targetTime);
  const targetMs = wallTimeInZoneToUtcMs(targetIsoDate, hour, minute, timeZone);
  const diff = targetMs - nowMs;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, arrived: true };
  }

  const totalMinutes = Math.floor(diff / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes, arrived: false };
}

export function padCountdownValue(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}
