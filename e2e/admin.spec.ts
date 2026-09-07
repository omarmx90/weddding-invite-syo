import { expect, test, type Page } from "@playwright/test";
import { setPartyCounts } from "./rsvp-helpers";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { slugifyFamilyName } from "../src/lib/admin/slug";
import { buildWhatsAppMessage } from "../src/lib/admin/messages";
import {
  encryptInviteToken,
  decryptInviteToken,
} from "../src/lib/admin/encryption";
import {
  assertProductionAdminRedirectSafe,
  resolveAdminAuthEmailRedirectTo,
} from "../src/lib/admin/auth-redirect";
import { isAdminE2EAuthEnabled } from "../src/lib/admin/e2e-auth-shared";
import { generateInviteToken, hashInviteToken } from "../src/lib/rsvp/token";

async function resetStores(page: Page) {
  const response = await page.request.post("/api/test/rsvp-reset", {
    data: {},
  });
  expect(response.ok()).toBeTruthy();
  await page.request.delete("/api/test/admin-login");
}

async function adminLogin(
  page: Page,
  email = "admin@syo.test",
): Promise<void> {
  const response = await page.request.post("/api/test/admin-login", {
    data: {
      email,
      secret: "e2e-admin-secret-not-for-production",
    },
  });
  expect(response.ok()).toBeTruthy();
}

test.describe("Admin guest manager — Chromium", () => {
  test.describe.configure({ mode: "serial" });

  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Cobertura prioritaria en Chromium",
  );

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await resetStores(page);
  });

  test("admin no autenticado es bloqueado", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByTestId("admin-login")).toBeVisible();
  });

  test("usuario no allowlisted es rechazado en login e2e", async ({ page }) => {
    const response = await page.request.post("/api/test/admin-login", {
      data: {
        email: "intruso@example.com",
        secret: "e2e-admin-secret-not-for-production",
      },
    });
    expect(response.status()).toBe(403);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("admin autorizado entra al resumen", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin");
    await expect(page.getByTestId("admin-dashboard")).toBeVisible();
    await expect(page.getByTestId("stat-families")).toContainText("3");
    await expect(page.getByTestId("stat-pending-families")).toContainText("3");
  });

  test("login e2e expone redirect de callback local, no dominio ajeno", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    const redirectTo = await page
      .getByTestId("admin-email-redirect-to")
      .innerText();
    expect(redirectTo).toContain("/admin/auth/callback");
    expect(redirectTo).toMatch(/127\.0\.0\.1:3000|localhost:3000/);
  });

  test("crear invitación genera slug único y URL privada una vez", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto("/admin/guests/new");
    await page.getByTestId("admin-create-name").fill("Familia Pérez López");
    await page.getByTestId("admin-create-seats").fill("4");
    await page.getByTestId("admin-create-submit").click();
    await expect(page.getByTestId("admin-invite-created")).toBeVisible();
    const url = await page.getByTestId("admin-created-invite-url").inputValue();
    expect(url).toContain("/i/perez-lopez?t=");
    expect(url).not.toContain("undefined");

    await page.goto("/admin/guests");
    await expect(page.getByTestId("admin-guest-perez-lopez")).toBeVisible();
    await page.goto("/admin");
    await expect(page.getByTestId("stat-families")).toContainText("4");
  });

  test("dashboard counts y filtros", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin");
    await expect(page.getByTestId("stat-reserved")).toContainText("8");

    // Confirma una familia vía flujo invitado
    const tokenRes = await page.request.get(
      "/api/test/rsvp-reset?slug=granados-montero",
    );
    const tokenBody = (await tokenRes.json()) as { token: string };
    await page.goto(
      `/i/granados-montero?t=${encodeURIComponent(tokenBody.token)}`,
    );
    await page.getByTestId("hero-cta").click();
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 2, 0);
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();

    await page.goto("/admin");
    await expect(page.getByTestId("stat-confirmed-families")).toContainText(
      "1",
    );
    await expect(page.getByTestId("stat-confirmed-seats")).toContainText("2");
    await expect(page.getByTestId("stat-confirmed-adults")).toContainText("2");
    await expect(page.getByTestId("stat-confirmed-children")).toContainText(
      "0",
    );
    await expect(page.getByTestId("stat-pending-families")).toContainText("2");

    await page.goto("/admin/guests?status=confirmed");
    await expect(page.getByTestId("admin-guest-granados-montero")).toBeVisible();
    await expect(page.getByTestId("admin-guest-montero-aguilar")).toHaveCount(0);

    await page.getByTestId("admin-guest-search").fill("Granados");
    await page.getByTestId("admin-guest-search").press("Enter");
    await expect(page.getByTestId("admin-guest-granados-montero")).toBeVisible();

    await page.goto("/admin/guests?q=nava-munoz");
    await expect(page.getByTestId("admin-guest-nava-munoz")).toBeVisible();
    await expect(page.getByTestId("admin-guest-granados-montero")).toHaveCount(0);
  });

  test("editar, no reducir seats bajo confirmados, desactivar", async ({
    page,
  }) => {
    await adminLogin(page);
    const tokenRes = await page.request.get(
      "/api/test/rsvp-reset?slug=montero-aguilar",
    );
    const tokenBody = (await tokenRes.json()) as { token: string };
    await page.goto(
      `/i/montero-aguilar?t=${encodeURIComponent(tokenBody.token)}`,
    );
    await page.getByTestId("hero-cta").click();
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 3, 0);
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();

    await page.goto("/admin/guests");
    await page.getByTestId("admin-guest-montero-aguilar").click();
    await page.getByTestId("admin-edit-toggle").click();
    await page.getByTestId("admin-edit-seats").fill("1");
    await page.getByTestId("admin-edit-save").click();
    await expect(page.getByText(/por debajo de los confirmados/i)).toBeVisible();

    await page.getByTestId("admin-edit-seats").fill("3");
    await page.getByTestId("admin-edit-name").fill("Familia Montero Aguilar");
    await page.getByTestId("admin-edit-save").click();
    await expect(page.getByTestId("admin-edit-form")).toHaveCount(0);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId("admin-disable").click();
    await expect(page.getByTestId("admin-detail-enabled")).toHaveText("No");

    await page.goto("/admin/guests?status=inactive");
    await expect(page.getByTestId("admin-guest-montero-aguilar")).toBeVisible();
  });

  test("rotación invalida enlace anterior y conserva RSVP", async ({
    page,
  }) => {
    await adminLogin(page);
    const tokenRes = await page.request.get(
      "/api/test/rsvp-reset?slug=nava-munoz",
    );
    const oldToken = ((await tokenRes.json()) as { token: string }).token;

    await page.goto(`/i/nava-munoz?t=${encodeURIComponent(oldToken)}`);
    await page.getByTestId("hero-cta").click();
    await page.getByTestId("rsvp-attend-yes").click();
    await setPartyCounts(page, 1, 1);
    await page.getByTestId("rsvp-submit").click();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "2 de 3 lugares",
    );
    await expect(page.getByTestId("rsvp-party-breakdown")).toHaveText(
      "1 adulto · 1 niño",
    );

    await page.goto("/admin/guests");
    await page.getByTestId("admin-guest-nava-munoz").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId("admin-rotate-link").click();
    await expect(page.getByTestId("admin-revealed-url")).toBeVisible();
    const newUrl = await page
      .getByTestId("admin-revealed-url")
      .locator("textarea")
      .inputValue();
    expect(newUrl).toContain("/i/nava-munoz?t=");
    expect(newUrl).not.toContain(oldToken);

    await page.goto(`/i/nava-munoz?t=${encodeURIComponent(oldToken)}`);
    await expect(page.getByTestId("invitation-access-denied")).toBeVisible();

    await page.goto(newUrl);
    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("rsvp-confirmed")).toBeVisible();
    await expect(page.getByTestId("rsvp-seats-summary")).toHaveText(
      "2 de 3 lugares",
    );
    await expect(page.getByTestId("rsvp-party-breakdown")).toHaveText(
      "1 adulto · 1 niño",
    );
  });

  test("WhatsApp y QR solo tras acción explícita", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/guests");
    await page.getByTestId("admin-guest-granados-montero").click();
    await expect(page.getByTestId("admin-whatsapp")).toHaveCount(0);
    await expect(page.getByTestId("admin-qr")).toHaveCount(0);

    await page.getByTestId("admin-prepare-whatsapp").click();
    await expect(page.getByTestId("admin-whatsapp-message")).toBeVisible();
    const message = await page
      .getByTestId("admin-whatsapp-message")
      .inputValue();
    expect(message).toContain("Familia Granados Montero");
    expect(message).toContain("/i/granados-montero?t=");

    await page.getByTestId("admin-show-qr").click();
    await expect(page.getByTestId("admin-qr")).toBeVisible();
    await expect(page.getByTestId("admin-qr-download")).toBeVisible();
  });

  test("admin noindex y sin service role en HTML", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin");
    const html = await page.content();
    expect(html).not.toMatch(/SUPABASE_SERVICE_ROLE/i);
    expect(html).not.toMatch(/service_role/i);
    const robots = await page
      .locator('meta[name="robots"]')
      .first()
      .getAttribute("content");
    expect(robots ?? "").toMatch(/noindex/i);
  });

  test("mobile 390 admin lista usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await adminLogin(page);
    await page.goto("/admin/guests");
    await expect(page.getByTestId("admin-guest-list")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Admin unit helpers — Chromium", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Helpers en proceso Chromium",
  );

  test("Production auth redirect usa dominio canónico y nunca localhost", () => {
    const previousEnv = process.env.VERCEL_ENV;
    const previousInvite = process.env.INVITE_SITE_URL;
    try {
      process.env.VERCEL_ENV = "production";
      process.env.INVITE_SITE_URL = "https://silvia-y-omar.com";
      const redirectTo = resolveAdminAuthEmailRedirectTo({
        requestOrigin: "http://localhost:3000",
      });
      expect(redirectTo).toBe(
        "https://silvia-y-omar.com/admin/auth/callback",
      );
      expect(redirectTo).not.toMatch(/localhost|127\.0\.0\.1/i);
      expect(() => assertProductionAdminRedirectSafe(redirectTo)).not.toThrow();

      process.env.INVITE_SITE_URL = "https://evil.example.com";
      expect(() =>
        resolveAdminAuthEmailRedirectTo({
          requestOrigin: "http://localhost:3000",
        }),
      ).toThrow(/canónico/i);
    } finally {
      if (previousEnv === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = previousEnv;
      if (previousInvite === undefined) delete process.env.INVITE_SITE_URL;
      else process.env.INVITE_SITE_URL = previousInvite;
    }
  });

  test("test mode imposible en Production", () => {
    const previousEnv = process.env.VERCEL_ENV;
    const previousMode = process.env.ADMIN_AUTH_MODE;
    const previousSecret = process.env.ADMIN_E2E_SECRET;
    const previousStore = process.env.RSVP_STORE;
    try {
      process.env.VERCEL_ENV = "production";
      process.env.ADMIN_AUTH_MODE = "test";
      process.env.ADMIN_E2E_SECRET = "should-not-enable";
      process.env.RSVP_STORE = "memory";
      expect(isAdminE2EAuthEnabled()).toBe(false);
    } finally {
      if (previousEnv === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = previousEnv;
      if (previousMode === undefined) delete process.env.ADMIN_AUTH_MODE;
      else process.env.ADMIN_AUTH_MODE = previousMode;
      if (previousSecret === undefined) delete process.env.ADMIN_E2E_SECRET;
      else process.env.ADMIN_E2E_SECRET = previousSecret;
      if (previousStore === undefined) delete process.env.RSVP_STORE;
      else process.env.RSVP_STORE = previousStore;
    }
  });

  test("slugify y cifrado roundtrip", () => {
    expect(slugifyFamilyName("Familia Pérez López")).toBe("perez-lopez");
    process.env.INVITE_TOKEN_ENCRYPTION_KEY =
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const token = generateInviteToken();
    const cipher = encryptInviteToken(token);
    expect(decryptInviteToken(cipher)).toBe(token);
    expect(hashInviteToken(token)).toHaveLength(64);
    expect(createHash("sha256").update(token).digest("hex")).toBe(
      hashInviteToken(token),
    );
  });

  test("whatsapp copy incluye nombre y URL solo al construir mensaje", () => {
    const message = buildWhatsAppMessage(
      "Familia Demo",
      "https://silvia-y-omar.com/i/demo?t=secreto",
    );
    expect(message).toContain("Familia Demo");
    expect(message).toContain("?t=secreto");
  });

  test("no hay NEXT_PUBLIC service role", () => {
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
