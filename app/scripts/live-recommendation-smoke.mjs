import { mkdirSync, openSync, closeSync, existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
export const pricing = Object.freeze({ checked: "2026-10-14", inputPerMillion: 0.75, outputPerMillion: 4.5, source: "https://developers.openai.com/api/docs/models/gpt-5.4-mini" });
export function reservationCost(maxOutputTokens) {
  // Conservative bound: one token per UTF-8 byte, plus 8192 tokens for schema/message framing.
  return (400000 + 8192) * pricing.inputPerMillion / 1000000 + maxOutputTokens * pricing.outputPerMillion / 1000000;
}
export function syntheticCase(index, configVersion) {
  return { configVersion, companyName: `Synthetic live smoke ${index + 1}`, subindustry: "Industrial components", notes: ["", "Prioritize affordable implementation.", "A small internal team will coordinate actions.", "Use the supplied evidence only.", "Planning for an internal review."][index],
    context: { industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarkets: ["EU"], targetBuyer: "Enterprise", businessGoal: "Investor readiness" },
    answers: { "U-001": index % 2 ? "Yes" : "No", "U-002": "Yes" } };
}
export function validateLedger(value) {
  if (!Array.isArray(value) || value.length > 5 || value.some(row => !row || !Number.isFinite(row.reservedUsd) || row.reservedUsd < 0 || row.reservedUsd > 2)) throw new Error("Invalid smoke ledger; preserve it and request review.");
  return value;
}
export async function main(args = process.argv.slice(2)) {
  if (!args.includes("--confirm-synthetic-budget")) throw new Error("No requests sent. Run with --confirm-synthetic-budget only after configuring the local provider. Five total attempts, maximum estimated US$2.");
  const base = new URL(args.find(a => a.startsWith("--url="))?.slice(6) ?? "http://127.0.0.1:3000");
  if (base.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(base.hostname) || base.username || base.password || base.search || base.hash) throw new Error("Use a loopback HTTP URL without credentials.");
  const age = (Date.now() - Date.parse(pricing.checked)) / 86400000;
  if (age < 0 || age > 7) throw new Error("Pricing check is stale. Recheck official pricing and review the cost bound before updating the recorded date.");
  const endpoint = new URL("/api/assessment-recommendations", base);
  const statusResponse = await fetch(endpoint, { redirect: "error", signal: AbortSignal.timeout(15000) });
  const status = await statusResponse.json();
  if (!statusResponse.ok || !status.ready || status.settings?.provider !== "openai" || status.settings?.model !== "gpt-5.4-mini" || status.settings?.reasoning !== "low" || !Number.isInteger(status.settings.maxOutputTokens) || status.settings.maxOutputTokens < 1 || status.settings.maxOutputTokens > 8000 || typeof status.sessionVersion !== "string") throw new Error("Live configuration is not ready for the approved gpt-5.4-mini / low baseline. No generation attempted.");
  const directory = resolve(dirname(fileURLToPath(import.meta.url)), "../.local"); mkdirSync(directory, { recursive: true });
  const ledgerPath = resolve(directory, "live-smoke-ledger.json"); const lockPath = resolve(directory, "live-smoke.lock");
  const lock = openSync(lockPath, "wx");
  try {
    const rows = validateLedger(existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, "utf8")) : []);
    const reserve = reservationCost(status.settings.maxOutputTokens);
    const save = () => { writeFileSync(ledgerPath + ".tmp", JSON.stringify(rows, null, 2)); renameSync(ledgerPath + ".tmp", ledgerPath); };
    console.log(JSON.stringify({ pricing, maximumAttempts: 5, remainingAttempts: 5 - rows.length, reservedPerAttemptUsd: reserve, maximumFiveAttemptUsd: reserve * 5 }));
    while (rows.length < 5 && rows.reduce((sum, row) => sum + row.reservedUsd, 0) + reserve <= 2) {
      const index = rows.length; const started = performance.now();
      const row = { case: `synthetic-${index + 1}`, attemptedAt: new Date().toISOString(), model: status.settings.model, reasoning: status.settings.reasoning,
        timeoutMs: status.settings.timeoutMs, maxOutputTokens: status.settings.maxOutputTokens, reservedUsd: reserve, outcome: "interrupted_or_unknown", endpointMs: null, usage: null, estimatedUsd: reserve };
      rows.push(row); save(); // Reserve/count BEFORE sending; failed and interrupted attempts consume the allowance.
      try {
        const response = await fetch(endpoint, { method: "POST", redirect: "error", signal: AbortSignal.timeout(45000), headers: { "Content-Type": "application/json", Origin: base.origin, "x-recommendation-configuration": status.fingerprint }, body: JSON.stringify(syntheticCase(index, status.sessionVersion)) });
        const result = await response.json();
        const allowed = ["available", "invalid_output", "invalid_response", "incomplete_output", "refused", "timeout", "cancelled", "authentication_failed", "quota_exceeded", "rate_limited", "provider_failure", "provider_not_configured", "busy", "configuration_changed", "invalid_assessment"];
        const outcome = result.status === "available" ? "available" : result.code;
        row.outcome = allowed.includes(outcome) ? outcome : "unexpected_response";
        row.httpStatus = response.status;
        row.validation = result.status === "available" ? "passed_application_checks" : "not_accepted";
        const usage = result.metrics?.usage;
        if (usage && Number.isInteger(usage.inputTokens) && usage.inputTokens >= 0 && Number.isInteger(usage.outputTokens) && usage.outputTokens >= 0) {
          row.usage = { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens };
          row.estimatedUsd = (usage.inputTokens * pricing.inputPerMillion + usage.outputTokens * pricing.outputPerMillion) / 1000000;
        }
        for (const key of ["retrievalMs", "providerMs", "totalMs"]) if (Number.isFinite(result.metrics?.[key])) row[key] = result.metrics[key];
      } catch { row.outcome = "transport_failure_or_timeout"; row.validation = "not_accepted"; }
      row.endpointMs = performance.now() - started; save(); console.log(JSON.stringify(row));
      if (["authentication_failed", "quota_exceeded", "rate_limited", "configuration_changed"].includes(row.outcome)) break;
    }
    console.log("Smoke stopped. Ledger retained at app/.local/live-smoke-ledger.json; do not reset the five-attempt allowance without approval.");
    if (rows.some(row => row.outcome !== "available")) process.exitCode = 1;
  } finally { closeSync(lock); unlinkSync(lockPath); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => { console.error("Smoke not completed. Check local configuration, loopback server, pricing date and preserved ledger/lock. No credentials or provider error text are logged."); process.exitCode = 1; });
