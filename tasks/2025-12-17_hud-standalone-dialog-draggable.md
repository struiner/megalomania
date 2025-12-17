# Task Specification — HUD Standalone Dialog Draggability

**STATUS: TODO — pending execution.**

## Task Summary
Promote the standalone HUD dialog shell into a draggable, pixel-aligned overlay so players can reposition dialogs without obscuring the world viewport, while keeping escape/close semantics consistent with HUD routing flows.【F:v1/src/app/pages/hud/components/hud-standalone-dialog.component.ts†L12-L36】

## Purpose and Scope
- Add drag affordances (header grab area) that respect pixel integrity and avoid smooth sub-pixel transforms, per the UI & Ergonomics Charter.
- Preserve modal semantics: keyboard dismissal (ESC) and close buttons must interoperate with HUD routing and overlay shells.
- Document how dialog positioning interacts with bottom HUD stability and potential multi-monitor scaling.

## Explicit Non-Goals
- No new gameplay actions or data derivation inside the dialog.
- No design overhaul of dialog visuals beyond necessary affordance cues.
- No cross-domain state caching; dialog remains a pure view shell.

## Fidelity & Constraints
- Target **Functional fidelity** limited to drag interactions; visuals remain at structural styling.
- Maintain integer pixel positioning; avoid CSS transforms that introduce sub-pixel blur.
- Keep focus handling deterministic (tab order, ESC behavior) and aligned with existing overlay shell contracts.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** Game Designer (affordance clarity, tone) and Architecture Steward (truth-ownership guardrails)
- **QA:** Validate drag bounds, focus retention, and regression against existing overlay usage.

## Deliverables
- Updated dialog component with drag logic, bounded within the viewport and respecting bottom HUD real estate.
- Tests or manual verification notes covering drag, close, and ESC interactions across routes.
- Documentation snippet in the HUD README describing positioning rules and integration points for future dialogs.

## Review Gate
- [ ] Dragging retains pixel integrity and does not occlude critical world/hud regions.
- [ ] Escape/close semantics remain consistent with overlay routing behavior.
- [ ] No gameplay truth or state mutation introduced in the UI layer.

## Dependencies & Sequencing
- Depends on: HUD overlay shell and standalone dialog baseline.
- Informs: Future dialog-heavy panels that require movable overlays.

## Open Questions / Clarifications
- Should draggable dialogs snap to a grid (e.g., 4px increments) to reinforce retro pixel tone?
- Should dialogs remember last position per route, or always reset to default anchoring?
