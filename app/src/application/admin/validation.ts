import {formulaChanges,validateFormulas} from './formulas';
import { z } from "zod";
import type { CanonicalConfig } from "../../domain/config/types";
import { entitySchemas, validateRelations, type EntityName } from "../config/schemas";
import { setupConfig } from "../assessment-setup";
import { canonicalToken } from "../../domain/selection/select-questions";
import { AdminError, benchmarkKey, scaleKey, type Change, type Issue, type Reviews, type Validation } from "./contracts";
export const entities = Object.keys(entitySchemas) as EntityName[];
export const editable = ["QuestionBank", "MetricBenchmarks", "AnswerScales"] as const;
const questionFields = new Set(["question_text", "answer_scale_id", "metric_id"]);
// Explicit inherited defect; never infer new exemptions from whichever baseline is loaded.
const acceptedBaselineIssues = new Set(['inactive-metric:I-045']);
const reviewSchema = z.strictObject({ citation: z.string().max(2000), sourceYear: z.string().regex(/^(?:\d{4})?$/), reviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), reviewDue: z.string().regex(/^(?:\d{4}-\d{2}-\d{2})?$/), status: z.enum(["reviewed", "provisional"]), rationale: z.string().trim().min(1).max(2000) });
export const draftInput = z.strictObject({ revision: z.number().int().positive(), QuestionBank: entitySchemas.QuestionBank, MetricBenchmarks: entitySchemas.MetricBenchmarks, AnswerScales: entitySchemas.AnswerScales, reviews: z.record(z.string().max(300), reviewSchema) });
export function applyDraft(base: CanonicalConfig, input: z.infer<typeof draftInput>): CanonicalConfig {
    if (input.QuestionBank.length !== base.QuestionBank.length)
        throw new AdminError("Questions cannot be added or deleted in this package.");
    input.QuestionBank.forEach((q, index) => {
        const original = base.QuestionBank[index]!;
        for (const key of Object.keys(original) as (keyof typeof q)[])
            if (!questionFields.has(key) && q[key] !== original[key])
                throw new AdminError(q.question_id + ": " + key + " is read-only.");
        if (!q.question_text.trim() || q.question_text.length > 4000)
            throw new AdminError("Question wording must contain 1–4,000 characters.");
    });
    return { ...base, QuestionBank: input.QuestionBank, MetricBenchmarks: input.MetricBenchmarks, AnswerScales: input.AnswerScales };
}
function keyFor(entity: EntityName, row: Record<string, string>) { return entity === "QuestionBank" ? row.question_id! : entity === "MetricBenchmarks" ? benchmarkKey(row as never) : scaleKey(row as never); }
export function changes(before: CanonicalConfig, after: CanonicalConfig): Change[] {
    const result: Change[] = [];
    for (const entity of editable) {
        const a = new Map((before[entity] as unknown as Record<string, string>[]).map(r => [keyFor(entity, r), r]));
        const b = new Map((after[entity] as unknown as Record<string, string>[]).map(r => [keyFor(entity, r), r]));
        for (const key of new Set([...a.keys(), ...b.keys()])) {
            const x = a.get(key), y = b.get(key);
            if (!x || !y) {
                result.push({ entity, key, field: x ? "deleted" : "added", before: x ? JSON.stringify(x) : "", after: y ? JSON.stringify(y) : "" });
                continue;
            }
            for (const field of Object.keys(y))
                if (x[field] !== y[field])
                    result.push({ entity, key, field, before: x[field] ?? "", after: y[field] ?? "" });
        }
    }
    return [...result,...formulaChanges(before,after)];
}
// These are checks of existing runtime contracts, not a new scoring method.
const unitKey = (unit: string) => /^(%|percent|percentage)$/i.test(unit.trim()) ? '%' : unit.trim().toLowerCase();
function structural(config: CanonicalConfig): Issue[] {
    const issues: Issue[] = [];
    const add = (key: string, message: string, questions: string[] = []) => issues.push({ key, message, questions });
    for (const entity of entities) {
        const p = entitySchemas[entity].safeParse(config[entity]);
        if (!p.success)
            add(entity + ":shape", entity + ": invalid record shape");
    }
    try {
        validateRelations(config);
    }
    catch (e) {
        add("relations:" + String(e), String(e));
    }
    const scales = new Map<string, typeof config.AnswerScales>();
    for (const s of config.AnswerScales)
        scales.set(s.answer_scale_id, [...(scales.get(s.answer_scale_id) ?? []), s]);
    for (const [id, rows] of scales) {
        const active = rows.filter(r => r.active === "TRUE");
        if (new Set(active.map(r => r.answer_option.trim().toLowerCase())).size !== active.length)
            add("scale-options:" + id, "Duplicate answer labels in " + id);
        if (new Set(active.map(r => Number(r.display_order))).size !== active.length)
            add("scale-order:" + id, "Duplicate display positions in " + id);
        if (rows.some(r => Number(r.normalized_score) < 0 || Number(r.normalized_score) > 100))
            add("scale-score:" + id, "Scale scores must be between 0 and 100: " + id);
    }
    for (const m of config.MetricBenchmarks) {
        const key = benchmarkKey(m), affected = config.QuestionBank.filter(q => q.metric_id === m.metric_id).map(q => q.question_id);
        if (!m.unit.trim())
            add("unit:" + key, "Benchmark unit is required: " + key, affected);
        if (Number(m.min_value) > Number(m.max_value) || Number(m.min_value) < 0 || Number(m.max_value) > 100)
            add("bounds:" + key, "Normalized bounds must satisfy 0 ≤ min ≤ max ≤ 100: " + key, affected);
        if (m.benchmark_group_type === "industry" && !setupConfig.options.industry.some(i => i.value === m.benchmark_group_value))
            add("industry:" + key, "Unknown benchmark industry: " + key, affected);
        if (!config.ScoringFormulas && ["linear_cap", "benchmark_inverse_ratio"].includes(m.normalization_method) && !(Number(m.param_1) > 0))
            add("param1:" + key, "Positive param_1 required: " + key, affected);
        if (!config.ScoringFormulas && m.normalization_method === "gaussian" && !(Number(m.param_2) > 0))
            add("gaussian:" + key, "Gaussian width must be positive: " + key, affected);
        if (!config.ScoringFormulas && m.normalization_method === "inverse_linear_cap" && !(Number(m.param_2) || Number(m.max_value) || Number(m.param_1)))
            add("cap:" + key, "Inverse cap denominator must be nonzero: " + key, affected);
        if (!config.ScoringFormulas && m.normalization_method === "banded" && !(Number(m.param_1) <= Number(m.param_2) && Number(m.param_2) <= Number(m.param_3)))
            add("bands:" + key, "Band thresholds must be ordered: " + key, affected);
    }
    for (const q of config.QuestionBank.filter(q => q.active === "TRUE")) {
        if (["boolean", "categorical"].includes(q.response_type)) {
            const rows = (scales.get(q.answer_scale_id) ?? []).filter(r => r.active === "TRUE");
            if (rows.length < 2)
                add("scale:" + q.question_id, "Question requires at least two active scale options: " + q.question_id, [q.question_id]);
            // Both types use configured option labels/scores in the existing engine.
            // Approved boolean-labelled questions also use PARTIAL_3 and PROGRESS_5.
        }
        else if (["numeric", "percent"].includes(q.response_type)) {
            const rows = config.MetricBenchmarks.filter(m => m.metric_id === q.metric_id && m.active === "TRUE");
            if (!rows.length)
                add("metric:" + q.question_id, "No active benchmark for " + q.question_id, [q.question_id]);
            if (new Set(rows.map(r => unitKey(r.unit))).size > 1)
                add("mixed-units:" + q.question_id, "Metric variants have incompatible units: " + q.question_id, [q.question_id]);
            if (q.response_type === "percent" && rows.some(r => !/^(%|percent|percentage)(?:\s|$)/i.test(r.unit.trim())))
                add("percent-unit:" + q.question_id, "Percent question requires percentage units: " + q.question_id, [q.question_id]);
            // Preserve numeric scale markers; they are not categorical option references.
            // Check every industry the question can select, independently of market or size.
            const triggers = (q.industry_trigger || 'ANY').split(/[;,]/).map(canonicalToken);
            const industryOptions = setupConfig.options.industry.map(i => i.value).filter(industry => triggers.includes('any') || triggers.includes(canonicalToken(industry)));
            for (const industry of industryOptions)
                if (!rows.some(m => m.benchmark_group_type === 'global' || ['', 'all', 'none'].includes(m.benchmark_group_value.toLowerCase()) || m.benchmark_group_value === industry))
                    add("applicability:" + q.question_id + ":" + industry, "No applicable benchmark for " + q.question_id + " / " + industry, [q.question_id]);
        }
    }
    for (const q of config.QuestionBank.filter(q=>q.active!=="TRUE")) {
        if(q.metric_id&&!config.MetricBenchmarks.some(m=>m.metric_id===q.metric_id))add('inactive-metric:'+q.question_id,'Inactive source record has a missing metric: '+q.question_id,[q.question_id]);
        if(['boolean','categorical'].includes(q.response_type)&&!config.AnswerScales.some(s=>s.answer_scale_id===q.answer_scale_id))add('inactive-scale:'+q.question_id,'Inactive source record has a missing scale: '+q.question_id,[q.question_id]);
    }
    return [...issues,...validateFormulas(config)];
}
export function validateDraft(config: CanonicalConfig, approvedBaseline: CanonicalConfig, reviews: Reviews, previous = approvedBaseline): Validation {
    const old = new Map(structural(approvedBaseline).map(i => [i.key, i]));
    const delta = changes(approvedBaseline, config);
    const errors: Issue[] = [], warnings: Issue[] = [];
    for (const deletion of changes(previous, config).filter(d => d.field === 'deleted')) {
        const removed = JSON.parse(deletion.before) as Record<string, string>;
        const affected = config.QuestionBank.filter(q => deletion.entity === 'MetricBenchmarks' ? q.metric_id === removed.metric_id : deletion.entity === 'AnswerScales' ? q.answer_scale_id === removed.answer_scale_id && !config.AnswerScales.some(s => s.answer_scale_id === removed.answer_scale_id) : false);
        if (affected.length)
            errors.push({ key: 'deleted-reference:' + deletion.entity + ':' + deletion.key, message: 'Deleted ' + deletion.entity + ' record is still assigned. Reassign affected questions before publication.', questions: affected.map(q => q.question_id) });
    }
    for (const issue of structural(config)) {
        const untouched = issue.questions.length ? !delta.some(d => issue.questions.includes(d.key) || d.entity !== 'QuestionBank' && issue.questions.some(id => { const q = config.QuestionBank.find(q => q.question_id === id); return q && (d.key.startsWith(q.metric_id + '|') || d.key.startsWith(q.answer_scale_id + '|')); })) : !delta.length;
        if (acceptedBaselineIssues.has(issue.key) && old.has(issue.key) && untouched)
            warnings.push({ ...issue, message: 'Accepted baseline limitation (unchanged): ' + issue.message });
        else
            errors.push(issue);
    }
    for (const q of config.QuestionBank) {
        const prior = approvedBaseline.QuestionBank.find(r => r.question_id === q.question_id)!;
        if (q.answer_scale_id !== prior.answer_scale_id && !['boolean', 'categorical'].includes(q.response_type))
            errors.push({ key: 'numeric-scale:' + q.question_id, message: 'Keep the existing numeric/text scale marker for ' + q.question_id, questions: [q.question_id] });
        if (q.metric_id !== prior.metric_id) {
            if (!['numeric', 'percent'].includes(q.response_type))
                errors.push({ key: 'unused-metric:' + q.question_id, message: 'This response type uses an answer scale, not a metric: ' + q.question_id, questions: [q.question_id] });
        }
        if (['numeric', 'percent'].includes(q.response_type)) {
            const oldUnits = new Set(approvedBaseline.MetricBenchmarks.filter(m => m.metric_id === prior.metric_id).map(m => unitKey(m.unit)));
            if (oldUnits.size && config.MetricBenchmarks.filter(m => m.metric_id === q.metric_id).some(m => !oldUnits.has(unitKey(m.unit))))
                errors.push({ key: 'mapping-unit:' + q.question_id, message: 'Mapping must preserve the existing question unit/denominator: ' + q.question_id, questions: [q.question_id] });
        }
    }
    for (const entity of ['MetricBenchmarks', 'AnswerScales'] as const) {
        for (const row of config[entity]) {
            const key = entity + ':' + keyFor(entity, row as unknown as Record<string, string>);
            if (delta.some(d => d.entity === entity && d.key === key.substring(entity.length + 1))) {
                const review = reviews[key];
                if (!review || !review.citation.trim() || review.status !== 'reviewed')
                    errors.push({ key: 'review:' + key, message: 'Changed/new entry needs a citation and reviewed rationale: ' + key, questions: [] });
            }
        }
    }
    warnings.push({ key: 'source-originals', message: 'Original source files and some row-level provenance are unavailable. Imported artifacts are archived; no regeneration ran.', questions: [] });
    const u = config.QuestionBank.find(q => q.question_id === 'U-026');
    if (u && JSON.stringify(u) === JSON.stringify(approvedBaseline.QuestionBank.find(q => q.question_id === 'U-026')))
        warnings.push({ key: 'U-026', message: 'U-026: accepted total-energy transfer retains inherited electricity benchmark wording; methodology review remains unresolved.', questions: ['U-026'] });
    return { errors, warnings };
}
