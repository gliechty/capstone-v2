// Presentation fixture only. Never use as a scoring or recommendation fallback.
// These independent example values are not calculated from assessment answers.
export const resultsPreview = {
  version: "results-layout-example-v1",
  title: "A clearer view of what comes next.",
  notice: "Representative mock results only. These numbers and narratives are fixed layout examples, not calculated from your answers. They are not an assessment of your business.",
  overall: [
    { label: "Raw overall score", value: 58 },
    { label: "Industry-weighted score", value: 54 },
  ],
  categories: [
    { name: "People", value: 76, token: "people" },
    { name: "Governance", value: 62, token: "governance" },
    { name: "Community", value: 48, token: "community" },
    { name: "Resources", value: 30, token: "resources" },
  ],
  summary: "In this fictional example, people-related practices are more developed than environmental measurement. The sample narrative highlights gaps in records and accountability, then turns them into a short sequence of actions. It demonstrates the intended reading experience; it is not a finding about your company.",
  gaps: [
    { id: "example-gap-records", category: "Resources", title: "An incomplete operational picture", detail: "The fictional business has energy records in several places, with no consistent reporting period.", why: "A consistent record would make the information easier to interpret and review." },
    { id: "example-gap-owner", category: "Governance", title: "Responsibility is not documented", detail: "The fictional business has no named owner for checking sustainability information.", why: "Clear responsibility would make follow-through and review easier." },
  ],
  actions: [
    { id: "example-action-records", category: "Resources", title: "Bring energy records into one place", rationale: "Addresses the example gap in operational records.", action: "Collect the fictional site's energy records for one reporting period and note any missing months." },
    { id: "example-action-owner", category: "Governance", title: "Name an owner and a review date", rationale: "Addresses the example gap in accountability.", action: "Identify who would maintain the record and agree when it should next be checked." },
    { id: "example-action-community", category: "Community", title: "Make existing activities visible", rationale: "Shows how an additional action could appear in the ranked narrative.", action: "Describe one fictional community activity, its purpose and the records that would support it." },
  ],
} as const;

// No calculations, thresholds or readiness labels belong in this fixture.
