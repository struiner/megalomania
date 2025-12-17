# HUD Structural Scaffold

This folder contains the Phase 2 structural HUD implementation scoped by the Gameplay HUD epic and its child tasks. The layout keeps the world viewport unobstructed while grounding the HUD along the bottom edge.

## Slots
- **Bottom HUD**: fixed, viewport-anchored container for info panes (left/right), 2×4 action grid (center), and the square minimap (right).
- **Overlay shell**: single tabbed overlay rendered via the `/game/interface/:panel` route for dialog placeholders.
- **Auxiliary dialog**: lightweight dialog shell for non-overlay actions (settings/help) while targets are clarified.
 - **Auxiliary dialog**: lightweight dialog shell for non-overlay actions (settings/help) while targets are clarified. Settings/help now map to dialog shells with CTA routes; TODO markers flag final destinations.

## Notes
- Placeholder data is intentionally static; no gameplay truth is derived here.
- Spacing follows 16px multiples with 4px/8px gutters for pixel integrity.
- TODOs annotate pending clarifications (icon headers, tile density, action targets, route guards).
- A reusable icon/header utility now frames info panes, dialogs, and overlay content for consistent hierarchy.
- HUD minimap sizing preserves a 512px baseline via a 64×64 tile preview sourced from `TilemapService` and scaled deterministically; marker hooks are stubbed for future overlays.
- Route guarding for `/game/interface/:panel` now evaluates feature-flag/init predicates through `HudAvailabilityService`, which consumes a dedicated capability snapshot service and emits HUD-native block notices.
- HUD block notices surface as a compact bottom-left banner, with safe-area inset handling mirrored across overlay shells and dialogs.
- The overlay shell is draggable (snap-to-4px grid) to keep dialogs from occluding the world viewport; bottom HUD uses fixed anchoring with padding reserves baked into the page layout and supports `env(safe-area-inset-bottom)`.
