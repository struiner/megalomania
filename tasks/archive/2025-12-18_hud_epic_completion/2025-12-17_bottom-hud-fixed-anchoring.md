# Task Specification — Bottom HUD Fixed Anchoring

**STATUS: COMPLETE — HUD now uses fixed anchoring with layout padding reserves.**

## Task Summary
Guarantee the bottom HUD remains fixed to the viewport floor across all scroll contexts, replacing the current sticky positioning to prevent drift during long-form interactions or nested scroll containers.【F:v1/src/app/pages/hud/components/bottom-hud.component.scss†L1-L13】

## Purpose and Scope
- Evaluate and implement fixed positioning that keeps the HUD in view regardless of page scroll, while preserving existing grid layout and padding ratios.
- Audit page-level containers for overflow/scroll behaviors that could break HUD anchoring and document required constraints for future pages.
- Validate that fixed anchoring still honors the UI & Ergonomics charter (stability, unobstructed world viewport).

## Explicit Non-Goals
- No redesign of HUD contents (buttons, panes, minimap) beyond anchoring changes.
- No responsive breakpoints overhaul beyond what is necessary for fixed positioning.
- No introduction of gameplay logic or HUD-driven state.

## Fidelity & Constraints
- Target **Refinement fidelity** focused on layout reliability and cross-browser behavior.
- Maintain integer pixel spacing and symmetric layout while transitioning from sticky to fixed.
- Avoid regressions to keyboard navigation or accessibility semantics.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** Architecture Steward (layout impact), QA (viewport/regression sweeps)
- **Inform:** Game Designer if visual framing adjustments are needed post-fix.

## Deliverables
- Updated HUD positioning strategy (SCSS/Angular host bindings) that enforces fixed anchoring.
- Regression checklist or automated tests covering scroll scenarios and common viewport sizes.
- Documentation update in HUD README outlining anchoring expectations for future pages/components.

## Review Gate
- [ ] HUD remains pinned to the bottom of the viewport during scroll in all supported routes/pages.
- [ ] Layout symmetry, padding, and pixel integrity remain compliant with the UI charter.
- [ ] No new overlap or obstruction of the world viewport.

## Dependencies & Sequencing
- Depends on: Existing bottom HUD scaffold.
- Related to: HUD minimap and dialog positioning tasks to ensure consistent layering.

## Open Questions / Clarifications
- Should fixed anchoring include a fallback to sticky for legacy mobile/embedded contexts?
- Do we need configurable safe-area insets for devices with UI cutouts?
