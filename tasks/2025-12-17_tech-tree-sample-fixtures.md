# Tech Tree Sample Fixtures & Culture Tag Vocabulary

**STATUS: COMPLETE (Sample vocabulary and deterministic fixtures available for validation/import testing)**

**Purpose:** Provide deterministic, enum-aligned examples that downstream import/export and validation tasks can reuse without inventing identifiers. The fixtures below stay within authoritative enum sets in `v1/src/app/enums` and keep node identifiers snake_cased as per the data model guidance.

## Canonical Culture Tag Vocabulary (enum sourced)

| Tag Id (snake_case) | Enum Source | Enum Member | Underlying Identifier | Notes |
| --- | --- | --- | --- | --- |
| `biome_taiga` | `Biome` | `Biome.Taiga` | `"taiga"` | Cold forest archetype; aligns to world generation outputs. |
| `biome_beach` | `Biome` | `Biome.Beach` | `"beach"` | Coastal shallows; used for seafaring/algae branches. |
| `settlement_trading_post` | `SettlementType` | `SettlementType.TradingPost` | `"trading_post"` | Early mercantile hub; deterministic snake_case identifier. |
| `settlement_hamlet` | `SettlementType` | `SettlementType.Hamlet` | `"hamlet"` | Smallest permanent settlement. |
| `guild_merchants` | `GuildType` | `GuildType.Merchants` | `"merchants"` | Trade-first cultures. |
| `guild_scholars` | `GuildType` | `GuildType.Scholars` | `"scholars"` | Knowledge-focused branch hooks. |

**Usage rule:** culture tags are namespaced by their source enum (`biome_*`, `settlement_*`, `guild_*`). The suffix must match the enum member identifier (lowercased, snake_cased) to allow deterministic validation and lossless round-tripping.

## Sample Tech Tree (enum-aligned, culture-tagged)

```ts
// Compatible with the TechTree/TechNode data model task expectations.
const northern_trade_tree_v1 = {
  tech_tree_id: "northern_trade_v1",
  version: 1,
  default_culture_tags: ["biome_taiga", "settlement_trading_post"],
  nodes: [
    {
      id: "logging_outposts",
      title: "Logging Outposts",
      summary: "Formalize timber camps to feed nascent trade routes.",
      culture_tags: ["biome_taiga", "settlement_hamlet"],
      prerequisites: [],
      effects: {
        unlock_structures: [StructureType.Lumberyard],
        unlock_goods: [GoodsType.Wood],
      },
    },
    {
      id: "charcoal_kilns",
      title: "Charcoal Kilns",
      summary: "Stabilize fuel output for cold climates and caravans.",
      culture_tags: ["biome_taiga", "guild_merchants"],
      prerequisites: [
        { node: "logging_outposts", relation: "requires" },
      ],
      effects: {
        unlock_structures: [StructureType.Brickworks],
        unlock_goods: [GoodsType.Coal],
      },
    },
    {
      id: "river_trading_rites",
      title: "River Trading Rites",
      summary: "Codify tolls and mooring privileges at frontier docks.",
      culture_tags: ["biome_beach", "guild_merchants"],
      prerequisites: [
        { node: "charcoal_kilns", relation: "requires" },
      ],
      effects: {
        unlock_structures: [StructureType.Docks, StructureType.Harbor],
        unlock_goods: [GoodsType.Mead],
        grants_settlement_specialization: SettlementSpecialization.Trade,
      },
    },
    {
      id: "scholar_exchange",
      title: "Scholar Exchange",
      summary: "Invite itinerant scholars to document guild practices.",
      culture_tags: ["guild_scholars", "settlement_trading_post"],
      prerequisites: [
        { node: "river_trading_rites", relation: "requires" },
      ],
      effects: {
        unlock_structures: [StructureType.TownHall],
        guild_reputation: { guild: GuildType.Scholars, delta: +10 },
        research_rate_modifier: 0.1,
      },
    },
  ],
  ordering: {
    nodes: [
      "logging_outposts",
      "charcoal_kilns",
      "river_trading_rites",
      "scholar_exchange",
    ],
    prerequisites: {
      logging_outposts: [],
      charcoal_kilns: ["logging_outposts"],
      river_trading_rites: ["charcoal_kilns"],
      scholar_exchange: ["river_trading_rites"],
    },
  },
} as const;
```

### Validation Notes

- **Enum alignment:** `StructureType` and `GoodsType` identifiers reference existing enum members; culture tags are constrained to the vocabulary table above.
- **Determinism:** node and prerequisite ordering are declared explicitly to assist import/export stability.
- **Prerequisites:** single-parent chain used for simplicity; import/export tasks can extend the same shape to validate acyclic graphs.
- **Culture coverage:** every node carries at least one culture tag; tree-level defaults mirror taiga + trading-post roots and propagate downstream unless overridden.

**Evidence:** JSON fixtures reside in `v1/src/app/data/tech-trees`, and the editor fixture (`v1/src/app/pages/tech-tree-editor/tech-tree-editor.fixtures.ts`) mirrors the canonical sample for UI wiring.
