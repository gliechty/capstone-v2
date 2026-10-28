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
