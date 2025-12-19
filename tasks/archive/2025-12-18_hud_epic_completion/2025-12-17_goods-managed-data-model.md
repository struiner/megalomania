# Task Specification — Managed Good Data Model & Enum Integration

**STATUS: COMPLETED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Define a `ManagedGood` data model that composes existing goods, flora and category enums with fields for tier, rarity, complexity, base price and tags, ensuring deterministic identifiers and avoiding duplication of authoritative definitions.

## Purpose and Scope
- Create TypeScript interfaces/types for managed goods that link to `GoodsType`, category and flora enums.
- Capture derived-friendly fields (tier, rarity, complexity, base price) and freeform tags with validation hints.
- Document ownership boundaries and allowed metadata for SDK tooling.
- Prefer reusing shared enums/models defined in `v1/src/app/models/goods.model.ts` (e.g., `GoodCategory`, `Rarity`, `UnitType`, `StorageType`, `AspectType`) and `v1/src/app/enums/FloraType.ts` rather than duplicating identifiers.

## Explicit Non-Goals
- No economic simulation logic, pricing algorithms or balancing.
- No UI implementation or list filtering.
- No persistence adapters beyond typed shapes and documentation.

## Fidelity & Constraints
- **Structural fidelity**: lean interfaces with deterministic identifier rules; deletable scaffolding per **Level of Detail & Abstraction**.
- Respect **UI & Ergonomics Charter** by keeping UI passive—this task is data only.
- Avoid redefining enums; consume authoritative sources.

## Agent Assignments
- **Owner / Executor:** SDK & Modding Engineer.
- **Design Input:** Economy Engineer / Game Designer for category/tier semantics.
- **QA:** QA & Test Engineer validates enum linkage and determinism.

## Deliverables
- Interfaces/types for `ManagedGood` with references to shared enums.
- Documentation for identifier normalization and allowed tag formats.
- Mapping notes for how derived stats will consume these fields.
- Sample data fixtures for downstream UI/service testing.

## Review Gate
- [x] All enum references are authoritative (no duplication).
- [x] Identifier normalization and deterministic ordering rules documented.
- [x] Fields cover tier, rarity, complexity, base price and tags with validation notes.
- [x] **IMPLEMENTATION COMPLETED** - See `v1/src/app/models/managed-goods.model.ts`
- [x] Sample fixtures created with validation utilities
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Inputs: Existing goods/flora/category enums; design guidance on tier/rarity semantics.
- Precedes: Goods Catalogue Import/Export Service; Goods Manager UI Skeleton; Derived Data & Stats.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Implementation Summary
**File Created:** `v1/src/app/models/managed-goods.model.ts`

**Key Components Delivered:**
- `ManagedGood` interface composes `GoodsType`, `GoodCategory`, `FloraType` enums
- Added `GoodTier`, `ComplexityLevel` enums for derived categorization
- `CulturalArchetype` enum for generic cultural context (addresses open question 3)
- Deterministic identifier format: `{goodsType}_{category}_{tier}_{rarity}_{complexity}`
- Freeform tag system with validation constraints (addresses open question 1)
- Multiple flora source support with `primaryFloraSource` and `secondaryFloraSources` (addresses open question 2)
- Sample fixtures: Basic Lumber, Refined Iron, Exotic Spices, Aetherium Crystal
- `ManagedGoodUtils` class with validation and utility functions

**Validation Features:**
- ID format validation ensuring deterministic, unique, stable identifiers
- Tag constraint validation (max 10 tags, 50 chars each, alphanumeric + _- spaces)
- Flora source validation by category
- Utility functions for filtering by category and tier

**Dependencies Satisfied:**
- Uses authoritative enums from `GoodsType.ts`, `FloraType.ts`, `goods.model.ts`
- No duplication of existing definitions
- Ready for Goods Catalogue Import/Export Service integration
- Supports Goods Manager UI Skeleton requirements
- Provides data foundation for Derived Data & Stats
