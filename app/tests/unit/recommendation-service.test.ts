import { afterEach, expect, test, vi } from "vitest";
import { goldenCases, goldenExpected } from "../helpers/legacy-scoring";
import { goldenAnswers } from "../helpers/golden-comparison";
import { setupConfig } from "../../src/application/assessment-setup";
import { computeAssessment } from "../../src/application/score-request";
import { prepareEvidence, scoreClosing } from "../../src/application/recommendations/prepare";
import { createRecommendationService } from "../../src/application/recommendations/service";
import { recommendationPolicy } from "../../src/application/recommendations/policy";
import { config, input, validTestContent, score, testProvider } from "../helpers/recommendation-fixture";
import { POST } from "../../src/app/api/assessment-recommendations/route";
import { POST as scorePost } from "../../src/app/api/assessment-score/route";
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
const make = (generate = async () => JSON.stringify(validTestContent())) => createRecommendationService({ loadConfig: () => config, provider: testProvider(generate) });
test("recomputes trusted scores, binds versions/input identity, and clearly tags controlled test output", async () => {
  const generate = vi.fn(async () => JSON.stringify(validTestContent()));
  const service = make(generate);
  const result = await service(input);
  expect(result.status).toBe("test_only");
  expect(result.assessment.rawOverall).toBe(score.rawOverall);
  expect(result.identity).toMatchObject({ configVersion: config.version, methodVersion: score.methodVersion, policyVersion: recommendationPolicy.version });
  expect(generate).toHaveBeenCalledOnce();
  const reordered = { ...input, answers: { "U-002": "Yes", "U-001": "No" } };
  expect((await service(reordered)).identity.inputId).toBe(result.identity.inputId);
  expect((await service({ ...input, answers: { "U-001": "Yes" } })).identity.inputId).not.toBe(result.identity.inputId);
});
test("strict requests reject supplied scores/config/provider and invalid raw answers without invoking a provider", async () => {
  const generate = vi.fn(async () => ""); const service = make(generate);
  for (const patch of [{ score: 100 }, { provider: "live" }, { config: {} }, { trace: [] }, { configVersion: "stale" }, { answers: { unknown: "Yes" } }, { answers: { "U-001": "maybe" } }, { notes: null }, { notes: "x".repeat(1001) }, { country: null }, { revenue_band: "not collected" }, { companyName: "" }]) {
    await expect(service({ ...input, ...patch })).rejects.toThrow();
  }
  expect(generate).not.toHaveBeenCalled();
});
test("empty answers, oversized prompts, and unavailable evidence do not call provider", async () => {
  const generate = vi.fn(async () => ""); const provider = testProvider(generate);
  expect(await createRecommendationService({ loadConfig: () => config, provider })({ ...input, answers: {} })).toMatchObject({ status: "unavailable", code: "no_answers", assessment: { rawOverall: null } });
  expect(await createRecommendationService({ loadConfig: () => config, provider, policy: { ...recommendationPolicy, maxPromptBytes: 10 } })(input)).toMatchObject({ code: "prompt_too_large" });
  expect(await createRecommendationService({ loadConfig: () => ({ ...config, DocumentIndex: [], DocumentChunks: [] }), provider })(input)).toMatchObject({ code: "insufficient_evidence" });
  expect(generate).not.toHaveBeenCalled();
});
test("unparseable output is unavailable with diagnostic paths, never repaired", async () => {
  const result = await make(async () => "not JSON")(input);
  expect(result).toMatchObject({ status: "unavailable", code: "invalid_output" });
  expect(result).not.toHaveProperty("content");
  if (result.status === "unavailable") expect(result.issues).toContainEqual({ code: "malformed_json", path: "output" });
});
test("deadline aborts even an uncooperative provider and ignores its late settlement", async () => {
  vi.useFakeTimers();
  let providerSignal: AbortSignal | undefined;
  let resolve: (s: string) => void = () => {};
  const provider = testProvider(req => { providerSignal = req.signal; return new Promise<string>(r => { resolve = r; }); });
  const service = createRecommendationService({ loadConfig: () => config, provider, policy: { ...recommendationPolicy, timeoutMs: 10 } });
  const pending = service(input);
  await vi.advanceTimersByTimeAsync(10);
  const result = await pending;
  expect(result).toMatchObject({ status: "unavailable", code: "timeout", assessment: { rawOverall: score.rawOverall } });
  expect(providerSignal?.aborted).toBe(true);
  resolve(JSON.stringify(validTestContent())); await Promise.resolve();
  expect(result.status).toBe("unavailable"); expect(vi.getTimerCount()).toBe(0);
});
test("cancellation before and during generation returns no stale content", async () => {
  const controller = new AbortController(); controller.abort();
  const generate = vi.fn(async () => "");
  expect(await make(generate)(input, controller.signal)).toMatchObject({ code: "cancelled" }); expect(generate).not.toHaveBeenCalled();
  const active = new AbortController();
  const pending = createRecommendationService({ loadConfig: () => config, provider: testProvider(async req => { active.abort(); expect(req.signal.aborted).toBe(true); return "{}"; }) })(input, active.signal);
  expect(await pending).toMatchObject({ status: "unavailable", code: "cancelled" });
});
test("provider errors are safe and leave the deterministic endpoint available", async () => {
  const result = await make(async () => { throw new Error("secret provider response and SME text"); })(input);
  expect(result).toMatchObject({ status: "unavailable", code: "provider_failure" });
  expect(JSON.stringify(result)).not.toContain("secret provider response");
  const response = await scorePost(new Request("http://localhost/api/assessment-score", { method: "POST", headers: { "Origin": "http://localhost", "Content-Type": "application/json" }, body: JSON.stringify({ configVersion: input.configVersion, context: input.context, answers: input.answers }) }));
  expect(response.status).toBe(200); expect((await response.json()).rawOverall).toBe(score.rawOverall);
});
const request = (body: string, type = "application/json") => new Request("http://localhost/api/assessment-recommendations", { method: "POST", headers: { "Origin": "http://localhost", "Content-Type": type }, body });
test("runtime endpoint stays disabled without network calls, even if credentials or provider variables exist", async () => {
  const fetch = vi.fn(() => { throw new Error("No network permitted"); }); vi.stubGlobal("fetch", fetch);
  vi.stubEnv("RECOMMENDATION_PROVIDER", "test-double"); vi.stubEnv("OPENAI_API_KEY", "placeholder-only");
  try {
    const response = await POST(request(JSON.stringify(input)));
    expect(response.status).toBe(503); expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ status: "unavailable", code: "provider_not_configured", assessment: { rawOverall: score.rawOverall } });
    expect(fetch).not.toHaveBeenCalled();
  } finally { vi.unstubAllEnvs(); }
});
test.each([["{bad", 400, "application/json"], ["{}", 422, "application/json"], ["x", 415, "text/plain"], [" ".repeat(400001), 413, "application/json"]] as const)("bounded endpoint failures (%#)", async (body, status, type) => {
  const response = await POST(request(body, type)); expect(response.status).toBe(status);
  const data = await response.json(); expect(data.status).toBe("unavailable"); expect(data).not.toHaveProperty("content");
});
test("body reader has a deadline for incomplete streams", async () => {
  vi.useFakeTimers();
  const cancel = vi.fn();
  const req = new Request("http://localhost/api/assessment-recommendations", { method: "POST", headers: { "Origin": "http://localhost", "Content-Type": "application/json" }, body: new ReadableStream({ cancel }), duplex: "half" } as RequestInit);
  const pending = POST(req); await vi.advanceTimersByTimeAsync(recommendationPolicy.timeoutMs);
  expect((await pending).status).toBe(408); expect(cancel).toHaveBeenCalledOnce(); expect(vi.getTimerCount()).toBe(0);
});

for (const fixture of goldenCases) test(`${fixture.case_id}: service preserves full-precision deterministic authority`, async () => {
  const p = fixture.profile;
  const request = { ...input, companyName: String(p.company_name), subindustry: String(p.subindustry), context: {
    industry: p.industry, companySize: setupConfig.options.companySize.find(c => c.value.replaceAll(" ", "") === p.employee_band.replaceAll(" ", ""))!.value,
    location: p.company_location, targetMarkets: [...p.target_market_region], targetBuyer: p.target_buyer, businessGoal: p.business_goal,
  }, answers: goldenAnswers(fixture) };
  const result = await createRecommendationService({ loadConfig: () => config, provider: { ...testProvider(async () => { throw new Error("Should never call"); }), kind: "disabled" } })(request);
  const expected = computeAssessment(config, { configVersion: request.configVersion, context: request.context, answers: request.answers });
  expect(result).toMatchObject({ status: "unavailable", code: "provider_not_configured", assessment: {
    rawOverall: expected.rawOverall, weightedOverall: expected.weightedOverall, categories: expected.categories,
  } });
});
test("oversized validated requests and invalid policy fail before generation", async () => {
  const generate = vi.fn(async () => "");
  await expect(createRecommendationService({ loadConfig: () => config, provider: testProvider(generate), policy: { ...recommendationPolicy, maxRequestBytes: 10 } })(input)).rejects.toThrow("too large");
  expect(() => createRecommendationService({ loadConfig: () => config, provider: testProvider(generate), policy: { ...recommendationPolicy, timeoutMs: Infinity } })).toThrow();
  expect(generate).not.toHaveBeenCalled();
});
test("HTTP rejects invalid UTF-8 and a missing body", async () => {
  const req = new Request("http://localhost/api/assessment-recommendations", { method: "POST", headers: { "Origin": "http://localhost", "Content-Type": "application/json" }, body: new Uint8Array([255]) });
  expect((await POST(req)).status).toBe(400);
  expect((await POST(new Request(req.url, { method: "POST", headers: { "Origin": "http://localhost", "Content-Type": "application/json" } }))).status).toBe(400);
});

for (const fixture of goldenCases) test(`${fixture.case_id}: archived unmodified output passes actual service response path`, async () => {
  const p = fixture.profile;
  const request = { ...input, companyName: String(p.company_name), subindustry: String(p.subindustry), context: {
    industry: p.industry, companySize: setupConfig.options.companySize.find(c => c.value.replaceAll(" ", "") === p.employee_band.replaceAll(" ", ""))!.value,
    location: p.company_location, targetMarkets: [...p.target_market_region], targetBuyer: p.target_buyer, businessGoal: p.business_goal,
  }, answers: goldenAnswers(fixture) };
  const expected = computeAssessment(config, { configVersion: request.configVersion, context: request.context, answers: request.answers });
  const captured = goldenExpected(fixture);
  const raw = captured.recommendation_output_raw[0].content[0].text;
  expect(JSON.parse(raw)).toEqual(captured.recommendation_output);
  const result = await make(async () => raw)(request);
  expect(result.status, JSON.stringify(result.status === "unavailable" ? result.issues : [])).toBe("test_only");
  if (result.status !== "unavailable") expect(result.content).toEqual(captured.recommendation_output);
  expect(result.assessment.rawOverall).toBe(expected.rawOverall);
});

test("configured ratings goal and employee-band numbers are context, not a generated score claim", async () => {
  const request = { ...input, context: { ...input.context, businessGoal: "Improve sustainability ratings" } };
  const expected = computeAssessment(config, { configVersion: request.configVersion, context: request.context, answers: request.answers });
  const selected = prepareEvidence(config, request, recommendationPolicy);
  const content = validTestContent();
  content.executive_summary = `${request.context.industry} has an observed strength. For employee band ${request.context.companySize}, improve the observed gap for ${request.context.businessGoal}. ${scoreClosing(expected)}`;
  content.priority_recommendations[0]!.evidence = [selected.citations[0]!]; content.key_gaps[0]!.evidence = [selected.citations[0]!];
  expect((await make(async () => JSON.stringify(content))(request)).status).toBe("test_only");
  content.executive_summary = `A generated rating is 99. ${content.executive_summary}`;
  expect(await make(async () => JSON.stringify(content))(request)).toMatchObject({ status: "test_only", content, assessment:{rawOverall:expected.rawOverall} });
});
