# Task Specification — Tech Tree Data Model Definition

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Define deterministic, culture-aware TypeScript interfaces for `TechNode` and `TechTree`, anchoring them to existing shared enums/types so technology effects, prerequisites and tags reference authoritative domain definitions without duplicating truth.

## Purpose and Scope
- Establish core data shapes for technologies, prerequisites, culture tags and metadata used by the tech editor and ledger hooks.
- Provide extension points for culture-specific branches while keeping deterministic serialization and validation boundaries clear.
- Document schema assumptions for import/export and ledger events.
- Reuse existing enums/models from `v1/src/app/enums` (e.g., `StructureType`, `GoodsType`, `StructureEffect`, `SettlementType`, `GuildType`) and shared rarity/category definitions in `v1/src/app/models/goods.model.ts` to avoid duplicate identifiers.

## Explicit Non-Goals
- No editor UI implementation or wiring to routes.
- No research progression mechanics, timers or cost formulas.
- No persistence adapters beyond typed interfaces and schema notes.

## Fidelity & Constraints
- **Structural fidelity**: minimal working interfaces with placeholder defaults where necessary; deterministic ordering rules documented.
- Must align with the **UI & Ergonomics Charter** by keeping UI passive (data shapes only) and respecting **Level of Detail & Abstraction** (favor deletable, explicit shapes).
- Avoid over-generalized graph abstractions; stick to tree/acyclic dependency rules required by the epic.

## Agent Assignments
- **Owner / Executor:** Backend Engineer (in consultation with Architecture Steward).
- **Design Input:** Game Designer supplies sample cultures/branches and naming conventions.
- **QA:** QA & Test Engineer validates determinism and schema completeness.

## Deliverables
- TypeScript interfaces/types for `TechNode`, `TechTree`, prerequisite links, culture tags and node metadata.
- Documentation notes on deterministic ordering and allowed identifier patterns.
- Mapping guide showing how shared enums/types are referenced (no duplication).
- Acceptance checklist for downstream import/export and UI consumers.

## Review Gate
- [ ] Interfaces reference existing enums/types instead of redefining them.
- [ ] Dependency model enforces acyclicity at the type/validation level.
- [ ] Deterministic ordering/documentation present for serialization.
- **Approvers:** Backend Engineer + Architecture Steward (with Game Designer consultation).

## Dependencies & Sequencing
- Precedes: Tech Tree Import/Export Service; Tech Tree Editor UI Skeleton; Ledger Event Wiring.
- Requires: Game Designer sample tech tree snippets and culture tag vocabulary.

## Open Questions / Clarifications
- Which shared enums must be supported in v1 (buildings, goods, civics)? 
    answer: located in v1/src/app/enums are: DiplomaticRelation, EstateType, EventType, FloraUseType, GoodsType, GuildType, MarketCondition, StructureAction, StructureEffect and StructureType
- Should nodes support multiple culture tags or a single primary tag?
    answer: multiple tags 
- How strict should identifier normalization be (e.g., kebab-case, snake_case)?
    answer: snake_case
