import type { CanonicalConfig } from "../../domain/config/types";
import type { EntityName } from "../config/schemas";
export type Role = "super_admin" | "admin";
export type Actor = {
    email: string;
    role: Role;
    identity: "google" | "development";
};
export type ReviewMetadata = {
    citation: string;
    sourceYear: string;
    reviewedAt: string;
    reviewDue: string;
    status: "reviewed" | "provisional";
    rationale: string;
};
export type Reviews = Record<string, ReviewMetadata>;
export type Issue = {
    key: string;
    message: string;
    questions: string[];
};
export type Validation = {
    errors: Issue[];
    warnings: Issue[];
};
export type Release = {
    wordingConfirmations?: WordingConfirmation[];
    quickEligibility?: { effortVersion: string; questions: Record<string, { eligible: boolean; contentHash: string }> };
    quickDecisions?: QuickDecision[];
    parent?: string;
    notes?: string;
    changeSummary?: Change[];
    id: string;
    name: string;
    createdAt: string | null;
    publishedAt: string | null;
    publishedBy: string | null;
    importedAt: string;
    hash: string;
    config: CanonicalConfig;
    reviews: Reviews;
    files: Record<EntityName, {
        sha256: string;
        records: number;
    }>;
};
export type WordingConfirmation = {
    statement: 'wording edit preserves existing meaning and effort classification';
    questionId: string;
    before: string;
    after: string;
    beforeHash: string;
    afterHash: string;
    savedVersion: string;
    editor: string;
    at: string;
    notes: string;
    effortVersion: string;
    classification: string;
    originalReviewStatus: string;
    originalOwnerApproved: boolean;
};
export type Draft = {
    id: string;
    base: string;
    revision: number;
    updatedAt: string;
    updatedBy: string;
    config: CanonicalConfig;
    reviews: Reviews;
};
export type Change = {
    entity: string;
    key: string;
    field: string;
    before: string;
    after: string;
};
export class AdminError extends Error {
    constructor(message: string, readonly status = 400) { super(message); }
}
export const benchmarkKey = (r: {
    metric_id: string;
    benchmark_group_type: string;
    benchmark_group_value: string;
}) => [r.metric_id, r.benchmark_group_type, r.benchmark_group_value].join("|");
export const scaleKey = (r: {
    answer_scale_id: string;
    answer_option: string;
}) => [r.answer_scale_id, r.answer_option].join("|");

export type QuickDecision = {
    questionId: string; choice: 'keep' | 'exclude'; savedVersion: string; editor: string; at: string; notes: string;
    beforeHash: string; afterHash: string; changes: Change[]; effortVersion: string;
    originalClassification: string; originalReviewStatus: string; originalOwnerApproved: boolean;
};
