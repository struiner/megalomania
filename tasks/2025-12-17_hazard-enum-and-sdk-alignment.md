# Task Specification — HazardType Enum & SDK Alignment

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Create an authoritative `HazardType` enum under `v1/src/app/enums` and refactor SDK tooling (e.g., room creator/editor) to consume it, eliminating hardcoded hazard strings while keeping UI passive and deterministic.

## Purpose and Scope
- Define `HazardType` values that cover existing SDK usage (`room-creator.component`) and anticipated room blueprint needs.
- Expose the enum through read-only adapters for UI pickers and validation services to keep DRY.
- Document ownership boundaries and how hazards map to any existing hazard scoring fields in `v1/src/app/models/goods.model.ts` / design data.

## Explicit Non-Goals
- No procedural hazard simulation, damage modeling or world placement logic.
- No visual redesign of SDK components beyond swapping data sources.
- No ledger wiring (covered in separate ledger tasks).

## Fidelity & Constraints
- **Structural fidelity**: introduce enum + adapters; refactor consumers to use it without behavior changes.
- Respect **UI & Ergonomics Charter** (UI passive, limited primary actions) and **Level of Detail & Abstraction** (explicit, deletable scaffolding).
- Ensure deterministic ordering for picker display.

## Agent Assignments
- **Owner / Executor:** SDK & Modding Engineer.
- **Design Input:** World Generator / Game Designer for hazard vocabulary and grouping.
- **QA:** QA & Test Engineer validates deterministic ordering and consumer refactors.

## Deliverables
- `HazardType` enum in `v1/src/app/enums/HazardType.ts` (or equivalent) with documentation.
- Adapter/service exposing hazard options for UI/validation (read-only).
- Refactor notes/PR checklist for swapping hardcoded hazard strings in `v1/src/app/components/sdk/room-creator/room-creator.component.ts` and room blueprint editor skeleton.
- Sample fixtures for validation service/tests.

## Review Gate
- [ ] Hazard options sourced from the new enum across SDK room tools (no hardcoded strings).
- [ ] Deterministic ordering documented and enforced for pickers.
- [ ] Ownership boundaries documented (enum is authoritative; UI is consumer).
- **Approvers:** SDK & Modding Engineer + Architecture Steward (World Generator consults).

## Dependencies & Sequencing
- Precedes: Room Blueprint Data Model, Import/Export, Editor UI, Validation Service (hazard pickers/validators).
- Can run in parallel with: Tech/Goods epics (independent).

## Open Questions / Clarifications
- Should hazards include severity categories or remain simple identifiers at structural stage?
    answer: simple identifiers will suffice for now, provided a TODO is included.
- Do hazards need culture/biome tags now or later?
    answer: yes.
- How to align with any existing hazard scoring fields in design data?
    answer: treat existing hazard scoring as placeholder data, to be scrutinized by the world builder and game designer agents for realism.

