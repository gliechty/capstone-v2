import { z } from "zod";
import source from "../../config/assessment-setup-v1.json" with { type: "json" };
const choice = z.strictObject({ label: z.string().min(1), value: z.string().min(1) });
const choices = z.array(choice).min(1).refine(rows => new Set(rows.map(row => row.value)).size === rows.length, "Duplicate setup choice");
const setupSchema = z.strictObject({
  version: z.string().min(1),
  provenance: z.strictObject({ source: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/), widgets: z.record(z.string(), z.string()), secondary_market_widget: z.string() }),
  options: z.strictObject({ industry: choices, companySize: choices, location: choices, targetMarket: choices, targetBuyer: choices, businessGoal: choices }),
});
// Preserved widget vocabularies are versioned configuration, not inferred from multiplier rows.
export const setupConfig = setupSchema.parse(source);
export type SetupOptions = typeof setupConfig.options;
export function marketValues(value: string): string[] { return value ? value.split(";") : []; }
export function toggleMarket(value: string, market: string): string {
  const selected = marketValues(value);
  if (selected.includes(market)) return selected.filter(item => item !== market).join(";");
  return selected.length < 2 ? [...selected, market].join(";") : value;
}

