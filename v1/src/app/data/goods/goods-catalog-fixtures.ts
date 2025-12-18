import { GoodsType } from '../../enums/GoodsType';
import { FloraType } from '../../enums/FloraType';
import { UnitType } from '../../models/goods.model';
import { ManagedGood } from '../../services/goods-catalog-io.service';

/**
 * Valid goods catalog fixtures for testing import/export functionality
 */
export const VALID_GOODS_CATALOG_FIXTURES: ManagedGood[] = [
  {
    type: GoodsType.Wood,
    name: 'Timber',
    category: 'RawMaterial',
    description: 'Basic construction material from forest trees.',
    tags: ['construction', 'basic', 'renewable'],
    rarity: 1,
    complexity: 1,
    basePrice: 50,
    floraSources: [FloraType.Oak, FloraType.Pine, FloraType.ForestOak],
    tier: 1,
    unitType: UnitType.Weight,
    components: []
  },
  {
    type: GoodsType.Iron,
    name: 'Iron Ingots',
    category: 'RawMaterial',
    description: 'Refined iron for tools and construction.',
    tags: ['metal', 'refined', 'construction'],
    rarity: 2,
    complexity: 2,
    basePrice: 150,
    floraSources: [FloraType.RockBarley],
    tier: 2,
    unitType: UnitType.Weight,
    components: []
  },
  {
    type: GoodsType.Beer,
    name: 'Ale',
    category: 'Food',
    description: 'Fermented grain beverage, staple of trade.',
    tags: ['beverage', 'agricultural', 'trade'],
    rarity: 2,
    complexity: 3,
    basePrice: 75,
    floraSources: [FloraType.RockBarley, FloraType.RyeGrass],
    tier: 2,
    unitType: UnitType.Volume,
    components: [
      { type: GoodsType.Grain, amount: 6 },
      { type: GoodsType.Honey, amount: 2 }
    ]
  },
  {
    type: GoodsType.MetalGoods,
    name: 'Tools',
    category: 'Tool',
    description: 'Crafted metal tools for various trades.',
    tags: ['tools', 'crafting', 'durable'],
    rarity: 3,
    complexity: 4,
    basePrice: 200,
    floraSources: [],
    tier: 3,
    unitType: UnitType.Count,
    components: [
      { type: GoodsType.Iron, amount: 3 },
      { type: GoodsType.Wood, amount: 1 }
    ]
  },
  {
    type: GoodsType.Spices,
    name: 'Exotic Spices',
    category: 'Luxury',
    description: 'Rare flavorings from distant lands.',
    tags: ['luxury', 'imported', 'rare'],
    rarity: 4,
    complexity: 4,
    basePrice: 500,
    floraSources: [FloraType.CoffeePlant, FloraType.CocoaTree, FloraType.Heliconia],
    tier: 4,
    unitType: UnitType.Weight,
    components: []
  }
];

/**
 * Invalid goods catalog fixtures for testing error handling
 */
export const INVALID_GOODS_CATALOG_FIXTURES = [
  // Missing required fields
  {
    name: 'Incomplete Good',
    category: 'RawMaterial'
    // Missing: type, description, rarity, complexity, basePrice
  },
  
  // Invalid enum values
  {
    type: 'INVALID_TYPE',
    name: 'Bad Type',
    category: 'RawMaterial',
    description: 'This should fail validation',
    rarity: 1,
    complexity: 1,
    basePrice: 50
  },
  
  // Out of bounds numeric values
  {
    type: GoodsType.Wood,
    name: 'Invalid Numbers',
    category: 'RawMaterial',
    description: 'Numeric bounds violation',
    rarity: 10, // Should be 1-5
    complexity: 0, // Should be 1-5
    basePrice: -10 // Should be >= 0
  },
  
  // Invalid string lengths
  {
    type: GoodsType.Wood,
    name: '', // Too short
    category: 'RawMaterial',
    description: 'A'.repeat(600), // Too long (>500 chars)
    rarity: 1,
    complexity: 1,
    basePrice: 50
  },
  
  // Invalid array items
  {
    type: GoodsType.Wood,
    name: 'Bad Array',
    category: 'RawMaterial',
    description: 'Invalid array content',
    rarity: 1,
    complexity: 1,
    basePrice: 50,
    tags: ['valid', 123, null], // Invalid item types
    floraSources: ['INVALID_FLORA'] // Invalid enum value
  },
  
  // Invalid component structure
  {
    type: GoodsType.Beer,
    name: 'Bad Components',
    category: 'Food',
    description: 'Invalid component array',
    rarity: 1,
    complexity: 1,
    basePrice: 50,
    components: [
      { type: 'INVALID_GOOD', amount: 5 }, // Invalid GoodsType
      { type: GoodsType.Grain }, // Missing amount
      { type: GoodsType.Honey, amount: -1 } // Negative amount
    ]
  }
];

/**
 * Sample import payloads for testing
 */
export const SAMPLE_IMPORT_PAYLOADS = {
  // Valid array format
  validArray: JSON.stringify(VALID_GOODS_CATALOG_FIXTURES, null, 2),
  
  // Valid object with goods property
  validObject: JSON.stringify({
    version: '1.0.0',
    exportedAt: '2025-12-18T21:42:00.000Z',
    goods: VALID_GOODS_CATALOG_FIXTURES,
    metadata: {
      totalItems: VALID_GOODS_CATALOG_FIXTURES.length,
      categories: ['RawMaterial', 'Food', 'Tool', 'Luxury']
    }
  }, null, 2),
  
  // Invalid JSON
  invalidJson: '{ invalid json syntax',
  
  // Mixed valid/invalid items
  mixedValidity: JSON.stringify([
    VALID_GOODS_CATALOG_FIXTURES[0], // Valid
    INVALID_GOODS_CATALOG_FIXTURES[1], // Invalid type
    VALID_GOODS_CATALOG_FIXTURES[2], // Valid
    INVALID_GOODS_CATALOG_FIXTURES[2], // Invalid numbers
  ], null, 2),
  
  // Empty array
  emptyArray: '[]',
  
  // Wrong structure
  wrongStructure: JSON.stringify({
    items: VALID_GOODS_CATALOG_FIXTURES // Should be 'goods'
  }, null, 2)
};

/**
 * Helper function to create test goods with specific issues
 */
export function createTestGood(overrides: Partial<ManagedGood> & { invalidType?: string }): ManagedGood {
  const baseGood: ManagedGood = {
    type: GoodsType.Wood,
    name: 'Test Good',
    category: 'RawMaterial',
    description: 'A test good for validation testing.',
    tags: ['test'],
    rarity: 1,
    complexity: 1,
    basePrice: 50,
    components: []
  };
  
  return { ...baseGood, ...overrides };
}

/**
 * Expected validation issues for invalid fixtures
 */
export const EXPECTED_VALIDATION_ISSUES = {
  missingFields: [
    { code: 'MISSING_FIELD', path: 'goods[0].type' },
    { code: 'MISSING_FIELD', path: 'goods[0].name' },
    { code: 'MISSING_FIELD', path: 'goods[0].description' },
    { code: 'MISSING_FIELD', path: 'goods[0].rarity' },
    { code: 'MISSING_FIELD', path: 'goods[0].complexity' },
    { code: 'MISSING_FIELD', path: 'goods[0].basePrice' }
  ],
  
  invalidEnum: [
    { code: 'INVALID_ENUM_VALUE', path: 'goods[0].type' }
  ],
  
  outOfBounds: [
    { code: 'OUT_OF_BOUNDS', path: 'goods[0].rarity' },
    { code: 'OUT_OF_BOUNDS', path: 'goods[0].complexity' },
    { code: 'OUT_OF_BOUNDS', path: 'goods[0].basePrice' }
  ],
  
  invalidStrings: [
    { code: 'TOO_SHORT', path: 'goods[0].name' },
    { code: 'TOO_LONG', path: 'goods[0].description' }
  ],
  
  invalidArrays: [
    { code: 'INVALID_ARRAY_ITEM_TYPE', path: 'goods[0].tags[1]' },
    { code: 'INVALID_FLORA_TYPE', path: 'goods[0].floraSources[0]' }
  ],
  
  invalidComponents: [
    { code: 'INVALID_COMPONENT_TYPE', path: 'goods[0].components[0].type' },
    { code: 'MISSING_FIELD', path: 'goods[0].components[1].amount' },
    { code: 'INVALID_COMPONENT_AMOUNT', path: 'goods[0].components[2].amount' }
  ]
};