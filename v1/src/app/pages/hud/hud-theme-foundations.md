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
- **Primary HUD/system text:** *Pixelify Sans* at 13px/15px (weight 500) for buttons, labels, and overlay chrome. Anti-aliasing disabled (`-webkit-font-smoothing: none`) to preserve pixel edges.
- **Secondary/caps:** *Pixelify Sans* at 12px/14px (weight 600) with uppercase and +0.3px tracking for badges and chip labels.
- **Narrative/world accent:** *IM Fell English SC* at 14px/16px (weight 400) reserved for lore/world descriptors and section headers; keep antialiasing enabled for readability.
- **Body copy:** 12px/14px using the HUD stack; minimum contrast ratio 7:1 against the hosting plate using `Typography Ink (Dark/Light)` tokens.
- **Fallback stacks:** `Pixelify Sans`, `Press Start 2P`, `Silkscreen`, `VT323`, `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace` for HUD/system text. `IM Fell English SC`, `EB Garamond`, `Georgia`, `serif` for narrative accent.
- **Shadow/Outline Rules:** Optional 1px drop shadow using `Cool Shadow` only when text sits on busy dither; otherwise none. Avoid fractional text transforms to protect the pixel grid.

### Font Import & Packaging
- Self-host WOFF2 assets in `/assets/fonts/hud/` with deterministic filenames. Declare via `@font-face` in `hud-theme.tokens.scss`, set `font-display: swap`, and pin unicode ranges to keep payloads small.
- HUD/system text should include `-webkit-font-smoothing: none` and `text-rendering: optimizeSpeed` to keep stems aligned to integer pixels; narrative accent text may keep antialiasing for legibility.
- Do not rely on CDN imports at runtime; bundling the font files preserves determinism and offline readiness. Document hashes in release notes for integrity checks.

## Iconography Treatment
- **Stroke Weight**: 1px–2px strokes snapped to pixel grid; favor beveled corners over curves.
- **Fill**: Minimal flat fills; prefer negative space with brass/copper strokes and limited parchment fill.
- **Framing**: Square or shield outlines sized to 16px/24px; align icon baselines with button grid slots.
- **States**: Hover = `Highlight Copper` stroke with `Cool Shadow` inset; Active = thicker 2px brass stroke.
- **Asset base**: Kenney “Game Icons” (CC0) recolored to brass/ink is the canonical pack for the HUD; Game-Icons.net (CC BY 3.0) may supplement gaps with attribution. 0x72 Dungeon Tileset II sprites can backfill minimap markers. The custom brass/copper pilot set below follows the same palette and grid rules.

### Brass/copper HUD icon pilot (delivered)
- **Stroke discipline**: 1px outlines at 16px, 2px at 24px; no anti-aliasing or fractional coordinates. Palette locked to brass (`#c08a3b`), copper fill (`#d79a59`), ink shadow (`#1b2433`), and sparing highlight (`#f8f5e6`).
- **Grid + spacing**: Every glyph sits on a 16×16 or 24×24 canvas with integer padding; shapes stick to rectangles, straight segments, and crisp circles to avoid off-grid diagonals.
- **Coverage**: Inventory, ledger, map, trade, crew, quests, settings, help, status, notifications, helm, cargo, diplomacy, harbor, scouting, and craft. Assets live in `v1/src/assets/hud/icons/` with CSS variables in `theme/hud-theme.tokens.scss` and IDs in `assets/icons/hud-icon-manifest.ts`.
- **Preview**: `v1/src/assets/hud/icons/hud-icons-preview.svg` (generated alongside `preview.html`) shows both sizes for quick regressions and PR reviews.

## Application Notes
- Bottom HUD uses Secondary Background with brass edge; minimap frame can use copper corners plus inner shadow.
- Info panes and dialogs should default to Parchment with brass header bars and minimal cord/rope accent on top edge only.
- Peripheral badges (alerts, counts) should invert colors (dark plate, light ink) but avoid blinking/animation per charter.
- Minimap letterbox gutters share `--hud-letterbox-flat-fill` (`#0f0a1f`) and a higher-contrast stroke (`rgba(248, 245, 230, 0.38)`) to keep inset edges visible against dark map tiles while meeting AA contrast for overlay text.
