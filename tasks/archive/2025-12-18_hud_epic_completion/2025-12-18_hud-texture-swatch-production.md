# Task Specification — HUD Texture Swatch Production

**STATUS: NEW — spawned from theme retrofit gaps; needs art/QA validation.**

## Task Summary
Create parchment and dark-wood texture swatches (pixel-dithered) to support the HUD theme without violating pixel integrity.

## Purpose and Scope
- Deliver 2–3 parchment variants and 1–2 dark-wood variants sized for 16px repeat and 2× integer scaling.
- Document recommended usage per surface (info panes, overlay headers, bottom HUD base).
- Include contrast notes to keep body text readable per UI & Ergonomics Charter.

## Explicit Non-Goals
- No gradient overlays or dynamic effects.
- No additional ornaments beyond subtle dither/edge banding.
- No runtime integration; focus on asset readiness.

## Fidelity & Constraints
- Structural/asset fidelity; files may be PNG tiles or sprite sheets.
- Snap all patterns to 4px/8px grid; avoid sub-pixel aliasing.

## Agent Assignments
- **Owner / Executor:** Art/Brand Consultant.
- **Consulted:** Frontend Developer (tiling feasibility), QA (contrast checks), Architecture Steward (charter compliance).

## Deliverables
- Texture assets with metadata (tile size, intended repeat) and preview screenshots at 1×/2×.
- Notes added to `hud-theme-foundations.md` or `hud-theme-retrofit-checklist.md` describing placement rules.

## Review Gate
- [ ] Patterns remain crisp at 1×/2× without blur.
- [ ] Contrast supports legibility for text/icons.
- [ ] No charter violations (no gradients/bloom).

## Dependencies & Sequencing
- Follows `hud-theme-foundations.md` palette guidance.
- Should land before HUD SCSS tokenization to avoid rework.
