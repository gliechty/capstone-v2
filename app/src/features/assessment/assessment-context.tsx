"use client";

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { browserSession } from "../../adapters/assessment-session";
import { assessmentReducer, initialSession, type Action, type Session } from "./model";

type Envelope = { session: Session; ready: boolean; restoreWarning: string | null; saveWarning: string | null };
type ProviderAction = Action | { type: "restore"; session: Session; warning: string | null } | { type: "save-status"; warning: string | null };
function reducer(state: Envelope, action: ProviderAction): Envelope {
  if (action.type === "restore") return { session: action.session, ready: true, restoreWarning: action.warning, saveWarning: null };
  if (action.type === "save-status") return state.saveWarning === action.warning ? state : { ...state, saveWarning: action.warning };
  return { ...state, session: assessmentReducer(state.session, action) };
}
const AssessmentContext = createContext<(Envelope & { dispatch: Dispatch<Action> }) | null>(null);
export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    session: initialSession(), ready: false, restoreWarning: null, saveWarning: null,
  }));
  useEffect(() => {
    const restored = browserSession.load();
    dispatch({ type: "restore", session: restored.state ?? initialSession(), warning: restored.warning });
  }, []);
  useEffect(() => {
    if (!state.ready) return;
    dispatch({ type: "save-status", warning: browserSession.save(state.session) });
  }, [state.ready, state.session]);
  return <AssessmentContext.Provider value={{ ...state, dispatch }}>{children}</AssessmentContext.Provider>;
}
export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error("Assessment components require AssessmentProvider.");
  return context;
}
