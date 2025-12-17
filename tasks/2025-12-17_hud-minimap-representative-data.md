# Task Specification — HUD Minimap Representative Data

**STATUS: TODO — pending execution.**

## Task Summary
Replace the static placeholder minimap grid with representative data sourced from map-generation services, honoring the 512×512 source resolution and preserving pixel integrity within the HUD slot.【F:v1/src/app/pages/hud/components/hud-minimap.component.ts†L12-L34】

## Purpose and Scope
- Wire the minimap component to ingest sample chunk data from existing map-generation/rendering services without embedding gameplay logic in the UI.
- Demonstrate layering of basic markers/overlays using supplied view models while staying within structural fidelity for styling.
- Document input contracts (tile size, scaling, chunk selection) so future integrations can swap in live data deterministically.

## Explicit Non-Goals
- No live networking or ledger-driven updates; use deterministic fixtures from map-generation APIs.
- No zoom, pan, or interactive controls beyond current display-scale inputs.
- No performance optimizations beyond ensuring integer scaling.

## Fidelity & Constraints
- Target **Structural-to-Functional transition**: visualizes real data but keeps minimal interaction.
- Maintain square aspect and pixel-aligned rendering; avoid smoothing or resampling artifacts.
- Keep UI free of world-state derivations; consume provided view data only.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** World Generator (fixture data), Architecture Steward (truth boundaries), QA (determinism checks)
- **Inform:** Game Designer for peripheral readability feedback.

## Deliverables
- Minimap inputs updated to consume representative fixture data (e.g., generated chunk PNGs or tile matrices) with clear typing.
- Sample overlay/marker hook demonstrating how map-generation annotations will appear.
- README/inline documentation describing data source, scaling assumptions, and replacement steps for live integration.

## Review Gate
- [ ] Minimap renders representative data at 512×512 source resolution without blurring or clipping.
- [ ] No gameplay or simulation logic exists in the UI layer; data is provided externally.
- [ ] Peripheral attention and HUD layout remain compliant with ergonomics charter.

## Dependencies & Sequencing
- Depends on: Existing minimap component and bottom HUD scaffold.
- Related to: World renderer/tilemap services providing deterministic fixture outputs.

## Open Questions / Clarifications
- Which map-generation fixtures (biomes, elevation, settlement overlays) best represent intended gameplay at this stage?
- Should overlay markers share the HUD icon/header utility for consistent framing?
