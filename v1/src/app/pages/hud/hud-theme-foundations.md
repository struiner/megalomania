# HUD Hanseatic Theme Foundations

This document codifies the Structural-fidelity theme tokens referenced by `tasks/2025-12-18_hud-hanseatic-theme-foundations.md`. It is governed by the UI & Ergonomics Charter and the Level of Detail & Abstraction Charter. Tokens avoid gameplay truth and focus on reusable guidance for HUD surfaces.

## Palette (Hex)
- **Primary Ink**: `#0f0a1f` — body copy on parchment; pairs with light parchment backgrounds.
- **Primary Background (Parchment)**: `#f0e4c2` — light parchment neutral for panes and overlays.
- **Secondary Background (Dark Wood)**: `#2b1b0f` — grounding for bottom HUD and button grid backplates.
- **Accent Brass**: `#c08a3b` — metallic edging, button trims, minimap frame corners.
- **Highlight Copper**: `#d79a59` — hover/active state edging; avoid large fills to preserve restraint.
- **Cool Shadow**: `#1b2433` — shadow/inner border to separate HUD from world without heavy blur.
- **Success/Health**: `#6ba84f`; **Warning**: `#d27d2c`; **Alert**: `#9e2f2f` — limited-saturation signals for peripheral attention only.
- **Typography Ink (Dark)**: `#0b0b0b`; **Typography Ink (Light)**: `#f8f5e6` for dark plates.

> TODO: Validate color-blind safe alternates for warning/alert accents with QA before promotion to runtime tokens.

## Texture & Ornamentation Guidance
- **Backplates**: Flat fills with subtle 1px dither using Primary Ink over Parchment or Secondary Background; no gradients or blur.
- **Framing**: 2px brass edge (`Accent Brass`) with 1px inner shadow (`Cool Shadow`) snapped to 4px grid corners.
- **Motifs**: Rope/cord segments allowed on pane headers and minimap frame corners; keep repeats in 12–16px steps.
- **Minimap letterbox fills**: `--hud-minimap-letterbox-flat-fill` anchors dark primary ink for shallow gutters; `--hud-minimap-letterbox-texture` overlays a brass/ink dither for 8px+ padding to avoid flat voids on constrained renders while keeping contrast legible.
- **Prohibitions**: No glow, bloom, or semi-transparent overlays; avoid tile repeats tighter than 12px to prevent noise on ultra-wide viewports.

> TODO: Provide pixel dither swatches (2–3 patterns) sized for 2× integer scaling; requires art direction confirmation.

## Typography Tokens
- **Primary Heading**: Pixel serif (e.g., *IM Fell English SC* bitmap variant) at 14px/16px line height; uppercase allowed for headers.
- **Secondary Heading**: Pixel sans (e.g., *Press Start 2P* or *Silkscreen*) at 12px/14px line height for labels and badges.
- **Body Text**: 11px/13px line height using pixel-friendly sans fallback (system `ui-monospace` if bitmap unavailable).
- **Shadow/Outline Rules**: Optional 1px drop shadow using `Cool Shadow` only when text sits on busy dither; otherwise none.
- **Spacing**: Letter spacing +0.3px for uppercase headings; maintain integer padding (4px/8px) per charter.

> TODO: Finalize canonical font files and licensing; confirm whether bitmap exports are needed for offline packaging.

## Iconography Treatment
- **Stroke Weight**: 1px–2px strokes snapped to pixel grid; favor beveled corners over curves.
- **Fill**: Minimal flat fills; prefer negative space with brass/copper strokes and limited parchment fill.
- **Framing**: Square or shield outlines sized to 16px/24px; align icon baselines with button grid slots.
- **States**: Hover = `Highlight Copper` stroke with `Cool Shadow` inset; Active = thicker 2px brass stroke.

> TODO: Produce a 12–16 icon pilot set for button grid and info pane headers to validate stroke/spacing rules (follow-up task).

## Application Notes
- Bottom HUD uses Secondary Background with brass edge; minimap frame can use copper corners plus inner shadow.
- Info panes and dialogs should default to Parchment with brass header bars and minimal cord/rope accent on top edge only.
- Peripheral badges (alerts, counts) should invert colors (dark plate, light ink) but avoid blinking/animation per charter.
