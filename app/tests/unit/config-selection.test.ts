import { describe, expect, test } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createConfigRepository, loadCanonicalConfig } from "../../src/adapters/config-repository";
import { selectQuestions } from "../../src/domain/selection/select-questions";
import { entitySchemas, validateRelations } from "../../src/application/config/schemas";
const { config } = loadCanonicalConfig();
const goldenRoot = "../BUILD_PACK/07_GOLDEN_TESTS/sme_cases/";
describe("canonical selection Golden contracts", () => {
  const files = readdirSync(goldenRoot).filter(f => f.endsWith(".json"));
  test("all five profiles are exercised", () => expect(files).toHaveLength(5));
  for (const file of files) {
    const fixture = JSON.parse(readFileSync(goldenRoot + file, "utf8"));
    test(file + " exact IDs and order", () => {
      const actual = selectQuestions(config.QuestionBank, fixture.profile).map(q => q.question_id);
      expect(actual).toEqual(fixture.expected_question_ids);
      expect(selectQuestions(config.QuestionBank, { ...fixture.profile, target_buyer: "different", business_goal: "different" }).map(q => q.question_id)).toEqual(actual);
    });
  }
});
test("size, active, market/location, aliases and stable priority ties", () => {
  const base = { ...config.QuestionBank[0]!, active: "TRUE", industry_trigger: "ANY", market_trigger: "EU", size_applicability: "medium_plus", priority: "1" };
  const rows = [{ ...base, question_id: "a" }, { ...base, question_id: "b" }, { ...base, question_id: "inactive", active: "FALSE" }];
  const profile = { industry: "manufacturing", company_location: "EU", target_market_region: ["APAC"], employee_band: "51–250" };
  expect(selectQuestions(rows, profile).map(q => q.question_id)).toEqual(["a", "b"]);
  expect(selectQuestions(rows, { ...profile, employee_band: "11-50" })).toEqual([]);
  expect(selectQuestions(rows, { ...profile, company_location: "APAC" })).toEqual([]);
  expect(selectQuestions(rows, { ...profile, company_location: "APAC", target_market_region: [" eu "] })).toHaveLength(2);
  expect(selectQuestions([{ ...base, industry_trigger: "Manufacturing (Industrial / Components)" }], profile)).toHaveLength(1);
});
test("lossless migration, stable document references and duplicate EC lineage", () => {
  expect(config.DocumentIndex).toHaveLength(44);
  expect(config.DocumentChunks).toHaveLength(428);
  expect(new Set(config.DocumentChunks.map(c => c.chunk_record_id)).size).toBe(428);
  for (let i = 1; i <= 8; i++) {
    const rows = config.DocumentChunks.filter(c => c.legacy_chunk_id === "EC-0" + i);
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map(r => r.doc_id)).size).toBe(2);
  }
  const mappings = JSON.parse(readFileSync("config/document-identity-map.json", "utf8").replace(/^\uFEFF/, ""));
  expect(mappings).toHaveLength(9);
  for (const mapping of mappings) {
    const doc = config.DocumentIndex.find(d => d.legacy_doc_id === mapping.legacy_doc_id)!;
    const chunks = config.DocumentChunks.filter(c => c.legacy_doc_title === mapping.legacy_title);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.every(c => c.doc_id === doc.doc_id && c.doc_title === doc.doc_title)).toBe(true);
  }
  expect(loadCanonicalConfig().diagnostics).toEqual(["QuestionBank I-045: missing metric reference (inactive; retained source record)"]);
});
test("strict schemas and semantic relations reject corruption", () => {
  for (const [name, schema] of Object.entries(entitySchemas)) {
    const rows = config[name as keyof typeof entitySchemas];
    expect(schema.safeParse([{ ...rows[0], unexpected: "field" }]).success).toBe(false);
  }
  expect(() => validateRelations({ ...config, QuestionBank: [...config.QuestionBank, config.QuestionBank[0]!] })).toThrow(/duplicate/);
  expect(() => validateRelations({ ...config, DocumentChunks: [{ ...config.DocumentChunks[0]!, doc_id: "missing" }] })).toThrow(/reference/);
  expect(() => validateRelations({ ...config, QuestionBank: [{ ...config.QuestionBank[0]!, active: "TRUE", metric_id: "missing" }] })).toThrow(/reference/);
  expect(entitySchemas.QuestionBank.safeParse([{ ...config.QuestionBank[0], priority: "NaN" }]).success).toBe(false);
});
test.each(["missing", "json", "checksum", "schema", "version"])("repository fails visibly for %s", mode => {
  const read = (file: string) => readFileSync("config/capstone-v1/" + file, "utf8");
  const manifest = JSON.parse(read("manifest.json").replace(/^\uFEFF/, ""));
  let payload = read("QuestionBank.json");
  if (mode === "schema") {
    payload = JSON.stringify([{ invalid: true }]);
    manifest.files.QuestionBank.sha256 = createHash("sha256").update(payload).digest("hex");
  }
  if (mode === "version") manifest.schema_version = 9;
  const repo = createConfigRepository(file => {
    if (mode === "missing") throw new Error("Missing file");
    if (file === "manifest.json") return mode === "json" ? "{bad" : JSON.stringify(manifest);
    if (file === "QuestionBank.json") return mode === "checksum" ? payload + " " : payload;
    return read(file);
  });
  expect(() => repo.load()).toThrow(/Canonical config unavailable/);
});

import { assessmentCatalog, selectedQuestions } from "../../src/application/assessment-catalog";
import { createAssessmentModel, emptyProfile } from "../../src/features/assessment/model";
import { catalogProfileErrors } from "../../src/features/assessment/assessment-context";
import { createSessionAdapter } from "../../src/adapters/assessment-session";
test("presentation catalog exposes no scoring or document payload and keeps declared regions", () => {
  const catalog = assessmentCatalog(config);
  expect(catalog.regions).toContain("Eastern Europe");
  expect(catalog.questions).toHaveLength(138);
  expect(catalog.questions[0]).not.toHaveProperty("base_weight");
  expect(catalog.questions[0]).not.toHaveProperty("metric_id");
  expect(catalog).not.toHaveProperty("DocumentChunks");
  expect(catalog.questions[0]).toMatchObject({ id: "U-001", options: ["Yes", "No"] });
});
test("setup consumes controlled bands and regions without inferring countries", () => {
  const catalog = assessmentCatalog(config);
  const profile = { ...emptyProfile, companyName: "Example", industry: catalog.industries[0]!, companySize: "251 - 500", location: "APAC", targetMarket: "EU;UK", targetBuyer: "Enterprise", businessGoal: "Investor readiness" };
  expect(catalogProfileErrors(catalog, profile)).toEqual({});
  expect(catalogProfileErrors(catalog, { ...profile, industry: "made up", location: "Thailand", targetMarket: "Mars" })).toMatchObject({ industry: expect.any(String), location: expect.any(String), targetMarket: expect.any(String) });
});
test("canonical session restoration validates version and selection; context changes retain only applicable answers", () => {
  const catalog = assessmentCatalog(config);
  const model = createAssessmentModel(catalog.version, profile => selectedQuestions(catalog, profile), profile => catalogProfileErrors(catalog, profile));
  let state = { ...model.initialSession(), profile: { ...emptyProfile, companyName: "Example", industry: catalog.industries[0]!, companySize: "251 - 500", location: "APAC", targetMarket: "EU", targetBuyer: "Enterprise", businessGoal: "Investor readiness" } };
  state = model.assessmentReducer(state, { type: "start" });
  const selected = model.questions(state);
  expect(selected.length).toBeGreaterThan(30);
  for (const q of selected) state = model.assessmentReducer(state, { type: "answer", id: q.id, raw: "draft" });
  let saved = "";
  const adapter = createSessionAdapter(() => ({ getItem: () => saved || null, setItem: (_, value) => { saved = value; } }), model.sessionSchema);
  expect(adapter.save(state)).toBeNull();
  expect(adapter.load().state).toEqual(state);
  expect(model.sessionSchema.safeParse({ ...state, configVersion: "other" }).success).toBe(false);
  expect(model.sessionSchema.safeParse({ ...state, version: 1 }).success).toBe(false);
  expect(model.assessmentReducer(state, { type: "jump", id: "demo-people-training" })).toEqual(state);
  expect(model.sessionSchema.safeParse({ ...state, activeId: "demo-people-training" }).success).toBe(false);
  state = model.assessmentReducer(state, { type: "profile", field: "companySize", value: "1 - 10" });
  // Editing setup is a valid draft, including answers from the prior context.
  expect(adapter.save(state)).toBeNull();
  state = model.assessmentReducer(state, { type: "start" });
  expect(Object.keys(state.answers)).toEqual(model.questions(state).map(q => q.id));
  expect(model.questions(state).length).toBeLessThan(selected.length);
  expect(model.sessionSchema.safeParse(state).success).toBe(true);
});
test("repository integrity is portable across LF and CRLF checkouts", () => {
  const repo = createConfigRepository(file => readFileSync("config/capstone-v1/" + file, "utf8").replace(/\r?\n/g, "\r\n"));
  expect(repo.load().config).toEqual(config);
});
test("manifest pins immutable source bytes and counts for all seven entities", () => {
  const manifest = JSON.parse(readFileSync("config/capstone-v1/manifest.json", "utf8").replace(/^\uFEFF/, ""));
  for (const [name, entry] of Object.entries(manifest.files) as [keyof typeof entitySchemas, { source: string; source_sha256: string; records: number }][]) {
    expect(createHash("sha256").update(readFileSync("../" + entry.source)).digest("hex")).toBe(entry.source_sha256);
    expect(config[name]).toHaveLength(entry.records);
  }
});

import { setupConfig, marketValues, toggleMarket } from "../../src/application/assessment-setup";
test("controlled setup values match preserved widget metadata and bands reach selection directly", () => {
  const raw = readFileSync("../" + setupConfig.provenance.source);
  expect(createHash("sha256").update(raw).digest("hex")).toBe(setupConfig.provenance.sha256);
  const widgetValues = new Map<string, string[]>();
  function walk(value: unknown) {
    if (!value || typeof value !== "object") return;
    const v = value as Record<string, unknown>;
    if (typeof v.widgetName === "string" && Object.values(setupConfig.provenance.widgets).includes(v.widgetName) && typeof v.sourceData === "string") {
      const rows = JSON.parse(v.sourceData.trim().replace(/^\{\{\s*/, "").replace(/\s*\}\}$/, "")) as { value: string }[];
      widgetValues.set(v.widgetName, rows.map(row => row.value));
    }
    Object.values(v).forEach(walk);
  }
  walk(JSON.parse(raw.toString()));
  const catalog = assessmentCatalog(config);
  const base = { ...emptyProfile, companyName: "Example", industry: catalog.industries[0]!, companySize: "251 - 500", location: "APAC", targetMarket: "EU;UK", targetBuyer: "Enterprise", businessGoal: "Investor readiness" };
  for (const key of Object.keys(setupConfig.options) as (keyof typeof setupConfig.options)[]) {
    expect(setupConfig.options[key].map(row => row.value)).toEqual(widgetValues.get(setupConfig.provenance.widgets[key]!));
  }
  for (const option of catalog.setupOptions.companySize) {
    expect(catalogProfileErrors(catalog, { ...base, companySize: option.value })).toEqual({});
    expect(selectedQuestions(catalog, { ...base, companySize: option.value }).map(q => q.id)).toEqual(selectQuestions(config.QuestionBank, { industry: base.industry, employee_band: option.value, company_location: base.location, target_market_region: ["EU", "UK"] }).map(q => q.question_id));
  }
  for (const companySize of ["300", "0", "-1", "1.5", "Infinity", "1e3"]) expect(catalogProfileErrors(catalog, { ...base, companySize })).toHaveProperty("companySize");
  expect(catalogProfileErrors(catalog, { ...base, targetBuyer: "Not yet identified", businessGoal: "Free text" })).toMatchObject({ targetBuyer: expect.any(String), businessGoal: expect.any(String) });
  for (const targetMarket of ["EU;UK;APAC", "EU;EU", "EU;", "EU/UK"]) expect(catalogProfileErrors(catalog, { ...base, targetMarket })).toHaveProperty("targetMarket");
  const model = createAssessmentModel(catalog.version, p => selectedQuestions(catalog, p), p => catalogProfileErrors(catalog, p));
  const state = { ...model.initialSession(), profile: base };
  expect(model.sessionSchema.safeParse(state).success).toBe(true);
  expect(model.sessionSchema.safeParse({ ...state, profile: { ...base, companySize: "300" } }).success).toBe(false);
  expect(model.sessionSchema.safeParse({ ...state, version: 2 }).success).toBe(false);
});
test("market selection is bounded, ordered, and never changes selector methodology", () => {
  let value = toggleMarket("", "UK");
  value = toggleMarket(value, "EU");
  expect(marketValues(value)).toEqual(["UK", "EU"]);
  expect(toggleMarket(value, "APAC")).toBe(value);
  value = toggleMarket(value, "UK");
  expect(marketValues(value)).toEqual(["EU"]);
  expect(marketValues(toggleMarket(value, "APAC"))).toEqual(["EU", "APAC"]);
});
