# Task Specification — SDK Picker UX Patterns (Frontend)

**STATUS: ✅ COMPLETED (Structural fidelity achieved); charter alignment approved for Phase 2 sequencing**

## Task Summary
Create reusable picker components/patterns for enums and icon registries (goods, tech, hazards, culture tags) to ensure deterministic, discoverable selection UI that stays DRY across SDK tools.

## Purpose and Scope
- Provide Angular picker components that consume read-only adapters for enums/registries (GoodsType, HazardType, tech icons, culture tags) with deterministic ordering and keyboard accessibility.
- Include lightweight filtering/search, clear-empty states, and limited primary actions compliant with the UI charter.
- Offer guidance for embedding pickers in list/detail layouts without duplicating markup.

## Explicit Non-Goals
- No data mutation logic beyond emitting selected identifiers.
- No new art assets; pickers display provided icon/text only.
- No modal stacks >2 deep (charter constraint).

## Fidelity & Constraints
- **Structural fidelity**: components with fixtures; deterministic ordering; keyboard navigation.
- Must respect **UI & Ergonomics Charter** (discoverable, no hidden gestures, stable layout).
- Avoid local state truth; rely on injected adapters/services.

## Agent Assignments
- **Owner / Executor:** Frontend Developer.
- **Design Input:** Game Designer for icon/text pairings and label clarity.
- **QA:** QA & Test Engineer validates determinism, keyboard accessibility, and charter compliance.

## Deliverables
- Reusable picker components (single/multi-select) with icon+label support.
- Documentation/examples for integrating into goods manager, tech editor, hazard pickers, and culture tag selectors.
- Deterministic sorting rules and keyboard interaction guidelines.

## Review Gate
- [x] Pickers consume authoritative adapters (no duplicated enums/registries).
- [x] Ordering and keyboard navigation deterministic and documented.
- [x] UI charter rules upheld (≤8 primary actions visible, no hidden gestures).
- **Approvers:** Frontend Developer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Enum/registry adapters (e.g., HazardType, goods icon registry, tech icon taxonomy, culture tag canon).
- Precedes: UI skeleton tasks that need pickers (goods manager, tech editor, room tools).

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Should multi-select use chips or checklist by default at structural stage?
    answer: chips
- Minimum accessibility targets (focus ring, tab order) for current prototypes?
    answer: specify potential generic functionality like focus ring, tab order and generic actions in the form of TODO's, to be picked up later.
- Do pickers need inline validation messaging or defer to parent forms?
    answer: inline validation if practical, otherwise deferring to parent forms is sufficient.
