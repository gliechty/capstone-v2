"use client";
import { recommendationStorage } from "../../adapters/recommendation-storage";
import { RecommendationViewContext } from "./recommendation-view-context";
import { ImprovementLevers } from "./improvement-levers";
import { ReportDownload } from "./report-download";
import { useEffect, useReducer, useRef, type ReactNode } from "react";
import { RecommendationPresentation } from "./recommendation-presentation";
import { recommendationAttempt } from "../../adapters/recommendation-attempt";
import { inputIdentityText } from "../../application/recommendations/identity";
import { consumeResultsGeneration } from "../../application/recommendations/generation-intent";
import { browserSession, watchAssessmentSession } from "../../adapters/assessment-session";
import { browserInputHash, recommendationStatus, requestRecommendations } from "../../adapters/recommendation-client";
import { selectedQuestions, type AssessmentCatalog } from "../../application/assessment-catalog";
import { recommendationRequestFromSession } from "../../application/recommendations/request";
import { createRecommendationController, type RecommendationView } from "../../application/recommendations/controller";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
export function Recommendations({ catalog, children }: { catalog: AssessmentCatalog; children?: ReactNode }) {
  const [view, publish] = useReducer((_state: RecommendationView, next: RecommendationView) => next, { phase: "idle", code: "not_generated", configuration: null });
  const control = useRef<ReturnType<typeof createRecommendationController> | null>(null);
  useEffect(() => {
    const model = createAssessmentModel(catalog.version, p => selectedQuestions(catalog, p), p => catalogProfileErrors(catalog, p));
    const storage = browserSession(model.sessionSchema);
    const read = () => {
      const state = storage.load().state;
      return state && ["questions", "review", "boundary"].includes(state.phase) ? recommendationRequestFromSession(state) : null;
    };
    const attempts = recommendationAttempt({ getItem: key => window.sessionStorage.getItem(key), setItem: (key, value) => window.sessionStorage.setItem(key, value) });
    const controller = createRecommendationController({ read, saved: recommendationStorage({getItem:key=>window.sessionStorage.getItem(key),setItem:(key,value)=>window.sessionStorage.setItem(key,value)}), status: recommendationStatus,
      generate: async (input, configuration, signal) => {
        const id = await browserInputHash(inputIdentityText(input));
        if (signal.aborted) throw new Error("Request interrupted before dispatch");
        attempts.begin(id); // If persistence fails, fail before dispatch rather than lose the receipt.
        const result = await requestRecommendations(input, configuration, signal);
        if (!signal.aborted) attempts.complete(id); // Only a received response resolves the receipt; transport failure does not.
        return result;
      }, hash: browserInputHash, publish });
    control.current = controller;
    const stop = watchAssessmentSession(() => void controller.refresh(), () => void controller.refresh(true), () => controller.cancel());
    const timer = setInterval(() => void controller.refresh(), 30000);
    let active = true;
    const handoff = setTimeout(() => {
      const input = read();
      if (consumeResultsGeneration(input)) { void controller.generate(); return; }
      void controller.refresh().then(async () => {
      if (!active) return;
      if (input) {
        const id = await browserInputHash(inputIdentityText(input));
        const current = read();
        if (active && current && inputIdentityText(input) === inputIdentityText(current) && attempts.pending(id)) controller.recoverInterrupted();
      }
    }); }, 0);
    return () => { active = false; clearTimeout(handoff); stop(); clearInterval(timer); controller.dispose(); control.current = null; };
  }, [catalog]);
  return <RecommendationViewContext.Provider value={view}><RecommendationPresentation view={view} generate={() => void control.current?.generate()} cancel={() => control.current?.cancel()}>{children}<ReportDownload catalog={catalog} view={view}/></RecommendationPresentation><ImprovementLevers catalog={catalog} recommendationView={view}/></RecommendationViewContext.Provider>;
}
