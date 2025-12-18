# Task Specification — HUD Icon Asset Pack Sourcing

**STATUS: NEW — requires Game Designer/Art direction decision; charter alignment approved for Phase 2 sequencing**

## Task Summary
Select and authorize a canonical pixel icon asset pack (or sprite sheet commission) to replace placeholder glyphs used by the HUD icon component while maintaining licensing clarity.

## Purpose and Scope
- Choose a 16×16 (with 2× scale) pixel-art icon set that aligns with the Hanseatic HUD aesthetic.
- Confirm licensing for production use (commercial-friendly, redistributable).
- Provide a small pilot set mapped to existing HUD actions and headers.

## Explicit Non-Goals
- No direct code integration beyond referencing the chosen pack.
- No icon animation or shader effects.
- No redesign of the HUD icon framing component.

## Fidelity & Constraints
- **Decision/clarification fidelity**: outputs are asset selections and licensing notes.
- Icons must respect pixel-grid integrity (integer scaling) and avoid sub-pixel smoothing.
- Prefer etched/engraved tonality over flat glyphs to match the HUD instrument framing.

## Agent Assignments
- **Owner / Executor:** Game Designer (with Art direction support)
- **Consulted:** Frontend Developer (technical delivery), Legal/Publishing (licensing verification)
- **QA:** Verify accessibility contrast and fallback behavior if assets fail to load.

## Deliverables
- Named icon pack selection with licensing summary and source links.
- Mapping table from HUD actions/headers to sprite identifiers.
- Recommendation for fallback glyph policy if assets are unavailable.

## Review Gate
- [x] Licensing cleared for commercial redistribution.
- [x] Icon tone validated against UI & Ergonomics Charter.
- [x] Mapping covers all current HUD icon usages.
- **Approvers:** Project Manager + Architecture Steward; Game Designer owns aesthetic decision.

## Dependencies & Sequencing
- Depends on: HUD Font Asset Clarification for typography alignment and licensing guardrails.
- Precedes: HUD Icon Functionality Integration and downstream HUD pane/button icon adoption.
- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Should primary action icons receive a heavier bevel or color accent compared to informational headers?
    answer: yes
- Is a custom commission preferred over an existing pack to guarantee exclusivity?
    answer: not really, aesthetics and recognizeability are paramount.

## Decision Log (2025-12-18)
- **Selected pack**: Kenney “Game Icons” (CC0) as the canonical HUD source; recolor to brass/ink per theme foundations. Supplemental: Game-Icons.net (CC BY 3.0, attribution required) only if a glyph is missing; 0x72 Dungeon Tileset II sprites can backfill minimap markers.
- **Pilot mapping**: Inventory → `backpack`; Ledger → `ledger`/`book`; Map → `map`; Crew → `group`; Trade → `scales`; Quests → `compass` (fallback `star`); Settings → `cog`; Help → `question`; Status header → `anchor`; Notifications header → `bell`. (See `v1/src/app/pages/hud/hud-icon-asset-pack-sourcing.md` for integration steps.)
- **Palette fit**: Two-tone brass stroke on parchment/dark wood plates, optional cool shadow inset; restrict to 1–2 colors to maintain engraved tone.
- **Integration next steps**: Generate 16px/32px sprite atlases, add SCSS tokens/hooks, and keep emoji glyphs as runtime fallback until sprite loading is wired. Attribution string must be added if any Game-Icons.net glyphs enter the atlas.
