import "server-only";
import { loadCanonicalConfig } from "../config-repository";
import type { RecommendationProvider } from "../../application/recommendations/contracts";
import { createRecommendationService } from "../../application/recommendations/service";
// This is the only runtime composition. It deliberately has no network client,
// credentials or environment-driven activation. Live integration awaits approval.
const disabledProvider: RecommendationProvider = {
  id: "unconfigured", model: "unconfigured", kind: "disabled",
  async generate() { throw new Error("Recommendation provider is not configured"); },
};
export const generateRecommendations = createRecommendationService({
  loadConfig: () => loadCanonicalConfig().config, provider: disabledProvider,
});
