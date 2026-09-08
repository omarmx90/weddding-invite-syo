import { expect, test, type Page } from "@playwright/test";
import {
  formatReservedSeats,
  guestInvitations,
} from "../src/content/guests";
import { wedding } from "../src/content/wedding";

async function openPersonalizedInvitation(page: Page, slug: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/i/${slug}`);
  await expect(page.getByTestId("invitation-access-denied")).toBeVisible();
}

async function openPersonalizedWithMemoryToken(page: Page, slug: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const tokenResponse = await page.request.get(
    `/api/test/rsvp-reset?slug=${encodeURIComponent(slug)}`,
  );
  expect(tokenResponse.ok()).toBeTruthy();
  const body = (await tokenResponse.json()) as { token?: string };
  expect(body.token).toBeTruthy();
  await page.goto(`/i/${slug}?t=${encodeURIComponent(body.token!)}`);
  await expect(page.getByTestId("hero-opening")).toBeVisible();
  await page.getByTestId("hero-cta").click();
  await expect(page.getByTestId("invitation-content")).toBeVisible();
  await expect(page.getByTestId("personalized-welcome")).toBeVisible();
}

test.describe("Invitaciones personalizadas — piloto", () => {
  test.describe.configure({ mode: "serial" });

  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Cobertura prioritaria en Chromium",
  );

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.request.post("/api/test/rsvp-reset", { data: {} });
  });

  test("helper singular/plural de lugares", () => {
    expect(formatReservedSeats(1)).toBe("1 lugar");
    expect(formatReservedSeats(2)).toBe("2 lugares");
    expect(formatReservedSeats(3)).toBe("3 lugares");
  });

  test("sin token no revela datos de familia", async ({ page }) => {
    await openPersonalizedInvitation(page, "granados-montero");
    await expect(page.getByText("Familia Granados Montero")).toHaveCount(0);
    await expect(page.getByTestId("rsvp-submit")).toHaveCount(0);
  });

  test("/i/granados-montero con token muestra familia y 2 lugares", async ({
    page,
  }) => {
    await openPersonalizedWithMemoryToken(page, "granados-montero");
    await expect(page.getByTestId("personalized-guest-name")).toHaveText(
      "Familia Granados Montero",
    );
    await expect(page.getByTestId("personalized-seats")).toHaveText("2 lugares");
    await expect(page.getByTestId("presence-gift-section")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Su presencia es nuestro regalo/i }),
    ).toBeVisible();
    const presencePhoto = page.getByTestId("presence-gift-photo");
    await expect(presencePhoto).toBeVisible();
    await expect(presencePhoto.locator("img")).toHaveAttribute(
      "src",
      /feature-presence-gift/,
    );
    await expect(page.getByTestId("rsvp-section")).toBeVisible();

    const order = await page.evaluate(() => {
      const presence = document.querySelector(
        "[data-testid='presence-gift-section']",
      );
      const photo = document.querySelector(
        "[data-testid='presence-gift-photo']",
      );
      const rsvp = document.querySelector("[data-testid='rsvp-section']");
      if (!presence || !photo || !rsvp) return null;
      return {
        photoInsidePresence: presence.contains(photo),
        presenceBeforeRsvp: Boolean(
          presence.compareDocumentPosition(rsvp) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      };
    });
    expect(order).toEqual({
      photoInsidePresence: true,
      presenceBeforeRsvp: true,
    });

    await expect(page.getByTestId("rsvp-deadline")).toContainText(
      "10 de octubre de 2026",
    );
  });

  test("/i/montero-aguilar con token muestra familia y 3 lugares", async ({
    page,
  }) => {
    await openPersonalizedWithMemoryToken(page, "montero-aguilar");
    await expect(page.getByTestId("personalized-guest-name")).toHaveText(
      "Familia Montero Aguilar",
    );
    await expect(page.getByTestId("personalized-seats")).toHaveText("3 lugares");
  });

  test("/i/nava-munoz con token muestra familia y 3 lugares", async ({
    page,
  }) => {
    await openPersonalizedWithMemoryToken(page, "nava-munoz");
    await expect(page.getByTestId("personalized-guest-name")).toHaveText(
      "Familia Nava Muñoz",
    );
    await expect(page.getByTestId("personalized-seats")).toHaveText("3 lugares");
  });

  test("slug inválido muestra 404 elegante", async ({ page }) => {
    const response = await page.goto("/i/familia-inexistente");
    expect(response?.status()).toBe(404);
    await expect(page.getByTestId("not-found")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /No encontramos esta invitación/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Ir al inicio/i })).toBeVisible();
  });

  test("ruta personalizada tiene noindex", async ({ page }) => {
    await page.goto("/i/granados-montero");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/i);
    await expect(robots).toHaveAttribute("content", /nofollow/i);
  });

  test("la home general sigue funcionando sin personalización", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("invitation-root")).toHaveAttribute(
      "data-invitation-mode",
      "general",
    );
    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("invitation-content")).toBeVisible();
    await expect(page.getByTestId("personalized-welcome")).toHaveCount(0);
    await expect(page.getByTestId("rsvp-section")).toHaveCount(0);
  });

  test("no hay overflow horizontal en ruta denegada a 360px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openPersonalizedInvitation(page, "granados-montero");

    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      const before = window.scrollX;
      window.scrollBy(240, 0);
      const afterWindow = window.scrollX;
      window.scrollTo(0, window.scrollY);
      return {
        docOk: doc.scrollWidth <= doc.clientWidth + 1,
        windowScrollDelta: afterWindow - before,
      };
    });

    expect(result.docOk).toBe(true);
    expect(result.windowScrollDelta).toBe(0);
  });

  test("piloto tiene tres invitaciones habilitadas", () => {
    expect(guestInvitations.filter((g) => g.enabled)).toHaveLength(3);
    expect(wedding.rsvp.deadlineIso).toBe("2026-10-10");
  });

  test("capturas personalizadas para inspección visual", async ({ page }) => {
    test.setTimeout(90_000);
    const fs = await import("node:fs");
    const path = await import("node:path");
    const outputDir = path.join(process.cwd(), "e2e", "output");
    fs.mkdirSync(outputDir, { recursive: true });

    const viewports = [
      { name: "360x800", width: 360, height: 800 },
      { name: "390x844", width: 390, height: 844 },
      { name: "430x932", width: 430, height: 932 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await openPersonalizedWithMemoryToken(page, "granados-montero");
      await page.getByTestId("personalized-welcome").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(outputDir, `personalized-${viewport.name}.png`),
        fullPage: false,
      });
    }
  });
});
