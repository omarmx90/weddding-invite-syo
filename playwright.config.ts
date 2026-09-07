import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Un solo worker: el store memory RSVP es proceso compartido del webServer.
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  outputDir: "test-results",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3000",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      ...process.env,
      RSVP_STORE: "memory",
      ADMIN_AUTH_MODE: "test",
      ADMIN_E2E_SECRET: "e2e-admin-secret-not-for-production",
      ADMIN_EMAILS: "admin@syo.test,pair@syo.test",
      INVITE_SITE_URL: baseURL,
      // 32 bytes hex — solo e2e local
      INVITE_TOKEN_ENCRYPTION_KEY:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Preparado para validación futura en iOS Safari — no requerido en scripts por defecto.
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
