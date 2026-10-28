import { test, expect } from "@playwright/test";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog } from "../../src/application/assessment-catalog";
import { createAssessmentModel } from "../../src/features/assessment/model";
const CALCULATOR_KEY = "mosaic.calculator.reference.v1";
const catalog=assessmentCatalog(loadCanonicalConfig().config);
const model=createAssessmentModel(catalog.version,()=>[]);
test("Data Input calculator preserves review, corrections, manual answers across refresh",async({page},info)=>{
 await page.setViewportSize({width:390,height:844});
 const session={...model.initialSession(),phase:"method",profile:{...model.initialSession().profile,companyName:"Example workshop",country:"China",industry:"Manufacturing (Industrial / Components)",companySize:"251 - 500",location:"APAC",targetMarket:"EU",targetBuyer:"Enterprise",businessGoal:"Prepare for procurement questionnaires"},answers:{"U-001":"No"}};
 await page.addInitScript(s=>{if(!sessionStorage.getItem("capstone.assessment.ui-preview.v1")) sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s));},session);
 await page.goto("/assessment");
 await page.getByRole("radio",{name:/Use emissions calculator/}).check();
 await page.getByLabel("Period start",{exact:true}).fill("2025-01-01");await page.getByLabel("Period end",{exact:true}).fill("2025-12-31");
 await page.getByRole("button",{name:"Add source",exact:true}).click();
 await page.getByRole("textbox",{name:"Facility/location (optional)",exact:true}).fill("A");await page.getByRole("textbox",{name:"Source name",exact:true}).fill("electricity-A");
 await page.getByRole("textbox",{name:"Quantity",exact:true}).first().fill("10000");
 await page.getByRole("combobox",{name:"Electricity geography",exact:true}).fill("CHINA NATIONAL");
 await page.getByRole("option",{name:"China national",exact:true}).click();await expect(page.getByRole("combobox",{name:"Reference factor",exact:true})).toHaveCount(0);
 expect(await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)!).draft.activities[0].factorId,CALCULATOR_KEY)).toBe("legacy-C19");
 await expect(page.getByText(/Applied factor:/)).toContainText("0.5703");
 await page.getByRole("combobox",{name:"Scope 1 sources",exact:true}).selectOption("none");await page.getByRole("combobox",{name:"Scope 2 sources",exact:true}).selectOption("complete");await page.getByRole("combobox",{name:"Energy sources",exact:true}).selectOption("complete");await page.getByRole("checkbox",{name:/I understand these/}).check();
 await page.getByRole("textbox",{name:"Same-period revenue",exact:true}).fill("100000");
 await page.getByRole("button",{name:"Calculate for review"}).click();
 const reviewed=page.getByRole("region",{name:"Calculated values for review"});await expect(reviewed).toContainText("5.703 tCO2e");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath("calculator-mobile-review.png"),fullPage:true});
 await page.getByRole("checkbox",{name:/I confirm the selected values/}).check();
 await page.evaluate(()=>{ const original=Storage.prototype.setItem; Object.assign(window,{restoreStorage:()=>{Storage.prototype.setItem=original;}}); Storage.prototype.setItem=function(key,value){if(key==="capstone.assessment.ui-preview.v1") throw new DOMException("Storage blocked","QuotaExceededError"); original.call(this,key,value);}; });
 await page.getByRole("button",{name:"Use selected values and start questionnaire"}).click();
 await expect(page.getByText(/Nothing was transferred and navigation was stopped/)).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers)).toEqual({"U-001":"No"});
 await expect(page.getByRole("button",{name:"Use selected values and start questionnaire"})).toBeVisible();
 await page.evaluate(()=>{(window as unknown as {restoreStorage:()=>void}).restoreStorage();});
 await page.getByRole("button",{name:"Use selected values and start questionnaire"}).click();
 await page.getByRole("button",{name:"2. Data Input",exact:true}).click();
 await page.reload();await expect(reviewed).toContainText("5.703 tCO2e");
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers["I-056"])).toBe("0.00005703");
 await page.getByRole("textbox",{name:"Quantity",exact:true}).first().fill("12000");await expect(reviewed).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers["I-056"])).toBeUndefined();
 await page.getByRole("button",{name:"Calculate for review"}).click();await expect(reviewed).toContainText("6.8436 tCO2e");
 await page.getByRole("checkbox",{name:/I confirm the selected values/}).check();
 await page.getByRole("button",{name:"Use selected values and start questionnaire"}).click();
 await page.getByRole("button",{name:"2. Data Input",exact:true}).click();
 await page.getByRole("radio",{name:/Enter manually/}).check();await page.reload();await expect(page.getByRole("radio",{name:/Enter manually/})).toBeChecked();
 await page.getByRole("radio",{name:/Use emissions calculator/}).check();await expect(reviewed).toContainText("6.8436 tCO2e");
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole("radio",{name:/Enter manually/}).check();
 await page.getByRole("button",{name:"Start questionnaire"}).click();
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers)).toEqual({"U-001":"No","I-056":"0.00006843600000000001","I-062":"0.12"});
 await page.getByRole("button",{name:"Review all answers"}).click();
 await page.getByText("Confirmed calculator values and source details",{exact:true}).click();
 await expect(page.getByText(/I-056 · carbon_intensity_manuf/)).toBeVisible();
 await page.getByRole("button",{name:/What is your total annual energy consumption divided/}).click();
 await page.getByRole("textbox",{name:/Your answer/}).fill("0.3");
 await page.reload();
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers["I-062"])).toBe("0.3");
 expect(await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)!).draft.activities[0].quantity,CALCULATOR_KEY)).toBe("12000");
 await page.getByRole("button",{name:"2. Data Input",exact:true}).click();
 await page.getByRole("radio",{name:/Use emissions calculator/}).check();
 await page.getByRole("textbox",{name:"Quantity",exact:true}).first().fill("10000");
 await page.reload();
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers)).toEqual({"U-001":"No","I-062":"0.3"});
});

for (const country of [undefined,"Japan"]) test("unsupported or old-session country hides calculator: "+String(country),async({page})=>{
 const session={...model.initialSession(),phase:"method",profile:{...model.initialSession().profile,country,companyName:"Example workshop",industry:"Manufacturing (Industrial / Components)",companySize:"251 - 500",location:"APAC",targetMarket:"EU",targetBuyer:"Enterprise",businessGoal:"Prepare for procurement questionnaires"},answers:{"U-001":"No"}};
 await page.addInitScript(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);
 await page.goto("/assessment");
 await expect(page.getByRole("radio",{name:/Use emissions calculator/})).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Start questionnaire"})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!).answers)).toEqual({"U-001":"No"});
});
test("collapsed sources reopen on cross-source errors without losing entries",async({page})=>{
 const session={...model.initialSession(),phase:"method",profile:{...model.initialSession().profile,country:"China",companyName:"Example workshop",industry:"Manufacturing (Industrial / Components)",companySize:"251 - 500",location:"APAC",targetMarket:"EU",targetBuyer:"Enterprise",businessGoal:"Prepare for procurement questionnaires"}};
 await page.addInitScript(s=>sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s)),session);
 await page.goto("/assessment");await page.getByRole("radio",{name:/Use emissions calculator/}).check();
 await page.getByLabel("Period start",{exact:true}).fill("2025-01-01");
 await page.getByLabel("Period end",{exact:true}).fill("2025-12-31");
 await page.getByRole("checkbox",{name:/I understand these/}).check();
 for(const name of ["electricity-A","electricity-B"]){
  await page.getByRole("button",{name:"Add source",exact:true}).click();
  await page.getByRole("textbox",{name:"Source name",exact:true}).last().fill(name);
  await page.getByRole("textbox",{name:"Quantity",exact:true}).last().fill("10000");
 }
 await page.getByRole("button",{name:"Done / Collapse source 2",exact:true}).click();
 await expect(page.getByRole("button",{name:"Edit source 2",exact:true})).toBeVisible();
 await page.getByRole("textbox",{name:"Source name",exact:true}).fill("electricity-B");
 await page.getByRole("button",{name:"Calculate for review"}).click();
 await expect(page.getByRole("textbox",{name:"Source name",exact:true})).toHaveCount(2);
 await expect(page.getByRole("textbox",{name:"Quantity",exact:true}).nth(1)).toHaveValue("10000");
 await expect(page.getByRole("alert").filter({hasText:"Check calculator entries"})).toContainText("already has an entry");
});

test("M4.5 equivalent manual and calculator inputs reach the same real deterministic score",async({browser,baseURL})=>{
 const session={...model.initialSession(),phase:"method",profile:{...model.initialSession().profile,companyName:"Example workshop",country:"China",industry:"Manufacturing (Industrial / Components)",companySize:"251 - 500",location:"APAC",targetMarket:"EU",targetBuyer:"Enterprise",businessGoal:"Prepare for procurement questionnaires"},answers:{"U-001":"No"}};
 const outcomes:unknown[]=[];
 for(const method of ["calculator","manual"]){
  const context=await browser.newContext({baseURL});const page=await context.newPage();
  try {
   await page.addInitScript(s=>{if(!sessionStorage.getItem("capstone.assessment.ui-preview.v1"))sessionStorage.setItem("capstone.assessment.ui-preview.v1",JSON.stringify(s));},session);
   await page.goto("/assessment");
   if(method==="calculator"){
    await page.getByRole("radio",{name:/Use emissions calculator/}).check();
    await page.getByLabel("Period start",{exact:true}).fill("2025-01-01");await page.getByLabel("Period end",{exact:true}).fill("2025-12-31");
    await page.getByRole("button",{name:"Add source",exact:true}).click();
    await page.getByRole("textbox",{name:"Source name",exact:true}).fill("electricity-A");
    await page.getByRole("textbox",{name:"Quantity",exact:true}).fill("10000");
    await page.getByRole("combobox",{name:"Electricity geography",exact:true}).fill("China national");await page.getByRole("option",{name:"China national",exact:true}).click();
    await page.getByRole("combobox",{name:"Scope 1 sources",exact:true}).selectOption("none");
    for(const name of ["Scope 2 sources","Energy sources"])await page.getByRole("combobox",{name,exact:true}).selectOption("complete");
    await page.getByRole("checkbox",{name:/I understand these/}).check();
    await page.getByRole("textbox",{name:"Same-period revenue",exact:true}).fill("100000");
    await page.getByRole("button",{name:"Calculate for review"}).click();
    await page.getByRole("checkbox",{name:/I confirm the selected values/}).check();
    await page.getByRole("button",{name:"Use selected values and start questionnaire",exact:true}).click();
   }else{
    await page.getByRole("radio",{name:/Enter manually/}).check();await page.getByRole("button",{name:"Start questionnaire",exact:true}).click();
    for(const [id,value] of [["I-056","0.00005703"],["I-062","0.1"]]){
     await page.getByRole("button",{name:"Review all answers",exact:true}).click();
     const title=catalog.questions.find(q=>q.id===id)!.title;
     await page.getByRole("button").filter({hasText:title}).click();
     await page.getByRole("textbox",{name:/Your answer/}).fill(value!);
    }
   }
   const saved=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("capstone.assessment.ui-preview.v1")!));
   expect(saved.answers).toEqual({"U-001":"No","I-056":"0.00005703","I-062":"0.1"});
   await page.getByRole("button",{name:"Review all answers",exact:true}).click();
   await page.getByRole("button",{name:"Generate score and recommendations",exact:true}).click();
   const responsePromise=page.waitForResponse(r=>r.url().endsWith("/api/assessment-score") && r.request().method()==="POST");
   await page.getByRole("button",{name:"Generate score and recommendations anyway",exact:true}).click();
   const response=await responsePromise;expect(response.status()).toBe(200);const score=await response.json();
   expect(response.request().postDataJSON().answers).toEqual(saved.answers);
   await expect(page.locator(".score-values")).toContainText(score.rawOverall.toFixed(1));
   await expect(page.locator(".score-values")).toContainText(score.weightedOverall.toFixed(1));
   outcomes.push(score);
  }finally{await context.close();}
 }
 expect(outcomes[0]).toEqual(outcomes[1]);
});
