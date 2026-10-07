import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProgressNavigator, type ProgressItem } from "../../src/features/assessment/progress-navigator";

import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog, selectedQuestions } from "../../src/application/assessment-catalog";
const catalog = assessmentCatalog(loadCanonicalConfig().config);
const profile = { industry: "Manufacturing (Industrial / Components)", companySize: "300", location: "APAC", targetMarket: "EU" };
const questions = selectedQuestions(catalog, profile);
const numericIndex = questions.findIndex(q => q.kind === "numeric");
const percentIndex = questions.findIndex(q => q.kind === "percent");
const numeric = questions[numericIndex]!;
const numericLabel = "Your answer" + (numeric.unit ? " (" + numeric.unit + ")" : "");
async function jump(page: Page, index: number) { await page.getByRole("button", { name: new RegExp("^Question " + (index + 1) + ":") }).click(); }
async function fillSetup(page: Page) {
  const values = { companyName: "Example workshop", ...profile, targetBuyer: "Not yet identified", businessGoal: "Explore procurement readiness" };
  for (const [name, value] of Object.entries(values)) {
    const field = page.locator('[name="' + name + '"]');
    if (["industry", "location", "targetMarket"].includes(name)) await field.selectOption(value);
    else await field.fill(value);
  }
}
async function start(page: Page) {
  await page.goto("/assessment");
  await fillSetup(page);
  await page.getByRole("button", { name: "Continue to input method" }).click();
  await expect(page.getByRole("radio", { name: /Enter manually/ })).toBeChecked();
  await expect(page.getByRole("radio", { name: /Use emissions calculator/ })).toBeDisabled();
  await expect(page.getByRole("radio", { name: /Upload utility bills/ })).toBeDisabled();
  await page.getByRole("button", { name: "Start questionnaire" }).click();
}
for (const width of [1440, 390]) {
  test("setup and questionnaire accessible at " + width + "px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByRole("link", { name: "Take the Assessment" }).click();
    await expect(page).toHaveURL(/\/assessment$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tell us about your business.");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath("setup.png"), fullPage: true });
    await page.getByRole("button", { name: "Continue to input method" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("highlighted fields");
    await expect(page.locator('[name="companyName"]')).toBeFocused();
    await fillSetup(page);
    await page.getByRole("button", { name: "Continue to input method" }).click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole("button", { name: "Start questionnaire" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[0]!.title);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("questionnaire.png"), fullPage: true });
    if (width < 1024) await page.locator(".mobile-progress summary").click();
    await page.getByRole("button", { name: /^Question 3:/ }).click();
    await expect(page.locator(".category-label")).toContainText(questions[2]!.category);
    if (width < 1024) await page.locator(".mobile-progress summary").click();
    await expect(page.getByRole("button", { name: /^Question 3:/ })).toHaveAttribute("aria-current", "step");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    if (width < 1024) await page.locator(".mobile-progress summary").click();
    await page.screenshot({ path: testInfo.outputPath("category-transition.png"), fullPage: true });
    expect(errors).toEqual([]);
  });
}
test("answers survive canonical navigation, skip, refresh, missing review and the no-score boundary", async ({ page }) => {
  await start(page);
  await page.getByRole("radio", { name: "No", exact: true }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Skip", exact: true }).click();
  await jump(page, 1);
  await expect(page.getByRole("button", { name: /^Question 2:/ })).toContainText("Unanswered · skipped");
  await jump(page, 0);
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.reload();
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await jump(page, numericIndex);
  await page.getByLabel(numericLabel, { exact: true }).fill("0");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await jump(page, percentIndex);
  await page.getByLabel("Your answer (%)", { exact: true }).fill("101");
  await page.getByRole("button", { name: /^(Continue|Review answers)$/ }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("0 to 100");
  await page.getByRole("button", { name: "Skip", exact: true }).click();
  await page.getByRole("button", { name: "Review all answers" }).click();
  await expect(page.getByText((questions.length - 2) + " unanswered questions.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Review missing answers" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  await jump(page, numericIndex);
  await expect(page.getByLabel(numericLabel, { exact: true })).toHaveValue("0");
  await page.getByRole("button", { name: "Review all answers" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Generate score anyway" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Preview complete — no score generated.");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Preview complete — no score generated.");
  const saved = await page.evaluate(() => sessionStorage.getItem("capstone.assessment.ui-preview.v1"));
  await page.getByRole("link", { name: "View mock results preview" }).click();
  await expect(page.getByText("Mock results · Design preview", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Return to assessment" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Preview complete — no score generated.");
  expect(await page.evaluate(() => sessionStorage.getItem("capstone.assessment.ui-preview.v1"))).toBe(saved);
});

test("setup drafts and edited context survive refresh", async ({ page }) => {
  await page.goto("/assessment");
  await page.locator('[name="companyName"]').fill("Partial example");
  await page.reload();
  await expect(page.locator('[name="companyName"]')).toHaveValue("Partial example");
  await fillSetup(page);
  await page.getByRole("button", { name: "Continue to input method" }).click();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("quantitative sustainability data");
  await page.getByRole("button", { name: "Back to setup" }).click();
  await expect(page.locator('[name="companySize"]')).toHaveValue("300");
});
test("keyboard radios, skip link and reduced motion work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await start(page);
  const yes = page.getByRole("radio", { name: "Yes", exact: true });
  await yes.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  expect(await page.locator(".question-stage").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  expect(await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe("auto");
});
test("corrupt saved data and blocked writes show truthful warnings", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("capstone.assessment.ui-preview.v1", "{broken"));
  await page.goto("/assessment");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("could not be read");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tell us about your business.");
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Quota"); }; });
  await page.locator('[name="companyName"]').fill("Still editable");
  await expect(page.getByText(/Changes could not be saved/)).toBeVisible();
  await expect(page.locator('[name="companyName"]')).toHaveValue("Still editable");
});

test("a fully answered canonical questionnaire still stops before scoring", async ({ page }) => {
  test.setTimeout(120000);
  await start(page);
  for (const question of questions) {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(question.title);
    if ("options" in question) {
      await page.getByRole("radio").first().focus();
      await page.keyboard.press("Space");
    } else await page.locator("#answer").fill("0");
    await page.getByRole("button", { name: /^(Continue|Review answers)$/ }).click();
  }
  await expect(page.getByText("0 unanswered questions.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review missing answers" })).toHaveCount(0);
  await page.getByRole("button", { name: "Continue to preview boundary" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Preview complete — no score generated.");
});

test("pointer choices advance once, while keyboard arrows and Space stay on the question", async ({ page }) => {
  await start(page);
  await page.getByText("Yes", { exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  await page.getByRole("radio").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[2]!.title);
  await page.getByRole("radio", { name: "Yes", exact: true }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400); // Longer than the 280ms auto-advance delay.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[2]!.title);
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[3]!.title);
  await jump(page, numericIndex);
  await page.getByLabel(numericLabel, { exact: true }).fill("3");
  await page.waitForTimeout(400);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(numeric.title);
});

test("pending pointer advance cancels on keyboard input or leaving the question", async ({ page }) => {
  await start(page);
  await page.clock.install();
  await page.getByRole("radio", { name: "Yes", exact: true }).click();
  await page.keyboard.press("ArrowRight");
  await page.clock.fastForward(500);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[0]!.title);
  await page.getByRole("radio", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Review all answers" }).click();
  await page.clock.fastForward(500);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review your answers.");
  await page.getByRole("button", { name: /^1\. / }).click();
  await expect(page.getByRole("radio", { name: "Yes", exact: true })).toBeChecked();
});

test("touch selection advances and mobile compact navigation opens on tap", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, baseURL });
  const page = await context.newPage();
  await page.goto("/assessment");
  await fillSetup(page);
  await page.getByRole("button", { name: "Continue to input method" }).tap();
  await page.getByRole("button", { name: "Start questionnaire" }).tap();
  await page.getByRole("radio", { name: "Yes", exact: true }).tap();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  await page.locator(".mobile-progress summary").tap();
  await page.getByRole("button", { name: new RegExp("^Question " + (numericIndex + 1) + ":") }).tap();
  await expect(page.getByLabel(numericLabel, { exact: true })).toBeVisible();
  await expect(page.locator(".mobile-progress")).not.toHaveAttribute("open");
  await context.close();
});

test("roller navigation uses brief directional motion and local progress stays compact", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await start(page);
  await page.getByRole("button", { name: /^Next question:/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  await expect(page.locator(".question-stage")).toHaveAttribute("data-direction", "forward");
  expect(await page.locator(".question-stage").evaluate((el) => getComputedStyle(el).animationDuration)).toBe("0.22s");
  expect(await page.locator(".question-peek").first().evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(100);
  await page.getByRole("button", { name: /^Previous question:/ }).click();
  await expect(page.locator(".question-stage")).toHaveAttribute("data-direction", "backward");
  await page.getByRole("button", { name: /^Question 4:/ }).focus();
  await expect(page.getByRole("group", { name: "Nearby questions" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[3]!.title);
  await expect(page.locator(".question-stage")).toHaveAttribute("data-direction", "forward");
  await page.mouse.move(1400, 10);
  const rail = await page.locator(".progress-panel").boundingBox();
  const card = await page.locator(".question-card").boundingBox();
  expect(rail!.height).toBeLessThanOrEqual(card!.height + 60);
  await page.screenshot({ path: testInfo.outputPath("roller-desktop.png"), fullPage: true });

});

test("navigator hover → click → leave → re-enter → hover a different marker → click", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await start(page);
  const track = page.locator(".desktop-progress .progress-track");
  const first = page.getByRole("button", { name: /^Question 3:/ });
  await first.hover();
  await expect(track).toHaveAttribute("data-inspected", "2");
  const before = await first.boundingBox();
  await expect(page.getByRole("group", { name: "Nearby questions" })).toBeVisible();
  expect(await first.boundingBox()).toEqual(before);
  await first.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[2]!.title);
  await page.mouse.move(1400, 10);
  await expect(page.getByRole("group", { name: "Nearby questions" })).toHaveCount(0);
  await page.getByRole("button", { name: /^Question 5:/ }).hover();
  await expect(track).toHaveAttribute("data-inspected", "4");
  await page.getByRole("button", { name: /^Question 5:/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[4]!.title);
  await page.mouse.move(1400, 10);
  await page.getByRole("button", { name: /^Question 2:/ }).hover();
  await expect(track).toHaveAttribute("data-inspected", "1");
  await page.getByRole("button", { name: /^Go to question 4:/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[3]!.title);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /^Question 5:/ }).focus();
  await expect(track).toHaveAttribute("data-inspected", "4");
  expect(await page.locator(".desktop-progress .progress-symbol").first().evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("local-magnification.png"), fullPage: true });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("group", { name: "Nearby questions" })).toHaveCount(0);
  await expect(page.locator(".progress-context")).toHaveCount(0);
});

test("50-question navigator fixture fits every position without collapsed scrolling", async ({ page }, testInfo) => {
  const items: ProgressItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: "fixture-" + i, number: i + 1, title: "Example question " + (i + 1),
    category: ["People", "Governance", "Community", "Resources"][Math.floor(i / 13)]!,
    status: i % 3 === 0 ? "Answered" : i % 3 === 1 ? "Unanswered" : "Unanswered · skipped",
    current: i === 24,
  }));
  // Render the actual component with 50 props, using the production CSS.
  // Interaction callbacks are exercised with the same 50-item fixture in unit tests.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/assessment");
  const styles = await page.locator('link[rel="stylesheet"]').evaluateAll((links) => links.map((link) => link.outerHTML).join(""));
  const fontClass = await page.locator("html").getAttribute("class") ?? "";
  const markup = renderToStaticMarkup(createElement(ProgressNavigator, { items, onSelect: () => {} }));
  await page.setContent('<!doctype html><html lang="en"><head><title>Navigator fixture</title>' + styles + '</head><body><main class="page-container"><h1 class="text-subheading">50-question navigation fixture</h1><div style="width:224px">' + markup + '</div></main></body></html>');
  await page.locator("html").evaluate((element, className) => { element.setAttribute("class", className); }, fontClass);
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator(".desktop-progress .progress-track");
  const metrics = await track.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, height: box.height, client: element.clientHeight, scroll: element.scrollHeight, overflow: getComputedStyle(element).overflowY };
  });
  expect(metrics.height).toBeLessThanOrEqual(352);
  expect(metrics.scroll).toBe(metrics.client);
  expect(metrics.overflow).toBe("visible");
  const positions = await page.locator(".desktop-progress .progress-dot").evaluateAll((buttons) => buttons.map((button) => {
    const rect = button.getBoundingClientRect();
    return { x: rect.x, y: rect.y, bottom: rect.bottom, height: rect.height };
  }));
  expect(positions).toHaveLength(50);
  expect(new Set(positions.map((position) => position.x)).size).toBe(1);
  for (let i = 0; i < positions.length; i++) {
    expect(positions[i]!.y).toBeGreaterThanOrEqual(metrics.top);
    expect(positions[i]!.bottom).toBeLessThanOrEqual(metrics.bottom + 0.1);
    expect(positions[i]!.height).toBeGreaterThan(0);
    if (i) expect(positions[i]!.y).toBeGreaterThanOrEqual(positions[i - 1]!.bottom - 0.1);
  }
  expect((await page.locator(".progress-panel").boundingBox())!.height).toBeLessThanOrEqual(520);
  await expect(page.getByRole("button", { name: /^Question 50:/ })).toBeInViewport();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("all-50-positions.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".mobile-progress summary").click();
  await page.getByRole("button", { name: /^Question 50:/ }).focus();
  await expect(page.getByRole("button", { name: /^Question 50:/ })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
