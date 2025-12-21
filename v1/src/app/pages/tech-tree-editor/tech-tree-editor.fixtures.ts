import { GoodsType } from '../../enums/GoodsType';
import { GuildType } from '../../enums/GuildType';
import { SettlementSpecialization } from '../../enums/SettlementSpecialization';
import { SettlementType } from '../../enums/SettlementType';
import { StructureType } from '../../enums/StructureType';
import { TECH_PREREQUISITE_RELATION } from '../../models/tech-tree.models';
import { EditorTechNode, EditorTechTree } from './tech-tree-editor.types';

export const TECH_TREE_FIXTURE_DOCUMENT: EditorTechTree = {
  tech_tree_id: 'northern_trade_v1',
  version: 1,
  default_culture_tags: ['biome_taiga', 'settlement_trading_post'],
  metadata: { source_label: 'fixtures/tech-tree-fixtures' },
  nodes: [
    {
      id: 'logging_outposts',
      title: 'Logging Outposts',
      summary: 'Formalize timber camps to feed nascent trade routes.',
      tier: 1,
      display_order: 1,
      category: 'craft',
      culture_tags: ['biome_taiga', 'settlement_hamlet'],
      prerequisites: [],
      effects: {
        unlock_structures: [StructureType.Lumberyard],
        unlock_goods: [GoodsType.Wood],
      },
      metadata: { icon_id: 'structure_lumberyard' },
    },
    {
      id: 'charcoal_kilns',
      title: 'Charcoal Kilns',
      summary: 'Stabilize fuel output for cold climates and caravans.',
      tier: 2,
      display_order: 2,
      category: 'craft',
      culture_tags: ['biome_taiga', 'guild_merchants'],
      prerequisites: [{ node: 'logging_outposts', relation: 'requires' }],
      effects: {
        unlock_structures: [StructureType.Brickworks],
        unlock_goods: [GoodsType.Coal],
      },
      metadata: { icon_id: 'goods_coal' },
    },
    {
      id: 'river_trading_rites',
      title: 'River Trading Rites',
      summary: 'Codify tolls and mooring privileges at frontier docks.',
      tier: 3,
      display_order: 3,
      category: 'commerce',
      culture_tags: ['biome_beach', 'guild_merchants'],
      prerequisites: [{ node: 'charcoal_kilns', relation: 'requires' }],
      effects: {
        unlock_structures: [StructureType.Docks, StructureType.Harbor],
        unlock_goods: [GoodsType.Mead],
        grants_settlement_specialization: SettlementSpecialization.Trade,
      },
      metadata: { icon_id: 'structure_harbor' },
    },
    {
      id: 'scholar_exchange',
      title: 'Scholar Exchange',
      summary: 'Invite itinerant scholars to document guild practices.',
      tier: 4,
      display_order: 4,
      category: 'doctrine',
      culture_tags: ['guild_scholars', 'settlement_trading_post'],
      prerequisites: [{ node: 'river_trading_rites', relation: 'requires' }],
      effects: {
        unlock_structures: [StructureType.TownHall],
        guild_reputation: [{ guild: GuildType.Scholars, delta: 10 }],
        research_rate_modifier: 0.1,
      },
      metadata: { icon_id: 'guild_scholars' },
    },
  ],
};

export const TECH_TREE_PERFORMANCE_FIXTURE: EditorTechTree = {
  tech_tree_id: 'perf_harness',
  version: 1,
  default_culture_tags: [],
  metadata: { source_label: 'fixtures/perf-harness' },
  nodes: Array.from({ length: 140 }, (_, index) => {
    const id = `perf_node_${index + 1}`;
    const previous = index > 0 ? `perf_node_${index}` : null;
    const tier = (index % 8) + 1;
    const displayOrder = (index % 12) + 1;
    return {
      id,
      title: `Performance Node ${index + 1}`,
      summary: `Virtualized fixture node #${index + 1} for perf harness.`,
      tier,
      display_order: displayOrder,
      category: 'performance',
      culture_tags: [],
      prerequisites: previous ? [{ node: previous, relation: TECH_PREREQUISITE_RELATION.Requires }] : [],
      effects: { unlock_goods: [GoodsType.Wood] },
    } as EditorTechNode;
  }),
};
