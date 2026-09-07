import { expect, test, type Page } from "@playwright/test";
import { setPartyCounts } from "./rsvp-helpers";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { guestInvitations } from "../src/content/guests";
import { resolveRsvpStoreMode } from "../src/lib/rsvp/repository";

async function resetRsvpStore(
  page: Page,
  options?: { deadlinePassed?: boolean; failNextWrite?: boolean },
) {
  const response = await page.request.post("/api/test/rsvp-reset", {
    data: options ?? {},
  });
  expect(response.ok()).toBeTruthy();
}

async function fetchMemoryToken(page: Page, slug: string) {
  const response = await page.request.get(
    `/api/test/rsvp-reset?slug=${encodeURIComponent(slug)}`,
  );
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { ok: boolean; token?: string };
  expect(body.ok).toBe(true);
  expect(body.token).toBeTruthy();
  return body.token as string;
}

async function openPersonalizedWithToken(page: Page, slug: string, token: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/i/${slug}?t=${encodeURIComponent(token)}`);
  await expect(page.getByTestId("hero-opening")).toBeVisible();
  await page.getByTestId("hero-cta").click();
  await expect(page.getByTestId("invitation-content")).toBeVisible();
  await expect(page.getByTestId("rsvp-section")).toBeVisible();
}

test.describe("RSVP piloto — Chromium", () => {
  test.describe.configure({ mode: "serial" });

  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Cobertura prioritaria en Chromium",
  );

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await resetRsvpStore(page);
  });

  test("lee cada invitación piloto con max seats correcto", async ({
    page,
  }) => {
    const cases = [
      { slug: "granados-montero", seats: 2, name: "Familia Granados Montero" },
      { slug: "montero-aguilar", seats: 3, name: "Familia Montero Aguilar" },
      { slug: "nava-munoz", seats: 3, name: "Familia Nava Muñoz" },
    ] as const;

    for (const item of cases) {
      const token = await fetchMemoryToken(page, item.slug);
      await openPersonalizedWithToken(page, item.slug, token);
      await expect(page.getByTestId("personalized-guest-name")).toHaveText(
        item.name,
      );
      await expect(page.getByTestId("personalized-seats")).toHaveText(
        `${item.seats} lugares`,
      );
      await expect(page.getByTestId("rsvp-form")).toBeVisible();
      await page.getByTestId("rsvp-attend-yes").click();
      await expect(page.getByTestId("rsvp-seats")).toBeVisible();
      await expect(page.getByTestId("rsvp-adults")).toBeVisible();
      await expect(page.getByTestId("rsvp-children")).toBeVisible();
      await setPartyCounts(page, item.seats, 0);
      await expect(page.getByTestId("rsvp-adults-inc")).toBeDisabled();
      await expect(page.getByTestId("rsvp-children-inc")).toBeDisabled();
      await expect(page.getByTestId("rsvp-capacity-summary")).toHaveText(
        `${item.seats} de ${item.seats} lugares confirmados`,
      );
    }
  });

  test("confirma asistencia sin exceder lugares", async ({ page }) => {
    const token = await fetchMemoryToken(page, "montero-aguilar");
    await openPersonalizedWithToken(page, "montero-aguilar", token);
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 2, 0);
    await page.getByTestId("rsvp-submit").click();

    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "2 de 3 lugares",
    );
    await expect(page.getByTestId("rsvp-party-breakdown")).toHaveText(
      "2 adultos",
    );
    await expect(page.getByTestId("rsvp-success-message")).toContainText(
      "Gracias por confirmar",
    );
  });

  test("adultos y niños respetan el cupo y el desglose", async ({ page }) => {
    const token = await fetchMemoryToken(page, "montero-aguilar");
    await openPersonalizedWithToken(page, "montero-aguilar", token);
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 2, 1);
    await expect(page.getByTestId("rsvp-capacity-summary")).toHaveText(
      "3 de 3 lugares confirmados",
    );
    await expect(page.getByTestId("rsvp-adults-inc")).toBeDisabled();
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "3 de 3 lugares",
    );
    await expect(page.getByTestId("rsvp-party-breakdown")).toHaveText(
      "2 adultos · 1 niño",
    );
  });

  test("decline registra confirmed_seats = 0", async ({ page }) => {
    const token = await fetchMemoryToken(page, "granados-montero");
    await openPersonalizedWithToken(page, "granados-montero", token);
    await page.getByTestId("rsvp-attend-no").click();
    await expect(page.getByTestId("rsvp-seats")).toHaveCount(0);
    await page.getByTestId("rsvp-submit").click();

    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-success-message")).toContainText(
      "Gracias por avisarnos",
    );
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveCount(0);
  });

  test("editar RSVP actualiza el existente sin duplicar", async ({ page }) => {
    const token = await fetchMemoryToken(page, "nava-munoz");
    await openPersonalizedWithToken(page, "nava-munoz", token);
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 1, 0);
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "1 de 3 lugares",
    );

    await page.getByTestId("rsvp-edit").click();
    await expect(page.getByTestId("rsvp-form")).toBeVisible();
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 2, 1);
    await page.getByTestId("rsvp-submit").click();

    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "3 de 3 lugares",
    );
    await expect(page.getByTestId("rsvp-party-breakdown")).toHaveText(
      "2 adultos · 1 niño",
    );

    await page.reload();
    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "3 de 3 lugares",
    );
    await expect(page.getByTestId("rsvp-party-breakdown")).toHaveText(
      "2 adultos · 1 niño",
    );
  });

  test("sin token no revela familia ni formulario", async ({ page }) => {
    await page.goto("/i/granados-montero");
    await expect(page.getByTestId("invitation-access-denied")).toBeVisible();
    await expect(page.getByText("Familia Granados Montero")).toHaveCount(0);
    await expect(page.getByText(/2 lugares/i)).toHaveCount(0);
    await expect(page.getByTestId("rsvp-form")).toHaveCount(0);
    await expect(page.getByTestId("personalized-welcome")).toHaveCount(0);
  });

  test("token incorrecto no revela familia", async ({ page }) => {
    await page.goto("/i/granados-montero?t=token-incorrecto-sin-entropia");
    await expect(page.getByTestId("invitation-access-denied")).toBeVisible();
    await expect(page.getByText("Familia Granados Montero")).toHaveCount(0);
    await expect(page.getByTestId("rsvp-form")).toHaveCount(0);
  });

  test("token de familia A no abre familia B", async ({ page }) => {
    const tokenA = await fetchMemoryToken(page, "granados-montero");
    await page.goto(`/i/montero-aguilar?t=${encodeURIComponent(tokenA)}`);
    await expect(page.getByTestId("invitation-access-denied")).toBeVisible();
    await expect(page.getByText("Familia Montero Aguilar")).toHaveCount(0);
  });

  test("slug inválido sigue en 404", async ({ page }) => {
    const token = await fetchMemoryToken(page, "granados-montero");
    const response = await page.goto(
      `/i/familia-inexistente?t=${encodeURIComponent(token)}`,
    );
    expect(response?.status()).toBe(404);
  });

  test("deadline bloquea nuevas modificaciones", async ({ page }) => {
    await resetRsvpStore(page, { deadlinePassed: true });
    const token = await fetchMemoryToken(page, "granados-montero");
    await openPersonalizedWithToken(page, "granados-montero", token);
    await expect(page.getByTestId("rsvp-deadline-passed")).toBeVisible();
    await expect(page.getByTestId("rsvp-form")).toHaveCount(0);
  });

  test("error de persistencia no afirma éxito", async ({ page }) => {
    await resetRsvpStore(page, { failNextWrite: true });
    const token = await fetchMemoryToken(page, "granados-montero");
    await openPersonalizedWithToken(page, "granados-montero", token);
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 1, 0);
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-error")).toContainText(
      "No pudimos guardar tu confirmación",
    );
    await expect(page.getByTestId("rsvp-confirmed")).toHaveCount(0);
  });

  test("HTML no incluye service role ni placeholders unset", async ({ page }) => {
    const token = await fetchMemoryToken(page, "granados-montero");
    await openPersonalizedWithToken(page, "granados-montero", token);
    const html = await page.content();
    expect(html).not.toMatch(/SUPABASE_SERVICE_ROLE/i);
    expect(html).not.toMatch(/service_role/i);
    expect(html).not.toContain("unset:granados-montero");
  });

  test("targets táctiles >= 44px en el formulario", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const token = await fetchMemoryToken(page, "montero-aguilar");
    await openPersonalizedWithToken(page, "montero-aguilar", token);
    await page.getByTestId("rsvp-attend-yes").click();

    for (const testId of [
      "rsvp-attend-yes",
      "rsvp-adults-inc",
      "rsvp-adults-dec",
      "rsvp-children-inc",
      "rsvp-submit",
    ]) {
      const box = await page.getByTestId(testId).boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    await expect(page.getByTestId("rsvp-adults-inc")).toHaveAttribute(
      "aria-label",
      "Agregar adulto",
    );
    await expect(page.getByTestId("rsvp-children-inc")).toHaveAttribute(
      "aria-label",
      "Agregar niño",
    );
  });

  test("mensaje opcional no es requerido para confirmar", async ({ page }) => {
    const token = await fetchMemoryToken(page, "granados-montero");
    await openPersonalizedWithToken(page, "granados-montero", token);
    await expect(page.getByTestId("rsvp-message")).toBeVisible();
    await expect(page.getByTestId("rsvp-message")).toHaveAttribute(
      "placeholder",
      /nota breve/i,
    );
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 2, 0);
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "2 de 2 lugares",
    );
  });

  test("submit deshabilitado durante pending evita double submit", async ({
    page,
  }) => {
    const token = await fetchMemoryToken(page, "montero-aguilar");
    await openPersonalizedWithToken(page, "montero-aguilar", token);
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 1, 0);

    const submit = page.getByTestId("rsvp-submit");
    await submit.dblclick();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-submit")).toHaveCount(0);
    await expect(page.getByTestId("rsvp-success-mark")).toBeVisible();
    await expect(page.getByTestId("rsvp-success-message")).toContainText(
      "Gracias por confirmar",
    );
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "1 de 3 lugares",
    );
    await expect(page.getByTestId("rsvp-party-breakdown")).toHaveText(
      "1 adulto",
    );
    await expect(page.getByTestId("rsvp-see-you")).toHaveText(
      "Nos vemos el 16 de octubre",
    );
    await expect(page.getByTestId("rsvp-ceremony-maps")).toBeVisible();
    await expect(page.getByTestId("rsvp-celebration-maps")).toHaveCount(0);
  });

  test("actualizar confirmación permanece accesible y secundario", async ({
    page,
  }) => {
    const token = await fetchMemoryToken(page, "nava-munoz");
    await openPersonalizedWithToken(page, "nava-munoz", token);
    await page.getByTestId("rsvp-attend-no").click();
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-edit")).toBeVisible();
    await page.getByTestId("rsvp-edit").click();
    await expect(page.getByTestId("rsvp-form")).toBeVisible();
    await expect(page.getByTestId("rsvp-attend-no")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("mobile 390 no genera overflow horizontal en RSVP", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const token = await fetchMemoryToken(page, "granados-montero");
    await openPersonalizedWithToken(page, "granados-montero", token);
    await page.getByTestId("rsvp-attend-yes").click();
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
      };
    });
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});

test.describe("RSVP seguridad estática — Chromium", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Cobertura prioritaria en Chromium",
  );

  test("tokens retirados no existen en archivos trackeados", () => {
    // Ensamblados en runtime para que el literal completo no viva en el repo.
    const retired = [
      ["syogm26", "k7w9xq2m4n8p3r"],
      ["syoma26", "r3t5y8u1i0o6p"],
      ["syonm26", "a4s6d8f0g2h7j"],
    ].map(([prefix, suffix]) => `${prefix}-${suffix}`);

    for (const secret of retired) {
      let output = "";
      try {
        output = execSync(`git grep -F "${secret}" -- .`, {
          cwd: process.cwd(),
          encoding: "utf8",
        });
      } catch {
        output = "";
      }
      expect(output.trim(), `secret leaked: ${secret}`).toBe("");
    }
  });

  test("seed.sql no contiene tokens reales ni hashes hex de 64", () => {
    const seed = fs.readFileSync(
      path.join(process.cwd(), "supabase", "seed.sql"),
      "utf8",
    );
    expect(seed).not.toMatch(/access_token[^_]/);
    expect(seed).toMatch(/unset:granados-montero/);
    expect(seed).not.toMatch(/[a-f0-9]{64}/i);
  });

  test("catálogo piloto no expone accessToken", () => {
    for (const guest of guestInvitations) {
      expect(guest).not.toHaveProperty("accessToken");
      expect(guest).not.toHaveProperty("inviteCode");
    }
  });

  test("fail-closed: supabase forzado sin credenciales no cae a memory", () => {
    const previousStore = process.env.RSVP_STORE;
    const previousUrl = process.env.SUPABASE_URL;
    const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    try {
      process.env.RSVP_STORE = "supabase";
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      expect(resolveRsvpStoreMode()).toBe("unavailable");
    } finally {
      if (previousStore === undefined) delete process.env.RSVP_STORE;
      else process.env.RSVP_STORE = previousStore;
      if (previousUrl === undefined) delete process.env.SUPABASE_URL;
      else process.env.SUPABASE_URL = previousUrl;
      if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    }
  });

  test("no hay NEXT_PUBLIC service role en el repo", () => {
    const needle = ["NEXT_PUBLIC", "SUPABASE", "SERVICE"].join("_");
    let output = "";
    try {
      output = execSync(`git grep -F "${needle}" -- .`, {
        cwd: process.cwd(),
        encoding: "utf8",
      });
    } catch {
      output = "";
    }
    expect(output.trim()).toBe("");
  });
});
