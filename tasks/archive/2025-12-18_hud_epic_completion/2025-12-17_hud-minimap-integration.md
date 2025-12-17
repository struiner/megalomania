# Task Specification — HUD Minimap Integration

**STATUS: COMPLETE — verified at HUD Epic Phase 2 review; no remaining open items.**

## Task Summary
Introduce a pixel-aligned minimap surface within the bottom HUD scaffold, providing structural integration points without committing to rendering logic. Target **Structural fidelity**.

## Purpose and Scope
- Add a minimap container/component within the bottom HUD layout with clear sizing and framing rules.
- Define interface for supplying minimap tiles/frames without implementing world rendering.
- Ensure minimap placement respects attention hierarchy (peripheral, not dominant) and preserves world view.

## Explicit Non-Goals
- No live world rendering, zoom controls, or panning logic.
- No networking, ledger hookups, or gameplay events.
- No animated overlays or dynamic markers beyond a static placeholder.

## Fidelity & Constraints
- Structural-only: accept mock tile sprites or solid-color placeholder.
- Must obey pixel integrity (integer scaling, no sub-pixel transforms) and HUD symmetry rules.
- Avoid truth ownership: consume provided view data only; do not calculate gameplay state.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** Minimap is a compact, instrument-like viewport—readable at a glance, framed like a cartographer’s inset map, secondary to the main world.
- **Architecture Steward:** Verify separation from game state and ledger truth.
- **QA:** Validate layout stability and pixel alignment across scales.

## Deliverables
- Angular component for the minimap slot with documented input contracts for tile/texture data.
- Styling enforcing fixed aspect ratio and pixel-grid alignment within the bottom HUD bar.
- Placeholder visual (mock grid) demonstrating expected bounds and padding.
- Notes on future layering (e.g., markers) without implementing them.

## Review Gate
- [x] Placement and sizing comply with UI & Ergonomics Charter (peripheral attention, symmetry).
- [x] No gameplay logic or world derivations inside the component.
- [x] Inputs/interfaces documented for later rendering work.
- **Approvers:** Architecture Steward + Project Manager; Game Designer optional for tone.

## Dependencies & Sequencing
- Depends on: Bottom HUD layout skeleton scaffold.
- Can proceed in parallel with button grid and info pane framework once scaffold exists.

## Open Questions / Clarifications
- Desired aspect ratio (e.g., square vs. slight rectangle) for default minimap frame?
    Answer: Square.
- Should minimap accept tile size configuration for different pixel densities?
    Answer: yes, it should be generic in it's input and lenient in it's display.

## Review Notes (Architecture Steward)
- Sign-off: Architecture Steward — L. Vermeer (2024-06-05).
- Findings:
  - Structural fidelity is correct per the Level of Detail & Abstraction Charter; keep minimap integration limited to slotting and input contracts.
  - Pixel integrity, square aspect default, and peripheral placement align with the UI & Ergonomics Charter; ensure framing stays secondary to the world view.
  - No additional recursion layers are needed; avoid nested minimap renderers beyond the defined container.
- Required Amendments: Document mock tile usage and keep inputs generic yet bounded to prevent UI-side derivations of world state.
