# Task Specification — Ledger Event Wiring for Research Actions

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Define and wire ledger event types for research start and completion so tech research actions are recorded in the PBC with deterministic schemas, without implementing progression mechanics.

## Purpose and Scope
- Specify event payloads for `RESEARCH_START` and `RESEARCH_COMPLETE` (names TBD) referencing tech identifiers and culture/player context.
- Provide stub services to emit these events from the tech editor/consumers while keeping progression logic out of scope.
- Document validation rules and cross-player verification hooks.
- Align payloads and DTOs with existing ledger models in `v1/src/app/models/ledger.models.ts` and `v1/src/app/models/anna-readme.models.ts` to avoid redefined ledger shapes.

## Explicit Non-Goals
- No research point generation, timers or success logic.
- No persistence beyond ledger event emission hooks.
- No UI-side ownership of research state.

## Fidelity & Constraints
- **Structural fidelity**: event schemas and stub emitters; deterministic serialization per ledger rules.
- Must align with ledger ownership in `agents.md` and keep UI passive per **UI & Ergonomics Charter**.
- Follow **Level of Detail & Abstraction**: explicit schemas, minimal scaffolding, avoid overbuilt pipelines.

## Agent Assignments
- **Owner / Executor:** Ledger Engineer.
- **Design Input:** Game Designer for event semantics (e.g., culture tagging, narrative hooks).
- **QA:** QA & Test Engineer validates schema determinism and minimal rebuildability.

## Deliverables
- Event schema definitions for research lifecycle events with field lists and types.
- Stub service/API surface to emit events (no progression logic).
- Documentation on ordering, validation and cross-player verification expectations.
- Sample events/fixtures for integration testing with import/export and editor UI.

## Review Gate
- [ ] Event schemas reference tech identifiers from the data model without duplication.
- [ ] Serialization and hashing rules documented for determinism.
- [ ] Stub emitters are side-effect minimal and safe to integrate at structural stage.
- **Approvers:** Ledger Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Tech Tree Data Model Definition (identifiers), Shared Enum & Type Integration (valid ids).
- Can parallelize with: Import/Export Service once identifiers are stable.
- Precedes: Functional research mechanics tasks.

## Open Questions / Clarifications
- Required granularity for timestamps (minute-level per epic; any tighter?).
    answer consistently tight at about minute level
- How to represent culture or player ownership in the event payload?
    answer: as a reference or property within the player's property or character sheet.
- Should cancellation/abandon events be defined now or later?
    answer: now.
