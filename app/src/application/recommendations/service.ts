import "server-only";
import { createHash } from "node:crypto";
import type { CanonicalConfig } from "../../domain/config/types";
import { ScoringError } from "../../domain/scoring/score-assessment";
import { computeAssessment } from "../score-request";
import { recommendationRequestSchema, RecommendationInputError, type RecommendationProvider, type UnavailableCode } from "./contracts";
import { recommendationPolicy, recommendationPolicySchema, type RecommendationPolicy } from "./policy";
import { assemblePrompt, prepareEvidence, PROMPT_VERSION } from "./prepare";
import { validateRecommendationOutput, type OutputIssue } from "./validate-output";

// Dependencies are composed on the server. No caller-selected provider, model,
// config snapshot or scores can enter through the request contract.
export function createRecommendationService(dependencies: {
  loadConfig: () => CanonicalConfig;
  provider: RecommendationProvider;
  policy?: RecommendationPolicy;
}) {
  const policy = recommendationPolicySchema.parse(dependencies.policy ?? recommendationPolicy);
  return async (raw: unknown, signal?: AbortSignal) => {
    const parsed = recommendationRequestSchema.safeParse(raw);
    if (!parsed.success) throw new RecommendationInputError("Recommendation context or answers are invalid.");
    const input = parsed.data;
    if (new TextEncoder().encode(JSON.stringify(input)).length > policy.maxRequestBytes) throw new RecommendationInputError("Recommendation request is too large.");
    const config = dependencies.loadConfig();
    const scoreInput = { configVersion: input.configVersion, context: input.context, answers: input.answers };
    let score;
    try { score = computeAssessment(config, scoreInput); }
    catch (error) {
      if (error instanceof ScoringError) throw new RecommendationInputError("Assessment answers or configuration version are invalid. Review the assessment.");
      throw error;
    }
    const identity = {
      inputId: createHash("sha256").update(JSON.stringify({ ...input, answers: Object.fromEntries(Object.entries(input.answers).sort(([a], [b]) => a.localeCompare(b))) })).digest("hex"),
      configVersion: score.configVersion, methodVersion: score.methodVersion, policyVersion: policy.version, promptVersion: PROMPT_VERSION,
    };
    const assessment = { rawOverall: score.rawOverall, weightedOverall: score.weightedOverall, categories: score.categories, answered: score.answered, missing: score.missing };
    const evidence = prepareEvidence(config, input, policy);
    const audit = { documentIds: evidence.ranked.documents.map(d => d.record.doc_id), chunkIds: evidence.ranked.chunks.map(c => c.record.chunk_record_id),
      usableChunkIds: evidence.chunks.map(c => c.record.chunk_record_id), limitations: evidence.limitations };
    const unavailable = (code: UnavailableCode, issues: OutputIssue[] = []) => ({ status: "unavailable" as const, code, identity, assessment, evidence: audit, issues });
    if (signal?.aborted) return unavailable("cancelled");
    if (!score.answered) return unavailable("no_answers");
    if (!evidence.citations.length) return unavailable("insufficient_evidence");
    const prompt = assemblePrompt(input, score, evidence);
    if (new TextEncoder().encode(prompt.system + prompt.prompt).length > policy.maxPromptBytes) return unavailable("prompt_too_large");
    if (dependencies.provider.kind === "disabled") return unavailable("provider_not_configured");
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let cancel: (() => void) | undefined;
    const timeoutError = new Error("deadline");
    const cancelledError = new Error("cancelled");
    try {
      const deadline = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => { reject(timeoutError); controller.abort(); }, policy.timeoutMs);
        cancel = () => { reject(cancelledError); controller.abort(); };
        signal?.addEventListener("abort", cancel, { once: true });
        if (signal?.aborted) cancel();
      });
      const result = await Promise.race([
        deadline,
        Promise.resolve().then(() => {
          if (controller.signal.aborted) throw cancelledError;
          return dependencies.provider.generate({ system: prompt.system, prompt: prompt.prompt, signal: controller.signal, maxOutputTokens: policy.maxOutputTokens });
        }),
      ]);
      if (signal?.aborted) return unavailable("cancelled");
      const validated = validateRecommendationOutput(result, input, score, evidence, config, policy.maxResponseBytes);
      if (!validated.ok) return unavailable("invalid_output", validated.issues);
      return { status: dependencies.provider.kind === "test-double" ? "test_only" as const : "available" as const,
        identity, assessment, evidence: audit, content: validated.content,
        provider: { id: dependencies.provider.id, model: dependencies.provider.model },
        validation: "structural-and-reference-checks; semantic quality and source accuracy require review" as const };
    } catch (error) {
      return unavailable(error === timeoutError ? "timeout" : error === cancelledError || signal?.aborted ? "cancelled" : "provider_failure");
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
      if (cancel) signal?.removeEventListener("abort", cancel);
    }
  };
}
export type RecommendationResult = Awaited<ReturnType<ReturnType<typeof createRecommendationService>>>;
