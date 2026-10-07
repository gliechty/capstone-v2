import { z } from "zod";
import { MOCK_VERSION, mockQuestions, type MockQuestion, type QuestionId } from "./mock-questions";

export const profileFields = [
  { key: "companyName", label: "Company name", hint: "Use an example business for this preview.", required: true },
  { key: "industry", label: "Industry", hint: "Describe your main business activity.", required: true },
  { key: "subindustry", label: "Subindustry", hint: "Optional: add a more specific activity.", required: false },
  { key: "companySize", label: "Company size", hint: "Number of employees, as a whole number greater than zero.", required: true },
  { key: "location", label: "Location", hint: "Country or region where the business operates.", required: true },
  { key: "targetMarket", label: "Target market", hint: "Country or region you sell to or plan to enter.", required: true },
  { key: "targetBuyer", label: "Target buyer", hint: "A buyer or buyer type. You can enter “Not yet identified”.", required: true },
  { key: "businessGoal", label: "Business goal", hint: "What would you like to understand or improve?", required: true },
] as const;
const shortText = z.string().max(200);
const profileSchema = z.object({
  companyName: shortText, industry: shortText, subindustry: shortText,
  companySize: shortText, location: shortText, targetMarket: shortText,
  targetBuyer: shortText, businessGoal: z.string().max(1000),
}).strict();
export type Profile = z.infer<typeof profileSchema>;
export type ProfileKey = keyof Profile;
export const emptyProfile: Profile = {
  companyName: "", industry: "", subindustry: "", companySize: "",
  location: "", targetMarket: "", targetBuyer: "", businessGoal: "",
};
export function profileErrors(profile: Profile): Partial<Record<ProfileKey, string>> {
  const errors: Partial<Record<ProfileKey, string>> = {};
  for (const field of profileFields) {
    const value = profile[field.key].trim();
    if (field.required && !value) errors[field.key] = "Please enter " + field.label.toLowerCase() + ".";
    if (value.length > (field.key === "businessGoal" ? 1000 : 200)) errors[field.key] = "Please shorten this entry.";
  }
  if (profile.companySize.trim() && (!/^\d+$/.test(profile.companySize.trim()) ||
      !Number.isSafeInteger(Number(profile.companySize)) || Number(profile.companySize) < 1)) {
    errors.companySize = "Enter a whole number of employees greater than zero.";
  }
  return errors;
}
export function answerError(question: MockQuestion, raw = ""): string | undefined {
  const value = raw.trim();
  if (!value) return "Enter an answer or choose Skip.";
  if (value.length > 2000) return "Keep your answer to 2,000 characters or fewer.";
  if ("options" in question) return question.options.some((option) => option === value) ? undefined : "Choose one of the listed answers.";
  if (question.kind === "text") return undefined;
  if (!/^\d+(\.\d+)?$/.test(value) || !Number.isFinite(Number(value))) return "Enter a non-negative number, or skip if unknown.";
  if (question.kind === "percent" && Number(value) > 100) return "Enter a percentage from 0 to 100.";
  return undefined;
}
const questionIds = mockQuestions.map((q) => q.id);
const questionIdSchema = z.enum(questionIds as [QuestionId, ...QuestionId[]]);
export const sessionSchema = z.object({
  version: z.literal(1),
  fixtureVersion: z.literal(MOCK_VERSION),
  phase: z.enum(["setup", "method", "questions", "review", "boundary"]),
  profile: profileSchema,
  inputMethod: z.literal("manual"),
  activeId: questionIdSchema,
  answers: z.record(z.string(), z.string().max(2000)).refine((answers) => Object.keys(answers).every((id) => questionIds.includes(id as QuestionId))),
  skipped: z.array(questionIdSchema).max(mockQuestions.length).refine((ids) => new Set(ids).size === ids.length),
}).strict().refine((state) => state.phase === "setup" || Object.keys(profileErrors(state.profile)).length === 0);
export type Session = z.infer<typeof sessionSchema>;
export function initialSession(): Session {
  return { version: 1, fixtureVersion: MOCK_VERSION, phase: "setup", profile: { ...emptyProfile },
    inputMethod: "manual", activeId: mockQuestions[0].id, answers: {}, skipped: [] };
}
export type Action =
  | { type: "profile"; field: ProfileKey; value: string }
  | { type: "method" } | { type: "start" } | { type: "edit-setup" }
  | { type: "answer"; id: QuestionId; raw: string }
  | { type: "jump"; id: QuestionId } | { type: "next" } | { type: "back" }
  | { type: "skip" } | { type: "review" } | { type: "review-missing" }
  | { type: "boundary" };
export function unanswered(state: Session) {
  return mockQuestions.filter((q) => answerError(q, state.answers[q.id]) !== undefined);
}
export function progressLabel(state: Session, question: MockQuestion) {
  if (!answerError(question, state.answers[question.id])) return "Answered";
  return state.skipped.includes(question.id) ? "Unanswered · skipped" : "Unanswered";
}
function advance(state: Session): Session {
  const next = mockQuestions[mockQuestions.findIndex((q) => q.id === state.activeId) + 1];
  return next ? { ...state, activeId: next.id } : { ...state, phase: "review" };
}
export function assessmentReducer(state: Session, action: Action): Session {
  switch (action.type) {
    case "profile": return { ...state, profile: { ...state.profile, [action.field]: action.value }, phase: "setup" };
    case "edit-setup": return { ...state, phase: "setup" };
    case "method": return Object.keys(profileErrors(state.profile)).length ? state : { ...state, phase: "method" };
    case "start": return Object.keys(profileErrors(state.profile)).length ? state : { ...state, phase: "questions" };
    case "answer": return { ...state, answers: { ...state.answers, [action.id]: action.raw }, skipped: state.skipped.filter((id) => id !== action.id) };
    case "jump": return { ...state, activeId: action.id, phase: "questions" };
    case "next": {
      const q = mockQuestions.find((q) => q.id === state.activeId)!;
      return answerError(q, state.answers[q.id]) ? state : advance(state);
    }
    case "back": {
      const previous = mockQuestions[mockQuestions.findIndex((q) => q.id === state.activeId) - 1];
      return previous ? { ...state, activeId: previous.id } : state;
    }
    // Skip never discards a draft or an existing answer.
    case "skip": return advance({ ...state, skipped: [...new Set([...state.skipped, state.activeId])] });
    case "review": return { ...state, phase: "review" };
    case "review-missing": {
      const first = unanswered(state)[0];
      return first ? { ...state, phase: "questions", activeId: first.id } : state;
    }
    case "boundary": return { ...state, phase: "boundary" };
  }
}
