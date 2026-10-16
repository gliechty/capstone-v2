import { inputIdentityText } from "./identity";
import "server-only";
import { createHash } from "node:crypto";
import type { CanonicalConfig } from "../../domain/config/types";
import { ScoringError } from "../../domain/scoring/score-assessment";
import { computeAssessment } from "../score-request";
import { recommendationRequestSchema, RecommendationInputError, ProviderFailure, type ProviderDiagnostic, type TokenUsage, type RecommendationProvider, type UnavailableCode } from "./contracts";
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
    const started = performance.now();
    let usage: TokenUsage | undefined;
    let providerMs = 0;
    let preparationMs = 0;
    let promptBytes = 0;
    let diagnostic: Partial<{ stage: ProviderDiagnostic["stage"]; requestBytes: number; headersMs: number; httpStatus: number; bodyMs: number; responseBytes: number }> = {};
    let timeoutStage: ProviderDiagnostic["stage"] | "provider" | undefined;
    let acceptingDiagnostics = true;
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
      inputId: createHash("sha256").update(inputIdentityText(input)).digest("hex"),
      provider: { id: dependencies.provider.id, model: dependencies.provider.model, settings: dependencies.provider.settings ?? null },
      configVersion: score.configVersion, methodVersion: score.methodVersion, policyVersion: policy.version, promptVersion: PROMPT_VERSION,
    };
    const assessment = { rawOverall: score.rawOverall, weightedOverall: score.weightedOverall, categories: score.categories, answered: score.answered, missing: score.missing };
    const evidence = prepareEvidence(config, input, policy);
    const audit = { documentIds: evidence.ranked.documents.map(d => d.record.doc_id), chunkIds: evidence.ranked.chunks.map(c => c.record.chunk_record_id),
      usableChunkIds: evidence.chunks.map(c => c.record.chunk_record_id), limitations: evidence.limitations };
    const retrievalMs = performance.now() - started;
    const metrics = () => ({ retrievalMs, providerMs, totalMs: performance.now() - started, usage, preparationMs, promptBytes, providerDiagnostic: { ...diagnostic }, timeoutStage });
    const unavailable = (code: UnavailableCode, issues: OutputIssue[] = []) => ({ status: "unavailable" as const, code, identity, assessment, evidence: audit, issues, metrics: metrics() });
    if (signal?.aborted) return unavailable("cancelled");
    if (!score.answered) return unavailable("no_answers");
    if (!evidence.citations.length) return unavailable("insufficient_evidence");
    const prompt = assemblePrompt(input, score, evidence);
    promptBytes = new TextEncoder().encode(prompt.system + prompt.prompt).length;
    preparationMs = performance.now() - started;
    if (promptBytes > policy.maxPromptBytes) return unavailable("prompt_too_large");
    if (dependencies.provider.kind === "disabled") return unavailable("provider_not_configured");
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let cancel: (() => void) | undefined;
    const timeoutError = new Error("deadline");
    const cancelledError = new Error("cancelled");
    const providerStarted = performance.now();
    try {
      const deadline = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => { timeoutStage = diagnostic.stage ?? "provider"; acceptingDiagnostics = false; reject(timeoutError); controller.abort(); }, policy.timeoutMs);
        cancel = () => { reject(cancelledError); controller.abort(); };
        signal?.addEventListener("abort", cancel, { once: true });
        if (signal?.aborted) cancel();
      });
      const result = await Promise.race([
        deadline,
        Promise.resolve().then(() => {
          if (controller.signal.aborted) throw cancelledError;
          return dependencies.provider.generate({ system: prompt.system, prompt: prompt.prompt, signal: controller.signal, maxOutputTokens: policy.maxOutputTokens,
            onDiagnostic: event => { if (acceptingDiagnostics) diagnostic = { ...diagnostic, ...event }; } });
        }),
      ]);
      if (signal?.aborted) return unavailable("cancelled");
      providerMs = performance.now() - providerStarted;
      const envelope = result && typeof result === "object" && "text" in result ? result as { text: unknown; usage?: TokenUsage } : null;
      usage = envelope?.usage;
      const validated = validateRecommendationOutput(envelope ? envelope.text : result, input, score, evidence, config, policy.maxResponseBytes);
      if (!validated.ok) return unavailable("invalid_output", validated.issues);
      return { status: dependencies.provider.kind === "test-double" ? "test_only" as const : "available" as const,
        identity, assessment, evidence: audit, metrics: metrics(), content: validated.content,
        provider: { id: dependencies.provider.id, model: dependencies.provider.model },
        validation: "structural-and-reference-checks; semantic quality and source accuracy require review" as const };
    } catch (error) {
      providerMs = performance.now() - providerStarted;
      if (error instanceof ProviderFailure) { usage = error.usage; return unavailable(error.code); }
      return unavailable(error === timeoutError ? "timeout" : error === cancelledError || signal?.aborted ? "cancelled" : "provider_failure");
    } finally {
      acceptingDiagnostics = false;
      if (timeout !== undefined) clearTimeout(timeout);
      if (cancel) signal?.removeEventListener("abort", cancel);
    }
  };
}
export type RecommendationResult = Awaited<ReturnType<ReturnType<typeof createRecommendationService>>>;
