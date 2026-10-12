import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { CanonicalConfig } from "../domain/config/types";
import { entitySchemas, validateRelations, type EntityName } from "../application/config/schemas";

const names = Object.keys(entitySchemas) as EntityName[];
const fileSchema = z.strictObject({ file: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/), source: z.string(), source_sha256: z.string().regex(/^[a-f0-9]{64}$/), records: z.number().int().positive() });
const manifestSchema = z.strictObject({ version: z.string().min(1), schema_version: z.literal(1), profile_options: z.strictObject({ regions: z.array(z.string().min(1)).min(1), source: z.string(), source_sha256: z.string().regex(/^[a-f0-9]{64}$/) }), files: z.record(z.enum(names as [EntityName, ...EntityName[]]), fileSchema) });
export interface ConfigRepository { load(): { config: CanonicalConfig; diagnostics: readonly string[] } }
export class ConfigLoadError extends Error {
  constructor(message: string) { super("Canonical config unavailable: " + message); this.name = "ConfigLoadError"; }
}
// Files are deployment assets under app/config; no runtime dependency on BUILD_PACK.
// An injectable reader permits corrupt/missing-file tests without mutating the snapshot.
export function createConfigRepository(read: (file: string) => string): ConfigRepository {
  return { load() {
    try {
      const manifest = manifestSchema.parse(JSON.parse(read("manifest.json").replace(/^\uFEFF/, "")));
      const records: Record<string, unknown> = { version: manifest.version, regions: Object.freeze(manifest.profile_options.regions) };
      for (const name of names) {
        const entry = manifest.files[name];
        if (entry.file !== name + ".json") throw new Error(name + ": unexpected file name");
        const raw = read(entry.file).replace(/\r\n/g, "\n");
        if (createHash("sha256").update(raw).digest("hex") !== entry.sha256) throw new Error(name + ": checksum mismatch");
        const result = entitySchemas[name].safeParse(JSON.parse(raw.replace(/^\uFEFF/, "")));
        if (!result.success) throw new Error(name + ": " + result.error.issues.slice(0, 5).map(issue => issue.path.join(".") + ": " + issue.message).join("; "));
        if (result.data.length !== entry.records) throw new Error(name + ": record count mismatch");
        records[name] = result.data;
      }
      const config = records as unknown as CanonicalConfig;
      const diagnostics = validateRelations(config);
      for (const name of names) { config[name].forEach(Object.freeze); Object.freeze(config[name]); }
      return { config: Object.freeze(config), diagnostics };
    } catch (error) { throw new ConfigLoadError(error instanceof Error ? error.message : "Invalid snapshot"); }
  } };
}
export function loadCanonicalConfig() {
  const root = path.join(process.cwd(), "config", "capstone-v1");
  return createConfigRepository(file => readFileSync(path.join(root, file), "utf8")).load();
}

