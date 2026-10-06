// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ScaffoldPage from "../../src/app/page";

afterEach(cleanup);

test("renders the scaffold without claiming product capabilities", () => {
  render(<ScaffoldPage />);
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1, name: "Capstone v2 — scaffold" })).toBeVisible();
  expect(screen.getByText(/Product features are not implemented/)).toBeVisible();
});
