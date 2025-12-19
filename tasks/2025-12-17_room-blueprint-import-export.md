# Task Specification — Room Blueprint Import/Export Service

**STATUS: ✅ COMPLETED (Structural fidelity achieved); ready for Phase 2 execution**

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

## ✅ COMPLETION SUMMARY

**Date Completed:** 2025-12-19  
**Implementation Status:** ✅ FULLY COMPLETED

### Key Accomplishments:

1. **Room Blueprint Import/Export Service**: Complete implementation in `v1/src/app/services/room-blueprint-import-export.service.ts`
   - `importRoomBlueprint()`: Single blueprint import with validation and normalization
   - `exportRoomBlueprint()`: Single blueprint export with deterministic ordering
   - `importRoomBlueprints()`: Batch import from JSON array
   - `exportRoomBlueprints()`: Batch export to JSON array
   - `migrateBlueprintIfNeeded()`: Version migration support with hooks

2. **Comprehensive Validation Framework**: 
   - Integration with existing `RoomBlueprintValidationService`
   - Structured validation summary with error/warning categorization
   - Detailed error messages with field-level specificity
   - Support for both required field validation and business rule enforcement

3. **Deterministic Ordering System**:
   - Hazards: Alphabetical sorting with optional deduplication
   - Sockets: Position-based ordering (y, x) then type then ID
   - Costs: Resource ID then phase sorting
   - Constraints: Type then constraint ID ordering
   - Tags: Lower_snake_case normalization with lexicographic sorting
   - **Features**: Preserved author/UI order exactly (no auto-reordering)

4. **Sample JSON Fixtures**: Complete test suite in `v1/src/app/services/room-blueprint-import-export-fixtures.ts`
   - 4 valid blueprints including basic, advanced, crew quarters, and minimal examples
   - 7 invalid blueprints testing missing fields, invalid dimensions, bad hazards, etc.
   - Edge cases for maximum/minimum dimensions, complex sockets, large cost arrays
   - Batch import/export test data
   - Utility functions for fixture management

5. **Comprehensive Unit Tests**: Full test coverage in `v1/src/app/services/room-blueprint-import-export.service.spec.ts`
   - Valid blueprint import/export scenarios
   - Invalid blueprint rejection with proper error handling
   - Hazard normalization options testing
   - Batch operations validation
   - Deterministic ordering verification
   - Migration hook testing
   - Error handling and edge cases
   - Integration with existing validation service

6. **Complete Documentation**: Detailed usage guide in `v1/src/app/docs/room-blueprint-import-export-service-documentation.md`
   - API reference with parameters and return types
   - Code examples for common use cases
   - Validation rules and error handling patterns
   - Integration examples with Angular components and REST APIs
   - Best practices and recommendations
   - Sample JSON blueprints

### Review Gates Status:
- ✅ Invalid blueprints are rejected with actionable errors
- ✅ Exported JSON is deterministic given identical input  
- ✅ Version/migration hooks exist and are documented

### Dependencies Satisfied:
- ✅ Room Blueprint Data Model integration completed
- ✅ Hazard enum alignment implemented
- ✅ Shared enums (StructureType, GoodsType) properly validated
- ✅ Integration with existing validation services

### Key Features Implemented:

#### Import Functionality
- JSON parsing with error handling
- Blueprint normalization and validation
- Hazard deduplication options (per user preference)
- Structured error reporting with field-level specificity
- Batch import support with individual result tracking

#### Export Functionality  
- Deterministic JSON serialization with consistent formatting
- Pre-export validation with comprehensive error reporting
- Deterministic ordering for reproducible exports
- Batch export capability
- Pretty-printed JSON output

#### Migration Support
- Version detection and migration scaffolding
- Future-proof migration hook framework
- Applied migration tracking
- Backward compatibility handling

#### Error Handling
- Structured validation summaries with issues categorized by path
- Actionable error messages with suggestions
- Warning vs. error severity classification
- Exception handling with typed validation errors

### Ready for Phase 2:
The import/export service is complete and ready for:
- Room Blueprint Editor UI integration
- SDK consumer adoption
- Ledger event wiring
- Production deployment

### Files Created/Modified:
- `v1/src/app/services/room-blueprint-import-export.service.ts` (NEW)
- `v1/src/app/services/room-blueprint-import-export-fixtures.ts` (NEW)  
- `v1/src/app/services/room-blueprint-import-export.service.spec.ts` (NEW)
- `v1/src/app/docs/room-blueprint-import-export-service-documentation.md` (NEW)
- `v1/src/app/models/room-blueprint.models.ts` (MODIFIED - exports added)
