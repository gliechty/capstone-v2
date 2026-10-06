import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("production scaffold loads without browser errors or accessibility violations", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Capstone v2 — scaffold" })).toBeVisible();
  await expect(page).toHaveTitle("Capstone v2 — scaffold");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("unknown routes return an actual not-found response", async ({ request }) => {
  const response = await request.get("/not-an-implemented-feature");
  expect(response.status()).toBe(404);
});
