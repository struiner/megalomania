# Task Specification — Hazard Icon Kit & Picker (SDK Rooms)

**STATUS: NOT STARTED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Create a consistent hazard icon set and picker wiring for room/structure tools, grounded in the authoritative `HazardType` enum, to make hazards visually identifiable without duplicating identifiers.

## Purpose and Scope
- Define icon slots/naming for each `HazardType` (to be introduced via the hazard enum alignment task) with deterministic ordering.
- Provide a shared picker component/service for SDK room tools (room creator/editor, validation UI) that consumes the enum and registry.
- Document style/contrast rules so icons remain legible in retro/Hanseatic UI surfaces.

## Explicit Non-Goals
- No new hazard mechanics, damage models, or world placement logic.
- No art asset production; focus on registry/picker scaffolding and guidance.
- No ledger changes (covered elsewhere).

## Fidelity & Constraints
- **Structural fidelity**: registry schema + picker wiring with fixtures; no runtime effects.
- Respect **UI & Ergonomics Charter** (stable, uncluttered pickers; ≤8 primary actions) and **Level of Detail & Abstraction** (explicit, deletable scaffolding).
- Use authoritative enums only (`HazardType` once added); no string literals.

## Agent Assignments
- **Owner / Executor:** Game Designer (icon language) with SDK & Modding Engineer (picker/registry implementation).
- **QA:** QA & Test Engineer validates deterministic ordering and enum alignment.

## Deliverables
- Hazard icon registry keyed by `HazardType` with naming/resolution guidance.
- Shared picker component/service for SDK room tools.
- Documentation on style constraints, contrast, and grid alignment for hazards.
- Validation notes for detecting missing/duplicate icons.

## Review Gate
- [x] Registry keys map directly to `HazardType`.
- [x] Picker ordering deterministic and UI charter compliant.
- [x] Style guidance documented for downstream art tasks.
- **Approvers:** Game Designer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: HazardType Enum & SDK Alignment task.
- Precedes: Any art intake tasks for hazard icons and room blueprint UI visual polish.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Should hazards have severity overlays or color-coded badges at structural stage?
    answer: color-coded badges and severity overlays.
- Are biome/culture-specific hazard variants required later?
    answer: yes
- Do validation warnings block exports when icons are missing?
    answer: no, use a placeholder
