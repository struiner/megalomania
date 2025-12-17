# Task Specification — HUD Auxiliary Destination Clarification

**STATUS: COMPLETE — deterministic auxiliary dialog wiring in `hud-page.component.ts` with CTA routes and TODOs for final ownership.**

## Task Summary
Finalize the destinations, CTA ownership, and fallback behavior for auxiliary HUD actions (settings, help, other non-overlay actions) so they can progress from placeholder dialogs to deterministic navigation without inventing truth.

## Purpose and Scope
- Decide whether auxiliary actions should open global configuration routes or remain dialog-scoped for rapid tweaks.
- Define CTA routes, fallback dialogs, and error handling for auxiliary actions exposed in the HUD button grid.
- Document the decisions within HUD components to keep future work aligned with the UI & Ergonomics Charter.

## Explicit Non-Goals
- No gameplay mechanics or new configuration surfaces.
- No backend/schema changes; routing targets must already exist or be stubbed dialogs.
- No iconography or visual polish changes beyond clarity notes.

## Fidelity & Constraints
- Target **Structural** fidelity: deterministic routing/CTA wiring using confirmed destinations and fallback rules.
- Must honor the Level of Detail & Abstraction Charter by avoiding premature abstraction or new UX surfaces.
- UI must remain a derived view; no capability or state ownership is allowed in the HUD.

## Agent Assignments
- **Owner / Executor:** Frontend Developer (implements confirmed wiring and documentation).
- **Design Intent / Approval:** Game Designer (confirms destinations, CTA semantics, and UX tone).
- **Architecture Steward:** Validate routing choices avoid truth leakage and respect charter constraints.
- **QA:** Verify navigation works across allowed states and that blocked actions surface HUD-native notices.

## Deliverables
- Updated HUD auxiliary dialog/config wiring in `hud-page.component.ts` with confirmed destinations and fallback behavior.
- Inline documentation/TODO resolution describing CTA ownership and when dialogs vs. routes should be used.
- Minimal notes in `v1/src/app/pages/hud/README.md` if new affordances are introduced.

## Review Gate
- [ ] Auxiliary HUD actions navigate deterministically without placeholder text.
- [ ] No gameplay or configuration truth is embedded in the HUD layer.
- [ ] Safe-area and overlay stability are preserved when dialogs/routes open.
- **Approvers:** Architecture Steward + Project Manager; Game Designer sign-off required for destinations.

## Dependencies & Sequencing
- Requires the Phase 3 promotion decisions in `v1/src/app/pages/hud/hud_phase3_review.md`.
- May depend on availability/capability gating rules if destinations are not globally accessible.
