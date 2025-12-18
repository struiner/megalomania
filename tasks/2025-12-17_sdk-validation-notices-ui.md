# Task Specification — SDK Validation Notices UI (Frontend)

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Deliver a shared, unobtrusive validation/notification pattern for SDK tools (goods, tech, rooms) so deterministic validation results are surfaced consistently without cluttering the HUD center.

## Purpose and Scope
- Provide reusable components for inline validation summaries and per-field notices, consuming validation outputs from import/export and validation services.
- Support severity levels (info/warn/error) with charter-aligned styling and limited animation.
- Ensure placement respects attention hierarchy (secondary/peripheral zones) and keeps center uncluttered.

## Explicit Non-Goals
- No business logic for validation; only rendering of provided results.
- No toast/auto-dismiss animations that compete with world view.
- No modal stacking beyond charter limits.

## Fidelity & Constraints
- **Structural fidelity**: components with fixtures; deterministic rendering order.
- Respect **UI & Ergonomics Charter** (no center clutter, stable positions, limited primary actions).
- Keep UI passive; inputs are rendered results from services.

## Agent Assignments
- **Owner / Executor:** Frontend Developer.
- **Design Input:** Game Designer for tone, iconography, and readability.
- **QA:** QA & Test Engineer validates deterministic ordering and accessibility.

## Deliverables
- Shared validation notice components (summary bar/panel + per-field indicators).
- Styling tokens for severity levels matching retro/Hanseatic aesthetic.
- Integration examples for goods manager, tech editor, room blueprint editor, and import/export flows.
- Guidelines for placement to respect attention hierarchy.

## Review Gate
- [ ] Notices render deterministically and consume external validation results.
- [ ] Styling/placement complies with UI charter (no center obstruction, stable layout).
- [ ] Severity/iconography documented for consistent usage.
- **Approvers:** Frontend Developer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Validation outputs from goods/tech/room services (structural fixtures acceptable).
- Precedes: UI skeleton tasks wanting consistent validation display.

## Open Questions / Clarifications
- Should summaries be collapsible or always visible at structural stage?
- Do we need per-row badges in lists, or only detail-level indicators?
- Minimum accessibility needs (ARIA roles, color contrast) for warnings/errors?

