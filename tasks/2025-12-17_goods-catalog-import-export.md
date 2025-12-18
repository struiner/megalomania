# Task Specification — Goods Catalogue Import/Export Service

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Implement deterministic JSON import/export for the goods catalogue, validating `ManagedGood` entries against shared enums and numeric bounds while preserving ordering for reproducible SDK workflows.

## Purpose and Scope
- Provide parser/serializer for goods catalogue JSON that validates required fields, enum references and numeric ranges.
- Surface clear error messages for invalid entries and reject ambiguous identifiers.
- Offer optional version/migration hooks for future schema evolution.
- Validate identifiers against authoritative enums/models (`v1/src/app/models/goods.model.ts`, `v1/src/app/enums/FloraType.ts`) instead of introducing duplicate lookup tables.

## Explicit Non-Goals
- No UI integration beyond callable service APIs.
- No economic calculations or derived stats (handled separately).
- No persistence or storage connectors.

## Fidelity & Constraints
- **Structural fidelity**: working import/export with validation and deterministic ordering.
- Adhere to **Level of Detail & Abstraction** (explicit, deletable code) and keep UI passive per **UI & Ergonomics Charter**.
- Preserve insertion/order consistency to support stable exports.

## Agent Assignments
- **Owner / Executor:** SDK & Modding Engineer.
- **Design Input:** Economy Engineer for numeric bounds and category semantics.
- **QA:** QA & Test Engineer for determinism checks and validation coverage.

## Deliverables
- Service/module exposing import/export functions for goods catalogue.
- Validation rules (required fields, enum checks, numeric ranges) and error taxonomy.
- Version/migration hook scaffold with documentation.
- Sample JSON fixtures (valid/invalid) for testing.

## Review Gate
- [ ] Invalid entries are rejected with actionable errors.
- [ ] Exported JSON is deterministic for identical input.
- [ ] Version/migration hooks exist and are documented.
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration.
- Precedes: Goods Manager UI Skeleton wiring and Derived Data & Stats computation.

## Open Questions / Clarifications
- Should price/complexity be clamped or strictly validated?
    Answer: price or value are calculated properties and should be strictly validated, possibly through some visual mechanism that lets a user edit the underlying formula. Complexity is a property that can be clamped.
- Preferred error format for SDK consumers (array vs. structured object)?
    Answer: prefer a structured object, which can contain an array of structured objects when necessary.
- Do we need locale-aware formatting for exported numbers/strings?
    Answer: localization is preferred.
