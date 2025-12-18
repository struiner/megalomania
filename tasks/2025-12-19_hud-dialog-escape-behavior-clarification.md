# HUD Dialog Escape Key Behavior Clarification

## Task Summary & Purpose
The `HudStandaloneDialogComponent` has ambiguous behavior for the ESC key press - it's unclear whether ESC should bubble to the HUD router or remain local to the dialog shell. This task clarifies and implements the correct escape behavior following UI charter guidelines.

**Original TODO:** `// TODO: Confirm whether ESC should bubble to HUD router or remain local to dialog shell.` in `v1/src/app/pages/hud/components/hud-standalone-dialog.component.ts:30`

## Explicit Non-Goals
- Do not modify dialog content or visual appearance
- Do not change other keyboard shortcuts or interaction patterns
- Do not implement ESC behavior for non-standalone dialogs or overlays
- Do not modify dialog lifecycle or memory management

## Fidelity & Constraints
- **Target Stage:** Functional (playable) - ensure consistent and predictable escape behavior
- **Reference:** UI & Ergonomics Charter (shallow modal depth, max stack depth 2)
- **Domain:** Frontend UI surface and user interaction patterns

## Agent Assignments
- **Primary:** Frontend Developer
- **Collaborators:** Game Designer (for UX consistency), Architecture Steward (for interaction patterns)

## Deliverables & Review Gate
- [ ] Document the decided ESC behavior in component JSDoc and design notes
- [ ] Implement chosen ESC handling pattern (local vs. bubbling)
- [ ] Add tests for ESC behavior in different dialog contexts
- [ ] Update related dialog components to use consistent patterns
- [ ] Document ESC behavior in HUD interaction guidelines

**Review Gate:** Frontend Developer validates that ESC behavior is consistent and follows charter guidelines for modal depth.

## Dependencies & Sequencing
- **Prerequisites:** None - can proceed with UX decision and implementation
- **Follow-up Tasks:** ESC behavior documentation, keyboard shortcut standardization

## Open Questions / Clarifications
- Should nested dialogs handle ESC differently than standalone dialogs?
- Should there be visual feedback when ESC is pressed (e.g., brief highlight)?
- Should ESC close dialogs immediately or require confirmation for unsaved changes?