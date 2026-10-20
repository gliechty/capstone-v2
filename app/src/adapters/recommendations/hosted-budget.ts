import { randomUUID, timingSafeEqual } from "node:crypto";
import { openSync, closeSync, readFileSync, writeFileSync, renameSync, unlinkSync, fsyncSync } from "node:fs";
import type { TokenUsage } from "../../application/recommendations/contracts";
// Standard gpt-5.4-mini pricing: $0.75/M input, $4.50/M output.
// Unknown usage retains the full reservation. Test allowance never reconciles/refunds.
export const HOSTED_RESERVATION_USD = 0.324144;
const reservationNanos = 324144000;
type Row = { id?: string; at: string; reservedUsd: number; actualNanos?: number };
export type BudgetReceipt = { path: string; id: string; verification: boolean };
export function bangkokBudgetDay(date: Date) {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
function transaction<T>(path: string, work: (rows: Row[]) => T): T {
  const lock = openSync(path + ".lock", "wx", 0o600);
  try {
    const rows: Row[] = JSON.parse(readFileSync(path, "utf8"));
    if (!Array.isArray(rows) || rows.some(r => !r || r.reservedUsd !== HOSTED_RESERVATION_USD || typeof r.at !== "string" || !Number.isFinite(Date.parse(r.at)) || (r.actualNanos !== undefined && (!Number.isSafeInteger(r.actualNanos) || r.actualNanos < 0)))) throw new Error("Invalid ledger");
    const result = work(rows);
    const file = openSync(path + ".new", "w", 0o600);
    try { writeFileSync(file, JSON.stringify(rows)); fsyncSync(file); } finally { closeSync(file); }
    renameSync(path + ".new", path);
    return result;
  } finally { closeSync(lock); unlinkSync(path + ".lock"); }
}
export function reserveHostedAttempt(env: Record<string,string|undefined> = process.env, verificationToken: string | null = null, now = new Date()): {ok:true; receipt?:BudgetReceipt} | {ok:false; code:string} {
  if (!env.RECOMMENDATION_PUBLIC_ORIGIN) return {ok:true};
  if (Number(env.RECOMMENDATION_MAX_OUTPUT_TOKENS ?? "4000") > 4000) return {ok:false,code:"budget_unavailable"};
  const expected = env.RECOMMENDATION_VERIFICATION_TOKEN;
  const verification = Boolean(expected && verificationToken && Buffer.byteLength(expected) === Buffer.byteLength(verificationToken) && timingSafeEqual(Buffer.from(expected),Buffer.from(verificationToken)));
  if (verificationToken && !verification) return {ok:false,code:"budget_unavailable"};
  const path = verification ? env.RECOMMENDATION_VERIFICATION_FILE : env.RECOMMENDATION_BUDGET_FILE;
  const max = verification ? 1 : Math.min(1, Number(env.RECOMMENDATION_DAILY_BUDGET_USD));
  if (!path || !Number.isFinite(max) || max <= 0) return {ok:false,code:"budget_unavailable"};
  try { return transaction(path, rows => {
    const counted = verification ? rows : rows.filter(r => bangkokBudgetDay(new Date(r.at)) === bangkokBudgetDay(now));
    const spent = counted.reduce((sum,r) => sum + (verification ? reservationNanos : r.actualNanos ?? reservationNanos), 0);
    if ((verification && counted.length >= 2) || spent + reservationNanos > Math.floor(max * 1e9)) return {ok:false as const,code:"budget_exhausted"};
    const id = randomUUID(); rows.push({id,at:now.toISOString(),reservedUsd:HOSTED_RESERVATION_USD});
    return {ok:true as const,receipt:{path,id,verification}};
  }); } catch { return {ok:false,code:"budget_unavailable"}; }
}
export function reconcileHostedAttempt(receipt: BudgetReceipt | undefined, usage: TokenUsage | undefined): boolean {
  if (!receipt || receipt.verification || !usage) return false;
  const {inputTokens,outputTokens} = usage;
  if (![inputTokens,outputTokens].every(n => Number.isSafeInteger(n) && n >= 0)) return false;
  const actualNanos = inputTokens * 750 + outputTokens * 4500;
  if (!Number.isSafeInteger(actualNanos)) return false;
  try { return transaction(receipt.path, rows => {
    const row = rows.find(r => r.id === receipt.id);
    if (!row) return false;
    // Idempotent settlement; conflicting reports cannot release more money.
    row.actualNanos = row.actualNanos === undefined ? actualNanos : Math.max(row.actualNanos,actualNanos);
    return true;
  }); } catch { return false; } // Full reservation survives any settlement failure.
}
