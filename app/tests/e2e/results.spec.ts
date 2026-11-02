import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [1440, 390, 320]) {
  test("results without a session are accessible and responsive at " + width + "px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    const apiRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => { if (request.method() === "POST" || request.url().includes("/api/")) apiRequests.push(request.url()); });
    const response = await page.goto("/results");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Assessment results | Capstone");
    await expect(page.getByText("Calculated scores · Optional AI recommendations", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download assessment report" })).toBeDisabled();
    await expect(page.getByRole("heading", { name: "Scores unavailable" })).toBeVisible();
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
  await expect(page.getByRole("link", { name: "Skip to results" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  const evidence = page.getByRole("link", { name: "Evidence/Sources" }).first();
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
  await expect(page.getByRole("main").getByRole("alert")).toContainText("could not be read");
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

import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog } from "../../src/application/assessment-catalog";
import { goldenCases } from "../helpers/legacy-scoring";
import { scoreAssessment } from "../../src/domain/scoring/score-assessment";
const config = loadCanonicalConfig().config;
const catalog = assessmentCatalog(config);
for (const width of [1440, 390]) test("real Golden assessment results are accessible and responsive at " + width, async ({ page }, testInfo) => {
  const fixture = goldenCases[1]!;
  const p = fixture.profile;
  const answers = Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)]));
  const session = { version: 3, progress: 4, configVersion: catalog.version, phase: "review", inputMethod: "manual", activeId: fixture.expected_question_ids[0], answers, skipped: [],
    profile: { companyName: "Example business", subindustry: "", industry: p.industry, companySize: p.employee_band.replace("-", " - "), location: p.company_location, targetMarket: p.target_market_region.join(";"), targetBuyer: p.target_buyer, businessGoal: p.business_goal } };
  await page.setViewportSize({ width, height: 1000 });
  await page.addInitScript(value => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(value)), session);
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  await page.goto("/assessment");
  await page.getByRole("button", { name: "Generate score and recommendations", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Calculated overall scores" })).toBeVisible();
  const context = page.getByLabel("Assessment context", { exact: true });
  await expect(context).toContainText(p.industry);
  await expect(context).toContainText(session.profile.companySize);
  await expect(context).toContainText(p.business_goal);
  const score = scoreAssessment(config, p, answers);
  await expect(page.locator(".score-values")).toContainText(score.rawOverall!.toFixed(1));
  await expect(page.locator(".score-values")).toContainText(score.weightedOverall!.toFixed(1));
  await expect(page.getByRole("figure", { name: "Calculated category scores" })).toContainText("People100.0");
  await expect(page.getByRole("button", { name: /^(Generate|Retry) recommendations$/ })).toBeDisabled();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("computed-results-" + width + ".png"), fullPage: true });
  await page.reload(); await expect(page.getByRole("heading", { name: "Calculated overall scores" })).toBeVisible();
  expect(errors).toEqual([]);
});
test("results reject invalid drafts, show missing categories, and do not replace storage with calculated values", async ({ page }) => {
  const profile = { companyName: "Example", subindustry: "", industry: catalog.industries[0], companySize: "251 - 500", location: "APAC", targetMarket: "EU", targetBuyer: "Enterprise", businessGoal: "Investor readiness" };
  const state = { version: 3, progress: 4, configVersion: catalog.version, phase: "review", inputMethod: "manual", activeId: "U-001", profile, answers: { "U-018": "invalid" }, skipped: [] };
  await page.goto("/results");
  await page.evaluate(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), state);
  await page.reload(); await expect(page.getByRole("region", { name: "Deterministic assessment results", exact: true }).getByRole("alert")).toContainText("non-negative decimal");
  await expect(page.locator(".score-number")).toHaveCount(0);
  await page.evaluate(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify({ ...s, answers: { "U-001": "Yes" } })), state);
  await page.reload(); await expect(page.getByRole("figure", { name: "Calculated category scores", exact: true })).toContainText("PeopleNot scored");
  await expect(page.getByRole("figure", { name: "Calculated category scores", exact: true })).toContainText("Governance100.0");
  const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!));
  expect(saved.answers).toEqual({ "U-001": "Yes" }); expect(saved).not.toHaveProperty("rawOverall");
  await page.evaluate(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify({ ...s, answers: {} })), state);
  await page.reload(); await expect(page.locator(".score-values")).toHaveText(/Not scored.*Not scored/);
  await page.evaluate(() => { const key = "capstone.assessment.ui-preview.v1"; const saved = JSON.parse(sessionStorage.getItem(key)!); saved.profile.businessGoal = "Improve sustainability ratings"; sessionStorage.setItem(key, JSON.stringify(saved)); });
  await page.reload();
  await expect(page.getByLabel("Assessment context", { exact: true })).toContainText("Improve sustainability ratings");
  await expect(page.getByLabel("Assessment context", { exact: true })).not.toContainText("Investor readiness");
});
