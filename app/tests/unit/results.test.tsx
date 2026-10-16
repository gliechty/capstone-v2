// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ResultsPage from "../../src/app/results/page";

vi.mock("../../src/features/results/computed-scores", () => ({ ComputedScores: () => <h2>Calculated overall scores</h2> }));
afterEach(cleanup);

test("results preserve the narrative hierarchy and show truthful not-generated states", () => {
  render(<ResultsPage />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
    "Calculated overall scores", "Executive summary", "Key gaps (0)", "Recommended actions (0)", "Evidence & sources",
  ]);
  expect(screen.getByRole("complementary", { name: "Results limitations" })).toHaveTextContent("require explicit generation");
  expect(screen.getByRole("button", { name: "Generate recommendations" })).toBeDisabled();
  expect(screen.getByText(/No AI recommendation evidence/)).not.toBeVisible();
});

test("report cannot trigger generation and links retain their destinations", () => {
  render(<ResultsPage />);
  const report = screen.getByRole("button", { name: "Download full report" });
  expect(report).toBeDisabled();
  expect(report).toHaveAccessibleDescription(/not implemented/);
  for (const link of screen.getAllByRole("link")) expect(["/", "/assessment", "#results-main", "#sources", "#summary", "#gaps", "#actions"]).toContain(link.getAttribute("href"));
});
