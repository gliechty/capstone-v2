import { existsSync, readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog } from "../../src/application/assessment-catalog";
import { computeAssessment } from "../../src/application/score-request";
const config = loadCanonicalConfig().config;
const input = { configVersion: assessmentCatalog(config).version, companyName: "Synthetic browser SME", subindustry: "Industrial components", notes: "",
  context: { industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarkets: ["EU"], targetBuyer: "Enterprise", businessGoal: "Investor readiness" }, answers: { "U-001": "No", "U-002": "Yes" } };
const score = computeAssessment(config, { configVersion: input.configVersion, context: input.context, answers: input.answers });
const citation = { doc_title: "Controlled browser evidence", source: "Test transport", pages_or_section: "Test section", link: "https://example.org/test-evidence" };
const validTestContent = () => ({ executive_summary: "Controlled browser response; application validation is covered separately by service tests.",
  priority_recommendations: [{ priority_rank: 1, title: "Review the observed practice", why_it_matters: "Controlled test rationale.", recommended_action: "Controlled test action.", evidence: [citation], related_categories: ["Governance"], implementation_difficulty: "Low" }],
  key_gaps: [{ category: "Governance", gap: "Controlled test gap.", evidence: [citation] }], grounding_notes: "Controlled browser test only; unverified evidence." });
import { inputIdentityText } from "../../src/application/recommendations/identity";
const recommendationPolicy = { version: "controlled-browser-policy" };
const PROMPT_VERSION = "controlled-browser-prompt";
const settings = { provider: "openai", model: "gpt-5.4-mini", reasoning: "low", timeoutMs: 10000, maxOutputTokens: 4000 };
const configuration = { ready: true, code: "ready", settings, fingerprint: "controlled-browser-test", configVersion: config.version, sessionVersion: input.configVersion, methodVersion: score.methodVersion, policyVersion: recommendationPolicy.version, promptVersion: PROMPT_VERSION };
const session = { version: 3, progress: 4, configVersion: input.configVersion, phase: "review", inputMethod: "manual", activeId: "U-001", skipped: [], answers: input.answers,
  profile: { industry: input.context.industry, companySize: input.context.companySize, location: input.context.location, targetBuyer: input.context.targetBuyer, businessGoal: input.context.businessGoal, companyName: input.companyName, subindustry: input.subindustry, notes: "", targetMarket: "EU" } };
// HTTP interception is confined to tests. The normal build has no fixture route; the private preview is separately build/runtime gated.
const result = (raw: typeof input) => ({ status: "available", configuration, content: validTestContent(), evidence: { limitations: ["Controlled browser test evidence only."] },
  identity: { inputId: createHash("sha256").update(inputIdentityText(raw)).digest("hex"), configVersion: config.version, methodVersion: score.methodVersion, policyVersion: recommendationPolicy.version, promptVersion: PROMPT_VERSION, provider: { id: "openai", model: settings.model, settings } } });
test("explicit generation, duplicate suppression, validated display, notes invalidation and refresh", async ({ page }) => {
  let posts = 0; let release!: () => void;
  await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), session);
  await page.route("**/api/assessment-recommendations", async route => {
    if (route.request().method() === "GET") return route.fulfill({ json: configuration });
    posts++; await new Promise<void>(resolve => { release = resolve; });
    await route.fulfill({ json: result(route.request().postDataJSON()) });
  });
  await page.goto("/results");
  const generate = page.getByRole("button", { name: "Generate recommendations", exact: true });
  await expect(generate).toBeEnabled(); expect(posts).toBe(0);
  const scores = await page.locator(".score-values").textContent();
  await generate.click(); await expect.poll(() => posts).toBe(1); await expect(generate).toBeDisabled();
  await expect(page.getByRole("button", { name: "Cancel generation" })).toBeVisible();
  release(); await expect(page.getByRole("button", { name: "Regenerate recommendations" })).toBeVisible();
  await page.locator("#actions summary").click();
  await page.locator("#sources > details > summary").click();
  await expect(page.getByText("Review the observed practice", { exact: true })).toBeVisible();
  await expect(page.locator("#sources a[target='_blank']")).toHaveCount(1);
  await page.evaluate(() => { const key = "capstone.assessment.ui-preview.v1"; const value = JSON.parse(sessionStorage.getItem(key)!); value.profile.notes = "Changed notes"; sessionStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event("capstone:assessment-session-changed")); });
  await expect(page.getByText("Review the observed practice", { exact: true })).toHaveCount(0);
  await expect(page.locator(".score-values")).toHaveText(scores!); expect(posts).toBe(1);
  await page.reload(); await expect(generate).toBeEnabled(); expect(posts).toBe(1);
});
test("cancelled and stale responses cannot replace deterministic results; failure remains visible", async ({ page }) => {
  let release!: () => void; let failing = false; let posts = 0;
  await page.addInitScript(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), session);
  await page.route("**/api/assessment-recommendations", async route => {
    if (route.request().method() === "GET") return route.fulfill({ json: configuration });
    posts++;
    if (failing) return route.fulfill({ status: 503, json: { status: "unavailable", code: "quota_exceeded", configuration } });
    await new Promise<void>(resolve => { release = resolve; });
    await route.fulfill({ json: result(route.request().postDataJSON()) }).catch(() => {});
  });
  await page.goto("/results"); await page.getByRole("button", { name: "Generate recommendations" }).click(); await expect.poll(() => posts).toBe(1);
  await page.getByRole("button", { name: "Cancel generation" }).click(); release();
  await expect(page.getByText(/Stopped waiting for recommendations/)).toBeVisible();
  await expect(page.getByText("Review the observed practice", { exact: true })).toHaveCount(0);
  failing = true; await page.getByRole("button", { name: "Retry recommendations" }).click();
  await expect(page.getByText(/Provider quota is exhausted/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Calculated overall scores" })).toBeVisible();
});
test("ordinary browser server is offline and enforces request origin", async ({ request }) => {
  const status = await request.get("/api/assessment-recommendations"); expect(status.ok()).toBe(true); expect(await status.json()).toMatchObject({ ready: false, code: "offline_tests" });
  const blocked = await request.post("/api/assessment-recommendations", { headers: { Origin: "https://untrusted.example" }, data: input }); expect(blocked.status()).toBe(403);
  const local = await request.post("/api/assessment-recommendations", { headers: { Origin: "http://127.0.0.1:3100" }, data: input }); expect(local.status()).toBe(503); expect(await local.json()).toMatchObject({ code: "provider_not_configured", assessment: { rawOverall: score.rawOverall } });
});

for (const width of [1440, 768, 390]) test("combined partial action generates once and disclosures work at " + width, async ({ page }, testInfo) => {
  await page.setViewportSize({width,height:1000});
  await page.goto("/");
  await page.evaluate(s => sessionStorage.setItem("capstone.assessment.ui-preview.v1", JSON.stringify(s)), session);
  let posts = 0; let release!: () => void;
  await page.route("**/api/assessment-recommendations", async route => {
    if (route.request().method() === "GET") return route.fulfill({json:configuration});
    posts++; await new Promise<void>(resolve => { release = resolve; });
    return route.fulfill({json:result(route.request().postDataJSON())});
  });
  await page.goto("/assessment");
  await page.getByRole("button", {name:"Generate score and recommendations",exact:true}).click();
  await expect(page.getByRole("group",{name:"Confirm partial assessment"})).toBeVisible(); expect(posts).toBe(0);
  await page.getByRole("button",{name:"Generate score and recommendations anyway",exact:true}).dblclick();
  await expect(page).toHaveURL(/results$/); await expect.poll(()=>posts).toBe(1);
  await expect(page.locator(".score-values")).toContainText("51.0");
  await expect(page.getByRole("button",{name:"Cancel generation"})).toBeVisible();
  release(); await expect(page.getByRole("button",{name:"Regenerate recommendations"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Executive summary",exact:true})).toBeVisible();
  await expect(page.locator("#gaps details")).not.toHaveAttribute("open");
  await expect(page.locator("#actions summary")).toHaveText(/Recommended actions \(1\)/);
  await page.screenshot({path:testInfo.outputPath("combined-results-collapsed-"+width+".png"),fullPage:true});
  await page.locator("#actions summary").focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("heading",{name:"Review the observed practice",exact:true})).toBeVisible();
  await page.locator("#gaps summary").click(); await page.locator("#sources > details > summary").click();
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:testInfo.outputPath("combined-results-"+width+".png"),fullPage:true});
  await page.reload(); await expect(page.locator(".score-values")).toContainText("51.0"); expect(posts).toBe(1);
  await page.getByRole("link",{name:"Return to assessment",exact:true}).first().click();
  await expect(page).toHaveURL(/assessment$/);
  await page.goBack(); await expect(page.getByRole("heading",{name:"Executive summary",exact:true})).toBeVisible(); expect(posts).toBe(1);
});

test("combined failure keeps scores and retries only on explicit action", async ({page}) => {
 await page.goto("/"); await page.evaluate(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);
 let posts=0;
 await page.route("**/api/assessment-recommendations",route=>{if(route.request().method()==="GET")return route.fulfill({json:configuration});posts++;return route.fulfill({status:503,json:{status:"unavailable",code:"timeout",configuration}});});
 await page.goto("/assessment");await page.getByRole("button",{name:"Generate score and recommendations",exact:true}).click();await page.getByRole("button",{name:"Generate score and recommendations anyway",exact:true}).click();
 await expect(page.getByRole("button",{name:"Retry recommendations",exact:true})).toBeVisible();expect(posts).toBe(1);await expect(page.locator(".score-values")).toContainText("51.0");
 await page.getByRole("button",{name:"Retry recommendations",exact:true}).click();await expect.poll(()=>posts).toBe(2);
 await page.reload();await expect(page.locator(".score-values")).toContainText("51.0");expect(posts).toBe(2);
});

for (const interruption of ["refresh", "navigation"] as const) test("in-flight " + interruption + " requires explicit recovery without duplicate generation", async ({page}, testInfo) => {
 await page.goto("/"); await page.evaluate(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);
 let posts=0; let release!:()=>void;
 await page.route("**/api/assessment-recommendations",async route=>{
  if(route.request().method()==="GET")return route.fulfill({json:configuration});
  posts++; if(posts===1)await new Promise<void>(resolve=>{release=resolve;});
  await route.fulfill({json:result(route.request().postDataJSON())}).catch(()=>{});
 });
 await page.goto("/assessment");await page.getByRole("button",{name:"Generate score and recommendations",exact:true}).click();await page.getByRole("button",{name:"Generate score and recommendations anyway",exact:true}).click();
 await expect.poll(()=>posts).toBe(1); await expect(page.locator(".score-values")).toContainText("51.0");
 const receipt=await page.evaluate(()=>sessionStorage.getItem("capstone.recommendation.pending.v1"));expect(receipt).toMatch(/^[a-f0-9]{64}$/);
 const scores=await page.locator(".score-values").textContent();
 const scoreBox=await page.getByRole("region",{name:"Deterministic assessment results"}).boundingBox();
 const summaryBox=await page.locator("#summary").boundingBox();expect(scoreBox!.y+scoreBox!.height).toBeLessThanOrEqual(summaryBox!.y);
 await page.screenshot({path:testInfo.outputPath("pending.png"),fullPage:true});
 if(interruption==="refresh")await page.reload();
 else {await page.getByRole("link",{name:"Return to assessment",exact:true}).first().click();await expect(page).toHaveURL(/assessment$/);await page.goBack();}
 expect(await page.evaluate(()=>sessionStorage.getItem("capstone.recommendation.pending.v1"))).toBe(receipt);
 await expect(page.getByText(/Its provider outcome is unknown/)).toBeVisible();
 await expect(page.getByRole("button",{name:"Retry recommendations",exact:true})).toBeEnabled();
 await expect(page.getByRole("button",{name:"Cancel generation"})).toHaveCount(0);
 expect(posts).toBe(1);await expect(page.locator(".score-values")).toHaveText(scores!);
 release();await expect(page.getByText("Controlled browser response; application validation is covered separately by service tests.")).toHaveCount(0);
 await page.screenshot({path:testInfo.outputPath("recovery.png"),fullPage:true});
 await page.getByRole("button",{name:"Retry recommendations",exact:true}).click();
 await expect(page.getByRole("button",{name:"Regenerate recommendations",exact:true})).toBeVisible();expect(posts).toBe(2);
});

for(const width of [1440,768,390,320,844]) test("reviewed Results hierarchy and source dialog at "+width,async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:"reduce"});await page.setViewportSize({width,height:width===844?390:1000});await page.goto("/");await page.evaluate(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);
 const difficulty=width===1440?"Low":width===768?"Medium":"High";
 await page.route("**/api/assessment-recommendations",route=>{const response=result(input);response.content.priority_recommendations[0]!.implementation_difficulty=difficulty;return route.fulfill({json:route.request().method()==="GET"?configuration:response});});
 await page.goto("/results");await page.getByRole("button",{name:"Generate recommendations",exact:true}).click();await expect(page.getByRole("button",{name:"Regenerate recommendations"})).toHaveClass("button-secondary");
 await expect(page.getByRole("group",{name:"Assessment context"})).toContainText("Enterprise");await expect(page.getByRole("group",{name:"Assessment context"})).toContainText("EU");
 await expect(page.getByText(/Provider: openai/)).not.toBeVisible();await expect(page.getByText(/Configuration: capstone/)).not.toBeVisible();
 await page.screenshot({path:testInfo.outputPath("scores-context.png"),fullPage:true});
 await page.locator("#gaps > details > summary").click();await expect(page.locator("#gaps h3")).toHaveText("Controlled test gap.");await expect(page.locator("#gaps a")).not.toBeVisible();
 await page.locator("#gaps").screenshot({path:testInfo.outputPath("expanded-gap.png")});
 await page.locator("#actions > details > summary").click();const badges=page.locator(".action-badges");await expect(badges).toHaveText("GovernanceDifficulty: "+(difficulty==="High"?"Hard":difficulty));
 expect((await badges.boundingBox())!.y).toBeLessThan((await page.getByRole("heading",{name:"Review the observed practice",exact:true}).boundingBox())!.y);
 await page.locator("#actions").screenshot({path:testInfo.outputPath("expanded-action.png")});
 const source=page.locator("#actions .source-control");await source.focus();await page.keyboard.press("Enter");const dialog=page.getByRole("dialog");await expect(dialog).toBeVisible();await expect(dialog.getByRole("link")).toHaveAttribute("href",citation.link);
 const close=dialog.getByRole("button",{name:/Close/});await close.scrollIntoViewIfNeeded();await expect(close).toBeInViewport();expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);await page.screenshot({path:testInfo.outputPath("open-source-dialog.png")});
 await page.keyboard.press("Escape");await expect(dialog).not.toBeVisible();await expect(source).toBeFocused();
 await page.locator("#sources > details > summary").click();expect(await page.locator("#sources h3").allTextContents()).toEqual(["How recommendations use evidence","Assessment evidence & coverage","Bibliography"]);
 await expect(page.getByText(/Country and revenue-band context/)).not.toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator("#sources").screenshot({path:testInfo.outputPath("evidence-section.png")});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:testInfo.outputPath("full-results.png"),fullPage:true});
 await page.getByRole("button",{name:"Review unanswered items",exact:true}).click();await expect(page).toHaveURL(/assessment$/);const restored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!));expect(restored.answers).toEqual(input.answers);expect(restored.activeId).not.toBe("U-001");expect(restored.activeId).not.toBe("U-002");
});

test("retained live response renders offline with its original synthetic identity",async({page},testInfo)=>{
 const path=".local/live-v4-browser-application-response.json";test.skip(!existsSync(path),"Retained local evidence is not distributed in the repository");
 const retained=JSON.parse(readFileSync(path,"utf8"));const original={...input,companyName:"Synthetic live smoke 1"};expect(createHash("sha256").update(inputIdentityText(original)).digest("hex")).toBe(retained.identity.inputId);
 await page.goto("/");await page.evaluate(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),{...session,profile:{...session.profile,companyName:original.companyName}});
 await page.route("**/api/assessment-recommendations",route=>route.fulfill({json:route.request().method()==="GET"?retained.configuration:retained}));
 await page.goto("/results");await page.getByRole("button",{name:"Generate recommendations",exact:true}).click();await expect(page.getByText(retained.content.executive_summary,{exact:true})).toBeVisible();
 for(const id of ["gaps","actions","sources"])await page.locator("#"+id+" > details > summary").click();
 await expect(page.locator("#sources .bibliography > li")).toHaveCount(2);await expect(page.locator(".score-values")).toContainText("51.0");
 await page.emulateMedia({reducedMotion:"reduce"});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:testInfo.outputPath("retained-live-offline.png"),fullPage:true});
});

for(const reducedMotion of ["reduce","no-preference"] as const)test("delayed offline loading feedback: "+reducedMotion,async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion});await page.goto("/");await page.evaluate(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);let release!:()=>void;let posts=0;
 await page.route("**/api/assessment-recommendations",async route=>{if(route.request().method()==="GET")return route.fulfill({json:configuration});posts++;await new Promise<void>(r=>{release=r;});await route.fulfill({json:result(route.request().postDataJSON())});});
 await page.goto("/results");await page.clock.install();await page.getByRole("button",{name:"Generate recommendations",exact:true}).click();await expect.poll(()=>posts).toBe(1);await expect(page.locator(".score-values")).toContainText("51.0");await expect(page.locator(".generation-spinner")).toBeVisible();
 expect(await page.locator(".generation-spinner").evaluate(el=>getComputedStyle(el).animationName)).toBe(reducedMotion==="reduce"?"none":"generation-spin");
 if(reducedMotion==="reduce"){await expect(page.locator(".loading-reduced")).toBeVisible();await expect(page.locator(".loading-words")).not.toBeVisible();await page.clock.fastForward(4500);await expect(page.locator(".loading-reduced")).toHaveText("Generating recommendations…");}
 else{await expect(page.locator(".loading-words")).toHaveText("Preparing tailored recommendations…");await page.clock.fastForward(2000);await expect(page.locator(".loading-words")).toHaveText("Waiting for generated advice…");await page.clock.fastForward(2000);await expect(page.locator(".loading-words")).toHaveText("Keeping your scores available…");}
 await page.locator("#summary").screenshot({path:testInfo.outputPath("loading.png")});expect(posts).toBe(1);release();await expect(page.getByRole("button",{name:"Regenerate recommendations"})).toBeVisible();await expect(page.locator(".generation-spinner")).toHaveCount(0);
});


test("daily budget modal preserves existing results, keyboard access and scores",async({page},info)=>{
 await page.setViewportSize({width:320,height:568});
 let posts=0;
 await page.addInitScript(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);
 await page.route("**/api/assessment-recommendations",async route=>{
  if(route.request().method()==="GET")return route.fulfill({json:configuration});
  posts++;return posts===1 ? route.fulfill({json:result(route.request().postDataJSON())}) : route.fulfill({status:429,json:{status:"unavailable",code:"budget_exhausted",configuration}});
 });
 await page.goto("/results");await page.getByRole("button",{name:"Generate recommendations",exact:true}).click();
 const regenerate=page.getByRole("button",{name:"Regenerate recommendations"});await expect(regenerate).toBeVisible();
 const scores=await page.locator(".score-values").textContent();await regenerate.click();
 const modal=page.getByRole("dialog",{name:"Daily AI budget reached"});await expect(modal).toBeVisible();
 await expect(modal).toContainText("Today’s AI recommendation budget has been reached. Your scores remain available. Please try again tomorrow or contact Guy / the Climate School to arrange additional access.");
 await expect(modal.getByRole("button",{name:"Close",exact:true})).toBeFocused();
 await modal.getByRole("button",{name:"Close",exact:true}).scrollIntoViewIfNeeded();await expect(modal.getByRole("button",{name:"Close",exact:true})).toBeInViewport();await page.screenshot({path:info.outputPath("budget-mobile.png")});
 expect((await new AxeBuilder({page}).include('dialog[open]').analyze()).violations).toEqual([]);
 await page.keyboard.press('Escape');await expect(modal).not.toBeVisible();await expect(regenerate).toBeFocused();
 await expect(page.locator('.score-values')).toHaveText(scores!);
 await expect(page.getByText(validTestContent().executive_summary,{exact:true})).toBeVisible();expect(posts).toBe(2);
});

// Owner-authorized unchanged historical replay through the real parser, controller and Results components.
import { goldenCases, goldenExpected } from "../helpers/legacy-scoring";
import { goldenAnswers } from "../helpers/golden-comparison";
import { setupConfig } from "../../src/application/assessment-setup";
import { prepareEvidence } from "../../src/application/recommendations/prepare";
import { recommendationPolicy as livePolicy } from "../../src/application/recommendations/policy";
import { validateRecommendationOutput } from "../../src/application/recommendations/validate-output";
import { groupCitations } from "../../src/features/results/evidence-controls";
for (const fixture of goldenCases) test(fixture.case_id + ": archived recommendations and citations display unchanged", async ({page}) => {
 const p=fixture.profile;
 const matching={...input,companyName:String(p.company_name),subindustry:String(p.subindustry),notes:String(p.notes??""),context:{industry:p.industry,companySize:setupConfig.options.companySize.find(c=>c.value.replaceAll(" ","")===p.employee_band.replaceAll(" ",""))!.value,location:p.company_location,targetMarkets:[...p.target_market_region],targetBuyer:p.target_buyer,businessGoal:p.business_goal},answers:goldenAnswers(fixture)};
 const historical=goldenExpected(fixture);
 const raw=historical.recommendation_output_raw[0].content[0].text;
 const computed=computeAssessment(config,{configVersion:matching.configVersion,context:matching.context,answers:matching.answers});
 const evidence=prepareEvidence(config,matching,livePolicy);
 const parsed=validateRecommendationOutput(raw,matching,computed,evidence,config,livePolicy.maxResponseBytes);
 expect(parsed.ok,JSON.stringify(parsed)).toBe(true); if(!parsed.ok)throw new Error("Archived output rejected");
 expect(parsed.content).toEqual(historical.recommendation_output);
 const restored={...session,answers:matching.answers,profile:{companyName:matching.companyName,subindustry:matching.subindustry,notes:matching.notes,industry:matching.context.industry,companySize:matching.context.companySize,location:matching.context.location,targetMarket:matching.context.targetMarkets.join(";"),targetBuyer:matching.context.targetBuyer,businessGoal:matching.context.businessGoal}};
 await page.goto("/");await page.evaluate(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),restored);
 let posts=0;
 await page.route("**/api/assessment-recommendations",route=>{
  if(route.request().method()==="GET")return route.fulfill({json:configuration});
  posts++;expect(route.request().postDataJSON()).toEqual(matching);
  return route.fulfill({json:{...result(input),content:parsed.content,evidence:{limitations:evidence.limitations},identity:{...result(input).identity,inputId:createHash("sha256").update(inputIdentityText(matching)).digest("hex")}}});
 });
 await page.goto("/results");await page.getByRole("button",{name:"Generate recommendations",exact:true}).click();
 await expect(page.locator("#summary .results-prose")).toHaveText(parsed.content.executive_summary);
 for(const id of ["actions","gaps","sources"])await page.locator("#"+id+" > details > summary").click();
 await expect(page.locator("#actions h3")).toHaveText(parsed.content.priority_recommendations.map(r=>r.title));
 await expect(page.locator("#gaps h3")).toHaveText(parsed.content.key_gaps.map(g=>g.gap));
 const citations=[...parsed.content.priority_recommendations,...parsed.content.key_gaps].flatMap(r=>r.evidence);
 const grouped=groupCitations(citations);
 await expect(page.locator("#sources .bibliography > li")).toHaveCount(grouped.length);
 for(const [i,c] of grouped.entries()){
  const row=page.locator("#sources .bibliography > li").nth(i);
  await expect(row.locator("a")).toHaveText(c.title);await expect(row.locator("a")).toHaveAttribute("href",c.link);
  await expect(row.locator("p")).toHaveText(c.source);await expect(row.locator("ul > li")).toHaveText(c.sections);
 }
 await expect(page.locator(".score-values")).toContainText(computed.rawOverall!.toFixed(1));
 expect(posts).toBe(1);expect(goldenExpected(fixture)).toEqual(historical);
 console.log(fixture.case_id+": PASS; "+parsed.content.priority_recommendations.length+" actions, "+parsed.content.key_gaps.length+" gaps, "+citations.length+" citations ("+grouped.length+" bibliography entries); unchanged historical prose and authoritative computed score displayed.");
});
