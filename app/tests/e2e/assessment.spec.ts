import { mockSuccessfulRecommendations } from "../helpers/recommendation-fixture";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MobileQuestionRail, ProgressNavigator, type ProgressItem } from "../../src/features/assessment/progress-navigator";

import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog, selectedQuestions } from "../../src/application/assessment-catalog";
const catalog = assessmentCatalog(loadCanonicalConfig().config);
const profile = { industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarket: "EU" };
const questions = selectedQuestions(catalog, profile);
const numericIndex = questions.findIndex(q => q.kind === "numeric");
const percentIndex = questions.findIndex(q => q.kind === "percent");
const numeric = questions[numericIndex]!;
const numericLabel = "Your answer" + (numeric.unit ? " (" + numeric.unit + ")" : "");
async function jump(page: Page, index: number) {
 if(await page.locator('.desktop-progress').isVisible()){await page.getByRole('button',{name:new RegExp('^Question '+(index+1)+':')}).click();return;}
 const rail=page.getByRole('button',{name:'Explore question track'});await rail.focus();await rail.press('Home');
 for(let i=0;i<index;i++)await rail.press('ArrowDown');
 await page.getByRole('button',{name:new RegExp('^Go to question '+(index+1)+':')}).click();
}
async function fillSetup(page: Page, overrides: Record<string, string> = {}) {
  const values = { companyName: "Example workshop", country: "China", ...profile, targetBuyer: "Enterprise", businessGoal: "Prepare for procurement questionnaires", ...overrides };
  for (const [name, value] of Object.entries(values)) {
    const field = page.locator('[name="' + name + '"]');
    if (name === "targetMarket") { for (const market of value.split(";")) await page.getByRole("checkbox", { name: market, exact: true }).check(); }
    else if (name === "country") { await field.fill(value); await page.getByRole("option",{name:value,exact:true}).click(); }
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
    await page.getByRole("link", { name: "Start your assessment" }).first().click();
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
    await page.mouse.move(0, 0);
    const currentMarker = width >= 1024
      ? page.locator('.desktop-progress [aria-current="step"] .progress-glyph')
      : page.locator('.mobile-rail-marker[data-current="true"] .progress-glyph');
    await expect(currentMarker).toBeVisible();
    await expect(currentMarker).toHaveCSS("rotate", "none");
    const brackets = page.locator(width >= 1024 ? '.desktop-progress [aria-current="step"] .progress-current-brackets' : '.mobile-rail-marker[data-current="true"] .progress-current-brackets');
    await expect(brackets).toBeVisible();
    expect(await brackets.evaluate(el => getComputedStyle(el, "::before").borderLeftColor)).toBe("rgb(166, 75, 32)");
    // Normal markers remain distinct; owner restored the original magnified hover presentation.
    const neighbors = await page.locator(width >= 1024 ? ".desktop-progress .progress-glyph" : ".mobile-rail-marker .progress-glyph").evaluateAll(nodes => nodes.slice(0, 3).map(el => { const r=el.getBoundingClientRect(); return {top:r.top,bottom:r.bottom}; }));
    for (let i=1;i<neighbors.length;i++) expect(neighbors[i]!.top).toBeGreaterThanOrEqual(neighbors[i-1]!.bottom);
    if (width >= 1024) await page.getByRole("button", { name: /^Question 2:/ }).hover();
    else await page.getByRole("button", { name: "Explore question track" }).focus();
    const attachment = await brackets.evaluate(el => {
      const b=el.getBoundingClientRect(), g=el.parentElement!.querySelector(".progress-glyph")!.getBoundingClientRect();
      return { dx: Math.abs(b.x+b.width/2-g.x-g.width/2), dy: Math.abs(b.y+b.height/2-g.y-g.height/2) };
    });
    expect(attachment.dx).toBeLessThan(1);
    expect(attachment.dy).toBeLessThan(1);
    const cardOverflow = await page.locator(".question-card").evaluate(el => ({client:el.clientHeight,scroll:el.scrollHeight,overflow:getComputedStyle(el).overflowY}));
    expect(cardOverflow.scroll).toBe(cardOverflow.client);
    expect(cardOverflow.overflow).toBe("visible");
    for (const option of await page.getByRole("radio").all()) { await option.scrollIntoViewIfNeeded(); await expect(option).toBeInViewport(); }
    await page.mouse.move(0, 0);
    await page.screenshot({ path: testInfo.outputPath("questionnaire.png"), fullPage: true });
    await jump(page,2);
    await expect(page.locator(".category-label")).toContainText(questions[2]!.category);
    if(width<1024){await page.getByRole('button',{name:'Explore question track'}).focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');}
    await expect(page.getByRole("button", { name: width<1024 ? /^Go to question 3:/ : /^Question 3:/ })).toHaveAttribute("aria-current", "step");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    if (width < 1024) await page.keyboard.press("Escape");
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
  await page.getByRole("button", { name: /^Skipped \/ unanswered/ }).click();
  await expect(page.locator(".review-row")).toHaveCount(questions.length - 2);
  await expect(page.getByRole("button", { name: "1. " + questions[0]!.title, exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: (numericIndex + 1) + ". " + questions[numericIndex]!.title, exact: true })).toHaveCount(0);
  await expect(page.locator(".review-row").filter({ hasText: questions[1]!.title })).toContainText("Unanswered · skipped");
  await page.getByRole("button", { name: "2. " + questions[1]!.title, exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(questions[1]!.title);
  await page.getByRole("button", { name: "Review all answers" }).click();
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
  await jump(page,numericIndex);
  await expect(page.getByLabel(numericLabel, { exact: true })).toBeVisible();
  await expect(page.getByRole("button",{name:"Explore question track"})).toHaveAttribute("aria-expanded","false");
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
  // Browser layout uses fractional CSS pixels; compare the visible pixel edge.
  expect(Math.round(viewport.bottom)).toBeLessThanOrEqual(viewport.height);
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
  expect(rail!.height).toBeCloseTo((await page.locator(".question-region").boundingBox())!.height, 0);
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
  const mobileMarkup=renderToStaticMarkup(createElement(MobileQuestionRail,{items,onSelect:()=>{}}));
  await page.setContent('<!doctype html><html lang="en"><head><title>Navigator fixture</title>' + styles + '</head><body><main class="page-container"><h1 class="text-subheading">50-question navigation fixture</h1><div class="assessment-grid">' + markup + '<section class="question-region"><div class="question-toolbar">Question fixture</div><div class="question-stage"><div class="question-peek-boundary">Previous</div><article class="question-card" style="min-height:640px"><h2>Active question fixture</h2></article><div class="question-peek-boundary">Next</div>'+mobileMarkup+'</div></section></div></main></body></html>');
  await page.locator("html").evaluate((element, className) => { element.setAttribute("class", className); }, fontClass);
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator(".desktop-progress .progress-track");
  const metrics = await track.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, height: box.height, client: element.clientHeight, scroll: element.scrollHeight, overflow: getComputedStyle(element).overflowY };
  });
  expect(metrics.height).toBeGreaterThan(400);
  expect(metrics.height).toBeCloseTo((await page.locator(".question-region").boundingBox())!.height, 0);
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
  expect((await page.locator(".desktop-progress .progress-track").boundingBox())!.height).toBeCloseTo((await page.locator(".question-region").boundingBox())!.height, 0);
  await expect(page.getByRole("button", { name: /^Question 50:/ })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("all-50-positions.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".mobile-rail-marker").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".mobile-rail-marker").last()).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

for (const width of [1440, 390]) {
  test("controlled setup and two ordered market chips at " + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/assessment");
    await expect(page.getByRole("textbox")).toHaveCount(3);
    await expect(page.getByRole("textbox", { name: "Additional Context / Requirements (optional)", exact: true })).toBeVisible();
    await expect(page.getByRole("combobox")).toHaveCount(6);
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
test("real 64-question rail tracks available question stage without scrolling", async ({ page }, testInfo) => {
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
    const card = (await page.locator(".question-region").boundingBox())!;
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
    return (await page.locator(".question-card").boundingBox())!.height;
  }
  const first = await checkGeometry();
  await jump(page, 1); // Natural card height accommodates different option counts.
  const second = await checkGeometry();
  expect(first).toBeGreaterThan(0);
  expect(second).toBeGreaterThan(0);
  const overflow = await page.locator(".question-card").evaluate(el => ({client:el.clientHeight,scroll:el.scrollHeight}));
  expect(overflow.scroll).toBe(overflow.client);
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
  const previous = (await page.locator(".question-toolbar").boundingBox())!;
  const summary = (await page.locator(".progress-summary").boundingBox())!;
  expect(Math.abs((summary.y + summary.height / 2) - (previous.y + previous.height / 2))).toBeLessThan(4);
  const track = (await page.locator(".desktop-progress .progress-track").boundingBox())!;
  const active = (await page.locator(".question-region").boundingBox())!;
  expect(track.y).toBeCloseTo(active.y, 0);
  expect(track.height).toBeCloseTo(active.height, 0);
});

for (const width of [320, 390]) test("mobile card track stays with a centered card and offers touch and keyboard navigation at " + width, async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await start(page);
  const centered = await page.locator(".active-question-region").evaluate(el => {
    const r=el.getBoundingClientRect(), top=document.querySelector(".stage-navigation")!.getBoundingClientRect().bottom+12;
    return {actual:r.top,expected:top+Math.max(0,(innerHeight-12-top-r.height)/2)};
  });
  expect(Math.abs(centered.actual-centered.expected)).toBeLessThan(3);
  const stages=page.getByRole("navigation",{name:"Assessment stages"}).getByRole("button");
  await expect(stages).toHaveCount(5);
  for(const stage of await stages.all()) {const r=(await stage.boundingBox())!;expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);expect(r.height).toBeGreaterThanOrEqual(44);}
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
  const glyph = (await page.locator('.mobile-rail-marker:not([data-current="true"]) .progress-glyph').first().boundingBox())!;
  expect(glyph.x - (card.x + card.width)).toBeCloseTo(11, 0);
  expect(width - glyph.x - glyph.width).toBeCloseTo(11, 0);
  expect(card.width).toBeGreaterThanOrEqual(width - 48);
  const readableWidth = await page.locator(".question-card").evaluate(el => el.clientWidth - parseFloat(getComputedStyle(el).paddingLeft) - parseFloat(getComputedStyle(el).paddingRight));
  expect(readableWidth).toBeGreaterThanOrEqual(width - 90);
  const touch = await context.newCDPSession(page);
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
  const magnified = page.locator('.mobile-rail-marker[data-proximity="active"]');
  await expect(magnified).toHaveCount(1);
  await expect(magnified.locator(".progress-symbol")).toHaveCSS("transform", "matrix(3, 0, 0, 3, 12, 0)");
  await expect(magnified.locator(".progress-symbol")).toHaveCSS("transition-duration", "0s");
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  const popout = page.getByRole("group", { name: "Choose a nearby question" });
  await expect(popout.getByRole("button")).toHaveCount(5);
  // Tapping an exposed answer beneath the popout only dismisses it.
  const outsideAnswer = page.getByRole("radio").last();
  await page.screenshot({ path: testInfo.outputPath("mobile-open-before-dismiss.png"), fullPage: false });
  // Explore the first neighborhood so an answer is exposed even at 320px.
  await surface.press('Home');
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
  const currentMark = await current.evaluate(el => getComputedStyle(el).borderLeftWidth);
  await adjacent.hover();
  expect(await adjacent.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(normal);
  await expect(adjacent).toHaveCSS("text-decoration-line", "underline");
  expect(await current.evaluate(el => getComputedStyle(el).borderLeftWidth)).toBe(currentMark);
  expect(currentMark).toBe("3px");
  expect(await adjacent.evaluate(el => getComputedStyle(el).borderLeftWidth)).toBe("0px");
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

test("Country search distinguishes a query from selection and supports browsing and keyboard choice",async({page})=>{
 await page.goto("/assessment"); await fillSetup(page);
 const country=page.getByRole("combobox",{name:"Country (optional)",exact:true});
 await page.getByRole("button",{name:"Browse all countries"}).click();
 await expect(page.getByRole("listbox",{name:"Countries and territories"}).getByRole("option")).toHaveCount(249);
 await country.fill("Jap"); await expect(page.getByRole("option",{name:"Japan",exact:true})).toBeVisible();
 await page.getByRole("button",{name:"Continue to input method"}).click();
 await expect(page.getByText("Choose a country from the search results, or clear this optional field.",{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).profile.country)).toBe("China");
 await country.fill("Japan"); await country.press("ArrowDown"); await country.press("Enter");
 await page.getByRole("button",{name:"Continue to input method"}).click();
 await expect(page.getByRole("radio",{name:/Use emissions calculator/})).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Start questionnaire",exact:true})).toBeVisible();
 await page.reload();expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).profile.country)).toBe("Japan");
});

import { goldenCases } from "../helpers/legacy-scoring";
import { scoreAssessment } from "../../src/domain/scoring/score-assessment";

test("levers use approved Golden ranking, combined scenario, keyboard and reset without changing saved assessment", async ({ page }, testInfo) => {
  await page.setViewportSize({width:1440,height:768});
  const fixture = goldenCases[0]!;
  const answers = Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)]));
  const session = { version: 3, configVersion: catalog.version, phase: "review", inputMethod: "manual", activeId: "U-001", progress: 4,
    profile: { companyName: fixture.profile.company_name, industry: fixture.profile.industry, subindustry: fixture.profile.subindustry,
      companySize: "251 - 500", country: fixture.profile.country, location: fixture.profile.company_location,
      targetMarket: fixture.profile.target_market_region.join(";"), targetBuyer: fixture.profile.target_buyer, businessGoal: fixture.profile.business_goal, notes: "" },
    answers, skipped: [] };
  let providerPosts = 0;
  page.on("request", request => { if (request.url().includes("/api/assessment-recommendations") && request.method() === "POST") providerPosts++; });
  await page.addInitScript(s => { sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)); }, session);
  await page.goto("/results");
  const section = page.getByRole("region", { name: "Explore your improvement levers" });
  await expect(section.getByRole("slider")).toHaveCount(5);
  const saved = await page.evaluate(() => sessionStorage.getItem("capstone.assessment.ui-preview.v1"));
  const first = section.getByRole("slider").first();
  await expect(first).toHaveAttribute("aria-valuetext", "No");
  await first.focus(); await page.keyboard.press("End");
  await expect(first).toHaveAttribute("aria-valuetext", "Yes");
  await section.getByRole("textbox", { name: "U-035 scenario value" }).fill("8");
  const expected = scoreAssessment(loadCanonicalConfig().config, fixture.profile, { ...answers, "U-034": "Yes", "U-035": "8" });
  const weighted = section.getByRole("row").filter({ has: page.getByRole("rowheader", { name: "Industry-weighted overall", exact: true }) });
  await section.getByText("Full score comparison",{exact:true}).click();
  await expect(weighted.getByRole("cell").nth(1)).toHaveText(expected.weightedOverall!.toFixed(2));
  await section.getByText("Full score comparison",{exact:true}).click();
  const active=section.getByRole("textbox",{name:"U-035 scenario value"});
  await active.scrollIntoViewIfNeeded();
  await expect(section.locator(".lever-headline")).toBeInViewport();
  await expect(active).toBeInViewport();
  expect(await page.evaluate(()=>visualViewport?.scale)).toBe(1);
  const marker=section.locator(".lever-card").filter({has:page.getByRole("textbox",{name:"U-035 scenario value"})}).locator(".lever-actual-marker");
  await expect(marker).toHaveText("Actual");
  await page.screenshot({path:testInfo.outputPath("levers-desktop-feedback.png")});
  await mockSuccessfulRecommendations(page);
  await page.evaluate(()=>window.dispatchEvent(new Event("focus")));
  await page.getByRole("button",{name:"Generate recommendations",exact:true}).click();
  await expect(page.getByRole("button",{name:"Regenerate recommendations"})).toBeVisible();

  const downloadEvent=page.waitForEvent("download");
  await section.getByRole("button",{name:"Download report"}).filter({visible:true}).click();
  await section.getByRole("button",{name:"HTML",exact:true}).click();
  const download=await downloadEvent;
  const stream=await download.createReadStream();let report="";
  for await(const chunk of stream!)report+=chunk.toString();
  expect(report).toContain('id="hypothetical-levers"');
  expect(report).toContain(expected.weightedOverall!.toFixed(2));
  expect(report).toContain("The actual assessment and recommendations above are unchanged");
  await section.getByText("Full score comparison",{exact:true}).click();
  expect(await page.evaluate(() => sessionStorage.getItem("capstone.assessment.ui-preview.v1"))).toBe(saved);
  await section.getByRole("button", { name: "Reset to actual answers" }).click();
  await expect(first).toHaveAttribute("aria-valuetext", "No");
  await expect(section.getByRole("textbox", { name: "U-035 scenario value" })).toHaveValue("0");
  await expect(weighted.getByRole("cell").nth(1)).toHaveText("24.43");
  expect((await new AxeBuilder({ page }).include("#improvement-levers").analyze()).violations).toEqual([]);
  await section.getByText("Full score comparison",{exact:true}).click();
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(first).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await first.scrollIntoViewIfNeeded();
  await expect(section.locator(".lever-headline")).toBeInViewport();
  await expect(first).toBeInViewport();
  await page.screenshot({path:testInfo.outputPath("levers-mobile-feedback.png")});
  const lastSlider=section.getByRole("slider").last();
  await lastSlider.scrollIntoViewIfNeeded();
  await expect(section.locator(".lever-headline")).toBeInViewport();
  await expect(lastSlider).toBeInViewport();
  await page.screenshot({path:testInfo.outputPath("levers-mobile-sticky.png")});
  await page.reload();
  await expect(section.getByRole("slider").first()).toHaveAttribute("aria-valuetext", "No");
  expect(providerPosts).toBe(1);
});

test("levers percentage entry preserves exact actual value and reset", async ({ page }) => {
  await page.route("**/api/assessment-recommendations", route => route.request().method() === "POST" ? route.abort() : route.continue());
  const fixture = goldenCases[0]!;
  const session = { version: 3, configVersion: catalog.version, phase: "review", inputMethod: "manual", activeId: "U-001", progress: 4,
    profile: { companyName: fixture.profile.company_name, industry: fixture.profile.industry, subindustry: fixture.profile.subindustry,
      companySize: "251 - 500", country: fixture.profile.country, location: fixture.profile.company_location,
      targetMarket: fixture.profile.target_market_region.join(";"), targetBuyer: fixture.profile.target_buyer, businessGoal: fixture.profile.business_goal, notes: "" },
    answers: { "U-026": "12.3456789", "U-031": "33.3333333333" }, skipped: [] };
  await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), session);
  await page.goto("/results");
  const section = page.getByRole("region", { name: "Explore your improvement levers" });
  const value = section.getByRole("textbox", { name: "U-026 scenario value" });
  await expect(value).toHaveValue("12.35");
  const slider = section.getByRole("slider", { name: /What percentage of your energy/ });
  await slider.focus(); await page.keyboard.press("ArrowRight");
  await expect(value).toHaveValue("13.35");
  await expect(slider).toHaveValue("13.3456789");
  await value.fill("15.123456789");
  await expect(slider).toHaveAttribute("aria-valuetext", "15.12 %");
  const card=section.locator(".lever-card").filter({has:page.getByRole("textbox",{name:"U-026 scenario value"})});
  const beforeMarker=await card.locator(".lever-track").getAttribute("style");
  await value.fill("5");
  await expect(card.getByText("Lower than actual",{exact:false})).toHaveCount(0);
  expect((await card.locator(".lever-track").getAttribute("style"))?.split(";")[0]).toBe(beforeMarker?.split(";")[0]);
  await value.fill("101");
  await expect(section.getByRole("alert").first()).toContainText("0 to 100");
  await section.getByRole("button", { name: "Reset to actual answers" }).click();
  await expect(value).toHaveValue("12.35");
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers)).toEqual(session.answers);
});

for (const viewport of [{width:320,height:740},{width:390,height:844},{width:844,height:390},{width:768,height:1024}]) test("M7.5 touch labels, readable options and numeric persistence "+viewport.width, async ({browser,baseURL},info)=>{
 const context=await browser.newContext({viewport,hasTouch:true,isMobile:true,baseURL,reducedMotion:"reduce"});const page=await context.newPage();
 await start(page);
 await page.locator('.choice-option span').filter({hasText:/^Yes$/}).tap();
 await expect(page.getByRole('heading',{level:1})).toHaveText(questions[1]!.title);
 await page.waitForTimeout(1000);await expect(page.getByRole('heading',{level:1})).toHaveText(questions[1]!.title);
 const choice=page.locator('.choice-option span').last();const answer=await choice.innerText();await choice.tap();
 await expect(page.getByRole('heading',{level:1})).toHaveText(questions[2]!.title);
 const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!));expect(stored.answers[questions[1]!.id]).toBe(answer);
 for(const index of [numericIndex,percentIndex].filter(i=>i>=0)){
 const q=questions[index]!;await jump(page,index);
 await page.getByRole('textbox',{name:/Your answer/}).fill('3');await page.waitForTimeout(1000);await expect(page.getByRole('heading',{level:1})).toHaveText(q.title);
 await page.getByRole('button',{name:'Continue',exact:true}).tap();await page.reload();
 expect(await page.evaluate(id=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!).answers[id],q.id)).toBe('3');
 }
 const longest=questions.reduce((best,q,i)=>q.title.length+('options' in q?q.options.join('').length:0)>questions[best]!.title.length+('options' in questions[best]!?(questions[best] as {options:readonly string[]}).options.join('').length:0)?i:best,0);
 await jump(page,longest);
 await page.evaluate(()=>{document.documentElement.style.fontSize='125%';});
 const card=page.locator('.question-card');expect(await card.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 for(const option of await page.getByRole('radio').all()){await option.scrollIntoViewIfNeeded();await expect(option).toBeInViewport();}
 await page.getByRole('heading',{level:1}).evaluate(el=>el.scrollIntoView({block:'start'}));
 const headingBox=(await page.getByRole('heading',{level:1}).boundingBox())!,navBox=(await page.getByRole('navigation',{name:'Assessment stages'}).boundingBox())!;expect(headingBox.y).toBeGreaterThanOrEqual(navBox.y+navBox.height);
 await page.screenshot({path:info.outputPath('mobile-long-question.png'),fullPage:false});
 await context.close();
});

for(const width of [280,320,390])test("M7.5 exact rail touch and drag containment "+width,async({browser,baseURL},info)=>{
 const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,baseURL,reducedMotion:"reduce"});const page=await context.newPage();await start(page);
 await page.getByRole('button',{name:'Review all answers',exact:true}).click();await page.getByRole('button',{name:'3. '+questions[2]!.title,exact:true}).click();
 await page.getByRole('radio',{name:'Yes',exact:true}).focus();await page.keyboard.press('Space');
 const card=page.locator('.question-card'),rail=page.locator('.mobile-rail-markers');
 const bounds=await card.boundingBox(),ticks=await rail.boundingBox();expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width);expect(await card.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 const markerBox=(await page.locator('.mobile-rail-marker .progress-glyph').first().boundingBox())!;expect(bounds!.x+bounds!.width).toBeLessThan(markerBox.x);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const glyph=page.locator('.mobile-rail-marker[data-current="true"] .progress-glyph');await glyph.scrollIntoViewIfNeeded();
 const g=(await glyph.boundingBox())!;const touch=await context.newCDPSession(page);const snapshot=await page.evaluate(()=>sessionStorage.getItem('capstone.assessment.ui-preview.v1'));
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:g.x+g.width/2,y:g.y+g.height/2}]});
 await expect(page.locator('.mobile-rail-marker').nth(2)).toHaveAttribute('data-proximity','active');
 let previousPopoutTop=0;
 await expect(page.locator('.mobile-progress')).toHaveCount(0);
 for(const index of [10,20,questions.length-2]){
 const slot=(await page.locator('.mobile-rail-marker').nth(index).boundingBox())!;
 await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:g.x+g.width/2,y:slot.y+slot.height/2}]});
 await expect(page.locator('.mobile-rail-marker').nth(index)).toHaveAttribute('data-proximity','active');
 const panel=page.getByRole('group',{name:'Choose a nearby question'});const panelBox=(await panel.boundingBox())!;
 expect(panelBox.y).toBeGreaterThanOrEqual(7);expect(panelBox.y+panelBox.height).toBeLessThanOrEqual(845);
 const inspected=panel.locator('[data-inspected="true"]');await expect(inspected).toHaveAttribute('aria-label',new RegExp('^Go to question '+(index+1)+':'));
 await expect(inspected).toHaveCSS('background-color','rgb(227, 239, 238)');
 if(index===20){expect(panelBox.y).toBeGreaterThan(previousPopoutTop);await page.screenshot({path:info.outputPath('drag-middle.png')});}previousPopoutTop=panelBox.y;
 }
 await page.screenshot({path:info.outputPath('drag-neighborhood.png')});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect(page.getByRole('group',{name:'Choose a nearby question'})).toBeVisible();expect(await page.evaluate(()=>sessionStorage.getItem('capstone.assessment.ui-preview.v1'))).toBe(snapshot);
 await page.getByRole('button',{name:new RegExp('^Go to question '+(questions.length-1)+':')}).tap();await expect(page.getByRole('heading',{level:1})).toHaveText(questions.at(-2)!.title);
 await page.getByRole('button',{name:'Review all answers',exact:true}).click();await page.getByRole('button',{name:'3. '+questions[2]!.title,exact:true}).click();
 await page.screenshot({path:info.outputPath('card-containment.png'),fullPage:true});
 expect(ticks!.width).toBeGreaterThan(0);await context.close();
});

import portraitMapping from '../../config/portraits/portrait_family_mapping_v0.2.json' with { type: 'json' };
import { calculatePortrait as calculatePortraitBase, portraitMaturity, archetypes } from '../../src/application/sustainability-portrait';
import { withPortraitPotential } from '../../src/application/portrait-potential';
const calculatePortrait: typeof calculatePortraitBase = (score, mapping, ids) => calculatePortraitBase(withPortraitPotential(loadCanonicalConfig().config, score), mapping, ids);
import { selectPortraitSubtype } from '../../src/application/portrait-subtype';
for (const example of ['golden-original', 'paired-golden-03', 'paired-low-credit-golden-01'] as const) for (const width of [1440, 390]) test('portrait ' + example + ' with accessible disclosure at ' + width + 'px', async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 1000 });
  const fixture = goldenCases[example === 'paired-golden-03' ? 2 : 0]!;
  const answers = Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? '' : String(a.answer)]));
  // Explicit review variation of the approved Golden01, not the owner's saved snapshot.
  if (example === 'paired-low-credit-golden-01') {
    answers['U-009'] = 'Yes';

  }
  const expected = calculatePortrait(scoreAssessment(loadCanonicalConfig().config, fixture.profile, answers), portraitMapping)!;
  const pair = selectPortraitSubtype(expected);
  if (example === 'paired-golden-03') expect(pair?.definition.subtype_id).toBe('A-CO-ME');
  if (example === 'paired-low-credit-golden-01') { expect(expected.name).toBe('Anchor'); expect(pair).not.toBeNull(); expect(pair!.second.mean).toBeLessThan(.5); }
  const session = { version: 3, configVersion: catalog.version, phase: 'review', inputMethod: 'manual', activeId: 'U-001', progress: 4,
    profile: { companyName: fixture.profile.company_name, industry: fixture.profile.industry, subindustry: fixture.profile.subindustry,
      companySize: fixture.profile.employee_band.replace(/\s*-\s*/g, ' - '), country: fixture.profile.country, location: fixture.profile.company_location,
      targetMarket: fixture.profile.target_market_region.join(';'), targetBuyer: fixture.profile.target_buyer, businessGoal: fixture.profile.business_goal, notes: '' }, answers, skipped: [] };
  let providerPosts = 0;
  page.on('request', r => { if (r.url().includes('/api/assessment-recommendations') && r.method() === 'POST') providerPosts++; });
  await page.addInitScript(s => sessionStorage.setItem('capstone.assessment.ui-preview.v1', JSON.stringify(s)), session);
  await page.goto('/results');
  const portrait = page.locator('.portrait-card');
  await expect(portrait).toHaveAttribute('data-portrait', expected.name);
  if (pair) {
    await expect(portrait).toHaveAttribute('data-subtype', pair.definition.subtype_id);
    await expect(portrait.getByRole('heading', { level: 3, name: pair.definition.name, exact: true })).toHaveText(pair.definition.name);
    await expect(portrait.getByLabel('Leading approach families')).toContainText('Commit · Anchor');
    await expect(portrait.getByLabel('Leading approach families')).toContainText('Measure · Chronicler');
    await expect(portrait.locator('.portrait-role-art')).toHaveAttribute('src', '/portraits/roles/' + pair.definition.artwork.split('/').at(-1));
    for (const item of [{ name: pair.definition.name, value: pair.combined }, { name: archetypes[pair.first.id], value: pair.first.mean! }, { name: archetypes[pair.second.id], value: pair.second.mean! }]) {
      const maturity = portraitMaturity(item.value);
      const group = portrait.getByRole('group', { name: new RegExp(item.name + ' approach development: ' + maturity.label) });
      await expect(group).toBeVisible();
      await expect(group.locator('[data-filled="true"]')).toHaveCount(maturity.dots);
      await expect(group.locator('.portrait-maturity-dots > span')).toHaveCount(3);
    }
    await portrait.locator('.portrait-role-art').scrollIntoViewIfNeeded();
    await expect.poll(() => portrait.locator('.portrait-role-art').evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
  } else {
    await expect(portrait.getByRole('heading', { level: 2 })).toHaveText(expected.name);
    await expect(portrait.getByLabel('Leading approach families')).toHaveCount(0);
  }

  await expect(portrait.getByText('Loading existing actual-answer Levers…')).toHaveCount(0);
  await expect(portrait).toContainText('Input basis: unknown');
  const chart = portrait.getByRole('img', { name: /Approach profile/ });
  await expect(chart).toBeVisible();
  await expect(chart.locator('[data-portrait-shape="filled"]')).toHaveCount(1);
  for (const family of expected.families) {
    await expect(chart).toHaveAccessibleName(new RegExp(family.id + ': ' + Math.round(family.mean! * 100) + '%', 'i'));
    const marker = chart.locator('[data-family="' + family.id + '"] circle');
    const radius = await marker.evaluate(el => Math.hypot(Number(el.getAttribute('cx')) - 180, Number(el.getAttribute('cy')) - 170));
    expect(radius / 103).toBeCloseTo(family.mean!, 8);
  }
  const polygon = await chart.locator('[data-portrait-shape="filled"]').getAttribute('points');
  const vertices = polygon!.split(' ').map(pair => pair.split(',').map(Number));
  for (let i = 0; i < vertices.length; i++) expect(Math.hypot(vertices[i]![0]! - 180, vertices[i]![1]! - 170) / 103).toBeCloseTo(expected.families[i]!.mean!, 8);
  const saved = await page.evaluate(() => sessionStorage.getItem('capstone.assessment.ui-preview.v1'));
  const disclosure = portrait.getByText('Why this archetype?', { exact: false }).first();
  await disclosure.focus(); await page.keyboard.press('Enter');
  await expect(portrait.getByText(/Beta interpretation rules:/)).toBeVisible();
  await expect(portrait.getByText(/there is no one-to-one mapping/)).toBeVisible();
  await expect(portrait.getByText(/Tags are fixed before your answers/)).toBeVisible();
  await expect(portrait.getByText(/Numeric interpretation deferred/)).toContainText(expected.excludedNumeric.length + ' items');
  expect((await new AxeBuilder({ page }).include('.portrait-card').analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await disclosure.click();
  const before = await portrait.innerText();
  const levers = page.getByRole('region', { name: 'Explore your improvement levers' });
  await expect(levers.getByRole('slider')).toHaveCount(5);
  await levers.getByRole('slider').first().focus(); await page.keyboard.press('End');
  await expect(levers.getByRole('slider').first()).toHaveAttribute('aria-valuetext', 'Yes');
  expect(await portrait.innerText()).toBe(before);
  expect(await page.evaluate(() => sessionStorage.getItem('capstone.assessment.ui-preview.v1'))).toBe(saved);
  expect(providerPosts).toBe(0);
  await portrait.scrollIntoViewIfNeeded();
  // Hide only surrounding sticky navigation during the card-only capture; assertions above use the actual UI.
  await page.locator('.portrait-section').screenshot({ path: testInfo.outputPath('portrait-' + example + '-' + width + '.png'), style: '.stage-navigation, .results-navigation { visibility: hidden !important; }' });
  // Reuse this Golden assessment, omitting Commit answers to check missing chart evidence.
  const incompleteAnswers = { ...answers };
  for (const row of portraitMapping.rows.filter(row => row.family === 'commit')) delete incompleteAnswers[row.question_id];
  const partialContext = await page.context().browser()!.newContext({ viewport: { width, height: 1000 } });
  const partialPage = await partialContext.newPage();
  await partialPage.addInitScript(s => sessionStorage.setItem('capstone.assessment.ui-preview.v1', JSON.stringify(s)), { ...session, answers: incompleteAnswers });
  await partialPage.goto(page.url());
  const partialChart = partialPage.locator('.portrait-chart');
  await expect(partialChart.getByRole('img')).toHaveAccessibleName(/Commit: insufficient evidence/);
  await expect(partialChart.locator('[data-portrait-shape="filled"]')).toHaveCount(0);
  await expect(partialChart.locator('[data-family="commit"] circle')).toHaveCount(0);
  await expect(partialChart.locator('[data-family="commit"]')).toContainText('—');
  await expect(partialChart).toContainText('Gaps mean no eligible answers, not zero.');
  await expect(partialPage.locator('.portrait-card [data-family="commit"][data-pair-rank]')).toHaveCount(0);
  await partialContext.close();

});

test("PDF download preserves the saved assessment, HTML option and retryable failure", async ({page}, testInfo) => {
 const {syntheticSession} = await import("../../src/features/preview/fixtures");
 const session = {...syntheticSession(catalog.version), progress:4};
 await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);
 await mockSuccessfulRecommendations(page);
 await page.goto("/results");
 await page.getByRole("button",{name:"Generate recommendations",exact:true}).click();
 await expect(page.getByRole("button",{name:"Regenerate recommendations"})).toBeVisible();
 const button=page.getByRole("button",{name:"Download report",exact:true}).first();
 await expect(button).toBeVisible();
 const before=await page.evaluate(()=>sessionStorage.getItem("capstone.assessment.ui-preview.v1"));
 await page.route("**/api/assessment-report-pdf",r=>r.fulfill({status:503,contentType:"application/json",body:JSON.stringify({error:"PDF generation failed. Please retry, or download the HTML report. Your assessment is unchanged."})}));
 await button.click();await page.getByRole("button",{name:"PDF",exact:true}).click();await expect(page.getByRole("status").filter({hasText:"PDF generation failed"})).toBeVisible();
 await page.unroute("**/api/assessment-report-pdf");
 const event=page.waitForEvent("download");
 await button.click();await page.getByRole("button",{name:"PDF",exact:true}).click();const download=await event;
 expect(download.suggestedFilename()).toBe("mosaic-assessment-report.pdf");
 await download.saveAs(testInfo.outputPath("assessment.pdf"));
 const stream=await download.createReadStream();const chunks:Buffer[]=[];
 for await(const chunk of stream!)chunks.push(Buffer.from(chunk));
 expect(Buffer.concat(chunks).subarray(0,5).toString()).toBe("%PDF-");
 await expect(page.getByRole("status").filter({hasText:"PDF report downloaded."})).toBeVisible();
 await expect(page.getByText(/Print.*Save as PDF/)).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Download report",exact:true}).first()).toBeEnabled();
 expect(await page.evaluate(()=>sessionStorage.getItem("capstone.assessment.ui-preview.v1"))).toBe(before);
 await page.setViewportSize({width:390,height:844});
 await expect(button).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

for(const width of [1440,390])test('Quick prototype preserves shared answers and Full flow at '+width+'px',async({page},testInfo)=>{
 await page.setViewportSize({width,height:1000});
 let paidRequests=0;
 await page.route('**/api/assessment-recommendations',async route=>{paidRequests++;await route.abort();});
 await start(page); // existing Full Setup -> Data Input -> Questions journey
 const first=questions[0]!;
 await page.getByRole('radio',{name:'Yes',exact:true}).check();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.goto('/');await page.getByRole('link',{name:'Start quick assessment',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Tell us about your business.');
 await page.getByRole('button',{name:'Continue to Quick questions'}).click();
 await expect(page.getByRole('navigation',{name:'Assessment stages'}).getByRole('button',{name:/Data Input/})).toHaveCount(0);
 await expect(page.getByText('Quick assessment',{exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!).assessmentProfile?.questionIds.length)).toBe(20);
 const quick=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!));
 expect(quick.assessmentProfile.questionIds).toHaveLength(20);
 const numeric=quick.assessmentProfile.questionIds.indexOf('U-018');expect(numeric).toBeGreaterThanOrEqual(0);
 await jump(page,numeric);
 await page.locator('#answer').fill('4');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:/^3\. Review$/}).click();
 await expect(page.getByRole('button',{name:'All answers (20)',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'View Quick subset scores',exact:true}).click();
 await page.getByRole('button',{name:'View Quick subset scores anyway',exact:true}).click();
 await expect(page).toHaveURL(/\/quick-results$/);
 await expect(page.getByRole('heading',{name:'Quick assessment results',exact:true})).toBeVisible();
 await expect(page.getByText(/of 20 Quick questions answered/)).toBeVisible();
 await expect(page.getByText(/not directly comparable with Full assessment scores/)).toBeVisible();
 expect(paidRequests).toBe(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:testInfo.outputPath('quick-results.png'),fullPage:true});
 await page.reload();await expect(page.getByText(/of 20 Quick questions answered/)).toBeVisible();
 await page.getByRole('button',{name:'Continue to Full assessment',exact:true}).click();
 await expect(page).toHaveURL(/\/assessment$/);
 await expect(page.getByRole('navigation',{name:'Assessment stages'}).getByRole('button',{name:/Data Input/})).toBeVisible();
 const full=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!));
 expect(full.assessmentProfile).toBeUndefined();expect(full.answers[first.id]).toBe('Yes');expect(full.answers['U-018']).toBe('4');
 await page.getByRole('button',{name:/^4\. Review$/}).click();
 await expect(page.getByRole('button',{name:'All answers ('+questions.length+')',exact:true})).toBeVisible();
 expect(paidRequests).toBe(0);
});

test('Quick skipped answer and questionnaire progress survive refresh on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:1000});let paid=0;
 await page.route('**/api/assessment-recommendations',async route=>{paid++;await route.abort();});
 await page.goto('/assessment/quick');await fillSetup(page);
 await page.getByRole('button',{name:'Continue to Quick questions'}).click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!).assessmentProfile?.questionIds.length)).toBe(20);
 const initial=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!));
 await jump(page,initial.assessmentProfile.questionIds.indexOf('U-018'));
 await page.locator('#answer').fill('4');await page.getByRole('button',{name:'Skip',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!).skipped)).toContain('U-018');
 const before=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!));
 expect(before.answers).not.toHaveProperty('U-018');
 await page.reload();await expect(page.getByRole('navigation',{name:'Assessment stages'}).getByRole('button',{name:'2. Questions',exact:true})).toBeVisible();
 const after=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('capstone.assessment.ui-preview.v1')!));
 expect(after.assessmentProfile).toEqual(before.assessmentProfile);expect(after.phase).toBe('questions');expect(after.activeId).toBe(before.activeId);expect(after.progress).toBe(before.progress);expect(after.skipped).toEqual(before.skipped);expect(after.answers).toEqual(before.answers);
 await page.getByRole('button',{name:'3. Review',exact:true}).click();
 await expect(page.getByText('0 answered · 20 unanswered questions.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'View Quick subset scores',exact:true}).click();await page.getByRole('button',{name:'View Quick subset scores anyway',exact:true}).click();
 await expect(page.getByText('0 of 20 Quick questions answered · 20 unanswered in Quick.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(paid).toBe(0);
});
