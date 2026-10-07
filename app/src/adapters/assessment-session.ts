import type { createAssessmentModel, Session } from "../features/assessment/model";

export const SESSION_KEY = "capstone.assessment.ui-preview.v1";
export interface SessionStoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export type LoadResult = { state: Session | null; warning: string | null };
export function createSessionAdapter(getStorage: () => SessionStoragePort, sessionSchema: ReturnType<typeof createAssessmentModel>["sessionSchema"]) {
  return {
    load(): LoadResult {
      try {
        const raw = getStorage().getItem(SESSION_KEY);
        if (raw === null) return { state: null, warning: null };
        if (raw.length > 400000) throw new Error("Snapshot too large");
        const parsed = sessionSchema.safeParse(JSON.parse(raw));
        if (!parsed.success) return { state: null, warning: "Your saved preview could not be restored because its data or version is incompatible. A fresh preview has been opened." };
        return { state: parsed.data, warning: null };
      } catch {
        return { state: null, warning: "Your saved preview could not be read. This may be damaged data or unavailable browser storage. A fresh preview has been opened." };
      }
    },
    save(state: Session): string | null {
      try {
        getStorage().setItem(SESSION_KEY, JSON.stringify(sessionSchema.parse(state)));
        return null;
      } catch {
        return "Changes could not be saved in this tab. You can continue, but refreshing or leaving may lose your latest changes.";
      }
    },
  };
}
// All browser storage access stays here; never evaluated during server rendering.
export const browserSession = (schema: ReturnType<typeof createAssessmentModel>["sessionSchema"]) => createSessionAdapter(() => window.sessionStorage, schema);
