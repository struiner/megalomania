# HUD Pixel Dither Swatches Production

## Task Summary & Purpose
The HUD theme foundations require pixel dither swatches (2-3 patterns) sized for 2× integer scaling to support texture and ornamentation guidance. This task creates the visual assets needed for proper HUD dithering patterns.

**Original TODO:** `> TODO: Provide pixel dither swatches (2–3 patterns) sized for 2× integer scaling; requires art direction confirmation.` in `megalomania/v1/src/app/pages/hud/hud-theme-foundations.md:24`

## Explicit Non-Goals
- Do not modify existing theme color definitions or token relationships
- Do not implement dithering algorithms or rendering logic
- Do not create texture assets beyond dither swatches
- Do not alter UI component styling or layout patterns

## Fidelity & Constraints
- **Target Stage:** Structural (skeleton) - create base assets for future implementation
- **Reference:** UI & Ergonomics Charter (visuals follow 16-bit pixel heritage)
- **Domain:** Frontend visual assets and theme system

## Agent Assignments
- **Primary:** Frontend Developer
- **Collaborators:** Game Designer (for visual standards), QA & Test Engineer (for asset validation)

## Deliverables & Review Gate
- [ ] Create 2-3 pixel-perfect dither patterns at 2× scale (4x4, 6x6, 8x8 pixel blocks)
- [ ] Generate dither swatches using Primary Ink (#0f0a1f) over Parchment (#f0e4c2)
- [ ] Ensure patterns work well at 12-16px repeats as specified in theme foundations
- [ ] Test dither visibility across different display resolutions and zoom levels
- [ ] Document dither usage guidelines and application patterns

**Review Gate:** Frontend Developer validates that dither patterns enhance visual texture without creating noise or distraction.

## Dependencies & Sequencing
- **Prerequisites:** None - can proceed with asset creation
- **Follow-up Tasks:** Dither implementation in theme system, texture pattern expansion

## Open Questions / Clarifications
- Should dither patterns be generated algorithmically or hand-crafted for better control?
- Do we need variations for different background colors beyond parchment?
- Should dither intensity be configurable or fixed for consistency?