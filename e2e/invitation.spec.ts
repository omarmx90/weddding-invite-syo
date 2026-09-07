import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { wedding } from "../src/content/wedding";

const OUTPUT_DIR = path.join(process.cwd(), "e2e", "output");
const CEREMONY_MAPS_URL = wedding.event.ceremony.mapsUrl;

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

  test("el hero muestra la fotografía real con alt correcto", async ({ page }) => {
    await page.goto("/");
    const photo = page.getByTestId("hero-photo");
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute(
      "alt",
      "Silvia y Omar frente a una iglesia durante una sesión de pareja",
    );
    await expect(photo).toHaveAttribute("src", /portada-display/);
    await expect
      .poll(
        async () => photo.evaluate((img: HTMLImageElement) => img.naturalWidth),
        { timeout: 30_000 },
      )
      .toBeGreaterThan(0);

    await expect(page.getByTestId("hero-opening").getByText("Querétaro, México")).toBeVisible();
    await expect(page.getByTestId("hero-cta")).toBeVisible();
  });

  test("el CTA revela la experiencia de invitación", async ({ page }) => {
    await openInvitation(page);
    await expect(page.getByTestId("intro-section")).toBeVisible();
    await expect(page.getByTestId("hero-opening")).toHaveCount(0);
  });

  test("la ceremonia muestra parroquia, fecha, hora y cómo llegar", async ({
    page,
  }) => {
    await openInvitation(page);
    const ceremony = page.getByTestId("ceremony");
    await ceremony.scrollIntoViewIfNeeded();

    await expect(
      ceremony.getByRole("heading", { name: "Ceremonia católica" }),
    ).toBeVisible();
    await expect(
      ceremony.getByText("Parroquia de Nuestra Señora de la Luz"),
    ).toBeVisible();
    await expect(ceremony.getByText("Viernes", { exact: true })).toBeVisible();
    await expect(ceremony.getByText("16 de octubre de 2026")).toBeVisible();
    await expect(ceremony.getByTestId("ceremony-time")).toHaveText("5:00 p. m.");

    const mapsCta = ceremony.getByTestId("ceremony-maps-cta");
    await expect(mapsCta).toHaveText(/Cómo llegar/i);
    await expect(mapsCta).toHaveAttribute("href", CEREMONY_MAPS_URL);
    await expect(mapsCta).toHaveAttribute("target", "_blank");
    await expect(mapsCta).toHaveAttribute("rel", /noopener/);
  });

  test("el mensaje familiar de bienvenida es visible", async ({ page }) => {
    await openInvitation(page);
    const intro = page.getByTestId("intro-section");
    await expect(
      intro.getByRole("heading", {
        name: /Nos hace mucha ilusión celebrar este día con ustedes/i,
      }),
    ).toBeVisible();
    await expect(intro.getByText("Silvia, Omar y Mauro", { exact: true })).toBeVisible();
  });

  test("la sección de recepción es visible", async ({ page }) => {
    await openInvitation(page);
    const reception = page.getByTestId("reception");
    await reception.scrollIntoViewIfNeeded();
    await expect(reception.getByRole("heading", { name: "Recepción" })).toBeVisible();
  });

  test("Nuestro equipo muestra familia, equipos y fotografía", async ({
    page,
  }) => {
    await openInvitation(page);
    const team = page.getByTestId("nuestro-equipo");
    await team.scrollIntoViewIfNeeded();

    await expect(
      team.getByRole("heading", { name: "Nuestro equipo" }),
    ).toBeVisible();
    await expect(team.getByText("Mauro", { exact: true }).first()).toBeVisible();
    await expect(team.getByText("América", { exact: true })).toBeVisible();
    await expect(team.getByText("Chivas", { exact: true })).toBeVisible();
    await expect(team.getByText("Cruz Azul", { exact: true })).toBeVisible();
    await expect(
      team.getByText("Tres corazones. Tres equipos. Una sola familia."),
    ).toBeVisible();

    const photo = team.getByRole("img", {
      name: /Silvia, Omar y Mauro/i,
    });
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute("alt", /Silvia, Omar y Mauro/);
  });

  test("la galería solo aparece cuando está habilitada con contenido", async ({
    page,
  }) => {
    await openInvitation(page);
    if (wedding.gallery.enabled && wedding.gallery.items.some((i) => i.featured)) {
      const gallery = page.getByTestId("nuestros-momentos");
      await expect(gallery).toBeVisible();
      const rail = page.getByTestId("gallery-rail");
      await expect(rail).toBeVisible();
      await expect(rail).toHaveAttribute("tabindex", "0");
    } else {
      await expect(page.getByTestId("nuestros-momentos")).toHaveCount(0);
      await expect(page.getByTestId("gallery-rail")).toHaveCount(0);
    }
  });

  test("capturas de Nuestro equipo para inspección visual", async ({ page }) => {
    test.setTimeout(90_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
      { name: "360x800", width: 360, height: 800 },
      { name: "390x844", width: 390, height: 844 },
      { name: "430x932", width: 430, height: 932 },
      { name: "1440x900", width: 1440, height: 900 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await openInvitation(page);

      const team = page.getByTestId("nuestro-equipo");
      await team.scrollIntoViewIfNeeded();

      const photo = team.getByRole("img", {
        name: /Silvia, Omar y Mauro/i,
      });
      await expect(photo).toBeVisible();
      await expect
        .poll(
          async () =>
            photo.evaluate((img: HTMLImageElement) => img.naturalWidth),
          { timeout: 30_000 },
        )
        .toBeGreaterThan(0);

      await team.screenshot({
        path: path.join(OUTPUT_DIR, `nuestro-equipo-${viewport.name}.png`),
      });
    }
  });

  test("el flujo completo de secciones está presente", async ({ page }) => {
    await openInvitation(page);
    await expect(page.getByTestId("intro-section")).toBeVisible();
    await expect(page.getByTestId("ceremony")).toBeVisible();
    await expect(page.getByTestId("reception")).toBeVisible();
    await expect(page.getByTestId("nuestro-equipo")).toBeVisible();
  });

  test("no hay overflow horizontal a 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openInvitation(page);
    await page.getByTestId("nuestro-equipo").scrollIntoViewIfNeeded();

    const hasOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });

    expect(hasOverflow).toBe(false);
  });

  test("capturas del hero editorial para inspección visual", async ({ page }) => {
    test.setTimeout(90_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
      { name: "360x800", width: 360, height: 800 },
      { name: "390x844", width: 390, height: 844 },
      { name: "430x932", width: 430, height: 932 },
      { name: "1440x900", width: 1440, height: 900 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Silvia & Omar" })).toBeVisible();
      await expect(page.getByText("16 · 10 · 2026")).toBeVisible();
      await expect(page.getByTestId("hero-cta")).toBeVisible();

      const photo = page.getByTestId("hero-photo");
      await expect
        .poll(
          async () => photo.evaluate((img: HTMLImageElement) => img.naturalWidth),
          { timeout: 30_000 },
        )
        .toBeGreaterThan(0);

      const hasOverflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 1;
      });
      expect(hasOverflow).toBe(false);

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `hero-${viewport.name}.png`),
        fullPage: false,
      });
    }
  });

  test("capturas móviles para inspección visual", async ({ page }) => {
    test.setTimeout(90_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
      { name: "360x800", width: 360, height: 800 },
      { name: "390x844", width: 390, height: 844 },
      { name: "430x932", width: 430, height: 932 },
      { name: "768x1024", width: 768, height: 1024 },
      { name: "1440x900", width: 1440, height: 900 },
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
      await expect(page.getByTestId("nuestro-equipo")).toBeVisible();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `invitation-${viewport.name}.png`),
        fullPage: true,
      });
    }
  });
});
