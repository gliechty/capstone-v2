# Current v1 Data Model

## Conclusion

The final v1 application did **not** use a production domain database for SMEs, assessments, questions, answers, scores, configuration, or retrieval content.

The authoritative application data/configuration layer was Google Sheets.

## Evidence from the live server

PostgreSQL exposes two databases:

- `postgres` — no relations
- `nocodb` — NocoDB internal/system tables

The `nocodb` database contains 102 visible relations, predominantly `nc_*` NocoDB system/metadata tables.

The NocoDB model catalog (`nc_models_v2`) contains exactly one user model:

- title: `test_smes`
- table_name: `test_smes`

No production domain models such as SMEs, assessments, questions, answers, scores, QuestionBank, DocumentIndex, or DocumentChunks were found.

## Production v1 data locations

| Data / configuration | v1 location |
|---|---|
| QuestionBank | Google Sheets |
| Answer scales | Google Sheets |
| Metric benchmarks | Google Sheets |
| Multiplier rules | Google Sheets |
| Category weights | Google Sheets |
| Document index | Google Sheets |
| Document chunks | Google Sheets |
| SME assessment state / answers | Appsmith client/runtime state during assessment |
| Recommendation orchestration | n8n |
| NocoDB | Development/testing only |
| PostgreSQL | Backing store for NocoDB system state; no production Capstone domain schema found |

## Migration implication

There is no meaningful production `current_schema.sql` to preserve as a Capstone domain schema.

For v2, the database schema should therefore be designed from the preserved application contracts and canonical configuration files rather than inferred from the existing PostgreSQL database.

The v1 Google Sheets configuration files in `04_CONFIG/clean/` are the authoritative migration inputs for the data model.

## Explicit exclusions

`Test_SMEs` is not part of the production v1 data model and is not required in the active Build Pack. It may be retained separately only if later useful as historical test data or as a source for regression fixtures.

No claim is made here that PostgreSQL served as a site-backup system; this audit only establishes that the live `nocodb` database backs NocoDB system/metadata state and contains no production Capstone domain tables.
