// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ResultsPage from "../../src/app/results/page";

afterEach(cleanup);

test("results preserve the narrative hierarchy and clearly identify mock content", () => {
  render(<ResultsPage />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
    "Example overall scores", "Executive summary", "Key gaps", "Recommended actions", "Evidence & sources",
  ]);
  expect(screen.getByRole("complementary", { name: "Mock results notice" })).toHaveTextContent("not calculated from your answers");
  expect(screen.getByText(/Example narrative/)).toHaveTextContent("Not AI-generated");
  expect(screen.getByText(/No source evidence has been retrieved/)).toBeVisible();
});

test("chart has readable category/value equivalents and report cannot trigger generation", () => {
  render(<ResultsPage />);
  const chart = screen.getByRole("figure", { name: "Example category scores" });
  expect(within(chart).getAllByRole("listitem")).toHaveLength(4);
  for (const category of ["People", "Governance", "Community", "Resources"]) expect(within(chart).getByText(category)).toBeVisible();
  expect(within(chart).getAllByText("out of 100, mock value")).toHaveLength(4);
  const report = screen.getByRole("button", { name: "Download full report" });
  expect(report).toBeDisabled();
  expect(report).toHaveAccessibleDescription(/not implemented/);
  for (const link of screen.getAllByRole("link")) expect(["/", "/assessment", "#results-main", "#sources", "#summary", "#gaps", "#actions"]).toContain(link.getAttribute("href"));
});
