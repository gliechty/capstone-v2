import type {CanonicalConfig,MetricBenchmarksRecord,ScoringFormulaRecord} from '../config/types';
import {compileFormula} from './formula-expression';
export type FormulaParameter={name:string;label:string;defaultValue:number};
export const builtinVariables=['x','param_1','param_2','param_3','min_value','max_value','maximum','is_percent'] as const;
const inherited:Record<string,string>={
 identity_percent:'clamp(x, 0, maximum)',identity_boolean:'x',gaussian:'exp(-0.5 * ((x - param_1) / param_2)^2) * maximum',
 linear_cap:'min(x / param_1, 1) * maximum',inverse_count:'1 / (1 + x) * maximum',inverse_percentage:'clamp(1 - clamp(x, 0, 100) / 100, 0, 1) * 100',
 benchmark_inverse_ratio:'1 / (1 + x / param_1) * maximum',
 exponential_decay:'clamp((is_percent ? x / 100 : x) <= (is_percent && param_1 > 1 ? param_1 / 100 : param_1) ? 1 : exp(-(param_2 != 0 ? param_2 : 10) * ((is_percent ? x / 100 : x) - (is_percent && param_1 > 1 ? param_1 / 100 : param_1))), 0, 1) * maximum',
 inverse_linear_cap:'clamp(1 - min(x / (param_2 != 0 ? param_2 : max_value != 0 ? max_value : param_1), 1), 0, 1) * maximum',
 banded:'x <= param_1 ? 100 : x <= param_2 ? 75 : x <= param_3 ? 50 : 0'
};
export const legacyFormulas:readonly ScoringFormulaRecord[]=Object.entries(inherited).map(([formula_id,expression])=>({formula_id,name:formula_id.split('_').join(' '),expression,parameters:JSON.stringify(([1,2,3] as const).filter(n=>expression.includes('param_'+n)).map(n=>({name:'param_'+n,label:formula_id==='gaussian'?(n===1?'Ideal value':'Spread (standard deviation)'):'Parameter '+n,defaultValue:formula_id==='gaussian'?(n===1?40:10):n===1?1:0}))),explanation:'Imported from the existing scoring engine; methodology has not been newly endorsed. '+(formula_id==='gaussian'?'The inherited working_hours note claims about 67 at 60 hours, but parameters 40/10 produce about 13.53. Review this discrepancy.':''),examples:'0, 1, 10, 40, 60, 100'}));
export function formulasFor(config:CanonicalConfig){return config.ScoringFormulas??legacyFormulas;}
export function parameterDefinitions(formula:ScoringFormulaRecord):FormulaParameter[]{
 const parsed:unknown=JSON.parse(formula.parameters||'[]');if(!Array.isArray(parsed)||parsed.length>20)throw Error('Parameters must be a list of at most 20 definitions.');
 const result=parsed.map((p:unknown)=>{if(!p||typeof p!=='object')throw Error('Invalid parameter definition.');const v=p as FormulaParameter;if(typeof v.name!=='string'||!/^[A-Za-z_][A-Za-z_0-9]{0,49}$/.test(v.name)||typeof v.label!=='string'||v.label.length>200||typeof v.defaultValue!=='number'||!Number.isFinite(v.defaultValue))throw Error('Parameters need a valid name, label and finite numeric default.');if(builtinVariables.includes(v.name as never)&&!['param_1','param_2','param_3'].includes(v.name))throw Error('Reserved parameter name: '+v.name);return {name:v.name,label:v.label,defaultValue:v.defaultValue};});
 if(new Set(result.map(p=>p.name)).size!==result.length)throw Error('Duplicate parameter names.');return result;
}
export function formulaExamples(formula:ScoringFormulaRecord){const parts=formula.examples.split(',').map(s=>s.trim());if(parts.length<2||parts.length>30||parts.some(s=>!s||!Number.isFinite(Number(s))||Number(s)<0))throw Error('Provide 2–30 non-negative example inputs separated by commas.');return parts.map(Number);}
export function formulaValues(formula:ScoringFormulaRecord,metric:MetricBenchmarksRecord,x:number,isPercent=false){
 const definitions=parameterDefinitions(formula),override:unknown=JSON.parse(metric.formula_parameters||'{}');if(!override||Array.isArray(override)||typeof override!=='object')throw Error('Invalid formula parameter values.');
 const values:Record<string,number>={x,param_1:Number(metric.param_1||0),param_2:Number(metric.param_2||0),param_3:Number(metric.param_3||0),min_value:Number(metric.min_value),max_value:Number(metric.max_value),maximum:Number(metric.max_value)||100,is_percent:isPercent||metric.unit.toLowerCase().includes('percent')?1:0};
 for(const p of definitions)if(!Object.hasOwn(values,p.name))values[p.name]=p.defaultValue;
 for(const [key,value] of Object.entries(override)){if(!definitions.some(p=>p.name===key)||typeof value!=='number'||!Number.isFinite(value))throw Error('Unknown or invalid parameter: '+key);values[key]=value;}
 return values;
}
export function evaluateFormula(formula:ScoringFormulaRecord,metric:MetricBenchmarksRecord,x:number,isPercent=false){const definitions=parameterDefinitions(formula);return compileFormula(formula.expression,[...builtinVariables,...definitions.map(p=>p.name)])(formulaValues(formula,metric,x,isPercent));}
export function exampleMetric(formula:ScoringFormulaRecord):MetricBenchmarksRecord {const defaults=Object.fromEntries(parameterDefinitions(formula).map(p=>[p.name,p.defaultValue]));return {metric_id:'preview',metric_name:'Formula preview',normalization_method:formula.formula_id,benchmark_group_type:'global',benchmark_group_value:'',unit:'',param_1:String(defaults.param_1??0),param_2:String(defaults.param_2??0),param_3:String(defaults.param_3??0),min_value:'0',max_value:'100',direction:'neutral',notes:'',active:'TRUE'};}
