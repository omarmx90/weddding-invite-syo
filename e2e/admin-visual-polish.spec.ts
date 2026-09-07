import { expect, test, type Page } from "@playwright/test";
import { setPartyCounts } from "./rsvp-helpers";
import fs from "node:fs";
import path from "node:path";

async function resetStores(page: Page) {
  const response = await page.request.post("/api/test/rsvp-reset", {
    data: {},
  });
  expect(response.ok()).toBeTruthy();
  await page.request.delete("/api/test/admin-login");
}

async function adminLogin(page: Page) {
  const response = await page.request.post("/api/test/admin-login", {
    data: {
      email: "admin@syo.test",
      secret: "e2e-admin-secret-not-for-production",
    },
  });
  expect(response.ok()).toBeTruthy();
}

async function shot(page: Page, dir: string, name: string) {
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({
    path: path.join(dir, `${name}.png`),
    fullPage: true,
  });
}

test.describe("Admin mobile visual polish", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Visual QA en Chromium",
  );

  test("capturas 390 / 430 / 1440", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await resetStores(page);

    const tokenRes = await page.request.get(
      "/api/test/rsvp-reset?slug=granados-montero",
    );
    const token = ((await tokenRes.json()) as { token: string }).token;
    await page.goto(
      `/i/granados-montero?t=${encodeURIComponent(token)}`,
    );
    await page.getByTestId("hero-cta").click();
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 2, 0);
    await page
      .getByTestId("rsvp-message")
      .fill("Muchas gracias, ahí estaremos.");
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();

    await adminLogin(page);

    for (const [w, h, folder] of [
      [390, 844, "admin-polish-390"],
      [430, 932, "admin-polish-430"],
    ] as const) {
      const dir = path.join(process.cwd(), "e2e", "output", folder);
      await page.setViewportSize({ width: w, height: h });

      await page.goto("/admin");
      await expect(page.getByTestId("admin-dashboard")).toBeVisible();
      await shot(page, dir, "01-dashboard");

      await page.goto("/admin/guests");
      await expect(page.getByTestId("admin-guest-list")).toBeVisible();
      await shot(page, dir, "02-family-list");

      await page.getByTestId("admin-guest-granados-montero").click();
      await expect(page.getByTestId("admin-detail-message")).toBeVisible();
      await shot(page, dir, "03-confirmed-detail");

      await page.goto("/admin/guests");
      await page.getByTestId("admin-guest-nava-munoz").click();
      await expect(page.getByTestId("admin-detail-pending-note")).toBeVisible();
      await shot(page, dir, "04-pending-detail");

      await page.getByTestId("admin-more-actions").click();
      await expect(page.getByTestId("admin-action-sheet")).toBeVisible();
      await shot(page, dir, "05-action-menu");

      await page.getByTestId("admin-show-qr").click();
      await expect(page.getByTestId("admin-qr")).toBeVisible();
      await shot(page, dir, "06-qr");
      await page.getByTestId("admin-action-sheet-close").click();
    }

    const desktopDir = path.join(
      process.cwd(),
      "e2e",
      "output",
      "admin-polish-1440",
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin");
    await shot(page, desktopDir, "01-dashboard");
    await page.goto("/admin/guests");
    await page.getByTestId("admin-guest-granados-montero").click();
    await shot(page, desktopDir, "02-detail");
  });
});
