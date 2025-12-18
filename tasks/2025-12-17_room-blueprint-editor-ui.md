# Task Specification — Room Blueprint Editor UI Skeleton

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Build a structural Angular UI skeleton for the Room Blueprint Creator with panels for blueprint list, detail form and metrics (area), wired to fixtures/import-export hooks and hazard pickers sourced from shared enums.

## Purpose and Scope
- Lay out the editor shell with blueprint selection, dimension inputs, purpose/hazard pickers and feature lists.
- Display basic metrics (area) derived from dimensions without advanced visualization.
- Bind to placeholder data/import-export service hooks; no procedural generation.
- Hazard pickers should source options from a shared `HazardType` enum (to replace hardcoded strings in `v1/src/app/components/sdk/room-creator/room-creator.component.ts`) to keep UI DRY.

## Explicit Non-Goals
- No 3-D rendering, pathfinding or placement previews.
- No ledger wiring or persistence beyond calling provided services.
- No visual polish beyond structural ergonomics.

## Fidelity & Constraints
- **Structural fidelity**: fixtures acceptable; prioritize stable layout and limited primary actions per **UI & Ergonomics Charter**.
- UI stays passive and references authoritative enums via adapters.
- Respect **Level of Detail & Abstraction**: keep scaffolding simple and deletable.

## Agent Assignments
- **Owner / Executor:** Frontend Developer / SDK Toolsmith.
- **Design Input:** World Generator / Game Designer for field ordering and hazard picker expectations.
- **QA:** QA & Test Engineer for layout stability and deterministic interactions on fixtures.

## Deliverables
- Angular component(s) for Room Blueprint Editor shell with list/detail/metrics panels.
- Wiring points for import/export service and hazard enum adapters.
- Interaction notes for add/edit/remove flows and metric display.
- Fixture data for demonstration at structural stage.

## Review Gate
- [ ] Layout respects attention hierarchy and stays uncluttered (≤8 primary actions).
- [ ] Components consume data via services/adapters; no hardcoded truth.
- [ ] Metrics are deterministic and side-effect free.
- **Approvers:** Frontend Developer + Architecture Steward (World Generator consults).

## Dependencies & Sequencing
- Depends on: Room Blueprint Data Model & Hazard Integration; Room Blueprint Import/Export Service; hazard enum adapters.
- Can parallelize with: Validation Service for structural checks.

## Open Questions / Clarifications
- Should hazards be multi-select chips, checkboxes or list with severity?
- Minimal feature list UI at structural stage (text inputs vs. structured items)?
- Which SDK route hosts the editor initially?
