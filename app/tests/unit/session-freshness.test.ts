// @vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { browserSession, watchAssessmentSession, SESSION_KEY, SESSION_CHANGED } from "../../src/adapters/assessment-session";
import { createAssessmentModel } from "../../src/features/assessment/model";
import { mockQuestions } from "../../src/features/assessment/mock-questions";
test("adapter notifies changes, refuses a stale saved snapshot after write failure, and recovers on successful save", () => {
  const model = createAssessmentModel("test", () => mockQuestions);
  const adapter = browserSession(model.sessionSchema);
  const change = vi.fn(), restore = vi.fn(), hide = vi.fn();
  const stop = watchAssessmentSession(change, restore, hide);
  const initial = model.initialSession();
  expect(adapter.save(initial)).toBeNull();
  expect(change).toHaveBeenCalledTimes(1);
  expect(adapter.load().state).toEqual(initial);
  const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
  expect(adapter.save(initial)).toContain("could not be saved");
  expect(adapter.load().state).toBeNull();
  expect(adapter.load().warning).toContain("latest changes");
  write.mockRestore();
  expect(adapter.save(initial)).toBeNull();
  expect(adapter.load().state).toEqual(initial);
  window.dispatchEvent(new StorageEvent("storage", { key: SESSION_KEY }));
  window.dispatchEvent(new Event("focus"));
  expect(change).toHaveBeenCalledTimes(5);
  window.dispatchEvent(new Event("pagehide")); window.dispatchEvent(new Event("pageshow"));
  expect(hide).toHaveBeenCalledTimes(1); expect(restore).toHaveBeenCalledTimes(1);
  stop(); window.dispatchEvent(new Event(SESSION_CHANGED));
  expect(change).toHaveBeenCalledTimes(5);
});
