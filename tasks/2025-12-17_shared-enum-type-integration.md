# Task Specification — Shared Enum & Type Integration for Tech Editor

**STATUS: NOT STARTED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Integrate the technology editor with existing shared enums/types (e.g., buildings, goods, civics, effects) to provide authoritative pickers and validation without redefining domain truths.

## Purpose and Scope
- Discover and expose relevant shared enums/types to the tech editor through read-only services or adapters.
- Provide picker/dropdown data sources for node effects, prerequisites and culture tags.
- Document ownership boundaries and ensure the editor defers to source domains for valid identifiers.
- Primary sources include `v1/src/app/enums` (`StructureType`, `StructureEffect`, `GoodsType`, `SettlementType`, `GuildType`, `FloraType`, `MapStructureType`, `EventType`) and reusable rarity/category definitions in `v1/src/app/models/goods.model.ts`.

## Explicit Non-Goals
- No creation of new enums or domain definitions.
- No persistence or mutation of shared enums from the editor.
- No coupling to economy/research logic beyond identifier selection.

## Fidelity & Constraints
- **Structural fidelity**: lightweight adapters acceptable; prioritize clarity and deletability per **Level of Detail & Abstraction**.
- UI must remain passive per **UI & Ergonomics Charter**: pickers surface options but do not own truth.
- Deterministic ordering of options for reproducible editor behavior.

## Agent Assignments
- **Owner / Executor:** SDK & Modding Engineer (with Architecture Steward oversight).
- **Design Input:** Game Designer specifies required enum coverage and naming exposure.
- **QA:** QA & Test Engineer validates option completeness and deterministic ordering.

## Deliverables
- Service/adapters exposing shared enum/type data for the tech editor (read-only).
- Documentation of enum sources, refresh cadence, and ownership boundaries.
- Deterministic sorting/labeling rules for pickers.
- Test fixtures or mocks to support editor skeleton development.

## Review Gate
- [x] Pickers source data from authoritative enums/types without duplication.
- [x] Deterministic ordering and labeling rules documented and enforced.
- [x] Ownership boundaries documented (no mutation paths).
- **Approvers:** SDK & Modding Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Tech Tree Data Model Definition (to know which enums are needed).
- Precedes: Tech Tree Editor UI Skeleton wiring of pickers.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Which enum namespaces are mandatory for v1 (effects, buildings, goods, civics)?
    answer: located in v1/src/app/enums are: DiplomaticRelation, EstateType, EventType, FloraUseType, GoodsType, GuildType, MarketCondition, StructureAction, StructureEffect and StructureType
- Should culture tags be sourced from existing data or defined alongside tech metadata?
    answer: defined alongside tech metadata for now
- How to handle missing enum values in imported tech trees (fallback vs. validation error)?
    answer: fallback
