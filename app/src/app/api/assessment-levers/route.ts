import { ZodError } from "zod";
import { loadCanonicalConfig } from "../../../adapters/config-repository";
import { computeAssessment } from "../../../application/score-request";
import { selectImprovementLevers } from "../../../application/improvement-levers";
import { ScoringError } from "../../../domain/scoring/score-assessment";
export const runtime = "nodejs";
const response = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return response({ error: "Send JSON assessment data." }, 415);
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
    // Never accept a client score or client-supplied ranking/bounds.
    const score = computeAssessment(config, input);
    const { configVersion, methodVersion, categories, answered, missing, rawOverall, weightedOverall, earned, possible, traceSchemaVersion, input: scoredInput, trace } = score;
    const baseline = { configVersion, methodVersion, categories, answered, missing, rawOverall, weightedOverall, earned, possible, traceSchemaVersion, input: scoredInput, trace };
    return response({ ...selectImprovementLevers(config, score), baseline });
  } catch (error) {
    if (error instanceof ZodError) return response({ error: "Review your assessment context and answers." }, 400);
    if (error instanceof ScoringError) return response({ error: error.message }, 422);
    return response({ error: "Improvement levers are unavailable. Your actual scores remain available." }, 503);
  }
}
