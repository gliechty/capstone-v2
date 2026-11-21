import {kbInfo,sourceImport,sourceList,sourcePdf} from '../../../../adapters/admin-sources';
import {auditTable,auditCsv,parseAuditCsv} from '../../../../application/admin/audit-artifacts';
import {hash} from '../../../../adapters/admin-store';
import {formulasFor} from '../../../../domain/scoring/scoring-formulas';
import { z } from "zod";
import { adminEnabled, adminURL, developmentIdentityAllowed, oauthReady, requireAdmin, revokeAuthSessions, sameOrigin } from "../../../../adapters/admin-auth";
import { adminStore } from "../../../../adapters/admin-store";
import { AdminError } from "../../../../application/admin/contracts";
import { changes, entities } from "../../../../application/admin/validation";
import { archivedArtifacts, readArchive } from "../../../../adapters/admin-artifacts";
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const response = (body: unknown, status = 200) => Response.json(body, { status, headers });
export const runtime = 'nodejs';
type Context = {
    params: Promise<{
        action: string[];
    }>;
};
async function body(request: Request) { if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new AdminError('JSON is required.', 415); const reader = request.body?.getReader(); if (!reader)
    throw new AdminError('Missing body'); const chunks: Uint8Array[] = []; let length = 0; while (true) {
    const part = await reader.read();
    if (part.done)
        break;
    length += part.value.length;
    if (length > 2000000) {
        await reader.cancel();
        throw new AdminError('Request too large', 413);
    }
    chunks.push(part.value);
} return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown; }
function failure(e: unknown) { if (e instanceof AdminError)
    return response({ error: e.message }, e.status); if (e instanceof z.ZodError)
    return response({ error: e.issues.slice(0, 5).map(i => i.path.join('.') + ': ' + i.message).join('; ') }, 400); if (e instanceof SyntaxError)
    return response({ error: 'Invalid JSON' }, 400); return response({ error: 'Admin operation failed. Your active release was not changed; refresh and retry.' }, 500); }
export async function GET(request: Request, context: Context) {
    try {
        const [action, id, entity] = (await context.params).action;
        if (!adminEnabled())
            throw new AdminError('Admin is disabled', 404);
        if (action === 'status')
            return response({ oauthReady: oauthReady(), developmentIdentity: developmentIdentityAllowed(request.url), superAdminEmail: developmentIdentityAllowed(request.url) ? process.env.MOSAIC_SUPER_ADMIN_EMAIL ?? null : null, callback: new URL('/api/auth/callback/google', adminURL()).href });
        const actor = await requireAdmin(request), store = adminStore();
        if (action === 'state') {
            const active = store.release();
            return response({ actor, active, kb:kbInfo(store,active), canRegisterSources:actor.role==='super_admin'&&actor.email===process.env.MOSAIC_SUPER_ADMIN_EMAIL?.trim().toLowerCase(), releases: store.listReleases(), drafts: store.listDrafts(), admins: actor.role === 'super_admin' ? store.admins() : [], audit: store.audit(), archives: archivedArtifacts() });
        }
        if(action==='kb'&&id)return response({kb:kbInfo(store,store.release(id)),sources:sourceList(store,store.release(id))});
        if(action==='source-pdf'&&id&&entity){const pdf=sourcePdf(store,store.release(id),entity);return new Response(new Uint8Array(pdf.data),{headers:{...headers,'Content-Type':'application/pdf','Content-Length':String(pdf.data.length),'Content-Disposition':(new URL(request.url).searchParams.has('download')?'attachment':'inline')+'; filename="'+entity.replace(/[^A-Za-z0-9_.-]/g,'_')+'.pdf"','X-Mosaic-Release':id,'X-Mosaic-Source-SHA256':pdf.sha256}});}
        if (action === 'editing-release' && id) return response(store.editingRelease(id));
        if (action === 'scoring') return response({current:store.scoring(),history:store.scoringHistory()});
        if (action === 'draft' && id) {
            const draft = store.draft(id);
            return response({ draft, validation: store.validate(draft), changes: changes(store.release(draft.base).config, draft.config) });
        }
        if (action === 'download' && id) {
            const release = store.release(id);
            if (entity && entity!=='ScoringFormulas' && !entities.includes(entity as never))
                throw new AdminError('Unknown artifact', 404);
            const payload = entity==='ScoringFormulas' ? formulasFor(release.config) : entity ? (release.config as unknown as Record<string, unknown>)[entity] : release;
            if(new URL(request.url).searchParams.get('format')==='csv') {
                if(!entity)throw new AdminError('Choose a document for CSV export.');
                return new Response(auditCsv(auditTable(payload)),{headers:{...headers,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="'+release.id+'-'+entity+'.csv"','X-Mosaic-Release':release.id}});
            }
            const filename = release.id + '-' + (entity ?? 'release') + '.json';
            return new Response(JSON.stringify(payload), { headers: { ...headers, 'Content-Type': 'application/json', 'Content-Disposition': (new URL(request.url).searchParams.has('view') ? 'inline' : 'attachment') + '; filename="' + filename + '"', 'X-Mosaic-Release': release.id } });
        }
        if (action === 'source' && id && entity) {
            const release = store.release(id), source = release.config.DocumentIndex.find(d => d.doc_id === entity);
            if (!source)
                throw new AdminError('Source unavailable', 404);
            if(new URL(request.url).searchParams.get('format')==='csv')return new Response(auditCsv(auditTable(release.config.DocumentChunks.filter(c=>c.doc_id===entity))),{headers:{...headers,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="'+release.id+'-'+entity.replace(/[^A-Za-z0-9_.-]/g,'_')+'-excerpts.csv"','X-Mosaic-Release':release.id}});
            return new Response(JSON.stringify({ release: release.id, source, originalFile: 'unavailable', chunks: release.config.DocumentChunks.filter(c => c.doc_id === entity) }, null, 2), { headers: { ...headers, 'Content-Type': 'application/json', 'Content-Disposition': (new URL(request.url).searchParams.has('view') ? 'inline' : 'attachment') + '; filename="' + release.id + '-source.json"', 'X-Mosaic-Release': release.id } });
        }
        if (action === 'archive-view' && id) {
            const artifact=readArchive(id);return response({name:artifact.name,sha256:hash(artifact.bytes),table:artifact.name.endsWith('.csv')?parseAuditCsv(artifact.bytes):auditTable(JSON.parse(artifact.bytes))});
        }
        if (action === 'archive' && id) {
            const artifact = readArchive(id);
            return new Response(artifact.bytes, { headers: { ...headers, 'X-Mosaic-Artifact-SHA256':hash(artifact.bytes), 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': (new URL(request.url).searchParams.has('view') ? 'inline' : 'attachment') + '; filename="archived-' + artifact.name + '"' } });
        }
        throw new AdminError('Not found', 404);
    }
    catch (e) {
        return failure(e);
    }
}
export async function POST(request: Request, context: Context) {
    try {
        const [action, id] = (await context.params).action;
        if (!adminEnabled())
            throw new AdminError('Admin is disabled', 404);
        sameOrigin(request);
        if (action === 'development-login') {
            if (!developmentIdentityAllowed(request.url))
                throw new AdminError('Development identity is unavailable.', 404);
            const { email } = z.strictObject({ email: z.email().max(254) }).parse(await body(request));
            const token = adminStore().devSession(email.trim().toLowerCase());
            return Response.json({ developmentOnly: true }, { headers: { ...headers, 'Set-Cookie': 'mosaic-dev-admin=' + token + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600' } });
        }
        const actor = await requireAdmin(request), store = adminStore();
        if(action==='import-sources'&&id)return response(sourceImport(store,store.release(id),actor));
        if (action === 'scoring-review') { const r=store.reviewScoring(await body(request));return response({changes:r.changes,validation:r.validation,impacts:r.config.MetricBenchmarks.filter(m=>r.changes.some(c=>c.entity==='ScoringFormulas'&&c.key===m.normalization_method)).map(m=>m.metric_id+' ('+(m.benchmark_group_value||'global')+')')}); }
        if (action === 'scoring-restore' && id) return response(store.restoreScoring(id,await body(request),actor),201);
        if (action === 'scoring-publish') return response(store.publishScoring(await body(request),actor),201);
        if (action === 'question-review') {
            const review = store.reviewQuestions(await body(request));
            return response({ changes: review.changes, validation: review.validation, quickReview: review.quickReview });
        }
        if (action === 'make-default' && id) {
            const input = z.strictObject({ expectedActive: z.string().min(1).max(100) }).parse(await body(request));
            return response(store.makeDefault(id, input.expectedActive, actor));
        }
        if (action === 'question-save') return response(store.saveQuestions(await body(request), actor), 201);
        if (action === 'logout')
            return Response.json({ ok: true }, { headers: { ...headers, 'Set-Cookie': 'mosaic-dev-admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0' } });
        if (action === 'access') {
            if (actor.role !== 'super_admin')
                throw new AdminError('Only super admins can manage access.', 403);
            const input = z.strictObject({ email: z.email().max(254), enabled: z.boolean() }).parse(await body(request));
            store.access(input.email.toLowerCase(), input.enabled, actor);
            revokeAuthSessions(input.email);
            return response({ ok: true });
        }
        if (action === 'create-draft')
            return response(store.createDraft(actor), 201);
        if (action === 'save' && id)
            return response(store.save(id, await body(request), actor));
        if (action === 'publish' && id) {
            const { revision } = z.strictObject({ revision: z.number().int().positive() }).parse(await body(request));
            return response(store.publish(id, revision, actor), 201);
        }
        if (action === 'rollback' && id) {
            const { expectedActive } = z.strictObject({ expectedActive: z.string().min(1).max(100) }).parse(await body(request));
            return response(store.rollback(id, expectedActive, actor));
        }
        throw new AdminError('Not found', 404);
    }
    catch (e) {
        return failure(e);
    }
}
