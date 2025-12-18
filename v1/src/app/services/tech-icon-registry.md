# Tech Icon Registry — Structural Taxonomy

The tech editor now consumes a **registry-backed icon taxonomy** to keep visual identifiers deterministic and culture-overlay friendly without inventing new enums. It operates at **Structural fidelity** and aligns with the UI and Level-of-Detail charters.

## Naming and casing rules

- Registry IDs are snake_case and **prefixed by category**: `structure_lumberyard`, `goods_mead`, `guild_scholars`, `settlement_trading_post`, `generic_research`.
- IDs normalize mixed-case enum inputs using the shared `normalizeIdentifier` helper; UI and import/export share the same mapping.
- Frames default to **shared**; overlays should sit on top (culture overlays, DLC frames) without redefining the base icon.

## Categories and sources

- Categories: `structure`, `goods`, `guild`, `settlement`, `generic`.
- Sources: subsets of authoritative enums (`StructureType`, `GoodsType`, `GuildType`, `SettlementType`) plus generic fallbacks.
- Registry entries specify `overlays: ['culture_overlay']` to signal shared assets that can accept sub-/superscript culture glyphs.

## Picker ergonomics

- The picker groups icons by category, limits visible primary actions, and uses deterministic ordering (category → label).
- Labels are humanized from enum values; frames stay consistent to respect the UI charter’s stability requirements.

## Extending the registry

- Add new enum-backed icons via `TechIconRegistryService.buildEnumBackedIcons` to avoid ad-hoc strings.
- Keep additions **small and deletable**; avoid bulk-generating the entire enum set until art assets exist.
- Prefer overlay hints to per-culture icons; shared frames keep DLC/expansion swaps deterministic.
