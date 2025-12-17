# Task Specification — HUD Non-Panel Action Routing

**STATUS: TODO — auxiliary dialog placeholders need real destinations.**

## Task Summary
Define and implement routing/UX for HUD actions that lack overlay panels (e.g., settings, help), replacing the current placeholder standalone dialog with approved flows.

## Purpose and Scope
- Clarify intended destinations for non-panel HUD actions and wire routes/dialog variants accordingly.
- Align close/escape semantics with the overlay shell and bottom HUD while keeping the world viewport unobstructed.
- Provide deterministic stubs or mocks until full feature surfaces are available.

## Explicit Non-Goals
- No new gameplay systems or settings logic; focus is on routing and view shells.
- No redesign of the bottom HUD layout or button grid.
- No persistent state storage within the HUD layer.

## Fidelity & Constraints
- Target **Structural fidelity**: stable routing and dialog shells with minimal styling changes.
- Must follow the UI ergonomics charter (peripheral, non-intrusive) and Level of Detail charter (no overbuild).
- Keep dialog positioning compatible with draggable overlay behavior.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** Game Designer (intent for actions), Architecture Steward (routing boundaries), QA (interaction regression)

## Deliverables
- Documented intent and routing table for non-panel HUD actions.
- Implemented navigation (routes or dialogs) for settings/help buttons using agreed shells.
- Updated HUD README outlining the non-panel action contract and escape behavior.

## Review Gate
- [ ] Non-panel actions no longer rely on placeholder copy; they route to approved destinations.
- [ ] Close/escape semantics remain consistent with overlay/panel flows.
- [ ] No gameplay truth is introduced in HUD-layer components.

## Dependencies & Sequencing
- Depends on: Clarified design intent for settings/help flows.
- Related to: HUD overlay tab logic and draggable dialog shell.

## Open Questions / Clarifications
- Should settings/help open as standalone draggable dialogs or navigate to dedicated routes?
- Are there accessibility shortcuts expected for these actions (e.g., keyboard chords)?
