"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { browserSession } from "../../adapters/assessment-session";
import { selectedQuestions, type AssessmentCatalog, type Question } from "../../application/assessment-catalog";
import { createAssessmentModel, profileErrors, type Action, type Session, type Profile } from "./model";

export function catalogProfileErrors(catalog: AssessmentCatalog, profile: Profile) {
  const errors = profileErrors(profile);
  if (profile.industry && !catalog.industries.includes(profile.industry)) errors.industry = "Choose a supported industry.";
  if (profile.location && !catalog.regions.includes(profile.location)) errors.location = "Choose an operating region.";
  if (profile.targetMarket && profile.targetMarket.split(/[;,]/).some(region => !catalog.regions.includes(region.trim()))) errors.targetMarket = "Choose supported target regions.";
  return errors;
}
type Envelope = { session: Session; ready: boolean; restoreWarning: string | null; saveWarning: string | null };
type ProviderAction = Action | { type: "restore"; session: Session; warning: string | null } | { type: "save-status"; warning: string | null };
const AssessmentContext = createContext<(Envelope & { dispatch: Dispatch<Action>; questions: readonly Question[]; catalog: AssessmentCatalog }) | null>(null);
export function AssessmentProvider({ children, catalog }: { children: ReactNode; catalog: AssessmentCatalog }) {
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
    dispatch({ type: "restore", session: restored.state ?? model.initialSession(), warning: restored.warning });
  }, [storage, model]);
  useEffect(() => {
    if (!state.ready) return;
    dispatch({ type: "save-status", warning: storage.save(state.session) });
  }, [state.ready, state.session, storage]);
  return <AssessmentContext.Provider value={{ ...state, dispatch, catalog, questions: model.questions(state.session) }}>{children}</AssessmentContext.Provider>;
}
export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error("Assessment components require AssessmentProvider.");
  return context;
}
