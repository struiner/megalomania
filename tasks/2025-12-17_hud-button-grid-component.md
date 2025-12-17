# Task Specification — HUD Button Grid Component

## Task Summary
Create a 2×4 action launcher grid component for the bottom HUD, providing clear slots for actions while respecting ergonomic and pixel rules. Operate at **Structural fidelity**.

## Purpose and Scope
- Define a reusable button grid that sits centrally (or symmetrically) within the bottom HUD scaffold.
- Provide slots/inputs for icon references and labels without binding to gameplay logic.
- Establish consistent spacing, hit areas, and keyboard-focus affordances suited to retro pixel aesthetics.

## Explicit Non-Goals
- No action logic, hotkey wiring, or tooltip content beyond placeholders.
- No animation or visual polish beyond visible focus/selection states.
- No stateful cooldowns or timers inside the grid.

## Fidelity & Constraints
- Structural-only: mock icons/text acceptable; focus on grid sizing and alignment.
- Pixel-grid alignment and symmetry required; avoid responsive reflow that disrupts stability.
- UI must not own truth: actions are externally provided; component only emits intent events.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** Buttons should read like sturdy, physical toggles on a navigator’s panel—clear, orderly, with restrained feedback; no MMO hotbar vibes.
- **Architecture Steward:** Ensure event contracts do not encode gameplay rules.
- **QA:** Verify accessibility basics (focus order) and consistent sizing at integer scales.

## Deliverables
- Angular component for a 2×4 button grid with input bindings for icon/label metadata and output events for selection.
- SCSS enforcing fixed cell sizes, pixel snapping, and stable spacing.
- Minimal story/demo or README documenting expected usage and theming constraints.

## Review Gate
- [ ] Layout and interaction follow UI & Ergonomics Charter (restraint, stability, no clutter).
- [ ] Emits intent-only events; no embedded logic or cooldown handling.
- [ ] Structural fidelity demonstrated with placeholders.
- **Approvers:** Architecture Steward + Project Manager; Game Designer optional for ergonomics tone.

## Dependencies & Sequencing
- Depends on: Bottom HUD layout skeleton placement for central slot.
- May precede info pane framework; parallelize with minimap integration.

## Open Questions / Clarifications
- Preferred default cell size and padding multiples (e.g., 16px grid)?
    Answer: 16px;
- Should the grid support configurable columns/rows, or remain fixed at 2×4 for now?
    Answer: let it be fixed for now.

## Review Notes (Architecture Steward)
- Sign-off: Architecture Steward — L. Vermeer (2024-06-05).
- Findings:
  - Structural fidelity is upheld per the Level of Detail & Abstraction Charter; fixed 2×4 grid prevents premature complexity.
  - Pixel-grid alignment, symmetry, and restrained feedback conform to the UI & Ergonomics Charter; avoid MMO-style embellishments.
  - No additional recursion layers are necessary; keep configuration surfaces minimal until functional fidelity is requested.
- Required Amendments: Keep intent-only events explicit and document mock icon/label usage to avoid UI truth ownership.
