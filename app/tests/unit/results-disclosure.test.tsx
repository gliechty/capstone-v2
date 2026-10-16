// @vitest-environment jsdom
import {afterEach,expect,test} from "vitest";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {ResultsDisclosure} from "../../src/features/results/results-disclosure";
afterEach(()=>{cleanup();sessionStorage.clear();});
test("disclosure starts closed, retains session preference and resets for different input",()=>{
 const first=render(<ResultsDisclosure id="actions" title="Recommended actions (1)" identity="input-one"><p>Advice</p></ResultsDisclosure>);
 const details=screen.getByText("Advice").closest("details")!;
 expect(details.open).toBe(false);details.open=true;fireEvent(details, new Event("toggle"));
 first.unmount();const second=render(<ResultsDisclosure id="actions" title="Recommended actions (1)" identity="input-one"><p>Advice</p></ResultsDisclosure>);
 expect(screen.getByText("Advice").closest("details")!.open).toBe(true);
 second.rerender(<ResultsDisclosure id="actions" title="Recommended actions (0)" identity="input-two"><p>New assessment</p></ResultsDisclosure>);
 expect(screen.getByText("New assessment").closest("details")!.open).toBe(false);
});
