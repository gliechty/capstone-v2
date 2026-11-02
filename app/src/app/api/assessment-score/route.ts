import { withPortraitPotential } from '../../../application/portrait-potential';
import { ZodError } from "zod";
import { loadCanonicalConfig } from "../../../adapters/config-repository";
import { computeAssessment } from "../../../application/score-request";
import { ScoringError } from "../../../domain/scoring/score-assessment";
export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
const response = (body: unknown, status = 200) => Response.json(body, { status, headers });
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return response({ error: "Send JSON assessment data." }, 415);
  // This endpoint computes only; it never stores answers, contacts providers or
  // accepts a client score. Bound the body even when Content-Length is absent.
  const reader = request.body?.getReader();
  if (!reader) return response({ error: "Missing assessment data." }, 400);
  let input: unknown;
  try {
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.byteLength;
      if (length > 400000) { await reader.cancel(); return response({ error: "Assessment data is too large." }, 413); }
      chunks.push(part.value);
    }
    input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
  } catch { return response({ error: "Assessment data is not valid JSON." }, 400); }
  try {
    const { config } = loadCanonicalConfig();
    const score = withPortraitPotential(config, computeAssessment(config, input));
    // The engine owns the versioned trace; the HTTP boundary only projects its output.
    const { configVersion, methodVersion, categories, answered, missing, rawOverall, weightedOverall, earned, possible, traceSchemaVersion, input: scoredInput, trace, portraitPotential } = score;
    return response({ configVersion, methodVersion, categories, answered, missing, rawOverall, weightedOverall, earned, possible, traceSchemaVersion, input: scoredInput, trace, portraitPotential });
  } catch (error) {
    if (error instanceof ZodError) return response({ error: "Assessment context or answers are invalid. Return to assessment to review them." }, 400);
    if (error instanceof ScoringError) return response({ error: error.message }, 422);
    return response({ error: "Scoring configuration is unavailable. No score has been generated." }, 503);
  }
}
