
Epic: Goods & Trade Goods Catalogue Manager

Purpose:
Provide a system to prototype new trade goods, manage categories and tiers, and export a goods catalogue for further balancing. The manager must integrate with existing goods, flora and category enums; compute derived fields (tier totals) and support deterministic JSON export.

In Scope:

Data model for ManagedGood combining GoodsType, category, tier, rarity, complexity, base price, flora sources and tags.

UI to create, edit and remove goods; display category/tier breakdown and filter/search goods.

Integration with existing GoodsType, FloraType and goods category definitions from the design document.

JSON export (and optional import) of goods catalogue.

Validation rules (title length, numeric ranges).

Ledger event definitions for goods catalogue changes if needed (structural fidelity).

Out of Scope:
Final pricing algorithms, economic simulation, or marketplace UI.

Seed Tasks:

Managed Good Data Model & Enum Integration.

Goods Catalogue Import/Export Service (optional import).

Goods Manager UI Skeleton: structural form and list with filters, tier breakdown.

Derived Data & Stats: compute tier totals, map rarity to tier.

Ledger Event Wiring: record addition/removal or export events for goods.

Phases: planning, model & service creation, UI skeleton, stats & search implementation, review. Exit when goods can be added, listed, exported and integrated with existing enums without owning economic logic.