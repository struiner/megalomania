# HUD Structural Scaffold

This folder contains the Phase 2 structural HUD implementation scoped by the Gameplay HUD epic and its child tasks. The layout keeps the world viewport unobstructed while grounding the HUD along the bottom edge.

## Slots
- **Bottom HUD**: anchored container for info panes (left/right), 2×4 action grid (center), and the square minimap (right).
- **Overlay shell**: single tabbed overlay rendered via the `/game/interface/:panel` route for dialog placeholders.

## Notes
- Placeholder data is intentionally static; no gameplay truth is derived here.
- Spacing follows 16px multiples with 4px/8px gutters for pixel integrity.
- TODOs annotate pending clarifications (icon headers, tile density, action targets, route guards).
