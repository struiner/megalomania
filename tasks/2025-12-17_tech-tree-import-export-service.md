# Task Specification — Tech Tree Import/Export Service

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Create a deterministic JSON import/export service for technology trees that validates data against the tech tree schema, preserves ordering and surfaces migration/version hooks without owning gameplay logic.

## Purpose and Scope
- Implement parsing/serialization routines for `TechTree`/`TechNode` definitions with deterministic key ordering.
- Enforce schema validation (required fields, acyclic prerequisites, culture tags) and emit actionable errors.
- Provide versioning hooks and minimal migration scaffolding for future schema evolution.
- Validate identifiers against authoritative enums/models referenced in the data model task (e.g., `v1/src/app/enums/*`, `v1/src/app/models/goods.model.ts`) instead of duplicating lookup tables.

## Explicit Non-Goals
- No editor UI integration beyond callable service APIs.
- No persistence layer or storage connectors.
- No research progression computation or ledger writes (handled in separate tasks).

## Fidelity & Constraints
- **Structural fidelity**: functioning import/export with validation; placeholder migration registry allowed.
- Must respect **Level of Detail & Abstraction** (explicit, deletable code) and keep UI passive per **UI & Ergonomics Charter**.
- Deterministic serialization: stable ordering of nodes/prerequisites and consistent whitespace.

## Agent Assignments
- **Owner / Executor:** Backend Engineer.
- **Design Input:** Game Designer to supply sample JSON payloads for validation.
- **QA:** QA & Test Engineer to validate determinism across repeated runs.

## Deliverables
- Service/module providing `importTechTree(json)`, `exportTechTree(tree)` (names TBD) with validation results.
- Schema validation rules and error taxonomy.
- Version/migration hook scaffold with documentation on expected usage.
- Sample JSON fixtures (valid/invalid) for QA.

## Review Gate
- [ ] Import rejects invalid or cyclic tech definitions with clear errors.
- [ ] Export output is deterministic across runs given identical input.
- [ ] Version/migration hooks exist and are documented.
- **Approvers:** Backend Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Tech Tree Data Model Definition.
- Precedes: Tech Tree Editor UI Skeleton wiring and any ledger integration that consumes tech definitions.

## Open Questions / Clarifications
- Preferred JSON schema dialect (hand-rolled vs. lightweight schema library)?
- Should the service normalize identifiers (case/whitespace) or fail fast?
- How to represent optional culture-specific metadata without breaking determinism?
