# Task Specification — SDK UI Consistency Framework (Frontend)

**STATUS: NOT STARTED (Structural fidelity); charter alignment approved for Phase 2 sequencing**

## Task Summary
Define a minimal, reusable SDK UI shell and component patterns (panels, toolbars, action rows) so goods/tech/room tools share consistent ergonomics that honor the UI charter without duplicating layout logic.

## Purpose and Scope
- Establish shell layout primitives (header, left list, right detail, footer/action bar) with stable placement and ≤8 primary actions.
- Provide shared SCSS tokens/classes for spacing, typography, and pixel-aligned grid consistent with the retro/Hanseatic aesthetic.
- Supply Angular utility components/directives for panel framing and action grouping, to be consumed by goods manager, tech editor, and room tools.

## Explicit Non-Goals
- No visual polish beyond structural styles and spacing tokens.
- No new routing or navigation flows.
- No data/business logic changes.

## Fidelity & Constraints
- **Structural fidelity**: layout scaffolding + shared styles/directives; fixtures acceptable.
- Must respect **UI & Ergonomics Charter** (center clear, bottom stable, limited primary actions, symmetry bias).
- Keep UI passive; components render provided data and emit events only.

## Agent Assignments
- **Owner / Executor:** Frontend Developer.
- **Design Input:** Game Designer for aesthetic alignment.
- **QA:** QA & Test Engineer validates layout stability and charter compliance.

## Deliverables
- Shared SDK shell component/layout primitives and SCSS tokens.
- Usage guide/examples for goods manager, tech editor, and room tools.
- Checklist for charter compliance (attention hierarchy, pixel alignment).

## Review Gate
- [x] Shared primitives reduce duplication across SDK tools.
- [x] Layout obeys charter constraints (stable bottom, ≤8 primary actions, uncluttered center).
- [x] Pixel alignment and spacing tokens documented.
- **Approvers:** Frontend Developer + Architecture Steward.

## Dependencies & Sequencing
- Can run in parallel with existing SDK tool tasks; integrate before UI skeletons exit structural stage.
- Informed by existing SDK pages/components under `v1/src/app/components/sdk`.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Do SDK tools need tabbed shells or single-pane defaults at structural stage?
    answer: tabbed shells please
- Should action bars live bottom-only or be mirrored on the side for large screens?
    answer: bottom only for now
- Minimal breakpoint support required for current prototypes?
    answer: no

