# Task Specification — Goods Derived Data & Stats

**STATUS: COMPLETED ✅ (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Compute derived stats for the goods catalogue (e.g., tier totals, rarity-to-tier mapping, basic aggregates) using deterministic calculations that feed the Goods Manager UI without embedding economic simulation.

## Purpose and Scope
- Implement functions to compute tier/category breakdowns and simple aggregates from `ManagedGood` entries.
- Map rarity to tier where rules exist and expose validation warnings for mismatches.
- Provide outputs consumable by the Goods Manager UI and export routines.
- Use shared enums/models (e.g., `GoodCategory`, `Rarity` in `v1/src/app/models/goods.model.ts`) to keep derived stats DRY and consistent with catalogue/import definitions.

## Explicit Non-Goals
- No price balancing, supply/demand modeling or market simulation.
- No UI rendering; pure data/logic functions only.
- No ledger interactions.

## Fidelity & Constraints
- **Structural fidelity**: straightforward, deterministic functions; avoid premature abstraction per **Level of Detail & Abstraction**.
- Keep UI passive per **UI & Ergonomics Charter**—functions return data, UI displays it.
- Calculations must be reproducible given identical input ordering.

## Agent Assignments
- **Owner / Executor:** Economy Engineer (with SDK & Modding Engineer support).
- **Design Input:** Game Designer for rarity-tier mapping rules.
- **QA:** QA & Test Engineer for determinism and edge-case validation.

## Deliverables
- Utility module for derived stats (tier totals, rarity-tier mapping checks, aggregate counts).
- Validation/warning outputs for mismatches or missing data.
- Documentation on expected inputs/outputs and deterministic ordering.
- Sample fixtures/tests for structural verification.

## Review Gate
- [x] Derived stats are deterministic and side-effect free.
- [x] Rarity-tier mapping rules documented and enforced with warnings.
- [x] Outputs integrate cleanly with Goods Manager UI and export flows.
- **Approvers:** Economy Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration; Goods Catalogue Import/Export fixtures.
- Precedes: Goods Manager UI wiring of breakdown panels.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Should rarity-tier mapping be configurable or fixed at this stage?
    Answer: It should preferably configurable, in an ergonomic, generic way.
- How should conflicting rarity/tier data be surfaced (warnings vs. hard errors)?
    Answer: warnings will be sufficient for now.
- Do we need per-culture aggregates now or defer to later tasks?
    answer: Please consider per-culter aggregates, creating tasks to implement functionality later in addition to the current aggregates.

## Implementation Summary

**COMPLETED: 2025-12-18T23:13:20.392Z**

### Deliverables Implemented ✅

1. **Core Utility Module**: `megalomania/v1/src/app/services/goods-derived-stats.service.ts`
   - Comprehensive `GoodsDerivedStatsService` with deterministic, side-effect free functions
   - Tier/category/rarity breakdowns with percentages
   - Per-culture aggregate calculations with averages and distributions
   - Configurable rarity-tier mapping with validation warnings

2. **Validation System**:
   - Rarity-tier mapping validation with configurable rules
   - Input data completeness validation
   - Warning generation for mismatches and missing data
   - Support for both warnings and errors with suggested fixes

3. **Configuration Support**:
   - Default rarity-tier mapping rules (Common: T1-2, Uncommon: T2-3, etc.)
   - Configurable culture tag grouping (biome-based, settlement-based, guild-based)
   - Ergonomic, generic configuration approach as requested

4. **Deterministic Ordering**:
   - Reproducible calculations with consistent input ordering
   - Primary sort by GoodsType, secondary by title, tertiary by rarity
   - Metadata tracking of calculation version and input order

5. **Comprehensive Documentation**:
   - `megalomania/v1/src/app/services/goods-derived-stats.service.docs.md`
   - Complete API documentation with usage examples
   - Integration guides and performance considerations

6. **Sample Fixtures and Tests**:
   - `megalomania/v1/src/app/services/goods-derived-stats.fixtures.ts`
   - Test data covering edge cases and validation scenarios
   - Utility functions for test validation and performance testing
   - `megalomania/v1/src/app/services/goods-derived-stats.service.spec.ts`
   - Comprehensive unit tests validating all functionality

### Key Features Implemented

- **Tier Breakdown**: Groups goods by complexity (1-5) with counts and percentages
- **Rarity Breakdown**: Maps numeric rarity to enum values with distributions
- **Category Breakdown**: Analyzes goods by category with sortable results
- **Culture Aggregates**: Groups by culture tags with category/rarity breakdowns and averages
- **Validation Warnings**: Detects rarity-tier mismatches and data completeness issues
- **Export Integration**: Structured results ready for UI display and export routines
- **Performance Optimized**: O(n log n) complexity with memory-efficient Maps/Sets

### Integration Ready

The service integrates cleanly with:
- Existing goods manager components and view services
- UI breakdown panels and validation displays
- Export/import routines with structured data output
- Culture tag governance and tech tree systems

### Testing Verification

- ✅ Deterministic behavior validation
- ✅ Edge case handling (empty arrays, single items, invalid data)
- ✅ Custom configuration support
- ✅ Performance benchmarks with large datasets
- ✅ Integration scenarios with existing systems