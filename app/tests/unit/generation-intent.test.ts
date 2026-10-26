import { afterEach, expect, test, vi } from "vitest";
import { authorizeResultsGeneration, consumeResultsGeneration, clearResultsGeneration } from "../../src/application/recommendations/generation-intent";
import { recommendationRequestSchema } from "../../src/application/recommendations/contracts";
const input = recommendationRequestSchema.parse({configVersion:"test",companyName:"Synthetic",subindustry:"",notes:"",context:{industry:"Manufacturing (Industrial / Components)",companySize:"251 - 500",location:"APAC",targetMarkets:["EU"],targetBuyer:"Enterprise",businessGoal:"Investor readiness"},answers:{"U-001":"No","U-002":"Yes"}});
afterEach(() => { clearResultsGeneration(); vi.useRealTimers(); });
test("mounting without explicit consent never grants generation", () => { expect(consumeResultsGeneration(input)).toBe(false); });
test("one intent is claimed once, including duplicate and remount consumers", () => { authorizeResultsGeneration(input); expect(consumeResultsGeneration(input)).toBe(true); expect(consumeResultsGeneration(input)).toBe(false); });
test("changed notes or missing assessment discard the intent", () => { authorizeResultsGeneration(input); expect(consumeResultsGeneration({...input,notes:"Changed"})).toBe(false); expect(consumeResultsGeneration(input)).toBe(false); authorizeResultsGeneration(input); expect(consumeResultsGeneration(null)).toBe(false); });
test("expired handoff cannot later generate on navigation", () => { vi.useFakeTimers(); authorizeResultsGeneration(input); vi.advanceTimersByTime(15001); expect(consumeResultsGeneration(input)).toBe(false); });
