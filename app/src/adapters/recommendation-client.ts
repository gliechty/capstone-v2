import type { ProviderStatus } from "./recommendations/configuration";
import type { RecommendationRequest } from "../application/recommendations/contracts";
import type { RecommendationResult } from "../application/recommendations/service";
const endpoint = "/api/assessment-recommendations";
export async function recommendationStatus(signal: AbortSignal): Promise<ProviderStatus> {
  const response = await fetch(endpoint, { signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]), cache: "no-store" });
  if (!response.ok) throw new Error("configuration_unavailable");
  return response.json();
}
export async function requestRecommendations(input: RecommendationRequest, configuration: ProviderStatus, signal: AbortSignal): Promise<RecommendationResult & { configuration?: ProviderStatus }> {
  const deadline = AbortSignal.timeout(45000);
  try {
    const response = await fetch(endpoint, { method: "POST", signal: AbortSignal.any([signal, deadline]), cache: "no-store", headers: { "Content-Type": "application/json", "x-recommendation-configuration": configuration.fingerprint }, body: JSON.stringify(input) });
    return await response.json();
  } catch (error) {
    if (deadline.aborted && !signal.aborted) throw new Error("generation_client_timeout", { cause: error });
    throw error;
  }
}
export async function browserInputHash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
