import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog, selectedQuestions } from "../../src/application/assessment-catalog";
import { goldenCases } from "../helpers/legacy-scoring";
const catalog = assessmentCatalog(loadCanonicalConfig().config);
const fixture = goldenCases[1]!;
const p = fixture.profile;
const state = { version: 3, progress: 4, configVersion: catalog.version, phase: "review", inputMethod: "manual", activeId: fixture.expected_question_ids[0],
  answers: Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)])), skipped: [],
  profile: { companyName: "Example business", subindustry: "", industry: p.industry, companySize: p.employee_band.replace("-", " - "), location: p.company_location, targetMarket: p.target_market_region.join(";"), targetBuyer: p.target_buyer, businessGoal: p.business_goal } };
for (const width of [1440, 390, 320]) test("engine trace disclosure is keyboard accessible and responsive at " + width, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), state);
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  const response = page.waitForResponse(r => r.url().includes("/api/assessment-score") && r.status() === 200);
  await page.goto("/results");
  const engine = await (await response).json();
  await expect(page.locator(".score-values")).toContainText(engine.rawOverall.toFixed(1));
  await expect(page.locator(".score-values")).toContainText(engine.weightedOverall.toFixed(1));
  for (const category of engine.categories) {
    const bar = page.locator(".category-bars > li").filter({ hasText: category.category });
    await expect(bar).toContainText(category.percent.toFixed(1));
    expect(await bar.evaluate(el => (el as HTMLElement).style.getPropertyValue("--bar-value"))).toBe(category.percent + "%");
  }
  const details = page.locator(".score-explanation");
  await expect(details).toBeVisible(); await expect(details).not.toHaveAttribute("open");
  await details.locator(":scope > summary").focus(); await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open");
  const numeric = engine.trace.find((r: { status: string; response_type: string }) => r.status === "scored" && r.response_type === "numeric");
  const question = details.locator(".trace-question").filter({ has: page.locator("summary", { hasText: numeric.question_text }) }).first();
  await question.locator(":scope > summary").click();
  await expect(question.locator(".trace-values")).toContainText(numeric.final_score.toFixed(2));
  await question.getByText("Technical detail", { exact: true }).click();
  const json = page.getByRole("textbox", { name: "Calculation trace for " + numeric.question_id });
  expect(JSON.parse(await json.inputValue())).toEqual(numeric);
  await json.focus(); await expect(json).toBeFocused();
  expect(await json.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await question.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("trace-" + width + ".png") });
  await details.getByText("Scored assessment JSON", { exact: true }).click();
  expect(JSON.parse(await page.getByRole("textbox", { name: "Scored assessment JSON record" }).inputValue())).toEqual(engine);
  const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!));
  expect(saved.answers).toEqual(state.answers); expect(saved).not.toHaveProperty("trace");
  expect(errors).toEqual([]);
});
test("session changes and page restoration replace explanations, never retaining stale traces", async ({ page }) => {
  await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), state);
  await page.goto("/results"); await expect(page.locator(".score-explanation")).toBeVisible();
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/assessment-score", async route => { await gate; await route.continue(); });
  await page.evaluate(() => {
    const key = "capstone.assessment.ui-preview.v1";
    const s = JSON.parse(sessionStorage.getItem(key)!);
    s.answers = { "U-001": "No" };
    sessionStorage.setItem(key, JSON.stringify(s));
    window.dispatchEvent(new Event("capstone:assessment-session-changed"));
  });
  await expect(page.getByRole("region", { name: "Deterministic assessment results" }).getByRole("status")).toContainText("Calculating");
  await expect(page.locator(".score-explanation")).toHaveCount(0);
  release(); await expect(page.locator(".score-explanation")).toBeVisible();
  await expect(page.locator(".score-values")).toContainText("0.0");
  await page.locator(".score-explanation > summary").click();
  await page.getByText("Scored assessment JSON", { exact: true }).click();
  const score = JSON.parse(await page.getByRole("textbox", { name: "Scored assessment JSON record" }).inputValue());
  expect(score.input.answers).toEqual({ "U-001": "No" });
  expect(score.trace.filter((r: { status: string }) => r.status === "scored")).toHaveLength(1);
  const next = page.waitForResponse(r => r.url().includes("/api/assessment-score"));
  await page.evaluate(() => { window.dispatchEvent(new Event("pagehide")); window.dispatchEvent(new Event("pageshow")); });
  await next; await expect(page.locator(".score-explanation")).toBeVisible();
  await page.evaluate(() => { sessionStorage.removeItem("capstone.assessment.ui-preview.v1"); window.dispatchEvent(new Event("capstone:assessment-session-changed")); });
  await expect(page.getByRole("heading", { name: "Scores unavailable" })).toBeVisible();
  await expect(page.locator(".score-explanation")).toHaveCount(0);
});

for (const patch of [{ version: 2 }, { configVersion: "incompatible-config" }]) test("incompatible session rejects scoring: " + JSON.stringify(patch), async ({ page }) => {
  await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), { ...state, ...patch });
  let requests = 0; page.on("request", r => { if (r.url().includes("/api/assessment-score")) requests++; });
  await page.goto("/results");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("incompatible");
  await expect(page.locator(".score-values, .category-bars, .score-explanation")).toHaveCount(0);
  expect(requests).toBe(0);
});
for (const failure of ["service", "network"]) test("current " + failure + " failure removes scores and explanation; refresh recovers", async ({ page }) => {
  await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), state);
  await page.goto("/results");
  await expect(page.locator(".score-explanation")).toBeVisible();
  await page.route("**/api/assessment-score", route => failure === "network" ? route.abort("failed") :
    route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Scoring configuration is unavailable. No score has been generated." }) }));
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  await expect(page.getByRole("heading", { name: "Scores unavailable" })).toBeVisible();
  await expect(page.getByRole("main").getByRole("alert")).not.toBeEmpty();
  await expect(page.locator(".score-values, .category-bars, .score-explanation")).toHaveCount(0);
  await page.locator("#actions summary").click();
  await expect(page.getByText("No generated recommendations are available for this assessment.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Generate recommendations" })).toBeDisabled();
  await page.unroute("**/api/assessment-score");
  await page.reload(); await expect(page.locator(".score-explanation")).toBeVisible();
});



test("editing a scored answer through the questionnaire updates scores, bars and the same trace after restoration", async ({ page }) => {
  await page.addInitScript(s => {
    const key = "capstone.assessment.ui-preview.v1";
    if (!sessionStorage.getItem(key)) sessionStorage.setItem(key, JSON.stringify(s));
  }, state);
  await page.goto("/assessment");
  await page.getByRole("button", { name: "1. " + selectedQuestions(catalog,state.profile)[0]!.title, exact: true }).click();
  await page.getByRole("radio", { name: "No", exact: true }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /^Question 1:/ }).click();
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.reload();
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Review all answers" }).click();
  const response = page.waitForResponse(r => r.url().includes("/api/assessment-score") && r.status() === 200);
  await page.getByRole("button", { name: "Generate score and recommendations", exact: true }).click();
  const score = await (await response).json();
  expect(score.input.answers["U-001"]).toBe("No");
  expect(score.trace.find((r: { question_id: string }) => r.question_id === "U-001")).toMatchObject({ raw_answer: "No", normalized_score: 0, final_score: 0 });
  await expect(page.locator(".score-values")).toContainText(score.rawOverall.toFixed(1));
  for (const category of score.categories) await expect(page.locator(".category-bars > li").filter({ hasText: category.category })).toContainText(category.percent.toFixed(1));
  await page.locator(".score-explanation > summary").click();
  await page.getByText("Scored assessment JSON", { exact: true }).click();
  expect(JSON.parse(await page.getByRole("textbox", { name: "Scored assessment JSON record" }).inputValue())).toEqual(score);
});
