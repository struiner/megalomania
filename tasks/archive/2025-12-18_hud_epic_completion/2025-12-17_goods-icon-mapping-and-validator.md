# Task Specification — Goods Icon Mapping & Validator (SDK)

**STATUS: COMPLETED ✅ (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Design a DRY, deterministic icon mapping and validation flow for goods, using `GoodsType` as the single source of truth and enabling SDK tooling to surface missing or incorrect icon assignments in a designer-friendly way.

## Purpose and Scope
- Create an icon registry that maps `GoodsType` to asset identifiers/paths (building on `v1/src/app/data/goods/icons.ts`) with deterministic naming.
- Provide a lightweight SDK surface (list + filters) to review, flag, and patch missing icons without duplicating `GoodsType`.
- Emit validation reports for gaps/duplicates so art tasks are easily discoverable.

## Explicit Non-Goals
- No new art asset creation; focus on registry and validation.
- No runtime sprite packing or rendering effects.
- No economic/gameplay logic changes.

## Fidelity & Constraints
- **Structural fidelity**: registry + validation + SDK review UI using fixtures is sufficient.
- Respect **UI & Ergonomics Charter** (limited primary actions, instrument-like tooling).
- Reuse authoritative enums/models (`v1/src/app/enums/GoodsType.ts`, `v1/src/app/models/goods.model.ts`); avoid duplicate identifiers.

## Agent Assignments
- **Owner / Executor:** Game Designer (for icon language and recognizability) collaborating with SDK & Modding Engineer for tooling.
- **QA:** QA & Test Engineer validates determinism and completeness checks.

## Deliverables
- Icon registry structure keyed by `GoodsType` with deterministic asset naming guidance.
- SDK review UI (structural) to list goods, show current/missing icons, and export gap reports.
- Validation script/service that flags missing/empty icon entries and duplicate asset references.
- Documentation on art style constraints (retro/Hanseatic) and naming conventions for assets.

## Review Gate
- [x] Registry references `GoodsType` without duplication.
- [x] Validation deterministically reports missing/duplicate icons.
- [x] SDK review UI respects UI charter (≤8 primary actions, stable layout).
- **Approvers:** Game Designer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Existing `GoodsType` enum and `goods.model` rarity/category info (for filtering).
- Precedes: Any art intake tasks that supply actual icon assets.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Preferred asset resolution(s) and naming suffixes (e.g., `@64-32`).
    answer: 64-32 is perfect, but names of 128 can occur.
- Should icons support per-era variants (using `Era` from `goods.model`) at structural stage?
    answer: yes, icon implementation can vary per era
- Are placeholders acceptable for export, or must gaps block export?
    answer: placeholders are acceptable if accompanied with a TODO specifying the task that needs to be completed to mitigate the placeholder for actual functionality.

