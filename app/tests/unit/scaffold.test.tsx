// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LandingPage from "../../src/app/page";

afterEach(cleanup);

test("landing page exposes the required context, approach, demo and research sections", () => {
  render(<LandingPage />);
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("region", { name: /Many expectations/ })).toBeVisible();
  expect(screen.getByRole("region", { name: /A clearer connection/ })).toBeVisible();
  expect(screen.getByRole("region", { name: /See the approach/ })).toBeVisible();
  expect(screen.getByRole("region", { name: /Grounded in research/ })).toBeVisible();
});

test("unimplemented assessment and video are clearly unavailable", () => {
  render(<LandingPage />);
  const cta = screen.getByRole("button", { name: "Take the Assessment" });
  expect(cta).toBeDisabled();
  expect(cta).toHaveAccessibleDescription(/Assessment coming soon/);
  expect(screen.getByText(/Video placeholder/)).toBeVisible();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Take the Assessment/ })).not.toBeInTheDocument();
});

test("all landing links resolve to real sections within the page", () => {
  render(<LandingPage />);
  for (const link of screen.getAllByRole("link")) {
    const href = link.getAttribute("href");
    expect(href).toMatch(/^#[a-z-]+$/);
    expect(document.getElementById(href!.slice(1))).not.toBeNull();
  }
});

test("demo immediately follows the hero before longer context and approach content", () => {
  render(<LandingPage />);
  const sections = Array.from(screen.getByRole("main").children);
  expect(sections.map((section) => section.getAttribute("aria-labelledby"))).toEqual([
    "hero-heading", "demo-heading", "context-heading", "approach-heading", "research-heading",
  ]);
});
