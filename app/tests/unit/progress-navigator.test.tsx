// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ProgressNavigator, type ProgressItem } from "../../src/features/assessment/progress-navigator";

afterEach(cleanup);
const items: ProgressItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: "fixture-" + i, number: i + 1, title: "Example question " + (i + 1),
  category: ["People", "Governance", "Community", "Resources"][Math.floor(i / 13)]!,
  status: i % 3 === 0 ? "Answered" : i % 3 === 1 ? "Unanswered" : "Unanswered · skipped",
  current: i === 24,
}));
test("50 positions retain individual callbacks, shape states, and secondary boundaries", () => {
  const onSelect = vi.fn();
  const { container } = render(<ProgressNavigator items={items} onSelect={onSelect} />);
  const rail = within(container.querySelector("aside")!);
  expect(rail.getAllByRole("button", { name: /^Question / })).toHaveLength(50);
  expect(rail.getAllByRole("list")).toHaveLength(1);
  expect(container.querySelectorAll("aside [data-boundary=true]")).toHaveLength(3);
  expect(container.querySelector(".progress-context")).toBeNull();
  expect(rail.getByRole("button", { name: /^Question 25:/ })).toHaveAttribute("aria-current", "step");
  expect(rail.getByRole("button", { name: /^Question 3:/ })).toHaveAccessibleName(/skipped/);
  for (let i = 0; i < items.length; i++) {
    fireEvent.click(rail.getByRole("button", { name: new RegExp("^Question " + (i + 1) + ":") }));
    expect(onSelect).toHaveBeenLastCalledWith(items[i]!.id);
  }
});
test("hover → click → leave → re-enter → hover another marker → click remains deterministic", () => {
  const onSelect = vi.fn();
  const { container, rerender } = render(<ProgressNavigator items={items} onSelect={onSelect} />);
  const rail = within(container.querySelector("aside")!);
  const track = container.querySelector(".progress-track")!;
  fireEvent.pointerEnter(rail.getByRole("button", { name: /^Question 25:/ }));
  expect(track).toHaveAttribute("data-inspected", "24");
  expect(rail.getByRole("group", { name: "Nearby questions" })).toBeInTheDocument();
  expect(container.querySelectorAll('aside [data-proximity="near"]')).toHaveLength(4);
  fireEvent.click(rail.getByRole("button", { name: /^Question 25:/ }));
  rerender(<ProgressNavigator items={items.map((item) => ({ ...item, current: item.number === 25 }))} onSelect={onSelect} />);
  fireEvent.pointerLeave(track);
  expect(rail.queryByRole("group")).toBeNull();
  fireEvent.pointerEnter(rail.getByRole("button", { name: /^Question 40:/ }));
  expect(track).toHaveAttribute("data-inspected", "39");
  fireEvent.click(rail.getByRole("button", { name: /^Question 40:/ }));
  expect(onSelect.mock.calls).toEqual([["fixture-24"], ["fixture-39"]]);
});
test("local large targets select nearby questions without changing the inspected anchor", () => {
  const onSelect = vi.fn();
  const { container } = render(<ProgressNavigator items={items} onSelect={onSelect} />);
  const rail = within(container.querySelector("aside")!);
  fireEvent.pointerEnter(rail.getByRole("button", { name: /^Question 25:/ }));
  const lens = rail.getByRole("group", { name: "Nearby questions" });
  expect(within(lens).getAllByRole("button")).toHaveLength(5);
  fireEvent.click(within(lens).getByRole("button", { name: /^Go to question 26:/ }));
  expect(onSelect).toHaveBeenCalledExactlyOnceWith("fixture-25");
  expect(container.querySelector(".progress-track")).toHaveAttribute("data-inspected", "24");
  fireEvent.focus(rail.getByRole("button", { name: /^Question 45:/ }));
  expect(container.querySelector(".progress-track")).toHaveAttribute("data-inspected", "44");
});
test("keyboard focus magnifies locally; arrows, Home, End and Escape do not select answers", () => {
  const onSelect = vi.fn();
  const { container } = render(<ProgressNavigator items={items} onSelect={onSelect} />);
  const rail = within(container.querySelector("aside")!);
  const first = rail.getByRole("button", { name: /^Question 1:/ });
  fireEvent.keyDown(first, { key: "ArrowDown" });
  const second = rail.getByRole("button", { name: /^Question 2:/ });
  expect(second).toHaveFocus();
  expect(container.querySelector(".progress-track")).toHaveAttribute("data-inspected", "1");
  fireEvent.keyDown(second, { key: "End" });
  const last = rail.getByRole("button", { name: /^Question 50:/ });
  expect(last).toHaveFocus();
  fireEvent.keyDown(last, { key: "Escape" });
  expect(rail.queryByRole("group")).toBeNull();
  fireEvent.keyDown(last, { key: "Home" });
  expect(first).toHaveFocus();
  expect(onSelect).not.toHaveBeenCalled();
});
test("mobile disclosure selects a question and closes without hover behavior", () => {
  const onSelect = vi.fn();
  const { container } = render(<ProgressNavigator items={items} onSelect={onSelect} />);
  const details = container.querySelector("details")!;
  details.open = true;
  fireEvent.click(within(details).getByRole("button", { name: /^Question 48:/ }));
  expect(onSelect).toHaveBeenCalledWith("fixture-47");
  expect(details.open).toBe(false);
  expect(within(details).queryByRole("group")).toBeNull();
});

test("switching from keyboard to a magnified pointer target clears detail on leave", () => {
  const onSelect = vi.fn();
  const { container } = render(<ProgressNavigator items={items} onSelect={onSelect} />);
  const rail = within(container.querySelector("aside")!);
  fireEvent.focus(rail.getByRole("button", { name: /^Question 25:/ }));
  const nearby = rail.getByRole("button", { name: /^Go to question 26:/ });
  fireEvent.pointerDown(nearby);
  fireEvent.pointerUp(nearby);
  fireEvent.click(nearby);
  expect(onSelect).toHaveBeenCalledWith("fixture-25");
  fireEvent.pointerLeave(container.querySelector(".progress-track")!);
  expect(rail.queryByRole("group")).toBeNull();
});
