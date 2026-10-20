import type { Citation } from "./contracts";
import type { PreparedEvidence } from "./prepare";
const key = (c: Citation) => JSON.stringify([c.doc_title,c.source,c.pages_or_section,c.link]);
// Targeted GROUNDING-001 regression guard, not a general entailment classifier.
const concepts = [
  /whistle[- ]?blow|grievance|speak[- ]?up|report(?:ing)? (?:channel|misconduct)/i,
  /confidential|anonym/i,
  /non[- ]?retaliat|protect[^.]{0,35}retaliat|without[^.]{0,20}retaliat/i,
];
export function unsupportedClaimCitations(text: string, citations: Citation[], evidence: PreparedEvidence) {
  if (!concepts[0]!.test(text)) return [];
  const required = concepts.filter(pattern => pattern.test(text));
  return citations.flatMap((citation,index) => {
    const excerpts = evidence.citations.flatMap((c,i) => key(c) === key(citation) ? [evidence.chunks[i]!.record.chunk_text] : []);
    return required.every(pattern => excerpts.some(excerpt => pattern.test(excerpt))) ? [] : [index];
  });
}

// Bounded guards for the owner-reported unknown-tracking and measured-ROI
// defects. These are not general semantic entailment or financial analysis.
export function unsupportedAssessmentClaims(text: string, missingQuestions: readonly { title: string }[]) {
  const clauses = text.split(/[.!?;\n]+/);
  const unknownTracking = ["energy", "water", "waste"].filter(topic => missingQuestions.some(q =>
    new RegExp(`\\b${topic}\\b`, "i").test(q.title) && /track|monitor|measure|record/i.test(q.title)));
  const issues = new Set<string>();
  for (const clause of clauses) {
    // Conditional proposals and explicit uncertainty are legitimate advice.
    const conditional = /\b(?:if|whether)\b|no (?:data|information|answers?|responses?|evidence)\b|not known|unknown|cannot (?:confirm|determine)|not (?:yet )?(?:established|confirmed)/i.test(clause);
    if (!conditional && unknownTracking.some(topic =>
      new RegExp(`\\b(?:no|lack(?:s|ing)?|absence of|without)\\b[^,;.!?]{0,70}\\b${topic}\\s+(?:tracking|monitoring|measurement|records?)\\b|\\b(?:does not|doesn't|not)\\s+(?:currently\\s+)?(?:track|monitor|measure|record)\\b[^,;.!?]{0,40}\\b${topic}\\b`, "i").test(clause))) issues.add("unknown_answer_as_absence");
    const roi = /\bROI\b|return on investment|payback/i.test(clause);
    const qualified = /\b(?:estimate|estimating|evaluate|evaluating|assess|compare|calculate)\b|not (?:been )?(?:calculated|measured|established)|no (?:calculated|measured)|cannot (?:calculate|claim|determine)|uncalculated|unmeasured/i.test(clause);
    if (roi && !qualified && (/highest[- ]ROI|(?:highest|best|greatest|maximum) (?:financial )?return|(?:calculated|measured|guaranteed) (?:ROI|return)|\bROI\b[^,;.!?]{0,30}\d|\d[^,;.!?]{0,30}\b(?:ROI|payback)\b/i.test(clause))) issues.add("unsupported_roi_claim");
  }
  return [...issues];
}
