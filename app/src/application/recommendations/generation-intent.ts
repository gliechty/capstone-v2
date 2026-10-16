import type { RecommendationRequest } from "./contracts";
import { inputIdentityText } from "./identity";
// Ephemeral SPA handoff, deliberately not persisted: reload never grants consent.
// A request is claimed synchronously before any asynchronous provider work.
let pending: { input: string; expires: number } | null = null;
export function authorizeResultsGeneration(input: RecommendationRequest) {
  pending = { input: inputIdentityText(input), expires: Date.now() + 15000 };
}
export function consumeResultsGeneration(input: RecommendationRequest | null) {
  const intent = pending; pending = null;
  return Boolean(intent && input && intent.expires >= Date.now() && intent.input === inputIdentityText(input));
}
export function clearResultsGeneration() { pending = null; }
