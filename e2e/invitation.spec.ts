import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "e2e", "output");

async function openInvitation(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("hero-opening")).toBeVisible();
  await page.getByTestId("hero-cta").click();
  await expect(page.getByTestId("invitation-content")).toBeVisible();
}

test.describe("Invitación de boda — Chromium", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Cobertura prioritaria en Chromium",
  );

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("la página de inicio carga", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByTestId("invitation-root")).toBeVisible();
  });

  test("los nombres de la pareja son visibles", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Silvia & Omar" })).toBeVisible();
  });

  test("la fecha de la boda es visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("16 · 10 · 2026")).toBeVisible();
  });

  test("el CTA revela la experiencia de invitación", async ({ page }) => {
    await openInvitation(page);
    await expect(page.getByTestId("intro-section")).toBeVisible();
    await expect(page.getByTestId("hero-opening")).toHaveCount(0);
  });

  test("la sección de ceremonia es visible", async ({ page }) => {
    await openInvitation(page);
    const ceremony = page.getByTestId("ceremony");
    await ceremony.scrollIntoViewIfNeeded();
    await expect(
      ceremony.getByRole("heading", { name: "Ceremonia religiosa" }),
    ).toBeVisible();
    await expect(ceremony.getByText("Viernes 16 de octubre de 2026")).toBeVisible();
  });

  test("la sección de recepción es visible", async ({ page }) => {
    await openInvitation(page);
    const reception = page.getByTestId("reception");
    await reception.scrollIntoViewIfNeeded();
    await expect(reception.getByRole("heading", { name: "Recepción" })).toBeVisible();
  });

  test("no hay overflow horizontal a 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openInvitation(page);

    const hasOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });

    expect(hasOverflow).toBe(false);
  });

  test("capturas móviles para inspección visual", async ({ page }) => {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
      { name: "360x800", width: 360, height: 800 },
      { name: "390x844", width: 390, height: 844 },
      { name: "430x932", width: 430, height: 932 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Silvia & Omar" })).toBeVisible();
      await expect(page.getByTestId("hero-cta")).toBeVisible();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `hero-${viewport.name}.png`),
        fullPage: false,
      });

      await page.getByTestId("hero-cta").click();
      await expect(page.getByTestId("invitation-content")).toBeVisible();
      await expect(page.getByTestId("ceremony").getByRole("heading")).toBeVisible();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `invitation-${viewport.name}.png`),
        fullPage: true,
      });
    }
  });
});
