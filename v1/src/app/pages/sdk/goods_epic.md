
Epic: Goods & Trade Goods Catalogue Manager

Purpose:
Provide a system to prototype new trade goods, manage categories and tiers, and export a goods catalogue for further balancing. The manager must integrate with existing goods, flora and category enums; compute derived fields (tier totals) and support deterministic JSON export.

In Scope:

Data model for ManagedGood combining GoodsType, category, tier, rarity, complexity, base price, flora sources and tags.

Deterministic provenance bindings that map goods to world biomes, flora and extraction/refinement structures via lookup tables (no simulation logic).

UI to create, edit and remove goods; display category/tier breakdown and filter/search goods.

Integration with existing GoodsType, FloraType and goods category definitions from the design document.

JSON export (and optional import) of goods catalogue.

Validation rules (title length, numeric ranges).

Ledger event definitions for goods catalogue changes if needed (structural fidelity).

Out of Scope:
Final pricing algorithms, economic simulation, or marketplace UI.

Seed Tasks:

Managed Good Data Model & Enum Integration.

Goods Provenance Alignment: deterministic lookup tables keyed by GoodsType → biome/region, flora sources, extraction/refinement structures and ledger references.

Goods Catalogue Import/Export Service (optional import).

Goods Manager UI Skeleton: structural form and list with filters, tier breakdown.

Derived Data & Stats: compute tier totals, map rarity to tier.

Ledger Event Wiring: record addition/removal or export events for goods.

Fixtures & Validation: provide sample provenance fixtures plus normalization/validation helpers that reject unknown enums and normalize casing/order.

Phases: planning, model & service creation, UI skeleton, stats & search implementation, review. Exit when goods can be added, listed, exported and integrated with existing enums without owning economic logic.

### Provenance & Ledger Notes (structural fidelity)
- Provenance metadata must remain deterministic: arrays are alphabetically ordered (biomes, flora, structures) and region tags are lower-snake case. Ledger references sort by stream → eventType → schemaRef.
- Lookup tables live alongside fixtures (structural) and never derive from simulation state; they reference authoritative enums (`BiomeType`, `FloraType`, `StructureType`, `GoodsType`).
- Ledger evidence is captured as stream/event/schema pointers and optional hash anchors so future audit pipelines can replay genesis siting and production events without UI ownership.
