import type {Session} from "../../src/features/assessment/model";
import {test,expect} from "vitest";
import {assessmentReport} from "../../src/application/assessment-report";
import {syntheticSession} from "../../src/features/preview/fixtures";
import {config,input,score,evidence,validTestContent} from "../helpers/recommendation-fixture";
import {validateRecommendationOutput} from "../../src/application/recommendations/validate-output";
test("report keeps missing answers, scores, provenance and safe text without AI",()=>{
 const session=syntheticSession('test') as Session;session.profile.notes='<script>alert(1)</script>';
 const html=assessmentReport(session,score,undefined,'2026-10-19');
 expect(html).toContain('&lt;script&gt;');expect(html).not.toContain('<script>');expect(html).toContain(score.methodVersion);expect(html).toContain('AI recommendations unavailable');expect(html).toContain('Unanswered');expect(html).toContain(score.rawOverall!.toFixed(1));
});
test("migration scope: valid citation identity is accepted without topic keyword support",()=>{
 const e={...evidence,citations:[evidence.citations[0]!],chunks:[{...evidence.chunks[0]!,record:{...evidence.chunks[0]!.record,chunk_text:'Report Tier 1 and Tier 2 process safety incidents, root causes and corrective actions.'}}]};
 const c=validTestContent();c.priority_recommendations[0]!.title='Confidential whistleblower channel';c.priority_recommendations[0]!.recommended_action='Provide a grievance channel with non-retaliation.';c.priority_recommendations[0]!.evidence=e.citations;
 expect(validateRecommendationOutput(JSON.stringify(c),input,score,e,config,40000)).toEqual({ok:true,content:c});
});

test("preserved Chemicals citation identity remains eligible without claiming semantic verification",()=>{
 const chunk=config.DocumentChunks.find(c=>c.chunk_text.includes("Process Safety Incidents Count (PSIC)"))!;
 expect(chunk).toBeTruthy();const doc=config.DocumentIndex.find(d=>d.doc_id===chunk.doc_id)!;
 const citation={doc_title:doc.doc_title,source:doc.source,pages_or_section:chunk.source_section_or_page,link:doc.link.trim()};
 const e={...evidence,citations:[citation],chunks:[{...evidence.chunks[0]!,record:chunk}]};
 const c=validTestContent();c.priority_recommendations[0]!.title="Confidential whistleblower channel";c.priority_recommendations[0]!.recommended_action="Provide a grievance channel with non-retaliation.";c.priority_recommendations[0]!.evidence=[citation];c.key_gaps[0]!.evidence=[citation];
 expect(validateRecommendationOutput(JSON.stringify(c),input,score,e,config,40000)).toEqual({ok:true,content:c});
});

import {goldenCases} from "../helpers/legacy-scoring";
import {scoreAssessment} from "../../src/domain/scoring/score-assessment";
test("scenario report appends Golden hypothetical answers and combined scores without changing actual report",()=>{
 const fixture=goldenCases[0]!;
 const answers=Object.fromEntries(fixture.answers.map(a=>[a.question_id,a.answer===null?"":String(a.answer)]));
 const actual=scoreAssessment(config,fixture.profile,answers);
 const hypothetical=scoreAssessment(config,fixture.profile,{...answers,"U-034":"Yes","U-035":"8"});
 const session={...syntheticSession('test'),answers} as Session;
 const content=validTestContent(),stamp="2026-10-26";
 const original=assessmentReport(session,actual,content,stamp);
 const report=assessmentReport(session,actual,content,stamp,{score:hypothetical,answers:[
 {id:"U-034",title:actual.trace.find(q=>q.question_id==="U-034")!.question_text,actual:answers["U-034"]!,proposed:"Yes",unit:""},
 {id:"U-035",title:actual.trace.find(q=>q.question_id==="U-035")!.question_text,actual:answers["U-035"]!,proposed:"8",unit:""}]});
 expect(report.split('<section id="hypothetical-levers">')[0]).toBe(original.replace("</body></html>",""));
 expect(report).toContain(hypothetical.weightedOverall!.toFixed(2));
 expect(report).toContain((hypothetical.weightedOverall!-actual.weightedOverall!).toFixed(2));
 expect(report).toContain("Implementation may require time, expenditure and expertise; these are not estimated.");
 expect(session.answers).toEqual(answers);
});

import { createHash } from "node:crypto";
import { vi, afterEach } from "vitest";
import { assessmentCatalog } from "../../src/application/assessment-catalog";
import { constructPdfReport } from "../../src/application/pdf-report";
import { recommendationRequestFromSession } from "../../src/application/recommendations/request";
import { inputIdentityText } from "../../src/application/recommendations/identity";
import * as pdfRenderer from "../../src/adapters/report-pdf";
import { POST as pdfPost } from "../../src/app/api/assessment-report-pdf/route";
import { POST as htmlPost } from "../../src/app/api/assessment-report-html/route";
const recommendationsFor = (session: Session) => ({inputId:createHash("sha256").update(inputIdentityText(recommendationRequestFromSession(session))).digest("hex"),content:validTestContent()});
const pdfSession = () => syntheticSession(assessmentCatalog(config).version) as Session;
const pdfRequest = (body: unknown, origin = "http://localhost:3107") => new Request("http://localhost:3107/api/assessment-report-pdf", {
 method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(body),
});
afterEach(() => vi.restoreAllMocks());
test("PDF constructs only the installed report, embeds assets and rejects stale recommendation identity", async () => {
 const session = pdfSession();
 const inputId = createHash("sha256").update(inputIdentityText(recommendationRequestFromSession(session))).digest("hex");
 const result = await constructPdfReport(config, { session, recommendations: { inputId, content: validTestContent() } });
 expect(result.html).toContain("data:font/ttf;base64,");
 expect(result.html).toContain("data:image/svg+xml;base64,");
 expect(result.html).toContain(validTestContent().executive_summary);
 expect(result.html).toContain('id="portrait"');
 expect(result.html).not.toContain('id="hypothetical-levers"');
 await expect(constructPdfReport(config, {session, html:"<script>evil()</script>"})).rejects.toThrow();
 await expect(constructPdfReport(config, {session, url:"http://169.254.169.254"})).rejects.toThrow();
 await expect(constructPdfReport(config, {session, recommendations:{inputId:"0".repeat(64),content:validTestContent()}})).rejects.toThrow(/no longer match/);
});
test("PDF endpoint rejects cross-origin, oversized and arbitrary requests before rendering", async () => {
 const render = vi.spyOn(pdfRenderer, "renderReportPdf");
 expect((await pdfPost(pdfRequest({session:pdfSession()}, "https://elsewhere.example"))).status).toBe(403);
 expect((await pdfPost(pdfRequest({html:"<h1>Arbitrary</h1>"}))).status).toBe(400);
 expect((await pdfPost(pdfRequest({url:"file:///etc/passwd"}))).status).toBe(400);
 expect((await pdfPost(pdfRequest({session:pdfSession(), score:{rawOverall:100}}))).status).toBe(400);
 expect((await pdfPost(pdfRequest({data:"x".repeat(600001)}))).status).toBe(413);
 expect(render).not.toHaveBeenCalled();
});
test("PDF job admission rejects concurrent work and releases after failure for retry", async () => {
 const release = pdfRenderer.acquirePdfJob()!;
 expect((await pdfPost(pdfRequest({session:pdfSession(),recommendations:recommendationsFor(pdfSession())}))).status).toBe(503);
 release();
 const render = vi.spyOn(pdfRenderer, "renderReportPdf").mockRejectedValueOnce(new Error("private detail"))
  .mockResolvedValueOnce(Buffer.from("%PDF-test"));
 const failed = await pdfPost(pdfRequest({session:pdfSession(),recommendations:recommendationsFor(pdfSession())}));
 expect(failed.status).toBe(503);expect(await failed.text()).toContain("Please retry");
 const retry = await pdfPost(pdfRequest({session:pdfSession(),recommendations:recommendationsFor(pdfSession())}));
 expect(retry.status).toBe(200);expect(retry.headers.get("content-type")).toBe("application/pdf");
 expect(retry.headers.get("cache-control")).toBe("no-store");
 expect(render).toHaveBeenCalledTimes(2);
});
test("PDF scenarios retain actual answers and reject invented or out-of-range Levers", async () => {
 const session = pdfSession();
 const {selectImprovementLevers} = await import("../../src/application/improvement-levers");
 const request = recommendationRequestFromSession(session);
 const {computeAssessment} = await import("../../src/application/score-request");
 const actual = computeAssessment(config,{configVersion:request.configVersion,context:request.context,answers:request.answers});
 const lever = selectImprovementLevers(config,actual).levers[0]!;
 const before = JSON.stringify(session);
 const result = await constructPdfReport(config,{session,recommendations:recommendationsFor(session),scenarioAnswers:{[lever.id]:lever.best}});
 expect(result.html).toContain("The actual assessment and recommendations above are unchanged");
 expect(result.html).toContain('id="hypothetical-levers"');
 expect(JSON.stringify(session)).toBe(before);
 await expect(constructPdfReport(config,{session,recommendations:recommendationsFor(session),scenarioAnswers:{"fake":"100"}})).rejects.toThrow();
 await expect(constructPdfReport(config,{session,recommendations:recommendationsFor(session),scenarioAnswers:{[lever.id]:"not an answer"}})).rejects.toThrow();
});

import { chromium, type BrowserServer } from "playwright-core";
test("PDF renderer blocks resource requests, disables scripts and kills its browser after success or failure", async () => {
 const route = vi.fn(), evaluate = vi.fn().mockResolvedValue(undefined), pdf = vi.fn().mockResolvedValue(Buffer.from("%PDF-"));
 const page = {setDefaultTimeout:vi.fn(),setContent:vi.fn(),evaluate,pdf};
 const context = {route,newPage:vi.fn().mockResolvedValue(page)};
 vi.spyOn(chromium,"connect").mockResolvedValue({newContext:vi.fn().mockResolvedValue(context)} as never);
 const kill = vi.fn().mockResolvedValue(undefined);
 vi.spyOn(chromium,"launchServer").mockResolvedValue({wsEndpoint:()=>"ws://test",kill} as unknown as BrowserServer);
 await pdfRenderer.renderReportPdf("<html>internal test report</html>");
 const abort=vi.fn();await route.mock.calls[0]![1]({abort});
 expect(abort).toHaveBeenCalledWith("blockedbyclient");
 expect(kill).toHaveBeenCalledTimes(1);
 expect(pdf).toHaveBeenCalledWith(expect.objectContaining({preferCSSPageSize:true,printBackground:true}));
 evaluate.mockRejectedValueOnce(new Error("font failure"));
 await expect(pdfRenderer.renderReportPdf("<html>internal test report</html>")).rejects.toThrow("font failure");
 expect(kill).toHaveBeenCalledTimes(2);
});
test("PDF render deadline kills a stuck owned browser", async () => {
 vi.useFakeTimers();
 const kill=vi.fn().mockResolvedValue(undefined);
 vi.spyOn(chromium,"launchServer").mockResolvedValue({wsEndpoint:()=>"ws://test",kill} as unknown as BrowserServer);
 vi.spyOn(chromium,"connect").mockReturnValue(new Promise(()=>{}));
 try {
  const promise=pdfRenderer.renderReportPdf("internal test");
  const rejected=expect(promise).rejects.toThrow("timed out");
  await vi.advanceTimersByTimeAsync(20001);await rejected;
  expect(kill).toHaveBeenCalledOnce();
 } finally {vi.useRealTimers();}
});

test("both report endpoints require matching nonempty insights without rendering partial exports", async () => {
 const session=pdfSession();const recommendations=recommendationsFor(session);
 const render=vi.spyOn(pdfRenderer,"renderReportPdf").mockResolvedValue(Buffer.from("%PDF-test"));
 for(const endpoint of [pdfPost,htmlPost]) {
  expect((await endpoint(pdfRequest({session}))).status).toBe(409);
  expect((await endpoint(pdfRequest({session,recommendations:{...recommendations,inputId:"0".repeat(64)}}))).status).toBe(409);
  for(const field of ["key_gaps","priority_recommendations"])expect((await endpoint(pdfRequest({session,recommendations:{...recommendations,content:{...recommendations.content,[field]:[]}}}))).status).toBe(409);
 }
 expect(render).not.toHaveBeenCalled();
 const response=await htmlPost(pdfRequest({session,recommendations}));
 expect(response.status).toBe(200);expect(response.headers.get("content-type")).toContain("text/html");
 expect(response.headers.get("content-disposition")).toContain(".html");
 expect(await response.text()).toContain(recommendations.content.executive_summary);
 expect((await htmlPost(pdfRequest({session,recommendations},"https://elsewhere.example"))).status).toBe(403);
 expect((await htmlPost(pdfRequest({url:"file:///etc/passwd"}))).status).toBe(400);
});
