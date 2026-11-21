import { isRecommendationRequest } from "../adapters/recommendations/hosted-boundary";
import { ZodError } from "zod";
import { releaseConfigForInput } from "./release-config";
import { acquirePdfJob, renderReportPdf } from "../adapters/report-pdf";
import { constructPdfReport, ReportInputError } from "../application/pdf-report";
import { ScoringError } from "../domain/scoring/score-assessment";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const error = (message: string, status: number) => Response.json({ error: message }, {
 status, headers: { ...headers, ...(status === 503 ? { "Retry-After": "5" } : {}) },
});
export async function downloadReport(request: Request, format: "pdf" | "html") {
 if (!isRecommendationRequest(request, true))
  return error("Download your report from MOSAIC Results.", 403);
 if (!request.headers.get("content-type")?.startsWith("application/json"))
  return error("Send JSON assessment data.", 415);
 const release = format === "pdf" ? acquirePdfJob() : () => {};
 if (!release) return error("Another PDF is being prepared. Please retry in a few seconds, or download HTML.", 503);
 let timer: ReturnType<typeof setTimeout> | undefined;
 const reader = request.body?.getReader();
 try {
  if (!reader) return error("Missing assessment data.", 400);
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  const read = async () => {
   while (true) {
    const part = await reader.read();
    if (part.done) break;
    bytes += part.value.byteLength;
    if (bytes > 600000) { await reader.cancel(); throw new RangeError("body limit"); }
    chunks.push(part.value);
   }
   return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))) as unknown;
  };
  let raw: unknown;
  try {
   raw = await Promise.race([read(), new Promise<never>((_, reject) => {
    timer = setTimeout(() => { void reader.cancel().catch(() => {}); reject(new Error("body timeout")); }, 5000);
   })]);
  } catch (failure) {
   return error(failure instanceof RangeError ? "Assessment data is too large." : "Assessment data could not be read. Please retry.",
    failure instanceof RangeError ? 413 : 400);
  } finally { if (timer) clearTimeout(timer); }
  const { config } = releaseConfigForInput(raw && typeof raw === "object" && "session" in raw ? raw.session : undefined);
  const report = await constructPdfReport(config, raw);
  const content = format === "pdf" ? new Uint8Array(await renderReportPdf(report.html)) : report.html;
  return new Response(content, { headers: {
   ...headers, "Content-Type": format === "pdf" ? "application/pdf" : "text/html;charset=utf-8",
   "Content-Disposition": 'attachment; filename="' + report.filename.replace(/\.pdf$/, "." + format) + '"',
  } });
 } catch (failure) {
  if (failure instanceof ReportInputError) return error(failure.message, 409);
  if (failure instanceof ZodError || failure instanceof ScoringError)
   return error("Assessment data has changed or is invalid. Reload Results and retry.", 400);
  return error(format.toUpperCase() + " generation failed. Please retry. Your assessment is unchanged.", 503);
 } finally {
  if (timer) clearTimeout(timer);
  reader?.releaseLock();
  release();
 }
}
