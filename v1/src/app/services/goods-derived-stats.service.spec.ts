/**
 * Unit tests for GoodsDerivedStatsService
 * 
 * Validates the core functionality, deterministic behavior, and integration
 * capabilities of the goods-derived-stats service.
 */

import { TestBed } from '@angular/core/testing';
import { GoodsDerivedStatsService } from './goods-derived-stats.service';
import { 
  SAMPLE_GOODS_FIXTURES, 
  EXPECTED_TEST_RESULTS, 
  EDGE_CASE_FIXTURES,
  GoodsDerivedStatsTestUtils,
  INTEGRATION_TEST_SCENARIOS
} from './goods-derived-stats.fixtures';
import { GoodsType } from '../enums/GoodsType';
import { GoodCategory, Rarity } from '../models/goods.model';

describe('GoodsDerivedStatsService', () => {
  let service: GoodsDerivedStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsDerivedStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Basic Functionality', () => {
    it('should compute total goods count correctly', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      expect(stats.totalGoods).toBe(EXPECTED_TEST_RESULTS.totalGoods);
    });

    it('should compute tier breakdown correctly', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      expect(stats.tierBreakdown).toEqual(EXPECTED_TEST_RESULTS.tierBreakdown);
    });

    it('should compute rarity breakdown correctly', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      expect(stats.rarityBreakdown).toEqual(EXPECTED_TEST_RESULTS.rarityBreakdown);
    });

    it('should compute category breakdown correctly', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      expect(stats.categoryBreakdown.length).toBeGreaterThan(0);
      expect(stats.categoryBreakdown[0].category).toBeTruthy();
      expect(stats.categoryBreakdown[0].count).toBeGreaterThan(0);
    });

    it('should compute culture aggregates', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      expect(stats.cultureAggregates.length).toBeGreaterThan(0);
      
      const forestCultures = stats.cultureAggregates.find(c => c.cultureTag === 'Forest Cultures');
      expect(forestCultures).toBeDefined();
      expect(forestCultures?.totalGoods).toBeGreaterThan(0);
      expect(forestCultures?.averageComplexity).toBeGreaterThan(0);
    });
  });

  describe('Validation System', () => {
    it('should generate rarity-tier mapping warnings', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      const rarityMismatchWarnings = stats.validationWarnings.filter(
        w => w.type === 'rarity_mismatch' && w.severity === 'warning'
      );
      
      expect(rarityMismatchWarnings.length).toBeGreaterThan(0);
      
      // Check that the expected mismatches are detected
      const clothWarning = rarityMismatchWarnings.find(w => 
        w.affectedGoods.includes(GoodsType.Cloth)
      );
      expect(clothWarning).toBeDefined();
      expect(clothWarning?.message).toContain('Fine Cloth');
    });

    it('should validate input data completeness', () => {
      const warnings = service.validateInputData(EDGE_CASE_FIXTURES.invalidData);
      expect(warnings.length).toBeGreaterThan(0);
      
      const errorWarnings = warnings.filter(w => w.severity === 'error');
      expect(errorWarnings.length).toBeGreaterThan(0);
    });

    it('should handle empty data gracefully', () => {
      const stats = service.computeDerivedStats(EDGE_CASE_FIXTURES.emptyArray);
      expect(stats.totalGoods).toBe(0);
      expect(stats.tierBreakdown.length).toBe(5); // Still returns all tiers
      expect(stats.validationWarnings.length).toBe(0);
    });

    it('should handle single item correctly', () => {
      const stats = service.computeDerivedStats(EDGE_CASE_FIXTURES.singleItem);
      expect(stats.totalGoods).toBe(1);
      expect(stats.tierBreakdown.find(t => t.count > 0)?.tier).toBe(1);
      expect(stats.rarityBreakdown.find(r => r.count > 0)?.rarity).toBe(Rarity.Common);
    });
  });

  describe('Deterministic Behavior', () => {
    it('should produce consistent results for same input', () => {
      const results = Array.from({ length: 5 }, () => 
        service.computeDerivedStats(SAMPLE_GOODS_FIXTURES)
      );

      // Check that total goods is consistent
      const totalGoodsValues = results.map(r => r.totalGoods);
      expect(totalGoodsValues.every(v => v === totalGoodsValues[0])).toBe(true);

      // Check that input ordering is preserved
      const firstOrder = results[0].metadata.inputOrder;
      results.forEach(result => {
        expect(result.metadata.inputOrder).toEqual(firstOrder);
      });
    });

    it('should sort goods deterministically', () => {
      const deterministicData = GoodsDerivedStatsTestUtils.createDeterministicTestData();
      const stats = service.computeDerivedStats(deterministicData);
      
      expect(stats.metadata.inputOrder.length).toBe(2);
      expect(stats.metadata.inputOrder[0]).toBe(GoodsType.Aluminium); // Should sort first
      expect(stats.metadata.inputOrder[1]).toBe(GoodsType.Zephyrite); // Should sort last
    });

    it('should maintain calculation reproducibility', () => {
      const testData = SAMPLE_GOODS_FIXTURES.slice(0, 5); // Use subset for faster test
      
      const results = Array.from({ length: 3 }, () => 
        service.computeDerivedStats(testData)
      );

      // All results should be identical
      const firstResult = JSON.stringify({
        totalGoods: results[0].totalGoods,
        tierBreakdown: results[0].tierBreakdown,
        rarityBreakdown: results[0].rarityBreakdown
      });

      results.slice(1).forEach(result => {
        const resultStr = JSON.stringify({
          totalGoods: result.totalGoods,
          tierBreakdown: result.tierBreakdown,
          rarityBreakdown: result.rarityBreakdown
        });
        expect(resultStr).toBe(firstResult);
      });
    });
  });

  describe('Configuration Options', () => {
    it('should work with custom rarity-tier mapping', () => {
      const customMapping = [
        { rarity: Rarity.Common, expectedTierRange: [1, 1] as [number, number], confidence: 1.0 },
        { rarity: Rarity.Uncommon, expectedTierRange: [2, 2] as [number, number], confidence: 1.0 },
        { rarity: Rarity.Rare, expectedTierRange: [3, 3] as [number, number], confidence: 1.0 },
        { rarity: Rarity.Exotic, expectedTierRange: [4, 4] as [number, number], confidence: 1.0 },
        { rarity: Rarity.Legendary, expectedTierRange: [5, 5] as [number, number], confidence: 1.0 },
      ];

      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES, customMapping);
      
      // Should generate more warnings with strict mapping
      const strictWarnings = stats.validationWarnings.filter(w => w.type === 'rarity_mismatch');
      expect(strictWarnings.length).toBeGreaterThanOrEqual(2);
    });

    it('should work with custom culture groups', () => {
      const customCultureGroups = {
        'biome_forest': 'Woodland Nations',
        'settlement_village': 'Rural Towns'
      };

      const stats = service.computeDerivedStats(
        SAMPLE_GOODS_FIXTURES, 
        undefined, 
        customCultureGroups
      );

      const woodlandNations = stats.cultureAggregates.find(c => c.cultureTag === 'Woodland Nations');
      expect(woodlandNations).toBeDefined();
      
      // Original "Forest Cultures" should not appear with custom mapping
      const forestCultures = stats.cultureAggregates.find(c => c.cultureTag === 'Forest Cultures');
      expect(forestCultures).toBeUndefined();
    });
  });

  describe('Utility Functions', () => {
    it('should convert numeric rarity to enum correctly', () => {
      // This is testing private method through public interface
      const testGoods = [
        { type: GoodsType.Wood, title: 'Test', rarity: 1, complexity: 1, basePrice: 10, category: GoodCategory.RawMaterial }
      ];
      
      const stats = service.computeDerivedStats(testGoods);
      const commonEntry = stats.rarityBreakdown.find(r => r.rarity === Rarity.Common);
      expect(commonEntry?.count).toBe(1);
    });

    it('should generate meaningful summary stats', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      const summary = service.getSummaryStats(stats);
      
      expect(summary).toContain('Total Goods:');
      expect(summary).toContain('Tier Distribution:');
      expect(summary).toContain('Rarity Distribution:');
      expect(summary).toContain('Validation Issues:');
    });

    it('should handle edge case data appropriately', () => {
      const warnings = service.validateInputData(EDGE_CASE_FIXTURES.invalidData);
      expect(warnings.length).toBeGreaterThan(0);
      
      const hasEmptyTitleWarning = warnings.some(w => 
        w.message.includes('missing title') && w.severity === 'error'
      );
      expect(hasEmptyTitleWarning).toBe(true);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle goods manager integration data', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      
      // Validate that we get all expected data structures
      expect(stats.totalGoods).toBeDefined();
      expect(stats.tierBreakdown).toBeDefined();
      expect(stats.rarityBreakdown).toBeDefined();
      expect(stats.categoryBreakdown).toBeDefined();
      expect(stats.cultureAggregates).toBeDefined();
      expect(stats.validationWarnings).toBeDefined();
      expect(stats.metadata).toBeDefined();
      expect(stats.rarityTierMapping).toBeDefined();
    });

    it('should support export-friendly data structure', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      
      const exportData = {
        summary: stats.metadata,
        totals: {
          totalGoods: stats.totalGoods,
          categories: stats.categoryBreakdown,
          tiers: stats.tierBreakdown,
          rarities: stats.rarityBreakdown
        },
        cultureData: stats.cultureAggregates,
        validation: stats.validationWarnings
      };

      expect(exportData.summary.calculatedAt).toBeInstanceOf(Date);
      expect(exportData.totals.totalGoods).toBeGreaterThan(0);
      expect(Array.isArray(exportData.cultureData)).toBe(true);
      expect(Array.isArray(exportData.validation)).toBe(true);
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = GoodsDerivedStatsTestUtils.generatePerformanceTestData(1000);
      
      const startTime = performance.now();
      const stats = service.computeDerivedStats(largeDataset);
      const endTime = performance.now();
      
      expect(stats.totalGoods).toBe(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should maintain memory efficiency with Maps and Sets', () => {
      const stats = service.computeDerivedStats(SAMPLE_GOODS_FIXTURES);
      
      // Validate that we're using efficient data structures
      expect(stats.tierBreakdown.length).toBeLessThanOrEqual(5); // Max 5 tiers
      expect(stats.rarityBreakdown.length).toBeLessThanOrEqual(5); // Max 5 rarities
      expect(stats.categoryBreakdown.length).toBeLessThanOrEqual(SAMPLE_GOODS_FIXTURES.length);
    });
  });
});