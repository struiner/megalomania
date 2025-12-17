# Task Specification — HUD Minimap Scaling Policy

**STATUS: COMPLETE — scaling clamps + snapping codified in `hud-minimap.component.ts`; README summarizes policy with TODOs for letterboxing.**

## Task Summary
Define and implement the minimap's pixel density, scaling clamps, and low-resolution behavior so the HUD minimap can progress from representative data to functional rendering without violating pixel-integrity rules.

## Purpose and Scope
- Lock the baseline tile size and scaling factors for the minimap (including 512px source and 64×64 preview assumptions).
- Decide on letterboxing vs. resampling for lower-resolution devices and maximum scale to avoid blur on low DPI screens.
- Capture marker overlay expectations (if any) without introducing gameplay-derived truth.

## Explicit Non-Goals
- No live gameplay data integration beyond existing fixture previews.
- No animation or decorative polish; focus on readable, deterministic rendering.
- No expansion into world-generation or ledger schemas.

## Fidelity & Constraints
- Target **Structural → Functional** transition: implement deterministic rendering rules once decisions are locked.
- Must adhere to the UI & Ergonomics Charter (pixel-grid alignment, restrained motion) and the Level of Detail & Abstraction Charter.
- UI remains a derived view; tile/marker data must come from approved preview services.

## Agent Assignments
- **Owner / Executor:** Frontend Developer (implements scaling rules and UI adjustments).
- **Design Intent / Approval:** Game Designer (clarifies visual tone, acceptable letterboxing/resampling approaches).
- **Architecture Steward:** Ensures rules avoid truth ownership and respect device-safe-area constraints.
- **QA:** Validates rendering across viewport sizes and DPI profiles.

## Deliverables
- Updated `hud-minimap.component.ts/.scss` with codified scaling/letterboxing rules and explanatory inline docs.
- If needed, fixture updates in `HudMinimapDataService` to reflect agreed baseline tile sizes and marker presentation.
- Brief note in `v1/src/app/pages/hud/README.md` summarizing the decided minimap rendering policy.

## Review Gate
- [ ] Scaling and resolution rules documented in code and rendered output is pixel-precise at agreed sizes.
- [ ] No blurry magnification or sub-pixel positioning introduced.
- [ ] Placeholder data remains clearly marked and does not claim gameplay truth.
- **Approvers:** Architecture Steward + Project Manager; Game Designer sign-off on visual approach.

## Dependencies & Sequencing
- Depends on Phase 3 promotion decisions recorded in `v1/src/app/pages/hud/hud_phase3_review.md`.
- May interact with safe-area handling and overlay positioning; coordinate with HUD layout owners if adjustments are required.
