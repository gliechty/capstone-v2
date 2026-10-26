import { expect, test } from "vitest";
import { groupCitations } from "../../src/features/results/evidence-controls";
test("bibliography groups document identity and preserves overlapping section provenance",()=>{
 const a={doc_title:"Document",source:"Publisher",link:"https://example.org",pages_or_section:"pp. 34-35"};
 expect(groupCitations([a,{...a,pages_or_section:"p. 35"},a,{...a,source:"Other edition"}])).toEqual([
 {title:a.doc_title,source:a.source,link:a.link,sections:["pp. 34-35","p. 35"]},
 {title:a.doc_title,source:"Other edition",link:a.link,sections:["pp. 34-35"]}]);
});
