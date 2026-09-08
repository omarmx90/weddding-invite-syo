import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { wedding } from "../src/content/wedding";

const OUTPUT_DIR = path.join(process.cwd(), "e2e", "output");
const CEREMONY_MAPS_URL = wedding.event.ceremony.mapsUrl;
const RECEPTION_MAPS_URL = wedding.event.reception.mapsUrl;

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

  test("cada sección cierra con el separador S & O", async ({ page }) => {
    await openInvitation(page);
    const marks = page.getByTestId("section-end-mark");
    // Ruta pública: countdown, intro, 3 cinematics, 2 eventos, puente,
    // horario, fe, equipo, galería, vestimenta, presencia (sin familias ni RSVP).
    await expect(marks).toHaveCount(14);
    await expect(marks.first()).toContainText("S & O");
  });

  test("la ceremonia muestra parroquia, dirección, fecha, hora y cómo llegar", async ({
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
    await expect(
      ceremony.getByText(
        "Av. de la Luz S/N, Santa Ana, 76116 Santiago de Querétaro, Qro.",
      ),
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

  test("la celebración íntima muestra lugar, horario y cómo llegar", async ({
    page,
  }) => {
    await openInvitation(page);
    const reception = page.getByTestId("reception");
    await reception.scrollIntoViewIfNeeded();

    await expect(
      reception.getByRole("heading", { name: "Celebración íntima" }),
    ).toBeVisible();
    await expect(
      reception.getByText("Hacienda Los Laureles Restaurante Y Banquetes"),
    ).toBeVisible();
    await expect(reception.getByTestId("reception-time")).toHaveText(
      "6:30 p. m. – 9:30 p. m.",
    );
    await expect(
      reception.getByText(
        "Carretera México–San Luis Potosí, Km. 8.5, Jurica, 76100 Santiago de Querétaro, Qro.",
      ),
    ).toBeVisible();

    const mapsCta = reception.getByTestId("reception-maps-cta");
    await expect(mapsCta).toHaveText(/Cómo llegar/i);
    await expect(mapsCta).toHaveAttribute("href", RECEPTION_MAPS_URL);
    await expect(mapsCta).toHaveAttribute("target", "_blank");
    await expect(mapsCta).toHaveAttribute("rel", /noopener/);

    await expect(page.getByTestId("reception-hospitality")).toBeVisible();
    await expect(page.getByTestId("reception-hospitality-lead")).toContainText(
      /momento sencillo y muy nuestro/i,
    );
    await expect(page.getByTestId("reception-hospitality-food")).toContainText(
      /antojitos mexicanos/i,
    );
    await expect(page.getByTestId("reception-children-title")).toHaveText(
      /Los pequeños también son bienvenidos/i,
    );
    await expect(page.getByTestId("reception-children-body")).toContainText(
      /más que bienvenidos/i,
    );
    await expect(page.getByTestId("reception-drinks-note")).toContainText(
      /bebidas sin alcohol/i,
    );
  });

  test("la transición hacia la celebración es visible", async ({ page }) => {
    await openInvitation(page);
    const bridge = page.getByTestId("celebration-transition");
    await bridge.scrollIntoViewIfNeeded();
    await expect(bridge.getByText(/seguir celebrando/i)).toBeVisible();
  });

  test("el itinerario del día muestra horarios claros", async ({ page }) => {
    await openInvitation(page);
    const schedule = page.getByTestId("day-schedule");
    await schedule.scrollIntoViewIfNeeded();

    await expect(
      schedule.getByRole("heading", { name: "Itinerario del día" }),
    ).toBeVisible();

    const ceremonyItem = schedule.getByTestId("schedule-item-ceremony");
    await expect(ceremonyItem.getByText("5:00 p. m.")).toBeVisible();
    await expect(ceremonyItem.getByText("Ceremonia católica")).toBeVisible();
    await expect(
      ceremonyItem.getByText("Parroquia de Nuestra Señora de la Luz"),
    ).toBeVisible();

    const receptionItem = schedule.getByTestId("schedule-item-reception");
    await expect(receptionItem.getByText("6:30 p. m.")).toBeVisible();
    await expect(receptionItem.getByText("Celebración íntima")).toBeVisible();
    await expect(receptionItem.getByText("Hacienda Los Laureles")).toBeVisible();

    const closingItem = schedule.getByTestId("schedule-item-closing");
    await expect(closingItem.getByText("9:30 p. m.")).toBeVisible();
    await expect(closingItem.getByText("Cierre de la celebración")).toBeVisible();
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

    const gallery = page.getByTestId("football-gallery");
    await expect(gallery).toBeVisible();
    await expect(gallery).toHaveAttribute("role", "region");
    expect(wedding.familyTeam.footballGallery.items.length).toBeGreaterThanOrEqual(
      10,
    );
    expect(wedding.familyTeam.footballGallery.items.length).toBeLessThanOrEqual(
      20,
    );

    const first = page.getByTestId("football-photo-fb-01");
    await expect(first).toBeVisible();
    await expect(first.locator("img")).toHaveAttribute(
      "alt",
      /Silvia, Mauro y Omar/i,
    );
  });

  test("galería futbolera abre lightbox con navegación y Escape", async ({
    page,
  }) => {
    await openInvitation(page);
    const team = page.getByTestId("nuestro-equipo");
    await team.scrollIntoViewIfNeeded();

    await page.getByTestId("football-photo-fb-01").click();
    const lightbox = page.getByTestId("football-lightbox");
    await expect(lightbox).toBeVisible();
    await expect(page.getByTestId("football-lightbox-counter")).toHaveText(
      `1 / ${wedding.familyTeam.footballGallery.items.length}`,
    );

    await page.getByTestId("football-lightbox-next").click();
    await expect(page.getByTestId("football-lightbox-counter")).toHaveText(
      `2 / ${wedding.familyTeam.footballGallery.items.length}`,
    );

    await page.getByTestId("football-lightbox-prev").click();
    await expect(page.getByTestId("football-lightbox-counter")).toHaveText(
      `1 / ${wedding.familyTeam.footballGallery.items.length}`,
    );

    await page.keyboard.press("Escape");
    await expect(lightbox).toHaveCount(0);
  });

  test("capturas de la galería futbolera y lightbox", async ({ page }) => {
    test.setTimeout(120_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
      { name: "390x844", width: 390, height: 844 },
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
      await team.screenshot({
        path: path.join(OUTPUT_DIR, `football-section-${viewport.name}.png`),
      });

      const gallery = page.getByTestId("football-gallery");
      await gallery.scrollIntoViewIfNeeded();
      await gallery.screenshot({
        path: path.join(OUTPUT_DIR, `football-rail-${viewport.name}.png`),
      });
      await gallery.evaluate((el) => {
        el.scrollLeft = Math.min(220, el.scrollWidth);
      });
      await gallery.screenshot({
        path: path.join(OUTPUT_DIR, `football-rail-scrolled-${viewport.name}.png`),
      });
      await gallery.evaluate((el) => {
        el.scrollLeft = 0;
      });

      await page.getByTestId("football-photo-fb-01").click();
      await expect(page.getByTestId("football-lightbox")).toBeVisible();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `football-lightbox-${viewport.name}.png`),
      });
      await page.getByTestId("football-lightbox-close").click();

      const moments = page.getByTestId("nuestros-momentos");
      await moments.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(
          OUTPUT_DIR,
          `football-to-moments-${viewport.name}.png`,
        ),
      });
    }
  });

  test("la galería Nuestros momentos está activa con fotografías reales", async ({
    page,
  }) => {
    await openInvitation(page);
    const gallery = page.getByTestId("nuestros-momentos");
    await gallery.scrollIntoViewIfNeeded();

    await expect(
      gallery.getByRole("heading", { name: "Nuestros momentos" }),
    ).toBeVisible();

    const featured = wedding.gallery.items.filter((i) => i.featured);
    expect(featured.length).toBeGreaterThanOrEqual(10);

    const rail = page.getByTestId("gallery-rail");
    await expect(rail).toBeVisible();
    await expect(rail).toHaveAttribute("tabindex", "0");

    const counter = page.getByTestId("gallery-rail-counter");
    await expect(counter).toBeVisible();
    await expect(counter).toContainText("01");
    await expect(counter).toContainText(
      String(featured.length).padStart(2, "0"),
    );

    const hint = gallery.getByTestId("gallery-rail-hint");
    await expect(hint).toContainText(/Desliza para descubrir/i);

    // Next-photo peek: lead slide narrower than rail viewport
    const peek = await rail.evaluate((el) => {
      const slide = el.querySelector("[data-gallery-slide='0']");
      if (!slide) return null;
      const slideWidth = (slide as HTMLElement).getBoundingClientRect().width;
      return {
        railWidth: el.clientWidth,
        slideWidth,
        canScroll: el.scrollWidth > el.clientWidth + 8,
        peekPx: el.clientWidth - slideWidth,
      };
    });
    expect(peek).not.toBeNull();
    expect(peek!.canScroll).toBe(true);
    expect(peek!.slideWidth).toBeLessThan(peek!.railWidth * 0.92);
    expect(peek!.peekPx).toBeGreaterThan(24);

    for (const item of featured) {
      const photo = page.getByTestId(`gallery-photo-${item.id}`);
      await expect(photo).toHaveAttribute("alt", item.alt);
      await expect(photo).toHaveAttribute("src", new RegExp(item.id));
    }

    const first = page.getByTestId(`gallery-photo-${featured[0].id}`);
    await expect
      .poll(
        async () => first.evaluate((img: HTMLImageElement) => img.naturalWidth),
        { timeout: 30_000 },
      )
      .toBeGreaterThan(0);

    await rail.evaluate((el) => {
      el.dispatchEvent(new Event("pointerdown", { bubbles: true }));
      el.scrollBy({ left: Math.min(280, el.clientWidth * 0.7) });
    });
    await expect
      .poll(async () => (await counter.innerText()).replace(/\s+/g, " "))
      .toMatch(/02\s*\/\s*\d{2}/);
    await expect(hint).not.toContainText(/Desliza para descubrir/i);

    await rail.evaluate((el) => {
      const slides = el.querySelectorAll<HTMLElement>("[data-gallery-slide]");
      const lastSlide = slides[slides.length - 1];
      lastSlide?.scrollIntoView({ inline: "start", block: "nearest" });
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    });
    const last = String(featured.length).padStart(2, "0");
    await expect
      .poll(
        async () => (await counter.innerText()).replace(/\s+/g, " "),
        { timeout: 8_000 },
      )
      .toContain(`${last} / ${last}`);
    await expect(page.getByTestId("gallery-rail-hint")).toHaveAttribute(
      "data-at-end",
      "true",
    );
  });

  test("football gallery: discoverability chrome y lightbox tras swipe", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openInvitation(page);
    const team = page.getByTestId("nuestro-equipo");
    await team.scrollIntoViewIfNeeded();

    const rail = page.getByTestId("football-gallery");
    await expect(page.getByTestId("football-gallery-counter")).toContainText(
      "01",
    );
    await expect(page.getByTestId("football-gallery-hint")).toContainText(
      /Desliza para descubrir/i,
    );

    await rail.evaluate((el) => {
      el.dispatchEvent(new Event("pointerdown", { bubbles: true }));
      el.scrollBy({ left: 240 });
    });
    await expect
      .poll(async () =>
        (await page.getByTestId("football-gallery-counter").innerText()).replace(
          /\s+/g,
          " ",
        ),
      )
      .toMatch(/0[2-9]\s*\/\s*\d{2}/);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await openInvitation(page);
    await page.getByTestId("nuestro-equipo").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("football-gallery-counter")).toBeVisible();
    await expect(page.getByTestId("football-gallery-hint")).toBeVisible();

    await page.getByTestId("football-photo-fb-01").click();
    await expect(page.getByTestId("football-lightbox")).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("capturas de momentos cinematográficos para inspección visual", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
      { name: "390x844", width: 390, height: 844 },
      { name: "430x932", width: 430, height: 932 },
      { name: "1440x900", width: 1440, height: 900 },
    ] as const;

    const moments = ["cine-couple", "cine-family", "cine-closing"] as const;

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await openInvitation(page);

      for (const id of moments) {
        const section = page.getByTestId(`cinematic-${id}`);
        await expect(section).toBeVisible();
        await section.scrollIntoViewIfNeeded();
        const img = section.locator("img").first();
        await expect
          .poll(
            async () =>
              img.evaluate((el: HTMLImageElement) => el.naturalWidth),
            { timeout: 30_000 },
          )
          .toBeGreaterThan(0);
        await section.screenshot({
          path: path.join(OUTPUT_DIR, `cinematic-${id}-${viewport.name}.png`),
        });
      }
    }
  });

  test("el cinematic familiar aparece una sola vez después de Con cariño", async ({
    page,
  }) => {
    await openInvitation(page);

    const family = page.getByTestId("cinematic-cine-family");
    await expect(family).toHaveCount(1);

    const order = await page.evaluate(() => {
      const intro = document.querySelector('[data-testid="intro-section"]');
      const cine = document.querySelector('[data-testid="cinematic-cine-family"]');
      const ceremony = document.querySelector('[data-testid="ceremony"]');
      const team = document.querySelector('[data-testid="nuestro-equipo"]');
      const gallery = document.querySelector('[data-testid="nuestros-momentos"]');
      if (!intro || !cine || !ceremony || !team || !gallery) return null;
      const position = intro.compareDocumentPosition(cine);
      const beforeCeremony = cine.compareDocumentPosition(ceremony);
      const teamBeforeGallery = team.compareDocumentPosition(gallery);
      return {
        familyAfterIntro: (position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        ceremonyAfterFamily:
          (beforeCeremony & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        galleryAfterTeam:
          (teamBeforeGallery & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        walkawayCount: document.querySelectorAll(
          'img[src*="feature-family-walkaway"]',
        ).length,
      };
    });

    expect(order).not.toBeNull();
    expect(order?.familyAfterIntro).toBe(true);
    expect(order?.ceremonyAfterFamily).toBe(true);
    expect(order?.galleryAfterTeam).toBe(true);
    expect(order?.walkawayCount).toBe(1);
  });

  test("capturas del cinematic familiar en la apertura narrativa", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
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

      const intro = page.getByTestId("intro-section");
      await intro.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(
          OUTPUT_DIR,
          `family-move-intro-${viewport.name}.png`,
        ),
      });

      const family = page.getByTestId("cinematic-cine-family");
      await family.scrollIntoViewIfNeeded();
      await expect
        .poll(
          async () =>
            family.locator("img").first().evaluate(
              (el: HTMLImageElement) => el.naturalWidth,
            ),
          { timeout: 30_000 },
        )
        .toBeGreaterThan(0);
      await page.screenshot({
        path: path.join(
          OUTPUT_DIR,
          `family-move-photo-${viewport.name}.png`,
        ),
      });

      const team = page.getByTestId("nuestro-equipo");
      await team.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(
          OUTPUT_DIR,
          `family-move-team-to-gallery-${viewport.name}.png`,
        ),
      });
    }
  });

  test("capturas del riel de galería para inspección visual", async ({ page }) => {
    test.setTimeout(120_000);
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
      await openInvitation(page);

      const gallery = page.getByTestId("nuestros-momentos");
      await gallery.scrollIntoViewIfNeeded();
      const rail = page.getByTestId("gallery-rail");
      await expect(rail).toBeVisible();

      await gallery.screenshot({
        path: path.join(OUTPUT_DIR, `gallery-start-${viewport.name}.png`),
      });

      await rail.evaluate((el) => {
        el.scrollLeft = el.scrollWidth * 0.45;
      });
      await page.waitForTimeout(200);
      await gallery.screenshot({
        path: path.join(OUTPUT_DIR, `gallery-mid-${viewport.name}.png`),
      });

      await rail.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
      });
      await page.waitForTimeout(200);
      await gallery.screenshot({
        path: path.join(OUTPUT_DIR, `gallery-end-${viewport.name}.png`),
      });
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

      const photo = team.getByTestId("football-photo-fb-01").locator("img");
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
    await expect(page.getByTestId("countdown-section")).toBeVisible();
    await expect(page.getByTestId("intro-section")).toBeVisible();
    await expect(page.getByTestId("ceremony")).toBeVisible();
    await expect(page.getByTestId("celebration-transition")).toBeVisible();
    await expect(page.getByTestId("reception")).toBeVisible();
    await expect(page.getByTestId("day-schedule")).toBeVisible();
    await expect(page.getByTestId("faith-section")).toBeVisible();
    await expect(page.getByTestId("nuestro-equipo")).toBeVisible();
    await expect(page.getByTestId("nuestros-momentos")).toBeVisible();
    await expect(page.getByTestId("dress-section")).toBeVisible();
    await expect(page.getByTestId("presence-gift-section")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Su presencia es nuestro regalo/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/No es necesario traer ningún regalo/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Tenerlos con nosotros en este día/i),
    ).toBeVisible();
  });

  test("la cuenta regresiva muestra días, horas y minutos sin segundos", async ({
    page,
  }) => {
    await openInvitation(page);
    const countdown = page.getByTestId("countdown-section");
    await countdown.scrollIntoViewIfNeeded();

    await expect(countdown).toHaveAttribute("data-target-date", "2026-10-16");
    await expect(countdown).toHaveAttribute("data-target-time", "17:00");
    await expect(countdown).toHaveAttribute(
      "data-timezone",
      "America/Mexico_City",
    );

    await expect(page.getByTestId("countdown-active")).toBeVisible();
    await expect(countdown.getByText("Días", { exact: true })).toBeVisible();
    await expect(countdown.getByText("Horas", { exact: true })).toBeVisible();
    await expect(countdown.getByText("Minutos", { exact: true })).toBeVisible();
    await expect(countdown.getByText(/segundos/i)).toHaveCount(0);

    const daysText = await page.getByTestId("countdown-days").innerText();
    const hoursText = await page.getByTestId("countdown-hours").innerText();
    const minutesText = await page.getByTestId("countdown-minutes").innerText();

    const days = Number(daysText);
    const hours = Number(hoursText);
    const minutes = Number(minutesText);

    expect(Number.isFinite(days)).toBe(true);
    expect(days).toBeGreaterThanOrEqual(0);
    expect(hours).toBeGreaterThanOrEqual(0);
    expect(hours).toBeLessThan(24);
    expect(minutes).toBeGreaterThanOrEqual(0);
    expect(minutes).toBeLessThan(60);
  });

  test("la sección de fe es visible y respetuosa", async ({ page }) => {
    await openInvitation(page);
    const faith = page.getByTestId("faith-section");
    await faith.scrollIntoViewIfNeeded();

    await expect(
      faith.getByRole("heading", { name: "Con la bendición de Dios" }),
    ).toBeVisible();
    await expect(faith.getByText(/Todo lo disculpa/i)).toBeVisible();
    await expect(faith.getByText("1 Corintios 13, 7–8")).toBeVisible();
    await expect(faith.getByText("Nuestra Señora de Guadalupe")).toBeVisible();
    await expect(faith.getByText("San Judas Tadeo")).toBeVisible();
    await expect(
      faith.getByText(/intercesión acompañe nuestro matrimonio/i),
    ).toBeVisible();
  });

  test("capturas de fe, ceremonia y cierre editorial", async ({ page }) => {
    test.setTimeout(120_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
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

      await page.getByTestId("countdown-section").scrollIntoViewIfNeeded();
      await page.getByTestId("save-the-date").screenshot({
        path: path.join(OUTPUT_DIR, `polish-save-date-${viewport.name}.png`),
      });

      const ceremony = page.getByTestId("ceremony");
      await ceremony.scrollIntoViewIfNeeded();
      await ceremony.screenshot({
        path: path.join(OUTPUT_DIR, `catholic-ceremony-${viewport.name}.png`),
      });

      const schedule = page.getByTestId("day-schedule");
      await schedule.scrollIntoViewIfNeeded();
      await schedule.screenshot({
        path: path.join(OUTPUT_DIR, `polish-schedule-${viewport.name}.png`),
      });

      const faith = page.getByTestId("faith-section");
      await faith.scrollIntoViewIfNeeded();
      await faith.screenshot({
        path: path.join(OUTPUT_DIR, `catholic-faith-${viewport.name}.png`),
      });

      const cine = page.getByTestId("cinematic-cine-couple");
      await cine.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(
          OUTPUT_DIR,
          `catholic-faith-to-cine-${viewport.name}.png`,
        ),
      });

      const closing = page.getByTestId("editorial-closing");
      await closing.scrollIntoViewIfNeeded();
      await closing.screenshot({
        path: path.join(OUTPUT_DIR, `catholic-closing-${viewport.name}.png`),
      });
    }
  });

  test("la sugerencia de vestimenta es editorial y sin dress code rígido", async ({
    page,
  }) => {
    await openInvitation(page);
    const dress = page.getByTestId("dress-section");
    await dress.scrollIntoViewIfNeeded();

    await expect(
      dress.getByRole("heading", { name: "Un toque especial" }),
    ).toBeVisible();
    await expect(dress.getByText("Elegante y cómodo", { exact: true })).toBeVisible();
    await expect(page.getByText(/Formal casual/i)).toHaveCount(0);
    await expect(page.getByText(/Dress code/i)).toHaveCount(0);
  });

  test("RSVP en home general no muestra formulario", async ({ page }) => {
    expect(wedding.rsvp.enabled).toBe(true);
    expect(wedding.rsvp.deadlineIso).toBe("2026-10-10");
    expect(wedding.rsvp.timezone).toBe("America/Mexico_City");

    await openInvitation(page);
    await expect(page.getByTestId("rsvp-section")).toHaveCount(0);
    await expect(page.getByTestId("rsvp-submit")).toHaveCount(0);
  });

  test("no hay overflow horizontal a 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openInvitation(page);
    await page.getByTestId("nuestro-equipo").scrollIntoViewIfNeeded();
    await page.getByTestId("nuestros-momentos").scrollIntoViewIfNeeded();
    await page.getByTestId("dress-section").scrollIntoViewIfNeeded();
    await page.getByTestId("presence-gift-section").scrollIntoViewIfNeeded();
    await page.getByTestId("countdown-section").scrollIntoViewIfNeeded();


    const rail = page.getByTestId("gallery-rail");
    const footballRail = page.getByTestId("football-gallery");
    await expect(rail).toBeVisible();
    await expect(footballRail).toBeVisible();

    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      const railEl = document.querySelector("[data-testid='gallery-rail']");
      const footballEl = document.querySelector(
        "[data-testid='football-gallery']",
      );
      const before = window.scrollX;
      window.scrollBy(240, 0);
      const afterWindow = window.scrollX;
      window.scrollTo(0, window.scrollY);

      return {
        docOk: doc.scrollWidth <= doc.clientWidth + 1,
        windowScrollDelta: afterWindow - before,
        railCanScroll: railEl
          ? railEl.scrollWidth > railEl.clientWidth + 8
          : false,
        footballCanScroll: footballEl
          ? footballEl.scrollWidth > footballEl.clientWidth + 8
          : false,
      };
    });

    expect(result.docOk).toBe(true);
    expect(result.windowScrollDelta).toBe(0);
    expect(result.railCanScroll).toBe(true);
    expect(result.footballCanScroll).toBe(true);
  });

  test("capturas del polish editorial para inspección visual", async ({ page }) => {
    test.setTimeout(120_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const viewports = [
      { name: "360x800", width: 360, height: 800 },
      { name: "390x844", width: 390, height: 844 },
      { name: "430x932", width: 430, height: 932 },
      { name: "768x1024", width: 768, height: 1024 },
      { name: "1440x900", width: 1440, height: 900 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await openInvitation(page);

      await page.getByTestId("countdown-section").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `polish-countdown-${viewport.name}.png`),
        fullPage: false,
      });

      await page.getByTestId("ceremony").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `polish-ceremony-${viewport.name}.png`),
        fullPage: false,
      });

      await page.getByTestId("nuestro-equipo").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `polish-equipo-${viewport.name}.png`),
        fullPage: false,
      });

      await page.getByTestId("nuestros-momentos").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `polish-gallery-${viewport.name}.png`),
        fullPage: false,
      });
    }
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
