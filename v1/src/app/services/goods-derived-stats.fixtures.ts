/**
 * GOODS DERIVED STATS SERVICE - SAMPLE FIXTURES AND TESTS
 * 
 * Provides test data and verification fixtures for the goods-derived-stats service.
 * Demonstrates usage patterns and validates functionality.
 */

import { GoodsType } from '../enums/GoodsType';
import { GoodCategory, Rarity } from '../models/goods.model';
import { 
  ManagedGood, 
  GoodsDerivedStats, 
  TierBreakdown, 
  RarityBreakdown, 
  CategoryBreakdown, 
  CultureAggregate,
  ValidationWarning,
  RarityTierMapping
} from '../services/goods-derived-stats.service';

/**
 * Sample test data representing various goods across different categories,
 * rarities, complexities, and culture associations
 */
export const SAMPLE_GOODS_FIXTURES: ManagedGood[] = [
  // Basic raw materials (Common, Tier 1-2)
  {
    type: GoodsType.Wood,
    title: 'Wood',
    rarity: 1,
    complexity: 1,
    basePrice: 10,
    category: GoodCategory.RawMaterial,
    cultureTags: ['biome_forest', 'settlement_hamlet']
  },
  {
    type: GoodsType.Brick,
    title: 'Brick',
    rarity: 1,
    complexity: 1,
    basePrice: 8,
    category: GoodCategory.RawMaterial,
    cultureTags: ['biome_mountain', 'settlement_village']
  },
  {
    type: GoodsType.Iron,
    title: 'Iron Ore',
    rarity: 2,
    complexity: 2,
    basePrice: 25,
    category: GoodCategory.RawMaterial,
    cultureTags: ['biome_mountain', 'guild_artisans']
  },

  // Food products (Various rarities)
  {
    type: GoodsType.Grain,
    title: 'Grain',
    rarity: 1,
    complexity: 1,
    basePrice: 5,
    category: GoodCategory.Food,
    cultureTags: ['biome_plains', 'settlement_village']
  },
  {
    type: GoodsType.Honey,
    title: 'Honey',
    rarity: 2,
    complexity: 2,
    basePrice: 15,
    category: GoodCategory.Food,
    cultureTags: ['biome_forest', 'settlement_hamlet']
  },
  {
    type: GoodsType.Beer,
    title: 'Beer',
    rarity: 3,
    complexity: 3,
    basePrice: 40,
    category: GoodCategory.Food,
    cultureTags: ['settlement_town', 'guild_merchants']
  },

  // Tools and equipment (Uncommon to Rare)
  {
    type: GoodsType.MetalGoods,
    title: 'Iron Tools',
    rarity: 3,
    complexity: 3,
    basePrice: 75,
    category: GoodCategory.Tool,
    cultureTags: ['settlement_town', 'guild_artisans']
  },
  {
    type: GoodsType.Machinery,
    title: 'Simple Machinery',
    rarity: 4,
    complexity: 4,
    basePrice: 200,
    category: GoodCategory.Tool,
    cultureTags: ['settlement_city', 'guild_artisans']
  },

  // Luxury items (Rare to Legendary)
  {
    type: GoodsType.Gemstones,
    title: 'Precious Gemstones',
    rarity: 4,
    complexity: 4,
    basePrice: 500,
    category: GoodCategory.Luxury,
    cultureTags: ['settlement_city', 'guild_merchants']
  },
  {
    type: GoodsType.Spices,
    title: 'Exotic Spices',
    rarity: 3,
    complexity: 3,
    basePrice: 80,
    category: GoodCategory.Luxury,
    cultureTags: ['biome_desert', 'guild_merchants']
  },

  // Knowledge items (Rare)
  {
    type: GoodsType.Paper,
    title: 'Paper',
    rarity: 2,
    complexity: 2,
    basePrice: 20,
    category: GoodCategory.Knowledge,
    cultureTags: ['settlement_city', 'guild_scholars']
  },

  // Energy items (Various)
  {
    type: GoodsType.Coal,
    title: 'Coal',
    rarity: 2,
    complexity: 2,
    basePrice: 30,
    category: GoodCategory.Energy,
    cultureTags: ['biome_mountain', 'settlement_industrial']
  },

  // Artifacts (Legendary)
  {
    type: GoodsType.Aetherium,
    title: 'Aetherium Crystal',
    rarity: 5,
    complexity: 5,
    basePrice: 1000,
    category: GoodCategory.Artifact,
    cultureTags: ['settlement_city', 'guild_scholars']
  },

  // Additional test cases with potential validation issues
  {
    type: GoodsType.Cloth,
    title: 'Fine Cloth',
    rarity: 2,
    complexity: 4, // Mismatch: Uncommon rarity but high complexity
    basePrice: 45,
    category: GoodCategory.Material,
    cultureTags: ['settlement_town', 'guild_artisans']
  },
  {
    type: GoodsType.Wine,
    title: 'Ancient Wine',
    rarity: 4,
    complexity: 2, // Mismatch: Exotic rarity but low complexity
    basePrice: 150,
    category: GoodCategory.Food,
    cultureTags: ['settlement_village', 'guild_merchants']
  }
];

/**
 * Expected test results for validation
 */
export const EXPECTED_TEST_RESULTS = {
  totalGoods: 14,
  
  tierBreakdown: [
    { tier: 1, count: 3, percentage: 21.43 },
    { tier: 2, count: 4, percentage: 28.57 },
    { tier: 3, count: 4, percentage: 28.57 },
    { tier: 4, count: 2, percentage: 14.29 },
    { tier: 5, count: 1, percentage: 7.14 }
  ] as TierBreakdown[],

  rarityBreakdown: [
    { rarity: Rarity.Common, count: 3, percentage: 21.43 },
    { rarity: Rarity.Uncommon, count: 4, percentage: 28.57 },
    { rarity: Rarity.Rare, count: 4, percentage: 28.57 },
    { rarity: Rarity.Exotic, count: 2, percentage: 14.29 },
    { rarity: Rarity.Legendary, count: 1, percentage: 7.14 }
  ] as RarityBreakdown[],

  categoryBreakdown: [
    { category: GoodCategory.RawMaterial, count: 3, percentage: 21.43 },
    { category: GoodCategory.Food, count: 3, percentage: 21.43 },
    { category: GoodCategory.Tool, count: 2, percentage: 14.29 },
    { category: GoodCategory.Luxury, count: 2, percentage: 14.29 },
    { category: GoodCategory.Material, count: 1, percentage: 7.14 },
    { category: GoodCategory.Knowledge, count: 1, percentage: 7.14 },
    { category: GoodCategory.Energy, count: 1, percentage: 7.14 },
    { category: GoodCategory.Artifact, count: 1, percentage: 7.14 }
  ] as CategoryBreakdown[],

  validationWarnings: [
    {
      type: 'rarity_mismatch' as const,
      severity: 'warning' as const,
      message: 'Good "Fine Cloth" has rarity Uncommon but tier 4 (expected 2-3)',
      affectedGoods: [GoodsType.Cloth],
      suggestedFix: 'Adjust complexity to 3 or update rarity to match tier 4'
    },
    {
      type: 'rarity_mismatch' as const,
      severity: 'warning' as const,
      message: 'Good "Ancient Wine" has rarity Exotic but tier 2 (expected 4-5)',
      affectedGoods: [GoodsType.Wine],
      suggestedFix: 'Adjust complexity to 4 or update rarity to match tier 2'
    }
  ] as ValidationWarning[]
};

/**
 * Custom rarity-tier mapping for testing different configurations
 */
export const CUSTOM_RARITY_TIER_MAPPING: RarityTierMapping[] = [
  { rarity: Rarity.Common, expectedTierRange: [1, 1], confidence: 1.0 },
  { rarity: Rarity.Uncommon, expectedTierRange: [2, 2], confidence: 1.0 },
  { rarity: Rarity.Rare, expectedTierRange: [3, 3], confidence: 1.0 },
  { rarity: Rarity.Exotic, expectedTierRange: [4, 4], confidence: 1.0 },
  { rarity: Rarity.Legendary, expectedTierRange: [5, 5], confidence: 1.0 },
];

/**
 * Alternative culture groups for testing
 */
export const ALTERNATIVE_CULTURE_GROUPS = {
  'biome_forest': 'Woodland Cultures',
  'biome_mountain': 'Highland Cultures',
  'biome_plains': 'Plains Cultures',
  'biome_desert': 'Desert Cultures',
  'settlement_hamlet': 'Rural Communities',
  'settlement_village': 'Village Societies',
  'settlement_town': 'Town Communities',
  'settlement_city': 'Urban Centers',
  'settlement_industrial': 'Industrial Societies',
  'guild_artisans': 'Craft Guilds',
  'guild_merchants': 'Trade Guilds',
  'guild_scholars': 'Academic Guilds'
};

/**
 * Edge case test data
 */
export const EDGE_CASE_FIXTURES = {
  emptyArray: [] as ManagedGood[],
  
  singleItem: [
    {
      type: GoodsType.Wood,
      title: 'Single Wood',
      rarity: 1,
      complexity: 1,
      basePrice: 10,
      category: GoodCategory.RawMaterial
    }
  ] as ManagedGood[],
  
  duplicateTypes: [
    {
      type: GoodsType.Wood,
      title: 'Wood A',
      rarity: 1,
      complexity: 1,
      basePrice: 10,
      category: GoodCategory.RawMaterial
    },
    {
      type: GoodsType.Wood,
      title: 'Wood B',
      rarity: 1,
      complexity: 1,
      basePrice: 10,
      category: GoodCategory.RawMaterial
    }
  ] as ManagedGood[],
  
  invalidData: [
    {
      type: GoodsType.Wood,
      title: '', // Invalid: empty title
      rarity: 6, // Invalid: out of range
      complexity: 0, // Invalid: out of range
      basePrice: -5, // Invalid: negative price
      category: '' as any // Invalid: empty category
    }
  ] as ManagedGood[],
  
  allSameRarity: Array.from({ length: 5 }, (_, i) => ({
    type: [GoodsType.Wood, GoodsType.Brick, GoodsType.Clay, GoodsType.Coal, GoodsType.Copper][i] as GoodsType,
    title: `Test Good ${i}`,
    rarity: 3,
    complexity: Math.floor(i / 2) + 1,
    basePrice: 50,
    category: GoodCategory.Tool
  })) as ManagedGood[]
};

/**
 * Test utility functions
 */
export class GoodsDerivedStatsTestUtils {
  
  /**
   * Validate that computed stats match expected results within tolerance
   */
  static validateStatsComputed(
    actual: GoodsDerivedStats, 
    expected: typeof EXPECTED_TEST_RESULTS,
    tolerance: number = 0.01
  ): { valid: boolean; errors: string[] } {
    
    const errors: string[] = [];
    
    // Check total goods
    if (actual.totalGoods !== expected.totalGoods) {
      errors.push(`Expected ${expected.totalGoods} total goods, got ${actual.totalGoods}`);
    }
    
    // Check tier breakdown
    if (actual.tierBreakdown.length !== expected.tierBreakdown.length) {
      errors.push(`Expected ${expected.tierBreakdown.length} tier entries, got ${actual.tierBreakdown.length}`);
    } else {
      actual.tierBreakdown.forEach((tier, index) => {
        const expectedTier = expected.tierBreakdown[index];
        if (Math.abs(tier.count - expectedTier.count) > tolerance ||
            Math.abs(tier.percentage - expectedTier.percentage) > tolerance) {
          errors.push(`Tier ${tier.tier}: expected count ${expectedTier.count}, got ${tier.count}`);
        }
      });
    }
    
    // Check validation warnings
    const expectedWarningCount = expected.validationWarnings.length;
    const actualWarningCount = actual.validationWarnings.filter(w => w.severity === 'warning').length;
    
    if (actualWarningCount !== expectedWarningCount) {
      errors.push(`Expected ${expectedWarningCount} validation warnings, got ${actualWarningCount}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Create a deterministic test scenario
   */
  static createDeterministicTestData(): ManagedGood[] {
    // Create test data that will always sort the same way
    const testGoods: ManagedGood[] = [
      {
        type: GoodsType.Zephyrite, // Will sort last
        title: 'Zephyrite Good',
        rarity: 5,
        complexity: 5,
        basePrice: 999,
        category: GoodCategory.Artifact,
        cultureTags: ['test_culture']
      },
      {
        type: GoodsType.Aluminium, // Will sort first
        title: 'AAA Good',
        rarity: 1,
        complexity: 1,
        basePrice: 1,
        category: GoodCategory.RawMaterial,
        cultureTags: ['test_culture']
      }
    ];
    
    return testGoods.sort((a, b) => {
      const typeCompare = a.type.localeCompare(b.type);
      if (typeCompare !== 0) return typeCompare;
      const titleCompare = a.title.localeCompare(b.title);
      if (titleCompare !== 0) return titleCompare;
      return a.rarity - b.rarity;
    });
  }
  
  /**
   * Test deterministic ordering preservation
   */
  static testDeterministicOrdering(goods: ManagedGood[]): boolean {
    const service = new (require('../services/goods-derived-stats.service').GoodsDerivedStatsService)();
    
    // Run computation multiple times
    const results = Array.from({ length: 5 }, () => 
      service.computeDerivedStats(goods)
    );
    
    // Check that input order is preserved
    const firstInputOrder = results[0].metadata.inputOrder;
    
    return results.every(result => 
      JSON.stringify(result.metadata.inputOrder) === JSON.stringify(firstInputOrder)
    );
  }
  
  /**
   * Generate performance test data
   */
  static generatePerformanceTestData(count: number): ManagedGood[] {
    const goodsTypes = Object.values(GoodsType);
    const categories = Object.values(GoodCategory);
    const cultureTags = ['biome_forest', 'biome_plains', 'settlement_village', 'guild_artisans'];
    
    return Array.from({ length: count }, (_, i) => ({
      type: goodsTypes[i % goodsTypes.length],
      title: `Performance Test Good ${i}`,
      rarity: (i % 5) + 1,
      complexity: (i % 5) + 1,
      basePrice: (i % 100) + 10,
      category: categories[i % categories.length],
      cultureTags: [cultureTags[i % cultureTags.length]]
    }));
  }
}

/**
 * Integration test scenarios
 */
export const INTEGRATION_TEST_SCENARIOS = {
  /**
   * Test integration with existing goods manager data
   */
  goodsManagerIntegration: {
    description: 'Tests integration with existing goods manager view service data',
    data: SAMPLE_GOODS_FIXTURES,
    expectedIntegration: {
      tierBreakdownMatches: true,
      rarityBreakdownMatches: true,
      validationWarningsGenerated: true
    }
  },
  
  /**
   * Test culture-specific aggregation
   */
  cultureAggregation: {
    description: 'Tests per-culture aggregate calculations',
    data: SAMPLE_GOODS_FIXTURES.filter(g => g.cultureTags && g.cultureTags.length > 0),
    expectedCultureGroups: [
      'Forest Cultures',
      'Highland Cultures', 
      'Plains Cultures',
      'Rural Communities',
      'Village Societies',
      'Town Communities',
      'Urban Centers',
      'Craft Guilds',
      'Trade Guilds',
      'Academic Guilds'
    ]
  },
  
  /**
   * Test custom configuration scenarios
   */
  customConfiguration: {
    description: 'Tests custom rarity-tier mapping and culture grouping',
    data: SAMPLE_GOODS_FIXTURES,
    customMapping: CUSTOM_RARITY_TIER_MAPPING,
    customCultureGroups: ALTERNATIVE_CULTURE_GROUPS,
    expectedBehavior: 'Should generate more validation warnings with strict mapping'
  }
};