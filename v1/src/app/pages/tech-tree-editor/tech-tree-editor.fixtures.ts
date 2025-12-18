import { GoodsType } from '../../enums/GoodsType';
import { GuildType } from '../../enums/GuildType';
import { SettlementSpecialization } from '../../enums/SettlementSpecialization';
import { SettlementType } from '../../enums/SettlementType';
import { StructureType } from '../../enums/StructureType';
import { EditorTechTree } from './tech-tree-editor.types';

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
      category: 'craft',
      culture_tags: ['biome_taiga', 'settlement_hamlet'],
      prerequisites: [],
      effects: {
        unlock_structures: [StructureType.Lumberyard],
        unlock_goods: [GoodsType.Wood],
      },
    },
    {
      id: 'charcoal_kilns',
      title: 'Charcoal Kilns',
      summary: 'Stabilize fuel output for cold climates and caravans.',
      tier: 2,
      category: 'craft',
      culture_tags: ['biome_taiga', 'guild_merchants'],
      prerequisites: [{ node: 'logging_outposts', relation: 'requires' }],
      effects: {
        unlock_structures: [StructureType.Brickworks],
        unlock_goods: [GoodsType.Coal],
      },
    },
    {
      id: 'river_trading_rites',
      title: 'River Trading Rites',
      summary: 'Codify tolls and mooring privileges at frontier docks.',
      tier: 3,
      category: 'commerce',
      culture_tags: ['biome_beach', 'guild_merchants'],
      prerequisites: [{ node: 'charcoal_kilns', relation: 'requires' }],
      effects: {
        unlock_structures: [StructureType.Docks, StructureType.Harbor],
        unlock_goods: [GoodsType.Mead],
        grants_settlement_specialization: SettlementSpecialization.Trade,
      },
    },
    {
      id: 'scholar_exchange',
      title: 'Scholar Exchange',
      summary: 'Invite itinerant scholars to document guild practices.',
      tier: 4,
      category: 'doctrine',
      culture_tags: ['guild_scholars', 'settlement_trading_post'],
      prerequisites: [{ node: 'river_trading_rites', relation: 'requires' }],
      effects: {
        unlock_structures: [StructureType.TownHall],
        guild_reputation: [{ guild: GuildType.Scholars, delta: 10 }],
        research_rate_modifier: 0.1,
      },
    },
  ],
};
