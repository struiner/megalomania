# HUD Brass/Copper Icon Set

This directory contains the pixel-aligned HUD icon pilot set (16px and 24px) used by the button grid and info pane headers.

## Stroke + spacing rules
- Stroke weight: 1px at 16px, 2px at 24px; mitered corners, no antialiasing.
- Palette: brass stroke `#c08a3b`, copper fill `#d79a59`, ink shadow `#1b2433`, highlight `#f8f5e6`.
- Grid: integer coordinates only; shapes sit on a 16×16 or 24×24 canvas with consistent padding gutters.
- Fill hierarchy: copper for solids, ink for shadows/supports, highlight for markers/reticles; outlines always brass.

## Icons (16/24)
- Primary actions: inventory, ledger, map, trade, crew, quests, settings, help.
- Headers and overlays: status, notifications.
- Supplemental HUD affordances: helm, cargo, diplomacy, harbor, scouting, craft.

## Usage
- Assets are exposed via CSS custom properties in `v1/src/app/pages/hud/theme/hud-theme.tokens.scss` and via the TypeScript manifest `v1/src/app/pages/hud/assets/icons/hud-icon-manifest.ts`.
- Button grid and info pane headers use `<app-hud-icon>` with `iconId` mapped to these filenames; the component selects 16px or 24px automatically.
- Keep additions aligned to the same palette and stroke rules; prefer rectangles and straight segments to preserve the 1-bit silhouette.

## Preview
- `hud-icons-preview.svg`: baked overview of all 16px/24px variants.
- `preview.html`: quick grid to review the raw SVGs in a browser; use a headless screenshot to refresh a PNG as needed.
