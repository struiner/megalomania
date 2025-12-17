# Task Specification — HUD Safe-Area Insets & Viewport Reserves

**STATUS: TODO — requires guidance for devices with cutouts/notches and embedded scroll containers.**

## Task Summary
Define and implement safe-area inset handling for the fixed bottom HUD and overlay shells so they remain pinned without clipping on devices with display cutouts or nested scroll contexts.

## Purpose and Scope
- Audit HUD positioning against common safe-area scenarios (mobile/tablet emulation, embedded iframes, tall viewports).
- Introduce CSS variables or layout guards that respect safe-area constants while preserving pixel-grid alignment.
- Document requirements for future HUD consumers to reserve adequate padding/margins when embedding the HUD.

## Explicit Non-Goals
- No responsive redesign of HUD contents or grid dimensions beyond inset accommodations.
- No runtime device detection logic beyond CSS/env-safe usage.
- No changes to world-render camera or viewport behavior.

## Fidelity & Constraints
- Target **Structural fidelity**: layout rules and variables without new visual treatments.
- Must comply with the UI ergonomics charter (stability, symmetry) and avoid sub-pixel transforms.
- Keep adjustments deterministic; avoid JS-driven resize hacks unless absolutely necessary.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** Architecture Steward (layout constraints), QA (viewport matrix), Game Designer (visual framing)

## Deliverables
- CSS and/or Angular host adjustments to honor safe-area insets for the bottom HUD and overlay shell.
- Updated HUD README noting required padding and supported viewport profiles.
- Verification checklist covering scroll/iframe contexts and DPR variants.

## Review Gate
- [ ] HUD and overlays remain fully visible across safe-area scenarios without occluding world content.
- [ ] Pixel integrity and symmetry are preserved after inset adjustments.
- [ ] No new JS layout side effects are introduced.

## Dependencies & Sequencing
- Depends on: Current fixed anchoring implementation.
- Related to: Draggable dialog positioning and overlay tab behaviors.

## Open Questions / Clarifications
- Should safe-area insets be configurable per platform (web/desktop/mobile) or derived from CSS environment variables only?
- Do overlays require independent inset handling separate from the bottom HUD height reserve?
