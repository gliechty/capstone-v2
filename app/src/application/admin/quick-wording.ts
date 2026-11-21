import { createHash } from 'node:crypto';
import effort from '../../../config/assessment-profiles/quick-effort-v1.json';
import type { Release } from './contracts';
export const questionHash = (q: unknown) => createHash('sha256').update(JSON.stringify(q)).digest('hex');
export const effortArtifact = effort;
// Eligibility decisions are independent of the original effort classification.
export function quickEligibility(release: Release): Record<string, boolean> {
    return Object.fromEntries(release.config.QuestionBank.map(q => {
        const tag = effort.rows.find(t => t.question_id === q.question_id);
        const snapshot = release.quickEligibility;
        const entry = snapshot?.questions[q.question_id];
        const eligible = q.active === 'TRUE' && tag?.assigned_effort_class === 'direct_knowledge' &&
            (snapshot ? snapshot.effortVersion === effort.version && entry?.eligible === true && entry.contentHash === questionHash(q)
                : true);
        return [q.question_id, eligible];
    }));
}
