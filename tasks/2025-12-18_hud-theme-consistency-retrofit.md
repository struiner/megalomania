# Task Specification — HUD Theme Consistency & Retrofit

**STATUS: OPEN — depends on Hanseatic theme foundation tokens.**

## Task Summary
Audit and retrofit HUD surfaces to apply the Hanseatic/medieval visual tokens consistently, ensuring pixel integrity and ergonomics remain intact across components and dialogs.

## Purpose and Scope
- Create a **checklist-driven audit** covering bottom HUD, button grid, info panes, overlay shells, minimap frame, and auxiliary dialogs for theme alignment.
- Identify required SCSS/CSS token hooks or variables to consume the approved palette, typography, and ornamentation rules without altering layout geometry.
- Produce a prioritized retrofit plan that sequences visual updates without disturbing routing, interaction contracts, or structural fidelity.
- Capture gaps in asset needs (icons, borders, parchment backplates) and raise follow-up asset tasks where missing.

## Explicit Non-Goals
- No gameplay logic changes, routing modifications, or new UI behaviors.
- No introduction of sub-pixel effects, gradients, or non-charter visual treatments.
- Does not ship final art; focuses on **implementation readiness and consistency checks**.

## Fidelity & Constraints
- Operates at **structural/styling readiness fidelity**: defining hooks, not committing final artwork.
- Must respect UI & Ergonomics Charter hierarchy: avoid weight on primary attention areas and keep central playfield clear.
- Enforce integer scaling for any decorative frames or textures to prevent blur.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** Game Designer (theme intent), Architecture Steward (guardrails), QA (visual regression and pixel integrity).
- **Art/Brand Consultant (optional):** Validate ornamentation choices against Hanseatic tone.

## Deliverables
- Component-by-component audit checklist noting current state, required token hooks, and risks (layout shifts, readability).
- SCSS variable/mixin plan mapping palette/typography tokens to HUD elements (button grid, info panes, overlay chrome, minimap border) without changing layout dimensions.
- Retrofit sequence proposal with effort estimates and dependencies (e.g., icons needed for auxiliary actions, parchment backplates for panes).
- List of follow-up task specs required for missing assets or complex retrofits (e.g., new icon set, parchment texture production).

## Review Gate
- [ ] Audit covers all HUD surfaces referenced in HUD epic child tasks and `hud-page` overlays.
- [ ] Proposed hooks avoid owning gameplay truth or altering interaction flows.
- [ ] Retrofit plan preserves pixel integrity and charter constraints.
- **Approvers:** Project Manager + Architecture Steward; QA signs off on audit completeness.

## Dependencies & Sequencing
- Depends on completion of `tasks/2025-12-18_hud-hanseatic-theme-foundations.md` (tokens/palette).
- Should run before any visual skinning code changes to minimize rework.
- Can run in parallel with minimap scaling policy clarification but must re-check border treatments afterward.

## Open Questions / Clarifications
- Should overlays and auxiliary dialogs share the same parchment/backplate treatment as info panes or use a lighter variant?
- Are there accessibility constraints (color-blind safe accents) that require alternative accent sets for warnings/alerts?
- What is the acceptable tolerance for texture tile repeat before it becomes visually noisy on ultra-wide resolutions?
