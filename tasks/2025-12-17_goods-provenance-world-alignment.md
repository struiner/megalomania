# Task Specification — Goods Provenance & World Alignment

**STATUS: NOT STARTED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

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

## Open Questions / Clarifications
- Should goods support multiple provenance entries (e.g., multi-biome flora) at structural stage?
    answer: yes
- How to represent synthetic goods with no natural provenance?
    answer: as potential alternatives with distinct modifiers, specifically identifyable.
- Do we need hash/checksum of provenance for ledger audit later?
    answer: yes.

