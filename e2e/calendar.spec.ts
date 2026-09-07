import { expect, test } from "@playwright/test";
import { wedding } from "../src/content/wedding";
import { getWeddingCalendarPayload } from "../src/lib/calendar/from-wedding";
import {
  buildGoogleCalendarUrl,
  buildWeddingIcs,
  mexicoCityLocalToUtc,
} from "../src/lib/calendar/wedding-event";

test.describe("Calendario de boda — Chromium", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Cobertura prioritaria en Chromium",
  );

  test("payload usa horarios y lugares confirmados", () => {
    const payload = getWeddingCalendarPayload(wedding);
    expect(payload.title).toBe("Boda de Silvia & Omar");
    expect(payload.timezone).toBe("America/Mexico_City");
    expect(payload.startDate).toBe("2026-10-16");
    expect(payload.startTime).toBe("17:00");
    expect(payload.endTime).toBe("21:30");
    expect(payload.location).toContain("Parroquia de Nuestra Señora de la Luz");
    expect(payload.description).toContain("Ceremonia católica");
    expect(payload.description).toContain("Hacienda Los Laureles");
    expect(payload.description).toContain("6:30 p. m.");
  });

  test("Google Calendar incluye ctz y fechas locales correctas", () => {
    const url = new URL(buildGoogleCalendarUrl(getWeddingCalendarPayload(wedding)));
    expect(url.origin + url.pathname).toBe(
      "https://calendar.google.com/calendar/render",
    );
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("Boda de Silvia & Omar");
    expect(url.searchParams.get("ctz")).toBe("America/Mexico_City");
    expect(url.searchParams.get("dates")).toBe(
      "20261016T170000/20261016T213000",
    );
    expect(url.searchParams.get("location") ?? "").toContain(
      "Parroquia de Nuestra Señora de la Luz",
    );
  });

  test("ICS es válido con DTSTART/DTEND en UTC (CDMX UTC-6)", () => {
    const fixedNow = new Date("2026-01-15T12:00:00.000Z");
    const ics = buildWeddingIcs(getWeddingCalendarPayload(wedding), fixedNow);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("SUMMARY:Boda de Silvia & Omar");
    // 17:00 CDMX = 23:00 UTC; 21:30 CDMX = 03:30 UTC del día siguiente
    expect(ics).toContain("DTSTART:20261016T230000Z");
    expect(ics).toContain("DTEND:20261017T033000Z");
    expect(ics).toContain("DTSTAMP:20260115T120000Z");
    expect(mexicoCityLocalToUtc("2026-10-16", "17:00").toISOString()).toBe(
      "2026-10-16T23:00:00.000Z",
    );
  });

  test("UI Guardar la fecha expone Google e ICS", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("invitation-content")).toBeVisible();

    const save = page.getByTestId("save-the-date");
    await save.scrollIntoViewIfNeeded();
    await expect(save.getByText("16 · 10 · 2026")).toBeVisible();
    await expect(save.getByText("Querétaro, México")).toBeVisible();

    await page.getByTestId("save-the-date-toggle").click();
    await expect(page.getByTestId("save-the-date-options")).toBeVisible();

    const google = page.getByTestId("calendar-google");
    await expect(google).toBeVisible();
    const href = await google.getAttribute("href");
    expect(href).toContain("calendar.google.com");
    expect(href).toContain("ctz=America%2FMexico_City");
    expect(href).toContain("20261016T170000");

    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("calendar-ics").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("boda-silvia-y-omar.ics");
  });

  test("familiesBlessing permanece desactivado sin nombres", async ({
    page,
  }) => {
    expect(wedding.familiesBlessing.enabled).toBe(false);
    expect(wedding.familiesBlessing.brideParents.names).toHaveLength(0);
    await page.goto("/");
    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("families-blessing")).toHaveCount(0);
  });
});
