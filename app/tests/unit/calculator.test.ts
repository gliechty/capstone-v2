import { unavailableMetricReason } from "../../src/application/calculator-mapping";
import { describe, expect, it } from "vitest";
import fixtures from "../fixtures/calculator-reference-v1.json";
import { calculateDraft, initialCalculatorDraft, referenceFactors, type CalculatorDraft } from "../../src/application/calculator";
import { calculatorUnits } from "../../src/domain/calculator/calculate";
import type { ActivityKind } from "../../src/domain/calculator/types";
import { createCalculatorSession, CALCULATOR_KEY } from "../../src/adapters/calculator-session";
const source = (kind: ActivityKind, quantity: string, factorId = "", extra: Partial<CalculatorDraft["activities"][number]> = {}): CalculatorDraft["activities"][number] => ({ id: kind, site: "A", source: kind, kind, quantity, unit: calculatorUnits[kind][0]!, factorId, geography: referenceFactors.find(f => f.id === factorId)?.geography ?? "", evidence: "", renewable: "", diverted: "", hazardous: "", ...extra });
function draft(...activities: CalculatorDraft["activities"]) { return { ...initialCalculatorDraft(), periodStart: "2025-01-01", periodEnd: "2025-12-31", referenceAcknowledged: true, coverage: { scope1: true, scope2: true, energy: true, water: true, waste: true }, activities }; }
const power = (quantity="10000") => source("electricity",quantity,"legacy-C19");
function result(d: CalculatorDraft) { const out=calculateDraft(d); expect(out.issues).toEqual([]); expect(out.result).not.toBeNull(); return out.result!; }
function expected(id:string, key:string) { const c=fixtures.cases.find(c=>c.id===id)!; const output=(c.expected.outputs as Record<string,unknown>)[key]; if (!output || typeof output!=="object" || !("value" in output)) throw new Error(`Missing numeric oracle: ${id}/${key}`); const value=output.value; return value===null ? null : Number(value); }
function same(actual:number|null,id:string,key:string) { const value=expected(id,key); if(value===null) expect(actual,`${id}/${key}`).toBeNull(); else { expect(actual,`${id}/${key}`).not.toBeNull(); expect(Math.abs(actual! - value),`${id}/${key}`).toBeLessThanOrEqual(32 * Number.EPSILON * Math.max(1,Math.abs(value))); } }
describe("accepted M4.1 numerical references through calculator boundary",()=>{
 it("preserves independent factor identities and provenance",()=>{ for(const f of referenceFactors) expect(f).toEqual(fixtures.factors.find(x=>x.id===f.id)); });
 it("calculates electricity and gas with full-precision intensities",()=>{
  const d=draft(power()); let r=result(d); same(r.totals.scope2.value,"electricity-only","scope2_location_based"); same(r.totals.scope1.value,"electricity-only","scope1");
  d.activities.push(source("gas","10000","legacy-C13")); d.revenue.amount="100000"; r=result(d);
  same(r.totals.scope1.value,"electricity-and-stationary-gas","scope1"); same(r.combinedEmissions.value,"electricity-and-stationary-gas","scope1_plus_2"); same(r.intensities.carbon,"electricity-and-stationary-gas","carbon_intensity"); same(r.intensities.energy,"electricity-and-stationary-gas","energy_intensity");
 });
 it("uses fuel emission factors, not energy factors",()=>{const r=result(draft(source("fuel","100","legacy-C7"),source("fuel","100","legacy-C8",{id:"petrol",source:"petrol"})));same(r.totals.scope1.value,"vehicle-fuel-factor-correction","vehicle_scope1_subtotal");same(r.totals.energy.value,"vehicle-fuel-factor-correction","fuel_energy");});
 it("keeps absent therm energy unknown",()=>{const r=result(draft(source("gas","100","legacy-C14",{unit:"m3"}),source("gas","10","legacy-C15",{id:"boiler2",source:"boiler2",unit:"therm"})));same(r.totals.scope1.value,"gas-unit-specific-factors","gas_scope1_subtotal");same(r.totals.energy.knownSubtotal,"gas-unit-specific-factors","known_energy_subtotal");same(r.totals.energy.value,"gas-unit-specific-factors","total_energy");});
 it.each([
  ["mileage","1000","legacy-C57","vehicle-distance-km","vehicle_scope1"],
  ["refrigerant","2","legacy-C45","refrigerant-reference","refrigerant_scope1"],
  ["heat","1000","legacy-C41","purchased-heat","heat_scope2"],
 ] as const)("calculates %s separately",(kind,q,f,id,key)=>{const r=result(draft(source(kind,q,f)));same(kind==="heat"?r.totals.scope2.value:r.totals.scope1.value,id,key);});
 it("joins multi-site geography and gas correctly",()=>{const r=result(draft(source("electricity","10000","legacy-C29"),source("gas","1000","legacy-C13"),source("electricity","10000","legacy-C27",{id:"pB",site:"B"}),source("gas","2000","legacy-C13",{id:"gB",site:"B"})));same(r.combinedEmissions.value,"multi-site-corrected-gas","scope1_plus_2");same(r.totals.energy.value,"multi-site-corrected-gas","energy");});
 it("keeps renewable share separate from location-based emissions",()=>{const r=result(draft({...power(),renewable:"2000"},source("gas","10000","legacy-C13",{renewable:"0"})));same(r.renewableElectricityShare,"renewable-share-separate","renewable_electricity_share");same(r.renewableEnergyShare,"renewable-share-separate","renewable_total_energy_share");same(r.totals.scope2.value,"renewable-share-separate","scope2_location_based"); expect(result(draft(power())).renewableElectricityShare).toBeNull();});
 it("sums water sources and waste without counting subsets twice",()=>{const d=draft(source("water","600"),source("water","300","",{id:"ground",source:"ground"}),source("water","100","",{id:"surface",source:"surface"}),source("waste","6","",{unit:"t",diverted:"0",hazardous:"1"}),source("waste","3","",{id:"recycled",source:"recycled",unit:"t",diverted:"3",hazardous:"0"}),source("waste","1","",{id:"compost",source:"compost",unit:"t",diverted:"1",hazardous:"0"}));d.revenue.amount="100000";const r=result(d);same(r.totals.water.value,"water-and-waste-metrics","annual_water_withdrawal");same(r.totals.waste.value,"water-and-waste-metrics","waste_mass");same(r.intensities.water,"water-and-waste-metrics","water_intensity");same(r.intensities.waste,"water-and-waste-metrics","waste_intensity");same(r.diversionShare,"water-and-waste-metrics","waste_diverted_percent");same(r.hazardousShare,"water-and-waste-metrics","hazardous_waste_percent");});
 it("preserves absolute results with missing/zero/non-USD revenue and converts explicit USD millions",()=>{const d=draft(power());for(const value of ["","0","-1"]){d.revenue.amount=value;const r=result(d);expect(r.intensities.carbon).toBeNull();same(r.combinedEmissions.value,"missing-revenue","known_emissions");}d.revenue={amount:"1",currency:"CNY",scale:"millions"};expect(result(d).intensities.carbon).toBeNull();d.activities[0]={...power("10"),unit:"MWh"};d.revenue={amount:"0.1",currency:"USD",scale:"millions"};same(result(d).intensities.carbon,"explicit-usd-million-conversion","carbon_intensity");});
 it("distinguishes blank, zero and partial source coverage",()=>{const d=draft(power(""),source("gas","","legacy-C13"));let r=result(d);expect(r.combinedEmissions.value).toBeNull();d.activities[0]!.quantity="0";d.activities[1]!.quantity="0";r=result(d);same(r.combinedEmissions.value,"genuine-zero","scope1_plus_2");d.activities[0]!.quantity="10000";d.activities[1]!.quantity="";r=result(d);same(r.combinedEmissions.knownSubtotal,"partial-source-coverage","known_emissions_subtotal");expect(r.combinedEmissions.value).toBeNull();d.coverage.scope2=false;expect(result(d).totals.scope2.value).toBeNull();const explicit: CalculatorDraft={...d,coverage:{...d.coverage,scope2:"none"}};expect(calculateDraft(explicit).result).toBeNull();explicit.activities=[];explicit.coverage.scope2="none";expect(result(explicit).totals.scope2.value).toBe(0);explicit.coverage.scope2="incomplete";expect(result(explicit).totals.scope2.value).toBeNull();explicit.coverage.scope2="complete";expect(calculateDraft(explicit).result).toBeNull();});
 it("rejects overlapping fuel/mileage and retains alternative process method",()=>{const d=draft(source("fuel","100","legacy-C7",{source:"fleet-A"}),source("mileage","1000","legacy-C57",{source:"fleet-A"}));expect(calculateDraft(d).issues[0]?.message).toContain("already has an entry");const r=result(draft(source("process","100","legacy-C92"),source("process","20","legacy-C93",{id:"lime",source:"lime"})));same(r.totals.scope1.value,"process-source-alternatives","process_scope1");});
 it("does not invent grid factors, currency conversion or provenance",()=>{const d=draft(source("electricity","10000"));const r=result(d);same(r.totals.scope2.value,"unknown-grid-geography","electricity_scope2");same(r.totals.energy.value,"unknown-grid-geography","electricity_energy");d.activities[0]=power();d.activities[0].geography="Global";expect(calculateDraft(d).result).toBeNull();});
 it("rejects invalid quantities, wrong units/factors, subsets and incompatible versions",()=>{for(const patch of [{quantity:"-1"},{quantity:"Infinity"},{quantity:"1e309"},{unit:"kg"},{factorId:"legacy-C65"},{renewable:"10001"}])expect(calculateDraft(draft({...power(),...patch})).result).toBeNull();expect(calculateDraft({...draft(power()),factorVersion:"old"}).result).toBeNull();expect(calculateDraft({...draft(power()),referenceAcknowledged:false}).result).toBeNull();});
 it("preserves incomplete entries and original reviewed inputs on storage round-trip",()=>{const values=new Map<string,string>();const adapter=createCalculatorSession(()=>({getItem:k=>values.get(k)??null,setItem:(k,v)=>{values.set(k,v);}}));const original=draft(power());const corrected=draft(power("12000"));expect(adapter.save({method:"calculator",draft:corrected,reviewed:false,lastReviewedDraft:original})).toBeNull();expect(adapter.load().state.lastReviewedDraft).toEqual(original);same(result(adapter.load().state.draft).totals.scope2.value,"user-corrected-activity","current_scope2");values.set(CALCULATOR_KEY,'{"draft":{}}');expect(adapter.load().warning).toContain("could not be restored");});
});

// M4.4 owner-approved extensions: existing calculator inputs through canonical mapping/session.
import { calculatorMappings, decimalAnswer } from "../../src/application/calculator-mapping";
import { assessmentCatalog, selectedQuestions } from "../../src/application/assessment-catalog";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { createAssessmentModel } from "../../src/features/assessment/model";
const mappingCatalog = assessmentCatalog(loadCanonicalConfig().config);
const mappingProfile = { country: "China", companyName: "Example workshop", industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarket: "EU", targetBuyer: "Enterprise", businessGoal: "Prepare for procurement questionnaires", subindustry: "", notes: "" };
const mappingModel = createAssessmentModel(mappingCatalog.version, p => selectedQuestions(mappingCatalog, p));
const mappedQuestions = selectedQuestions(mappingCatalog, mappingProfile);
function mappedDraft() { const d = draft(power()); d.revenue.amount = "100000"; return d; }
it("maps canonical IDs and exact units, leaving renewable share and incomplete values unavailable", () => {
 const rows = calculatorMappings(mappedDraft(), mappedQuestions);
 expect(rows.find(r => r.metricId === "carbon_intensity_manuf")?.raw).toBe("0.00005703");
 expect(rows.find(r => r.metricId === "energy_intensity_manuf")?.raw).toBe("0.1");
 expect(rows.filter(r => r.metricId === "MET_RE_SHARE").every(r => r.raw === null)).toBe(true);
 const d = mappedDraft(); d.coverage.energy = false;
 expect(calculatorMappings(d,mappedQuestions).find(r => r.metricId === "energy_intensity_manuf")?.raw).toBeNull();
 d.periodEnd = "2025-06-30"; expect(calculatorMappings(d,mappedQuestions).every(r => r.raw === null)).toBe(true);
 const q = mappedQuestions.find(q => q.metricId === "energy_intensity_manuf")!;
 expect(calculatorMappings(mappedDraft(),[{...q, unit:"MWh/USD"}])[0]?.raw).toBeNull();
 expect(Number(decimalAnswer(1e-9))).toBe(1e-9); expect(decimalAnswer(1e-9)).not.toContain("e");
});
it("confirms only selected answers, persists provenance and preserves manual correction on invalidation", () => {
 const d = mappedDraft(); const initial = {...mappingModel.initialSession(), profile: mappingProfile, answers: {"U-001":"No", "I-062":"0.7"}};
 let state = mappingModel.assessmentReducer(initial, {type:"calculator-apply", draft:d, questionIds:["I-056"]});
 expect(state.answers).toEqual({"U-001":"No","I-062":"0.7","I-056":"0.00005703"});
 state = mappingModel.sessionSchema.parse(JSON.parse(JSON.stringify(state)));
 expect(state.calculatorTransfer?.draft.activities[0]?.quantity).toBe("10000");
 state = mappingModel.assessmentReducer(state,{type:"answer",id:"I-056",raw:"0.2"});
 state = mappingModel.assessmentReducer(state,{type:"calculator-invalidate"});
 expect(state.answers["I-056"]).toBe("0.2"); expect(state.answers["I-062"]).toBe("0.7");
 state = mappingModel.assessmentReducer(state,{type:"calculator-apply",draft:d,questionIds:["I-056","I-062"]});
 state = mappingModel.assessmentReducer(state,{type:"calculator-invalidate"});
 expect(state.answers).toEqual({"U-001":"No"});
});
it("fills duplicate canonical metrics once per destination, skips confirmed entries and permits revisiting", () => {
 const d = draft(source("waste","10","",{diverted:"4",hazardous:"1"}));
 const rows = calculatorMappings(d,mappedQuestions).filter(r=>r.metricId === "waste_diverted_percent");
 expect(rows.length).toBeGreaterThan(0); expect(rows.every(r=>r.raw === "40")).toBe(true);
 const ids=rows.map(r=>r.questionId);
 let state=mappingModel.assessmentReducer({...mappingModel.initialSession(),profile:mappingProfile},{type:"calculator-apply",draft:d,questionIds:ids});
 for(const id of ids) expect(state.answers[id]).toBe("40");
 const index=mappedQuestions.findIndex(q=>q.id===ids[0]);
 state={...state,phase:"questions",activeId:mappedQuestions[index-1]!.id};
 state=mappingModel.assessmentReducer(state,{type:"next"}); expect(ids).not.toContain(state.activeId);
 state=mappingModel.assessmentReducer(state,{type:"jump",id:ids[0]!}); expect(state.activeId).toBe(ids[0]);
 state=mappingModel.assessmentReducer(state,{type:"skip"}); expect(state.answers[ids[0]!]).toBeUndefined();
});
it("keeps annual water source breakdown, genuine zeros and missing revenue separate",()=>{
 const d=draft(source("water","600"),source("water","400","",{id:"ground",source:"ground"}));
 const rows=calculatorMappings(d,mappingCatalog.questions);
 expect(rows.filter(r=>r.metricId==="water_withdrawal_m3").every(r=>r.raw==="1000")).toBe(true);
 expect(rows.filter(r=>r.metricId.startsWith("water_intensity_")).every(r=>r.raw===null)).toBe(true);
 d.activities.forEach(a=>a.quantity="0"); d.revenue.amount="100000";
 expect(calculatorMappings(d,mappingCatalog.questions).find(r=>r.metricId==="water_intensity_manuf")?.raw).toBe("0");
});

import { calculatorEligible } from "../../src/application/calculator";
import { recommendationRequestFromSession } from "../../src/application/recommendations/request";
import { inputIdentityText } from "../../src/application/recommendations/identity";
import { assemblePrompt, prepareEvidence } from "../../src/application/recommendations/prepare";
import { recommendationPolicy } from "../../src/application/recommendations/policy";
import { config as recommendationConfig, score as recommendationScore } from "../helpers/recommendation-fixture";
it("requires explicit supported country and preserves old sessions and manual answers",()=>{
 expect(calculatorEligible("China")).toBe(true); expect(calculatorEligible(" china ")).toBe(true);
 for(const country of [undefined,"","Japan"]) expect(calculatorEligible(country)).toBe(false);
 const old={...mappingModel.initialSession(),profile:{...mappingProfile,country:undefined},answers:{"U-001":"No"}};
 expect(mappingModel.sessionSchema.parse(JSON.parse(JSON.stringify(old))).answers).toEqual(old.answers);
 expect(mappingModel.assessmentReducer(old,{type:"calculator-apply",draft:mappedDraft(),questionIds:["I-056"]}).answers).toEqual(old.answers);
 let state=mappingModel.assessmentReducer({...old,profile:mappingProfile},{type:"calculator-apply",draft:mappedDraft(),questionIds:["I-056","I-062"]});
 state=mappingModel.assessmentReducer(state,{type:"answer",id:"I-062",raw:"0.3"});
 state=mappingModel.assessmentReducer(state,{type:"profile",field:"country",value:"Japan"});
 expect(state.answers).toEqual({"U-001":"No","I-062":"0.3"});
 const japanProfile={...mappingProfile,country:"Japan"};
 expect(selectedQuestions(mappingCatalog,japanProfile)).toEqual(mappedQuestions);
});
it("carries country and region to the LLM prompt and freshness identity without changing retrieval or scores",()=>{
 const session={...mappingModel.initialSession(),profile:mappingProfile,answers:{"U-001":"No","U-002":"Yes"}};
 const request=recommendationRequestFromSession(session);
 expect(request.country).toBe("China"); expect(request.context.location).toBe("APAC");
 const evidence=prepareEvidence(recommendationConfig,request,recommendationPolicy);
 const prompt=assemblePrompt(request,recommendationScore,evidence);
 expect(prompt.sme).toMatchObject({country:"China",company_location:"APAC"});
 expect(prompt.prompt).toContain('"country": "China"');
 expect(prompt.system).toContain("country, region");
 const changed={...request,country:"Japan"};
 expect(inputIdentityText(changed)).not.toBe(inputIdentityText(request));
 expect(prepareEvidence(recommendationConfig,changed,recommendationPolicy).ranked).toEqual(evidence.ranked);
 expect(assemblePrompt(changed,recommendationScore,evidence).scoring).toEqual(prompt.scoring);
});

import { countries, countrySchema } from "../../src/application/countries";
import { profileErrors } from "../../src/features/assessment/model";
it("validates listed countries while retaining absent legacy country and unsupported-country recommendations",()=>{
 expect(countries).toHaveLength(249);
 expect(countrySchema.parse(undefined)).toBeUndefined();expect(countrySchema.parse("")).toBe("");
 expect(countrySchema.parse("china")).toBe("China");expect(countrySchema.parse("Japan")).toBe("Japan");
 expect(countrySchema.safeParse("Atlantis").success).toBe(false);
 expect(profileErrors({...mappingProfile,country:"Atlantis"}).country).toContain("Choose a country");
 const session={...mappingModel.initialSession(),profile:{...mappingProfile,country:"Japan"},answers:{"U-001":"No"}};
 expect(recommendationRequestFromSession(session).country).toBe("Japan");
 expect(calculatorEligible(session.profile.country)).toBe(false);
 const old={...session,profile:{...session.profile,country:undefined}};
 expect(mappingModel.sessionSchema.parse(JSON.parse(JSON.stringify(old))).answers).toEqual(old.answers);
 expect(recommendationRequestFromSession(old).country).toBeUndefined();
});

it("M4.5 transfers renewable total energy to U-026 using the existing mixed-energy oracle",()=>{
 const d=draft({...power(),renewable:"2000"},source("gas","10000","legacy-C13",{renewable:"0"}));
 const row=calculatorMappings(d,mappedQuestions).find(r=>r.questionId==="U-026")!;
 expect(row.metricId).toBe("MET_RE_SHARE");expect(row.unit).toBe("%");
 expect(Number(row.raw)).toBe(expected("renewable-share-separate","renewable_total_energy_share"));
 expect(Number(row.raw)).not.toBe(expected("renewable-share-separate","renewable_electricity_share"));
 const transferred=mappingModel.assessmentReducer({...mappingModel.initialSession(),profile:mappingProfile},{type:"calculator-apply",draft:d,questionIds:["U-026"]});
 expect(transferred.answers["U-026"]).toBe("10");
 d.activities[0]!.renewable="";
 expect(calculatorMappings(d,mappedQuestions).find(r=>r.questionId==="U-026")?.raw).toBeNull();
});

it("explains absent therm conversion without asking for an already entered renewable zero",()=>{
 const d=draft(source("gas","5000","legacy-C15",{site:"",source:"gas therm",unit:"therm",renewable:"0"}));
 const before=JSON.stringify(d);
 expect(unavailableMetricReason("renewable",d)).toContain("Energy conversion is unavailable for gas therm");
 expect(unavailableMetricReason("renewable",d)).not.toContain("Enter the known portion");
 expect(result(d).renewableEnergyShare).toBeNull();expect(JSON.stringify(d)).toBe(before);
});
