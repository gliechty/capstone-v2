import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { CanonicalConfig } from "../domain/config/types";
import { assessmentCatalog, selectedQuestions } from "./assessment-catalog";
import { createAssessmentModel } from "../features/assessment/model";
import { recommendationRequestFromSession } from "./recommendations/request";
import { recommendationContentSchema } from "./recommendations/contracts";
import { inputIdentityText } from "./recommendations/identity";
import { computeAssessment } from "./score-request";
import { withPortraitPotential } from "./portrait-potential";
import { selectImprovementLevers } from "./improvement-levers";
import { assessmentReport, type ReportScenario } from "./assessment-report";
import { reportAssetPaths } from "./report-assets";

export class ReportInputError extends Error {}
// Only structured snapshots enter this boundary. No HTML, URLs, scores or asset paths.
export async function constructPdfReport(config: CanonicalConfig, raw: unknown) {
 const catalog = assessmentCatalog(config);
 const model = createAssessmentModel(catalog.version, p => selectedQuestions(catalog, p));
 const request = z.strictObject({
  session: model.sessionSchema,
  recommendations: z.strictObject({
   inputId: z.string().regex(/^[a-f0-9]{64}$/), content: recommendationContentSchema,
  }).optional(),
  scenarioAnswers: z.record(z.string().max(100), z.string().max(2000))
   .refine(a => Object.keys(a).length > 0 && Object.keys(a).length <= 5).optional(),
 }).parse(raw);
 const { session } = request;
 const input = recommendationRequestFromSession(session);
 const inputId = createHash("sha256").update(inputIdentityText(input)).digest("hex");
 if (request.recommendations && request.recommendations.inputId !== inputId)
  throw new ReportInputError("Recommendations no longer match this assessment. Reload Results and retry.");
 if (!request.recommendations || !request.recommendations.content.key_gaps.length || !request.recommendations.content.priority_recommendations.length)
  throw new ReportInputError("Generate successful Key Gaps and Recommended Actions for this assessment in Results before downloading.");
 const scoreInput = { configVersion: input.configVersion, context: input.context, answers: input.answers };
 const actual = computeAssessment(config, scoreInput);
 const score = withPortraitPotential(config, actual);
 const levers = selectImprovementLevers(config, actual).levers;
 let scenario: ReportScenario | undefined;
 if (request.scenarioAnswers) {
  const answers = Object.entries(request.scenarioAnswers).map(([id, proposed]) => {
   const lever = levers.find(l => l.id === id);
   if (!lever) throw new ReportInputError("A hypothetical Lever has changed. Reload Levers and retry.");
   const valid = lever.options.length ? lever.options.includes(proposed) :
    /^\d+(\.\d+)?$/.test(proposed) && Number.isFinite(Number(proposed)) &&
    Number(proposed) >= lever.min && Number(proposed) <= lever.max;
   if (!valid) throw new ReportInputError("Review the hypothetical Lever values and retry.");
   return { id, title: lever.title, actual: lever.actual, proposed, unit: lever.unit };
  });
  scenario = { answers, score: computeAssessment(config, {
   ...scoreInput, answers: { ...input.answers, ...request.scenarioAnswers },
  }) };
 }
 const assets = Object.fromEntries(await Promise.all(reportAssetPaths(score).map(async asset => [
  asset, "data:" + (asset.endsWith(".ttf") ? "font/ttf" : "image/svg+xml") + ";base64," +
   (await readFile(path.join(process.cwd(), "public", asset))).toString("base64"),
 ])));
 return {
  html: assessmentReport(session, score, request.recommendations?.content, undefined, scenario, { assets, levers }),
  filename: scenario ? "mosaic-assessment-with-levers.pdf" : "mosaic-assessment-report.pdf",
 };
}
