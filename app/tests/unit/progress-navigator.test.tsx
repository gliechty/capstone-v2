// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MobileQuestionRail, ProgressNavigator, type ProgressItem } from "../../src/features/assessment/progress-navigator";

afterEach(cleanup);
const items: ProgressItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: "fixture-" + i, number: i + 1, title: "Example question " + (i + 1),
  category: ["People", "Governance", "Community", "Resources"][Math.floor(i / 13)]!,
  status: i % 3 === 0 ? "Answered" : i % 3 === 1 ? "Unanswered" : "Unanswered · skipped",
  current: i === 24,
}));
test("50 positions retain individual callbacks, shape states, and category labels", () => {
  const onSelect = vi.fn();
  const { container } = render(<ProgressNavigator items={items} onSelect={onSelect} />);
  const rail = within(container.querySelector("aside")!);
  expect(rail.getAllByRole("button", { name: /^Question / })).toHaveLength(50);
  expect(rail.getAllByRole("list")).toHaveLength(1);
  expect(rail.getByText("Hover or focus to explore.")).toBeInTheDocument();
  expect(rail.getByRole("button", { name: /^Question 1:/ })).toHaveAccessibleName(/People/);
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
test("mobile rail selects a question and closes without hover behavior", () => {
 const onSelect=vi.fn();const {getByRole,queryByRole}=render(<MobileQuestionRail items={items} onSelect={onSelect}/>);
 const trigger=getByRole('button',{name:'Explore question track'});fireEvent.keyDown(trigger,{key:'End'});
 fireEvent.click(getByRole('button',{name:/^Go to question 48:/}));expect(onSelect).toHaveBeenCalledWith('fixture-47');
 expect(trigger).toHaveAttribute('aria-expanded','false');expect(queryByRole('group')).toBeNull();
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

test("mobile card rail exposes every state and keyboard neighborhoods without navigating until chosen", () => {
  const onSelect = vi.fn();
  const { container, getByRole } = render(<MobileQuestionRail items={items} onSelect={onSelect} />);
  expect(container.querySelectorAll(".mobile-rail-marker")).toHaveLength(50);
  expect(container.querySelectorAll('[data-current="true"]')).toHaveLength(1);
  const trigger = getByRole("button", { name: "Explore question track" });
  fireEvent.keyDown(trigger, { key: "End" });
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(onSelect).not.toHaveBeenCalled();
  fireEvent.click(getByRole("button", { name: /^Go to question 50:/ }));
  expect(onSelect).toHaveBeenCalledExactlyOnceWith("fixture-49");
  expect(trigger).toHaveFocus();
  fireEvent.keyDown(trigger, { key: "Home" });
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  expect(getByRole("button", { name: /^Go to question 2:/ })).toBeInTheDocument();
  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveFocus();
});
test("tap position opens five choices and tapping the rail updates the contextual window", () => {
  const onSelect = vi.fn();
  const { getByRole } = render(<MobileQuestionRail items={items} onSelect={onSelect} />);
  const trigger = getByRole("button", { name: "Explore question track" });
  Object.defineProperty(trigger,'setPointerCapture',{value:vi.fn()});
  trigger.querySelectorAll('.progress-glyph').forEach((el,i)=>vi.spyOn(el,'getBoundingClientRect').mockReturnValue({top:100+i*10,height:10} as DOMRect));
  fireEvent(trigger,new MouseEvent("pointerdown",{bubbles:true,clientY:345}));
  expect(getByRole("button", { name: /^Go to question 25:/ })).toBeInTheDocument();
  expect(within(getByRole("group", { name: "Choose a nearby question" })).getAllByRole("button")).toHaveLength(5);
  fireEvent(trigger,new MouseEvent("pointerdown",{bubbles:true,clientY:395}));
  fireEvent.click(getByRole("button", { name: /^Go to question 30:/ }));
  expect(onSelect).toHaveBeenCalledExactlyOnceWith("fixture-29");
});

test("mobile marker magnification follows tap and keyboard exploration and clears on close", () => {
  const { container, getByRole } = render(<MobileQuestionRail items={items} onSelect={vi.fn()} />);
  const trigger = getByRole("button", { name: "Explore question track" });
  vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({ top: 100, height: 500 } as DOMRect);
  fireEvent.click(trigger, { detail: 1, clientY: 345 });
  const markers = container.querySelectorAll(".mobile-rail-marker");
  expect(markers[24]).toHaveAttribute("data-proximity", "active");
  expect(markers[24]).toHaveAttribute("data-current", "true");
  expect(container.querySelectorAll('[data-proximity="near"]')).toHaveLength(4);
  fireEvent.keyDown(trigger, { key: "End" });
  expect(markers[49]).toHaveAttribute("data-proximity", "active");
  expect(markers[24]).toHaveAttribute("data-current", "true");
  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(container.querySelector('[data-proximity="active"]')).toBeNull();
});

test("mobile choice contact feedback cancels without navigation and releases before click", () => {
  const onSelect = vi.fn();
  const { getByRole } = render(<MobileQuestionRail items={items} onSelect={onSelect} />);
  fireEvent.click(getByRole("button", { name: "Explore question track" }));
  const choice = getByRole("button", { name: /^Go to question 25:/ });
  fireEvent.pointerDown(choice);
  expect(choice).toHaveAttribute("data-pressed", "true");
  expect(onSelect).not.toHaveBeenCalled();
  fireEvent.pointerCancel(choice);
  expect(choice).toHaveAttribute("data-pressed", "false");
  fireEvent.pointerDown(choice);
  fireEvent.pointerLeave(choice);
  expect(choice).toHaveAttribute("data-pressed", "false");
  fireEvent.pointerDown(choice);
  fireEvent.pointerUp(choice);
  expect(choice).toHaveAttribute("data-pressed", "false");
  fireEvent.click(choice);
  expect(onSelect).toHaveBeenCalledExactlyOnceWith("fixture-24");
});

test("outside tap dismisses without click-through; Escape restores focus and rail reopens", () => {
  const onSelect = vi.fn();
  const outsideAction = vi.fn();
  const { getByRole, queryByRole } = render(<><MobileQuestionRail items={items} onSelect={onSelect} /><button onClick={outsideAction}>Outside control</button></>);
  const trigger = getByRole("button", { name: "Explore question track" });
  fireEvent.click(trigger);
  const choice = getByRole("button", { name: /^Go to question 25:/ });
  choice.focus();
  fireEvent.click(getByRole("button", { name: "Outside control" }));
  expect(outsideAction).not.toHaveBeenCalled();
  expect(queryByRole("group")).toBeNull();
  expect(trigger).toHaveFocus();
  expect(onSelect).not.toHaveBeenCalled();
  fireEvent.click(trigger);
  fireEvent.keyDown(getByRole("button", { name: /^Go to question 25:/ }), { key: "Escape" });
  expect(queryByRole("group")).toBeNull();
  expect(trigger).toHaveFocus();
  expect(onSelect).not.toHaveBeenCalled();
});
