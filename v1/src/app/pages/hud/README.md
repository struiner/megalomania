# HUD Structural Scaffold

This folder contains the Phase 2 structural HUD implementation scoped by the Gameplay HUD epic and its child tasks. The layout keeps the world viewport unobstructed while grounding the HUD along the bottom edge.

## Slots
- **Bottom HUD**: fixed, viewport-anchored container for info panes (left/right), 2×4 action grid (center), and the square minimap (right).
- **Overlay shell**: single tabbed overlay rendered via the `/game/interface/:panel` route for dialog placeholders.
- **Auxiliary dialog**: lightweight dialog shell for non-overlay actions (settings/help) that route into their owning domains, falling back to the HUD primer only when navigation is blocked.

## Auxiliary routing ownership (decided)
- **Settings** → Owned by the world configuration workspace. HUD launches `/world/generation` and only shows a stub fallback if navigation is blocked; HUD never stores configuration truth.
- **Help** → Owned by the design/reference documentation surface. HUD presents a short-form primer dialog with a CTA to `/game/design-doc` but does not hold tutorial or reference data locally.
- **Fallback + modal depth policy**: Route CTAs attempt navigation first; deterministic fallbacks render only on navigation failure. Auxiliary dialogs stack at most one layer above the overlay shell (depth ≤ 2).

### Auxiliary routing checklist
- [ ] Confirm `/world/generation` remains the canonical entry point for HUD settings and that copy points back to configuration ownership.
- [ ] Verify `/game/design-doc` is reachable from the HUD help primer and that HUD does not accumulate help/tutorial state.
- [ ] Keep overlay + auxiliary dialog stacks to two layers max; close stray dialogs after navigation fires.

## Notes
- Placeholder data is intentionally static; no gameplay truth is derived here.
- Spacing follows 16px multiples with 4px/8px gutters for pixel integrity.
- TODOs annotate pending clarifications (icon headers, tile density, route guards) now that auxiliary routing ownership is fixed.
- A reusable icon/header utility now frames info panes, dialogs, and overlay content for consistent hierarchy.
- HUD minimap sizing preserves a 512px baseline via a 64×64 tile preview sourced from `TilemapService` and scaled deterministically; scaling clamps to 0.25–0.5 with snapping to preferred steps (0.25/0.3125/0.375/0.5) based on the desired 160px target size. Letterboxing cushions smaller render sizes inside a fixed frame; the fill now resolves through HUD theme tokens (flat primary-ink swatch for shallow insets, textured brass/ink dither for 8px+ gaps) to keep contrast legible on constrained displays.
- Route guarding for `/game/interface/:panel` now evaluates feature-flag/init predicates through `HudAvailabilityService`, which consumes a dedicated capability snapshot service and emits HUD-native block notices.
- HUD block notices surface as a compact bottom-left banner, with safe-area inset handling mirrored across overlay shells and dialogs.
- The overlay shell is draggable (snap-to-4px grid) to keep dialogs from occluding the world viewport; bottom HUD uses fixed anchoring with padding reserves baked into the page layout and supports `env(safe-area-inset-bottom)`.
- Theme tokens live in `hud-theme-foundations.md` and the retrofit/audit plan lives in `hud-theme-retrofit-checklist.md`; follow-up asset/accessibility tasks are tracked under `tasks/2025-12-18_*`.
