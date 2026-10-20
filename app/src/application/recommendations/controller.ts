import type { ProviderStatus } from "../../adapters/recommendations/configuration";
import type { RecommendationRequest } from "./contracts";
import type { RecommendationResult } from "./service";
import { inputIdentityText } from "./identity";
export type RecommendationView = { phase: "idle" | "loading" | "available" | "unavailable"; code: string; configuration: ProviderStatus | null;
  result?: Extract<RecommendationResult, { status: "available" | "test_only" }>;
  diagnostics?: { totalMs: number; providerMs: number; timeoutStage?: string; headersMs?: number; bodyMs?: number; issues: string[] }; };
export function createRecommendationController(ports: {
  read: () => RecommendationRequest | null;
  status: (signal: AbortSignal) => Promise<ProviderStatus>;
  generate: (input: RecommendationRequest, configuration: ProviderStatus, signal: AbortSignal) => Promise<RecommendationResult & { configuration?: ProviderStatus }>;
  hash: (value: string) => Promise<string>;
  publish: (view: RecommendationView) => void;
}) {
  let revision = 0; let disposed = false; let busy = false;
  let current = ""; let config: ProviderStatus | null = null;
  let controller: AbortController | null = null;
  let view: RecommendationView = { phase: "idle", code: "not_generated", configuration: null };
  const publish = (next: RecommendationView) => { view = next; if (!disposed) ports.publish(view); };
  const read = () => { try { return ports.read(); } catch { return null; } };
  const key = () => { const input = read(); return input ? inputIdentityText(input) : ""; };
  function invalidate(code = "not_generated") {
    revision++; controller?.abort(); controller = null; busy = false;
    publish({ phase: "idle", code, configuration: config });
  }
  async function refresh(force = false) {
    if (disposed) return;
    const next = key();
    if (force || next !== current) { current = next; invalidate(); }
    if (!current) { config = null; publish({ phase: "idle", code: "no_assessment", configuration: null }); return; }
    const version = revision; const checkedInput = current;
    try {
      const status = await ports.status(new AbortController().signal);
      if (disposed || version !== revision || checkedInput !== key()) return;
      if (config && JSON.stringify(config) !== JSON.stringify(status)) invalidate("configuration_changed");
      config = status;
      publish({ ...view, configuration: config, code: !config.ready ? config.code : view.code });
    } catch { if (!disposed && version === revision) { config = null; invalidate("configuration_unavailable"); } }
  }
  async function generate() {
    if (disposed || busy) return;
    const input = read(); if (!input) { invalidate("no_assessment"); return; }
    const previousResult = current === inputIdentityText(input) ? view.result : undefined;
    current = inputIdentityText(input); busy = true;
    const version = ++revision; controller = new AbortController(); const signal = controller.signal;
    const fresh = () => !disposed && !signal.aborted && version === revision && current === key();
    publish({ phase: "loading", code: "generating", configuration: config, result: previousResult });
    try {
      const status = await ports.status(signal); if (!fresh()) return;
      config = status;
      if (!status.ready) { publish({ phase: "unavailable", code: status.code, configuration: status }); return; }
      if (status.sessionVersion !== input.configVersion) { publish({ phase: "unavailable", code: "configuration_changed", configuration: status }); return; }
      const expectedId = await ports.hash(current); if (!fresh()) return;
      const result = await ports.generate(input, status, signal); if (!fresh()) return;
      const after = await ports.status(signal); if (!fresh()) return;
      if (JSON.stringify(after) !== JSON.stringify(status) || (result.status === "available" && JSON.stringify(result.configuration) !== JSON.stringify(status))) {
        publish({ phase: "unavailable", code: "configuration_changed", configuration: after }); return;
      }
      if (result.status !== "available") { publish({ phase: "unavailable", code: result.status === "unavailable" ? result.code : "invalid_output", configuration: status, result: previousResult, diagnostics: result.status === "unavailable" && result.metrics ? { totalMs: result.metrics.totalMs, providerMs: result.metrics.providerMs, timeoutStage: result.metrics.timeoutStage, headersMs: result.metrics.providerDiagnostic?.headersMs, bodyMs: result.metrics.providerDiagnostic?.bodyMs, issues: result.issues?.map(issue => issue.code) ?? [] } : undefined }); return; }
      const id = result.identity;
      if (id.inputId !== expectedId || id.configVersion !== status.configVersion || id.methodVersion !== status.methodVersion || id.promptVersion !== status.promptVersion || id.policyVersion !== status.policyVersion ||
        id.provider.id !== status.settings?.provider || id.provider.model !== status.settings.model ||
        id.provider.settings?.reasoning !== status.settings.reasoning || id.provider.settings?.timeoutMs !== status.settings.timeoutMs || id.provider.settings?.maxOutputTokens !== status.settings.maxOutputTokens) {
        publish({ phase: "unavailable", code: "stale_response", configuration: status }); return;
      }
      publish({ phase: "available", code: "available", result, configuration: status });
    } catch (error) { if (fresh()) publish({ phase: "unavailable", code: error instanceof Error && error.message === "generation_client_timeout" ? "client_timeout" : "provider_failure", configuration: config }); }
    finally { if (version === revision) { busy = false; if (!fresh()) invalidate("not_generated"); } }
  }
  return { refresh, generate, recoverInterrupted: () => { if (!busy && !disposed) publish({ phase: "unavailable", code: "interrupted", configuration: config }); }, cancel: () => invalidate("cancelled"), dispose: () => { disposed = true; invalidate(); } };
}
