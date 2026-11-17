import {test,expect} from "vitest";
import {config} from "../helpers/recommendation-fixture";
import {assessmentCatalog} from "../../src/application/assessment-catalog";
import {answerError} from "../../src/features/assessment/model";
import {normalizeAnswer} from "../../src/domain/scoring/score-assessment";
import {displayNumber,displayAnswer,sourceLabel} from "../../src/application/display-value";
const catalog=assessmentCatalog(config),industry="Manufacturing (Industrial / Components)";
test.each([["U-026",100],["U-021",100],["U-020",168]] as const)("UI and server agree on %s physical limits",(id,max)=>{
 const q=catalog.questions.find(q=>q.id===id)!,record=config.QuestionBank.find(q=>q.question_id===id)!;
 for(const raw of ["0",String(max)]){expect(answerError(q,raw)).toBeUndefined();expect(()=>normalizeAnswer(config,record,raw,industry)).not.toThrow();}
 for(const raw of [String(max+1),"500","-5","abc"]){expect(answerError(q,raw)).toBeTruthy();expect(()=>normalizeAnswer(config,record,raw,industry)).toThrow();}
});
test("all catalog percentage and weekly-hours fields enforce physical limits without capping counts",()=>{
 for(const q of catalog.questions.filter(q=>q.kind==="percent"||q.unit==="%"))expect(answerError(q,"101")).toBeTruthy();
 const count=catalog.questions.find(q=>q.id==="U-035")!;expect(answerError(count,"500")).toBeUndefined();
});
test("display formatting is consistent, keeps small nonzero values and never changes raw input",()=>{
 const raw="8.628127696289905";expect(displayAnswer(raw,"%")).toBe("8.63 %");expect(raw).toBe("8.628127696289905");
 expect(displayNumber(0.000052747596407818275,"tCO2e/USD")).toBe("0.00005275");
 expect(displayAnswer("0.12245113576333862","kWh/USD")).toBe("0.1225 kWh/USD");
 expect(displayAnswer("0.0005282620179609086","m3/USD")).toBe("0.0005283 m3/USD");
 expect(displayAnswer("0.0002113048072","kg/USD")).toBe("0.0002113 kg/USD");
 expect(displayNumber(1e-20,"%")).not.toBe("0");expect(displayAnswer("0","%")).toBe("0 %");
 expect(displayAnswer("abc","%")).toBe("abc");expect(displayAnswer("Yes")).toBe("Yes");
 expect(sourceLabel({site:"",source:"gas therm"})).toBe("gas therm");
 expect(sourceLabel({site:"Guangdong plant",source:"Grid electricity"})).toBe("Guangdong plant / Grid electricity");
});
