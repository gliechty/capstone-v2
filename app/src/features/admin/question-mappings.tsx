import type { CanonicalConfig, QuestionBankRecord } from '../../domain/config/types';
export type QuestionEdit = {question_text?:string;answer_scale_id?:string;metric_id?:string};
export function QuestionMappings({config,question,onChange}:{config:CanonicalConfig;question:QuestionBankRecord;onChange:(field:keyof QuestionEdit,value:string)=>void}) {
  const categorical=['boolean','categorical'].includes(question.response_type);
  const numeric=['numeric','percent'].includes(question.response_type);
  const scales=[...new Set(config.AnswerScales.filter(s=>s.active==='TRUE').map(s=>s.answer_scale_id))];
  const metrics=[...new Set(config.MetricBenchmarks.filter(m=>m.active==='TRUE').map(m=>m.metric_id))];
  const options=config.AnswerScales.filter(s=>s.answer_scale_id===question.answer_scale_id&&s.active==='TRUE').sort((a,b)=>Number(a.display_order)-Number(b.display_order));
  const benchmarks=config.MetricBenchmarks.filter(m=>m.metric_id===question.metric_id&&m.active==='TRUE');
  return <div>
    <label>AnswerScale<select aria-label="AnswerScale" value={question.answer_scale_id} disabled={!categorical} onChange={e=>onChange('answer_scale_id',e.target.value)}>
      {!scales.includes(question.answer_scale_id)&&<option value={question.answer_scale_id}>{question.answer_scale_id||'None'}</option>}
      {scales.map(id=><option key={id} value={id}>{id}</option>)}
    </select></label>
    {categorical?<div aria-label="AnswerScale preview"><h3>Answer options and scores</h3><table><thead><tr><th>Answer option</th><th>Score</th></tr></thead><tbody>{options.map(s=><tr key={s.answer_option}><td>{s.answer_option}</td><td>{s.normalized_score}</td></tr>)}</tbody></table>{options.length<2&&<p role="alert">This question needs a scale with at least two active answer options.</p>}</div>:<p>The {question.response_type} input marker is read-only. Numeric answers are scored using the benchmark below, not a fixed scale score.</p>}
    <label>MetricBenchmark<select aria-label="MetricBenchmark" value={question.metric_id} disabled={!numeric} onChange={e=>onChange('metric_id',e.target.value)}>
      <option value="">None</option>{question.metric_id&&!metrics.includes(question.metric_id)&&<option value={question.metric_id}>{question.metric_id} (unavailable)</option>}
      {metrics.map(id=><option key={id} value={id}>{id} · {config.MetricBenchmarks.find(m=>m.metric_id===id)?.metric_name}</option>)}
    </select></label>
    {!numeric?<p>This question uses answer-scale scores; a metric mapping does not apply.</p>:<div aria-label="MetricBenchmark preview"><p>Choose a benchmark with the same unit and denominator as the question. All available metrics are listed; review validates compatibility.</p>{benchmarks.map(m=><article key={[m.metric_id,m.benchmark_group_type,m.benchmark_group_value].join('|')}><h3>{m.metric_name}</h3><dl className="admin-summary"><div><dt>Unit</dt><dd>{m.unit}</dd></div><div><dt>Applies to</dt><dd>{m.benchmark_group_type}: {m.benchmark_group_value||'All'}</dd></div><div><dt>Normalization</dt><dd>{m.normalization_method}</dd></div><div><dt>Direction</dt><dd>{m.direction}</dd></div><div><dt>Minimum / maximum</dt><dd>{m.min_value} / {m.max_value}</dd></div><div><dt>Parameters 1 / 2 / 3</dt><dd>{m.param_1||'—'} / {m.param_2||'—'} / {m.param_3||'—'}</dd></div></dl><p>{m.notes||'No notes recorded'}</p></article>)}{!benchmarks.length&&<p role="alert">No active benchmark selected.</p>}</div>}
  </div>;
}
