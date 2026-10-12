import { mkdirSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog } from "../../src/application/assessment-catalog";
import { scoreAssessment } from "../../src/domain/scoring/score-assessment";
import { goldenCases } from "../helpers/legacy-scoring";
import { goldenAnswers } from "../helpers/golden-comparison";
test("record engine and local production HTTP timings (observations, not latency thresholds)", async () => {
  const { config } = loadCanonicalConfig();
  const version = assessmentCatalog(config).version;
  const stats = (samples: number[]) => { const sorted = [...samples].sort((a, b) => a - b); return {
    samples: sorted.length, medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1], minMs: sorted[0], maxMs: sorted.at(-1) }; };
  const results = [];
  for (const fixture of goldenCases) {
    const answers = goldenAnswers(fixture), p = fixture.profile;
    const body = JSON.stringify({ configVersion: version, context: { industry: p.industry, companySize: p.employee_band.replace("-", " - "),
      location: p.company_location, targetMarkets: p.target_market_region, targetBuyer: p.target_buyer, businessGoal: p.business_goal }, answers });
    const engine: number[] = [], endpoint: number[] = [];
    for (let i = 0; i < 35; i++) {
      const start = performance.now();
      const score = scoreAssessment(config, p, answers);
      const elapsed = performance.now() - start;
      expect(score.questions).toHaveLength(fixture.expected_question_ids.length);
      if (i >= 5) engine.push(elapsed);
    }
    for (let i = 0; i < 35; i++) {
      const start = performance.now();
      const response = await fetch("http://127.0.0.1:3100/api/assessment-score", { method: "POST", headers: { "Content-Type": "application/json" }, body });
      const score = await response.json();
      const elapsed = performance.now() - start;
      expect(response.status).toBe(200); expect(score.trace).toHaveLength(fixture.expected_question_ids.length);
      if (i >= 5) endpoint.push(elapsed);
    }
    results.push({ case: fixture.case_id, questions: fixture.expected_question_ids.length, engine: stats(engine), endpoint: stats(endpoint) });
  }
  mkdirSync("test-results", { recursive: true });
  writeFileSync("test-results/scoring-performance.json", JSON.stringify({ measuredAt: new Date().toISOString(),
    node: process.version, platform: process.platform, arch: process.arch, cpu: cpus()[0]?.model,
    conditions: "Production next start on loopback:3100, sequential, 5 warmups + 30 samples per case/path, engine config preloaded; HTTP includes fresh snapshot read/hash/schema validation, request/response JSON and trace; no external services. Not a cold-start/concurrency/deployment SLA.",
    config: config.version, results }, null, 2));
}, 60_000);
