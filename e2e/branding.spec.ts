import { expect, test } from "@playwright/test";
import { site } from "../src/content/site";
import { wedding } from "../src/content/wedding";

test.describe("Branding de producción — Chromium", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Cobertura prioritaria en Chromium",
  );

  test("title, canonical, Open Graph y favicon están configurados", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(wedding.meta.title);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", site.url);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", wedding.meta.title);

    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute("content", site.url);

    const ogImage = page.locator('meta[property="og:image"]').first();
    const ogImageContent = await ogImage.getAttribute("content");
    expect(ogImageContent).toBeTruthy();
    expect(ogImageContent!).toMatch(/^https?:\/\//);
    expect(ogImageContent!).toContain("opengraph-image");
    expect(ogImageContent!).not.toContain("vercel.app");

    const icon = page.locator('link[rel="icon"]').first();
    await expect(icon).toHaveAttribute("href", /icon/);
  });
});
