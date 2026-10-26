import { afterEach, expect, test, vi } from "vitest";
import { recommendationPolicy } from "../../src/application/recommendations/policy";
import { readProviderConfiguration } from "../../src/adapters/recommendations/configuration";
import { openAIProvider, outputSchema } from "../../src/adapters/recommendations/openai";
import { createLocalAdmission, isLocalRequest } from "../../src/adapters/recommendations/local-boundary";
import { createRecommendationService } from "../../src/application/recommendations/service";
import { config, input, validTestContent, score } from "../helpers/recommendation-fixture";
const settings = { provider: "openai" as const, model: "gpt-5.4-mini" as const, reasoning: "low" as const, timeoutMs: 10000, maxOutputTokens: 4000 };
const envelope = (patch = {}) => ({ model: "gpt-5.4-mini-2026-03-17", status: "completed", usage: { input_tokens: 50, output_tokens: 30 }, output: [{ type: "reasoning" }, { type: "message", role: "assistant", content: [{ type: "output_text", text: JSON.stringify(validTestContent()) }] }], ...patch });
const request = () => ({ system: "system", prompt: "synthetic", maxOutputTokens: 4000, signal: new AbortController().signal });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
test("explicit runtime configuration, bounded settings, rotation and safe descriptors", () => {
  expect(readProviderConfiguration({}).status).toMatchObject({ ready: false, code: "provider_not_configured" });
  const env = { RECOMMENDATION_PROVIDER: "openai", RECOMMENDATION_MODEL: "gpt-5.4-mini", OPENAI_API_KEY: "sentinel-not-a-real-key" };
  expect(readProviderConfiguration(env).status.ready).toBe(true);
  expect(readProviderConfiguration(env).status.settings?.timeoutMs).toBe(30000);
  expect(readProviderConfiguration({ ...env, RECOMMENDATION_TIMEOUT_MS: "10000" }).status.settings?.timeoutMs).toBe(10000);
  expect(readProviderConfiguration({ ...env, RECOMMENDATION_TIMEOUT_MS: "30000" }).status.settings?.timeoutMs).toBe(30000);
  expect(readProviderConfiguration({ ...env, RECOMMENDATION_TIMEOUT_MS: "10000" }).status.fingerprint).not.toBe(readProviderConfiguration(env).status.fingerprint);
  expect(JSON.stringify(readProviderConfiguration(env).status)).not.toContain(env.OPENAI_API_KEY);
  expect(readProviderConfiguration({ ...env, OPENAI_API_KEY: "" }).status.code).toBe("credentials_missing");
  for (const patch of [{ RECOMMENDATION_MODEL: "other" }, { RECOMMENDATION_REASONING: "unsupported" }, { RECOMMENDATION_TIMEOUT_MS: "30001" }, { RECOMMENDATION_MAX_OUTPUT_TOKENS: "8001" }]) expect(readProviderConfiguration({ ...env, ...patch }).status.code).toBe("configuration_invalid");
  expect(readProviderConfiguration({ ...env, CAPSTONE_OFFLINE_TESTS: "1" }).status.ready).toBe(false);
  expect(readProviderConfiguration({ ...env, OPENAI_API_KEY: "replacement" }).apiKey).toBe("replacement");
  expect(readProviderConfiguration({ ...env, RECOMMENDATION_REASONING: "medium" }).status.fingerprint).not.toBe(readProviderConfiguration(env).status.fingerprint);
});
test("Responses request has strict schema, explicit settings, no retention/tools/retry and isolates credentials", async () => {
  const transport = vi.fn<typeof fetch>(async () => Response.json(envelope()));
  const provider = openAIProvider(settings, "sentinel-not-a-real-key", transport);
  expect(await provider.generate(request())).toMatchObject({ usage: { inputTokens: 50, outputTokens: 30 }, actualModel: "gpt-5.4-mini-2026-03-17" });
  expect(transport).toHaveBeenCalledOnce();
  const [url, init] = transport.mock.calls[0]!;
  expect(url).toBe("https://api.openai.com/v1/responses"); expect(init?.redirect).toBe("error");
  const body = JSON.parse(String(init?.body));
  expect(body).toMatchObject({ model: settings.model, store: false, reasoning: { effort: "low" }, max_output_tokens: 4000, text: { format: { strict: true, type: "json_schema" } } });
  expect(body).not.toHaveProperty("tools"); expect(JSON.stringify(body)).not.toContain("sentinel-not-a-real-key");
  function inspect(value: unknown) { if (!value || typeof value !== "object") return; const obj = value as Record<string, unknown>;
    if (obj.type === "object") { expect(obj.additionalProperties).toBe(false); expect(obj.required).toEqual(Object.keys(obj.properties as object)); }
    expect(obj).not.toHaveProperty("format"); for (const child of Object.values(obj)) inspect(child);
  }
  inspect(outputSchema);
  expect(Buffer.byteLength(JSON.stringify(outputSchema))).toBeLessThan(8192);
});
test.each([[401, {}, "authentication_failed"], [403, {}, "authentication_failed"], [429, { error: { code: "insufficient_quota", message: "secret" } }, "quota_exceeded"], [429, {}, "rate_limited"], [500, {}, "provider_failure"]])("safe HTTP failure %s", async (status, body, code) => {
  const transport = vi.fn<typeof fetch>(async () => Response.json(body, { status: Number(status) }));
  await expect(openAIProvider(settings, "secret", transport).generate(request())).rejects.toMatchObject({ code });
  expect(transport).toHaveBeenCalledOnce();
});
test.each([
  [envelope({ status: "incomplete" }), "incomplete_output"],
  [envelope({ output: [{ type: "message", role: "assistant", content: [{ type: "refusal" }] }] }), "refused"],
  [envelope({ model: "another-model" }), "invalid_response"],
  [envelope({ output: [] }), "invalid_response"], [{ unexpected: "secret" }, "invalid_response"],
])("invalid envelope fails explicitly (%#)", async (body, code) => {
  await expect(openAIProvider(settings, "secret", async () => Response.json(body)).generate(request())).rejects.toMatchObject({ code });
});
test("malformed and oversized responses, transport failures and offline fence never leak secrets", async () => {
  for (const text of ["not json", "x".repeat(200001)]) await expect(openAIProvider(settings, "secret", async () => new Response(text)).generate(request())).rejects.toMatchObject({ code: "invalid_response" });
  const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
  await expect(openAIProvider(settings, "secret").generate(request())).rejects.toMatchObject({ code: "provider_not_configured" }); expect(fetch).not.toHaveBeenCalled();
  const provider = openAIProvider(settings, "secret", async () => { throw new Error("secret-key and sensitive input"); });
  const result = await createRecommendationService({ loadConfig: () => config, provider })(input);
  expect(result).toMatchObject({ code: "provider_failure", assessment: { rawOverall: score.rawOverall } }); expect(JSON.stringify(result)).not.toContain("secret-key");
});
test("adapter preserves generated prose and usage while deterministic scores remain authoritative", async () => {
  const service = (body: unknown) => createRecommendationService({ loadConfig: () => config, provider: openAIProvider(settings, "secret", async () => Response.json(body)) });
  expect(await service(envelope())(input)).toMatchObject({ status: "available", metrics: { usage: { inputTokens: 50, outputTokens: 30 } } });
  const content = validTestContent(); content.executive_summary += " The score is 99.";
  const result = await service(envelope({ output: [{ type: "message", role: "assistant", content: [{ type: "output_text", text: JSON.stringify(content) }] }] }))(input);
  expect(result).toMatchObject({ status: "available", content, assessment: { rawOverall: score.rawOverall }, metrics: { usage: { inputTokens: 50 } } });
});
test("local admission rejects cross-origin/non-loopback, duplicate calls and sixth attempt", () => {
  expect(isLocalRequest(new Request("http://localhost/api", { headers: { Origin: "http://localhost" } }), true)).toBe(true);
  for (const [url, headers] of [["https://example.com/api", {}], ["http://localhost/api", {}], ["http://localhost/api", { Origin: "https://evil.test" }], ["http://localhost/api", { Origin: "http://localhost", "x-forwarded-for": "1.2.3.4" }]] as const) expect(isLocalRequest(new Request(url, { headers }), true)).toBe(false);
  expect(isLocalRequest(new Request("http://localhost:3100/api", { headers: { Host: "127.0.0.1:3100", Origin: "http://127.0.0.1:3100", "x-forwarded-for": "127.0.0.1" } }), true)).toBe(true);
  expect(isLocalRequest(new Request("http://localhost:3100/api", { headers: { Host: "evil.example:3100", Origin: "http://evil.example:3100" } }), true)).toBe(false);
  let now = 0; const admit = createLocalAdmission(() => now); const first = admit(); expect(first.ok).toBe(true); expect(admit()).toMatchObject({ code: "busy" }); if (first.ok) first.release();
  for (let i = 0; i < 4; i++) { const slot = admit(); expect(slot.ok).toBe(true); if (slot.ok) slot.release(); }
  expect(admit()).toMatchObject({ code: "rate_limited" }); now = 60001; expect(admit().ok).toBe(true);
});

test.each(["awaiting_headers", "reading_body"] as const)("deadline identifies %s and preserves diagnostic snapshot after late completion", async stage => {
  vi.useFakeTimers();
  let finish: () => void = () => {};
  let signal: AbortSignal | undefined;
  const transport: typeof fetch = async (_url, init) => {
    signal = init!.signal as AbortSignal;
    if (stage === "awaiting_headers") await new Promise<void>(resolve => { finish = resolve; });
    if (stage === "reading_body") return new Response(new ReadableStream({ start(controller) {
      finish = () => { controller.enqueue(new TextEncoder().encode(JSON.stringify(envelope()))); controller.close(); };
    } }));
    return Response.json(envelope());
  };
  const service = createRecommendationService({ loadConfig: () => config, provider: openAIProvider(settings, "diagnostic-secret", transport), policy: { ...recommendationPolicy, timeoutMs: 10 } });
  const pending = service(input);
  await vi.advanceTimersByTimeAsync(10);
  const result = await pending;
  expect(result).toMatchObject({ code: "timeout", metrics: { timeoutStage: stage, providerDiagnostic: { stage, requestBytes: expect.any(Number) } } });
  expect(signal?.aborted).toBe(true);
  expect(result.metrics.usage).toBeUndefined();
  expect(result.metrics.preparationMs).toBeGreaterThanOrEqual(0);
  expect(result.metrics.promptBytes).toBeGreaterThan(0);
  if (stage === "reading_body") expect(result.metrics.providerDiagnostic).toMatchObject({ httpStatus: 200, headersMs: expect.any(Number) });
  else expect(result.metrics.providerDiagnostic.headersMs).toBeUndefined();
  const snapshot = JSON.stringify(result.metrics);
  finish(); await vi.advanceTimersByTimeAsync(1);
  expect(JSON.stringify(result.metrics)).toBe(snapshot);
  expect(snapshot).not.toContain("diagnostic-secret");
  expect(snapshot).not.toContain(input.companyName);
  expect(vi.getTimerCount()).toBe(0);
});

test("completed body diagnostics measure exact UTF-8 byte counts without response content", async () => {
  const text = JSON.stringify(envelope());
  let bytes = 0;
  const provider = openAIProvider(settings, "secret", async (_url, init) => {
    bytes = Buffer.byteLength(String(init!.body), "utf8");
    return new Response(text);
  });
  const result = await createRecommendationService({ loadConfig: () => config, provider })(input);
  expect(result).toMatchObject({ status: "available", metrics: { providerDiagnostic: {
    stage: "body_complete", requestBytes: bytes, responseBytes: Buffer.byteLength(text, "utf8"), httpStatus: 200,
    headersMs: expect.any(Number), bodyMs: expect.any(Number),
  } } });
  expect(result.metrics.timeoutStage).toBeUndefined();
  expect(Object.keys(result.metrics.providerDiagnostic).sort()).toEqual(["bodyMs", "headersMs", "httpStatus", "requestBytes", "responseBytes", "stage"]);
});
