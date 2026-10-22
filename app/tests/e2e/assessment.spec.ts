import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProgressNavigator, type ProgressItem } from "../../src/features/assessment/progress-navigator";

import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog, selectedQuestions } from "../../src/application/assessment-catalog";
const catalog = assessmentCatalog(loadCanonicalConfig().config);
const profile = { industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarket: "EU" };
const questions = selectedQuestions(catalog, profile);
const numericIndex = questions.findIndex(q => q.kind === "numeric");
const percentIndex = questions.findIndex(q => q.kind === "percent");
const numeric = questions[numericIndex]!;
const numericLabel = "Your answer" + (numeric.unit ? " (" + numeric.unit + ")" : "");
async function jump(page: Page, index: number) { await page.getByRole("button", { name: new RegExp("^Question " + (index + 1) + ":") }).click(); }
async function fillSetup(page: Page, overrides: Record<string, string> = {}) {
  const values = { companyName: "Example workshop", ...profile, targetBuyer: "Enterprise", businessGoal: "Prepare for procurement questionnaires", ...overrides };
  for (const [name, value] of Object.entries(values)) {
    const field = page.locator('[name="' + name + '"]');
    if (name === "targetMarket") { for (const market of value.split(";")) await page.getByRole("checkbox", { name: market, exact: true }).check(); }
    else if (name !== "companyName") await field.selectOption(value);
    else await field.fill(value);
  }
}
async function start(page: Page) {
  await page.goto("/assessment");
  await fillSetup(page);
  await page.getByRole("button", { name: "Continue to input method" }).click();
  await expect(page.getByRole("radio", { name: /Enter manually/ })).toBeChecked();
  await expect(page.getByRole("radio", { name: /Use emissions calculator/ })).toBeEnabled();
  await expect(page.getByRole("radio", { name: /Upload utility bills/ })).toBeDisabled();
  await page.getByRole("button", { name: "Start questionnaire" }).click();
}
for (const width of [1440, 390]) {
  test("setup and questionnaire accessible at " + width + "px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByRole("link", { name: "Take the Assessment" }).first().click();
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
test("answers survive canonical navigation, skip, refresh, missing review and the scoring handoff", async ({ page }) => {
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
  await expect(page.getByText(new RegExp((questions.length - 2) + " unanswered questions"))).toBeVisible();
  await page.getByRole("button", { name: "Review missing answers" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  await jump(page, numericIndex);
  await expect(page.getByLabel(numericLabel, { exact: true })).toHaveValue("0");
  await page.getByRole("button", { name: "Review all answers" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await expect(page.getByRole("button", { name: "Generate score and recommendations", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Generate score and recommendations", exact: true }).click();
  await page.getByRole("button", { name: "Generate score and recommendations anyway", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your assessment results");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your assessment results");
  const saved = await page.evaluate(() => sessionStorage.getItem("capstone.assessment.ui-preview.v1"));
  await expect(page.getByText("Calculated scores · Optional AI recommendations", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Return to assessment" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review your answers.");
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
  await expect(page.locator('[name="companySize"]')).toHaveValue("251 - 500");
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

test("a fully answered canonical questionnaire starts combined results", async ({ page }) => {
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
  await expect(page.getByText(/answered · 0 unanswered questions/ )).toBeVisible();
  await expect(page.getByRole("button", { name: "Review missing answers" })).toHaveCount(0);
  await page.getByRole("button", { name: "Generate score and recommendations" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your assessment results");
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
  await page.waitForTimeout(1000); // Longer than the 800ms confirmation pause.
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
  await page.clock.fastForward(1000);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[0]!.title);
  await page.getByRole("radio", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Review all answers" }).click();
  await page.clock.fastForward(1000);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review your answers.");
  await page.getByRole("button", { name: "1. " + questions[0]!.title, exact: true }).click();
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

test("roller navigation uses visible directional motion and local progress stays compact", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 768 });
  await start(page);
  await page.getByRole("button", { name: /^Next question:/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  await expect(page.locator(".question-stage")).toHaveAttribute("data-direction", "forward");
  expect(await page.locator(".active-question-region > .question-card").evaluate((el) => getComputedStyle(el).animationDuration)).toBe("0.65s");
  expect(await page.locator(".question-peek").first().evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(50);
  // Owner requested motion-over-time and 100%-zoom viewport verification.
  await page.locator(".question-stage").evaluate(el => el.getAnimations({subtree:true}).forEach(a => a.pause()));
  const motionFrames = [];
  for (const time of [0, 325, 649]) {
    await page.locator(".question-stage").evaluate((el,time) => el.getAnimations({subtree:true}).forEach(a => {a.currentTime=time;}),time);
    motionFrames.push(await page.locator(".active-question-region > .question-card").evaluate(el => ({y:el.getBoundingClientRect().y,opacity:getComputedStyle(el).opacity})));
    await page.screenshot({path:testInfo.outputPath(`wheel-frame-${time}.png`),fullPage:false});
  }
  await page.locator(".question-stage").evaluate(el => el.getAnimations({subtree:true}).forEach(a => a.finish()));
  expect(motionFrames[0]!.y).toBeGreaterThan(motionFrames[1]!.y);
  expect(motionFrames[1]!.y).toBeGreaterThan(motionFrames[2]!.y);
  expect(motionFrames.every(frame => frame.opacity === "1")).toBe(true);
  await page.locator(".departing-card").waitFor({state:"detached"});
  const viewport = await page.locator(".question-region").evaluate(el => {
    const region=el.getBoundingClientRect(), nav=document.querySelector(".stage-navigation")!.getBoundingClientRect();
    return {top:region.top,bottom:region.bottom,navBottom:nav.bottom,navHeight:nav.height,height:innerHeight,zoom:devicePixelRatio};
  });
  expect(viewport.top).toBeGreaterThanOrEqual(viewport.navBottom);
  expect(viewport.bottom).toBeLessThanOrEqual(viewport.height);
  expect(viewport.navHeight).toBeLessThanOrEqual(64);
  const controls=(await page.locator(".answer-actions").boundingBox())!;
  expect(controls.y+controls.height).toBeLessThanOrEqual(viewport.height);
  await expect(page.locator(".question-toolbar")).toContainText("Question 2 of");
  await page.screenshot({ path:testInfo.outputPath("wheel-100-percent.png"),fullPage:false });
  await page.getByRole("button", { name: /^Previous question:/ }).click();
  await expect(page.locator(".question-stage")).toHaveAttribute("data-direction", "backward");
  await page.getByRole("button", { name: /^Question 4:/ }).focus();
  await expect(page.getByRole("group", { name: "Nearby questions" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[3]!.title);
  await expect(page.locator(".question-stage")).toHaveAttribute("data-direction", "forward");
  await page.mouse.move(1400, 10);
  const rail = await page.locator(".desktop-progress .progress-track").boundingBox();
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
  await page.setContent('<!doctype html><html lang="en"><head><title>Navigator fixture</title>' + styles + '</head><body><main class="page-container"><h1 class="text-subheading">50-question navigation fixture</h1><div class="assessment-grid">' + markup + '<section class="question-region"><div class="question-toolbar">Question fixture</div><div class="question-stage"><div class="question-peek-boundary">Previous</div><article class="question-card" style="min-height:640px"><h2>Active question fixture</h2></article><div class="question-peek-boundary">Next</div></div></section></div></main></body></html>');
  await page.locator("html").evaluate((element, className) => { element.setAttribute("class", className); }, fontClass);
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator(".desktop-progress .progress-track");
  const metrics = await track.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, height: box.height, client: element.clientHeight, scroll: element.scrollHeight, overflow: getComputedStyle(element).overflowY };
  });
  expect(metrics.height).toBeGreaterThan(400);
  expect(metrics.height).toBeCloseTo((await page.locator(".question-card").boundingBox())!.height, 0);
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
  expect((await page.locator(".desktop-progress .progress-track").boundingBox())!.height).toBeCloseTo((await page.locator(".question-card").boundingBox())!.height, 0);
  await expect(page.getByRole("button", { name: /^Question 50:/ })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("all-50-positions.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".mobile-progress summary").click();
  await page.getByRole("button", { name: /^Question 50:/ }).focus();
  await expect(page.getByRole("button", { name: /^Question 50:/ })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

for (const width of [1440, 390]) {
  test("controlled setup and two ordered market chips at " + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/assessment");
    await expect(page.getByRole("textbox")).toHaveCount(3);
    await expect(page.getByRole("textbox", { name: "Additional Context / Requirements (optional)", exact: true })).toBeVisible();
    await expect(page.getByRole("combobox")).toHaveCount(5);
    await fillSetup(page);
    await page.getByRole("checkbox", { name: "UK", exact: true }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByText("Primary: EU", { exact: true })).toBeVisible();
    await expect(page.getByText("Secondary: UK", { exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "APAC", exact: true })).toBeDisabled();
    await page.reload();
    await expect(page.getByRole("combobox", { name: /^Company size/ })).toHaveValue("251 - 500");
    await expect(page.getByRole("combobox", { name: /^Target buyer/ })).toHaveValue("Enterprise");
    await expect(page.getByText("Secondary: UK", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Remove EU", exact: true }).click();
    await expect(page.getByText("Primary: UK", { exact: true })).toBeVisible();
    await page.getByRole("checkbox", { name: "APAC", exact: true }).check();
    await expect(page.getByText("Secondary: APAC", { exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "EU", exact: true })).toBeDisabled();
    if (width > 1024) {
      const buyer = await page.locator("#profile-targetBuyer").boundingBox();
      const goal = await page.locator("#profile-businessGoal").boundingBox();
      expect(goal!.width).toBeCloseTo(buyer!.width, 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath("controlled-setup.png"), fullPage: true });
    await page.getByRole("button", { name: "Remove UK", exact: true }).click();
    await page.getByRole("button", { name: "Remove APAC", exact: true }).click();
    await page.getByRole("button", { name: "Continue to input method" }).click();
    await expect(page.getByRole("checkbox", { name: "North America", exact: true })).toBeFocused();
    await expect(page.getByRole("group", { name: /^Target markets/ })).toHaveAttribute("aria-invalid", "true");
  });
}
test("old count/free-text sessions are rejected visibly", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify({
    version: 2, configVersion: "capstone-v1-migrated-1", phase: "setup", profile: { companyName: "Old", industry: "Manufacturing (Industrial / Components)", subindustry: "", companySize: "300", location: "APAC", targetMarket: "EU;UK;APAC", targetBuyer: "My buyer", businessGoal: "My goal" }, inputMethod: "manual", activeId: "", answers: {}, skipped: [],
  })));
  await page.goto("/assessment");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("incompatible");
  await expect(page.getByRole("combobox", { name: /^Company size/ })).toHaveValue("");
  await expect(page.getByRole("textbox", { name: /^Company name/ })).toHaveValue("");
});

import { readFileSync, readdirSync } from "node:fs";
test("real 64-question rail tracks active card height without scrolling", async ({ page }, testInfo) => {
  const dir = "../BUILD_PACK/07_GOLDEN_TESTS/sme_cases/";
  const fixture = JSON.parse(readFileSync(dir + readdirSync(dir).find(file => file.toLowerCase().includes("construction")), "utf8"));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/assessment");
  await fillSetup(page, { industry: fixture.profile.industry, companySize: "501 - 1000", location: fixture.profile.company_location, targetMarket: fixture.profile.target_market_region.join(";") });
  await page.getByRole("button", { name: "Continue to input method" }).click();
  await page.getByRole("button", { name: "Start questionnaire" }).click();
  await expect(page.locator(".desktop-progress .progress-dot")).toHaveCount(64);
  async function checkGeometry() {
    const card = (await page.locator(".question-card").boundingBox())!;
    const panel = (await page.locator(".desktop-progress .progress-track").boundingBox())!;
    expect(panel.y).toBeCloseTo(card.y, 0);
    expect(panel.height).toBeCloseTo(card.height, 0);
    const track = await page.locator(".desktop-progress .progress-track").evaluate(el => ({ height: el.clientHeight, scroll: el.scrollHeight }));
    expect(track.height).toBeGreaterThan(card.height * 0.6);
    expect(track.scroll).toBe(track.height);
    const markers = await page.locator(".desktop-progress .progress-dot").evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { y: r.y, bottom: r.bottom, height: r.height }; }));
    expect(markers[0]!.y).toBeGreaterThan(card.y);
    expect(markers.at(-1)!.bottom).toBeLessThan(card.y + card.height);
    expect(markers.every(m => m.height > 0)).toBe(true);
    for (let i = 1; i < markers.length; i++) expect(markers[i]!.y).toBeGreaterThanOrEqual(markers[i - 1]!.bottom - 0.1);
    return card.height;
  }
  const first = await checkGeometry();
  await jump(page, 1); // Different option counts retain the requested bounded card height.
  const second = await checkGeometry();
  expect(second).toBe(first);
  await page.screenshot({ path: testInfo.outputPath("canonical-rail.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".question-card").evaluate(el => el.scrollIntoView({ block: "center" }));
  await expect(page.locator(".mobile-rail-marker")).toHaveCount(64);
  const mobile = await page.locator(".mobile-rail-surface").evaluate(el => ({ height: el.clientHeight, scroll: el.scrollHeight, top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom }));
  expect(mobile.scroll).toBe(mobile.height);
  expect(mobile.top).toBeGreaterThanOrEqual(0);
  expect(mobile.bottom).toBeLessThanOrEqual(844);
  const ticks = await page.locator(".mobile-rail-marker").evaluateAll(els => els.map(el => ({ top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom })));
  for (let i = 0; i < ticks.length; i++) {
    expect(ticks[i]!.top).toBeGreaterThanOrEqual(mobile.top);
    expect(ticks[i]!.bottom).toBeLessThanOrEqual(mobile.bottom);
    if (i) expect(ticks[i]!.top).toBeGreaterThanOrEqual(ticks[i - 1]!.bottom - 0.1);
  }

});

test("first question removes the previous row; desktop summary precedes full-height track", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await start(page);
  await expect(page.locator(".question-stage > .question-peek-boundary")).toHaveCount(0);
  await expect(page.locator(".question-stage > :first-child")).toHaveClass("active-question-region");
  const toolbar = (await page.locator(".question-toolbar").boundingBox())!;
  const card = (await page.locator(".question-card").boundingBox())!;
  expect(card.y - toolbar.y - toolbar.height).toBeLessThanOrEqual(24);
  await jump(page, 1);
  const previous = (await page.locator(".question-peek.previous").boundingBox())!;
  const summary = (await page.locator(".progress-summary").boundingBox())!;
  expect(Math.abs((summary.y + summary.height / 2) - (previous.y + previous.height / 2))).toBeLessThan(4);
  const track = (await page.locator(".desktop-progress .progress-track").boundingBox())!;
  const active = (await page.locator(".question-card").boundingBox())!;
  expect(track.y).toBeCloseTo(active.y, 0);
  expect(track.height).toBeCloseTo(active.height, 0);
});

for (const width of [320, 390]) test("mobile card track stays with a centered card and offers touch and keyboard navigation at " + width, async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await start(page);
  await page.locator(".question-card").evaluate(el => el.scrollIntoView({ block: "center" }));
  const surface = page.getByRole("button", { name: "Explore question track" });
  const box = (await surface.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThan(250);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(844);
  const positions = await page.locator(".mobile-rail-marker").evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { y: r.y, bottom: r.bottom }; }));
  expect(positions).toHaveLength(questions.length);
  for (let i = 0; i < positions.length; i++) {
    expect(positions[i]!.y).toBeGreaterThanOrEqual(box.y);
    expect(positions[i]!.bottom).toBeLessThanOrEqual(box.y + box.height);
    if (i) expect(positions[i]!.y).toBeGreaterThanOrEqual(positions[i - 1]!.bottom - 0.1);
  }
  const card = (await page.locator(".question-card").boundingBox())!;
  const glyph = (await page.locator(".mobile-rail-marker .progress-glyph").first().boundingBox())!;
  expect(glyph.x - (card.x + card.width)).toBeCloseTo(11, 0);
  expect(width - glyph.x - glyph.width).toBeCloseTo(11, 0);
  expect(card.width).toBeGreaterThanOrEqual(width - 48);
  const readableWidth = await page.locator(".question-card").evaluate(el => el.clientWidth - parseFloat(getComputedStyle(el).paddingLeft) - parseFloat(getComputedStyle(el).paddingRight));
  expect(readableWidth).toBeGreaterThanOrEqual(width - 90);
  const touch = await context.newCDPSession(page);
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
  const magnified = page.locator('.mobile-rail-marker[data-proximity="active"]');
  await expect(magnified).toHaveCount(1);
  await expect(magnified.locator(".progress-glyph")).toHaveCSS("transform", "matrix(5, 0, 0, 5, 12, 0)");
  await expect(magnified.locator(".progress-glyph")).toHaveCSS("transition-duration", "0s");
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  const popout = page.getByRole("group", { name: "Choose a nearby question" });
  await expect(popout.getByRole("button")).toHaveCount(5);
  // Tapping an exposed answer beneath the popout only dismisses it.
  const outsideAnswer = page.getByRole("radio").last();
  await outsideAnswer.tap();
  await expect(popout).toHaveCount(0);
  await expect(outsideAnswer).not.toBeChecked();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[0]!.title);
  const reopenedBox = (await surface.boundingBox())!;
  await page.touchscreen.tap(reopenedBox.x + reopenedBox.width / 2, reopenedBox.y + reopenedBox.height / 2);
  await expect(popout.getByRole("button")).toHaveCount(5);
  const choice = page.getByRole("button", { name: /^Go to question 29:/ });
  expect((await choice.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("mobile-card-track.png"), fullPage: true });
  const unpressed = await choice.evaluate(el => getComputedStyle(el).backgroundColor);
  const choiceBox = (await choice.boundingBox())!;
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: choiceBox.x + choiceBox.width / 2, y: choiceBox.y + choiceBox.height / 2 }] });
  await expect(choice).toHaveAttribute("data-pressed", "true");
  expect(await choice.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(unpressed);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[0]!.title);
  // Keep the viewport fixed during an active touch; full-page capture can retarget release.
  await page.screenshot({ path: testInfo.outputPath("mobile-pressed-choice.png"), fullPage: false });
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[28]!.title);
  await expect(page.getByRole("group", { name: "Choose a nearby question" })).toHaveCount(0);
  await surface.focus();
  await page.keyboard.press("End");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(surface).toBeFocused();
  await expect(page.getByRole("group", { name: "Choose a nearby question" })).toHaveCount(0);
  await page.keyboard.press("End");
  await page.getByRole("button", { name: new RegExp("^Go to question " + questions.length + ":") }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions.at(-1)!.title);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("desktop navigator choices show hover and keyboard focus while retaining current identity", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await start(page);
  await page.getByRole("button", { name: /^Question 1:/ }).focus();
  const current = page.getByRole("button", { name: /^Go to question 1:/ });
  const adjacent = page.getByRole("button", { name: /^Go to question 2:/ });
  const normal = await adjacent.evaluate(el => getComputedStyle(el).backgroundColor);
  const currentMark = await current.evaluate(el => getComputedStyle(el).boxShadow);
  await adjacent.hover();
  expect(await adjacent.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(normal);
  await expect(adjacent).toHaveCSS("text-decoration-line", "underline");
  expect(await current.evaluate(el => getComputedStyle(el).boxShadow)).toBe(currentMark);
  expect(currentMark).not.toBe("none");
  expect(await adjacent.evaluate(el => getComputedStyle(el).boxShadow)).toBe("none");
  await adjacent.focus();
  await page.keyboard.press("Tab");
  const third = page.getByRole("button", { name: /^Go to question 3:/ });
  await expect(third).toBeFocused();
  expect(await third.evaluate(el => el.matches(":focus-visible"))).toBe(true);
  await expect(third).toHaveCSS("outline-style", "solid");
  await expect(third).toHaveCSS("text-decoration-line", "underline");
  await page.screenshot({ path: testInfo.outputPath("desktop-choice-feedback.png"), fullPage: true });
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[2]!.title);
});

test("optional additional context survives editing and refresh while old sessions retain answers", async ({ page }) => {
  await start(page);
  await page.getByRole("radio", { name: "No", exact: true }).focus();
  await page.keyboard.press("Space");
  const key = "capstone.assessment.ui-preview.v1";
  await expect.poll(() => page.evaluate(k => JSON.parse(sessionStorage.getItem(k)!).answers["U-001"], key)).toBe("No");
  await page.evaluate(k => {
    const state = JSON.parse(sessionStorage.getItem(k)!); delete state.profile.notes;
    sessionStorage.setItem(k, JSON.stringify(state));
  }, key);
  await page.reload();
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Edit business context" }).click();
  const notes = page.getByRole("textbox", { name: "Additional Context / Requirements (optional)", exact: true });
  await expect(notes).toHaveValue("");
  await expect(notes).toHaveAttribute("maxlength", "1000");
  await notes.fill("Buyer requires traceability.\nLimited implementation budget.");
  await page.reload();
  await expect(notes).toHaveValue("Buyer requires traceability.\nLimited implementation budget.");
  await notes.fill("Updated buyer requirement");
  await page.getByRole("button", { name: "Continue to input method" }).click();
  await page.getByRole("button", { name: "Start questionnaire" }).click();
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.reload();
  await page.getByRole("button", { name: "Edit business context" }).click();
  await expect(notes).toHaveValue("Updated buyer requirement");
  await notes.fill("");
  await page.reload();
  await expect(notes).toHaveValue("");
});

for(const reducedMotion of ["reduce","no-preference"] as const)test("selection stays confirmed before slower advance: "+reducedMotion,async({page})=>{
 await page.emulateMedia({reducedMotion});await start(page);await page.clock.install();await page.getByRole("radio",{name:"Yes",exact:true}).click();
 await expect(page.getByText("Selected: Yes",{exact:true})).toBeVisible();await expect(page.getByRole("radio",{name:"Yes",exact:true})).toBeChecked();await page.clock.fastForward(600);await expect(page.getByRole("heading",{level:1})).toHaveText(questions[0]!.title);
 await page.clock.fastForward(250);await expect(page.getByRole("heading",{level:1})).toHaveText(questions[1]!.title);expect(await page.locator(".active-question-region > .question-card").evaluate(el=>getComputedStyle(el).animationName)).toBe(reducedMotion==="reduce"?"none":"wheel-arrive");
});


test("selected answers can be cleared and Skip deletes stored answers across refresh", async ({page}) => {
 await start(page);
 const no=page.getByRole("radio",{name:"No",exact:true});
 await no.focus();await page.keyboard.press("Space");await expect(no).toBeChecked();
 await no.click();await expect(no).not.toBeChecked();
 await page.reload();await expect(no).not.toBeChecked();
 await no.focus();await page.keyboard.press("Space");await expect(no).toBeChecked();
 await page.getByRole("button",{name:"Skip",exact:true}).click();
 await jump(page,0);await expect(no).not.toBeChecked();
 await page.reload();await expect(no).not.toBeChecked();
 const state=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!));
 expect(state.answers).not.toHaveProperty(questions[0]!.id);expect(state.skipped).toContain(questions[0]!.id);
});
