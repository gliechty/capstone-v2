# Canonical document identity migration

## Runtime training-routing correction — 2026-11-07

The owner-authorized runtime derivative `capstone-v1-training-routing-2` consolidates the five training metric IDs under `labor_training_hours`. Industry rows, normalization methods, all numeric parameters and inherited notes remain unchanged. QuestionBank M-024 and inactive M-025 already reference the shared ID; no question reference change is needed. Benchmark identities remain `(metric_id, benchmark_group_type, benchmark_group_value)`; validation and resolver precedence are unchanged. Manifest checksum/version and portrait mapping's top-level compatible config version advance together; QuestionBank hash, portrait assignments and their original question-bank provenance remain unchanged.

The CSV Build Pack and historical Golden captures remain immutable evidence. `tools/migrate-config.ps1` deliberately recreates the initial migration, not this corrected derivative: do not use it to overwrite the current runtime snapshot. Historical comparisons must distinguish original source routing from corrected runtime routing; original captured scores are not new expected scores. See EXECUTION_PLAN.md for the targeted before/after audit and affected scores. Existing config/session/recommendation version checks reject the old version after a future deployment; no session migration or validation relaxation is included.

This is an explicitly authorized v2 identity reconciliation, not an edit to the immutable Build Pack. The clean CSV exports remain evidence. Versioned runtime JSON lives under app/config/capstone-v1. The migration script is tools/migrate-config.ps1; run it from PowerShell 7 only when deliberately regenerating this initial snapshot.

## Investigation and decisions

All nine unmatched chunk titles and all nine reciprocal unmatched index records were inspected. Decisions use index issuer/scope/summary/source URL first, then distinctive chunk content and section/metric references. The preserved document-index and document-chunk prompts establish their per-document extraction provenance. Official/public sources corroborate identity where available. Title similarity alone is not the basis of these decisions.

The preserved Drive links remain attached to each index record and in the mapping. Their underlying binaries were not downloaded or independently verified. Public corroboration does not assert that every legacy page citation or source edition is correct. For example, some Scope 3 chunk page references are inconsistent with the public PDF. Citation repair and content validation are outside this identity migration; those values are preserved.

All nine mappings are supported; none remains an unresolved identity pair. The two case/order-only variants still have content/issuer evidence recorded below. The mapping JSON is the explicit migration input and retains canonical titles, stable IDs, original source links and affected legacy chunk IDs.

### capstone-doc-002: 2025 CDP SME Questionnaire: Modules 14-21

- Legacy chunk title: 2025 CDP SME Questionnaire
- Index identity: legacy 2; issuer/source: CDP.
- Decision: same underlying indexed source. CDP issuer; chunks CDP-SME cite modules 14-21, governance 17.1/17.2, transition 18.2 and emissions/allocation 20.12, matching the indexed module-specific questionnaire.
- [Preserved index source](https://drive.google.com/file/d/1hcZv7y3c0RuyR2nwO579GGKwraaMFfDY/view?usp=share_link); [public corroboration](https://cdn.cdp.net/cdp-production/cms/guidance_docs/pdfs/000/005/713/original/2024_SME_Questionnaire_Modules_14-21.pdf).
- Affected chunks: CDP-SME-001, CDP-SME-002, CDP-SME-003, CDP-SME-004, CDP-SME-005, CDP-SME-006, CDP-SME-007, CDP-SME-008, CDP-SME-009, CDP-SME-010.

### capstone-doc-005: Corporate Value Chain (Scope 3) Accounting and Reporting Standard

- Legacy chunk title: Corporate Value Chain (Scope 3) Standard
- Index identity: legacy 5; issuer/source: WRI & WBCSD.
- Decision: same underlying indexed source. WRI/WBCSD issuer; CVCARS chunks cover supplier-specific data, chapter 8 allocation (including supplier versus reporting-company perspectives) and chapter 11 reporting. These identify the indexed Scope 3 standard, not the separate calculation guidance.
- [Preserved index source](https://drive.google.com/file/d/1HyrycayDjDOa9bNL_bbIccyaSvjdYLJA/view?usp=share_link); [public corroboration](https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf).
- Affected chunks: CVCARS-001, CVCARS-002, CVCARS-003, CVCARS-004, CVCARS-005, CVCARS-006, CVCARS-007, CVCARS-008, CVCARS-009, CVCARS-010.

### capstone-doc-020: EFRAG IG 2: Value chain

- Legacy chunk title: EFRAG IG 2: Value Chain Implementation Guidance
- Index identity: legacy 20; issuer/source: EFRAG.
- Decision: same underlying indexed source. EFRAG issuer/EU scope; EFRAG-VC chunks reference IG2 summary points, section 2.5 value-chain coverage, section 2.1 leverage and Annex 2 business relationships. Index summary identifies the same upstream/downstream IRO guidance.
- [Preserved index source](https://drive.google.com/file/d/1MwSqZz0tzGCv5idRDELZ_lDWLMZAjJXu/view); [public corroboration](https://www.efrag.org/sites/webpublishing/SiteAssets/EFRAG%20IG%202%20Value%20Chain_final.pdf).
- Affected chunks: EFRAG-VC-001, EFRAG-VC-002, EFRAG-VC-003, EFRAG-VC-004, EFRAG-VC-005, EFRAG-VC-006, EFRAG-VC-007, EFRAG-VC-008, EFRAG-VC-009, EFRAG-VC-010.

### capstone-doc-021: IG 1 Materiality Assessment_final

- Legacy chunk title: EFRAG IG 1: Materiality Assessment Implementation Guidance
- Index identity: legacy 21; issuer/source: EFRAG.
- Decision: same underlying indexed source. EFRAG issuer/EU scope; MA-IG chunks concern double materiality, severity scale/scope/irremediability, likelihood, stakeholders, group consolidation and unconditional ESRS 2 disclosure. These distinguish IG1 from IG2 and match the indexed materiality guidance.
- [Preserved index source](https://drive.google.com/file/d/1t_qYp9YNi4UiCxre1_IBWzKnnckO1cjc/view); [public corroboration](https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/EFRAG%20IG%201%20Materiality%20Assessment%20May%202024.pdf).
- Affected chunks: MA-IG-001, MA-IG-002, MA-IG-003, MA-IG-004, MA-IG-005, MA-IG-006, MA-IG-007, MA-IG-008, MA-IG-009, MA-IG-010, MA-IG-011, MA-IG-012.

### capstone-doc-022: EU Corpurate Social Responsibility Directive (CSRD)

- Legacy chunk title: Corporate Sustainability Reporting Directive (CSRD)
- Index identity: legacy 22; issuer/source: European Parliament and Council.
- Decision: same underlying indexed source. European Parliament/Council issuer; CSRD chunks identify recital 47 double materiality, article 19a(3) value chains, article 29b(4) SME proportionality and article 40a third-country reporting. Index summary identifies the same directive despite its misspelled title.
- [Preserved index source](https://drive.google.com/file/d/13PPEV1PNT6q5fmBkx90gFhoRzFrCZXA6/view); [public corroboration](https://eur-lex.europa.eu/eli/dir/2022/2464/oj/eng).
- Affected chunks: CSRD-001, CSRD-002, CSRD-003, CSRD-004, CSRD-005, CSRD-006, CSRD-007, CSRD-008, CSRD-009, CSRD-010, CSRD-011.

### capstone-doc-024: General Requirements for Disclosure of Sustainability-related Financial Information

- Legacy chunk title: Australian Sustainability Reporting Standard AASB S1 [voluntary]
- Index identity: legacy 24; issuer/source: Australian Accounting Standards Board (AASB).
- Decision: same underlying indexed source. Index issuer is Australian Accounting Standards Board (Oceania), not IASB/ISSB. AASB-S1 chunks cite paragraphs 2-3, 32, Appendix A/B5, B11, 55/59 and 78-79; paragraph 32 business-model/value-chain content matches AASB S1. Its formal title matches the index.
- [Preserved index source](https://drive.google.com/file/d/1GGR8s9nG0iZ3nD_VhphsG1mW3Mxy-BWw/view); [public corroboration](https://standards.aasb.gov.au/aasb-s1-sep-2024).
- Affected chunks: AASB-S1-001, AASB-S1-002, AASB-S1-003, AASB-S1-004, AASB-S1-005, AASB-S1-006, AASB-S1-007, AASB-S1-008.

### capstone-doc-027: Sustainability Reporting Handbook for Vietnamese Companies

- Legacy chunk title: Sustainability Reporting Handbook For Vietnamese Companies
- Index identity: legacy 27; issuer/source: IFC; State Securities Commission of Vietnam.
- Decision: same underlying indexed source. IFC/State Securities Commission Vietnam attribution and local listed-company context match. VN-SRH chunks identify chapter 4 reporting process, section 5.1, Appendix 3 GRI G3 and section 3.4 IFC Performance Standards. The sole title difference is capitalization; no competing handbook in the index. IFC's disclosure toolkit bibliography independently lists this handbook.
- [Preserved index source](https://drive.google.com/file/d/1TsSV94C2twmClf9Z-CajZRIqeCGB5z7r/view); [public corroboration](https://www.ifc.org/content/dam/ifc/doc/mgrt/beyond-the-balance-sheet-ifc-toolkit-for-disclosure-transparency.pdf).
- Affected chunks: VN-SRH-001, VN-SRH-002, VN-SRH-003, VN-SRH-004, VN-SRH-005, VN-SRH-006, VN-SRH-007, VN-SRH-008, VN-SRH-009, VN-SRH-010, VN-SRH-011.

### capstone-doc-042: Sustainability Accounting Standard: Containers & Packaging

- Legacy chunk title: Containers & Packaging Sustainability Accounting Standard
- Index identity: legacy 42; issuer/source: IFRS Foundation.
- Decision: same underlying indexed source. IFRS Foundation/manufacturing metadata and index summary match the CP-SASB chunks. Exact industry metric identifiers RT-CP-110a.1 (Scope 1) and RT-CP-130a.1 (energy/renewables), plus water content, distinguish this from other industry standards. Official IFRS industry guidance corroborates these metric identities; it is not substituted for the preserved source edition.
- [Preserved index source](https://drive.google.com/file/d/1ZjLX0kQvTjBjzDOk28DZSrNTFpwG-bTS/view?usp=share_link); [public corroboration](https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards-issb/english/2023/issued/part-b/ifrs-s2-ibg-volume-48-containers-and-packaging-part-b.pdf).
- Affected chunks: CP-SASB-001, CP-SASB-002, CP-SASB-003, CP-SASB-004.

### capstone-doc-043: UNOPS Sustainable Procurement Framework (Annex 1 to the Procurement Manual)

- Legacy chunk title: UNOPS Sustainable Procurement Framework
- Index identity: legacy 43; issuer/source: UNOPS.
- Decision: same underlying indexed source. UNOPS attribution and buyer-procurement purpose match. UNOPS-SPF chunks cite sections 3.1/3.2 thresholds, 4.1 DRiVE/CAPA, 3.4/3.5 exclusions, 4.2 supplier diversity and 4.4 disability. Official cover identifies the framework as Annex 1 to the Procurement Manual.
- [Preserved index source](https://drive.google.com/file/d/1hb5qb0tt4FKPspE1fzMMfHXDmDkzQ313/view?usp=share_link); [public corroboration](https://content.unops.org/service-Line-Documents/Procurement/UNOPS-Procurement-Manual-Annex-1-2021_EN.pdf).
- Affected chunks: UNOPS-SPF-001, UNOPS-SPF-002, UNOPS-SPF-003, UNOPS-SPF-004, UNOPS-SPF-005, UNOPS-SPF-006, UNOPS-SPF-007, UNOPS-SPF-008, UNOPS-SPF-009, UNOPS-SPF-010.

## Stable identities and auditability

Every DocumentIndex record retains its original doc_id as legacy_doc_id; canonical doc_id is capstone-doc- followed by the zero-padded original identity. IDs do not depend on titles or current row positions. Each chunk references doc_id and uses the exact canonical DocumentIndex title. The original title is retained as legacy_doc_title.

The global chunk_record_id combines canonical doc_id and legacy_chunk_id. EC-01 through EC-08 occur in two distinct documents (Engineering & Construction Services and E-commerce); both sets survive, with distinct namespaced identities and original chunk IDs. No chunk text, section reference, citation label or other substantive source field is removed or rewritten. All 428 chunks resolve to one of 44 document records.

The index's misspelled CSRD title is retained verbatim as the requested canonical index title. This reconciliation does not silently edit editorial wording, legal currency, document editions, or methodology.

The other five entities are copied without semantic transformation and retain row order and numeric text precision. Manifest source hashes pin the clean exports; runtime hashes and counts pin the migrated records. Runtime loading never joins on title. Document identities, composite benchmark/scale identities and foreign keys are validated separately.
