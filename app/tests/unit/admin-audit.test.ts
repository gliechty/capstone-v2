import {describe,it,expect} from 'vitest';
import {auditTable,auditCsv,parseAuditCsv} from '../../src/application/admin/audit-artifacts';
describe('read-only audit formats',()=>{
 it('preserves quoted multiline cells and duplicate headers',()=>{const t={columns:['a','a'],rows:[['comma, quote"','line\nnext'],['-2.5','plain']]};expect(parseAuditCsv(auditCsv(t))).toEqual(t);});
 it('rejects malformed archives rather than dropping records',()=>{for(const s of ['a,b\n1','a\n"unfinished','a\n"x"junk'])expect(()=>parseAuditCsv(s)).toThrow();});
 it('neutralizes spreadsheet formulas while preserving numeric values',()=>{expect(parseAuditCsv(auditCsv({columns:['value'],rows:[['=1+1'],[' @SUM(A1)'],['-2.5']]})).rows).toEqual([["'=1+1"],["' @SUM(A1)"],['-2.5']]);});
 it('renders nested values as readable fields',()=>{expect(auditTable([{id:'x',options:[{label:'Yes',score:100}]}])).toEqual({columns:['id','options'],rows:[['x','label: Yes\nscore: 100']]});});
});
