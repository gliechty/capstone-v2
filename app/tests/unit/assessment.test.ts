import { describe, expect, test } from "vitest";
import { createAssessmentModel, answerError, profileErrors, progressLabel, unanswered as missing, type Session } from "../../src/features/assessment/model";
import { mockQuestions } from "../../src/features/assessment/mock-questions";
import { createSessionAdapter as adapterFactory, SESSION_KEY } from "../../src/adapters/assessment-session";

const createSessionAdapter = (get: Parameters<typeof adapterFactory>[0]) => adapterFactory(get, sessionSchema);
const profile = { notes: "", companyName: "Example", industry: "Example industry", subindustry: "", companySize: "11 - 50", location: "Example country", targetMarket: "Example market", targetBuyer: "Not yet identified", businessGoal: "Explore the preview" };
const { assessmentReducer, initialSession, sessionSchema } = createAssessmentModel("test-fixture", () => mockQuestions);
const unanswered = (state: Session) => missing(state, mockQuestions);
const validState = (): Session => ({ ...initialSession(), activeId: mockQuestions[0].id, profile, phase: "questions" });
describe("setup and raw answer validation", () => {
  test("required fields reject blank and whitespace while subindustry is optional", () => {
    expect(Object.keys(profileErrors(initialSession().profile))).toHaveLength(7);
    expect(profileErrors(profile)).toEqual({});
    expect(profileErrors({ ...profile, companyName: "   " })).toHaveProperty("companyName");
    expect(profileErrors({ ...profile, companySize: "" })).toHaveProperty("companySize");
  });
  test("setup cannot advance until valid", () => {
    expect(assessmentReducer(initialSession(), { type: "method" }).phase).toBe("setup");
    expect(assessmentReducer({ ...initialSession(), profile }, { type: "method" }).phase).toBe("method");
  });
  test("missing numbers never become zero; percent range and finite numbers are enforced", () => {
    const numeric = mockQuestions[4], percent = mockQuestions[5];
    expect(answerError(numeric, "")).toBeDefined();
    expect(answerError(numeric, "0")).toBeUndefined();
    for (const value of ["-1", "NaN", "Infinity", "1e309", "abc"]) expect(answerError(numeric, value)).toBeDefined();
    expect(answerError(percent, "101")).toBeDefined();
    expect(answerError(percent, "0")).toBeUndefined();
    expect(answerError(percent, "100")).toBeUndefined();
  });
});
describe("questionnaire reducer", () => {
  test("navigation preserves other answers and skip removes the active raw value", () => {
    let state = validState();
    state = assessmentReducer(state, { type: "answer", id: mockQuestions[0].id, raw: "No" });
    state = assessmentReducer(state, { type: "next" });
    expect(state.activeId).toBe(mockQuestions[1].id);
    state = assessmentReducer(state, { type: "skip" });
    expect(progressLabel(state, mockQuestions[1])).toBe("Unanswered · skipped");
    state = assessmentReducer(state, { type: "jump", id: mockQuestions[0].id });
    expect(state.answers[mockQuestions[0].id]).toBe("No");
    expect(progressLabel(state, mockQuestions[0])).toBe("Answered");
    expect(unanswered(state)).toHaveLength(5);
    state = assessmentReducer(state, { type: "jump", id: mockQuestions[4].id });
    state = assessmentReducer(state, { type: "answer", id: mockQuestions[4].id, raw: "not a number" });
    expect(assessmentReducer(state, { type: "next" }).activeId).toBe(mockQuestions[4].id);
    state = assessmentReducer(state, { type: "skip" });
    expect(state.answers).not.toHaveProperty(mockQuestions[4].id);
    expect(state.answers[mockQuestions[0].id]).toBe("No");
    expect(sessionSchema.parse(JSON.parse(JSON.stringify(state))).answers).not.toHaveProperty(mockQuestions[4].id);
  });
  test("review missing jumps to first missing and boundary has no score", () => {
    let state = assessmentReducer(validState(), { type: "review" });
    expect(unanswered(state)).toHaveLength(6);
    state = assessmentReducer(state, { type: "review-missing" });
    expect(state.phase).toBe("questions");
    expect(state.activeId).toBe(mockQuestions[0].id);
    expect(assessmentReducer(state, { type: "boundary" })).not.toHaveProperty("score");
  });
  test("revisiting, clearing, and editing setup retain other answers", () => {
    let state = assessmentReducer(validState(), { type: "answer", id: mockQuestions[0].id, raw: "Yes" });
    state = assessmentReducer(state, { type: "edit-setup" });
    state = assessmentReducer(state, { type: "profile", field: "companyName", value: "Updated" });
    expect(state.answers[mockQuestions[0].id]).toBe("Yes");
    state = assessmentReducer(state, { type: "answer", id: mockQuestions[0].id, raw: "" });
    expect(progressLabel(state, mockQuestions[0])).toBe("Unanswered");
  });
});
describe("validated session adapter", () => {
  test("round trips setup, phase, position, answers and skipped state", () => {
    const data = new Map<string, string>();
    const adapter = createSessionAdapter(() => ({ getItem: (key) => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); } }));
    expect(adapter.load()).toEqual({ state: null, warning: null });
    const state = { ...validState(), activeId: mockQuestions[3].id, answers: { [mockQuestions[4].id]: "0" }, skipped: [mockQuestions[1].id] };
    expect(adapter.save(state)).toBeNull();
    expect(data.has(SESSION_KEY)).toBe(true);
    expect(adapter.load().state).toEqual(state);
  });
  test.each(["{broken", "null", "[]", JSON.stringify({ ...validState(), version: 9 }), JSON.stringify({ ...validState(), configVersion: "old" }), JSON.stringify({ ...validState(), activeId: "missing" }), JSON.stringify({ ...validState(), answers: { unknown: "value" } })])("rejects corrupt or incompatible data: %s", (raw) => {
    const adapter = createSessionAdapter(() => ({ getItem: () => raw, setItem: () => {} }));
    expect(adapter.load().state).toBeNull();
    expect(adapter.load().warning).toBeTruthy();
  });
  test("incomplete profile cannot restore into the questionnaire", () => {
    expect(sessionSchema.safeParse({ ...initialSession(), phase: "questions" }).success).toBe(false);
  });
  test("blocked access and quota errors are visible, not thrown", () => {
    const blocked = createSessionAdapter(() => { throw new Error("Blocked"); });
    expect(blocked.load().warning).toBeTruthy();
    expect(blocked.save(validState())).toBeTruthy();
    const full = createSessionAdapter(() => ({ getItem: () => null, setItem: () => { throw new Error("Quota"); } }));
    expect(full.save(validState())).toBeTruthy();
  });
});


test("Results access requires the review generation action and survives restoration", () => {
 let state=validState();
 expect(assessmentReducer(state,{type:"generate"}).progress).not.toBe(4);
 state=assessmentReducer(state,{type:"answer",id:mockQuestions[0].id,raw:"No"});
 state=assessmentReducer(state,{type:"review"});expect(state.progress).toBe(3);
 state=assessmentReducer(state,{type:"generate"});expect(state.progress).toBe(4);
 expect(sessionSchema.parse(JSON.parse(JSON.stringify(state))).progress).toBe(4);
 expect(assessmentReducer(state,{type:"jump",id:mockQuestions[0].id}).progress).toBe(4);
});
