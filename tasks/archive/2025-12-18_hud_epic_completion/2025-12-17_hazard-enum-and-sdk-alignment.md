# Task Specification — HazardType Enum & SDK Alignment

**STATUS: COMPLETED - All deliverables implemented and tested**

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

## Completion Summary
**COMPLETED: 2025-12-19**

### ✅ Completed Deliverables:
1. **HazardType Enum**: Comprehensive enum already existed with 25+ hazard types and deterministic ordering via `HAZARD_DISPLAY_ORDER`
2. **Adapter Services**: Two adapter services implemented:
   - `HazardTypeAdapterService`: Provides hazard options with categories and tags
   - `HazardEnumAdapterService`: Provides normalization and compatibility features
3. **SDK Refactor**: Room creator component already refactored to use HazardType enum exclusively
4. **Test Fixture Updates**: Updated validation service tests to use HazardType enum instead of hardcoded strings
5. **Sample Fixtures**: Created comprehensive test fixtures in `v1/src/app/fixtures/hazard-test-fixtures.ts` including:
   - HazardTestFixture arrays for different room types and hazard categories
   - Sample room blueprints using HazardType enum
   - Validation test cases for enum alignment
   - Adapter service test data

### 🔧 Technical Implementation:
- **Enum Structure**: HazardType enum with categorized hazards (environmental, structural, biological, security)
- **Deterministic Ordering**: HAZARD_DISPLAY_ORDER ensures consistent UI display
- **Adapter Pattern**: Read-only services expose hazard data to UI components
- **Backward Compatibility**: Enum values map to string representations for validation
- **Type Safety**: Full TypeScript type safety throughout the hazard system

### 📋 Ownership Boundaries:
- **Enum is Authoritative**: HazardType enum is the single source of truth
- **UI is Consumer**: Components use adapters to read hazard data
- **Validation Aligned**: Validation services work with enum values and string representations
- **No Hardcoded Strings**: All hardcoded hazard strings eliminated from SDK components

## Review Gate
- [x] Hazard options sourced from the new enum across SDK room tools (no hardcoded strings).
- [x] Deterministic ordering documented and enforced for pickers.
- [x] Ownership boundaries documented (enum is authoritative; UI is consumer).
- [x] Sample fixtures created for validation and testing.
- [x] Adapter services implemented and tested.
- **COMPLETED**: 2025-12-19 by SDK & Modding Engineer
- **Approvers:** SDK & Modding Engineer + Architecture Steward (World Generator consults).

## Dependencies & Sequencing
- Precedes: Room Blueprint Data Model, Import/Export, Editor UI, Validation Service (hazard pickers/validators).
- Can run in parallel with: Tech/Goods epics (independent).

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Should hazards include severity categories or remain simple identifiers at structural stage?
    answer: simple identifiers will suffice for now, provided a TODO is included.
- Do hazards need culture/biome tags now or later?
    answer: yes.
- How to align with any existing hazard scoring fields in design data?
    answer: treat existing hazard scoring as placeholder data, to be scrutinized by the world builder and game designer agents for realism.

