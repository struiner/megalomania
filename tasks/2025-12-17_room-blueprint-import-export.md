# Task Specification — Room Blueprint Import/Export Service

**STATUS: NOT STARTED (Structural fidelity)**

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
- [ ] Invalid blueprints are rejected with actionable errors.
- [ ] Exported JSON is deterministic given identical input.
- [ ] Version/migration hooks exist and are documented.
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Room Blueprint Data Model & Hazard Integration.
- Precedes: Room Blueprint Editor UI wiring; Validation Service may reuse shared rules.

## Open Questions / Clarifications
- Minimum/maximum dimension rules for structural validation?
- Should hazards be normalized (deduplicated) on import?
- Preferred error surface for SDK consumers (structured object vs. array)?
