# Task Specification — Tech Culture Tag Canon & World Alignment

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Define an authoritative culture tag canon and world-aligned traits for tech trees, sourcing tags from existing world data (biomes, settlements, guilds) to prevent drift and ensure deterministic validation across tech definitions.

## Purpose and Scope
- Establish a controlled list of culture tags derived from world truths (e.g., `Biome`, `SettlementType`, `GuildType`, regional archetypes) with deterministic identifiers.
- Provide mapping/lookup services for the tech editor and import/export validation to ensure tech nodes reference canonical tags only.
- Document how culture tags relate to world generation outputs and how to extend them without breaking determinism.

## Explicit Non-Goals
- No balancing or narrative design of specific techs.
- No new world simulation; reuse existing world data only.
- No UI redesign beyond supplying adapters.

## Fidelity & Constraints
- **Structural fidelity**: tag canon + adapters + validation rules; fixtures acceptable.
- Must reuse authoritative enums/models (`v1/src/app/enums/Biome.ts`, `SettlementType`, `GuildType`, etc.) and avoid freeform strings.
- Respect **Level of Detail & Abstraction** (explicit, deletable) and keep UI passive per **UI & Ergonomics Charter**.

## Agent Assignments
- **Owner / Executor:** World Generator (with Architecture Steward oversight).
- **Design Input:** Game Designer for tag semantics and naming.
- **QA:** QA & Test Engineer validates determinism and schema coverage.

## Deliverables
- Canon list of culture tags with references to source enums/world traits.
- Adapter/service exposing tags for tech editor pickers and import/export validation.
- Documentation on extension rules and determinism (ordering, casing).
- Fixtures demonstrating valid/invalid culture-tagged tech nodes.
- **Sample vocabulary captured:** see `tasks/2025-12-17_tech-tree-sample-fixtures.md` for enum-aligned culture tags and a tech tree fixture that downstream tasks can validate against.

## Review Gate
- [ ] Tags map to authoritative world data (no duplicate/freeform tags).
- [ ] Deterministic ordering/documentation present for validation and UI pickers.
- [ ] Extension rules documented to prevent drift from world truths.
- **Approvers:** World Generator + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Tech Tree Data Model Definition; Shared Enum & Type Integration.
- Precedes: Tech Import/Export validation and editor picker wiring.

## Open Questions / Clarifications
- Should culture tags be hierarchical (culture → subculture) or flat at structural stage?
    answer: potentially hierarchical.
- How to represent multi-biome cultures without breaking determinism?
    answer: Possibly by distinguishing preferred array with possible array
- Do we need reserved tags for procedurally generated cultures, and how are they namespaced?
    answer: no, namespace prefers readabiliy for procedurally generated cultures, but can vary per culture.
