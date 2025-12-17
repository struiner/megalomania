# Task Specification — Bottom HUD Layout Skeleton

## Task Summary
Establish the foundational grid, anchoring, and spatial rules for the bottom HUD bar so that future HUD components can be slotted in without layout churn. This task operates at **Structural fidelity** per the Level of Detail & Abstraction Charter.

## Purpose and Scope
- Define a stable bottom bar frame that reserves space for minimap, button grid, and info panes without implementing their internals.
- Enforce pixel-aligned sizing, padding, and anchoring consistent with the UI & Ergonomics Charter.
- Provide stub Angular components and layout scaffolding; real data wiring is out of scope.

## Explicit Non-Goals
- No gameplay logic, event handling, or state derivation in the UI.
- No visual polish beyond clear structural framing (no animations, gradients, or iconography).
- No minimap rendering, action logic, or info content population.

## Fidelity & Constraints
- Target **Structural** fidelity: minimal working layout, hardcoded placeholder blocks allowed.
- Must honor UI & Ergonomics Charter attention hierarchy (bottom HUD stable, world unobstructed).
- Must avoid truth ownership in UI; all data placeholders should be clearly marked as mock/stub.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** Bottom bar should feel like a grounded instrument panel: heavy, symmetrical, pixel-locked; leave world center unobstructed; expect 2× or 3× integer scaling.
- **Architecture Steward:** Review for truth leakage and structural simplicity.
- **QA:** Validate layout stability across common viewport widths.

## Deliverables
- Angular layout scaffold for bottom HUD container with placeholder slots for minimap (right), button grid (center), and info panes (left/right as applicable).
- CSS/SCSS primitives enforcing pixel-grid alignment, fixed height, and non-overlapping world viewport.
- README-style notes within the component folder documenting intended child slots and sizing assumptions.

## Review Gate
- [ ] UI aligns with the UI & Ergonomics Charter (anchoring, symmetry, restraint).
- [ ] No gameplay logic or derived truth embedded in the UI layer.
- [ ] Layout validated at Structural fidelity (placeholder content only).
- **Approvers:** Architecture Steward + Project Manager; optional Game Designer sign-off on tone.

## Dependencies & Sequencing
- Precedes: Minimap integration, HUD button grid, HUD info pane framework.
- Can run in parallel with routing & dialog wiring once scaffold exists.

## Open Questions / Clarifications
- Preferred baseline pixel height for the HUD bar (e.g., multiples of 16px)?
    Answer: Multiples and fractions of 16px are preferable, where 4px is condidered a universal margin and 2px is considered a base line width.
- Should the minimap slot reserve additional margin for frame/chrome when promoted to Functional fidelity?
    Answer: Yes, the minimap will eventually have to be decorated in a typically fitting style, along with navigation controls for panning and zooming, so a border of 16px to 32px would be prudent.

## Review Notes (Architecture Steward)
- Sign-off: Architecture Steward — L. Vermeer (2024-06-05).
- Findings:
  - Structural fidelity is confirmed per the Level of Detail & Abstraction Charter; keep the scaffold lean with clearly stubbed placeholders.
  - Bottom anchoring, symmetry, and pixel-grid alignment align with the UI & Ergonomics Charter; keep the world center unobstructed.
  - No additional recursion layers are required beyond the current task set; avoid nested layout abstractions.
- Required Amendments: Label placeholder slots as mock data and preserve the 16px/4px spacing ratios to uphold charter compliance.
