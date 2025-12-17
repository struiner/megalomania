# Task Specification — HUD Overlay Tab Logic Alignment

**STATUS: COMPLETE — tab gating, toggle semantics, and placeholder dialogs wired.**

## Task Summary
Collaborate with the Game Designer to define tab logic and open/closed panel semantics for the HUD overlay shell, clarifying default selections, disabled states, and behavior for actions without panels before extending implementation.【F:v1/src/app/pages/hud/components/hud-overlay-shell.component.html†L1-L33】

## Purpose and Scope
- Specify interaction rules for overlay tabs (active state, deselection, keyboard traversal) consistent with the UI ergonomics charter.
- Decide how non-panel actions should manifest (e.g., trigger standalone dialogs or inline states) to avoid dead tabs.
- Capture design intent for labels, icons, and panel descriptions to keep peripheral attention lightweight.

## Explicit Non-Goals
- No addition of gameplay logic or data flows; focus is on UI semantics and routing behavior.
- No visual overhaul beyond what is needed to express states (active/disabled/hover).
- No expansion of overlay panel catalog beyond existing registry entries.

## Fidelity & Constraints
- Target **Structural fidelity** for logic definitions, with minimal code changes limited to routing/selection behavior.
- Preserve pixel-grid alignment and tab symmetry; avoid animations that compete with world view.
- Keep HUD overlay as a non-truth-owning shell; state should continue to flow from routing/inputs.

## Agent Assignments
- **Owner / Executor:** Project Manager (facilitation) + Frontend Developer (implementation)
- **Consulted:** Game Designer (intent), Architecture Steward (truth boundaries), QA (interaction regression)

## Deliverables
- Design-approved tab logic specification (states, defaults, non-panel handling) recorded in HUD docs.
- Updated overlay shell implementation reflecting agreed behaviors and accessibility semantics.
- Regression checklist covering tab selection, closing behavior, and fallback paths for actions without panels.

## Review Gate
- [ ] Tab behavior matches the documented design intent and remains charter-compliant.
- [ ] Overlay shell handles actions without dedicated panels gracefully (no dead tabs).
- [ ] No gameplay truth or data derivation introduced in the overlay layer.

## Dependencies & Sequencing
- Depends on: Existing overlay shell and panel registry wiring.
- Informs: Standalone dialog flow and HUD button grid routing behaviors.

## Open Questions / Clarifications
- Should clicking an active tab close the overlay or keep it pinned until explicit close?
- How should keyboard focus move between tabs and dialog content to respect accessibility expectations?
