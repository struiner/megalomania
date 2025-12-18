# Task Specification — Goods Manager UI Skeleton

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Create a structural Angular UI skeleton for the Goods Manager SDK tool that lists goods, supports basic add/edit/remove flows with fixtures, and exposes filter/search and tier breakdown panels without implementing economic logic.

## Purpose and Scope
- Lay out the Goods Manager shell with list, detail form, and summary panels (category/tier breakdown).
- Bind to placeholder data and import/export hooks without persisting or simulating economics.
- Provide pickers sourced from shared enums via integration adapters (e.g., `GoodCategory`, `Rarity`, `UnitType` from `v1/src/app/models/goods.model.ts`; `FloraType` from `v1/src/app/enums/FloraType.ts`).

## Explicit Non-Goals
- No pricing/balancing logic or derived stat computations (handled separately).
- No ledger emissions or storage integration at this stage.
- No visual polish beyond structural alignment per ergonomics charter.

## Fidelity & Constraints
- **Structural fidelity**: fixtures acceptable; focus on stable layout and discoverable controls per **UI & Ergonomics Charter** (limited primary actions, instrument-like feel).
- UI remains passive; no authoritative truth or hidden gestures.
- Respect **Level of Detail & Abstraction**: deletable scaffolding, minimal complexity.

## Agent Assignments
- **Owner / Executor:** Frontend Developer / SDK Toolsmith.
- **Design Input:** Economy Engineer / Game Designer for required fields and grouping.
- **QA:** QA & Test Engineer for layout stability, deterministic ordering, and basic interaction sanity.

## Deliverables
- Angular component(s) for Goods Manager shell with list/detail/breakdown panels.
- Wiring to import/export service hooks and enum pickers.
- Interaction notes outlining add/edit/remove flows and filter/search behavior.
- Fixture data for demo/testing at structural stage.

## Review Gate
- [ ] Layout respects attention hierarchy and avoids clutter (≤8 primary actions).
- [ ] Components consume data via services/adapters (no hardcoded truth).
- [ ] Filters/search operate on fixtures deterministically.
- **Approvers:** Frontend Developer + Architecture Steward (Economy Engineer consults).

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration; Goods Catalogue Import/Export Service; Enum adapters.
- Can parallelize with: Derived Data & Stats once list structure is in place.

## Open Questions / Clarifications
- Minimum filter set for structural stage (category, tier, rarity?).
- Should tier breakdown be table, chips or simple counts?
- Which SDK route hosts this tool initially?
