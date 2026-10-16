import type { SessionStoragePort } from "./assessment-session";
const key = "capstone.recommendation.pending.v1";
// Receipt only: no prompt, answer, output, credentials or automatic retry consent.
export function recommendationAttempt(storage: SessionStoragePort) {
  return {
    begin(inputId: string) { storage.setItem(key, inputId); },
    pending(inputId: string) { try { return /^[a-f0-9]{64}$/.test(inputId) && storage.getItem(key) === inputId; } catch { return false; } },
    complete(inputId: string) { try { if (storage.getItem(key) === inputId) storage.setItem(key, ""); } catch { /* Conservative receipt can remain; never auto-retry. */ } },
  };
}
