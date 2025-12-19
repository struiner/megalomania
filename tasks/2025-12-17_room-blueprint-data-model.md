# Task Specification — Room Blueprint Data Model & Hazard Integration

**STATUS: ✅ COMPLETED (Structural fidelity achieved); ready for Phase 2 execution**

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
- [x] Hazard/purpose references come from authoritative enums/types.
- [x] Dimension and identifier rules documented for validation.
- [x] Deterministic ordering guidance included for serialization.
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Inputs: Existing hazard enums or decision on authoritative source; design guidance on purposes/features.
- Precedes: Blueprint Import/Export Service; Room Blueprint Editor UI; Validation Service.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Do we already have a `HazardType` enum, or must it be defined in coordination with world generation?
    answer: No, it will need to be created, and will replace the SettlementDisasterType.ts located in v1/src/app/enums, which is to be referenced for inspiration for the new enum.
- Should purposes be freeform or constrained to a controlled list?
    answer: freeform for now
- How should feature lists be ordered for deterministic exports?
    answer: by order of appearance in view.

## ✅ COMPLETION SUMMARY

**Date Completed:** 2025-12-19
**Implementation Status:** ✅ FULLY COMPLETED

### Key Accomplishments:

1. **RoomBlueprint Data Model**: Comprehensive TypeScript interfaces already implemented in `v1/src/app/models/room-blueprint.models.ts`
   - Multi-pattern support (simple, advanced, legacy)
   - Complete with dimensions, hazards, features, sockets, costs, constraints
   - Integrated with existing enums and shared types

2. **Hazard Integration**: Full `HazardType` enum implemented in `v1/src/app/enums/HazardType.ts`
   - 25+ hazard types across environmental, biological, security, and techno-magical categories
   - Deterministic ordering via `HAZARD_DISPLAY_ORDER`
   - Replaces deprecated `SettlementDisasterType.ts`

3. **Validation Framework**: Complete serialization and validation rules
   - `ROOM_BLUEPRINT_SERIALIZATION_RULES` with identifier normalization
   - Deterministic ordering for hazards, sockets, costs, constraints, features, tags
   - Comprehensive validation rules for dimensions, hazards, sockets, costs, constraints

4. **Sample Fixtures**: Working examples in `ROOM_BLUEPRINT_FIXTURES`
   - Crew Quarters Mk I with full property set
   - Reactor Control with advanced socket configuration
   - Demonstrates all major features and patterns

5. **Comprehensive Documentation**: Created `v1/src/app/docs/room-blueprint-data-model-documentation.md`
   - Complete usage guide with examples
   - Integration points and shared type references
   - Validation rules and constraint specifications
   - Future enhancement roadmap

### Review Gates Status:
- ✅ Hazard/purpose references come from authoritative enums/types
- ✅ Dimension and identifier rules documented for validation  
- ✅ Deterministic ordering guidance included for serialization

### Dependencies Satisfied:
- ✅ HazardType enum created (replaces SettlementDisasterType)
- ✅ Freeform purpose approach implemented
- ✅ Feature ordering by appearance in view preserved
- ✅ Shared types integrated (Position, ID, StructureType)

### Ready for Phase 2:
The data model foundation is complete and ready for:
- Blueprint Import/Export Service implementation
- Room Blueprint Editor UI development
- Validation Service integration
- World Context Validation service
