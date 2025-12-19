import { GoodsType } from '../../enums/GoodsType';
import { GoodsIconRegistryService, GoodsIconDefinition, GoodsIconValidationIssue } from '../../services/goods-icon-registry.service';
import { GoodCategory, Era } from '../../models/goods.model';

/**
 * Test Fixtures for Goods Icon Registry Service
 * 
 * These fixtures provide test data for validating the goods icon registry
 * functionality including validation, filtering, and data consistency.
 */

export class GoodsIconRegistryFixtures {

  /**
   * Sample icon definitions for testing
   */
  static readonly sampleIcons: GoodsIconDefinition[] = [
    {
      type: GoodsType.Wood,
      label: 'Wood',
      iconId: 'goods_wood_marble',
      spritePath: 'assets/goods/goods_wood_marble@64-32.png',
      gridSize: 64,
      padding: 4,
      stroke: 2,
      era: Era.Marble,
      category: GoodCategory.RawMaterial,
      status: 'complete',
      resolution: '64-32',
      contrast: 'dual',
      notes: ['Wooden plank texture with grain details', '64x32 resolution maintains retro pixel aesthetic']
    },
    {
      type: GoodsType.Brick,
      label: 'Brick',
      iconId: 'goods_brick_marble',
      spritePath: '', // Empty path for testing
      gridSize: 64,
      padding: 4,
      stroke: 2,
      era: Era.Marble,
      category: GoodCategory.RawMaterial,
      status: 'placeholder',
      resolution: '64-32',
      contrast: 'dual',
      notes: ['Classic red brick pattern with mortar lines']
    },
    {
      type: GoodsType.Iron,
      label: 'Iron',
      iconId: 'goods_iron_ironbound',
      spritePath: 'assets/goods/goods_iron_ironbound@64-32.png',
      gridSize: 64,
      padding: 4,
      stroke: 2,
      era: Era.Ironbound,
      category: GoodCategory.RawMaterial,
      status: 'complete',
      resolution: '64-32',
      contrast: 'dual',
      notes: ['Ingot shape with metallic sheen', 'Dark gray base with silver highlights']
    },
    {
      type: GoodsType.Electronics,
      label: 'Electronics',
      iconId: 'goods_electronics_modern',
      spritePath: '', // Missing for testing
      gridSize: 64,
      padding: 4,
      stroke: 2,
      era: Era.Modern,
      category: GoodCategory.Tool,
      status: 'missing',
      resolution: '64-32',
      contrast: 'single',
      notes: ['Electronic components or circuit boards']
    },
    {
      type: GoodsType.Aetherium,
      label: 'Aetherium Crystal',
      iconId: 'goods_aetherium_ethereal',
      spritePath: 'assets/goods/goods_aetherium_ethereal@64-32.png',
      gridSize: 64,
      padding: 4,
      stroke: 2,
      era: Era.Ethereal,
      category: GoodCategory.ExoticMaterial,
      status: 'complete',
      resolution: '64-32',
      contrast: 'dual',
      notes: ['Pure aether crystals or magical energy', 'Glowing purple-blue appearance']
    }
  ];

  /**
   * Sample validation issues for testing
   */
  static readonly sampleValidationIssues: GoodsIconValidationIssue[] = [
    {
      kind: 'placeholder',
      message: 'Placeholder icons for: Brick, Hemp, Wool. Art assets needed but exports are not blocked.',
      affectedTypes: [GoodsType.Brick, GoodsType.Hemp, GoodsType.Wool],
      suggestedFix: 'Source or create icon assets to replace placeholders'
    },
    {
      kind: 'empty-sprite-path',
      message: 'Empty sprite paths for: Brick, Hemp, Wool. Will fall back to placeholder rendering.',
      affectedTypes: [GoodsType.Brick, GoodsType.Hemp, GoodsType.Wool],
      suggestedFix: 'Populate spritePath field with valid asset references'
    },
    {
      kind: 'missing-icon',
      message: 'Missing icons for goods: Electronics, PlasmaGel, Chemicals. Create art assets before production use.',
      affectedTypes: [GoodsType.Electronics, GoodsType.PlasmaGel, GoodsType.Chemicals],
      suggestedFix: 'Assign actual sprite paths to replace placeholder entries'
    }
  ];

  /**
   * Create a test registry service instance with sample data
   */
  static createTestRegistry(): GoodsIconRegistryService {
    // Create a mock registry for testing
    const mockRegistry = new GoodsIconRegistryService();
    
    // Override the registry with test data
    (mockRegistry as any).registry = this.sampleIcons;
    
    return mockRegistry;
  }

  /**
   * Generate a large dataset for performance testing
   */
  static generatePerformanceTestData(count: number): GoodsIconDefinition[] {
    const testData: GoodsIconDefinition[] = [];
    const goodsTypes = Object.values(GoodsType);
    const categories = Object.values(GoodCategory);
    const eras = Object.values(Era);
    
    for (let i = 0; i < count; i++) {
      const type = goodsTypes[i % goodsTypes.length];
      const category = categories[i % categories.length];
      const era = eras[i % eras.length];
      const status = i % 3 === 0 ? 'complete' : i % 3 === 1 ? 'placeholder' : 'missing';
      
      testData.push({
        type,
        label: this.toLabel(type),
        iconId: `goods_${type.toLowerCase()}_${era.toLowerCase()}`,
        spritePath: status === 'complete' ? `assets/goods/goods_${type.toLowerCase()}_${era.toLowerCase()}@64-32.png` : '',
        gridSize: 64,
        padding: 4,
        stroke: 2,
        era,
        category,
        status: status as 'complete' | 'placeholder' | 'missing',
        resolution: '64-32',
        contrast: 'dual',
        notes: [`Test icon for ${type} in ${era} era`]
      });
    }
    
    return testData;
  }

  /**
   * Test data for filtering functionality
   */
  static readonly filterTestCases = [
    {
      name: 'Filter by RawMaterial category',
      filter: { category: GoodCategory.RawMaterial, status: 'all', era: 'all', searchText: '' },
      expectedCount: 2, // Wood, Iron
      description: 'Should return only raw material icons'
    },
    {
      name: 'Filter by complete status',
      filter: { category: 'all' as any, status: 'complete', era: 'all', searchText: '' },
      expectedCount: 2, // Wood, Iron, Aetherium
      description: 'Should return only complete icons'
    },
    {
      name: 'Filter by Marble era',
      filter: { category: 'all' as any, status: 'all', era: Era.Marble, searchText: '' },
      expectedCount: 2, // Wood, Brick
      description: 'Should return only Marble era icons'
    },
    {
      name: 'Filter by search text "wood"',
      filter: { category: 'all' as any, status: 'all', era: 'all', searchText: 'wood' },
      expectedCount: 1, // Wood
      description: 'Should return icons matching search text'
    },
    {
      name: 'Filter by search text "iron"',
      filter: { category: 'all' as any, status: 'all', era: 'all', searchText: 'iron' },
      expectedCount: 1, // Iron
      description: 'Should return icons matching search text case-insensitive'
    }
  ];

  /**
   * Test cases for validation functionality
   */
  static readonly validationTestCases = [
    {
      name: 'Valid registry - no issues',
      icons: [
        {
          type: GoodsType.Wood,
          label: 'Wood',
          iconId: 'goods_wood_marble',
          spritePath: 'assets/goods/goods_wood_marble@64-32.png',
          gridSize: 64,
          padding: 4,
          stroke: 2,
          era: Era.Marble,
          category: GoodCategory.RawMaterial,
          status: 'complete',
          resolution: '64-32',
          contrast: 'dual'
        }
      ],
      expectedIssueCount: 0,
      description: 'Registry with complete icons should have no validation issues'
    },
    {
      name: 'Registry with placeholders',
      icons: this.sampleIcons,
      expectedIssueCount: 3, // placeholder, empty-sprite-path, missing-icon
      description: 'Registry with placeholder icons should report appropriate issues'
    },
    {
      name: 'Registry with duplicates',
      icons: [
        {
          type: GoodsType.Wood,
          label: 'Wood',
          iconId: 'duplicate_id',
          spritePath: 'assets/goods/goods_wood_marble@64-32.png',
          gridSize: 64,
          padding: 4,
          stroke: 2,
          era: Era.Marble,
          category: GoodCategory.RawMaterial,
          status: 'complete',
          resolution: '64-32',
          contrast: 'dual'
        },
        {
          type: GoodsType.Brick,
          label: 'Brick',
          iconId: 'duplicate_id', // Duplicate ID
          spritePath: 'assets/goods/goods_brick_marble@64-32.png',
          gridSize: 64,
          padding: 4,
          stroke: 2,
          era: Era.Marble,
          category: GoodCategory.RawMaterial,
          status: 'complete',
          resolution: '64-32',
          contrast: 'dual'
        }
      ],
      expectedIssueCount: 1, // duplicate-icon
      description: 'Registry with duplicate icon IDs should report duplicate issue'
    }
  ];

  /**
   * Utility method to convert GoodsType to label
   */
  private static toLabel(type: GoodsType): string {
    return type
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toLowerCase()
      .split('_')
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }

  /**
   * Test statistics calculation
   */
  static readonly statisticsTestCases = [
    {
      name: 'Mixed status icons',
      icons: this.sampleIcons,
      expectedStats: {
        total: 5,
        complete: 2,
        placeholder: 1,
        missing: 1
      },
      description: 'Should correctly calculate statistics for mixed status icons'
    },
    {
      name: 'All complete icons',
      icons: this.sampleIcons.map(icon => ({ ...icon, status: 'complete' as const })),
      expectedStats: {
        total: 5,
        complete: 5,
        placeholder: 0,
        missing: 0
      },
      description: 'Should correctly calculate statistics for all complete icons'
    },
    {
      name: 'All placeholder icons',
      icons: this.sampleIcons.map(icon => ({ ...icon, status: 'placeholder' as const })),
      expectedStats: {
        total: 5,
        complete: 0,
        placeholder: 5,
        missing: 0
      },
      description: 'Should correctly calculate statistics for all placeholder icons'
    }
  ];

  /**
   * Export validation report test cases
   */
  static readonly exportReportTestCases = [
    {
      name: 'Empty issues report',
      issues: [],
      expectedContains: ['No validation issues found'],
      description: 'Should generate clean report when no issues exist'
    },
    {
      name: 'Issues report with problems',
      issues: this.sampleValidationIssues,
      expectedContains: [
        'Issues Found: 3',
        'PLACEHOLDER',
        'missing-icon',
        'suggestedFix'
      ],
      expectedNotContains: ['No validation issues found'],
      description: 'Should generate detailed report when issues exist'
    }
  ];
}

/**
 * Test helper functions for component testing
 */
export class GoodsIconReviewTestHelpers {

  /**
   * Create mock component state for testing
   */
  static createMockComponentState() {
    return {
      allIcons: GoodsIconRegistryFixtures.sampleIcons,
      filteredIcons: GoodsIconRegistryFixtures.sampleIcons,
      validationIssues: GoodsIconRegistryFixtures.sampleValidationIssues,
      categories: ['all', ...Array.from(new Set(GoodsIconRegistryFixtures.sampleIcons.map(icon => icon.category)))],
      eras: ['all', ...Array.from(new Set(GoodsIconRegistryFixtures.sampleIcons.map(icon => icon.era)))],
      filters: {
        category: 'all' as any,
        status: 'all',
        era: 'all',
        searchText: ''
      },
      stats: {
        total: 5,
        complete: 2,
        placeholder: 1,
        missing: 1,
        byCategory: new Map([
          [GoodCategory.RawMaterial, 2],
          [GoodCategory.Tool, 1],
          [GoodCategory.ExoticMaterial, 1]
        ]),
        byEra: new Map([
          [Era.Marble, 2],
          [Era.Ironbound, 1],
          [Era.Modern, 1],
          [Era.Ethereal, 1]
        ])
      }
    };
  }

  /**
   * Generate test filter combinations
   */
  static generateFilterCombinations() {
    const categories = ['all', ...Object.values(GoodCategory)];
    const statuses = ['all', 'complete', 'placeholder', 'missing'];
    const eras = ['all', ...Object.values(Era)];
    const searchTexts = ['', 'wood', 'iron', 'electronics', 'crystal'];
    
    const combinations = [];
    
    for (const category of categories) {
      for (const status of statuses) {
        for (const era of eras) {
          for (const searchText of searchTexts) {
            combinations.push({
              category,
              status,
              era,
              searchText,
              name: `Filter: ${category}/${status}/${era}/${searchText || 'empty'}`
            });
          }
        }
      }
    }
    
    return combinations;
  }
}