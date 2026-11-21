// Small bounded mathematical grammar. Never evaluates JavaScript or accesses objects.
type Node={kind:'number';value:number}|{kind:'variable';name:string}|{kind:'call';name:string;args:Node[]}|{kind:'op';op:string;args:Node[]};
const functions:Record<string,{arity:number;fn:(...n:number[])=>number}>={exp:{arity:1,fn:Math.exp},log:{arity:1,fn:Math.log},sqrt:{arity:1,fn:Math.sqrt},abs:{arity:1,fn:Math.abs},min:{arity:2,fn:Math.min},max:{arity:2,fn:Math.max},pow:{arity:2,fn:Math.pow},clamp:{arity:3,fn:(x,a,b)=>Math.max(a,Math.min(b,x))}};
const precedence:Record<string,number>={'||':1,'&&':2,'==':3,'!=':3,'<':4,'>':4,'<=':4,'>=':4,'+':5,'-':5,'*':6,'/':6,'%':6,'^':7,'**':7};
export function compileFormula(source:string,variables:readonly string[]) {
 if(!source.trim()||source.length>2000)throw Error('Formula must contain 1–2,000 characters.');
 const tokens:string[]=[];let rest=source.trim();while(rest){const match=/^(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*|\*\*|<=|>=|==|!=|&&|\|\||[+\-*/%^<>()?:,!])/.exec(rest);if(!match)throw Error('Unsupported formula syntax near '+rest.slice(0,20));tokens.push(match[0]);rest=rest.slice(match[0].length).trimStart();if(tokens.length>500)throw Error('Formula is too complex.');}
 let pos=0;const allowed=new Set(variables);const take=(value:string)=>{if(tokens[pos]!==value)throw Error('Expected '+value);pos++;};
 function parse(min=0,depth=0):Node {
  if(depth>40)throw Error('Formula nesting is too deep.');let node:Node;const t=tokens[pos++];
  if(!t)throw Error('Incomplete formula.');
  if(t==='('){node=parse(0,depth+1);take(')');}
  else if(['-','+','!'].includes(t))node={kind:'op',op:'unary'+t,args:[parse(7,depth+1)]};
  else if(/^(?:\d|\.)/.test(t)){const value=Number(t);if(!Number.isFinite(value))throw Error('Non-finite number.');node={kind:'number',value};}
  else if(/^[A-Za-z_]/.test(t)){
   if(tokens[pos]==='('){pos++;const args:Node[]=[];if(tokens[pos]!==')'){args.push(parse(0,depth+1));while(tokens[pos]===','){pos++;args.push(parse(0,depth+1));}}take(')');if(!Object.hasOwn(functions,t)||args.length!==functions[t]!.arity)throw Error('Unknown function or wrong argument count: '+t);node={kind:'call',name:t,args};}
   else {if(!allowed.has(t))throw Error('Undefined variable: '+t);node={kind:'variable',name:t};}
  }else throw Error('Unexpected token: '+t);
  while(pos<tokens.length){const op=tokens[pos]!;if(op==='?'&&min===0){pos++;const yes=parse(0,depth+1);take(':');const no=parse(0,depth+1);node={kind:'op',op:'?',args:[node,yes,no]};continue;}const level=Object.hasOwn(precedence,op)?precedence[op]:undefined;if(level===undefined||level<min)break;pos++;node={kind:'op',op,args:[node,parse(level+(op==='^'||op==='**'?0:1),depth+1)]};}return node;
 }
 const root=parse();if(pos!==tokens.length)throw Error('Unexpected trailing formula text.');
 return (values:Readonly<Record<string,number>>):number=>{
  function evaluate(n:Node):number{
   if(n.kind==='number')return n.value;if(n.kind==='variable'){const v=values[n.name];if(v===undefined||!Number.isFinite(v))throw Error('Missing finite value: '+n.name);return v;}
   if(n.kind==='call')return finite(functions[n.name]!.fn(...n.args.map(evaluate)));
   const a=evaluate(n.args[0]!);if(n.op==='?')return evaluate(n.args[a?1:2]!);if(n.op==='&&')return a?Number(!!evaluate(n.args[1]!)):0;if(n.op==='||')return a?1:Number(!!evaluate(n.args[1]!));
   if(n.op==='unary-')return -a;if(n.op==='unary+')return a;if(n.op==='unary!')return Number(!a);const b=evaluate(n.args[1]!);
   switch(n.op){case '+':return finite(a+b);case '-':return finite(a-b);case '*':return finite(a*b);case '/':if(b===0)throw Error('Division by zero.');return finite(a/b);case '%':if(b===0)throw Error('Division by zero.');return finite(a%b);case '^':case '**':return finite(a**b);case '<':return Number(a<b);case '>':return Number(a>b);case '<=':return Number(a<=b);case '>=':return Number(a>=b);case '==':return Number(a===b);case '!=':return Number(a!==b);default:throw Error('Unsupported operator.');}
  }return finite(evaluate(root));
 };
}
function finite(v:number){if(!Number.isFinite(v))throw Error('Formula produced a non-finite result.');return v;}
