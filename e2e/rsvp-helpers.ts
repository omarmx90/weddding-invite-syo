import { expect, type Page } from "@playwright/test";

/**
 * Ajusta adultos/niños respetando el cupo: primero libera lugares,
 * luego sube a los valores objetivo.
 */
export async function setPartyCounts(
  page: Page,
  adults: number,
  children: number,
) {
  await expect(page.getByTestId("rsvp-seats")).toBeVisible();

  async function readValue(testId: string) {
    const text = await page.getByTestId(testId).textContent();
    return Number((text ?? "0").trim());
  }

  // Liberar cupo por completo (niños primero) para evitar botones disabled.
  while ((await readValue("rsvp-children-value")) > 0) {
    await page.getByTestId("rsvp-children-dec").click();
  }
  while ((await readValue("rsvp-adults-value")) > 0) {
    await page.getByTestId("rsvp-adults-dec").click();
  }

  for (let i = 0; i < adults; i += 1) {
    await page.getByTestId("rsvp-adults-inc").click();
  }
  for (let i = 0; i < children; i += 1) {
    await page.getByTestId("rsvp-children-inc").click();
  }

  await expect(page.getByTestId("rsvp-adults-value")).toHaveText(String(adults));
  await expect(page.getByTestId("rsvp-children-value")).toHaveText(
    String(children),
  );
}
