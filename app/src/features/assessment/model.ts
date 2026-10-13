import { z } from "zod";
import { notesSchema, NOTES_MAX_LENGTH } from "../../application/assessment-notes";
import type { Question } from "../../application/assessment-catalog";
export type QuestionId = string;

export const profileFields = [
  { key: "companyName", label: "Company name", hint: "Use an example business for this preview.", required: true },
  { key: "industry", label: "Industry", hint: "Choose the industry used for this assessment.", required: true },
  { key: "subindustry", label: "Subindustry", hint: "Optional: add a more specific activity.", required: false },
  { key: "companySize", label: "Company size", hint: "Choose the employee band that describes your company.", required: true },
  { key: "location", label: "Location", hint: "Choose the region where your business operates.", required: true },
  { key: "targetMarket", label: "Target market", hint: "Choose up to two regions. Your first choice is primary; your second is secondary.", required: true },
  { key: "targetBuyer", label: "Target buyer", hint: "Choose the type of buyer you want to work with.", required: true },
  { key: "businessGoal", label: "Business goal", hint: "Examples: attract new investors or prepare for procurement screening.", required: true },
  { key: "notes", label: "Additional Context / Requirements", hint: "Optional: add relevant business context or buyer requirements (up to 1,000 characters).", required: false },
] as const;
const shortText = z.string().max(200);
const profileSchema = z.object({
  companyName: shortText, industry: shortText, subindustry: shortText,
  companySize: shortText, location: shortText, targetMarket: shortText,
  targetBuyer: shortText, businessGoal: z.string().max(1000), notes: notesSchema,
}).strict();
export type Profile = z.infer<typeof profileSchema>;
export type ProfileKey = keyof Profile;
export const emptyProfile: Profile = {
  companyName: "", industry: "", subindustry: "", companySize: "",
  location: "", targetMarket: "", targetBuyer: "", businessGoal: "", notes: "",
};
export function profileErrors(profile: Profile): Partial<Record<ProfileKey, string>> {
  const errors: Partial<Record<ProfileKey, string>> = {};
  for (const field of profileFields) {
    const value = profile[field.key].trim();
    if (field.required && !value) errors[field.key] = "Please enter " + field.label.toLowerCase() + ".";
    if ((field.key === "notes" ? profile.notes.length : value.length) > (field.key === "notes" ? NOTES_MAX_LENGTH : field.key === "businessGoal" ? 1000 : 200)) errors[field.key] = "Please shorten this entry.";
  }
  return errors;
}
export function answerError(question: Question, raw = ""): string | undefined {
  const value = raw.trim();
  if (!value) return "Enter an answer or choose Skip.";
  if (value.length > 2000) return "Keep your answer to 2,000 characters or fewer.";
  if ("options" in question) return question.options.some((option) => option === value) ? undefined : "Choose one of the listed answers.";
  if (question.kind === "text") return undefined;
  if (!/^\d+(\.\d+)?$/.test(value) || !Number.isFinite(Number(value))) return "Enter a non-negative number, or skip if unknown.";
  if (question.kind === "percent" && Number(value) > 100) return "Enter a percentage from 0 to 100.";
  return undefined;
}
export type Session = {
  version: 3; configVersion: string;
  phase: "setup" | "method" | "questions" | "review" | "boundary";
  profile: Profile; inputMethod: "manual"; activeId: string;
  answers: Record<string, string>; skipped: string[];
};
export type Action =
  | { type: "profile"; field: ProfileKey; value: string }
  | { type: "method" } | { type: "start" } | { type: "edit-setup" }
  | { type: "answer"; id: QuestionId; raw: string }
  | { type: "jump"; id: QuestionId } | { type: "next" } | { type: "back" }
  | { type: "skip" } | { type: "review" } | { type: "review-missing" }
  | { type: "boundary" };
export function unanswered(state: Session, questions: readonly Question[]) {
  return questions.filter((q) => answerError(q, state.answers[q.id]) !== undefined);
}
export function progressLabel(state: Session, question: Question) {
  if (!answerError(question, state.answers[question.id])) return "Answered";
  return state.skipped.includes(question.id) ? "Unanswered · skipped" : "Unanswered";
}
export function createAssessmentModel(version: string, select: (profile: Profile) => readonly Question[], validateProfile: typeof profileErrors = profileErrors) {
  const questions = (state: Session) => select(state.profile);
  const sessionSchema = z.strictObject({
    version: z.literal(3), configVersion: z.literal(version),
    phase: z.enum(["setup", "method", "questions", "review", "boundary"]), profile: profileSchema,
    inputMethod: z.literal("manual"), activeId: z.string(),
    answers: z.record(z.string(), z.string().max(2000)), skipped: z.array(z.string()),
  }).superRefine((state, ctx) => {
    const ids = new Set(select(state.profile).map(q => q.id));
    const errors = validateProfile(state.profile);
    if (Object.keys(errors).some(key => state.phase !== "setup" || state.profile[key as ProfileKey].trim() !== "")) ctx.addIssue({ code: "custom", message: "Invalid setup" });
    if (["questions", "review", "boundary"].includes(state.phase) && (!ids.has(state.activeId) || Object.keys(state.answers).some(id => !ids.has(id)) || state.skipped.some(id => !ids.has(id)))) ctx.addIssue({ code: "custom", message: "Incompatible selected questions" });
    if (new Set(state.skipped).size !== state.skipped.length) ctx.addIssue({ code: "custom", message: "Duplicate skipped IDs" });
  });
  function initialSession(): Session {
    return { version: 3, configVersion: version, phase: "setup", profile: { ...emptyProfile }, inputMethod: "manual", activeId: "", answers: {}, skipped: [] };
  }
  function advance(state: Session): Session {
    const next = questions(state)[questions(state).findIndex((q) => q.id === state.activeId) + 1];
    return next ? { ...state, activeId: next.id } : { ...state, phase: "review" };
  }
  function assessmentReducer(state: Session, action: Action): Session {
    switch (action.type) {
      case "profile": return { ...state, profile: { ...state.profile, [action.field]: action.value }, phase: "setup" };
      case "edit-setup": return { ...state, phase: "setup" };
      case "method": return Object.keys(validateProfile(state.profile)).length ? state : { ...state, phase: "method" };
      case "start": {
        if (Object.keys(validateProfile(state.profile)).length) return state;
        const selected = questions(state);
        if (!selected.length) return state;
        const ids = new Set(selected.map(q => q.id));
        return { ...state, phase: "questions", activeId: ids.has(state.activeId) ? state.activeId : selected[0]!.id,
          answers: Object.fromEntries(Object.entries(state.answers).filter(([id]) => ids.has(id))), skipped: state.skipped.filter(id => ids.has(id)) };
      }
      case "answer": if (!questions(state).some(q => q.id === action.id)) return state; return { ...state, answers: { ...state.answers, [action.id]: action.raw }, skipped: state.skipped.filter((id) => id !== action.id) };
      case "jump": if (!questions(state).some(q => q.id === action.id)) return state; return { ...state, activeId: action.id, phase: "questions" };
      case "next": {
        const q = questions(state).find((q) => q.id === state.activeId);
        return !q || answerError(q, state.answers[q.id]) ? state : advance(state);
      }
      case "back": {
        const previous = questions(state)[questions(state).findIndex((q) => q.id === state.activeId) - 1];
        return previous ? { ...state, activeId: previous.id } : state;
      }
      // Skip never discards a draft or an existing answer.
      case "skip": return advance({ ...state, skipped: [...new Set([...state.skipped, state.activeId])] });
      case "review": return { ...state, phase: "review" };
      case "review-missing": {
        const first = unanswered(state, questions(state))[0];
        return first ? { ...state, phase: "questions", activeId: first.id } : state;
      }
      case "boundary": return { ...state, phase: "boundary" };
    }
  }

  return { sessionSchema, initialSession, assessmentReducer, questions };
}
