# Task Specification — Room Blueprint Data Model & Hazard Integration

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Define a `RoomBlueprint` data model that captures dimensions, purpose, hazards, features and metadata, integrating with existing hazard/structure enums while keeping deterministic identifiers for SDK import/export.

## Purpose and Scope
- Create TypeScript interfaces/types for room blueprints with width/height, purpose, hazards, notable features and tags.
- Integrate hazard definitions with existing enums (or define authoritative source if missing) without duplicating domain truth.
- Document validation hints for dimensions and hazard constraints.
- Reuse shared types where applicable (e.g., `Position`/`ID` from `v1/src/app/types`, `StructureType` from `v1/src/app/enums/StructureType.ts`) and prefer a single `HazardType` enum source to avoid string literals across SDK tools.

## Explicit Non-Goals
- No procedural room generation or placement logic.
- No UI implementation.
- No persistence adapters beyond typed shapes and documentation.

## Fidelity & Constraints
- **Structural fidelity**: lean interfaces; deterministic identifier and ordering rules.
- Respect **UI & Ergonomics Charter** (UI passive) and **Level of Detail & Abstraction** (explicit, deletable scaffolding).
- Avoid premature generalization—focus on blueprint needs only.

## Agent Assignments
- **Owner / Executor:** SDK & Modding Engineer.
- **Design Input:** World Generator / Game Designer for hazard vocabulary and purpose taxonomy.
- **QA:** QA & Test Engineer validates enum linkage and determinism.

## Deliverables
- Interfaces/types for `RoomBlueprint` and related hazard/feature references.
- Documentation for identifier normalization and allowed purpose/hazard values.
- Sample blueprint fixtures for downstream services/UI.

## Review Gate
- [ ] Hazard/purpose references come from authoritative enums/types.
- [ ] Dimension and identifier rules documented for validation.
- [ ] Deterministic ordering guidance included for serialization.
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Inputs: Existing hazard enums or decision on authoritative source; design guidance on purposes/features.
- Precedes: Blueprint Import/Export Service; Room Blueprint Editor UI; Validation Service.

## Open Questions / Clarifications
- Do we already have a `HazardType` enum, or must it be defined in coordination with world generation?
- Should purposes be freeform or constrained to a controlled list?
- How should feature lists be ordered for deterministic exports?
