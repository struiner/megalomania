# Task Specification — Tech Tree Editor UI Skeleton

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Build a structural Angular UI skeleton for the technology tree editor with panels for tree overview, node detail and prerequisite connections, wired to placeholder data and import/export hooks while respecting HUD ergonomics.

## Purpose and Scope
- Layout the editor shell, navigation, and core panels (overview list/map, node detail form, prerequisite viewer).
- Wire in placeholder data sources and service contracts for import/export without implementing research logic.
- Provide pickers and inputs bound to shared enums/types (via integration task) in a discoverable, uncluttered layout.

## Explicit Non-Goals
- No visual polish beyond basic structural styling.
- No research progression, timers or ledger emissions.
- No custom graph drawing beyond minimal connection visualization needed for structure validation.

## Fidelity & Constraints
- **Structural fidelity**: static data/fixtures acceptable; focus on ergonomics and layout stability per **UI & Ergonomics Charter** (respect attention hierarchy, bottom-weighted stability, limit primary actions).
- Must keep UI as an instrument: display/edit only; no ownership of authoritative truth.
- Avoid over-engineered graph editors; prioritize readability and determinism.

## Agent Assignments
- **Owner / Executor:** Frontend Developer / Toolsmith.
- **Design Input:** Game Designer for panel content and sample node metadata.
- **QA:** QA & Test Engineer validates layout stability and basic interactions with fixtures.

## Deliverables
- Angular component(s) for tech editor shell with routed access or SDK surface integration.
- Panels for tree list/overview, node detail, and prerequisite/connection display with placeholder data.
- Hook points for import/export service and shared enum/type integration.
- Interaction notes documenting intended flows and future extension points.

## Review Gate
- [ ] Layout respects attention hierarchy and UI charter constraints (limited primary actions, stable placement).
- [ ] Components consume data via injected services/contracts (no hardcoded truth in UI).
- [ ] Placeholder data can be swapped for real import/export service outputs without refactor.
- **Approvers:** Frontend Developer + Architecture Steward (Game Designer consults).

## Dependencies & Sequencing
- Depends on: Tech Tree Data Model Definition; Shared Enum & Type Integration (for pickers).
- Can parallelize with: Import/Export Service once interfaces are stable.
- Precedes: Ledger Event Wiring (UI triggers).

## Open Questions / Clarifications
- Should prerequisite visualization use simple lists or minimal tree diagram at structural stage?
- Which SDK surface or route hosts the editor initially?
- What is the minimal set of node fields required for the detail panel during structural fidelity?

