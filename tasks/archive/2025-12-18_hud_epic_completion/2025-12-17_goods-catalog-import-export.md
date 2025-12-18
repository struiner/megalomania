# Task Specification — Goods Catalogue Import/Export Service

**STATUS: COMPLETED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

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
- [x] Invalid entries are rejected with actionable errors.
- [x] Exported JSON is deterministic for identical input.
- [x] Version/migration hooks exist and are documented.
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Implementation Details

### Completed Deliverables
- ✅ **Service Implementation**: `GoodsCatalogIoService` with comprehensive import/export functionality
- ✅ **Validation Rules**: Complete validation against GoodsType, FloraType enums and numeric bounds
- ✅ **Error Taxonomy**: Structured error format with actionable messages and context
- ✅ **Migration Hooks**: Version migration system with documented extension patterns
- ✅ **Sample Fixtures**: Valid/invalid test data for comprehensive testing
- ✅ **Unit Tests**: Complete test coverage including round-trip validation
- ✅ **Documentation**: Comprehensive usage guide and API reference

### Key Features Implemented
- **Deterministic Ordering**: Goods are sorted by type then name for reproducible exports
- **Comprehensive Validation**: All required fields, enum values, and numeric bounds validated
- **Structured Error Reporting**: Machine-readable error codes with human-readable messages
- **Migration Support**: Extensible version migration system for schema evolution
- **Localization Ready**: Unicode support and locale-aware number formatting
- **Performance Optimized**: Early exit on critical errors, memory-efficient processing

### Files Created
1. `v1/src/app/services/goods-catalog-io.service.ts` - Core service implementation
2. `v1/src/app/services/goods-catalog-io.service.spec.ts` - Comprehensive unit tests
3. `v1/src/app/data/goods/goods-catalog-fixtures.ts` - Test data and fixtures
4. `v1/src/app/services/goods-catalog-io.service.md` - Complete documentation

### Testing Coverage
- ✅ Valid import/export scenarios
- ✅ Error handling and validation edge cases
- ✅ Round-trip data integrity
- ✅ Unicode and localization support
- ✅ Performance with large datasets
- ✅ Migration system functionality

### Validation Rules Implemented
- **Required Fields**: type, name, category, description, rarity, complexity, basePrice
- **Numeric Bounds**: rarity (1-5), complexity (1-5), basePrice (>=0)
- **Enum Validation**: GoodsType, FloraType, GoodCategory, Rarity, UnitType
- **Array Constraints**: tags (max 20), floraSources (valid enums), components (structured validation)
- **String Lengths**: name (1-100), description (1-500), tags (max 50 each)

### Error Codes Provided
- MISSING_FIELD, INVALID_ENUM_VALUE, INVALID_NUMBER, OUT_OF_BOUNDS
- TOO_SHORT, TOO_LONG, INVALID_ARRAY_ITEM_TYPE, INVALID_FLORA_TYPE
- INVALID_COMPONENT_TYPE, INVALID_COMPONENT_AMOUNT, PARSE_ERROR

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration.
- Precedes: Goods Manager UI Skeleton wiring and Derived Data & Stats computation.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- ✅ **Price/Complexity Validation**: Implemented strict validation for calculated properties, complexity can be clamped
- ✅ **Error Format**: Implemented structured object format with array of structured error objects
- ✅ **Localization**: Added unicode support and locale-aware formatting for international use

### Implementation Decisions Made
1. **Validation Strategy**: Strict validation with detailed error reporting to ensure data quality
2. **Error Format**: Structured object format allowing for rich context and machine processing
3. **Migration Approach**: Version-based migration system with extensible hook pattern
4. **Performance**: Sequential processing with early exit for efficient large dataset handling
5. **Compatibility**: Maintains backward compatibility while supporting future schema evolution
