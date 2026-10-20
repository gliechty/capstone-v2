import type {Session} from "../../src/features/assessment/model";
import {test,expect} from "vitest";
import {assessmentReport} from "../../src/application/assessment-report";
import {syntheticSession} from "../../src/features/preview/fixtures";
import {unsupportedClaimCitations} from "../../src/application/recommendations/claim-support";
import {config,input,score,evidence,validTestContent} from "../helpers/recommendation-fixture";
import {validateRecommendationOutput} from "../../src/application/recommendations/validate-output";
test("report keeps missing answers, scores, provenance and safe text without AI",()=>{
 const session=syntheticSession('test') as Session;session.profile.notes='<script>alert(1)</script>';
 const html=assessmentReport(session,score,undefined,'2026-10-19');
 expect(html).toContain('&lt;script&gt;');expect(html).not.toContain('<script>');expect(html).toContain(score.methodVersion);expect(html).toContain('AI recommendations unavailable');expect(html).toContain('Unanswered');expect(html).toContain(score.rawOverall!.toFixed(1));
});
test("GROUNDING-001: valid citation membership cannot turn operational safety into grievance support",()=>{
 const e={...evidence,citations:[evidence.citations[0]!],chunks:[{...evidence.chunks[0]!,record:{...evidence.chunks[0]!.record,chunk_text:'Report Tier 1 and Tier 2 process safety incidents, root causes and corrective actions.'}}]};
 const c=validTestContent();c.priority_recommendations[0]!.title='Confidential whistleblower channel';c.priority_recommendations[0]!.recommended_action='Provide a grievance channel with non-retaliation.';c.priority_recommendations[0]!.evidence=e.citations;
 expect(validateRecommendationOutput(JSON.stringify(c),input,score,e,config,40000)).toMatchObject({ok:false,issues:expect.arrayContaining([expect.objectContaining({code:'unsupported_claim_citation'})])});
 expect(unsupportedClaimCitations('Review process safety incidents',e.citations,e)).toEqual([]);
 const supported={...e,chunks:[{...e.chunks[0]!,record:{...e.chunks[0]!.record,chunk_text:'Establish a confidential grievance channel and protect workers from retaliation.'}}]};
 expect(unsupportedClaimCitations('Confidential grievance channel with non-retaliation',supported.citations,supported)).toEqual([]);
});

test("the preserved Chemicals PSIC excerpt does not support whistleblower advice",()=>{
 const chunk=config.DocumentChunks.find(c=>c.chunk_text.includes("Process Safety Incidents Count (PSIC)"))!;
 expect(chunk).toBeTruthy();const doc=config.DocumentIndex.find(d=>d.doc_id===chunk.doc_id)!;
 const citation={doc_title:doc.doc_title,source:doc.source,pages_or_section:chunk.source_section_or_page,link:doc.link.trim()};
 const e={...evidence,citations:[citation],chunks:[{...evidence.chunks[0]!,record:chunk}]};
 expect(unsupportedClaimCitations("Establish confidential whistleblower reporting with non-retaliation",[citation],e)).toEqual([0]);
});
