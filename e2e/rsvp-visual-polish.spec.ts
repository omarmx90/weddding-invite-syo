import { expect, test } from "@playwright/test";
import { setPartyCounts } from "./rsvp-helpers";
import fs from "node:fs";
import path from "node:path";

async function resetRsvpStore(page: import("@playwright/test").Page) {
  const response = await page.request.post("/api/test/rsvp-reset", {
    data: {},
  });
  expect(response.ok()).toBeTruthy();
}

async function fetchMemoryToken(
  page: import("@playwright/test").Page,
  slug: string,
) {
  const response = await page.request.get(
    `/api/test/rsvp-reset?slug=${encodeURIComponent(slug)}`,
  );
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { ok: boolean; token?: string };
  expect(body.ok).toBe(true);
  return body.token as string;
}

async function openRsvpForm(
  page: import("@playwright/test").Page,
  slug: string,
  token: string,
) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/i/${slug}?t=${encodeURIComponent(token)}`);
  await page.getByTestId("hero-cta").click();
  await expect(page.getByTestId("rsvp-section")).toBeVisible();
  await page.getByTestId("rsvp-section").scrollIntoViewIfNeeded();
}

async function shot(
  page: import("@playwright/test").Page,
  name: string,
) {
  const dir = path.join(process.cwd(), "e2e", "output", "rsvp-polish-390");
  fs.mkdirSync(dir, { recursive: true });
  await page.getByTestId("rsvp-section").screenshot({
    path: path.join(dir, `${name}.png`),
  });
}

test.describe("RSVP visual polish 390×844", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Visual QA en Chromium",
  );

  test("capturas A–E estados móviles", async ({ page }) => {
    await resetRsvpStore(page);
    const token = await fetchMemoryToken(page, "granados-montero");
    await openRsvpForm(page, "granados-montero", token);

    // A) form initial
    await shot(page, "A-form-initial");

    // B) Sí + 1 adulto + 1 niño
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 1, 1);
    await shot(page, "B-yes-two-seats");

    // C) No seleccionado
    await page.getByTestId("rsvp-attend-no").click();
    await shot(page, "C-no-selected");

    // D) success 2/2
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 2, 0);
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "2 de 2 lugares",
    );
    await shot(page, "D-success-2-of-2");

    // E) update mode
    await page.getByTestId("rsvp-edit").click();
    await expect(page.getByTestId("rsvp-form")).toBeVisible();
    await shot(page, "E-update-mode");
  });
});
