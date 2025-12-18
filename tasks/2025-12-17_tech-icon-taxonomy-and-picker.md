# Task Specification — Tech Icon Taxonomy & Picker (SDK)

**STATUS: NOT STARTED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Define a reusable icon taxonomy for technology nodes and deliver an SDK picker/registry that reuses existing enums/models to keep tech visuals consistent and discoverable without duplicating identifiers.

## Purpose and Scope
- Establish icon categories/tags for tech nodes (e.g., building, civic, economy, military) mapped to existing enums/types (`StructureType`, `GoodsType`, `GuildType`, `SettlementType`) to stay DRY.
- Provide an SDK picker component for the tech editor that selects icons from the registry with deterministic ordering and preview.
- Document visual style constraints (retro/Hanseatic) so art tasks can follow a shared language.

## Explicit Non-Goals
- No art asset creation in this task; focus on taxonomy + picker wiring.
- No tech gameplay logic or research progression changes.
- No custom graph rendering beyond icon selection.

## Fidelity & Constraints
- **Structural fidelity**: registry schema, picker UI with fixtures, deterministic ordering.
- Must respect **UI & Ergonomics Charter** (stable layout, limited primary actions) and **Level of Detail & Abstraction** (deletable scaffolding).
- Icons must reference authoritative enums/models (avoid ad-hoc strings).

## Agent Assignments
- **Owner / Executor:** Game Designer (icon taxonomy) with Frontend Developer / SDK Toolsmith (picker UI) and Architecture Steward oversight.
- **QA:** QA & Test Engineer validates deterministic ordering and enum alignment.

## Deliverables
- Icon taxonomy/registry spec tied to tech-related enums/types.
- Picker component for the tech editor that consumes the registry via service/adapters.
- Documentation on style constraints and naming conventions for tech icons.
- Validation notes ensuring selections map back to enum identifiers (no drift).

## Review Gate
- [x] Registry keys/refs come from authoritative enums/types (no duplicates).
- [x] Picker ordering is deterministic and respects UI charter ergonomics.
- [x] Style guidance documented for downstream art tasks.
- **Approvers:** Game Designer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Tech Tree Data Model Definition; Shared Enum & Type Integration.
- Precedes: Any art intake/production tasks for tech icons.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Should icons be per-culture or shared with overlays? If overlays, how to layer deterministically?
    answer: shared with overlays, through a shared exchanged asset
- Do nodes without domain hooks (pure research) get a generic icon family?
    answer: yes.
- How to handle future DLC/expansion icon sets without breaking determinism?
    answer: by using a default frame or border for the icons, which can be varied for emphasis

