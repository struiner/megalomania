# Task Specification — HUD Minimap Marker Fixtures

**STATUS: NEW — awaiting Game Designer input on landmark priorities**

## Task Summary
Define the default set of minimap markers used by the HUD preview (biome centers, settlements, points of interest) to replace placeholder glyphs and labels.

## Purpose and Scope
- Curate a small, representative marker set for the HUD minimap preview.
- Assign glyphs and labels that match the Hanseatic tone and avoid clutter.
- Document normalization rules for marker coordinates and z-ordering.

## Explicit Non-Goals
- No gameplay simulation changes or new world events.
- No dynamic marker filtering/animation logic.
- No map rendering changes beyond marker selection.

## Fidelity & Constraints
- **Decision/clarification fidelity**: outputs are marker definitions and ordering rules.
- Glyphs must be compatible with the HUD icon/font strategy (pixel-safe, legible at 16px).
- Marker count should preserve peripheral attention—avoid overcrowding the preview.

## Agent Assignments
- **Owner / Executor:** Game Designer
- **Consulted:** World Generator (source data), Frontend Developer (render constraints)
- **QA:** Validate contrast and occlusion within the current letterboxed minimap frame.

## Deliverables
- Marker list with labels, glyphs, and normalized coordinates.
- Ordering rules for overlapping markers (priority tiers).
- Recommendation for future data-driven marker replacement once ledger/world feeds are live.

## Review Gate
- [ ] Marker set maintains readability within letterboxed minimap frame.
- [ ] Glyph choices align with Hanseatic aesthetic and pixel integrity.
- [ ] No gameplay truth invented in the UI.
- **Approvers:** Project Manager + Architecture Steward; Game Designer owns selection.

## Open Questions / Clarifications
- Which landmarks best represent the pre-simulated world for a static preview (ports, guild halls, biome cores)?
- Should markers adapt based on faction allegiance or remain neutral in the HUD preview state?
