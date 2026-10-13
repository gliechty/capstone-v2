import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import type { CanonicalConfig } from "../../src/domain/config/types";
import type { RetrievalContext } from "../../src/domain/recommendations/retrieve";
export const workflow = JSON.parse(readFileSync("../BUILD_PACK/03_LEGACY_N8N/workflows/n8n-output-rag-final-2026-10-02.json", "utf8")) as {
  nodes: { name: string; parameters: { jsCode?: string } }[];
};
export const nodeCode = (name: string) => workflow.nodes.find(n => n.name === name)!.parameters.jsCode!;
interface LegacyDoc { doc_id: string; doc_title: string; retrieval_score: number; retrieval_reasons: string[] }
interface LegacyChunk { chunk_id: string; doc_title: string; retrieval_score: number; retrieval_reasons: string[] }
export function legacyRetrieval(config: CanonicalConfig, context: RetrievalContext, originalTitles = false) {
  const execute = (name: string, rows: readonly unknown[], docs: unknown[] = []) => runInNewContext(`(function() { ${nodeCode(name)} })()`, {
    $input: { all: () => rows.map(json => ({ json })) },
    $: (name: string) => name === "Normalize Retrieval Outputs" ? { item: { json: context }, first: () => ({ json: context }) } : { all: () => docs },
  }, { timeout: 1000, contextCodeGeneration: { strings: false, wasm: false } }) as { json: unknown }[];
  const documents = execute("Select Matching Documents", config.DocumentIndex);
  const rows = config.DocumentChunks.map(c => ({ ...c, chunk_id: c.chunk_record_id, doc_title: originalTitles ? c.legacy_doc_title : c.doc_title }));
  return { documents: documents.map(d => d.json as LegacyDoc), chunks: execute("Select Matching Chunks", rows, documents).map(c => c.json as LegacyChunk) };
}
