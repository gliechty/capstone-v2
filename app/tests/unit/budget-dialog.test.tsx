// @vitest-environment jsdom
import {test,expect,vi,afterEach} from "vitest";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {BudgetLimitDialog,budgetLimitMessage} from "../../src/features/results/budget-limit-dialog";
afterEach(cleanup);
test("budget modal is labelled, dismissible and restores focus without hiding scores",()=>{
 Object.defineProperty(HTMLDialogElement.prototype,"showModal",{configurable:true,writable:true,value:()=>{}});
 Object.defineProperty(HTMLDialogElement.prototype,"close",{configurable:true,writable:true,value:()=>{}});
 const show=vi.spyOn(HTMLDialogElement.prototype,"showModal").mockImplementation(function(this:HTMLDialogElement){this.setAttribute("open","");});
 const close=vi.spyOn(HTMLDialogElement.prototype,"close").mockImplementation(function(this:HTMLDialogElement){this.removeAttribute("open");this.dispatchEvent(new Event("close"));});
 const trigger=document.createElement("button");document.body.append(trigger);trigger.focus();
 const {rerender}=render(<><p>Score: 51.0</p><BudgetLimitDialog blocked={false}/></>);
 rerender(<><p>Score: 51.0</p><BudgetLimitDialog blocked/></>);
 expect(screen.getByRole("dialog",{name:"Daily AI budget reached"})).toHaveAccessibleDescription(budgetLimitMessage);
 expect(screen.getByText("Score: 51.0")).toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Close"}));expect(trigger).toHaveFocus();
 trigger.remove();show.mockRestore();close.mockRestore();
});
