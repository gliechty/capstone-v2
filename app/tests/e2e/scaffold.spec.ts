import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow", width: 320, height: 720 },
]) {
  test(`landing at ${viewport.name}: responsive, accessible and honest about availability`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sustainability depends.");
    await expect(page).toHaveTitle("MOSAIC · context-weighted sustainability assessment");
    await expect(page.getByRole("link", { name: "Start your assessment" }).first()).toHaveAttribute("href", "/assessment");
    await expect(page.getByLabel("MOSAIC explainer film, 92 seconds", { exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    // Audit the content hidden in disclosures as well as the initial view.
    for (const summary of await page.locator("main details > summary").all()) {
      await summary.focus();
      await page.keyboard.press("Enter");
    }
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    for (const summary of await page.locator("main details > summary").all()) {
      await summary.focus();
      await page.keyboard.press("Space");
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: testInfo.outputPath(`landing-${viewport.name}.png`), fullPage: true, animations: "disabled" });
    expect(errors).toEqual([]);
  });
}

test("keyboard users can skip navigation, follow anchors and open research disclosures", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  expect(await skip.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Start your assessment" }).first()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /Explore your results/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#outputs$/);
  const disclosure = page.getByText("What has been verified?", { exact: true });
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/The research reports external-rater comparisons/)).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByText(/The research reports external-rater comparisons/)).toBeHidden();
});

test("reduced motion removes entrance animation and smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.locator(".intro-enter").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  expect(await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe("auto");
  expect(await page.locator(".nav-link").first().evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("normal motion is brief and UI tokens reach the rendered controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  expect(await page.locator(".intro-enter").evaluate((el) => getComputedStyle(el).animationDuration)).toBe("0.22s");
  expect(await page.getByRole("link", { name: "Start your assessment" }).first().evaluate((el) => getComputedStyle(el).borderRadius)).toBe("10px");
});

test("unknown routes return an actual not-found response", async ({ request }) => {
  const response = await request.get("/not-an-implemented-feature");
  expect(response.status()).toBe(404);
});

for (const width of [1440, 390, 320]) {
  test("sticky header keeps anchor targets visible at " + width + "px", async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    for (const target of ["context", "outputs", "approach", "research"]) {
      await page.locator('header a[href="#' + target + '"]').click();
      await expect.poll(async () => {
        const header = await page.locator("header").boundingBox();
        const section = await page.locator("#" + target).boundingBox();
        return section!.y >= header!.y + header!.height - 1;
      }).toBe(true);
      await expect.poll(async () => Math.round((await page.locator("header").boundingBox())!.y)).toBe(0);
    }
    await page.getByRole("link", { name: "Back to top" }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    const header = await page.locator("header").boundingBox();
    const heading = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(heading!.y).toBeGreaterThanOrEqual(header!.height);
  });
}

for (const width of [1440, 390]) {
  test(`authorship and search metadata at ${width}`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://preview.flowagentai.website');
    const credit = page.getByRole('link', { name: 'Guy Liechty', exact: true });
    await credit.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveTitle('Guy Liechty — Building MOSAIC');
    // Inspect a fresh document as a crawler would, after checking keyboard navigation.
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guy Liechty — Building MOSAIC');
    await expect(page.getByText(/original student team’s research/)).toBeVisible();
    await expect(page.getByText('Columbia Climate School · SEE', { exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    expect(JSON.parse(await page.locator('script[type="application/ld+json"]').innerText()).mainEntity.name).toBe('Guy Liechty');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.goto('/assessment');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    const sitemap = await request.get('/sitemap.xml');
    expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(2);
    expect(await sitemap.text()).toContain('/about/guy-liechty');
    expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /api/');
  });
}
