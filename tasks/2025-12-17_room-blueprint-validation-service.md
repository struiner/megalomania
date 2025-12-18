# Task Specification — Room Blueprint Validation Service

**STATUS: NOT STARTED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Provide a validation service for room blueprints that enforces dimension bounds, hazard logic and required fields, producing deterministic warnings/errors consumable by the editor and import/export flows.

## Purpose and Scope
- Define validation rules for dimensions (non-zero, sensible limits), hazard combinations, required names/purposes and feature lists.
- Surface structured validation results with clear messages and severity levels.
- Integrate with import/export service and editor UI without owning persistence.
- Validate hazard inputs against the shared `HazardType` enum and dimensions against shared types (`Position`, `ID`) where applicable to keep rules DRY across SDK tools.

## Explicit Non-Goals
- No procedural generation or layout solving.
- No UI rendering; service only.
- No ledger interactions.

## Fidelity & Constraints
- **Structural fidelity**: straightforward rule set; deterministic outputs for identical inputs.
- Align with **Level of Detail & Abstraction** (explicit, deletable code) and keep UI passive per **UI & Ergonomics Charter**.
- Avoid over-engineered rule engines; simple functions suffice.

## Agent Assignments
- **Owner / Executor:** QA & Test Engineer (with SDK & Modding Engineer support).
- **Design Input:** World Generator / Game Designer for hazard constraints and dimension limits.
- **QA:** QA & Test Engineer validates determinism (self-owned).

## Deliverables
- Validation module/functions returning structured results (errors/warnings) for blueprints.
- Documented rule set (dimensions, hazards, required fields).
- Test fixtures covering valid/invalid cases.
- Integration notes for import/export and editor UI consumers.

## Review Gate
- [x] Validation results are deterministic and stable in ordering.
- [x] Rules cover dimensions, hazards, required fields and feature presence.
- [x] Integration guidance provided for UI and import/export flows.
- **Approvers:** QA & Test Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Room Blueprint Data Model & Hazard Integration.
- Precedes: Editor UI error display; complements Import/Export Service.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- What are minimum/maximum dimension thresholds for structural validity?
    answer: min:16x16, max: 512x512
- Are there hazardous combinations that must be blocked or warned?
    answer: no
- Should validation auto-correct minor issues (e.g., trim strings) or only report?
    answer: it should suggest autocorrect to the user.
