/**
 * GOODS LEDGER EVENT FIXTURES
 * Sample fixtures demonstrating valid goods ledger events for testing and documentation
 */

import { GoodsType } from '../enums/GoodsType';
import { ManagedGood } from '../services/goods-catalog-io.service';
import {
  GoodsLedgerEvent,
  GoodsCreatedPayload,
  GoodsUpdatedPayload,
  GoodsDeletedPayload,
  GoodsExportedPayload,
  CatalogExportedPayload,
  CrossPlayerValidation,
} from '../models/goods-ledger.models';
import { PlayerID, Hash128 } from '../models/anna-readme.models';
import { LedgerEvent } from '../models/ledger.models';

/**
 * Sample player IDs for testing
 */
export const SAMPLE_PLAYER_IDS = {
  ARCHITECT: 'player_architekt_1234567890abcdef' as PlayerID,
  ECONOMIST: 'player_economist_abcdef1234567890' as PlayerID,
  MERCHANT: 'player_merchant_567890abcdef1234' as PlayerID,
  SYSTEM: 'system_auto_generated' as PlayerID,
} as const;

/**
 * Sample managed goods for testing
 */
export const SAMPLE_MANAGED_GOODS: ManagedGood[] = [
  {
    type: GoodsType.Wood,
    name: 'Oak Timber',
    category: 'RawMaterial',
    description: 'High-quality oak wood perfect for construction and crafting',
    tags: ['construction', 'crafting', 'building'],
    rarity: 1,
    complexity: 1,
    basePrice: 50,
  },
  {
    type: GoodsType.Iron,
    name: 'Iron Ingots',
    category: 'RawMaterial',
    description: 'Refined iron ingots ready for metalworking',
    tags: ['metalworking', 'tools', 'weapons'],
    rarity: 2,
    complexity: 3,
    basePrice: 120,
    components: [
      { type: GoodsType.Coal, amount: 2 },
      { type: GoodsType.Iron, amount: 5 }
    ]
  },
  {
    type: GoodsType.Beer,
    name: 'Dwarven Ale',
    category: 'Food',
    description: 'Strong fermented beverage favored by mountain clans',
    tags: ['beverage', 'alcohol', 'luxury'],
    rarity: 3,
    complexity: 4,
    basePrice: 85,
    components: [
      { type: GoodsType.Grain, amount: 6 },
      { type: GoodsType.Honey, amount: 1 }
    ]
  },
  {
    type: GoodsType.Spices,
    name: 'Phoenix Pepper',
    category: 'Luxury',
    description: 'Extremely rare and valuable spice with fiery properties',
    tags: ['luxury', 'magic', 'cooking'],
    rarity: 5,
    complexity: 5,
    basePrice: 500,
    components: [
      { type: GoodsType.Spices, amount: 1 },
      { type: GoodsType.Glassware, amount: 1 }
    ]
  },
];

/**
 * Sample cross-player validation configuration
 */
export const SAMPLE_CROSS_PLAYER_VALIDATION: CrossPlayerValidation = {
  validators: [
    SAMPLE_PLAYER_IDS.ARCHITECT,
    SAMPLE_PLAYER_IDS.ECONOMIST,
    SAMPLE_PLAYER_IDS.MERCHANT,
  ],
  expectedCultureTags: ['guild_trading', 'settlement_mountain'],
  validationNotes: 'Cross-validated by three major player factions',
};

/**
 * Valid goods created event fixture
 */
export function createGoodsCreatedEventFixture(): LedgerEvent<GoodsCreatedPayload> {
  const good = SAMPLE_MANAGED_GOODS[0]; // Oak Timber
  
  return {
    type: 'GOOD_CREATED',
    description: `Good created: ${good.name} (${good.type})`,
    payload: {
      good,
      checksum128: 'a1b2c3d4e5f6789012345678901234567890abcd' as Hash128,
      serializationRulesVersion: '1.0.0',
      source: 'sdk',
      initiatedBy: SAMPLE_PLAYER_IDS.ARCHITECT,
      minuteTimestampIso: '2025-12-19T09:30:00.000Z',
      importOrder: 1,
      creationNotes: 'Initial import of construction materials',
    },
    resourceDelta: {},
    apply: () => console.log(`[Fixture] Applying good creation: ${good.name}`),
    reverse: () => console.log(`[Fixture] Reversing good creation: ${good.name}`),
  };
}

/**
 * Valid goods updated event fixture
 */
export function createGoodsUpdatedEventFixture(): LedgerEvent<GoodsUpdatedPayload> {
  const currentGood = {
    ...SAMPLE_MANAGED_GOODS[1], // Iron Ingots
    basePrice: 130, // Price updated from 120 to 130
    description: 'Refined iron ingots ready for advanced metalworking',
  };
  
  const previousGood = SAMPLE_MANAGED_GOODS[1];
  
  return {
    type: 'GOOD_UPDATED',
    description: `Good updated: ${currentGood.name} (${currentGood.type})`,
    payload: {
      good: currentGood,
      previousGood,
      checksum128: 'b2c3d4e5f6789012345678901234567890abcd12' as Hash128,
      serializationRulesVersion: '1.0.0',
      source: 'sdk',
      initiatedBy: SAMPLE_PLAYER_IDS.ECONOMIST,
      minuteTimestampIso: '2025-12-19T09:31:00.000Z',
      changeSummary: 'Updated base price due to market conditions',
      changeNotes: 'Increased price by 10 units to reflect increased demand',
    },
    resourceDelta: {},
    apply: () => console.log(`[Fixture] Applying good update: ${currentGood.name}`),
    reverse: () => console.log(`[Fixture] Reversing good update: ${currentGood.name}`),
  };
}

/**
 * Valid goods deleted event fixture
 */
export function createGoodsDeletedEventFixture(): LedgerEvent<GoodsDeletedPayload> {
  const good = SAMPLE_MANAGED_GOODS[2]; // Dwarven Ale
  
  return {
    type: 'GOOD_DELETED',
    description: `Good deleted: ${good.name} (${good.type})`,
    payload: {
      good,
      checksum128: 'c3d4e5f6789012345678901234567890abcd1234' as Hash128,
      serializationRulesVersion: '1.0.0',
      source: 'sdk',
      initiatedBy: SAMPLE_PLAYER_IDS.MERCHANT,
      minuteTimestampIso: '2025-12-19T09:32:00.000Z',
      reason: 'duplicate',
      deletionNotes: 'Duplicate entry found during catalog cleanup',
    },
    resourceDelta: {},
    apply: () => console.log(`[Fixture] Applying good deletion: ${good.name}`),
    reverse: () => console.log(`[Fixture] Reversing good deletion: ${good.name}`),
  };
}

/**
 * Valid goods exported event fixture
 */
export function createGoodsExportedEventFixture(): LedgerEvent<GoodsExportedPayload> {
  const good = SAMPLE_MANAGED_GOODS[3]; // Phoenix Pepper
  
  return {
    type: 'GOOD_EXPORTED',
    description: `Good exported: ${good.name} (${good.type})`,
    payload: {
      good,
      checksum128: 'd4e5f6789012345678901234567890abcd123456' as Hash128,
      serializationRulesVersion: '1.0.0',
      source: 'sdk',
      initiatedBy: SAMPLE_PLAYER_IDS.SYSTEM,
      minuteTimestampIso: '2025-12-19T09:33:00.000Z',
      exportFormat: 'json',
      exportHash: 'e5f6789012345678901234567890abcd12345678' as Hash128,
      exportNotes: 'Exported for inter-server trading agreement',
    },
    resourceDelta: {},
    apply: () => console.log(`[Fixture] Recording good export: ${good.name}`),
    reverse: () => console.log(`[Fixture] Invalidating good export: ${good.name}`),
  };
}

/**
 * Valid catalog exported event fixture
 */
export function createCatalogExportedEventFixture(): LedgerEvent<CatalogExportedPayload> {
  const exportedGoods = SAMPLE_MANAGED_GOODS.map(g => g.type);
  
  return {
    type: 'CATALOG_EXPORTED',
    description: `Catalog exported: ${exportedGoods.length} goods`,
    payload: {
      catalogHash: 'f6789012345678901234567890abcd1234567890' as Hash128,
      totalGoodsExported: exportedGoods.length,
      exportFormat: 'json',
      exportedGoods,
      initiatedBy: SAMPLE_PLAYER_IDS.ARCHITECT,
      minuteTimestampIso: '2025-12-19T09:34:00.000Z',
      exportRulesVersion: '1.0.0',
      crossPlayerValidation: SAMPLE_CROSS_PLAYER_VALIDATION,
      exportNotes: 'Full catalog export for world synchronization',
    },
    resourceDelta: {},
    apply: () => console.log(`[Fixture] Recording catalog export: ${exportedGoods.length} goods`),
    reverse: () => console.log(`[Fixture] Invalidating catalog export: ${exportedGoods.length} goods`),
  };
}

/**
 * Complete fixture set containing all valid event types
 */
export const GOODS_LEDGER_EVENT_FIXTURES = {
  goodsCreated: createGoodsCreatedEventFixture(),
  goodsUpdated: createGoodsUpdatedEventFixture(),
  goodsDeleted: createGoodsDeletedEventFixture(),
  goodsExported: createGoodsExportedEventFixture(),
  catalogExported: createCatalogExportedEventFixture(),
} as const;

/**
 * Batch fixture for testing multiple events
 */
export function createBatchEventFixture(): GoodsLedgerEvent[] {
  return [
    createGoodsCreatedEventFixture(),
    createGoodsUpdatedEventFixture(),
    createGoodsExportedEventFixture(),
  ];
}

/**
 * Fixture for testing validation scenarios
 */
export const INVALID_EVENT_FIXTURES = {
  // Missing required fields
  missingChecksum: {
    ...createGoodsCreatedEventFixture(),
    payload: {
      ...createGoodsCreatedEventFixture().payload,
      checksum128: undefined as any,
    }
  },
  
  // Invalid timestamp format
  invalidTimestamp: {
    ...createGoodsCreatedEventFixture(),
    payload: {
      ...createGoodsCreatedEventFixture().payload,
      minuteTimestampIso: 'invalid-timestamp',
    }
  },
  
  // Missing actor metadata
  missingActor: {
    ...createGoodsCreatedEventFixture(),
    payload: {
      ...createGoodsCreatedEventFixture().payload,
      initiatedBy: undefined as any,
    }
  },
  
  // Invalid export format
  invalidExportFormat: {
    ...createGoodsExportedEventFixture(),
    payload: {
      ...createGoodsExportedEventFixture().payload,
      exportFormat: 'invalid_format' as any,
    }
  },
} as const;

/**
 * Performance test fixture with many goods
 */
export function createPerformanceTestFixture(goodsCount: number = 100): GoodsLedgerEvent[] {
  const events: GoodsLedgerEvent[] = [];
  
  for (let i = 0; i < goodsCount; i++) {
    const good: ManagedGood = {
      type: Object.values(GoodsType)[i % Object.values(GoodsType).length],
      name: `Performance Test Good ${i}`,
      category: 'RawMaterial',
      description: `Test good number ${i} for performance testing`,
      tags: ['performance-test'],
      rarity: (i % 5) + 1,
      complexity: (i % 5) + 1,
      basePrice: (i * 10) + 50,
    };
    
    const event: LedgerEvent<GoodsCreatedPayload> = {
      type: 'GOOD_CREATED',
      description: `Performance test good created: ${good.name}`,
      payload: {
        good,
        checksum128: `performance_test_${i}_checksum` as Hash128,
        serializationRulesVersion: '1.0.0',
        source: 'sdk',
        initiatedBy: SAMPLE_PLAYER_IDS.SYSTEM,
        minuteTimestampIso: new Date(Date.now() + i * 60000).toISOString(), // Each event 1 minute apart
        importOrder: i,
        creationNotes: `Performance test batch, item ${i}`,
      },
      resourceDelta: {},
      apply: () => {},
      reverse: () => {},
    };
    
    events.push(event);
  }
  
  return events;
}