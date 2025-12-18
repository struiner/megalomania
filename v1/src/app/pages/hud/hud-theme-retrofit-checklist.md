# HUD Theme Consistency & Retrofit Checklist

This document fulfills the planning deliverables for `tasks/2025-12-18_hud-theme-consistency-retrofit.md`. It operates at Structural/styling readiness fidelity and references the tokens in `hud-theme-foundations.md` without owning gameplay truth.

## Audit Coverage
- **Bottom HUD container** — verify backplate palette (Secondary Background), brass edge, and 4px/8px padding grid adherence.
- **Button grid** — align slot sizing to 16px multiples; confirm hover/active states map to Highlight Copper and brass stroke only.
- **Info panes (left/right)** — apply parchment backplates with brass header bars; badge colors use Success/Warning/Alert tokens.
- **Overlay shell** — header uses icon header utility; confirm drag handle respects rope/cord motif at 12–16px repeat.
- **Minimap frame** — copper/brass border plus inner shadow; ensure marker glyph color follows Typography Ink (Light).
- **Auxiliary dialogs** — parchment base with minimal ornamentation; no additional drop shadows beyond 1px Cool Shadow.

## SCSS Hook Plan
- Theme token variables now live in `v1/src/app/pages/hud/theme/hud-theme.tokens.scss` (palette, typography stacks, letterbox contrast). Import the partial into HUD components to keep fonts and color tokens consistent.
- Expose mixins for **brass frame**, **parchment backplate**, and **rope header** treatments; keep mixins limited to visual styling.
- Snap all decorative dimensions to 4px increments; avoid fractional values per pixel-integrity rule.

## Retrofit Sequence
1. Introduce SCSS token partial and wire into bottom HUD, button grid, info panes, overlay shell, and minimap frame incrementally.
2. Validate safe-area handling after styling changes to ensure padding reserves are unaffected.
3. QA pixel integrity at 1× and 2× scaling; adjust mixins if dither patterns blur.
4. Replace placeholder emoji icons with the token-aligned pilot set (see follow-up tasks) before enabling hover/active states.

## Gaps & Follow-up Tasks
- Pixel icon pilot set needed for button grid/info headers (brass/copper stroke rules). Tracked in `tasks/2025-12-18_hud-icon-pilot-set.md`.
- Parchment/wood texture swatches required to validate dither patterns at 2×. Tracked in `tasks/2025-12-18_hud-texture-swatch-production.md`.
- Accessibility check on warning/alert palette variants. Tracked in `tasks/2025-12-18_hud-accessible-warning-palette.md`.

These gaps are tracked via new task specs created alongside this checklist.
