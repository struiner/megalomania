import { GoodsType } from '../../enums/GoodsType';
import { GuildType } from '../../enums/GuildType';
import { SettlementType } from '../../enums/SettlementType';
import { SettlementSpecialization } from '../../enums/SettlementSpecialization';
import { StructureType } from '../../enums/StructureType';
import { TechTree } from '../../models/tech-tree.models';

export const MIXED_CASE_TECH_TREE: TechTree = {
  tech_tree_id: 'mixed_case_research',
  version: 2,
  default_culture_tags: ['biome_taiga', 'settlement_trading_post'],
  metadata: { source_label: 'fixtures/tech-tree-normalization' },
  nodes: [
    {
      id: 'foundation_schema',
      title: 'Foundation Schema',
      summary: 'Baseline drafting for shared icon frame.',
      tier: 1,
      display_order: 1,
      culture_tags: ['biome_taiga'],
      prerequisites: [],
      effects: {
        unlock_structures: ['lumberYard' as unknown as StructureType],
        unlock_goods: ['Wood' as unknown as GoodsType],
      },
      metadata: { icon_id: 'structure_lumberyard' },
    },
    {
      id: 'mead_luxuries',
      title: 'Mead Luxuries',
      summary: 'Refinement of mixed-case inputs.',
      tier: 2,
      display_order: 2,
      culture_tags: ['guild_merchants'],
      prerequisites: [{ node: 'foundation_schema', relation: 'requires' }],
      effects: {
        unlock_structures: ['TownHall' as unknown as StructureType],
        unlock_goods: ['Mead', 'metalGoods'] as unknown as GoodsType[],
        grants_settlement_specialization: SettlementSpecialization.Trade,
      },
      metadata: { icon_id: 'goods_mead' },
    },
    {
      id: 'guild_patents',
      title: 'Guild Patents',
      summary: 'Edge case with max tier depth.',
      tier: 256,
      display_order: 99,
      culture_tags: ['guild_scholars', 'settlement_trading_post'],
      prerequisites: [{ node: 'mead_luxuries', relation: 'requires' }],
      effects: {
        unlock_settlements: [SettlementType.TradingPost],
        unlock_guilds: ['Scholars' as unknown as GuildType],
        guild_reputation: [{ guild: GuildType.Scholars, delta: 5 }],
      },
      metadata: { icon_id: 'guild_scholars' },
    },
  ],
};

export const OUT_OF_RANGE_TIER_TREE: TechTree = {
  ...MIXED_CASE_TECH_TREE,
  tech_tree_id: 'mixed_case_research_invalid',
  nodes: MIXED_CASE_TECH_TREE.nodes.map((node) => ({
    ...node,
    tier: node.id === 'guild_patents' ? 300 : node.tier,
  })),
};
