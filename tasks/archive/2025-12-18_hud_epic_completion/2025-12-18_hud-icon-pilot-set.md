# Task Specification — HUD Icon Pilot Set

**STATUS: NEW — spawned from theme retrofit gaps; awaits art/UX confirmation.**

## Task Summary
Produce a 12–16 icon pilot set (button grid + info pane headers) adhering to `hud-theme-foundations.md` stroke/spacing rules so HUD slots can shed emoji placeholders.

## Purpose and Scope
- Deliver brass/copper line icons aligned to the 4px grid and 16px/24px bounding boxes.
- Provide light/dark variants (Typography Ink colors) for parchment vs. wood backplates.
- Export assets at integer scales (1×/2×) and document usage per HUD component.

## Explicit Non-Goals
- No new HUD behaviors or gameplay affordances.
- No animation or multi-color gradients; flat fills only as per charter.
- No icon expansion beyond the initial HUD set (12–16 glyphs).

## Fidelity & Constraints
- Structural/asset readiness only; icons may be delivered as SVG sprites or bitmap strips.
- Must respect pixel integrity and UI & Ergonomics hierarchy (peripheral attention only).

## Agent Assignments
- **Owner / Executor:** Art/Brand Consultant or Frontend Developer (asset import only).
- **Consulted:** Game Designer (semantic fit), Architecture Steward (avoid truth leakage).
- **QA:** Validate pixel alignment at 1×/2× scales.

## Deliverables
- Icon files (SVG/PNG) and a usage note mapping each icon to HUD action slots.
- Documentation snippet in `v1/src/app/pages/hud/README.md` outlining import method.

## Review Gate
- [ ] Icons align to grid and match theme tokens.
- [ ] No gameplay truth implied; purely representational.
- [ ] Assets packaged for integer scaling without blur.

## Dependencies & Sequencing
- Depends on `hud-theme-foundations.md` stroke/spacing rules.
- Should precede HUD theme retrofit implementation that replaces emoji placeholders.
