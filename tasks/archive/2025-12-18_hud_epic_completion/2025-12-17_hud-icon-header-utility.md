# Task Specification — HUD Icon Header Utility

**STATUS: COMPLETE — verified at HUD Epic Phase 2 review; no remaining open items.**

## Task Summary
Provide a reusable HUD utility for pairing compact icons with short titles/captions, ensuring **integer-scaled, pixel-aligned** rendering suitable for repeated use in peripheral HUD panes.

## Purpose and Scope
- Offer a structural header block that combines a small icon (sprite or glyph) with a title/label for HUD subsections.
- Enforce pixel-grid alignment and integer scaling options (e.g., 1×, 2×) so assets remain crisp at multiple resolutions.
- Supply spacing, padding, and alignment tokens that keep icon + text groupings balanced per the UI & Ergonomics Charter.

## Explicit Non-Goals
- No gameplay data, dynamic counts, or computed status indicators.
- No animation, hover effects, or interaction wiring beyond basic semantic markup.
- No asset sourcing or pipeline decisions; assume icons are provided by callers.

## Fidelity & Constraints
- Structural/utility fidelity only; placeholder sprite slots acceptable for demonstration.
- Must align with the **UI & Ergonomics Charter**: respect peripheral attention, pixel integrity rules, and restrained density.
- Must not own truth: accepts display inputs; never computes or caches gameplay state.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** Game Designer for tone of labels and hierarchy cues.
- **Architecture Steward:** Ensure utility stays presentation-only and honors pixel alignment rules.
- **QA:** Verify crisp rendering at 1×/2× scales and consistent spacing across breakpoints.

## Deliverables
- Reusable Angular (or framework-aligned) utility/component for icon+title blocks with documented inputs (icon source/ref, label text, optional scale enum) and layout options (alignment, padding tokens).
- SCSS/CSS variables or mixins enforcing integer scaling, pixel-grid alignment, and consistent gaps.
- Example usage snippet illustrating integration within HUD info panes or headers (without binding to live data).

## Review Gate
- [x] Icon + text remain crisp at integer scales; no sub-pixel offsets.
- [x] Complies with UI & Ergonomics Charter attention hierarchy (peripheral weight, restrained density).
- [x] No gameplay logic or data ownership; inputs are fully externalized.
- **Approvers:** Architecture Steward + Project Manager; Game Designer optional for tone alignment.

## Dependencies & Sequencing
- Depends on: `tasks/2025-12-17_hud-info-pane-framework.md` for placement contexts and slot targets.
- Informs future HUD tasks needing labeled subsections or pane headers.

## Open Questions / Clarifications
- Preferred default icon size (e.g., 16×16 vs 24×24) given pixel heritage? **Propose 16×16 with 2× scale option; confirm with Game Designer.**
- Should utility support icon-only mode when title is suppressed? **Tentatively yes for minimal badges, but keep spacing consistent.**
