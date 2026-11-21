import { isRecommendationRequest } from "../../../adapters/recommendations/hosted-boundary";
import { reserveHostedAttempt, reconcileHostedAttempt, type BudgetReceipt } from "../../../adapters/recommendations/hosted-budget";
import { createLocalAdmission } from "../../../adapters/recommendations/local-boundary";
import { generateRecommendations, providerStatus } from "../../../adapters/recommendations/server";
import { RecommendationInputError } from "../../../application/recommendations/contracts";
import { recommendationPolicy } from "../../../application/recommendations/policy";
export const runtime = "nodejs";
const response = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const admit = createLocalAdmission();
export async function GET(request: Request) {
  if (!isRecommendationRequest(request, false)) return response({ status: "unavailable", code: "local_only" }, 403);
  try { return response(providerStatus(new URL(request.url).searchParams.get("version") ?? undefined), 200); }
  catch { return response({ status: "unavailable", code: "configuration_unavailable" }, 503); }
}
export async function POST(request: Request) {
  if (!isRecommendationRequest(request, true)) return response({ status: "unavailable", code: "local_only" }, 403);
  if (request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !== "application/json") return response({ status: "unavailable", code: "unsupported_media_type" }, 415);
  const reader = request.body?.getReader();
  if (!reader) return response({ status: "unavailable", code: "invalid_request" }, 400);
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutError = new Error("request timeout");
  let input: unknown;
  try {
    const deadline = new Promise<never>((_, reject) => { timeout = setTimeout(() => { reject(timeoutError); void reader.cancel().catch(() => {}); }, recommendationPolicy.timeoutMs); });
    const body = async () => {
      const chunks: Uint8Array[] = [];
      let length = 0;
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        length += part.value.byteLength;
        if (length > recommendationPolicy.maxRequestBytes) { void reader.cancel().catch(() => {}); return null; }
        chunks.push(part.value);
      }
      return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
    };
    const text = await Promise.race([body(), deadline]);
    if (text === null) return response({ status: "unavailable", code: "request_too_large" }, 413);
    input = JSON.parse(text);
  } catch (error) { return response({ status: "unavailable", code: error === timeoutError ? "request_timeout" : "invalid_request" }, error === timeoutError ? 408 : 400); }
  finally { if (timeout !== undefined) clearTimeout(timeout); }
  try {
    const configuration = providerStatus(input && typeof input === "object" && "configVersion" in input && typeof input.configVersion === "string" ? input.configVersion : undefined);
    const expected = request.headers.get("x-recommendation-configuration");
    if (expected && expected !== configuration.fingerprint) return response({ status: "unavailable", code: "configuration_changed" }, 409);
    const slot = configuration.ready ? admit() : null;
    if (slot && !slot.ok) return response({ status: "unavailable", code: slot.code }, 429);
    let result;
    let receipt: BudgetReceipt | undefined;
    try {
      if (configuration.ready) {
        const reservation = reserveHostedAttempt(process.env,request.headers.get("x-mosaic-verification"));
        if (!reservation.ok) return response({status:"unavailable",code:reservation.code},429);
        receipt = reservation.receipt;
      }
      result = await generateRecommendations(input, request.signal);
      reconcileHostedAttempt(receipt, "metrics" in result ? result.metrics?.usage : undefined);
    }
    finally { if (slot?.ok) slot.release(); }
    // A test double cannot be selected by this endpoint or exposed as live output.
    if (result.status === "test_only") return response({ status: "unavailable", code: "provider_not_configured" }, 503);
    return response({ ...result, configuration }, result.status === "available" ? 200 : 503);
  } catch (error) {
    return response({ status: "unavailable", code: error instanceof RecommendationInputError ? "invalid_assessment" : "configuration_unavailable" }, error instanceof RecommendationInputError ? 422 : 503);
  }
}
