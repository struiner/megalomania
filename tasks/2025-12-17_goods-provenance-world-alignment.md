# Task Specification — Goods Provenance & World Alignment

**STATUS: COMPLETED (Structural fidelity + services + integration examples); charter alignment approved for Phase 2 sequencing**

## Task Summary
Ensure managed goods carry deterministic provenance links to world truths (flora, biomes, extraction sites), reusing existing enums/types so SDK tools and import/export flows cannot drift from world generation data.

## Purpose and Scope
- Map each managed good to authoritative world sources (`FloraType`, `Biome`, `StructureType` for extraction/refinement) without duplicating identifiers.
- Provide validation hooks and fixtures that confirm provenance references exist in world data.
- Document how provenance metadata is serialized and consumed by SDK goods tools and derived stats.

## Explicit Non-Goals
- No economic simulation or balancing.
- No new world generation logic; rely on existing enums/data.
- No UI redesign beyond supplying adapters/validation.

## Fidelity & Constraints
- **Structural fidelity**: provenance schema + validation + fixtures.
- Must reuse enums/models in `v1/src/app/enums` (e.g., `FloraType`, `Biome`, `StructureType`) and goods models; avoid freeform strings.
- Deterministic ordering and normalization rules for provenance lists.

## Agent Assignments
- **Owner / Executor:** World Generator (with SDK & Modding Engineer support).
- **Design Input:** Economy Engineer / Game Designer for provenance semantics.
- **QA:** QA & Test Engineer validates determinism and coverage.

## Deliverables
- Provenance fields/spec for `ManagedGood` records referencing world enums.
- Validation module/fixtures that flag missing or invalid provenance links.
- Documentation on serialization order, casing, and extension rules.
- Integration notes for import/export service and Goods Manager UI filters.

## Review Gate
- [x] Provenance references use authoritative world enums/types (no duplication).
- [x] Validation deterministically flags missing/invalid links.
- [x] Serialization/ordering rules documented for import/export.
- **Approvers:** World Generator + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration.
- Precedes: Goods Import/Export validation and Derived Data & Stats.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Implementation Summary

**Completed: 2025-12-19T09:59:48Z**

### Deliverables Implemented:

1. **Provenance Fields Integration** - Added `provenance?: GoodsProvenanceRecord` field to `ManagedGood` interface in `managed-goods.model.ts`

2. **Updated ManagedGood Fixtures** - Enhanced all 4 sample goods with complete provenance data including:
   - Biome references (primary and secondary)
   - Flora source mapping
   - Extraction and refinement structures
   - Ledger references with hash pointers
   - Region tags and normalization rules

3. **GoodsProvenanceValidationService** (`goods-provenance-validation.service.ts`):
   - Validates managed goods for provenance alignment
   - Checks flora consistency between managed goods and provenance
   - Validates structure consistency and world data references
   - Generates synthetic provenance for goods without natural origins
   - Provides coverage statistics and validation reports

4. **GoodsProvenanceLookupService** (`goods-provenance-lookup.service.ts`):
   - Deterministic lookup by GoodsType, biome, flora, or structure
   - Search functionality with multiple criteria
   - Provenance indexing for efficient queries
   - Export/import data capabilities
   - Coverage summary by category

5. **Integration Examples** (`goods-provenance-integration-examples.ts`):
   - Comprehensive usage examples for SDK tools
   - Validation workflow demonstrations
   - Synthetic goods handling patterns
   - Import/export workflow examples
   - Real-time validation patterns for UI tools

### Key Features:
- **Deterministic Provenance**: All provenance references use authoritative world enums
- **Validation Hooks**: Automatic validation of provenance links and world data consistency
- **Synthetic Goods Support**: Handles goods without natural provenance (Energy, Data, Artifact categories)
- **SDK Integration Ready**: Services designed for use in SDK tools and import/export flows
- **Ledger Audit Support**: Hash pointers enable future ledger audit capabilities

### Files Modified/Created:
- `megalomania/v1/src/app/models/managed-goods.model.ts` (enhanced)
- `megalomania/v1/src/app/services/goods-provenance-validation.service.ts` (new)
- `megalomania/v1/src/app/services/goods-provenance-lookup.service.ts` (new)
- `megalomania/v1/src/app/services/goods-provenance-integration-examples.ts` (new)
- `megalomania/tasks/2025-12-17_goods-provenance-world-alignment.md` (updated status)

### Review Gate Status:
- [x] Provenance references use authoritative world enums/types (no duplication)
- [x] Validation deterministically flags missing/invalid links
- [x] Serialization/ordering rules documented for import/export
- [x] Services implemented for SDK tools and validation workflows
- [x] Integration examples provided for downstream consumption

## Open Questions / Clarifications
- Should goods support multiple provenance entries (e.g., multi-biome flora) at structural stage?
    answer: yes
- How to represent synthetic goods with no natural provenance?
    answer: as potential alternatives with distinct modifiers, specifically identifyable.
- Do we need hash/checksum of provenance for ledger audit later?
    answer: yes.

