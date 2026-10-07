import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [1440, 390, 320]) {
  test("mock results are accessible and responsive at " + width + "px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    const apiRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => { if (request.method() === "POST" || request.url().includes("/api/")) apiRequests.push(request.url()); });
    const response = await page.goto("/results");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Mock results preview | Capstone");
    await expect(page.getByText("Mock results · Design preview", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download full report" })).toBeDisabled();
    await expect(page.getByRole("figure")).toContainText("People76");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("results-" + width + ".png"), fullPage: true });
    expect(apiRequests).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("results support keyboard navigation and reduced motion without a session", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/results");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to results preview" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  const evidence = page.getByRole("link", { name: "Evidence status: not connected" }).first();
  await expect(page.getByRole("navigation", { name: "Results sections" }).getByRole("link", { name: "Summary", exact: true })).toBeFocused();
  await evidence.focus();
  await expect(evidence).toBeFocused();
  expect(await evidence.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#sources$/);
  expect(await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe("auto");
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Return to assessment" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tell us about your business.");
});

test("malformed session data cannot become plausible results", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("capstone.assessment.ui-preview.v1", "{broken"));
  await page.goto("/results");
  await expect(page.getByRole("complementary", { name: "Mock results notice" })).toContainText("fixed layout examples");
  expect(await page.evaluate(() => sessionStorage.getItem("capstone.assessment.ui-preview.v1"))).toBe("{broken");
  await page.getByRole("link", { name: "Return to assessment" }).first().click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("could not be read");
});

for (const width of [1440, 390, 320]) {
  test("section navigation remains accessible and sticky at " + width + "px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/results");
    const mobile = width < 768;
    const disclosure = page.locator(".results-mobile-nav");
    const nav = page.getByRole("navigation", { name: "Results sections" });
    for (const [label, id] of [["Key Gaps", "gaps"], ["Recommended Actions", "actions"], ["Evidence/Sources", "sources"], ["Summary", "summary"]]) {
      if (mobile) {
        await disclosure.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(disclosure).toHaveAttribute("open");
      }
      const link = nav.getByRole("link", { name: label, exact: true });
      await link.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp("#" + id + "$"));
      await expect(page.locator("#" + id)).toBeFocused();
      if (mobile) await expect(disclosure).not.toHaveAttribute("open");
      const rail = await page.locator(".results-navigation").boundingBox();
      const section = await page.locator("#" + id).boundingBox();
      expect(section!.y).toBeGreaterThanOrEqual(rail!.y + rail!.height);
    }
    await page.locator("#gaps").scrollIntoViewIfNeeded();
    await expect.poll(async () => Math.round((await page.locator(".results-navigation").boundingBox())!.y)).toBe(0);
    if (mobile) {
      await disclosure.locator("summary").click();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath("section-nav-" + width + ".png") });
      await nav.getByRole("link", { name: "Evidence/Sources", exact: true }).focus();
      await page.keyboard.press("Escape");
      await expect(disclosure).not.toHaveAttribute("open");
      await expect(disclosure.locator("summary")).toBeFocused();
      await disclosure.locator("summary").click();
      await nav.getByRole("link", { name: "Summary", exact: true }).click();
      await expect(disclosure).not.toHaveAttribute("open");
    } else {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath("section-nav-" + width + ".png") });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
