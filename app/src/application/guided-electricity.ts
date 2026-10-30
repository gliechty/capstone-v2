import { z } from "zod";
import { initialCalculatorDraft, calculateDraft } from "./calculator";
import { calculatorMappings } from "./calculator-mapping";
import type { Question } from "./assessment-catalog";

export const electricityFactsSchema = z.object({
  description: z.string().min(1).max(3000),
  quantity: z.string().regex(/^(?:\d+(?:\.\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?)$/),
  unit: z.enum(["kWh", "MWh"]), countryCode: z.string().regex(/^[A-Z]{2}$/),
  periodStart: z.iso.date(), periodEnd: z.iso.date(),
}).strict().refine(v => Number.isFinite(Number(v.quantity.replaceAll(",", ""))) && v.periodStart <= v.periodEnd, "Check quantity and reporting dates.");
export type ElectricityFacts = z.infer<typeof electricityFactsSchema>;
export function electricityRequest(facts: ElectricityFacts, catalogId: string, clientId: string, clarification = "") {
  const v = electricityFactsSchema.parse(facts);
  if (clarification.length > 700) throw new Error("Keep clarification within 700 characters.");
  return { catalog_id: catalogId, input: { client_record_id: clientId, input_type: "manufacturing_input" as const,
    description: v.description + (clarification ? "\nUser clarification: " + clarification : ""),
    quantity: { value: v.quantity.replaceAll(",", ""), unit: v.unit } },
    context: { source_flow_role: "background_input" as const, expected_reference_unit: v.unit, expected_geography: v.countryCode } };
}
const factorSchema = z.object({status: z.enum(["available","unavailable"]), dataset_id:z.string(), mapping_approved:z.boolean(), impact_unit:z.string(), reference_unit:z.string(), value:z.string().nullable().optional(), reason:z.string().nullable().optional(), calculated_at:z.string().nullable().optional()}).passthrough();
const datasetSchema = z.object({id:z.string(),name:z.string(),reference_unit:z.string(),geography:z.string(),database_name:z.string(),database_version:z.string()}).passthrough();
export const mappingResponseSchema = z.object({request_id:z.string(),decision:z.object({
  status:z.enum(["approved","review_required","no_match","insufficient_information","decomposition_required"]), rationale:z.string(), missing_information:z.array(z.string()),
  selected_dataset:datasetSchema.nullable(), candidates:z.array(z.object({dataset:datasetSchema,emission_factor:factorSchema.nullable().optional()}).passthrough()),
  emission_factor:factorSchema.nullable().optional(),
}).passthrough()}).passthrough();
export type MappingResponse = z.infer<typeof mappingResponseSchema>;
export function mappingReview(response: MappingResponse) {
  const d=response.decision;
  return {
    status:d.status, rationale:d.rationale,
    question:d.missing_information.length ? "Can you clarify: " + d.missing_information.join("; ") + "? If unknown, say so." : d.status === "review_required" ? "Which of the listed dataset descriptions matches your actual electricity supply? State only details you know, or say unknown. Review the provider's rationale below." : null,
    questionAuthor:"MOSAIC wording derived from Laiffi's missing information/candidates; not a literal API question.",
    rows:[...(d.selected_dataset ? [{dataset:d.selected_dataset,emission_factor:d.emission_factor}] : []), ...d.candidates],
    boundary:"Laiffi's published profile is dataset_upstream. Generation-only Scope 2 compatibility and valid reporting years have not been established. No factor is transferred into Scope 1/2 answers.",
  };
}
// Quantity-only path reuses accepted M4 arithmetic/mappings. No external factor enters it.
export function electricityAnswerPreview(facts: ElectricityFacts, completeEnergy: boolean, revenue: string, questions: readonly Question[]) {
  const v=electricityFactsSchema.parse(facts);
  const draft=initialCalculatorDraft();
  draft.periodStart=v.periodStart; draft.periodEnd=v.periodEnd; draft.revenue.amount=revenue;
  draft.coverage.energy=completeEnergy ? "complete" : "incomplete";
  draft.activities=[{id:"guided-electricity",site:"",source:"User-confirmed purchased electricity",kind:"electricity",quantity:v.quantity,unit:v.unit,factorId:"",geography:v.countryCode,evidence:v.description,renewable:"",diverted:"",hazardous:""}];
  return {calculation:calculateDraft(draft), mappings:calculatorMappings(draft,questions).filter(q=>q.metricId.startsWith("energy_intensity_"))};
}
