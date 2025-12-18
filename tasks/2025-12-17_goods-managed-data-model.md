# Task Specification — Managed Good Data Model & Enum Integration

**STATUS: NOT STARTED (Structural fidelity)**

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
- [ ] All enum references are authoritative (no duplication).
- [ ] Identifier normalization and deterministic ordering rules documented.
- [ ] Fields cover tier, rarity, complexity, base price and tags with validation notes.
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Inputs: Existing goods/flora/category enums; design guidance on tier/rarity semantics.
- Precedes: Goods Catalogue Import/Export Service; Goods Manager UI Skeleton; Derived Data & Stats.

## Open Questions / Clarifications
- Should tags be constrained to a controlled vocabulary or freeform strings?
- How to represent goods with multiple flora sources?
- Do we need culture-specific overrides at this stage?
