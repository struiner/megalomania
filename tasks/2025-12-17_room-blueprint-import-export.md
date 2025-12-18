# Task Specification — Room Blueprint Import/Export Service

**STATUS: NOT STARTED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Implement deterministic JSON import/export for room blueprints, validating dimensions, hazards and features against the blueprint schema and shared enums while providing version/migration hooks.

## Purpose and Scope
- Parse/serialize `RoomBlueprint` definitions with validation (required fields, dimension bounds, hazard references).
- Provide clear error reporting and reject invalid or ambiguous entries.
- Offer versioning/migration hook scaffolding for future schema evolution.
- Validate against authoritative enums/types (e.g., `HazardType` once defined, `StructureType`, `Position`/`ID` shapes) rather than duplicating lookup tables.

## Explicit Non-Goals
- No UI integration beyond callable service APIs.
- No procedural generation or placement logic.
- No ledger emissions (covered in separate task).

## Fidelity & Constraints
- **Structural fidelity**: functional import/export with deterministic ordering and validation.
- Align with **Level of Detail & Abstraction** (explicit, deletable code) and keep UI passive per **UI & Ergonomics Charter**.
- Maintain consistent ordering of hazards/features for reproducible exports.

## Agent Assignments
- **Owner / Executor:** SDK & Modding Engineer.
- **Design Input:** World Generator / Game Designer for dimension defaults and hazard semantics.
- **QA:** QA & Test Engineer for determinism and validation coverage.

## Deliverables
- Service/module exposing import/export functions for room blueprints.
- Validation rules (dimensions, hazard references, required fields) and error taxonomy.
- Version/migration hook scaffold with documentation.
- Sample JSON fixtures (valid/invalid) for testing.

## Review Gate
- [x] Invalid blueprints are rejected with actionable errors.
- [x] Exported JSON is deterministic given identical input.
- [x] Version/migration hooks exist and are documented.
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Room Blueprint Data Model & Hazard Integration.
- Precedes: Room Blueprint Editor UI wiring; Validation Service may reuse shared rules.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Minimum/maximum dimension rules for structural validation?
    answer: min:16x16, max: 512x512
- Should hazards be normalized (deduplicated) on import?
    answer: the user should be presented with the option to normalize
- Preferred error surface for SDK consumers (structured object vs. array)?
    answer: structured object.
