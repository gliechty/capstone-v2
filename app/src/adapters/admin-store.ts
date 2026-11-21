import {formulaList} from '../application/admin/formulas';
import {formulasFor} from '../domain/scoring/scoring-formulas';
import { DatabaseSync } from "node:sqlite";
import { createHash, randomUUID, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { effortArtifact, questionHash, quickEligibility } from '../application/admin/quick-wording';
import { loadCanonicalConfig } from "./config-repository";
import type { CanonicalConfig } from "../domain/config/types";
import { AdminError, type Actor, type Draft, type Release, type Reviews, type QuickDecision } from "../application/admin/contracts";
import { applyDraft, changes, draftInput, entities, validateDraft } from "../application/admin/validation";
export const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
export const adminDataPath = () => path.resolve(/* turbopackIgnore: true */ process.env.MOSAIC_ADMIN_DATA_DIR || path.join(process.cwd(), ".local", "m6-admin"));
type Row = Record<string, string | number | null>;
const questionInput = z.strictObject({
    base: z.string().min(1).max(100),
    edits: z.array(z.strictObject({ question_id: z.string().min(1).max(100), question_text: z.string().trim().min(1).max(4000).optional(), answer_scale_id: z.string().max(200).optional(), metric_id: z.string().max(200).optional() })).min(1).max(500),
    notes: z.string().trim().max(2000).default(''),
    quickChoices: z.record(z.string().max(100), z.enum(['keep','exclude'])).default({}),
    expectedLatest: z.string().min(1).max(100),
});
const scoringInput = z.strictObject({entity:z.enum(['AnswerScales','MetricBenchmarks','ScoringFormulas']), formulas:formulaList.optional(), expectedActive:z.string(), expectedScoring:z.string(), rows:z.array(z.unknown()).max(10000), notes:z.string().trim().max(2000).default(''), citation:z.string().trim().max(2000), rationale:z.string().trim().max(2000)});
export class AdminStore {
    readonly db: DatabaseSync;
    readonly baseline: CanonicalConfig;
    constructor(readonly directory = adminDataPath(), baseline = loadCanonicalConfig().config) {
        this.baseline = baseline;
        mkdirSync(path.join(directory, 'blobs'), { recursive: true, mode: 0o700 });
        this.db = new DatabaseSync(path.join(directory, 'admin.sqlite'));
        this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS releases(id TEXT PRIMARY KEY, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS scoring_publications(id TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS drafts(id TEXT PRIMARY KEY,base TEXT NOT NULL,revision INTEGER NOT NULL,updated_at TEXT NOT NULL,updated_by TEXT NOT NULL,hash TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS admins(email TEXT PRIMARY KEY,role TEXT NOT NULL CHECK(role IN ('super_admin','admin')),enabled INTEGER NOT NULL,subject TEXT);
      CREATE TABLE IF NOT EXISTS dev_sessions(token TEXT PRIMARY KEY,email TEXT NOT NULL,expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,at TEXT NOT NULL,actor TEXT NOT NULL,identity TEXT NOT NULL,action TEXT NOT NULL,details TEXT NOT NULL);
      INSERT OR IGNORE INTO schema_migrations VALUES(1);`);
        this.transaction(() => {
            if (!this.db.prepare('SELECT id FROM releases WHERE id=?').get(baseline.version)) {
                const release = this.packageRelease(baseline.version, 'Approved MOSAIC baseline', baseline, {}, null, null, null);
                this.db.prepare('INSERT INTO releases VALUES(?,?)').run(release.id, JSON.stringify(release));
                this.db.prepare("INSERT OR IGNORE INTO settings VALUES('active',?)").run(release.id);
            }
            const email = process.env.MOSAIC_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
            if (email)
                this.db.prepare("INSERT OR IGNORE INTO admins VALUES(?,'super_admin',1,NULL)").run(email);
        });
    }
    transaction<T>(work: () => T): T { this.db.exec('BEGIN IMMEDIATE'); try {
        const result = work();
        this.db.exec('COMMIT');
        return result;
    }
    catch (e) {
        this.db.exec('ROLLBACK');
        throw e;
    } }
    private put(data: unknown) { const raw = JSON.stringify(data), id = hash(raw), file = path.join(this.directory, 'blobs', id + '.json'); if (!existsSync(file))
        writeFileSync(file, raw, { flag: 'wx', mode: 0o600 }); return id; }
    private read<T>(id: string): T { if (!/^[a-f0-9]{64}$/.test(id))
        throw new AdminError('Invalid artifact identity'); const raw = readFileSync(path.join(this.directory, 'blobs', id + '.json'), 'utf8'); if (hash(raw) !== id)
        throw new AdminError('Artifact integrity check failed', 503); return JSON.parse(raw) as T; }
    private packageRelease(id: string, name: string, config: CanonicalConfig, reviews: Reviews, createdAt: string | null, publishedAt: string | null, publishedBy: string | null): Omit<Release, 'config' | 'reviews'> {
        const files = Object.fromEntries(entities.map(entity => [entity, { sha256: hash(JSON.stringify(config[entity])), records: config[entity].length }])) as Release['files'];
        return { id, name, createdAt, publishedAt, publishedBy, importedAt: new Date().toISOString(), hash: this.put({ config, reviews }), files: {...files,...(config.ScoringFormulas?{ScoringFormulas:{sha256:hash(JSON.stringify(config.ScoringFormulas)),records:config.ScoringFormulas.length}}:{})} };
    }
    release(id?: string): Release {
        const key = id ?? String((this.db.prepare("SELECT value FROM settings WHERE key='active'").get() as Row).value);
        const row = this.db.prepare('SELECT data FROM releases WHERE id=?').get(key) as Row | undefined;
        if (!row)
            throw new AdminError('Release unavailable; the session has not been changed.', 404);
        const meta = JSON.parse(String(row.data)) as Omit<Release, 'config' | 'reviews'>;
        return { ...meta, ...this.read<{
                config: CanonicalConfig;
                reviews: Reviews;
            }>(meta.hash) };
    }
    listReleases() { return (this.db.prepare('SELECT data FROM releases ORDER BY rowid DESC').all() as Row[]).map(r => JSON.parse(String(r.data)) as Omit<Release, 'config' | 'reviews'>); }
    scoring() {
        const row=this.db.prepare("SELECT value FROM settings WHERE key='scoring'").get() as Row|undefined;
        return this.release(row ? String(row.value) : undefined);
    }
    scoringHistory() { return (this.db.prepare('SELECT id FROM scoring_publications ORDER BY rowid DESC').all() as Row[]).map(r=>{const {config: _config,reviews: _reviews,...meta}=this.release(String(r.id));void _config;void _reviews;return meta;}); }
    private withScoring(base: Release): Release {
        const master=this.scoring();
        return {...base,config:{...base.config,AnswerScales:master.config.AnswerScales,MetricBenchmarks:master.config.MetricBenchmarks,ScoringFormulas:master.config.ScoringFormulas},reviews:{...base.reviews,...master.reviews}};
    }
    editingRelease(id:string) { return this.withScoring(this.release(id)); }
    reviewScoring(input:unknown, restore?:CanonicalConfig) {
        const p=scoringInput.parse(input), active=this.release(), master=this.scoring();
        if(p.expectedActive!==active.id || p.expectedScoring!==master.id) throw new AdminError('A newer configuration or scoring document was published. Your edits are retained; reload before applying them.',409);
        const rows=p.entity==='ScoringFormulas'?formulaList.parse(p.rows):draftInput.shape[p.entity].parse(p.rows);
        if(p.formulas&&p.entity!=='MetricBenchmarks')throw new AdminError('Inline formulas are only accepted with benchmark edits.');
        const config={...active.config,AnswerScales:master.config.AnswerScales,MetricBenchmarks:master.config.MetricBenchmarks,ScoringFormulas:p.formulas??formulasFor(master.config),[p.entity]:rows};
        if(restore){config.AnswerScales=restore.AnswerScales;config.MetricBenchmarks=restore.MetricBenchmarks;config.ScoringFormulas=formulasFor(restore);}
        const summary=changes({...active.config,AnswerScales:master.config.AnswerScales,MetricBenchmarks:master.config.MetricBenchmarks},config);
        if(!summary.length) throw new AdminError('Change at least one record before publishing.');
        const reviews={...active.reviews,...master.reviews};
        for(const c of summary.filter(c=>c.field!=='deleted')) reviews[c.entity+':'+c.key]={citation:p.citation,sourceYear:'',reviewedAt:new Date().toISOString().slice(0,10),reviewDue:'',status:'reviewed',rationale:p.rationale};
        const validation=validateDraft(config,this.baseline,reviews,master.config);
        if(!p.citation || !p.rationale) validation.errors.push({key:'publication-review',message:'Provide a source/reference and review rationale for this scoring change.',questions:[]});
        // Historical configurations remain available: verify the current master against each question bank.
        const seen=new Set<string>([JSON.stringify(active.config.QuestionBank)]);
        for(const r of this.listReleases()) {
            const previous=this.release(r.id), key=JSON.stringify(previous.config.QuestionBank);if(seen.has(key))continue;seen.add(key);
            const combined={...previous.config,AnswerScales:config.AnswerScales,MetricBenchmarks:config.MetricBenchmarks,ScoringFormulas:config.ScoringFormulas};
            const result=validateDraft(combined,this.baseline,reviews,previous.config);
            for(const e of result.errors) if(!validation.errors.some(v=>v.key===e.key)) validation.errors.push({...e,message:e.message+' (saved configuration '+r.name+')'});
        }
        const markers=master.config.AnswerScales.filter(r=>r.answer_scale_id==='NUMERIC_INPUT');
        if(JSON.stringify(markers)!==JSON.stringify(config.AnswerScales.filter(r=>r.answer_scale_id==='NUMERIC_INPUT'))) validation.errors.push({key:'numeric-marker',message:'NUMERIC_INPUT is a read-only input marker, not a scored answer scale.',questions:[]});
        return {active,master,config,reviews,changes:summary,validation,notes:p.notes};
    }
    publishScoring(input:unknown,actor:Actor, restore?:CanonicalConfig) {
        return this.transaction(()=>{
            const r=this.reviewScoring(input,restore);if(r.validation.errors.length)throw new AdminError('Publication blocked: '+r.validation.errors.map(e=>e.message).join('; '),422);
            const at=new Date().toISOString(),id='release-'+randomUUID(),config={...r.config,version:id};
            const meta={...this.packageRelease(id,'Configuration · '+at,config,r.reviews,at,at,actor.email),parent:r.active.id,notes:r.notes,changeSummary:r.changes,quickEligibility:r.active.quickEligibility};
            this.db.prepare('INSERT OR IGNORE INTO scoring_publications VALUES(?)').run(r.master.id);
            this.db.prepare('INSERT INTO releases VALUES(?,?)').run(id,JSON.stringify(meta));
            this.db.prepare('INSERT INTO scoring_publications VALUES(?)').run(id);
            this.db.prepare("INSERT INTO settings VALUES('scoring',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(id);
            this.db.prepare("UPDATE settings SET value=? WHERE key='active'").run(id);
            this.log(actor,'publish-universal-scoring',{release:id,notes:r.notes,changes:r.changes,validation:r.validation});return this.release(id);
        });
    }
    restoreScoring(id:string,input:unknown,actor:Actor) {
        const p=z.strictObject({expectedActive:z.string(),expectedScoring:z.string(),notes:z.string().max(2000).default('')}).parse(input);
        const target=this.release(id);
        return this.publishScoring({...p,entity:'ScoringFormulas',rows:formulasFor(target.config),citation:'Restored immutable scoring snapshot '+id,rationale:'Restore all three universal scoring documents together.'},actor,target.config);
    }
    reviewQuestions(input: unknown) {
        const parsed = questionInput.parse(input), base = this.withScoring(this.release(parsed.base));
        if (this.listReleases()[0]?.id !== parsed.expectedLatest) throw new AdminError('A newer configuration was saved. Your edits are retained; compare with the latest version before starting again.', 409);
        const edits = new Map(parsed.edits.map(e => [e.question_id, e]));
        if (edits.size !== parsed.edits.length || [...edits.keys()].some(id => !base.config.QuestionBank.some(q => q.question_id === id))) throw new AdminError('Unknown or duplicate question.');
        const config = { ...base.config, QuestionBank: base.config.QuestionBank.map(q => edits.has(q.question_id) ? { ...q, ...edits.get(q.question_id)! } : q) };
        const summary = changes(base.config, config);
        if (!summary.length) throw new AdminError('Change at least one question before saving.');
        const eligible = quickEligibility(base);
        const quickReview = [...new Set(summary.map(c => c.key))].filter(id => eligible[id]);
        if (Object.keys(parsed.quickChoices).some(id => !quickReview.includes(id))) throw new AdminError('Quick decisions apply only to edited questions currently eligible for Quick.');
        return { base, config, quickReview, quickChoices: parsed.quickChoices, notes: parsed.notes, changes: summary, validation: validateDraft(config, this.baseline, base.reviews, base.config) };
    }
    saveQuestions(input: unknown, actor: Actor) {
        return this.transaction(() => {
            const review = this.reviewQuestions(input);
            if (review.validation.errors.length) throw new AdminError('Save blocked: ' + review.validation.errors.map(e => e.message).join('; '), 422);
            if (review.quickReview.some(id => !review.quickChoices[id])) throw new AdminError('Choose Keep eligible or Exclude from Quick Assessment for each edited eligible question.', 422);
            const at = new Date().toISOString(), id = 'release-' + randomUUID();
            const config = { ...review.config, version: id }, prior = quickEligibility(review.base);
            const decisions: QuickDecision[] = review.quickReview.map(questionId => {
                const tag = effortArtifact.rows.find(t => t.question_id === questionId)!;
                return { questionId, choice: review.quickChoices[questionId]!, savedVersion: id, editor: actor.email, at, notes: review.notes,
                    beforeHash: questionHash(review.base.config.QuestionBank.find(q => q.question_id === questionId)!), afterHash: questionHash(config.QuestionBank.find(q => q.question_id === questionId)!),
                    changes: review.changes.filter(c => c.key === questionId), effortVersion: effortArtifact.version,
                    originalClassification: tag.assigned_effort_class, originalReviewStatus: tag.review_status, originalOwnerApproved: tag.owner_approved };
            });
            const eligibility = { effortVersion: effortArtifact.version, questions: Object.fromEntries(config.QuestionBank.map(q => [q.question_id, { eligible: review.quickChoices[q.question_id] ? review.quickChoices[q.question_id] === 'keep' : prior[q.question_id] === true, contentHash: questionHash(q) }])) };
            const meta = { ...this.packageRelease(id, 'Configuration · ' + at, config, review.base.reviews, at, at, actor.email), parent: review.base.id, notes: review.notes, changeSummary: review.changes, quickEligibility: eligibility, quickDecisions: decisions };
            this.db.prepare('INSERT INTO releases VALUES(?,?)').run(id, JSON.stringify(meta));
            this.db.prepare("UPDATE settings SET value=? WHERE key='active'").run(id);
            this.log(actor, 'save-question-config', { release: id, parent: review.base.id, notes: review.notes, changes: review.changes, quickDecisions: decisions, validation: review.validation });
            return this.release(id);
        });
    }
    makeDefault(id: string, expectedActive: string, actor: Actor) { return this.rollback(id, expectedActive, actor); }

    draft(id: string): Draft { const row = this.db.prepare('SELECT * FROM drafts WHERE id=?').get(id) as Row | undefined; if (!row)
        throw new AdminError('Draft not found', 404); return { id, base: String(row.base), revision: Number(row.revision), updatedAt: String(row.updated_at), updatedBy: String(row.updated_by), ...this.read<{
            config: CanonicalConfig;
            reviews: Reviews;
        }>(String(row.hash)) }; }
    listDrafts() { return (this.db.prepare('SELECT id,base,revision,updated_at,updated_by FROM drafts ORDER BY updated_at DESC').all() as Row[]); }
    log(actor: Actor, action: string, details: unknown) { this.db.prepare('INSERT INTO audit(at,actor,identity,action,details) VALUES(?,?,?,?,?)').run(new Date().toISOString(), actor.email, actor.identity, action, JSON.stringify(details)); }
    audit() { return this.db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 100').all(); }
    createDraft(actor: Actor) { return this.transaction(() => { const release = this.release(), id = randomUUID(), at = new Date().toISOString(); this.db.prepare('INSERT INTO drafts VALUES(?,?,1,?,?,?)').run(id, release.id, at, actor.email, release.hash); this.log(actor, 'create-draft', { id, base: release.id }); return this.draft(id); }); }
    save(id: string, input: unknown, actor: Actor) { const parsed = draftInput.parse(input); return this.transaction(() => { const old = this.draft(id); if (old.revision !== parsed.revision)
        throw new AdminError('A newer draft was saved by another admin. Reload it before applying your changes.', 409); const base = this.release(old.base); const config = applyDraft(base.config, parsed), at = new Date().toISOString(); this.db.prepare('UPDATE drafts SET revision=revision+1,updated_at=?,updated_by=?,hash=? WHERE id=? AND revision=?').run(at, actor.email, this.put({ config, reviews: parsed.reviews }), id, old.revision); this.log(actor, 'save-draft', { id, revision: old.revision + 1, changes: changes(old.config, config), reviewChanges: parsed.reviews }); return this.draft(id); }); }
    validate(draft: Draft) { return validateDraft(draft.config, this.baseline, draft.reviews, this.release(draft.base).config); }
    publish(id: string, revision: number, actor: Actor) { return this.transaction(() => { const draft = this.draft(id); if (draft.revision !== revision)
        throw new AdminError('The draft changed after review. Reload and review again.', 409); if (this.release().id !== draft.base)
        throw new AdminError('The active release changed. Start a draft from the current release before publishing.', 409); if(this.db.prepare("SELECT value FROM settings WHERE key='scoring'").get() && changes(this.scoring().config,draft.config).some(c=>c.entity!=='QuestionBank')) throw new AdminError('Publish universal scoring changes through Universal Scoring Documents.',422); const validation = this.validate(draft); if (validation.errors.length)
        throw new AdminError('Publication blocked: ' + validation.errors.map(e => e.message).join('; '), 422); const at = new Date().toISOString(), releaseId = 'release-' + randomUUID(), config = { ...draft.config, version: releaseId }; const meta = this.packageRelease(releaseId, 'MOSAIC ' + at, config, draft.reviews, at, at, actor.email); this.db.prepare('INSERT INTO releases VALUES(?,?)').run(releaseId, JSON.stringify(meta)); this.db.prepare("UPDATE settings SET value=? WHERE key='active'").run(releaseId); this.log(actor, 'publish', { release: releaseId, draft: id, revision, changes: changes(this.release(draft.base).config, config), validation }); return this.release(releaseId); }); }
    rollback(id: string, expectedActive: string, actor: Actor) { return this.transaction(() => { if (this.release().id !== expectedActive)
        throw new AdminError('Active release changed. Refresh before rollback.', 409); let target = this.release(id); const combined=this.withScoring(target);
        if(changes(target.config,combined.config).some(c=>c.entity!=='QuestionBank')) {
            const validation=validateDraft(combined.config,this.baseline,combined.reviews,target.config);if(validation.errors.length)throw new AdminError('This configuration is incompatible with current scoring documents.',422);
            const at=new Date().toISOString(),newId='release-'+randomUUID();
            const meta={...this.packageRelease(newId,'Restored configuration · '+at,{...combined.config,version:newId},combined.reviews,at,at,actor.email),parent:id,notes:'Restored QuestionBank with current universal scoring documents.',quickEligibility:target.quickEligibility};
            this.db.prepare('INSERT INTO releases VALUES(?,?)').run(newId,JSON.stringify(meta));target=this.release(newId);
        } this.db.prepare("UPDATE settings SET value=? WHERE key='active'").run(target.id); this.log(actor, 'rollback', { from: expectedActive, to: id }); return target; }); }
    admin(email: string) { return this.db.prepare('SELECT email,role,enabled,subject FROM admins WHERE email=?').get(email.toLowerCase()) as (Row & {
        email: string;
        role: Actor['role'];
        enabled: number;
        subject: string | null;
    }) | undefined; }
    admins() { return this.db.prepare('SELECT email,role,enabled FROM admins ORDER BY role DESC,email').all(); }
    access(email: string, enabled: boolean, actor: Actor) { if (actor.role !== 'super_admin')
        throw new AdminError('Only super admins can manage access.', 403); return this.transaction(() => { const existing = this.admin(email); if (existing?.role === 'super_admin')
        throw new AdminError('The initial super admin cannot be revoked here.'); this.db.prepare("INSERT INTO admins(email,role,enabled) VALUES(?,'admin',?) ON CONFLICT(email) DO UPDATE SET enabled=excluded.enabled").run(email, enabled ? 1 : 0); this.db.prepare('DELETE FROM dev_sessions WHERE email=?').run(email); this.log(actor, enabled ? 'grant-admin' : 'revoke-admin', { email }); }); }
    devSession(email: string) { const admin = this.admin(email); if (!admin?.enabled)
        throw new AdminError('This email has not been granted admin access.', 403); const token = randomBytes(32).toString('hex'); this.db.prepare('INSERT INTO dev_sessions VALUES(?,?,?)').run(hash(token), email, Date.now() + 3600000); return token; }
    devActor(token: string): Actor | null { const session = this.db.prepare('SELECT email FROM dev_sessions WHERE token=? AND expires>?').get(hash(token), Date.now()) as Row | undefined; const a = session ? this.admin(String(session.email)) : undefined; return a?.enabled ? { email: a.email, role: a.role, identity: 'development' } : null; }
    close() { this.db.close(); }
}
let singleton: AdminStore | undefined;
export function adminStore() { return singleton ??= new AdminStore(); }
