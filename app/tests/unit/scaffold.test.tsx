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
  expect(screen.getByRole("region", { name: /One global ambition/ })).toBeVisible();
  expect(screen.getByRole("region", { name: /AI where it helps/ })).toBeVisible();
  expect(screen.getByRole("region", { name: /Different businesses/ })).toBeVisible();
  expect(screen.getByRole("region", { name: /Explore the work/ })).toBeVisible();
});

test("assessment remains linked and the supplied video is available", () => {
  render(<LandingPage />);
  const cta = screen.getAllByRole("link", { name: "Start your assessment" })[0];
  expect(cta).toHaveAttribute("href", "/assessment");
  expect(cta).toHaveAccessibleDescription(/questionnaire and deterministic scores/);
  expect(screen.getByLabelText("MOSAIC explainer film, 92 seconds")).toBeVisible();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});

test("landing links resolve to sections or the assessment route", () => {
  render(<LandingPage />);
  for (const link of screen.getAllByRole("link")) {
    const href = link.getAttribute("href");
    if (href?.startsWith("/screenshots/") || href === "/research/ESG_Rating_Team_Report.pdf" || /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/.test(href ?? "") || href === "https://conservationen.see.org.cn/" || href === "/assessment" || href === "/media/mosaic-explainer-narrated-2026-11-03-1080p.mp4") continue;
    expect(href).toMatch(/^#[a-z-]+$/);
    expect(document.getElementById(href!.slice(1))).not.toBeNull();
  }
});

test("demo immediately follows the hero before longer context and approach content", () => {
  render(<LandingPage />);
  const sections = Array.from(screen.getByRole("main").children);
  expect(sections.map((section) => section.getAttribute("aria-labelledby"))).toEqual([
    "hero-heading", "demo-heading", "context-heading", "outputs-heading", "approach-heading", "research-heading", "closing-heading",
  ]);
});
