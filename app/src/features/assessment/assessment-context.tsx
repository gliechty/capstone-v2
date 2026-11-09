"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { browserSession } from "../../adapters/assessment-session";
import { calculatorEligible, calculateDraft, type CalculatorDraft } from "../../application/calculator";
import { calculatorMappings } from "../../application/calculator-mapping";
import { marketValues } from "../../application/assessment-setup";
import { selectedQuestions, type AssessmentCatalog, type Question } from "../../application/assessment-catalog";
import { createAssessmentModel, profileErrors, type Action, type Session, type Profile } from "./model";

export function catalogProfileErrors(catalog: AssessmentCatalog, profile: Profile) {
  const errors = profileErrors(profile);
  for (const key of ["industry", "companySize", "location", "targetBuyer", "businessGoal"] as const) {
    if (profile[key] && !catalog.setupOptions[key].some(option => option.value === profile[key])) errors[key] = "Choose one of the listed options.";
  }
  const markets = marketValues(profile.targetMarket);
  if (markets.length > 2 || new Set(markets).size !== markets.length || markets.some(region => !catalog.setupOptions.targetMarket.some(option => option.value === region))) errors.targetMarket = "Choose one or two distinct target regions.";
  return errors;
}
type Envelope = { session: Session; ready: boolean; restoreWarning: string | null; saveWarning: string | null };
type ProviderAction = Action | { type: "restore"; session: Session; warning: string | null } | { type: "save-status"; warning: string | null };
const AssessmentContext = createContext<(Envelope & { dispatch: Dispatch<Action>; questions: readonly Question[]; catalog: AssessmentCatalog; startCalculator: (draft: CalculatorDraft, questionIds: string[], confirmed: boolean, saveCalculator: () => string | null) => string | null }) | null>(null);
export function AssessmentProvider({ children, catalog, quick=false }: { children: ReactNode; catalog: AssessmentCatalog; quick?:boolean }) {
  const model = useMemo(() => createAssessmentModel(catalog.version, profile => selectedQuestions(catalog, profile), profile => catalogProfileErrors(catalog, profile)), [catalog]);
  const storage = useMemo(() => browserSession(model.sessionSchema), [model]);
  function reducer(state: Envelope, action: ProviderAction): Envelope {
    if (action.type === "restore") return { session: action.session, ready: true, restoreWarning: action.warning, saveWarning: null };
    if (action.type === "save-status") return state.saveWarning === action.warning ? state : { ...state, saveWarning: action.warning };
    return { ...state, session: model.assessmentReducer(state.session, action) };
  }
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ session: model.initialSession(), ready: false, restoreWarning: null, saveWarning: null }));
  useEffect(() => {
    const restored = storage.load();
    let session=restored.state ?? model.initialSession();
    if(quick && !session.assessmentProfile)session=model.assessmentReducer(session,{type:"quick-setup"});
    if(!quick && session.assessmentProfile)session=model.assessmentReducer(session,{type:"continue-full"});
    dispatch({ type: "restore", session, warning: restored.warning });
  }, [storage, model, quick]);
  useEffect(() => {
    if (!state.ready) return;
    dispatch({ type: "save-status", warning: storage.save(state.session) });
  }, [state.ready, state.session, storage]);
  function startCalculator(draft: CalculatorDraft, questionIds: string[], confirmed: boolean, saveCalculator: () => string | null): string | null {
    if (!calculatorEligible(state.session.profile.country)) return "Select China in Setup before using calculator values. Your calculator entries have been preserved.";
    if (!confirmed) return "Confirm the selected values and reporting boundary before continuing.";
    const calculation = calculateDraft(draft);
    if (!calculation.result) return "Correct the calculator entries and calculate them again before continuing.";
    const mappings = calculatorMappings(draft, model.questions(state.session));
    if (!questionIds.length) return "Select at least one available value to transfer, or choose Enter manually.";
    if (questionIds.some(id => !mappings.some(row => row.questionId === id && row.raw !== null))) return "A selected value is unavailable. Recalculate and review the selected values.";
    const errors = catalogProfileErrors(catalog, state.session.profile);
    if (Object.keys(errors).length) return "Correct Setup before continuing: " + Object.values(errors).join(" ");
    const transferred = model.assessmentReducer(state.session, { type: "calculator-apply", draft, questionIds });
    const next = model.assessmentReducer(transferred, { type: "start" });
    if (next.phase !== "questions") return "No questionnaire is available for this setup. Review the selected business context.";
    const parsed = model.sessionSchema.safeParse(next);
    if (!parsed.success) return "The selected values could not form a valid assessment session. Recalculate and review your setup.";
    const calculatorWarning = saveCalculator(); if (calculatorWarning) return calculatorWarning + " Nothing was transferred; remain here and retry after enabling browser storage.";
    const warning = storage.save(parsed.data); if (warning) return warning + " Nothing was transferred and navigation was stopped. Enable browser storage and try again.";
    dispatch({ type: "restore", session: parsed.data, warning: state.restoreWarning });
    return null;
  }
  return <AssessmentContext.Provider value={{ ...state, dispatch, catalog, startCalculator, questions: model.questions(state.session) }}>{children}</AssessmentContext.Provider>;
}
export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error("Assessment components require AssessmentProvider.");
  return context;
}
